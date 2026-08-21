export const SkipLink = ({ href = '#main-content', children = 'Skip to main content' }) => {
  return (
    <a
      href={href}
      className="skip-link"
      aria-label="Skip to main content"
      style={{
        position: 'absolute',
        top: '-40px',
        left: '0',
        background: '#000',
        color: '#fff',
        padding: '8px',
        zIndex: 100,
        transition: 'top 0.3s ease'
      }}
    >
      {children}
    </a>
  );
};