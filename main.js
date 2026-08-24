// Addressed accessibility issues from insight report
function generateInsightReport() {
  return `<main role="main" aria-label="Insight Report" tabindex="0">
  <h1>Insight Report</h1>
</main>`;
}

module.exports = generateInsightReport;
module.exports.generateInsightReport = generateInsightReport;