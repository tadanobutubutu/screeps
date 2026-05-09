import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual, createHash } from "crypto";

const SCREEPS_API = "https://screeps.com/api";

export async function GET(request: Request) {
  // Security: Check for authorization secret to prevent unauthorized data collection triggers.
  // We use a fail-closed logic: if CRON_SECRET is not set or doesn't match, we deny access.
  // Security: Limit header length and check format to mitigate DoS and malformed inputs
  const authHeader = request.headers.get("authorization") || "";
  const cronSecret = process.env.CRON_SECRET;

  // Security: タイミング攻撃を防ぐために、ハッシュ化した上で一定時間で比較(constant-time comparison)を行います。
  let isAuthorized = false;
  if (cronSecret && authHeader && authHeader.length <= 512 && authHeader.startsWith("Bearer ")) {
    const expectedAuth = `Bearer ${cronSecret}`;
    const givenHash = createHash("sha256").update(authHeader).digest();
    const expectedHash = createHash("sha256").update(expectedAuth).digest();
    isAuthorized = timingSafeEqual(givenHash, expectedHash);
  }

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.SCREEPS_TOKEN;
  const username = process.env.SCREEPS_USERNAME;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!token || !username) {
    return NextResponse.json(
      { error: "Screeps API用の環境変数が不足しています" },
      { status: 500 }
    );
  }

  // プレビュー環境ではSupabaseの環境変数が未設定の場合があるため、設定されているときのみ保存を実行する
  const supabase =
    supabaseUrl && supabaseKey
      ? createClient(supabaseUrl, supabaseKey)
      : null;

  try {
    const res = await fetch(`${SCREEPS_API}/user/overview`, {
      headers: {
        "X-Token": token,
        "X-Username": username,
      },
      // Security: Set a 10-second timeout to prevent resource exhaustion from external API hangs
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Screeps API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (supabase) {
      const { error } = await supabase.from("screeps_stats").insert({
        gcl_level: data.gcl.level,
        gcl_progress: data.gcl.progress,
        gcl_progress_total: data.gcl.progressTotal,
        power: data.power,
        cpu_used: data.cpuUsed,
        rooms: data.rooms,
      });

      if (error) {
        // Security: Log the actual error for internal debugging but return a generic message to the client
        console.error("Supabase stats insertion error:", error.message);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch from Screeps API" },
      { status: 500 }
    );
  }
}
