import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual, createHash } from 'crypto';

const SCREEPS_API = 'https://screeps.com/api';

export async function GET(request: Request) {
    // Security: Check for authorization secret to prevent unauthorized data collection triggers.
    // We use a fail-closed logic: if CRON_SECRET is not set or doesn't match, we deny access.
    // Security: Limit header length and check format to mitigate DoS and malformed inputs
    const authHeader = request.headers.get('authorization') || '';
    const cronSecret = process.env.CRON_SECRET;

    // Security: タイミング攻撃を防ぐために、ハッシュ化した上で一定時間で比較(constant-time comparison)を行います。
    let isAuthorized = false;
    if (cronSecret && authHeader && authHeader.length <= 512 && authHeader.startsWith('Bearer ')) {
        const expectedAuth = `Bearer ${cronSecret}`;
        const givenHash = createHash('sha256').update(authHeader).digest();
        const expectedHash = createHash('sha256').update(expectedAuth).digest();
        isAuthorized = timingSafeEqual(givenHash, expectedHash);
    }

    if (!isAuthorized) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = process.env.SCREEPS_TOKEN;
    const username = process.env.SCREEPS_USERNAME;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!token || !username) {
        return NextResponse.json(
            { error: 'Screeps API用の環境変数が不足しています' },
            { status: 500 }
        );
    }

    // プレビュー環境ではSupabaseの環境変数が未設定の場合があるため、設定されているときのみ保存を実行する
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

    try {
        const res = await fetch(`${SCREEPS_API}/user/overview`, {
            headers: {
                'X-Token': token,
                'X-Username': username,
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

        // Security: Filter and validate Screeps API response to prevent accidental PII leakage
        // and ensure data integrity before database insertion.
        if (!data || typeof data !== 'object' || !data.gcl) {
            console.error('Malformed Screeps API response: missing data or gcl object');
            return NextResponse.json(
                { error: 'Malformed response from Screeps API' },
                { status: 502 }
            );
        }

        const filteredData = {
            gcl: {
                level: Number(data.gcl?.level) || 0,
                progress: Number(data.gcl?.progress) || 0,
                progressTotal: Number(data.gcl?.progressTotal) || 0,
            },
            power: Number(data.power) || 0,
            cpuUsed: Number(data.cpuUsed) || 0,
            // Security: Data minimization - only return room names as an array, limited to 100 entries.
            // This prevents leaking room metadata and limits resource consumption.
            rooms:
                data.rooms && typeof data.rooms === 'object'
                    ? Object.keys(data.rooms).slice(0, 100)
                    : [],
        };

        if (supabase) {
            const { error } = await supabase.from('screeps_stats').insert({
                gcl_level: filteredData.gcl.level,
                gcl_progress: filteredData.gcl.progress,
                gcl_progress_total: filteredData.gcl.progressTotal,
                power: filteredData.power,
                cpu_used: filteredData.cpuUsed,
                rooms: filteredData.rooms,
            });

            if (error) {
                // Security: Log the actual error for internal debugging but return a generic message to the client
                console.error('Supabase stats insertion error:', error.message);
                return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, data: filteredData });
    } catch (err) {
        // Security: Log the actual error for internal debugging while returning a generic message to the client
        console.error('Screeps API collection error:', err);
        return NextResponse.json({ error: 'Failed to fetch from Screeps API' }, { status: 500 });
    }
}
