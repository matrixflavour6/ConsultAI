import { supabaseAdmin } from "@/lib/supabase";

export default async function BookingsPage() {
  const supabase = supabaseAdmin();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, clients(name)")
    .order("scheduled_at", { ascending: true })
    .limit(50);

  return (
    <div>
      <h1 className="font-serif text-2xl mb-2">Bookings</h1>
      <p className="text-slate mb-8">
        Share your link:{" "}
        <code className="text-sm bg-white border border-line px-2 py-1 rounded-sm">
          yourapp.com/book/your-slug
        </code>
      </p>

      <div className="card divide-y divide-line">
        {(bookings || []).length === 0 && (
          <p className="p-6 text-sm text-slate">No calls booked yet.</p>
        )}
        {(bookings || []).map((b: any) => (
          <div key={b.id} className="p-4 flex items-center justify-between">
            <div>
              <p>{b.clients?.name || "Unknown client"}</p>
              <p className="text-xs text-slate">
                {new Date(b.scheduled_at).toLocaleString()} · {b.duration_minutes} min
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
