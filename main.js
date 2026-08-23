// Assuming you have a button with ID 'myButton'
document.getElementById('myButton').setAttribute('aria-label', 'My Button');
document.getElementById('myButton').setAttribute('role', 'button');
document.getElementById('myButton').setAttribute('aria-pressed', 'false');

// New function to handle button click
function handleButtonClick() {
  const button = document.getElementById('myButton');
  button.setAttribute('aria-pressed', 'true');
}

// Attach click event listener to the button
document.getElementById('myButton').addEventListener('click', handleButtonClick);