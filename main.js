import { validateData } from './utils/validation.js';
import { formatDate } from './utils/formatters.js';
import { calculateTotal } from './utils/calculations.js';
import { logMessage } from './utils/logger.js';
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { renderChart } from './components/chart.js';

// TODO: Add these imported modules to the relevant rendering functions

function renderUserProfile(userData, container) {
  const profile = document.createElement('div');
  profile.className = 'user-profile';
  
  const header = document.createElement('h1');
  header.textContent = userData.name;
  profile.appendChild(header);
  
  const details = document.createElement('div');
  details.className = 'details';
  details.textContent = `Joined: ${userData.joinDate}`;
  profile.appendChild(details);
  
  container.appendChild(profile);
  return profile;
}

function renderDashboard(data, container) {
  const dashboard = document.createElement('div');
  dashboard.className = 'dashboard';
  
  const stats = document.createElement('div');
  stats.className = 'stats';
  stats.textContent = `Total items: ${data.items.length}`;
  dashboard.appendChild(stats);
  
  const list = document.createElement('ul');
  data.items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    list.appendChild(li);
  });
  dashboard.appendChild(list);
  
  container.appendChild(dashboard);
  return dashboard;
}

function renderTransactionHistory(transactions, container) {
  const history = document.createElement('div');
  history.className = 'transaction-history';
  
  transactions.forEach(tx => {
    const item = document.createElement('div');
    item.className = 'transaction';
    item.textContent = `${tx.type}: $${tx.amount}`;
    history.appendChild(item);
  });
  
  container.appendChild(history);
  return history;
}

export { renderUserProfile, renderDashboard, renderTransactionHistory };