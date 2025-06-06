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
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || useRuntimeConfig().supabaseServiceKey;
      supabase = createClient(supabaseUrl, supabaseKey);
    }

    // Map Stripe status to our database status
    const statusMapping = {
      'succeeded': 'completed',
      'requires_payment_method': 'pending',
      'requires_action': 'pending',
      'processing': 'pending',
      'requires_confirmation': 'pending',
      'canceled': 'failed',
      'failed': 'failed'
    };

    const dbStatus = statusMapping[status] || 'pending';

    // Update donation record
    const updateData = {
      status: dbStatus,
      updated_at: new Date().toISOString()
    };

    // Add completion timestamp if payment succeeded
    if (status === 'succeeded') {
      updateData.completed_at = new Date().toISOString();
    }

    // Add payment intent ID if provided
    if (paymentIntentId) {
      updateData.stripe_payment_intent_id = paymentIntentId;
    }

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