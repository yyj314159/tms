<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 合作应付</el-breadcrumb-item>
                <el-breadcrumb-item>合作账单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="对账单号:">
                            <el-input v-model="searchParam.billCode"/>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input v-model="searchParam.licenseNumber" style="display:block"/>
                        </el-form-item>
                    </el-col>-->
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.licenseNumber" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="大区:">
                            <org-select v-model="searchParam.regionCode" style="display:block"
                                        nature="AREA"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="小区:">
                            <org-select v-model="searchParam.belongOrgCode" style="display:block"
                                        nature="PARTITION"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="月份:">
                            <el-date-picker style="display: block; width:100%;"
                                            v-model="searchParam.settlementMonth"
                                            type="month"
                                            value-format="yyyy-MM"
                                            placeholder="选择月"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="17">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam" size="small">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" size="mini" type="primary" icon="el-icon-download" @click="exportData"
                       v-permission="permission.downloadExcelPermission">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"/>
                <el-table-column header-align="center" label="账单号" min-width="150px" prop="code"/>
                <el-table-column header-align="center" label="月份" min-width="150px" prop="settlementMonth"/>
                <el-table-column header-align="center" label="大区" min-width="150px" prop="regionCode"/>
                <el-table-column header-align="center" label="小区" min-width="150px" prop="belongOrgCode"/>
                <el-table-column header-align="center" label="车牌号" min-width="100px" prop="licenseNumber"/>
                <el-table-column label="车主" prop="vehicleOwnerName" min-width="120"/>
                <el-table-column label="电话" prop="vehicleOwnerMobile" min-width="120"/>
                <el-table-column label="应付运费" prop="settlementAmount" min-width="120"/>
                <el-table-column label="运费调减" prop="freightWay" min-width="120"/>
                <el-table-column label="实际运费" prop="actualFreight" min-width="120"/>

                <el-table-column label="油" prop="oil" min-width="120"/>
                <el-table-column label="ETC" prop="etc" min-width="120"/>
                <el-table-column label="折旧" prop="depreciation" min-width="120"/>
                <el-table-column label="保险" prop="insurance" min-width="120"/>
                <el-table-column label="质量扣款" prop="qualityDeductionsAmount" min-width="120"/>
                <el-table-column label="结算金额" prop="settlementAmountAll" min-width="120"/>
                <el-table-column label="实际打款" prop="settlementAmountAll" min-width="120"/>
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
        <el-dialog :title="win.winTitle.theWaybillDetailsTitle" :visible.sync="win.winShow.theWaybillDetailsShow"
                   width="75%">
            <el-table size="small" class="content-table" :data="win.model.theWaybillDetailsData"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"/>
                <el-table-column header-align="center" label="运单编号" prop="waybillCode" min-width="120px" fixed/>
                <el-table-column label="运单状态" prop="waybill.status" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAY_BILL_STATUS"
                                                :value="scope.row.waybill?scope.row.waybill.status:''"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="客户全称" prop="waybill.dispatch.customer.name"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="大区" prop="waybill.dispatch.region.name"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="小区" prop="waybill.dispatch.belongOrg.name"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="线路" prop="waybill.dispatch.dispatchLine.lineName"
                                 min-width="250px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="车辆属性"
                                 prop="waybill.dispatch.dispatchVehicle.vehicleNature" min-width="120px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                :value="scope.row.waybill.dispatch.dispatchVehicle.vehicleNature"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="供应商" prop="waybill.dispatch.dispatchVehicle.supplier.name"
                                 min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="承运商" prop="waybill.dispatch.dispatchVehicle.shipper.name"
                                 min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="车牌号"
                                 prop="waybill.dispatch.dispatchVehicle.vehicleLicenseNum" min-width="120px"/>
                <el-table-column header-align="center" label="实际发车时间" prop="waybill.actualDepartureTime"
                                 min-width="200px"/>
                <el-table-column header-align="center" label="实际到达时间" prop="waybill.confirmArrivalTime"
                                 min-width="200px"/>
                <el-table-column header-align="center" label="签收时间" prop="waybill.signTime" min-width="200px"/>
                <el-table-column header-align="center" label="油卡卡号" prop="waybill.dispatch.dispatchPrice.oilCardNumber"
                                 min-width="150px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="应付运费" prop="paidVehicleAmount" min-width="120px"/>
                <el-table-column header-align="center" label="调整金额" prop="adjustAmount" min-width="120px"/>
                <el-table-column header-align="center" label="质量扣款(调减)" prop="qualityDeductionsAmount"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="油价补差(调增)" prop="oilPriceSupplement" min-width="120px"/>
                <el-table-column header-align="center" label="其他扣款(调减)" prop="otherDeductionsAmount" min-width="120px"/>
                <el-table-column header-align="center" label="实际应付" prop="actualPaidVehicleAmount" min-width="120px"/>
                <el-table-column header-align="center" label="预付打卡" prop="prepaidCardAmount" min-width="120px"/>
                <el-table-column header-align="center" label="货到打卡" prop="deliveryAmount" min-width="120px"/>
                <el-table-column header-align="center" label="GPS押金" prop="gpsDeposit" min-width="120px"/>
                <el-table-column header-align="center" label="GPS使用费" prop="gpsCost" min-width="120px"/>
                <el-table-column header-align="center" label="油卡押金" prop="oilCardDeposit" min-width="120px"/>
                <el-table-column header-align="center" label="油卡金额" prop="oilCardAmount" min-width="120px"/>
                <el-table-column header-align="center" label="定点加油" prop="refuelingAmount" min-width="120px"/>
                <el-table-column header-align="center" label="回单押金" prop="returnDeposit" min-width="120px"/>
                <el-table-column header-align="center" label="回单付金额(尾款)" prop="returnAmount" min-width="120px"/>
                <el-table-column header-align="center" label="账单生成状态" prop="supplierBillStatus" min-width="120px">
                    <template slot-scope="scope">
                        <datadictionary-name :value="scope.row.supplierBillStatus" option-name="BILL_STATUS"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="供应商账单生成人" prop="supplierBillGenerationUser"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="供应商账单生成时间" prop="supplierBillGenerationTime"
                                 min-width="150px"/>
                <el-table-column header-align="center" label="收款人" prop="supplierPayee" min-width="120px"/>
                <el-table-column header-align="center" label="开户行" prop="supplierOpeningBank" min-width="120px"/>
                <el-table-column header-align="center" label="收款银行" prop="supplierDueBank" min-width="120px"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="收款卡号" prop="supplierDueBankCardNo" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="运单备注" prop="waybill.remark" min-width="120px"/>
                <el-table-column header-align="center" label="始发地"
                                 prop="waybill.dispatch.dispatchLine.startStation.name" min-width="120px"/>
                <el-table-column header-align="center" label="目的地" prop="waybill.dispatch.dispatchLine.endStation.name"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="营运类型" prop="waybill.dispatch.dispatchLine.operationType"
                                 min-width="120px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_OPERATION_TYPE"
                                                :value="scope.row.waybill.dispatch.dispatchLine.operationType"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车长" prop="waybill.dispatch.dispatchVehicle.specification"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="主司机姓名" prop="waybill.dispatch.dispatchVehicle.driver.name"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="主司机电话"
                                 prop="waybill.dispatch.dispatchVehicle.driver.mobile" min-width="120px"/>
                <el-table-column header-align="center" label="应付合同号" prop="waybill.dispatch.dispatchPrice.contractCode"
                                 min-width="150px" show-overflow-tooltip/>
            </el-table>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http, Api, Constant, Common} from 'src/global/index'

    export default {
        data() {
            var permission = {
                downloadExcelPermission: '/outsourcePayableBill/downloadExcel',
                generateStatementHQButton: '/outsourcePayableBill/generateStatementHQButton'
            };
            return {
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getMonth() > new Date().getMonth()
                    }
                },
                exportLoading: true,
                //拷贝 初始化data
                initializeModel: {},
                permission: permission,
                multipleSelection: [],
                generateSelection: [],
                notGenerateSelection: [],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    billCode: '',
                    licenseNumber: '',
                    ownerId: '',
                    vehicleState: '',
                    settlementMonth: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                win: {
                    winTitle: { //弹出框 表头
                        theWaybillDetailsTitle: '运单详情'
                    },
                    winShow: {//是否显示弹框
                        generateStatementShow: false,
                        theWaybillDetailsShow: false
                    },
                    model: {
                        generateStatementModelForm: {
                            produceBill: true,
                            payToParty: false,
                            reconciliationType: 'SUPPLIER',
                            checkForAMonth: '',
                            bill: 0,
                            generate: [],
                            notGenerate: []
                        },
                        theWaybillDetailsData: []
                    },
                    rules: {
                        generateStatementRules: {
                            checkForAMonth: [
                                {required: true, message: '请选择对象', trigger: 'blur'}
                            ],
                        }
                    },
                    code: ''
                },
            }
        },
        watch: {
            'generateSelection'(val) {
                this.win.model.generateStatementModelForm.produceBill = val.length < 0
            }
        },
        mounted() {
            //查询表格
            this.searchList();
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data)
        },
        methods: {
            /*拷贝初始化对象*/
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam = vm.cloneMode().searchParam;
            },
            searchList() {
                let vm = this;
                Http.get(Api.outsourcePayableBill.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            generateSelectionChange(val) {
                this.generateSelection = val;
            },
            notGenerateSelectionChange(val) {
                this.notGenerateSelection = val;
            },
            exportData() {
                Http.get(Api.outsourcePayableBill.page, {params: this.searchParam}, result => {
                    //导出GPS
                    let header = ['账单号', '供应商', '车牌号', '月份', '大区', '小区', '预估运费',
                        '运费调减', '实际运费', '油费', 'ETC费', '物料消耗','折旧费', '火灾险服务费',
                        '质量扣款', '安全扣款','油价补差', '创建时间', '创建人', '修改时间',
                        '修改人'];
                    let filterVal = [
                        'code',
                        'supplierName',
                        'vehicle.licenseNumber',
                        'settlementMonth',
                        'regionCode',
                        'belongOrgCode',
                        'estimateAmount',
                        'feeAdjustAmount',
                        'settlementAmount',
                        'oilSum',
                        'etcSum',
                        'materialConsumption',
                        'depreciationFee',
                        'premium',
                        'qualityDeductionsAmount',
                        'securityDeductionsAmount',
                        'oilPriceSupplement',
                        'createTime',
                        'createUser',
                        'modifyTime',
                        'modifyUser'
                    ];
                    Common.excel.downloadExl(result.result, header, filterVal, "合作账单");
                })
            },
            searchOutsourceVehicleList() {
                let _this = this;
                let data = {
                    settlementMonth: Common.date.dateFormat(_this.win.model.generateStatementModelForm.checkForAMonth, "YYYY-MM"),
                    bill: _this.win.model.generateStatementModelForm.bill
                };
                Http.get(Api.outsourcePayableBill.getOutsourceVehicleList, {params: data}, result => {
                    if (result) {
                        _this.win.model.generateStatementModelForm.generate = result.result.generate;
                        _this.win.model.generateStatementModelForm.notGenerate = result.result.notGenerate;
                    }
                })
            },
            generateStatementLicenseNumbers() {
                let _this = this;
                if (_this.generateSelection) {
                    let licenseNumbers = [];
                    _this.generateSelection.forEach(s => {
                        licenseNumbers.push(s.vehicleLicenseNum)
                    });
                    let data = {
                        settlementMonth: Common.date.dateFormat(_this.win.model.generateStatementModelForm.checkForAMonth, "YYYY-MM"),
                        licenseNumbers: licenseNumbers
                    };
                    Http.post(Api.outsourcePayableBill.generateStatementLicenseNumbers, data, result => {
                        _this.$message.success("已生成账单");
                        _this.searchOutsourceVehicleList();
                        _this.searchList();
                    })
                }
            }
        }
    }
</script>
