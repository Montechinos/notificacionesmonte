const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Incluir .glb como asset extension para modelos 3D
config.resolver.assetExts = [...(config.resolver.assetExts || []), 'glb'];

// Fix: resolver manualmente subpath exports que Metro no soporta
const originalResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // @use-gesture/core/types no se resuelve con Metro por defecto
  if (moduleName === '@use-gesture/core/types') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/@use-gesture/core/types/dist/use-gesture-core-types.cjs.js'),
      type: 'sourceFile',
    };
  }
  if (originalResolver) return originalResolver(context, moduleName, platform);
  return context.resolveRequest(context, moduleName, platform);
};

// Resolver aliases para @src/*
config.resolver.alias = {
  '@src': path.resolve(__dirname, 'src'),
  '@': path.resolve(__dirname),
};

module.exports = withNativeWind(config, { input: './global.css' });
