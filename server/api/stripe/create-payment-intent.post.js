import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { amount, currency = 'myr', category, message, event_id, payment_method_id } = body;

    console.log('=== API ROUTE DEBUG START ===');
    console.log('Request body:', body);

    // Validate required fields
    if (!amount || amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid donation amount'
      });
    }

    const amountInMYR = parseFloat(amount);
    const amountInSen = Math.round(amountInMYR * 100);

    if (amountInSen < 50) { // Minimum 50 sen (RM0.50) for Stripe
      throw createError({
        statusCode: 400,
        statusMessage: 'Minimum donation amount is RM0.50'
      });
    }

    // Initialize Stripe FIRST - this is critical
    const config = useRuntimeConfig();
    const stripeSecretKey = config.stripeSecretKey || process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      console.error('❌ Stripe secret key not found');
      throw createError({
        statusCode: 500,
        statusMessage: 'Stripe configuration missing'
      });
    }
    
    const stripe = new Stripe(stripeSecretKey);
    console.log('✅ Stripe initialized');

    // Initialize Supabase
    let supabase;
    try {
      console.log('Trying serverSupabaseClient...');
      const { serverSupabaseClient } = await import('#supabase/server');
      supabase = await serverSupabaseClient(event);
      console.log('✅ Using serverSupabaseClient');
    } catch (error) {
      console.log('serverSupabaseClient not available, using createClient...');
      
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = config.public.supabaseUrl || process.env.SUPABASE_URL;
      const supabaseKey = config.supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Supabase configuration missing'
        });
      }
      
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log('✅ Using createClient method');
    }

    // Get user (if authenticated)
    let user = null;
    try {
      const { serverSupabaseUser } = await import('#supabase/server');
      user = await serverSupabaseUser(event);
      console.log('User:', user?.id || 'anonymous');
    } catch (userError) {
      console.log('No user authentication available');
    }

    // Prepare Payment Intent data
    const paymentIntentData = {
      amount: amountInSen,
      currency: 'myr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        donor_id: user?.id?.toString() || 'anonymous',
        category: category || 'general',
        type: 'onetime',
        amount_myr: amountInMYR.toString()
      },
      description: `Donation of RM${amountInMYR} to Jing Sun Welfare Society - ${category || 'General Fund'}`,
    };

    console.log(`Creating payment intent for RM${amountInMYR} (${amountInSen} sen)`);

    // Try immediate confirmation if payment method is provided
    let paymentIntent;
    let initialStatus = 'completed'; 
    let requiresAction = false;
    
    if (payment_method_id) {
      console.log('🔄 Attempting immediate confirmation with payment method:', payment_method_id);
      
      // Add payment method and confirmation to the payment intent
      paymentIntentData.payment_method = payment_method_id;
      paymentIntentData.confirm = true;
      
      // Add return URL for 3D Secure or other authentication methods
      const origin = getHeader(event, 'origin') || getHeader(event, 'host') || 'http://localhost:3000';
      paymentIntentData.return_url = `${origin}/donation-success`;
      
      try {
        paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
        
        console.log('✅ Payment intent created with status:', paymentIntent.status);
        
        // Map Stripe status to donation status
        switch (paymentIntent.status) {
          case 'succeeded':
            initialStatus = 'completed';
            console.log('🎉 Payment succeeded immediately!');
            break;
          case 'requires_action':
            initialStatus = 'pending';
            requiresAction = true;
            console.log('⚠️ Payment requires additional action (3D Secure, etc.)');
            break;
          case 'processing':
            initialStatus = 'processing';
            console.log('🔄 Payment is processing...');
            break;
          case 'requires_payment_method':
            initialStatus = 'failed';
            console.log('❌ Payment method was declined');
            break;
          case 'canceled':
            initialStatus = 'cancelled';
            console.log('❌ Payment was canceled');
            break;
          default:
            initialStatus = 'pending';
            console.log('❓ Unknown payment status:', paymentIntent.status);
        }
        
      } catch (confirmError) {
        console.log('⚠️ Immediate confirmation failed:', confirmError.message);
        console.log('Falling back to regular payment intent creation...');
        
        // Remove confirmation parameters and create regular payment intent
        delete paymentIntentData.payment_method;
        delete paymentIntentData.confirm;
        delete paymentIntentData.return_url;
        
        try {
          paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
          console.log('✅ Fallback payment intent created:', paymentIntent.id);
        } catch (fallbackError) {
          console.error('❌ Fallback payment intent creation failed:', fallbackError);
          throw createError({
            statusCode: 500,
            statusMessage: `Payment intent creation failed: ${fallbackError.message}`
          });
        }
      }
    } else {
      // No payment method provided, create regular payment intent
      console.log('💳 Creating regular payment intent (no payment method provided)');
      paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
      console.log('✅ Payment intent created:', paymentIntent.id);
    }

    // Create donation record with the determined status
    const donationRecord = {
      donor_id: user?.id || null,
      event_id: event_id || null,
      subscription_id: null,
      amount: amountInMYR,
      currency: 'myr',
      category: category || 'general',
      type: 'onetime',
      status: initialStatus, // Use the determined status instead of hardcoded 'pending'
      message: message || null,
      stripe_payment_intent_id: paymentIntent.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Inserting donation record with status:', initialStatus);
    console.log('Donation record:', donationRecord);

    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert(donationRecord)
      .select()
      .single();

    if (donationError) {
      console.error('❌ Database insert error:', donationError);
      
      // If database fails, try to cancel the payment intent (only if it's not succeeded)
      if (paymentIntent.status !== 'succeeded') {
        try {
          await stripe.paymentIntents.cancel(paymentIntent.id);
          console.log('✅ Payment intent cancelled due to database error');
        } catch (cancelError) {
          console.error('Failed to cancel payment intent:', cancelError);
        }
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: `Database insert failed: ${donationError.message}`
      });
    }

    console.log('✅ Donation record created:', donation.id);
    console.log('=== API ROUTE DEBUG END ===');

    // Return comprehensive response
    const response = {
      client_secret: paymentIntent.client_secret,
      donation_id: donation.id,
      amount: amountInMYR,
      currency: 'myr',
      status: initialStatus,
      payment_intent_id: paymentIntent.id,
      payment_intent_status: paymentIntent.status,
      requires_action: requiresAction,
      // Include next steps information
      next_action: paymentIntent.next_action || null
    };

    console.log('✅ Returning response:', response);
    return response;

  } catch (error) {
    console.error('❌ Full error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode
    });
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `API Error: ${error.message}`
    });
  }
})