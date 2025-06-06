import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event);
  const sig = getHeader(event, 'stripe-signature');

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    throw createError({
      statusCode: 400,
      statusMessage: 'Webhook signature verification failed'
    });
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(stripeEvent.data.object);
      break;
    
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(stripeEvent.data.object);
      break;
    
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(stripeEvent.data.object);
      break;
    
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(stripeEvent.data.object);
      break;
    
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`);
  }

  return { received: true };
});

async function handlePaymentIntentSucceeded(paymentIntent) {
  // Update donation status
  await supabase
    .from('donations')
    .update({ status: 'completed' })
    .eq('stripe_payment_intent_id', paymentIntent.id);
}

async function handleInvoicePaymentSucceeded(invoice) {
  if (invoice.subscription) {
    // Find subscription record
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', invoice.subscription)
      .single();

    if (subscription) {
      // Create subscription payment record
      await supabase
        .from('subscription_payments')
        .insert({
          subscription_id: subscription.id,
          stripe_invoice_id: invoice.id,
          stripe_payment_intent_id: invoice.payment_intent,
          amount: invoice.amount_paid / 100, // Convert from cents
          currency: invoice.currency,
          status: 'paid',
          billing_period_start: new Date(invoice.period_start * 1000),
          billing_period_end: new Date(invoice.period_end * 1000)
        });

      // Create donation record for this payment
      const { data: newDonation } = await supabase
        .from('donations')
        .insert({
          donor_id: subscription.donor_id,
          event_id: subscription.event_id,
          subscription_id: subscription.id,
          amount: subscription.amount,
          currency: subscription.currency,
          category: subscription.category,
          type: 'subscription',
          status: 'completed'
        })
        .select()
        .single();

      // Link payment to donation
      if (newDonation) {
        await supabase
          .from('subscription_payments')
          .update({ donation_id: newDonation.id })
          .eq('stripe_invoice_id', invoice.id);
      }
    }
  }
}

async function handleSubscriptionUpdated(subscription) {
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription) {
  await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date()
    })
    .eq('stripe_subscription_id', subscription.id);
}