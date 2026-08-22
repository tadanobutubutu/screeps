export function createHtmlElement(language = 'en') {  
  return {  
    type: 'html',  
    props: {  
      lang: language,  
      children: []  
    }  
  };  
}  

// Fix REACT_027: Proper table structure with th scope  
export function createTable(headers, rows) {  
  return {  
    type: 'table',  
    props: {  
      children: [  
        {  
          type: 'thead',  
          props: {  
            children: [  
              {  
                type: 'tr',  
                props: {  
                  children: headers.map(header => ({  
                    type: 'th',  
                    props: {  
                      scope: 'col',  
                      children: [header]  
                    }  
                  }))  
                }  
              }  
            ]  
          }  
        },  
        {  
          type: 'tbody',  
          props: {  
            children: rows.map(row => ({  
              type: 'tr',  
              props: {  
                children: row.map(cell => ({  
                  type: 'td',  
                  props: {  
                    children: [cell]  
                  }  
                }))  
              }  
            }))  
          }  
        }  
      ]  
    }  
  };  
}  

// Fix REACT_041: SVG must have accessible name via aria-label, title, or role="img" with aria-labelledby  
export function createSvgIcon(iconName, children = []) {  
  return {  
    type: 'svg',  
    props: {  
      'aria-label': iconName,  
      role: 'img',  
      children: children  
    }  
  };  
}  

// Fix REACT_025 & REACT_017: Use semantic landmark elements with unique labels  
export function createPageLayout(children) {  
  return {  
    type: 'div',  
    props: {  
      children: [  
        {  
          type: 'header',  
          props: {  
            role: 'banner',  
            children: children.header || []  
          }  
        },  
        {  
          type: 'nav',  
          props: {  
            'aria-label': 'Main navigation',  
            children: children.nav || []  
          }  
        },  
        {  
          type: 'main',  
          props: {  
            role: 'main',  
            'aria-label': 'Main content', // Unique landmark label  
            children: children.main || []  
          }  
        },  
        {  
          type: 'footer',  
          props: {  
            role: 'contentinfo',  
            children: children.footer || []  
          }  
        }  
      ]  
    }  
  };  
}  

// Fix REACT_036: Use real <a> elements instead of fake links  
export function createNavigationLink(href, children) {  
  return {  
    type: 'a',  
    props: {  
      href: href,  
      children: children  
    }  
  };  
}  

const img = document.getElementById('target');  
let rotation = 0;  
function rotate() {  
  rotation += 90;  
  img.style.transform = `rotate(${rotation}deg)`;  
}  
function rotateBack() {  
  rotation = 0;  
  img.style.transform = `rotate(0deg)`;  
}  
document.getElementById('rotate').addEventListener('click', rotate);  
document.getElementById('unrotate').addEventListener('click', rotateBack);  

export default {  
  createHtmlElement,  
  createTable,  
  createSvgIcon,  
  createPageLayout,  
  createNavigationLink,  
};