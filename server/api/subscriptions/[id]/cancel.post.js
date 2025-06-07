import Stripe from 'stripe'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    console.log('=== Cancel Subscription Debug ===')

    // 1. Authenticate user via Supabase
    const supabase = await serverSupabaseClient(event)
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required - no Supabase session'
      })
    }

    console.log('Authenticated user ID:', user.id)

    // 2. Get subscription ID from URL
    const subscriptionId = getRouterParam(event, 'id')
    console.log('Subscription ID from URL:', subscriptionId)

    if (!subscriptionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Subscription ID is required'
      })
    }

    // 3. Fetch subscription from Supabase
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('donor_id', user.id)
      .single()

    if (fetchError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${fetchError.message}`
      })
    }

    if (!subscription) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Subscription not found or access denied'
      })
    }

    console.log('Found subscription:', {
      id: subscription.id,
      stripe_subscription_id: subscription.stripe_subscription_id
    })

    // 4. Stripe setup
    const stripeKey = useRuntimeConfig(event).stripeSecretKey
    if (!stripeKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Stripe configuration missing'
      })
    }

    const stripe = new Stripe(stripeKey)

    // 5. Retrieve subscription from Stripe
    let stripeSubscription
    try {
      stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
    } catch (stripeError) {
      console.error('Stripe error:', stripeError)
      throw createError({
        statusCode: 400,
        statusMessage: `Stripe error: ${stripeError.message}`
      })
    }

    // 6. Handle already canceled or pending cancel
    if (stripeSubscription.status === 'canceled') {
      return {
        success: true,
        message: 'Subscription is already cancelled',
        status: 'canceled'
      }
    }

    if (stripeSubscription.cancel_at_period_end) {
      return {
        success: true,
        message: 'Subscription already set to cancel at end of billing period',
        cancel_at_period_end: true
      }
    }

    // 7. Cancel subscription at period end
    const updatedStripeSubscription = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true
    })

    // 8. Update Supabase record
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)

    if (updateError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Database update failed: ${updateError.message}`
      })
    }

    return {
      success: true,
      message: 'Subscription will be cancelled at the end of the current billing period',
      cancel_at_period_end: true,
      current_period_end: updatedStripeSubscription.current_period_end
    }
  } catch (error) {
    console.error('=== Cancel Subscription Error ===', error)

    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to cancel subscription'
    })
  }
})
