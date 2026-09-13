// Serve the existing authored static app for supervised visual QA.
// Hosting continues to publish dist directly, without a compilation step.
export default {
  root: 'dist',
  publicDir: false,
  server: {
    host: '0.0.0.0',
    allowedHosts: ['terminal.local']
  }
};
