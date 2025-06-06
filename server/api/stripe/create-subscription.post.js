import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { amount, currency = 'myr', category, message, event_id } = body;

    console.log('=== SUBSCRIPTION API ROUTE DEBUG START ===');
    console.log('Request body:', body);

    // Validate required fields
    if (!amount || amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid donation amount'
      });
    }

    // Initialize Supabase client (same logic as payment intent)
    let supabase;
    try {
      console.log('Trying serverSupabaseClient...');
      const { serverSupabaseClient } = await import('#supabase/server');
      supabase = await serverSupabaseClient(event);
      console.log('✅ Using serverSupabaseClient');
    } catch (error) {
      console.log('serverSupabaseClient not available:', error.message);
      
      try {
        console.log('Trying createClient method...');
        const { createClient } = await import('@supabase/supabase-js');
        
        const supabaseUrl = process.env.SUPABASE_URL || useRuntimeConfig().public.supabaseUrl;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || useRuntimeConfig().supabaseServiceKey;
        
        if (!supabaseUrl || !supabaseKey) {
          console.error('Environment variables not accessible in this API route');
          throw new Error('Supabase configuration not accessible');
        }
        
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Using createClient method');
      } catch (createError) {
        console.error('Failed to create Supabase client:', createError);
        throw createError;
      }
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

    // Get user (same logic as payment intent)
    let user = null;
    try {
      const { serverSupabaseUser } = await import('#supabase/server');
      user = await serverSupabaseUser(event);
      console.log('User from serverSupabaseUser:', user?.id || 'anonymous');
    } catch (userError) {
      console.log('No user authentication or not using @nuxtjs/supabase module');
    }

    // Require authentication for subscriptions
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required for subscriptions'
      });
    }

    // Create or get Stripe customer
    let customer;
    const existingCustomer = await stripe.customers.list({
      email: user.email,
      limit: 1
    });

    if (existingCustomer.data.length > 0) {
      customer = existingCustomer.data[0];
      console.log('✅ Using existing Stripe customer:', customer.id);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name || user.email
      });
      console.log('✅ Created new Stripe customer:', customer.id);
    }

    // Create price for the subscription
    const price = await stripe.prices.create({
      unit_amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      recurring: { interval: 'month' },
      product_data: {
        name: `Monthly Donation - ${category || 'General'}`
      }
    });
    console.log('✅ Created Stripe price:', price.id);

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        donor_id: user.id,
        category: category || 'general',
        event_id: event_id || ''
      }
    });
    console.log('✅ Created Stripe subscription:', subscription.id);
    console.log('Subscription object:', {
      id: subscription.id,
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      latest_invoice: subscription.latest_invoice?.id,
      payment_intent: subscription.latest_invoice?.payment_intent?.id
    });

    // Get the client secret safely
    let clientSecret = null;
    if (subscription.latest_invoice?.payment_intent?.client_secret) {
      clientSecret = subscription.latest_invoice.payment_intent.client_secret;
      console.log('✅ Got client secret from subscription');
    } else {
      console.log('⚠️ No client secret in subscription, fetching invoice...');
      
      // If no client secret, try to get the invoice directly
      if (subscription.latest_invoice?.id) {
        try {
          const invoice = await stripe.invoices.retrieve(subscription.latest_invoice.id, {
            expand: ['payment_intent']
          });
          
          if (invoice.payment_intent?.client_secret) {
            clientSecret = invoice.payment_intent.client_secret;
            console.log('✅ Got client secret from invoice');
          }
        } catch (invoiceError) {
          console.error('Failed to retrieve invoice:', invoiceError);
        }
      }
      
      // If still no client secret, the subscription might not need immediate payment
      if (!clientSecret) {
        console.log('⚠️ No payment intent found - subscription might be in trial or different state');
      }
    }

    // Create subscription record in database
    // Handle date conversion safely
    let periodStart = null;
    let periodEnd = null;
    
    try {
      if (subscription.current_period_start) {
        periodStart = new Date(subscription.current_period_start * 1000).toISOString();
      }
      if (subscription.current_period_end) {
        periodEnd = new Date(subscription.current_period_end * 1000).toISOString();
      }
      console.log('Period dates:', { periodStart, periodEnd });
    } catch (dateError) {
      console.error('Date conversion error:', dateError);
      console.log('Raw period values:', {
        start: subscription.current_period_start,
        end: subscription.current_period_end
      });
    }

    const subscriptionRecord = {
      donor_id: user.id,
      event_id: event_id || null,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customer.id,
      amount: parseFloat(amount),
      currency: currency.toLowerCase(),
      interval_type: 'month',
      interval_count: 1,
      status: subscription.status,
      category: category || 'general',
      current_period_start: periodStart,
      current_period_end: periodEnd
    };

    console.log('Inserting subscription record:', subscriptionRecord);

    const { data: createdSubscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert(subscriptionRecord)
      .select()
      .single();

    if (subscriptionError) {
      console.error('❌ Subscription database insert error:', subscriptionError);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create subscription record: ${subscriptionError.message}`
      });
    }

    console.log('✅ Subscription record created:', createdSubscription.id);

    // Create initial donation record
    const donationRecord = {
      donor_id: user.id,
      event_id: event_id || null,
      subscription_id: createdSubscription.id,
      amount: parseFloat(amount),
      currency: currency.toLowerCase(),
      category: category || 'general',
      type: 'subscription',
      status: 'pending',
      message: message || null
    };

    console.log('Inserting donation record:', donationRecord);

    const { error: donationError } = await supabase
      .from('donations')
      .insert(donationRecord);

    if (donationError) {
      console.error('❌ Donation database insert error:', donationError);
      // Don't fail the whole process for this, just log it
      console.log('⚠️ Continuing despite donation record error');
    } else {
      console.log('✅ Initial donation record created');
    }

    console.log('=== SUBSCRIPTION API ROUTE DEBUG END ===');

    return {
      subscription_id: subscription.id,
      client_secret: clientSecret,
      customer_id: customer.id,
      status: subscription.status,
      requires_payment: !!clientSecret,
      subscription_status: subscription.status
    };

  } catch (error) {
    console.error('❌ Subscription creation error:', {
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
      statusMessage: `Subscription API Error: ${error.message}`
    });
  }
});