<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 定点加油</el-breadcrumb-item>
                <el-breadcrumb-item>外请加油记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="加油开始时间:">
                            <date-picker-single v-model="searchParam.refuelingStartTime" date-type="start"
                                                :end-date="searchParam.refuelingEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="加油结束时间:">
                            <date-picker-single v-model="searchParam.refuelingEndTime" date-type="end"
                                                :start-date="searchParam.refuelingStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierId"
                                             :types="Constant.SUPPLIER_TYPE.PLANTFORM_COMPANY"
                                             style="display: block;"></supplier-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="分配类型:">
                            <dictionary-select v-model="searchParam.allocationType" style="display: block"
                                               option-name="ALLOCATION_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="btnLoading" v-permission="'/refuelingRecordOutInvite/export'" size="mini" type="primary"
                       icon="el-icon-download" @click="exportData">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="运单号" min-width="130">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="司机" prop="driverName" min-width="100"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="供应商" prop="supplier.name" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油时间" prop="createTime" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油金额" prop="amount" min-width="130"></el-table-column>
                <el-table-column align="center" label="分配类型" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ALLOCATION_TYPE"
                                                v-model="scope.row.allocationType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="接口返回信息" prop="exceptionInfo" min-width="130"></el-table-column>
            </el-table>
            <el-row>
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
            </el-row>
            <el-row style="font-size:13px; font-weight: bold;">
                <span style=" margin-right:20px;">勾选条数：{{multipleSelection.length}}条</span>
                <span style="color:red; margin-right:20px;">加油金额：{{amountValue}}元</span>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    import {Api, Common, Constant, Http, Validate} from 'src/global'
    import RefuelingSupplierSelect from "../../../common/select/RefuelingSupplierSelect";

    export default {
        components: {RefuelingSupplierSelect},
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                btnLoading: true,
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',//运单号
                    supplierId: '',//供应商
                    refuelingStartTime: '',//加油开始时间
                    refuelingEndTime: '',//加油结束时间
                    allocationType: ''//分配类型
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                tableHeight: window.innerHeight > 800 ? 430 : null
            }
        },
        created() {
            this.searchList();
        },
        computed: {
            amountValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].amount)
                    }
                }
                return sum.toFixed(2);
            }
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',//运单号
                    supplierId: '',//供应商
                    refuelingStartTime: '',//加油开始时间
                    refuelingEndTime: '',//加油结束时间
                    allocationType: ''//分配类型
                }

            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.refuelingRecordOutInvite.page, {params: vm.searchParam}, result => {
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            showWayBill(row) { //运单详情------------------------------------
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
            },
            exportData() {
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.refuelingRecordOutInvite.page, {params: searchExportParam}, response => {
                    let header = ['运单号', '供应商', '加油时间', '司机', '加油金额', '分配类型'];
                    let filterVal = ['waybillCode', 'supplier.name', 'createTime', 'driverName', 'amount',
                        {
                            type: 'dictionary',
                            'code': 'ALLOCATION_TYPE',
                            'name': 'allocationType'
                        }
                    ];
                    Common.excel.downloadExl(response.result, header, filterVal, "外请加油记录导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            },
            uploadSuccess() {
                let vm = this;
                vm.searchList();
            }
        }
    }
</script>

