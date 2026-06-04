# Palette's Journal - Screeps Dashboard UX/Accessibility

## 2025-05-14 - Error Messaging Usability

**Learning:** Error messages in the dashboard can be technical or long. Providing a dedicated "Copy" button in the error alert improves the user experience by making it effortless to capture these details for debugging or support.

**Action:**
- Include "Copy" buttons for transient technical data like errors or logs.
- Use `#1e7e34` for "Copied!" success state feedback.
- Ensure buttons have clear ARIA labels (e.g., `aria-label={copied ? "Copied" : "Copy error message"}`).
