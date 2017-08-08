var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-2'],
              plugins: ['transform-class-properties']
            }
          }
        ]
      },
      {
        test: /.*\.(gif|png|jpe?g)$/i,
        loader: 'file-loader?name=/media/images/[name].[ext]'
      },
      {
        test: /\.scss$/,
        /*loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader'
        })*/
        loader: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css')
  ]
};
