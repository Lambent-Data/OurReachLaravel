const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    "milestone-view": './src/pages/milestone-view.js',
    "milestone-listing": './src/pages/milestone-listing.js',
    "dashboard": './src/pages/dashboard.js',
    "testpage": './src/pages/test-page.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
};