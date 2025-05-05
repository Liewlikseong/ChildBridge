import { ref, readonly } from 'vue';
import { useSupabaseClient, useSupabaseUser } from '#imports';

export const useProfile = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  
  const profile = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchProfile = async () => {
    if (!user.value) {
      profile.value = null;
      return { profile: null };
    }

    loading.value = true;
    error.value = null;

    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single();

      if (err) throw err;
      
      profile.value = data;
      return { profile: data };
    } catch (err) {
      console.error('Error fetching profile:', err);
      error.value = err.message;
      return { error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (profileData) => {
    if (!user.value) {
      return { error: 'Not authenticated' };
    }

    loading.value = true;
    error.value = null;

    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.value.id)
        .select()
        .single();

      if (err) throw err;
      
      profile.value = data;
      return { profile: data };
    } catch (err) {
      console.error('Error updating profile:', err);
      error.value = err.message;
      return { error: err.message };
    } finally {
      loading.value = false;
    }
  };

  return {
    profile: readonly(profile),
    loading: readonly(loading),
    error: readonly(error),
    fetchProfile,
    updateProfile
  };
};