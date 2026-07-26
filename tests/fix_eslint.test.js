const fs = require('fs');

jest.mock('fs');

describe('fix_eslint.js', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should read main.js and add STRUCTURE_RAMPART to globals', () => {
        const oldContent = '/* global Game, Memory, Room, FIND_HOSTILE_CREEPS, FIND_SOURCES_ACTIVE, STRUCTURE_WALL, STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_LAB, RESOURCE_ENERGY, STRUCTURE_CONTAINER, _ */\nconst foo = "bar";';
        fs.readFileSync.mockReturnValue(oldContent);

        jest.isolateModules(() => {
            require('../fix_eslint');
        });

        expect(fs.readFileSync).toHaveBeenCalledWith('main.js', 'utf8');

        const newContent = '/* global Game, Memory, Room, FIND_HOSTILE_CREEPS, FIND_SOURCES_ACTIVE, STRUCTURE_WALL, STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_LAB, RESOURCE_ENERGY, STRUCTURE_CONTAINER, STRUCTURE_RAMPART, _ */\nconst foo = "bar";';
        expect(fs.writeFileSync).toHaveBeenCalledWith('main.js', newContent, 'utf8');
    });

    it('should not modify content if global string is not found', () => {
        const otherContent = '/* global Game, Memory, Room */\nconst foo = "bar";';
        fs.readFileSync.mockReturnValue(otherContent);

        jest.isolateModules(() => {
            require('../fix_eslint');
        });

        expect(fs.readFileSync).toHaveBeenCalledWith('main.js', 'utf8');
        expect(fs.writeFileSync).toHaveBeenCalledWith('main.js', otherContent, 'utf8');
    });
});
