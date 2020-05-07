<template>
    <div>
        <div class="header">
            <div style="width:980px; margin: 0 auto;">
                <div class="logo"><img src="../../../assets/logo1w.png"/>&nbsp;营运管理系统 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 重置密码</div>
            </div>
        </div>
        <div style="width:980px; margin: 0 auto;">
            <el-form :model="resetPassWordForm" size="small" :rules="rules" ref="resetPassWordForm" label-width="100px" style="margin:100px auto; width:650px;">
                <el-form-item>
                    登录成功！为了您的账号安全，请重新设置密码！
                </el-form-item>
                <el-form-item label="原始密码 :" prop="oldPassword">
                    <el-input type="password" v-model="resetPassWordForm.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码 :" prop="newPassword">
                    <el-input type="password" v-model="resetPassWordForm.newPassword" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码 :" prop="checkPass">
                    <el-input type="password" v-model="resetPassWordForm.checkPass" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('resetPassWordForm')">提交</el-button>
                    <el-button @click="resetForm('resetPassWordForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <p class="footer">Copyright © 2018 上海则一供应链管理有限公司版权所有<br/>版本号：V1.0.1</p>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {Api,Http,Common} from 'src/global';
    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.resetPassWordForm.checkPass !== '') {
                        this.$refs.resetPassWordForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.resetPassWordForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                resetPassWordForm: {
                    newPassword: '',
                    checkPass: '',
                    oldPassword: ''
                },
                rules: {
                    newPassword: [
                        {required: true, message:'请输入新密码'},
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        {required: true, message:'请再次输入新密码'},
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    oldPassword: [
                        {required: true, message:'请输入原始密码'}
                    ]
                }
            };
        },
        computed: {
            ...mapGetters([
                'user',
                'env'
            ])
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.user.modifyPassword, this.resetPassWordForm, response => {
                            this.$message.success('密码重置成功, 请重新登录');
                            Common.token.removeToken();
                            this.$router.push('/login');
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        height: 80px;
        font-size: 22px;
        line-height: 80px;
        color: #fff;
        background-color: #242f42;
    }
    .header .logo{
        float: left;
        width:400px;
        text-align: center;
        font-size: 20px;
        color: #FCD006;
    }

    .header .logo img{
        position:relative;
        top:7px;
        display:inline-block; width:80px; margin:0px 10px 0px 0px; cursor:pointer;
    }

    .footer {
        position: absolute;
        bottom:5%;
        left:50%;
        font-size: 14px;
        text-align: center;
        margin: 0px 0px 50px -180px;
    }
</style>
