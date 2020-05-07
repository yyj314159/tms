<template>
    <div class="login-wrap">
        <div class="ms-head"><img src="../../../assets/logo2.png" class="logo_2"/></div>
        <div class="ms-login">
            <el-tabs type="border-card" stretch>
                <el-tab-pane label="钉钉扫码登陆" v-if="showDingtalkFlag">
                    <div id="login_container"></div>
                </el-tab-pane>
                <el-tab-pane label="账号密码登陆" v-if="showUsernameFlag">
                    <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                        <el-form-item prop="username" style="margin: 20px auto;">
                            <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
                        </el-form-item>
                        <el-form-item prop="password" style="margin-bottom: 40px;">
                            <el-input type="password" placeholder="密码" v-model="ruleForm.password"
                                      @keyup.enter.native="submitForm('ruleForm')"></el-input>
                        </el-form-item>
                        <div class="login-btn">
                            <el-button v-if="isLoading"  @click="submitForm('ruleForm')" style="background:#E49A37; color:#fff;">登录</el-button>
                            <el-button v-else  style="background:#E49A37; color:#fff;">登录中...</el-button>
                        </div>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
        <p class="ms-foot">Copyright © 2018 上海则一供应链管理有限公司版权所有<br/>版本号：V1.0.1 <a href="http://www.miitbeian.gov.cn" style="color: #ffffff;text-decoration:underline">{{recordNumber}}</a></p>
    </div>
</template>

