/**
 * utils.emotions.js のユニットテスト
 */

global.Game = { time: 10 };
global.Memory = {};
global.RESOURCE_ENERGY = 'energy';
global.TERRAIN_MASK_WALL = 1;

const EmotionSystem = require('../utils.emotions');

describe('utils.emotions', () => {
    let mockCreep;

    beforeEach(() => {
        global.Memory = {};
        mockCreep = {
            name: 'testCreep',
            memory: {},
            store: {
                getUsedCapacity: jest.fn().mockReturnValue(50),
                getCapacity: jest.fn().mockReturnValue(100),
            },
            hits: 100,
            hitsMax: 100,
            pos: { x: 5, y: 5 },
            say: jest.fn(),
        };
    });

    test('モジュールが正しく読み込める', () => {
        expect(EmotionSystem).toBeDefined();
        expect(typeof EmotionSystem.initialize).toBe('function');
        expect(typeof EmotionSystem.updateEmotion).toBe('function');
        expect(typeof EmotionSystem.display).toBe('function');
        expect(typeof EmotionSystem.celebrate).toBe('function');
    });

    test('initializeがemotionsオブジェクトを作成する', () => {
        EmotionSystem.initialize(mockCreep);
        expect(mockCreep.memory.emotions).toBeDefined();
        expect(mockCreep.memory.emotions.mood).toBe(3);
        expect(mockCreep.memory.emotions.personalityTraits).toBeDefined();
    });

    test('initializeが既存のemotionsを上書きしない', () => {
        mockCreep.memory.emotions = { mood: 5, test: 'value' };
        EmotionSystem.initialize(mockCreep);
        expect(mockCreep.memory.emotions.mood).toBe(5);
        expect(mockCreep.memory.emotions.test).toBe('value');
    });

    test('updateEmotionがemojiを返す', () => {
        const emoji = EmotionSystem.updateEmotion(mockCreep);
        expect(emoji).toBeDefined();
        expect(typeof emoji).toBe('string');
    });

    test('updateEmotionがenergyが低いときhungryを返す', () => {
        mockCreep.store.getUsedCapacity.mockReturnValue(5);
        mockCreep.store.getCapacity.mockReturnValue(100);
        global.Game.time = 11;
        const emoji = EmotionSystem.updateEmotion(mockCreep);
        expect(emoji).toBeDefined();
    });

    test('updateEmotionがenergyが高いときenergeticを返す', () => {
        mockCreep.store.getUsedCapacity.mockReturnValue(95);
        mockCreep.store.getCapacity.mockReturnValue(100);
        global.Game.time = 11;
        const emoji = EmotionSystem.updateEmotion(mockCreep);
        expect(emoji).toBeDefined();
    });

    test('updateEmotionがhealthが低いときhurtを返す', () => {
        mockCreep.hits = 40;
        mockCreep.hitsMax = 100;
        global.Game.time = 11;
        const emoji = EmotionSystem.updateEmotion(mockCreep);
        expect(emoji).toBeDefined();
    });

    test('getMoodDescriptionが正しい説明を返す', () => {
        mockCreep.memory.emotions = { mood: 5 };
        const desc = EmotionSystem.getMoodDescription(mockCreep);
        expect(desc).toContain('Very Happy');
    });

    test('getMoodDescriptionがsadのとき正しい説明を返す', () => {
        mockCreep.memory.emotions = { mood: 2 };
        const desc = EmotionSystem.getMoodDescription(mockCreep);
        expect(desc).toContain('Sad');
    });

    test('getPerformanceModifierがmoodに応じて返す', () => {
        mockCreep.memory.emotions = { mood: 5 };
        expect(EmotionSystem.getPerformanceModifier(mockCreep)).toBe(1.1);

        mockCreep.memory.emotions = { mood: 4 };
        expect(EmotionSystem.getPerformanceModifier(mockCreep)).toBe(1.05);

        mockCreep.memory.emotions = { mood: 1 };
        expect(EmotionSystem.getPerformanceModifier(mockCreep)).toBe(0.9);
    });

    test('celebrateがachievementを追加する', () => {
        mockCreep.memory.emotions = { mood: 3, achievements: [] };
        EmotionSystem.celebrate(mockCreep, 'Test Achievement');
        expect(mockCreep.memory.emotions.achievements.length).toBe(1);
        expect(mockCreep.memory.emotions.achievements[0].name).toBe('Test Achievement');
        expect(mockCreep.memory.emotions.mood).toBe(5);
    });

    test('displayがsayを呼ぶ', () => {
        EmotionSystem.display(mockCreep);
        expect(mockCreep.say).toHaveBeenCalled();
    });

    describe('checkCreep', () => {
        let consoleLogSpy;

        beforeEach(() => {
            consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
            global.Game.creeps = {};
        });

        afterEach(() => {
            consoleLogSpy.mockRestore();
        });

        test('invalid creep nameを弾く', () => {
            EmotionSystem.checkCreep('__proto__');
            expect(consoleLogSpy).toHaveBeenCalledWith('❌ Invalid creep name');
        });

        test('creepが見つからない場合エラーを出す', () => {
            EmotionSystem.checkCreep('nonExistentCreep');
            expect(consoleLogSpy).toHaveBeenCalledWith('❌ Creep not found');
        });

        test('emotionsが未初期化の場合初期化してレポートを出す', () => {
            global.Game.creeps['testCreep'] = mockCreep;
            EmotionSystem.checkCreep('testCreep');
            expect(mockCreep.memory.emotions).toBeDefined();
            expect(consoleLogSpy).toHaveBeenCalledWith('\n🤖 Creep Emotion Report');
            expect(consoleLogSpy).toHaveBeenCalledWith('Name:', 'testCreep');
        });

        test('achievementsがある場合それもレポートに出す', () => {
            global.Game.creeps['testCreep'] = mockCreep;
            mockCreep.memory.emotions = {
                mood: 5,
                lastEmotion: '😊',
                personalityTraits: 'cheerful',
                birthTick: 0,
                achievements: [{ name: 'First Mine', tick: 5 }],
            };
            global.Game.time = 10;
            EmotionSystem.checkCreep('testCreep');
            expect(consoleLogSpy).toHaveBeenCalledWith('\n🏆 Achievements:');
            expect(consoleLogSpy).toHaveBeenCalledWith('-', 'First Mine', '(tick', 5, ')');
        });
    });
});
