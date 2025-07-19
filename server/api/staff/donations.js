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

    // Check if user is staff (you might want to add role checking here)
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

    // Fetch all donations with user profiles
    const { data: donations, error } = await supabase
      .from('donations')
      .select(`
        *,
        profiles:donor_id (
          id,
          first_name,
          last_name,
          email
        )x
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch donations'
      });
    }

    return {
      donations: donations || []
    };

  } catch (error) {
    console.error('Staff donations API error:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `API Error: ${error.message}`
    });
  }
});