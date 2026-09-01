import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

// Validates the landmark structure of the Screeps dashboard (dashboard/) for
// accessibility issues — acting on the intent of issue #153989
// ("Validate the landmark structure for accessibility issues").
//
// The dashboard renders its loading, error, and success states inside <main>
// landmarks (see dashboard/app/layout.tsx and dashboard/components/Dashboard.tsx).
// Set DASHBOARD_URL to the running dashboard (defaults to localhost:3000).
const DASHBOARD_URL = process.env.DASHBOARD_URL || "http://localhost:3000";

describe("Screeps dashboard — landmark / accessibility structure", () => {
  it("exposes a single, well-formed main landmark with accessible controls", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: DASHBOARD_URL });

    // The dashboard fetches /api/screeps, which requires auth. Without a
    // DASHBOARD_SECRET it returns 401, so the UI settles on its error state —
    // which is itself wrapped in a <main role="alert"> landmark. Either the
    // success or the error state must present a top-level main landmark.
    await testdriver.wait(4000);

    // 1) There must be exactly one primary landmark region for the page content.
    const mainLandmark = await testdriver.assert(
      "the page content is contained within a single main content region (a <main> landmark), and there are not two competing/nested main regions",
    );
    expect(mainLandmark).toBeTruthy();

    // 2) The document exposes a language for assistive tech (layout sets lang=\"ja\").
    const hasLang = await testdriver.assert(
      "the page presents readable content with a defined document language (not an untitled or language-less blank page)",
    );
    expect(hasLang).toBeTruthy();

    // 3) Interactive controls have accessible names (aria-label / title / text),
    //    not bare icon buttons with no label.
    const labeledControls = await testdriver.assert(
      "every visible button or control has a discernible text label or an accessible name — there are no unlabeled icon-only controls",
    );
    expect(labeledControls).toBeTruthy();

    // 4) A top-level heading is present to anchor the landmark structure.
    const hasHeading = await testdriver.assert(
      "the page shows a top-level heading identifying it (for example an error heading or the dashboard title)",
    );
    expect(hasHeading).toBeTruthy();
  });
});
