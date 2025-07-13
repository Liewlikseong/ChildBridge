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
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
            <div class="relative">
              <div class="flex">
                <!-- Country Code Selector -->
                <select
                  v-model="selectedCountryCode"
                  class="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50 text-sm"
                  style="min-width: 100px;"
                >
                  <option v-for="country in popularCountries" :key="country.code" :value="country.code">
                    {{ country.flag }} {{ country.code }}
                  </option>
                </select>
                <!-- Phone Number Input -->
                <input
                  type="tel"
                  v-model="phoneNumberWithoutCode"
                  class="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  :placeholder="getPlaceholderForCountry(selectedCountryCode)"
                  @input="formatPhoneNumberInput"
                />
              </div>
              <!-- Verification Status & Button -->
              <div v-if="formData.phoneNumber" class="mt-2 flex items-center justify-between">
                <div class="flex items-center">
                  <div v-if="profile?.phone_verified" class="flex items-center text-green-600 text-sm">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Verified
                  </div>
                  <div v-else class="flex items-center text-amber-600 text-sm">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                    Not verified
                  </div>
                </div>
                <button
                  v-if="!profile?.phone_verified && isValidPhoneNumber(formData.phoneNumber)"
                  type="button"
                  @click="verifyPhone"
                  class="text-sm text-primary-600 hover:text-primary-700 font-medium border border-primary-200 px-3 py-1 rounded-md hover:bg-primary-50 transition-colors"
                >
                  Verify Now
                </button>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Select your country and enter your phone number
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              v-model="formData.gender"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
            <input
              type="date"
              v-model="formData.birthDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
            <input
              type="text"
              v-model="formData.occupation"
              placeholder="e.g., Software Engineer, Teacher, Student"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      <!-- Change Password Section -->
      <div class="bg-white rounded-xl shadow p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Change Password</h2>
        <form @submit.prevent="changePassword" class="space-y-4 max-w-md">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
            <input type="password" v-model="currentPassword" id="currentPassword" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
          </div>
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" v-model="newPassword" id="newPassword" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input type="password" v-model="confirmPassword" id="confirmPassword" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
          </div>
          <div class="flex items-center space-x-2">
            <button type="submit" :disabled="changingPassword" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400">
              {{ changingPassword ? 'Changing...' : 'Change Password' }}
            </button>
            <span v-if="passwordSuccess" class="text-green-600 text-sm">{{ passwordSuccess }}</span>
            <span v-if="passwordError" class="text-red-600 text-sm">{{ passwordError }}</span>
          </div>
        </form>
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
import { ref, onMounted, watch } from 'vue'; // ✅ Import watch here
import { useSupabaseClient, useRouter, navigateTo } from '#imports'; // ✅ Add navigateTo import
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
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const changingPassword = ref(false);
const passwordError = ref('');
const passwordSuccess = ref('');
const { profile, loading, fetchProfile, updateProfile } = useProfile();

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  gender: '',
  birthDate: '',
  occupation: '',
  avatarUrl: ''
});

// Phone number state
const selectedCountryCode = ref('+60'); // Default to Malaysia
const phoneNumberWithoutCode = ref('');

// Popular countries for the dropdown
const popularCountries = [
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪' },
  { code: '+47', name: 'Norway', flag: '🇳🇴' },
  { code: '+45', name: 'Denmark', flag: '🇩🇰' },
  { code: '+852', name: 'Hong Kong', flag: '🇭🇰' },
  { code: '+886', name: 'Taiwan', flag: '🇹🇼' }
];

const handleImageError = () => {
  hasImageError.value = true;
};

const navigateBack = () => {
  router.push('/profile');
};

// Phone number formatting functions
const getPlaceholderForCountry = (countryCode) => {
  const placeholders = {
    '+60': '123456789',
    '+65': '12345678',
    '+1': '2345678901',
    '+44': '7123456789',
    '+86': '13123456789',
    '+91': '9876543210',
    '+81': '9012345678',
    '+82': '1012345678',
    '+61': '412345678',
    '+49': '15123456789',
    '+33': '612345678',
    '+39': '3123456789',
    '+34': '612345678',
    '+31': '612345678',
    '+41': '791234567',
    '+46': '701234567',
    '+47': '40123456',
    '+45': '20123456',
    '+852': '91234567',
    '+886': '912345678'
  };
  return placeholders[countryCode] || '123456789';
};

