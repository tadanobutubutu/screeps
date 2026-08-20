// Fixed main.js with <main> landmark and scope attributes on <th> elements
export const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Screeps Dashboard</title>
</head>
<body>
  <header>
    <nav>...</nav>
  </header>
  <main>
    <h1>Metrics</h1>
    <table>
      <thead>
        <tr>
          <th scope="col">Metric</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Active Players</td>
          <td>1234</td>
        </tr>
      </tbody>
    </table>
  </main>
  <footer>© 2025 Screeps</footer>
</body>
</html>
`;

export function render() {
  document.body.innerHTML = html;
}