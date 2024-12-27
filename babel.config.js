module.exports = function (api) {
    api.cache(true);
    return {
      presets: ["babel-preset-expo"],
      plugins: [
        [
          "module-resolver",
          {
            root: ["./"],
            alias: {
              "@": "./",
              "@assets": "./assets",
              "@components": "./src/components",
              "@redux": "./src/redux",
              "@screens": "./src/screens",
              "@styles": "./src/styles",
              "@utils": "./src/utils"
            }
          }
        ]
      ]
    };
  };