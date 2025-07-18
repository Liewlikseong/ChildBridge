export default defineEventHandler(async (event) => {
  try {
    // Initialize Supabase
    let supabase;
    try {
      const { serverSupabaseClient } = await import('#supabase/server');
      supabase = await serverSupabaseClient(event);
    } catch (error) {
      const { createClient } = await import('@supabase/supabase-js');
      const config = useRuntimeConfig();
      const supabaseUrl = config.public.supabaseUrl || process.env.SUPABASE_URL;
      const supabaseKey = config.supabaseServiceKey || process.env.SUPABASE_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Supabase configuration missing'
        });
      }
      
      supabase = createClient(supabaseUrl, supabaseKey);
    }

    // Check authentication
    let user = null;
    try {
      const { serverSupabaseUser } = await import('#supabase/server');
      user = await serverSupabaseUser(event);
    } catch (userError) {
      console.log('No user authentication available');
    }

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }

    // Fetch all donations with profiles
    const { data: donations, error } = await supabase
      .from('donations')
      .select(`
        id,
        donor_id,
        donor_name,
        donor_email,
        amount,
        currency,
        category,
        type,
        status,
        message,
        stripe_payment_intent_id,
        created_at,
        updated_at,
        profiles:donor_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations for export:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch donations for export'
      });
    }

    // Helper functions
    const getDonorName = (donation) => {
      if (donation.profiles?.first_name && donation.profiles?.last_name) {
        return `${donation.profiles.first_name} ${donation.profiles.last_name}`;
      }
      return donation.donor_name || 'Anonymous Donor';
    };

    const getDonorEmail = (donation) => donation.profiles?.email || donation.donor_email || '';

    const formatType = (type) => {
      const types = {
        onetime: 'One-time',
        subscription: 'Monthly',
        physical: 'Physical'
      };
      return types[type] || type;
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // Convert to CSV format
    const csvData = donations.map(donation => ({
      'ID': donation.id,
      'Donor Name': getDonorName(donation),
      'Donor Email': getDonorEmail(donation),
      'Type': formatType(donation.type),
      'Amount': donation.type === 'physical' ? '0.00' : donation.amount.toFixed(2),
      'Currency': donation.currency?.toUpperCase() || 'MYR',
      'Category': donation.category || 'General',
      'Status': donation.status,
      'Payment ID': donation.stripe_payment_intent_id || '',
      'Message/Items': donation.message || '',
      'Created Date': formatDate(donation.created_at),
      'Updated Date': formatDate(donation.updated_at)
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes in CSV
          return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    return {
      csv: csvContent,
      filename: `donations-export-${new Date().toISOString().split('T')[0]}.csv`,
      totalRecords: donations.length
    };

  } catch (error) {
    console.error('Export donations API error:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `API Error: ${error.message}`
    });
  }
});