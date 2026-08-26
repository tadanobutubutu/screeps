// TODO: This is the existing code that needs to be preserved

import dependencyGraphContent from './dependencyGraphContent'
import { addLandmarkRoles, addSvgAccessibleNames, ensureUniqueLandmarks, fixFakeLinkIssues, addThScope, getHeadingLevels } from './indexContent'
import someDependency from './someDependency'

function renderDependencyGraph(data) {
    const graphContainer = document.getElementById('graph-container')
    if (!graphContainer) return

    graphContainer.innerHTML = ''
    someDependency.render(data, graphContainer)
}

function addLangAttr(html) {
    return html.replace(/<html([^>]*)>/gi, '<html lang="en"$1>')
}

function addLandmarks(rootElement) {
    const landmarks = {
        banner: rootElement.querySelector('header'),
        navigation: rootElement.querySelector('nav'),
        main: rootElement.querySelector('main'),
        footer: rootElement.querySelector('footer')
    }

    Object.keys(landmarks).forEach((key) => {
        if (landmarks[key]) {
            landmarks[key].setAttribute('role', key)
        }
    })
}

function addAccessibleSvgNames() {
    const svgs = document.querySelectorAll('svg')
    svgs.forEach((svg) => {
        if (!svg.id) return
        const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc')
        desc.id = 'desc_' + svg.id
        svg.setAttribute('role', 'img')
        svg.insertBefore(desc, svg.firstChild)
    })

    svgs.forEach((svg) => {
        if (!svg.id) return
        const id = 'desc_' + svg.id
        const description = document.createTextNode('Accessible description for ' + svg.id)
        const descElement = svg.querySelector('#' + id)
        if (descElement) {
            descElement.appendChild(description)
        }
    })
}

function addIdsToLandmarks(landmarks) {
    Object.keys(landmarks).forEach((key) => {
        if (landmarks[key]) {
            landmarks[key].id = key
        }
    })
}

function fixTableStructure() {
    // Implement the function as needed
}

function fixFakeLinkIssue() {
    // Implement the stub
}

function addressIssuesFromInsightReport() {
    let content = dependencyGraphContent
    
    const container = document.createElement('div')
    container.innerHTML = content

    addLandmarkRoles(container)
    addSvgAccessibleNames(container)
    ensureUniqueLandmarks(container)
    fixFakeLinkIssues(container)
    addThScope(container)

    const htmlElement = document.createElement('html')
    htmlElement.setAttribute('lang', 'en')
    htmlElement.innerHTML = container.innerHTML

    return {
        content: htmlElement.outerHTML,
        headingLevels: getHeadingLevels(container),
        uniqueLandmarkCount: container.querySelectorAll('[role][role~="landmark"], [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"]').length
    }
}

function fixDuplicateLandmarkRoles(container) {
    const landmarks = container.querySelectorAll('[role][role~="landmark"], [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"]')
    const uniqueLandmarkRoles = [...new Set(Array.from(landmarks).map(landmark => landmark.getAttribute('role')))]
    
    landmarks.forEach((landmark, index) => {
        if (index >= uniqueLandmarkRoles.length) {
            landmark.removeAttribute('role')
        } else {
            landmark.setAttribute('role', uniqueLandmarkRoles[index])
        }
    })
}

function addressAccessibilityIssues() {
    return addressIssuesFromInsightReport()
}

export { 
    getHeadingLevels, 
    fixDuplicateLandmarkRoles, 
    addSvgAccessibleNames, 
    ensureUniqueLandmarks, 
    fixFakeLinkIssues, 
    addThScope, 
    addressIssuesFromInsightReport,
    renderDependencyGraph,
    addLangAttr,
    addLandmarks,
    addAccessibleSvgNames,
    addIdsToLandmarks,
    fixTableStructure,
    fixFakeLinkIssue,
    addressAccessibilityIssues
}