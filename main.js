// Fixed layout icon definitions for REACT_041 — added aria-hidden="true" to decorative SVGs

export const dashboardLayout = {
  icons: {
    icon: ... ... viewBox=%220 0 100 100%22 ... Dashboard</title><text y=%22.9em%22 ...
  },
};

export const appLayout = {
  icons: {
    icon: ... ... viewBox=%220 0 100 100%22 aria-hidden=%22true%22><text y=%22.9em%22 ...
  },
};

// Fixed REACT_025 — React Unique Landmarks
// Changed additional <main> landmarks to <section> to ensure only one <main> per page

export const successLayout = {
  main: {
    role: 'main',
    'aria-label': 'Success content',
  },
};

export const errorLayout = {
  section: {
    role: 'region',
    'aria-label': 'Error content',
  },
};