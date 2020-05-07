<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 应付管理</el-breadcrumb-item>
                <el-breadcrumb-item>承运商账单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form :model="model.searchParam" label-width="80px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="账单编号:">
                            <el-input v-model="model.searchParam.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单编号:">
                            <el-input v-model="model.searchParam.waybillCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请时间:">
                            <el-date-picker
                                v-model="model.searchParam.billTime"
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
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="付款状态:">
                            <dictionary-select v-model="model.searchParam.paymentState" option-name="PAY_STATUS"
                                                style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否补打:">
                            <dictionary-select v-model="model.searchParam.beDefeated" option-name="IS_EXIST"
                                               style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="付款时间:">
                            <el-date-picker
                                style="width:100%;"
                                v-model="model.searchParam.paymentTime"
                                :default-time="['00:00:00', '23:59:59']"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select style="display: block; width:100%;" v-model="model.searchParam.supplierId"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchPayableBillForMainList">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetMainSearchParam">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" size="mini" type="primary" icon="el-icon-download" @click="downloadExcel"
                       v-permission="permission.downloadExcelPermission"> 导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-button size="mini" type="primary" @click="synchronizationSubmit"
                       v-permission="permission.synchronization" :disabled="buttonDisabled.synchronization"> 同步收款人信息
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-download" v-permission="permission.toBeConfirmed"
                       @click="toBeConfirmedSubmit" :disabled="buttonDisabled.paymentDisabled">转入待付款
            </el-button>
            <el-button size="mini" type="primary" @click="confirmThePaymentWinShow"
                       v-permission="permission.confirmThePayment"
                       :disabled="buttonDisabled.synchronization"> 确认付款
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-download" v-permission="permission.paymentFailed"
                       @click="paymentFailedSubmit" :disabled="buttonDisabled.paymentDisabled">付款失败
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-download" v-permission="permission.deleteTheBill"
                       @click="deleteTheBillSubmit" :disabled="buttonDisabled.synchronization">删除账单
            </el-button>
            <general-table :gridInstance="table.gridInstance"
                           :detailDisabled="table.detailDisabled"
                           :height="table.height"
                           @selectChange="handlerChange"
                           @on-dbclick="handleRowHandle"
                           ref="mainTable"/>
        </el-main>
        <!-- 账单明细 win -->
        <el-dialog :title="win.winTitle.payableBillDetailsWinTitle" :visible.sync="win.winShow.payableBillDetailsWin"
                   width="1100px">
            <el-row class="card">
                <el-row class="card-body">
                    <el-button v-if="exportDetailLoading" v-permission="permission.getDetailExport" size="mini"
                               type="primary" @click="downloadDetailsExcel"> 导出明细
                    </el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
                    </el-button>
                    <el-button v-if="exportLoading1" size="mini" type="primary" icon="el-icon-download" @click="downloadDetailsExcel1"
                               v-permission="permission.downloadExcelPermission"> 导出请款
                    </el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
                    </el-button>
                    <el-tabs v-model="tabsActiveName">
                        <el-tab-pane label="运费" name="one">
                            <el-table class="content-table" size="small" :data="win.model.payableBillDetailsWinModel"
                                      height="250px"
                                      element-loading-text="拼命加载中"
                                      border fitheader-align="center" width="220"
                                      highlight-current-row stripe>
                                <el-table-column type="selection" width="40"/>
                                <el-table-column header-align="center" width="120px" prop="waybillCode" label="运单编号"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.customer.name" label="客户全称" show-overflow-tooltip/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.region.name" label="大区"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.belongOrg.name" label="小区"/>
                                <el-table-column header-align="center" width="250px" prop="waybill.dispatch.dispatchLine.lineName" label="线路" show-overflow-tooltip/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchVehicle.vehicleNature" label="车辆属性">
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="scope.row.waybill.dispatch.dispatchVehicle.vehicleNature"/>
                                    </template>
                                </el-table-column>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchVehicle.supplier.name" label="供应商" show-overflow-tooltip/>
                                <el-table-column header-align="center" width="200px" prop="waybill.dispatch.dispatchVehicle.shipper.name" label="承运商" show-overflow-tooltip/>
                                <el-table-column header-align="center" width="200px" prop="waybill.dispatch.dispatchVehicle.vehicleLicenseNum" label="车牌号"/>
                                <el-table-column header-align="center" width="170px" prop="waybill.actualDepartureTime" label="实际发车时间" show-overflow-tooltip/>
                                <el-table-column header-align="center" width="170px" prop="waybill.confirmArrivalTime" label="实际到达时间" show-overflow-tooltip/>
                                <el-table-column header-align="center" width="120px" prop="paidVehicleAmount" label="应付运费"/>
                                <el-table-column header-align="center" width="120px" prop="adjustAmount" label="调整金额"/>
                                <el-table-column header-align="center" width="120px" prop="qualityDeductionsAmount" label="质量扣款(调减)"/>
                                <el-table-column header-align="center" width="120px" prop="qualityAward" label="质量奖励(调增)"/>
                                <el-table-column header-align="center" width="120px" prop="oilPriceSupplement" label="油价补差(调增)"/>
                                <el-table-column header-align="center" width="120px" prop="otherDeductionsAmount" label="其他扣款(调减)"/>
                                <el-table-column header-align="center" width="120px" prop="detentionCharge" label="压车费(调增)"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchPrice.insuranceFee" label="火灾险服务费"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchPrice.handTransferFee"  label="打款手续费"/>
                                <el-table-column header-align="center" width="120px" prop="actualPaidVehicleAmount" label="实际应付"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchPrice.prepaidCardAmount" label="预付打卡"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchPrice.deliveryAmount" label="货到打卡"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchPrice.gpsDeposit" label="GPS押金"/>
                                <el-table-column header-align="center" width="120px" prop="gpsRetainage" label="GPS丢失扣款"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchPrice.gpsFee" label="GPS使用费"/>
                                <el-table-column header-align="center" width="200px" prop="waybill.dispatch.dispatchPrice.oilCardNumber" label="油卡卡号"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchPrice.oilCardAmount" label="油卡金额"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchPrice.oilCardDeposit" label="油卡押金"/>
                                <el-table-column header-align="center" width="120px" prop="oilRetainage" label="油卡丢失扣款"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchPrice.refuelingAmount" label="定点加油"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchPrice.returnDeposit" label="回单押金"/>
                                <el-table-column header-align="center" width="120px" prop="returnRetainage" label="回单丢失扣款"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchPrice.returnAmount" label="尾款"/>
                                <el-table-column header-align="center" width="150px" prop="waybill.dispatch.dispatchLine.startStation.name" label="始发地"/>
                                <el-table-column header-align="center" width="150px" prop="waybill.dispatch.dispatchLine.endStation.name" label="目的地"/>
                                <el-table-column header-align="center" width="150px" prop="waybill.dispatch.dispatchLine.operationType"
                                                 label="营运类型">
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="LINE_OPERATION_TYPE" :value="scope.row.waybill.dispatch.dispatchLine.operationType"/>
                                    </template>
                                </el-table-column>
                                <el-table-column header-align="center" width="120px" prop="waybill.weight" label="重量"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.volume" label="体积"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchVehicle.specification" label="车长"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchVehicle.driver.name" label="主司机姓名"/>
                                <el-table-column header-align="center" width="120px" prop="waybill.dispatch.dispatchVehicle.driver.mobile" label="主司机电话"/>
                                <el-table-column header-align="center" width="150px" prop="waybill.receiptCodes" label="回单号"/>
                                <el-table-column header-align="center" width="150px" prop="waybill.dispatch.dispatchPrice.contractCode" label="应付合同号"/>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="加油记录" name="tow">
                            <el-table class="content-table" :data="win.model.refuelingRecord"
                                      element-loading-text="拼命加载中"
                                      height="250px"
                                      size="mini"
                                      border fit highlight-current-row stripe>
                                <el-table-column align="center" label="车牌号" prop="vehicleLicenseNum" min-width="140"/>
                                <el-table-column align="center" label="车辆性质" min-width="120">
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" v-model="scope.row.vehicleNature"/>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="所属区域" prop="belongOrg.name" min-width="180" show-overflow-tooltip/>
                                <el-table-column align="center" label="加油站" prop="gasStation.name" min-width="180" show-overflow-tooltip/>
                                <el-table-column align="center" label="加油供应商" min-width="180" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.gasStation">
                                            <dictionary-select-name option-name="GAS_STATION" v-model="scope.row.gasStation.supplier"/>
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="加油时间" prop="refuelingTime" min-width="160"/>
                                <el-table-column align="center" label="司机" prop="driver.name" min-width="140" show-overflow-tooltip/>
                                <el-table-column align="center" label="计价数量（升）" prop="refuelingVolume" min-width="130"/>
                                <el-table-column align="center" label="单价" prop="receiveUnitPrice" min-width="130"/>
                                <el-table-column align="center" label="加油金额（元）" prop="receiveAmount" min-width="130"/>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </el-row>


            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="win.winShow.payableBillDetailsWin = false" size="small" v-show="false">取 消
                </el-button>
            </div>
        </el-dialog>
        <!--生成对账单-->
        <el-dialog :title="win.winTitle.generateStatement"
                   :visible.sync="win.winShow.generateStatementShow" width="600px">
            <el-form :model="win.model.generateStatementModelForm" ref="generateStatementModelFormRef"
                     :rules="win.rules.generateStatementRules"
                     label-width="100px" size="small" align="center">
                <el-row>
                    <el-col :span="12"><!--供应商-->
                        <el-form-item label="供应商:" prop="supplierId">
                            <supplier-select style="display: block; width:100%;"
                                             v-model="win.model.generateStatementModelForm.supplierId"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="时间:" prop="checkForAMonth">
                            <div class="block">
                                <el-date-picker style="display: block; width:100%;"
                                                v-model="win.model.generateStatementModelForm.checkForAMonth"
                                                type="month"
                                                placeholder="选择月">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="win.winShow.generateStatementShow = false" size="small">取 消</el-button>
                <el-button type="primary" @click="generateStatementSubmit('generateStatementModelFormRef')" size="small">确 定
                </el-button>
            </div>
        </el-dialog>
        <!--确认付款-->
        <el-dialog :title="win.winTitle.confirmThePayment" :visible.sync="win.winShow.confirmThePaymentShow"
                   width="600px">
            <el-form :model="win.model.confirmThePaymentModelForm" ref="confirmThePaymentModelFormRef"
                     :rules="win.rules.confirmThePaymentRules" label-width="100px" size="small" align="center">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="账单编号:" prop="billCode" style="word-break:break-all;">
                            {{win.model.confirmThePaymentModelForm.codes}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="show.invoiceNumberShow">
                        <el-form-item label="发票号:" prop="invoiceNumber">
                            <el-input v-model="win.model.confirmThePaymentModelForm.invoiceNumber"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="show.invoiceNumberShow">
                        <el-form-item label="开票日期" prop="invoiceMonth">
                            <date-picker-single v-model="win.model.confirmThePaymentModelForm.invoiceMonth"  :end-date="newData" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="win.winShow.confirmThePaymentShow = false" size="small">取 消</el-button>
                <el-button type="primary" @click="confirmThePaymentSubmit('confirmThePaymentModelFormRef')"
                           size="small">确 定
                </el-button>
            </div>
        </el-dialog>
    </el-container>
</template>


<script>
    import {Api, Common, Http} from 'src/global'
    import DatadictionaryName from "../../common/select/DatadictionaryName";

    export default {
        components: {DatadictionaryName},
        data() {
            let permission = { //权限
                downloadExcelPermission: '/payableBill/downloadExcel',
                generateStatementHQButton: '/payableBill/generateStatementHQButton',
                getDetailExport: '/payableBill/getDetailExport',
                confirmThePayment: '/payableBill/confirmThePayment',
                synchronization: '/payableBill/synchronization',
                toBeConfirmed: '/payableBill/toBeConfirmed',
                notarizePayment: '/payableBill/notarizePayment',
                paymentFailed: '/payableBill/paymentFailed',
                deleteTheBill: '/payableBill/deleteTheBill'
            };
            return {
                exportLoading: true,
                exportLoading1: true,
                exportDetailLoading: true,
                //拷贝 初始化data
                initializeModel: {},
                tabsActiveName: 'one',
                newData : new Date,
                model: {
                    searchParam: {//查询参数
                        waybillCode:'',
                        beDefeated:'',
                        ticket:true,
                        billType: '',
                        paymentState: '',
                        code: '',
                        checkForAMonthTime: '',
                        checkForAMonth: '',
                        supplierId: '',
                        // shipperId: '',
                        vehicleCode: '',
                        billTime: [],
                        billStartTime: '',
                        billEndTime: '',
                        paymentStartTime: '',
                        paymentEndTime: '',
                        paymentTime: ''
                    }
                },
                win: {
                    winTitle: { //弹出框 表头
                        payableBillDetailsWinTitle: '账单明细',
                        generateStatement: '生成对账单',
                        confirmThePayment: '确认付款'
                    },
                    winShow: {//是否显示弹框
                        payableBillDetailsWin: false,
                        generateStatementShow: false,
                        confirmThePaymentShow: false
                    },
                    model: {
                        payableBillDetailsWinModel: [],
                        refuelingRecord: [],
                        confirmThePaymentModelForm: {
                            codes: '',
                            billCode: [],
                            invoiceNumber: ''
                        },
                        generateStatementModelForm: {
                            vehicleCode: '',
                            supplierId: '',
                            payToParty: false,
                            reconciliationType: 'SUPPLIER',
                            checkForAMonth: new Date() - 1
                        }
                    },
                    rules: {
                        generateStatementRules: {
                            payToParty: [
                                {required: true, message: '请选择对象', trigger: 'blur'}
                            ],
                            supplierId: [
                                {required: true, message: '请选择对象', trigger: 'blur'}
                            ],
                            vehicleCode: [
                                {required: false, message: '请选择对象', trigger: 'blur'}
                            ],
                            checkForAMonth: [
                                {required: true, message: '请选择对象', trigger: 'blur'}
                            ],
                        },
                        confirmThePaymentRules: {
                            invoiceNumber: [
                                {required: true, message: '请输入发票号', trigger: 'blur'}
                            ],
                            invoiceMonth : [
                                {required: true, message: '请输入开票月份', trigger: 'blur'}
                            ]
                        }
                    },
                    code: ''
                },
                table: {//表格对应属性
                    height: '330px',
                    gridInstance: {//table表单创建属性
                        default: {
                            sortable: false,//是否表格排序
                            headerAlign: "center",
                            minWidth: '80'
                        },
                        columns: [
                            {
                                title: '账单编号',
                                key: 'code',
                                width: 200,
                                type: 'under-line',//带下划线 下划线等同 双击事件
                            }, {
                                title: '供应商',
                                key: 'supplierName',
                                width: 200
                            },{
                                title: '组织',
                                key: 'orgName',
                                width: 200
                            }, {
                                title: '是否补打',
                                key: 'beDefeated',
                                render: function (val) {
                                    return Common.dictionary.getName("IS_EXIST", val.beDefeated)
                                }
                            }, {
                                title: '付款状态',
                                key: 'paymentState',
                                width: 100,
                                render: function (val) {
                                    return Common.dictionary.getName('PAY_STATUS', val.paymentState);
                                }
                            }, {
                                title: '发票号',
                                key: 'invoiceNumber',
                                width: 150
                            }, {
                                title: '开票日期',
                                key: 'invoiceMonth',
                                width: 150,
                                render: function (val) {
                                    if(val.invoiceMonth){
                                        return Common.date.dateFormat(val.invoiceMonth, 'YYYY-MM-DD');
                                    }
                                }
                            }, {
                                title: '应付运费',
                                key: 'paidVehicleAmount',
                                width: 100
                            }, {
                                title: '运价调整',
                                key: 'adjustAmount',
                                width: 100
                            }, {
                                title: '质量扣款',
                                key: 'qualityDeductionsAmount',
                                width: 100
                            }, {
                                title: '质量奖励',
                                key: 'qualityAward',
                                width: 100
                            }, {
                                title: '油价补差',
                                key: 'oilPriceSupplement',
                                width: 100
                            }, {
                                title: '其他扣款',
                                key: 'otherDeductionsAmount',
                                width: 100
                            }, {
                                title: '压车费',
                                key: 'detentionCharge',
                                width: 100
                            }, {
                                title: '火灾险服务费',
                                key: 'insuranceFee',
                                width: 100
                            }, {
                                title: '打款手续费',
                                key: 'handTransferFee',
                                width: 100
                            },{
                                title: '运单实付合计',
                                key: 'actualPaidVehicleAmount',
                                width: 150
                            },
                            {
                                title: '预付打卡',
                                key: 'prepaidCardAmount',
                                width: 100
                            }, {
                                title: '货到打卡',
                                key: 'deliveryAmount',
                                width: 100
                            }, {
                                title: 'GPS押金',
                                key: 'gpsDeposit',
                                width: 100
                            }, {
                                title: 'GPS丢失扣款',
                                key: 'gpsRetainage',
                                width: 130
                            }, {
                                title: 'GPS使用费',
                                key: 'gpsCost',
                                width: 100
                            }, {
                                title: '油卡押金',
                                key: 'oilCardDeposit',
                                width: 100
                            }, {
                                title: '油卡丢失扣款',
                                key: 'oilRetainage',
                                width: 130
                            }, {
                                title: '油卡金额',
                                key: 'oilCardAmount',
                                width: 100
                            }, {
                                title: '定点加油',
                                key: 'refuelingAmount',
                                width: 100
                            }, {
                                title: '回单押金',
                                key: 'returnDeposit',
                                width: 100
                            }, {
                                title: '回单丢失扣款',
                                key: 'returnRetainage',
                                width: 150
                            }, {
                                title: '尾款',
                                key: 'returnAmount',
                                width: 100
                            }, {
                                title: '加油站点加油金额',
                                key: 'paidAmount',
                                width: '150'
                            }, {
                                title: '实际应付',
                                key: 'billAmount',
                                width: 100
                            }, {
                                title: '收款银行',
                                key: 'dueBank',
                                width: 200
                            }, {
                                title: '开户行',
                                key: 'openingBank',
                                width: 200
                            }, {
                                title: '收款人',
                                key: 'payee',
                                width: 200
                            }, {
                                title: '收款银行卡号',
                                key: 'dueBankCardNo',
                                width: 200
                            }, {
                                title: '付款人',
                                key: 'paymentUser',
                                width: 100
                            }, {
                                title: '付款时间',
                                key: 'paymentTime',
                                width: 150
                            }, {
                                title: '创建人',
                                key: 'createUser',
                                width: 150
                            }, {
                                title: '创建时间',
                                key: 'createTime',
                                width: 200
                            }
                        ]
                    },
                    detailDisabled: false,
                },
                selections: [],
                permission: permission,
                buttonDisabled: {
                    synchronization: true,
                    confirmThePayment: true,
                    paymentDisabled: true,
                    deleteTheBillDisabled: true
                },
                show: {
                    invoiceNumberShow: true
                }
            }
        },
        watch: { //数据监听
            selections(val) {
                this.buttonDisabled.confirmThePayment = val.length <= 0;
                this.buttonDisabled.synchronization = val.length != 1;
                this.buttonDisabled.paymentDisabled = val.length <= 0;
                /*if (val.length > 1) {
                    let bool = val[0].ticket;
                    val.forEach(va => {
                        if(bool != va.ticket || va.ticket == true){
                            this.buttonDisabled.confirmThePayment = true;
                            throw "数据不一致不允许批量确认付款"
                        }
                    })
                }*/

                if (!this.buttonDisabled.confirmThePayment) {
                    this.show.invoiceNumberShow = val[0].ticket;
                }
            },
            'model.searchParam.checkForAMonthTime'(val) {
                this.model.searchParam.checkForAMonth = Common.date.dateFormat(val, "YYYY-MM")
            }
        },
        mounted() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            //立即执行
            this.searchPayableBillForMainList();
        },
        methods: {
            /*拷贝初始化对象*/
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            //main
            searchPayableBillForMainList() {//main 查询
                const _this = this;
                if (_this.model.searchParam.billTime) {
                    _this.model.searchParam.billStartTime = _this.model.searchParam.billTime[0];
                    _this.model.searchParam.billEndTime = _this.model.searchParam.billTime[1];
                } else {
                    _this.model.searchParam.billStartTime = '';
                    _this.model.searchParam.billEndTime = '';
                }
                if (_this.model.searchParam.paymentTime) {
                    _this.model.searchParam.paymentStartTime = _this.model.searchParam.paymentTime[0];
                    _this.model.searchParam.paymentEndTime = _this.model.searchParam.paymentTime[1];
                } else {
                    _this.model.searchParam.paymentStartTime = '';
                    _this.model.searchParam.paymentEndTime = '';
                }
                _this.$refs.mainTable.gridDataInit(Api.payableBill.page, _this.model.searchParam);
            },
            resetMainSearchParam() {
                this.model.searchParam = this.cloneMode().model.searchParam
            },
            //table
            handlerChange(rows) {//选中时触发
                this.selections = rows
            },
            handleRowHandle(row) {
                const _this = this;
                _this.win.code = row.code;
                Http.get(Api.payableBill.getDetailById, {params: {'code': row.code}}, result => {
                    if (result.result) {
                        _this.win.model.payableBillDetailsWinModel = result.result.payableBillDetails
                        _this.win.model.refuelingRecord = result.result.refuelingRecord;
                        _this.win.winShow.payableBillDetailsWin = true
                    } else {
                        _this.$message.error("请刷新重试");
                    }
                })

            },
            downloadExcel() {
                let _this = this;
                _this.exportLoading = false;
                let model = _.cloneDeep(_this.model.searchParam);
                model.pageSize = 5000;
                model.currentPage = 1;
                Http.get(Api.payableBill.page, {params: model}, result => {
                    //导出GPS
                    let header = ['账单编号', '供应商', '承运方', '是否开票', '组织', '付款状态', '发票号', '应付运费', '运价调整',
                        '质量扣款', '质量奖励', '油价补差', '其他扣款', '压车费','火灾险服务费', '打款手续费',  '实际应付', '预付打卡', '货到打卡', 'GPS押金', 'GPS丢失扣款',
                        'GPS使用费', '油卡押金', '油卡丢失扣款', '油卡金额', '定点加油', '回单押金', '回单丢失扣款',
                        '尾款', '加油站点加油金额', '账单金额', '收款银行', '开户行', '收款人', '收款银行卡号', '付款人', '付款时间', '创建人', '创建时间'];
                    let filterVal = [
                        'code',
                        'supplierName',
                        'shipperName',
                        {
                            type: 'function',
                            render: function (val) {
                                return val.ticket ? "开票" : "不开票";
                            }
                        },
                        'orgName',
                        {
                            type: 'dictionary',
                            code: 'PAY_STATUS',
                            name: 'paymentState'
                        },
                        'invoiceNumber',
                        'paidVehicleAmount',
                        'adjustAmount',
                        'qualityDeductionsAmount',
                        'qualityAward',
                        'oilPriceSupplement',
                        'otherDeductionsAmount',
                        'detentionCharge',
                        'insuranceFee',
                        'handTransferFee',
                        'actualPaidVehicleAmount',
                        'prepaidCardAmount',
                        'deliveryAmount',
                        'gpsDeposit',
                        'gpsRetainage',
                        'gpsCost',
                        'oilCardDeposit',
                        'oilRetainage',
                        'oilCardAmount',
                        'refuelingAmount',
                        'returnDeposit',
                        'returnRetainage',
                        'returnAmount',
                        'paidAmount',
                        'billAmount',
                        'dueBank',
                        'openingBank',
                        'payee',
                        'dueBankCardNo',
                        'paymentUser',
                        'paymentTime',
                        'createUser',
                        'createTime'
                    ];
                    Common.excel.downloadExl(result.result, header, filterVal, "承运商付款");
                    _this.exportLoading = true;
                }, result => {
                    _this.exportLoading = true;
                })
            },
            downloadDetailsExcel() {
                const _this = this;
                _this.exportDetailLoading = false;
                Http.get(Api.payableBill.getDetailById, {params: {'code': _this.win.code}}, result => {
                    //导出GPS
                    let header = ['运单编号', '客户全称', '大区', '小区', '线路', '车辆属性', '供应商',
                        '承运商', '车牌号', '实际发车时间', '实际到达时间', '应付运费', '运价调整', '质量扣款(调减)',
                        '质量奖励(调增)','油价补差(调增)', '其他扣款(调减)', '压车费(调增)',
                        '火灾险服务费','打款手续费','实际应付',
                        '预付打卡','货到打卡','GPS押金','GPS丢失扣款','GPS使用费','油卡卡号','油卡金额',
                        '油卡押金','油卡丢失扣款','定点加油','回单押金','回单丢失扣款','尾款',
                         '始发地', '目的地', '营运类型', '重量',
                        '体积', '车长', '主司机姓名', '主司机电话', '回单号', '应付合同号'];
                    let filterVal = [
                        'waybillCode',
                        'waybill.dispatch.customer.name',
                        'waybill.dispatch.region.name',
                        'waybill.dispatch.belongOrg.name',
                        'waybill.dispatch.dispatchLine.lineName',
                        {
                            type: 'dictionary',
                            'code': 'VEHICLE_OPERATION_MODE',
                            'name': 'waybill.dispatch.dispatchVehicle.vehicleNature'
                        },
                        'waybill.dispatch.dispatchVehicle.supplier.name',
                        'waybill.dispatch.dispatchVehicle.shipper.name',
                        'waybill.dispatch.dispatchVehicle.vehicleLicenseNum',
                        'waybill.actualDepartureTime',
                        'waybill.confirmArrivalTime',
                        'paidVehicleAmount',
                        'adjustAmount',
                        'qualityDeductionsAmount',
                        'qualityAward',
                        'oilPriceSupplement',
                        'otherDeductionsAmount',
                        'detentionCharge',
                        'waybill.dispatch.dispatchPrice.insuranceFee',
                        'waybill.dispatch.dispatchPrice.handTransferFee',
                        'actualPaidVehicleAmount',


                        'waybill.dispatch.dispatchPrice.prepaidCardAmount',
                        'waybill.dispatch.dispatchPrice.deliveryAmount',
                        'waybill.dispatch.dispatchPrice.gpsDeposit',
                        'gpsRetainage',
                        'waybill.dispatch.dispatchPrice.gpsFee',
                        'waybill.dispatch.dispatchPrice.oilCardNumber',
                        'waybill.dispatch.dispatchPrice.oilCardAmount',
                        'waybill.dispatch.dispatchPrice.oilCardDeposit',
                        'oilRetainage',
                        'waybill.dispatch.dispatchPrice.refuelingAmount',
                        'waybill.dispatch.dispatchPrice.returnDeposit',
                        'returnRetainage',
                        'waybill.dispatch.dispatchPrice.returnAmount',

                        'waybill.dispatch.dispatchLine.startStation.name',
                        'waybill.dispatch.dispatchLine.endStation.name',
                        {
                            type: 'dictionary',
                            'code': 'LINE_OPERATION_TYPE',
                            'name': 'waybill.dispatch.dispatchLine.operationType'
                        },
                        'waybill.weight',
                        'waybill.volume',
                        'waybill.dispatch.dispatchVehicle.specification',
                        'waybill.dispatch.dispatchVehicle.driver.name',
                        'waybill.dispatch.dispatchVehicle.driver.mobile',
                        'waybill.receiptCodes',
                        'waybill.dispatch.dispatchPrice.contractCode'
                    ];
                    Common.excel.downloadExl(result.result.payableBillDetails, header, filterVal, "应付确认");
                    _this.exportDetailLoading = true;
                }, result => {
                    _this.exportDetailLoading = true;
                })
            },
            downloadDetailsExcel1(){
                const _this = this;
                _this.exportDetailLoading = false;
                Http.get(Api.payableBill.getDetailById, {params: {'code': _this.win.code}}, result => {
                    //导出GPS
                    let header = ['运单编号', '客户全称', '大区', '小区','线路', '供应商',
                        '承运商', '车牌号', '实际发车时间', '实际到达时间', '应付运费', '运价调整', '质量扣款(调减)',
                        '质量奖励(调增)','油价补差(调增)', '其他扣款(调减)', '压车费(调增)','火灾险服务费','打款手续费',
                        '预付打卡','货到打卡','GPS丢失扣款','GPS使用费','油卡金额',
                        '油卡丢失扣款','定点加油','回单丢失扣款','实际付款'];
                    let filterVal = [
                        'waybillCode',
                        'waybill.dispatch.customer.name',
                        'waybill.dispatch.region.name',
                        'waybill.dispatch.belongOrg.name',
                        'waybill.dispatch.dispatchLine.lineName',
                        'waybill.dispatch.dispatchVehicle.supplier.name',
                        'waybill.dispatch.dispatchVehicle.shipper.name',
                        'waybill.dispatch.dispatchVehicle.vehicleLicenseNum',
                        'waybill.actualDepartureTime',
                        'waybill.confirmArrivalTime',
                        'paidVehicleAmount',
                        'adjustAmount',
                        'qualityDeductionsAmount',
                        'qualityAward',
                        'oilPriceSupplement',
                        'otherDeductionsAmount',
                        'detentionCharge',
                        'waybill.dispatch.dispatchPrice.insuranceFee',
                        'waybill.dispatch.dispatchPrice.handTransferFee',
                        'waybill.dispatch.dispatchPrice.prepaidCardAmount',
                        'waybill.dispatch.dispatchPrice.deliveryAmount',

                        'gpsRetainage',
                        'waybill.dispatch.dispatchPrice.gpsFee',
                        'waybill.dispatch.dispatchPrice.oilCardAmount',
                        'oilRetainage',
                        'waybill.dispatch.dispatchPrice.refuelingAmount',
                        'returnRetainage',
                        'theActualDealWith'
                    ];
                    Common.excel.downloadExl(result.result.payableBillDetails, header, filterVal, "请款明细");
                    _this.exportDetailLoading = true;
                }, result => {
                    _this.exportDetailLoading = true;
                })
            },
            confirmThePaymentWinShow() {
                let _this = this;
                let codes = '';
                let billCodes = [];
                if (_this.selections) {
                    for (let a in _this.selections) {
                        codes += _this.selections[a].code + ",";
                        billCodes.push(_this.selections[a].code);
                    }
                }
                _this.win.model.confirmThePaymentModelForm.codes = codes.substr(0, codes.length - 1);
                _this.win.model.confirmThePaymentModelForm.billCode = billCodes;
                _this.win.winShow.confirmThePaymentShow = true;
            },
            confirmThePaymentSubmit(formName) {
                let _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.payableBill.confirmThePayment, _this.win.model.confirmThePaymentModelForm, response => {
                            _this.win.winShow.confirmThePaymentShow = false;
                            _this.$message.success("确认付款");
                            _this.win.model.confirmThePaymentModelForm.invoiceNumber = '';
                            _this.searchPayableBillForMainList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            synchronizationSubmit() {
                let _this = this;
                if (_this.selections) {
                    _this.$confirm('是否同步收款人信息?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        Http.get(Api.payableBill.synchronization, {params: {id: _this.selections[0].id}}, response => {
                            _this.$message.success("完成同步");
                            _this.searchPayableBillForMainList();
                        })
                    })
                }
            },
            toBeConfirmedSubmit() {
                let _this = this;
                if (_this.selections) {
                    let ids = [];
                    _this.selections.forEach(s => {
                        ids.push(s.id)
                    });
                    _this.$confirm('是否转入待付款?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        Http.post(Api.payableBill.toBeConfirmed, ids, result => {
                            _this.searchPayableBillForMainList();
                        })
                    })
                }
            },
            paymentFailedSubmit() {
                let _this = this;
                if (_this.selections) {
                    let ids = [];
                    _this.selections.forEach(s => {
                        ids.push(s.id)
                    });
                    _this.$confirm('是否转入付款失败?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        Http.post(Api.payableBill.paymentFailed, ids, result => {
                            _this.searchPayableBillForMainList();
                        })
                    })
                }
            },
            deleteTheBillSubmit() {
                let _this = this;
                if (_this.selections) {
                    let ids = [];
                    _this.selections.forEach(s => {
                        ids.push(s.id)
                    });
                    _this.$confirm('是否删除账单?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        Http.post(Api.payableBill.deleteTheBill, ids, response => {
                            _this.$message.success("删除成功");
                            _this.searchPayableBillForMainList();
                        })
                    })
                }
            }
        }
    }
</script>
