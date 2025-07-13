<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">Verify Phone Number</h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ step === 'input' ? 'Enter your phone number to receive a verification code' : 
             step === 'verify' ? `We've sent a code to ${maskedPhoneNumber}` :
             'Phone number verified successfully!' }}
        </p>
      </div>

      <!-- Phone Input Step -->
      <div v-if="step === 'input'" class="space-y-6">
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div class="flex">
            <!-- Country Code Selector -->
            <select
              v-model="selectedCountryCode"
              class="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-gray-50 text-sm"
              style="min-width: 100px;"
              :disabled="sendingCode"
            >
              <option v-for="country in popularCountries" :key="country.code" :value="country.code">
                {{ country.flag }} {{ country.code }}
              </option>
            </select>
            <!-- Phone Number Input -->
            <input
              id="phone"
              v-model="phoneNumberWithoutCode"
              type="tel"
              required
              class="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              :placeholder="getPlaceholderForCountry(selectedCountryCode)"
              @input="formatPhoneNumberInput"
              :disabled="sendingCode"
            />
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Select your country and enter your phone number
          </p>
        </div>

        <button
          @click="sendVerificationCode"
          :disabled="!isValidPhone || sendingCode"
          class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
        >
          {{ sendingCode ? 'Sending Code...' : 'Send Verification Code' }}
        </button>
      </div>

      <!-- OTP Verification Step -->
      <div v-else-if="step === 'verify'" class="space-y-6">
        <div>
          <label for="otp" class="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <div class="flex justify-center space-x-2">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              :ref="el => otpInputs[index] = el"
              v-model="otpDigits[index]"
              type="text"
              maxlength="1"
              class="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @input="handleOtpInput(index, $event)"
              @keydown="handleOtpKeydown(index, $event)"
              @paste="handleOtpPaste($event)"
              :disabled="verifyingCode"
            />
          </div>
          <p class="text-xs text-gray-500 mt-2 text-center">
            Enter the 6-digit code sent to your phone
          </p>
        </div>

        <div class="space-y-3">
          <button
            @click="verifyCode"
            :disabled="!isOtpComplete || verifyingCode"
            class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
          >
            {{ verifyingCode ? 'Verifying...' : 'Verify Code' }}
          </button>

          <div class="text-center">
            <button
              v-if="!canResend"
              disabled
              class="text-sm text-gray-400 cursor-not-allowed"
            >
              Resend code in {{ resendCountdown }}s
            </button>
            <button
              v-else
              @click="resendCode"
              :disabled="sendingCode"
              class="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              {{ sendingCode ? 'Sending...' : 'Resend Code' }}
            </button>
          </div>
        </div>

        <button
          @click="goBackToInput"
          class="w-full text-sm text-gray-600 hover:text-gray-900"
        >
          ← Change phone number
        </button>
      </div>

      <!-- Success Step -->
      <div v-else-if="step === 'success'" class="space-y-6 text-center">
        <div class="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Phone Verified!</h3>
          <p class="text-gray-600 mb-6">
            Your phone number has been successfully verified and updated in your profile.
          </p>
        </div>
        <div class="space-y-3">
          <button
            @click="goToProfile"
            class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go to Profile
          </button>
          <button
            @click="verifyAnotherNumber"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Verify Another Number
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-md">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <div class="ml-3">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useSupabaseClient, useSupabaseUser, useRoute, useRouter } from '#imports';
import { useProfile } from '~/composables/useProfile';

definePageMeta({
  middleware: ['auth']
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();
const router = useRouter();
const { updateProfile } = useProfile();

// State management
const step = ref('input'); // 'input', 'verify', 'success'
const selectedCountryCode = ref('+60'); // Default to Malaysia
const phoneNumberWithoutCode = ref('');
const otpDigits = ref(['', '', '', '', '', '']);
const otpInputs = ref([]);
const error = ref('');
const sendingCode = ref(false);
const verifyingCode = ref(false);
const resendCountdown = ref(0);
const resendTimer = ref(null);

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

// Computed properties
const completePhoneNumber = computed(() => {
  return phoneNumberWithoutCode.value ? selectedCountryCode.value + phoneNumberWithoutCode.value : '';
});

const isValidPhone = computed(() => {
  const phoneRegex = /^\+[1-9]\d{10,14}$/;
  return phoneRegex.test(completePhoneNumber.value);
});

const isOtpComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '');
});

