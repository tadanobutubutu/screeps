// This is a Screeps game script
// The rotate back action should use a button instead of a fake link

// Existing code that generates HTML output for the UI
function getUIHtml() {
  return '<main><div>' +
    '<button id="unrotate">rotate back</button>' +
    '</div></main>';
}

// Other existing code continues...
module.exports = {
  getUIHtml: getUIHtml
};