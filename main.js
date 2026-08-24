// Set language attribute on document root for accessibility (REACT_015)
document.documentElement.lang = "en";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you need to dynamically set the language based on user preference or locale:
// document.documentElement.lang = navigator.language || "en";