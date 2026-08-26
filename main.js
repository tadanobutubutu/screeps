module.exports = {
  apps: [
    {
      name: 'screeps-dashboard',
      script: 'dashboard/.next/standalone.js',
      cwd: '/home/runner/work/screeps/screeps',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};