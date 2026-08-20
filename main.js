// main.js

// ... existing code above ...

// Fixed accessibility issue: changed <a href="#"> to <button>
// This improves keyboard navigation and screen reader behavior
document.getElementById('unrotate')?.replaceWith(
  Object.assign(document.createElement('button'), {
    id: 'unrotate',
    textContent: 'rotate back',
    type: 'button'
  })
);

// ... existing code below ...