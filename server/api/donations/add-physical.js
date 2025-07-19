export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      donor_id,      // New: ID of existing user if selected
      donor_name,
      donor_email,
      category,
      message,
      status,        // New: Allow setting initial status
      created_by_staff
    } = body;

    // Validate required fields
    if (!message || !message.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Donation items description is required'
      });
    }

    if (!donor_id && (!donor_name || !donor_name.trim())) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Donor information is required'
      });
    }

    // Initialize Supabase
    let supabase;
    try {
      const { serverSupabaseClient } = await import('#supabase/server');
      supabase = await serverSupabaseClient(event);
    } catch (error) {
      const { createClient } = await import('@supabase/supabase-js');
      const config = useRuntimeConfig();
      const supabaseUrl = config.public.supabaseUrl || process.env.SUPABASE_URL;
      const supabaseKey = config.supabaseServiceKey || process.env.SUPABASE_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Supabase configuration missing'
        });
      }
      
      supabase = createClient(supabaseUrl, supabaseKey);
    }

    // Check authentication
    let user = null;
    try {
      const { serverSupabaseUser } = await import('#supabase/server');
      user = await serverSupabaseUser(event);
    } catch (userError) {
      console.log('No user authentication available');
    }

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }

    // Enhanced donor handling
    let finalDonorId = null;
    let finalDonorName = donor_name;
    let finalDonorEmail = donor_email;

    // 1. If donor_id is provided, verify and use that donor
    if (donor_id) {
      console.log('Using provided donor_id:', donor_id);
      
      const { data: donorData, error: donorError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('id', donor_id)
        .single();

      if (!donorError && donorData) {
        finalDonorId = donorData.id;
        finalDonorName = `${donorData.first_name} ${donorData.last_name}`;
        finalDonorEmail = donorData.email;
        console.log('Found existing donor:', finalDonorName);
      } else {
        console.warn('Invalid donor_id provided, falling back to manual entry');
      }
    }

    // 2. If no donor_id but email is provided, try to find existing user
    if (!finalDonorId && donor_email) {
      console.log('Searching for existing user by email:', donor_email);
      
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('email', donor_email.toLowerCase().trim())
        .single();

      if (!userError && existingUser) {
        finalDonorId = existingUser.id;
        finalDonorName = `${existingUser.first_name} ${existingUser.last_name}`;
        finalDonorEmail = existingUser.email;
        console.log('Found existing user by email:', finalDonorName);
      } else {
        console.log('No existing user found by email, using manual entry');
      }
    }

    // 3. Clean up email if provided
    if (finalDonorEmail) {
      finalDonorEmail = finalDonorEmail.toLowerCase().trim();
    }

    // Create physical donation record
    const donationRecord = {
      donor_id: finalDonorId, // Will be null for manual entries, UUID for existing users
      donor_name: finalDonorName.trim(),
      donor_email: finalDonorEmail || null,
      event_id: null,
      subscription_id: null,
      amount: 0,
      currency: 'myr',
      category: category || 'general',
      type: 'physical',
      order_type: 'donation',
      total_items: 1,
      status: status || 'pending', // Allow setting initial status, default to pending
      message: message.trim(),
      stripe_payment_intent_id: null,
      stripe_customer_id: null,
      payment_method: null,
      created_by_staff: created_by_staff || user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Creating physical donation:', {
      donor_id: finalDonorId,
      donor_name: finalDonorName,
      donor_email: finalDonorEmail,
      linked_to_user: !!finalDonorId,
      status: donationRecord.status
    });

    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert(donationRecord)
      .select()
      .single();

    if (donationError) {
      console.error('Error creating physical donation:', donationError);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create donation record: ${donationError.message}`
      });
    }

    console.log('Physical donation created successfully:', {
      id: donation.id,
      donor_linked: !!donation.donor_id,
      status: donation.status
    });

    // Create order item
    try {
      const orderItemRecord = {
        donation_id: donation.id,
        product_id: null,
        product_name: 'Physical Donation',
        product_price: 0,
        quantity: 1,
        total_amount: 0,
        created_at: new Date().toISOString()
      };

      const { error: orderItemError } = await supabase
        .from('order_items')
        .insert(orderItemRecord);

      if (orderItemError) {
        console.warn('Failed to create order item:', orderItemError);
      }
    } catch (orderItemErr) {
      console.warn('Error creating order item:', orderItemErr);
    }

    // Return success response with additional info
    return {
      id: donation.id,
      success: true,
      message: finalDonorId ? 
        'Physical donation recorded and linked to existing user' : 
        'Physical donation recorded with manual donor info',
      donation: donation,
      donor_linked: !!finalDonorId,
      donor_info: {
        id: finalDonorId,
        name: finalDonorName,
        email: finalDonorEmail
      }
    };

  } catch (error) {
    console.error('Add physical donation error:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `API Error: ${error.message}`
    });
  }
});