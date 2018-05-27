/*eslint-env node */
module.exports = {
  entry: {
    main: "./js/entry.js"
    //,ocr: "./js/ocr-tool.js"
  },
  // devtool: '#cheap-module-source-map',
  output: {
    path: __dirname + "/js/bundle",
    filename: "[name].js"
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    jquery: "jQuery"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015"]
        }
      }
    ]
  }
};
