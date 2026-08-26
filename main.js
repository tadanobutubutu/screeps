tsx
import React from 'react';
import { IconContext } from 'react-icons';
import { FaBug } from 'react-icons/fa';
import { IoMdMoon } from 'react-icons/io';
import { FiSun } from 'react-icons/fi';
import { IoMdPerson as IoMdIconPerson } from 'react-icons/io';

const ScreepsLogo = (props) => (
  <IconContext.Provider value={{ className: 'h-8 w-auto fill-current' }}>
    <FaBug aria-label="Screeps Dashboard" />
  </IconContext.Provider>
);

// ... rest of the file

export default function App() {
  // ... rest of the code
}