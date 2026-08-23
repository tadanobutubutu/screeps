tsx
const MainComponent = () => {
  // Your main content here
};

// Render the main component
export const Dashboard = () => {
  // Error handling and success states
  // ...

  return (
    <>
      {isError ? <ErrorContent /> : isSuccess ? <SuccessContent /> : null}
      <main>{MainComponent()}</main>
    </>
  );
};