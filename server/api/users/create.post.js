import { createClient } from '@supabase/supabase-js';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const { email, firstName, lastName, role } = await readBody(event);

  // --- Validation ---
  if (!email || !firstName || !lastName || !role) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields.' });
  }
  if (!['staff', 'donor'].includes(role)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid role specified.' });
  }
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required.' });
  }

  // --- Authorization ---
  const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || !['admin', 'head_admin'].includes(profile.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: You do not have permission to perform this action.' });
  }

  // Get the correct base URL
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  const redirectUrl = `${baseUrl}/auth/set-password`;

  console.log('Inviting user with redirect URL:', redirectUrl);

  // --- Invite User with Custom Redirect ---
  const { data, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    email,
    {
      data: { 
        first_name: firstName, 
        last_name: lastName, 
        role 
      },
      redirectTo: redirectUrl
    }
  );

  if (inviteError) {
    console.error('Invite error:', inviteError);
    throw createError({ statusCode: 400, statusMessage: inviteError.message });
  }

  console.log('User invited successfully:', { email, redirectUrl });
  
  return { 
    message: 'User invited successfully. They will receive an email to set up their account.',
    redirectUrl: redirectUrl // Include this for debugging
  };
});