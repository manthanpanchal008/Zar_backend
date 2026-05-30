module.exports = {
  apps: [
    {
      name: 'zar-backend',
      script: './server.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: "zar-admin-dashboard",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 5002",
      cwd: "./frontend/admin-dashboard",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 5002,
      },
    },
  ],
};
