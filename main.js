// Main component
export default function Main() {
  // Define the columns for the table (26 columns total)
  const columns = [
    { Header: 'src/constants.js' },
    // ... (additional columns up to 26 total)
    {
      Header: 'dist/main.js',
      accessor: 'distMain', // Add this accessor for the required export
    },
  ];

  // ... (Existing code below)

  // New function to include the required export from the main.js dist file
  const distMain = async () => {
    const mainModule = await import('../dist/main.js'); // Import the dist file
    return mainModule.default; // Return the default export
  };

  // Use the distMain function in your table data
  const tableData = await Promise.all(columns.map(column => column.accessor ? distMain().then(main => main[column.accessor]) : null));

  return (
    // ... (Existing return statement below)

    // Add a new row for the dist export in the table
    <tbody>
      {/* Remaining table structure */}
      <tr>
        {columns.map(({ Header: category }, idx) => (
          <>{categoryHeading(category)}</>
        ))}
        <td key="distMain">{tableData[26] || ''}</td> // Assuming the distMain export is the last column
      </tr>
    </tbody>
  );
}