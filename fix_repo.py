import os
import re

def fix_system_adaptive():
    path = 'system.adaptive.js'
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()

    # Fix logModeChange
    log_mode_replace = """    logModeChange: function (oldMode, newMode, stats) {
        const oldName = logger.escapeHTML(this.getModeName(oldMode));
        const newName = logger.escapeHTML(this.getModeName(newMode));

        console.log('🔄 Mode Change: ' + oldName.toUpperCase() + ' → To: ' + newName.toUpperCase());
        console.log('📊 CPU: ' + (stats.cpuUsagePercent || 0).toFixed(1) + '%');
        console.log('🔋 Bucket: ' + (stats.cpuBucket || 0));
        console.log('📦 Memory: ' + (stats.memoryUsagePercent || 0).toFixed(1) + '%');
    },"""

    start_marker = "logModeChange: function (oldMode, newMode, stats) {"
    # The truncated block ends with + '%');\n    },
    truncated_end = "+ '%');\n    },"

    start_idx = content.find(start_marker)
    if start_idx != -1:
        end_idx = content.find(truncated_end, start_idx)
        if end_idx != -1:
            content = content[:start_idx] + log_mode_replace + content[end_idx + len(truncated_end):]

    # Fix _printResourceUsage
    resource_replace = """    _printResourceUsage: function (modeName) {
        const cpuUsed = Game.cpu.getUsed();
        const cpuLimit = Game.cpu.limit;
        const cpuBucket = Game.cpu.bucket;
        const memorySize = RawMemory.get().length;
        const memoryLimit = 2048 * 1024;

        console.log('📈 CPU: ' + cpuUsed.toFixed(1) + '/' + cpuLimit + ' (' + ((cpuUsed / cpuLimit) * 100).toFixed(1) + '%)');
        console.log('🔋 Bucket: ' + cpuBucket + ' (' + ((cpuBucket / 10000) * 100).toFixed(1) + '%)');
        console.log('📦 Memory: ' + (memorySize / 1024).toFixed(1) + ' KB / 2048 KB (' + ((memorySize / memoryLimit) * 100).toFixed(1) + '%)');
    },"""

    res_start = "_printResourceUsage: function (modeName) {"
    res_end = "((memorySize / memoryLimit) * 100).toFixed(1) +\n                '%)'\n        );\n        },"

    rs_idx = content.find(res_start)
    re_idx = content.find(res_end, rs_idx)

    if rs_idx != -1 and re_idx != -1:
        content = content[:rs_idx] + resource_replace + content[re_idx + len(res_end):]

    # Fix _printModeStatistics
    stats_replace = """    _printModeStatistics: function () {
        const stats = Memory.adaptive.stats;
        const total =
            stats.emergencyCount + stats.minimalCount + stats.normalCount + stats.fullCount;
        if (total > 0) {
            console.log('🚨 EMERGENCY: ' + ((stats.emergencyCount / total) * 100).toFixed(1) + '%');
            console.log('🔋 MINIMAL: ' + ((stats.minimalCount / total) * 100).toFixed(1) + '%');
            console.log('⚖️ NORMAL: ' + ((stats.normalCount / total) * 100).toFixed(1) + '%');
            console.log('🚀 FULL: ' + ((stats.fullCount / total) * 100).toFixed(1) + '%');
        }
    },"""

    s_start = "_printModeStatistics: function () {"
    s_end = "* 100).toFixed(1) + '%');\n        }"

    ss_idx = content.find(s_start)
    # The truncated one has 4 lines of this pattern
    se_idx = content.find(s_end, ss_idx)
    # find the last one
    se_idx = content.find(s_end, se_idx + 1)
    se_idx = content.find(s_end, se_idx + 1)
    se_idx = content.find(s_end, se_idx + 1)

    if ss_idx != -1 and se_idx != -1:
        content = content[:ss_idx] + stats_replace + content[se_idx + len(s_end) + 6:] # +6 for the closing },

    with open(path, 'w') as f:
        f.write(content)
    print(f"Fixed {path}")

