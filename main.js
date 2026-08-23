import React from 'react';

export default function Main() {
  return (
    <div>
      <h1>Dependency Graph</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col"><div>src/constants.js</div></th>
            <th scope="col"><div>src/managers/roomManager.js</div></th>
            <th scope="col"><div>src/managers/spawnManager.js</div></th>
            <th scope="col"><div>src/managers/towerManager.js</div></th>
            <th scope="col"><div>src/roles/builder.js</div></th>
            <th scope="col"><div>src/roles/harvester.js</div></th>
            <th scope="col"><div>src/roles/upgrader.js</div></th>
            <th scope="col"><div>src/roles/miner.js</div></th>
            <th scope="col"><div>src/roles/repairer.js</div></th>
            <th scope="col"><div>src/roles/claimer.js</div></th>
            <th scope="col"><div>src/roles/hauler.js</div></th>
            <th scope="col"><div>src/roles/defender.js</div></th>
            <th scope="col"><div>src/structures/extension.js</div></th>
            <th scope="col"><div>src/structures/spawn.js</div></th>
            <th scope="col"><div>src/structures/tower.js</div></th>
            <th scope="col"><div>src/structures/storage.js</div></th>
            <th scope="col"><div>src/structures/link.js</div></th>
            <th scope="col"><div>src/structures/container.js</div></th>
            <th scope="col"><div>src/structures/road.js</div></th>
            <th scope="col"><div>src/structures/wall.js</div></th>
            <th scope="col"><div>src/structures/powerReactor.js</div></th>
            <th scope="col"><div>src/structures/powerSpawn.js</div></th>
            <th scope="col"><div>src/structures/observer.js</div></th>
            <th scope="col"><div>src/structures/terminal.js</div></th>
            <th scope="col"><div>src/structures/nuker.js</div></th>
            <th scope="col"><div>src/structures/kernel.js</div></th>
            <th scope="col"><div>src/structures/ladder.js</div></th>
          </tr>
        </thead>
        <tbody>
          {/* rows */}
        </tbody>
      </table>
    </div>
  );
}