"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function PublicBookingPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [form, setForm] = useState({ client_name: "", client_email: "", scheduled_at: "" });
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/bookings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_slug: slug, ...form }),
    });
    setStatus(res.ok ? "sent" : "error");
  }

  if (status === "sent") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-paper">
        <div className="card p-8 text-center max-w-sm">
          <p className="font-serif text-xl mb-2">You're booked.</p>
          <p className="text-slate text-sm">A confirmation will follow by email.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-paper px-6">
      <form onSubmit={submitBooking} className="card p-8 max-w-sm w-full flex flex-col gap-4">
        <h1 className="font-serif text-xl mb-1">Book a call</h1>
        <input
          placeholder="Your name"
          value={form.client_name}
          onChange={(e) => setForm({ ...form, client_name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Your email"
          value={form.client_email}
          onChange={(e) => setForm({ ...form, client_email: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={form.scheduled_at}
          onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
          required
        />
        <button type="submit" className="btn-primary">Confirm booking</button>
        {status === "error" && (
          <p className="text-sm text-clay">Couldn't book that slot — try again.</p>
        )}
      </form>
    </main>
  );
}
