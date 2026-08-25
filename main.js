// Address accessibility issues from insight report

(function() {
  'use strict';

  const submitBtn = document.getElementById('submit-btn');

  if (submitBtn) {
    submitBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Handle submission
    });
  }
})();