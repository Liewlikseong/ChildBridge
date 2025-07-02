import { createClient } from '@supabase/supabase-js';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const { id: userIdToDelete } = await readBody(event);

  if (!userIdToDelete) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required.' });
  }

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required.' });
  }

  const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Verify that the user making the request is an admin or head_admin
  const { data: requestorProfile, error: requestorProfileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id);

  if (requestorProfileError) {
    console.error('Error fetching requestor profile:', requestorProfileError);
    throw createError({ statusCode: 500, statusMessage: 'Error fetching user profile.' });
  }

  if (!requestorProfile || requestorProfile.length === 0) {
    throw createError({ statusCode: 403, statusMessage: 'User profile not found. Please contact support.' });
  }

  if (requestorProfile.length > 1) {
    console.warn(`Multiple profiles found for requestor ${user.id}, using the first one`);
  }

  const requestor = requestorProfile[0];

  if (!['admin', 'head_admin'].includes(requestor.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: You do not have permission to perform this action.' });
  }

  // Check the role of the user being deleted
  const { data: targetProfile, error: targetProfileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userIdToDelete);

  if (targetProfileError) {
    console.error('Error fetching target profile:', targetProfileError);
    throw createError({ statusCode: 500, statusMessage: `Could not verify target user's role: ${targetProfileError.message}` });
  }

  if (!targetProfile || targetProfile.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Target user profile not found.' });
  }

  if (targetProfile.length > 1) {
    console.warn(`Multiple profiles found for target user ${userIdToDelete}, using the first one`);
  }

  const target = targetProfile[0];

  if (!['staff', 'donor'].includes(target.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: You can only delete users with the "staff" or "donor" role.' });
  }

  // Delete the user from Supabase Auth
  const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userIdToDelete);

  if (deleteAuthError) {
    // If user not found in Auth, they might just be a profile. Proceed to delete profile.
    if (deleteAuthError.message.includes('User not found')) {
      console.warn(`User ${userIdToDelete} not found in Auth, attempting to delete from profiles anyway.`);
    } else {
      throw createError({ statusCode: 500, statusMessage: `Failed to delete user: ${deleteAuthError.message}` });
    }
  }

  const { error: deleteProfileError } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', userIdToDelete);

  if (deleteProfileError) {
    console.error(`Auth user ${userIdToDelete} was deleted, but their profile could not be removed. Error: ${deleteProfileError.message}`);
  }

  return { message: 'User deleted successfully.' };
}); 