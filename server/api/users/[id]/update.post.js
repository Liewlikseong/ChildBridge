import { createClient } from '@supabase/supabase-js';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const { id } = event.context.params;
  const body = await readBody(event);
  const { email, firstName, lastName, role, gender, birthDate, occupation } = body;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required.' });
  }

  const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || !['admin', 'head_admin'].includes(profile.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  if (!email || !firstName || !lastName || !['staff', 'donor'].includes(role)) {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid fields.' });
  }

  const updateData = {
    email,
    first_name: firstName,
    last_name: lastName,
    role,
    gender: gender || null,
    birth_date: birthDate || null,
    occupation: occupation || null,
    updated_at: new Date().toISOString()
  };

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update(updateData)
    .eq('id', id);

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: updateError.message });
  }

  return { message: 'User updated successfully.' };
}); 