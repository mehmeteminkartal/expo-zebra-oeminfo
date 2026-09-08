const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const packageRoot = path.resolve(__dirname, '..');
const sharedPackages = ['react', 'react-native', 'expo', 'expo-modules-core'];
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The library has development dependencies of its own. Bundle the example's
// copies so React Native and Expo register against a single JS runtime.
config.resolver.blockList = sharedPackages.map(
  (name) => new RegExp(`^${escape(path.join(packageRoot, 'node_modules', name))}[/\\\\].*`)
);
config.resolver.nodeModulesPaths = [path.join(__dirname, 'node_modules')];
config.watchFolders = [packageRoot];
module.exports = config;
