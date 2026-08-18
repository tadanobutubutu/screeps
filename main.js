// pages/_document.js - Fix for REACT_015 (Language Attribute)
import { Html, Head, Main, NextScript } from 'next/document';

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

// Additional accessibility components and fixes
export const AccessibleTable = ({ children, ...props }) => {
  return (
    <table {...props} role="table">
      {children}
    </table>
  );
};

export const AccessibleTableHeader = ({ children, ...props }) => {
  return (
    <thead {...props} role="rowgroup">
      <tr role="row">
        {React.Children.map(children, (child) => (
          <th role="columnheader" scope="col">
            {child}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export const AccessibleTableBody = ({ children, ...props }) => {
  return (
    <tbody {...props} role="rowgroup">
      {React.Children.map(children, (child, index) => (
        <tr role="row" key={index}>
          {React.Children.map(child.props.children, (td, tdIndex) => (
            <td role="cell" key={tdIndex}>
              {td}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export const AccessibleSVG = ({ title, desc, children, ...props }) => {
  return (
    <svg {...props} aria-hidden={!title && !desc}>
      {title && <title>{title}</title>}
      {desc && <desc>{desc}</desc>}
      {children}
    </svg>
  );
};

export const AccessibleLink = ({ href, children, ...props }) => {
  if (!href || href.startsWith('#')) {
    return (
      <button {...props} onClick={() => window.location.hash = href}>
        {children}
      </button>
    );
  }
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

export const AccessibleLandmark = ({ type, children, ...props }) => {
  const landmarkTypes = {
    banner: 'header',
    navigation: 'nav',
    main: 'main',
    complementary: 'aside',
    contentinfo: 'footer',
    region: 'section'
  };

  const Tag = landmarkTypes[type] || 'section';

  return (
    <Tag {...props} role={type} aria-label={props['aria-label'] || undefined}>
      {children}
    </Tag>
  );
};