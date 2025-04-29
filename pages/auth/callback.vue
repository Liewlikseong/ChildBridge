<template>
  <div class="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
      <h2 class="text-xl font-semibold text-neutral-900 mb-2">Completing authentication...</h2>
      <p class="text-neutral-600">Please wait while we finish setting up your account.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useSupabaseClient } from '#imports';

const supabase = useSupabaseClient();

onMounted(async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;

    if (user) {
      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          first_name: user.user_metadata.first_name || user.user_metadata.given_name || '',
          last_name: user.user_metadata.last_name || user.user_metadata.family_name || '',
          role: 'donor', // Default role for social auth
          avatar_url: user.user_metadata.avatar_url || user.user_metadata.picture || null
        });

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
    }

    // Redirect to home page
    navigateTo('/');
  } catch (error) {
    console.error('Error in callback:', error);
    navigateTo('/auth/login');
  }
});
</script>