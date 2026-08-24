/* Preserved from current main.js:
Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?
*/

/* Fix REACT_036: Replace hash-only anchor with a real button for in-page actions */
(function fixFakeLink() {
  const el = document.getElementById('unrotate');
  if (el && el.tagName === 'A' && el.getAttribute('href') === '#') {
    const btn = document.createElement('button');
    btn.id = 'unrotate';
    btn.type = 'button';
    btn.textContent = el.textContent || 'rotate back';
    if (el.className) btn.className = el.className;
    el.parentNode.replaceChild(btn, el);
  }
})();