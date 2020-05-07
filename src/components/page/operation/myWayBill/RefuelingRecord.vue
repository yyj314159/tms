<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 定点加油</el-breadcrumb-item>
                <el-breadcrumb-item>合作加油记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="加油站:">
                   <!--         <gas-station-select v-model="searchParam.gasStationId"
                                                style="display: block;"></gas-station-select>-->
                            <el-input v-model="searchParam.stationName" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input v-model="searchParam.vehicleLicenseNum" style="display:block;"></el-input>
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
                </el-row>
                <el-row>
                    <!--<el-col :span="6">
                        <el-form-item label="站点所属区域:">
                            <org-select v-model="searchParam.belongOrgCode"
                                                style="display: block"></org-select>
                        </el-form-item>
                    </el-col>-->
                    <el-col :span="6">
                        <el-form-item label="车辆所属区域:">
                            <org-select v-model="searchParam.vehicleOrgCode"
                                                style="display: block"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierCode"
                                             :types="Constant.SUPPLIER_TYPE.CAR_TEAM+','+Constant.SUPPLIER_TYPE.DEPARTMENT_OF_INFORMATION"
                                             style="display: block;"></supplier-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="加油供应商:">
                            <dictionary-select v-model="searchParam.refuelingSupplier"
                                               option-name="GAS_STATION" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否核对:">
                            <dictionary-select v-model="searchParam.checkFlag" style="display: block"
                                               option-name="CHECK_STATUS"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="加油单号:">
                            <el-input v-model="searchParam.refuelingCode" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商单号:">
                            <el-input v-model="searchParam.supplierOrderId" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机App隐藏:">
                            <dictionary-select v-model="searchParam.hiddenFlag" style="display: block"
                                               option-name="BOOLEAN_FLAG"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否结算:">
                            <dictionary-select v-model="searchParam.settlementFlag" style="display: block"
                                               option-name="SETTLEMENT_STATUS"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" style="float: right">
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
            <el-button v-if="btnLoading" v-permission="'/refuelingRecord/export'" size="mini" type="primary"
                       icon="el-icon-download" @click="exportData">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-button v-if="btnDownLoading" icon="el-icon-download" type="primary" size="mini"
                       v-permission="'/refuelingRecord/download'"
                       @click="templateDownload">模板下载
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>下载中...
            </el-button>
            <upload-excel :importUrl="Api.refuelingRecord.upload" @success="uploadSuccess" btn-name="导入"
                          v-permission="'/refuelingRecord/import'"
                          style="display: inline-block; margin-left: 10px;"></upload-excel>
            <el-button :disabled="multipleSelection.length==0" v-permission="'/refuelingRecord/check'"
                       size="mini" type="primary" icon="el-icon-check"
                       style="display: inline-block; margin-left: 10px;"
                       @click="checkSubmit()">核对
            </el-button>
            <el-button :disabled="multipleSelection.length==0" v-permission="'/refuelingRecord/settlement'"
                       size="mini" type="primary" icon="el-icon-check"
                       style="display: inline-block; margin-left: 10px;"
                       @click="settlementSubmit()">结算
            </el-button>
            <el-button :disabled="multipleSelection.length==0" v-permission="'/refuelingRecord/hide'"
                       size="mini" type="primary" icon="el-icon-check"
                       style="display: inline-block; margin-left: 10px;"
                       @click="hideSubmit()">隐藏
            </el-button>

            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="车牌号" fixed="left" prop="vehicleLicenseNum"
                                 min-width="140"></el-table-column>
                <el-table-column align="center" label="车辆性质" fixed="left" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                v-model="scope.row.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <!--<el-table-column align="center" label="站点所属区域"  prop="belongOrg.name" min-width="180"
                                 show-overflow-tooltip></el-table-column>-->
                <el-table-column align="center" label="车辆所属区域"  prop="vehicleBelongOrg.name" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油单号" prop="refuelingCode" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油站" prop="stationName" min-width="230"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油品种类" prop="oilsType" min-width="100"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油供应商" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="GAS_STATION"
                                                v-model="scope.row.refuelingSupplier"></dictionary-select-name>
                    </template>
               </el-table-column>
                <el-table-column align="center" label="供应商订单号" prop="supplierOrderId" min-width="200"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油时间" prop="refuelingTime" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="司机" prop="driver.name" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油升数(升)" prop="refuelingVolume"
                                 min-width="130"></el-table-column>
                <el-table-column align="center" label="应收单价" prop="receiveUnitPrice" min-width="130"></el-table-column>
                <el-table-column align="center" label="应收金额" prop="receiveAmount" min-width="130"></el-table-column>
                <template v-if="$_permission('/refuelingRecord/paidPrice')">
                    <el-table-column align="center" label="应付单价" prop="paidUnitPrice" min-width="130"></el-table-column>
                    <el-table-column align="center" label="应付金额" prop="paidAmount" min-width="130"></el-table-column>
                </template>
                <el-table-column align="center" label="是否核对" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.checkFlag ? "已核对" : "未核对"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否结算(供应商)" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.settlementFlag ? "已结算" : "未结算"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否结算(司机)" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.receiveBillCode ? "已结算" : "未结算"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="加油站是否匹配" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.matchFlag ? "否" : "是"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否取消订单" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.cancelOrderFlag ? "是" : "否"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="司机APP是否隐藏" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.hiddenFlag ? "是" : "否"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="现场拍照" min-width="130">
                    <template slot-scope="scope">
                        <show-image :url="scope.row.attachment"></show-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="供应商" prop="supplier.name" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <!--<el-table-column align="center" label="操作" fixed="right" min-width="160">
                    <template slot-scope="scope">
