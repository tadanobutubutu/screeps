// Adding polyfill for 'role' attribute support in old browsers
const nativeDocument = document;
if (!nativeDocument.documentElement.closest) {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MOortionObserver;
  const observer = new MutationObserver(function(mutations) {
    Array.prototype.slice.call(mutations).forEach(function(mutation) {
      // Find the first match in the entire subtree, returning the element itself
      if (mutation.addedNodes.length) {
        for (let node of Array.from(mutation.addedNodes).filter(n => n.nodeType === Node.ELEMENT_NODE)) {
          if (node.localName.toLowerCase() === 'html') {
            if (node.hasAttribute('lang')) continue;
            node.setAttribute('lang', 'en');
          }

          if (node.hasAttribute('role')) continue;

          const isBanner = node.tagName.toLowerCase() === 'header';
          const isMain = node.tagName.toLowerCase() === 'main';
          const isFooter = node.tagName.toLowerCase() === 'footer';

          if (isBanner) node.setAttribute('role', 'banner');
          if (isMain) node.setAttribute('role', 'main');
          if (isFooter) node.setAttribute('role', 'contentinfo');
        }
      }
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
}