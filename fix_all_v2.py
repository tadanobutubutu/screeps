import os
import re

def fix_system_adaptive():
    path = 'system.adaptive.js'
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()

    log_mode_start = 'logModeChange: function (oldMode, newMode, stats) {'
    log_mode_end = '    },'
    replacement = """    logModeChange: function (oldMode, newMode, stats) {
        // Security: Escape mode names to prevent console injection
        const oldName = logger.escapeHTML(this.getModeName(oldMode));
        const newName = logger.escapeHTML(this.getModeName(newMode));

        console.log('🔄 Mode Change: ' + oldName.toUpperCase() + ' → To: ' + newName.toUpperCase());
        console.log('📊 CPU: ' + (stats.cpuUsagePercent || 0).toFixed(1) + '%');
        console.log('🔋 Bucket: ' + (stats.cpuBucket || 0));
        console.log('📦 Memory: ' + (stats.memoryUsagePercent || 0).toFixed(1) + '%');
    },"""

    start_idx = content.find(log_mode_start)
    if start_idx != -1:
        # The truncated one ends with + '%');\n    },
        truncated_end = "+ '%');\n    },"
        end_idx = content.find(truncated_end, start_idx)
        if end_idx != -1:
            content = content[:start_idx] + replacement + content[end_idx + len(truncated_end):]

    # Fix _printResourceUsage
    resource_start = '_printResourceUsage: function (modeName) {'
    resource_end = """        );
        },"""
    resource_replacement = """    _printResourceUsage: function (modeName) {
        const cpuUsed = Game.cpu.getUsed();
        const cpuLimit = Game.cpu.limit;
        const cpuBucket = Game.cpu.bucket;
        const memorySize = RawMemory.get().length;
        const memoryLimit = 2048 * 1024;

        console.log('📈 CPU: ' + cpuUsed.toFixed(1) + '/' + cpuLimit + ' (' + ((cpuUsed / cpuLimit) * 100).toFixed(1) + '%)');
        console.log('🔋 Bucket: ' + cpuBucket + ' (' + ((cpuBucket / 10000) * 100).toFixed(1) + '%)');
        console.log('📦 Memory: ' + (memorySize / 1024).toFixed(1) + ' KB / 2048 KB (' + ((memorySize / memoryLimit) * 100).toFixed(1) + '%)');
    },"""

    r_start_idx = content.find(resource_start)
    if r_start_idx != -1:
        r_end_idx = content.find(resource_end, r_start_idx)
        if r_end_idx != -1:
            content = content[:r_start_idx] + resource_replacement + content[r_end_idx + len(resource_end):]

    with open(path, 'w') as f:
        f.write(content)
    print(f"Fixed {path}")

def fix_main():
    path = 'main.js'
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()

    core_stats_start = 'function _displayCoreStats(creeps) {'
    core_stats_end = '    .length / 1024).toFixed(1) + \' KB\');\n}'
    core_stats_replacement = """function _displayCoreStats(creeps) {
    console.log('--- SYSTEM STATUS ---');
    console.log('Mode: ' + adaptiveSystem.getModeName(Memory.adaptive?.currentMode ?? 2).toUpperCase());
    console.log('Creeps: ' + Object.keys(creeps).length);
    console.log('CPU: ' + Game.cpu.getUsed().toFixed(2) + '/' + Game.cpu.limit + ' (Bucket: ' + Game.cpu.bucket + ')');
    console.log('Memory: ' + (RawMemory.get().length / 1024).toFixed(1) + ' KB');
}"""

    start_idx = content.find(core_stats_start)
    if start_idx != -1:
        end_idx = content.find(core_stats_end, start_idx)
        if end_idx != -1:
            content = content[:start_idx] + core_stats_replacement + content[end_idx + len(core_stats_end):]

    emotion_stats_start = 'function _displayEmotionStats() {'
    emotion_stats_end = '    );\n}'
    emotion_replacement = """function _displayEmotionStats() {
    const emotionStats = EmotionSystem.getStats();
    console.log('Emotions - Positive: ' + emotionStats.positive + ', Negative: ' + emotionStats.negative + ', Neutral: ' + emotionStats.neutral);
}"""

    e_start_idx = content.find(emotion_stats_start)
    if e_start_idx != -1:
        e_end_idx = content.find(emotion_stats_end, e_start_idx)
        if e_end_idx != -1:
            content = content[:e_start_idx] + emotion_replacement + content[e_end_idx + len(emotion_stats_end):]

    with open(path, 'w') as f:
        f.write(content)
    print(f"Fixed {path}")

def fix_utils_logging():
    path = 'utils.logging.js'
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()

    content = content.replace('if ( === undefined ||  === null) return \'\'', "if (stack === undefined || stack === null) return '';")

    if 'escapeHTML' not in content:
        content = content.replace('module.exports = {', """module.exports = {
  escapeHTML (str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },""")

    with open(path, 'w') as f:
        f.write(content)
    print(f"Fixed {path}")

if __name__ == "__main__":
    fix_system_adaptive()
    fix_main()
    fix_utils_logging()
