const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Incluir .glb como asset extension para modelos 3D
config.resolver.assetExts = [...(config.resolver.assetExts || []), 'glb'];

// Resolver aliases para @src/*
config.resolver.alias = {
  '@src': path.resolve(__dirname, 'src'),
  '@': path.resolve(__dirname),
};

module.exports = withNativeWind(config, { input: './global.css' });
