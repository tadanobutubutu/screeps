// Screeps Main Script
// Ensure all exports are preserved
module.exports = {
  loop: function() {
    // Main game loop
    const runLoop = () => {
      // Your code here
    };
    runLoop();
  },
  visualizeRoom: function(roomName) {
    const room = Game.rooms[roomName];
    if (!room) return;
    
    const headers = ['Type', 'Count', 'Energy'];
    const data = [
      ['Sources', room.find(FIND_SOURCES).length, room.find(FIND_SOURCES).reduce((sum, s) => sum + s.energy, 0)],
      ['Structures', room.find(FIND_STRUCTURES).length, 0],
      ['Creeps', room.find(FIND_CREEPS).length, 0]
    ];
    
    return createTableHTML(headers, data);
  },
  createTableHTML: function(headers, rows) {
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
  },
  createTableHeader: function(text, isColumn) {
    const scope = isColumn ? 'col' : 'row';
    return `<th scope="${scope}">${text}</th>`;
  }
};