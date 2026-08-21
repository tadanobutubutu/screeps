import express from 'express'; // update express to v5.0.0
const expressApp = express();

if (require.main === module) {
  const app = expressApp;
  // ... rest of the existing code
}

// ... rest of the existing exports

// Accessibility helpers
const isAccessible = (component) => {
  const checks = {
    role: !!component.props.role,
    tabIndex: component.props.tabIndex !== undefined,
    onKeyDown: !!component.props.onKeyDown,
    ariaLabel: !!component.props['aria-label'],
    ariaDescribedby: !!component.props['aria-describedby'],
    keyboardSupport: !!component.props.onKeyDown,
    screenReaderText: !!component.props['aria-label'],
  };

  return Object.values(checks).every(check => check);
};

const createAccessibleComponent = (BaseComponent, props) => {
  return {
    __html: BaseComponent,
    ...props,
    role: 'button',
    tabIndex: props.disabled ? -1 : 0,