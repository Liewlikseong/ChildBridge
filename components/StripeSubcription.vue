<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6">Make a Donation</h2>
    
    <form @submit.prevent="handleSubmit">
      <!-- Donation Type -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Donation Type</label>
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input
              v-model="donationType"
              type="radio"
              value="onetime"
              class="mr-2"
            />
            One-time
          </label>
          <label class="flex items-center">
            <input
              v-model="donationType"
              type="radio"
              value="subscription"
              class="mr-2"
            />
            Monthly
          </label>
        </div>
      </div>

      <!-- Amount Input -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">
          {{ donationType === 'subscription' ? 'Monthly ' : '' }}Donation Amount
        </label>
        <div class="relative">
          <span class="absolute left-3 top-3 text-gray-500">$</span>
          <input
            v-model="amount"
            type="number"
            min="1"
            step="0.01"
            class="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <!-- Category -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Category</label>
        <select
          v-model="category"
          class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="general">General</option>
          <option value="emergency">Emergency</option>
          <option value="education">Education</option>
          <option value="healthcare">Healthcare</option>
        </select>
      </div>

      <!-- Message -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Message (Optional)</label>
        <textarea
          v-model="message"
          class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Leave a message..."
        ></textarea>
      </div>

      <!-- Stripe Elements -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Card Details</label>
        <div
          id="card-element"
          class="p-3 border rounded-lg bg-gray-50"
        ></div>
        <div id="card-errors" class="text-red-500 text-sm mt-2"></div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? 'Processing...' : getButtonText() }}
      </button>
    </form>

    <!-- Success Message -->
    <div v-if="paymentSuccess" class="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
      {{ donationType === 'subscription' ? 'Subscription created!' : 'Payment successful!' }}
      Thank you for your donation.
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const { getStripe } = useStripe()
const { $supabase } = useNuxtApp()
const user = useSupabaseUser()

const donationType = ref('onetime')
const amount = ref('')
const category = ref('general')
const message = ref('')
const loading = ref(false)
const paymentSuccess = ref(false)
const error = ref('')

let stripe = null
let elements = null
let cardElement = null

const getButtonText = computed(() => {
  if (!amount.value) return 'Enter amount'
  
  if (donationType.value === 'subscription') {
    return `Donate $${amount.value}/month`
  } else {
    return `Donate $${amount.value}`
  }
})

onMounted(async () => {
  // Initialize Stripe
  stripe = await getStripe()
  elements = stripe.elements()
  
  // Create card element
  cardElement = elements.create('card', {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  })
  
  cardElement.mount('#card-element')
  
  // Handle card errors
  cardElement.on('change', (event) => {
    const displayError = document.getElementById('card-errors')
    if (event.error) {
      displayError.textContent = event.error.message
      error.value = event.error.message
    } else {
      displayError.textContent = ''
      error.value = ''
    }
  })
})

const handleSubmit = async () => {
  if (!stripe || !cardElement || !amount.value) return
  
  loading.value = true
  error.value = ''

  try {
    if (donationType.value === 'subscription') {
      await handleSubscription()
    } else {
      await handleOneTimePayment()
    }
  } catch (err) {
    error.value = err.message || 'Payment failed'
  } finally {
    loading.value = false
  }
}

const handleOneTimePayment = async () => {
  // Create payment intent
  const { data: paymentData } = await $fetch('/api/stripe/create-payment-intent', {
    method: 'POST',
    body: {
      amount: parseFloat(amount.value),
      metadata: {
        user_id: user.value?.id || 'anonymous',
        category: category.value,
        event_id: 'your-event-id' // Replace with actual event ID
      }
    }
  })

  // Confirm payment
  const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
    paymentData.clientSecret,
    {
      payment_method: {
        card: cardElement,
        billing_details: {
          email: user.value?.email || ''
        }
      }
    }
  )

  if (stripeError) {
    error.value = stripeError.message
  } else if (paymentIntent.status === 'succeeded') {
    paymentSuccess.value = true
    
    // Save donation to Supabase
    if (user.value) {
      await $supabase
        .from('donations')
        .insert({
          donor_id: user.value.id,
          event_id: 'your-event-id', // Replace with actual event ID
          amount: parseFloat(amount.value),
          category: category.value,
          type: 'onetime',
          status: 'completed',
          message: message.value || null,
          stripe_payment_intent_id: paymentIntent.id
        })
    }
    
    resetForm()
  }
}

const handleSubscription = async () => {
  // Create subscription
  const { data: subscriptionData } = await $fetch('/api/stripe/create-subscription', {
    method: 'POST',
    body: {
      amount: parseFloat(amount.value),
      interval: 'month',
      user_id: user.value?.id,
      event_id: 'your-event-id', // Replace with actual event ID
      category: category.value,
      customer_email: user.value?.email
    }
  })

  // Confirm subscription payment
  const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
    subscriptionData.clientSecret,
    {
      payment_method: {
        card: cardElement,
        billing_details: {
          email: user.value?.email || ''
        }
      }
    }
  )

  if (stripeError) {
    error.value = stripeError.message
  } else if (paymentIntent.status === 'succeeded') {
    paymentSuccess.value = true
    resetForm()
  }
}

const resetForm = () => {
  amount.value = ''
  message.value = ''
  cardElement.clear()
}
</script>