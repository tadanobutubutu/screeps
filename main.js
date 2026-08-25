const originalSvg = require('./path/to/original/svg').default; // replace with the correct path

function mockSvg(props) {
  const svg = originalSvg(props);
  if (svg.type === 'svg') {
    svg.props.ariaHidden = true;
  }
  return svg;
}

module.exports = { mockSvg };