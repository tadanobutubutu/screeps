import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard';

// Assuming that Dashboard component is structured like this:
class Dashboard extends React.Component {
  render() {
    const { isLoading, error, data } = this.props;

    if (isLoading) {
      // Render a loading state
      return <div>Loading...</div>;
    }

    if (error) {
      // Render an error state with a different <main> element
      return (
        <main>
          <h1>Error</h1>
          <p>{error.message}</p>
        </main>
      );
    }

    // Render the success state with the primary content wrapped in a <main>
    return (
      <main>
        {/* Render your main content here */}
        <h1>Success</h1>
        {/* Render the data here */}
      </main>
    );
  }
}

ReactDOM.render(
  <Dashboard isLoading={false} error={null} data={/* data to display */} />,
  document.getElementById('root')
);