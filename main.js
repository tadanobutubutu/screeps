// main.js

// Assuming you have an external HTML file with a table structure
// You would include this HTML file within your JavaScript file like this:

document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Table</title>
</head>
<body>
    <script type="text/javascript">
        // JavaScript code can go here, or be linked as an external script file
    </script>
    <table>
        <thead>
            <tr>
                <th scope="col">Header 1</th>
                <th scope="col">Header 2</th>
                <th scope="col">Header 3</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Row 1, Cell 1</td>
                <td>Row 1, Cell 2</td>
                <td>Row 1, Cell 3</td>
            </tr>
            <tr>
                <td>Row 2, Cell 1</td>
                <td>Row 2, Cell 2</td>
                <td>Row 2, Cell 3</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
`);