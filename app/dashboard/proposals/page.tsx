"use client";

import { useState } from "react";

export default function ProposalsPage() {
  const [form, setForm] = useState({
    user_id: "",
    client_name: "",
    niche: "",
    business_name: "",
    engagement_description: "",
    amount: "",
    pricing_structure: "flat fee",
    timeline: "",
    tone: "professional",
  });
  const [draft, setDraft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleDraft(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setDraft(null);
    try {
      const res = await fetch("/api/proposals/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.proposal) setDraft(data.proposal.content);
      else setDraft(`Something went wrong: ${data.error || "unknown error"}`);
    } catch (err) {
      setDraft("Could not reach the drafting service. Check your API keys and try again.");
    } finally {
      setLoading(false);
    }
  }

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <div>
      <h1 className="font-serif text-2xl mb-2">Draft a proposal</h1>
      <p className="text-slate mb-8">
        Describe the engagement — the draft fills in structure, you fill in specifics.
      </p>

      <form onSubmit={handleDraft} className="card p-6 flex flex-col gap-4 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Your Supabase user ID (temporary — wire up auth)"
            value={form.user_id}
            onChange={(e) => update("user_id", e.target.value)}
            required
          />
          <input
            placeholder="Client name"
            value={form.client_name}
            onChange={(e) => update("client_name", e.target.value)}
          />
          <input
            placeholder="Your business name"
            value={form.business_name}
            onChange={(e) => update("business_name", e.target.value)}
          />
          <input
            placeholder="Your niche (e.g. brand strategy)"
            value={form.niche}
            onChange={(e) => update("niche", e.target.value)}
          />
        </div>

        <textarea
          placeholder="Describe the engagement in plain language..."
          value={form.engagement_description}
          onChange={(e) => update("engagement_description", e.target.value)}
          rows={4}
          required
        />

        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
          />
          <select
            value={form.pricing_structure}
            onChange={(e) => update("pricing_structure", e.target.value)}
          >
            <option value="flat fee">Flat fee</option>
            <option value="hourly">Hourly</option>
            <option value="retainer">Monthly retainer</option>
          </select>
          <input
            placeholder="Timeline (e.g. 6 weeks)"
            value={form.timeline}
            onChange={(e) => update("timeline", e.target.value)}
          />
        </div>

        <select value={form.tone} onChange={(e) => update("tone", e.target.value)}>
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="concise">Concise</option>
        </select>

        <button type="submit" className="btn-primary self-start" disabled={loading}>
          {loading ? "Drafting..." : "Draft proposal"}
        </button>
      </form>

      {draft && (
        <div className="card p-6">
          <p className="text-xs text-slate mb-3">DRAFT — edit before sending</p>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{draft}</pre>
        </div>
      )}
    </div>
  );
}
