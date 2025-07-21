<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Enhanced Hero Section -->
    <section class="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 text-white py-16 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div class="container-custom relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Secure Payment
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
            Complete Your Donation
          </h1>
          <p class="text-xl text-emerald-100">
            Your generous contribution makes a difference in children's lives.
          </p>
        </div>
      </div>
    </section>

    <!-- Enhanced Payment Form Section -->
    <section class="py-16 relative">
      <div class="container-custom">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- Enhanced Donation Summary -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div class="flex items-center mb-8">
                <div class="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Donation Summary
                </h2>
              </div>
              
              <!-- Enhanced Donation Details -->
              <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 mb-6">
                <h3 class="text-xl font-bold text-emerald-800 mb-4">{{ donationDetails.category || 'General Fund' }}</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-emerald-700 font-medium">Type:</span>
                    <span class="font-bold text-emerald-800">{{ donationDetails.type === 'onetime' ? 'One-time Donation' : 'Monthly Donation' }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-emerald-700 font-medium">Date:</span>
                    <span class="font-bold text-emerald-800">{{ new Date().toLocaleDateString() }}</span>
                  </div>
                </div>
              </div>

              <!-- Enhanced Amount Section -->
              <div class="mb-6">
                <div class="flex items-center mb-4">
                  <div class="p-2 bg-blue-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                  </div>
                  <label class="text-lg font-bold text-gray-800">
                    Donation Amount
                  </label>
                </div>
                <div class="flex items-center bg-white border-2 border-blue-200 rounded-xl focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-300">
                  <span class="px-4 py-4 text-blue-600 font-bold text-lg bg-blue-50 border-r border-blue-200">RM</span>
                  <input
                    v-model="customAmount"
                    type="number"
                    min="10"
                    step="0.01"
                    :disabled="!!fixedAmount"
                    class="flex-1 px-4 py-4 border-0 rounded-r-xl focus:ring-0 focus:outline-none text-lg font-bold bg-white disabled:bg-gray-100 disabled:text-gray-500"
                    :placeholder="fixedAmount ? fixedAmount : 'Enter amount'"
                  />
                </div>
                <p class="text-sm text-blue-600 mt-3 font-medium bg-blue-50 rounded-lg p-3">
                  Any amount is appreciated (Minimum: RM {{ donationDetails.type === 'subscription' ? '25.00' : '10.00' }})
                </p>
              </div>

              <!-- Enhanced Donation Message -->
              <div class="mb-6">
                <div class="flex items-center mb-4">
                  <div class="p-2 bg-purple-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                    </svg>
                  </div>
                  <label class="text-lg font-bold text-gray-800">
                    Personal Message (Optional)
                  </label>
                </div>
                <textarea
                  v-model="donationMessage"
                  rows="4"
                  class="w-full px-4 py-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white resize-none"
                  placeholder="Leave a heartfelt message with your donation..."
                ></textarea>
              </div>

              <!-- Enhanced Impact Statement -->
              <div class="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
                <div class="flex items-center mb-4">
                  <div class="p-2 bg-orange-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-lg text-orange-800">Your Impact</h4>
                </div>
                <p class="text-orange-700 leading-relaxed">
                  {{ getImpactMessage() }}
                </p>
              </div>

              <!-- Enhanced Total -->
              <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                <div class="flex justify-between items-center">
                  <span class="text-xl font-semibold">Total{{ donationDetails.type === 'subscription' ? '/month' : '' }}:</span>
                  <span class="text-3xl font-bold">RM{{ finalAmount }}</span>
                </div>
              </div>
            </div>

            <!-- Enhanced Payment Form -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div class="flex items-center mb-8">
                <div class="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                </div>
                <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Payment Information
                </h2>
              </div>
              
              <!-- Enhanced Donor Information -->
              <div class="mb-8">
                <div class="flex items-center mb-6">
                  <div class="p-2 bg-green-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-800">Contact Information</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">
                      First Name *
                    </label>
                    <input
                      v-model="paymentForm.firstName"
                      type="text"
                      required
                      class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white font-medium"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-bold text-gray-700 mb-3">
                      Last Name *
                    </label>
                    <input
                      v-model="paymentForm.lastName"
                      type="text"
                      required
                      class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white font-medium"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div class="mt-6">
                  <label class="block text-sm font-bold text-gray-700 mb-3">
                    Email Address *
                  </label>
                  <input
                    v-model="paymentForm.email"
                    type="email"
                    required
                    class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white font-medium"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <!-- Enhanced Stripe Card Element -->
              <div class="mb-8">
                <div class="flex items-center mb-6">
                  <div class="p-2 bg-indigo-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-800">Payment Method</h3>
                </div>
                
                <!-- Simple card input design -->
                <div class="relative">
                  <div class="bg-white border-2 border-indigo-200 rounded-xl p-6 shadow-lg focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all duration-300">
                    <div class="flex justify-between items-center mb-4">
                      <div class="text-sm font-medium text-indigo-600 tracking-wide">PAYMENT DETAILS</div>
                      <div class="flex space-x-2">
                        <div class="w-8 h-5 bg-blue-500 rounded-sm"></div>
                        <div class="w-8 h-5 bg-red-500 rounded-sm"></div>
                        <div class="w-8 h-5 bg-yellow-500 rounded-sm"></div>
                      </div>
                    </div>
                    
                    <div id="card-element" class="min-h-[50px] py-3">
                      <!-- Stripe Elements will create form elements here -->
                    </div>
                  </div>
                  <div id="card-errors" role="alert" class="text-red-600 text-sm mt-3 font-medium px-2"></div>
                </div>
              </div>

              <!-- Enhanced Terms and Conditions -->
              <div class="mb-8">
                <label class="flex items-start group cursor-pointer">
                  <input
                    v-model="agreedToTerms"
                    type="checkbox"
                    class="mt-1 mr-4 w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300"
                  />
                  <span class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-relaxed">
                    I agree to the 
                    <a href="#" class="text-indigo-600 hover:text-indigo-700 underline font-semibold transition-colors">Terms and Conditions</a>
                    and 
                    <a href="#" class="text-indigo-600 hover:text-indigo-700 underline font-semibold transition-colors">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <!-- Enhanced Submit Button -->
              <button
                @click="processDonation"
                :disabled="!canSubmit || processing"
                :class="[
                  'w-full py-5 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center transform shadow-xl',
                  canSubmit && !processing
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:scale-105 hover:shadow-2xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed scale-100'
                ]"
              >
                <span v-if="processing" class="flex items-center">
                  <div class="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  {{ donationDetails.type === 'subscription' ? 'Setting up...' : 'Processing...' }}
                </span>
                <span v-else class="flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                  {{ donationDetails.type === 'subscription' 
                    ? `Set up Monthly Donation (RM${finalAmount}/month)` 
                    : `Complete Donation (RM${finalAmount})` 
                  }}
                </span>
              </button>

              <!-- Enhanced Security Notice -->
              <div class="mt-6 text-center">
                <div class="inline-flex items-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                  <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <span class="text-xs text-gray-600 font-medium">Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 scale-100">
        <div class="p-8 text-center">
          <!-- Success Animation -->
          <div class="relative w-24 h-24 mx-auto mb-6">
            <div class="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
            <div class="relative w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <h3 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            {{ donationDetails.type === 'subscription' ? 'Monthly Donation Set Up!' : 'Donation Successful!' }}
          </h3>
          <p class="text-gray-600 mb-8 leading-relaxed text-lg">
            {{ donationDetails.type === 'subscription' 
              ? `Thank you for setting up a monthly donation of RM${finalAmount}. Your first payment has been processed and future payments will be automatically charged monthly.`
              : `Thank you for your generous donation of RM${finalAmount}. Your contribution makes a real difference in children's lives!`
            }}
          </p>
          <div class="space-y-4">
            <button
              @click="goToDonations"
              class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Back to Donations
            </button>
            <button
              @click="closeModal"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-8 rounded-xl font-semibold transition-all duration-300 border border-gray-300 hover:border-gray-400"
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
const donationDetails = ref({
  amount: parseFloat(route.query.amount) || 0,
  type: route.query.type || 'onetime', // 'onetime' or 'subscription'
  category: route.query.category || 'general',
  event_id: route.query.event_id || null
});

