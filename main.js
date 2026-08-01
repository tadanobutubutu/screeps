// Before
function testFunction() {
   let someVar;
   if (someCondition) {
      someVar = something;
   }
}

// After
function testFunction() {
   let someVar;

   if (someCondition) {
      someVar = something;
   }
}