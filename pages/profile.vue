<template>
  <div class="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Account Settings</h1>

    <!-- Profile Card -->
    <div v-if="profileData" class="bg-white rounded-xl shadow p-4 flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <div class="h-32 w-32 rounded-full overflow-hidden bg-gray-100 relative group">
          <img 
            v-if="profileData?.avatar_url" 
            :src="profileData.avatar_url" 
            :alt="`${profileData?.first_name || 'User'}'s avatar`"
            class="h-full w-full object-cover"
            @error="handleImageError"
          />
          <img
            v-else-if="googleAvatar"
            :src="googleAvatar"
            :alt="`${profileData?.first_name || 'User'}'s Google avatar`"
            class="h-full w-full object-cover"
            @error="handleImageError"
          />
          <div 
            v-else 
            class="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600"
          >
            <i class="fas fa-user text-4xl"></i>
          </div>
          <!-- Change Picture Button -->
          <button v-if="profileData" @click="triggerFileInput" type="button" class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white bg-opacity-80 px-3 py-1 rounded shadow text-xs font-medium text-primary-700 border border-primary-200 hover:bg-primary-100 transition group-hover:opacity-100 opacity-0 group-hover:opacity-100">
            Change Picture
          </button>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
        </div>
        <div>
          <h2 class="text-lg font-semibold">
            {{ profileData?.first_name || '' }} {{ profileData?.last_name || '' }}
          </h2>
          <p class="text-sm text-gray-500">{{ profileData?.role || 'Donor' }}</p>
          <p class="text-sm text-gray-500">{{ profileData?.occupation || 'Occupation not set' }}</p>
        </div>
      </div>
      <button @click="navigateToEdit" class="text-sm text-blue-600 hover:underline flex items-center">
        <i class="fas fa-edit mr-1"></i> Edit
      </button>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="bg-white rounded-xl shadow p-4 mb-6">
      <div class="animate-pulse flex space-x-4">
        <div class="rounded-full bg-gray-200 h-32 w-32"></div>
        <div class="flex-1 space-y-4 py-1">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 rounded-xl shadow p-4 mb-6 text-red-600">
      {{ error }}
    </div>

    <!-- No Profile State -->
    <div v-else-if="!loading && !profileData" class="bg-gray-50 rounded-xl shadow p-4 mb-6">
      <div class="text-center">
        <i class="fas fa-user text-gray-400 text-3xl mb-4"></i>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">No Profile Found</h3>
        <p class="text-gray-600">Your profile information is not available.</p>
      </div>
    </div>

    <!-- Personal Information -->
    <div v-if="profileData" class="bg-white rounded-xl shadow p-4 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Personal information</h3>
        <button @click="navigateToEdit" class="text-sm text-blue-600 hover:underline flex items-center">
          <i class="fas fa-edit mr-1"></i> Edit
        </button>
      </div>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div><span class="font-medium">First Name:</span> {{ profileData?.first_name || 'Not set' }}</div>
        <div><span class="font-medium">Last Name:</span> {{ profileData?.last_name || 'Not set' }}</div>
        <div><span class="font-medium">Email Address:</span> {{ profileData?.email || 'Not set' }}</div>
        <div><span class="font-medium">Role:</span> {{ profileData?.role || 'Donor' }}</div>
        <div><span class="font-medium">Gender:</span> {{ profileData?.gender || 'Not set' }}</div>
        <div><span class="font-medium">Birth Date:</span> {{ formatDate(profileData?.birth_date) || 'Not set' }}</div>
        <div><span class="font-medium">Occupation:</span> {{ profileData?.occupation || 'Not set' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabaseClient, useSupabaseUser, useRouter } from '#imports';
import { useProfile } from '~/composables/useProfile';

definePageMeta({
  middleware: ['auth']
});

const router = useRouter();
const { profile: profileData, loading, error, fetchProfile } = useProfile();
const googleAvatar = ref(null);
const hasImageError = ref(false);
const fileInput = ref(null);
const uploadingAvatar = ref(false);
const avatarUploadError = ref('');
const avatarUploadSuccess = ref('');

const handleImageError = () => {
  hasImageError.value = true;
};

const navigateToEdit = () => {
  router.push('/profile-edit');
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};



const triggerFileInput = () => {
  avatarUploadError.value = '';
  avatarUploadSuccess.value = '';
  fileInput.value?.click();
};

const handleFileChange = async (event) => {
  avatarUploadError.value = '';
  avatarUploadSuccess.value = '';
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    avatarUploadError.value = 'Please select a valid image file.';
    return;
  }
  uploadingAvatar.value = true;
  try {
    const supabase = useSupabaseClient();
    const user = await supabase.auth.getUser();
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${user.data.user.id}_${Date.now()}.${fileExt}`;
    // Upload to Supabase Storage (bucket: 'avatars')
    let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) {
      avatarUploadError.value = uploadError.message || 'Failed to upload image.';
      uploadingAvatar.value = false;
      return;
    }
    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) {
      avatarUploadError.value = 'Failed to get image URL.';
      uploadingAvatar.value = false;
      return;
    }
    // Update profile
    const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.data.user.id);
    if (updateError) {
      avatarUploadError.value = updateError.message || 'Failed to update profile.';
    } else {
      avatarUploadSuccess.value = 'Profile picture updated!';
      await fetchProfile();
    }
  } catch (err) {
    avatarUploadError.value = err.message || 'Failed to upload image.';
  } finally {
    uploadingAvatar.value = false;
  }
};

onMounted(async () => {
  try {
    const { data: { user } } = await useSupabaseClient().auth.getUser();
    if (user?.app_metadata?.provider === 'google' && user?.user_metadata?.avatar_url) {
      googleAvatar.value = user.user_metadata.avatar_url;
    }
    await fetchProfile();
  } catch (err) {
    console.error('Error in profile setup:', err);
  }
});
</script>
