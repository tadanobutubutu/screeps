// deploy.js - Screeps PTR deployment script
const https = require('https');
const fs = require('fs');
const path = require('path');

const token = process.env.SCREEPS_TOKEN;
if (!token) {
  console.error('Error: SCREEPS_TOKEN is not set');
  process.exit(1);
}

// Read all JS files
const modules = {};
const files = [
  { name: 'main',           file: 'main.js' },
  { name: 'role.harvester', file: 'role.harvester.js' },
  { name: 'role.upgrader',  file: 'role.upgrader.js' },
  { name: 'role.builder',   file: 'role.builder.js' },
  { name: 'role.repairer',  file: 'role.repairer.js' },
];

console.log('Reading module files...');
for (const m of files) {
  const filePath = path.join(__dirname, m.file);
  try {
    modules[m.name] = fs.readFileSync(filePath, 'utf8');
    console.log(`  [OK] ${m.name} (${m.file})`);
  } catch (e) {
    console.error(`  [ERROR] Failed to read ${m.file}: ${e.message}`);
    process.exit(1);
  }
}

const body = JSON.stringify({ branch: 'default', modules });

const options = {
  hostname: 'screeps.com',
  port: 443,
  path: '/ptr/api/user/code',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'X-Token': token,
  },
};

console.log('Deploying to Screeps PTR...');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    try {
      const json = JSON.parse(data);
      if (json.ok === 1) {
        console.log('Deployed successfully to Screeps PTR!');
      } else {
        console.error('Deployment failed:', JSON.stringify(json));
        process.exit(1);
      }
    } catch (e) {
      console.log('Raw response:', data);
      if (res.statusCode !== 200) {
        console.error('Deployment failed!');
        process.exit(1);
      } else {
        console.log('Deployed successfully to Screeps PTR!');
      }
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
  process.exit(1);
});

req.setTimeout(30000, () => {
  console.error('Request timed out after 30s');
  req.destroy();
  process.exit(1);
});

req.write(body);
req.end();
