<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>应付明细</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="model.searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单编码:">
                            <el-input v-model="model.searchParam.waybillCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="大区:">
                            <org-select v-model="model.searchParam.regionCode" style="display:block"
                                        nature="AREA"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="小区:">
                            <org-select v-model="model.searchParam.belongOrgCode" style="display:block"
                                        nature="PARTITION"/>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input v-model="model.searchParam.vehicleLicenseNum"/>
                        </el-form-item>
                    </el-col>-->
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="model.searchParam.vehicleLicenseNum" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="model.searchParam.supplierId" style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="承运方:">
                            <supplier-select v-model="model.searchParam.shipperCode" style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select v-model="model.searchParam.vehicleNature" style="display:block"
                                               option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="账单状态:">
                            <dictionary-select v-model="model.searchParam.supplierBillStatus" option-name="BILL_STATUS"
                                               style="display:block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="签收时间:">
                            <el-date-picker
                                v-model="model.searchParam.signTime"
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
                    <el-col :span="12">
                        <el-form-item label="发车时间:">
                            <el-date-picker
                                v-model="model.searchParam.actualDepartureTime"
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
                        <el-form-item label="是否结算:">
                            <dictionary-select v-model="model.searchParam.settlementState" option-name="SETTLEMENT_STATE"
                                               style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="text" v-show="!isMoreItemShow" @click="showMore" size="small">展开更多搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="showLess" size="small">收起搜索项<<
                            </el-button>
                            <el-button type="success" icon="el-icon-search" @click="model.searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam" size="small">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" size="mini" type="primary" icon="el-icon-download"
                       v-permission="permission.payableConfirmExportButton" @click="payableConfirmExport">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-download" v-permission="permission.auditButton"
                       v-show="false"
                       @click="auditPayableConfirm" :disabled="disabled.auditPaymentDisabled">审核
            </el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"/>
                <el-table-column header-align="center" label="运单编号" prop="waybillCode" min-width="120px" fixed/>
                <el-table-column align="center" label="序列号" prop="waybill.departureNumber" min-width="120" show-overflow-tooltip></el-table-column>
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
                <el-table-column header-align="center" label="线路" prop="waybill.dispatch.dispatchLine.lineName"
                                 min-width="250px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="应付运费" prop="paidVehicleAmount" min-width="120px"/>
                <el-table-column header-align="center" label="调整金额" prop="adjustAmount" min-width="120px"/>
                <el-table-column header-align="center" label="质量扣款(调减)" prop="qualityDeductionsAmount"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="油价补差(调增)" prop="oilPriceSupplement" min-width="120px"/>
                <el-table-column header-align="center" label="其他扣款(调减)" prop="otherDeductionsAmount" min-width="120px"/>
                <el-table-column header-align="center" label="质量奖励(调增)" prop="qualityAward" min-width="120px"/>
                <el-table-column header-align="center" label="压车费(调增)" prop="detentionCharge" min-width="120px"/>
                <el-table-column header-align="center" label="实际应付" prop="actualPaidVehicleAmount" min-width="120px"/>
                <el-table-column header-align="center" label="预付打卡" prop="prepaidCardAmount" min-width="120px"/>
                <el-table-column header-align="center" label="货到打卡" prop="deliveryAmount" min-width="120px"/>
                <el-table-column header-align="center" label="GPS押金" prop="gpsDeposit" min-width="120px"/>
                <el-table-column header-align="center" label="GPS使用费" prop="gpsCost" min-width="120px"/>
                <el-table-column header-align="center" label="油卡押金" prop="oilCardDeposit" min-width="120px"/>
                <el-table-column header-align="center" label="油卡金额" prop="oilCardAmount" min-width="120px"/>
                <el-table-column header-align="center" label="定点加油" prop="refuelingAmount" min-width="120px"/>
                <el-table-column header-align="center" label="火灾险服务费" prop="insuranceFee" min-width="120px"/>
                <el-table-column header-align="center" label="打款手续费(应付)" prop="handTransferFee" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="回单押金" prop="returnDeposit" min-width="120px"/>
                <el-table-column header-align="center" label="回单付金额(尾款)" prop="returnAmount" min-width="150px"/>
                <el-table-column header-align="center" label="结算状态" prop="settlementState" min-width="120px">
                    <template slot-scope="scope">
                        <datadictionary-name :value="scope.row.settlementState" option-name="SETTLEMENT_STATE"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="结算人" prop="settlementUser"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="结算时间" prop="payableSettlementTime"
                                 min-width="150px"/>
                <el-table-column header-align="center" label="账单生成状态" prop="supplierBillStatus" min-width="120px">
                    <template slot-scope="scope">
                        <datadictionary-name :value="scope.row.supplierBillStatus" option-name="BILL_STATUS"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="供应商账单生成人" prop="supplierBillGenerationUser"
                                 min-width="150px"/>
                <el-table-column header-align="center" label="供应商账单生成时间" prop="supplierBillGenerationTime"
                                 min-width="150px"/>
                <el-table-column header-align="center" label="收款人" prop="payee" min-width="140px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="收款银行" prop="openingBank" min-width="160px"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="收款卡号" prop="dueBankCardNo" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="运单备注" prop="waybill.remark" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="始发地"
                                 prop="waybill.dispatch.dispatchLine.startStation.name" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="目的地" prop="waybill.dispatch.dispatchLine.endStation.name"
                                 min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="营运类型" prop="waybill.dispatch.dispatchLine.operationType"
                                 min-width="120px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_OPERATION_TYPE"
                                                v-if="scope.row.waybill.dispatch.dispatchLine" :value="scope.row.waybill.dispatch.dispatchLine.operationType"/>
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
            <el-row>
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="model.searchParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchResult.totalCount">
                    </el-pagination>
                </div>
            </el-row>
        </el-main>

        <!--审核-->
        <el-dialog :title="dialog.title.audit"
                   :visible.sync="dialog.show.auditDialogShow" width="400px">
            <el-form :model="dialog.model.auditModelForm" ref="auditForm"
                     label-width="100px" size="small" align="center">
                <el-row>
                    <el-col :span="12">
                        <el-switch
                            v-model="dialog.model.auditModelForm.auditStatus"
                            active-text="通过"
                            inactive-text="不通过">
                        </el-switch>
                    </el-col>

                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialog.show.auditDialogShow = false" size="small">取 消</el-button>
                <el-button type="primary" @click="auditPayableConfirmSubmit('auditForm')"
                           size="small">确 定
                </el-button>
            </div>
        </el-dialog>
        <!--生成对账单-->
        <el-dialog :title="dialog.title.generateStatement"
                   :visible.sync="dialog.show.generateStatementShow" width="600px">
            <el-form :model="dialog.model.generateStatementModelForm" ref="generateStatementModelFormRef"
                     :rules="dialog.rules.generateStatementRules"
                     label-width="100px" size="small" align="center">
                <el-row>
                    <el-col :span="12"><!--供应商-->
                        <el-form-item label="供应商:" prop="supplierId">
                            <supplier-select style="display: block; width:100%;"
                                             v-model="dialog.model.generateStatementModelForm.supplierId"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="时间:" prop="checkForAMonth">
                            <div class="block">
                                <el-date-picker style="display: block; width:100%;"
                                                v-model="dialog.model.generateStatementModelForm.checkForAMonth"
                                                type="month"
                                                placeholder="选择月">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <label style="display: block; width:100%;color: red">是否已导入扣款明细</label>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialog.show.generateStatementShow = false" size="small">取 消</el-button>
                <el-button type="primary" @click="generateStatementSubmit('generateStatementModelFormRef')"
                           size="small">确 定
                </el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http, Api, Constant, Common} from 'src/global/index'
    import DatadictionaryName from "../../common/select/DatadictionaryName";
    import axios from 'axios'
    export default {
        components: {DatadictionaryName},
        data() {
            let permission = {
                generateStatementHQButton: '/payableConfirm/generateStatementHQ',
                auditButton: '/payableConfirm/audit',
                payableConfirmExportButton:'/payableConfirmExport/export'
            };
            return {
                exportLoading: true,
                //拷贝 初始化data
                initializeModel: {},
                /*查询展开*/
                isMoreItemShow: false,
                model: {
                    //查询参数
                    searchParam: {
                        currentPage: 1,
                        pageSize: 10,
                        settlementState:'',
                        waybillCode: '',
                        regionCode: '',
                        belongOrgCode: '',
                        supplierId: '',
                        shipperCode: '',
                        vehicleLicenseNum: '',
                        vehicleNature: '',
                        signTime: [],
                        signTimeStart: '',
                        signTimeEnd: '',
                        actualDepartureTime: [Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),Common.date.dateFormat(new Date(new Date().getFullYear(),new Date().getMonth()+1,0),"YYYY-MM-28 23:59:59")],//发车时间
                        departureStartTime: '',
                        departureEndTime: '',
                    },

                },
                permission: permission,
                disabled: {
                    downloadExcelDisabled: false,
                    generateStatementDisabled: true,
                    auditPaymentDisabled: true

                },
                dialog: {
                    show: {
                        auditDialogShow: false,
                        generateStatementShow: false
                    },
                    title: {
                        audit: '审核',
                        generateStatement: '生成对账单'
                    },
                    model: {
                        auditModelForm: {
                            auditStatus: true,
                            ids: []
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
                        }
                    },
                    ref: {},
                },
                table: {//表格对应属性
                    gridInstance: {//table表单创建属性
                        default: {
                            sortable: false,//是否表格排序
                            headerAlign: "center",
                            minWidth: '80'
                        },
                        columns: [
                            {
                                title: '运单编号',
                                key: 'waybillCode',
                                width: 120
                            }, {
                                title: '客户全称',
                                key: 'waybill.dispatch.customer.name',
                                width: 100,
                            }, {
                                title: '大区',
                                key: 'waybill.dispatch.region.name',
                                width: 120
                            }, {
                                title: '小区',
                                key: 'waybill.dispatch.belongOrg.name',
                                width: 120
                            }, {
                                title: '线路',
                                key: 'waybill.dispatch.dispatchLine.lineName',
                                width: 250
                            }, {
                                title: '车辆属性',
                                key: 'waybill.dispatch.dispatchVehicle.vehicleNature',
                                width: 150,
                                render: function (val) {
                                    return Common.dictionary.getName('VEHICLE_OPERATION_MODE', val.waybill.dispatch.dispatchVehicle.vehicleNature);
                                }
                            }, {
                                title: '供应商',
                                key: 'waybill.dispatch.dispatchVehicle.supplier.name',
                                width: 200
                            }, {
                                title: '承运商',
                                key: 'waybill.dispatch.dispatchVehicle.shipper.name',
                                width: 200
                            }, {
                                title: '车牌号',
                                key: 'waybill.dispatch.dispatchVehicle.vehicleLicenseNum',
                                width: 100
                            }, {
                                title: '实际发车时间',
                                key: 'waybill.actualDepartureTime',
                                width: 150
                            }, {
                                title: '实际到达时间',
                                key: 'waybill.actualArrivalTime',
                                width: 150
                            }, {
                                title: '应付运费',
                                key: 'waybill.dispatch.dispatchPrice.paidVehicleAmount',
                                width: 100
                            }, {
                                title: '油卡卡号',
                                key: 'waybill.dispatch.dispatchPrice.oilCardNumber',
                                width: 200
                            }, {
                                title: '油卡金额',
                                key: 'waybill.dispatch.dispatchPrice.oilCardBalance',
                                width: 100
                            }, {
                                title: '预付打卡',
                                key: 'waybill.dispatch.dispatchPrice.prepaidCardAmount',
                                width: 100
                            }, {
                                title: '货到打卡',
                                key: 'waybill.dispatch.dispatchPrice.deliveryAmount',
                                width: 100
                            }, {
                                title: '质量扣款(应付)',
                                key: 'qualityDeductionsAmount',
                                width: 120
                            }, {
                                title: '安全扣款(应付)',
                                key: 'securityDeductionsAmount',
                                width: 120
                            }, {
                                title: '油价补差(应付)',
                                key: 'oilPriceSupplement',
                                width: 120
                            }, {
                                title: '其他扣款(应付)',
                                key: 'otherDeductionsAmount',
                                width: 120
                            }, {
                                title: '实际应付',
                                key: 'actualPaidVehicleAmount',
                                width: 100
                            }, {
                                title: '收款人',
                                key: 'payee',
                                width: 100
                            }, {
                                title: '收款银行',
                                key: 'openingBank',
                                width: 250
                            }, {
                                title: '收款卡号',
                                key: 'dueBankCardNo',
                                width: 200
                            }, {
                                title: '油卡押金',
                                key: 'waybill.dispatch.dispatchPrice.oilCardDeposit',
                                width: 100
                            }, {
                                title: '回单押金',
                                key: 'waybill.dispatch.dispatchPrice.returnDeposit',
                                width: 100
                            }, {
                                title: '回单付金额',
                                key: 'waybill.dispatch.dispatchPrice.returnAmount',
                                width: 100
                            }, {
                                title: '应付结算时间',
                                key: 'payment',
                                width: 100
                            }, {
                                title: '审核状态',
                                key: 'auditStatus ',
                                width: 100,
                                render: function (val) {
                                    return Common.dictionary.getName("AUDIT_STATUS", val.auditStatus);
                                }
                            }, {
                                title: '应付审核人',
                                key: 'auditUser',
                                width: 100,
                            }, {
                                title: '运单备注',
                                key: 'waybill.remark',
                                width: 150
                            }, {
                                title: '始发地',
                                key: 'waybill.dispatch.dispatchLine.startStation.name',
                                width: 150
                            }, {
                                title: '目的地',
                                key: 'waybill.dispatch.dispatchLine.endStation.name',
                                width: 150
                            }, {
                                title: '营运类型',
                                key: 'waybill.dispatch.dispatchLine.operationType',
                                width: 150,
                                render: function (val) {
                                    return Common.dictionary.getName("LINE_OPERATION_TYPE", val.waybill.dispatch.dispatchLine.operationType);
                                }
                            }, {
                                title: '线路里程',
                                key: 'waybill.dispatch.dispatchLine.distance',
                                width: 150
                            }, {
                                title: '重量',
                                key: 'waybill.weight',
                                width: 150
                            }, {
                                title: '体积',
                                key: 'waybill.volume',
                                width: 150
                            }, {
                                title: '车长',
                                key: 'waybill.dispatch.dispatchVehicle.specification',
                                width: 150
                            }, {
                                title: '主司机姓名',
                                key: 'waybill.dispatch.dispatchVehicle.driver.name',
                                width: 150
                            }, {
                                title: '主司机电话',
                                key: 'waybill.dispatch.dispatchVehicle.driver.mobile',
                                width: 150
                            }, {
                                title: '车主姓名',
                                key: 'waybill.dispatch.dispatchVehicle.vehicleOwner.name',
                                width: 150
                            }, {
                                title: '车主电话',
                                key: 'waybill.dispatch.dispatchVehicle.vehicleOwner.mobile',
                                width: 150
                            }, {
                                title: '应付合同号',
                                key: 'waybill.dispatch.dispatchPrice.contractCode',
                                width: 150
                            }
                        ]
                    },
                    detailDisabled: false,
                },
                selections: [],
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
            }
        },
        watch: {
            selections(val) {
                this.disabled.generateStatementDisabled = val.length <= 0;
                this.disabled.auditPaymentDisabled = val.length <= 0;
            }
        },
        mounted() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data)
            //查询表格
            this.searchList();
        },
        methods: {
            /**分页*/
            handleSizeChange(val) {
                let _this = this;
                _this.model.searchParam.pageSize = val;
                _this.searchList();
            },
            handleCurrentChange(val) {
                let _this = this;
                _this.model.searchParam.currentPage = val;
                _this.searchList();
            },
            handleSelectionChange(val) {
                this.selections = val;
            },
            /*拷贝初始化对象*/
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            /*查询信息 收缩*/
            showMore() {
                let _this = this;
                _this.isMoreItemShow = true;
            },
            showLess() {
                let _this = this;
                _this.isMoreItemShow = false;
            },
            /*查询*/
            searchList() {
                const _this = this;
                if(_this.model.searchParam.waybillCode){
                    _this.model.searchParam.signTime = [];
                    _this.model.searchParam.signTimeStart = '';
                    _this.model.searchParam.signTimeEnd = '';
                    _this.model.searchParam.actualDepartureTime = [];
                    _this.model.searchParam.departureStartTime = '';
                    _this.model.searchParam.departureEndTime = '';
                }
                if (_this.model.searchParam.signTime && _this.model.searchParam.signTime.length > 0) {
                    _this.model.searchParam.signTimeStart = _this.model.searchParam.signTime[0];
                    _this.model.searchParam.signTimeEnd = _this.model.searchParam.signTime[1];
                } else {
                    _this.model.searchParam.signTimeStart = '';
                    _this.model.searchParam.signTimeEnd = '';
                }
                if (_this.model.searchParam.actualDepartureTime && _this.model.searchParam.actualDepartureTime.length > 0) {
                    _this.model.searchParam.departureStartTime = _this.model.searchParam.actualDepartureTime[0];
                    _this.model.searchParam.departureEndTime = _this.model.searchParam.actualDepartureTime[1];
                } else {
                    _this.model.searchParam.departureStartTime = '';
                    _this.model.searchParam.departureEndTime = '';
                }
                if(!_this.model.searchParam.waybillCode &&!(_this.model.searchParam.signTime && _this.model.searchParam.signTime.length > 0) && !(_this.model.searchParam.actualDepartureTime && _this.model.searchParam.actualDepartureTime.length > 0)){
                    _this.$message.error("请选择时间");
                    return;
                }
                Http.get(Api.payableConfirm.page, {params: _this.model.searchParam}, response => {
                    _this.searchResult.result = response.result;
                    _this.searchResult.totalCount = response.totalCount;
                    _this.model.searchParam.currentPage = response.currentPage;
                    _this.model.searchParam.pageSize = response.pageSize;
                })
            },
            resetSearchParam() {
                let _this = this;
                _this.model.searchParam = _this.cloneMode().model.searchParam
            },
            //列表
            handlerChange(rows) {//选中时触发
                this.selections = rows
            },
            handleRowHandle(row) {//双击触发
            },
            operationClick(id, row) {//行 操作触发
                const _this = this;
                switch (id) {
                    case "1"://编辑
                        break;
                    case "2"://删除
                        break;
                    default:
                }
            },
            generateStatementHQ() {
                let _this = this;
                _this.dialog.show.generateStatementShow = true;
            },
            auditPayableConfirm() {
                let _this = this;
                let ids = [];
                _this.selections.forEach(s => {
                    if (s.auditStatus === Constant.AUDIT_STATUS.PASS) {
                        _this.$message.info("运单 : " + s.waybillCode + ": 已审核,不能重复审核");
                        throw  "运单 : " + s.waybillCode + ": 已审核,不能重复审核"
                    }
                    ids.push(s.id)
                });
                _this.dialog.model.auditModelForm.ids = ids;
                _this.dialog.show.auditDialogShow = true
            },
            auditPayableConfirmSubmit() {
                let _this = this;
                _this.$confirm('是否确认审核?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.payableConfirm.audit, _this.dialog.model.auditModelForm, result => {
                        _this.searchList();
                        _this.dialog.show.auditDialogShow = false;
                    })
                })
            },
            generateStatementSubmit(formName) {
                let _this = this;
                let model = _this.dialog.model.generateStatementModelForm;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认生成对账单?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            model.checkForAMonth = Common.date.dateFormat(model.checkForAMonth, "YYYY-MM");
                            Http.post(Api.payableConfirm.generateStatementHQ, model, result => {
                                _this.searchList();
                                _this.dialog.show.generateStatementShow = false;
                                _this.$message.success("已生成对账单")
                            })
                        })
                    } else {
                        return false;
                    }
                });
            },
            payableConfirmExport() {
                let _this = this;
                _this.exportLoading = false;
                axios.get(Api.payableConfirmExport.export, {
                    params: _.cloneDeep(_this.model.searchParam),
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = Common.date.dateFormat(new Date(),'YYYY-MM-DD')+ '应付明细.xls';
                    link.click();
                    _this.exportLoading = true;
                }).catch(reason => {
                    _this.exportLoading = true;
                })
            }
        }
    }
</script>
