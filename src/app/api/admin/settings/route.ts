import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET settings
export async function GET() {
  const supabase = await createClient();

  const { data } = await supabase.from("site_settings").select("key, value");

  const settings: Record<string, string> = {};
  (data ?? []).forEach((row: { key: string; value: string }) => {
    settings[row.key] = row.value;
  });

  return NextResponse.json({ settings });
}

// PUT update settings
export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Upsert each setting
  const entries = Object.entries(body);
  for (const [key, value] of entries) {
    await supabase
      .from("site_settings")
      .upsert({ key, value: value as string }, { onConflict: "key" });
  }

  return NextResponse.json({ success: true });
}
