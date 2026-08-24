// Based on the issue description, here's the fix for having multiple <main> landmarks
// The component has two <main> elements - one for error state and one for success state
// Fix: Keep only ONE <main> landmark and use <section> for the other region

// Example fix pattern:
export function SomeComponent({ hasError, errorContent, successContent }) {
  if (hasError) {
    return (
      <section aria-label="Error">
        {errorContent}
      </section>
    );
  }
  
  return (
    <main>
      {successContent}
    </main>
  );
}

// Alternatively, you could wrap everything in one main:
export function SomeComponentAlt({ hasError, errorContent, successContent }) {
  return (
    <main>
      {hasError ? (
        <section aria-label="Error">
          {errorContent}
        </section>
      ) : (
        {successContent}
      )}
    </main>
  );
}