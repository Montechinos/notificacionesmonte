const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Resolver aliases para @src/*
config.resolver.alias = {
  '@src': path.resolve(__dirname, 'src'),
  '@': path.resolve(__dirname),
};

module.exports = withNativeWind(config, { input: './global.css' });
