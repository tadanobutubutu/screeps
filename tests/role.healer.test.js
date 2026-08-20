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
            room: { find: jest.fn().mockReturnValue([]) },
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
        mockCreep.room.find.mockReturnValue([damagedCreep]);
        mockCreep.pos.findClosestByRange.mockReturnValue(damagedCreep);

        roleHealer.run(mockCreep);

        expect(mockCreep.heal).toHaveBeenCalledWith(damagedCreep);
        expect(mockCreep.moveTo).not.toHaveBeenCalled();
        expect(mockCreep.rangedHeal).not.toHaveBeenCalled();
    });

    test('ダメージを受けたcreepに近づき、遠隔回復する (out of range)', () => {
        const damagedCreep = { hits: 50, hitsMax: 100 };
        mockCreep.room.find.mockReturnValue([damagedCreep]);
        mockCreep.pos.findClosestByRange.mockReturnValue(damagedCreep);
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
        mockCreep.room.find.mockImplementation((type, opts) => {
                if (opts && opts.filter && opts.filter(defender)) return [defender];
                return [];
            });
        mockCreep.room._defenders = [defender];
        mockCreep.pos.findClosestByRange.mockReturnValue(defender);

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

    test('⚡ [Bolt Perf] Game.getObjectByIdでキャッシュされたターゲットを使用する', () => {
        const cachedCreep = { id: 'creep123', hits: 50, hitsMax: 100 };
        mockCreep.memory.healTargetId = 'creep123';
        global.Game.getObjectById = jest.fn().mockReturnValue(cachedCreep);

        roleHealer.run(mockCreep);

        expect(global.Game.getObjectById).toHaveBeenCalledWith('creep123');
        expect(mockCreep.heal).toHaveBeenCalledWith(cachedCreep);
        expect(mockCreep.pos.findClosestByRange).not.toHaveBeenCalled();
    });

    test('⚡ [Bolt Perf] キャッシュされたターゲットが回復していた場合は削除して新規に探す', () => {
        const cachedCreep = { id: 'creep123', hits: 100, hitsMax: 100 };
        const newDamagedCreep = { id: 'creep456', hits: 80, hitsMax: 100 };
        mockCreep.memory.healTargetId = 'creep123';
        global.Game.getObjectById = jest.fn().mockReturnValue(cachedCreep);
        mockCreep.room.find.mockReturnValue([newDamagedCreep]);
        mockCreep.pos.findClosestByRange.mockReturnValue(newDamagedCreep);

        roleHealer.run(mockCreep);

        expect(global.Game.getObjectById).toHaveBeenCalledWith('creep123');
        expect(mockCreep.memory.healTargetId).toBe('creep456');
        expect(mockCreep.heal).toHaveBeenCalledWith(newDamagedCreep);
    });

    test('⚡ [Bolt Perf] room._injuredCreepsのキャッシュ配列が存在する場合は優先して検索する', () => {
        const injuredArray = [{ id: 'creep_inj_1', hits: 60, hitsMax: 100 }];
        mockCreep.room = { _injuredCreeps: injuredArray, find: jest.fn().mockReturnValue([]) };
        mockCreep.pos.findClosestByRange.mockReturnValue(injuredArray[0]);

        roleHealer.run(mockCreep);

        expect(mockCreep.pos.findClosestByRange).toHaveBeenCalledWith(injuredArray);
        expect(mockCreep.heal).toHaveBeenCalledWith(injuredArray[0]);
    });

    test('⚡ [Bolt Perf] room._defendersのキャッシュ配列が存在する場合は優先して検索する', () => {
        const defendersArray = [{ id: 'def_1', memory: { role: 'defender' } }];
        mockCreep.room = { _defenders: defendersArray, find: jest.fn().mockReturnValue([]) };
        mockCreep.pos.findClosestByRange.mockReturnValue(defendersArray[0]);

        roleHealer.run(mockCreep);

        expect(mockCreep.pos.findClosestByRange).toHaveBeenLastCalledWith(defendersArray);
        expect(mockCreep.moveTo).toHaveBeenCalledWith(defendersArray[0]);
    });
});
