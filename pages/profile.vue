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
      <div class="grid grid-cols-1 gap-4 text-sm">
        <!-- Row 1 -->
        <div class="grid grid-cols-2 gap-4">
          <div><span class="font-medium">First Name:</span> {{ profileData?.first_name || 'Not set' }}</div>
          <div><span class="font-medium">Last Name:</span> {{ profileData?.last_name || 'Not set' }}</div>
        </div>
        
        <!-- Row 2 -->
        <div class="grid grid-cols-2 gap-4">
          <div><span class="font-medium">Email Address:</span> {{ profileData?.email || 'Not set' }}</div>
          <div><span class="font-medium">Role:</span> {{ profileData?.role || 'Donor' }}</div>
        </div>

        <!-- Phone Number - Full Width Row -->
        <div class="border-t pt-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <span class="font-medium">Phone Number:</span>
              <span class="ml-2">{{ formatPhoneNumber(profileData?.phone_number) || 'Not set' }}</span>
            </div>
            <div v-if="profileData?.phone_number" class="flex items-center space-x-3">
              <!-- Verification Status Badge -->
              <span v-if="isPhoneVerified" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Verified
              </span>
              <span v-else class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                Not Verified
              </span>
              
              <!-- Verify Button for Unverified Numbers -->
              <button
                v-if="!isPhoneVerified"
                @click="goToPhoneVerification"
                class="text-xs text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                Verify Now
              </button>
            </div>
            <div v-else class="text-gray-500">
              <button
                @click="navigateToEdit"
                class="text-xs text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                Add Phone Number
              </button>
            </div>
          </div>
        </div>

        <!-- Row 3 -->
        <div class="grid grid-cols-2 gap-4">
          <div><span class="font-medium">Gender:</span> {{ profileData?.gender || 'Not set' }}</div>
          <div><span class="font-medium">Birth Date:</span> {{ formatDate(profileData?.birth_date) || 'Not set' }}</div>
        </div>

        <!-- Row 4 -->
        <div>
          <span class="font-medium">Occupation:</span> {{ profileData?.occupation || 'Not set' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSupabaseClient, useSupabaseUser, useRouter } from '#imports';
import { useProfile } from '~/composables/useProfile';

definePageMeta({
  middleware: ['auth']
});

const router = useRouter();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { profile: profileData, loading, error, fetchProfile } = useProfile();
const googleAvatar = ref(null);
const hasImageError = ref(false);
const fileInput = ref(null);
const uploadingAvatar = ref(false);
const avatarUploadError = ref('');
const avatarUploadSuccess = ref('');

// Computed property to check phone verification status
const isPhoneVerified = computed(() => {
  // Method 1: Check if phone_verified column exists and is true
  if (profileData.value?.phone_verified === true) {
    return true;
  }
  
  // Method 2: Check Supabase Auth phone confirmation
  if (user.value?.phone_confirmed_at) {
    return true;
  }
  
  return false;
});

const handleImageError = () => {
  hasImageError.value = true;
};

const navigateToEdit = () => {
  router.push('/profile-edit');
};

const goToPhoneVerification = () => {
  if (profileData.value?.phone_number) {
    // Navigate to verification with pre-filled phone number
    const params = new URLSearchParams({
      phone: profileData.value.phone_number
    });
    router.push(`/auth/verify-phone?${params.toString()}`);
  } else {
    // Navigate to edit profile to add phone number first
    router.push('/profile-edit');
  }
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

// Format phone number for display
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return null;
  
  // If it's already formatted or short, return as is
  if (phoneNumber.length <= 10) return phoneNumber;
  
  // For international numbers, add some basic formatting
  if (phoneNumber.startsWith('+')) {
    // Handle Malaysia (+60) specifically: +60123456789 -> +60 12 345 6789
    if (phoneNumber.startsWith('+60')) {
      const number = phoneNumber.substring(3); // Remove +60
      if (number.length >= 9) {
        return `+60 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
      }
    }
    // Handle other countries with similar format
    else if (phoneNumber.startsWith('+65')) {
      // Singapore: +6512345678 -> +65 1234 5678
      const number = phoneNumber.substring(3);
      if (number.length >= 8) {
        return `+65 ${number.substring(0, 4)} ${number.substring(4)}`;
      }
    }
    else if (phoneNumber.startsWith('+1')) {
      // US/Canada: +12345678901 -> +1 234 567 8901
      const number = phoneNumber.substring(2);
      if (number.length >= 10) {
        return `+1 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
      }
    }
    else if (phoneNumber.startsWith('+44')) {
      // UK: +441234567890 -> +44 1234 567 890
      const number = phoneNumber.substring(3);
      if (number.length >= 10) {
        return `+44 ${number.substring(0, 4)} ${number.substring(4, 7)} ${number.substring(7)}`;
      }
    }
    else {
      // Generic format for other countries: +XX XXX XXX XXX
      const countryCode = phoneNumber.substring(0, 3);
      const number = phoneNumber.substring(3);
      
      if (number.length >= 9) {
        return `${countryCode} ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
      }
    }
  }
  
  return phoneNumber;
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
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.app_metadata?.provider === 'google' && user?.user_metadata?.avatar_url) {
      googleAvatar.value = user.user_metadata.avatar_url;
    }
    await fetchProfile();
  } catch (err) {
    console.error('Error in profile setup:', err);
  }
});
</script>