// Example functions that might be in main.js for rendering dependency graphs

function renderDependencyGraph(modules) {
  const graph = {};
  modules.forEach(module => {
    graph[module.id] = {
      name: module.name,
      dependencies: module.dependencies.map(dep => dep.id)
    };
  });
  return graph;
}

function displayModuleStructure(modules, options = {}) {
  if (options.debug) {
    console.log('Module Structure:');
    modules.forEach(module => {
      console.log(`  ${module.name} (${module.id})`);
      module.dependencies.forEach(dep => {
        console.log(`    └── ${dep.name} (${dep.id})`);
      });
    });
  }
  return modules;
}

// Updated versions addressing the issue
function renderDependencyGraphUpdated(modules) {
  const graph = {};
  modules.forEach(module => {
    graph[module.id] = {
      name: module.name,
      dependencies: module.dependencies.map(dep => dep.id),
      debugInfo: {
        type: module.type || 'unknown',
        size: module.size || 0
      }
    };
  });
  return graph;
}

function displayModuleStructureUpdated(modules, options = {}) {
  if (options.debug || options.detailed) {
    console.log('Enhanced Module Structure Debug Info:');
    console.log('Total Modules:', modules.length);
    
    modules.forEach(module => {
      console.group(`Module: ${module.name} (${module.id})`);
      console.log('Type:', module.type || 'unknown');
      console.log('Dependencies:');
      module.dependencies.forEach(dep => {
        console.log(`  └── ${dep.name} (${dep.id}) [${dep.type || 'unknown'}]`);
      });
      console.groupEnd();
    });
  }
  return modules;
}