const fs = require('fs');
const prettier = require('prettier');

async function formatFiles() {
  const prettierConfig = JSON.parse(fs.readFileSync('.prettierrc.json', 'utf8'));

  for (const file of ['role.attacker.js', 'tests/role.attacker.test.js']) {
    const code = fs.readFileSync(file, 'utf8');
    const formatted = await prettier.format(code, {
      ...prettierConfig,
      filepath: file,
    });
    fs.writeFileSync(file, formatted);
    console.log(`Formatted ${file}`);
  }
}

formatFiles();
