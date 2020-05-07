<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>应收结算进度统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="发车开始时间:">
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
                    <el-col :span="12" style="float: right">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-tabs type="border-card" v-model="defaultShow">
                <el-tab-pane label="格式一" name="auto">
                    <el-button v-if="exportLoading" v-permission="'/accountsReceivableProgressStatementFormat1/export'" icon="el-icon-download" type="primary" size="mini" @click="format1Export">导出(格式一)</el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
                    <el-table v-loading="isLoading" size="small" class="content-table"
                              :data="searchResult.format1" element-loading-text="拼命加载中"
                              border fit highlight-current-row stripe>
                        <el-table-column label="客户"       align="center" prop="topCustomerName" min-width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column label="运单总数"   align="center" prop="waybillCount" min-width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column label="应收总额"   align="center" prop="sumActualReceiveVehicleAmount"  min-width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column label="应结算运单数"  align="center" prop="receiveSettlementWaybillCount" min-width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column label="应结算应收金额" align="center" prop="receiveSettlementAmount" min-width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column label="已结算运单数" align="center" prop="settlementWaybillCount" min-width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column label="已结算金额" align="center" prop="settlementAmount"  min-width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column label="未结算运单数"  align="center" prop="notSettlementWaybillCount" min-width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column label="未结算金额" align="center" prop="notSettlementAmount" min-width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column label="运单已结算占比" align="center" prop="settlementWaybillCountRatio" min-width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column label="金额已结算占比" align="center" prop="settlementAmountRatio" min-width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column label="未结算运单已付款金额" align="center" prop="notSettlementWaybillPayAmount" min-width="100" show-overflow-tooltip></el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="格式二" name="manual">
                    <el-button v-if="exportLoading" v-permission="'/accountsReceivableProgressStatementFormat2/export'" icon="el-icon-download" type="primary" size="mini" @click="format2Export">导出(格式二)</el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
                    <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.format2" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                        <el-table-column label="客户" align="center" prop="topCustomerName" min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column label="1月" align="center" prop="jan" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409eff;" @click="showDialog(scope.row,'01')">{{scope.row.jan}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="2月" align="center" prop="feb" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409eff;" @click="showDialog(scope.row,'02')">{{scope.row.feb}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="3月" align="center" prop="mar" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409eff;" @click="showDialog(scope.row,'03')">{{scope.row.mar}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="4月" align="center" prop="apr" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409eff;" @click="showDialog(scope.row,'04')">{{scope.row.apr}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="5月" align="center" prop="may" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409eff;" @click="showDialog(scope.row,'05')">{{scope.row.may}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="6月" align="center" prop="jun" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409eff;" @click="showDialog(scope.row,'06')">{{scope.row.jun}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="7月" align="center" prop="jul" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409eff;" @click="showDialog(scope.row,'07')">{{scope.row.jul}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="8月" align="center" prop="aug" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409eff;" @click="showDialog(scope.row,'08')">{{scope.row.aug}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="9月" align="center" prop="sep" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409eff;" @click="showDialog(scope.row,'09')">{{scope.row.sep}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="10月" align="center" prop="oct" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409eff;" @click="showDialog(scope.row,'10')">{{scope.row.oct}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="11月" align="center" prop="nov" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409eff;" @click="showDialog(scope.row,'11')">{{scope.row.nov}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="12月" align="center" prop="dec" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409eff;" @click="showDialog(scope.row,'12')">{{scope.row.dec}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="合计" align="center" prop="sum" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409eff;" @click="showDialog(scope.row,'')">{{scope.row.sum}}</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10,20,50,100]"
                    :page-size="searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>
        <!--应收结算进度(运单已结算)明细-->
        <accountsReceivableProgressStatementDialog v-if="accountsReceivableProgressStatementDialog"
                                                       :visible="accountsReceivableProgressStatementDialog"
                                                       @close="hideDialog"
                                                       :currentRowed="currentRows"
                                                       :actualDepartureStartTime="actualDepartureTimeStart"
                                                       :actualDepartureEndTime="actualDepartureTimeEnd"
                                                       :month="month" />
    </el-container>
</template>

<script>
    import {Http, Api, Common} from 'src/global'
    import axios from 'axios'
    import accountsReceivableProgressStatementDialog from "./AccountsReceivableProgressStatementDialog"

    export default {
        components: {accountsReceivableProgressStatementDialog},
        data() {
            return {
                accountsReceivableProgressStatementDialog:false,
                currentRows:'',//需要操作的行
                actualDepartureTimeStart:'',//发车开始时间
                actualDepartureTimeEnd:'',//发车结束时间
                month:'',//月份
                common: Common,
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 20,
                    actualDepartureTime:[Common.date.dateFormat(new Date(new Date() - 60 * 1000 * 60 * 24), "YYYY-MM-01 00:00:00"), Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")],
                    actualDepartureTimeStart: '',
                    actualDepartureTimeEnd: '',
                },
                isLoading: true,
                defaultShow: 'auto',
                exportLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    format1: [],
                    format2: []
                },
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam={//查询参数
                    currentPage:1,
                    pageSize:20,
                    actualDepartureTime:[Common.date.dateFormat(new Date(new Date() - 60 * 1000 * 60 * 24), "YYYY-MM-01 00:00:00"), Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")],
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
                //查询格式一数据
                Http.get(Api.accountsReceivableProgressStatement.pageFormat1, {params: vm.searchParam}, result => {
                    vm.searchResult.format1 = result.result;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                });
                //查询格式二数据
                Http.get(Api.accountsReceivableProgressStatement.pageFormat2, {params: vm.searchParam}, result => {
                    vm.searchResult.format2 = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                })
            },
            //显示明细对话框
            showDialog(row,month){
                let vm = this;
                vm.currentRows=row;
                vm.actualDepartureTimeStart=vm.searchParam.actualDepartureTimeStart;//发车开始时间
                vm.actualDepartureTimeEnd=vm.searchParam.actualDepartureTimeEnd;//发车结束时间
                vm.month=month;//月份
                vm.accountsReceivableProgressStatementDialog=true;
            },
            //关闭明细对话框
            hideDialog(){
                this.accountsReceivableProgressStatementDialog=false;
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            format1Export() {//格式一导出
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.accountsReceivableProgressStatement.exportFormat1, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应收结算进度统计(格式一).xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            format2Export() {//格式二导出
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.accountsReceivableProgressStatement.exportFormat2, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应收结算进度统计(格式二).xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
        }
    }
</script>
