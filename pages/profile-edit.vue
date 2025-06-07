<template>
  <div class="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Edit Profile</h1>
      <button @click="navigateBack" class="text-sm text-gray-600 hover:text-gray-900">
        <i class="fas fa-arrow-left mr-1"></i> Back to Profile
      </button>
    </div>

    <div v-if="loading" class="bg-white rounded-xl shadow p-6 mb-6">
      <div class="animate-pulse space-y-4">
        <div class="h-32 w-32 bg-gray-200 rounded-full mx-auto"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <form v-else @submit.prevent="saveChanges">
      <!-- Profile Picture Section -->
      <div class="bg-white rounded-xl shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Profile Picture</h2>
        <div class="flex items-center space-x-6">
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <div v-if="avatarPreview" class="mb-4">
                <img :src="avatarPreview" alt="Avatar Preview" class="mx-auto h-32 w-32 object-cover rounded-full" @error="handleImageError" />
              </div>
              <div class="flex text-sm text-neutral-600">
                <label for="avatar-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                  <span>Upload a photo</span>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    class="sr-only" 
                    @change="handleAvatarUpload"
                    accept="image/*"
                  />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-neutral-500">
                PNG, JPG, GIF up to 6MB
              </p>
              <button
                v-if="formData.avatarUrl"
                type="button"
                @click="removeAvatar"
                class="mt-2 text-sm text-red-600 hover:text-red-500"
              >
                Remove photo
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Information Section -->
      <div class="bg-white rounded-xl shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Personal Information</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              v-model="formData.firstName"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              v-model="formData.lastName"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              v-model="formData.email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              v-model="formData.phone"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>
      </div>

      <!-- Address Section -->
      <div class="bg-white rounded-xl shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Address</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              v-model="formData.country"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              v-model="formData.city"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
            <input
              type="text"
              v-model="formData.state"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="navigateBack"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          :disabled="loading || isSaving"
        >
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabaseClient, useRouter } from '#imports';
import { v4 as uuidv4 } from 'uuid';
import { useProfile } from '~/composables/useProfile';

definePageMeta({
  middleware: ['auth']
});

const router = useRouter();
const supabase = useSupabaseClient();
const isSaving = ref(false);
const error = ref('');
const avatarPreview = ref(null);
const avatarUploadProgress = ref(0);
const hasImageError = ref(false);
const { profile, loading, fetchProfile, updateProfile } = useProfile();

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  state: '',
  avatarUrl: ''
});

const handleImageError = () => {
  hasImageError.value = true;
};

const navigateBack = () => {
  router.push('/profile');
};

// Load user data on mount
onMounted(async () => {
  try {
    const { profile: userData } = await fetchProfile();
    if (userData) {
      formData.value = {
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        country: userData.country || '',
        city: userData.city || '',
        state: userData.state || '',
        avatarUrl: userData.avatar_url || ''
      };

      if (userData.avatar_url) {
        avatarPreview.value = userData.avatar_url;
      }
    }
  } catch (err) {
    console.error('Error loading profile:', err);
    error.value = 'Failed to load profile data';
  }
});

// Handle avatar upload
const handleAvatarUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Reset states
  avatarPreview.value = null;
  avatarUploadProgress.value = 0;
  error.value = '';
  hasImageError.value = false;

  // Validate file type and size
  if (!file.type.startsWith('image/')) {
    error.value = 'Please upload an image file';
    return;
  }

  if (file.size > 6 * 1024 * 1024) {
    error.value = 'Image file size must be less than 6MB';
    return;
  }

  // Create preview
  avatarPreview.value = URL.createObjectURL(file);
  avatarUploadProgress.value = 50;

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (!publicUrl) throw new Error('Failed to get public URL for uploaded file');

    formData.value.avatarUrl = publicUrl;
    avatarUploadProgress.value = 100;

    setTimeout(() => {
      avatarUploadProgress.value = 0;
    }, 1000);

  } catch (uploadError) {
    console.error('Error uploading avatar:', uploadError);
    error.value = `Failed to upload avatar: ${uploadError.message}`;
    removeAvatar();
  }
};

const removeAvatar = () => {
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value);
  }
  avatarPreview.value = null;
  formData.value.avatarUrl = '';
  avatarUploadProgress.value = 0;
  hasImageError.value = false;
  
  const fileInput = document.getElementById('avatar-upload');
  if (fileInput) {
    fileInput.value = '';
  }
};

const saveChanges = async () => {
  isSaving.value = true;
  error.value = '';

  try {
    const updates = {
      first_name: formData.value.firstName?.trim(),
      last_name: formData.value.lastName?.trim(),
      email: formData.value.email?.trim(),
      phone: formData.value.phone?.trim(),
      country: formData.value.country?.trim(),
      city: formData.value.city?.trim(),
      state: formData.value.state?.trim(),
      avatar_url: formData.value.avatarUrl,
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await updateProfile(updates);
    if (updateError) throw updateError;

    // Navigate back to profile page
    router.push('/profile');
  } catch (err) {
    console.error('Error updating profile:', err);
    error.value = 'Failed to update profile';
  } finally {
    isSaving.value = false;
  }
};
</script> 