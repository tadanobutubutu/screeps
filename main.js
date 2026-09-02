const {
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  renderGraphIndex,
  trapFocus,
  renderAdditionalContent,
  checkAccessibilityForReport,
  checkAccessibility,
  anotherNewFunction,
  newFunction
} = require('./AccessibilityHelpers')

function getAriaLabelForSVG(svgElement) {
  let title = svgElement.querySelector('title');
  let desc = svgElement.querySelector('desc');

  if (title) {
    if (title.textContent.trim() || desc) {
      return title.textContent.trim() || desc.textContent.trim();
    }

    const ariaLabel = svgElement.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel.trim();
    }

    const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
      const labeledElement = document.getElementById(ariaLabelledby);
      if (labeledElement && labeledElement.textContent) {
        return labeledElement.textContent.trim();
      }
    }
  }

  return "SVG graphic";
}

function fixSVGAccessibleNames() {
  const svgElements = document.querySelectorAll("svg");
  svgElements.forEach((svg) => {
    const accessibleName = getAriaLabelForSVG(svg);

    if (svg.hasAttribute("aria-label")) {
      if (accessibleName !== svg.getAttribute("aria-label")) {
        svg.setAttribute("aria-label", accessibleName);
      }
    } else if (!svg.hasAttribute("aria-label") && svg.hasAttribute("aria-labelledby")) {
      const labelledBy = svg.getAttribute("aria-labelledby");
      const labeledElement = document.getElementById(labelledBy);
      if (labeledElement && labeledElement.textContent === accessibleName) {
        // No changes needed
      } else {
        svg.setAttribute("aria-label", accessibleName);
      }
    }
  });
}

function addAriaLabelToReactDeploymentSvgs() {
  const svgs = document.querySelectorAll(".ReactDeploymentSvg");
  svgs.forEach((svg) => {
    const idAttribute = svg.getAttribute("aria-labelledby");
    if (!idAttribute) {
      // Generate a unique id to use in aria-labelledby
      const id = `deployment-svg-${Math.floor(Math.random() * 10000)}`;
      svg.setAttribute("aria-labelledby", id);
      const labelFor = document.createElement("label");
      labelFor.setAttribute("htmlFor", svg.getAttribute("id"));
      labelFor.textContent = svg.getAttribute("aria-label");
      document.body.appendChild(labelFor);
      svg.setAttribute("id", id);
    }
  });
}

function fixReactSvgElementAccessibility() {
  const reactComponentsWithSvgs = document.querySelectorAll("[role='img']");
  reactComponentsWithSvgs.forEach((reactComponent) => {
    const svgs = reactComponent.querySelectorAll("svg");
    if (svgs.length === 1) {
      reactComponent.setAttribute("aria-label", svgs[0].getAttribute("aria-label"));
    } else {
      // Only add aria-label if there's only one svg inside the react component
      reactComponent.setAttribute("aria-label", "Group of related graphics");
    }
  });
}

function enforceDependencyGraphRole() {
  const dependencyGraphContainers = document.querySelectorAll("[data-dependency-graph]");
  dependencyGraphContainers.forEach((container) => {
    if (container.hasAttribute("role")) {
      if (container.getAttribute("role") !== "graph") {
        console.warn(`Warning: Dependency graph container already has a role attribute with value [${container.getAttribute("role")}]. Keeping current value and ignoring role update.`);
        return;
      }
    }
    container.setAttribute("role", "graph");
    container.setAttribute("aria-label", "Dependency graph visualization");
  });
}

function ensureAllLandmarksHaveUniqueIds() {
  const landmarkElements = ["main", "nav", "header", "footer", "aside"];
  landmarkElements.forEach((element) => {
    const elementsGroupedByID = Array.from(document.querySelectorAll(`[role="${element}"]`)).reduce((groupedByID, currentElement) => {
      const currentID = currentElement.id || "";
      if (!groupedByID[currentID]) {
        groupedByID[currentID] = [];
      }
      groupedByID[currentID].push(currentElement);
      return groupedByID;
    }, {});

    const landmarksWithDuplicateIds = Object.entries(elementsGroupedByID).filter(([_, elements]) => elements.length > 1);

    landmarksWithDuplicateIds.forEach(([elementId, elements]) => {
      elements.forEach((element) => {
        let increment = 1;

        do {
          element.id = `${elementId}-${increment}`;
          increment++;
        } while (document.getElementById(element.id));
      });
    });
  });
}

module.exports = {
  getAriaLabelForSVG,
  fixSVGAccessibleNames,
  addAriaLabelToReactDeploymentSvgs,
  fixReactSvgElementAccessibility,
  enforceDependencyGraphRole,
  ensureAllLandmarksHaveUniqueIds,
  addressAccessibilityIssues,
  anotherNewFunction,
  newFunction
};