// Example module where you handle SVG data URLs
export function getDecorativeSvgData(iconName) {
  // This function would typically fetch the SVG data from a file or an API
  // For the sake of this example, we're using a static data URL
  const svgDataUrl = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>`;
  return {
    icon: `aria-hidden="true" ${svgDataUrl}`
  };
}

// This is just an example usage in another module or component
import { getDecorativeSvgData } from './path-to-your-module';

const iconComponent = () => {
  // Assume iconName is dynamically obtained
  const { icon } = getDecorativeSvgData('your-icon-name');

  return <img src={icon} alt="" />;
};

export default iconComponent;