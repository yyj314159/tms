var merge = require('webpack-merge')
var prodEnv = require('./prod.env')


module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    //API_ROOT: '"http://192.168.20.112:8081"',//顾城
    //API_ROOT: '"https://gw.zeyiyouhuo.com"',//正式环境
    //API_ROOT: '"http://47.98.245.217:7070"',//测试环境
    //API_ROOT: '"http://192.168.20.148:8081"',//熊磊
    // API_ROOT: '"http://192.168.20.246:7070"',//富国
    //API_ROOT: '"http://192.168.20.221:8081"',//行龙
    //API_ROOT: '"http://192.168.20.170:8081"',//国良
    //API_ROOT: '"http://192.168.60.67:7070"',//高佳
    //API_ROOT: '"http://192.168.60.119:8081"',//甘乐辉
    // API_ROOT: '"http://192.168.20.235:7070"', // 张许
    //API_ROOT: '"http://192.168.60.107:8081"',
    API_ROOT: '"http://127.0.0.1:7070"', // 本地
    ENV_REMARK: '"开发环境"'
})

