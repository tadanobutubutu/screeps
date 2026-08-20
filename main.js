const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
const updatedFilePath = path.join(__dirname, 'docs', 'dependency-graph.html.tmp');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const updatedData = data.replace(/<th\b[^>]*>/g, (match) => {
    return match.replace(/<th\b[^>]*>/, '<th scope="col">');
  });

  fs.writeFile(updatedFilePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }

    console.log('File updated successfully. Replace the original file with the temporary file.');

    // Optionally, you can replace the original file with the updated file
    // fs.rename(updatedFilePath, filePath, (err) => {
    //   if (err) {
    //     console.error('Error renaming file:', err);
    //     return;
    //   }
    //   console.log('Original file replaced successfully.');
    // });
  });
});

// New function to fix React Unique Landmarks issue
function fixDashboardLandmarks() {
  const dashboardPath = path.join(__dirname, 'components', 'Dashboard.tsx');
  const dashboardBackupPath = path.join(__dirname, 'components', 'Dashboard.tsx.bak');

  fs.readFile(dashboardPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading Dashboard.tsx:', err);
      return;
    }

    // Create backup
    fs.writeFile(dashboardBackupPath, data, 'utf8', (err) => {
      if (err) {
        console.error('Error creating backup of Dashboard.tsx:', err);
        return;
      }

      // Replace both main elements with section elements
      const updatedData = data.replace(/<main\b[^>]*>/g, '<section>');

      fs.writeFile(dashboardPath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error('Error updating Dashboard.tsx:', err);
          return;
        }

        console.log('Dashboard.tsx landmarks fixed successfully. Backup created at Dashboard.tsx.bak');
      });
    });
  });
}

// Call the function to fix the landmarks
fixDashboardLandmarks();