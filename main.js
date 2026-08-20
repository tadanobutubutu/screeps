// main.js
const app = {
  // Table structure with proper scope attributes for accessibility
  table: `
    <table id="data-table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Role</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Alice</td>
          <td>Developer</td>
          <td>Active</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Bob</td>
          <td>Designer</td>
          <td>Inactive</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Charlie</td>
          <td>Manager</td>
          <td>Active</td>
        </tr>
      </tbody>
    </table>
  `,
  
  // Additional components remain unchanged
  components: [
    { id: 'header', html: '<h1>User Data</h1>' },
    { id: 'body', html: '<p>Sample table data</p>' }
  ]
};

export default app;