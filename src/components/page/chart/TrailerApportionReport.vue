<template>
    <el-container id="freeCar">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 核算报表</el-breadcrumb-item>
                <el-breadcrumb-item>挂车分摊至运单报表统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-tabs type="border-card" v-model="defaultShow">
            <el-tab-pane label="车挂/箱体分摊明细" name="auto">
                <el-header class="content-header" height="">
                    <el-form size="small" :model="searchParam" label-width="120px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="分摊对象:">
                                    <dictionary-select v-model="searchParam.depreciation"
                                              option-name="DEPRECIATION_SUBJECT" :clearable="false"
                                              style="display: block;"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="运单编号:">
                                    <el-input v-model="searchParam.waybillCode" :clearable="true"
                                              style="display: block;"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="分摊月份:">
                                    <el-date-picker
                                        v-model="searchParam.trailerMonth" type="month" value-format="yyyy-MM"
                                        placeholder="请选择月份" style="width:100%;">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" style="float: right">
                                <el-form-item style="float: right" label-width="0">
                                    <el-button type="success" icon="el-icon-search"
                                               @click="searchParam.currentPage=1;searchList()">查询
                                    </el-button>
                                    <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                                    </el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-header>

                <el-main class="content-main">
                    <el-button v-if="exportLoading" v-permission="'/trailerApportionToWaybill/export'"
                               icon="el-icon-download"
                               type="primary" size="mini" @click="exportList">导出
                    </el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
                    </el-button>
                    <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                              element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                        <el-table-column align="center" label="运单编号" prop="waybillCode" width="120"/>
                        <el-table-column align="center" label="序列号" prop="departureNumber" width="100"/>
                        <el-table-column align="center" label="所属大区" prop="regionName" width="120"/>
                        <el-table-column align="center" label="所属分区" prop="belongOrgName" width="100"/>
                        <el-table-column align="center" label="顶级客户" prop="topCustomerName" width="100"/>
                        <el-table-column align="center" label="车辆性质" prop="vehicleNature" min-width="100"/>
                        <el-table-column align="center" label="自营模式" prop="selfOperationMode" min-width="100"/>
                        <el-table-column align="center" label="供应商名称" prop="supplierName" min-width="160"/>
                        <el-table-column align="center" label="运单公里数" prop="apportionDistance" min-width="160"/>
                        <el-table-column align="center" label="发车时间" prop="actualDepartureTime" min-width="160"/>
                        <el-table-column align="center" label="到达时间" prop="confirmArrivalTime" min-width="160"/>
                        <el-table-column align="center" label="运单状态" prop="waybillStatus" min-width="160"/>
                        <el-table-column align="center" label="挂车折旧费" prop="trailerApportionMoney" width="120"/>
                        <el-table-column align="center" label="是否卡板" prop="kaban" width="120"/>
                    </el-table>
                    <div class="content-pagination">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[10,20, 50, 100]"
                            :page-size="searchParam.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="searchResult.totalCount">
                        </el-pagination>
                    </div>
                </el-main>
            </el-tab-pane>
            <el-tab-pane label="车挂/箱体分摊合计" name="manual">
                <el-header class="content-header" height="">
                    <el-form size="small" :model="countSearchParam" label-width="120px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="分摊对象:">
                                    <dictionary-select v-model="countSearchParam.depreciation"
                                                       option-name="DEPRECIATION_SUBJECT" :clearable="false"
                                                       style="display: block;"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="所属大区:">
                                    <org-select v-model="countSearchParam.regionCode" nature="AREA"
                                                style="display: block;"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="所属分区:">
                                    <org-select v-model="countSearchParam.belongOrgCode" nature="PARTITION"
                                                style="display: block;"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="分摊月份:">
                                    <el-date-picker
                                        v-model="countSearchParam.trailerMonth" type="month"
                                        value-format="yyyy-MM"
                                        placeholder="请选择月份" style="width:100%;">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" style="float: right">
                                <el-form-item style="float: right" label-width="0">
                                    <el-button type="success" icon="el-icon-search"
                                               @click="countSearchParam.currentPage=1;countSearchList()">查询
                                    </el-button>
                                    <el-button type="warning" class="fa fa-repeat" @click="resetCountSearchParam">&nbsp;&nbsp;重置
                                    </el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-header>

                <el-main class="content-main">
                    <el-button v-if="countExportLoading" v-permission="'/trailerApportionToCount/export'"
                               icon="el-icon-download"
                               type="primary" size="mini" @click="countExportList">导出
                    </el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
                    </el-button>
                    <el-table v-loading="countIsLoading" size="small" class="content-table"
                              :data="countSearchResult.result"
                              element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                        <el-table-column align="center" label="所属大区" prop="regionName"/>
                        <el-table-column align="center" label="所属分区" prop="belongOrgName"/>
                        <el-table-column align="center" label="供应商名称" prop="supplierName"/>
                        <el-table-column align="center" label="财务主体名称" prop="incomeSubject"/>
                        <el-table-column align="center" label="顶级客户" prop="topCustomer"/>
                        <el-table-column align="center" label="车辆性质" prop="vehicleNature"/>
                        <el-table-column align="center" label="自营模式" prop="selfOperationMode"/>
                        <el-table-column align="center" label="运单数量" prop="waybillCount"/>
                        <el-table-column align="center" label="分摊公里数" prop="apportionDistance"/>
                        <el-table-column align="center" label="挂车折旧金额" prop="trailerApportionMoney"/>
                        <el-table-column align="center" label="分摊月份" prop="apportionMonth"/>
                        <el-table-column align="center" label="是否卡板" prop="kaban" width="120"/>
                    </el-table>
                    <div class="content-pagination">
                        <el-pagination
                            @size-change="countHandleSizeChange"
                            @current-change="countHandleCurrentChange"
                            :page-sizes="[10,20, 50, 100]"
                            :page-size="countSearchParam.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="countSearchResult.totalCount">
                        </el-pagination>
                    </div>
                </el-main>
            </el-tab-pane>
        </el-tabs>
    </el-container>
