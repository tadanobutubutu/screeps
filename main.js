diff
--- a/src/utils/math.js   # <--- example file that's being used in tests
+++ b/src/utils/math.js
@@
-/** Return the sum of two numbers. */
-function add(a, b) {
-  return a + b;
-}
-
-/** Return the difference of two numbers. */
-function subtract(a, b) {
-  return a - b;
-}
-
-/* Export the helpers.  */
-export { add, subtract };
+/** Return the sum of two numbers. */
+function add(a, b) {
+  return a + b;
+}
+
+/** Return the difference of two numbers. */
+function subtract(a, b) {
+  return a - b;
+}
+
+/* Export the helpers.  */
+/* Jest tests import the module and destructure the named exports, so
+ * we keep the named exports, but we also provide a single default
+ * export that groups them together. This keeps compatibility with
+ * both `require('./math')` (default) and `const {add} = require('./math')`
+ * (named). */
+module.exports = {
+  add,
+  subtract,
+  /* Default export for CommonJS consumers. */
+  default: { add, subtract },
+};