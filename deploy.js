// deploy.js - Screeps PTR & 本番両方にデプロイ
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ptrToken = process.env.SCREEPS_TOKEN;
const prodToken = process.env.SCREEPS_PROD_TOKEN;

if (!ptrToken && !prodToken) {
  console.error("Error: SCREEPS_TOKEN or SCREEPS_PROD_TOKEN is not set");
  process.exit(1);
}

// Read all JS files
const modules = {};
const files = [
  { name: "main", file: "main.js" },
  { name: "role.harvester", file: "role.harvester.js" },
  { name: "role.upgrader", file: "role.upgrader.js" },
  { name: "role.builder", file: "role.builder.js" },
  { name: "role.repairer", file: "role.repairer.js" },
];

console.log("Reading module files...");
for (const m of files) {
  const filePath = path.join(__dirname, m.file);
  try {
    modules[m.name] = fs.readFileSync(filePath, "utf8");
    console.log(`  [OK] ${m.name} (${m.file})`);
  } catch (e) {
    console.error(`  [ERROR] Failed to read ${m.file}: ${e.message}`);
    process.exit(1);
  }
}

const body = JSON.stringify({ branch: "default", modules });

function deployTo(label, apiPath, token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      console.log(`[${label}] Token not set, skipping.`);
      return resolve();
    }
    const options = {
      hostname: "screeps.com",
      port: 443,
      path: apiPath,
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(body),
        "X-Token": token,
      },
    };
    console.log(`[${label}] Deploying...`);
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        console.log(`[${label}] Status: ${res.statusCode}`);
        try {
          const json = JSON.parse(data);
          if (json.ok === 1) {
            console.log(`[${label}] Deployed successfully!`);
            resolve();
          } else {
            console.error(
              `[${label}] Deployment failed:`,
              JSON.stringify(json)
            );
            reject(new Error(`${label} deployment failed`));
          }
        } catch (e) {
          if (res.statusCode === 200) {
            console.log(`[${label}] Deployed successfully!`);
            resolve();
          } else {
            console.error(`[${label}] Deployment failed! Raw:`, data);
            reject(new Error(`${label} deployment failed`));
          }
        }
      });
    });
    req.on("error", (e) => reject(e));
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
    req.write(body);
    req.end();
  });
}

(async () => {
  await deployTo("PTR", "/ptr/api/user/code", ptrToken);
  await deployTo("PROD", "/api/user/code", prodToken);
  console.log("All done!");
})();
