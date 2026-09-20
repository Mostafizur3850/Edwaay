module.exports = {
  apps: [
    {
      name: "oct-ecommerce",
      cwd: "C:/ui/Ecommerce",

      // ?? Direct Next.js binary (NO npm, NO cmd)
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",

      exec_mode: "fork",

      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
