const document = new DOMParser().parseFromString(htmlString, 'text/html');
document.body.appendChild(document.head.firstChild);