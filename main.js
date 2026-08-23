// main.js
function RotateControl({ onUnrotate }) {
  return {
    type: 'div',
    props: {
      className: 'rotate-controls',
      children: [
        {
          type: 'button',
          props: {
            id: 'unrotate',
            onClick: onUnrotate,
            children: 'rotate back'
          }
        }
      ]
    }
  };
}

function App({ imageRotated, onRotate }) {
  return {
    type: 'div',
    props: {
      children: [
        {
          type: RotateControl,
          props: {
            onUnrotate: () => onRotate(0)
          }
        }
      ]
    }
  };
}

module.exports = { RotateControl, App };