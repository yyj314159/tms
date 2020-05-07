<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 应付管理</el-breadcrumb-item>
                <el-breadcrumb-item>旧供应商账单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form :model="searchParam" label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="账单编号:">
                            <el-input v-model="searchParam.billCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商名称:">
                            <supplier-select v-model="searchParam.supplierCode" style="display: block;" level="top"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="账单开始时间:">
                            <date-picker-single v-model="searchParam.generatedBillsStartTime" date-type="start"
                                                :end-date="searchParam.generatedBillsEndTime"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="账单结束时间:">
                            <date-picker-single v-model="searchParam.generatedBillsEndTime" date-type="end"
                                                :start-date="searchParam.generatedBillsStartTime"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发票号:">
                            <el-input v-model="searchParam.invoiceNo"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="开票月份:">
                            <el-date-picker v-model="searchParam.invoiceMonth" style="width:100%;" type="month"
                                            value-format="yyyy-MM" placeholder="选择开票日期"
                                            :picker-options="month0"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="0" style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetSearchParam" size="small">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="billOutInviteWinShow"
                       v-permission="permission.add">预览账单
            </el-button>
            <el-button v-if="btnLoading" size="mini" type="primary" icon="el-icon-download" @click="exportList"
                       v-permission="permission.export">导出
            </el-button>
            <el-button v-else size="mini" type="primary" v-permission="permission.export"><i
                class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <!--列表-->
            <el-table class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      border fit
                      @selection-change="handleSelectionChange"
                      highlight-current-row stripe
                      size="small">
                <el-table-column type="selection" width="40"/>
                <el-table-column label="账单编号" prop="code">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showDetails(scope.row.code)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="供应商" prop="supplier.name" width="240" show-overflow-tooltip/>
                <el-table-column label="结算运费" prop="settlementAmount"/>
                <el-table-column label="时效扣款" prop="timeWithdrawingAmount"/>
                <el-table-column label="线路管理费" prop="lineAmount"/>
                <el-table-column label="开票金额" prop="invoiceAmount"/>
                <el-table-column label="发票号" prop="invoiceNo" show-overflow-tooltip/>
                <el-table-column label="开票时间" prop="invoiceTime" show-overflow-tooltip/>
                <!--<el-table-column label="备注" prop="remark"/>-->
                <el-table-column label="账单生成人" prop="generatedBillsPeople"/>
                <el-table-column label="账单生成时间" prop="generatedBillsTime" show-overflow-tooltip/>
                <el-table-column label="操作" header-align="center" align="center" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini"
                                   @click="makeOutAnInvoiceShow(scope.row)"
                                   v-permission="permission.makeOutAnInvoice"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini"
                                   @click="deleteBill(scope.row.id)"
                                   v-permission="permission.delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
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
        <!-- 新增信息部信息弹出框 -->
        <el-dialog title="预览账单" :visible.sync="previewBillWinShow" width="70%">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="queryWayBillWinShow">运单查询</el-button>
            <!--列表-->
            <el-table class="content-table" :data="previewBillWin.result"
                      element-loading-text="拼命加载中"
                      height="400px"
                      border fit
                      highlight-current-row stripe
                      size="small">
                <el-table-column type="index" label="索引" min-width="65" width="65" fixed>
                    <template slot-scope="scope">
                        {{ tableIndex(scope.row,scope.$index) }}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单编号" prop="waybillCode" min-width="120px" fixed/>
                <el-table-column align="center" label="序列号" prop="waybill.departureNumber" min-width="120"
                                 show-overflow-tooltip></el-table-column>
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
                <el-table-column header-align="center" label="结算金额" prop="settlementOfFreight" min-width="120px"/>
                <el-table-column header-align="center" label="质量扣款(调减)" prop="qualityDeductionsAmount"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="线路管理费" prop="insuranceFee"
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
                <el-table-column header-align="center" label="回单押金" prop="returnDeposit" min-width="120px"/>
                <el-table-column header-align="center" label="回单付金额(尾款)" prop="returnAmount" min-width="150px"/>
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
                                                v-if="scope.row.waybill.dispatch.dispatchLine"
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
                <el-table-column label="操作" header-align="center" align="center" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-delete" type="text" style="font-weight: bold;"
                                   @click="deleteRow(scope.row,scope.$index)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-form>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="开票金额：">
                            {{ invoiceAmount }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="结算运费：">
                            {{ settlementOfFreight1 }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="时效扣款：">
                            {{ agingDeductions }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路管理费：">
                            {{ lineAmount }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="previewBillWinShow = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitBill" size="small">生成账单</el-button>
            </div>
        </el-dialog>
        <el-dialog title="查询结算运单" :visible.sync="queryBillWinShow" width="80%" :before-close="queryWayBillWinHide">
            <el-form :model="queryBillWin.queryBillWinForm" ref="queryBillWin" size="small" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单编号:">
                            <el-input v-model="queryBillWin.queryBillWinForm.waybillCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="queryBillWin.queryBillWinForm.supplierCode"
                                             placeholder="请输入供应商"
                                             type="PLANTFORM_COMPANY"
                                             style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达开始时间:">
                            <date-picker-single v-model="queryBillWin.queryBillWinForm.confirmArrivalStartTime"
                                                date-type="start"
                                                :end-date="queryBillWin.queryBillWinForm.confirmArrivalEndTime"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达结束时间:">
                            <date-picker-single v-model="queryBillWin.queryBillWinForm.confirmArrivalEndTime"
                                                date-type="end"
                                                :start-date="queryBillWin.queryBillWinForm.confirmArrivalStartTime"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="开票金额:">
                            <el-input v-model="queryBillWin.queryBillWinForm.invoiceAmount"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="顺丰C端:" prop="queryBillWin.queryBillWinForm.isSfClient">
                            <el-switch v-model="queryBillWin.queryBillWinForm.isSfClient" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item label-width="0" style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="queryBillWinSearchList"
                                       size="small">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetSearchParam" size="small">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addBillByWaybills">加入账单</el-button>
            <!--列表-->
            <el-table class="content-table" :data="queryBillWin.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChangeSubQueryWin"
                      height="400px"
                      border fit
                      highlight-current-row stripe
                      size="small">
                <el-table-column type="selection"/>
                <el-table-column type="index" label="索引" min-width="65" width="65" fixed>
                    <template slot-scope="scope">
                        {{ tableIndex(scope.row,scope.$index) }}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单编号" prop="waybillCode" min-width="120px" fixed/>
                <el-table-column align="center" label="序列号" prop="waybill.departureNumber" min-width="120"
                                 show-overflow-tooltip/>
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
                <el-table-column header-align="center" label="供应商"
                                 prop="waybill.dispatch.dispatchVehicle.supplier.name"
                                 min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="承运商"
                                 prop="waybill.dispatch.dispatchVehicle.shipper.name"
                                 min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="车牌号"
                                 prop="waybill.dispatch.dispatchVehicle.vehicleLicenseNum" min-width="120px"/>
                <el-table-column header-align="center" label="实际发车时间" prop="waybill.actualDepartureTime"
                                 min-width="200px"/>
                <el-table-column header-align="center" label="实际到达时间" prop="waybill.confirmArrivalTime"
                                 min-width="200px"/>
                <el-table-column header-align="center" label="签收时间" prop="waybill.signTime" min-width="200px"/>
                <el-table-column header-align="center" label="油卡卡号"
                                 prop="waybill.dispatch.dispatchPrice.oilCardNumber"
                                 min-width="150px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="线路" prop="waybill.dispatch.dispatchLine.lineName"
                                 min-width="250px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="应付运费" prop="paidVehicleAmount" min-width="120px"/>
                <el-table-column header-align="center" label="调整金额" prop="adjustAmount" min-width="120px"/>
                <el-table-column header-align="center" label="质量扣款(调减)" prop="qualityDeductionsAmount"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="线路管理费" prop="insuranceFee"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="开票金额" prop="invoiceAmount" min-width="120px"/>
                <el-table-column header-align="center" label="油价补差(调增)" prop="oilPriceSupplement"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="其他扣款(调减)" prop="otherDeductionsAmount"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="质量奖励(调增)" prop="qualityAward" min-width="120px"/>
                <el-table-column header-align="center" label="压车费(调增)" prop="detentionCharge" min-width="120px"/>
                <el-table-column header-align="center" label="实际应付" prop="actualPaidVehicleAmount"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="预付打卡" prop="prepaidCardAmount" min-width="120px"/>
                <el-table-column header-align="center" label="货到打卡" prop="deliveryAmount" min-width="120px"/>
                <el-table-column header-align="center" label="GPS押金" prop="gpsDeposit" min-width="120px"/>
                <el-table-column header-align="center" label="GPS使用费" prop="gpsCost" min-width="120px"/>
                <el-table-column header-align="center" label="油卡押金" prop="oilCardDeposit" min-width="120px"/>
                <el-table-column header-align="center" label="油卡金额" prop="oilCardAmount" min-width="120px"/>
                <el-table-column header-align="center" label="定点加油" prop="refuelingAmount" min-width="120px"/>
                <el-table-column header-align="center" label="回单押金" prop="returnDeposit" min-width="120px"/>
                <el-table-column header-align="center" label="回单付金额(尾款)" prop="returnAmount" min-width="150px"/>

                <el-table-column header-align="center" label="运单备注" prop="waybill.remark" min-width="200px"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.repeatSettlement ? "运单价格差异补差价" : scope.row.waybill.remark}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="始发地"
                                 prop="waybill.dispatch.dispatchLine.startStation.name" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="目的地"
                                 prop="waybill.dispatch.dispatchLine.endStation.name"
                                 min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="营运类型"
                                 prop="waybill.dispatch.dispatchLine.operationType"
                                 min-width="120px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_OPERATION_TYPE"
                                                v-if="scope.row.waybill.dispatch.dispatchLine"
                                                :value="scope.row.waybill.dispatch.dispatchLine.operationType"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车长"
                                 prop="waybill.dispatch.dispatchVehicle.specification"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="主司机姓名"
                                 prop="waybill.dispatch.dispatchVehicle.driver.name"
                                 min-width="120px"/>
                <el-table-column header-align="center" label="主司机电话"
                                 prop="waybill.dispatch.dispatchVehicle.driver.mobile" min-width="120px"/>
                <el-table-column header-align="center" label="应付合同号"
                                 prop="waybill.dispatch.dispatchPrice.contractCode"
                                 min-width="150px" show-overflow-tooltip/>
            </el-table>
            <!--分页-->
            <el-form>
                <el-row>
                    <el-col :span="24">
                        <div class="content-pagination">
                            <el-pagination
                                @size-change="queryWaybillHandleSizeChange"
                                @current-change="queryWaybillHandleCurrentChange"
                                :page-sizes="[10, 20, 50, 100]"
                                :page-size="queryBillWin.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="queryBillWin.totalCount">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>


        <el-dialog title="供应商账单明细" :visible.sync="billDetailWinShow" width="70%">
            <el-form>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="账单编号：">
                            {{ billDetailWin.billCode }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商：">
                            {{ billDetailWin.billSupplierName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="结算运费：">
                            {{ billDetailWin.billSettlementAmount }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="时效扣款：">
                            {{ billDetailWin.billTimeWithdrawingAmount }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路管理费：">
                            {{ billDetailWin.totalLineAmount }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="开票金额：">
                            {{ billDetailWin.billInvoiceAmount }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="开票时间：">
                            {{ billDetailWin.billInvoiceTime }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发票号：">
                            {{ billDetailWin.billInvoiceNo }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-button v-if="btnLoading" size="mini" type="primary" icon="el-icon-download"
                               @click="exportBillDetail">导出
                    </el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
                    </el-button>
                </el-row>
            </el-form>
            <!--列表-->
            <el-table class="content-table" :data="billDetailWin.inviteDetails"
                      element-loading-text="拼命加载中"
                      height="400px"
                      border fit
                      highlight-current-row stripe
                      size="small">
                <el-table-column type="index" label="索引" min-width="65" width="65" fixed>
                    <template slot-scope="scope">
                        {{ tableIndex(scope.row,scope.$index) }}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单编号" prop="waybillCode" min-width="120px" fixed/>
                <el-table-column align="center" label="序列号" prop="departureNumber" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column label="运单状态" prop="waybillStatus" min-width="120"/>
                <el-table-column header-align="center" label="客户全称" prop="customerName" min-width="120px"/>
                <el-table-column header-align="center" label="大区" prop="regionName" min-width="120px"/>
                <el-table-column header-align="center" label="小区" prop="belongOrgName" min-width="120px"/>
                <el-table-column header-align="center" label="供应商" prop="supplierName" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="车牌号" prop="licenseNum" min-width="120px"/>
                <el-table-column header-align="center" label="实际发车时间" prop="actualDepartureTime" min-width="200px"/>
                <el-table-column header-align="center" label="实际到达时间" prop="confirmArrivalTime" min-width="200px"/>
                <el-table-column header-align="center" label="签收时间" prop="signTime" min-width="200px"/>
                <el-table-column header-align="center" label="线路" prop="lineName" min-width="250px"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="应付运费" prop="paidVehicleAmount" min-width="120px"/>
                <el-table-column header-align="center" label="调整金额" prop="adjustAmount" min-width="120px"/>
                <el-table-column header-align="center" label="结算运费" prop="settlementAmount" min-width="120px"/>
                <el-table-column header-align="center" label="时效扣款" prop="timeWithdrawingAmount" min-width="120px"/>
                <el-table-column header-align="center" label="线路管理费" prop="lineAmount" min-width="120px"/>
                <el-table-column header-align="center" label="开票金额" prop="invoiceAmount" min-width="120px"/>
                <el-table-column header-align="center" label="账单备注" prop="remark" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="始发地" prop="startStationName" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="目的地" prop="endStationName" min-width="200px"
                                 show-overflow-tooltip/>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="billDetailWinShow = false" size="small">关 闭</el-button>
            </div>
        </el-dialog>


        <el-dialog title="开票信息" :visible.sync="makeOutAnInvoiceWinShow" width="500px">
            <el-form size="small" :model="makeOutAnInvoiceWin" label-width="80px" :rules="makeOutAnInvoiceWinRules">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="发票号:">
                            <el-input v-model="makeOutAnInvoiceWin.invoiceNo"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="开票月份:">
                            <el-date-picker v-model="makeOutAnInvoiceWin.invoiceTime" style="width:100%;" type="month"
                                            value-format="yyyy-MM" placeholder="选择开票日期"
                                            :picker-options="month0"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!--列表-->
            <div slot="footer" class="dialog-footer">
                <el-button @click="makeOutAnInvoiceWinShow = false" size="small">关 闭</el-button>
                <el-button @click="makeOutAnInvoice()" size="small">确 认</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global';
    import axios from 'axios'

    export default {
        data() {
            return {
                initializeModel: {},
                permission: { //权限
                    add: '/supplierBillOutInvite/add',
                    export: '/supplierBillOutInvite/export',
                    makeOutAnInvoice: '/supplierBillOutInvite/makeOutAnInvoice',
                    delete: '/supplierBillOutInvite/delete'
                },
                month0: {
                    disabledDate(time) {
                        return time > new Date()
                    }
                },
                btnLoading: true,
                cityList: [],
                customerList: [],
                multipleSelection: [],
                multipleSelectionQueryWin: [],
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    billCode: '',
                    supplierCode: '',
                    invoiceNo: '',
                    invoiceMonth: '',
                    invoiceTime: '',
                    generatedBillsStartTime: '',
                    generatedBillsEndTime: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                previewBillWin: {
                    supplierCode: '',
                    result: []
                },
                queryBillWin: {
                    queryBillWinForm: {
                        currentPage: 1,
                        pageSize: 10,
                        excludeList: [],
                        supplierCode: '',
                        waybillCode: '',
                        invoiceAmount: '',
                        isSfClient: false,
                        confirmArrivalStartTime: '',
                        confirmArrivalEndTime: ''
                    },
                    totalCount: 0,
                    result: []
                },
                billDetailWin: {
                    code: '',
                    supplierId: '',
                    settlementAmount: '',
                    billSupplierName: '',
                    timeWithdrawingAmount: '',
                    invoiceAmount: '',
                    invoiceTime: '',
                    remark: '',
                    billSettlementAmount: '',
                    billTimeWithdrawingAmount: '',
                    totalLineAmount: '',
                    billInvoiceAmount: '',
                    billInvoiceTime: '',
                    billInvoiceNo: '',
                    inviteDetails: []
                },
                makeOutAnInvoiceWin: {
                    invoiceNo: '',
                    invoiceTime: '',
                    code: ''
                },
                updateCityOptios: [],
                previewBillWinShow: false,
                queryBillWinShow: false,
                billDetailWinShow: false,//账单明细winShow
                makeOutAnInvoiceWinShow: false,
                makeOutAnInvoiceWinRules: {
                    invoiceNo: [
                        {required: true, message: '请输入编号', trigger: 'blur'},
                        {min: 1, max: 50, message: '编号最长50个字符', trigger: 'blur'}
                    ],
                    invoiceTime: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ]
                },
            }
        },
        mounted() {
            //查询表格
            this.searchList();
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
        },
        computed: {
            invoiceAmount() {
                let num = 0;
                this.previewBillWin.result.forEach((a) => {
                    num = Common.util.numberFormat(num + Common.util.numberFormat(a.settlementOfFreight - a.qualityDeductionsAmount - a.insuranceFee, 2));
                });
                return num
            },
            settlementOfFreight1() {
                let num = 0;
                this.previewBillWin.result.forEach((a) => {
                    num = Common.util.numberFormat(num + a.settlementOfFreight, 2);
                });
                return num
            },
            agingDeductions() {
                let num = 0;
                this.previewBillWin.result.forEach((a) => {
                    num = Common.util.numberFormat(num + a.qualityDeductionsAmount, 2);
                });
                return num
            },
            lineAmount() {
                let num = 0;
                this.previewBillWin.result.forEach((a) => {
                    num = Common.util.numberFormat(num + a.insuranceFee, 2);
                });
                return num
            }
        },
        methods: {
            tableIndex(row, index) {
                row.index = index;
                return index + 1
            },
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            //通用
            handleCurrentChange(val) {
                let _this = this
                _this.searchParam.currentPage = val
                this.searchList()
            },
            handleSizeChange(val) {
                let _this = this
                _this.searchParam.pageSize = val
                this.searchList()
            },
            /**
             * 主界面
             */
            //查询
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            searchList() {
                let _this = this;
                Http.get(Api.supplierBillOutInvite.page, {params: _this.searchParam}, result => {
                    _this.searchResult.result = result.result;
                    _this.searchResult.totalCount = result.totalCount;
                    _this.searchParam.currentPage = result.currentPage;
                    _this.searchParam.pageSize = result.pageSize
                })
            },
            //重置
            resetSearchParam() {
                let _this = this;
                _this.searchParam = _this.cloneMode().searchParam
            },
            //新增
            addInformationWinFun() {
                let _this = this;
                _this.addInformationOwnerWin = true
            },
            //生成则一账单
            previewBillWinReset() {
                let _this = this;
                _this.previewBillWin = _this.cloneMode().previewBillWin;
                _this.queryBillWin = _this.cloneMode().queryBillWin;
            },
            submitBill() {
                let _this = this;
                let waybillList = [];
                _this.previewBillWin.result.forEach((a) => {
                    waybillList.push(a.waybillCode)
                });
                Http.post(Api.supplierBillOutInvite.add, waybillList, response => {
                    _this.$message.success("已生成账单");
                    _this.previewBillWinShow = false;
                    _this.previewBillWinReset();
                })
            },
            //删除
            deleteByTable(row) {

            },
            //通过ID回显数据(修改)
            showModifyLineDialog(row) {
                let _this = this;
                _this.isUpdate = true;
                Http.get(Api.SettlementCustomer.getSettlementCustomerById, {params: {'id': row.id}}, result => {
                    _this.updateInformationOwnerWin = true;
                    setTimeout(() => {
                        let customer = {code: result.result.customer.code, name: result.result.customer.name};
                        _this.$refs.modifyCustomerSelect.setCurrentCustomer(customer);
                        _this.addBaseInfoLineForm = result.result
                    }, 0)
                })
            },
            //导出结算客户
            exportCustomer() {

            },
            makeOutAnInvoiceShow(row) {
                let _this = this;
                _this.makeOutAnInvoiceWin.code = row.code
                this.makeOutAnInvoiceWinShow = true;
            },
            makeOutAnInvoice() {
                let _this = this;
                Http.post(Api.supplierBillOutInvite.makeOutAnInvoice, _this.makeOutAnInvoiceWin, result => {
                    _this.makeOutAnInvoiceWinShow = false;
                    _this.makeOutAnInvoiceWin = _this.cloneMode().makeOutAnInvoiceWin;
                    _this.searchList();
                })
            },
            /*预览账单界面显示*/
            billOutInviteWinShow() {
                this.previewBillWin.result = this.cloneMode().previewBillWin.result;
                this.previewBillWinShow = true
            },
            deleteRow(row, index) {
                this.previewBillWin.result.splice(index, 1);
            },
            /*查询运单信息*/
            queryWayBillWinShow() {
                this.queryBillWinShow = true
            },
            queryWayBillWinHide() {
                this.queryBillWinShow = false
            },
            queryBillWinSearchList() {
                let _this = this;

                if (!_this.queryBillWin.queryBillWinForm.supplierCode) {
                    _this.$message.error("供应商不能为空");
                    return;
                }
                if (_this.previewBillWin.result.length > 0) {
                    _this.previewBillWin.result.forEach((s) => {
                        _this.queryBillWin.queryBillWinForm.excludeList.push(s.waybillCode)
                    });
                } else {
                    _this.queryBillWin.queryBillWinForm.excludeList = []
                }
                Http.post(Api.payableConfirm.getPayableConfirmBySettlement, _this.queryBillWin.queryBillWinForm, result => {
                    _this.queryBillWin.result = result.result;
                    _this.queryBillWin.totalCount = result.totalCount;
                    _this.queryBillWin.queryBillWinForm.currentPage = result.currentPage;
                    _this.queryBillWin.queryBillWinForm.pageSize = result.pageSize
                })
            },
            queryWaybillHandleSizeChange(val) {
                let _this = this;
                _this.queryBillWin.queryBillWinForm.pageSize = val;
                this.queryBillWinSearchList()
            },
            queryWaybillHandleCurrentChange(val) {
                let _this = this;
                _this.queryBillWin.queryBillWinForm.currentPage = val;
                this.queryBillWinSearchList()
            },
            handleSelectionChangeSubQueryWin(val) {
                this.multipleSelectionQueryWin = val;
            },
            addBillByWaybills() {
                let _this = this;
                if (_this.multipleSelectionQueryWin) {
                    for (let i = 0; i < _this.multipleSelectionQueryWin.length; i++) {
                        let row = _this.multipleSelectionQueryWin[i];
                        if (_this.previewBillWin.result && _this.previewBillWin.result.length > 0) {
                            if (row.waybill.dispatch.dispatchVehicle.supplierCode != _this.previewBillWin.result[0].waybill.dispatch.dispatchVehicle.supplierCode) {
                                _this.$message.error("账单供应商必须一致");
                                return;
                            }
                        }
                        _this.previewBillWin.result.push(row);
                        _this.queryBillWin.result.splice(row.index, 1, undefined);
                    }
                    _this.queryBillWin.result = _.compact(_this.queryBillWin.result)
                }
            },
            showDetails(code) {
                let _this = this;
                _this.isUpdate = true;
                Http.get(Api.supplierBillOutInvite.getSupplierBillOutInviteByCode, {params: {'code': code}}, result => {
                    _this.billDetailWinShow = true;
                    if (result.result.length > 0) {
                        _this.billDetailWin = result.result[0];
                        _this.billDetailWin.inviteDetails = result.result;
                    }
                })
            },
            deleteBill(id) {

                let _this = this;
                _this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.supplierBillOutInvite.delete, [id], response => {
                        _this.$message.success("删除成功");
                        _this.searchList();
                    })
                })

            },
            exportBillDetail() {
                let _this = this;
                Common.excel.reportExcel(Api.supplierBillOutInvite.exportDetail, {'code': _this.billDetailWin.billCode}, "供应商账单明细导出.xls")
            },
            exportList() {
                debugger
                let vm = this;
                vm.btnLoading = false;
                axios.get(Api.supplierBillOutInvite.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '供应商账单.xls';
                    link.click();
                    vm.btnLoading = true;
                }).catch(reason => {
                    vm.btnLoading = true;
                })
            },
        }
    }
</script>

