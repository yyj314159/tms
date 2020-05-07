<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>加油报表</el-breadcrumb-item>
                <el-breadcrumb-item>电子加油统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierCode"
                                             :types="Constant.SUPPLIER_TYPE.PLANTFORM_COMPANY"
                                             style="display: block;"></supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="充值开始时间:">
                            <date-picker-single v-model="searchParam.startTime" date-type="start"
                                                :end-date="searchParam.endTime" :default-time="['00:00:00', '23:59:59']"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="充值结束时间:">
                            <date-picker-single v-model="searchParam.endTime" date-type="end"
                                                :start-date="searchParam.startTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" style="float: right">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchList">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-tabs type="border-card" v-model="defaultShow">
                <el-tab-pane label="电子加油合计" name="auto">
                    <el-button v-if="exportLoading" v-permission="'/electronicRefuelingStatistics/export'" icon="el-icon-download" type="primary" size="mini" @click="totalExport">导出(合计)</el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
                    <el-table v-loading="isLoading" size="small" class="content-table"
                              :data="searchResult.total" element-loading-text="拼命加载中"
                              border fit highlight-current-row stripe>
                        <el-table-column label="供应商" align="center" prop="supplierName" min-width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column label="发车充值分配金额" align="center" prop="departAmount" min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column label="万金油" align="center">
                            <el-table-column label="充值金额" prop="wanDistributionAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="消费金额" prop="wanFuelAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="余额" prop="wanBalanceAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="已开票" prop="wanInvAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="未开票" prop="wanNotInvAmount" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="找油网" align="center">
                            <el-table-column label="充值金额" prop="faDistributionAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="消费金额" prop="faFuelAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="余额" prop="faBalanceAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="已开票" prop="faInvAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="未开票" prop="faNotInvAmount" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="消费合计"   align="center" prop="totalFuelAmount"  min-width="100px" show-overflow-tooltip></el-table-column>
                        <el-table-column label="余额合计"  align="center" prop="totalBalanceAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                        <el-table-column label="开票合计" align="center" prop="totalInvAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                        <el-table-column label="未开票合计" align="center" prop="totalNotInvAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                    </el-table>
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
                    <el-row style="font-size:13px; font-weight: bold; width:50%;">
                        <span style="color:red; margin-right:20px;">万金油充值合计：{{wanDistributionAmountValue}}元</span>
                        <span style="color:red; margin-right:20px;">万金油消费合计：{{wanFuelAmountValue}}元</span>
                        <span style="color:blue; margin-right:20px;">找油网充值合计：{{faDistributionAmountValue}}元</span>
                        <span style="color:blue; margin-right:20px;">找油网消费合计：{{faFuelAmountValue}}元</span>
                    </el-row>
                </el-tab-pane>

                <el-tab-pane label="电子加油明细" name="manual">
                    <el-button v-if="exportLoading" v-permission="'/electronicRefuelingStatistics/export'" icon="el-icon-download" type="primary" size="mini" @click="detailExport">导出(明细)</el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
                    <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.detail" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                        <el-table-column label="日期" algin="center" prop="date" min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column label="发车充值分配金额" align="center" prop="departAmountDetail" min-width="100px" show-overflow-tooltip></el-table-column>
                        <el-table-column label="万金油" align="center">
                            <el-table-column label="充值金额" prop="wanDistributionAmountDetail" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="消费金额" prop="wanFuelAmountDetail" min-width="110px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="找油网" align="center">
                            <el-table-column label="充值金额" prop="faDistributionAmountDetail" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="消费金额" prop="faFuelAmountDetail" min-width="110px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="消费合计"   align="center" prop="totalFuelAmountDetail"  min-width="80" show-overflow-tooltip></el-table-column>
                    </el-table>
                    <div class="content-pagination">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[10,20,50,100]"
                            :page-size="searchParam.pageSizeDetail"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="searchResult.totalCountDetail">
                        </el-pagination>
                    </div>
                    <el-row style="font-size:13px; font-weight: bold; width:50%;">
                        <span style="color:red; margin-right:20px;">万金油充值合计：{{wanDistributionAmountDetailValue}}元</span>
                        <span style="color:red; margin-right:20px;">万金油消费合计：{{wanFuelAmountDetailValue}}元</span>
                        <span style="color:blue; margin-right:20px;">找油网充值合计：{{faDistributionAmountDetailValue}}元</span>
                        <span style="color:blue; margin-right:20px;">找油网消费合计：{{faFuelAmountDetailValue}}元</span>
                    </el-row>
                </el-tab-pane>
            </el-tabs>

        </el-main>
    </el-container>
