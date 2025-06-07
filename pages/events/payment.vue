<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary-900 text-white py-16">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Payment</h1>
          <p class="text-xl text-primary-100">Complete your {{ paymentType }} securely.</p>
        </div>
      </div>
    </section>

    <!-- Payment Form Section -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- Payment Summary -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-2xl font-bold mb-6">Payment Summary</h2>
              
              <!-- Event Details -->
              <div class="border-b border-gray-200 pb-4 mb-4">
                <h3 class="text-lg font-semibold mb-2">{{ eventTitle }}</h3>
                <p class="text-gray-600 mb-2">Type: {{ capitalizeFirst(paymentType) }}</p>
                <p class="text-gray-600">Date: {{ new Date().toLocaleDateString() }}</p>
              </div>

              <!-- Amount Section -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ paymentType === 'donation' ? 'Donation Amount' : 'Purchase Amount' }}
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">RM</span>
                  <input
                    v-model="customAmount"
                    type="number"
                    min="1"
                    step="0.01"
                    :disabled="!!fixedAmount"
                    class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                    :placeholder="fixedAmount ? fixedAmount : 'Enter amount'"
                  />
                </div>
                <p v-if="paymentType === 'donation'" class="text-sm text-gray-500 mt-1">
                  Any amount is appreciated
                </p>
              </div>

              <!-- Donation Message (for donations only) -->
              <div v-if="paymentType === 'donation'" class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  v-model="donationMessage"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Leave a message with your donation..."
                ></textarea>
              </div>

              <!-- Total -->
              <div class="border-t border-gray-200 pt-4">
                <div class="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span class="text-primary-600">RM{{ finalAmount }}</span>
                </div>
              </div>
            </div>

            <!-- Payment Form -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-2xl font-bold mb-6">Payment Information</h2>
              
              <!-- Donor Information -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4">Contact Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      v-model="paymentForm.firstName"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      v-model="paymentForm.lastName"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    v-model="paymentForm.email"
                    type="email"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <!-- Stripe Card Element -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4">Payment Method</h3>
                <div class="border border-gray-300 rounded-lg p-4">
                  <div id="card-element" class="min-h-[40px]">
                    <!-- Stripe Elements will create form elements here -->
                  </div>
                  <div id="card-errors" role="alert" class="text-red-600 text-sm mt-2"></div>
                </div>
              </div>

              <!-- Terms and Conditions -->
              <div class="mb-6">
                <label class="flex items-start">
                  <input
                    v-model="agreedToTerms"
                    type="checkbox"
                    class="mt-1 mr-3 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span class="text-sm text-gray-700">
                    I agree to the 
                    <a href="#" class="text-primary-600 hover:text-primary-700 underline">Terms and Conditions</a>
                    and 
                    <a href="#" class="text-primary-600 hover:text-primary-700 underline">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                @click="processPayment"
                :disabled="!canSubmit || processing"
                :class="[
                  'w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors',
                  canSubmit && !processing
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                ]"
              >
                <span v-if="processing">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
                <span v-else>
                  Complete {{ paymentType === 'donation' ? 'Donation' : 'Purchase' }} (RM{{ finalAmount }})
                </span>
              </button>

              <!-- Security Notice -->
              <div class="mt-4 text-center">
                <p class="text-xs text-gray-500">
                  🔒 Your payment information is secure and encrypted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">
            {{ paymentType === 'donation' ? 'Donation' : 'Purchase' }} Successful!
          </h3>
          <p class="text-gray-600 mb-6">
            Thank you for your {{ paymentType === 'donation' ? 'generous donation' : 'purchase' }} of RM{{ finalAmount }}.
            {{ paymentType === 'donation' ? 'Your contribution makes a difference!' : 'Your order has been confirmed.' }}
          </p>
          <div class="space-y-3">
            <button
              @click="goToEvents"
              class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Back to Events
            </button>
            <button
              @click="closeModal"
              class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSupabaseClient, useSupabaseUser } from '#imports';

const route = useRoute();
const router = useRouter();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Stripe configuration - USE YOUR ACTUAL PUBLISHABLE KEY
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RVvV5R9hGUCBGvpabSsViVwSDDh3g902bSZruZee6dvLPLehVnCPBYmwdMTTfLsH391IP6oo8Iy9GkNAIKyuMd900gEHBJO57';
let stripe = null;
let elements = null;
let cardElement = null;

