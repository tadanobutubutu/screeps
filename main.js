// TODO: Address accessibility issues from insight report: in main.js

const tableContent = `
  <table>
    <thead>
      <tr>
        <th scope="col">Column 1</th>
        <th scope="col">Column 2</th>
        <th scope="col">Column 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
        <td>Data 3</td>
      </tr>
      <!-- More rows -->
    </tbody>
  </table>
`;

export const renderTable = (containerId) => {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = tableContent;
  }
};

export const submitButton = document.getElementById('submit-btn');
export const resetButton = document.getElementById('reset-btn');

document.querySelector('#app').innerHTML = tableContent;