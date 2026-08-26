// Import external package for internationalization
import React from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

// Skip navigation link for keyboard users
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// <a href="#main-content" className="skip-nav">
//   Skip navigation
// </a>

const skipNavLinkStyle = {
  position: "absolute",
  top: "-9999px",
  left: "-9999px",
  background: "#000",
  color: "#fff",
  padding: "0.5rem",
  zIndex: 1000,
  textDecoration: "none",
};

const SkipNavLink = () => (
  <a
    href="#main-content"
    className="skip-nav"
    style={skipNavLinkStyle}
    onFocus={(e) => (e.target.style.top = "0.5rem", e.target.style.left = "0.5rem")}
    onBlur={(e) => (e.target.style.top = "-9999px", e.target.style.left = "-9999px")}
  >
    Skip navigation
  </a>
);

// Main functional component
const Main = ({ data }) => {
  // Address critical issue: React Language Attribute
  // Wrap all child nodes in a top-level Lang tag
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>My App</title>
      </head>
      <body>
        <SkipNavLink />
        <div id="main-content">
          {/* Wrap the existing table in a more accessible Table structure */}
          <Table data={data}>
            {/* Address warning issue: React Fake Link */}
            {/* Use Link component from next/link or react-router-dom instead of regular a tags for navigation */}
            {/* ... existing table structure (adjust as needed) ... */}
          </Table>
        </div>
      </body>
    </html>
  );
};

// Table component with proper role, headers, and accessibility properties
// (Adjust as needed to fit your existing table structure)
const Table = ({ data }) => {
  return (
    <table role="grid" aria-label="My Table">
      {/* ... add thead, tbody, and tr/th/td structure depending on data structure ... */}
      {/* Address warning issue: React Table Structure */}
      {/* Ensure the table headers have associated scope attributes */}
      {/* ... adjust row and cell structure to add scope="col" to headers ... */}
    </table>
  );
};

// Prop types for the Main and Table components
Main.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ /* data structure */ })).isRequired,
};

// Export the Main component
export default Main;