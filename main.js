wrapPrimaryContentInMain(element) {
  const main = document.querySelector('main') || document.createElement('main');
  if (main && element) {
    main.appendChild(element);
  }
}

function wrapperFunction(callback, accessibilityInsights) {
  processAccessibilityIssues(callback, accessibilityInsights);
}

function addressAccessibilityIssues(accessibilityInsights) {
  accessibilityInsights.issues.forEach(issue => {
    const element = document.getElementById(issue.id);
    if (element) {
      element.setAttribute('aria-label', issue.solution);
    }
  });
}

function processAccessibilityIssues(callback, accessibilityInsights) {
  accessibilityInsights.landmarks.forEach(landmark => {
    const element = document.getElementById(landmark.id);
    if (element) {
      element.setAttribute('role', landmark.role);
    }
  });
  callback(accessibilityInsights);
}

processAccessibilityIssues(addressAccessibilityIssues, accessibilityInsights);

function wrapPrimaryContentInMain(htmlContent) {
  const mainMatch = htmlContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    return `<main>${mainMatch[1]}</main>`;
  }
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    return `<main>${bodyMatch[1]}</main>`;
  }
  return `<main>${htmlContent}</main>`;
}

module.exports = {
  wrapPrimaryContentInMain,
  addressAccessibilityIssues,
  processAccessibilityIssues,
  wrapperFunction
};