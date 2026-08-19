// Before
//<<<<<<< Updated upstream
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// 
//ReactDOM.render(
//  <React.StrictMode>
//    <App />
//  </React.StrictMode>,
//  document.getElementById('root')
//);
//=======
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// 
// ReactDOM.render(
//  <React.StrictMode>
//    <Router>
//      <Switch>
//        <Route path="/dashboard" component={DashboardApp} />
//        {/* ... other routes ... */}
//        <Route path="/" exact component={App} />
//      </Switch>
//    </Router>
//  </React.StrictMode>,
//  document.getElementById('root')
//);
//>>>>>>> Stashed changes

// After
//<<<<<<< Updated upstream
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import DashboardApp from './DashboardApp'; // Assuming this is the component for the dashboard
// 
// ReactDOM.render(
//  <React.StrictMode>
//    <Router>
//      <Switch>
//        <Route path="/dashboard" component={DashboardApp}>
//          <main>
//            {/* Dashboard content goes here */}
//          </main>
//        </Route>
//        {/* ... other routes ... */}
//        <Route path="/" exact component={App}>
//          <main>
//            {/* App content goes here */}
//          </main>
//        </Route>
//      </Switch>
//    </Router>
//  </React.StrictMode>,
//  document.getElementById('root')
//);
//>>>>>>> Stashed changes