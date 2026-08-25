const { getAllCreeps } = require('./creeps');
const { getAllRooms } = require('./rooms');
const { analyzePerformance } = require('./performance');

function generateTable(creeps) {
  let html = '<table>';
  html += '<thead><tr><th scope="col">Name</th><th scope="col">Role</th><th scope="col">Room</th><th scope="col">Hits</th><th scope="col">Energy</th></tr></thead>';
  html += '<tbody>';

  for (const creep of creeps) {
    html += '<tr>';
    html += `<td>${creep.name}</td>`;
    html += `<td>${creep.role}</td>`;
    html += `<td>${creep.room}</td>`;
    html += `<td>${creep.hits}</td>`;
    html += `<td>${creep.energy}</td>`;
    html += '</tr>';
  }

  html += '</tbody></table>';
  return html;
}

module.exports = {
  generateTable
};