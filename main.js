// Existing code line 1
const express = require('express');
// TODO: Implement greet
// Actual implementation below
function greet(name) {
  if (!name) {
    return 'Hello, World!';
  }
  return `Hello, ${name}!`;
}

module.exports = { greet };