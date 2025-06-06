<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-200px)] bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-lg text-center">
      <div v-if="loading" class="flex flex-col items-center justify-center">
        <svg class="animate-spin h-10 w-10 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 class="mt-4 text-2xl font-bold text-neutral-900">Processing Payment...</h2>
        <p class="mt-2 text-neutral-600">Please wait while we prepare your payment.</p>
      </div>

      <div v-else-if="paymentStatus === 'requires_payment_method'" class="space-y-6">
        <h2 class="text-3xl font-extrabold text-neutral-900">Complete Your Donation</h2>
        <p class="text-neutral-600">Enter your payment details below.</p>
        <p class="text-lg font-semibold text-primary-600">Amount: RM {{ amount?.toFixed(2) }}</p>

        <form @submit.prevent="confirmPayment" class="space-y-4">
          <div id="card-element" class="border border-neutral-300 p-4 rounded-md bg-white">
            <!-- Stripe Elements will mount here -->
          </div>

          <div v-if="cardError" class="text-red-500 text-sm text-left bg-red-50 p-3 rounded-md">
            {{ cardError }}
          </div>

          <button
            type="submit"
            :disabled="processingPayment"
            class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="processingPayment" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ processingPayment ? 'Processing Payment...' : `Pay RM ${amount?.toFixed(2)}` }}
          </button>
        </form>
      </div>

      <div v-else-if="paymentStatus === 'succeeded'" class="text-green-600">
        <svg class="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="mt-4 text-3xl font-extrabold text-neutral-900">Thank You!</h2>
        <p class="mt-2 text-lg text-neutral-600">Your donation of RM {{ amount?.toFixed(2) }} has been processed successfully.</p>
        <p class="mt-2 text-sm text-neutral-500" v-if="donationId">Reference: {{ donationId }}</p>
        <div class="mt-6 space-y-3">
          <NuxtLink to="/" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
            Return Home
          </NuxtLink>
        </div>
      </div>

      <div v-else-if="paymentStatus === 'failed' || paymentStatus === 'canceled'" class="text-red-600">
        <svg class="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 class="mt-4 text-3xl font-extrabold text-neutral-900">Payment Failed</h2>
        <p class="mt-2 text-lg text-neutral-600">Unfortunately, your payment could not be processed.</p>
        <p class="mt-2 text-sm text-red-500" v-if="errorMessage">{{ errorMessage }}</p>
        <div class="mt-6 space-y-3">
          <button
            @click="retryPayment"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
          >
            Try Again
          </button>
          <NuxtLink to="/donate" class="block text-primary-600 hover:text-primary-500">
            Back to Donation Page
          </NuxtLink>
        </div>
      </div>

      <div v-else class="text-neutral-600">
        <h2 class="mt-4 text-2xl font-bold text-neutral-900">Processing...</h2>
        <p class="mt-2">Please wait while we process your payment.</p>
        <p class="mt-2 text-sm text-neutral-500" v-if="paymentStatus">Status: {{ paymentStatus }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const loading = ref(true);
const paymentStatus = ref(null);
const errorMessage = ref('');
const clientSecret = ref('');
const donationId = ref('');
const amount = ref(0);
const processingPayment = ref(false);
const cardError = ref('');

let stripe;
let elements;
let cardElement;

onMounted(async () => {
  try {
    clientSecret.value = route.query.client_secret;
    donationId.value = route.query.donation_id;
    
    if (!clientSecret.value) {
      errorMessage.value = 'Missing payment information. Please start a new donation.';
      paymentStatus.value = 'failed';
      loading.value = false;
      return;
    }

    // Load Stripe
    stripe = await loadStripe(config.public.stripePublishableKey);
    
    if (!stripe) {
      errorMessage.value = 'Failed to load payment system.';
      paymentStatus.value = 'failed';
      loading.value = false;
      return;
    }

    // Check PaymentIntent status
    const { paymentIntent, error: retrieveError } = await stripe.retrievePaymentIntent(clientSecret.value);

    if (retrieveError) {
      console.error('Error retrieving PaymentIntent:', retrieveError);
      errorMessage.value = retrieveError.message;
      paymentStatus.value = 'failed';
      loading.value = false;
      return;
    }

    // Update local state
    paymentStatus.value = paymentIntent.status;
    amount.value = paymentIntent.amount / 100;

    // Update database status
    await updateDonationStatus(paymentIntent.status, paymentIntent.id);

    // Handle different statuses
    if (paymentStatus.value === 'succeeded') {
      // Payment completed successfully
      loading.value = false;
    } else if (paymentStatus.value === 'requires_payment_method') {
      // Set up Stripe Elements for card input
      setupStripeElements();
      loading.value = false;
    } else if (paymentStatus.value === 'requires_action') {
      // Handle 3D Secure or other required actions
      await handleRequiredAction();
    } else {
      // Handle other statuses
      loading.value = false;
    }

  } catch (error) {
    console.error('Error in onMounted:', error);
    errorMessage.value = 'An unexpected error occurred.';
    paymentStatus.value = 'failed';
    loading.value = false;
  }
});

const setupStripeElements = () => {
  if (!stripe || !clientSecret.value) return;
  
  elements = stripe.elements({
    clientSecret: clientSecret.value,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2563eb',
      }
    }
  });
  
  cardElement = elements.create('payment');
  cardElement.mount('#card-element');

  cardElement.on('change', (event) => {
    cardError.value = event.error ? event.error.message : '';
  });
};

const handleRequiredAction = async () => {
  try {
    const { paymentIntent, error } = await stripe.confirmPayment({
      clientSecret: clientSecret.value,
      redirect: 'if_required'
    });

    if (error) {
      errorMessage.value = error.message;
      paymentStatus.value = 'failed';
    } else {
      paymentStatus.value = paymentIntent.status;
      await updateDonationStatus(paymentIntent.status, paymentIntent.id);
    }
  } catch (error) {
    console.error('Error handling required action:', error);
    errorMessage.value = 'Payment authentication failed.';
    paymentStatus.value = 'failed';
  } finally {
    loading.value = false;
  }
};

const confirmPayment = async () => {
  if (!stripe || !cardElement) {
    cardError.value = 'Payment system not ready. Please refresh the page.';
    return;
  }

  processingPayment.value = true;
  cardError.value = '';

  try {
    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: window.location.href,
      }
    });

    if (error) {
      cardError.value = error.message;
      console.error('Payment confirmation error:', error);
    } else {
      paymentStatus.value = paymentIntent.status;
      
      // Update database with final status
      await updateDonationStatus(paymentIntent.status, paymentIntent.id);
      
      if (paymentStatus.value === 'succeeded') {
        // Payment successful - show success message
        console.log('Payment succeeded!');
      }
    }
  } catch (error) {
    console.error('Unexpected error during payment:', error);
    cardError.value = 'An unexpected error occurred. Please try again.';
  } finally {
    processingPayment.value = false;
  }
};

const updateDonationStatus = async (status, paymentIntentId) => {
  if (!donationId.value) return;
  
  try {
    await $fetch('/api/donations/update-status', {
      method: 'POST',
      body: {
        donationId: donationId.value,
        status: status,
        paymentIntentId: paymentIntentId
      }
    });
  } catch (error) {
    console.error('Failed to update donation status:', error);
  }
};

const retryPayment = () => {
  router.push('/donate');
};
</script>