const fixedAmount = ref(donationDetails.value.amount > 0 ? donationDetails.value.amount.toString() : '');
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
  const minimumAmount = donationDetails.value.type === 'subscription' ? 25 : 10;
  return parseFloat(finalAmount.value) >= minimumAmount && 
         paymentForm.value.firstName.trim() && 
         paymentForm.value.lastName.trim() && 
         paymentForm.value.email.trim() && 
         agreedToTerms.value &&
         !processing.value &&
         cardElement;
});

// Helper functions
const getImpactMessage = () => {
  const amount = parseFloat(finalAmount.value) || 0;
  
  if (donationDetails.value.type === 'subscription') {
    if (amount >= 100) {
      return 'Your monthly donation can provide ongoing healthcare, education, and nutrition support for multiple children each month.';
    } else if (amount >= 50) {
      return 'Your monthly donation can provide consistent educational supplies and meals for children throughout the year.';
    } else if (amount >= 25) {
      return 'Your monthly donation provides steady support for essential needs like food and basic supplies.';
    }
    return 'Your monthly commitment, no matter the size, creates lasting positive change in children\'s lives.';
  }
  
  if (amount >= 400) {
    return 'Your donation can cover healthcare check-ups for multiple children and provide educational supplies for several months.';
  } else if (amount >= 200) {
    return 'Your donation can fund meals for a child for two weeks and provide essential school supplies.';
  } else if (amount >= 100) {
    return 'Your donation can provide educational supplies for one child for a month.';
  } else if (amount >= 50) {
    return 'Your donation can help provide nutritious meals and basic supplies for children in need.';
  }
  return 'Every donation, no matter the size, makes a meaningful difference in a child\'s life.';
};

