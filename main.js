// TODO: Address accessibility issues from insight report: replace `my-button` with actual button id

document.addEventListener('DOMContentLoaded', function() {
  const submitBtn = document.getElementById('submit-btn');
  
  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      console.log('Button clicked');
    });
  }
});