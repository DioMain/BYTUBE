const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin").TsconfigPathsPlugin;

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "build/"),
    filename: "bundle.js",
    publicPath: "/",
  },
  mode: "development",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".scss"],
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss?$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        exclude: /mode_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ttf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    compress: true,
    port: 3001,
    historyApiFallback: true,
    proxy: [
      {
        context: ["/api", "/videos", "/channels", "/users", "/data"],
        target: "http://localhost:8081",
      },
    ],
    hot: true,
  },
};
