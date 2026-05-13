const fs = require('fs')

function replaceFile (file, oldStr, newStr) {
  let content = fs.readFileSync(file, 'utf8')
  content = content.replace(oldStr, newStr)
  fs.writeFileSync(file, content)
}

// apply logic changes, but retain EXACT indentation structure.
replaceFile(
  'utils.planning.js',
  'module.exports = {',
  "const cache = require('./src/utils/cache');\n\nmodule.exports = {"
)
replaceFile(
  'utils.planning.js',
  'const sources = room.find(FIND_SOURCES);',
  'const sources = cache.getSources(room);'
)
replaceFile(
  'utils.planning.js',
  'const sources = room.find(FIND_SOURCES);',
  'const sources = cache.getSources(room);'
)

let testContent = fs.readFileSync('tests/utils.planning.test.js', 'utf8')
testContent = testContent.replace(
  "const utilsPlanning = require('../utils.planning');",
  "jest.mock('../src/utils/cache', () => ({\n    getSources: jest.fn()\n}));\nconst cache = require('../src/utils/cache');\n\nconst utilsPlanning = require('../utils.planning');"
)
testContent = testContent.replace(
  '  beforeEach(() => {\n    global.Memory = {};',
  '  beforeEach(() => {\n    cache.getSources.mockReset();\n    global.Memory = {};'
)
testContent = testContent.replace(
  "  test('findBestSpawnPositionがsourcesがないときnullを返す', () => {\n    mockRoom.find.mockReturnValue([]);",
  "  test('findBestSpawnPositionがsourcesがないときnullを返す', () => {\n    cache.getSources.mockReturnValue([]);\n    mockRoom.find.mockReturnValue([]);"
)
testContent = testContent.replace(
  "  test('displayPlanningInfoがエラーを投げない', () => {\n    mockRoom.find.mockReturnValue([{ id: 'source1' }]);",
  "  test('displayPlanningInfoがエラーを投げない', () => {\n    cache.getSources.mockReturnValue([{ id: 'source1' }]);\n    mockRoom.find.mockReturnValue([{ id: 'source1' }]);"
)
fs.writeFileSync('tests/utils.planning.test.js', testContent)
