// Original code that might have conflict markers (example)
/*
<<<<<<< HEAD
<th><div>src/constants.js</div></th>
<th><div>src/managers/roomManager.js</div></th>
(there could be more <th> elements)
=======

(there could be more <th> elements)
>>>>>>> branch-name
*/

// Updated code with the `scope` attribute added
/*
<th scope="col"><div>src/constants.js</div></th>
<th scope="col"><div>src/managers/roomManager.js</div></th>
(there could be more <th> elements)
*/

// Assuming the above pattern is repeated for all the affected <th> elements in your table, the updated main.js content would look like this: