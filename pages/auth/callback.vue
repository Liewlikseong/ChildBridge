<template>
  <div class="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
      
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
        <h2 class="text-xl font-semibold text-neutral-900">{{ loadingMessage }}</h2>
        <p class="text-neutral-600">Please wait while we finish setting up your account.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success && !error" class="space-y-4">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-neutral-900">{{ successMessage }}</h2>
        <p class="text-neutral-600">Redirecting you to the homepage...</p>
        <div class="pt-2">
          <div class="w-full bg-neutral-200 rounded-full h-2">
            <div 
              class="bg-primary-600 h-2 rounded-full transition-all duration-300" 
              :style="{ width: `${redirectProgress}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="space-y-4">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-neutral-900">Authentication failed</h2>
        <p class="text-neutral-600 text-sm">{{ error }}</p>
        <div class="pt-4 space-y-2">
          <NuxtLink to="/auth/login" class="btn btn-primary block w-full">
            Try Signing In
          </NuxtLink>
          <NuxtLink to="/auth/register" class="text-sm text-primary-600 hover:text-primary-500">
            Create a new account
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabaseClient } from '#imports';

const supabase = useSupabaseClient();

const loading = ref(true);
const success = ref(false);
const error = ref('');
const loadingMessage = ref('Completing authentication...');
const successMessage = ref('Authentication successful!');
const redirectProgress = ref(0);

let redirectInterval = null;

const startRedirectProgress = () => {
  redirectProgress.value = 0;
  redirectInterval = setInterval(() => {
    redirectProgress.value += 4;
    if (redirectProgress.value >= 100) {
      clearInterval(redirectInterval);
      navigateTo('/');
    }
  }, 100); // 2.5 second total redirect time
};

onMounted(async () => {
  try {
    loadingMessage.value = 'Verifying authentication...';
    
    // Get current user session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;

    if (user) {
      loadingMessage.value = 'Setting up your profile...';
      
      // Check if profile exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error('Error checking profile:', profileCheckError);
      }

      // Create or update profile
      const profileData = {
        id: user.id,
        email: user.email,
        first_name: user.user_metadata.given_name || 
                   user.user_metadata.first_name || 
                   user.user_metadata.name?.split(' ')[0] || '',
        last_name: user.user_metadata.family_name || 
                  user.user_metadata.last_name || 
                  user.user_metadata.name?.split(' ').slice(1).join(' ') || '',
        role: user.user_metadata.role || 'donor', // Use role from registration or default to donor
        avatar_url: user.user_metadata.avatar_url || 
                   user.user_metadata.picture || null,
        gender: user.user_metadata.gender || null, 
        birth_date: user.user_metadata.birth_date || null,
        occupation: user.user_metadata.occupation || null
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (profileError) {
        console.error('Error updating profile:', profileError);
        // Don't throw error, continue with authentication
      }

      // Determine success message based on auth method
      if (user.app_metadata.provider === 'email') {
        successMessage.value = 'Email verified successfully!';
      } else {
        successMessage.value = `Welcome! Signed in with ${user.app_metadata.provider || 'social media'}.`;
      }

      loading.value = false;
      success.value = true;
      
      // Start redirect progress
      startRedirectProgress();
    } else {
      throw new Error('No user found after authentication');
    }
  } catch (authError) {
    console.error('Error in callback:', authError);
    loading.value = false;
    error.value = authError.message || 'Authentication failed. Please try again.';
  }
});

// Cleanup interval on unmount
onUnmounted(() => {
  if (redirectInterval) {
    clearInterval(redirectInterval);
  }
});

// Set page title
useHead({
  title: 'Completing Sign In - ChildBridge'
});
</script>