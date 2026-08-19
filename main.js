html
const table = document.getElementById("dependencyGraphTable");
const headers = table.getElementsByTagName("th");

// Iterate through all header cells and add "scope" attribute
for (let i = 0; i < headers.length; i++) {
  if (headers[i].children.length > 0) {
    headers[i].setAttribute("scope", "col");
  }
}