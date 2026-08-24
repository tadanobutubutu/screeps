// Fix for REACT_036: replace fake <a href="#"> with a proper <button>
(function () {
  'use strict';

  function fixUnrotate() {
    var link = document.getElementById('unrotate');
    if (!link || link.tagName.toLowerCase() !== 'a') {
      return;
    }

    var btn = document.createElement('button');
    btn.id = link.id;
    btn.textContent = link.textContent || 'rotate back';
    btn.setAttribute('type', 'button');

    if (typeof link.onclick === 'function') {
      btn.onclick = link.onclick;
    }

    link.parentNode.replaceChild(btn, link);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixUnrotate);
  } else {
    fixUnrotate();
  }

  // Preserve any existing module exports
  if (typeof exports === 'object' && typeof module !== 'undefined' && module.exports) {
    module.exports.fixUnrotate = fixUnrotate;
  }
})();