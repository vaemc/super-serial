module.exports = {
  chainWebpack (config) {
    // config.module
    // .rule('node')
    // .test(/\.node$/)
    // .use('node-loader')
    // .loader('node-loader')
    // .end()
  },
  configureWebpack: {
    externals: {
      serialport: 'require("serialport")',
    },
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['serialport'],       
    },
  },
};
