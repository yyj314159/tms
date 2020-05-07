<template>
    <div>
        <div>
            <el-breadcrumb separator="/"class="crumbs">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>利润报表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-header class="content-header" height="" style="margin-top: 25px;">
                <el-form size="small" :model="searchParam" label-width="100px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="开始日期:">
                                <el-date-picker
                                    v-model="searchParam.startDate"
                                    style="width: 100%" :clearable="false" :editable="false"
                                    type="date"
                                    placeholder="选择日期" :picker-options="pickerOptions0">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="结束日期:">
                                <el-date-picker
                                    v-model="searchParam.endDate"
                                    style="width: 100%" :clearable="false" :editable="false"
                                    type="date"
                                    placeholder="选择日期" :picker-options="pickerOptions1">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item style="float: right" label-width="0">
                                <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                                <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-header>

            <el-main class="content-main" style="height:370px;">
                <el-row>
                    <el-col :span="17" style="position: relative;">
                        <div id="container" style="height:320px; min-width: 200px;"></div>
                    </el-col>
                    <el-col :span="7" style="position: relative; left:70.8%">
                        <div id="container2" style="height:320px; min-width: 200px;"></div>
                    </el-col>
                </el-row>
            </el-main>
            <el-main class="content-main">
                <el-table v-loading="isLoading" size="small":summary-method="getSummaries" show-summary class="content-table" :data="searchResult.regionProfitReportDtoList" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                    <el-table-column header-align="center" align="center" label="大区" prop="regionName" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" align="center" label="发车数" prop="departureNum" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" align="center" label="应收（万元）" prop="receiveAmount" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.receiveAmount}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="center" label="应付（万元）" prop="paidAmount" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.paidAmount}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="center" label="利润（万元）" prop="profit" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.profit}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="center" label="利润率" prop="profitRate" min-width="100" show-overflow-tooltip></el-table-column>
                </el-table>
                <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.orgProfitReportDtoList" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                    <el-table-column header-align="center" align="center" label="大区" prop="regionName" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" align="center" label="分区" prop="belongOrgName" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" align="center" label="发车数" prop="departureNum" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" align="center" label="应收（万元）" prop="receiveAmount" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.receiveAmount}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="center" label="应付（万元）" prop="paidAmount" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.paidAmount}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="center" label="利润（万元）" prop="profit" min-width="140" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.profit}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="center" label="利润率" prop="profitRate" min-width="100" show-overflow-tooltip></el-table-column>
                </el-table>
            </el-main>
        </div>
    </div>
</template>