<script>
    import axios from 'axios';
    import { Api } from 'src/global/api'
    import common from 'src/global/common';
    import Cookies from "js-cookie"
    export default {
        data: function () {
            return {
                isLoading: true,
                loginType: 'qrcode',
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        computed:{
            recordNumber(){
                let hostname = window.location.hostname;
                if(hostname==="www.maszeyi.com"){
                    return '皖ICP备20001903号-1'
                }else if(hostname==="www.xzzeyi.com"){
                    return '苏ICP备20004096号-1'
                }else{
                    return '沪ICP备12046931号-3'
                }
            },
            showDingtalkFlag(){
                let hostname = window.location.hostname;
                if(hostname==="www.maszeyi.com"){
                    return false
                }
                if(hostname==="www.xzzeyi.com"){
                    return false
                }
                return true
            },
            showUsernameFlag(){
                let hostname = window.location.hostname;
                let envname = process.env.NODE_ENV;
                if(hostname==="www.maszeyi.com"){
                    return true
                }
                if(hostname==="www.xzzeyi.com"){
                    return true
                }
                if(envname==='production'){
                    return false
                }
                return true;
            }
        },
        mounted(){
            let code = this.showDingtalkFlag?window.location.search.substring(window.location.search.indexOf('=') + 1,window.location.search.indexOf('&')):'';
            let token = common.token.getToken();
            if(code.length>0){
                if(!!token){
                    common.token.removeToken();
                }
                this.dingLogin({
                    code: code,
                    userType: 'ZEYI',
                    systemCode: 'tms-web'
                })
            }else{
                if(!!token){
                    const {href} = this.$router.resolve({path: '/'});
                    window.location.href = window.location.origin + window.location.pathname + href;
                }else{
                    this.codeLogin();
                }
            }
        },
        methods: {
            codeLogin () {
                axios.get(Api.login.getDingTalkApp, {params: {systemCode: 'tms-web'}}).then(res => {
                    let appid = res.data.result.appId;
                    let redirectUri = res.data.result.redirectUri;
                    let obj = DDLogin({
                        id: 'login_container',
                        goto: encodeURIComponent('https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=' + appid + '&response_type=code&scope=snsapi_login&state=STATE&redirect_uri='+redirectUri),
                        style: 'border:none;background-color:#FFFFFF;',
                        width: '320',
                        height: '300'
                    })
                    let hanndleMessage = function (event) {
                        let origin = event.origin
                        // 判断是否来自ddLogin扫码事件
                        if (origin === 'https://login.dingtalk.com') {
                            let loginTmpCode = event.data
                            // 这里url不用进行urlencode编码
                            let url = 'https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=' + appid + '&response_type=code&scope=snsapi_login&state=STATE&redirect_uri='+redirectUri+'&loginTmpCode=' + loginTmpCode
                            window.location.href = url
                        }
                    }
                    if (typeof window.addEventListener !== 'undefined') {
                        window.addEventListener('message', hanndleMessage, false)
                    } else if (typeof window.attachEvent !== 'undefined') {
                        window.attachEvent('onmessage', hanndleMessage)
                    }
                })
            },
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isLoading = false;
                        axios.post(Api.login.login, self.ruleForm).then(response => {
                            var result = response.data;
                            if(result.success){
                                Cookies.set('tms-token', result.result.accessToken, {expires: new Date(new Date().getTime() + (result.result.expiresIn - 1) * 1000)})
                                self.$store.dispatch('getCurrentUserFromServer').then(res => {
                                    if(!self.$store.getters.user || !self.$store.getters.user.permissionUrls || self.$store.getters.user.permissionUrls.length<=0){
                                        Cookies.remove('tms-token');
                                        this.$message.warning(`当前用户尚未配置路由菜单权限！`);
                                        this.isLoading = true;
                                    }else{
                                        self.$router.push('/');
                                    }
                                }).catch(err => {
                                    this.$message({
                                        message: err,
                                        type: 'error'
                                    });
                                    this.isLoading = true;
                                });
                            }else{
                                this.$message({
                                    message: result.message,
                                    type: 'error'
                                });
                                this.isLoading = true;
                            }
                        }).catch(reason => {
                            this.$message({
                                message: '服务异常!',
                                type: 'error'
                            });
                            this.isLoading = true;
                        })
                    }
                })
            },
            dingLogin(data){
                let self = this;
                axios.post(Api.login.dingLogin, data).then(response => {
                    var result = response.data;
                    if(result.success){
                        Cookies.set('tms-token', result.result.accessToken, {expires: new Date(new Date().getTime() + (result.result.expiresIn - 1) * 1000)})
                        self.$store.dispatch('getCurrentUserFromServer').then(res => {
                            if(!self.$store.getters.user || !self.$store.getters.user.permissionUrls || self.$store.getters.user.permissionUrls.length<=0){
                                Cookies.remove('tms-token');
                                this.$message.warning(`当前用户尚未配置路由菜单权限！`);
                            }else{
                                const {href} = self.$router.resolve({path: '/'});
                                window.location.href = window.location.origin + window.location.pathname + href;
                            }
                        }).catch(err => {
                            this.$message({
                                message: err,
                                type: 'error'
                            });
                        });
                    }else{
                        this.$message({
                            message: result.message,
                            type: 'error'
                        });
                    }
                }).catch(reason => {
                    this.$message({
                        message: '服务异常!',
                        type: 'error'
                    });
                })
            }
        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background:#FBD007 url("../../../assets/login_bg.jpg")  no-repeat center;
        background-size:cover;
    }

    .ms-title {
        width: 100%;
        text-align: center;
        font-size: 16px;
        font-weight:bold;
        margin-bottom: 20px;
        color: #E49A37;

    }

    .ms-head {
        position: absolute;
        top:10%;
        left:10%;
    }

    .ms-head span {
        font-size: 12px;
    }

    .ms-foot {
        position: absolute;
        bottom:5%;
        left:50%;
        font-size: 14px;
        text-align: center;
        margin: 0px 0px 50px -110px;
        color: #fff;
    }

    .ms-login {
        position: absolute;
        left: 60%;
        top: 45%;
        width: 18%;
        min-width: 350px;
        /*height: 230px;*/
        margin-top: -150px;
        padding: 0;
        border-radius: 5px;
        background: #fff;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
    }
</style>