// Page data
const eventId = ref(route.query.eventId || '');
const eventTitle = ref(route.query.eventTitle || 'Event');
const paymentType = ref(route.query.type || 'donation');
const fixedAmount = ref(route.query.amount || '');
const currency = ref('myr');

// Form data
const customAmount = ref(fixedAmount.value || '');
const donationMessage = ref('');
const agreedToTerms = ref(false);
const processing = ref(false);
const showSuccessModal = ref(false);

// Payment form
const paymentForm = ref({
  firstName: '',
  lastName: '',
  email: user.value?.email || ''
});

// Computed properties
const finalAmount = computed(() => {
  const amount = parseFloat(customAmount.value) || 0;
  return amount.toFixed(2);
});

const canSubmit = computed(() => {
  return finalAmount.value > 0 && 
         paymentForm.value.firstName.trim() && 
         paymentForm.value.lastName.trim() && 
         paymentForm.value.email.trim() && 
         agreedToTerms.value &&
         !processing.value &&
         cardElement;
});

// Helper function
const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Initialize Stripe
const initializeStripe = async () => {
  try {
    if (!window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = setupStripe;
      document.head.appendChild(script);
    } else {
      setupStripe();
    }
  } catch (error) {
    console.error('Error loading Stripe:', error);
  }
};

// Setup Stripe elements
const setupStripe = () => {
  try {
    stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
    elements = stripe.elements();

    cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
    });

    cardElement.mount('#card-element');

    cardElement.on('change', ({ error }) => {
      const displayError = document.getElementById('card-errors');
      if (error) {
        displayError.textContent = error.message;
      } else {
        displayError.textContent = '';
      }
    });
  } catch (error) {
    console.error('Error setting up Stripe:', error);
  }
};

// FIXED: Process payment function
const processPayment = async () => {
  if (!canSubmit.value || !stripe || !cardElement) return;

  processing.value = true;

  try {
    console.log('🔍 Creating payment intent...');
    
    // FIXED: Correct API endpoint and request body structure
    const response = await $fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      body: {
        amount: finalAmount.value,  // This matches your API expectation
        currency: currency.value,   // 'myr'
        category: paymentType.value, // 'donation' etc.
        message: donationMessage.value || null,
        event_id: eventId.value || null // This matches your API expectation
      }
    });

    console.log('🎯 API Response:', response);
    console.log('🔑 Client secret present:', !!response.client_secret);

    // FIXED: Check for client_secret (underscore, not camelCase)
    if (!response.client_secret) {
      console.error('❌ No client_secret in response!');
      console.log('Response keys:', Object.keys(response));
      throw new Error('Failed to create payment intent - no client_secret returned');
    }

    console.log('💳 Confirming payment...');
    
    // FIXED: Use client_secret with underscore
    const { error, paymentIntent } = await stripe.confirmCardPayment(response.client_secret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${paymentForm.value.firstName} ${paymentForm.value.lastName}`,
          email: paymentForm.value.email,
        },
      }
    });

    if (error) {
      console.error('❌ Payment confirmation failed:', error);
      throw new Error(error.message);
    }

    console.log('✅ Payment confirmed:', paymentIntent);

    if (paymentIntent.status === 'succeeded') {
      console.log('🎉 Payment succeeded!');
      showSuccessModal.value = true;
    } else {
      throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
    }

  } catch (error) {
    console.error('❌ Payment error:', error);
    
    // Better error messages
    let errorMessage = error.message;
    if (error.name === 'FetchError') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    
    alert(`Payment failed: ${errorMessage}`);
  } finally {
    processing.value = false;
  }
};

// Modal actions
const closeModal = () => {
  showSuccessModal.value = false;
};

const goToEvents = () => {
  showSuccessModal.value = false;
  navigateTo('/events');
};

// Initialize
onMounted(async () => {
  await initializeStripe();
  
  if (user.value) {
    await fetchUserProfile();
  }
});

const fetchUserProfile = async () => {
  if (!user.value) return;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.value.id)
      .single();

    if (data && !error) {
      paymentForm.value.firstName = data.first_name || '';
      paymentForm.value.lastName = data.last_name || '';
    }
  } catch (err) {
    console.error('Error fetching user profile:', err);
  }
};

</script>