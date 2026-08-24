const tableWithIssues = [
  ['Id1', 'Name1', 'Type1'],
  ['Id2', 'Name2', 'Type2'],
  ['Id3', 'Name3', 'Type3'],
  ['Id4', '', ''], // Empty cells will be removed
  ['', '', ''], // Rows with no values will be removed
];

const tableWithoutIssues = [
  ['Id1', 'Name1', 'Type1'],
  ['Id2', 'Name2', 'Type2'],
  ['Id3', 'Name3', 'Type3'],
];