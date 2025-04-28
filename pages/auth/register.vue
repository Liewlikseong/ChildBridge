<template>
    <div class="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 class="mt-4 text-center text-3xl font-bold text-neutral-900">Create an account</h2>
          <p class="mt-2 text-center text-sm text-neutral-600">
            Join ChildBridge to support children in need
          </p>
        </div>
        <div class="mt-8">
          <div class="rounded-md shadow-sm space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="first-name" class="block text-sm font-medium text-neutral-700 mb-1">First name</label>
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  required
                  v-model="firstName"
                  class="input"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label for="last-name" class="block text-sm font-medium text-neutral-700 mb-1">Last name</label>
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  required
                  v-model="lastName"
                  class="input"
                  placeholder="Enter your last name"
                />
              </div>
            </div>
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
              <label for="password" class="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                v-model="password"
                class="input"
                :class="{ 'border-error-500 focus:ring-error-500': errorMsg }"
                placeholder="Create a password (min. 8 characters)"
              />
            </div>
            <div>
              <label for="confirm-password" class="block text-sm font-medium text-neutral-700 mb-1">Confirm password</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                v-model="confirmPassword"
                class="input"
                :class="{ 'border-error-500 focus:ring-error-500': errorMsg }"
                placeholder="Confirm your password"
              />
            </div>
            <div>
              <label for="userType" class="block text-sm font-medium text-neutral-700 mb-1">Account Type</label>
              <select
                id="userType"
                name="userType"
                v-model="userType"
                class="input"
              >
                <option value="donor">Donor - Support children through donations</option>
                <option value="staff">Staff - Manage orphanage operations</option>
              </select>
            </div>
  
            <!-- Profile Picture Upload -->
            <div>
              <label for="profile-pic" class="block text-sm font-medium text-neutral-700 mb-1">Profile Picture</label>
              <input
                id="profile-pic"
                name="profile-pic"
                type="file"
                accept="image/*"
                @change="handleFileChange"
                class="input"
              />
            </div>
  
            <!-- Profile Picture Preview -->
            <div v-if="imagePreview" class="mt-4 text-center">
              <img :src="imagePreview" alt="Profile Preview" class="w-24 h-24 rounded-full object-cover" />
            </div>
  
          </div>
  
          <div class="mt-4">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  v-model="agreeToTerms"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-medium text-neutral-700">I agree to the 
                  <a href="#" class="text-primary-600 hover:text-primary-500">Terms of Service</a> and 
                  <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
                </label>
              </div>
            </div>
          </div>
  
          <div v-if="errorMsg" class="mt-4 text-sm text-error-600 bg-error-50 p-3 rounded-md">
            {{ errorMsg }}
          </div>
  
          <div class="mt-6">
            <button
              type="button"
              @click="register"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              :disabled="isLoading || !agreeToTerms"
              :class="{ 'opacity-70 cursor-not-allowed': !agreeToTerms }"
            >
              <span v-if="isLoading" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Creating account...' : 'Create account' }}
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
                @click="signUpWithGoogle"
                class="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              >
                <span class="sr-only">Sign up with Google</span>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google logo" />
              </button>
  
              <button
                type="button"
                @click="signUpWithFacebook"
                class="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50"
              >
                <span class="sr-only">Sign up with Facebook</span>
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" class="w-5 h-5" alt="Facebook logo" />
              </button>
            </div>
          </div>
        </div>
  
        <div class="text-center">
          <p class="text-sm text-neutral-600">
            Already have an account?
            <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
              Sign in
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
  layout: false,
});

const supabase = useSupabaseClient();
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const userType = ref('donor');
const agreeToTerms = ref(false);
const errorMsg = ref('');
const isLoading = ref(false);

// Avatar handling
const imageFile = ref(null);
const imagePreview = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imagePreview.value = URL.createObjectURL(file); // Set preview
    imageFile.value = file; // Store the file
  }
};

const register = async () => {
  errorMsg.value = '';
  isLoading.value = true;

  // Basic validation
  if (!firstName.value || !lastName.value) {
    errorMsg.value = 'Please enter your full name';
    isLoading.value = false;
    return;
  }

  if (!email.value) {
    errorMsg.value = 'Please enter your email address';
    isLoading.value = false;
    return;
  }

  if (password.value.length < 8) {
    errorMsg.value = 'Password must be at least 8 characters long';
    isLoading.value = false;
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match';
    isLoading.value = false;
    return;
  }

  if (!agreeToTerms.value) {
    errorMsg.value = 'You must agree to the Terms of Service and Privacy Policy';
    isLoading.value = false;
    return;
  }

  try {
    // Create the user account with Supabase auth
    const { error: authError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          first_name: firstName.value,
          last_name: lastName.value,
          role: userType.value,
        },
      },
    });

    if (authError) {
      errorMsg.value = authError.message || 'Failed to create account';
      isLoading.value = false;
      return;
    }

    // If profile picture exists, upload it to Supabase Storage
    if (imageFile.value) {
      const filePath = `avatars/${email.value}-${Date.now()}`;
      const { data, error: uploadError } = await supabase.storage
        .from('avatars') // Ensure you've created this bucket in Supabase
        .upload(filePath, imageFile.value);

      if (uploadError) {
        errorMsg.value = uploadError.message || 'Failed to upload profile picture';
        isLoading.value = false;
        return;
      }

      // Get the public URL of the uploaded image
      const avatarUrl = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath).publicURL;

      // Save the avatar URL in the user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([{
          email: email.value,
          first_name: firstName.value,
          last_name: lastName.value,
          role: userType.value,
          avatar_url: avatarUrl, // Store the URL of the profile pic
        }]);

      if (profileError) {
        console.error('Error updating profile with avatar:', profileError);
      }
    }

    navigateTo('/auth/confirm');
  } catch (error) {
    errorMsg.value = error.message || 'An unexpected error occurred';
  } finally {
    isLoading.value = false;
  }
};

// Google Sign-Up
const signUpWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      errorMsg.value = error.message;
    }
  } catch (error) {
    errorMsg.value = 'Failed to sign up with Google';
  }
};

// Facebook Sign-Up
const signUpWithFacebook = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'email,public_profile',
      },
    });

    if (error) {
      errorMsg.value = error.message;
    }
  } catch (error) {
    errorMsg.value = 'Failed to sign up with Facebook';
  }
};
</script>
