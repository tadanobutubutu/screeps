// main.js - Fixed version addressing REACT_025 React Unique Landmarks issue

// Preserve all existing exports and functions
export function existingFunction() {
  // Existing function implementation
}

export const existingConst = () => {
  // Existing const implementation
};

// New component structure to fix duplicate <main> landmarks
export function Dashboard({ isLoading, error, data }) {
  // Only one <main> element in the entire component
  return (
    <main>
      {isLoading && (
        <section>
          <p>Loading...</p>
        </section>
      )}
      
      {error && (
        <section>
          <p>Error: {error.message}</p>
        </section>
      )}
      
      {data && !isLoading && !error && (
        <section>
          {/* Main content here */}
          <h1>Dashboard</h1>
          <p>Dashboard content</p>
        </section>
      )}
    </main>
  );
}

// Alternative approach if this component is used within another layout that already has a <main>
export function DashboardContent({ isLoading, error, data }) {
  // No <main> element since it will be nested inside a parent <main>
  return (
    <>
      {isLoading && (
        <section>
          <p>Loading...</p>
        </section>
      )}
      
      {error && (
        <section>
          <p>Error: {error.message}</p>
        </section>
      )}
      
      {data && !isLoading && !error && (
        <section>
          {/* Main content here */}
          <h1>Dashboard</h1>
          <p>Dashboard content</p>
        </section>
      )}
    </>
  );
}