const canResend = computed(() => {
  return resendCountdown.value === 0;
});

const maskedPhoneNumber = computed(() => {
  const phone = completePhoneNumber.value;
  if (!phone || phone.length <= 6) return phone;
  return phone.substring(0, 4) + '***' + phone.substring(phone.length - 3);
});

const otpCode = computed(() => {
  return otpDigits.value.join('');
});

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
};

// Parse phone number from query params
const parsePhoneFromQuery = (fullPhoneNumber) => {
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
    }
  }
};

// OTP input handling
const handleOtpInput = (index, event) => {
  const value = event.target.value;
  
  // Only allow digits
  if (!/^\d*$/.test(value)) {
    event.target.value = otpDigits.value[index];
    return;
  }
  
  otpDigits.value[index] = value;
  
  // Auto-focus next input
  if (value && index < 5) {
    nextTick(() => {
      otpInputs.value[index + 1]?.focus();
    });
  }
};

const handleOtpKeydown = (index, event) => {
  // Handle backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    nextTick(() => {
      otpInputs.value[index - 1]?.focus();
    });
  }
  
  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    nextTick(() => {
      otpInputs.value[index - 1]?.focus();
    });
  }
  
  if (event.key === 'ArrowRight' && index < 5) {
    nextTick(() => {
      otpInputs.value[index + 1]?.focus();
    });
  }
};

const handleOtpPaste = (event) => {
  event.preventDefault();
  const paste = (event.clipboardData || window.clipboardData).getData('text');
  const digits = paste.replace(/\D/g, '').slice(0, 6).split('');
  
  for (let i = 0; i < 6; i++) {
    otpDigits.value[i] = digits[i] || '';
  }
  
  // Focus the next empty input or the last input
  const nextEmptyIndex = otpDigits.value.findIndex(digit => digit === '');
  const targetIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
  
  nextTick(() => {
    otpInputs.value[targetIndex]?.focus();
  });
};

// Clear OTP inputs
const clearOtpInputs = () => {
  otpDigits.value = ['', '', '', '', '', ''];
  nextTick(() => {
    otpInputs.value[0]?.focus();
  });
};

// Send verification code using Supabase + Twilio for existing user
const sendVerificationCode = async () => {
  if (!isValidPhone.value) {
    error.value = 'Please enter a valid phone number';
    return;
  }

  sendingCode.value = true;
  error.value = '';

  try {
    // For existing users, we need to use a different approach
    // Option 1: Call a custom edge function or API endpoint that sends SMS
    // Option 2: Use Supabase's updateUser with phone (requires re-authentication)
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Update user phone number (this will send OTP automatically)
    const { data, error: updateError } = await supabase.auth.updateUser({
      phone: completePhoneNumber.value
    });

    if (updateError) {
      console.error('Update phone error:', updateError);
      throw updateError;
    }

    console.log('OTP sent for phone update:', data);
    
    step.value = 'verify';
    startResendTimer();
    
    // Focus first OTP input
    nextTick(() => {
      otpInputs.value[0]?.focus();
    });
    
  } catch (err) {
    console.error('Error sending verification code:', err);
    if (err.message?.includes('Phone number confirmations are not enabled')) {
      error.value = 'Phone confirmations are not enabled. Please contact support.';
    } else {
      error.value = err.message || 'Failed to send verification code. Please try again.';
    }
  } finally {
    sendingCode.value = false;
  }
};

