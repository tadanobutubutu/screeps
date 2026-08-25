import React from 'react';
import ReactDOMServer from 'react-dom/server';
import dependencyGraphHtml from './dependency-graph.html';

const DependencyGraph = () => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: ReactDOMServer.renderToString(
          <html lang="en">
            {/* Wrap the existing dependencyGraphHtml with the new root element */}
            {ReactDOMServer.renderToString(React.createElement('div', { id: 'root', dangerouslySetInnerHTML: { __html: dependencyGraphHtml } }))}
          </html>
        ),
      }}
    />
  );
};

export default DependencyGraph;