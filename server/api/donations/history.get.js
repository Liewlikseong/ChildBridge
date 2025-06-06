import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = await serverSupabaseClient(event);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const query = getQuery(event);
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const type = query.type || '';
  const status = query.status || '';
  const dateRange = parseInt(query.dateRange) || null; // In days

  const offset = (page - 1) * limit;

  try {
    let dbQuery = client
      .from('donations')
      .select('*', { count: 'exact' }) // Request exact count for pagination
      .eq('donor_id', user.id); // Filter by the current user's ID

    // Apply filters
    if (type) {
      dbQuery = dbQuery.eq('type', type);
    }
    if (status) {
      dbQuery = dbQuery.eq('status', status);
    }
    if (dateRange) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);
      dbQuery = dbQuery.gte('created_at', startDate.toISOString());
    }

    // Order and paginate
    dbQuery = dbQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: donations, count, error } = await dbQuery;

    if (error) {
      console.error('Error fetching donations history:', error);
      throw createError({ statusCode: 500, statusMessage: 'Failed to fetch donation history.' });
    }

    return {
      donations,
      totalCount: count,
    };

  } catch (error) {
    console.error('API Error /api/donations/history:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'An unexpected error occurred.'
    });
  }
});