// base commit b12b43f49f1dfd01b4f81621bf85b71b0669d668
module.exports = {
  html: {
    lang: "en",
  },
  tables: [
    {
      id: "table-1",
      header: ["Name", "Age", "City"],
      rows: [
        ["John", 28, "New York"],
        ["Jane", 34, "Los Angeles"],
        ["Bob", 45, "Chicago"],
      ],
    },
    {
      id: "table-2",
      header: ["Product", "Price"],
      rows: [
        ["Apple", "$1"],
        ["Banana", "$0.5"],
      ],
    },
  ],
  landmarks: [
    {
      id: "main-content",
      label: "Main content",
      region: "main",
    },
    {
      id: "navigation",
      label: "Navigation",
      region: "navigation",
    },
  ],
  svgElements: [
    {
      id: "icon-1",
      viewBox: "0 0 24 24",
      path: "M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z",
      title: "Info icon",
      ariaLabel: "Information",
    },
    {
      id: "icon-2",
      viewBox: "0 0 24 24",
      path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7.5z",
      title: "Warning icon",
      ariaLabel: "Warning",
    },
  ],
  fakeLinks: [
    {
      id: "fake-link-1",
      href: "#",
      text: "Learn more",
      role: "button",
      ariaPressed: false,
    },
    {
      id: "fake-link-2",
      href: "#",
      text: "Download",
      role: "button",
      ariaPressed: true,
    },
  ],
};

// Additional helper functions for accessibility enhancements
function addLangAttribute() {
  const htmlElement = document.documentElement;
  htmlElement.setAttribute("lang", "en");
  console.log("Lang attribute added");
}

function fixTableStructureIssues() {
  const tables = document.querySelectorAll("table");
  tables.forEach((table) => {
    const caption = table.querySelector("caption");
    if (!caption) {
      const newCaption = document.createElement("caption");
      newCaption.textContent = "Table caption";
      table.insertBefore(newCaption, table.firstChild);
    }
    const headers = table.querySelectorAll("th");
    if (headers.length === 0) {
      const firstRow = table.querySelector("tr");
      if (firstRow) {
        const th = document.createElement("th");
        th.textContent = "Header";
        firstRow.insertBefore(th, firstRow.firstChild);
      }
    }
    const rows = table.querySelectorAll("tr");
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll("td, th");
      cells.forEach((cell, cellIndex) => {
        cell.setAttribute("aria-describedby", `cell-${rowIndex}-${cellIndex}`);
      });
    });
  });
  console.log("Table structure issues fixed");
}

function addMainLandmark() {
  const existingMain = document.querySelector("main");
  if (!existingMain) {
    const mainElement = document.createElement("main");
    mainElement.setAttribute("role", "main");
    mainElement.setAttribute("aria-label", "Main content");
    document.body.insertBefore(mainElement, document.body.firstChild);
    console.log("Main landmark added");
  }
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll("svg");
  svgs.forEach((svg) => {
    const title = svg.querySelector("title");
    const ariaLabel = svg.getAttribute("aria-label");
    if (!title && !ariaLabel) {
      const newTitle = document.createElementNS("http://www.w3.org/2000/svg", "title");
      newTitle.textContent = "SVG icon";
      svg.appendChild(newTitle);
      console.log("Accessible name added to SVG:", svg);
    }
    if (ariaLabel) {
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", ariaLabel);
    }
  });
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll("[role='region'], [role='main'], [aria-label]");
  const ids = {};
  landmarks.forEach((landmark) => {
    const label = landmark.getAttribute("aria-label") || landmark.getAttribute("role") || "landmark";
    if (!ids[label]) {
      ids[label] = 1;
    } else {
      ids[label]++;
      const newId = `${label}-${ids[label]}`;
      landmark.setAttribute("id", newId);
    }
  });
  console.log("Unique landmarks ensured");
}

function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('[role="button"][href="#"]');
  fakeLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Fake link clicked");
    });
    if (!link.getAttribute("aria-pressed")) {
      link.setAttribute("aria-pressed", "false");
    }
  });
  console.log("Fake link issues fixed");
}