&lt;!&ndash;
                        <el-row v-if="scope.row.importFlag && !scope.row.settlementFlag">
&ndash;&gt;
                        <el-row v-if="scope.row.refuelingSupplier != 'FA_YOU_WEBSITE' && !scope.row.settlementFlag">
                            <el-col :span="12">
                                &nbsp;<el-button type="text" size="mini" icon="el-icon-edit" v-permission="'/refuelingRecord/modify'"
                                                 @click="modifyRow(scope.row)">修改
                            </el-button>
                            </el-col>
                            <el-col :span="12">
                                &nbsp;<el-button type="text" size="mini" icon="el-icon-delete" v-permission="'/refuelingRecord/delete'"
                                                 @click="deleteRow(scope.row)">删除
                            </el-button>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>-->
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
                <span style="color:red; margin-right:20px;">加油升数：{{refuelingVolumeValue}}升</span>
                <span style="color:red; margin-right:20px;">应收金额：{{receiveAmountValue}}元</span>
                <span v-if="$_permission('/refuelingRecord/paidPrice')" style="color:red; margin-right:20px;">应付金额：{{paidAmountValue}}元</span>
            </el-row>
        </el-main>

        <!-- 修改弹出框 -->
        <el-dialog title="修改" :visible.sync="showModify" width="30%">
            <el-form size="small" :model="modifyForm" :rules="modifyForm" ref="modifyForm" label-width="120px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="运单号:">
                            {{modifyForm.waybillCode}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="车牌号:">
                            {{modifyForm.vehicleLicenseNum}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="加油站:" prop="gasStation" :rules="Validate.required('加油站',true)">
                            <gas-station-select ref="gasStation" v-model="modifyForm.gasStationId"
                                                style="display: block;"></gas-station-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="油品种类:" prop="oilsType" :rules="Validate.required('油品种类',true)">
                            <el-input v-model="modifyForm.oilsType"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="加油时间:" prop="refuelingTime" :rules="Validate.required('加油时间',true)">
                            <el-date-picker style="display:block; width:100%;" v-model="modifyForm.refuelingTime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            type="datetime" placeholder="选择日期时间"
                                            :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="加油升数:" prop="refuelingVolume"
                                      :rules="[Validate.required('车牌号',true),Validate.point2]">
                            <el-input v-model="modifyForm.refuelingVolume"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="showModify = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyFormSubmit">确 定</el-button>
            </div>
        </el-dialog>
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
                btnDownLoading: true,
                showModify: false,
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',//运单号
                    refuelingCode:'',//加油单号
                    supplierOrderId:'',//供应商单号
                    settlementFlag: '',//是否结算
                    checkFlag: '',//是否核对
                    supplierCode: '',//供应商
                    // belongOrgCode: '',//站点所属区域
                    vehicleOrgCode: '',//车辆所属区域
                    vehicleLicenseNum: '',//车牌号
                    // gasStationId: '',//加油站
                    stationName: '',//加油站
                    refuelingSupplier: '',//加油供应商
                    refuelingStartTime: '',//加油开始时间
                    refuelingEndTime: '',//加油结束时间
                    hiddenFlag: '',//是否隐藏
                    refuelingAccountFlag:0,//结算模式
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                modifyForm: {
                    id: '',
                    waybillCode: '',
                    vehicleLicenseNum: '',
                    gasStationId: '',
                    oilsType: '',
                    refuelingTime: '',
                    refuelingVolume: ''
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                tableHeight: window.innerHeight>800?430:null
            }
        },
        created() {
            this.searchList();
        },
        computed: {
            refuelingVolumeValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].refuelingVolume)
                    }
                }
                return sum.toFixed(2);
            },
            receiveAmountValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].receiveAmount)
                    }
                }
                return sum.toFixed(2);
            },
            paidAmountValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].paidAmount)
                    }
                }
                return sum.toFixed(2);
            }
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',//运单号
                    refuelingCode:'',//加油单号
                    supplierOrderId:'',//供应商单号
                    settlementFlag: '',//是否结算
                    checkFlag: '',//是否核对
                    supplierCode: '',//供应商
                    // belongOrgCode: '',//站点所属区域
                    vehicleOrgCode: '',//车辆所属区域
                    vehicleLicenseNum: '',//车牌号
                    // gasStationId: '',//加油站
                    stationName: '',//加油站
                    refuelingSupplier: '',//加油供应商
                    refuelingStartTime: '',//加油开始时间
                    refuelingEndTime: '',//加油结束时间
                    hiddenFlag: '',//是否隐藏
                    refuelingAccountFlag:0,//结算模式
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.refuelingRecord.page, {params: vm.searchParam}, result => {
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
                Http.get(Api.refuelingRecord.page, {params: searchExportParam}, response => {
                    let header = ['运单号', '车牌号', '车辆性质', '车辆所属区域','供应商','加油单号',
                        '加油站', '加油供应商','供应商订单号', '加油时间', '司机', '加油升数(升)',
                        '应收单价', '应收金额', '应付单价', '应付金额', '是否核对',
                        '是否结算(供应商)', '是否结算(司机)', '加油站是否匹配', '是否取消订单', '司机APP是否隐藏'];
                    let filterVal = ['waybillCode', 'vehicleLicenseNum',
                        {
                            type: 'dictionary',
                            'code': 'VEHICLE_OPERATION_MODE',
                            'name': 'vehicleNature'
                        }, 'vehicleBelongOrg.name','supplier.name', 'refuelingCode','stationName',
                        {
                            type: 'dictionary',
                            'code': 'GAS_STATION',
                            'name': 'refuelingSupplier'
                        },'supplierOrderId',
                        'refuelingTime', 'driver.name', 'refuelingVolume', 'receiveUnitPrice', 'receiveAmount',
                        'paidUnitPrice', 'paidAmount',
                        {
                            type: 'dictionary',
                            'code': 'CHECK_STATUS',
                            'name': 'checkFlag'
                        },
                        {
                            type: 'dictionary',
                            'code': 'SETTLEMENT_STATUS',
                            'name': 'settlementFlag'
                        },
                        {
                            type: 'dictionary',
                            'code': 'SETTLEMENT_STATUS',
                            'name': 'receiveBillCodeFlag'
                        },
                        {
                            type: 'dictionary',
                            'code': 'REVERSE_BOOLEAN_FLAG',
                            'name': 'matchFlag'
                        },
                        {
                            type: 'dictionary',
                            'code': 'BOOLEAN_FLAG',
                            'name': 'cancelOrderFlag'
                        },
                        {
                            type: 'dictionary',
                            'code': 'BOOLEAN_FLAG',
                            'name': 'hiddenFlag'
                        }
                    ];
                    Common.excel.downloadExl(response.result, header, filterVal, "定点加油记录导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            },
            templateDownload() {
                this.btnDownLoading = false;
                Common.excel.downloadExl([], ["加油站",'油品种类',"车牌号","加油时间","加油升数"], null, '加油记录表');
                this.btnDownLoading = true;
            },
            uploadSuccess() {
                let vm = this;
                vm.searchList();
            },
            modifyRow(row) {
                if ('FA_YOU_WEBSITE' == row.refuelingSupplier) {
                    this.$message.warning('找油网站点不能修改！');
                    return;
                }
                let vm = this;
                Http.get(Api.refuelingRecord.queryById, {params: {'id': row.id}}, result => {
                    vm.showModify = true;
                    setTimeout(() => {
                        vm.$refs.gasStation.setCurrentCustomer(result.result.gasStation);
                        vm.modifyForm = result.result;
                    }, 0)
                })
            },
            modifyFormSubmit() {
                let vm = this;
                vm.$refs.modifyForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.refuelingRecord.modify, vm.modifyForm, result => {
                            this.$message.success('修改成功！');
                            this.searchList();
                            vm.showModify = false;
                        })
                    }
                })
            },
            deleteRow(row) { // 清除---------------------------------
                if ('FA_YOU_WEBSITE' == row.refuelingSupplier) {
                    this.$message.warning('找油网站点不能删除！');
                    return;
                }
                this.multipleSelection.push(row.id);
                this.$confirm('删除本条数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.refuelingRecord.delete, this.multipleSelection, result => {
                        this.$message.success('删除成功！');
                        this.multipleSelection = [];
                        this.searchList();
                    }, result => {
                        this.multipleSelection = [];
                    })
                })
            },
            checkSubmit() {
                let vm = this;
                var ids = [];
                vm.multipleSelection.forEach((item) => {
                    ids.push(item.id);
                })
                this.$confirm('是否已经核对?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.refuelingRecord.check, ids, result => {
                        vm.$message.success("核对成功")
                        vm.searchList();
                    })
                })
            },
            settlementSubmit() {
                let vm = this;
                var ids = [];
                for (let i = 0; i < vm.multipleSelection.length; i++) {
                    if (!vm.multipleSelection[i].checkFlag) {
                        this.$message('只能选择已经核对的数据来结算');
                        return;
                    }
                    ids.push(vm.multipleSelection[i].id);
                }
                this.$confirm('是否结算?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.refuelingRecord.settlement, ids, result => {
                        vm.$message.success("结算成功")
                        vm.searchList();
                    })
                })
            },
            // 修改司机App隐藏状态为隐藏
            hideSubmit() {
                var ids = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    ids.push(this.multipleSelection[i].id);
                }
                this.$confirm('是否隐藏司机App显示?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.refuelingRecord.hide, ids, result => {
                        this.$message.success("成功")
                        this.searchList();
                    })
                })
            }
        }
    }
</script>

