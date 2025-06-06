<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary-900 text-white py-16 md:py-24">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">Make a Difference Today</h1>
          <p class="text-xl text-primary-100">Your donation helps provide education, healthcare, and a brighter future for children at Jing Sun Welfare Society.</p>
        </div>
      </div>
    </section>
    
    <!-- Donation Options -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div 
              v-for="(option, index) in donationOptions" 
              :key="index"
              class="border rounded-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-lg cursor-pointer"
              :class="{ 'border-primary-500 bg-primary-50': selectedOption === index, 'border-neutral-200': selectedOption !== index }"
              @click="selectOption(index)"
            >
              <div class="p-6">
                <div class="text-2xl font-bold mb-2 text-primary-600">RM {{ option.amount }}</div>
                <p class="text-neutral-600 mb-4">{{ option.description }}</p>
                <div 
                  class="w-5 h-5 rounded-full border flex items-center justify-center"
                  :class="{ 'border-primary-500': selectedOption === index, 'border-neutral-300': selectedOption !== index }"
                >
                  <div v-if="selectedOption === index" class="w-3 h-3 rounded-full bg-primary-500"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-neutral-50 p-6 rounded-lg mb-8">
            <h3 class="text-lg font-medium mb-4">Custom Amount</h3>
            <div class="flex items-center">
              <div class="flex-none w-12 text-center text-lg font-medium text-neutral-700">RM</div>
              <input 
                type="number" 
                v-model="customAmount" 
                class="input flex-grow"
                placeholder="Enter amount"
                min="1"
                step="0.01"
                @input="selectedOption = -1"
              />
            </div>
          </div>
          
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">Donation Frequency</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                type="button"
                class="py-3 px-4 rounded-lg border text-center font-medium transition-colors text-sm"
                :class="donationType === 'onetime' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'"
                @click="donationType = 'onetime'"
              >
                One-time Donation
              </button>
              <button 
                type="button"
                class="py-3 px-4 rounded-lg border text-center font-medium transition-colors text-sm"
                :class="donationType === 'subscription' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'"
                @click="donationType = 'subscription'"
              >
                Monthly Donation
              </button>
            </div>
          </div>
          
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">Where You'd Like to Help</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                v-for="(category, index) in donationCategories" 
                :key="index"
                class="border rounded-lg p-4 cursor-pointer"
                :class="{ 'border-primary-500 bg-primary-50': selectedCategory === index, 'border-neutral-200': selectedCategory !== index }"
                @click="selectCategory(index)"
              >
                <div class="flex items-start">
                  <div 
                    class="w-5 h-5 rounded-full border flex-none mt-0.5 flex items-center justify-center"
                    :class="{ 'border-primary-500': selectedCategory === index, 'border-neutral-300': selectedCategory !== index }"
                  >
                    <div v-if="selectedCategory === index" class="w-3 h-3 rounded-full bg-primary-500"></div>
                  </div>
                  <div class="ml-3">
                    <div class="font-medium text-neutral-900">{{ category.name }}</div>
                    <p class="text-sm text-neutral-600">{{ category.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Optional Message -->
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">Optional Message</h3>
            <textarea 
              v-model="donationMessage" 
              class="w-full p-3 border border-neutral-200 rounded-lg resize-none"
              rows="3"
              placeholder="Leave a message with your donation (optional)"
            ></textarea>
          </div>
          
          <div class="bg-neutral-100 p-6 rounded-lg mb-8">
            <h3 class="text-lg font-medium mb-4">Donation Summary</h3>
            <div class="flex justify-between mb-2">
              <span class="text-neutral-600">Donation Amount:</span>
              <span class="font-medium">RM {{ getDonationAmount().toFixed(2) }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-neutral-600">Frequency:</span>
              <span class="font-medium">{{ donationType === 'onetime' ? 'One-time' : 'Monthly' }}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-neutral-600">Category:</span>
              <span class="font-medium">{{ selectedCategory >= 0 ? donationCategories[selectedCategory].name : 'General Fund' }}</span>
            </div>
            <div class="border-t border-neutral-200 pt-4 mt-2">
              <div class="flex justify-between">
                <span class="text-lg font-medium">Total:</span>
                <span class="text-lg font-bold text-primary-600">RM {{ getDonationAmount().toFixed(2) }}{{ donationType === 'subscription' ? '/month' : '' }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-8 text-center">
            <button 
              type="button" 
              @click="processDonation"
              :disabled="processing || getDonationAmount() <= 0"
              class="inline-block py-3 px-8 bg-primary-600 text-white font-medium rounded-lg shadow-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ processing ? 'Processing...' : 'Complete Donation' }}
            </button>
            <p class="mt-4 text-sm text-neutral-500">
              Secure payment processing. Your financial information is never stored on our servers.
            </p>
          </div>

          <!-- Error Display -->
          <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-800">{{ errorMessage }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'default'
});

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
const processing = ref(false);
const errorMessage = ref('');

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

const processDonation = async () => {
  const amount = getDonationAmount();
  
  if (amount <= 0) {
    errorMessage.value = 'Please select a donation amount';
    return;
  }

  // Minimum donation check (adjust as needed)
  if (amount < 10) {
    errorMessage.value = 'Minimum donation amount is RM 10.00';
    return;
  }

  processing.value = true;
  errorMessage.value = '';

  try {
    const donationData = {
      amount: amount,
      currency: 'myr',
      type: donationType.value,
      category: selectedCategory.value >= 0 ? donationCategories[selectedCategory.value].name.toLowerCase() : 'general',
      message: donationMessage.value || null,
      event_id: null // Add if you have specific events
    };

    let response;
    
    if (donationType.value === 'onetime') {
      // Create payment intent for one-time donation
      response = await $fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        body: donationData
      });
      
      // Redirect to Stripe Checkout or handle client-side confirmation
      if (response.client_secret) {
        await navigateTo(`/donation/confirm?client_secret=${response.client_secret}&donation_id=${response.donation_id}`);
      }
    } else {
      // Create subscription for recurring donation
      response = await $fetch('/api/stripe/create-subscription', {
        method: 'POST',
        body: donationData
      });
      
      if (response.subscription_id) {
        await navigateTo(`/donation/confirm?subscription_id=${response.subscription_id}`);
      }
    }
  } catch (error) {
    console.error('Donation processing error:', error);
    
    // Display user-friendly error messages
    if (error.data?.message) {
      errorMessage.value = error.data.message;
    } else if (error.message) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'There was an error processing your donation. Please try again.';
    }
  } finally {
    processing.value = false;
  }
};
</script>