export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const stripe = new Stripe(config.stripeSecretKey)
    const { subscription_id, cancel_at_period_end = true } = await readBody(event)

    const subscription = await stripe.subscriptions.update(subscription_id, {
      cancel_at_period_end
    })

    return { 
      success: true, 
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end
    }
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }
})
