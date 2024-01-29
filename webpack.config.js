//webpack.config.js
const path = require("path");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const MiniCSSExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV === "production";

// console.log(process.env.NODE_ENV, isProduction);

module.exports = {
  mode: isProduction ? "production" : "development",
  ...(isProduction ? {} : { devtool: "inline-source-map" }),
  entry: {
    main: "./src/index.ts",
  },
  output: {
    path: isProduction
      ? path.resolve(__dirname, "marketplace")
      : path.resolve(__dirname, "..", "Extensions"),
    filename: "bfs-bundle.js", // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.module\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /^((?!\.module).)*css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
