import React, { useState, useEffect } from 'react';
import { useState as useStateNew } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers/rootReducer';
import { DashboardData } from '../types/dashboardTypes';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { DashboardStats } from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import { DashboardActions } from './DashboardActions';

// Helper function to create accessible SVG elements
function createAccessibleSvg(props) {
  return (
    <svg
      {...props}
      aria-hidden={props['aria-hidden'] || "true"}
      role={props.role || "img"}
    >
      {props.children}
    </svg>
  );
}

// Function to ensure main element has proper role
function addLandmarks() {
  // Add main landmark if not present
  if (!document.querySelector('main')) {
    const mainElement = document.createElement('main');
    const body = document.querySelector('body');
    if (body) {
      // Move all existing content into the main element
      while (body.firstChild) {
        mainElement.appendChild(body.firstChild);
      }
      body.appendChild(mainElement);
    }
  }

  // Ensure main has proper role
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }
}

// Main Dashboard component
export const Dashboard: React.FC<DashboardProps> = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  
  // State for active tab
  const [activeTab, setActiveTab] = useStateNew<string>('overview');
  
  // Additional state from conflict
  const [anotherState, setAnotherState] = useStateNew({});

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return (
      <main className="dashboard-container" aria-busy="true">
        <LoadingSpinner aria-label="Loading dashboard data" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-container" role="alert">
        <ErrorDisplay message={error} />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="dashboard-container">
        <div>No data available</div>
      </main>
    );
  }

  return (
    <main className="dashboard-container" lang="en">
      <div className="dashboard-header" role="banner">
        <h1>Dashboard</h1>
        <div className="dashboard-tabs" role="tablist" aria-label="Dashboard navigation">
          <button
            role="tab"
            aria-selected={activeTab === 'overview'}
            aria-controls="overview-tab"
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'analytics'}
            aria-controls="analytics-tab"
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'actions'}
            aria-controls="actions-tab"
            className={activeTab === 'actions' ? 'active' : ''}
            onClick={() => setActiveTab('actions')}
          >
            Actions
          </button>
        </div>
      </div>

      <div className="dashboard-content" role="main">
        {activeTab === 'overview' && (
          <section className="dashboard-section" id="overview-tab" role="tabpanel" aria-labelledby="overview-tab">
            <DashboardStats data={data.stats} />
          </section>
        )}
        {activeTab === 'analytics' && (
          <section className="dashboard-section" id="analytics-tab" role="tabpanel" aria-labelledby="analytics-tab">
            <DashboardCharts data={data.charts} />
          </section>
        )}
        {activeTab === 'actions' && (
          <section className="dashboard-section" id="actions-tab" role="tabpanel" aria-labelledby="actions-tab">
            <DashboardActions data={data.actions} />
          </section>
        )}
      </div>
    </main>
  );
};

// Example of an accessible SVG
function Icon() {
  return (
    <svg aria-label="Example icon" width="24" height="24">
      {/* SVG content */}
    </svg>
  );
}

// Example of a proper link
function ButtonLink() {
  return (
    <a href="/destination" role="button">
      Click me
    </a>
  );
}

// Preserve all existing exports
export default App;
export { DataTable, Layout, createAccessibleSvg, Icon, ButtonLink };

// Starting the application
main();