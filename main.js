const jestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

function updateReactComponents() {
  console.log('Updating components for React 19 compatibility');
}

const eslintConfig = {
  extends: ['eslint:recommended', 'plugin:react/recommended'],
};

const fs = require('fs');

function updateHTMLFile(filePath, content) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    const updatedData = data.replace(/<html>/g, '<html lang="en">');

    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing the file:', err);
        return;
      }
      console.log('The file has been updated successfully.');
    });
  });
}

const htmlFilePath = './docs/dependency-graph.html';
if (fs.existsSync(htmlFilePath)) {
  updateHTMLFile(htmlFilePath, '');
}

module.exports = {
  jestConfig,
  updateReactComponents,
  eslintConfig,
  updateHTMLFile
};