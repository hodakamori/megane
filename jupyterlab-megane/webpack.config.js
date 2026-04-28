/* eslint-disable */
const path = require("path");

module.exports = {
  experiments: {
    asyncWebAssembly: true
  },
  resolve: {
    alias: {
      "@megane": path.resolve(__dirname, "../src")
    },
    extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx", "..."],
    modules: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "../node_modules")
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [path.resolve(__dirname, "../src")],
        use: {
          loader: require.resolve("ts-loader"),
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, "tsconfig.webpack.json")
          }
        }
      },
      {
        test: /\.wasm$/,
        type: "asset/resource",
        generator: {
          filename: "[name].[hash][ext]"
        }
      }
    ]
  }
};
