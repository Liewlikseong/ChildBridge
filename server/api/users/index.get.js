import { createClient } from '@supabase/supabase-js';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const query = getQuery(event);
  const roleToFetch = query.role; // e.g., 'staff' or 'donor'
  const searchQuery = query.search || '';

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' });
  }

  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Verify that the user making the request is an admin or head_admin
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

  if (!['admin', 'head_admin'].includes(userProfile.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  // Admin can see staff and donors. Default to both if no specific role is requested.
  let rolesToFetch;
  if (Array.isArray(roleToFetch)) {
    rolesToFetch = roleToFetch;
  } else if (roleToFetch) {
    rolesToFetch = [roleToFetch];
  } else {
    rolesToFetch = ['staff', 'donor'];
  }

  // Security check: ensure all requested roles are valid
  const validRoles = ['staff', 'donor'];
  if (rolesToFetch.some(role => !validRoles.includes(role))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid role specified' });
  }

  let queryBuilder = supabaseAdmin
    .from('profiles')
    .select('*')
    .in('role', rolesToFetch);
  
  if (searchQuery) {
    const searchPattern = `%${searchQuery}%`;
    queryBuilder = queryBuilder.or(`first_name.ilike.${searchPattern},last_name.ilike.${searchPattern},email.ilike.${searchPattern}`);
  }

  const { data: userProfiles, error: profilesError } = await queryBuilder;

  if (profilesError) {
    throw createError({ statusCode: 500, statusMessage: profilesError.message });
  }

  return userProfiles;
}); 