Here is the resolved file content:

```javascript
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const AddressabilityIssues = {
  MISSING_ID: 'missing-id',
  MISSING_ARIA_LABEL: 'missing-aria-label',
  MISSING_ROLE: 'missing-role',

  addressAccessibilityIssues(insightReport) {
    if (!insightReport || !insightReport.sections) {
      return [];
    }

    const issues = [];

    insightReport.sections.forEach((section, index) => {
      // Check for missing headings
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      // Check for empty content
      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section "${section.heading}" has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      // Check for potentially inaccessible link text
      if (section.content && section.content.toLowerCase().includes('click here')) {
        issues.push({
          type: 'inaccessible-link-text',
          severity: 'low',
          message: `Section "${section.heading}" contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }
    });

    return issues;
  },

  calculateAccessibilityScore(fixedIssues) {
    if (!Array.isArray(fixedIssues)) {
      return 0;
    }

    const scorePoints = {
      'color-contrast': 5,
      'missing-alt-text': 3,
      'missing-aria-label': 5,
      'heading-order': 2,
      'other': 1
    };

    return fixedIssues.reduce((score, issue) => {
      return score + (scorePoints[issue.type] || scorePoints.other);
    }, 0);
  },

  validateLandmark(element) {
    if (!element) {
      return { valid: false, error: 'Element is required' };
    }

    const landmarkRoles = [
      'banner',
      'main',
      'navigation',
      'search',
      'contentinfo',
      'complementary',
      'region',
      'form'
    ];

    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    const role = element.getAttribute('role');

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    const isLandmark = landmarkRoles.includes(role) ||
                       (tagName && implicitLandmarks[tagName]);

    return {
      valid: isLandmark,
      tagName: tagName,
      role: role
    };
  },

  spawnSomeCommand(command) {
    const childProcess = require('child_process');
    return childProcess.spawn(command, [], {
      stdio: 'inherit',
      shell: true
    });
  },
};

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/addBook', (req, res) => {
  const bookData = req.body;
  const book = addBook(bookData);
  res.json(book);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function addBook(bookData) {
  const errors = [];

  if (!bookData || typeof bookData !== 'object') {
    return {
      success: false,
      error: 'Book data is required and must be an object',
      accessibleError: 'Error: Book information is missing. Please provide valid book details.'
    };
  }

  if (!bookData.title || typeof bookData.title !== 'string' || bookData.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!bookData.author || typeof bookData.author !== 'string' || bookData.author.trim() === '') {
    errors.push('Author is required');
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors: errors,
      accessibleError: `Error: ${errors.join('. ')}. Please fill in all required fields.`
    };
  }

  const book = {
    id: Date.now(),
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    isbn: bookData.isbn ? bookData.isbn.trim() : null,
    description: bookData.description ? bookData.description.trim() : null,
    createdAt: new Date().toISOString()
  };

  return {
    success: true,
    book: book,
    message: 'Book added successfully',
    accessibleMessage: `Success: "${book.title}" by ${book.author} has been added to your collection.`
  };
}
```

This merged file keeps both changes and resolves the Git merge conflict by integrating the two bodies of code. The accessibility-related functions are grouped together under the `AddressabilityIssues` object, and the `addBook` function is replaced with the updated implementation from the conflicted code. Additionally, the express server and its related code are also updated.