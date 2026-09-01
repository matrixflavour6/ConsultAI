import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { booking_slug, client_name, client_email, scheduled_at, duration_minutes, notes } =
      await req.json();

    if (!booking_slug || !client_name || !scheduled_at) {
      return NextResponse.json(
        { error: "booking_slug, client_name and scheduled_at are required" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("booking_slug", booking_slug)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "No consultant found for this link" }, { status: 404 });
    }

    // Find or create a lightweight client record for this booking.
    const { data: client } = await supabase
      .from("clients")
      .upsert(
        { user_id: user.id, name: client_name, email: client_email, status: "lead" },
        { onConflict: "user_id,email" }
      )
      .select()
      .single();

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        client_id: client?.id || null,
        scheduled_at,
        duration_minutes: duration_minutes || 30,
        notes,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ booking });
  } catch (err: any) {
    console.error("booking create error", err);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
