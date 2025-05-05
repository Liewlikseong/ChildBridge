import { ref, readonly } from 'vue';
import { useSupabaseClient, useSupabaseUser } from '#imports';

export const useDonations = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  
  const donations = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchDonations = async () => {
    if (!user.value) {
      return { error: 'Not authenticated' };
    }

    loading.value = true;
    error.value = null;

    try {
      const { data, error: err } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', user.value.id)
        .order('created_at', { ascending: false });

      if (err) throw err;
      
      donations.value = data;
      return { donations: data };
    } catch (err) {
      console.error('Error fetching donations:', err);
      error.value = err.message;
      return { error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const createDonation = async (donationData) => {
    if (!user.value) {
      return { error: 'Not authenticated' };
    }

    loading.value = true;
    error.value = null;

    try {
      const { data, error: err } = await supabase
        .from('donations')
        .insert({
          ...donationData,
          donor_id: user.value.id
        })
        .select()
        .single();

      if (err) throw err;
      
      donations.value = [data, ...donations.value];
      return { donation: data };
    } catch (err) {
      console.error('Error creating donation:', err);
      error.value = err.message;
      return { error: err.message };
    } finally {
      loading.value = false;
    }
  };

  return {
    donations: readonly(donations),
    loading: readonly(loading),
    error: readonly(error),
    fetchDonations,
    createDonation
  };
};