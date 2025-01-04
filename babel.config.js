module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [
            ".js",
            ".jsx",
            ".ts",
            ".tsx",
            ".android.js",
            ".android.tsx",
            ".ios.js",
            ".ios.tsx",
          ],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@styles": "./src/styles",
            "@utils": "./src/utils",
            "@redux": "./src/redux",
            "@assets": "./assets",
            "@validation": "./src/validation",
            "@services" : "./src/services",
            "@context" : "./src/context",
          }
        }
      ]
    ]
  };
};