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

    // 2. Get subscription ID from URL and request body
    const subscriptionId = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { immediate = false } = body || {} // Allow immediate cancellation option

    console.log('Subscription ID from URL:', subscriptionId)
    console.log('Immediate cancellation:', immediate)

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
      stripe_subscription_id: subscription.stripe_subscription_id,
      current_status: subscription.status
    })

    // 4. Check if already cancelled
    if (subscription.status === 'cancelled') {
      return {
        success: true,
        message: 'Subscription is already cancelled',
        status: 'cancelled',
        subscription: subscription
      }
    }

    // 5. Stripe setup
    const stripeKey = useRuntimeConfig(event).stripeSecretKey
    if (!stripeKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Stripe configuration missing'
      })
    }

    const stripe = new Stripe(stripeKey)

    // 6. Retrieve subscription from Stripe
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

    // 7. Handle already canceled in Stripe
    if (stripeSubscription.status === 'canceled') {
      // Update local database to match Stripe
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)

      if (updateError) {
        console.error('Database update error:', updateError)
      }

      return {
        success: true,
        message: 'Subscription is already cancelled',
        status: 'cancelled'
      }
    }

    // 8. Handle pending cancellation
    if (stripeSubscription.cancel_at_period_end && !immediate) {
      return {
        success: true,
        message: 'Subscription already set to cancel at end of billing period',
        cancel_at_period_end: true,
        current_period_end: stripeSubscription.current_period_end
      }
    }

    let updatedStripeSubscription
    let updateData = {
      updated_at: new Date().toISOString()
    }

    // 9. Cancel subscription based on immediate flag
    if (immediate) {
      // Cancel immediately
      updatedStripeSubscription = await stripe.subscriptions.cancel(subscription.stripe_subscription_id)
      
      updateData = {
        ...updateData,
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancel_at_period_end: false
      }

      console.log('Cancelled immediately')
    } else {
      // Cancel at period end
      updatedStripeSubscription = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        cancel_at_period_end: true
      })

      updateData = {
        ...updateData,
        cancel_at_period_end: true,
        // Keep status as active until period ends
        status: 'active'
      }

      console.log('Set to cancel at period end')
    }

    // 10. Update Supabase record
    const { data: updatedSubscription, error: updateError } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('id', subscriptionId)
      .select()
      .single()

    if (updateError) {
      console.error('Database update error:', updateError)
      throw createError({
        statusCode: 500,
        statusMessage: `Database update failed: ${updateError.message}`
      })
    }

    // 11. Return appropriate response
    if (immediate) {
      return {
        success: true,
        message: 'Subscription cancelled immediately',
        status: 'cancelled',
        cancelled_at: updatedSubscription.cancelled_at,
        subscription: updatedSubscription
      }
    } else {
      return {
        success: true,
        message: 'Subscription will be cancelled at the end of the current billing period',
        cancel_at_period_end: true,
        current_period_end: updatedStripeSubscription.current_period_end,
        subscription: updatedSubscription
      }
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