import Stripe from "stripe";
import Order from "@/models/Order.model";
import { supabaseServer } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const order = await Order.findOneAndUpdate(
      { "payment.stripeSessionId": session.id },
      {
        "payment.status": "PAID",
      },
      { new: true }
    );

    if (order) {
      // Clear cart after payment
      await supabaseServer
        .from("03_cart_items")
        .delete()
        .eq("user_id", order.userId.toString());
    }
  }

  return new Response("OK", { status: 200 });
}

