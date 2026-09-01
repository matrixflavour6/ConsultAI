export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <nav className="flex items-center justify-between max-w-5xl mx-auto px-6 py-6">
        <span className="font-serif text-xl">Ledger</span>
        <a href="/dashboard" className="btn-secondary text-sm">Sign in</a>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-12 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            Send the proposal before the client changes their mind.
          </h1>
          <p className="text-slate text-lg mb-8 max-w-md">
            Describe the engagement in a sentence. Get a drafted proposal,
            an invoice link, and a booking page — built for solo consultants
            and coaches who'd rather be working than doing admin.
          </p>
          <div className="flex gap-3">
            <a href="/dashboard" className="btn-primary">Start free</a>
            <a href="#how" className="btn-secondary">See how it works</a>
          </div>
        </div>

        <div className="card p-8 -rotate-1">
          <p className="text-xs text-slate mb-4">PROPOSAL — DRAFT</p>
          <p className="font-serif text-lg mb-3">Overview</p>
          <p className="text-sm text-slate mb-4 leading-relaxed">
            This engagement covers a 6-week brand strategy sprint for Fenwick Studio,
            culminating in a positioning document and go-to-market outline.
          </p>
          <p className="font-serif text-lg mb-2">Investment</p>
          <p className="text-sm text-slate">$4,200 — flat fee, due on acceptance</p>
        </div>
      </section>

      <section id="how" className="max-w-5xl mx-auto px-6 py-16 border-t border-line">
        <h2 className="font-serif text-2xl mb-10">What it replaces</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { from: "A blank Google Doc", to: "AI-drafted proposals & contracts" },
            { from: "A spreadsheet of leads", to: "A simple client list" },
            { from: "Chasing payment by email", to: "A Stripe payment link" },
            { from: "Calendly + a scheduling link", to: "Your own booking page" },
          ].map((item) => (
            <div key={item.from}>
              <p className="text-sm text-slate line-through mb-2">{item.from}</p>
              <p className="text-ink">{item.to}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-5xl mx-auto px-6 py-10 text-sm text-slate border-t border-line">
        Ledger — built for one person running their own practice.
      </footer>
    </main>
  );
}
