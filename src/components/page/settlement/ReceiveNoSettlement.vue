<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 应收管理</el-breadcrumb-item>
                <el-breadcrumb-item>应收未结</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.belongOrgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode" style="display:block"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发车时间:">
                            <el-date-picker
                                v-model="searchParam.departureTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="收入主体:">
                            <dictionary-select v-model="searchParam.incomeSubject" style="display:block"
                                               option-name="LINE_INCOME_SUBJECT"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户简称:">
                            <customer-select v-model="searchParam.customerCode" auditStatus="PASS"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户全称:">
                            <settlement-customer-select v-model="searchParam.customerName"
                                                        style="display:block"></settlement-customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineCode" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="始发地:">
                            <district-select v-model="searchParam.departCityCodeList"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的地:">
                            <district-select v-model="searchParam.destCityCodeList"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleLicenseNum"
                                            style="display:block"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select v-model="searchParam.vehicleNature" style="display:block"
                                               option-name="VEHICLE_OPERATION_MODE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="到达时间:">
                            <el-date-picker
                                v-model="searchParam.arrivalTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="text" v-show="!isMoreItemShow" @click="showMore" size="mini">展开搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="showLess" size="mini">收起搜索项<<
                            </el-button>
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="mini">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam" size="mini">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <div style="display: inline-flex;">
                <el-button v-if="exportLoading" v-permission="'/receiveNoSettlement/export'" size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
                <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            </div>
            <el-table size="small" class="content-table" v-loading="isLoading" :data="searchResult.result" element-loading-text="拼命加载中"
                      border fit highlight-current-row stripe>
                <el-table-column align="center" label="运单号" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="大区" prop="regionName" show-overflow-tooltip min-width="120px"></el-table-column>
                <el-table-column align="center" label="分区" prop="belongOrgName" show-overflow-tooltip min-width="120px"></el-table-column>
                <el-table-column align="center" label="顶级客户" prop="topCustomerName" show-overflow-tooltip min-width="120px"></el-table-column>
                <el-table-column align="center" label="客户简称" prop="simpleCustomerName" show-overflow-tooltip min-width="180px"></el-table-column>
                <el-table-column align="center" label="收入主体" prop="incomeSubject" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="客户全称" prop="customerAllName" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="线路名称" prop="lineName" min-width="200px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="应收运费" prop="receiveAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车辆属性" prop="vehicleNature" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车牌号" prop="vehicleLicenseNum" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="挂箱号" prop="trailerLicenseNum" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车型" prop="specification" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="始发地" prop="startCityName" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="目的地" prop="endCityName" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际发车时间" prop="actualDepartureTime" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际到达时间" prop="confirmArrivalTime" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="回单号" prop="receiptCodes" min-width="180" show-overflow-tooltip></el-table-column>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 50, 300]"
                    :page-size="searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import {Http, Api} from 'src/global'
    import {Common} from 'src/global/common'
    import axios from 'axios'

    export default {
        data() {
            return {
                exportLoading: true,
                downloadLoading: true,
                isLoading: true,
                isMoreItemShow: false,
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    belongOrgCode: '',
                    waybillCode: '',
                    vehicleLicenseNum: '',
                    vehicleNature: '',
                    incomeSubject: '',
                    customerName: '',
                    customerCode: '',
                    lineCode: '',
                    departCityCodeList: [],
                    destCityCodeList: [],
                    departureTime:[Common.date.dateFormat(new Date(new Date().getTime() - 6*30*24*3600*1000),"YYYY-MM-DD 00:00:00"),Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59")],
                    actualDepartureStartTime: '',//发车时间
                    actualDepartureEndTime: '',
                    arrivalTime:[],
                    confirmArrivalStartTime: '',//到达时间
                    confirmArrivalEndTime: '',
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },

            }
        },
        created() {
            //查询表格
            this.searchList();
        },
        methods: {
            showMore() {
                let vm = this;
                vm.isMoreItemShow = true;
            },
            showLess() {
                let vm = this;
                vm.isMoreItemShow = false;
            },
            resetSearchParam() {
                this.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    currentPage: 1,
                    pageSize: 10,
                    belongOrgCode: '',
                    waybillCode: '',
                    vehicleLicenseNum: '',
                    vehicleNature: '',
                    incomeSubject: '',
                    customerName: '',
                    customerCode: '',
                    lineCode: '',
                    departCityCodeList: [],
                    destCityCodeList: [],
                    departureTime:[Common.date.dateFormat(new Date(new Date().getTime() - 6*30*24*3600*1000),"YYYY-MM-DD 00:00:00"),Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59")],
                    actualDepartureStartTime: '',//发车时间
                    actualDepartureEndTime: '',
                    arrivalTime:[],
                    confirmArrivalStartTime: '',//到达时间
                    confirmArrivalEndTime: '',
                }
            },
            searchList() {
                let vm = this;
                if(!vm.searchParam.departureTime && vm.searchParam.arrivalTime.length==0){
                    return vm.$message.warning('发车时间与到达时间必须选其一');
                }
                //实际发车时间
                if(vm.searchParam.departureTime){
                    vm.searchParam.actualDepartureStartTime = vm.searchParam.departureTime[0];
                    vm.searchParam.actualDepartureEndTime = vm.searchParam.departureTime[1];
                }
                //确认到达时间
                if(vm.searchParam.arrivalTime){
                    vm.searchParam.confirmArrivalStartTime = vm.searchParam.arrivalTime[0];
                    vm.searchParam.confirmArrivalEndTime = vm.searchParam.arrivalTime[1];
                }
                if (vm.searchParam.departCityCodeList) {
                    vm.searchParam.departCityCode = vm.searchParam.departCityCodeList[1];
                }
                if (vm.searchParam.destCityCodeList) {
                    vm.searchParam.destCityCode = vm.searchParam.destCityCodeList[1];
                }
                vm.isLoading = true;
                Http.get(Api.receiveNoSettlement.page, {params: vm.searchParam}, response => {
                    vm.searchResult.result = response.result;
                    vm.searchResult.totalCount = response.totalCount;
                    vm.searchParam.pageSize = response.pageSize;
                    vm.searchParam.currentPage = 1;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            },
            showWayBill(row){ //运单详情------------------------------------
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
            },
            exportData(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.receiveNoSettlement.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应收未结导出.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
