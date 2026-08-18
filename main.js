import React from 'react';

const MyTableComponent = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Column 1</th>
          <th scope="col">Column 2</th>
          <th scope="col">Column 3</th>
        </tr>
      </thead>
      <tbody>
        {/* Table rows would go here */}
      </tbody>
    </table>
  );
};

const Dashboard = () => {
  const [isError, setIsError] = React.useState(false);

  // Simulate error state for demonstration
  React.useEffect(() => {
    setIsError(Math.random() > 0.5);
  }, []);

  return (
    <div className="dashboard-container">
      {isError ? (
        <section className="error-state">
          <h2>Error Occurred</h2>
          <p>Something went wrong. Please try again.</p>
        </section>
      ) : (
        <section className="success-state">
          <h2>Dashboard</h2>
          <MyTableComponent />
        </section>
      )}
    </div>
  );
};

export default MyTableComponent;
export { Dashboard };