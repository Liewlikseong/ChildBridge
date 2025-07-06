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

  // Prevent an admin from deleting their own account
  if (user.id === userIdToDelete) {
    throw createError({ statusCode: 403, statusMessage: 'You cannot delete your own account.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error.' });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey);

  // Verify that the user making the request is a head_admin
  const { data: requestorProfile, error: requestorProfileError } = await supabaseAdmin
    .from('profiles')
    .select('role, first_name, last_name')
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

  if (requestor.role !== 'head_admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: You do not have permission to perform this action.' });
  }

  // Get the target user's information before deletion
  const { data: targetUser, error: targetUserError } = await supabaseAdmin.auth.admin.getUserById(userIdToDelete);
  
  if (targetUserError) {
    throw createError({ statusCode: 500, statusMessage: `Could not retrieve target user information: ${targetUserError.message}` });
  }

  // Check the role of the user being deleted
  const { data: targetProfile, error: targetProfileError } = await supabaseAdmin
    .from('profiles')
    .select('role, first_name, last_name, email')
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

  if (target.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: You can only delete users with the "admin" role.' });
  }

  // Delete the user from Supabase Auth
  const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userIdToDelete);

  if (deleteAuthError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to delete user: ${deleteAuthError.message}` });
  }

  // Attempt to delete the corresponding profile. 
  // If this fails, we log it but don't throw an error, as the auth user (the account) is already gone.
  const { error: deleteProfileError } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', userIdToDelete);

  if (deleteProfileError) {
      console.error(`Auth user ${userIdToDelete} was deleted, but their profile could not be removed. Error: ${deleteProfileError.message}`);
  }

  console.log(`✅ Admin user ${target.email || userIdToDelete} deleted successfully by ${requestor.first_name || 'Head Admin'}`);

  return { message: 'Admin user deleted successfully.' };
}); 