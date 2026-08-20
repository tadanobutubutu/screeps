import React from 'react';
import './styles.css';

const TableComponent = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Role</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Alice Johnson</td>
          <td>Developer</td>
          <td>Active</td>
        </tr>
        <tr>
          <td>Bob Smith</td>
          <td>Designer</td>
          <td>Inactive</td>
        </tr>
      </tbody>
    </table>
  );
};

const RotateBackButton = () => (
  <button id="unrotate" onClick={() => { console.log('Rotate back action triggered'); }}>rotate back</button>
);

const MyTableComponent = () => {
  return (
    <table role="grid">
      <thead>
        {/* Table header code */}
      </thead>
      <tbody>
        {/* Table body code */}
      </tbody>
    </table>
  );
};

const LandingPage = () => {
  return (
    <div>
      <header role="banner">Header Content</header>
      <main role="main">Main Content</main>
      <footer role="contentinfo">Footer Content</footer>
    </div>
  );
};

const LinkComponent = (props) => {
  return (
    <a href={props.href} id={props.id}>
      {props.children}
    </a>
  );
};

const SvgIcon = (props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {props.children}
    </svg>
  );
};

const FunctionalComponent = () => {
  // Add the necessary role, property, or ARIA attribute here
};

export { TableComponent, RotateBackButton, MyTableComponent, LandingPage, LinkComponent, SvgIcon, FunctionalComponent };