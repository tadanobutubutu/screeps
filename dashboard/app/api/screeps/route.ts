import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        gcl: {
            level: 5,
            progress: 123456,
            progressTotal: 1000000
        },
        power: 100,
        cpuUsed: 12.34,
        rooms: ['E1S1', 'E1S2']
    });
}
