module.exports = {
    root: true,
    env: {
      node: true,
      "es6": true
    },
    "parser": "babel-eslint",
    rules: {
      "import/no-webpack-loader-syntax": "off",
      "no-useless-constructor": "off", 
      camelcase: "off",
      "no-throw-literal": "off",
      "prettier/prettier": "off",
      "no-undef":"error"
    },
    "plugins": ["prettier"]
  };