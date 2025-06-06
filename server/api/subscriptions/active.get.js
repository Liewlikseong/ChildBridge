import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = await serverSupabaseClient(event);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  try {
    const { data: subscriptions, error } = await client
      .from('subscriptions')
      .select('*')
      .eq('donor_id', user.id)
      .eq('status', 'active') // Only fetch active subscriptions
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active subscriptions:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch active subscriptions.' });
    }

    return { subscriptions };

  } catch (error) {
    console.error('API Error /api/subscriptions/active:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'An unexpected error occurred.'
    });
  }
});
