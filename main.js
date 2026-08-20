<<<<<<< HEAD >>
import React from 'react';

const TableComponent = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Role</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Alice Johnson</td>
          <td>Developer</td>
          <td>Active</td>
        </tr>
        <tr>
          <td>Bob Smith</td>
          <td>Designer</td>
          <td>Inactive</td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableComponent;
=======
// Existing code from main.js (before conflict markers)
// ... (code before conflict)
// <<<<<<< HEAD // <a id="unrotate" href="#">rotate back</a> // ======= // <button id="unrotate" onClick={() => {/* Your action here */}}>rotate back</button> // >>>>>>> origin/main // ... (code after conflict)
// Existing code from main.js (after conflict markers)
// ... (code after conflict)
>>>>>>>> origin/main
<!-- Existing HTML content before conflict markers -->
<div>
  <!-- ... -->
</div>

<!-- Resolved conflict: replaced anchor with button -->
<button id="unrotate" onClick={() => { console.log('Rotate back action triggered'); }}>rotate back</button>

<!-- Existing HTML content after conflict markers -->
<!-- ... -->
<!-- End of file -->