</template>

<script>
    import {Api, Common,Constant, Http} from 'src/global'
    import axios from 'axios'
    export default {
        data() {
            return {
                Constant: Constant,
                currentRows:'',//需要操作的行
                actualDepartureTimeStart:'',//发车开始时间
                actualDepartureTimeEnd:'',//发车结束时间
                common: Common,
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    supplierCode: '',//充值供应商
                    startTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//充值开始时间
                    endTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")// 充值结束时间
                },
                isLoading: true,
                defaultShow: 'auto',
                exportLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    total: [],
                    detail: []
                },

                wanDistributionAmountValue:'',
                wanFuelAmountValue:'',
                faDistributionAmountValue:'',
                faFuelAmountValue:'',

                wanDistributionAmountDetailValue:'',
                wanFuelAmountDetailValue:'',
                faDistributionAmountDetailValue:'',
                faFuelAmountDetailValue:''
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam={//查询参数
                    currentPage:1,
                    pageSize:10,
                    supplierCode: '',//充值供应商
                    startTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//充值开始时间
                    endTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")// 充值结束时间
                };
            },
            searchList() {//查询
                let vm = this;
                if(!vm.searchParam.startTime || !vm.searchParam.endTime){
                    return this.$message.warning('请输入时间进行查询！');
                }
                vm.isLoading = true;

                //查询合计数据
                Http.get(Api.electronicRefuelingStatistics.page, {params: vm.searchParam}, result => {
                    let sumWanDistributionAmount = 0;
                    let sumWanFuelAmount = 0;
                    let sumfaDistributionAmount = 0;
                    let sumFaFuelAmount = 0;
                    for(let i = 0 ;i < result.result.length; i++){
                        sumWanDistributionAmount += result.result[i].wanDistributionAmount;
                        sumWanFuelAmount += result.result[i].wanFuelAmount;
                        sumfaDistributionAmount += result.result[i].faDistributionAmount;
                        sumFaFuelAmount += result.result[i].faFuelAmount;
                    }
                    vm.wanDistributionAmountValue = sumWanDistributionAmount.toFixed(2);
                    vm.wanFuelAmountValue = sumWanFuelAmount.toFixed(2);
                    vm.faDistributionAmountValue = sumfaDistributionAmount.toFixed(2);
                    vm.faFuelAmountValue = sumFaFuelAmount.toFixed(2);

                    vm.searchResult.total = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                });

                //查询明细数据
                Http.get(Api.electronicRefuelingStatistics.pageDetail, {params: vm.searchParam}, result => {
                    let sumWanDistributionAmountDetail = 0;
                    let sumWanFuelAmountDetail = 0;
                    let sumfaDistributionAmountDetail = 0;
                    let sumFaFuelAmountDetail = 0;
                    for(let i = 0 ;i < result.result.length; i++){
                        sumWanDistributionAmountDetail += result.result[i].wanDistributionAmountDetail == null?0:result.result[i].wanDistributionAmountDetail;
                        sumWanFuelAmountDetail += result.result[i].wanFuelAmountDetail == null?0:result.result[i].wanFuelAmountDetail;
                        sumfaDistributionAmountDetail += result.result[i].faDistributionAmountDetail == null?0:result.result[i].faDistributionAmountDetail;
                        sumFaFuelAmountDetail += result.result[i].faFuelAmountDetail == null?0:result.result[i].faFuelAmountDetail;
                    }
                    vm.wanDistributionAmountDetailValue = sumWanDistributionAmountDetail.toFixed(2);
                    vm.wanFuelAmountDetailValue = sumWanFuelAmountDetail.toFixed(2);
                    vm.faDistributionAmountDetailValue = sumfaDistributionAmountDetail.toFixed(2);
                    vm.faFuelAmountDetailValue = sumFaFuelAmountDetail.toFixed(2);

                    vm.searchResult.detail = result.result;
                    vm.searchResult.totalCountDetail = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSizeDetail = result.pageSize;
                    vm.isLoading = false;
                }, () => {
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
            totalExport() {//合计导出
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.electronicRefuelingStatistics.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '电子加油合计.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            detailExport() {//明细导出
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.electronicRefuelingStatistics.exportDetail, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '电子加油明细.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
        }
    }
</script>
