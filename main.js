// Original code that might have looked like this:
/*
<rootElement> ... </rootElement>
*/

// Updated code with the lang attribute added to the HTML root element
document.documentElement.lang = 'en'; // Replace 'en' with the appropriate language code

// Changes to add the scope attribute to the th elements
document.querySelectorAll('th').forEach(th => {
  if (!th.hasAttribute('scope')) {
    th.setAttribute('scope', 'col');
  }
});