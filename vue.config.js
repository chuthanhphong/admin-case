module.exports = {
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    devtool: 'source-map'
  },
  parallel: false,
  publicPath: process.env.VUE_APP_ENV === 'production' ? '/home/' : '/econtract/',
  productionSourceMap: false,
  // chainWebpack: config => {
  //   config.module
  //     .rule('worker')
  //     .test(/\.worker\.js$/i)
  //     .use('worker-loader')
  //     .loader('worker-loader')
  // },
  devServer: {
    disableHostCheck: true
  }
}
