// Main application logic

document.addEventListener('DOMContentLoaded', function() {
    var unrotateBtn = document.getElementById('unrotate');
    if (unrotateBtn) {
        unrotateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // rotate back logic
            document.body.classList.remove('rotated');
        });
    }
});