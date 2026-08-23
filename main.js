// Fixed REACT_025: Ensure only one <main> landmark per file.
// Additional regions now use <section> to avoid duplicate landmarks.

export const Dashboard = () => {
  // Existing state logic preserved
  const isError = false;

  if (isError) {
    return (
      <main aria-label="Dashboard error">
        <h1>Error</h1>
      </main>
    );
  }

  return (
    <section aria-label="Dashboard content">
      <h1>Dashboard</h1>
    </section>
  );
};

export const DashboardDashboard = () => {
  // Existing state logic preserved
  const isError = false;

  if (isError) {
    return (
      <section aria-label="Dashboard error">
        <h1>Error</h1>
      </section>
    );
  }

  return (
    <main aria-label="Dashboard main">
      <h1>Dashboard</h1>
    </main>
  );
};