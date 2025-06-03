<template>
  <div class="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div class="max-w-md w-full">
      <div class="bg-white p-8 rounded-xl shadow-md text-center">
        <!-- Success Icon -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg class="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>

        <!-- Title and Description -->
        <h2 class="text-2xl font-bold text-neutral-900 mb-2">Check your email</h2>
        <p class="text-neutral-600 mb-6">
          We've sent a verification link to <strong>{{ email }}</strong>
        </p>

        <!-- Instructions -->
        <div class="bg-blue-50 p-4 rounded-lg mb-6 text-left">
          <h3 class="font-semibold text-blue-900 mb-2">What to do next:</h3>
          <ol class="text-sm text-blue-800 space-y-1">
            <li>1. Check your email inbox</li>
            <li>2. Look for an email from ChildBridge</li>
            <li>3. Click the verification link</li>
            <li>4. You'll be redirected back to sign in</li>
          </ol>
        </div>

        <!-- Resend Email Button -->
        <div class="space-y-4">
          <button
            @click="resendVerification"
            :disabled="resendLoading || resendCooldown > 0"
            class="w-full btn btn-outline"
            :class="{ 'opacity-50 cursor-not-allowed': resendLoading || resendCooldown > 0 }"
          >
            <span v-if="resendLoading">Sending...</span>
            <span v-else-if="resendCooldown > 0">Resend in {{ resendCooldown }}s</span>
            <span v-else>Resend verification email</span>
          </button>

          <!-- Success/Error Messages -->
          <div v-if="resendSuccess" class="text-green-600 text-sm bg-green-50 p-3 rounded">
            Verification email sent successfully!
          </div>
          <div v-if="resendError" class="text-red-600 text-sm bg-red-50 p-3 rounded">
            {{ resendError }}
          </div>
        </div>

        <!-- Help Text -->
        <div class="mt-8 pt-6 border-t border-neutral-200">
          <p class="text-sm text-neutral-500 mb-4">
            Can't find the email? Check your spam folder or try a different email address.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink 
              to="/auth/login" 
              class="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              Back to sign in
            </NuxtLink>
            <span class="hidden sm:inline text-neutral-300">•</span>
            <NuxtLink 
              to="/contact" 
              class="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              Need help?
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useSupabaseClient } from '#imports';

// Get email from route query
const route = useRoute();
const supabase = useSupabaseClient();

const email = ref(route.query.email || '');
const resendLoading = ref(false);
const resendSuccess = ref(false);
const resendError = ref('');
const resendCooldown = ref(0);

let cooldownInterval = null;

const startCooldown = () => {
  resendCooldown.value = 60; // 60 seconds cooldown
  cooldownInterval = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval);
    }
  }, 1000);
};

const resendVerification = async () => {
  if (!email.value) {
    resendError.value = 'Email address not found. Please try registering again.';
    return;
  }

  resendLoading.value = true;
  resendError.value = '';
  resendSuccess.value = false;

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.value
    });

    if (error) throw error;

    resendSuccess.value = true;
    startCooldown();
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      resendSuccess.value = false;
    }, 5000);

  } catch (error) {
    console.error('Error resending verification:', error);
    resendError.value = 'Failed to resend verification email. Please try again.';
  } finally {
    resendLoading.value = false;
  }
};

// Set page title
useHead({
  title: 'Verify Your Email - ChildBridge'
});

// Redirect if no email provided
onMounted(() => {
  if (!email.value) {
    navigateTo('/auth/register');
  }
});

// Cleanup interval
onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval);
  }
});
</script>
