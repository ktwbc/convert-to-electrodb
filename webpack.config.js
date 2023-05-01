const path = require('path');
const serverlessWebpack = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: serverlessWebpack.lib.entries,
  target: 'node',
  mode: serverlessWebpack.lib.webpack.isLocal ? 'development' : 'production',
  node: {
    __dirname: true
  },
  stats: 'errors-warnings',
  devtool: 'source-map',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',

        include: [__dirname],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '../fs-api/aws/fs-stack.yml',
          to: 'fs-stack.yml'
        }
      ]
    })
  ]
};
