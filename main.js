const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

async function getData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  return data.slice(0, 10);
}

async function fetchData() {
  let data;
  try {
    data = await getData();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { success: false, error: error.message };
  }
}

async function render(data) {
  const result = await fetchData();

  // Add role="main" and aria-label for the main element
  let mainContent = `
    <div id="root" role="document">
      <header>
        <h1>App</h1>
      </header>
  `;

  if (result.success) {
    mainContent += `
        <main role="main" aria-label="Main content">
          <h2>Data</h2>
          <ul>
            ${result.data.map(item => `<li key=${item.id}>${item.title}</li>`).join('')}
          </ul>
        </main>
    `;
  } else {
    // Error state - use <section> instead of <main> to avoid duplicate landmarks
    mainContent += `
        <section>
          <h2>Error</h2>
          <p>${result.error}</p>
        </section>
    `;
  }

  // Close the mainContent string
  mainContent += `
    </div>
  `;

  return mainContent;
}

module.exports = { render, fetchData };