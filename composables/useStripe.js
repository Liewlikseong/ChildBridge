import { loadStripe } from '@stripe/stripe-js'

let stripePromise = null

export const useStripe = () => {
  const config = useRuntimeConfig()
  
  const getStripe = () => {
    if (!stripePromise) {
      stripePromise = loadStripe(config.public.stripePublishableKey)
    }
    return stripePromise
  }

  return {
    getStripe
  }
}