<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 运单管理</el-breadcrumb-item>
                <el-breadcrumb-item>外请车运行轨迹</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="0" style="border:none;"></el-header>
        <el-main class="content-main" style="padding: 0;" :height="minHeight">
            <el-form inline size="small" :model="outTrailForm"  ref="outTrailForm" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            {{outTrailForm.vehicleNo}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车时间:" prop="actualDepartureTime">
                            <el-date-picker style="display:block; width:100%;" v-model="outTrailForm.actualDepartureTime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            type="datetime" placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达时间:" prop="confirmArrivalTime">
                            <el-date-picker style="display:block; width:100%;" v-model="outTrailForm.confirmArrivalTime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            type="datetime" placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 10px;margin-left: 45px">
                    <el-col :span="24">
                        <el-button size="small" @click="startAnimation">开始动画</el-button>
                        <el-button size="small" @click="pauseAnimation">暂停动画</el-button>
                        <el-button size="small" @click="resumeAnimation">继续动画</el-button>
                        <el-button size="small" @click="stopAnimation">停止动画</el-button>
                    </el-col>
                </el-row>
                <el-row style="min-height: 700px;">
                    <el-col :span="24">
                        <div id="container" style="width:100%; min-height:700px;height:700px"></div>
                    </el-col>
                </el-row>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import AMap from 'AMap'
    export default {
        data() {
            return {
                marker:'',
                lineArr:[],
                driverId:'',
                //外请车轨迹
                outTrailForm:{
                    actualDepartureTime:'',
                    confirmArrivalTime:''
                },
                params:{
                    driverId: this.$route.query.driverId,
                    vehicleNo: this.$route.query.vehicleNo,
                    beginTime: this.$route.query.beginTime,
                    endTime: this.$route.query.endTime
                }
            }
        },
        created(){
            this.init();
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
        methods: {
            init(){
                let vm = this;
                vm.outTrailForm.vehicleNo = vm.params.vehicleNo;
                vm.outTrailForm.actualDepartureTime = vm.params.beginTime;
                vm.outTrailForm.confirmArrivalTime = vm.params.endTime;
                Http.get(Api.driverLocation.driverReviewUrl,{params:{'driverId':vm.params.driverId,'startTime':vm.outTrailForm.actualDepartureTime,'endTime':vm.outTrailForm.confirmArrivalTime}},trailResult =>{
                    vm.lineArr = trailResult.result;
                    if(vm.lineArr == null){
                        vm.$message.error('该运单或时间段无轨迹信息!');
                        return;
                    }
                    vm.initMap();
                });
            },
            searchList(){
                let vm = this;
                Http.get(Api.driverLocation.driverReviewUrl,{params:{'driverId':vm.params.driverId,'startTime':vm.outTrailForm.actualDepartureTime,'endTime':vm.outTrailForm.confirmArrivalTime}},trailResult =>{
                    vm.lineArr = trailResult.result;
                    if(vm.lineArr == null){
                        vm.$message.error('该运单或时间段无轨迹信息!');
                        return;
                    }
                    vm.initMap();
                });
            },
            initMap(){
                let vm = this;
                vm.$nextTick(()=>{
                    let mapConfig = {
                        resizeEnable: true,
                        zoom: 14
                    };
                    mapConfig.center = vm.lineArr[0];
                    let map = new AMap.Map("container", mapConfig);
                    vm.marker = new AMap.Marker({
                        map: map,
                        position: vm.lineArr[0],
                        icon: "https://webapi.amap.com/images/car.png",
                        offset: new AMap.Pixel(-26, -13),
                        autoRotation: true,
                        angle:-90,
                    });
                    // 绘制轨迹
                    var polyline = new AMap.Polyline({
                        map: map,
                        path: vm.lineArr,
                        showDir:true,
                        strokeColor: "#28F",  //线颜色
                        strokeWeight: 6,      //线宽
                    });
                    var passedPolyline = new AMap.Polyline({
                        map: map,
                        strokeColor: "#AF5",  //线颜色
                        strokeWeight: 6,      //线宽
                    });
                    AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
                        vm.infoWindow = new SimpleInfoWindow({
                            infoTitle: '<strong>外请车轨迹</strong>',
                            infoBody: '点击开始动画可进行播放',
                            offset: new AMap.Pixel(0, -31)
                        });
                        vm.infoWindow.open(map, vm.marker.getPosition());
                    });
                    vm.marker.on('click',function(e){
                        vm.infoWindow.open(map, vm.marker.getPosition());
                    });
                    vm.marker.on('moving', function (e) {
                        var len = e.passedPath.length;
                        var location = e.passedPath[len-1];
                        var lonLat = new AMap.LngLat(location.lng,location.lat);
                        vm.infoWindow.setInfoBody('<div>经度：'+location.lng+'<br>纬度：'+location.lat+'</div>');
                        vm.infoWindow.setPosition(lonLat);
                        passedPolyline.setPath(e.passedPath);
                    });
                    map.setFitView();
                });
            },
            startAnimation:function(){
                this.marker.moveAlong(this.lineArr,200);
            },
            pauseAnimation:function(){
                this.marker.pauseMove();
            },
            resumeAnimation:function(){
                this.marker.resumeMove();
            },
            stopAnimation:function(){
                this.marker.stopMove();
            },
        }
    }
</script>

