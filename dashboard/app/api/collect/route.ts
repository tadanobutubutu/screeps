import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SCREEPS_API = "https://screeps.com/api";
const TOKEN = process.env.SCREEPS_TOKEN ?? "";
const USERNAME = process.env.SCREEPS_USERNAME ?? "";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

export async function GET() {
  try {
    const res = await fetch(`${SCREEPS_API}/user/overview`, {
      headers: {
        "X-Token": TOKEN,
        "X-Username": USERNAME,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Screeps API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    const { error } = await supabase.from("screeps_stats").insert({
      gcl_level: data.gcl.level,
      gcl_progress: data.gcl.progress,
      gcl_progress_total: data.gcl.progressTotal,
      power: data.power,
      cpu_used: data.cpuUsed,
      rooms: data.rooms,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch from Screeps API" },
      { status: 500 }
    );
  }
}
