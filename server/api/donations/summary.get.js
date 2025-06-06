import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = await serverSupabaseClient(event);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  try {
    // Total Donated & Total Count
    const { data: totalData, count: totalCount, error: totalError } = await client
      .from('donations')
      .select('amount', { count: 'exact' })
      .eq('donor_id', user.id)
      .eq('status', 'completed'); // Only count completed donations

    if (totalError) {
      console.error('Error fetching total donations:', totalError);
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch donation summary.' });
    }
    const totalDonated = totalData.reduce((sum, d) => sum + parseFloat(d.amount), 0).toFixed(2);

    // This Year's Donations
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).toISOString();
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999).toISOString();

    const { data: thisYearData, error: thisYearError } = await client
      .from('donations')
      .select('amount')
      .eq('donor_id', user.id)
      .eq('status', 'completed')
      .gte('created_at', startOfYear)
      .lte('created_at', endOfYear);

    if (thisYearError) {
      console.error('Error fetching this year donations:', thisYearError);
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch donation summary.' });
    }
    const thisYear = thisYearData.reduce((sum, d) => sum + parseFloat(d.amount), 0).toFixed(2);

    // Active Subscriptions Count
    const { count: activeSubscriptionsCount, error: subsError } = await client
      .from('subscriptions')
      .select('*', { count: 'exact' })
      .eq('donor_id', user.id)
      .eq('status', 'active'); // Assuming 'active' is the status for current subscriptions

    if (subsError) {
      console.error('Error fetching active subscriptions:', subsError);
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch subscription summary.' });
    }

    return {
      totalDonated: totalDonated,
      thisYear: thisYear,
      totalCount: totalCount,
      activeSubscriptions: activeSubscriptionsCount,
    };

  } catch (error) {
    console.error('API Error /api/donations/summary:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'An unexpected error occurred.'
    });
  }
});