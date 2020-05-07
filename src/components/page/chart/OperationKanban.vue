<template>
    <div>
        <el-form size="small" :model="searchParam" label-width="100px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="所属区域:">
                        <org-select ref="orgCode" v-model="searchParam.orgCode" nature="HEADQUARTERS,AREA" style="display: block"
                                    @change="searchAllData"/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="开始日期:">
                        <date-picker-single v-model="searchParam.startTime" date-type="start"
                                            :end-date="searchParam.endTime" max-range-days="31"
                                            @change="searchAllData"></date-picker-single>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="结束日期:">
                        <date-picker-single v-model="searchParam.endTime" date-type="end"
                                            :start-date="searchParam.startTime" max-range-days="31"
                                            @change="searchAllData"></date-picker-single>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-main class="content-main" style="height:auto;">
            <el-row>
                <el-col :span="6">
                    <el-row>
                        <el-col :span="10" style="text-align: right;">
                            <img src="../../../assets/icon-quekou.png" alt="" height="36" style="cursor: pointer;" v-popover:popover_quekou @click="openPage('/operation/dispatch')">
                        </el-col>
                        <el-col :span="14" style="text-align: left; padding-left: 10px;">
                            <el-row>运力缺口</el-row>
                            <el-row style="font-weight: bold; color: red;font-size: 18px;">{{searchResult.shortageVehicleNum}}</el-row>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <el-col :span="10" style="text-align: right;">
                            <img src="../../../assets/icon-dengdai.png" alt="" height="36" style="cursor: pointer;" v-popover:popover_daifache @click="openPage('/operation/dispatchManage')">
                        </el-col>
                        <el-col :span="14" style="text-align: left; padding-left: 10px;">
                            <el-row>待发车</el-row>
                            <el-row style="font-weight: bold; color: red;font-size: 18px;">{{searchResult.waitDepartureNum}}</el-row>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <el-col :span="10" style="text-align: right;">
                            <img src="../../../assets/icon-fache.png" alt="" height="36" style="cursor: pointer;" v-popover:popover_yifache @click="openPage('/operation/waybill')">
                        </el-col>
                        <el-col :span="14" style="text-align: left; padding-left: 10px;">
                            <el-row>已发车</el-row>
                            <el-row style="font-weight: bold; color: red;font-size: 18px;">{{searchResult.departureNum}}</el-row>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <el-col :span="10" style="text-align: right;">
                            <img src="../../../assets/icon-yingshou.png" alt="" height="36" style="cursor: pointer;" v-popover:popover_yingshou>
                        </el-col>
                        <el-col :span="14" style="text-align: left; padding-left: 10px;">
                            <el-row>营收(万)</el-row>
                            <el-row style="font-weight: bold; color: red;font-size: 18px;">{{searchResult.revenueAmount}}</el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="position: relative;">
                    <div id="sendReceiveChart" style="height:320px; min-width: 200px;"></div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :spn="24">
                    <table width="100%" border="1" style="border-collapse: collapse;font-size: 6px;text-align: center">
                        <tr>
                            <td style="font-weight: bold;">时间</td>
                            <td v-for="(item,index) in searchResult.sendReceiveData.dateStrList" :key="index">{{item}}</td>
                        </tr>
                        <tr>
                            <td  style="font-weight: bold;">发车</td>
                            <td v-for="(item,index) in searchResult.sendReceiveData.departureNumList" :key="index">{{item}}</td>
                        </tr>
                        <tr>
                            <td  style="font-weight: bold;">营收</td>
                            <td v-for="(item,index) in searchResult.sendReceiveData.revenueAmountList" :key="index">{{item}}</td>
                        </tr>
                    </table>
                </el-col>
            </el-row>
        </el-main>
        <el-main class="content-main" style="height:auto;">
            <el-row>
                <el-col :span="8" style="position: relative;">
                    <div id="topTenChart" style="height:420px;"></div>
                </el-col>
                <el-col :span="8" style="position: relative;">
                    <div id="areaChart" style="height:420px;"></div>
                </el-col>
                <el-col :span="8" style="position: relative;">
                    <div id="outInvitePaymentChart" style="height:420px;"></div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" style="text-align: right;">
                    <el-tag type="warning" style="font-weight: bold; color: red;font-size: 24px;">前十客户营收：{{searchResult.topTenData.totalAmount}}万</el-tag>
                </el-col>
                <el-col :span="8" style="text-align: right;">
                    <el-tag type="warning" style="font-weight: bold; color: red;font-size: 24px;">营收总计：{{searchResult.areaData.totalAmount}}万</el-tag>
                </el-col>
                <el-col :span="8" style="text-align: right;">
                    <el-tag type="warning" style="font-weight: bold; color: red;font-size: 24px;">外请应付：{{searchResult.outInvitePaymentData.totalAmount>0?searchResult.outInvitePaymentData.totalAmount.toFixed(2):searchResult.outInvitePaymentData.totalAmount}}万</el-tag>
                </el-col>
            </el-row>
        </el-main>
        <el-popover
            ref="popover_quekou"
            placement="bottom"
            width="242"
            trigger="hover">
            <el-table :data="popover_quekou_data" border size="mini">
                <el-table-column width="120" property="orgName" label="区域"></el-table-column>
                <el-table-column width="120" property="quekou" label="运力缺口(辆)"></el-table-column>
            </el-table>
        </el-popover>
        <el-popover
            ref="popover_daifache"
            placement="bottom"
            width="242"
            trigger="hover">
            <el-table :data="popover_daifache_data" border size="mini">
                <el-table-column width="120" property="orgName" label="区域"></el-table-column>
                <el-table-column width="120" property="daifache" label="待发车数(辆)"></el-table-column>
            </el-table>
        </el-popover>
        <el-popover
            ref="popover_yifache"
            placement="bottom"
            width="242"
            trigger="hover">
            <el-table :data="popover_yifache_data" border size="mini">
                <el-table-column width="120" property="orgName" label="区域"></el-table-column>
                <el-table-column width="120" property="yifache" label="已发车数(辆)"></el-table-column>
            </el-table>
        </el-popover>
        <el-popover
            ref="popover_yingshou"
            placement="bottom"
            width="242"
            trigger="hover">
            <el-table :data="popover_yingshou_data" border size="mini">
                <el-table-column width="120" property="orgName" label="区域"></el-table-column>
                <el-table-column width="120" property="yingshou" label="营收额(万元)"></el-table-column>
            </el-table>
        </el-popover>
    </div>