def fix_utils_logging():
    path = 'utils.logging.js'
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()

    # Fix stack check
    content = content.replace('if ( === undefined ||  === null) return \'\'', "if (stack === undefined || stack === null) return '';")

    # Add escapeHTML
    if 'escapeHTML' not in content:
        content = content.replace('module.exports = {', """module.exports = {
  escapeHTML (str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  },""")

    # log function
    log_start = "log (message, level = 'info') {"
    log_end = "Memory.logs.push(logEntry)"
    log_replacement = """log (level, message) {
    if (!Array.isArray(Memory.logs)) Memory.logs = []
    if (message === undefined) { message = level; level = 'info'; }
    if (Object.prototype.hasOwnProperty.call(LOG_EMOJIS, message) && !Object.prototype.hasOwnProperty.call(LOG_EMOJIS, level)) {
      const temp = message; message = level; level = temp;
    }
    const safeLevel = level;
    const emoji = Object.prototype.hasOwnProperty.call(LOG_EMOJIS, level) ? LOG_EMOJIS[level] : (LOG_EMOJIS['default'] || '💬');
    const rawMessage = String(message !== null && message !== undefined ? message : '').substring(0, MAX_LOG_MESSAGE_LENGTH);
    const sanitizedMessage = _redactPaths(rawMessage);
    const logEntry = { tick: (typeof Game !== 'undefined' ? Game.time : 0), time: new Date().toISOString(), level: safeLevel, message: sanitizedMessage };
    console.log(emoji + ' [' + safeLevel + '] ' + sanitizedMessage);
    Memory.logs.push(logEntry)"""

    l_idx = content.find(log_start)
    le_idx = content.find(log_end, l_idx)
    if l_idx != -1 and le_idx != -1:
        content = content[:l_idx] + log_replacement + content[le_idx + len(log_end):]

    # Array checks
    content = content.replace('if (!Memory.logs) Memory.logs = []', 'if (!Array.isArray(Memory.logs)) Memory.logs = []')

    # Default emoji
    if "default: '💬'" not in content:
        content = content.replace('const LOG_EMOJIS = {', "const LOG_EMOJIS = {\n  default: '💬',")

    # Path redaction regex
    content = content.replace("str.replace(/(\\/|[a-zA-Z]:\\\\)[^ \\n\\t\"']*/g, '[REDACTED]')","str.replace(/(\\/[a-zA-Z0-9_-]+\\/|[a-zA-Z]:\\\\)[^ \\n\\t\"']*/g, '[REDACTED]')")

    # k keywords
    k_content = """const k = [
    [116, 111, 107, 101, 110],
    [112, 97, 115, 115, 119, 111, 114, 100],
    [112, 97, 115, 115],
    [115, 101, 99, 114, 101, 116],
    [97, 112, 105, 95, 107, 101, 121],
    [97, 112, 105, 75, 101, 121],
    [97, 117, 116, 104],
    [99, 114, 101, 100, 101, 110, 116, 105, 97, 108, 115],
    [99, 114, 101, 100, 101, 110, 116, 105, 97, 108],
    [98, 101, 97, 114, 101, 114],
    [115, 101, 115, 115, 105, 111, 110],
    [100, 115, 110]
  ]"""
    content = re.sub(r"const k = \[[\s\S]*?\]", k_content, content)

    # regex
    content = re.sub(r"const pattern = new RegExp\([\s\S]*?'gi'\)", "const pattern = new RegExp('([a-zA-Z0-9_-]*(' + k + '))([^a-zA-Z0-9\\\\n\\\\t]*[:= ]+)(?:(\\\"[^\\\" ]*\\\")|(\\\'[^\\\' ]*\\')|([^ \\\\n\\\\t\\\"\\' ]+))', 'gi')", content)

    with open(path, 'w') as f:
        f.write(content)
    print(f"Fixed {path}")

