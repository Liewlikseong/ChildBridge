import { createClient } from '@supabase/supabase-js';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const body = await readBody(event);
  
  const { email, firstName, lastName, password } = body;

  if (!email || !firstName || !lastName || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields.' });
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters long.' });
  }

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error: Supabase environment variables are not set.' });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey);

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
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: You do not have permission to perform this action.' });
  }

  // Check if user already exists
  const { data: existingUser, error: existingUserError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (existingUserError) {
    throw createError({ statusCode: 500, statusMessage: 'Error checking existing users.' });
  }

  const userExists = existingUser.users.some(u => u.email === email);
  if (userExists) {
    throw createError({ statusCode: 400, statusMessage: 'A user with this email address already exists.' });
  }

  console.log('📧 Creating admin account for:', email);
  
  // Create admin user with custom password and auto-confirm email
  const { data, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Auto-confirm the email
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      role: 'admin'
    }
  });

  if (createUserError) {
    console.error('❌ Admin creation failed:', createUserError);
    throw createError({ statusCode: 400, statusMessage: createUserError.message });
  }

  console.log('✅ Admin account created successfully:', {
    userId: data.user.id,
    email: data.user.email,
    createdAt: data.user.created_at
  });

  // Create a profile record for the admin
  console.log('📝 Creating profile for admin:', data.user.id);
  
  const profileData = {
    id: data.user.id,
    email: email,
    first_name: firstName,
    last_name: lastName,
    role: 'admin',
    created_at: new Date().toISOString()
  };

  console.log('📋 Profile data to insert:', profileData);

  const { data: profileResult, error: profileCreateError } = await supabaseAdmin
    .from('profiles')
    .insert(profileData)
    .select();

  if (profileCreateError) {
    console.error('❌ Error creating profile for admin:', profileCreateError);
    console.error('❌ Profile error details:', {
      code: profileCreateError.code,
      message: profileCreateError.message,
      details: profileCreateError.details,
      hint: profileCreateError.hint
    });
    // Don't throw error as the user was created successfully, but log it
  } else {
    console.log('✅ Admin profile created successfully:', profileResult);
  }

  // Verify profile was created
  console.log('🔍 Verifying profile creation...');
  const { data: verifyProfile, error: verifyError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', data.user.id);

  if (verifyError) {
    console.error('❌ Error verifying profile:', verifyError);
  } else if (!verifyProfile || verifyProfile.length === 0) {
    console.error('❌ Profile verification failed: No profile found in database');
  } else {
    console.log('✅ Profile verification successful:', verifyProfile[0]);
  }

  return { 
    message: `Admin account created successfully! The admin can now log in with email: ${email} and the password you provided.`,
    userId: data.user.id,
    email: email,
    password: password,
    createdAt: data.user.created_at
  };
}); 