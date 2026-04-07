import { NextResponse } from "next/server";

const SCREEPS_API = "https://screeps.com/api";
const TOKEN = process.env.SCREEPS_TOKEN ?? "";
const USERNAME = process.env.SCREEPS_USERNAME ?? "";

// Allow-list of supported Screeps API endpoints. Query values are mapped to concrete paths.
const ALLOWED_ENDPOINTS: Record<string, string> = {
  overview: "user/overview",
  // add more allowed endpoints here as needed, e.g.:
  // "stats": "user/stats",
};

export async function GET(request: Request) {
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
      return NextResponse.json(
        { error: `Screeps API error: ${res.status}` },
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
