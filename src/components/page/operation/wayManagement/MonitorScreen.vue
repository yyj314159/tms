<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 在途管理</el-breadcrumb-item>
                <el-breadcrumb-item>监控大屏</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="0" style="border:none;"></el-header>
        <el-main class="content-main" style="padding: 0;">
            <el-form :show-message="false" :model="paramsForm" ref="paramsForm">
                <el-row :gutter="10"  style="width:336px; height:33px; line-height:33px; position: absolute; top: 85px; left: 480px;">
                    <el-col :span="16">
                        <el-form-item prop="params.vehicleNo" :rules="[Validate.required('请输入车牌号！',true),Validate.licenseNumber]">
                            <el-input size="small" v-model="paramsForm.params.vehicleNo"  placeholder="请输入车牌号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-button size="small" @click="getVehicleFollowUrl" style="display: inline-block">跟踪</el-button>
                    </el-col>
                    <el-col :span="4">
                        <el-button size="small" @click="getVehicleReviewUrl" style="display: inline-block">回放</el-button>
                    </el-col>
                </el-row>
            </el-form>
            <iframe :src="monitorUrl" frameborder="0" width="100%" :height="minHeight"></iframe>
        </el-main>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import {Validate} from 'src/global/validate'

    export default {
        data() {
            return {
                Validate: Validate,//校验
                monitorUrl : '',
                paramsForm:{
                    params:{
                        vehicleNo: "",
                        beginTime: "",
                        endTime: ""
                    }
                }
            }
        },
        created(){
            this.getMonitorUrl();
        },
        computed: {
            minHeight: function () { //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "900";
                } else if (document.documentElement.clientHeight < 700) {
                    return "450";
                } else {
                    return "700";
                }
            }
        },
        methods:{
            getMonitorUrl(){
                let vm = this;
                Http.get(Api.g7.monitorUrl,null, result => {
                    vm.monitorUrl = result.result;
                })
            },
            getVehicleFollowUrl(){
                let vm = this;
                vm.$refs.paramsForm.validate((valid)=>{
                    if(valid){
                        vm.$router.push({ path: '/operation/following',query: vm.paramsForm.params});
                    }else{
                        vm.$message.error('车牌号为空或不正确！')
                    }
                })
            },
            getVehicleReviewUrl(){
                let vm = this;
                vm.$refs.paramsForm.validate((valid)=>{
                    if(valid){
                        vm.$router.push({ path: '/operation/runningTrack',query: vm.paramsForm.params});
                    }else{
                        vm.$message.error('车牌号为空或不正确！')
                    }
                })
            }
        }
    }
</script>