</template>

<script>
    import {Http, Api, Validate, Common, Constant} from 'src/global/index'
    import axios from 'axios'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                countIsLoading: true,
                exportLoading: true,
                countExportLoading: true,
                defaultShow: 'auto',
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',
                    depreciation: 'TRAILER',
                    trailerMonth: Common.date.dateFormat(new Date(), "YYYY-MM"),
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                countSearchParam: {//统计查询参数
                    currentPage: 1,
                    pageSize: 10,
                    depreciation: 'TRAILER',
                    regionCode: '',
                    belongOrgCode: '',
                    trailerMonth: Common.date.dateFormat(new Date(), "YYYY-MM"),
                },
                countSearchResult: {//统计返回结果
                    totalCount: 0,
                    result: []
                },
            }
        },
        created() {
            this.searchList();
            this.countSearchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',
                    depreciation: 'TRAILER',
                    trailerMonth: Common.date.dateFormat(new Date(), "YYYY-MM"),
                };
            },
            resetCountSearchParam() {//重置参数
                this.countSearchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    regionCode: '',
                    belongOrgCode: '',
                    depreciation: 'TRAILER',
                    trailerMonth: Common.date.dateFormat(new Date(), "YYYY-MM"),
                };
            },
            searchList() {//查询
                let vm = this;
                if(!vm.searchParam.trailerMonth){
                    return vm.$message.warning('请选择月份');
                }
                vm.isLoading = true;
                Http.get(Api.trailerApportionToWaybill.page, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                })
            },
            handleSizeChange(val) {//页大小
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {//换页
                this.searchParam.currentPage = val;
                this.searchList();
            },
            countSearchList() {//统计查询
                let vm = this;
                if(!vm.countSearchParam.trailerMonth){
                    return vm.$message.warning('请选择月份');
                }
                vm.countIsLoading = true;
                Http.get(Api.trailerApportionToCount.page, {params: vm.countSearchParam}, result => {
                    this.countSearchResult.result = result.result;
                    this.countSearchResult.totalCount = result.totalCount;
                    this.countSearchParam.currentPage = result.currentPage;
                    this.countSearchParam.pageSize = result.pageSize;
                    vm.countIsLoading = false;
                }, () => {
                    vm.countIsLoading = false;
                })
            },
            countHandleSizeChange(val) {//统计页大小
                this.countSearchParam.pageSize = val;
                this.countSearchList();
            },
            countHandleCurrentChange(val) {//统计换页
                this.countSearchParam.currentPage = val;
                this.countSearchList();
            },
            exportList() {//导出
                let vm = this;
                vm.exportLoading = false;
                if(!vm.searchParam.trailerMonth){
                    vm.exportLoading = true;
                    return vm.$message.warning('请选择月份');
                }
                axios.get(Api.trailerApportionToWaybill.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '挂车/箱体费用分摊明细报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            countExportList() {//统计导出
                let vm = this;
                vm.countExportLoading = false;
                if(!vm.countSearchParam.trailerMonth){
                    vm.countExportLoading = true;
                    return vm.$message.warning('请选择月份');
                }
                axios.get(Api.trailerApportionToCount.export, {
                    params: vm.countSearchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '挂车/箱体费用分摊合计报表.xls';
                    link.click();
                    vm.countExportLoading = true;
                }).catch(reason => {
                    vm.countExportLoading = true;
                })
            },
        }
    }
</script>
<style>
    #freeCar > .el-tabs {
        width: 100%;
    }

    #freeCar > .el-header {
        height: auto !important;
    }

    #freeCar > .el-header > .crumbs {
        margin-bottom: 0 !important;
    }
</style>

