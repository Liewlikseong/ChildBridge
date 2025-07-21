<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Enhanced Hero Section -->
    <section class="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-16 md:py-24 relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div class="container-custom relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            Secure Donation Platform
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Make a Difference Today
          </h1>
          <p class="text-xl text-indigo-100">
            Your donation helps provide education, healthcare, and a brighter future for children at Jing Sun Welfare Society.
          </p>
        </div>
      </div>
    </section>

    <!-- Enhanced Main Section -->
    <section class="py-16 relative">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          
          <!-- Enhanced Donation Options -->
          <div class="mb-12">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                Choose Your Impact
              </h2>
              <p class="text-gray-600 text-lg">Select an amount that feels right for you</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                v-for="(option, index) in donationOptions"
                :key="index"
                class="bg-white/80 backdrop-blur-sm border-2 rounded-2xl overflow-hidden transition-transform hover:scale-105 hover:shadow-lg cursor-pointer shadow-xl relative group"
                :class="{ 
                  'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-purple-500/20': selectedOption === index, 
                  'border-gray-200 hover:border-purple-300': selectedOption !== index 
                }"
                @click="selectOption(index)"
              >
                <!-- Selection badge -->
                <div v-if="selectedOption === index" class="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                
                <div class="p-6">
                  <div class="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    RM {{ option.amount }}
                  </div>
                  <p class="text-gray-600 mb-4 leading-relaxed">{{ option.description }}</p>
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                    :class="{ 
                      'border-purple-500 bg-purple-500': selectedOption === index, 
                      'border-gray-300 group-hover:border-purple-400': selectedOption !== index 
                    }"
                  >
                    <div v-if="selectedOption === index" class="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
                
                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

          <!-- Enhanced Custom Amount -->
          <div class="bg-white/80 backdrop-blur-sm p-8 rounded-2xl mb-8 shadow-xl border border-white/20">
            <div class="flex items-center mb-6">
              <div class="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Custom Amount
              </h3>
            </div>
            <div class="flex items-center">
              <div class="flex-none w-16 text-center text-lg font-bold text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-l-xl py-4 px-3 border-2 border-r-0 border-blue-200">
                RM
              </div>
              <input
                type="number"
                v-model="customAmount"
                class="flex-grow px-4 py-4 border-2 border-blue-200 rounded-r-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-semibold bg-white"
                placeholder="Enter amount"
                min="1"
                step="0.01"
                @input="selectedOption = -1"
              />
            </div>
          </div>

          <!-- Enhanced Donation Frequency -->
          <div class="mb-8">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Donation Frequency
              </h3>
              <p class="text-gray-600">Choose how you'd like to give</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                type="button"
                class="relative p-6 rounded-2xl border-2 text-center font-bold transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-xl hover:scale-105 group"
                :class="donationType === 'onetime' ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 shadow-emerald-500/20' : 'border-gray-200 text-gray-700 hover:border-emerald-300 hover:shadow-lg'"
                @click="donationType = 'onetime'"
              >
                <div v-if="donationType === 'onetime'" class="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div class="mb-3">
                  <svg class="w-8 h-8 mx-auto mb-2" :class="donationType === 'onetime' ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
                <div class="text-lg font-bold mb-1">One-time Donation</div>
                <div class="text-sm opacity-75">Make an immediate impact</div>
              </button>
              <button
                type="button"
                class="relative p-6 rounded-2xl border-2 text-center font-bold transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-xl hover:scale-105 group"
                :class="donationType === 'subscription' ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 shadow-blue-500/20' : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-lg'"
                @click="donationType = 'subscription'"
              >
                <div v-if="donationType === 'subscription'" class="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div class="mb-3">
                  <svg class="w-8 h-8 mx-auto mb-2" :class="donationType === 'subscription' ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <div class="text-lg font-bold mb-1">Monthly Donation</div>
                <div class="text-sm opacity-75">Sustained support</div>
              </button>
            </div>
          </div>

          <!-- Enhanced Category Selection -->
          <div class="mb-8">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Where You'd Like to Help
              </h3>
              <p class="text-gray-600">Choose the area that matters most to you</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                v-for="(category, index) in donationCategories"
                :key="index"
                class="bg-white/80 backdrop-blur-sm border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-xl hover:scale-105 relative group"
                :class="{ 
                  'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-orange-500/20': selectedCategory === index, 
                  'border-gray-200 hover:border-orange-300 hover:shadow-lg': selectedCategory !== index 
                }"
                @click="selectCategory(index)"
              >
                <div v-if="selectedCategory === index" class="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                
                <div class="flex items-start">
                  <div
                    class="w-5 h-5 rounded-full border-2 flex-none mt-1 flex items-center justify-center transition-all duration-300"
                    :class="{ 
                      'border-orange-500 bg-orange-500': selectedCategory === index, 
                      'border-gray-300 group-hover:border-orange-400': selectedCategory !== index 
                    }"
                  >
                    <div v-if="selectedCategory === index" class="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div class="ml-4">
                    <div class="font-bold text-lg text-gray-900 mb-2">{{ category.name }}</div>
                    <p class="text-sm text-gray-600 leading-relaxed">{{ category.description }}</p>
                  </div>
                </div>
                
                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            </div>
          </div>

          <!-- Enhanced Optional Message -->
          <div class="bg-white/80 backdrop-blur-sm p-8 rounded-2xl mb-8 shadow-xl border border-white/20">
            <div class="flex items-center mb-6">
              <div class="p-3 bg-gradient-to-r from-pink-500 to-red-600 rounded-xl mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Message (Optional) 
              </h3>
            </div>
            <textarea
              v-model="donationMessage"
              class="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300 bg-white"
              rows="4"
              placeholder="Leave a heartfelt message with your donation (optional)"
            ></textarea>
          </div>

          <!-- Enhanced Donation Summary -->
          <div class="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl mb-8 shadow-xl border border-white/20">
            <div class="flex items-center mb-6">
              <div class="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Donation Summary
              </h3>
            </div>
            
            <div class="space-y-4">
              <div class="flex justify-between items-center py-3 border-b border-gray-200">
                <span class="text-gray-600 font-medium">Donation Amount:</span>
                <span class="font-bold text-lg">RM {{ getDonationAmount().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-gray-200">
                <span class="text-gray-600 font-medium">Frequency:</span>
                <span class="font-bold">{{ donationType === 'onetime' ? 'One-time' : 'Monthly' }}</span>
              </div>
              <div class="flex justify-between items-center py-3 border-b border-gray-200">
                <span class="text-gray-600 font-medium">Category:</span>
                <span class="font-bold">{{ selectedCategory >= 0 ? donationCategories[selectedCategory].name : 'General Fund' }}</span>
              </div>
              
              <!-- Enhanced Total -->
              <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                <div class="flex justify-between items-center">
                  <span class="text-xl font-semibold">Total:</span>
                  <span class="text-3xl font-bold">RM {{ getDonationAmount().toFixed(2) }}{{ donationType === 'subscription' ? '/month' : '' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Action Section -->
          <div class="text-center">
            <button
              type="button"
              @click="proceedToConfirmation"
              :disabled="getDonationAmount() <= 0"
              :class="[
                'inline-flex items-center py-4 px-10 font-bold text-lg rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105',
                getDonationAmount() > 0
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-2xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
              ]"
            >
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              Proceed to Payment
            </button>
            
            <!-- Security notice -->
            <div class="mt-6">
              <div class="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
                <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <span class="text-sm text-gray-600 font-medium">Secure payment processing • Your data is protected</span>
              </div>
            </div>
          </div>

          <!-- Enhanced Error Message -->
          <div v-if="errorMessage" class="fixed top-4 right-4 z-50 max-w-md">
            <div class="bg-red-50 border border-red-200 rounded-xl p-4 shadow-xl backdrop-blur-sm">
              <div class="flex items-center">
                <div class="p-2 bg-red-100 rounded-lg mr-3">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-red-800 font-medium">{{ errorMessage }}</p>
                </div>
                <button @click="errorMessage = ''" class="ml-2 text-red-400 hover:text-red-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter

definePageMeta({
  layout: 'default'
});

const router = useRouter(); // Initialize useRouter

// Updated amounts for MYR (Malaysian Ringgit)
const donationOptions = [
  { amount: 100, description: 'Provides educational supplies for one child for a month' },
  { amount: 200, description: 'Funds meals for a child for two weeks' },
  { amount: 400, description: 'Covers healthcare check-ups for five children' },
];

const donationCategories = [
  {
    name: 'Education',
    description: 'Support classroom materials, books, and educational programs'
  },
  {
    name: 'Healthcare',
    description: 'Fund medical check-ups, vaccinations, and health education'
  },
  {
    name: 'Nutrition',
    description: 'Provide nutritious meals and food supplies'
  },
  {
    name: 'General Fund',
    description: 'Allow us to allocate funds where they are most needed'
  }
];

// Reactive variables
const selectedOption = ref(1); // Default selected option (200)
const customAmount = ref('');
const donationType = ref('onetime');
const selectedCategory = ref(3); // Default to "General Fund"
const donationMessage = ref('');
const errorMessage = ref(''); // Keep this for immediate validation feedback

const selectOption = (index) => {
  selectedOption.value = index;
  customAmount.value = '';
  errorMessage.value = '';
};

const selectCategory = (index) => {
  selectedCategory.value = index;
};

const getDonationAmount = () => {
  if (selectedOption.value >= 0) {
    return donationOptions[selectedOption.value].amount;
  } else if (customAmount.value) {
    return parseFloat(customAmount.value) || 0;
  }
  return 0;
};

const proceedToConfirmation = () => {
  const amount = getDonationAmount();

  if (amount <= 0) {
    errorMessage.value = 'Please select a donation amount or enter a custom amount.';
    return;
  }

  if (amount < 10) {
    errorMessage.value = 'Minimum donation amount is RM 10.00.';
    return;
  }

  errorMessage.value = '';

  // Set dynamic path based on donation type
  const path = donationType.value === 'subscription'
    ? '/subscription/confirm'
    : '/donation/confirm';

  router.push({
    path,
    query: {
      amount: amount,
      type: donationType.value,
      category: donationCategories[selectedCategory.value].name,
      message: donationMessage.value || undefined,
    }
  });
};
</script>