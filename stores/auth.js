import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: true,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isStaff: (state) => state.profile?.role === 'staff',
    isAdmin: (state) => state.profile?.role === 'admin',
    isDonor: (state) => state.profile?.role === 'donor',
    fullName: (state) => {
      if (!state.profile) return '';
      return `${state.profile.first_name || ''} ${state.profile.last_name || ''}`.trim();
    },
  },

  actions: {
    async fetchUserProfile() {
      const { $supabase } = useNuxtApp();
      const user = $supabase.auth.getUser();
      
      if (!user) {
        this.profile = null;
        return;
      }

      try {
        this.loading = true;
        const { data, error } = await $supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        this.profile = data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(profileData) {
      const { $supabase } = useNuxtApp();
      const user = $supabase.auth.getUser();
      
      if (!user) return;

      try {
        this.loading = true;
        const { data, error } = await $supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;
        
        this.profile = data;
        return { success: true };
      } catch (error) {
        console.error('Error updating profile:', error);
        this.error = error.message;
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    async signOut() {
      const { $supabase } = useNuxtApp();
      
      try {
        const { error } = await $supabase.auth.signOut();
        if (error) throw error;
        
        this.user = null;
        this.profile = null;
        
        return { success: true };
      } catch (error) {
        console.error('Error signing out:', error);
        return { success: false, error: error.message };
      }
    }
  }
});