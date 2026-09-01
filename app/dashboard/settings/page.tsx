"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [key, setKey] = useState("");
  const [result, setResult] = useState<string | null>(null);

  async function verifyLicense(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/webhooks/gumroad?license_key=${encodeURIComponent(key)}`);
    const data = await res.json();
    setResult(data.success ? "License activated — Pro features unlocked." : "That key didn't verify. Double check it and try again.");
  }

  return (
    <div>
      <h1 className="font-serif text-2xl mb-2">Settings</h1>
      <p className="text-slate mb-8">Business profile, booking link, and license.</p>

      <div className="card p-6 mb-8 max-w-md">
        <h2 className="font-serif text-lg mb-4">Activate Pro license</h2>
        <form onSubmit={verifyLicense} className="flex gap-3">
          <input
            placeholder="License key from Gumroad receipt"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="flex-1"
          />
          <button type="submit" className="btn-primary">Verify</button>
        </form>
        {result && <p className="text-sm text-slate mt-3">{result}</p>}
      </div>
    </div>
  );
}
