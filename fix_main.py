import os
import re

def fix_main():
    path = 'main.js'
    with open(path, 'r') as f:
        content = f.read()

    # The loop should start after all functions and TaskQueue registrations
    loop_entry = "module.exports.loop = function () {\n"
    tick_start = "    try {\n        const rooms = (global._rooms = Object.values(Game.rooms || {}));"

    if loop_entry not in content:
        content = content.replace(tick_start, loop_entry + tick_start)

    # Very specific fixes for truncated functions in main.js

    # 1. _displayCoreStats
    core_start = 'function _displayCoreStats(creeps) {'
    core_end = "    .length / 1024).toFixed(1) + ' KB');\n}"
    core_replacement = """function _displayCoreStats(creeps) {
    console.log('--- SYSTEM STATUS ---');
    console.log('Mode: ' + adaptiveSystem.getModeName(Memory.adaptive?.currentMode ?? 2).toUpperCase());
    console.log('Creeps: ' + Object.keys(creeps).length);
    console.log('CPU: ' + Game.cpu.getUsed().toFixed(2) + '/' + Game.cpu.limit + ' (Bucket: ' + Game.cpu.bucket + ')');
    console.log('Memory: ' + (RawMemory.get().length / 1024).toFixed(1) + ' KB');
}"""
    start = content.find(core_start)
    end = content.find(core_end, start)
    if start != -1 and end != -1:
        content = content[:start] + core_replacement + content[end + len(core_end):]

    # 2. _displayEmotionStats
    emotion_start = 'function _displayEmotionStats() {'
    emotion_end = "    );\n}"
    emotion_replacement = """function _displayEmotionStats() {
    const emotionStats = EmotionSystem.getStats();
    console.log('Emotions - Positive: ' + emotionStats.positive + ', Negative: ' + emotionStats.negative + ', Neutral: ' + emotionStats.neutral);
}"""
    start = content.find(emotion_start)
    end = content.find(emotion_end, start)
    if start != -1 and end != -1:
        content = content[:start] + emotion_replacement + content[end + len(emotion_end):]

    # 3. _displayGamificationStats
    gamification_start = 'function _displayGamificationStats() {'
    gamification_end = '        }\n}'
    gamification_replacement = """function _displayGamificationStats() {
    const gm = Memory.gamification;
    if (gm) {
        console.log('Gamification - Level: ' + (gm.level || 1) + ', Points: ' + (gm.points || 0));
    }
}"""
    start = content.find(gamification_start)
    end = content.find(gamification_end, start)
    if start != -1 and end != -1:
        content = content[:start] + gamification_replacement + content[end + len(gamification_end):]

    # 4. global.help
    help_start = 'global.help = function () {'
    help_end = '};'
    help_replacement = """global.help = function () {
    console.log('adaptive() - system dashboard');
    console.log('mode(n)     - force mode (0=EMERGENCY, 1=MINIMAL, 2=NORMAL, 3=FULL)');
    console.log('e()         - emotion stats');
    console.log('ec(name)    - check creep');
    console.log('m()         - memory stats');
    console.log('mh()        - history');
    console.log('ml()        - leaderboard');
    console.log('mc()        - cleanup');
    console.log('g()         - dashboard');
    console.log('evo()       - dashboard');
};"""
    start = content.find(help_start)
    end = content.find(help_end, start)
    if start != -1 and end != -1:
        content = content[:start] + help_replacement + content[end + len(help_end):]

    # Cleanup the bad \n
    content = content.replace('\\n    if (!Memory.lastCleanup', '    if (!Memory.lastCleanup')

    # Add missing closing brace for the loop if it was truncated at the end
    # Based on git show main:main.js, it ends with global.help and some closing stuff.
    # The module.exports.loop starts at try block and should end after displayStats call.

    # Find where the tick loop logic ends
    tick_logic_end = "displayStats(creeps);\n        }\n    } catch (e) {"
    # We want to find the corresponding } for the loop function.
    # It should be after the catch block.

    loop_end_marker = "logger.error('CRITICAL ERROR: ' + e.message + (safeStack ? '\\n' + safeStack : ''));\n    }\n};"
    if loop_end_marker not in content:
        # Try to find where to insert it
        catch_end = "logger.error('CRITICAL ERROR: ' + e.message + (safeStack ? '\\n' + safeStack : ''));\n    }"
        content = content.replace(catch_end, catch_end + "\n};")

    with open(path, 'w') as f:
        f.write(content)

if __name__ == "__main__":
    fix_main()
