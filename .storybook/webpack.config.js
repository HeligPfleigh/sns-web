const path = require('path');
const isDebug = true;

module.exports = {
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          {
            loader: 'isomorphic-style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              // CSS Loader https://github.com/webpack/css-loader
              importLoaders: 1,
              sourceMap: isDebug,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
              // CSS Nano http://cssnano.co/options/
              minimize: !isDebug,
              discardComments: { removeAll: true },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: '../tools/postcss.config.js',
            },
          },
        ],
      },
      { test: /\.scss$/,
        use: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader?pack=sass',
            options: {
              config: '../tools/postcss.config.js',
            },
          },
          'sass-loader',
        ],
      },
    ]
  }
}