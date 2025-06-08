<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary-900 text-white py-16">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Set Up Monthly Donation</h1>
          <p class="text-xl text-primary-100">Join our monthly giving community and make a lasting impact on children's lives.</p>
        </div>
      </div>
    </section>

    <!-- Payment Form Section -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- Subscription Summary -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-2xl font-bold mb-6">Monthly Donation Summary</h2>
              
              <!-- Subscription Details -->
              <div class="border-b border-gray-200 pb-4 mb-4">
                <h3 class="text-lg font-semibold mb-2">{{ subscriptionDetails.category || 'General Fund' }}</h3>
                <p class="text-gray-600 mb-2">Type: Monthly Recurring Donation</p>
                <p class="text-gray-600 mb-2">Start Date: {{ new Date().toLocaleDateString() }}</p>
                <p class="text-gray-600">Next Payment: {{ getNextPaymentDate() }}</p>
              </div>

              <!-- Amount Section -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Donation Amount
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">RM</span>
                  <input
                    v-model="monthlyAmount"
                    type="number"
                    min="25"
                    step="0.01"
                    :disabled="!!fixedAmount"
                    class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                    :placeholder="fixedAmount ? fixedAmount : 'Enter monthly amount (Min: RM 25)'"
                  />
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  Minimum monthly donation: RM 25.00
                </p>
              </div>

              <!-- Donation Message -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  v-model="donationMessage"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Leave a message with your monthly donation..."
                ></textarea>
              </div>

              <!-- Monthly Impact Statement -->
              <div class="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                <h4 class="font-semibold text-primary-800 mb-2">Your Monthly Impact</h4>
                <p class="text-sm text-primary-700">
                  {{ getMonthlyImpactMessage() }}
                </p>
              </div>

              <!-- Annual Impact -->
              <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h4 class="font-semibold text-green-800 mb-2">Annual Impact</h4>
                <p class="text-sm text-green-700">
                  Your total annual contribution: <strong>RM{{ (parseFloat(finalAmount) * 12).toFixed(2) }}</strong>
                </p>
                <p class="text-xs text-green-600 mt-1">
                  {{ getAnnualImpactMessage() }}
                </p>
              </div>

              <!-- Subscription Management -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 class="font-semibold text-blue-800 mb-2">Easy Management</h4>
                <div class="text-sm text-blue-700">
                  <p class="mb-2">✓ Cancel or modify anytime from your dashboard</p>
                  <p class="mb-2">✓ Email receipts for tax purposes</p>
                  <p>✓ Regular updates on your impact</p>
                </div>
              </div>

              <!-- Total -->
              <div class="border-t border-gray-200 pt-4">
                <div class="flex justify-between items-center text-xl font-bold">
                  <span>Monthly Charge:</span>
                  <span class="text-primary-600">RM{{ finalAmount }}</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  First payment today, then on the {{ new Date().getDate() }}{{ getOrdinalSuffix(new Date().getDate()) }} of each month
                </p>
              </div>
            </div>

            <!-- Payment Form -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-2xl font-bold mb-6">Payment Information</h2>
              
              <!-- Authentication Notice -->
              <div v-if="!user" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
                  </svg>
                  <div class="text-sm text-yellow-800">
                    <p class="font-medium mb-1">Account Required</p>
                    <p>You need to be logged in to set up monthly donations. This helps us manage your subscription and send you updates.</p>
                    <button @click="redirectToLogin" class="mt-2 text-primary-600 hover:text-primary-700 underline font-medium">
                      Sign In or Create Account
                    </button>
                  </div>
                </div>
              </div>

              <!-- Donor Information -->
              <div class="mb-6" :class="{ 'opacity-50 pointer-events-none': !user }">
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

              <!-- Payment Method -->
              <div class="mb-6" :class="{ 'opacity-50 pointer-events-none': !user }">
                <h3 class="text-lg font-semibold mb-4">Payment Method</h3>
                <div class="border border-gray-300 rounded-lg p-4">
                  <div id="card-element" class="min-h-[40px]">
                    <!-- Stripe Elements will create form elements here -->
                  </div>
                  <div id="card-errors" role="alert" class="text-red-600 text-sm mt-2"></div>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                  Your payment method will be securely saved for future monthly charges
                </p>
              </div>

              <!-- Subscription Terms -->
              <div class="mb-6" :class="{ 'opacity-50 pointer-events-none': !user }">
                <label class="flex items-start">
                  <input
                    v-model="agreedToTerms"
                    type="checkbox"
                    class="mt-1 mr-3 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span class="text-sm text-gray-700">
                    I agree to the monthly subscription terms, 
                    <a href="#" class="text-primary-600 hover:text-primary-700 underline">Terms and Conditions</a>
                    and 
                    <a href="#" class="text-primary-600 hover:text-primary-700 underline">Privacy Policy</a>.
                    I understand I can cancel or modify my subscription at any time.
                  </span>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                @click="processSubscription"
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
                  Setting up subscription...
                </span>
                <span v-else>
                  Start Monthly Donation (RM{{ finalAmount }}/month)
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
            Monthly Donation Active!
          </h3>
          <p class="text-gray-600 mb-6">
            Thank you for setting up a monthly donation of RM{{ finalAmount }}. Your first payment has been processed and future payments will be automatically charged on the {{ new Date().getDate() }}{{ getOrdinalSuffix(new Date().getDate()) }} of each month.
          </p>
          <div class="space-y-3">
            <button
              @click="goToDonations"
              class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              View All Donations
            </button>
            <button
              @click="closeModal"
              class="w-full text-gray-500 hover:text-gray-700 py-2 font-medium transition-colors"
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

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RVvV5R9hGUCBGvpabSsViVwSDDh3g902bSZruZee6dvLPLehVnCPBYmwdMTTfLsH391IP6oo8Iy9GkNAIKyuMd900gEHBJO57';
let stripe = null;
let elements = null;
let cardElement = null;

