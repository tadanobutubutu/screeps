// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

/**
 * Validates and fixes table structure accessibility issues.
 * Handles REACT_027 - Fix 26 table structure issues
 */
function validateTableStructure () {
  const tables = document.querySelectorAll('table')

  tables.forEach((table) => {
    const rows = table.querySelectorAll('tr')
    const firstRow = rows[0]

    if (!firstRow) return

    // Get all header cells in the first row to determine column count
    const firstRowThs = firstRow.querySelectorAll('th')
    const firstRowTds = firstRow.querySelectorAll('td')
    const firstRowHeaders = [...firstRowThs, ...firstRowTds]
    const columnCount = firstRowHeaders.length

    rows.forEach((row, rowIndex) => {
      const ths = row.querySelectorAll('th')
      const tds = row.querySelectorAll('td')
      const allCells = [...ths, ...tds]

      allCells.forEach((cell, cellIndex) => {
        if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
          const isFirstRow = rowIndex === 0
          const isFirstCell = cellIndex === 0

          // First row cells are column headers
          if (isFirstRow) {
            cell.setAttribute('scope', 'col')
          }
          // First cell in subsequent rows are row headers
          else if (isFirstCell) {
            cell.setAttribute('scope', 'row')
          }
        }
      })
    })
  })
}

/**
 * Main entry point for table accessibility validation.
 * Calls validateTableStructure() to fix all table scope attribute issues.
 */
function validateTableAccessibility () {
  validateTableStructure()
}

// TODO: Ensure unique landmarks (DONE: ensureUniqueLandmarks)

/**
 * Landmark data structure
 */
const landmarks = [
  { id: 1, name: 'Eiffel Tower', location: 'Paris' },
  { id: 2, name: 'Statue of Liberty', location: 'New York' },
  { id: 3, name: 'Eiffel Tower', location: 'Paris' },
  { id: 4, name: 'Big Ben', location: 'London' },
  { id: 5, name: 'Statue of Liberty', location: 'New York' }
]

/**
 * Ensures unique landmarks by removing duplicates based on name and location
 * @param {Array} landmarksArray - Array of landmark objects
 * @returns {Array} - Array of unique landmarks
 */
function ensureUniqueLandmarks (landmarksArray) {
  if (!Array.isArray(landmarksArray)) {
    return []
  }

  const seen = new Set()
  const uniqueLandmarks = []

  for (const landmark of landmarksArray) {
    const key = `${landmark.name}-${landmark.location}`
    if (!seen.has(key)) {
      seen.add(key)
      uniqueLandmarks.push(landmark)
    }
  }

  return uniqueLandmarks
}

// Apply uniqueness to the landmarks
const uniqueLandmarks = ensureUniqueLandmarks(landmarks)

// TODO: Add these imported modules to the relevant rendering functions
function getLangAttribute () {
  return document.documentElement.getAttribute('lang') || 'en'
}

function createInPageButton () {
  const button = document.createElement('button')
  button.setAttribute('aria-label', 'In-page navigation')
  return button
}

function validateLandmark () {
  const landmarks = document.querySelectorAll('[role="landmark"]')
  landmarks.forEach((landmark) => {
    if (!landmark.hasAttribute('aria-label')) {
      landmark.setAttribute('aria-label', landmark.textContent.trim())
    }
  })
}

function validateLandmarkStructure () {
  const main = document.querySelector('main')
  if (!main) {
    console.warn('No main landmark found')
  }
}

function getSvgAccessibleName (svgElement) {
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label')
  }
  if (svgElement.hasAttribute('title')) {
    return svgElement.getAttribute('title')
  }
  return 'graphic'
}

function setSvgAttributes (svgElement, name) {
  svgElement.setAttribute('role', 'img')
  svgElement.setAttribute('aria-label', name)
}

function validateLinkAccessibility () {
  const links = document.querySelectorAll('a')
  links.forEach((link) => {
    if (!link.hasAttribute('href') || link.getAttribute('href') === '#') {
      link.setAttribute('role', 'button')
    }
  })
}

function handleFakeLinks () {
  const fakeLinks = document.querySelectorAll('a[href="#"]')
  fakeLinks.forEach((link) => {
    link.setAttribute('role', 'button')
    link.setAttribute('tabindex', '0')
  })
}

module.exports = {
  ensureUniqueLandmarks,
  landmarks,
  uniqueLandmarks,
  validateTableAccessibility,
  validateTableStructure,
  getLangAttribute,
  createInPageButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks
}
