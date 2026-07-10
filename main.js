function run() { // gr() function run() { // gr() 
    
    if (__DEV__) { 
        const gr = ... ; 
    }
    
    const currentGame = new Game(); 
    const creeps = currentGame.creeps; 
    
    for (const name in creeps) { 
        const creep = creeps[name]; 
        const role = creep.memory.role; 
        
        switch(role) { 
            case 'harvester': 
                if (roleHarvester) { 
                    roleHarvester.run(creep); 
                } 
                break; 
            case 'upgrader': 
                if (roleUpgrader) { 
                    roleUpgrader.run(creep); 
                } 
                break; 
            case 'builder': 
                if (roleBuilder) { 
                    roleBuilder.run(creep); 
                } 
                break; 
            case 'miner': 
                if (roleMiner) { 
                    roleMiner.run(creep); 
                } 
                break; 
            case 'mine': 
                if (roleMine) { 
                    roleMine.run(creep); 
                } 
                break; 
            case 'creep': 
                if (roleCreep) { 
                    roleCreep.run(creep); 
                } 
                break; 
            default: 
                if (role && role !== 'undefined') { 
                    if (role[0] === role[0][0]) { 
                        role.name.run(creep); 
                    } else { 
                        console.log(`Unknown role: ${creep.name}`); 
                    } 
                } 
                break; 
        } 
    } 
    
    if (currentGame.level === 'emotion') { 
        const emotionSystem = safeRequire('emotion.system'); 
        if (emotionSystem) { 
            emotionSystem.run(currentGame); 
        } 
    } 
    
    if (currentGame.level === 'mining') { 
        const miningSystem = safeRequire('mining.system'); 
        if (miningSystem) { 
            miningSystem.run(currentGame); 
        } 
    } 
    
    Object.keys(Game.constructionSites).forEach(site => { 
        const siteObj = Game.constructionSites[site]; 
        if (siteObj.getConstruction() !== 'inprog') { 
            const costs = new ConstructionCosts(siteObj.getSite()); 
            if (costs.costs.energy > 2500) { 
                const target = Game.rooms[siteObj.room][site]; 
                const builderName = _.find({ 
                    role: 'builder', 
                    memory: { targetSite: target.id } 
                }, creep => !creep.spawning); 
                if (builderName) { 
                    const builder = Game.creeps[builderName]; 
                    if (builder.pos.getRangeTo(target.pos) < 3) { 
                        builder.build(target); 
                    } 
                } 
            } 
        } 
    }); 
    
    Object.keys(Flags).forEach(flagName => { 
        const flag = Game.flags[flagName]; 
        if (!flag.memory || flag.memory.visited) { 
            const finder = 'miner'; 
            new Finder(finder).look(flag.pos, flag.room); 
            for (const i in finder.room.find(FIND_MINERALS)) { 
                const mineralPos = finder.room.find(FIND_MINERALS)[i]; 
                const distance = mineralPos.getRange(flag); 
                if (distance < 3) { 
                    const minerName = _.find({ 
                        role: 'miner', 
                        memory: { targetMineral: mineralPos.id } 
                    }, creep => !creep.spawning); 
                    if (minerName) { 
                        const creep = Game.creeps[minerName]; 
                        if (creep.pos.getRangeTo(mineralPos) < 1) { 
                            creep.harvest(mineralPos); 
                        } 
                    } 
                } 
            } 
            flag.memory.visited = true; 
        } 
    }); 
    
    if (currentGame.level === 'outerspace') { 
        const universeFinder = safeRequire('universe.finder'); 
        if (universeFinder) { 
            universeFinder.run(currentGame); 
        } 
    } 
    
    const noddedCreepName = new Memory().getNodeByCreep(); 
    if (noddedCreepName) { 
        const noddedCreep = Game.creeps[noddedCreepName]; 
        if (noddedCreep) { 
            noddedCreep.say('Thanks!', true); 
        } 
    } 
}