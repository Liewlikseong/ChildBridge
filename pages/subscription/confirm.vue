<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Enhanced Hero Section -->
    <section class="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white py-16 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div class="container-custom relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Monthly Giving
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Set Up Monthly Donation
          </h1>
          <p class="text-xl text-indigo-100">
            Join our monthly giving community and make a lasting impact on children's lives.
          </p>
        </div>
      </div>
    </section>

    <!-- Enhanced Payment Form Section -->
    <section class="py-16 relative">
      <div class="container-custom">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <!-- Enhanced Subscription Summary -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div class="flex items-center mb-8">
                <div class="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Monthly Donation Summary
                </h2>
              </div>
              
              <!-- Enhanced Subscription Details -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
                <h3 class="text-xl font-bold text-blue-800 mb-4">{{ subscriptionDetails.category || 'General Fund' }}</h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-blue-700 font-medium">Type:</span>
                    <span class="font-bold text-blue-800">Monthly Recurring Donation</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-blue-700 font-medium">Start Date:</span>
                    <span class="font-bold text-blue-800">{{ new Date().toLocaleDateString() }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-blue-700 font-medium">Next Payment:</span>
                    <span class="font-bold text-blue-800">{{ getNextPaymentDate() }}</span>
                  </div>
                </div>
              </div>

              <!-- Enhanced Amount Section -->
              <div class="mb-6">
                <div class="flex items-center mb-4">
                  <div class="p-2 bg-emerald-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                  </div>
                  <label class="text-lg font-bold text-gray-800">
                    Monthly Donation Amount
                  </label>
                </div>
                <div class="flex items-center bg-white border-2 border-emerald-200 rounded-xl focus-within:ring-4 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all duration-300">
                  <span class="px-4 py-4 text-emerald-600 font-bold text-lg bg-emerald-50 border-r border-emerald-200">RM</span>
                  <input
                    v-model="monthlyAmount"
                    type="number"
                    min="25"
                    step="0.01"
                    :disabled="!!fixedAmount"
                    class="flex-1 px-4 py-4 border-0 rounded-r-xl focus:ring-0 focus:outline-none text-lg font-bold bg-white disabled:bg-gray-100 disabled:text-gray-500"
                    :placeholder="fixedAmount ? fixedAmount : 'Enter monthly amount'"
                  />
                </div>
                <p class="text-sm text-emerald-600 mt-3 font-medium bg-emerald-50 rounded-lg p-3">
                  Minimum monthly donation: RM 25.00
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
                  rows="3"
                  class="w-full px-4 py-4 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white resize-none"
                  placeholder="Leave a message with your monthly donation..."
                ></textarea>
              </div>

              <!-- Enhanced Monthly Impact Statement -->
              <div class="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
                <div class="flex items-center mb-4">
                  <div class="p-2 bg-orange-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-lg text-orange-800">Your Monthly Impact</h4>
                </div>
                <p class="text-orange-700 leading-relaxed">
                  {{ getMonthlyImpactMessage() }}
                </p>
              </div>

              <!-- Enhanced Annual Impact -->
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <div class="flex items-center mb-4">
                  <div class="p-2 bg-green-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-lg text-green-800">Annual Impact</h4>
                </div>
                <p class="text-green-700 font-medium mb-2">
                  Your total annual contribution: <strong class="text-xl">RM{{ (parseFloat(finalAmount) * 12).toFixed(2) }}</strong>
                </p>
                <p class="text-sm text-green-600">
                  {{ getAnnualImpactMessage() }}
                </p>
              </div>

              <!-- Enhanced Subscription Management -->
              <div class="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6 mb-6">
                <div class="flex items-center mb-4">
                  <div class="p-2 bg-cyan-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-lg text-cyan-800">Easy Management</h4>
                </div>
                <div class="space-y-2 text-cyan-700">
                  <p class="flex items-center"><span class="text-green-500 mr-2">✓</span> Cancel or modify anytime from your dashboard</p>
                  <p class="flex items-center"><span class="text-green-500 mr-2">✓</span> Email receipts for tax purposes</p>
                  <p class="flex items-center"><span class="text-green-500 mr-2">✓</span> Regular updates on your impact</p>
                </div>
              </div>

              <!-- Enhanced Total -->
              <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white mb-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xl font-semibold">Monthly Charge:</span>
                  <span class="text-3xl font-bold">RM{{ finalAmount }}</span>
                </div>
                <p class="text-indigo-100 text-sm">
                  First payment today, then on the {{ new Date().getDate() }}{{ getOrdinalSuffix(new Date().getDate()) }} of each month
                </p>
              </div>
            </div>

            <!-- Enhanced Payment Form -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div class="flex items-center mb-8">
                <div class="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                </div>
                <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Payment Information
                </h2>
              </div>
              
              <!-- Enhanced Authentication Notice -->
              <div v-if="!user" class="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
                <div class="flex items-start">
                  <div class="p-2 bg-yellow-500 rounded-lg mr-3 mt-1">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-lg text-yellow-800 mb-2">Account Required</h4>
                    <p class="text-yellow-700 mb-4 leading-relaxed">You need to be logged in to set up monthly donations. This helps us manage your subscription and send you updates.</p>
                    <button @click="redirectToLogin" class="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                      </svg>
                      Sign In or Create Account
                    </button>
                  </div>
                </div>
              </div>

              <!-- Enhanced Donor Information -->
              <div class="mb-8" :class="{ 'opacity-50 pointer-events-none': !user }">
                <div class="flex items-center mb-6">
                  <div class="p-2 bg-blue-500 rounded-lg mr-3">
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
                      class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white font-medium"
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
                      class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white font-medium"
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
                    class="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white font-medium"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <!-- Enhanced Payment Method -->
              <div class="mb-8" :class="{ 'opacity-50 pointer-events-none': !user }">
                <div class="flex items-center mb-6">
                  <div class="p-2 bg-indigo-500 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-800">Payment Method</h3>
                </div>
                
                <!-- Clean card input design -->
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
                <p class="text-sm text-indigo-600 mt-3 font-medium bg-indigo-50 rounded-lg p-3">
                  Your payment method will be securely saved for future monthly charges
                </p>
              </div>

              <!-- Enhanced Subscription Terms -->
              <div class="mb-8" :class="{ 'opacity-50 pointer-events-none': !user }">
                <label class="flex items-start group cursor-pointer">
                  <input
                    v-model="agreedToTerms"
                    type="checkbox"
                    class="mt-1 mr-4 w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300"
                  />
                  <span class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-relaxed">
                    I agree to the monthly subscription terms, 
                    <a href="#" class="text-indigo-600 hover:text-indigo-700 underline font-semibold transition-colors">Terms and Conditions</a>
                    and 
                    <a href="#" class="text-indigo-600 hover:text-indigo-700 underline font-semibold transition-colors">Privacy Policy</a>.
                    I understand I can cancel or modify my subscription at any time.
                  </span>
                </label>
              </div>

              <!-- Enhanced Submit Button -->
              <button
                @click="processSubscription"
                :disabled="!canSubmit || processing"
                :class="[
                  'w-full py-5 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center transform shadow-xl',
                  canSubmit && !processing
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:scale-105 hover:shadow-2xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed scale-100'
                ]"
              >
                <span v-if="processing" class="flex items-center">
                  <div class="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Setting up subscription...
                </span>
                <span v-else class="flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Start Monthly Donation (RM{{ finalAmount }}/month)
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
            <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
            <div class="relative w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <h3 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Monthly Donation Active!
          </h3>
          <p class="text-gray-600 mb-8 leading-relaxed text-lg">
            Thank you for setting up a monthly donation of RM{{ finalAmount }}. Your first payment has been processed and future payments will be automatically charged on the {{ new Date().getDate() }}{{ getOrdinalSuffix(new Date().getDate()) }} of each month.
          </p>
          <div class="space-y-4">
            <button
              @click="goToDonations"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View Your Donations History
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