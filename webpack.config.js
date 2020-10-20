const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const scssRegex = /\.scss$/;
const scssModuleRegex = /\.module\.scss$/;

// common function to get style loaders
function getExtractStyleLoaders(mode, cssOptions, preProcessor) {
  const loaders = [
    {
      loader: require.resolve('css-loader'),
      options: cssOptions
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              grid: 'autoplace'
            },
            stage: 3
          })
        ]
      }
    }
  ];
  // If not bundling for Storybook, use extract loader
  if (mode !== 'storybook') {
    loaders.unshift(MiniCssExtractPlugin.loader);
  }
  // otherwise use style loader
  else {
    loaders.unshift({ loader: require.resolve('style-loader') });
  }

  if (preProcessor) {
    loaders.push(require.resolve(preProcessor));
  }
  return loaders;
}

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

module.exports = function(env, argv) {
  const mode = (argv ? argv.mode : null) || process.env.NODE_ENV;
  return {
    entry: {
      foo: path.resolve(__dirname, 'src/entries/foo'),
      bar: path.resolve(__dirname, 'src/entries/bar'),
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          fooStyles: {
            name: 'foo',
            test: (m, c, entry = 'foo') =>
                m.constructor.name === 'CssModule' && recursiveIssuer(m) ===
                entry,
            chunks: 'all',
            enforce: true,
          },
          barStyles: {
            name: 'bar',
            test: (m, c, entry = 'bar') =>
                m.constructor.name === 'CssModule' && recursiveIssuer(m) ===
                entry,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ],
    module: {
      rules: [
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getExtractStyleLoaders(mode, {
            importLoaders: 1
          })
        },
        {
          test: cssModuleRegex,
          use: getExtractStyleLoaders(mode, {
            importLoaders: 1,
            modules: {
              getLocalIdent: getCSSModuleLocalIdent
            }
          })
        },
        {
          test: scssRegex,
          exclude: scssModuleRegex,
          use: getExtractStyleLoaders(mode, { importLoaders: 2 }, 'sass-loader')
        },
        {
          test: scssModuleRegex,
          use: getExtractStyleLoaders(mode, {
            importLoaders: 2,
            modules: {
              getLocalIdent: getCSSModuleLocalIdent
            }
          }, 'sass-loader')
        },
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [
                ['@babel/plugin-proposal-decorators', {legacy: true}],
                ['@babel/plugin-proposal-class-properties', {loose: true}],
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-optional-chaining',
                '@loadable/babel-plugin',
                'react-docgen'
              ],
              cacheDirectory: true
            }
          }
        }
      ],
    }
  };
};
