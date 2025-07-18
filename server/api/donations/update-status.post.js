// server/api/donations/update-status.post.js - Fixed version
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Support both existing webhook format AND new staff update format
    const { 
      donationId, 
      donation_id,  // New format for staff updates
      status, 
      paymentIntentId,
      notes,        // New field for staff notes
      source = 'webhook' // Default to webhook, staff updates will pass 'staff'
    } = body;

    // Use either field name for donation ID
    const finalDonationId = donationId || donation_id;

    if (!finalDonationId || !status) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: donationId/donation_id and status'
      });
    }

    // Get Supabase client
    let supabase;
    try {
      const { serverSupabaseClient } = await import('#supabase/server');
      supabase = await serverSupabaseClient(event);
    } catch (error) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.SUPABASE_URL || useRuntimeConfig().public.supabaseUrl;
      const supabaseKey = process.env.SUPABASE_KEY || useRuntimeConfig().supabaseServiceKey;
      supabase = createClient(supabaseUrl, supabaseKey);
    }

    // Check authentication for staff updates
    if (source === 'staff') {
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
          statusMessage: 'Authentication required for staff updates'
        });
      }
    }

    // Get current donation to check its type and current status
    const { data: currentDonation, error: fetchError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', finalDonationId)
      .single();

    if (fetchError || !currentDonation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Donation not found'
      });
    }

    // Handle different update sources
    let dbStatus;
    let updateData = {
      updated_at: new Date().toISOString()
    };

    if (source === 'webhook') {
      // EXISTING WEBHOOK LOGIC - Keep exactly as before
      const statusMapping = {
        succeeded: 'completed',
        processing: 'processing',
        requires_payment_method: 'pending',
        requires_action: 'pending',
        requires_confirmation: 'pending',
        canceled: 'cancelled',
        failed: 'failed'
      };

      dbStatus = statusMapping[status] || 'pending';
      updateData.status = dbStatus;

      // REMOVED: completed_at field setting since column doesn't exist
      // if (status === 'succeeded') {
      //   updateData.completed_at = new Date().toISOString();
      // }

      // If paymentIntentId is provided, store it
      if (paymentIntentId) {
        updateData.stripe_payment_intent_id = paymentIntentId;
      }

      console.log(`Webhook update: Donation ${finalDonationId} status ${currentDonation.status} → ${dbStatus}`);

    } else {
      // NEW STAFF UPDATE LOGIC
      const validStatuses = ['pending', 'completed', 'failed', 'cancelled', 'processing'];
      
      if (!validStatuses.includes(status)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid status for manual update'
        });
      }

      dbStatus = status;
      updateData.status = dbStatus;

      // REMOVED: completed_at field setting since column doesn't exist
      // if (status === 'completed' && currentDonation.status !== 'completed') {
      //   updateData.completed_at = new Date().toISOString();
      // }

      // Handle staff notes
      if (notes) {
        updateData.message = currentDonation.message 
          ? `${currentDonation.message}\n\nStaff Note (${new Date().toLocaleDateString()}): ${notes}`
          : `Staff Note: ${notes}`;
      }

      // Log staff action
      console.log(`Staff update: Donation ${finalDonationId} (${currentDonation.type}) status ${currentDonation.status} → ${dbStatus}`);

      // Special handling for physical donations
      if (currentDonation.type === 'physical') {
        if (status === 'completed') {
          console.log(`Physical donation ${finalDonationId} marked as received`);
        } else if (status === 'failed') {
          console.log(`Physical donation ${finalDonationId} marked as not received`);
        }
      }
    }

    // Update the donation in the database
    const { data, error } = await supabase
      .from('donations')
      .update(updateData)
      .eq('id', finalDonationId)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update donation: ${error.message}`
      });
    }

    // Return appropriate response based on source
    if (source === 'webhook') {
      // EXISTING WEBHOOK RESPONSE FORMAT
      return {
        success: true,
        donation: data,
        status: dbStatus
      };
    } else {
      // NEW STAFF UPDATE RESPONSE FORMAT
      return {
        success: true,
        donation_id: finalDonationId,
        old_status: currentDonation.status,
        new_status: dbStatus,
        donation_type: currentDonation.type,
        message: `${currentDonation.type === 'physical' ? 'Physical donation' : 'Donation'} status updated successfully`,
        updated_donation: data
      };
    }

  } catch (error) {
    console.error('Update status error:', error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Update failed: ${error.message}`
    });
  }
});