// Verify the OTP code for phone update
const verifyCode = async () => {
  if (!isOtpComplete.value) {
    error.value = 'Please enter the complete verification code';
    return;
  }

  verifyingCode.value = true;
  error.value = '';

  try {
    // Verify the OTP for phone number update
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone: completePhoneNumber.value,
      token: otpCode.value,
      type: 'phone_change'  // Changed to phone_change for existing users
    });

    if (verifyError) {
      console.error('Phone verification error:', verifyError);
      throw verifyError;
    }

    console.log('Phone verified and updated successfully:', data);

    // Update the user's profile to mark phone as verified
    try {
      // Get current user first
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not found after verification');
      }

      console.log('🔍 Current user ID:', user.id);
      console.log('📱 Phone to update:', completePhoneNumber.value);

      // Method 1: Try composable first
      console.log('🔄 Trying composable update...');
      const { error: updateError } = await updateProfile({
        phone_number: completePhoneNumber.value,
        phone_verified: true,
        updated_at: new Date().toISOString()
      });

      if (updateError) {
        console.error('❌ Composable update failed:', updateError);
        console.log('🔄 Trying direct database update...');
        
        // Method 2: Direct database update as fallback
        const { data: directUpdate, error: directError } = await supabase
          .from('profiles') // Make sure this matches your table name
          .update({
            phone_number: completePhoneNumber.value,
            phone_verified: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select();

        if (directError) {
          console.error('❌ Direct update failed:', directError);
          console.error('❌ Error details:', JSON.stringify(directError, null, 2));
          
          // Method 3: Check if profile row exists
          console.log('🔍 Checking if profile exists...');
          const { data: existingProfile, error: checkError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (checkError) {
            console.error('❌ Profile check failed:', checkError);
            if (checkError.code === 'PGRST116') {
              // Profile doesn't exist, create it
              console.log('🆕 Creating new profile...');
              const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: user.id,
                  email: user.email,
                  phone_number: completePhoneNumber.value,
                  phone_verified: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .select();

              if (createError) {
                console.error('❌ Profile creation failed:', createError);
                throw createError;
              } else {
                console.log('✅ Profile created successfully:', newProfile);
              }
            } else {
              throw checkError;
            }
          } else {
            console.log('✅ Profile exists:', existingProfile);
            throw directError; // Re-throw the original update error
          }
        } else {
          console.log('✅ Direct update successful:', directUpdate);
        }
      } else {
        console.log('✅ Composable update successful');
      }

      // Final verification - check if the update actually worked
      const { data: finalCheck, error: finalError } = await supabase
        .from('profiles')
        .select('phone_number, phone_verified')
        .eq('id', user.id)
        .single();

      if (finalError) {
        console.error('❌ Final check failed:', finalError);
      } else {
        console.log('✅ Final profile state:', finalCheck);
      }

    } catch (profileError) {
      console.error('❌ Profile update error:', profileError);
      
      // Show more specific error message
      if (profileError.message?.includes('relation "profiles" does not exist')) {
        error.value = 'Phone verified but profile table not found. Please check your database setup.';
      } else if (profileError.code === 'PGRST301') {
        error.value = 'Phone verified but insufficient permissions to update profile.';
      } else if (profileError.code === '42501') {
        error.value = 'Phone verified but access denied to profile table.';
      } else {
        error.value = `Phone verified but profile update failed: ${profileError.message}`;
      }
      
      // Don't return here - still show success for phone verification
    }

    step.value = 'success';
    stopResendTimer();
    
  } catch (err) {
    console.error('Error verifying code:', err);
    if (err.message?.includes('expired')) {
      error.value = 'Verification code has expired. Please request a new one.';
    } else if (err.message?.includes('invalid')) {
      error.value = 'Invalid verification code. Please try again.';
    } else if (err.message?.includes('Token has expired')) {
      error.value = 'Verification code has expired. Please request a new one.';
    } else {
      error.value = err.message || 'Failed to verify code. Please try again.';
    }
    clearOtpInputs();
  } finally {
    verifyingCode.value = false;
  }
};

// Resend verification code
const resendCode = async () => {
  await sendVerificationCode();
  clearOtpInputs();
};

// Start resend timer
const startResendTimer = () => {
  resendCountdown.value = 60;
  resendTimer.value = setInterval(() => {
    resendCountdown.value--;
    if (resendCountdown.value <= 0) {
      stopResendTimer();
    }
  }, 1000);
};

// Stop resend timer
const stopResendTimer = () => {
  if (resendTimer.value) {
    clearInterval(resendTimer.value);
    resendTimer.value = null;
  }
  resendCountdown.value = 0;
};

// Navigation functions
const goBackToInput = () => {
  step.value = 'input';
  clearOtpInputs();
  stopResendTimer();
  error.value = '';
};

const goToProfile = () => {
  router.push('/profile');
};

const verifyAnotherNumber = () => {
  step.value = 'input';
  phoneNumberWithoutCode.value = '';
  selectedCountryCode.value = '+60';
  clearOtpInputs();
  stopResendTimer();
  error.value = '';
};

// Initialize from query params
onMounted(() => {
  // Check if phone number was passed via query params
  const phoneParam = route.query.phone;
  if (phoneParam) {
    parsePhoneFromQuery(phoneParam);
  }
});

// Cleanup on unmount
onUnmounted(() => {
  stopResendTimer();
});
</script>