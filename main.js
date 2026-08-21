tsx
// app/layout.tsx

import { useState } from "react";
import data from "../icons.json";
import "./styles.css";

function Icon({ name }) {
  const [hover, setHover] = useState(false);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <title>Screeps Dashboard</title>
      <text
        y=".9em"
        fontSize="90"
        style={{ opacity: hover ? 1 : 0.6 }}
      >
        {data[name]}
      </text>
    </svg>
  );
}

export default Icon;

const icons = data; // Moved this constant to the top