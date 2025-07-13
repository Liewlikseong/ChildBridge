import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { 
      amount, 
      currency = 'myr', 
      category, 
      message, 
      event_id, 
      payment_method_id,
      order_items = [],
      customer_info
    } = body;

    console.log('=== ENHANCED API ROUTE DEBUG START ===');
    console.log('Request body:', body);

    // Validate required fields
    if (!amount || amount <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid amount'
      });
    }

    if (!customer_info?.firstName || !customer_info?.lastName || !customer_info?.email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Customer information is required'
      });
    }

    const amountInMYR = parseFloat(amount);
    const amountInSen = Math.round(amountInMYR * 100);

    if (amountInSen < 50) { // Minimum 50 sen (RM0.50) for Stripe
      throw createError({
        statusCode: 400,
        statusMessage: 'Minimum amount is RM0.50'
      });
    }

    // Initialize Stripe
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
      const supabaseKey = config.supabaseServiceKey || process.env.SUPABASE_KEY;
      
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

    // Determine order type based on items
    const hasProducts = order_items.some(item => item.product_id);
    const hasDonations = order_items.some(item => !item.product_id);
    let orderType = 'donation';
    
    if (hasProducts && hasDonations) {
      orderType = 'mixed';
    } else if (hasProducts) {
      orderType = 'purchase';
    }

    // Create description based on order type and items
    let description = '';
    if (orderType === 'donation') {
      description = `Donation of RM${amountInMYR} to Jing Sun Welfare Society`;
    } else if (orderType === 'purchase') {
      const productNames = order_items
        .filter(item => item.product_id)
        .map(item => `${item.product_name} (x${item.quantity})`)
        .join(', ');
      description = `Purchase: ${productNames} - Total: RM${amountInMYR}`;
    } else {
      description = `Mixed order (products & donation) - Total: RM${amountInMYR}`;
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
        customer_email: customer_info.email,
        customer_name: `${customer_info.firstName} ${customer_info.lastName}`,
        category: category || 'general',
        type: 'onetime',
        order_type: orderType,
        event_id: event_id?.toString() || '',
        amount_myr: amountInMYR.toString(),
        total_items: order_items.length.toString()
      },
      description: description,
      receipt_email: customer_info.email,
    };

    console.log(`Creating payment intent for RM${amountInMYR} (${amountInSen} sen)`);
    console.log('Order type:', orderType);
    console.log('Items:', order_items.length);

    // Try immediate confirmation if payment method is provided
    let paymentIntent;
    let initialStatus = 'pending';
    let requiresAction = false;
    
    if (payment_method_id) {
      console.log('🔄 Attempting immediate confirmation with payment method:', payment_method_id);
      
      paymentIntentData.payment_method = payment_method_id;
      paymentIntentData.confirm = true;
      
      const origin = getHeader(event, 'origin') || getHeader(event, 'host') || 'http://localhost:3000';
      paymentIntentData.return_url = `${origin}/payment-success`;
      
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
      console.log('💳 Creating regular payment intent (no payment method provided)');
      paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
      console.log('✅ Payment intent created:', paymentIntent.id);
    }

    // Start database transaction
    console.log('📝 Creating database records...');

    // Create donation/order record
    const donationRecord = {
      donor_id: user?.id || null,
      event_id: event_id || null,
      subscription_id: null,
      amount: amountInMYR,
      currency: 'myr',
      category: category || 'general',
      type: 'onetime',
      order_type: orderType,
      total_items: order_items.length,
      status: initialStatus,
      message: message || null,
      stripe_payment_intent_id: paymentIntent.id,
      stripe_customer_id: null, // Will be updated if customer is created
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Inserting donation record with status:', initialStatus);

    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert(donationRecord)
      .select()
      .single();

    if (donationError) {
      console.error('❌ Database insert error:', donationError);
      
      // Cancel payment intent if database fails
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

    // Create order items if any
    if (order_items.length > 0) {
      console.log('📦 Creating order items...');
      
      const orderItemsData = order_items.map(item => ({
        donation_id: donation.id,
        product_id: item.product_id || null,
        product_name: item.product_name,
        product_price: parseFloat(item.product_price),
        quantity: parseInt(item.quantity) || 1,
        total_amount: parseFloat(item.total_amount),
        created_at: new Date().toISOString()
      }));

      const { data: createdOrderItems, error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData)
        .select();

      if (orderItemsError) {
        console.error('❌ Order items insert error:', orderItemsError);
        
        // Rollback: delete the donation record
        await supabase.from('donations').delete().eq('id', donation.id);
        
        // Cancel payment intent if not succeeded
        if (paymentIntent.status !== 'succeeded') {
          try {
            await stripe.paymentIntents.cancel(paymentIntent.id);
          } catch (cancelError) {
            console.error('Failed to cancel payment intent:', cancelError);
          }
        }
        
        throw createError({
          statusCode: 500,
          statusMessage: `Order items creation failed: ${orderItemsError.message}`
        });
      }

      console.log('✅ Order items created:', createdOrderItems.length);

      // Update product stock quantities if this is a purchase
      if (orderType === 'purchase' || orderType === 'mixed') {
        console.log('📦 Updating product stock...');
        
        const productUpdates = order_items
          .filter(item => item.product_id)
          .map(async (item) => {
            // Get current stock
            const { data: product, error: fetchError } = await supabase
              .from('products')
              .select('stock_quantity')
              .eq('id', item.product_id)
              .single();

            if (fetchError || !product) {
              console.warn(`Could not fetch product ${item.product_id} for stock update`);
              return;
            }

            // Only update if stock is tracked (not null)
            if (product.stock_quantity !== null) {
              const newStock = Math.max(0, product.stock_quantity - item.quantity);
              
              const { error: updateError } = await supabase
                .from('products')
                .update({ 
                  stock_quantity: newStock,
                  updated_at: new Date().toISOString()
                })
                .eq('id', item.product_id);

              if (updateError) {
                console.warn(`Failed to update stock for product ${item.product_id}:`, updateError);
              } else {
                console.log(`✅ Updated stock for ${item.product_name}: ${product.stock_quantity} → ${newStock}`);
              }
            }
          });

        await Promise.all(productUpdates);
      }
    }

    console.log('=== ENHANCED API ROUTE DEBUG END ===');

    // Return comprehensive response
    const response = {
      client_secret: paymentIntent.client_secret,
      donation_id: donation.id,
      amount: amountInMYR,
      currency: 'myr',
      status: initialStatus,
      order_type: orderType,
      total_items: order_items.length,
      payment_intent_id: paymentIntent.id,
      payment_intent_status: paymentIntent.status,
      requires_action: requiresAction,
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
});