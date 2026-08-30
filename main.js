// Assuming we have an object `data` that we want to generate a report for
const data = {
  reportTitle: 'Monthly Sales Report',
  reportDate: new Date().toLocaleDateString(),
  salesData: [
    { region: 'North', sales: 15000 },
    { region: 'South', sales: 18000 },
    { region: 'East', sales: 20000 },
    { region: 'West', sales: 25000 }
  ]
};

function generateReport(data) {
  let report = `Report Title: ${data.reportTitle}\n`;
  report += `Report Date: ${data.reportDate}\n`;
  report += 'Sales by Region:\n';
  data.salesData.forEach(sale => {
    report += `  ${sale.region}: $${sale.sales}\n`;
  });
  return report;
}

// You can now call generateReport with the data object to get the report text
const reportText = generateReport(data);

// TODO: Replace with actual report generation logic.
console.log(reportText);