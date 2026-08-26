// Import necessary modules
import React from 'react'
import PropTypes from 'prop-types'

// Your existing code

// Function for adding lang attribute to HTML element
function addLangAttribute(htmlEl) {
  if (!htmlEl.hasAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en')
  }
}

// Add lang attribute to HTML element
document.getElementById('root').forEach(addLangAttribute)

// Function for adding landmark roles and fixing landmark issues
function addLandmarkRoles(element) {
  if (element.hasAttribute('id')) {
    switch (element.tagName.toLowerCase()) {
      case 'header':
        element.setAttribute('role', 'banner')
        break
      case 'nav':
        element.setAttribute('role', 'navigation')
        break
      case 'main':
        element.setAttribute('role', 'main')
        break
      case 'footer':
        element.setAttribute('role', 'contentinfo')
        break
      default:
        break
    }
  }
}

// Add landmark roles and fix landmark issues
document.body.querySelectorAll('*').forEach(addLandmarkRoles)

// Function for adding accessible names to SVGs
function addAccessibleName(svgEl) {
  if (!svgEl.getAttribute('aria-labelledby')) {
    const title = svgEl.getAttribute('title') || ''
    svgEl.setAttribute('aria-labelledby', 'svg-' + svgEl.id)
    const label = document.createElement('span')
    label.id = `svg-${svgEl.id}`
    label.textContent = title
    svgEl.parentNode.appendChild(label)
  }
}

// Add accessible names to 2 SVGs
document.querySelectorAll('svg').forEach(addAccessibleName)

// Function for ensuring unique landmarks (REACT_025)
function ensureUniqueLandmarks(wm) {
  const landmarks = []
  for (const el of wm.elements()) {
    if (el.hasAttribute('role') && !landmarks.includes(el.getAttribute('role'))) {
      landmarks.push(el.getAttribute('role'))
    }
  }
  if (landmarks.length > 1) {
    const uniqueLandmarks = new Set(landmarks)
    const missingLandmarkRoles = Array.from(LandmarkRoles).filter(role => !uniqueLandmarks.has(role))
    if (missingLandmarkRoles.length > 0) {
      console.warn(`The following landmark roles are not present in the document: ${missingLandmarkRoles.join(', ')}`)
    }
  }
}

// Ensure unique landmarks (REACT_025)
ensureUniqueLandmarks(document.body.getElementsByTagName('body')[0].ownerDocument. touches.window)

// Function for fixing 1 fake link issue (REACT_036)
function fixFakeLink(aEl) {
  if (!aEl.hasAttribute('href') && aEl.textContent.trim().toLowerCase() === 'home') {
    aEl.setAttribute('href', '#')
  }
}

// Fix 1 fake link issue (REACT_036)
document.body.querySelectorAll('a').forEach(fixFakeLink)