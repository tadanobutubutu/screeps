// deploy.js - Screeps PTR deployment script
const https = require('https');
const fs = require('fs');
const path = require('path');

const token = process.env.SCREEPS_TOKEN;
if (!token) {
  console.error('SCREEPS_TOKEN is not set');
  process.exit(1);
}

// Read all JS files
const modules = {};
const files = [
  { name: 'main', file: 'main.js' },
  { name: 'role.harvester', file: 'role.harvester.js' },
  { name: 'role.upgrader', file: 'role.upgrader.js' },
  { name: 'role.builder', file: 'role.builder.js' },
  { name: 'role.repairer', file: 'role.repairer.js' }
];

for (const m of files) {
  modules[m.name] = fs.readFileSync(path.join(__dirname, m.file), 'utf8');
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
    'X-Token': token
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    if (res.statusCode !== 200) {
      console.error('Deployment failed!');
      process.exit(1);
    } else {
      console.log('Deployed successfully to Screeps PTR!');
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
  process.exit(1);
});

req.write(body);
req.end();
