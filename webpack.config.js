const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'production',
  entry: './src/Index.ts',
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'build.js',
    library: 'ayax-common-vue-assets',
    libraryTarget: 'umd'
  },
  externals: {
    vue: 'vue',
    vuetify: 'vuetify',
    moment: 'moment',
    ajv: 'ajv',
    mdi: 'mdi',
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
    "vue-shortkey": "vue-shortkey"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules')
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: path.resolve(__dirname, 'src'),
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: path.resolve(__dirname, 'src'),
        options: {
          loaders: {
            ts: 'ts-loader'
          }
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
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'scss-loader'
        ],
      },
      { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.js'
    }
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
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