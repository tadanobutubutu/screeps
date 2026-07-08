import os
import re

def fix_system_adaptive():
    path = 'system.adaptive.js'
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()

    # logModeChange fix
    log_mode_search = r"\+ ' → To: ' \+ newName\.toUpperCase\(\)\);[\s\S]*?\+ '%'\);[\s\S]*?\+ '%'\);"
    log_mode_replace = """console.log('🔄 Mode Change: ' + oldName.toUpperCase() + ' → To: ' + newName.toUpperCase());
        console.log('📊 CPU: ' + (stats.cpuUsagePercent || 0).toFixed(1) + '%');
        console.log('🔋 Bucket: ' + (stats.cpuBucket || 0));
        console.log('📦 Memory: ' + (stats.memoryUsagePercent || 0).toFixed(1) + '%');"""
    content = re.sub(log_mode_search, log_mode_replace, content)

    # _printResourceUsage fix
    resource_search = r"\+\s+'\/' \+ cpuLimit \+[\s\S]*?\.toFixed\(1\) \+ '%\'\);[\s\S]*?\.toFixed\(1\) \+[\s\S]*?' KB \/ 2048 KB \([\s\S]*?\);"
    resource_replace = """console.log('📈 CPU: ' + cpuUsed.toFixed(1) + '/' + cpuLimit + ' (' + ((cpuUsed / cpuLimit) * 100).toFixed(1) + '%)');
        console.log('🔋 Bucket: ' + cpuBucket + ' (' + ((cpuBucket / 10000) * 100).toFixed(1) + '%)');
        console.log('📦 Memory: ' + (memorySize / 1024).toFixed(1) + ' KB / 2048 KB (' + ((memorySize / memoryLimit) * 100).toFixed(1) + '%)');"""
    content = re.sub(resource_search, resource_replace, content)

    with open(path, 'w') as f:
        f.write(content)

def fix_utils_logging():
    path = 'utils.logging.js'
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()

    # escapeHTML
    if 'escapeHTML' not in content:
        content = content.replace('module.exports = {', "module.exports = {\n  escapeHTML (str) {\n    if (typeof str !== 'string') return str;\n    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\\\"/g, '&quot;').replace(/'/g, '&#039;');\n  },")

    # getSafeStack
    content = content.replace('if ( === undefined ||  === null) return \'\'', "if (stack === undefined || stack === null) return '';")

    # log function
    log_pattern = r"log \(message, level = 'info'\) \{[\s\S]*?Memory\.logs\.push\(logEntry\)"
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
    content = re.sub(log_pattern, log_replacement, content)

    # Redaction fix
    content = content.replace("str.replace(/(\\/|[a-zA-Z]:\\\\)[^ \\n\\t\"']*/g, '[REDACTED]')","str.replace(/(\\/[a-zA-Z0-9_-]+\\/|[a-zA-Z]:\\\\)[^ \\n\\t\"']*/g, '[REDACTED]')")
    if '112, 97, 115, 115' not in content:
        content = content.replace("[98, 101, 97, 114, 101, 114],", "[98, 101, 97, 114, 101, 114],\n    [112, 97, 115, 115],\n    [99, 114, 101, 100, 101, 110, 116, 105, 97, 108],")

    content = re.sub(r"const pattern = new RegExp\([\s\S]*?'gi'\s*\)", "const pattern = new RegExp('([a-zA-Z0-9_-]*(' + k + '))([^a-zA-Z0-9\\\\n\\\\t]*[:= ]+)(?:(\\\"[^\\\" ]*\\\")|(\\\'[^\\\' ]*\\')|([^ \\\\n\\\\t\\\"\\' ]+))', 'gi')", content)

    content = content.replace('if (!Memory.logs) Memory.logs = []', 'if (!Array.isArray(Memory.logs)) Memory.logs = []')
    if "default: '💬'" not in content:
        content = content.replace('const LOG_EMOJIS = {', "const LOG_EMOJIS = {\\n  default: '💬',")

    with open(path, 'w') as f:
        f.write(content)

def fix_deploy():
    path = 'deploy.js'
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()
    content = content.replace("str.replace(/(\\/|[a-zA-Z]:\\\\)[^ \\n\\t\"']*/g, '[REDACTED]')","str.replace(/(\\/[a-zA-Z0-9_-]+\\/|[a-zA-Z]:\\\\)[^ \\n\\t\"']*/g, '[REDACTED]')")
    if '112, 97, 115, 115' not in content:
        content = content.replace("[98, 101, 97, 114, 101, 114],", "[98, 101, 97, 114, 101, 114],\n    [112, 97, 115, 115],\n    [99, 114, 101, 100, 101, 110, 116, 105, 97, 108],")
    content = re.sub(r"const secretPattern = new RegExp\([\s\S]*?'gi'\s*\)", "const secretPattern = new RegExp('([a-zA-Z0-9_-]*(' + keys + '))([^a-zA-Z0-9\\\\n\\\\t]*[:= ]+)(?:(\\\"[^\\\" ]*\\\")|(\\\'[^\\\' ]*\\')|([^ \\\\n\\\\t\\\"\\' ]+))', 'gi')", content)
    with open(path, 'w') as f:
        f.write(content)

def fix_main():
    path = 'main.js'
    with open(path, 'r') as f:
        content = f.read()

    if "module.exports.loop =" not in content:
        content = content.replace("    try {", "module.exports.loop = function () {\n    try {")
        content = content.replace("logger.error('CRITICAL ERROR: ' + e.message + (safeStack ? '\\n' + safeStack : ''));\n    }", "logger.error('CRITICAL ERROR: ' + e.message + (safeStack ? '\\n' + safeStack : ''));\n    }\n};")

    content = re.sub(r"function _displayCoreStats\(creeps\) \{[\s\S]*?\n\}",
        """function _displayCoreStats(creeps) {
    console.log('--- SYSTEM STATUS ---');
    console.log('Mode: ' + adaptiveSystem.getModeName(Memory.adaptive?.currentMode ?? 2).toUpperCase());
    console.log('Creeps: ' + Object.keys(creeps).length);
    console.log('CPU: ' + Game.cpu.getUsed().toFixed(2) + '/' + Game.cpu.limit + ' (Bucket: ' + Game.cpu.bucket + ')');
    console.log('Memory: ' + (RawMemory.get().length / 1024).toFixed(1) + ' KB');
}""", content)

    content = content.replace('\\n    if (!Memory.lastCleanup', '\n    if (!Memory.lastCleanup')

    with open(path, 'w') as f:
        f.write(content)

fix_system_adaptive()
fix_utils_logging()
fix_deploy()
fix_main()
