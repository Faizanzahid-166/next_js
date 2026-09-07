import Stripe from "stripe";
import { supabaseServer } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response("Webhook Error: invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Prefer explicit metadata.orderId if present (ensure your checkout session sets it when created)
    const orderId = session.metadata?.orderId || null;

    try {
      if (orderId) {
        // Update order by id (Supabase orders table is `03_orders`)
        const { data: updated, error: updateError } = await supabaseServer
          .from("03_orders")
          .update({ payment_status: "PAID", payment_channel: "STRIPE", transaction_id: session.payment_intent || null })
          .eq("id", orderId)
          .select()
          .single();

        if (updateError) {
          console.error("Failed to update order from stripe webhook:", updateError);
        } else if (updated) {
          // Clear cart after payment (if you store user_id on the order)
          const userId = updated.user_id;
          if (userId) {
            await supabaseServer.from("03_cart_items").delete().eq("user_id", userId);
          }
        }
      } else if (session.payment_intent) {
        // Fallback: try to match by transaction_id column if you store payment_intent there
        const { data: orders, error: fetchError } = await supabaseServer
          .from("03_orders")
          .select("id, user_id")
          .eq("transaction_id", session.payment_intent)
          .limit(1);

        if (!fetchError && orders?.length) {
          const ord = orders[0];
          const { error: updateErr } = await supabaseServer
            .from("03_orders")
            .update({ payment_status: "PAID", payment_channel: "STRIPE" })
            .eq("id", ord.id);

          if (!updateErr) {
            await supabaseServer.from("03_cart_items").delete().eq("user_id", ord.user_id);
          }
        }
      } else {
        console.warn("Stripe session missing order metadata and payment_intent; webhook did not update any order.");
      }
    } catch (err) {
      console.error("Error handling stripe webhook:", err);
    }
  }

  return new Response("OK", { status: 200 });
}

