import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store'
import axios from 'axios';
import Api from './global/api';
import common from './global/common';
import ElementUI from 'element-ui';
import moment from 'vue-moment'
import xlsx from 'xlsx';
import CommonComponent from './components/common'
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
//省市区选择器
import RegionPicker from 'region-picker'
import 'region-picker/dist/region-picker.css'
import lodash from 'lodash'

Vue.use(ElementUI);
Vue.use(moment);
Vue.use(xlsx);
Vue.use(CommonComponent);
// http request 拦截器
//省市区选择器
Vue.use(RegionPicker);

console.log(process.env);
/**
 * 初始化环境
 */
store.dispatch('setEnvAction',process.env);

// http request 新增token
axios.interceptors.request.use(
    config => {
        if (common.token.hasToken() && config.url.indexOf('login') == -1) {
            config.headers.Authorization = 'Bearer ' + common.token.getToken();
        }
        return config;
    });
// http response 拦截器
axios.interceptors.response.use(
    response => {
        if ('401' === response.data.errorCode) {
            common.token.removeToken();
            router.replace({
                path: '/login'
            })
        }
        return response;
    },
    error => {
        if(error.response && 401 == error.response.status){
            common.token.removeToken();
            router.replace({
                path: '/login'
            })
        }
        return Promise.reject(error);
    });

Vue.prototype.$http = axios;
/**
 * 权限控制
 * @type {string[]}
 */
const whiteList = ['/login','/404','/403','/resetPassWord'];// 不重定向白名单
router.beforeEach((to, from, next) => {
    let url = process.env.NODE_ENV === 'development'?'../static/version.json?_=':'./static/version.json?_=';
    axios.get(url + Math.random()).then(response => {
        if (200 == response.status) {
            if( process.env.NODE_ENV !== 'development' && process.env.VERSION !== response.data.version){
                var message = "系统版本有更新，点击确认加载更新！"
                Vue.prototype.$alert(message, '系统提示', {
                    confirmButtonText: '确定',
                    callback: function(){
                        window.location.reload(true);
                    }
                });
                return;
            }
            validateRouter(to,from,next);
        }
    }).catch(err => {
        validateRouter(to,from,next);
    });
});
function validateRouter(to, from, next){//校验路由权限及登陆信息
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next();
        return;
    }
    if (!common.token.hasToken()) {
        next('/login');
        return;
    }
    if(common.changePWflag.getFlag()){
        next('/resetPassWord');
        return;
    }
    getDistrict().then(result => {
        getCurrentUser().then(res => {
            if(checkPermission(to.path)){
                next({ path: '/403' });
            }else{
                next();
            }
        }).catch(err => {
            console.log(err);
            next('/login');
        })
    }).catch(error => {
        console.log(err);
        next('/login');
    })
}

/**
 * 权限指令
 */
Vue.directive('permission', {
    /*bind: function(el, binding) {
        if (binding.value && !Vue.prototype.$_permission(binding.value)) {
            el.parentNode.removeChild(el);
        }
    },*/
    inserted: function(el, binding) {
        if (binding.value && !Vue.prototype.$_permission(binding.value)) {
            el.parentNode.removeChild(el);
        }
    }
});

Vue.prototype.$_permission = function(value) {
    return store.getters.permission.includes(value);
};

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

/**
 * 获取省市区信息
 * @returns {Promise<any>}
 */
function getDistrict(){
    return new Promise((resolve, reject) => {
        if(!store.getters.district){
            store.dispatch('getDistrictFromServer').then(res => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        }else{
            resolve();
        }
    })
}

/**
 * 获取当前用户信息
 * @returns {Promise<any>}
 */
function getCurrentUser(){
    return new Promise((resolve, reject) => {
        if(!store.getters.user){
            store.dispatch('getCurrentUserFromServer').then(res => {
                resolve();
            }).catch(err => {
                reject(err);
            });
        }else{
            resolve();
        }
    })
}

/**
 * 检查权限
 * @param path
 * @returns {boolean}
 */
function checkPermission(path){
    if(path === '/index' || path === '/index/home'){
        return false;
    }
    return !store.getters.permission.includes(path) && path !== '/index';
}

/**
 * 相同账号操作重定向
 * 已登录状态且不在白名单的页面，旧窗口在有新账号登陆的情况下会刷新页面
 */
setInterval(()=>{
    if(common.userId.getUserId() && !_.isNil(store.getters.user) && !whiteList.some((path)=>{
        return path === router.history.current.fullPath
    }) && common.userId.getUserId() !== store.getters.user.id){
        common.userId.setUserId('');
        location.reload();
    }
},5000)


