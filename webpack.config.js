const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add polyfills for missing modules
  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'),
    vm: require.resolve('vm-browserify'),
    stream: require.resolve('stream-browserify'),
    // Add more if necessary
  };

  // Optional: alias React Native to React Native Web if not already set
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',
    'react-native': 'react-native-web',
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      crypto: 'crypto-browserify',
    })
  );

  return config;
};
