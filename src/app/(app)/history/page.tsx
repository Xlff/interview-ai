import HistoryPage from "@/features/history/views/history-page";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listHistoryEntriesForUserEmail } from "@/server/repositories/history-repository";

export default async function HistoryRoute() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const entries = user?.email ? await listHistoryEntriesForUserEmail(user.email) : [];

  return <HistoryPage isAuthenticated={Boolean(user)} entries={entries} />;
}
