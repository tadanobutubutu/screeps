class MemoryVisualizer {
  constructor() {
    this.nodes = [];
    this.connections = {};
  }

  addNode(id, description = '') {
    const node = { id, description, value: null };
    this.nodes.push(node);
    if (!this.connections[id]) {
      this.connections[id] = [];
    }
    return node;
  }

  addConnection(from, to, label = '') {
    if (!this.connections[from]) {
      this.connections[from] = [];
    }
    this.connections[from].push({ to, label });
  }

  visualize() {
    if (this.nodes.length === 0) {
      return 'No nodes to visualize';
    }

    const nodeMap = new Map();
    const grid = [];

    // Assign coordinates to nodes
    this.nodes.forEach((node, index) => {
      const x = index % 5;
      const y = Math.floor(index / 5);
      nodeMap.set(node.id, { node, x, y });
    });

    // Check if there's at least one node before accessing coordinates
    const firstNode = nodeMap.get(this.nodes[0].id);
    const maxX = Math.max(...Array.from(nodeMap.values()).map(n => n.x)) + 2;
    const maxY = Math.max(...Array.from(nodeMap.values()).map(n => n.y)) + 2;

    // Initialize grid
    for (let y = 0; y <= maxY; y++) {
      grid[y] = [];
      for (let x = 0; x <= maxX; x++) {
        grid[y][x] = ' ';
      }
    }

    // Place nodes on grid
    let output = '';
    nodeMap.forEach(({ node, x, y }) => {
      const label = node.description || node.id;
      grid[y][x] = label;
    });

    // Draw connections
    nodeMap.forEach(({ node, x, y }) => {
      const nodeConnections = this.connections[node.id] || [];
      nodeConnections.forEach(conn => {
        const targetData = nodeMap.get(conn.to);
        if (targetData) {
          const { x: tx, y: ty } = targetData;
          // Draw connection line
          if (y === ty) {
            // Horizontal connection
            const startX = Math.min(x, tx) + 1;
            const endX = Math.max(x, tx);
            for (let cx = startX; cx < endX; cx++) {
              if (grid[y][cx] === ' ') {
                grid[y][cx] = '-';
              }
            }
          } else if (x === tx) {
            // Vertical connection
            const startY = Math.min(y, ty) + 1;
            const endY = Math.max(y, ty);
            for (let cy = startY; cy < endY; cy++) {
              if (grid[cy][x] === ' ') {
                grid[cy][x] = '|';
              }
            }
          }
        }
      });
    });

    // Render grid
    grid.forEach(row => {
      output += row.join('') + '\n';
    });

    return output;
  }
}

module.exports = MemoryVisualizer;