// TODO: Implement wrapPrimaryContentInMain function

function wrapPrimaryContentInMain(content) {
  if (!content) {
    return '<main></main>';
  }
  return `<main>${content}</main>`;
}

module.exports = {
  wrapPrimaryContentInMain
};