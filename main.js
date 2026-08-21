// Fixed REACT_025: Ensure only one <main> landmark
import React from 'react';

function Dashboard() {
  return (
    <main>
      <section>Dashboard Content</section>
    </main>
  );
}

export default Dashboard;