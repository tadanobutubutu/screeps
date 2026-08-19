// [Your existing imports and code above]

// Add accessibility attributes to SVGs in layout files
const enhancedSvg = (svg) => {
  return React.cloneElement(svg, {
    'aria-hidden': 'true',
    ...svg.props
  });
};

// [Your existing code below]

// Example of how you might use this in your layout components:
// <head>
//   <link rel="icon" href={enhancedSvg(<svg>...</svg>)} />
// </head>