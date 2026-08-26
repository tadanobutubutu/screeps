tsx
// Import necessary components
import SomeChildComponent from './SomeChildComponent';

// Replace the second <main> with <SomeChildComponent> or another appropriate component
// if it isn't your intention to use multiple main landmarks on this page

// Dashboard.tsx:320 (Error state return path)
// Replace the second <main> with a <section> or <div>
<section style={{ display: error ? 'block' : 'none' }}>
  {/* Error state content */}
</section>

// Dashboard.tsx:XYZ (Success state return path)
// Wrap main content with a <section> or <div> for proper landmarking
<section>
  {/* Success state content (including the first <main>) */}
</section>