<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 应收管理</el-breadcrumb-item>
                <el-breadcrumb-item>应收账单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="110px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="账单编号:">
                            <el-input v-model="searchParam.billCode" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="账单生成人员:">
                            <el-input v-model="searchParam.billCreateUser" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="账单生成时间:">
                            <el-date-picker
                                v-model="searchParam.billCreateTime"
                                style="width: 100%"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户全称:">
                            <settlement-customer-select v-model="searchParam.customerName" style="display:block"></settlement-customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="收款状态:">
                            <dictionary-select v-model="searchParam.payeeStatus" option-name="PAYEE_STATUS" style="display:block" ></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam" size="small">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" size="mini" type="primary" icon="el-icon-download" @click="exportData" v-permission="'/receiveBill/export'">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-button v-if="deleteLoading" v-permission="'/receiveBill/batchDelete'" type="primary" size="mini" style="margin-left: 10px;" :disabled="batchDeleteBtnDisabled"  @click="batchDeleteReceiveBill(multipleSelection)">批量删除</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>删除中...</el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" v-loading="isLoading" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="账单编号" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showReceiveBill(scope.row)">{{scope.row.billCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="收入主体" prop="incomeSubject" show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column header-align="center" label="客户全称" prop="customerName" show-overflow-tooltip min-width="220"></el-table-column>
                <el-table-column align="center" label="应收运费" prop="receiveAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运价调整" prop="feeAdjustAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算运费" prop="settlementAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="质量扣款" prop="qualityDeductionsAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="安全扣款" prop="securityDeductionsAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油价补差" prop="oilPriceSupplement" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="其他扣款" prop="otherDeductionsAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际应收" prop="actualReceiveAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="收款状态" prop="payeeStatus" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="PAYEE_STATUS" :value="scope.row.payeeStatus"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="收款金额" prop="payeeAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="收款时间" prop="payeeTime" min-width="150" ></el-table-column>
                <el-table-column align="center" label="发票日期" prop="invoiceMonth" min-width="150"></el-table-column>
                <el-table-column align="center" label="发票号" prop="invoiceNo" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="备注" prop="invoiceRemark"  show-overflow-tooltip min-width="180"></el-table-column>
                <el-table-column align="center" label="发票照片" min-width="130">
                    <template slot-scope="scope">
                        <show-image :url="scope.row.invoiceImage"></show-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="进账回单照片" min-width="130">
                    <template slot-scope="scope">
                        <show-image :url="scope.row.returnCodeImage"></show-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="客户账单" min-width="130">
                    <template slot-scope="scope">
                        <show-image-and-file :url="scope.row.customerBill"></show-image-and-file>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="账单生成人" prop="createUser" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="账单生成时间" prop="createTime"  min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="100">
                    <template slot-scope="scope">
                        <el-button type="text"  icon="el-icon-edit" size="mini" v-permission="'/receiveBill/modify'"
                                   @click="modifyReceiveBill(scope.row)"></el-button>
                        <el-button type="text"  icon="el-icon-delete" size="mini"  v-permission="'/receiveBill/delete'"
                                   @click="deleteReceiveBill(scope.row)"></el-button>
                    </template>
                </el-table-column>
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

        <!-- 修改应收账单弹出框 -->
        <el-dialog title="修改应收账单信息" :visible.sync="modifyReceiveBillDialog" width="50%">
            <el-form size="small" :model="modifyReceiveBillForm" :rules="rules" ref="modifyReceiveBillForm" label-width="120px">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="收入主体:" prop="incomeSubject" :rules="[validate.required('收入主体',true)]">
                            <dictionary-select style="display: block" v-model="modifyReceiveBillForm.incomeSubject" option-name="LINE_INCOME_SUBJECT"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="客户全称:" prop="customerName" :rules="[validate.required('客户全称',true)]">
                            <settlement-customer-select style="display: block" v-model="modifyReceiveBillForm.customerName" ></settlement-customer-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="收款金额:" prop="payeeAmount" :rules="[validate.allMoney]">
                            <el-input  v-model="modifyReceiveBillForm.payeeAmount">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="收款状态:" prop="payeeStatus">
                            <dictionary-select style="display: block" v-model="modifyReceiveBillForm.payeeStatus" option-name="PAYEE_STATUS"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="收款时间:">
                            <date-time-picker-single v-model="modifyReceiveBillForm.payeeTime" date-type="start"></date-time-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="发票日期:" prop="invoiceMonth">
                            <el-date-picker
                                v-model="modifyReceiveBillForm.invoiceMonth"
                                type="date"
                                value-format="yyyy-MM-dd"
                                style="display: block;width: 100%"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="发票号:" prop="invoiceNo">
                            <el-input v-model="modifyReceiveBillForm.invoiceNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注:" prop="invoiceRemark">
                            <el-input type="textarea" :rows="2" v-model="modifyReceiveBillForm.invoiceRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="发票照片:" prop="invoiceImage">
                            <upload-image ref="receiveBillInvoiceImage"></upload-image>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="进账回单照片:" prop="returnCodeImage">
                            <upload-image ref="receiveBillReturnCodeImage"></upload-image>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="客户账单:" prop="customerBill">
                            <upload-image ref="receiveBillCustomerBill"></upload-image>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="modifyReceiveBillDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifySaveReceiveBill('modifyReceiveBillForm')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="应收账单详情" :visible.sync="receiveBillDetailDialog" width="80%">
            <el-button v-if="exportDetailLoading" size="mini" type="primary" icon="el-icon-download" @click="exportDataDetail">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table class="content-table" :data="searchDetailResult.result" element-loading-text="拼命加载中"
                      size="small"
                      border fit highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="账单编号" prop="billCode" min-width="160px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单号" prop="waybillCode" min-width="150px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="客户简称" prop="waybill.dispatch.customer.name" show-overflow-tooltip min-width="120px"></el-table-column>
                <el-table-column align="center" label="收入主体" prop="incomeSubject" show-overflow-tooltip min-width="180px"></el-table-column>
                <el-table-column align="center" label="客户全称" prop="customerName" show-overflow-tooltip min-width="180px"></el-table-column>
                <el-table-column align="center" label="大区" prop="waybill.dispatch.region.name" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="小区" prop="waybill.dispatch.belongOrg.name" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="是否生成结算账单" min-width="120px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.billStatus ? "是":"否"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="账单生成时间" prop="billGenerationTime" min-width="140px" show-overflow-tooltip></el-table-column>
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
                <el-table-column align="center" label="线路名称" prop="waybill.dispatch.dispatchLine.lineName" show-overflow-tooltip min-width="240px"></el-table-column>
                <el-table-column align="center" label="车辆属性" min-width="100px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="scope.row.waybill.dispatch.dispatchVehicle.vehicleNature"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="车牌号" prop="waybill.dispatch.dispatchVehicle.vehicleLicenseNum" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="挂厢号" prop="waybill.dispatch.dispatchVehicle.trailerLicenseNum" min-width="100px" show-overflow-tooltip></el-table-column>
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
            </el-table>
            <div style="height: 50px" v-if="receiveBillDetailDialog">
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChangeDetail"
                        @current-change="handleCurrentChangeDetail"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="searchDetailParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchDetailResult.totalCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Validate} from 'src/global/validate'
    import {Common} from 'src/global/common'
    import axios from 'axios'

    export default {
        data() {
            return {
                validate: Validate,//校验
                exportLoading: true,
                deleteLoading: true,
                exportDetailLoading: true,
                isLoading: true,
                initializeModel: {},
                multipleSelection: [],
                multipleDetailSelection:[],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    billCode: '',
                    waybillCode: '',
                    billCreateUser: '',
                    billCreateTime: '',
                    customerName: '',
                    payeeStatus:'',
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                //查询参数
                searchDetailParam: {
                    currentPage: 1,
                    pageSize: 10,
                    billCode: ''
                },
                //返回结果
                searchDetailResult: {
                    totalCount: 0,
                    result: []
                },
                modifyReceiveBillDialog:false,
                modifyReceiveBillForm:{
                    invoiceNo:'',
                    incomeSubject:'',
                    customerName:'',
                    payeeStatus:'',
                    invoiceMonth:'',
                    invoiceImage:'',
                    returnCodeImage:'',
                    payeeAmount:'',
                    payeeTime:'',//收款时间
                    invoiceRemark:'',
                    customerBill:'',//客户账单
                    actualReceiveAmount:'',//实际应收
                },
                receiveBillDetailDialog:false,
                rules: {
                    customerBill: [
                        {required: true, message: '请上传客户账单', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            //查询表格
            this.searchList();
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
        },
        computed: {
            batchDeleteBtnDisabled(){
                if(!(this.multipleSelection.length>0)){
                    return true
                }
            },
        },
        watch:{
            //监听收款金额
            'modifyReceiveBillForm.payeeAmount'() {
                let vm = this;
                if(vm.modifyReceiveBillForm.payeeAmount){
                   let payeeAmount = parseInt(vm.modifyReceiveBillForm.payeeAmount);
                   let actualReceiveAmount = parseInt(vm.modifyReceiveBillForm.actualReceiveAmount);
                   if(payeeAmount == 0){
                       vm.modifyReceiveBillForm.payeeStatus = 'NO_PAYEE';
                   }else {
                       if(payeeAmount>0 && payeeAmount<actualReceiveAmount){
                           vm.modifyReceiveBillForm.payeeStatus = 'PART_PAYEE';
                       }else{
                           vm.modifyReceiveBillForm.payeeStatus = 'ALL_PAYEE';
                       }
                   }
                }else{
                    vm.modifyReceiveBillForm.payeeStatus = 'NO_PAYEE';
                }
            },
        },
        methods: {
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam = vm.cloneMode().searchParam;
            },
            searchList() {
                let vm = this;
                if (vm.searchParam.billCreateTime) {
                    vm.searchParam.billCreateStartTime = vm.searchParam.billCreateTime[0];
                    vm.searchParam.billCreateEndTime = vm.searchParam.billCreateTime[1];
                } else {
                    vm.searchParam.billCreateStartTime = "";
                    vm.searchParam.billCreateEndTime = "";
                }
                vm.isLoading = true;
                Http.get(Api.receiveBill.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            searchDetailList(){
                let vm = this;
                Http.get(Api.receiveConfirm.pageDetail, {params: vm.searchDetailParam}, response => {
                    vm.searchDetailResult.result = response.result;
                    vm.searchDetailResult.totalCount = response.totalCount;
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

            handleSizeChangeDetail(val) {
                let vm = this;
                vm.searchDetailParam.pageSize = val;
                this.searchDetailList();
            },
            handleCurrentChangeDetail(val) {
                let vm = this;
                vm.searchDetailParam.currentPage = val;
                this.searchDetailList();
            },
            modifySaveReceiveBill(formName) {
                let vm = this;
                if (vm.modifyReceiveBillForm.payeeStatus == 'NO_PAYEE' && vm.modifyReceiveBillForm.payeeTime) {
                    vm.$message.warning("收款状态为【未收款】时，不能选择【收款时间】");
                    return;
                }
                if ( (vm.modifyReceiveBillForm.payeeStatus == 'ALL_PAYEE' || vm.modifyReceiveBillForm.payeeStatus == 'PART_PAYEE' ) && !vm.modifyReceiveBillForm.payeeTime) {
                    vm.$message.warning("【收款金额>0】时，必须选择【收款时间】");
                    return;
                }
                vm.$nextTick(() => {
                    vm.modifyReceiveBillForm.customerBill = vm.$refs.receiveBillCustomerBill.getFileList()
                    if (vm.$refs.receiveBillCustomerBill.getFileList().length > 0) {
                        vm.modifyReceiveBillForm.customerBill = vm.$refs.receiveBillCustomerBill.getFileList().join(",")
                    }
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            vm.modifyReceiveBillForm.invoiceImage = this.$refs.receiveBillInvoiceImage.getFileList().join(",");
                            vm.modifyReceiveBillForm.returnCodeImage = this.$refs.receiveBillReturnCodeImage.getFileList().join(",");
                            // vm.modifyReceiveBillForm.customerBill = this.$refs.receiveBillCustomerBill.getFileList().join(",");
                            Http.post(Api.receiveBill.modify, vm.modifyReceiveBillForm, response => {
                                vm.modifyReceiveBillDialog = false;
                                vm.searchList();
                            })
                        } else {
                            return false;
                        }
                    });
                })
            },
            //通过ID回显数据
            modifyReceiveBill(row) {
                let vm = this;
                Http.get(Api.receiveBill.queryById, {params: {'id': row.id}}, response => {
                    setTimeout(() => {
                        vm.$refs.receiveBillInvoiceImage.clearFileList();
                        vm.$refs.receiveBillReturnCodeImage.clearFileList();
                        vm.$refs.receiveBillCustomerBill.clearFileList();
                        vm.$refs.receiveBillInvoiceImage.setFileList(response.result.invoiceImage ? response.result.invoiceImage.split(",") : null);
                        vm.$refs.receiveBillReturnCodeImage.setFileList(response.result.returnCodeImage ? response.result.returnCodeImage.split(",") : null);
                        vm.$refs.receiveBillCustomerBill.setFileList(response.result.customerBill ? response.result.customerBill.split(",") : null);
                        vm.modifyReceiveBillForm = response.result;
                    }, 0)
                    vm.modifyReceiveBillDialog = true;
                })
            },
            // 删除账单
            deleteReceiveBill(row) {
                let vm = this;
                let ids = [];
                ids.push(row.id);
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.receiveBill.delete, ids, () => {
                        this.$message({
                            message: '删除账单成功!',
                            type: 'success'
                        });
                        vm.searchList();
                    })
                })

            },
            // 删除账单
            batchDeleteReceiveBill(rows) {
                let vm = this;
                vm.deleteLoading = false;
                let ids = [];
                for (let i=0; i < rows.length; i++) {
                    ids.push(rows[i].id);
                }
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.receiveBill.delete, ids, () => {
                        this.$message({
                            message: '删除账单成功!',
                            type: 'success'
                        });
                        vm.searchList();
                        vm.deleteLoading = true;
                    }, result => {
                        vm.exportLoading = true;
                    })
                })

            },
            showReceiveBill(row){
                let vm = this;
                vm.searchDetailParam.billCode=row.billCode;
                vm.searchDetailParam.currentPage = 1;
                Http.get(Api.receiveConfirm.pageDetail, {params: vm.searchDetailParam}, response => {
                    vm.searchDetailResult.result = response.result;
                    vm.searchDetailResult.totalCount = response.totalCount;
                    vm.receiveBillDetailDialog = true;
                })
            },
            exportData() {
                let vm = this;
                vm.exportLoading = false;
                if (vm.searchParam.billCreateTime) {
                    vm.searchParam.billCreateStartTime = vm.searchParam.billCreateTime[0];
                    vm.searchParam.billCreateEndTime = vm.searchParam.billCreateTime[1];
                } else {
                    vm.searchParam.billCreateStartTime = "";
                    vm.searchParam.billCreateEndTime = "";
                }
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.receiveBill.page,  {params: searchExportParam}, response => {
                    let header = ['账单编号','收入主题','客户全称','应收运费','运价调整',
                        '结算运费','质量扣款','安全扣款','油价补差','其他扣款',
                        '实际应收','收款状态','收款金额','收款时间','发票日期','发票号','备注',
                        '账单生成人','账单生成时间'
                    ];
                    let filterVal = ['billCode','incomeSubject','customerName','receiveAmount','feeAdjustAmount',
                        'settlementAmount','qualityDeductionsAmount','securityDeductionsAmount','oilPriceSupplement','otherDeductionsAmount',
                        'actualReceiveAmount', {
                            type: 'dictionary',
                            'code': 'PAYEE_STATUS',
                            'name': 'payeeStatus'
                        },'payeeAmount','payeeTime','invoiceMonth','invoiceNo','invoiceRemark',
                        'createUser','createTime'
                    ];
                    Common.excel.downloadExl(response.result,header,filterVal,"应收账单导出");
                    vm.exportLoading = true;
                }, result => {
                    vm.exportLoading = true;
                })
            },
            exportDataDetail(){
                let vm = this;
                vm.exportDetailLoading = false;
                axios.get(Api.receiveBillDetail.export, {params: vm.searchDetailParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应收账单详情导出.xls';
                    link.click();
                    vm.exportDetailLoading = true;
                }).catch(reason => {
                    vm.exportDetailLoading = true;
                })
            }
            // exportDataDetail() {
            //     let vm = this;
            //     vm.exportDetailLoading = false;
            //     let searchExportParam = _.cloneDeep(vm.searchDetailParam);
            //     searchExportParam.pageSize = 50000;
            //     searchExportParam.currentPage = 1;
            //     Http.get(Api.receiveConfirm.pageDetail,  {params: searchExportParam}, response => {
            //         let header = ['账单编号','运单号', '客户简称', '收入主体', '客户全称', '大区', '小区', '是否生成结算账单','账单生成时间',
            //             '应收运费', '运价调整', '结算运费', '质量扣款', '安全扣款',
            //             '油价补差', '其他扣款', '实际应收', '应收结算时间', '结算人',
            //             '线路名称', '车辆属性', '车牌号','挂厢号', '实际发车时间', '实际到达时间', '始发地', '目的地',
            //             '运单性质', '线路里程','车型', '主司机姓名', '主司机电话', '车主姓名', '车主电话', '回单号'
            //         ];
            //         let filterVal = ['billCode','waybillCode', 'waybill.dispatch.customer.name', 'incomeSubject', 'customerName', 'waybill.dispatch.region.name', 'waybill.dispatch.belongOrg.name',
            //             {
            //                 type: 'dictionary',
            //                 'code': 'BOOLEAN_FLAG',
            //                 'name': 'billStatus'
            //             }, 'billGenerationTime',
            //             'receiveAmount', 'feeAdjustAmount', 'settlementAmount', 'qualityDeductionsAmount', 'securityDeductionsAmount',
            //             'oilPriceSupplement', 'otherDeductionsAmount', 'actualReceiveAmount', 'receiveSettlementTime', 'settlementUser',
            //             'waybill.dispatch.dispatchLine.lineName',
            //             {
            //                 type: 'dictionary',
            //                 'code': 'VEHICLE_OPERATION_MODE',
            //                 'name': 'waybill.dispatch.dispatchVehicle.vehicleNature'
            //             }, 'waybill.dispatch.dispatchVehicle.vehicleLicenseNum','waybill.dispatch.dispatchVehicle.trailerLicenseNum', 'waybill.actualDepartureTime', 'waybill.confirmArrivalTime', 'waybill.dispatch.dispatchLine.startStation.city.name', 'waybill.dispatch.dispatchLine.endStation.city.name',
            //             {
            //                 type: 'dictionary',
            //                 'code': 'LINE_OPERATION_TYPE',
            //                 'name': 'waybill.dispatch.dispatchLine.operationType'
            //             },'waybill.dispatch.dispatchLine.distance', 'waybill.dispatch.dispatchVehicle.specification', 'waybill.dispatch.dispatchVehicle.driverName', 'waybill.dispatch.dispatchVehicle.driverPhone', 'vehicleOwner.name', 'vehicleOwner.mobile', 'waybill.receiptCodes'
            //         ];
            //         Common.excel.downloadExl(response.result,header,filterVal,"应收账单详情导出");
            //         vm.exportDetailLoading = true;
            //     }, result => {
            //         vm.exportDetailLoading = true;
            //     })
            // },
        }
    }
</script>
