var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'bundle.js',
    library: 'ayax-common-vue-assets',
    libraryTarget: 'umd'
  },
  externals: {
    vue: 'vue',
    vuetify: 'vuetify',
    moment: 'moment',
    ajv: 'ajv',
    mime: 'mime',
    "element-ui": "element-ui",
    "vue-shortkey": "vue-shortkey",
    "ayax-common-auth": "ayax-common-auth",
    "ayax-common-cache": "ayax-common-cache",
    "ayax-common-helpers": "ayax-common-helpers",
    "ayax-common-services": "ayax-common-services",
    "ayax-common-types": "ayax-common-types",
    "file-loader": "file-loader",
    "url-loader": "url-loader",
    "schema-utils": "schema-utils",
    "material-design-icons-iconfont": "material-design-icons-iconfont",
    "vue-resize": "vue-resize",
    "vuedraggable": "vuedraggable"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/, loader: "file-loader"
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}