<template>
  <div class="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
      <div>
        <h2 class="mt-4 text-center text-3xl font-bold text-neutral-900">Create an account</h2>
        <p class="mt-2 text-center text-sm text-neutral-600">
          Join ChildBridge to support children in need
        </p>
      </div>

      <form @submit.prevent="register" class="mt-8 space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="first-name" class="block text-sm font-medium text-neutral-700">First name</label>
            <input
              id="first-name"
              v-model="formData.firstName"
              type="text"
              required
              class="input mt-1"
            />
          </div>
          <div>
            <label for="last-name" class="block text-sm font-medium text-neutral-700">Last name</label>
            <input
              id="last-name"
              v-model="formData.lastName"
              type="text"
              required
              class="input mt-1"
            />
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-neutral-700">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="input mt-1"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-neutral-700">Password</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            required
            class="input mt-1"
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
          <label for="gender" class="block text-sm font-medium text-neutral-700">Gender</label>
          <select
            id="gender"
            v-model="formData.gender"
            required
            class="input mt-1"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label for="birthDate" class="block text-sm font-medium text-neutral-700">Birth Date</label>
          <input
            id="birthDate"
            v-model="formData.birthDate"
            type="date"
            required
            class="input mt-1"
          />
        </div>

        <div>
          <label for="occupation" class="block text-sm font-medium text-neutral-700">Occupation</label>
          <select
            id="occupation"
            v-model="formData.occupation"
            class="input mt-1"
          >
            <option value="">Select occupation</option>
            <option value="student">Student</option>
            <option value="unemployed">Unemployed</option>
            <option value="employed">Employed</option>
            <option value="self-employed">Self-Employed</option>
            <option value="retired">Retired</option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- Avatar Upload Section -->
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-1">Profile Picture</label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <div v-if="avatarPreview" class="mb-4">
                <img :src="avatarPreview" alt="Avatar Preview" class="mx-auto h-32 w-32 object-cover rounded-full" />
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
          <div v-if="avatarUploadProgress > 0 && avatarUploadProgress < 100" class="mt-2">
            <div class="bg-neutral-200 rounded-full h-2">
              <div 
                class="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                :style="{ width: `${avatarUploadProgress}%` }"
              ></div>
            </div>
            <p class="text-sm text-neutral-600 mt-1">Uploading... {{ avatarUploadProgress }}%</p>
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="formData.agreeToTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-neutral-600">
            I agree to the Terms and Privacy Policy
          </label>
        </div>

        <div v-if="error" class="text-error-600 text-sm bg-error-50 p-3 rounded">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full btn btn-primary"
        >
          {{ loading ? 'Creating account...' : 'Create account' }}
        </button>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-neutral-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-neutral-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          @click="signInWithGoogle"
          class="w-full btn btn-outline flex justify-center items-center"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5 mr-2" />
          Google
        </button>

        <p class="text-center text-sm text-neutral-600">
          Already have an account?
          <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useSupabaseClient } from '#imports';
import { v4 as uuidv4 } from 'uuid';

const supabase = useSupabaseClient();

const loading = ref(false);
const error = ref('');
const confirmPassword = ref('');
const errorMsg = ref('');

// Avatar upload states
const avatarPreview = ref(null);
const avatarUploadProgress = ref(0);

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  gender: '',
  birthDate: '',
  occupation: '',
  agreeToTerms: false,
  avatarUrl: '',
  role: 'donor' // Default role set to donor
});

// Avatar upload handler
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Reset states
  avatarPreview.value = null;
  avatarUploadProgress.value = 0;
  error.value = '';

  // Validate file type and size
  if (!file.type.startsWith('image/')) {
    error.value = 'Please upload an image file';
    return;
  }

  if (file.size > 6 * 1024 * 1024) { // 6MB limit
    error.value = 'Image file size must be less than 6MB';
    return;
  }

  // Create preview
  avatarPreview.value = URL.createObjectURL(file);
  avatarUploadProgress.value = 50; // Show some progress

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file
    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    formData.value.avatarUrl = publicUrl;
    
    // Complete the progress
    avatarUploadProgress.value = 100;
    
    // Reset progress after a delay
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
  
  // Clear the file input
  const fileInput = document.getElementById('avatar-upload');
  if (fileInput) {
    fileInput.value = '';
  }
};

const register = async () => {
  if (!formData.value.agreeToTerms) {
    error.value = 'Please agree to the Terms and Privacy Policy';
    return;
  }

  if (formData.value.password !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: formData.value.email,
      password: formData.value.password,
      options: {
        data: {
          first_name: formData.value.firstName,
          last_name: formData.value.lastName,
          avatar_url: formData.value.avatarUrl,
          role: formData.value.role,
          gender: formData.value.gender,
          birth_date: formData.value.birthDate,
          occupation: formData.value.occupation
        }
      }
    });

    if (signUpError) throw signUpError;

    if (user) {
      // Create profile in database (will be available when user confirms email)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          first_name: formData.value.firstName,
          last_name: formData.value.lastName,
          email: formData.value.email,
          avatar_url: formData.value.avatarUrl,
          gender: formData.value.gender,
          birth_date: formData.value.birthDate,
          occupation: formData.value.occupation,
          role: formData.value.role
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't throw error here, profile creation can be retried on callback
      }

      // Redirect to verification page instead of homepage
      navigateTo(`/auth/verify-email?email=${encodeURIComponent(formData.value.email)}`);
    }
  } catch (err) {
    console.error('Registration error:', err);
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
    console.error('Google sign-in error:', err);
    error.value = 'Failed to sign in with Google';
  }
};

// Cleanup preview URL when component is unmounted
onUnmounted(() => {
  if (avatarPreview.value) {
    URL.revokeObjectURL(avatarPreview.value);
  }
});

// Set page title
useHead({
  title: 'Create Account - ChildBridge'
});
</script>