// Redirect to login function
const redirectToLogin = () => {
  // You can customize this based on your app's login route
  navigateTo('/auth/login?redirect=' + encodeURIComponent(route.fullPath));
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

// Process one-time donation
const processOnTimeDonation = async () => {
  if (!canSubmit.value || !stripe || !cardElement) return;

  const amount = parseFloat(finalAmount.value);
  if (amount < 10) {
    alert('Minimum donation amount is RM 10.00');
    return;
  }

  processing.value = true;

  try {
    console.log('🔍 Processing one-time donation...');
    
    // Send data in the format your unified API expects
    const donationData = {
      amount: amount,
      currency: 'myr',
      category: donationDetails.value.category || 'general',
      type: 'onetime', // Explicitly set type
      message: donationMessage.value || null,
      event_id: donationDetails.value.event_id || null,
      // Add customer_info object that your API expects
      customer_info: {
        firstName: paymentForm.value.firstName,
        lastName: paymentForm.value.lastName,
        email: paymentForm.value.email
      }
    };

    console.log('🎯 Sending donation data:', donationData);

    const response = await $fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      body: donationData
    });

    console.log('🎯 API Response:', response);

    if (!response.client_secret) {
      console.error('❌ No client_secret in response!');
      throw new Error('Failed to create payment intent - no client_secret returned');
    }

    console.log('💳 Confirming payment...');
    
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
    console.error('❌ Donation error:', error);
    
    let errorMessage = error.message;
    
    // Better error handling
    if (error.name === 'FetchError') {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.cause?.code === 'FETCH_ERROR') {
      errorMessage = 'Unable to connect to payment server. Please try again.';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Connection error. Please check your internet and try again.';
    }
    
    alert(`Donation failed: ${errorMessage}`);
  } finally {
    processing.value = false;
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

    // Create subscription - send data in format your API expects
    const subscriptionData = {
      amount: amount,
      currency: 'myr',
      category: donationDetails.value.category || 'general',
      message: donationMessage.value || null,
      event_id: donationDetails.value.event_id || null,
      payment_method: paymentMethod,
      // Add customer info for consistency
      customer_info: {
        firstName: paymentForm.value.firstName,
        lastName: paymentForm.value.lastName,
        email: paymentForm.value.email
      }
    };

    console.log('🎯 Sending subscription data:', subscriptionData);

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
    
    // Better error handling (matching the donation function)
    if (error.name === 'FetchError') {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.cause?.code === 'FETCH_ERROR') {
      errorMessage = 'Unable to connect to payment server. Please try again.';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Connection error. Please check your internet and try again.';
    }
    
    alert(`Subscription setup failed: ${errorMessage}`);
  } finally {
    processing.value = false;
  }
};

// Main processing function that determines which to call
const processDonation = async () => {
  if (donationDetails.value.type === 'onetime') {
    await processOnTimeDonation();
  } else if (donationDetails.value.type === 'subscription') {
    await processSubscription();
  } else {
    console.error('Unknown donation type:', donationDetails.value.type);
    alert('Invalid donation type. Please try again.');
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