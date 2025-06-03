<template>
  <div class="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
      <div>
        <h2 class="mt-4 text-center text-3xl font-bold text-neutral-900">Welcome back</h2>
        <p class="mt-2 text-center text-sm text-neutral-600">
          Sign in to your ChildBridge account
        </p>
      </div>

      <form @submit.prevent="login" class="mt-8 space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-neutral-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="input mt-1"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-neutral-700">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="input mt-1"
          />
        </div>

        <div v-if="error" class="text-error-600 text-sm bg-error-50 p-3 rounded">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full btn btn-primary"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-neutral-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-neutral-500">Or continue with</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="signInWithGoogle"
            class="btn btn-outline flex justify-center items-center"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5 mr-2" />
            Google
          </button>
          <button
            type="button"
            @click="signInWithFacebook"
            class="btn btn-outline flex justify-center items-center"
          >
            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" class="w-5 h-5 mr-2" />
            Facebook
          </button>
        </div>

        <p class="text-center text-sm text-neutral-600">
          Don't have an account?
          <NuxtLink to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSupabaseClient } from '#imports';

const supabase = useSupabaseClient();
const loading = ref(false);
const error = ref('');
const email = ref('');
const password = ref('');

const login = async () => {
  loading.value = true;
  error.value = '';

  try {
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });

    if (signInError) throw signInError;

    if (user) {
      navigateTo('/');
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const signInWithGoogle = async () => {
  try {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (authError) throw authError;
  } catch (err) {
    error.value = 'Failed to sign in with Google';
  }
};

const signInWithFacebook = async () => {
  try {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (authError) throw authError;
  } catch (err) {
    error.value = 'Failed to sign in with Facebook';
  }
};
</script>