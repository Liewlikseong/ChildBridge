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
                <div class="text-2xl font-bold mb-2 text-primary-600">${{ option.amount }}</div>
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
              <div class="flex-none w-12 text-center text-lg font-medium text-neutral-700">$</div>
              <input 
                type="number" 
                v-model="customAmount" 
                class="input flex-grow"
                placeholder="Enter amount"
                min="1"
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
                :class="donationType === 'monthly' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'"
                @click="donationType = 'monthly'"
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
          
          <div class="bg-neutral-100 p-6 rounded-lg mb-8">
            <h3 class="text-lg font-medium mb-4">Donation Summary</h3>
            <div class="flex justify-between mb-2">
              <span class="text-neutral-600">Donation Amount:</span>
              <span class="font-medium">${{ getDonationAmount() }}</span>
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
                <span class="text-lg font-bold text-primary-600">${{ getDonationAmount() }}{{ donationType === 'monthly' ? '/month' : '' }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-8 text-center">
            <button 
              type="button" 
              @click="processDonation"
              class="inline-block py-3 px-8 bg-primary-600 text-white font-medium rounded-lg shadow-md hover:bg-primary-700 transition-colors"
            >
              Complete Donation
            </button>
            <p class="mt-4 text-sm text-neutral-500">
              Secure payment processing. Your financial information is never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Impact Stories -->
    <section class="py-16 bg-neutral-50">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">See Your Impact</h2>
          <p class="text-neutral-600 max-w-2xl mx-auto">Your donations make a real difference in the lives of children. Here are a few stories of transformation.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(story, index) in impactStories" :key="index" class="bg-white rounded-lg shadow-md overflow-hidden">
            <img :src="story.image" :alt="story.name" class="w-full h-48 object-cover" />
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{{ story.name }}</h3>
              <p class="text-neutral-600 mb-4">{{ story.story }}</p>
              <a href="#" class="text-primary-600 font-medium hover:text-primary-700">Read full story</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- FAQ Section -->
    <section class="py-16 bg-white">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p class="text-neutral-600 max-w-2xl mx-auto">Find answers to common questions about donating to Jing Sun Welfare Society through ChildBridge.</p>
        </div>
        
        <div class="max-w-3xl mx-auto">
          <div v-for="(faq, index) in faqs" :key="index" class="mb-4">
            <button 
              @click="toggleFaq(index)"
              class="flex justify-between items-center w-full p-4 text-left text-lg font-medium bg-neutral-50 hover:bg-neutral-100 rounded-lg focus:outline-none transition-colors"
            >
              <span>{{ faq.question }}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 text-neutral-500 transition-transform"
                :class="{ 'transform rotate-180': faq.open }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              v-if="faq.open"
              class="p-4 text-neutral-600 bg-neutral-50 rounded-b-lg border-t border-neutral-200"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="py-16 bg-primary-900 text-white">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Other Ways to Help</h2>
        <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">Beyond financial donations, there are many ways you can support the children at Jing Sun Welfare Society.</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="bg-primary-800 p-6 rounded-lg">
            <div class="w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Volunteer Remotely</h3>
            <p class="text-primary-200 mb-4">Share your skills by volunteering as a virtual tutor, translator, or mentor.</p>
            <a href="#" class="text-white font-medium hover:text-primary-100">Learn more</a>
          </div>
          
          <div class="bg-primary-800 p-6 rounded-lg">
            <div class="w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Advocacy</h3>
            <p class="text-primary-200 mb-4">Raise awareness about the orphanage by sharing on social media and with your network.</p>
            <a href="#" class="text-white font-medium hover:text-primary-100">Get resources</a>
          </div>
          
          <div class="bg-primary-800 p-6 rounded-lg">
            <div class="w-12 h-12 bg-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Fundraise</h3>
            <p class="text-primary-200 mb-4">Create your own fundraising campaign with friends, family, or colleagues.</p>
            <a href="#" class="text-white font-medium hover:text-primary-100">Start now</a>
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

const donationOptions = [
  { amount: 25, description: 'Provides educational supplies for one child for a month' },
  { amount: 50, description: 'Funds meals for a child for two weeks' },
  { amount: 100, description: 'Covers healthcare check-ups for five children' },
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

const impactStories = [
  {
    name: 'Lin',
    image: 'https://images.unsplash.com/photo-1588701107566-af76b932e2e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    story: 'Thanks to educational supplies funded by donors, Lin improved her reading skills and now dreams of becoming a teacher.'
  },
  {
    name: 'Wei',
    image: 'https://images.unsplash.com/photo-1617077644557-64be144aa306?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    story: 'After receiving proper healthcare funded by donations, Wei recovered from a chronic illness and is now excelling in sports.'
  },
  {
    name: 'Mei',
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    story: 'Access to nutritious meals has transformed Mei\'s health and energy levels, allowing her to focus better in school.'
  }
];

const faqs = [
  {
    question: 'How are my donations used?',
    answer: '90% of donations go directly to programs supporting children at Jing Sun Welfare Society, with only 10% used for administrative costs. We provide detailed reports on how funds are allocated.',
    open: true
  },
  {
    question: 'Is my donation tax-deductible?',
    answer: 'Yes, ChildBridge is a registered 501(c)(3) nonprofit organization, and all donations are tax-deductible to the extent allowed by law. You will receive a tax receipt for your records.',
    open: false
  },
  {
    question: 'Can I sponsor a specific child?',
    answer: 'Currently, we focus on supporting all children at Jing Sun Welfare Society rather than individual sponsorships. This ensures that all children receive equal care and resources.',
    open: false
  },
  {
    question: 'How can I see the impact of my donation?',
    answer: 'After creating an account, you\'ll receive regular updates from the orphanage showing how donations are being used. You can also communicate directly with staff through our messaging system.',
    open: false
  },
  {
    question: 'Is it possible to visit the orphanage?',
    answer: 'Yes, supporters can arrange visits to Jing Sun Welfare Society. Please contact us at least two months in advance to organize a visit that minimizes disruption to the children\'s routines.',
    open: false
  }
];

const selectedOption = ref(1); // Default selected option (50)
const customAmount = ref('');
const donationType = ref('onetime');
const selectedCategory = ref(3); // Default to "General Fund"

const selectOption = (index) => {
  selectedOption.value = index;
  customAmount.value = '';
};

const selectCategory = (index) => {
  selectedCategory.value = index;
};

const toggleFaq = (index) => {
  faqs[index].open = !faqs[index].open;
};

const getDonationAmount = () => {
  if (selectedOption.value >= 0) {
    return donationOptions[selectedOption.value].amount;
  } else if (customAmount.value) {
    return parseFloat(customAmount.value);
  }
  return 0;
};

const processDonation = () => {
  // This would normally connect to a payment processor
  // For now, we'll just show a simple alert
  alert(`Thank you for your ${donationType.value === 'monthly' ? 'monthly' : 'one-time'} donation of $${getDonationAmount()}!`);
};
</script>