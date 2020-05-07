<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 定点加油</el-breadcrumb-item>
                <el-breadcrumb-item>加油供应商补单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="司机:">
                            <DriverSelect v-model="searchParam.driverId" style="display:block;"></DriverSelect>
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
                        <el-form-item label="加油站:">
                            <oil-station-select v-model="searchParam.oilsStationId"
                                                style="display: block;"></oil-station-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="加油单号:">
                            <el-input v-model="searchParam.customerOrderId" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商订单号:">
                            <el-input v-model="searchParam.supplierOrderId" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" v-permission="'/outInviteReplacementOrder/query'" icon="el-icon-search" @click="searchList">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-if="btnLoading" size="mini" type="primary" v-permission="'/outInviteReplacementOrder/export'"
                       icon="el-icon-download" @click="exportData">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="是否确认" min-width="120" fix show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.confirmFlag" >
                            {{"是"}}
                        </span>
                        <span v-else  style="color: red">
                            {{"否"}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="加油供应商" prop="refuelingSupplier"  min-width="120">
                <template slot-scope="scope">
                    <dictionary-select-name option-name="GAS_STATION"
                                            v-model="scope.row.refuelingSupplier"></dictionary-select-name>
                </template>
                </el-table-column>
                <el-table-column align="center" label="司机" prop="driverName"
                                 min-width="140"></el-table-column>
                <el-table-column align="center" label="司机电话" prop="driverPhone" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油时间" prop="refuelingTime" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油站" prop="oilStationName" min-width="220"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油品类型" prop="oilsId" min-width="100"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="供应商订单号" prop="supplierOrderId"
                                 min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油单号" prop="customerOrderId" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油升数" prop="count" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油单价" prop="price" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油金额" prop="totalPrice" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="补单备注" prop="remark" min-width="180"
                                 show-overflow-tooltip></el-table-column>


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
    import {Http, Api, Validate, Common, Constant} from 'src/global'
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
                    refuelingSupplier: '',//加油供应商
                    driverPhone: '',//司机电话
                    refuelingTime: '',//加油时间
                    oilsStationId:'',//加油站
                    oilsId: '',//油品ID
                    supplierOrderId: '',//供应商订单号
                    customerOrderId: '',//加油单号
                    count: '',//数量
                    price: '',//单价
                    remark: '',//补单备注
                    confirmFlag: '',//是否确认
                    createUse: '',//创建人
                    modifyUser: '',//修改人
                    driverId: '',//司机
                    refuelingStartTime:'',
                    refuelingEndTime:''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: []
            }
        },
        created() {
            this.searchList();
        },
        computed: {
            auditDataFlag() {
                if(!this.multipleSelection || this.multipleSelection.length == 0){
                    return true;
                }
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection[i].auditFlag) {
                        return true;
                    }
                }
                return false;
            }
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.refuelingSupplier = '';
                this.searchParam.driverPhone = '';
                this.searchParam.refuelingTime = '';
                this.searchParam.oilsStationId = '';
                this.searchParam.oilsId = '';
                this.searchParam.supplierOrderId = '';
                this.searchParam.customerOrderId = '';
                this.searchParam.count = '';
                this.searchParam.price = '';
                this.searchParam.remark = '';
                this.searchParam.confirmFlag = '';
                this.searchParam.createUse = '';
                this.searchParam.modifyUser = '';
                this.searchParam.driverId = '';
                this.searchParam.refuelingStartTime='';
                this.searchParam.refuelingEndTime='';
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.outInviteReplacementOrder.page, {params: vm.searchParam}, result => {
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
                Http.get(Api.outInviteReplacementOrder.page, {params: searchExportParam}, response => {
                    let header = ['加油供应商','司机','司机电话','加油时间','加油站',
                        '油品类型','供应商订单号', '加油单号', '加油升数','加油单价','加油金额','补单备注',
                        '是否确认'];
                    let filterVal = [
                        {
                            type: 'dictionary',
                            'code': 'GAS_STATION',
                            'name': 'refuelingSupplier'
                        },
                        'driverName', 'driverPhone', 'refuelingTime', 'oilStationName', 'oilsId',
                        'supplierOrderId','customerOrderId','count','price','totalPrice','remark',
                        {
                            type: 'dictionary',
                            code: 'CONFIRM_FLAG',
                            name: 'confirmFlag'
                        }
                    ];
                    Common.excel.downloadExl(response.result, header, filterVal, "外请加油补单导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            }
        }
    }
</script>

