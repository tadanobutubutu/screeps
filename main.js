{
  roleController: require('./role.controller'),
  spawnController: require('./spawn.controller'),
  // ... other existing code
  icons: {
    creep: {
      prototype: 'creep',
      colors: {
        harvester: '#FF0000'
      },
      icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><text y=".9em" font-size="90">🐜</text></svg>'
    },
    builder: {
      prototype: 'builder',
      colors: {
        builder: '#00FF00'
      },
      icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><text y=".9em" font-size="90">🔧</text></svg>'
    },
    spawner: {
      prototype: 'spawner',
      colors: {
        spawner: '#0000FF'
      },
      icon: '<svg viewBox="0 0 100 100" aria-hidden="true"><text y=".9em" font-size="90">🏭</text></svg>'
    }
  },
  autoComplete: function(phrase) {
    var text = phrase.substring(0, 1).toUpperCase() + phrase.substring(1);
    var nameLength = 20;
    var tabLength = nameLength - text.length;
    if(actualCharacter[text]) {
      return " " + text + Array(tabLength + 2).join(' ');
    } else if (actualCharacter[text.toLowerCase()]) {
      return " " + text.toLowerCase() + Array(tabLength + 2).join(' ');
    } else {
      return false;
    }
  },
  mod: require('./handler'),
  config: require('./config'),
  React: React,
  useEffect: useEffect
}