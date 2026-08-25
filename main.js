tsx
// components/Dashboard.tsx
import React, { useState, useEffect } from "react";
// ... (rest of the imports) ...

function Dashboard({ username, isLoggedIn }) {
  // ... (rest of the logic) ...

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      {isLoading ? (
        <main>
          <h1 style={{ color: "#b71c1c" }}>loading...</h1>
          {/* ... (rest of the error state content) ... */}
        </main>
      ) : (
        <div>
          {error && (
            <section>
              <h1 style={{ color: "#b71c1c" }}>⚠️ エラー</h1>
              {/* ... (rest of the error state content) ... */}
            </section>
          )}
          {success && (
            <main>
              {/* ... (rest of the success state content) ... */}
            </main>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;