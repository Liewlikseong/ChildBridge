import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { amount, currency = 'myr', category, message, event_id } = body;

    console.log('=== API ROUTE DEBUG START ===');
    console.log('Request body:', body);

    // Validate required fields
    if (!amount || amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid donation amount'
      });
    }

    // Method 1: Try using serverSupabaseClient (if you have @nuxtjs/supabase module)
    let supabase;
    try {
      console.log('Trying serverSupabaseClient...');
      const { serverSupabaseClient } = await import('#supabase/server');
      supabase = await serverSupabaseClient(event);
      console.log('✅ Using serverSupabaseClient');
    } catch (error) {
      console.log('serverSupabaseClient not available:', error.message);
      
      // Method 2: Try the same way other pages work
      try {
        console.log('Trying createClient method...');
        const { createClient } = await import('@supabase/supabase-js');
        
        // Check if env vars are accessible in this specific context
        const supabaseUrl = process.env.SUPABASE_URL || useRuntimeConfig().public.supabaseUrl;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || useRuntimeConfig().supabaseServiceKey;
        
        if (!supabaseUrl || !supabaseKey) {
          console.error('Environment variables not accessible in this API route');
          console.log('SUPABASE_URL available:', !!process.env.SUPABASE_URL);
          console.log('SERVICE_KEY available:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
          
          // Try runtime config
          try {
            const config = useRuntimeConfig();
            console.log('Runtime config supabaseUrl:', !!config.public?.supabaseUrl);
            console.log('Runtime config serviceKey:', !!config.supabaseServiceKey);
          } catch (configError) {
            console.log('Runtime config error:', configError.message);
          }
          
          throw new Error('Supabase configuration not accessible');
        }
        
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Using createClient method');
      } catch (createError) {
        console.error('Failed to create Supabase client:', createError);
        throw createError;
      }
    }

    // Test database connection with a simple query
    console.log('Testing database connection...');
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Database test query failed:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }
      
      console.log('✅ Database connection test passed');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      throw createError({
        statusCode: 500,
        statusMessage: `Database connection failed: ${dbError.message}`
      });
    }

    // Initialize Stripe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || useRuntimeConfig().stripeSecretKey;
    if (!stripeSecretKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Stripe configuration missing'
      });
    }
    
    const stripe = new Stripe(stripeSecretKey);
    console.log('✅ Stripe initialized');

    // Get user (if authenticated)
    let user = null;
    try {
      // If using @nuxtjs/supabase with serverSupabaseUser
      const { serverSupabaseUser } = await import('#supabase/server');
      user = await serverSupabaseUser(event);
      console.log('User from serverSupabaseUser:', user?.id || 'anonymous');
    } catch (userError) {
      console.log('No user authentication or not using @nuxtjs/supabase module');
    }

    // Create donation record
    const donationRecord = {
      donor_id: user?.id || null,
      event_id: event_id || null,
      subscription_id: null,
      amount: parseFloat(amount),
      currency: currency.toLowerCase(),
      category: category || 'general',
      type: 'onetime',
      status: 'pending',
      message: message || null,
    };

    console.log('Inserting donation record:', donationRecord);

    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert(donationRecord)
      .select()
      .single();

    if (donationError) {
      console.error('❌ Database insert error:', donationError);
      console.error('Error details:', {
        code: donationError.code,
        message: donationError.message,
        details: donationError.details,
        hint: donationError.hint
      });
      
      throw createError({
        statusCode: 500,
        statusMessage: `Database insert failed: ${donationError.message}`
      });
    }

    console.log('✅ Donation record created:', donation.id);

    // Create Stripe Payment Intent
    const amountInCents = Math.round(parseFloat(amount) * 100);
    const finalCurrency = currency.toLowerCase() === 'myr' ? 'myr' : 'usd';

    console.log(`Creating payment intent: ${amountInCents} ${finalCurrency}`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: finalCurrency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        donation_id: donation.id.toString(),
        donor_id: user?.id?.toString() || 'anonymous',
        category: category || 'general',
        type: 'onetime'
      },
      description: `Donation to Jing Sun Welfare Society - ${category || 'General Fund'}`,
    });

    console.log('✅ Payment intent created:', paymentIntent.id);

    // Update donation with payment intent ID
    const { error: updateError } = await supabase
      .from('donations')
      .update({ 
        stripe_payment_intent_id: paymentIntent.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', donation.id);

    if (updateError) {
      console.error('⚠️ Failed to update donation:', updateError);
    }

    console.log('=== API ROUTE DEBUG END ===');

    return {
      client_secret: paymentIntent.client_secret,
      donation_id: donation.id,
      amount: amount,
      currency: finalCurrency,
      status: 'created'
    };

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
});
