import React from 'react';

// Helper functions from the original right-side code
const dependencyGraphModule = ...
const indexModule = require('./index');

// Accessibility: Updated dependencyGraphFunction to use dependencyGraphContent directly
// with proper accessibility attributes and semantic HTML
function dependencyGraphFunction() {
  const { dependencyGraphContent } = dependencyGraphModule;

  // ... existing code for rendering the dependency graph ...

  // New function for extracting external module names from the dependency graph
  function ... {
    const externalModules = [];

    // Traverse through all nodes in the dependency graph and extract the external packages
    const nodes = dependencyGraphContent.graph.nodes;
    nodes.forEach((node) => {
      if (node.type === 'package' && node.package === 'external-package') {
        ...
      }
    });

    // Return the list of extracted external modules
    return externalModules;
  }

  // New function for ensuring unique landmarks
  function ... {
    // Ensure the returned content has proper landmark structure
    // Keep a single <main> landmark; use <section> for other regions
    if (!content || !content.render) {
      return content;
    }

    // Create a wrapper that ensures unique landmarks in the rendered output
    const originalRender = content.render.bind(content);
    content.render = function(...args) {
      const rendered = originalRender(...args);
      
      // Replace any duplicate <main> elements with <section> to maintain unique landmark structure
      // This ensures screen readers encounter only one <main> landmark
      if (rendered && rendered.props && rendered.props.children) {
        const children = Array.isArray(rendered.props.children) 
          ? rendered.props.children 
          : [rendered.props.children];
        
        const processedChildren = children.map((child, index) => {
          // Skip the first <main> element (index 0), replace subsequent ones with <section>
          if (index > 0 && child && child.type === 'main') {
            return React.createElement('section', { 
              key: child.key || index,
              ...child.props
            }, child.props.children);
          }
          return child;
        });
        
        return React.createElement('div', { role: 'main' }, processedChildren);
      }
      
      return rendered;
    };

    return content;
  }

  // ---------------------------------------------------

  // New constant region for external modules
  const EXTERNAL_MODULES = ...

  // ... existing code for rendering the dependency graph ...

  // Accessibility: Add back any required exports that might have been removed (if any external modules are present)
  if ... > 0) {
    // Assuming that the package.json file lists all the required external modules
    // Adjust the path to your package.json file as needed
    const packageJsonPath = './package.json';
    const packageJson = ...

    // Filter the required external modules from package.json and include them in exports
    const externalModuleExports = packageJson.dependencies;
    ... => {
      if ... {
        console.warn(`The dependency graph indicates an external module (${moduleName}) that has no corresponding entry in package.json. Please double-check.`);
      } else {
        const requiredModule = require(moduleName);
        // This will include only non-default exports from the external modules
        ... exportedValue]) => {
          if (exportName !== '.') {
            // Assuming that the exported values have a 'default' property to indicate if they are default exports
            if (exportedValue.default) {
              module.exports[exportName] = exportedValue.default;
            } else {
              module.exports[exportName] = exportedValue;
            }
          }
        });
      }
    });
  }

  // Accessibility: Implement fixes for 26 table structure issues (fixTableStructureIssues)
  function fixTableStructureIssues(content) {
    if (!content || !content.render) {
      return content;
    }

    const originalRender = content.render.bind(content);
    content.render = function(...args) {
      const rendered = originalRender(...args);

      if (rendered && rendered.props && rendered.props.children) {
        const children = Array.isArray(rendered.props.children)
          ? rendered.props.children
          : [rendered.props.children];

        const processedChildren = children.map((child) => {
          return fixTableElement(child);
        });

        return React.cloneElement(rendered, {}, processedChildren);
      }

      return rendered;
    };

    return content;
  }

  function fixTableElement(node) {
    if (!node || !node.props) {
      return node;
    }

    if (node.type === 'table') {
      const { children, ...tableProps } = node.props;
      const tableChildren = Array.isArray(children) ? children : [children];
      
      let hasCaption = false;
      let hasThead = false;
      let hasTbody = false;
      let captionIndex = -1;
      
      // Check existing structure
      tableChildren.forEach((child, idx) => {
        if (child) {
          if (child.type === 'caption') {
            hasCaption = true;
            captionIndex = idx;
          }
          if (child.type === 'thead') hasThead = true;
          if (child.type === 'tbody') hasTbody = true;
        }
      });

      const newChildren = [];
      let rowIndex = 0;

      // Add caption if missing (screen readers need table descriptions)
      if (!hasCaption) {
        newChildren.push(
          React.createElement('caption', { key: 'caption' }, 
            'Table data'
          )
        );
      }

      // Process and fix table structure
      tableChildren.forEach((child, idx) => {
        if (!child) return;

        if (child.type === 'thead') {
          hasThead = true;
          const fixedThead = fixHeaderCells(child, rowIndex);
          newChildren.push(fixedThead);
          rowIndex += React.Children.count(child.props.children);
        } else if (child.type === 'tbody') {
          hasTbody = true;
          const fixedTbody = fixBodyCells(child, rowIndex);
          newChildren.push(fixedTbody);
          rowIndex += React.Children.count(child.props.children);
        } else if (child.type === 'tr') {
          // Direct tr element outside thead/tbody
          if (!hasThead && newChildren.length === (hasCaption ? 1 : 0)) {
            // First rows - treat as header
            const fixedTr = fixHeaderRow(child, rowIndex);
            if (!hasThead) {
              newChildren.push(
                React.createElement('thead', { key: 'thead' }, fixedTr)
              );
              hasThead = true;
            }
            rowIndex++;
          } else {
            if (!hasTbody) {
              newChildren.push(React.createElement('tbody', { key: 'tbody' }));
              hasTbody = true;
            }
            const fixedTr = fixBodyRow(child, rowIndex);
            newChildren.push(
              React.createElement('tbody', { key: `tbody-${newChildren.length}` }, fixedTr)
            );
            rowIndex++;
          }
        } else {
          newChildren.push(child);
        }
      });

      // Ensure tbody exists if no thead/tbody found
      if (!hasThead && !hasTbody) {
        newChildren.push(
          React.createElement('tbody', { key: 'tbody' },
            tableChildren.filter(c => c && c.type !== 'caption')
          )
        );
      }

      return React.createElement('table', { ...tableProps }, newChildren);
    }

    // Recursively process children
    if (node.props && node.props.children) {
      const children = Array.isArray(node.props.children)
        ? node.props.children
        : [node.props.children];
      
      const fixedChildren = children.map(child => fixTableElement(child));
      
      return React.cloneElement(node, {}, fixedChildren);
    }

    return node;
  }

  function fixHeaderCells(theadElement, startRowIndex) {
    if (!theadElement || !theadElement.props || !theadElement.props.children) {
      return theadElement;
    }

    const rows = Array.isArray(theadElement.props.children)
      ? theadElement.props.children
      : [theadElement.props.children];

    const fixedRows = rows.map((row, rowIdx) => {
      if (row && row.type === 'tr') {
        return fixHeaderRow(row, startRowIndex + rowIdx);
      }
      return row;
    });

    return React.cloneElement(theadElement, {}, fixedRows);
  }

  function fixHeaderRow(trElement, rowIndex) {
    if (!trElement || !trElement.props || !trElement.props.children) {
      return trElement;
    }

    const cells = Array.isArray(trElement.props.children)
      ? trElement.props.children
      : [trElement.props.children];

    const fixedCells = cells.map((cell, cellIdx) => {
      if (cell && cell.type === 'td') {
        // Convert td to th for header rows with scope attribute
        return React.createElement('th', {
          ...cell.props,
          key: cell.key || cellIdx,
          scope: cell.props.scope || 'col'
        }, cell.props.children);
      }
      return cell;
    });

    return React.cloneElement(trElement, {}, fixedCells);
  }

  function fixBodyCells(tbodyElement, startRowIndex) {
    if (!tbodyElement || !tbodyElement.props || !tbodyElement.props.children) {
      return tbodyElement;
    }

    const rows = Array.isArray(tbodyElement.props.children)
      ? tbodyElement.props.children
      : [tbodyElement.props.children];

    const fixedRows = rows.map((row, rowIdx) => {
      if (row && row.type === 'tr') {
        return fixBodyRow(row, startRowIndex + rowIdx);
      }
      return row;
    });

    return React.cloneElement(tbodyElement, {}, fixedRows);
  }

  function fixBodyRow(trElement, rowIndex) {
    if (!trElement || !trElement.props || !trElement.props.children) {
      return trElement;
    }

    const cells = Array.isArray(trElement.props.children)
      ? trElement.props.children
      : [trElement.props.children];

    const fixedCells = cells.map((cell, cellIdx) => {
      if (cell && cell.type === 'th') {
        // Ensure th in body has row scope
        return React.createElement('th', {
          ...cell.props,
          key: cell.key || cellIdx,
          scope: cell.props.scope || 'row'
        }, cell.props.children);
      }
      return cell;
    });

    return React.cloneElement(trElement, {}, fixedCells);
  }

  // Apply unique landmarks fix to the content before returning
  const fixedContent = ...

  // Apply table structure fixes to dependency graph content
  const contentWithFixedTables = fixTableStructureIssues(dependencyGraphContent);

  return contentWithFixedTables;
}

// Accessibility: Updated indexFunction to use indexContent directly
// with proper accessibility