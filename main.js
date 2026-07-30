// Fix for src/managers/roomManager.js line 83
// The parsing error "The keyword 'let' is reserved" usually occurs when 
// the parser isn't configured to support ES6 syntax

// Since I don't have access to the actual file content, here's the general approach:

// Option 1: If you can modify the ESLint configuration
// Update .eslintrc or package.json to include:
// {
//   "parserOptions": {
//     "ecmaVersion": 2015,
//     "sourceType": "module"
//   }
// }

// Option 2: If you need to modify the code itself
// Replace 'let' with 'var' on line 83:
// let → var

// However, since I need to see the actual content to make precise changes,
// please provide the content of src/managers/roomManager.js, particularly around line 83.