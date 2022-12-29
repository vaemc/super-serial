const { defineConfig } = require("@vue/cli-service");
// module.exports = defineConfig({
//   transpileDependencies: true
// })
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
module.exports = {
  chainWebpack: function (config) {
    config.plugin("monaco").use(new MonacoWebpackPlugin());
  },
  configureWebpack: {
    externals: {
      serialport: 'require("serialport")',
    },
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  },
};
