<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 应收管理</el-breadcrumb-item>
                <el-breadcrumb-item>应收确认</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode" style="display:block"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.belongOrgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.actualDepartureStartTime" date-type="start" :end-date="searchParam.actualDepartureEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.actualDepartureEndTime" date-type="end" :start-date="searchParam.actualDepartureStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="收入主体:">
                            <dictionary-select v-model="searchParam.incomeSubject" style="display:block"
                                               option-name="LINE_INCOME_SUBJECT"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户全称:">
                            <settlement-customer-select v-model="searchParam.customerName"
                                                        style="display:block"></settlement-customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达开始时间:">
                            <date-picker-single v-model="searchParam.confirmArrivalStartTime" date-type="start" :end-date="searchParam.confirmArrivalEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达结束时间:">
                            <date-picker-single v-model="searchParam.confirmArrivalEndTime" date-type="end" :start-date="searchParam.confirmArrivalStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="线路编码:">
                            <line-select v-model="searchParam.lineCode" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" auditStatus="PASS"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发地:">
                            <district-select v-model="searchParam.departCityCodeList"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的地:">
                            <district-select v-model="searchParam.destCityCodeList"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleLicenseNum"
                                            style="display:block"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select v-model="searchParam.vehicleNature" style="display:block"
                                               option-name="VEHICLE_OPERATION_MODE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应收结算开始:">
                            <date-picker-single v-model="searchParam.settlementStartTime" date-type="start" :end-date="searchParam.settlementEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应收结算结束:">
                            <date-picker-single v-model="searchParam.settlementEndTime" date-type="end" :start-date="searchParam.settlementStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="结算人:">
                            <el-input v-model="searchParam.settlementUser" style="display:block"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="账单状态:">
                            <dictionary-select v-model="searchParam.billStatus" option-name="IS_EXIST"
                                               style="display:block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="text" v-show="!isMoreItemShow" @click="showMore" size="mini">展开搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="showLess" size="mini">收起搜索项<<
                            </el-button>
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="mini">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam" size="mini">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <div style="display: inline-flex;">
                <el-button v-if="exportLoading" v-permission="'/receiveConfirm/export'" size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
                <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
                <el-button v-if="downloadLoading" v-permission="'/receiveConfirm/templateDownload'" icon="el-icon-download" type="primary" size="mini" style="margin-right:2px;" @click="exportList">模板下载</el-button>
                <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>下载中...</el-button>
                <upload-excel v-permission="'/receiveConfirm/upload'" :importUrl="url" @success="uploadSuccess" style="margin: 0 10px 0 10px;"></upload-excel>
                <el-button size="mini" type="primary" v-permission="'/receiveConfirm/createBill'" icon="el-icon-check"
                           @click="createReceiveBill">生成应收对账单
                </el-button>
            </div>
            <el-table size="small" class="content-table" v-loading="isLoading" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit height="350"
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center" label="运单号" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="顶级客户" prop="waybill.dispatch.topCustomer.name" show-overflow-tooltip min-width="120px"></el-table-column>
                <el-table-column header-align="center" label="客户简称" prop="waybill.dispatch.customer.name" show-overflow-tooltip min-width="120px"></el-table-column>
                <el-table-column header-align="center" label="收入主体" prop="incomeSubject" show-overflow-tooltip min-width="180px"></el-table-column>
                <el-table-column header-align="center" label="客户全称" prop="customerName" show-overflow-tooltip min-width="180px"></el-table-column>
                <el-table-column align="center" label="大区" prop="waybill.dispatch.region.name" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="小区" prop="waybill.dispatch.belongOrg.name" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="是否生成结算账单" min-width="150px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.billStatus ? "是":"否"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="账单生成时间" prop="billGenerationTime" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="收款状态" prop="payeeStatus" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="PAYEE_STATUS" :value="scope.row.payeeStatus"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="应收运费" prop="receiveAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运价调整" prop="feeAdjustAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算运费" prop="settlementAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="质量扣款" prop="qualityDeductionsAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="安全扣款" prop="securityDeductionsAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油价补差" prop="oilPriceSupplement" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="其他扣款" prop="otherDeductionsAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际应收" prop="actualReceiveAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="应收结算时间" prop="receiveSettlementTime" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算人" min-width="140px" prop="settlementUser" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="waybill.dispatch.dispatchLine.lineName" show-overflow-tooltip min-width="240px"></el-table-column>
                <el-table-column align="center" label="车辆属性" min-width="100px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="scope.row.waybill.dispatch.dispatchVehicle.vehicleNature"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="车牌号" prop="waybill.dispatch.dispatchVehicle.vehicleLicenseNum" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="挂厢号" prop="waybill.dispatch.dispatchVehicle.trailerLicenseNum" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="客户车牌号" prop="customerLicenseNumber" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="客户挂厢号" prop="customerTrailer" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际发车时间" prop="waybill.actualDepartureTime" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际到达时间" prop="waybill.confirmArrivalTime" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="始发地" prop="waybill.dispatch.dispatchLine.startStation.city.name" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="目的地" prop="waybill.dispatch.dispatchLine.endStation.city.name" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单性质" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_OPERATION_TYPE" :value="scope.row.waybill.dispatch.dispatchLine.operationType"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="线路里程" prop="waybill.dispatch.dispatchLine.distance" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车型" prop="waybill.dispatch.dispatchVehicle.specification" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="主司机姓名" prop="waybill.dispatch.dispatchVehicle.driverName" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="主司机电话" prop="waybill.dispatch.dispatchVehicle.driverPhone" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车主姓名" prop="vehicleOwner.name" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车主电话" prop="vehicleOwner.mobile" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="回单号" prop="waybill.receiptCodes" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="!scope.row.billStatus" v-permission="'/receiveConfirm/modify'"
                                   icon="el-icon-edit" size="mini" @click="modifyReceiveConfirm(scope.row)"></el-button>
                    </template>
                </el-table-column>
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
                <span style=" margin-right:20px;">结算运费：{{settlementAmountValue}}元</span>
                <span style="color:red; margin-right:20px;">质量扣款：{{qualityDeductionsAmountValue}}元</span>
                <span style="color:red; margin-right:20px;">安全扣款：{{securityDeductionsAmountValue}}元</span>
                <span style="color:red; margin-right:20px;">油价补差：{{oilPriceSupplementValue}}元</span>
                <span style="color:red; margin-right:20px;">其他扣款：{{otherDeductionsAmountValue}}元</span>
                <span style="margin-right:20px;">实际应收：{{actualReceiveAmountValue}}元</span>
            </el-row>
        </el-main>

        <!-- 修改应收确认弹出框 -->
        <el-dialog title="修改应收确认信息" :visible.sync="modifyReceiveConfirmDialog" width="700px">
            <el-form size="small" inline :model="modifyReceiveConfirmForm" :rules="receiveConfirmRules"
                     ref="modifyReceiveConfirmForm" label-width="100px">
                <el-form-item label="收入主体:" prop="incomeSubject">
                    <dictionary-select v-model="modifyReceiveConfirmForm.incomeSubject"
                                       option-name="LINE_INCOME_SUBJECT" style="width:215px"></dictionary-select>
                </el-form-item>
                <el-form-item label="客户全称:" prop="customerName">
                    <settlement-customer-select v-model="modifyReceiveConfirmForm.customerName"
                                                style="width:215px"></settlement-customer-select>
                </el-form-item>
                <el-form-item label="结算运费:" prop="settlementAmount">
                    <el-input v-model="modifyReceiveConfirmForm.settlementAmount" style="width:215px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="质量扣款:" prop="qualityDeductionsAmount">
                    <el-input v-model="modifyReceiveConfirmForm.qualityDeductionsAmount" style="width:215px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="安全扣款:" prop="securityDeductionsAmount">
                    <el-input v-model="modifyReceiveConfirmForm.securityDeductionsAmount" style="width:215px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="油价补差:" prop="oilPriceSupplement">
                    <el-input v-model="modifyReceiveConfirmForm.oilPriceSupplement" style="width:215px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="其他扣款:" prop="otherDeductionsAmount">
                    <el-input v-model="modifyReceiveConfirmForm.otherDeductionsAmount" style="width:215px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="客户车牌号:" prop="customerLicenseNumber">
                    <el-input v-model="modifyReceiveConfirmForm.customerLicenseNumber" style="width:215px"></el-input>
                </el-form-item>
                <el-form-item label="客户挂箱号:" prop="customerTrailer">
                    <el-input v-model="modifyReceiveConfirmForm.customerTrailer" style="width:215px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="modifyReceiveConfirmDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifySaveReceiveConfirm('modifyReceiveConfirmForm')">
                    确定
                </el-button>
            </div>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http, Api, Validate} from 'src/global'
    import {Common} from 'src/global/common'
    import axios from 'axios'

    export default {
        data() {
            return {
                exportLoading: true,
                downloadLoading: true,
                url: Api.receiveConfirm.upload,
                isMoreItemShow: false,
                isLoading: true,
                multipleSelection: [],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',
                    regionCode: '',
                    belongOrgCode: '',
                    lineCode: '',
                    departCityCodeList: [],
                    destCityCodeList: [],
                    incomeSubject: '',
                    customerName: '',
                    actualDepartureStartTime: Common.date.dateFormat(new Date(new Date().getTime() - 30*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    actualDepartureEndTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    confirmArrivalStartTime: '',//到达时间
                    confirmArrivalEndTime: '',
                    settlementStartTime: '',//应收结算时间
                    settlementEndTime: '',
                    vehicleLicenseNum: '',
                    vehicleNature: '',
                    auditUser: '',
                    auditStatus: '',
                    settlementUser: '',
                    billStatus: '',
                    customerCode: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                receiveConfirmRules: {
                    incomeSubject: [
                        {required: true, message: '请输入收入主体', trigger: 'blur'}
                    ],
                    customerName: [
                        {required: true, message: '请输入客户全称', trigger: 'blur'}
                    ],
                    settlementAmount: [
                        {required: true, message: '请输入结算运费', trigger: 'blur'},
                        Validate.allMoney
                    ],
                    qualityDeductionsAmount: [Validate.allMoney],
                    securityDeductionsAmount: [Validate.allMoney],
                    oilPriceSupplement: [Validate.allMoney],
                    otherDeductionsAmount: [Validate.allMoney],
                    customerLicenseNumber:[Validate.licenseNumber1],
                    customerTrailer:[Validate.trailerLicenseNumber]
                },
                modifyReceiveConfirmDialog: false,
                modifyReceiveConfirmForm: {
                    customerName: '',
                    receiveAmount: '',
                    feeAdjustAmount: '',
                    settlementAmount: '',
                    qualityDeductionsAmount: '',
                    securityDeductionsAmount: '',
                    oilPriceSupplement: '',
                    otherDeductionsAmount: '',
                    actualReceiveAmount: '',
                    receiveSettlementTime: '',
                    auditUser: '',
                    settlementUser: '',
                    customerLicenseNumber:'',//新增客户车牌号
                    customerTrailer:''//客户挂箱号
                }
            }
        },
        mounted() {
            //查询表格
            this.searchList();
        },
        computed: {
            settlementAmountValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].settlementAmount)
                    }
                }
                return sum.toFixed(2);
            },
            qualityDeductionsAmountValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].qualityDeductionsAmount)
                    }
                }
                return sum.toFixed(2);
            },
            securityDeductionsAmountValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].securityDeductionsAmount)
                    }
                }
                return sum.toFixed(2);
            },
            oilPriceSupplementValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].oilPriceSupplement)
                    }
                }
                return sum.toFixed(2);
            },
            otherDeductionsAmountValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].otherDeductionsAmount)
                    }
                }
                return sum.toFixed(2);
            },
            actualReceiveAmountValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].actualReceiveAmount)
                    }
                }
                return sum.toFixed(2);
            }
        },
        methods: {
            showMore() {
                let vm = this;
                vm.isMoreItemShow = true;
            },
            showLess() {
                let vm = this;
                vm.isMoreItemShow = false;
            },
            resetSearchParam() {
                this.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',
                    regionCode: '',
                    belongOrgCode: '',
                    lineCode: '',
                    departCityCodeList: [],
                    destCityCodeList: [],
                    incomeSubject: '',
                    customerName: '',
                    actualDepartureStartTime: Common.date.dateFormat(new Date(new Date().getTime() - 30*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    actualDepartureEndTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    confirmArrivalStartTime: '',//到达时间
                    confirmArrivalEndTime: '',
                    settlementStartTime: '',//应收结算时间
                    settlementEndTime: '',
                    vehicleLicenseNum: '',
                    vehicleNature: '',
                    auditUser: '',
                    auditStatus: '',
                    settlementUser: '',
                    billStatus: '',
                    customerCode: ''
                }
            },
            searchList() {
                let vm = this;
                if(!!vm.searchParam.waybillCode){
                    vm.searchParam.actualDepartureStartTime = '';
                    vm.searchParam.actualDepartureEndTime = '';
                }else{
                    // if(((!vm.searchParam.actualDepartureStartTime && !vm.searchParam.actualDepartureEndTime) || !!vm.searchParam.actualDepartureStartTime != !!vm.searchParam.actualDepartureEndTime)
                    //     && ((!vm.searchParam.confirmArrivalStartTime && !vm.searchParam.confirmArrivalEndTime) || !!vm.searchParam.confirmArrivalStartTime != !!vm.searchParam.confirmArrivalEndTime)){
                    //     return vm.$message.warning('请至少选择发车、到达时间中的一个进行查询！');
                    // }
                    if (!vm.searchParam.actualDepartureStartTime || !vm.searchParam.actualDepartureEndTime) {
                        return vm.$message.warning('发车时间不能为空！');
                    }
                    let overThirtyFlag = new Date(vm.searchParam.actualDepartureEndTime).getTime() - new Date(vm.searchParam.actualDepartureStartTime).getTime() > 31*24*3600*1000;
                    if (overThirtyFlag) {
                        return vm.$message.warning('最多可查询发车时间在一个月以内的数据！');
                    }
                }

                if (vm.searchParam.departCityCodeList) {
                    vm.searchParam.departCityCode = vm.searchParam.departCityCodeList[1];
                }
                if (vm.searchParam.destCityCodeList) {
                    vm.searchParam.destCityCode = vm.searchParam.destCityCodeList[1];
                }
                vm.isLoading = true;
                Http.get(Api.receiveConfirm.page, {params: vm.searchParam}, response => {
                    vm.searchResult.result = response.result;
                    vm.searchResult.totalCount = response.totalCount;
                    vm.searchParam.pageSize = response.pageSize;
                    vm.searchParam.currentPage = 1;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
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
            showWayBill(row){ //运单详情------------------------------------
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
                // window.open(href, '_blank');
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
            },
            //通过ID回显数据
            modifyReceiveConfirm(row) {
                let vm = this;
                Http.get(Api.receiveConfirm.queryById, {params: {'id': row.id}}, response => {
                    vm.modifyReceiveConfirmForm = response.result;
                    vm.modifyReceiveConfirmDialog = true;
                })
            },
            modifySaveReceiveConfirm(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.receiveConfirm.modify, vm.modifyReceiveConfirmForm, response => {
                            vm.modifyReceiveConfirmDialog = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            uploadSuccess() {
                let vm = this;
                vm.searchList();
            },
            createReceiveBill() {
                let vm = this;
                if (vm.multipleSelection && vm.multipleSelection.length == 0) {
                    this.$message('请选择需要生成应收对账结算单的数据');
                    return;
                }
                var ids = [];
                for (let i = 0; i < vm.multipleSelection.length; i++) {
                    if (vm.multipleSelection[i].billStatus) {
                        this.$message('该结算账单已生成');
                        return;
                    }
                    if (!vm.multipleSelection[i].incomeSubject || !vm.multipleSelection[i].customerName) {
                        this.$message('请先填写收入主体与客户全称');
                        return;
                    }
                    if (vm.multipleSelection[0].incomeSubject != vm.multipleSelection[i].incomeSubject ||
                        vm.multipleSelection[0].customerName != vm.multipleSelection[i].customerName) {
                        this.$message('只有收入主体与客户全称相同才能生成账单');
                        return;
                    }
                    if (vm.multipleSelection[i].settlementAmount==null) {
                        this.$message('请填写结算运费');
                        return;
                    }
                    ids.push(vm.multipleSelection[i].id);
                }
                this.$confirm('是否生成应收对账结算单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.receiveConfirm.createBill, ids, response => {
                        if (response.success) {
                            this.$message({
                                message: '生成应收对账结算单成功',
                                type: 'success'
                            });
                        }
                        vm.searchList();
                    })
                })
            },
            exportList(){
                let vm = this;
                vm.downloadLoading = false;
                axios.get(Api.receiveConfirm.templateDownload, {responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应收确认模板.xls';
                    link.click();
                    vm.downloadLoading = true;
                }).catch(reason => {
                    vm.downloadLoading = true;
                })
            },
            exportData(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.receiveConfirmExport.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应收确认导出.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
            /*exportData() {
                let vm = this;
                vm.exportLoading = false;
                if (vm.searchParam.departCityCodeList) {
                    vm.searchParam.departCityCode = vm.searchParam.departCityCodeList[1];
                }
                if (vm.searchParam.destCityCodeList) {
                    vm.searchParam.destCityCode = vm.searchParam.destCityCodeList[1];
                }
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.receiveConfirm.page, {params: searchExportParam}, response => {
                    let header = ['运单号', '客户简称', '收入主体', '客户全称', '大区', '小区', '是否生成结算账单','账单生成时间',
                        '应收运费', '运价调整', '结算运费', '质量扣款', '安全扣款',
                        '油价补差', '其他扣款', '实际应收', '应收结算时间', '结算人',
                        '线路名称', '车辆属性', '车牌号','挂厢号', '实际发车时间', '实际到达时间', '始发地', '目的地',
                        '运单性质', '线路里程','车型', '主司机姓名', '主司机电话', '车主姓名', '车主电话', '回单号'
                    ];
                    let filterVal = ['waybillCode', 'waybill.dispatch.customer.name', 'incomeSubject', 'customerName', 'waybill.dispatch.region.name', 'waybill.dispatch.belongOrg.name',
                        {
                            type: 'dictionary',
                            'code': 'BOOLEAN_FLAG',
                            'name': 'billStatus'
                        }, 'billGenerationTime',
                            'receiveAmount', 'feeAdjustAmount', 'settlementAmount', 'qualityDeductionsAmount', 'securityDeductionsAmount',
                            'oilPriceSupplement', 'otherDeductionsAmount', 'actualReceiveAmount', 'receiveSettlementTime', 'settlementUser',
                            'waybill.dispatch.dispatchLine.lineName',
                        {
                            type: 'dictionary',
                            'code': 'VEHICLE_OPERATION_MODE',
                            'name': 'waybill.dispatch.dispatchVehicle.vehicleNature'
                        }, 'waybill.dispatch.dispatchVehicle.vehicleLicenseNum','waybill.dispatch.dispatchVehicle.trailerLicenseNum', 'waybill.actualDepartureTime', 'waybill.confirmArrivalTime', 'waybill.dispatch.dispatchLine.startStation.city.name', 'waybill.dispatch.dispatchLine.endStation.city.name',
                        {
                            type: 'dictionary',
                            'code': 'LINE_OPERATION_TYPE',
                            'name': 'waybill.dispatch.dispatchLine.operationType'
                        },'waybill.dispatch.dispatchLine.distance', 'waybill.dispatch.dispatchVehicle.specification', 'waybill.dispatch.dispatchVehicle.driverName', 'waybill.dispatch.dispatchVehicle.driverPhone', 'vehicleOwner.name', 'vehicleOwner.mobile', 'waybill.receiptCodes'
                    ];
                    Common.excel.downloadExl(response.result, header, filterVal, "应收确认导出");
                    vm.exportLoading = true;
                },()=>{
                    vm.exportLoading = true;
                })
            },*/
        }
    }
</script>
