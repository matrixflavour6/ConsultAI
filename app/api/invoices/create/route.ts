import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { user_id, client_id, proposal_id, amount, currency = "usd", description } =
      await req.json();

    if (!user_id || !amount) {
      return NextResponse.json({ error: "user_id and amount are required" }, { status: 400 });
    }

    // Stripe Payment Links need a Price object first.
    const price = await stripe.prices.create({
      currency,
      unit_amount: Math.round(Number(amount) * 100),
      product_data: { name: description || "Consulting services" },
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { user_id, client_id: client_id || "", proposal_id: proposal_id || "" },
    });

    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("invoices")
      .insert({
        user_id,
        client_id: client_id || null,
        proposal_id: proposal_id || null,
        amount,
        status: "sent",
        stripe_payment_link: paymentLink.url,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ invoice: data });
  } catch (err: any) {
    console.error("invoice create error", err);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
