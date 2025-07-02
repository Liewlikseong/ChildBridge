<template>
  <div>
    <h2 class="text-lg font-medium text-gray-900">Create New Admin Account</h2>
    <p class="mt-1 text-sm text-gray-600 mb-6">Fill out the form below to create a new administrator account. You can set a custom password for the admin.</p>
    <form @submit.prevent="createAdmin" class="space-y-6">
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
        <div class="mt-1">
          <input v-model="firstName" id="firstName" name="firstName" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
        </div>
      </div>
      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
        <div class="mt-1">
          <input v-model="lastName" id="lastName" name="lastName" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
        </div>
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
        <div class="mt-1">
          <input v-model="email" id="email" name="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
        </div>
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <div class="mt-1">
          <input v-model="password" id="password" name="password" type="password" required minlength="6" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
        </div>
        <p class="mt-1 text-sm text-gray-500">Password must be at least 6 characters long</p>
      </div>
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
        <div class="mt-1">
          <input v-model="confirmPassword" id="confirmPassword" name="confirmPassword" type="password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
        </div>
      </div>
      
      <!-- Information box -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-semibold text-blue-800 mb-2">What happens next?</h3>
        <ul class="text-sm text-blue-700 space-y-1">
          <li>• An admin account will be created with the provided email and password</li>
          <li>• The admin can log in immediately with the provided credentials</li>
          <li>• The admin should change their password after first login for security</li>
          <li>• You can share the credentials securely with the new admin</li>
        </ul>
      </div>
      
      <div>
        <button type="submit" :disabled="loading || !passwordsMatch" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400">
          {{ loading ? 'Creating Admin Account...' : 'Create Admin Account' }}
        </button>
      </div>
    </form>
    <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    <p v-if="!passwordsMatch && confirmPassword" class="text-red-500 mt-2">Passwords do not match</p>
    <div v-if="successMessage" class="mt-4">
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 class="font-semibold text-green-800 mb-2">Admin Account Created Successfully!</h3>
        <p class="text-sm text-green-700 mb-3">{{ successMessage }}</p>
        <div class="bg-white border border-green-300 rounded p-3">
          <p class="text-sm font-medium text-green-800 mb-1">Login Credentials:</p>
          <p class="text-sm text-green-700"><strong>Email:</strong> {{ createdEmail }}</p>
          <p class="text-sm text-green-700"><strong>Password:</strong> {{ createdPassword }}</p>
        </div>
        <p class="text-xs text-green-600 mt-2">Please share these credentials securely with the admin.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from '#imports';

definePageMeta({
  layout: 'admin',
  middleware: ['auth'] 
});

const router = useRouter();
const email = ref('');
const firstName = ref('');
const lastName = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref(null);
const successMessage = ref('');
const createdEmail = ref('');
const createdPassword = ref('');

const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value && password.value.length >= 6;
});

const createAdmin = async () => {
  if (!passwordsMatch.value) {
    error.value = 'Passwords do not match or are too short';
    return;
  }

  loading.value = true;
  error.value = null;
  successMessage.value = '';
  createdEmail.value = '';
  createdPassword.value = '';

  try {
    const response = await $fetch('/api/admin/create-user', {
      method: 'POST',
      body: {
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        password: password.value,
      },
    });
    successMessage.value = response.message || 'Admin account created successfully!';
    createdEmail.value = response.email;
    createdPassword.value = response.password;
    
    // Clear form
    email.value = '';
    firstName.value = '';
    lastName.value = '';
    password.value = '';
    confirmPassword.value = '';
  } catch (err) {
    error.value = err.data?.statusMessage || 'An unexpected error occurred.';
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  router.push('/admin/profile');
};
</script> 