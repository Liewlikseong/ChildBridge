<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6">Make a Donation</h2>
    
    <form @submit.prevent="handleSubmit">
      <!-- Amount Input -->
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Donation Amount</label>
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

      <!-- Stripe Elements will be mounted here -->
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
        {{ loading ? 'Processing...' : `Donate $${amount || '0.00'}` }}
      </button>
    </form>

    <!-- Success Message -->
    <div v-if="paymentSuccess" class="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
      Payment successful! Thank you for your donation.
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { getStripe } = useStripe()
const { $supabase } = useNuxtApp()
const user = useSupabaseUser()

const amount = ref('')
const loading = ref(false)
const paymentSuccess = ref(false)
const error = ref('')

let stripe = null
let elements = null
let cardElement = null

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
    // Create payment intent
    const { data: paymentData } = await $fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      body: {
        amount: parseFloat(amount.value),
        metadata: {
          user_id: user.value?.id || 'anonymous',
          donation_type: 'general'
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
      
      // Save payment to Supabase (optional, as webhook will also do this)
      if (user.value) {
        await $supabase
          .from('payments')
          .insert({
            stripe_payment_intent_id: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: 'succeeded',
            user_id: user.value.id
          })
      }
      
      // Reset form
      amount.value = ''
      cardElement.clear()
    }
  } catch (err) {
    error.value = err.message || 'Payment failed'
  } finally {
    loading.value = false
  }
}
</script>