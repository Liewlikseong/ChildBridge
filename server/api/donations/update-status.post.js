export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { donationId, status, paymentIntentId } = body;

    if (!donationId || !status) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: donationId and status'
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

    // Map Stripe status to our internal donation status
    const statusMapping = {
      succeeded: 'completed',
      processing: 'processing',
      requires_payment_method: 'pending',
      requires_action: 'pending',
      requires_confirmation: 'pending',
      canceled: 'cancelled',
      failed: 'failed'
    };

    const dbStatus = statusMapping[status] || 'pending';

    // Prepare update fields
    const updateData = {
      status: dbStatus,
      updated_at: new Date().toISOString()
    };

    // If Stripe status is 'succeeded', mark donation as completed
    if (status === 'succeeded') {
      updateData.completed_at = new Date().toISOString();
    }

    // If paymentIntentId is provided, store it
    if (paymentIntentId) {
      updateData.stripe_payment_intent_id = paymentIntentId;
    }

    // Update the donation in the database
    const { data, error } = await supabase
      .from('donations')
      .update(updateData)
      .eq('id', donationId)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update donation: ${error.message}`
      });
    }

    return {
      success: true,
      donation: data,
      status: dbStatus
    };

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