const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');

const baseConfig = {
  output: {
    path: path.resolve(__dirname, './dist'),
    clean: true,
    filename: '[name].bundle.js',
    assetModuleFilename: 'assets/[name][ext]',
},
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      favicon: path.join(__dirname, './src/assets/icons/Favicon.png')
    }),
    new ESLintPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.html$/i,
        use: 'html-loader',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
  },
};

module.exports = () => {
  const mode = process.env.NODE_ENV || 'development';
  const isProductionMode = mode === 'production';
  const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');
  return merge(baseConfig, envConfig);
};
