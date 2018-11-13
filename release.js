module.exports = {
  // by default, libs that use sl-scripts will only be publishing their dist folder (which should have everything needed inside of it)
  pkgRoot: 'dist',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
};
