module.exports.loop = function () {
  // Resolve merged bot logic for Screeps
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      if (creep.store.getFreeCapacity() > 0) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
    }
  }

  validateTableAccessibility();
  validateTableStructure();
};

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const issues = [];

  tables.forEach((table, index) => {
    if (!table.hasAttribute('role') && !table.querySelector('caption')) {
      issues.push(`Table ${index + 1}: Missing accessible role or caption`);
    }

    const headers = table.querySelectorAll('th');
    headers.forEach((header, hIndex) => {
      if (!header.hasAttribute('scope') && !header.hasAttribute('id')) {
        issues.push(`Table ${index + 1}, Header ${hIndex + 1}: Missing scope or id attribute`);
      }
    });

    const cells = table.querySelectorAll('td');
    cells.forEach((cell, cIndex) => {
      const headers = cell.closest('table').querySelectorAll('th');
      if (headers.length > 0 && !cell.hasAttribute('headers')) {
        issues.push(`Table ${index + 1}, Cell ${cIndex + 1}: Missing headers attribute`);
      }
    });
  });

  return issues;
}

function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  const issues = [];

  tables.forEach((table, index) => {
    if (!table.querySelector('thead')) {
      issues.push(`Table ${index + 1}: Missing thead element`);
    }

    if (!table.querySelector('tbody')) {
      issues.push(`Table ${index + 1}: Missing tbody element`);
    }

    const rows = table.querySelectorAll('tr');
    if (rows.length === 0) {
      issues.push(`Table ${index + 1}: No rows found`);
    }

    const firstRow = table.querySelector('tr');
    if (firstRow) {
      const firstRowCells = firstRow.querySelectorAll('th, td');
      const otherRows = Array.from(rows).slice(1);
      otherRows.forEach((row, rIndex) => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length !== firstRowCells.length) {
          issues.push(`Table ${index + 1}, Row ${rIndex + 2}: Column count mismatch (expected ${firstRowCells.length}, got ${cells.length})`);
        }
      });
    }

    const nestedTables = table.querySelectorAll('table');
    if (nestedTables.length > 0) {
      issues.push(`Table ${index + 1}: Contains ${nestedTables.length} nested table(s)`);
    }
  });

  return issues;
}