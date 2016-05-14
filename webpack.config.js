var path    = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'sourcemap',
  /*entry: {
    main: ['./client/app/app.js'],
    bootstrap: ['bootstrap-loader'],
    fhirclient : ['fhirclient']
  },*/
  module: {
    loaders: [
        { test: /angular.js$/, loader: "imports?$=jquery" },
        { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports?jQuery=jquery' },

        { test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: 'ng-annotate!babel' },
        { test: /\.html$/, loader: 'raw' },
        { test: /\.styl$/, loader: 'style!css!stylus' },
        { test: /\.css$/, loader: 'style!css' },
        
        { test: /\.(woff|woff2)$/, loaders: ['url-loader?limit=100000']},
        { test: /\.(ttf|eot)$/, loaders: ['file-loader']},
        { test: /\.(wav|mp3)$/, loaders: ['file-loader']},
        //{ test: /\.html$/, loaders: ['html-loader']},
        //{ test: /\.(md|markdown)$/, loaders: ['html-loader', 'markdown-loader']},
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/font-woff'
        },
        {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/font-woff'
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/octet-stream'
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file'
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=image/svg+xml'
        }
      ]
      },
  plugins: [
    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: 'client/index.html',
      inject: 'body',
      hash: true
    }),

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
      }
    })
  ]
};
