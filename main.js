const { icons } = require('./app/layout');
const { icons: dashboardIcons } = require('./dashboard/app/layout');

exports.default = { 
  ...icons,
  ...dashboardIcons,
};