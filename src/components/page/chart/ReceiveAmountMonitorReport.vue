<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>应收监控报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start"
                                                :end-date="searchParam.endActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end"
                                                :start-date="searchParam.startActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属客户:">
                            <customer-select v-model="searchParam.customerCode" auditStatus="PASS" level="top"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.regionCode"
                                                :natureList="[Constant.ORGANIZATION.HEADQUARTERS,Constant.ORGANIZATION.AREA]"
                                                style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
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
            <el-button v-if="exportLoading" v-permission="'/receiveMonitor/export'" icon="el-icon-download"
                       type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe height="350">
                <el-table-column align="center" label="区域Code" prop="regionCode" min-width="140" v-if="false"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="区域" prop="regionName" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="所属客户Code" prop="customerCode" min-width="140" v-if="false"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="所属客户" prop="customerName" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单数" prop="totalCount" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="应收金额" prop="totalAmount" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="已结算运单数" prop="billCount" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="已结算金额" prop="billAmount" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="未结算运单数" prop="valueCount" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" style="color: #409EFF;" @click="waybillDetail(scope.row)">
                            {{scope.row.valueCount}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="未结算金额" prop="valueAmount" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单已结算占比" prop="countRate" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="金额已结算占比" prop="amountRate" min-width="140"
                                 show-overflow-tooltip></el-table-column>
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

        <el-dialog title="应收详情" :visible.sync="receiveMonitorDetailDialog" width="80%">
            <el-button v-if="exportDetailLoading" size="mini" type="primary" icon="el-icon-download"
                       @click="exportDataDetail">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table class="content-table" :data="searchDetailResult.result" element-loading-text="拼命加载中"
                      size="small"
                      border fit highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="运单号" prop="waybillCode" min-width="150px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="客户名称" prop="customerName" min-width="200px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="所属区域" prop="belongOrgName" min-width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="线路名称" prop="lineName" min-width="200"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="应收运费" prop="receiveAmount" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
            </el-table>
            <div style="height: 50px" v-if="receiveMonitorDetailDialog">
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChangeDetail"
                        @current-change="handleCurrentChangeDetail"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="searchDetailParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchDetailResult.totalCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http, Api, Common, Constant} from 'src/global'
    import axios from 'axios'

    export default {
        data() {
            return {
                Constant: Constant,//常量
                exportDetailLoading: true,
                common: Common,
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: "",
                    regionCode: "",
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")
                },
                isLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //查询参数
                searchDetailParam: {
                    currentPage: 1,
                    pageSize: 10,
                    regionCode: '',
                    customerCode: '',
                },
                //返回结果
                searchDetailResult: {
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true,
                receiveMonitorDetailDialog: false
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: "",
                    regionCode: "",
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")
                };
            },
            searchList() {//查询
                let vm = this;
                if (!this.searchParam.startActualDepartureTime && !this.searchParam.endActualDepartureTime) {
                    return this.$message.warning('请输入时间进行查询！')
                }
                vm.isLoading = true;
                Http.get(Api.receiveMonitor.page, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
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
            searchDetailList(){
                let vm = this;
                Http.get(Api.receiveMonitorDetail.page, {params: vm.searchDetailParam}, response => {
                    vm.searchDetailResult.result = response.result;
                    vm.searchDetailResult.totalCount = response.totalCount;
                })
            },
            handleSizeChangeDetail(val) {
                let vm = this;
                vm.searchDetailParam.pageSize = val;
                this.searchDetailList();
            },
            handleCurrentChangeDetail(val) {
                let vm = this;
                vm.searchDetailParam.currentPage = val;
                this.searchDetailList();
            },
            waybillDetail(row) {
                let vm = this;
                vm.searchDetailParam.regionCode = row.regionCode;
                vm.searchDetailParam.customerCode = row.customerCode;
                vm.searchDetailParam.startActualDepartureTime = vm.searchParam.startActualDepartureTime;
                vm.searchDetailParam.endActualDepartureTime= vm.searchParam.endActualDepartureTime;
                vm.searchDetailParam.currentPage = 1;
                Http.get(Api.receiveMonitorDetail.page, {params: vm.searchDetailParam}, response => {
                    vm.searchDetailResult.result = response.result;
                    vm.searchDetailResult.totalCount = response.totalCount;
                    vm.receiveMonitorDetailDialog = true;
                })
            },
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.receiveMonitor.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应收监控报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            exportDataDetail(){
                let vm = this;
                vm.exportDetailLoading = false;
                axios.get(Api.receiveMonitorDetail.export, {params: vm.searchDetailParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应收监控详情.xls';
                    link.click();
                    vm.exportDetailLoading = true;
                }).catch(reason => {
                    vm.exportDetailLoading = true;
                })
            }
        }
    }
</script>
