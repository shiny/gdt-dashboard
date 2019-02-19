const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConf = require('./webpack.base.conf')
const MinifyPlugin = require("babel-minify-webpack-plugin")

module.exports = merge(baseConf, {
  watch: true,
  plugins: [
    new MinifyPlugin({

    }, {
      comments: false
    })
  ],
  mode: 'production'
})
