import { NextResponse } from "next/server";

const SCREEPS_API = "https://screeps.com/api";
const TOKEN = process.env.SCREEPS_TOKEN ?? "";
const USERNAME = process.env.SCREEPS_USERNAME ?? "";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint") ?? "user/overview";

  try {
    const res = await fetch(`${SCREEPS_API}/${endpoint}`, {
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