// Page data from route params
const subscriptionDetails = ref({
  amount: parseFloat(route.query.amount) || 0,
  category: route.query.category || 'general',
  event_id: route.query.event_id || null
});

const fixedAmount = ref(subscriptionDetails.value.amount > 0 ? subscriptionDetails.value.amount.toString() : '');
const monthlyAmount = ref(fixedAmount.value || '');
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
  const amount = parseFloat(monthlyAmount.value) || 0;
  return amount.toFixed(2);
});

const canSubmit = computed(() => {
  return user.value &&
         parseFloat(finalAmount.value) >= 25 && 
         paymentForm.value.firstName.trim() && 
         paymentForm.value.lastName.trim() && 
         paymentForm.value.email.trim() && 
         agreedToTerms.value &&
         !processing.value &&
         cardElement;
});

// Helper functions
const getNextPaymentDate = () => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  return nextMonth.toLocaleDateString();
};

const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const getMonthlyImpactMessage = () => {
  const amount = parseFloat(finalAmount.value) || 0;
  
  if (amount >= 200) {
    return 'Your monthly donation can provide complete healthcare coverage and educational support for a child each month.';
  } else if (amount >= 100) {
    return 'Your monthly donation can cover educational supplies and nutritious meals for a child throughout the month.';
  } else if (amount >= 50) {
    return 'Your monthly donation can provide essential school supplies and regular meals for children in need.';
  } else if (amount >= 25) {
    return 'Your monthly donation helps provide basic necessities and support for children in our programs.';
  }
  return 'Every monthly contribution creates lasting change in children\'s lives.';
};

const getAnnualImpactMessage = () => {
  const annualAmount = parseFloat(finalAmount.value) * 12;
  
  if (annualAmount >= 2400) {
    return 'Could support a child\'s complete education and healthcare for an entire year.';
  } else if (annualAmount >= 1200) {
    return 'Could provide comprehensive support for multiple children throughout the year.';
  } else if (annualAmount >= 600) {
    return 'Could cover educational materials and regular meals for several children annually.';
  }
  return 'Makes a significant cumulative impact on children\'s welfare throughout the year.';
};

const redirectToLogin = () => {
  // Store current subscription details to return after login
  const returnUrl = `/subscription-payment?${new URLSearchParams({
    amount: subscriptionDetails.value.amount || '',
    category: subscriptionDetails.value.category,
    event_id: subscriptionDetails.value.event_id || ''
  }).toString()}`;
  
  navigateTo(`/auth/login?redirect=${encodeURIComponent(returnUrl)}`);
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

// Process subscription
const processSubscription = async () => {
  if (!canSubmit.value || !stripe || !cardElement) return;

  const amount = parseFloat(finalAmount.value);
  if (amount < 25) {
    alert('Minimum monthly donation amount is RM 25.00');
    return;
  }

  if (!user.value) {
    alert('Please sign in to set up a monthly donation.');
    redirectToLogin();
    return;
  }

  processing.value = true;

  try {
    console.log('🔍 Processing subscription...');
    
    // Create payment method first
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: `${paymentForm.value.firstName} ${paymentForm.value.lastName}`,
        email: paymentForm.value.email,
      },
    });

    if (pmError) {
      throw new Error(pmError.message);
    }

    console.log('✅ Payment method created:', paymentMethod.id);

    // Create subscription
    const subscriptionData = {
      amount: amount,
      currency: 'myr',
      category: subscriptionDetails.value.category,
      message: donationMessage.value || null,
      event_id: subscriptionDetails.value.event_id,
      payment_method: paymentMethod
    };

    const response = await $fetch('/api/stripe/create-subscription', {
      method: 'POST',
      body: subscriptionData
    });

    console.log('🔍 Subscription response:', response);

    // Handle additional authentication if required (3D Secure, etc.)
    if (response.requires_action && response.client_secret) {
      console.log('🔍 Confirming payment with additional authentication...');
      
      const { error: confirmError } = await stripe.confirmCardPayment(response.client_secret);
      
      if (confirmError) {
        throw new Error(confirmError.message);
      }
      
      console.log('✅ Payment confirmed with additional authentication');
    }

    // Check final status
    if (response.status === 'active' || response.status === 'trialing') {
      console.log('✅ Subscription successfully created and active');
      showSuccessModal.value = true;
    } else if (response.status === 'incomplete') {
      throw new Error('Subscription setup incomplete. Please try again or contact support.');
    } else {
      console.log('⚠️ Subscription created but status:', response.status);
      showSuccessModal.value = true; // Still show success as subscription is created
    }

  } catch (error) {
    console.error('❌ Subscription error:', error);
    
    let errorMessage = error.message;
    if (error.name === 'FetchError') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    
    alert(`Subscription setup failed: ${errorMessage}`);
  } finally {
    processing.value = false;
  }
};

// Modal actions
const closeModal = () => {
  showSuccessModal.value = false;
};

const goToDonations = () => {
  showSuccessModal.value = false;
  navigateTo('/donations');
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