// Adding accessible names to 2 SVGs
// Let's assume that we have two SVG components, LineChartSvg and BarChartSvg
// We will add a label prop to both components and use it to provide an accessible name

// LineChartSvg.js
import React from 'react';

const LineChartSvg = ({ label }) => (
  // ... other code
  <svg aria-labelledby="Line Chart Label">
    // ... other code
  </svg>
);

LineChartSvg.defaultProps = {
  label: 'Line Chart',
};

export default LineChartSvg;

// BarChartSvg.js
import React from 'react';

const BarChartSvg = ({ label }) => (
  // ... other code
  <svg aria-labelledby="Bar Chart Label">
    // ... other code
  </svg>
);

BarChartSvg.defaultProps = {
  label: 'Bar Chart',
};

export default BarChartSvg;

// Ensuring unique landmarks (2 issues)
// Let's assume that our Dashboard component has several sections, and we will use a unique key for each section's landmark

// Dashboard.js
import React from 'react';
import LineChartSvg from './LineChartSvg';
import BarChartSvg from './BarChartSvg';

const Dashboard = () => (
  <div>
    { /* Any other sections in your Dashboard */ }

    <section aria-labelledby="Line Chart Label" id="LineChart">
      <LineChartSvg />
    </section>

    <section aria-labelledby="Bar Chart Label" id="BarChart">
      <BarChartSvg />
    </section>
  </div>
);

export default Dashboard;