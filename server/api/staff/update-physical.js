export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      donation_id,
      donor_name,
      donor_email,
      category,
      status,
      message
    } = body;

    // Validate required fields
    if (!donation_id || !donor_name || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Donation ID, donor name, and message are required'
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

    // Verify this is a physical donation
    const { data: currentDonation, error: fetchError } = await supabase
      .from('donations')
      .select('*')
      .eq('id', donation_id)
      .eq('type', 'physical')
      .single();

    if (fetchError || !currentDonation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Physical donation not found'
      });
    }

    // Prepare update data
    const updateData = {
      donor_name: donor_name,
      donor_email: donor_email || null,
      category: category || 'general',
      status: status || currentDonation.status,
      message: message,
      updated_at: new Date().toISOString()
    };

    // Add completion timestamp if status changed to completed
    if (status === 'completed' && currentDonation.status !== 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    console.log(`Updating physical donation ${donation_id} by staff ${user.id}`);

    // Update the donation
    const { data: updatedDonation, error: updateError } = await supabase
      .from('donations')
      .update(updateData)
      .eq('id', donation_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating physical donation:', updateError);
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update donation: ${updateError.message}`
      });
    }

    // Update order item name if status changed
    if (status && status !== currentDonation.status) {
      const productName = status === 'completed' ? 'Physical Donation (Received)' : 
                         status === 'failed' ? 'Physical Donation (Not Received)' :
                         status === 'pending' ? 'Physical Donation (Pending)' :
                         'Physical Donation';

      await supabase
        .from('order_items')
        .update({ product_name: productName })
        .eq('donation_id', donation_id);
    }

    console.log(`Physical donation ${donation_id} updated successfully`);

    return {
      success: true,
      donation_id: donation_id,
      message: 'Physical donation updated successfully',
      updated_donation: updatedDonation
    };

  } catch (error) {
    console.error('Update physical donation error:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `API Error: ${error.message}`
    });
  }
});