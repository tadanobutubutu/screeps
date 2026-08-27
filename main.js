import React from 'react';

class Dashboard extends React.Component {
  render() {
    const { isError, isSuccess, errorContent, successContent } = this.props;

    // Render the main content based on the current state
    let mainContent;
    if (isError) {
      mainContent = <div>{errorContent}</div>;
    } else if (isSuccess) {
      mainContent = <div>{successContent}</div>;
    } else {
      mainContent = <div>Default content</div>;
    }

    return (
      <div>
        {mainContent}
        {/* Other components or content */}
      </div>
    );
  }
}

export default Dashboard;