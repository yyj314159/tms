<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 运单管理</el-breadcrumb-item>
                <el-breadcrumb-item>付款申请</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.licenseNum" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="证件齐全:">
                            <el-select v-model="searchParam.papersCompleteFlag" placeholder="请选择"
                                       style="display:block;">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="账单生成状态:">
                            <dictionary-select option-name="PAID_BILL_STATUS" v-model="searchParam.supplierBillStatus"
                                               style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="承运方:">
                            <supplier-select v-model="searchParam.shipperCode" style="display: block; width:100%;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode"
                                                style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="回单号:">
                            <el-input v-model="searchParam.receiptCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineCode" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="12">
                        <el-form-item label="运单签收时间:">
                            <el-date-picker
                                v-model="searchParam.signTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请付款时间:">
                            <el-date-picker
                                v-model="searchParam.paymentRequestTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small"
                                :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="到达结款周期:">
                            <dictionary-select v-model="searchParam.settleAccountsCycleFlag" style="display: block"
                                               option-name="SETTLE_ACCOUNTS_CYCLE_FLAG"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="text" v-show="!isMoreItemShow" @click="isMoreItemShow = true" size="small">
                                展开更多搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="isMoreItemShow = false" size="small">
                                收起搜索项<<
                            </el-button>
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
            <el-button v-permission="'/payableConfirm/generatedBills'" type="primary" size="mini" icon="el-icon-tickets"
                       :disabled="!multipleSelection.length>0" @click="showAccountList">生成账单
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe
                      @selection-change="handleSelectionChange" ref="multipleTable" :height="tableHeight"
                      :style="{height:'auto'}">
                <el-table-column type="selection" min-width="40"/>
                <el-table-column header-align="center" label="运单号" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="运单状态" prop="waybill.status" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAY_BILL_STATUS"
                                                :value="scope.row.waybill?scope.row.waybill.status:''"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="客户全称" prop="waybill.dispatch.customer.name"
                                 min-width="120" show-overflow-tooltip/>
                <el-table-column header-align="center" label="大区" prop="waybill.dispatch.region.name" min-width="180"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="小区" prop="waybill.dispatch.belongOrg.name" min-width="180"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="线路" prop="waybill.dispatch.dispatchLine.lineName"
                                 min-width="240" show-overflow-tooltip/>
                <el-table-column header-align="center" label="车辆属性" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" v-if="scope.row.waybill"
                                                :value="scope.row.waybill.dispatch.dispatchVehicle.vehicleNature"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="供应商" prop="waybill.dispatch.dispatchVehicle.supplier.name"
                                 min-width="200" show-overflow-tooltip/>
                <el-table-column header-align="center" label="承运商" prop="waybill.dispatch.dispatchVehicle.shipper.name"
                                 min-width="200" show-overflow-tooltip/>
                <el-table-column header-align="center" label="车牌号"
                                 prop="waybill.dispatch.dispatchVehicle.vehicleLicenseNum" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="实际发车时间" prop="waybill.actualDepartureTime" min-width="220"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="实际到达时间" prop="waybill.confirmArrivalTime" min-width="220"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="签收时间" prop="waybill.signTime" min-width="220"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="应付运费" prop="paidVehicleAmount" min-width="120"/>
                <el-table-column header-align="center" label="调整金额" prop="adjustAmount" min-width="120"/>
                <el-table-column header-align="center" label="质量扣款(调减)" prop="qualityDeductionsAmount" min-width="120"/>
                <el-table-column header-align="center" label="油价补差(调增)" prop="oilPriceSupplement" min-width="120"/>
                <el-table-column header-align="center" label="其他扣款(调减)" prop="otherDeductionsAmount" min-width="120"/>
                <el-table-column header-align="center" label="质量奖励(调增)" prop="qualityAward" min-width="120"/>
                <el-table-column header-align="center" label="压车费(调增)" prop="detentionCharge" min-width="120"/>
                <el-table-column header-align="center" label="火灾险服务费" prop="insuranceFee" min-width="120"/>
                <el-table-column header-align="center" label="打款手续费" prop="handTransferFee" min-width="120"/>
                <el-table-column header-align="center" label="实际应付" prop="actualPaidVehicleAmount" min-width="120"/>
                <el-table-column header-align="center" label="GPS使用费" prop="gpsCost" min-width="120"/>
                <el-table-column header-align="center" label="回单押金" prop="returnDeposit" min-width="120"/>
                <el-table-column header-align="center" label="回单付金额(尾款)" prop="returnAmount" min-width="120"/>
                <el-table-column header-align="center" label="账单生成状态" prop="supplierBillStatus" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.supplierBillStatus" option-name="PAID_BILL_STATUS"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="供应商账单生成人" prop="supplierBillGenerationUser"
                                 min-width="120" show-overflow-tooltip/>
                <el-table-column header-align="center" label="供应商账单生成时间" prop="supplierBillGenerationTime"
                                 min-width="220" show-overflow-tooltip/>
                <el-table-column header-align="center" label="收款人" prop="payee" min-width="120" show-overflow-tooltip/>
                <el-table-column header-align="center" label="收款银行" prop="openingBank" min-width="160"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="收款卡号" prop="dueBankCardNo" min-width="200"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="始发地"
                                 prop="waybill.dispatch.dispatchLine.startStation.name" min-width="200"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="目的地" prop="waybill.dispatch.dispatchLine.endStation.name"
                                 min-width="200" show-overflow-tooltip/>
                <el-table-column header-align="center" label="营运类型" prop="waybill.dispatch.dispatchLine.operationType"
                                 min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_OPERATION_TYPE" v-if="scope.row.waybill"
                                                :value="scope.row.waybill.dispatch.dispatchLine.operationType"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车长" prop="waybill.dispatch.dispatchVehicle.specification"
                                 min-width="120" show-overflow-tooltip/>
                <el-table-column header-align="center" label="主司机姓名" prop="waybill.dispatch.dispatchVehicle.driver.name"
                                 min-width="120" show-overflow-tooltip/>
                <el-table-column header-align="center" label="主司机电话"
                                 prop="waybill.dispatch.dispatchVehicle.driver.mobile" min-width="120" show-overflow-tooltip/>
                <el-table-column header-align="center" label="应付合同号" prop="waybill.dispatch.dispatchPrice.contractCode"
                                 min-width="160" show-overflow-tooltip/>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 50, 100, 300]"
                    :page-size="searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>

        <!-- 申请付款 -->
        <el-dialog title="申请付款" :visible.sync="showApplyDialog" width="90%">
            <el-form :model="applyInfoForm" size="mini" style="padding-left: 35px;" label-width="120">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <span style="color: blue;">{{applyInfoForm.waybill.code}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            {{applyInfoForm.waybill.dispatch.dispatchLine.lineName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="实际应收:">
                            {{applyInfoForm.waybill.receiveConfirm.actualReceiveAmount}} 元
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应付车价:">
                            {{applyInfoForm.waybill.dispatch.dispatchPrice.paidVehicleAmount}} 元
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="实际应付:">
                            {{applyInfoForm.waybill.dispatch.dispatchPrice.actualPaidVehicleAmount}} 元
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预付打卡:">
                            {{applyInfoForm.waybill.dispatch.dispatchPrice.prepaidCardAmount}}元
                            <b v-show="applyInfoForm.waybill.dispatch.dispatchPrice.prepaidCardAmount>0">
                                <span v-if="applyInfoForm.waybill.outInvitePrepaymentStatus===Constant.PAY_STATUS.PAID"
                                      style="color:green;">(已付)</span>
                                <span style="color:red;" v-else>(未付)</span>
                            </b>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="油卡金额:">
                            {{applyInfoForm.waybill.dispatch.dispatchPrice.oilCardAmount}}元
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="定点加油:">
                            {{applyInfoForm.waybill.dispatch.dispatchPrice.actualRefuelingVolume}}升
                            (计{{applyInfoForm.waybill.dispatch.dispatchPrice.refuelingAmount}}元)
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="GPS费用:">
                            {{applyInfoForm.waybill.dispatch.dispatchPrice.gpsFee}}元
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货到打卡:">
                            {{applyInfoForm.waybill.dispatch.dispatchPrice.deliveryAmount}}元
                            <b v-show="applyInfoForm.waybill.dispatch.dispatchPrice.deliveryAmount>0">
                                <span v-if="applyInfoForm.waybill.outInviteCodStatus===Constant.PAY_STATUS.PAID"
                                      style="color:green;">(已付)</span>
                                <span style="color:red;" v-else>(未付)</span>
                            </b>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="回单押金:">
                            {{applyInfoForm.waybill.dispatch.dispatchPrice.returnDeposit}}元
                            <b v-show="applyInfoForm.waybill.dispatch.dispatchPrice.returnDeposit > 0">
                                <span
                                    v-if="applyInfoForm.waybill.supplierPayableBill && applyInfoForm.waybill.supplierPayableBill.returnDeposit===Constant.PAYMENT_TYPE.PAYMENT"
                                    style="color:green;">(已退)</span>
                                <span style="color:red;" v-else>(未退)</span>
                            </b>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="回单付款:">
                            {{applyInfoForm.waybill.dispatch.dispatchPrice.returnAmount}}元
                            <b v-show="applyInfoForm.waybill.dispatch.dispatchPrice.returnAmount">
                                <span v-if="isReturnAmountPaid" style="color:green;">(已付)</span>
                                <span style="color:red;" v-else>(未付)</span>
                            </b>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="火灾险服务费:">
                            {{applyInfoForm.waybill.dispatch.dispatchPrice.insuranceFee}}元
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="打款手续费:">
                            {{applyInfoForm.waybill.dispatch.dispatchPrice.handTransferFee}}元
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机:">
                            {{applyInfoForm.waybill.dispatch.dispatchVehicle.driver.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车型:">
                            {{applyInfoForm.waybill.dispatch.dispatchVehicle.specification}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="收款人:">
                            {{applyInfoForm.waybill.payee}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="收款银行:">
                            {{applyInfoForm.waybill.openingBank}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="收款卡号:">
                            {{applyInfoForm.waybill.dueBankCardNo}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20" v-if="!applyInfoForm.delayedPayment">
                        <el-form-item label="申请原因：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！"
                                      v-model="applyInfoForm.applyRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" style="font-weight: bold; font-size:16px; color:red; text-align: center;">申请付款金额：
                        {{applyAmount}} 元 {{`( ${applyAmountStr} )`}}
                    </el-col>
                </el-row>
                <el-table class="content-table"
                          v-show="applyInfoForm.waybillPayableDeducts.waybillPayableDeductDetails.length>0"
                          :data="applyInfoForm.waybillPayableDeducts.waybillPayableDeductDetails"
                          element-loading-text="拼命加载中" size="mini" border fit highlight-current-row stripe
                          style="width:95%;">
                    <el-table-column header-align="center" align="center" label="调整项" min-width="120">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="WAYBILL_ADJUSTMENT_TYPE"
                                                    :value="scope.row.type"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="center" label="金额" prop="chargeSum"
                                     min-width="120"></el-table-column>
                    <el-table-column header-align="center" align="center" label="原因" prop="remark"
                                     min-width="200" show-overflow-tooltip></el-table-column>
                </el-table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showApplyDialog = false">取 消</el-button>
                <el-button :disabled="isSubmitBtnDisabled" size="small" type="primary"
                           @click="applyInfoSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 审核 -->
        <el-dialog title="审核" :visible.sync="showAuditDialog" width="90%" size="mini" @close="resetAuditForm" top="2vh">
            <el-form :model="auditForm" size="mini" style="padding-left: 35px;" label-width="120">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <span style="color: blue;">{{auditForm.waybill.code}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            {{applyInfoForm.waybill.dispatch.dispatchLine.lineName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="实际应收:">
                            {{auditForm.waybill.receiveConfirm.actualReceiveAmount}} 元
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应付车价:">
                            {{auditForm.waybill.dispatch.dispatchPrice.paidVehicleAmount}} 元
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="实际应付:">
                            {{auditForm.waybill.dispatch.dispatchPrice.actualPaidVehicleAmount}} 元
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预付打卡:">
                            {{auditForm.waybill.dispatch.dispatchPrice.prepaidCardAmount}}元
                            <b v-show="auditForm.waybill.dispatch.dispatchPrice.prepaidCardAmount>0">
                                <span v-if="auditForm.waybill.outInvitePrepaymentStatus===Constant.PAY_STATUS.PAID"
                                      style="color:green;">(已付)</span>
                                <span style="color:red;" v-else>(未付)</span>
                            </b>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="油卡金额:">
                            {{auditForm.waybill.dispatch.dispatchPrice.oilCardAmount}}元
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="定点加油:">
                            {{auditForm.waybill.dispatch.dispatchPrice.actualRefuelingVolume}}升
                            (计{{auditForm.waybill.dispatch.dispatchPrice.refuelingAmount}}元)
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="GPS费用:">
                            {{auditForm.waybill.dispatch.dispatchPrice.gpsFee}}元
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货到打卡:">
                            {{auditForm.waybill.dispatch.dispatchPrice.deliveryAmount}}元
                            <b v-show="auditForm.waybill.dispatch.dispatchPrice.deliveryAmount>0">
                                <span v-if="auditForm.waybill.outInviteCodStatus===Constant.PAY_STATUS.PAID"
                                      style="color:green;">(已付)</span>
                                <span style="color:red;" v-else>(未付)</span>
                            </b>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="回单押金:">
                            {{auditForm.waybill.dispatch.dispatchPrice.returnDeposit}}元
                            <b v-show="auditForm.waybill.dispatch.dispatchPrice.returnDeposit > 0">
                                <span
                                    v-if="auditForm.waybill.supplierPayableBill && auditForm.waybill.supplierPayableBill.returnDeposit===Constant.PAYMENT_TYPE.PAYMENT"
                                    style="color:green;">(已退)</span>
                                <span style="color:red;" v-else>(未退)</span>
                            </b>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="回单付款:">
                            {{auditForm.waybill.dispatch.dispatchPrice.returnAmount}}元
                            <b v-show="auditForm.waybill.dispatch.dispatchPrice.returnAmount">
                                <span v-if="isReturnAmountPaidAudit" style="color:green;">(已付)</span>
                                <span style="color:red;" v-else>(未付)</span>
                            </b>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>

                    <el-col :span="6">
                        <el-form-item label="火灾险服务费:">
                            {{auditForm.waybill.dispatch.dispatchPrice.insuranceFee}}元
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="打款手续费:">
                            {{auditForm.waybill.dispatch.dispatchPrice.handTransferFee}}元
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机:">
                            {{auditForm.waybill.dispatch.dispatchVehicle.driver.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车型:">
                            {{applyInfoForm.waybill.dispatch.dispatchVehicle.specification}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="收款人:">
                            {{auditForm.waybill.payee}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="收款银行:">
                            {{auditForm.waybill.openingBank}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="收款卡号:">
                            {{auditForm.waybill.dueBankCardNo}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="申请原因：">
                        {{ auditForm.applyRemark }}
                    </el-form-item>
                </el-row>
                <el-table class="content-table"
                          v-show="auditForm.waybillPayableDeducts.waybillPayableDeductDetails.length>0"
                          :data="auditForm.waybillPayableDeducts.waybillPayableDeductDetails"
                          element-loading-text="拼命加载中" size="mini" border fit highlight-current-row stripe
                          style="width:90%;">
                    <el-table-column header-align="center" align="center" label="调整项" min-width="120">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="WAYBILL_ADJUSTMENT_TYPE"
                                                    :value="scope.row.type"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="center" label="金额" prop="chargeSum"
                                     min-width="120"></el-table-column>
                    <el-table-column header-align="center" align="center" label="原因" prop="remark"
                                     min-width="200" show-overflow-tooltip></el-table-column>
                </el-table>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="审核：">
                            <el-switch v-model="auditForm.applyForStatus" active-color="#13ce66"
                                       inactive-color="#ff4949" :active-value="Constant.AUDIT_STATUS.PASS"
                                       :inactive-value="Constant.AUDIT_STATUS.NO_PASS" active-text="同意"
                                       inactive-text="拒绝"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18" style="font-weight: bold; font-size:16px; color:red; text-align: center;">申请付款金额：
                        {{applyAmountAudit}} 元 {{`( ${applyAmountAuditStr} )`}}
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！"
                                      v-model="auditForm.remark" style="width:90%;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAuditDialog = false">取 消</el-button>
                <el-button :disabled="isSubmitBtnDisabled" size="small" type="primary"
                           @click="auditFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 对账单窗口 -->
        <el-dialog title="生成对账单" :visible.sync="showAccountDialog" width="80%" @close="resetInnerSearchResult"
                   :top="marginTop">
            <el-tabs v-model="accountActiveName">
                <el-tab-pane label="运费明细" name="first">
                    <el-table class="content-table" :data="innerSearchResult.confirmList" element-loading-text="拼命加载中"
                              size="mini" border fit highlight-current-row stripe height="320">
                        <el-table-column header-align="center" label="运单号" min-width="130" fixed="left" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="运单状态" prop="waybill.status" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="WAY_BILL_STATUS"
                                                        :value="scope.row.waybill?scope.row.waybill.status:''"></dictionary-select-name>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="客户全称" prop="waybill.dispatch.customer.name"
                                         min-width="120" show-overflow-tooltip/>
                        <el-table-column header-align="center" label="大区" prop="waybill.dispatch.region.name"
                                         min-width="180" show-overflow-tooltip/>
                        <el-table-column header-align="center" label="小区" prop="waybill.dispatch.belongOrg.name"
                                         min-width="180" show-overflow-tooltip/>
                        <el-table-column header-align="center" label="线路" prop="waybill.dispatch.dispatchLine.lineName"
                                         min-width="240" show-overflow-tooltip/>
                        <el-table-column header-align="center" label="车辆属性" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" v-if="scope.row.waybill"
                                                        :value="scope.row.waybill.dispatch.dispatchVehicle.vehicleNature"/>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="供应商"
                                         prop="waybill.dispatch.dispatchVehicle.supplier.name" min-width="200"
                                         show-overflow-tooltip/>
                        <el-table-column header-align="center" label="承运商"
                                         prop="waybill.dispatch.dispatchVehicle.shipper.name" min-width="200"
                                         show-overflow-tooltip/>
                        <el-table-column header-align="center" label="车牌号"
                                         prop="waybill.dispatch.dispatchVehicle.vehicleLicenseNum" min-width="120"
                                         show-overflow-tooltip/>
                        <el-table-column header-align="center" label="实际发车时间" prop="waybill.actualDepartureTime"
                                         min-width="220" show-overflow-tooltip/>
                        <el-table-column header-align="center" label="实际到达时间" prop="waybill.confirmArrivalTime"
                                         min-width="220" show-overflow-tooltip/>
                        <el-table-column header-align="center" label="签收时间" prop="waybill.signTime" min-width="220"
                                         show-overflow-tooltip/>
                        <el-table-column header-align="center" label="应付运费" prop="paidVehicleAmount" min-width="120"/>
                        <el-table-column header-align="center" label="调整金额" prop="adjustAmount" min-width="120"/>
                        <el-table-column header-align="center" label="质量扣款(调减)" prop="qualityDeductionsAmount"
                                         min-width="120"/>
                        <el-table-column header-align="center" label="油价补差(调增)" prop="oilPriceSupplement"
                                         min-width="120"/>
                        <el-table-column header-align="center" label="其他扣款(调减)" prop="otherDeductionsAmount"
                                         min-width="120"/>
                        <el-table-column header-align="center" label="安全扣款" prop="securityDeductionsAmount"
                                         min-width="120" show-overflow-tooltip/>
                        <el-table-column header-align="center" label="质量奖励" prop="qualityAward" min-width="120"
                                         show-overflow-tooltip/>
                        <el-table-column header-align="center" label="压车费" prop="detentionCharge" min-width="120"
                                         show-overflow-tooltip/>
                        <el-table-column header-align="center" label="火灾险服务费" prop="insuranceFee" min-width="120"
                                         show-overflow-tooltip/>
                        <el-table-column header-align="center" label="打款手续费" prop="handTransferFee" min-width="120"
                                         show-overflow-tooltip/>
                        <el-table-column header-align="center" label="实际应付" prop="actualPaidVehicleAmount"
                                         min-width="120"/>

                        <!--<el-table-column header-align="center" label="预付打卡" prop="prepaidCardAmount" min-width="120px"/>-->
                        <!--<el-table-column header-align="center" label="货到打卡" prop="deliveryAmount" min-width="120px"/>-->
                        <el-table-column header-align="center" label="GPS押金" prop="gpsDeposit" min-width="120px"/>
                        <el-table-column header-align="center" label="GPS使用费" prop="gpsCost" min-width="120px"/>
                        <!--<el-table-column header-align="center" label="油卡押金" prop="oilCardDeposit" min-width="120px"/>-->
                        <!--<el-table-column header-align="center" label="油卡金额" prop="oilCardAmount" min-width="120px"/>-->
                        <!--<el-table-column header-align="center" label="定点加油" prop="refuelingAmount" min-width="120px"/>-->

                        <el-table-column header-align="center" label="回单押金" prop="returnDeposit" min-width="120"/>
                        <el-table-column header-align="center" label="回单付金额(尾款)" prop="returnAmount" min-width="150"/>
                        <el-table-column header-align="center" label="账单生成状态" prop="supplierBillStatus" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <dictionary-select-name :value="scope.row.supplierBillStatus"
                                                        option-name="PAID_BILL_STATUS"/>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="供应商账单生成人" prop="supplierBillGenerationUser"
                                         min-width="130" show-overflow-tooltip/>
                        <el-table-column header-align="center" label="供应商账单生成时间" prop="supplierBillGenerationTime"
                                         min-width="220" show-overflow-tooltip/>
                        <!--<el-table-column header-align="center" label="收款人" prop="supplierPayee" min-width="120"/>-->
                        <!--<el-table-column header-align="center" label="开户行" prop="supplierOpeningBank" min-width="160" show-overflow-tooltip/>-->
                        <!--<el-table-column header-align="center" label="收款银行" prop="supplierDueBank" min-width="160" show-overflow-tooltip/>-->
                        <!--<el-table-column header-align="center" label="收款卡号" prop="supplierDueBankCardNo" min-width="200" show-overflow-tooltip/>-->
                        <el-table-column header-align="center" label="始发地"
                                         prop="waybill.dispatch.dispatchLine.startStation.name" min-width="200"
                                         show-overflow-tooltip/>
                        <el-table-column header-align="center" label="目的地"
                                         prop="waybill.dispatch.dispatchLine.endStation.name" min-width="200"
                                         show-overflow-tooltip/>
                        <el-table-column header-align="center" label="营运类型"
                                         prop="waybill.dispatch.dispatchLine.operationType" min-width="120" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="LINE_OPERATION_TYPE" v-if="scope.row.waybill"
                                                        :value="scope.row.waybill.dispatch.dispatchLine.operationType"/>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="车长"
                                         prop="waybill.dispatch.dispatchVehicle.specification" min-width="120" show-overflow-tooltip/>
                        <el-table-column header-align="center" label="主司机姓名"
                                         prop="waybill.dispatch.dispatchVehicle.driver.name" min-width="120" show-overflow-tooltip/>
                        <el-table-column header-align="center" label="主司机电话"
                                         prop="waybill.dispatch.dispatchVehicle.driver.mobile" min-width="120" show-overflow-tooltip/>
                        <el-table-column header-align="center" label="应付合同号"
                                         prop="waybill.dispatch.dispatchPrice.contractCode" min-width="160"
                                         show-overflow-tooltip/>
                    </el-table>
                    <p style="font-size:13px; font-weight: bold; line-height: 30px;">
                        <span style=" margin-right:20px;">应付车价：{{innerSearchResult.paidVehicleAmountSum}}元</span>
                        <span style="color:red; margin-right:20px;">调整金额：{{innerSearchResult.adjustAmountSum}}元</span>
                        <span style="color:red; margin-right:20px;">质量扣款：{{innerSearchResult.qualityDeductionsAmountSum}}元</span>
                        <span
                            style="color:red; margin-right:20px;">油价补差：{{innerSearchResult.oilPriceSupplementSum}}元</span>
                        <span
                            style="color:red; margin-right:20px;">其他扣款：{{innerSearchResult.otherDeductionsAmountSum}}元</span>
                        <span style="color:red; margin-right:20px;">压车费：{{innerSearchResult.detentionCharge}}元</span>
                        <span style="color:red; margin-right:20px;">质量奖励：{{innerSearchResult.qualityAwardSum}}元</span>
                        <span style="color:red; margin-right:20px;">火灾险服务费：{{innerSearchResult.insuranceFeeSum}}元</span>
                        <span style="color:red; margin-right:20px;">打款手续费：{{innerSearchResult.handTransferSum}}元</span>
                        <span style="margin-right:20px;">实付车价：{{innerSearchResult.actualPaidVehicleAmountSum}}元</span>

                        <!--<span style="margin-right:20px;">预付打卡：{{innerSearchResult.prepaidCardAmountSum}}元</span>-->
                        <!--<span style="margin-right:20px;">货到打卡：{{innerSearchResult.deliveryAmountSum}}元</span><br />-->
                        <span style="margin-right:20px;">GPS押金：{{innerSearchResult.gpsDepositSum}}元</span>
                        <span style="margin-right:20px;">GPS费用：{{innerSearchResult.gpsCostSum}}元</span>
                        <span style="margin-right:20px;">GPS丢失扣款：{{innerSearchResult.gpsRetainageSum}}元</span>
                        <!--<span style="margin-right:20px;">油卡押金：{{innerSearchResult.oilCardDepositSum}}元</span>-->
                        <!--<span style="margin-right:20px;">油卡金额：{{innerSearchResult.oilCardAmountSum}}元</span>-->
                        <span style="margin-right:20px;">油卡丢失扣款：{{innerSearchResult.oilRetainageSum}}元</span>
                        <!--<span style="margin-right:20px;">定点加油：{{innerSearchResult.refuelingAmountSum}}元</span>-->

                        <span style="margin-right:20px;">回单押金：{{innerSearchResult.returnDepositSum}}元</span>
                        <span style="margin-right:20px;">回单丢失扣款：{{innerSearchResult.returnRetainageSum}}元</span>
                        <span style="margin-right:20px; color:blue;">运费合计：{{innerSearchResult.returnAmountSum}}元</span>
                    </p>
                </el-tab-pane>
            </el-tabs>
            <p style="font-size:18px; font-weight: bold; height: 30px; line-height: 30px;text-align: center">
                <span style="margin-right:20px; color:blue;">账单金额 = 运费合计<span
                    style="margin-left: 50px; color:red;">{{(innerSearchResult.returnAmountSum - (paidAmountSum || 0)).toFixed(2)}}元</span></span>
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAccountDialog = false">取 消</el-button>
                <el-button :disabled="isSubmitBtnDisabled" size="small" type="primary"
                           @click="creatBill">确 定</el-button>
            </span>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import {Constant} from 'src/global/constant'

    export default {
        data() {
            return {
                initializeModel: {},
                options: [{
                    value: true,
                    label: '是'
                }, {
                    value: false,
                    label: '否'
                }],
                settleAccountsCycleFlag: [
                    {
                        value: '',
                        label: ''
                    }, {
                        value: false,
                        label: '到达'
                    }, {
                        value: true,
                        label: '未到达'
                    }],
                isLoading: true,
                isMoreItemShow: false,
                showLineInfo: false,//线路信息详情
                showApplyDialog: false,//申请窗口
                showAuditDialog: false,//审核窗口
                showAccountDialog: false,//对账单窗口
                accountActiveName: 'first',
                Constant: Constant,//常量
                Common: Common,
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',
                    licenseNum: '',
                    shipperCode: '',
                    orgCode: '',
                    receiptCode: '',
                    applyForStatus: '',
                    supplierBillStatus: '',//账单生成状态
                    settleAccountsCycleFlag: '',
                    motorcade: true,//是否车队
                    ticket: true,//是否开票
                    signTime: [],
                    signTimeStart: '',
                    signTimeEnd: '',
                    paymentRequestTime: [],//申请付款时间
                    paymentRequestTimeStart: '',
                    paymentRequestTimeEnd: '',
                    lineCode: '',//线路名称
                    payee: '',
                    papersCompleteFlag: '',//证件是否齐全
                    delayedPaymentFlag: ''
                },
                checkBoxShow: true,//车队
                showCreatBill: true,//开票
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],//要操作的行
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                applyInfoForm: {
                    id: '',
                    applyRemark: '',
                    delayedPayment: true,
                    waybillPayableDeducts: {
                        waybillPayableDeductDetails: []
                    },
                    waybill: {
                        receiveConfirm: {},
                        dispatch: {
                            dispatchLine: {},
                            dispatchPrice: {},
                            dispatchVehicle: {
                                driver: {
                                    name: ''
                                },
                                specification: ''
                            }
                        },
                        supplierPayableBill: {}
                    }
                },
                auditForm: {
                    id: '',
                    waybillPayableDeducts: {
                        waybillPayableDeductDetails: []
                    },
                    waybill: {
                        receiveConfirm: {},
                        dispatch: {
                            dispatchPrice: {},
                            dispatchVehicle: {
                                driver: {
                                    name: ''
                                }
                            }
                        },
                        payee: '',
                        openingBank: '',
                        dueBankCardNo: '',
                        supplierPayableBill: {}
                    },
                    applyForStatus: Constant.AUDIT_STATUS.PASS,
                    remark: ''
                },
                innerSearchResult: {
                    confirmList: [],
                    paidVehicleAmountSum: '',
                    adjustAmountSum: '',
                    qualityDeductionsAmountSum: '',
                    oilPriceSupplementSum: '',
                    otherDeductionsAmountSum: '',
                    qualityAwardSum: '',
                    insuranceFeeSum: '',
                    handTransferSum: '',
                    detentionCharge: '',
                    securityDeductionsAmountSum: '',
                    actualPaidVehicleAmountSum: '',
                    gpsCostSum: '',
                    oilRetainageSum: '',
                    returnDepositSum: '',
                    returnRetainageSum: '',
                    returnAmountSum: '',
                    prepaidCardAmountSum: '',//预付打卡
                    deliveryAmountSum: '',//货到打卡
                    gpsDepositSum: '',
                    oilCardDepositSum: '',
                    gpsRetainageSum: '',
                    oilCardAmountSum: '',
                    refuelingAmountSum: ''
                },
                isSubmitBtnDisabled: false,
                oilSearchParam: {
                    refuelingTime: [],
                    refuelingStartTime: '',
                    refuelingEndTime: '',
                    supplierId: ''
                },
                oilSearchResult: {
                    refuelingRecord: []
                },
                oilMultipleSelection: [],//选择的加油记录行
                tableHeight: window.innerHeight > 800 ? 430 : null
            }
        },
        created() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data)
            this.searchList();
        },
        watch: {
            showAccountDialog() {
                this.isSubmitBtnDisabled = false;
            },
            showAuditDialog() {
                this.isSubmitBtnDisabled = false;
            },
            showApplyDialog() {
                this.isSubmitBtnDisabled = false;
            }
        },
        computed: {
            cloneModel() {
                return _.cloneDeep(this.initializeModel)
            },

            marginTop: function () { //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "15vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "8vh";
                }
            },
            isReturnAmountPaid: function () {//回单付款是否已付
                return this.applyInfoForm.waybill.supplierPayableBill && this.applyInfoForm.waybill.supplierPayableBill.remainAmountRefunds
            },
            isReturnAmountPaidAudit: function () {//回单付款是否已付
                return this.auditForm.waybill.supplierPayableBill && this.auditForm.waybill.supplierPayableBill.remainAmountRefunds
            },
            applyAmount: function () {
                return Common.util.numberFormat(this.applyInfoForm.waybill.dispatch.dispatchPrice.returnAmount, 2) +
                    (this.applyInfoForm.returnDeposit === 'NOT_PAYMENT' ? Common.util.numberFormat(this.applyInfoForm.waybill.dispatch.dispatchPrice.returnDeposit, 2) : 0) +
                    (this.applyInfoForm.oilCardDeposit === 'NOT_PAYMENT' ? Common.util.numberFormat(this.applyInfoForm.waybill.dispatch.dispatchPrice.oilCardDeposit, 2) : 0) +
                    (this.applyInfoForm.gpsDeposit === 'NOT_PAYMENT' ? Common.util.numberFormat(this.applyInfoForm.waybill.dispatch.dispatchPrice.gpsDeposit, 2) : 0)
            },
            applyAmountStr: function () {
                let str1 = `尾款${Common.util.numberFormat(this.applyInfoForm.waybill.dispatch.dispatchPrice.returnAmount, 2)}元`;
                let str2 = this.applyInfoForm.returnDeposit === 'NOT_PAYMENT' && this.applyInfoForm.waybill.dispatch.dispatchPrice.returnDeposit ? ` + 回单押金${Common.util.numberFormat(this.applyInfoForm.waybill.dispatch.dispatchPrice.returnDeposit, 2)}元` : '';
                let str3 = this.applyInfoForm.oilCardDeposit === 'NOT_PAYMENT' && this.applyInfoForm.waybill.dispatch.dispatchPrice.oilCardDeposit ? ` + 油卡押金${Common.util.numberFormat(this.applyInfoForm.waybill.dispatch.dispatchPrice.oilCardDeposit, 2)}元` : '';
                let str4 = this.applyInfoForm.gpsDeposit === 'NOT_PAYMENT' && this.applyInfoForm.waybill.dispatch.dispatchPrice.gpsDeposit ? ` + GPS押金${Common.util.numberFormat(this.applyInfoForm.waybill.dispatch.dispatchPrice.gpsDeposit, 2)}元` : '';
                return str1 + str2 + str3 + str4
            },
            applyAmountAudit: function () {
                return Common.util.numberFormat(this.auditForm.waybill.dispatch.dispatchPrice.returnAmount, 2) +
                    (this.auditForm.returnDeposit === 'NOT_PAYMENT' ? Common.util.numberFormat(this.auditForm.waybill.dispatch.dispatchPrice.returnDeposit, 2) : 0) +
                    (this.auditForm.oilCardDeposit === 'NOT_PAYMENT' ? Common.util.numberFormat(this.auditForm.waybill.dispatch.dispatchPrice.oilCardDeposit, 2) : 0) +
                    (this.auditForm.gpsDeposit === 'NOT_PAYMENT' ? Common.util.numberFormat(this.auditForm.waybill.dispatch.dispatchPrice.gpsDeposit, 2) : 0)
            },
            applyAmountAuditStr: function () {
                let str1 = `尾款${Common.util.numberFormat(this.auditForm.waybill.dispatch.dispatchPrice.returnAmount, 2)}元`;
                let str2 = this.auditForm.returnDeposit === 'NOT_PAYMENT' && this.auditForm.waybill.dispatch.dispatchPrice.returnDeposit ? ` + 回单押金${Common.util.numberFormat(this.auditForm.waybill.dispatch.dispatchPrice.returnDeposit, 2)}元` : '';
                let str3 = this.auditForm.oilCardDeposit === 'NOT_PAYMENT' && this.auditForm.waybill.dispatch.dispatchPrice.oilCardDeposit ? ` + 油卡押金${Common.util.numberFormat(this.auditForm.waybill.dispatch.dispatchPrice.oilCardDeposit, 2)}元` : '';
                let str4 = this.auditForm.gpsDeposit === 'NOT_PAYMENT' && this.auditForm.waybill.dispatch.dispatchPrice.gpsDeposit ? ` + GPS押金${Common.util.numberFormat(this.auditForm.waybill.dispatch.dispatchPrice.gpsDeposit, 2)}元` : '';
                return str1 + str2 + str3 + str4
            },
            //计算加油记录合计（选择行的）
            paidAmountSum: function () {
                let Sum = 0;
                this.oilMultipleSelection.forEach((item) => {
                    Sum = Sum + item.receiveAmount
                });
                return Sum.toFixed(2);
            }
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = this.cloneModel.searchParam
            },
            selectable() {
                return this.checkBoxShow;
            },
            changeStatus(val) {
                // if(val){//开票--置空申请审核状态
                //     this.searchParam.applyForStatus = '';
                // }else{//不开票--置空账单生成状态
                this.searchParam.supplierBillStatus = '';
                // }
            },
            searchList() {//查询
                let vm = this;
                if (vm.searchParam.signTime) {
                    vm.searchParam.signTimeStart = vm.searchParam.signTime[0];
                    vm.searchParam.signTimeEnd = vm.searchParam.signTime[1];
                } else {
                    vm.searchParam.signTimeStart = "";
                    vm.searchParam.signTimeEnd = "";
                }
                if (vm.searchParam.paymentRequestTime) {
                    vm.searchParam.paymentRequestTimeStart = vm.searchParam.paymentRequestTime[0];
                    vm.searchParam.paymentRequestTimeEnd = vm.searchParam.paymentRequestTime[1];
                } else {
                    vm.searchParam.paymentRequestTimeStart = "";
                    vm.searchParam.paymentRequestTimeEnd = "";
                }
                vm.isLoading = true;
                // if(vm.searchParam.ticket){//开票
                vm.showCreatBill = true;
                Http.get(Api.payableConfirm.getPayableConfirmPageConfirm, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                })
                // }else{//不开票
                //     vm.showCreatBill = false;
                //     if(vm.searchParam.motorcade){//车队
                //         vm.checkBoxShow = true;
                //     }else{//不是车队
                //         vm.checkBoxShow = false;
                //     }
                //     Http.get(Api.supplierPayableBill.page,{ params : vm.searchParam }, result => {
                //         this.searchResult.result = result.result;
                //         this.searchResult.totalCount = result.totalCount;
                //         this.searchParam.currentPage = result.currentPage;
                //         this.searchParam.pageSize = result.pageSize;
                //         vm.isLoading = false;
                //     },()=>{
                //         vm.isLoading = false;
                //     })
                // }
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
            checkSelectable(row) {
                return this.checkBoxShow;
            },
            showWayBill(row) { //运单详情------------------------------------
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
                // window.open(href, '_blank');
            },
            //申请
            showApplyInfo(row) {
                let vm = this;
                Http.get(Api.supplierPayableBill.queryById, {params: {'id': row.id}}, result => {
                    if (!result.result.waybillPayableDeducts) {
                        result.result.waybillPayableDeducts = {
                            waybillPayableDeductDetails: []
                        }
                    }
                    if (!result.result.waybill) {
                        result.result.waybill = this.cloneModel.applyInfoForm.waybill
                    }
                    vm.applyInfoForm = result.result;
                    vm.showApplyDialog = true;
                })
            },
            applyInfoSubmit() {
                let vm = this;
                let bill = {};
                bill.id = vm.applyInfoForm.id;
                bill.applyRemark = vm.applyInfoForm.applyRemark;
                if (!vm.applyInfoForm.delayedPayment) {
                    if (!vm.applyInfoForm.applyRemark) {
                        vm.$message.error('未到达结款周期,请填写申请说明!!');
                        throw '未到达结款周期,请填写申请说明!';
                    }
                    this.$confirm('回单签收未到10天付款时间,是否继续申请付款?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        vm.applyForPayment(vm, bill)
                    })
                } else {
                    vm.applyForPayment(vm, bill)
                }
            },
            applyForPayment(vm, bill) {
                if (vm.applyInfoForm.waybill.dispatch.dispatchVehicle.driver.name !== vm.applyInfoForm.waybill.payee) {
                    //收款人和司机不一致
                    this.$confirm('收款人姓名和司机姓名不一致, 是否继续申请?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        vm.isSubmitBtnDisabled = true;
                        Http.post(Api.supplierPayableBill.applyForBalancePayment, bill, result => {
                            vm.$message.success('申请付款成功！');
                            vm.isSubmitBtnDisabled = false;
                            vm.showApplyDialog = false;
                            vm.searchList();
                        }, result => {
                            vm.isSubmitBtnDisabled = false;
                        })
                    })
                } else {
                    vm.isSubmitBtnDisabled = true;
                    Http.post(Api.supplierPayableBill.applyForBalancePayment, bill, result => {
                        vm.$message.success('申请付款成功！');
                        vm.isSubmitBtnDisabled = false;
                        vm.showApplyDialog = false;
                        vm.searchList();
                    }, result => {
                        vm.isSubmitBtnDisabled = false;
                    })
                }
            },
            //审核
            showAudit(row) {
                let vm = this;
                Http.get(Api.supplierPayableBill.queryById, {params: {'id': row.id}}, result => {
                    console.log(result.result);
                    if (!result.result.waybillPayableDeducts) {
                        result.result.waybillPayableDeducts = {
                            waybillPayableDeductDetails: []
                        };
                    }
                    if (!result.result.waybill) {
                        result.result.waybill = this.cloneModel.auditForm.waybill
                    }
                    result.result.applyForStatus = Constant.AUDIT_STATUS.PASS;
                    vm.auditForm = result.result;
                    vm.showAuditDialog = true;
                })
            },
            auditFormSubmit() {
                let vm = this;
                vm.isSubmitBtnDisabled = true;
                Http.post(Api.supplierPayableBill.auditForBalancePayment, vm.auditForm, result => {
                    vm.$message.success('审核成功！');
                    vm.isSubmitBtnDisabled = false;
                    vm.showAuditDialog = false;
                    vm.searchList();
                }, result => {
                    vm.isSubmitBtnDisabled = false;
                })
            },
            resetAuditForm() {
                this.auditForm = this.cloneModel.auditForm
            },
            //生成对账单
            showAccountList() {
                let vm = this;
                let sameFlag = true;
                if (vm.showCreatBill) {//校验承运方选择是否一致
                    sameFlag = vm.multipleSelection.every((item) => {
                        return item.waybill.dispatch.dispatchVehicle.shipperCode === vm.multipleSelection[0].waybill.dispatch.dispatchVehicle.shipperCode;
                    });
                    if (!sameFlag) {
                        return vm.$message.warning('勾选项承运方不一致，请核查！');
                    } else {
                        vm.oilSearchParam.supplierId = vm.multipleSelection[0].waybill.dispatch.dispatchVehicle.shipperCode
                    }
                } else {
                    sameFlag = vm.multipleSelection.every((item) => {
                        return item.shipperCode === vm.multipleSelection[0].shipperCode;
                    });
                    if (!sameFlag) {
                        return vm.$message.warning('勾选项承运方不一致，请核查！');
                    } else {
                        vm.oilSearchParam.supplierId = vm.multipleSelection[0].shipperCode
                    }
                }
                // let waybills = '';
                // vm.multipleSelection.forEach(row => {
                //     waybills += row.waybillCode + ','
                // });
                // //获取账单明细
                // Http.get(Api.payableConfirm.getPayableConfirmPageConfirmSum, {params: {'waybills': waybills}}, result => {
                //     vm.innerSearchResult = result.result;
                //     vm.showAccountDialog = true;
                // })

                let waybills = [];
                vm.multipleSelection.forEach(row => {
                    waybills.push(row.waybillCode);
                });
                //获取账单明细
                Http.post(Api.payableConfirm.getPayableConfirmPageConfirmSum, {'waybills': waybills}, result => {
                    vm.innerSearchResult = result.result;
                    vm.showAccountDialog = true;
                })

            },
            creatBill() {
                let vm = this;
                let waybills = [];//运单号list
                vm.multipleSelection.forEach(row => {
                    waybills.push(row.waybillCode);
                });
                let ids = [];//加油记录List
                vm.oilMultipleSelection.forEach(row => {
                    ids.push(row.id);
                });
                vm.isSubmitBtnDisabled = true;
                Http.post(Api.payableConfirm.generatedBills, {
                    'waybills': waybills,
                    'refuelingRecords': ids
                }, result => {
                    vm.$message.success('生成账单成功！');
                    vm.isSubmitBtnDisabled = false;
                    vm.showAccountDialog = false;
                    vm.clearSelect();
                }, result => {
                    vm.isSubmitBtnDisabled = false;
                })
            },
            clearSelect() {
                let vm = this;
                vm.$refs.multipleTable.clearSelection();
                // vm.$refs.multipleTable1.clearSelection();
                vm.multipleSelection = [];
            },
            resetInnerSearchResult() {
                let vm = this;
                vm.innerSearchResult = this.cloneModel.innerSearchResult
                vm.oilSearchResult = this.cloneModel.oilSearchResult
            },
            oilHandleSelectionChange(val) {
                this.oilMultipleSelection = val;
            }
        }
    }
</script>
