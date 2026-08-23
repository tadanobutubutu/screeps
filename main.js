module.exports = {
  loop: function() {
    // Main game loop
    const runLoop = () => {
      // Your code here
    };
    runLoop();
  }
};

// Utility function to create table headers with proper scope
function createTableHeader(text, isColumn = true) {
  const scope = isColumn ? 'col' : 'row';
  return `<th scope="${scope}">${text}</th>`;
}

// Example table rendering (for UI/visualization purposes)
const createTableHTML = (headers, rows) => {
  let html = '<table>';
  
  // Create header row with scope attributes
  html += '<thead><tr>';
  headers.forEach(header => {
    html += createTableHeader(header, true);
  });
  html += '</tr></thead>';
  
  // Create body rows
  html += '<tbody>';
  rows.forEach(row => {
    html += '<tr>';
    row.forEach((cell, index) => {
      if (index === 0) {
        // First cell in each row is a row header
        html += createTableHeader(cell, false);
      } else {
        html += `<td>${cell}</td>`;
      }
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  
  return html;
};

// Example usage for room visualization
const visualizeRoom = (roomName) => {
  const room = Game.rooms[roomName];
  if (!room) return;
  
  const headers = ['Type', 'Count', 'Energy'];
  const data = [
    ['Sources', room.find(FIND_SOURCES).length, room.find(FIND_SOURCES).reduce((sum, s) => sum + s.energy, 0)],
    ['Structures', room.find(FIND_STRUCTURES).length, 0],
    ['Creeps', Object.keys(room.find(FIND_CREEPS)).length, 0]
  ];
  
  return createTableHTML(headers, data);
};

// Initialize memory
if (!Memory.stats) {
  Memory.stats = {};
}

// Export additional functions
module.exports.visualizeRoom = visualizeRoom;
module.exports.createTableHTML = createTableHTML;
module.exports.createTableHeader = createTableHeader;