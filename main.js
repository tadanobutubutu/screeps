// Assuming main.js contains the following table structure with problematic <th> tags:

// Original problematic code:
// <table>
//   <thead>
//     <tr>
//       <th>Column 1</th>
//       <th>Column 2</th>
//       <th>Column 3</th>
//     </tr>
//   </thead>
//   <tbody>
//     <tr>
//       <td>Data 1</td>
//       <td>Data 2</td>
//       <td>Data 3</td>
//     </tr>
//   </tbody>
// </table>

// Updated code with scope attribute added to <th> tags:
// <table>
//   <thead>
//     <tr>
//       <th scope="col">Column 1</th>
//       <th scope="col">Column 2</th>
//       <th scope="col">Column 3</th>
//     </tr>
//   </thead>
//   <tbody>
//     <tr>
//       <td>Data 1</td>
//       <td>Data 2</td>
//       <td>Data 3</td>
//     </tr>
//   </tbody>
// </table>