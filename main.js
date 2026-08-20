tsx
import React from 'react';

// Other components and imports (...)

function Logo() {
  return (
    <a
      href="/"
      className="flex items-center"
    >
      <img
        src="/images/logo.svg"
        alt="Your company name"
        className="h-auto w-auto flex-shrink-0 fill-current mr-1"
        aria-hidden="true"
      />
      <h1 className="text-xl font-semibold tracking-tight text-white">
        Your Company Name
      </h1>
    </a>
  );
}

// Other functions and exports (...)