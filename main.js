var rotation = 0;
function rotateImage(degrees) {
    rotation = degrees;
    var img = document.querySelector('img');
    img.style.transform = 'rotate(' + degrees + 'deg)';
}
function unrotate() {
    var currentRotation = rotation;
    var interval = setInterval(function() {
        if (currentRotation > 0) {
            currentRotation -= 5;
            rotateImage(currentRotation);
        } else {
            clearInterval(interval);
        }
    }, 20);
}
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('rotate-90').addEventListener('click', function() { rotateImage(90); });
    document.getElementById('rotate-180').addEventListener('click', function() { rotateImage(180); });
    document.getElementById('unrotate').addEventListener('click', unrotate);
});
module.exports = { rotateImage: rotateImage, unrotate: unrotate };