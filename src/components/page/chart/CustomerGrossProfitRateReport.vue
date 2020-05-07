<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>客户毛利率统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="发车时间:">
                            <el-date-picker
                                v-model="searchParam.actualDepartureTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="顶级客户:">
                            <customer-select v-model="searchParam.customerCode" auditStatus="PASS" level="top" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/customerGrossProfitRateReport/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="顶级客户" prop="name" min-width="130" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="<0%" prop="zeroRate" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showDailog(scope.row,0,null)">{{scope.row.zeroRate}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="0%~7%"  prop="zeroSevenRate" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showDailog(scope.row,0,7)">{{scope.row.zeroSevenRate}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="7%~10%"  prop="sevenTenRate" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color:#409eff;" @click="showDailog(scope.row,7,10)">{{scope.row.sevenTenRate}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="10%~15%"  prop="tenfiftyRate" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showDailog(scope.row,10,15)">{{scope.row.tenfiftyRate}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="15%~20%"  prop="fiftyTwityRate" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showDailog(scope.row,15,20)">{{scope.row.fiftyTwityRate}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label=">20%"  prop="twityRate" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showDailog(scope.row,null,20)">{{scope.row.twityRate}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="累计运单量"  prop="sumWay" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showDailog(scope.row)">{{scope.row.sumWay}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="平均毛利率"  prop="avgMoneyRate" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.avgMoneyRate}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>
        <!--客户毛利率统计明细-->
        <showCustomerGrossProfitRateDetailDailog v-if="showCustomerGrossProfitRateDetailDailog"
                                                 @close="closeDailog"
                                                 :currentRowed="currentRows"
                                                 :actualDepartureTimeStart="actualDepartureTimeStart"
                                                 :actualDepartureTimeEnd="actualDepartureTimeEnd"
                                                 :num1="num1"
                                                 :num2="num2"/>
    </el-container>
</template>

<script>
    import {Http,Api,Common} from 'src/global'
    import axios from 'axios'
    import showCustomerGrossProfitRateDetailDailog from "./ShowCustomerGrossProfitRateDetailDailog"

    export default {
        components: {showCustomerGrossProfitRateDetailDailog},
        data() {
            return {
                showCustomerGrossProfitRateDetailDailog:false,//客户毛利率明显对话框
                actualDepartureTimeStart: '',//实际发车开始时间
                actualDepartureTimeEnd: '',//实际发车结束时间
                currentRows: null,//操作行的数据
                num1:'',//参数1
                num2:'',//参数2
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 50,
                    regionCode: '',
                    customerCode:'',
                    actualDepartureTime:[Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"), Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")],
                    actualDepartureTimeStart: '',
                    actualDepartureTimeEnd: '',
                },
                isLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true,
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 50,
                    actualDepartureTime: [Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"), Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")],//发车时间
                    regionCode: '',
                    customerCode:''
                };
            },
            searchList() {//查询
                let vm = this;
                if(vm.searchParam.actualDepartureTime){
                    vm.searchParam.actualDepartureTimeStart=vm.searchParam.actualDepartureTime[0];
                    vm.searchParam.actualDepartureTimeEnd=vm.searchParam.actualDepartureTime[1];
                }else{
                    vm.searchParam.actualDepartureTimeStart='';
                    vm.searchParam.actualDepartureTimeEnd='';
                }
                if(!vm.searchParam.actualDepartureTimeStart || !vm.searchParam.actualDepartureTimeEnd){
                    return this.$message.warning('请输入时间进行查询！');
                }
                vm.isLoading = true;
                Http.get(Api.customerGrossProfitRateReport.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            //显示客户毛利率明细对话框
            showDailog(row,num1,num2){
                let vm = this;
                vm.showCustomerGrossProfitRateDetailDailog=true;
                vm.actualDepartureTimeStart=vm.searchParam.actualDepartureTimeStart;
                vm.actualDepartureTimeEnd=vm.searchParam.actualDepartureTimeEnd;
                vm.currentRows=row;
                vm.num1=num1;
                vm.num2=num2;
            },
            //关闭客户毛利率明细对话框
            closeDailog(){
                let vm = this;
                vm.showCustomerGrossProfitRateDetailDailog=false;
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.customerGrossProfitRateReport.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '客户毛利率统计报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
