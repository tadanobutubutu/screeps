function addLangAttribute(html) {
  return html.replace(/<html/, '<html lang="en">');
}

// Use the function
let updatedHtml = addLangAttribute(`
<!DOCTYPE html>
<html>
<!-- Your existing html code -->
</html>
`);