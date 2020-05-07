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
                        <el-form-item label="加油单号:">
                            <el-input v-model="searchParam.refuelingCode" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="加油供应商:">
                            <dictionary-select v-model="searchParam.refuelingSupplier"
                                               option-name="GAS_STATION" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商单号:">
                            <el-input v-model="searchParam.supplierOrderId" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否取消订单:">
                            <dictionary-select v-model="searchParam.cancelOrderFlag"
                                               option-name="CANCEL_ORDER_FLAG" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
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
                        <el-form-item label="司机:">
                            <DriverSelect v-model="searchParam.driverId" style="display:block;"></DriverSelect>
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
            <el-button v-if="btnLoading" v-permission="'/refuelingOutInviteRecord/export'" size="mini" type="primary"
                       icon="el-icon-download" @click="exportData">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>

            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="加油单号"  prop="refuelingCode" min-width="160"></el-table-column>
                <el-table-column align="center" label="加油供应商" prop="refuelingSupplier"  min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="GAS_STATION"
                                                v-model="scope.row.refuelingSupplier"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="供应商单号" prop="supplierOrderId" min-width="190" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="司机" prop="driverId" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油时间" prop="refuelingTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油站" prop="refuelingStationId" min-width="210" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油升数" prop="refuelingVolume" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油单价" prop="refuelingUnitPrice" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油金额" prop="refuelingAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油品类型" prop="oilType" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="供应商实时单价" prop="supplierOilPrice" min-width="130" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="是否取消订单" prop="cancelOrderFlag" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="CANCEL_ORDER_FLAG"
                                                v-model="scope.row.cancelOrderFlag "></dictionary-select-name>
                    </template>
                </el-table-column>
                <!--<el-table-column align="center" label="创建人" prop="createUser" min-width="120" show-overflow-tooltip></el-table-column>-->
                <!--<el-table-column align="center" label="创建时间" prop="createTime" min-width="160" show-overflow-tooltip></el-table-column>-->
                <!--<el-table-column align="center" label="修改人" prop="modifyUser" min-width="120" show-overflow-tooltip></el-table-column>-->
                <!--<el-table-column align="center" label="修改时间" prop="modifyTime" min-width="160" show-overflow-tooltip></el-table-column>-->
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
        </el-main>
    </el-container>
</template>

<script>
    import {Http, Api,Common} from 'src/global'
    import RefuelingSupplierSelect from "../../../common/select/RefuelingSupplierSelect";

    export default {
        components: {RefuelingSupplierSelect},
        data() {
            return {
                isLoading: true,
                btnLoading: true,
                btnDownLoading: true,
                showModify: false,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    refuelingCode:'',//加油单号
                    refuelingSupplier:'',//加油供应商
                    supplierOrderId:'',//供应商单号
                    cancelOrderFlag:'',//是否取消订单
                    refuelingStartTime:'',//加油开始时间
                    refuelingEndTime:'',//加油结束时间
                    driverId:''//司机id
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
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
                    refuelingCode:'',//加油单号
                    refuelingSupplier:'',//加油供应商
                    supplierOrderId:'',//供应商单号
                    cancelOrderFlag:'',//是否取消订单
                    refuelingStartTime:'',//加油开始时间
                    refuelingEndTime:'',//加油结束时间
                    driverId:''//司机id
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.refuelingOutInviteRecord.page, {params: vm.searchParam}, result => {
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
            exportData() {
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.refuelingOutInviteRecord.page, {params: searchExportParam}, response => {
                    let header = ['加油单号', '加油供应商', '供应商单号', '司机', '加油时间','加油站',
                        '加油升数', '加油单价','加油金额','油品类型', '供应商实时单价','是否取消订单', '创建人', '创建时间',
                        '修改人', '修改时间'];
                    let filterVal = [
                        'refuelingCode',
                        {
                            type: 'dictionary',
                            'code': 'GAS_STATION',
                            'name': 'refuelingSupplier'
                        },
                        'supplierOrderId',
                        'driverId',
                        'refuelingTime',
                        'refuelingStationId',
                        'refuelingVolume',
                        'refuelingUnitPrice',
                        'refuelingAmount',
                        'oilType',
                        'supplierOilPrice',
                        {
                            type: 'dictionary',
                            'code': 'CANCEL_ORDER_FLAG',
                            'name': 'cancelOrderFlag'
                        },
                        'createUser',
                        'createTime',
                        'modifyUser',
                        'modifyTime'
                    ];
                    Common.excel.downloadExl(response.result, header, filterVal, "外请加油记录导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            },
        }
    }
</script>

