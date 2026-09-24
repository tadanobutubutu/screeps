/* global describe, test, expect, beforeEach, jest */
/**
 * system.adaptive.js のユニットテスト
 */

import SystemAdaptive from '../system.adaptive';

describe('SystemAdaptive', () => {
    test('should initialize with default empty options', () => {
        const system = new SystemAdaptive();
        expect(system.getStatus()).toEqual({});
    });

    test('should initialize with provided options', () => {
        const options = { mode: 'test', threshold: 10 };
        const system = new SystemAdaptive(options);
        expect(system.getStatus()).toEqual(options);
    });

    test('should merge additional options when adapt is called', () => {
        const system = new SystemAdaptive({ base: true, value: 1 });
        system.adapt({ value: 2, extra: 'new' });
        expect(system.getStatus()).toEqual({ base: true, value: 2, extra: 'new' });
    });

    test('should properly expose getStatus method', () => {
        const system = new SystemAdaptive({ status: 'active' });
        expect(system.getStatus()).toEqual({ status: 'active' });
    });
});
