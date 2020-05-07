<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 运单管理</el-breadcrumb-item>
                <el-breadcrumb-item>运行轨迹</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="0" style="border:none;"></el-header>
        <el-main class="content-main" style="padding: 0;">
            <iframe :src="vehicleReviewUrl" frameborder="0" width="100%" :height="minHeight"></iframe>
        </el-main>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'

    export default {
        data() {
            return {
                vehicleReviewUrl : '',
                params:{
                    vehicleNo: this.$route.query.vehicleNo,
                    beginTime: this.$route.query.beginTime,
                    endTime: this.$route.query.endTime
                }
            }
        },
        mounted(){
            this.getVehicleReviewUrl();
        },
        computed: {
            minHeight: function () { //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "800";
                } else if (document.documentElement.clientHeight < 700) {
                    return "500";
                } else {
                    return "600";
                }
            }
        },
        methods:{
            getVehicleReviewUrl(){
                let vm = this;
                Http.get(Api.g7.vehicleFollowUrl,{params: vm.params}, result => {
                    vm.vehicleReviewUrl = result.result;
                })
            }
        }
    }
</script>

