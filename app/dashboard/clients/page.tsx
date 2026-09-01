import { supabaseAdmin } from "@/lib/supabase";

export default async function ClientsPage() {
  // NOTE: replace with the signed-in user's id once auth is wired up.
  const supabase = supabaseAdmin();
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="font-serif text-2xl mb-2">Clients</h1>
      <p className="text-slate mb-8">Everyone you're working with, or hoping to.</p>

      <div className="card divide-y divide-line">
        {(clients || []).length === 0 && (
          <p className="p-6 text-sm text-slate">
            No clients yet. They'll appear here once someone books a call or you add them manually.
          </p>
        )}
        {(clients || []).map((c: any) => (
          <div key={c.id} className="p-4 flex items-center justify-between">
            <div>
              <p>{c.name}</p>
              <p className="text-xs text-slate">{c.email}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-sm border border-line capitalize">
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
