import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handleStripePayment({ order, items }) {
  const frontendUrl = process.env.FRONTEND_URL;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [
            item.image_url || `${frontendUrl}/placeholder.png`,
          ],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    success_url: `${frontendUrl}/order-success?orderId=${order._id}`,
    cancel_url: `${frontendUrl}/cart`,
    metadata: {
      orderId: order._id.toString(),
    },
  });

  order.payment.stripeSessionId = session.id;
  await order.save();

  return {
    success: true,
    message: "Stripe checkout created",
    data: {
      orderId: order._id,
      checkoutUrl: session.url,
    },
  };
}