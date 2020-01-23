const path = require('path');
const fs = require('fs');
const scriptPath = 'src/scripts/';

const entryPoint = fs
  .readdirSync(path.join(__dirname, scriptPath))
  .reduce((accumulator, scriptName) => {
    const name = path.parse(scriptName).name;
    accumulator[name] = `./${scriptPath}${name}`;
    return accumulator;
  }, {});

module.exports = {
  entry: entryPoint,
  target: 'node',
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'], //resolve all the modules other than index.ts
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.ts?$/,
      },
    ],
  },
};
