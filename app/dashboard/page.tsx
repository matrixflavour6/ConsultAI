export default function DashboardHome() {
  return (
    <div>
      <h1 className="font-serif text-2xl mb-2">Overview</h1>
      <p className="text-slate mb-8">A quick look at where things stand.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active clients", value: "—" },
          { label: "Proposals sent", value: "—" },
          { label: "Unpaid invoices", value: "—" },
          { label: "Upcoming calls", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-2xl font-serif">{stat.value}</p>
            <p className="text-xs text-slate mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate mt-10">
        Wire these stats up to your Supabase tables once you have data — this page is a
        placeholder shell to build on.
      </p>
    </div>
  );
}
