const path = require('path')
const webpack = require('webpack')
const DotenvPlugin = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')

const devEnvs = ['dev', 'local']
const envPath =
  process.env.APP_ENV === 'local' ? './.env' : `./.env.${process.env.APP_ENV}`

const postCSSLoaderOptions = {
  // Necessary for external CSS imports to work
  // https://github.com/facebook/create-react-app/issues/2677
  ident: 'postcss',
  plugins: () => [
    require('postcss-flexbugs-fixes'),
    autoprefixer({
      flexbox: 'no-2009',
    }),
  ],
}

const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: process.env.APP_ENV === 'live' ? false : 'source-map',
  mode: devEnvs.includes(process.env.APP_ENV) ? 'development' : 'production',
  entry: './index.js',
  output: {
    filename: devEnvs.includes(process.env.APP_ENV)
      ? '[name].js'
      : `[name].[hash].js`,
    chunkFilename: '[name].[chunkhash].js',
    path: path.join(__dirname, 'public', 'dist', 'js'),
    publicPath: '/elevator-pitch/dist/js/',
  },
  resolve: {
    modules: ['Common', 'node_modules'],
    extensions: ['.js', '.jsx'],
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules(?!\/@vmockinc)|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['@babel/react'],
            },
          },
        ],
      },
    ],
  },

  externals: {},

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: '../../index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new DotenvPlugin({
      path: envPath,
    }),
    new webpack.ProvidePlugin({
      _: 'underscore',
      $: 'jquery',
      classNames: 'classnames',
      noty: 'noty',
    }),
  ],
}

// ------------------------------------
// Style Loaders
// ------------------------------------

webpackConfig.module.rules.push({
  test: /\.(sass|scss)$/,
  exclude: /\.module\.(sass|scss)$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        url: false,
        import: true,
        importLoaders: 1,
      },
    },
    {
      loader: 'postcss-loader',
      options: postCSSLoaderOptions,
    },
    {
      loader: 'sass-loader',
      options: {
        sassOptions: {
          // indentWidth: 4,
          includePaths: [
            'node_modules/bootstrap-sass/assets/stylesheets/',
            'node_modules/select2/src/scss/',
            'node_modules/slick-carousel/slick/',
            'node_modules/react-select/dist/',
            // 'node_modules/react-datepicker/dist/',
            'node_modules/',
            'styles',
          ],
        },
        // precision: 10,
      },
    },
  ],
})

webpackConfig.module.rules.push({
  test: /\.css$/,
  exclude: /\.module\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        sourceMap: false,
      },
    },
    {
      loader: 'postcss-loader',
      options: postCSSLoaderOptions,
    },
  ],
})

// Adds support for CSS Modules (https://github.com/css-modules/css-modules)
// using the extension .module.css
webpackConfig.module.rules.push({
  test: /\.module\.(sass|scss)$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        sourceMap: false,
        modules: true,
        localIdentName: '[local]--[hash:base64:5]',
      },
    },
    {
      loader: 'postcss-loader',
      options: postCSSLoaderOptions,
    },
    {
      loader: 'sass-loader',
      options: {
        sassOptions: {
          // indentWidth: 4,
          includePaths: ['styles'],
        },
        // precision: 10,
      },
    },
  ],
})
webpackConfig.module.rules.push({
  test: /\.module\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        sourceMap: false,
        modules: true,
        localIdentName: '[local]--[hash:base64:5]',
      },
    },
    {
      loader: 'postcss-loader',
      options: postCSSLoaderOptions,
    },
  ],
})

webpackConfig.plugins.push(
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: 'static/css/[name].[chunkhash:8].css',
    chunkFilename: 'static/css/[name].[chunkhash:8].chunk.css',
  })
)

webpackConfig.module.rules.push({
  test: /\.(woff(2)?|ttf|eot|svg|gif|png)(\?v=\d+\.\d+\.\d+)?$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'fonts/',
      },
    },
  ],
})

module.exports = webpackConfig
