// Before:
// <<<<<<< HEAD
// <table>
//   <thead>
//     <tr>
//       <th><div>Header 1</div></th>
//       <th><div>Header 2</div></th>
//     </tr>
//   </thead>
//   <tbody>
//     <tr>
//       <td>Data 1</td>
//       <td>Data 2</td>
//     </tr>
//   </tbody>
// </table>
// =======
// <table>
//   <thead>
//     <tr>
//       <th><div>Header 1</div></th>
//       <th><div>Header 2</div></th>
//     </tr>
//   </thead>
//   <tbody>
//     <tr>
//       <td>Data 1</td>
//       <td>Data 2</td>
//     </tr>
//   </tbody>
// </table>
// >>>>>>> origin/main
// </script>

// After:
// <script>
//   // <<<<<<< HEAD
//   <table>
//     <thead>
//       <tr>
//         <th scope="col"><div>Header 1</div></th>
//         <th scope="col"><div>Header 2</div></th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//         <td>Data 1</td>
//         <td>Data 2</td>
//       </tr>
//     </tbody>
//   </table>
//   // =======
//   <table>
//     <thead>
//       <tr>
//         <th scope="col"><div>Header 1</div></th>
//         <th scope="col"><div>Header 2</div></th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//         <td>Data 1</td>
//         <td>Data 2</td>
//       </tr>
//     </tbody>
//   </table>
//   // >>>>>>> origin/main
// </script>