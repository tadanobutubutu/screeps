// main.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const axeCore = require('axe-core');

// Safety Categories and User Safety Functions
const books = [];
const safetyCategory = "User Safety: safe";

let userSafety = 'safe';

function getUserSafetyAdvice() {
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

function computeSafetyScore(safetyCategories) {
  const safetyCategory = safetyCategories.reduce((score, category) => {
    switch (category) {
      case 'Unauthorized Advice':
        return score + 1;
      case 'Dangerous Action':
        return score + 2;
      case 'Potential Scam':
        return score + 3;
      case 'Privacy Risk':
        return score + 4;
      default:
        return score;
    }
  }, 0);
  return safetyCategory;
}

// Upgrade logic: use harvested data to improve the system
function upgradeSystem(harvestedData) {
  if (harvestedData) {
    if (harvestedData.maxResults) {
      config.maxResults = harvestedData.maxResults;
    }
    if (harvestedData.debug !== undefined) {
      config.debug = harvestedData.debug;
    }
  }
  return true;
}

function loadHarvestedData() {
  const filePath = path.join(__dirname, 'harvested_data.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error loading harvested data: ${error.message}`);
    return null;
  }
}

const app = express();
const appData = { userSafety };
const appState = { books };

// AddBook function from HEAD version, includes books array
function addBook(title, author) {
  const bookObject = { title, author };
  books.push(bookObject);
}

// App entry point function experience and mainObj

const server = app.listen(config.port, () => {
  logger.info(`App listening at http://localhost:${config.port}`);
});
const io = require('socket.io')(server);
const mitt = require('mitt');
const emit = mitt();
const logger = require('./utils/logger');
const { processLineByLine } = require('ml-read-stream');
const {
  addLangAttribute,
  ensureLangAttribute,
  fixTableStructure,
  fixLandmarks,
} = require('./accessibility');

const mainObj = {
  experience: (req, res) => {
    // handle requests
  },
  emit,
  io,
  addBook,
  getUserSafetyAdvice,
  computeSafetyScore,
  upgradeSystem,
  loadHarvestedData,
  addLangAttribute,
  ensureLangAttribute,
  fixTableStructure,
  fixLandmarks,
};

module.exports = mainObj;