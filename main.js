// Assuming you're adding the scope attributes to the th elements inside the table in 'myTable' id
const myTable = document.getElementById('myTable');
const tableHead = myTable.getElementsByTagName('thead')[0];
const headers = tableHead.getElementsByTagName('th');

for (let i = 0; i < headers.length; i++) {
  headers[i].setAttribute('scope', 'col');
}