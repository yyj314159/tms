var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"uat"',
    API_ROOT: '"http://47.98.245.217:8081"',
    ENV_REMARK: '"UAT环境"'
})
