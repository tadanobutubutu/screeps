// app/layout.tsx
import { StrictMode } from "react";
import Layout from "./Layout";

// Add the following import for axe-core
import axe from "jest-axe";

// Add the following export for the accessible layout function
export const accessibleLayout = (Component) => {
  return (props) => {
    const { children } = props;

    // Use axe to check accessibility of the children elements
    const results = axe(children);

    // If there are any accessibility issues, log them to the console
    if (results.violations.length > 0) {
      console.error(results.violations);
    }

    // Return the JSX with the children and the Layout component
    return (
      <StrictMode>
        <Layout>{children}</Layout>
      </StrictMode>
    );
  };
};

export default accessibleLayout(StrictMode({ Layout }));