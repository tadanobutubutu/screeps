tsx
import React from "react";

function Layout(props: any) {
  // Existing code

  return (
    <div className="root">
      {/* Existing JSX */}

      <main>{props.children}</main>
    </div>
  );
}

export default Layout;