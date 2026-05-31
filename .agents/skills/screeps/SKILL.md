```markdown
# screeps Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches best practices and conventions for contributing to the `screeps` JavaScript codebase. You'll learn how to structure files, write imports and exports, follow commit message patterns, and implement and run tests using Jest. This guide is designed to help you onboard quickly and maintain consistency across the project.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names.
  - Example: `energyManager.js`, `spawnLogic.js`

### Imports
- Use **relative imports** for all modules.
  - Example:
    ```javascript
    import { calculateEnergy } from './energyManager';
    ```

### Exports
- Use **named exports**.
  - Example:
    ```javascript
    // energyManager.js
    export function calculateEnergy(room) { /* ... */ }
    ```

### Commit Messages
- Freeform style, no strict prefixes required.
- Average commit message length: ~65 characters.
  - Example:  
    ```
    Fix bug in creep pathfinding when room is under attack
    ```

## Workflows

### Running Tests
**Trigger:** When you want to verify your code changes.
**Command:** `/run-tests`

1. Ensure you have installed all dependencies (`npm install`).
2. Run tests using Jest:
    ```bash
    npm test
    ```
3. Review the output to confirm all tests pass.

### Adding a New Module
**Trigger:** When implementing new functionality.
**Command:** `/add-module`

1. Create a new file using camelCase (e.g., `resourceAllocator.js`).
2. Write your module using named exports.
    ```javascript
    // resourceAllocator.js
    export function allocateResources(room) { /* ... */ }
    ```
3. Import your module where needed using a relative path.
    ```javascript
    import { allocateResources } from './resourceAllocator';
    ```
4. Add corresponding tests in a `.test.js` file.

### Writing Tests
**Trigger:** When adding or updating code.
**Command:** `/write-test`

1. Create a test file with the `.test.js` suffix (e.g., `energyManager.test.js`).
2. Use Jest's testing API:
    ```javascript
    import { calculateEnergy } from './energyManager';

    test('calculates energy correctly', () => {
      expect(calculateEnergy(mockRoom)).toBe(500);
    });
    ```
3. Run tests to verify correctness.

## Testing Patterns

- Tests are written using **Jest**.
- Test files are named with the `.test.js` suffix and are placed alongside the modules they test.
- Example test:
    ```javascript
    import { calculateEnergy } from './energyManager';

    test('calculates energy correctly', () => {
      expect(calculateEnergy(mockRoom)).toBe(500);
    });
    ```

## Commands
| Command        | Purpose                                      |
|----------------|----------------------------------------------|
| /run-tests     | Run all Jest tests in the codebase           |
| /add-module    | Steps to add a new module with conventions   |
| /write-test    | Steps to write and run a new test            |
```