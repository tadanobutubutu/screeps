// TODO: Address any missing required exports
// REACT_015: Add lang attribute

const RuleTester = require('eslint').RuleTester;
const rule = require('./rule');

module.exports = {
  meta: rule.meta,
  schema: rule.schema,
  create: rule.create,
  RuleTester
};