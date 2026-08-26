// TODO: Address accessibility issues from insight report — CONTINUING
// Add new functions (no existing functions should be removed or renamed)

function addFormLabels(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const formMatches = content.match(/<form([^>]*)>/g) || [];

  formMatches.forEach((form, index) => {
    const formElements = content.match(new RegExp(`<form[^>]*>.*?(<label[^>]*>.*?</label>)|(<input[^>]*>)|(<textarea[^>]*>)[^<]*</textarea>)`, 'g'));

    if (formElements.length > 0) {
      let updatedForm = form;

      formElements.forEach((element, elementIndex) => {
        updatedForm += element;

        // Add label for input fields and textareas
        if (element.includes('<label') && !element.includes('for')) {
          const inputOrTextarea = content.match(/<input[^>]*id="([^"]*)">|<textarea[^>]*id="([^"]*)">/g)[elementIndex];
          const inputOrTextareaId = inputOrTextarea ? inputOrTextarea.match(/id="([^"]*)"/)[1] : null;

          if (inputOrTextareaId) {
            updatedForm += `<label htmlFor="${inputOrTextareaId}">${element.match(/<label[^>]*>(.*?)<\/label>/)[1]}</label>`;
          }
        }
      });

      updatedForm += "</form>";
      fs.writeFileSync(filePath, content.split(form).join(updatedForm));
    }
  });
}

function addImageAltText(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const imageMatches = content.match(/<img[^>]*>/g) || [];

  imageMatches.forEach((image, index) => {
    if (!image.includes('alt')) {
      const updatedImage = image + ' alt="Description for the image"';
      fs.writeFileSync(filePath, content.split(image).join(updatedImage));
    }
  });
}

// Update existing functions to handle new requirements (if any)

function fixTableStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<table>/g, '<table role="table">');
  updatedContent = updatedContent.replace(/<td>/g, '<td scope="col">');
  updatedContent = updatedContent.replace(/<th>/g, '<th scope="col">');
  updatedContent = updatedContent.replace(/<\/th>/g, '</th>');

  // Add header associations for table headers and cells
  updatedContent = updatedContent.replace(/<th[^>]*>(.*?)<\/th>/g, (match, headerText) => {
    const associatedCell = content.match(/<td[^>]*(?=.*headers=)?"[^"]*"(\d+)/)[0];
    const cellIndex = associatedCell.match(/(\d+)/)[1];
    const tableRows = content.split('<tr>');

    tableRows[+cellIndex + 1] = tableRows[+cellIndex + 1].replace(/<td>(.*?)<\/td>/, (match, cellContent) => {
      return `<td id="${headerText.toLowerCase().replace(/[^a-z0-9]/g, '-')}-cell" headers="${headerText.toLowerCase()}, ${cellContent.match(/headers=("[^"]+)"/)[1]}">${cellContent}</td>`;
    });

    return match;
  });

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Fixed table structure for better accessibility in ${filePath}`);
}

module.exports = {
  ... // Existing exports, no modifications
  addFormLabels,
  addImageAltText
};