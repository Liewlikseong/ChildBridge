export default defineEventHandler(async (event) => {
  try {
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

    // Check if user is authenticated
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

    // Fetch recent donations (last 30 days) with user profiles
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: donations, error } = await supabase
      .from('donations')
      .select(`
        id,
        donor_id,
        donor_name,
        donor_email,
        amount,
        currency,
        category,
        type,
        status,
        message,
        created_at,
        profiles:donor_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(100); // Limit for dashboard summary

    if (error) {
      console.error('Error fetching donations summary:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch donations summary'
      });
    }

    return {
      donations: donations || []
    };

  } catch (error) {
    console.error('Donations summary API error:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `API Error: ${error.message}`
    });
  }
});