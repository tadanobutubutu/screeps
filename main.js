It looks like the file content you provided doesn't actually contain a JavaScript file with merge conflict markers. Instead, it shows:

- The **HEAD** side: A request asking for the file's contents
- The **origin/main** side: Comments placeholder text like "Paste your main.js content here..."

Neither side contains real JavaScript code or a `main.js` file from your Screeps bot.

### To help you resolve this conflict, I need:

1. **The actual contents of `main.js`** (the real JavaScript code with the conflict markers `<<<<<<<`, `=======`, `>>>>>>>`).
2. Optionally, a brief description of what each branch was trying to do (e.g., "branch A added a new function `harvestEnergy`" and "branch B refactored the creep role logic").

### Meanwhile, here's a **placeholder resolution** you can use as a template:

If your `main.js` had a conflict like this:

```javascript
<<<<<<< HEAD
function harvestEnergy(creep) {
    const source = creep.pos.findClosestByPath(FIND_SOURCES);
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }
}
=======
function harvestEnergy(creep) {
    const sources = creep.room.find(FIND_SOURCES);
    const source = creep.pos.findClosestByPath(sources);
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
}
>>>>>>> origin/main
```

The resolved file would merge both improvements (closest source lookup + path visualization):

```javascript
function harvestEnergy(creep) {
    const source = creep.pos.findClosestByPath(FIND_SOURCES);
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
}
```

Please paste the actual conflicting `main.js` content, and I'll provide a precise, syntactically correct resolution that preserves the functionality of both branches.