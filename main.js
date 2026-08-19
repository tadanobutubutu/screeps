function getFixedLayouts() {
  return {
    // ... existing code
    dependencyGraph: wrapWithMain('<table id="table-rotated">\
      <thead>\
        <tr>\
          <th><button id="unrotate">rotate back</button></th>\
        </tr>\
      </thead>\
      <!-- rest of the table -->'),
    // ... remaining layouts
  };
}