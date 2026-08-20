module.exports = {
  info: {
    id: 'screeps',
    title: 'Screeps',
    description: 'A universal modding tool for games',
  },

  render: function () {
    return `<div>
  <h1>Screeps</h1>
  <p>Click the button below to rotate back</p>
  <button id="unrotate" type="button">rotate back</button>
</div>`;
  },
};