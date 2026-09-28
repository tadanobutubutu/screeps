describe('Gemini API key query parameter security check', () => {
  test('scripts/ai_repo_intel.py does not pass API key in URL query params and includes x-goog-api-key header', () => {
    const fs = require('fs');
    const path = require('path');
    const fileContent = fs.readFileSync(path.join(__dirname, '../scripts/ai_repo_intel.py'), 'utf8');
    expect(fileContent).not.toContain('params={"key": key}');
    expect(fileContent).toContain('"x-goog-api-key": key.strip()');
  });

  test('scripts/ai_update_readme.py does not pass API key in URL query params', () => {
    const fs = require('fs');
    const path = require('path');
    const fileContent = fs.readFileSync(path.join(__dirname, '../scripts/ai_update_readme.py'), 'utf8');
    expect(fileContent).not.toContain('params={"key": key}');
    expect(fileContent).toContain('"x-goog-api-key": key.strip()');
  });
});
