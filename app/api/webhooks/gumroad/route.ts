import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Gumroad sends "Ping" webhooks as application/x-www-form-urlencoded.
// Configure this URL under Gumroad Settings > Advanced > Ping.
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const payload = Object.fromEntries(formData.entries());

    const {
      email,
      license_key,
      sale_id,
      refunded,
      disputed,
      product_permalink,
    } = payload as Record<string, string>;

    if (process.env.GUMROAD_PRODUCT_PERMALINK && product_permalink !== process.env.GUMROAD_PRODUCT_PERMALINK) {
      // Ignore pings for other products on the same Gumroad account.
      return NextResponse.json({ ignored: true });
    }

    const supabase = supabaseAdmin();

    const status =
      refunded === "true" ? "refunded" : disputed === "true" ? "disputed" : "active";

    // Upsert so repeat pings (e.g. a later refund ping for the same sale) update the row.
    const { error } = await supabase.from("licenses").upsert(
      {
        email,
        gumroad_license_key: license_key,
        status,
      },
      { onConflict: "gumroad_license_key" }
    );

    if (error) throw error;

    // If a user account with this email already exists, flip their license_status too.
    await supabase
      .from("users")
      .update({ license_status: status === "active" ? "pro" : "free" })
      .eq("email", email);

    return NextResponse.json({ received: true, sale_id });
  } catch (err: any) {
    console.error("gumroad webhook error", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

// Optional: verify a license key on-demand (e.g. if a user manually enters one
// in Settings instead of buying through a flow that triggers the ping above).
export async function GET(req: NextRequest) {
  const licenseKey = req.nextUrl.searchParams.get("license_key");
  if (!licenseKey) return NextResponse.json({ error: "license_key required" }, { status: 400 });

  const res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      product_id: process.env.GUMROAD_PRODUCT_ID!,
      license_key: licenseKey,
    }),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
