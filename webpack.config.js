const path = require('path');

module.exports = {
  entry: './js/app.js',
  devtool: 'eval',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
