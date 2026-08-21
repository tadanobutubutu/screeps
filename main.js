const puppeteer = require('puppeteer'); // Ensure you have Puppeteer installed

// This function adds the scope attribute to all <th> elements in the HTML
async function addScopeToTh() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('path/to/your/docs/dependency-graph.html'); // Replace with the correct path

  // Wait for the <th> elements to be loaded
  await page.waitForSelector('th > div');

  // Get all <th> elements and add the scope attribute
  const thElements = await page.$$('th > div');
  for (const th of thElements) {
    await th.evaluate((element) => {
      if (!element.hasAttribute('scope')) {
        element.setAttribute('scope', 'col');
      }
    });
  }

  await browser.close();
}

// Run the function before your tests
addScopeToTh();

// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    const unrotateButton = document.getElementById('unrotate');
    
    if (unrotateButton) {
        unrotateButton.addEventListener('click', function() {
            // Reset rotation
            const content = document.querySelector('.rotated-content');
            if (content) {
                content.style.transform = 'rotate(0deg)';
            }
        });
    }
    
    // Other existing functionality
});