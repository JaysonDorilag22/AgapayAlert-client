// babel.config.js
module.exports = function (api) {
    api.cache(true);
    return {
      presets: ["babel-preset-expo"],
      plugins: ["nativewind/babel"], //The error no longer appears if I comment out this line.
    };
  };