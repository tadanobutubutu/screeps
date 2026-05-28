/**
 * tests/sentinel_dashboard_hardening.test.js
 * Verification for Dashboard API response filtering and validation.
 */

describe('Dashboard API Hardening', () => {
    // We mock the filtering logic used in the API routes
    const filterScreepsResponse = (data) => {
        return {
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
            rooms:
                data.rooms && typeof data.rooms === 'object'
                    ? Object.keys(data.rooms).slice(0, 100)
                    : [],
        };
    };

    test('should filter out sensitive or unnecessary fields from Screeps API response', () => {
        const mockRawResponse = {
            gcl: {
                level: 10,
                progress: 500,
                progressTotal: 1000,
            },
            power: 100,
            cpuUsed: 15.5,
            rooms: {
                W1N1: { status: 'ok' },
                W1N2: { status: 'ok' },
            },
            email: 'user@example.com', // Sensitive PII
            id: '5f9b3a2b1c', // Internal ID
            token: 'secret_session_token', // Sensitive token
            otherMetadata: { foo: 'bar' }, // Unnecessary data
        };

        const result = filterScreepsResponse(mockRawResponse);

        expect(result.gcl).toEqual({
            level: 10,
            progress: 500,
            progressTotal: 1000,
        });
        expect(result.power).toBe(100);
        expect(result.cpuUsed).toBe(15.5);
        // Verify rooms is now an array of keys
        expect(result.rooms).toEqual(['W1N1', 'W1N2']);

        // Verify sensitive fields are removed
        expect(result.email).toBeUndefined();
        expect(result.id).toBeUndefined();
        expect(result.token).toBeUndefined();
        expect(result.otherMetadata).toBeUndefined();
    });

    test('should handle missing or malformed data gracefully with safe defaults', () => {
        const malformedResponse = {
            gcl: {
                level: 'invalid',
                progress: null,
                // progressTotal missing
            },
            power: '100px',
            // cpuUsed missing
            rooms: { W1N1: {} },
        };

        const result = filterScreepsResponse(malformedResponse);

        expect(result.gcl).toEqual({
            level: 0,
            progress: 0,
            progressTotal: 0,
        });
        expect(result.power).toBe(0); // NaN becomes 0
        expect(result.cpuUsed).toBe(0);
        // Verify rooms is an array containing the key
        expect(result.rooms).toEqual(['W1N1']);
    });

    test('should handle completely empty response', () => {
        const result = filterScreepsResponse({});

        expect(result.gcl).toBeUndefined();
        expect(result.power).toBe(0);
        expect(result.cpuUsed).toBe(0);
        expect(result.rooms).toEqual([]);
    });

    test('should limit rooms array to 100 entries', () => {
        const manyRooms = {};
        for (let i = 0; i < 150; i++) {
            manyRooms[`W${i}N${i}`] = { foo: 'bar' };
        }

        const result = filterScreepsResponse({ rooms: manyRooms });

        expect(Array.isArray(result.rooms)).toBe(true);
        expect(result.rooms.length).toBe(100);
        expect(result.rooms[0]).toBe('W0N0');
    });
});
