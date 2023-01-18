const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {main: './src/pages/index.js'},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: ''
  },

  mode: 'development',
  devServer: {
    static: path.resolve(__dirname, './dist'),
    compress: true,
    port: 8081,
    open: true
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf|mp4)$/,
        type: 'asset/resource'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {importLoaders: 1}
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin(
      {
        template: './src/index.html'
      }
    ),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ]
};