const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: ["./js/entry.js"],
  node: {
    fs: "empty"
  },
  output: {
    path: __dirname + "/build/",
    publicPath: "/build/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["env"]
        }
      }
    ]
  },
  devtool: "inline-source-map",
  plugins: [
    new Dotenv({
      path: "./config/.env"
    })
  ]
};
