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
  
  if (result.success) {
    // Success state - use <main>
    return `
      <div id="root">
        <header>
          <h1>App</h1>
        </header>
        <main>
          <h2>Data</h2>
          <ul>
            ${result.data.map(item => `<li key=${item.id}>${item.title}</li>`).join('')}
          </ul>
        </main>
      </div>
    `;
  } else {
    // Error state - use <section> instead of <main> to avoid duplicate landmarks
    return `
      <div id="root">
        <header>
          <h1>App</h1>
        </header>
        <section>
          <h2>Error</h2>
          <p>${result.error}</p>
        </section>
      </div>
    `;
  }
}

module.exports = { render, fetchData };