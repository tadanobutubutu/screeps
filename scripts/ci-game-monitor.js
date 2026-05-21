#!/usr/bin/env node
/**
 * CircleCI Game Monitor Script
 * Screeps API からステータス情報を取得し、GAME_STATUS.md を更新する
 */
const https = require('https');
const fs = require('fs');

const token = process.env.SCREEPS_TOKEN;

const api = (path) => new Promise((ok, fail) => {
  if (!token) { fail(new Error('No API token')); return; }
  const req = https.request({
    hostname: 'screeps.com', port: 443, path, method: 'GET',
    headers: { 'X-Token': token }
  }, res => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => { try { ok(JSON.parse(data)); } catch(e) { fail(e); } });
  });
  req.on('error', fail);
  req.end();
});

(async () => {
  try {
    if (!token) {
      console.log('⚠️  No API token - stats & logs not available');
      const basicStatus = `# 🎮 Game Status (CircleCI Mode)\n\n**Updated**: ${new Date().toISOString()}\n**Mode**: CircleCI Sync ✅\n\n---\n\n⚠️  API token not set.\n`;
      fs.writeFileSync('GAME_STATUS.md', basicStatus);
      process.exit(0);
    }

    const [user, rooms, memory] = await Promise.all([
      api('/api/auth/me'),
      api('/api/user/rooms'),
      api('/api/user/memory')
    ]);

    const timestamp = new Date().toISOString();
    const logs = memory?.data?.logs || [];
    const errors = logs.filter(l => l.level === 'error');

    let status = '# 🎮 Game Status (CircleCI Mode)\n\n';
    status += `**Updated**: ${timestamp}\n`;
    status += `**Mode**: CircleCI + API Stats ✅\n\n---\n\n`;
    status += `## 👤 Player\n\n`;
    status += `- **Username**: ${user.username}\n`;
    status += `- **GCL**: ${Math.floor(user.gcl || 0)}\n`;
    status += `- **CPU**: ${user.cpu}\n`;
    status += `- **Credits**: ${user.money?.toLocaleString() || 0}\n\n`;

    if (rooms.rooms?.length) {
      status += `## 🏰 Rooms (${rooms.rooms.length})\n\n`;
      rooms.rooms.forEach(r => { status += `- **${r.name}**: RCL${r.level || 0}\n`; });
      status += '\n';
    }

    if (errors.length > 0) {
      status += `## ⚠️  Errors (${errors.length})\n\n`;
      errors.slice(-5).forEach(e => { status += `- **[${e.time}]** ${e.message}\n`; });
      status += '\n';
      fs.writeFileSync('DETECTED_ERRORS.json', JSON.stringify(errors, null, 2));
    }

    if (logs.length > 0) {
      let consoleLogs = '# 📝 Console Logs\n\n';
      consoleLogs += `**Updated**: ${timestamp}\n\n---\n\n`;
      const recentLogs = logs.slice(-50).reverse();
      recentLogs.forEach(log => {
        const emoji = { 'error': '❌', 'warn': '⚠️', 'info': 'ℹ️', 'debug': '🔍' }[log.level] || '💬';
        consoleLogs += `${emoji} **[Tick ${log.time}]** ${log.message}\n\n`;
      });
      consoleLogs += `---\n\n**Total Logs**: ${logs.length}\n`;
      consoleLogs += `**Errors**: ${logs.filter(l => l.level === 'error').length}\n\n`;
      consoleLogs += '*Showing last 50 logs*\n';
      fs.writeFileSync('CONSOLE_LOGS.md', consoleLogs);
    }

    status += '---\n\n*Updated by CircleCI scheduled pipeline*\n';
    fs.writeFileSync('GAME_STATUS.md', status);
    console.log('✅ Status updated');
    if (errors.length > 0) console.log(`⚠️  ${errors.length} errors detected`);
  } catch(e) {
    console.error('❌ Error:', e.message);
    fs.writeFileSync('GAME_STATUS.md', `# 🎮 Game Status\n\n❌ Error: ${e.message}\n`);
  }
})();
