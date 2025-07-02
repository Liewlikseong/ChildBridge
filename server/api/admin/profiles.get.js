import { createClient } from '@supabase/supabase-js';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const query = getQuery(event);
  const roleToFetch = query.role; // Will be undefined if not specified
  const searchQuery = query.search || '';

  console.log('Admin profiles API called with:', { 
    roleToFetch, 
    searchQuery,
    roleToFetchType: typeof roleToFetch,
    queryKeys: Object.keys(query)
  });

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' });
  }

  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Get the current user's profile with better error handling
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id);

  // Handle cases where no profile exists or multiple profiles exist
  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    throw createError({ statusCode: 500, statusMessage: 'Error fetching user profile.' });
  }

  if (!profile || profile.length === 0) {
    throw createError({ statusCode: 403, statusMessage: 'User profile not found. Please contact support.' });
  }

  if (profile.length > 1) {
    console.warn(`Multiple profiles found for user ${user.id}, using the first one`);
  }

  const userProfile = profile[0]; // Use the first profile if multiple exist

  if (userProfile.role !== 'head_admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  // Define roles based on request, or default to all for head_admin
  let rolesToFetch;
  if (roleToFetch) {
    // Handle both single role string and array of roles
    if (Array.isArray(roleToFetch)) {
      rolesToFetch = roleToFetch;
    } else {
      // Ensure it's a string and trim any whitespace
      rolesToFetch = [String(roleToFetch).trim()];
    }
    
    console.log('Roles to fetch after processing:', rolesToFetch);
    
    // Validate roles - be more lenient and log what we receive
    const validRoles = ['admin', 'staff', 'donor', 'head_admin'];
    const invalidRoles = rolesToFetch.filter(r => !validRoles.includes(r));
    
    if (invalidRoles.length > 0) {
      console.error('Invalid roles received:', invalidRoles);
      console.error('Valid roles are:', validRoles);
      console.error('Received roles:', rolesToFetch);
      console.error('Original roleToFetch:', roleToFetch);
      throw createError({ 
        statusCode: 400, 
        statusMessage: `Invalid role specified: ${invalidRoles.join(', ')}. Valid roles are: ${validRoles.join(', ')}` 
      });
    }
  } else {
    // If no specific role is requested, head_admin sees these roles
    rolesToFetch = ['admin', 'staff', 'donor'];
  }

  console.log('Final roles to fetch:', rolesToFetch);

  let queryBuilder = supabaseAdmin
    .from('profiles')
    .select('*')
    .in('role', rolesToFetch);

  if (searchQuery) {
    const searchPattern = `%${searchQuery}%`;
    queryBuilder = queryBuilder.or(`first_name.ilike.${searchPattern},last_name.ilike.${searchPattern},email.ilike.${searchPattern}`);
  }

  const { data: filteredProfiles, error: profilesError } = await queryBuilder;

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw createError({ statusCode: 500, statusMessage: profilesError.message });
  }

  console.log(`Found ${filteredProfiles?.length || 0} profiles`);
  return filteredProfiles;
}); 