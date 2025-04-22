import { ref, readonly } from 'vue';
import { useSupabaseClient } from '#imports';

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const loading = ref(false);
  const error = ref(null);

  const signIn = async (email, password) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;
      return { user: data.user };
    } catch (err) {
      error.value = err.message;
      return { error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const signUp = async (email, password, userData) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (authError) throw authError;
      return { user: data.user };
    } catch (err) {
      error.value = err.message;
      return { error: err.message };
    } finally {
      loading.value = false;
    }
  };

  const signOut = async () => {
    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;
      return { success: true };
    } catch (err) {
      error.value = err.message;
      return { error: err.message };
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    signIn,
    signUp,
    signOut
  };
};