const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const appDirectory = path.resolve(__dirname);

const babelLoaderConfiguration = {
  test: /\.(js|jsx|ts|tsx)$/,
  include: [
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'App.tsx'),
    path.resolve(appDirectory, 'src'),
    // Include react-native and related packages that need transpiling
    path.resolve(appDirectory, 'node_modules/react-native'),
    path.resolve(appDirectory, 'node_modules/@react-navigation'),
    path.resolve(appDirectory, 'node_modules/react-native-reanimated'),
    path.resolve(appDirectory, 'node_modules/react-native-gesture-handler'),
    path.resolve(appDirectory, 'node_modules/react-native-screens'),
    path.resolve(appDirectory, 'node_modules/react-native-safe-area-context'),
    path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
    path.resolve(appDirectory, 'node_modules/react-native-svg'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
            ['module:@react-native/babel-preset', {disableImportExportTransform: true}],
          ],
      plugins: [
        'react-native-web',
        'react-native-reanimated/plugin',
        ['module-resolver', {root: ['.'], alias: {'@': './src'}}],
      ],
    },
  },
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  type: 'asset',
  generator: {
    filename: 'images/[name].[hash:8][ext]',
  },
};

module.exports = {
  entry: path.resolve(appDirectory, 'index.web.js'),
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
    clean: true,
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native-config': path.resolve(__dirname, 'src/config/env.web.ts'),
    },
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.js',
      '.tsx',
      '.ts',
      '.js',
      '.json',
    ],
  },
  module: {
    rules: [
      // Disable fullySpecified for ESM packages in node_modules
      {
        test: /\.m?js/,
        resolve: {fullySpecified: false},
      },
      babelLoaderConfiguration,
      imageLoaderConfiguration,
    ],
  },
  ignoreWarnings: [/react-native-reanimated/],
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(appDirectory, 'public/index.html'),
    }),
    new CopyPlugin({
      patterns: [
        {from: 'public/docs', to: 'docs', noErrorOnMissing: true},
      ],
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      process: {env: {}},
    }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    static: {directory: path.resolve(appDirectory, 'public')},
    client: {overlay: {warnings: false}},
  },
};
