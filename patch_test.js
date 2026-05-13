const fs = require('fs');

let content = fs.readFileSync('tests/role.attacker.test.js', 'utf8');

const search = `    test('hits < 50% && HEAL available -> moveTo HEAL', () => {
        mockCreep.hits = 40;
        const healTarget = { getActiveBodyparts: jest.fn().mockReturnValue(1) };
        mockCreep.pos.findClosestByRange.mockImplementation((type, opts) => {
            if (type === global.FIND_MY_CREEPS) {
                if (opts && opts.filter(healTarget)) {
                    return healTarget;
                }
            }
            return null;
        });

        roleAttacker.run(mockCreep);

        expect(mockCreep.moveTo).toHaveBeenCalledWith(healTarget, expect.any(Object));
        expect(mockCreep.attack).not.toHaveBeenCalled();
    });`;

const replace = `    test('hits < 50% && HEAL available -> moveTo HEAL', () => {
        mockCreep.hits = 40;
        const healTarget = { getActiveBodyparts: jest.fn().mockReturnValue(1) };
        mockCreep.room._myCreeps = [healTarget];
        mockCreep.pos.findClosestByRange.mockImplementation((typeOrArray) => {
            if (Array.isArray(typeOrArray) && typeOrArray.includes(healTarget)) {
                return healTarget;
            }
            return null;
        });

        roleAttacker.run(mockCreep);

        expect(mockCreep.moveTo).toHaveBeenCalledWith(healTarget, expect.any(Object));
        expect(mockCreep.attack).not.toHaveBeenCalled();
    });`;

content = content.replace(search, replace);
fs.writeFileSync('tests/role.attacker.test.js', content, 'utf8');