</template>

<script>
    import {Http, Api, Common} from 'src/global'

    var Highcharts = require('highcharts');
    var sendReceiveChart, topTenChart, areaChart, outInvitePaymentChart;
    require('highcharts/modules/exporting')(Highcharts);
    export default {

        data: function () {
            return {
                isLoading: false,
                //查询参数
                searchParam: {
                    startTime: Common.date.dateFormat(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "YYYY-MM-DD 00:00:00"),
                    endTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),
                    orgCode: '99999999'
                },
                searchResult: {//返回结果
                    sendReceiveData: {
                        dateStrList: [],
                        departureNumList: [],
                        revenueAmountList: [],
                        operationBoardRevenueDtoList: []
                    },
                    topTenData: {
                        departureNumList: [],
                        shortageNumList: [],
                        titleList: [],
                        revenueAmountList: [],
                        totalAmount: ''
                    },
                    areaData: {
                        departureNumList: [],
                        shortageNumList: [],
                        orgNameList: [],
                        revenueAmountList: [],
                        waitDepartureList: [],
                        titleList: [],
                        totalAmount: ''
                    },
                    outInvitePaymentData: {
                        orgNameList: [],
                        payableAmountList: [],
                        paidAmountList: [],
                        prepaidRateList: [],
                        titleList: [],
                        totalAmount: ''
                    },
                    departureNum: '',
                    revenueAmount: '',
                    shortageVehicleNum: '',
                    waitDepartureNum: '',
                },
                //发车&营收趋势
                sendReceiveOption: {
                    chart: {
                        zoomType: 'xy'
                    },
                    colors: ['#2F3D4E', '#FFC40A', '#FF3D00'],
                    title: {
                        text: '发车&营收趋势'
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y}'
                            }
                        }
                    },
                    xAxis: [{
                        categories: [],
                        crosshair: true
                    }],
                    yAxis: [{
                        labels: {
                            format: '{value}万元',
                            style: {
                                color: '#FFC40A'
                            }
                        },
                        title: {
                            text: '营收额',
                            style: {
                                color: '#FFC40A'
                            }
                        }
                    }, {
                        title: {
                            text: '发车量',
                            style: {
                                color: '#2F3D4E'
                            }
                        },
                        labels: {
                            format: '{value}辆',
                            style: {
                                color: '#2F3D4E'
                            }
                        },
                        opposite: true
                    }],
                    tooltip: {
                        shared: true
                    },
                    legend: {
                        //layout: 'vertical',
                        align: 'left',
                        x: 0,
                        verticalAlign: 'top',
                        y: 0,
                        floating: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                    },
                    series: [{
                        name: '发车量',
                        type: 'column',
                        yAxis: 1,
                        data: [],
                        tooltip: {
                            valueSuffix: '辆'
                        }
                    }, {
                        name: '营收额',
                        type: 'spline',
                        data: [],
                        tooltip: {
                            valueSuffix: '万元'
                        }
                    }]
                },
                //前十客户
                topTenOption: {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: '前十客户营收额'
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        name: '客户营收',
                        colorByPoint: true,
                        data: []
                    }]
                },
                //区域发车
                areaOption: {
                    chart: {
                        type: 'bar'
                    },
                    colors: ['#FFC40A', '#2F3D4E', '#FF3D00'],
                    title: {
                        text: '区域发车情况'
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    xAxis: {
                        categories: [],
                        labels: {
                            style: {
                                color: '#FF3D00'
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: '需求量(辆)'
                        }
                    },
                    legend: {
                        //layout: 'vertical',
                        align: 'left',
                        x: 0,
                        verticalAlign: 'top',
                        y: 0,
                        floating: true,
                        reversed: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                    },
                    plotOptions: {
                        series: {
                            stacking: 'normal'
                        }
                    },
                    series: [{
                        name: '发车',
                        data: []
                    }, {
                        name: '缺车',
                        data: []
                    }]
                },
                //区域外请车付款情况
                outInvitePaymentOption: {
                    chart: {
                        zoomType: 'xy'
                    },
                    colors: ['#2F3D4E', '#FFC40A', '#FF3D00'],
                    title: {
                        text: '区域外请车付款情况'
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y}'
                            }
                        }
                    },
                    xAxis: [{
                        categories: [],
                        crosshair: true
                    }],
                    yAxis: [{
                        labels: {
                            format: '{value}万元',
                            style: {
                                color: '#FFC40A'
                            }
                        },
                        title: {
                            text: '付款',
                            style: {
                                color: '#FFC40A'
                            }
                        }
                    }, {
                        title: {
                            text: '预付占比',
                            style: {
                                color: '#2F3D4E'
                            }
                        },
                        labels: {
                            format: '{value}%',
                            style: {
                                color: '#2F3D4E'
                            }
                        },
                        opposite: true
                    }],
                    tooltip: {
                        shared: true
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'left',
                        x: 0,
                        verticalAlign: 'top',
                        y: 0,
                        floating: true,
                        backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                    },
                    series: [{
                        name: '付款总额',
                        type: 'column',
                        yAxis: 0,
                        data: [],
                        tooltip: {
                            valueSuffix: '万'
                        }
                    },{
                        name: '已付',
                        type: 'column',
                        yAxis: 0,
                        data: [],
                        tooltip: {
                            valueSuffix: '万'
                        }
                    }, {
                        name: '预付占比',
                        type: 'spline',
                        yAxis: 1,
                        data: [],
                        tooltip: {
                            valueSuffix: '%'
                        }
                    }]
                },
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.orgCode.setCurrentOrg({code: '99999999', name: '总部'});
                sendReceiveChart = Highcharts.chart('sendReceiveChart', this.sendReceiveOption);
                topTenChart = Highcharts.chart('topTenChart', this.topTenOption);
                areaChart = Highcharts.chart('areaChart', this.areaOption);
                outInvitePaymentChart = Highcharts.chart('outInvitePaymentChart', this.outInvitePaymentOption);
                this.searchAllData();
            })
            //10分钟后自动刷新
            setInterval(()=>{
                this.searchAllData();
            },10*60*1000)
        },
        computed: {
            popover_quekou_data(){
                if(!this.searchResult.areaData.orgNameList || !this.searchResult.areaData.orgNameList.length){
                    return []
                }
                return this.searchResult.areaData.orgNameList.map((item,index) => ({orgName: item, quekou: this.searchResult.areaData.shortageNumList[index]}));
            },
            popover_daifache_data(){
                if(!this.searchResult.areaData.orgNameList || !this.searchResult.areaData.orgNameList.length){
                    return []
                }
                return this.searchResult.areaData.orgNameList.map((item,index) => ({orgName: item, daifache: this.searchResult.areaData.waitDepartureList[index]}));
            },
            popover_yifache_data(){
                if(!this.searchResult.areaData.orgNameList || !this.searchResult.areaData.orgNameList.length){
                    return []
                }
                return this.searchResult.areaData.orgNameList.map((item,index) => ({orgName: item, yifache: this.searchResult.areaData.departureNumList[index]}));
            },
            popover_yingshou_data(){
                if(!this.searchResult.areaData.orgNameList || !this.searchResult.areaData.orgNameList.length){
                    return []
                }
                return this.searchResult.areaData.orgNameList.map((item,index) => ({orgName: item, yingshou: this.searchResult.areaData.revenueAmountList[index]}));
            }
        },
        methods: {
            searchAllData() {
                if(!this.searchParam.orgCode || !this.searchParam.startTime || !this.searchParam.endTime){
                    return
                }
                this.getFourValue();
                this.getSendReceiveData();
                this.getTopTenData();
                this.getAreaData();
                this.getOutInvitePaymentData();
            },
            //查询四条总数据
            getFourValue() {
                Http.get(Api.operationBoard.queryDepartureNum, {params: this.searchParam}, result => {
                    this.searchResult.departureNum = result.result;//已发车
                })
                Http.get(Api.operationBoard.queryRevenueAmount, {params: this.searchParam}, result => {
                    this.searchResult.revenueAmount = result.result;//营收
                })
                Http.get(Api.operationBoard.queryShortageVehicleNum, {params: this.searchParam}, result => {
                    this.searchResult.shortageVehicleNum = result.result;//缺车
                })
                Http.get(Api.operationBoard.queryWaitDepartureNum, {params: this.searchParam}, result => {
                    this.searchResult.waitDepartureNum = result.result;//待发车
                })
            },
            //查询发车&营收趋势
            getSendReceiveData() {
                Http.get(Api.operationBoard.queryRevenue, {params: this.searchParam}, result => {
                    this.searchResult.sendReceiveData.dateStrList = result.result.dateStrList;//日期时间轴list
                    this.searchResult.sendReceiveData.departureNumList = result.result.departureNumList;//发车数list
                    this.searchResult.sendReceiveData.revenueAmountList = result.result.revenueAmountList;//营收额list
                    this.searchResult.sendReceiveData.operationBoardRevenueDtoList = result.result.operationBoardRevenueDtoList;//综合table
                    this.$nextTick(() => {
                        sendReceiveChart.xAxis[0].setCategories(this.searchResult.sendReceiveData.dateStrList);
                        sendReceiveChart.series[0].setData(this.searchResult.sendReceiveData.departureNumList);
                        sendReceiveChart.series[1].setData(this.searchResult.sendReceiveData.revenueAmountList);
                    })
                })
            },
            //查询前10客户发车情况
            getTopTenData() {
                Http.get(Api.operationBoard.queryCustomerDeparture, {params: this.searchParam}, result => {
                    this.searchResult.topTenData.titleList = result.result.titleList;//x轴名称
                    this.searchResult.topTenData.revenueAmountList = result.result.revenueAmountList;//x轴名称
                    this.searchResult.topTenData.totalAmount = result.result.totalAmount;//总额
                    this.$nextTick(() => {
                        let topTenData = this.searchResult.topTenData.titleList.map((item, index) => ({name: item, y: this.searchResult.topTenData.revenueAmountList[index]}));
                        topTenChart.series[0].setData(topTenData);
                    })
                })
            },
            //区域发车情况
            getAreaData() {
                Http.get(Api.operationBoard.queryOrgDeparture, {params: this.searchParam}, result => {
                    this.searchResult.areaData.departureNumList = result.result.departureNumList;//发车
                    this.searchResult.areaData.shortageNumList = result.result.shortageNumList;//缺车
                    this.searchResult.areaData.titleList = result.result.titleList;//x轴名称
                    this.searchResult.areaData.totalAmount = result.result.totalAmount;//总额
                    this.searchResult.areaData.waitDepartureList = result.result.waitDepartureList;//待发车
                    this.searchResult.areaData.revenueAmountList = result.result.revenueAmountList;//营收额
                    this.searchResult.areaData.orgNameList = result.result.orgNameList;//区域名称

                    this.$nextTick(() => {
                        areaChart.xAxis[0].setCategories(this.searchResult.areaData.titleList);
                        areaChart.series[0].setData(this.searchResult.areaData.departureNumList);
                        areaChart.series[1].setData(this.searchResult.areaData.shortageNumList);
                    })
                })
            },
            //区域外请车付款情况
            getOutInvitePaymentData() {
                Http.get(Api.operationBoard.getPayData, {params: this.searchParam}, result => {
                    this.searchResult.outInvitePaymentData.payableAmountList = result.result.payableAmountList;//应付总额
                    this.searchResult.outInvitePaymentData.paidAmountList = result.result.paidAmountList;//已付
                    this.searchResult.outInvitePaymentData.prepaidRateList = result.result.prepaidRateList;//预付占比
                    this.searchResult.outInvitePaymentData.orgNameList = result.result.orgNameList;//区域名称
                    this.searchResult.outInvitePaymentData.totalAmount = result.result.totalAmount;//总额

                    this.$nextTick(() => {
                        outInvitePaymentChart.xAxis[0].setCategories(this.searchResult.outInvitePaymentData.orgNameList);
                        outInvitePaymentChart.series[0].setData(this.searchResult.outInvitePaymentData.payableAmountList);
                        outInvitePaymentChart.series[1].setData(this.searchResult.outInvitePaymentData.paidAmountList);
                        outInvitePaymentChart.series[2].setData(this.searchResult.outInvitePaymentData.prepaidRateList);
                    })
                })
            },
            openPage(url){
                this.$router.push({
                    path: url,
                    query: this.searchParam
                })
            },
        }
    }
</script>
<style scoped>
    .el-form-item {
        margin-bottom: 0 !important;
    }
</style>
