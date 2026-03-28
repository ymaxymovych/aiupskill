module.exports = {
  apps: [
    {
      name: "aiupskill",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3008",
      cwd: "/var/www/aiupskill.live",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env_production: {
        NODE_ENV: "production",
        PORT: 3008,
      },
      error_file: "/var/log/pm2/aiupskill-error.log",
      out_file: "/var/log/pm2/aiupskill-out.log",
    },
  ],
};