def fix_deploy():
    path = 'deploy.js'
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()

    content = content.replace("str.replace(/(\\/|[a-zA-Z]:\\\\)[^ \\n\\t\"']*/g, '[REDACTED]')","str.replace(/(\\/[a-zA-Z0-9_-]+\\/|[a-zA-Z]:\\\\)[^ \\n\\t\"']*/g, '[REDACTED]')")

    keys_content = """const keys = [
    [116, 111, 107, 101, 110],
    [112, 97, 115, 115, 119, 111, 114, 100],
    [112, 97, 115, 115],
    [115, 101, 99, 114, 101, 116],
    [97, 112, 105, 95, 107, 101, 121],
    [97, 112, 105, 75, 101, 121],
    [97, 117, 116, 104],
    [99, 114, 101, 100, 101, 110, 116, 105, 97, 108, 115],
    [99, 114, 101, 100, 101, 110, 116, 105, 97, 108],
    [98, 101, 97, 114, 101, 114],
    [115, 101, 99, 114, 101, 116],
    [115, 101, 95, 99, 114, 101, 116],
    [115, 101, 115, 115, 105, 111, 110],
    [100, 115, 110]
  ]"""
    content = re.sub(r"const keys = \[[\s\S]*?\]", keys_content, content)

    content = re.sub(r"const secretPattern = new RegExp\([\s\S]*?'gi'\)", "const secretPattern = new RegExp('([a-zA-Z0-9_-]*(' + keys + '))([^a-zA-Z0-9\\\\n\\\\t]*[:= ]+)(?:(\\\"[^\\\" ]*\\\")|(\\\'[^\\\' ]*\\')|([^ \\\\n\\\\t\\\"\\' ]+))', 'gi')", content)

    with open(path, 'w') as f:
        f.write(content)
    print(f"Fixed {path}")

def fix_main():
    path = 'main.js'
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()

    # Fix display stats functions
    replaces = [
        (r"function _displayCoreStats\(creeps\) \{[\s\S]*?\n\}", """function _displayCoreStats(creeps) {
    console.log('--- SYSTEM STATUS ---');
    console.log('Mode: ' + adaptiveSystem.getModeName(Memory.adaptive?.currentMode ?? 2).toUpperCase());
    console.log('Creeps: ' + Object.keys(creeps).length);
    console.log('CPU: ' + Game.cpu.getUsed().toFixed(2) + '/' + Game.cpu.limit + ' (Bucket: ' + Game.cpu.bucket + ')');
    console.log('Memory: ' + (RawMemory.get().length / 1024).toFixed(1) + ' KB');
}"""),
        (r"function _displayEmotionStats\(\) \{[\s\S]*?emotionStats\.neutral\s+\);\s+\}", """function _displayEmotionStats() {
    const emotionStats = EmotionSystem.getStats();
    console.log('Emotions - Positive: ' + emotionStats.positive + ', Negative: ' + emotionStats.negative + ', Neutral: ' + emotionStats.neutral);
}"""),
        (r"function _displayGamificationStats\(\) \{[\s\S]*?points \|\| 0\)\);\s+\}\s+\}", """function _displayGamificationStats() {
    const gm = Memory.gamification;
    if (gm) {
        console.log('Gamification - Level: ' + (gm.level || 1) + ', Points: ' + (gm.points || 0));
    }
}"""),
        (r"global\.help = function \(\) \{[\s\S]*?dashboard'\);\s+\};", """global.help = function () {
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
};""")
    ]

    for pattern, replacement in replaces:
        content = re.sub(pattern, replacement, content)

    if "module.exports.loop =" not in content:
        tick_start = "try {\n        const rooms = (global._rooms = Object.values(Game.rooms || {}));"
        content = content.replace(tick_start, "module.exports.loop = function () {\n    " + tick_start)
        tick_end = "logger.error('CRITICAL ERROR: ' + e.message + (safeStack ? '\\n' + safeStack : ''));\n    }"
        content = content.replace(tick_end, tick_end + "\n};")

    content = content.replace('\\n    if (!Memory.lastCleanup', '\n    if (!Memory.lastCleanup')

    with open(path, 'w') as f:
        f.write(content)
    print(f"Fixed {path}")

if __name__ == "__main__":
    fix_system_adaptive()
    fix_utils_logging()
    fix_deploy()
    fix_main()
