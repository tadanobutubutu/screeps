// Importing necessary files
import React from 'react';
import { connect } from 'react-redux';
import { Gradebook } from './components/gradebook';
import { DateRangePicker } from './components/date-range-picker';

// Component setup
const App = ({ dateRange }) => {
  return (
    <main>
      <Gradebook dateRange={dateRange} />
    </main>
  );
};

// Exporting using connect function
const mapStateToProps = state => ({
  dateRange: state.dateRange
});

export default connect(mapStateToProps)(App);