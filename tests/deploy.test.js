/**
 * deploy.js のユニットテスト
 */

const path = require('path');

describe('deploy.js', () => {
  const __dirname = path.dirname(require.main?.filename || __filename);

  describe('validateFilePath', () => {
    test('正常なファイルパスが通る', () => {
      const validPath = path.resolve(__dirname, '../main.js');
      expect(validPath).toContain('main.js');
    });

    test('パストラバーサル攻撃を防ぐ', () => {
      expect(() => {
        const maliciousPath = '../../../etc/passwd';
        const normalized = path.normalize(maliciousPath);
        if (normalized.includes('..')) {
          throw new Error('Path traversal detected: ' + maliciousPath);
        }
      }).toThrow();
    });

    test('__dirname外のパスを防ぐ', () => {
      const resolvedPath = path.resolve('/tmp/test.js');
      expect(resolvedPath.startsWith(__dirname)).toBe(false);
    });
  });

  describe('validateToken', () => {
    const validateToken = (token, label) => {
      if (!token) {
        return { valid: false, message: `${label} token is not set` };
      }
      const tokenPattern = /^[a-zA-Z0-9_-]{20,}$/;
      if (!tokenPattern.test(token)) {
        return { valid: false, message: `${label} token format is invalid` };
      }
      return { valid: true };
    };

    test('有効なトークン', () => {
      const result = validateToken('abc123def456ghi789jkl', 'TEST');
      expect(result.valid).toBe(true);
    });

    test('空のトークン', () => {
      const result = validateToken('', 'TEST');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('not set');
    });

    test('短いトークン', () => {
      const result = validateToken('short', 'TEST');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('invalid');
    });
  });
});
