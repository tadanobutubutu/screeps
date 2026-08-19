export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
export function ensureSingleMainElement() {
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    const mainArray = Array.from(mains);
    mainArray.slice(1).forEach(main => {
      const section = document.createElement('section');
      section.innerHTML = main.innerHTML;
      main.replaceWith(section);
    });
  }
}
if (typeof window !== 'undefined') {
  window.addEventListener('load', ensureSingleMainElement);
}

const addScopeToTh = (htmlString) => {
  return htmlString.replace(/<th(?![^>]*\bscope=)([^>]*?)>/gi, (match, attributes) => {
    if (attributes.endsWith('/')) {
      return `<th scope="col"${attributes}>`;
    }
    return `<th scope="col"${attributes}>`;
  });
};

const fixDependencyGraph = () => {
  const fs = require('fs');
  const path = require('path');
  const dependencyGraphFile = path.join(__dirname, 'src', 'components', 'DependencyGraph.jsx');
  try {
    const content = fs.readFileSync(dependencyGraphFile, 'utf8');
    const updatedContent = addScopeToTh(content);
    fs.writeFileSync(dependencyGraphFile, updatedContent);
    console.log('Successfully added scope attribute to <th> elements');
  } catch (error) {
    console.error('Error fixing dependency graph:', error);
  }
};

// fixDependencyGraph();