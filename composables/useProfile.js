import { ref, readonly, watch } from 'vue';
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
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id);

      if (err) throw err;
      
      // Handle cases where no profile exists or multiple profiles exist
      if (!data || data.length === 0) {
        console.warn(`No profile found for user ${user.value.id}`);
        profile.value = null;
        return;
      }

      if (data.length > 1) {
        console.warn(`Multiple profiles found for user ${user.value.id}, using the first one`);
      }

      profile.value = data[0]; // Use the first profile if multiple exist
    } catch (err) {
      console.error('Error fetching profile:', err);
      error.value = err.message;
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
        .select();

      if (err) throw err;
      
      // Handle cases where no profile exists or multiple profiles exist
      if (!data || data.length === 0) {
        console.warn(`No profile found for user ${user.value.id} during update`);
        return { error: 'Profile not found' };
      }

      if (data.length > 1) {
        console.warn(`Multiple profiles found for user ${user.value.id} during update, using the first one`);
      }

      profile.value = data[0]; // Use the first profile if multiple exist
      return { profile: data[0] };
    } catch (err) {
      console.error('Error updating profile:', err);
      error.value = err.message;
      return { error: err.message };
    } finally {
      loading.value = false;
    }
  };

  // Watch for changes in the user object
  watch(user, () => {
    fetchProfile();
  }, { immediate: true }); // immediate: true will run the watcher immediately on component mount

  return {
    profile, // No longer readonly to be updated by the watcher
    loading: readonly(loading),
    error: readonly(error),
    fetchProfile,
    updateProfile
  };
};