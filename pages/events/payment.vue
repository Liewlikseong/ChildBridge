<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary-900 text-white py-16">
      <div class="container-custom">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            {{ eventData?.title || 'Payment' }}
          </h1>
          <p class="text-xl text-primary-100">
            Complete your {{ paymentType }} securely.
          </p>
        </div>
      </div>
    </section>

    <!-- Payment Form Section -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Products/Items Section -->
            <div class="lg:col-span-2">
              <!-- Products for Selling Events -->
              <div v-if="eventData?.event_type === 'selling' && products.length > 0">
                <h2 class="text-2xl font-bold mb-6">Available Products</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div 
                    v-for="product in products" 
                    :key="product.id" 
                    class="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <img 
                      :src="product.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'"
                      :alt="product.name"
                      class="w-full h-48 object-cover"
                    />
                    <div class="p-4">
                      <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
                      <p class="text-gray-600 text-sm mb-3">{{ product.description }}</p>
                      <div class="flex justify-between items-center">
                        <span class="text-xl font-bold text-primary-600">
                          RM{{ product.price.toFixed(2) }}
                        </span>
                        <button
                          @click="addToCart(product)"
                          :disabled="!product.available"
                          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                      <p v-if="product.stock_quantity" class="text-sm text-gray-500 mt-2">
                        {{ product.stock_quantity }} in stock
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Donation Section -->
              <div v-if="isDonationEvent" class="bg-green-50 rounded-lg p-6 mb-8">
                <h3 class="text-xl font-semibold text-green-800 mb-4">Make a Donation</h3>
                <div class="flex gap-4">
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Donation Amount (RM)
                    </label>
                    <input
                      v-model="donationAmount"
                      type="number"
                      min="1"
                      step="0.01"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter amount"
                    />
                  </div>
                  <button
                    @click="addDonationToCart"
                    :disabled="!donationAmount || parseFloat(donationAmount) <= 0"
                    class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors self-end"
                  >
                    Add Donation
                  </button>
                </div>
                
                <!-- Donation Message -->
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    v-model="donationMessage"
                    rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Leave a message with your donation..."
                  ></textarea>
                </div>
              </div>

              <!-- Event Details -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-4">Event Details</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ formatEventDate() }}</span>
                  </div>
                  <div v-if="eventData?.location" class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                    </svg>
                    <span>{{ eventData.location }}</span>
                  </div>
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="capitalize">{{ eventData?.event_type || paymentType }} Event</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cart & Checkout Section -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <div class="flex items-center mb-6">
                  <svg class="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h1M7 13v6a1 1 0 001 1h1m-2-6h10v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6z"/>
                  </svg>
                  <h2 class="text-xl font-semibold">Your Order</h2>
                </div>

                <!-- Cart Items -->
                <div v-if="cart.length === 0" class="text-gray-500 text-center py-8">
                  <p>Your cart is empty</p>
                  <p class="text-sm mt-1">
                    {{ eventData?.event_type === 'selling' ? 'Add products to get started' : 'Add a donation to continue' }}
                  </p>
                </div>

                <div v-else class="space-y-4 mb-6">
                  <div 
                    v-for="item in cart" 
                    :key="item.id" 
                    class="border-b border-gray-200 pb-4"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h4 class="font-medium">{{ item.productName }}</h4>
                        <p class="text-sm text-gray-500">{{ item.productDescription }}</p>
                        
                        <!-- Donation Amount Input -->
                        <div v-if="item.isDonation" class="mt-2">
                          <input
                            :value="item.unitPrice"
                            @input="updateDonationAmount(item.id, $event.target.value)"
                            type="number"
                            min="1"
                            step="0.01"
                            class="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <span class="text-sm text-gray-500 ml-1">RM</span>
                        </div>
                        
                        <!-- Product Quantity Controls -->
                        <div v-else class="flex items-center mt-2">
                          <button
                            @click="updateCartQuantity(item.id, item.quantity - 1)"
                            class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                            </svg>
                          </button>
                          <span class="mx-3 min-w-[2rem] text-center">{{ item.quantity }}</span>
                          <button
                            @click="updateCartQuantity(item.id, item.quantity + 1)"
                            class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div class="text-right ml-4">
                        <p class="font-medium">RM{{ item.totalPrice.toFixed(2) }}</p>
                        <button
                          @click="removeFromCart(item.id)"
                          class="text-red-500 hover:text-red-700 text-sm mt-1"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Order Summary -->
                <div v-if="cart.length > 0" class="space-y-2 mb-6">
                  <div class="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span class="text-primary-600">RM{{ subtotal.toFixed(2) }}</span>
                  </div>
                </div>

                <!-- Customer Information -->
                <div class="space-y-4 mb-6">
                  <h3 class="text-lg font-semibold">Contact Information</h3>
                  <div class="grid grid-cols-2 gap-3">
                    <input
                      v-model="paymentForm.firstName"
                      type="text"
                      placeholder="First Name *"
                      class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                      v-model="paymentForm.lastName"
                      type="text"
                      placeholder="Last Name *"
                      class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <input
                    v-model="paymentForm.email"
                    type="email"
                    placeholder="Email Address *"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
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

                <!-- Payment Button -->
                <button
                  v-if="cart.length > 0"
                  @click="processPayment"
                  :disabled="!canSubmit || processing"
                  :class="[
                    'w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center',
                    canSubmit && !processing
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  ]"
                >
                  <span v-if="processing" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                  <span v-else class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                    Complete Payment (RM{{ subtotal.toFixed(2) }})
                  </span>
                </button>

                <!-- Security Notice -->
                <div v-if="cart.length > 0" class="mt-4 text-center">
                  <p class="text-xs text-gray-500 flex items-center justify-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    Your payment information is secure and encrypted.
                  </p>
                </div>
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
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
          <p class="text-gray-600 mb-4">
            Thank you for your {{ hasOnlyDonations ? 'generous donation' : 'purchase' }} of RM{{ subtotal.toFixed(2) }}.
            {{ hasOnlyDonations ? 'Your contribution makes a difference!' : 'You will receive a confirmation email shortly.' }}
          </p>
          
          <!-- Order Summary in Modal -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h4 class="font-semibold mb-2">Order Summary:</h4>
            <div class="space-y-1 text-sm">
              <div v-for="item in cart" :key="item.id" class="flex justify-between">
                <span>{{ item.productName }} {{ !item.isDonation ? `x${item.quantity}` : '' }}</span>
                <span>RM{{ item.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="border-t border-gray-300 pt-1 mt-2 font-semibold">
                <div class="flex justify-between">
                  <span>Total:</span>
                  <span>RM{{ subtotal.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

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
import { useRoute, useSupabaseClient, useSupabaseUser, navigateTo } from '#imports';

const route = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RVvV5R9hGUCBGvpabSsViVwSDDh3g902bSZruZee6dvLPLehVnCPBYmwdMTTfLsH391IP6oo8Iy9GkNAIKyuMd900gEHBJO57';
let stripe = null;
let elements = null;
let cardElement = null;

// Page data
const eventId = ref(route.query.eventId || '');
const paymentType = ref(route.query.type || 'donation');
const eventData = ref(null);
const products = ref([]);

// Cart and form data
const cart = ref([]);
const donationAmount = ref('');
const donationMessage = ref('');
const paymentForm = ref({
  firstName: '',
  lastName: '',
  email: user.value?.email || ''
});

// UI state
const processing = ref(false);
const showSuccessModal = ref(false);
const agreedToTerms = ref(false);

// Computed properties
const subtotal = computed(() => cart.value.reduce((sum, item) => sum + item.totalPrice, 0));

const isDonationEvent = computed(() => ['donation', 'fundraiser'].includes(eventData.value?.event_type));

const hasOnlyDonations = computed(() => cart.value.every(item => item.isDonation));

const canSubmit = computed(() => {
  return cart.value.length > 0 && 
         paymentForm.value.firstName.trim() && 
         paymentForm.value.lastName.trim() && 
         paymentForm.value.email.trim() && 
         agreedToTerms.value &&
         !processing.value &&
         cardElement;
});

// Cart management
const addToCart = (product) => {
  const existingItem = cart.value.find(item => item.productId === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
    existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
  } else {
    cart.value.push({
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      productDescription: product.description,
      unitPrice: product.price,
      quantity: 1,
      totalPrice: product.price,
      isDonation: false
    });
  }
};

const addDonationToCart = () => {
  const amount = parseFloat(donationAmount.value);
  if (amount > 0) {
    cart.value.push({
      id: Date.now(),
      productId: 'donation',
      productName: 'Donation',
      productDescription: donationMessage.value || 'Thank you for your generous donation',
      unitPrice: amount,
      quantity: 1,
      totalPrice: amount,
      isDonation: true
    });
    donationAmount.value = '';
  }
};

const updateCartQuantity = (cartItemId, newQuantity) => {
  if (newQuantity <= 0) {
    removeFromCart(cartItemId);
    return;
  }

  const item = cart.value.find(item => item.id === cartItemId);
  if (item && !item.isDonation) {
    item.quantity = newQuantity;
    item.totalPrice = newQuantity * item.unitPrice;
  }
};

const updateDonationAmount = (cartItemId, newAmount) => {
  const amount = parseFloat(newAmount) || 0;
  const item = cart.value.find(item => item.id === cartItemId);
  if (item && item.isDonation) {
    item.unitPrice = amount;
    item.totalPrice = amount;
  }
};

const removeFromCart = (cartItemId) => {
  const index = cart.value.findIndex(item => item.id === cartItemId);
  if (index !== -1) {
    cart.value.splice(index, 1);
  }
};

// Date formatting
const formatEventDate = () => {
  if (!eventData.value) return '';
  
  const startDate = new Date(eventData.value.event_startdate);
  const endDate = new Date(eventData.value.event_enddate);
  
  const formatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  if (startDate.toDateString() === endDate.toDateString()) {
    return startDate.toLocaleDateString('en-US', formatOptions);
  } else {
    return `${startDate.toLocaleDateString('en-US', formatOptions)} - ${endDate.toLocaleDateString('en-US', formatOptions)}`;
  }
};

// Fetch event and products data
const fetchEventData = async () => {
  if (!eventId.value) return;

  try {
    // Fetch event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId.value)
      .single();

    if (eventError) throw eventError;
    eventData.value = event;

    // Fetch products if it's a selling event
    if (event.event_type === 'selling') {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('event_id', eventId.value)
        .eq('available', true);

      if (productsError) throw productsError;
      products.value = productsData || [];
    }

  } catch (error) {
    console.error('Error fetching event data:', error);
    alert('Failed to load event data');
  }
};

// Initialize Stripe
const initializeStripe = async () => {
  console.log('🔄 Starting Stripe initialization...');
  
  try {
    if (!window.Stripe) {
      console.log('📦 Loading Stripe script...');
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => {
        console.log('✅ Stripe script loaded');
        setupStripe();
      };
      script.onerror = () => {
        console.error('❌ Failed to load Stripe script');
      };
      document.head.appendChild(script);
    } else {
      console.log('✅ Stripe already available');
      setupStripe();
    }
  } catch (error) {
    console.error('❌ Error loading Stripe:', error);
  }
};

// Setup Stripe elements - matching your donation page exactly
const setupStripe = () => {
  console.log('🔧 Setting up Stripe elements...');
  
  try {
    if (!window.Stripe) {
      console.error('❌ Stripe not available on window');
      return;
    }

    stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
    console.log('✅ Stripe instance created');
    
    elements = stripe.elements();
    console.log('✅ Stripe elements created');

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
    console.log('✅ Card element created');

    // Check if DOM element exists before mounting
    const cardContainer = document.getElementById('card-element');
    if (cardContainer) {
      cardElement.mount('#card-element');
      console.log('✅ Card element mounted successfully');
    } else {
      console.error('❌ Card element container not found, retrying...');
      // Retry after a short delay
      setTimeout(() => {
        const retryContainer = document.getElementById('card-element');
        if (retryContainer) {
          cardElement.mount('#card-element');
          console.log('✅ Card element mounted on retry');
        } else {
          console.error('❌ Card element container still not found');
        }
      }, 500);
    }

    cardElement.on('change', ({ error }) => {
      console.log('💳 Card element change event:', error ? error.message : 'No error');
      const displayError = document.getElementById('card-errors');
      if (displayError) {
        if (error) {
          displayError.textContent = error.message;
        } else {
          displayError.textContent = '';
        }
      }
    });

    cardElement.on('ready', () => {
      console.log('✅ Card element is ready for input');
    });

    cardElement.on('focus', () => {
      console.log('🎯 Card element focused');
    });

  } catch (error) {
    console.error('❌ Error setting up Stripe:', error);
  }
};

// Process payment
const processPayment = async () => {
  if (!canSubmit.value || !stripe || !cardElement) return;

  processing.value = true;

  try {
    console.log('🔍 Creating payment intent...');
    
    // Prepare order items
    const orderItems = cart.value.map(item => ({
      product_id: item.productId === 'donation' ? null : item.productId,
      product_name: item.productName,
      product_price: item.unitPrice,
      quantity: item.quantity,
      total_amount: item.totalPrice
    }));

    // Create payment intent with enhanced API
    const response = await $fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      body: {
        amount: subtotal.value,
        currency: 'myr',
        category: hasOnlyDonations.value ? 'donation' : 'purchase',
        message: donationMessage.value || null,
        event_id: eventId.value,
        order_items: orderItems,
        customer_info: paymentForm.value
      }
    });

    console.log('🎯 API Response:', response);
    console.log('🔑 Client secret present:', !!response.client_secret);

    if (!response.client_secret) {
      console.error('❌ No client_secret in response!');
      console.log('Response keys:', Object.keys(response));
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
      
      // Update donation status to completed in database
      await updateDonationStatus(response.donation_id, 'completed');
      
      showSuccessModal.value = true;
    } else {
      throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
    }

  } catch (error) {
    console.error('❌ Payment error:', error);
    
    let errorMessage = error.message;
    if (error.name === 'FetchError') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    
    alert(`Payment failed: ${errorMessage}`);
  } finally {
    processing.value = false;
  }
};

// Update donation status to completed after successful payment
const updateDonationStatus = async (donationId, status) => {
  if (!donationId) {
    console.error('❌ No donation ID provided for status update');
    return;
  }
  
  try {
    console.log(`🔄 Updating donation ${donationId} status to ${status}...`);
    
    const { error } = await supabase
      .from('donations')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', donationId);

    if (error) {
      console.error('❌ Failed to update donation status:', error);
      throw error;
    } else {
      console.log(`✅ Donation status updated to ${status}`);
    }
  } catch (error) {
    console.error('❌ Error updating donation status:', error);
    // Don't throw here - payment already succeeded, this is just cleanup
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

// Fetch user profile
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

onMounted(async () => {
  console.log('🚀 Component mounted');
  
  // Wait a bit for DOM to be fully ready
  await new Promise(resolve => setTimeout(resolve, 100));
  
  await initializeStripe();
  
  if (user.value) {
    await fetchUserProfile();
  }
  
  await fetchEventData();
  
  console.log('✅ All initialization complete');
});
</script>