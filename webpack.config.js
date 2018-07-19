const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'production',
  entry: './src/Index.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js',
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: path.resolve(__dirname, "node_modules")
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: path.resolve(__dirname, "src"),
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: path.resolve(__dirname, "src"),
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
      { test: /\.(png|jpg|jpeg|gif|svg)$/, use: "url-loader?limit=25000" },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  externals : {
    'ayax-common-auth': 'ayax-common-auth',
    'ayax-common-cache': 'ayax-common-cache',
    'ayax-common-helpers': 'ayax-common-helpers',
    'ayax-common-operation': 'ayax-common-operation',
    'ayax-common-types': 'ayax-common-types',
    'element-ui': 'element-ui',
    'moment': 'moment',
    'vue-shortkey': 'vue-shortkey',
    'vuedraggable': 'vuedraggable',
    'vuetify': 'vuetify'
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}