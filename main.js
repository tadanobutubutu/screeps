import dependencyGraphContent from './dependencyGraphContent'
import { addLandmarkRoles, addSvgAccessibleNames, ensureUniqueLandmarks, fixFakeLinkIssues, addThScope, getHeadingLevels } from './indexContent'

function addressIssuesFromInsightReport() {
    let content = dependencyGraphContent + indexContent
    
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

export { getHeadingLevels, fixDuplicateLandmarkRoles, addSvgAccessibleNames, ensureUniqueLandmarks, fixFakeLinkIssues, addThScope, addressIssuesFromInsightReport }