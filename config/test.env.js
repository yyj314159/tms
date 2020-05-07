var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"test"',
    API_ROOT: '"http://47.98.245.217:7070"',
    VERSION: '"'+ new Date().getTime() +'"',
    ENV_REMARK: '"测试环境"'
})
