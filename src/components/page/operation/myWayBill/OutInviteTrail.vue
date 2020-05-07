<template>
    <el-dialog title="外请车轨迹" :visible.sync="visible" width="90%" :top="marginTop" @close="close">
        <el-form inline size="small" :model="outTrailForm"  ref="outTrailForm" label-width="100px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="运单号:">
                        {{outTrailForm.code}}
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="车牌号:">
                        {{outTrailForm.dispatch.dispatchVehicle?outTrailForm.dispatch.dispatchVehicle.vehicleLicenseNum:''}}
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="司机:">
                        {{outTrailForm.dispatch.dispatchVehicle?outTrailForm.dispatch.dispatchVehicle.driver?outTrailForm.dispatch.dispatchVehicle.driver.name:"":''}}
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="始发地:">
                        {{outTrailForm.dispatch.dispatchLine.stopOverStation[0]?outTrailForm.dispatch.dispatchLine.stopOverStation[0].stationAddress:''}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="目的地:">
                        {{outTrailForm.dispatch.dispatchLine.stopOverStation[outTrailForm.dispatch.dispatchLine.stopOverStation.length-1]?outTrailForm.dispatch.dispatchLine.stopOverStation[outTrailForm.dispatch.dispatchLine.stopOverStation.length-1].stationAddress:''}}
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="发车时间:">
                        {{outTrailForm.actualDepartureTime}}
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="到达时间:">
                        {{outTrailForm.confirmArrivalTime}}
                    </el-form-item>
                </el-col>
            </el-row>
            <span style="color: #20a0ff;font-size: 18px">轨迹回放控制</span>
            <el-row style="margin-top: 20px;">
                <el-col :span="24">
                    <el-button size="small" @click="startAnimation">开始动画</el-button>
                    <el-button size="small" @click="pauseAnimation">暂停动画</el-button>
                    <el-button size="small" @click="resumeAnimation">继续动画</el-button>
                    <el-button size="small" @click="stopAnimation">停止动画</el-button>
                </el-col>
            </el-row>
            <el-row style="min-height: 400px;">
                <el-col :span="24">
                    <div id="container" style="width:100%; min-height:400px;height:400px"></div>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    import {Http,Api} from 'src/global'
    import {Constant} from 'src/global/constant'
    import AMap from 'AMap'

    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            code:{
                type: String,
                default: ''
            }
        },
        data() {
            return {
                visible: true,
                constant: Constant,//常量
                marker:'',
                lineArr:[],
                driverId:'',
                //外请车轨迹
                outTrailForm:{
                    dispatch:{
                        dispatchLine:{
                            stopOverStation:[]
                        },
                        dispatchVehicle:{}
                    }
                },
            }
        },
        watch:{
            //监听传入的visible参数
            dialogVisible(val){
                if(val){
                    this.visible = val;
                }
            }
        },
        mounted() {
            this.init(this.code);
        },
        computed:{
            marginTop:function(){ //根据不同屏幕高度设置弹框的位置
                if(document.documentElement.clientHeight>900){
                    return "15vh";
                }else if(document.documentElement.clientHeight<700){
                    return "2vh";
                }else{
                    return "8vh";
                }
            }
        },
        methods: {
            close() {
                this.visible = false;
                this.$emit('close');
            },
            init(code){
                let vm = this;
                Http.get(Api.waybill.queryByCode,{params:{'code':code}},result =>{
                    //外请车轨迹
                    vm.outTrailForm = result.result;
                    vm.driverId = result.result.dispatch.dispatchVehicle.driver.id;
                    Http.get(Api.driverLocation.driverReviewUrl,{params:{'driverId':code,'startTime':result.result.actualDepartureTime,'endTime':result.result.confirmArrivalTime}},trailResult =>{
                        this.lineArr = trailResult.result;
                        // if(this.lineArr == null){
                        //     vm.$message.error('该运单无轨迹信息!');
                        // }
                        this.lineArr = [[116.478935,39.997761],[116.478939,39.997825],[116.478912,39.998549],[116.478912,39.998549],[116.478998,39.998555],[116.478998,39.998555],[116.479282,39.99856],[116.479658,39.998528],[116.480151,39.998453],[116.480784,39.998302],[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]];
                        this.$nextTick(()=>{
                            let mapConfig = {
                                resizeEnable: true,
                                zoom: 14
                            };
                            mapConfig.center = this.lineArr[0];
                            let map = new AMap.Map("container", mapConfig);
                            this.marker = new AMap.Marker({
                                map: map,
                                position: this.lineArr[0],
                                icon: "https://webapi.amap.com/images/car.png",
                                offset: new AMap.Pixel(-26, -13),
                                autoRotation: true,
                                angle:-90,
                            });
                            // 绘制轨迹
                            var polyline = new AMap.Polyline({
                                map: map,
                                path: this.lineArr,
                                showDir:true,
                                strokeColor: "#28F",  //线颜色
                                strokeWeight: 6,      //线宽
                            });
                            var passedPolyline = new AMap.Polyline({
                                map: map,
                                strokeColor: "#AF5",  //线颜色
                                strokeWeight: 6,      //线宽
                            });
                            this.marker.on('moving', function (e) {
                                passedPolyline.setPath(e.passedPath);
                            });
                            map.setFitView();
                        })
                    });
                });
            },
            initMap: function (id, mapLng, mapLat, zoom, lng, lat, radius) {
                let vm = this;
                let mapConfig = {
                    resizeEnable: true,
                    zoom: zoom
                };
                if (mapLng && mapLat) {
                    mapConfig.center = [mapLng, mapLat];
                }
                this.map = new AMap.Map(id, mapConfig);
                let map = this.map;

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
<style scoped>
    .blue{
        color:#20a0ff;
        display: inline-block;
        width:150px;
        margin-bottom: 12px;
    }
</style>
