import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Get search query from request body
    const body = await readBody(event);
    const { query } = body;

    if (!query || query.length < 2) {
      return {
        users: []
      };
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

    // Search users by name or email
    const searchTerm = `%${query.toLowerCase()}%`;
    
    const { data: users, error: searchError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},email.ilike.${searchTerm}`)
      .not('first_name', 'is', null)
      .not('last_name', 'is', null)
      .limit(10)
      .order('first_name', { ascending: true });

    if (searchError) {
      console.error('Search error:', searchError);
      throw createError({
        statusCode: 500,
        statusMessage: `Search failed: ${searchError.message}`
      });
    }

    // Filter and format results
    const filteredUsers = (users || []).filter(user => 
      user.first_name && user.last_name && user.email
    );

    console.log(`Found ${filteredUsers.length} users for query: "${query}"`);

    return {
      users: filteredUsers
    };

  } catch (error) {
    console.error('Search users error:', error);
    
    if (error.statusCode) throw error;
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search users'
    });
  }
});