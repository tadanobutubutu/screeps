import { NextResponse } from "next/server";

const SCREEPS_API = "https://screeps.com/api";
const TOKEN = process.env.SCREEPS_TOKEN ?? "";
const USERNAME = process.env.SCREEPS_USERNAME ?? "";
const DASHBOARD_SECRET = process.env.DASHBOARD_SECRET;

// Allow-list of supported Screeps API endpoints. Query values are mapped to concrete paths.
const ALLOWED_ENDPOINTS: Record<string, string> = {
  overview: "user/overview",
  // add more allowed endpoints here as needed, e.g.:
  // "stats": "user/stats",
};

export async function GET(request: Request) {
  // Security: Bearerトークンによる認証を追加し、ダッシュボードへの未承認アクセスを防止
  const authHeader = request.headers.get("authorization");
  if (!DASHBOARD_SECRET || authHeader !== `Bearer ${DASHBOARD_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const endpointKey = searchParams.get("endpoint") ?? "overview";

  // Security: Use hasOwnProperty to prevent using inherited object properties as API paths
  const resolvedEndpoint =
    Object.prototype.hasOwnProperty.call(ALLOWED_ENDPOINTS, endpointKey)
      ? ALLOWED_ENDPOINTS[endpointKey]
      : ALLOWED_ENDPOINTS["overview"];

  try {
    const res = await fetch(`${SCREEPS_API}/${resolvedEndpoint}`, {
      headers: {
        "X-Token": TOKEN,
        "X-Username": USERNAME,
      },
      next: { revalidate: 60 }, // 60秒キャッシュ
    });

    if (!res.ok) {
      // Security: 詳細なエラー情報を隠蔽し、機密情報の漏洩を防止
      return NextResponse.json(
        { error: "Screeps API error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch from Screeps API" },
      { status: 500 }
    );
  }
}
