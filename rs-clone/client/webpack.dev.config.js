const path = require("path");

module.exports = {
  entry: {
    app: path.resolve(__dirname, "./src/index.ts"),
  },
  mode: "development",
  target: "web",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  devServer: {
    open: true,
    host: "localhost",
    port: 3000,
    hot: true,
    static: path.resolve(__dirname, "./dist"),
  },
};
