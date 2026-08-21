export function SemanticLinks({ href, children, onClick }) {
  if (href) {
    return <a href={href}>{children}</a>;
  }
  // If it doesn't navigate, use a button with onClick and the appropriate role for a button
  return <button onClick={onClick} role="button">{children}</button>;
}