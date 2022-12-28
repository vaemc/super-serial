const { defineConfig } = require('@vue/cli-service')
module.exports = {
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
