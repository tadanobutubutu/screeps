We need to resolve the conflict. Let's examine the content.

The conflict markers show:

<<<<<<< HEAD
... (the code up to ...)
>>>>>>> origin/main

But the snippet after <<<<<<< HEAD includes the whole file? Let's parse.

The content after <<<<<<< HEAD:

```
 // Screeps AI Entry Point

 // Module definitions
 const roleHarvester = {
   run: function (creep) {
     if (creep.carry.energy === 0) {
       const sources = creep.room.find(FIND_SOURCES)
       if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
         creep.moveTo(sources[0])
       }
     } else {
       const targets = creep.room.find(FIND_STRUCTURES, {
         filter: (structure) => {
           return (
             (structure.structureType === STRUCTURE_EXTENSION ||
                              structure.structureType === STRUCTURE_SPAWN ||
                              structure.structureType === STRUCTURE_TOWER) &&
                         structure.energy < structure.energyCapacity
           )
         }
       })
       if (targets.length > 0) {
         if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
           creep.moveTo(targets[0])
         }
       }
     }
   }
 }

 const roleUpgrader = {
   run: function (creep) {
     if (creep.carry.energy === 0) {
       const sources = creep.room.find(FIND_SOURCES)
       if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
         creep.moveTo(sources[0])
       }
     } else {
       if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RAVIG_RANGE) { // Fixed typo
         creep.moveTo(creep.room.controller)
       }
     }
   }
 }

 const roleBuilder = {
   run: function (creep) {
     if (creep.carry.energy === 0) {
       const sources = creep.room.find(FIND_SOURCES)
       if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
         creep.moveTo(sources[0])
       }
     } else {
       const targets = creep.room.find(FIND_CONSTRUCTION_SITES)
       if (targets.length) {
         if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
           creep.moveTo(targets[0])
         }
       }
     }
   }
 }

 // Main loop
 if (!Memory.lastCleanup || Game.time - Memory.lastCleanup > 1500) {
     for (const name in Memory.creeps) {
         if (!Game.creeps[name]) { delete Memory.creeps[name]; }
     }
     Memory.lastCleanup = Game.time;
 }

 // Clean up dead creeps from memory
 for (const name in Memory.creeps) {
     if (!Game.creeps[name]) {
       delete Memory.creeps[name]
     }
 }

 // Count roles
 const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester')
 const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader')
 const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder')

 // Spawn logic
 if (harvesters.length < 2) {
     const newName = 'Harvester' + Game.time
     Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], newName, {
       memory: { role: 'harvester' }
     })
 }

 if (upgraders.length < 2) {
     const newName = 'Upgrader' + Game.time
     Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], newName, {
       memory: { role: 'upgrader' }
     })
 }

 if (builders.length < 2) {
     const newName = 'Builder' + Game.time
     Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], newName, {
       memory: { role: 'builder' }
     })
 }

 // Run roles
 for (const creep of Object.values(Game.creeps)) {
   const creep = Game.creeps[creep]; // Fixed undefined reference
   if (creep.memory.role === 'harvester') {
     roleHarvester.run(creep)
   } else if (creep.memory.role === 'upgrader') {
     roleUpgrader.run(creep)
   } else if (creep.memory.role === 'builder') {
     roleBuilder.run(creep)
   }
 }
=======
Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?
>>>>>>> origin/main
```

So the conflict appears to be that the original HEAD version includes the entire file, while the other side (origin/main) seems to be just a request for the file. That seems odd. Possibly the actual conflict is that the HEAD version includes the whole file, and the other side (origin/main) maybe includes something else (maybe missing). But the snippet after the request is "Could you please paste the contents..." which is not code.

Thus maybe the actual conflict is that the HEAD version is the whole file, and the other side (origin/main) is missing. The conflict markers show <<<<<<< HEAD then the code, then ====== then a request. That seems like a mistake: maybe the second side is just a placeholder.

We need to resolve the conflict. Since we have the HEAD version (the code) and the other side is just a request, likely the correct resolution is to keep the HEAD version (the full code) because it's complete. The request is not code, so we should ignore it.

But we must ensure no syntax errors, preserve comments and style.

Potential issues: In roleUpgrader, there's a comment "Fixed typo". The code uses ERR_NOT_IN_RAVIG_RANGE which is likely a typo; correct constant is ERR_NOT_IN_RANGE. So we need to correct that. Also the line "const creep = Game.creeps[creep]; // Fixed undefined reference" is wrong: they reassign const creep = Game.creeps[creep]; which shadows the loop variable. Should be something like const creepObj = Game.creeps[creep]; but they already have 'creep' variable in for loop. So we need to fix that.

Also the spawn logic uses Game.spawns['Spawn1']; ensure that Spawn1 exists.

Also the roleHarvester code: they harvest sources[0] but if there are multiple sources, maybe they should iterate. But keep as is.

Also the roleUpgrader's condition: if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RAVIG_RANGE) – should be ERR_NOT_IN_RANGE. So fix that.

Also the line "if (creep.carry.energy === 0)" – that's fine.

Also the roleBuilder: they find construction sites; fine.

Now the main loop: they have for (const creep of Object.values(Game.creeps)) { const creep = Game.creeps[creep]; ... } This redefines const creep, causing shadowing and error. Should be something like for (const creepName in Game.creeps) { const creep = Game.creeps[creepName]; } Or use for (const creep of Object.values(Game.creeps)) { ... } without reassigning. So fix that.

Also the earlier cleanup loops: they have two loops: first checks if !Memory.lastCleanup or time >1500, then deletes dead creeps. Then second loop again deletes dead creeps. Could combine but not necessary. But maybe the second loop duplicates. It's okay.

Now we need to produce resolved file content. Let's rewrite with fixes.

We'll keep comments and style.

Let's rewrite:

- Remove the duplicate cleanup loop? Keep both? It's okay but maybe keep both as they are separate. The first loop only runs if last cleanup older than 1500 ms; second loop always runs to delete dead creeps (maybe redundant but okay). We'll keep both.

- Fix the undefined reference: change the loop to:

for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    // run roles...
}

But the original loop uses for (const creep of Object.values(Game.creeps)) { const creep = Game.creeps[creep]; ... } We'll change to:

for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    // run roles...
}

But need to keep same logic: they check memory.role.

So we can rewrite:

// Run roles
for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
        roleHarvester.run(creep);
    } else if (creep.memory.role === 'upgrader') {
        roleUpgrader.run(creep);
    } else if (creep.memory.role === 'builder') {
        roleBuilder.run(creep);
    }
}

Now fix roleUpgrader's ERR_NOT_IN_RAVIG_RANGE to ERR_NOT_IN_RANGE.

Also ensure that the code uses proper constants: RESOURCE_ENERGY is defined.

Now ensure that the spawn logic uses correct array: [WORK,