<template>
  <div>
    <h2 class="text-lg font-medium text-gray-900">Create New User Profile</h2>
    <p class="mt-1 text-sm text-gray-600 mb-6">Fill out the form below to create a new staff or donor account.</p>
    <form @submit.prevent="createUser" class="space-y-6">
      <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
          <input type="text" v-model="formData.firstName" id="firstName" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
        </div>
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
          <input type="text" v-model="formData.lastName" id="lastName" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
        </div>
        <div class="sm:col-span-2">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" v-model="formData.email" id="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
        </div>
        <div class="sm:col-span-2">
          <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
          <select v-model="formData.role" id="role" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
            <option value="" disabled>Select a role</option>
            <option value="staff">Staff</option>
            <option value="donor">Donor</option>
          </select>
        </div>
      </div>
      <div class="flex justify-end pt-6">
        <button type="button" @click="$router.back()" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Cancel
        </button>
        <button type="submit" :disabled="loading" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400">
          {{ loading ? 'Sending Invitation...' : 'Send Invitation' }}
        </button>
      </div>
      <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
      <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
});

const router = useRouter();
const loading = ref(false);
const error = ref(null);
const successMessage = ref('');

const formData = ref({
  email: '',
  firstName: '',
  lastName: '',
  role: ''
});

const createUser = async () => {
  loading.value = true;
  error.value = null;
  successMessage.value = '';

  try {
    const response = await $fetch('/api/users/create', {
      method: 'POST',
      body: formData.value
    });
    successMessage.value = response.message || 'Invitation sent successfully!';
    // Reset form
    formData.value = { email: '', firstName: '', lastName: '', role: '' };
  } catch (err) {
    error.value = err.data?.statusMessage || 'An unexpected error occurred.';
  } finally {
    loading.value = false;
  }
};
</script> 