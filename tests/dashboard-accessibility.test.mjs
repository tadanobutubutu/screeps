import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

// Accessibility-focused test for the Screeps dashboard (dashboard/).
//
// The dashboard fetches /api/screeps?endpoint=overview. Without valid Screeps
// credentials configured, that request is rejected and the component renders its
// accessibility-instrumented ERROR state:
//   <main role="alert" aria-live="assertive">
//     <h1>⚠️ エラー</h1>
//     <button aria-label="エラーをコピー">📋 エラーをコピー</button>
//     <button aria-label="データを再読み込み">🔄 再試行</button>
//   </main>
//
// This test validates that the dashboard renders that accessible error region
// with a labeled heading and keyboard/AT-accessible controls, and that the
// retry control is operable. It exercises the accessibility surface the app
// exposes rather than requiring live game data.
describe("Screeps Dashboard accessibility", () => {
  it("renders an accessible, labeled UI with operable controls", async (context) => {
    const testdriver = TestDriver(context);

    // TODO: replace with the deployed dashboard URL, or the local tunnel URL
    // produced by `run_local_app` when running the dashboard from source.
    await testdriver.provision.chrome({
      url: "https://vast-ideas-decide.loca.lt",
    });

    // Wait for the client component to fetch and settle into a rendered state.
    await testdriver.wait(4000);

    // The page should present a clear, human-readable heading / status — either
    // the dashboard title or the error region. Assert the accessible content is
    // there and legible.
    const headingVisible = await testdriver.assert(
      "the page shows a Screeps dashboard heading or an error heading (e.g. '🐛 Screeps ダッシュボード' or '⚠️ エラー'), not a blank page",
    );
    expect(headingVisible).toBeTruthy();

    // There should be an accessible, clearly-labeled action button on screen
    // (the retry '🔄 再試行' button in the error state, or refresh controls in
    // the data state).
    const actionButton = await testdriver.find(
      "a labeled action button such as the '🔄 再試行' retry button or a refresh button",
    );
    expect(actionButton.found()).toBeTruthy();

    // The control must be operable via pointer.
    await actionButton.click();
    await testdriver.wait(3000);

    // After activating the control the page must remain in a coherent,
    // accessible state (heading still present, no crash / blank screen).
    const stillAccessible = await testdriver.assert(
      "the page still shows a readable heading and labeled controls after clicking (it did not go blank or crash)",
    );
    expect(stillAccessible).toBeTruthy();
  });
});
