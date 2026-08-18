import React from "react";

const Layout = ({ children }) => {
  return (
    <div lang="en" className="min-h-screen flex flex-col">
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;