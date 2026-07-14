/**
 * role.healer.js のユニットテスト
 */

global.Game = {
    flags: {},
};
global.Memory = {};
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_MY_CREEPS = 1;

const roleHealer = require('../role.healer');

describe('role.healer', () => {
    let mockCreep;

    beforeEach(() => {
        global.Game.flags = {};
        mockCreep = {
            memory: {},
            heal: jest.fn().mockReturnValue(global.OK),
            rangedHeal: jest.fn().mockReturnValue(global.OK),
            moveTo: jest.fn().mockReturnValue(global.OK),
            pos: {
                findClosestByRange: jest.fn(),
            },
        };
    });

    test('モジュールが正しく読み込める', () => {
        expect(roleHealer).toBeDefined();
        expect(typeof roleHealer.run).toBe('function');
    });

    test('ダメージを受けたcreepを回復する (in range)', () => {
        const damagedCreep = { hits: 50, hitsMax: 100 };
        mockCreep.pos.findClosestByRange.mockImplementation((type, opts) => {
            if (type === global.FIND_MY_CREEPS && opts.filter(damagedCreep)) {
                return damagedCreep;
            }
            return null;
        });

        roleHealer.run(mockCreep);

        expect(mockCreep.heal).toHaveBeenCalledWith(damagedCreep);
        expect(mockCreep.moveTo).not.toHaveBeenCalled();
        expect(mockCreep.rangedHeal).not.toHaveBeenCalled();
    });

    test('ダメージを受けたcreepに近づき、遠隔回復する (out of range)', () => {
        const damagedCreep = { hits: 50, hitsMax: 100 };
        mockCreep.pos.findClosestByRange.mockImplementation((type, opts) => {
            if (type === global.FIND_MY_CREEPS && opts.filter(damagedCreep)) {
                return damagedCreep;
            }
            return null;
        });
        mockCreep.heal.mockReturnValue(global.ERR_NOT_IN_RANGE);

        roleHealer.run(mockCreep);

        expect(mockCreep.heal).toHaveBeenCalledWith(damagedCreep);
        expect(mockCreep.moveTo).toHaveBeenCalledWith(damagedCreep, expect.any(Object));
        expect(mockCreep.rangedHeal).toHaveBeenCalledWith(damagedCreep);
    });

    test('ダメージを受けたcreepがいない場合、HealPointフラグへ移動する', () => {
        const flag = { name: 'HealPoint' };
        global.Game.flags.HealPoint = flag;

        // No damaged creeps
        mockCreep.pos.findClosestByRange.mockReturnValue(null);

        roleHealer.run(mockCreep);

        expect(mockCreep.heal).not.toHaveBeenCalled();
        expect(mockCreep.moveTo).toHaveBeenCalledWith(flag);
    });

    test('ダメージを受けたcreepもHealPointフラグもない場合、defenderの近くへ移動する', () => {
        const defender = { memory: { role: 'defender' } };

        // First call looks for damaged creeps (returns null), second looks for defender
        mockCreep.pos.findClosestByRange
            .mockReturnValueOnce(null)
            .mockImplementationOnce((type, opts) => {
                if (type === global.FIND_MY_CREEPS && opts.filter(defender)) {
                    return defender;
                }
                return null;
            });

        roleHealer.run(mockCreep);

        expect(mockCreep.heal).not.toHaveBeenCalled();
        expect(mockCreep.moveTo).toHaveBeenCalledWith(defender);
    });

    test('ターゲットが何もない場合、何もしない', () => {
        mockCreep.pos.findClosestByRange.mockReturnValue(null);

        roleHealer.run(mockCreep);

        expect(mockCreep.heal).not.toHaveBeenCalled();
        expect(mockCreep.moveTo).not.toHaveBeenCalled();
    });
});
