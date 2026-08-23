// Example of how to dynamically add the scope attribute to th elements
const tableElements = document.querySelectorAll('th');
tableElements.forEach((th) => {
  th.setAttribute('scope', 'col');
});

// import React from 'react';

// const MyComponent = () => {
//   return <div lang="en">Content here</div>;
// };

// export default MyComponent;