"use client";

import { useState } from "react";

export default function InvoicesPage() {
  const [form, setForm] = useState({ user_id: "", amount: "", description: "" });
  const [link, setLink] = useState<string | null>(null);

  async function createInvoice(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/invoices/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLink(data.invoice?.stripe_payment_link || null);
  }

  return (
    <div>
      <h1 className="font-serif text-2xl mb-2">Invoices</h1>
      <p className="text-slate mb-8">Generate a Stripe payment link in a few seconds.</p>

      <form onSubmit={createInvoice} className="card p-6 flex flex-col gap-4 max-w-md">
        <input
          placeholder="Your Supabase user ID"
          value={form.user_id}
          onChange={(e) => setForm({ ...form, user_id: e.target.value })}
          required
        />
        <input
          placeholder="Amount (USD)"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          placeholder="What's it for?"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit" className="btn-primary self-start">
          Create payment link
        </button>
      </form>

      {link && (
        <div className="card p-4 mt-6">
          <p className="text-xs text-slate mb-1">Send this to your client</p>
          <a href={link} className="text-moss underline break-all">{link}</a>
        </div>
      )}
    </div>
  );
}