<script>
    import {Http,Api,Validate,Common,Constant} from 'src/global'
    var Highcharts = require('highcharts');

    // 在 Highcharts 加载之后加载功能模块
    require('highcharts/modules/exporting')(Highcharts);
    require('highcharts/modules/drilldown')(Highcharts);
    //require('highcharts/modules/highcharts-zh_CN')(Highcharts);

    export default {

        data: function(){
            return {
                isLoading: false,
                searchParam: {//查询参数
                    startDate: new Date(new Date(new Date().getTime() - 3600 * 1000 * 24).getFullYear(), new Date(new Date().getTime() - 3600 * 1000 * 24).getMonth(), 1),
                    endDate: new Date(new Date(new Date().getTime() - 3600 * 1000 * 24).getFullYear(), new Date(new Date().getTime() - 3600 * 1000 * 24).getMonth(), new Date(new Date().getTime() - 3600 * 1000 * 24).getDate()),
                    startActualDepartureTime: '',
                    endActualDepartureTime: '',
                },
                searchResult: {//返回结果
                    waybillProfitChartData: [],
                    regionProfitReportDtoList: [],
                    orgProfitReportDtoList: [],
                },
                option:{
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '各区域利润信息'
                    },
                    subtitle: {
                        text: '（不包含应收价格或应付价格为0的数据）'
                    },
                    credits: {
                        enabled:false
                    },
                    exporting: {
                        enabled:false
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        //min: ,
                        title: {
                            text: '利润率'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <br/><b>应收：{point.receiveAmount}万元</b><br/><br/><b>应付：{point.paidAmount}万元</b><br/><br/><b>利润：{point.profit}万元</b><br/>'
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:.2f}%'
                            }
                        }
                    },
                    series: [{
                        name: '大区毛利润',
                        colorByPoint: true,
                        data: [{name: '', y: 0, drilldown: ''}]
                    }],
                    drilldown: {
                        series: [{id: '', data: [{name: '', y: 0}]}],
                        drillUpButton: {
                            relativeTo: 'spacingBox',
                            position: {
                                y: 0,
                                x: 0
                            },
                            theme: {
                                fill: 'white',
                                'stroke-width': 1,
                                stroke: 'silver',
                                r: 0,
                                states: {
                                    hover: {
                                        fill: '#bada55'
                                    },
                                    select: {
                                        stroke: '#039',
                                        fill: '#bada55'
                                    }
                                }
                            }
                        }
                    }
                },
                option2:{
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: '各大区利润份额'
                    },
                    credits: {
                        enabled:false
                    },
                    exporting: {
                        enabled:false
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <br/><b>应收：{point.receiveAmount}万元</b><br/><br/><b>应付：{point.paidAmount}万元</b><br/><br/><b>利润：{point.profit}万元</b><br/>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        name: '利润份额',
                        colorByPoint: true,
                        data: [{name: '', y: 0}]
                    }]
                },
                pickerOptions0: {
                    disabledDate: (time) => {
                        if (this.searchParam.endDate != "") {
                            return time.getTime() > Date.now() || time.getTime() > new Date(this.searchParam.endDate).getTime();
                        } else {
                            return time.getTime() > Date.now();
                        }

                    }
                },
                pickerOptions1: {
                    disabledDate: (time) => {
                        return time.getTime() < new Date(this.searchParam.startDate).getTime() || time.getTime() > Date.now();
                    }
                },
            }
        },
        mounted() {
            this.searchList();
            if (!Highcharts.Chart.prototype.addSeriesAsDrilldown) {//防止重复下钻报错
                Drilldown(Highcharts);
            }
        },
        computed:{
            timeQuantum:{
                get(){
                    if(!this.searchParam.startActualDepartureTime || !this.searchParam.endActualDepartureTime){
                        return ''
                    }
                    return this.searchParam.startActualDepartureTime + ' 至 ' + this.searchParam.endActualDepartureTime
                }
            }
        },
        methods: {
            init(){
                //柱状图
                this.option.series[0].data = _.cloneDeep(this.searchResult.waybillProfitChartData).map(item=>{
                    item.y = item.profitRate
                    if(item.children && item.children.length>0){
                        item.drilldown = item.code;
                    }else{
                        item.drilldown = null;
                    }
                    return item;
                });
                this.option.title.text = `${this.timeQuantum}  各区域利润信息`
                this.option.drilldown.series = _.cloneDeep(this.searchResult.waybillProfitChartData).map(item=>{
                    item.id = item.code;
                    if(item.children && item.children.length>0){
                        item.data = item.children.map(child=>{
                            child.y = child.profitRate;
                            return child;
                        });
                    }else{
                        item.data = null;
                    }
                    return item;
                });
                this.$nextTick(()=>{
                    Highcharts.chart('container', this.option);
                })
                //饼图
                this.option2.series[0].data = _.cloneDeep(this.searchResult.waybillProfitChartData).map(item=>{
                    item.y = item.profit;
                    return item;
                });
                this.$nextTick(()=>{
                    Highcharts.chart('container2', this.option2);
                })
            },
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    startDate: new Date(new Date(new Date().getTime() - 3600 * 1000 * 24).getFullYear(), new Date(new Date().getTime() - 3600 * 1000 * 24).getMonth(), 1),
                    endDate: new Date(new Date(new Date().getTime() - 3600 * 1000 * 24).getFullYear(), new Date(new Date().getTime() - 3600 * 1000 * 24).getMonth(), new Date(new Date().getTime() - 3600 * 1000 * 24).getDate()),
                    startActualDepartureTime: '',
                    endActualDepartureTime: '',
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                this.searchParam.startActualDepartureTime = this.searchParam.startDate.getFullYear() + '-' + (((this.searchParam.startDate.getMonth() + 1) < 10 ? '0' + (this.searchParam.startDate.getMonth() + 1) : (this.searchParam.startDate.getMonth() + 1))) + '-' + (this.searchParam.startDate.getDate() < 10 ? '0' + this.searchParam.startDate.getDate() : this.searchParam.startDate.getDate()) + ' 00:00:00';
                this.searchParam.endActualDepartureTime = this.searchParam.endDate.getFullYear() + '-' + (((this.searchParam.endDate.getMonth() + 1) < 10 ? '0' + (this.searchParam.endDate.getMonth() + 1) : (this.searchParam.endDate.getMonth() + 1))) + '-' + (this.searchParam.endDate.getDate() < 10 ? '0' + this.searchParam.endDate.getDate() : this.searchParam.endDate.getDate()) + ' 23:59:59';
                //可视化图表以及table表格
                Http.get(Api.profitChart.getData,{ params : vm.searchParam }, result => {;
                    vm.searchResult.waybillProfitChartData = result.result.waybillProfitChartData;
                    vm.init();
                    vm.searchResult.regionProfitReportDtoList = result.result.regionProfitReportDtoList;
                    vm.searchResult.orgProfitReportDtoList = result.result.orgProfitReportDtoList;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            //合计
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        if(index === 1){
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                        }else{
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0).toFixed(4);
                        }
                    } else {
                        if(!sums[index]){
                            sums[index] = 0
                        }else{
                            sums[index] = sums[index].toFixed(4);
                        }
                    }
                });
                if(!sums[4] || !sums[2]){
                    sums[5] = '0.00%'
                }else{
                    sums[5] = (sums[4]/sums[2]*100).toFixed(2) +'%';
                }
                return sums;
            }
        }
    }
</script>
