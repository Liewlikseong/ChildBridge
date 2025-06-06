export default defineEventHandler(async (event) => {
  try {
    const user = await getUserFromSession(event);
    const subscriptionId = getRouterParam(event, 'id');
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }

    // Get subscription record
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('donor_id', user.id)
      .single();

    if (fetchError || !subscription) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Subscription not found'
      });
    }

    // Cancel subscription in Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true
    });

    // Update subscription record
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId);

    if (updateError) throw updateError;

    return { success: true, message: 'Subscription will be cancelled at the end of the current billing period' };

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to cancel subscription'
    });
  }
});