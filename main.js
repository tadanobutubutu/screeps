// Accessibility issues addressed per insight report

function addProperLandmarkRegions() {
    // Add proper landmark regions for accessibility
    const body = document.body;

    // Ensure banner role for header
    let banner = document.querySelector('header[role="banner"], [role="banner"]');
    if (!banner) {
        banner = document.querySelector('header');
        if (banner && !banner.getAttribute('role')) {
            banner.setAttribute('role', 'banner');
        }
    }

    // Ensure main landmark
    let main = document.querySelector('main[role="main"], [role="main"], main');
    if (!main) {
        main = document.createElement('main');
        main.setAttribute('role', 'main');
        const headerEl = document.querySelector('header');
        if (headerEl && headerEl.parentNode) {
            headerEl.parentNode.insertBefore(main, headerEl.nextSibling);
        } else {
            body.insertBefore(main, body.firstChild);
        }
    } else if (!main.getAttribute('role')) {
        main.setAttribute('role', 'main');
    }

    // Ensure contentinfo role for footer
    let contentinfo = document.querySelector('footer[role="contentinfo"], [role="contentinfo"]');
    if (!contentinfo) {
        contentinfo = document.querySelector('footer');
        if (contentinfo && !contentinfo.getAttribute('role')) {
            contentinfo.setAttribute('role', 'contentinfo');
        }
    }

    // Ensure navigation role for nav elements
    const navs = document.querySelectorAll('nav');
    navs.forEach((nav) => {
        if (!nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
        }
    });
}

module.exports = { addProperLandmarkRegions };