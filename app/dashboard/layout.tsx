const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/clients", label: "Clients" },
  { href: "/dashboard/proposals", label: "Proposals" },
  { href: "/dashboard/invoices", label: "Invoices" },
  { href: "/dashboard/bookings", label: "Bookings" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-paper text-ink">
      <aside className="w-56 border-r border-line px-5 py-8 hidden md:block">
        <p className="font-serif text-lg mb-8">Ledger</p>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm px-3 py-2 rounded-sm hover:bg-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 px-6 md:px-10 py-8 max-w-4xl">{children}</main>
    </div>
  );
}
