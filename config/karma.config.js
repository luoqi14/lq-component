const argv = require('yargs').argv
const project = require('./project.config')
const webpackConfig = require('./webpack.config')
const debug = require('debug')('app:config:karma')

const TEST_BUNDLER = `./${project.dir_test}/test-bundler.js`
debug('Creating configuration.')
const karmaConfig = {
  basePath : '../', // project root in relation to bin/karma.js
  files    : [
    {
      pattern  : TEST_BUNDLER,
      watched  : false,
      served   : true,
      included : true,
    },
  ],
  singleRun     : !argv.watch,
  frameworks    : ['mocha'],
  reporters     : ['mocha'],
  preprocessors : {
    [TEST_BUNDLER] : ['webpack'],
  },
  browsers : ['PhantomJS'],
  webpack  : {
    entry: TEST_BUNDLER,
    devtool : 'cheap-module-source-map',
    resolve : Object.assign({}, webpackConfig.resolve, {
      alias : Object.assign({}, webpackConfig.resolve.alias, {
        sinon : 'sinon/pkg/sinon.js',
      }),
    }),
    plugins : webpackConfig.plugins,
    module  : {
      noParse : [
        /\/sinon\.js/,
      ],
      rules : webpackConfig.module.rules.concat([
        {
          test   : /sinon(\\|\/)pkg(\\|\/)sinon\.js/,
          loader : 'imports-loader?define=>false,require=>false',
        },
      ]),
    },
    // Enzyme fix, see:
    // https://github.com/airbnb/enzyme/issues/47
    externals : Object.assign({}, webpackConfig.externals, {
      'react/addons'                   : true,
      'react/lib/ExecutionEnvironment' : true,
      'react/lib/ReactContext'         : 'window',
    }),
    sassLoader : webpackConfig.sassLoader,
  },
  webpackMiddleware : {
    noInfo : true,
  },
  coverageReporter : {
    reporters : project.coverage_reporters,
  },
}

if (project.globals.__COVERAGE__) {
  karmaConfig.reporters.push('coverage');
}

module.exports = (cfg) => cfg.set(karmaConfig)
