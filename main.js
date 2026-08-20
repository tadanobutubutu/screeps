// Table structure with accessible headers
const tableHeaders = [
  '<th scope="col">Header 1</th>',
  '<th scope="col">Header 2</th>',
  '<th scope="col">Header 3</th>',
  '<th scope="col">Header 4</th>',
  '<th scope="col">Header 5</th>',
  '<th scope="col">Header 6</th>',
  '<th scope="col">Header 7</th>',
  '<th scope="col">Header 8</th>',
  '<th scope="col">Header 9</th>',
  '<th scope="col">Header 10</th>',
  '<th scope="col">Header 11</th>',
  '<th scope="col">Header 12</th>',
  '<th scope="col">Header 13</th>',
  '<th scope="col">Header 14</th>',
  '<th scope="col">Header 15</th>',
  '<th scope="col">Header 16</th>',
  '<th scope="col">Header 17</th>',
  '<th scope="col">Header 18</th>',
  '<th scope="col">Header 19</th>',
  '<th scope="col">Header 20</th>',
  '<th scope="col">Header 21</th>',
  '<th scope="col">Header 22</th>',
  '<th scope="col">Header 23</th>',
  '<th scope="col">Header 24</th>',
  '<th scope="col">Header 25</th>',
  '<th scope="col">Header 26</th>'
];

function renderTable() {
  return `<table>
  <thead>
    <tr>
      ${tableHeaders.join('\n      ')}
    </tr>
  </thead>
  <tbody>
    <tr>
      <td scope="row">Row 1</td>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>`;
}

module.exports = { tableHeaders, renderTable };