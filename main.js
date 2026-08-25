import React from 'react';

const Dashboard = ({ isSuccess, error }) => {
  // Assuming isSuccess is a boolean indicating the success state and error is an object with error details

  // Render the content of the main section based on the component state
  const renderMainContent = () => {
    if (isSuccess) {
      return <MainContentSuccess />;
    } else if (error) {
      return <MainContentError error={error} />;
    }
    return <NoContent />;
  };

  return (
    <div>
      {/* Render only one <main> element */}
      <main>
        {renderMainContent()}
      </main>
      {/* Render other sections */}
      <section>Other content</section>
    </div>
  );
};

export default Dashboard;