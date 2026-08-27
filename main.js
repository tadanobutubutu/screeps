// Assuming you have a way to access the HTML files, for example, through a function that reads the file contents.
async function injectMainTag(filePath) {
  // Read the file content
  const content = await readFile(filePath, 'utf8');

  // Check if the <main> tag is already present
  if (!content.includes('<main>')) {
    // Add the <main> tag around the existing content
    const modifiedContent = `<main>${content}</main>`;

    // Write the modified content back to the file
    await writeFile(filePath, modifiedContent, 'utf8');
  }
}

// Paths to the affected HTML files
const paths = ['docs/dependency-graph.html', 'docs/index.html'];

// Run the function for each file
async function run() {
  for (const path of paths) {
    await injectMainTag(path);
  }
}

run().catch(console.error);