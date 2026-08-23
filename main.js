// Main.js - Fixed SVG accessible name issues

const main = () => {
  console.log('Main application running');
};

// Helper function to create accessible SVG icons
export const createAccessibleSVG = (iconName, viewBox = "0 0 100 100") => (
  <svg
    viewBox={viewBox}
    role="img"
    aria-label={iconName}
    className="icon"
  >
    <title>{iconName}</title>
    {/* SVG content */}
  </svg>
);

// Helper function to create decorative SVG icons (hidden from screen readers)
export const createDecorativeSVG = (viewBox = "0 0 24 24") => (
  <svg
    viewBox={viewBox}
    aria-hidden="true"
    focusable="false"
    className="icon"
  >
    {/* SVG content */}
  </svg>
);

// Function to get icon configuration with proper accessibility
export const getIconConfig = (title, iconContent) => ({
  icon: (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {iconContent}
    </svg>
  ),
});

// Example component showing proper accessibility patterns
export default async function Home({ projects }) {
  // Define the columns for the table (26 columns total)
  const columns = [
    { Header: 'src/constants.js' },
    // ... (additional columns up to 26 total)
    {
      Header: 'dist/main.js',
      accessor: 'runMain', // Add this accessor for the required export
    },
  ];

  // New function to include the required export from the main.js dist file
  const runMainResult = await main();

  // ... Rest of the code remains the same
}

// Helper function to export projects data
export async function getStaticProps() {
  return {
    props: {
      projects: [
        { id: 1, name: 'Project Alpha', status: 'Active', updated: '2024-01-15' },
        { id: 2, name: 'Project Beta', status: 'Pending', updated: '2024-01-10' },
      ],
    },
  };
}

// Preserve any existing utility functions
export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export function validateProject(project) {
  if (!project.name || typeof project.name !== 'string') {
    return { valid: false, error: 'Project name is required' };
  }
  if (!project.status || !['Active', 'Pending', 'Completed', 'Archived'].includes(project.status)) {
    return { valid: false, error: 'Invalid project status' };
  }
  return { valid: true };
}

// Existing export that must be preserved
export const PROJECT_STATUSES = ['Active', 'Pending', 'Completed', 'Archived'];