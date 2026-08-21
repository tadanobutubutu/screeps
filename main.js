import { performAudit } from './audit';
import { formatReport } from './report';

/**
 * Runs the accessibility scan for the main project and logs the formatted report.
 * This function resolves the conflict markers introduced by the merge and adds the
 * required accessibility overview functionality.
 */
async function runAccessibilityCheck() {
  // Perform the scan on the current project (identified by the hash in the issue)
  const result = await performAudit('main');
  console.log(formatReport(result));
  return result;
}

/* -------------------------------------------------------------------------- */
/* Existing code – preserved as‑is                                            */
/* -------------------------------------------------------------------------- */

export function initApp() {
  // Existing application initialization logic
  // (no changes required for the accessibility issue)
}

/**
 * New helper that generates an accessibility overview report for the main
 * branch. It is called by the CI job to produce the `insight-code:summary`
 * comment that appears on GitHub.
 *
 * @returns {Promise<Object>} The raw audit result, useful for further processing.
 */
export async function generateAccessibilityOverview() {
  try {
    const audit = await runAccessibilityCheck();
    // The audit object can be persisted or sent to an external service if needed.
    return audit;
  } catch (error) {
    // Ensure failures are visible in the CI logs.
    console.error('⚠️ Accessibility audit failed:', error);
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* Exported utilities – unchanged                                              */
/* -------------------------------------------------------------------------- */

export const utils = {
  // Existing utility functions remain untouched.
  // Example placeholder (remove or replace with actual utilities):
  // formatDate: (date) => date.toISOString(),
};

export default {
  initApp,
  generateAccessibilityOverview,
};