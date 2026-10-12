const fs = require('fs');
const path = require('path');

describe('Security - main.js spawnProcess shell parameter', () => {
  test('spawnProcess default options should set shell to false to prevent command injection', () => {
    const mainContent = fs.readFileSync(path.join(__dirname, '../main.js'), 'utf8');
    expect(mainContent).toContain('shell: false');
    expect(mainContent).not.toMatch(/shell:\s*true/);
  });
});
