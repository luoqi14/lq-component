const argv = require('yargs').argv;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const project = require('./project.config');
const debug = require('debug')('app:config:webpack');
const path = require('path');

const __LOCAL__ = project.globals.__LOCAL__;
const __TEST__ = project.globals.__TEST__;

debug('Creating configuration.');

const mode = __LOCAL__ ? 'development' : 'production';

const webpackConfig = {
  devtool : project.compiler_devtool,
  resolve : {
    // 1 to 2
    // root       : project.paths.client(),
    modules: [
      project.paths.client(),
      'node_modules',
    ],
    extensions : ['*', '.js', '.jsx', '.json'],
  },
  module : {
    rules: [],
  },
  mode,
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
};
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = project.paths.client('main.jsx');

webpackConfig.entry = {
  app : __LOCAL__
    ? [APP_ENTRY].concat(`webpack-hot-middleware/client?path=${project.compiler_public_path}__webpack_hmr`)
    : [APP_ENTRY],
  vendor : project.compiler_vendors,
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename   : `[name].[${project.compiler_hash_type}].js`,
  path       : project.paths.dist(),
  publicPath : project.compiler_public_path,
};

// ------------------------------------
// Externals
// ------------------------------------
webpackConfig.externals = {};
webpackConfig.externals['react/lib/ExecutionEnvironment'] = true;
webpackConfig.externals['react/lib/ReactContext'] = true;
webpackConfig.externals['react/addons'] = true;

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(project.globals),
  new HtmlWebpackPlugin({
    template : project.paths.client('index.html'),
    hash     : false,
    favicon  : project.paths.public('favicon.ico'),
    filename : 'index.html',
    inject   : 'body',
    chunksSortMode: 'none',
    minify   : {
      collapseWhitespace : true,
    },
  }),
];

// Ensure that the compiler exits on errors during testing so that
// they do not get skipped and misreported.
if (__TEST__ && !argv.watch) {
  webpackConfig.plugins.push(function () {
    this.plugin('done', (stats) => {
      if (stats.compilation.errors.length) {
        // Pretend no assets were generated. This prevents the tests
        // from running making it clear that there were warnings.
        throw new Error(
          stats.compilation.errors.map((err) => err.message || err)
        );
      }
    });
  });
}

if (__LOCAL__) {
  debug('Enabling plugins for live development (HMR).');
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.rules.push({
  test    : /\.(js|jsx)$/,
  exclude : /node_modules/,
  use: [{
    loader: 'babel-loader',
    query: {
      cacheDirectory : true,
    },
  }],
});

// run eslint in dev
if (__LOCAL__) {
  webpackConfig.module.rules.push({
    enforce: 'pre',
    test    : /\.(js|jsx)$/,
    include: path.join(__dirname, '../src'),
    loader  : 'eslint-loader',
  });
}

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: false,
    minimize: {
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions'],
      },
      discardComments: {
        removeAll : true,
      },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
      sourcemap: false,
    },
  },
};

webpackConfig.module.rules.push({
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    cssLoader,
  ],
});

webpackConfig.module.rules.push({
  test: /\.less$/,
  use: [
    MiniCssExtractPlugin.loader,
    cssLoader,
    {
      loader: 'less-loader',
      options: {
        modifyVars: {
          '@primary-color': '#f4d53b',
          '@icon-url': '"/iconfont/iconfont"',
        },
      },
    },
  ],
});

webpackConfig.module.rules.push({
  test: /\.(sass|scss)$/,
  use: [
    MiniCssExtractPlugin.loader,
    cssLoader,
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: '@epegzz/sass-vars-loader',
      options: {
        vars: {
          'primary-color': '#f4d53b',
        },
      },
    },
  ],
});

webpackConfig.plugins.push(new MiniCssExtractPlugin({
  filename: '[name].[contenthash].css',
  chunkFilename: '[id].[contenthash].css',
}));

// Images
// ------------------------------------
webpackConfig.module.rules.push({
  test    : /\.(png|jpg|gif)$/,
  loader  : 'url-loader',
  options : {
    limit : 8192,
  },
});

// Fonts
// ------------------------------------
[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
  ['svg', 'image/svg+xml'],
].forEach((font) => {
  const extension = font[0];
  const mimetype = font[1];

  webpackConfig.module.rules.push({
    test    : new RegExp(`\\.${extension}$`),
    loader  : 'url-loader',
    options : {
      name  : 'fonts/[name].[ext]',
      limit : 10000,
      mimetype,
    },
  });
});

module.exports = webpackConfig;
