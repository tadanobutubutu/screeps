// Before:
import FaviconSVG from './path/to/faviconSVG';

function Layout() {
  return (
    <div>
      {/* Other components */}
      <FaviconSVG />
    </div>
  );
}

export default Layout;

// After:
import FaviconSVG from './path/to/faviconSVG';

function Layout() {
  return (
    <div>
      {/* Other components */}
      <FaviconSVG aria-label="Favicon" />
    </div>
  );
}

export default Layout;