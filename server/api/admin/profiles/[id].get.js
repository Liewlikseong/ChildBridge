import { createClient } from '@supabase/supabase-js';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const { id } = event.context.params;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required.' });
  }

  const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'head_admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  const { data: target, error: targetError } = await supabaseAdmin
    .from('profiles')
    .select('id, email, first_name, last_name, role, gender, birth_date, occupation')
    .eq('id', id)
    .single();

  if (targetError || !target) {
    throw createError({ statusCode: 404, statusMessage: 'Admin not found.' });
  }

  if (target.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Not an admin user.' });
  }

  return target;
}); 