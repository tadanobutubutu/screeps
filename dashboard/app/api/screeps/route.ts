import { NextResponse } from 'next/server';
import { timingSafeEqual, createHash } from 'crypto';

const SCREEPS_API = 'https://screeps.com/api';
const TOKEN = process.env.SCREEPS_TOKEN ?? '';
const USERNAME = process.env.SCREEPS_USERNAME ?? '';
const DASHBOARD_SECRET = process.env.DASHBOARD_SECRET;

// Allow-list of supported Screeps API endpoints. Query values are mapped to concrete paths.
const ALLOWED_ENDPOINTS: Record<string, string> = {
    overview: 'user/overview',
    // add more allowed endpoints here as needed, e.g.:
    // "stats": "user/stats",
};

export async function GET(request: Request) {
    // Security: Bearerトークンによる認証を追加し、ダッシュボードへの未承認アクセスを防止
    // Security: Limit header length and check format to mitigate DoS and malformed inputs
    const authHeader = request.headers.get('authorization') || '';

    // Security: タイミング攻撃を防ぐために、ハッシュ化した上で一定時間で比較(constant-time comparison)を行います。
    let isAuthorized = false;
    if (
        DASHBOARD_SECRET &&
        authHeader &&
        authHeader.length <= 512 &&
        authHeader.startsWith('Bearer ')
    ) {
        const expectedAuth = `Bearer ${DASHBOARD_SECRET}`;
        const givenHash = createHash('sha256').update(authHeader).digest();
        const expectedHash = createHash('sha256').update(expectedAuth).digest();
        isAuthorized = timingSafeEqual(givenHash, expectedHash);
    }

    if (!isAuthorized) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    // Security: Limit endpoint key length
    const endpointKey = (searchParams.get('endpoint') ?? 'overview').substring(0, 64);

    // Security: Use hasOwnProperty to prevent using inherited object properties as API paths
    const resolvedEndpoint = Object.prototype.hasOwnProperty.call(ALLOWED_ENDPOINTS, endpointKey)
        ? ALLOWED_ENDPOINTS[endpointKey]
        : ALLOWED_ENDPOINTS['overview'];

    try {
        const res = await fetch(`${SCREEPS_API}/${resolvedEndpoint}`, {
            headers: {
                'X-Token': TOKEN,
                'X-Username': USERNAME,
            },
            next: { revalidate: 60 }, // 60秒キャッシュ
            // Security: Set a 10-second timeout to prevent resource exhaustion from external API hangs
            signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
            // Security: 詳細なエラー情報を隠蔽し、機密情報の漏洩を防止
            return NextResponse.json({ error: 'Screeps API error' }, { status: res.status });
        }

        const data = await res.json();

        // Security: Filter Screeps API response to prevent accidental PII leakage.
        // We only return fields required by the dashboard.
        const filteredData = {
            gcl: data.gcl
                ? {
                      level: Number(data.gcl.level) || 0,
                      progress: Number(data.gcl.progress) || 0,
                      progressTotal: Number(data.gcl.progressTotal) || 0,
                  }
                : undefined,
            power: Number(data.power) || 0,
            cpuUsed: Number(data.cpuUsed) || 0,
            // Security: Data minimization - only return room names as an array, limited to 100 entries.
            // This prevents leaking room metadata and limits resource consumption.
            rooms:
                data.rooms && typeof data.rooms === 'object'
                    ? Object.keys(data.rooms).slice(0, 100)
                    : [],
        };

        return NextResponse.json(filteredData);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch from Screeps API' }, { status: 500 });
    }
}
