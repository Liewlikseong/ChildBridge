<template>
    <div class="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 class="mt-4 text-center text-3xl font-bold text-neutral-900">Welcome back</h2>
          <p class="mt-2 text-center text-sm text-neutral-600">
            Sign in to your ChildBridge account
          </p>
        </div>
        <div class="mt-8">
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-neutral-700 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="email"
                class="input"
                :class="{ 'border-error-500 focus:ring-error-500': errorMsg }"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                <a href="#" class="text-sm font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                v-model="password"
                class="input"
                :class="{ 'border-error-500 focus:ring-error-500': errorMsg }"
                placeholder="Enter your password"
              />
            </div>
          </div>
  
          <div v-if="errorMsg" class="mt-4 text-sm text-error-600 bg-error-50 p-3 rounded-md">
            {{ errorMsg }}
          </div>
  
          <div class="mt-6">
            <button
              type="submit"
              @click="login"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
  
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-neutral-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-neutral-500">Or continue with</span>
              </div>
            </div>
  
            <div class="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="signInWithGoogle"
                class="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              >
                <span class="sr-only">Sign in with Google</span>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google logo" />
              </button>
  
              <button
                type="button"
                @click="signInWithFacebook"
                class="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              >
                <span class="sr-only">Sign in with Facebook</span>
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" class="w-5 h-5" alt="Facebook logo" />
              </button>
            </div>
          </div>
        </div>
  
        <div class="text-center">
          <p class="text-sm text-neutral-600">
            Don't have an account?
            <NuxtLink to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
              Sign up
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useSupabaseClient } from '#imports';
  
  definePageMeta({
    layout: false
  });
  
  const supabase = useSupabaseClient();
  const email = ref('');
  const password = ref('');
  const errorMsg = ref('');
  const isLoading = ref(false);
  
  const login = async () => {
    errorMsg.value = '';
    isLoading.value = true;
  
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      });
  
      if (error) {
        errorMsg.value = error.message || 'Failed to sign in';
        return;
      }
  
      navigateTo('/');
    } catch (error) {
      errorMsg.value = error.message || 'An unexpected error occurred';
    } finally {
      isLoading.value = false;
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
  
      if (error) {
        errorMsg.value = error.message;
      }
    } catch (error) {
      errorMsg.value = 'Failed to sign in with Google';
    }
  };
  
  const signInWithFacebook = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
  
      if (error) {
        errorMsg.value = error.message;
      }
    } catch (error) {
      errorMsg.value = 'Failed to sign in with Facebook';
    }
  };
  </script>