/**
 * deploy.js ロジックのユニットテスト
 */

describe('deploy.js logic', () => {
  describe('validateToken', () => {
    function validateToken(token, label) {
      if (!token) {
        return { valid: false, message: `${label} token is not set` };
      }
      const tokenPattern = /^[a-zA-Z0-9_-]{20,}$/;
      if (!tokenPattern.test(token)) {
        return { valid: false, message: `${label} token format is invalid` };
      }
      return { valid: true };
    }

    test('有効なトークンを許可', () => {
      const result = validateToken('valid_token_1234567890', 'PTR');
      expect(result.valid).toBe(true);
    });

    test('トークンが未設定の場合、無効', () => {
      const result = validateToken(undefined, 'PTR');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('not set');
    });

    test('短いトークンを無効', () => {
      const result = validateToken('short', 'PTR');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('format is invalid');
    });

    test('空文字列を無効', () => {
      const result = validateToken('', 'PTR');
      expect(result.valid).toBe(false);
    });

    test('正常な長さのトークンを許可', () => {
      const result = validateToken('abc12345678901234567890', 'PTR');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateFilePath', () => {
    const path = require('path');
    const testBaseDir = '/workspace/test';

    function validateFilePath(filePath, baseDir = testBaseDir) {
      const normalizedPath = path.normalize(filePath);
      const resolvedPath = path.resolve(baseDir, normalizedPath);

      if (!resolvedPath.startsWith(baseDir)) {
        throw new Error(`Invalid file path: ${filePath}`);
      }

      if (normalizedPath.includes('..')) {
        throw new Error(`Path traversal detected: ${filePath}`);
      }

      return resolvedPath;
    }

    test('正常なファイルパスを受け入れる', () => {
      const result = validateFilePath('main.js', testBaseDir);
      expect(result).toContain('main.js');
    });

    test('path traversal攻撃をブロック', () => {
      expect(() => {
        validateFilePath('../etc/passwd', testBaseDir);
      }).toThrow();
    });

    test('サブディレクトリを許可', () => {
      const result = validateFilePath('subdir/file.js', testBaseDir);
      expect(result).toContain('subdir/file.js');
    });

    test('絶対パスをブロック', () => {
      expect(() => {
        validateFilePath('/etc/passwd', testBaseDir);
      }).toThrow();
    });
  });
});