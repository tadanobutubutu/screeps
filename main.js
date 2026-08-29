text
<file>
{
  "type": "folder",
  "name": "repo",
  "contents": [
    {
      "type": "file",
      "name": "main.js",
      "path": "/main.js",
      "content": "// Original file with conflicts\n// TODO: Add any other missing exports that might have been?\n// Added missing exports as per the issue\n\nexport function add(a, b) {\n  return a + b;\n}\n\nexport function subtract(a, b) {\n  return a - b;\n}\n\n<<<<<<< HEAD\nexport function multiply(a, b) {\n  return a * b;\n}\n=======\nexport function divide(a, b) {\n  if (b === 0) {\n    throw new Error('Cannot divide by zero');\n  }\n  return a / b;\n}\n>>>>>>> feature/multiply-div\n"
    },
    {
      "type": "folder",
      "name": "tests",
      "path": "/tests",
      "contents": [
        {
          "type": "file",
          "name": "main.test.js",
          "path": "/tests/main.test.js",
          "content": "import { add, subtract } from '../main';\n\nddescribe('add', () => {\n  test('adds 1 + 2 to equal 3', () => {\n    expect(add(1, 2)).toBe(3);\n  });\n});\n\nddescribe('subtract', () => {\n  test('subtracts 4 - 2 to equal 2', () => {\n    expect(subtract(4, 2)).toBe(2);\n  });\n});\n\n// Additional test cases for multiply and divide:\n// The existing test suite doesn't yet import them, so they will fail unless added.\n"
        }
      ]
    }
  ]
}