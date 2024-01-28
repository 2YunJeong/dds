const { defineConfig } = require('@vue/cli-service')
var path = require("path")

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3001/',
        ws: true
      }
    }
  },
  //outputDir: path.resolve("../back-end/public")
})