const formatPhoneNumberInput = () => {
  // Remove any non-digit characters
  phoneNumberWithoutCode.value = phoneNumberWithoutCode.value.replace(/\D/g, '');
  
  // Update the complete phone number
  updateCompletePhoneNumber();
};

const updateCompletePhoneNumber = () => {
  if (phoneNumberWithoutCode.value) {
    formData.value.phoneNumber = selectedCountryCode.value + phoneNumberWithoutCode.value;
  } else {
    formData.value.phoneNumber = '';
  }
};

// Watch for country code changes - ✅ Now using proper ES import
watch(selectedCountryCode, () => {
  updateCompletePhoneNumber();
});

// Parse existing phone number when loading profile
const parseExistingPhoneNumber = (fullPhoneNumber) => {
  if (!fullPhoneNumber) return;
  
  // Find matching country code
  const matchingCountry = popularCountries.find(country => 
    fullPhoneNumber.startsWith(country.code)
  );
  
  if (matchingCountry) {
    selectedCountryCode.value = matchingCountry.code;
    phoneNumberWithoutCode.value = fullPhoneNumber.substring(matchingCountry.code.length);
  } else {
    // Fallback: try to extract country code
    const match = fullPhoneNumber.match(/^(\+\d{1,4})(.*)$/);
    if (match) {
      selectedCountryCode.value = match[1];
      phoneNumberWithoutCode.value = match[2];
    } else {
      // If no country code found, assume it's Malaysia and add +60
      selectedCountryCode.value = '+60';
      phoneNumberWithoutCode.value = fullPhoneNumber.replace(/^\+?60?/, '');
    }
  }
};

// Validate phone number format
const isValidPhoneNumber = (phone) => {
  if (!phone) return true; // Optional field
  // E.164 format: +[1-9]\d{1,14}
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Load user data on mount
onMounted(async () => {
  try {
    await fetchProfile();
    const userData = profile.value;
    if (userData) {
      formData.value = {
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        phoneNumber: userData.phone_number || '',
        gender: userData.gender || '',
        birthDate: userData.birth_date || '',
        occupation: userData.occupation || '',
        avatarUrl: userData.avatar_url || ''
      };
      
      // Parse existing phone number
      if (userData.phone_number) {
        parseExistingPhoneNumber(userData.phone_number);
      }
      
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

const changePassword = async () => {
  passwordError.value = '';
  passwordSuccess.value = '';
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    passwordError.value = 'All fields are required.';
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'New passwords do not match.';
    return;
  }
  if (newPassword.value.length < 6) {
    passwordError.value = 'New password must be at least 6 characters.';
    return;
  }
  changingPassword.value = true;
  try {
    // Re-authenticate user
    const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
      email: profile.value.email,
      password: currentPassword.value
    });
    if (signInError || !session) {
      passwordError.value = 'Current password is incorrect.';
      changingPassword.value = false;
      return;
    }
    // Update password
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword.value });
    if (updateError) {
      passwordError.value = updateError.message || 'Failed to change password.';
    } else {
      passwordSuccess.value = 'Password changed successfully!';
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
    }
  } catch (err) {
    passwordError.value = err.message || 'Failed to change password.';
  } finally {
    changingPassword.value = false;
  }
};

// Verify phone number
const verifyPhone = () => {
  if (!isValidPhoneNumber(formData.value.phoneNumber)) {
    error.value = 'Please enter a valid phone number before verification';
    return;
  }
  
  const params = new URLSearchParams({
    phone: formData.value.phoneNumber
  });
  navigateTo(`/auth/verify-phone?${params.toString()}`);
};

const saveChanges = async () => {
  // Validate phone number format if provided
  if (formData.value.phoneNumber && !isValidPhoneNumber(formData.value.phoneNumber)) {
    error.value = 'Please enter a valid phone number in international format (e.g., +60123456789)';
    return;
  }

  isSaving.value = true;
  error.value = '';

  try {
    const updates = {
      first_name: formData.value.firstName?.trim(),
      last_name: formData.value.lastName?.trim(),
      email: formData.value.email?.trim(),
      phone_number: formData.value.phoneNumber?.trim() || null,
      gender: formData.value.gender?.trim(),
      birth_date: formData.value.birthDate?.trim(),
      occupation: formData.value.occupation?.trim(),
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