const globals = require('globals')
const pluginJest = require('eslint-plugin-jest')

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2020,
        ...pluginJest.environments.globals.globals,
        Game: 'readonly',
        Memory: 'readonly',
        PathFinder: 'readonly',
        RawMemory: 'readonly',
        RoomPosition: 'readonly',
        FIND_MY_SPAWNS: 'readonly',
        FIND_SOURCES: 'readonly',
        FIND_SOURCES_ACTIVE: 'readonly',
        FIND_MY_CREEPS: 'readonly',
        FIND_CONSTRUCTION_SITES: 'readonly',
        FIND_STRUCTURES: 'readonly',
        FIND_HOSTILE_CREEPS: 'readonly',
        STRUCTURE_EXTENSION: 'readonly',
        STRUCTURE_TOWER: 'readonly',
        STRUCTURE_CONTROLLER: 'readonly',
        STRUCTURE_SPAWN: 'readonly',
        STRUCTURE_WALL: 'readonly',
        STRUCTURE_LAB: 'readonly',
        STRUCTURE_CONTAINER: 'readonly',
        STRUCTURE_ROAD: 'readonly',
        RESOURCE_ENERGY: 'readonly',
        WORK: 'readonly',
        CARRY: 'readonly',
        MOVE: 'readonly',
        HEAL: 'readonly',
        ATTACK: 'readonly',
        RANGED_ATTACK: 'readonly',
        OK: 'readonly',
        ERR_NOT_ENOUGH_ENERGY: 'readonly',
        ERR_NOT_IN_RANGE: 'readonly',
        ERR_BUSY: 'readonly',
        ERR_FULL: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'brace-style': ['error', '1tbs'],
      'no-undef': 'error'
    }
  }
]
