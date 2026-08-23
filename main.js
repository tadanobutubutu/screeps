import { useState } from 'react';

function manageNightMode() {
  document.documentElement.className =
    document.documentElement.className.includes("dark") ? "light" : "dark";
}

function ToggleNightMode() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div>
      <button onClick={() => {
        manageNightMode();
        setIsDark(!isDark);
      }}>
        Toggle Night Mode
      </button>
    </div>
  );
}