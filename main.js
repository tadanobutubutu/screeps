// main.js
import { Zombie } from "jshasher";

export function Main() {
  // Constructor
  const rooms = ["W1N1", "W1N2", "W1N3"];
  const terminalResourceTypes = ["energy", "uKc", "lKc"];
  const settings = {
    // Viewing options
    showVerticalBorders: true,
    showHorizontalBorders: true,
    compactMode: false,
    showTerminal: true,
    showRoomName: true,
    showResourceColumn: true,
    showCoefficientColumn: true,
    showHeaderRotation: true,
    showAlternatingRowColors: false,
    showColumnAverage: false,
    showTotalRow: false,
    showDependencies: true,
  };

  const state = {
    rooms: rooms,
    resources: terminalResourceTypes,
    settings: settings,
    data: [],
  };

  const _renderTable = () => {
    const tableContainer = document.getElementById("table-container");

    const table = document.createElement("table");
    table.className = "dependency-graph-table";

    // Create header row
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.className = "header-row";
    
    // Header cells
    const thRoom = document.createElement("th");
    thRoom.textContent = "Room";
    thRoom.scope = "col"; // Add scope for accessibility
    
    const thResource = document.createElement("th");
    thResource.textContent = "Resource";
    thResource.scope = "col"; // Add scope for accessibility
    
    const thCoefficient = document.createElement("th");
    thCoefficient.textContent = "Coefficient";
    thCoefficient.scope = "col"; // Add scope for accessibility
    
    headerRow.appendChild(thRoom);
    headerRow.appendChild(thResource);
    headerRow.appendChild(thCoefficient);
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement("tbody");
    
    // Populate with data
    for (let room of state.rooms) {
      const row = document.createElement("tr");
      row.className = "data-row";
      
      const tdRoom = document.createElement("td");
      tdRoom.textContent = room;
      
      const tdResource = document.createElement("td");
      tdResource.textContent = "N/A";
      
      const tdCoefficient = document.createElement("td");
      tdCoefficient.textContent = "1.0";
      
      row.appendChild(tdRoom);
      row.appendChild(tdResource);
      row.appendChild(tdCoefficient);
      
      tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    tableContainer.appendChild(table);
  };

  const init = () => {
    _renderTable();
    
    // Setup event listeners for settings
    const settingsPanel = document.getElementById("settings-panel");
    
    // Toggle vertical borders
    const toggleVerticalBorders = document.getElementById("toggle-vertical-borders");
    toggleVerticalBorders.checked = state.settings.showVerticalBorders;
    toggleVerticalBorders.addEventListener("change", (e) => {
      state.settings.showVerticalBorders = e.target.checked;
      _renderTable();
    });
    
    // Toggle horizontal borders
    const toggleHorizontalBorders = document.getElementById("toggle-horizontal-borders");
    toggleHorizontalBorders.checked = state.settings.showHorizontalBorders;
    toggleHorizontalBorders.addEventListener("change", (e) => {
      state.settings.showHorizontalBorders = e.target.checked;
      _renderTable();
    });
    
    // Toggle compact mode
    const toggleCompactMode = document.getElementById("toggle-compact-mode");
    toggleCompactMode.checked = state.settings.compactMode;
    toggleCompactMode.addEventListener("change", (e) => {
      state.settings.compactMode = e.target.checked;
      _renderTable();
    });
    
    // Toggle terminal display
    const toggleTerminal = document.getElementById("toggle-terminal");
    toggleTerminal.checked = state.settings.showTerminal;
    toggleTerminal.addEventListener("change", (e) => {
      state.settings.showTerminal = e.target.checked;
      _renderTable();
    });
    
    // Toggle room name display
    const toggleRoomName = document.getElementById("toggle-room-name");
    toggleRoomName.checked = state.settings.showRoomName;
    toggleRoomName.addEventListener("change", (e) => {
      state.settings.showRoomName = e.target.checked;
      _renderTable();
    });
    
    // Toggle resource column
    const toggleResourceColumn = document.getElementById("toggle-resource-column");
    toggleResourceColumn.checked = state.settings.showResourceColumn;
    toggleResourceColumn.addEventListener("change", (e) => {
      state.settings.showResourceColumn = e.target.checked;
      _renderTable();
    });
    
    // Toggle coefficient column
    const toggleCoefficientColumn = document.getElementById("toggle-coefficient-column");
    toggleCoefficientColumn.checked = state.settings.showCoefficientColumn;
    toggleCoefficientColumn.addEventListener("change", (e) => {
      state.settings.showCoefficientColumn = e.target.checked;
      _renderTable();
    });
    
    // Toggle header rotation
    const toggleHeaderRotation = document.getElementById("toggle-header-rotation");
    toggleHeaderRotation.checked = state.settings.showHeaderRotation;
    toggleHeaderRotation.addEventListener("change", (e) => {
      state.settings.showHeaderRotation = e.target.checked;
      _renderTable();
    });
    
    // Toggle alternating row colors
    const toggleAlternatingRowColors = document.getElementById("toggle-alternating-row-colors");
    toggleAlternatingRowColors.checked = state.settings.showAlternatingRowColors;
    toggleAlternatingRowColors.addEventListener("change", (e) => {
      state.settings.showAlternatingRowColors = e.target.checked;
      _renderTable();
    });
    
    // Toggle column average
    const toggleColumnAverage = document.getElementById("toggle-column-average");
    toggleColumnAverage.checked = state.settings.showColumnAverage;
    toggleColumnAverage.addEventListener("change", (e) => {
      state.settings.showColumnAverage = e.target.checked;
      _renderTable();
    });
    
    // Toggle total row
    const toggleTotalRow = document.getElementById("toggle-total-row");
    toggleTotalRow.checked = state.settings.showTotalRow;
    toggleTotalRow.addEventListener("change", (e) => {
      state.settings.showTotalRow = e.target.checked;
      _renderTable();
    });
    
    // Toggle dependencies
    const toggleDependencies = document.getElementById("toggle-dependencies");
    toggleDependencies.checked = state.settings.showDependencies;
    toggleDependencies.addEventListener("change", (e) => {
      state.settings.showDependencies = e.target.checked;
      _renderTable();
    });
  };

  return {
    init: init,
  };
}