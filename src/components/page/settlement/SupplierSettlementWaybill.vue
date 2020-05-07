<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 应付管理</el-breadcrumb-item>
                <el-breadcrumb-item>旧供应商查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单编号:">
                            <el-input v-model="searchParam.waybillCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierCode"
                                             placeholder="请输入供应商"
                                             type="PLANTFORM_COMPANY"
                                             style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达开始时间:">
                            <date-picker-single v-model="searchParam.confirmArrivalStartTime"
                                                date-type="start"
                                                :end-date="searchParam.confirmArrivalEndTime"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达结束时间:">
                            <date-picker-single v-model="searchParam.confirmArrivalEndTime"
                                                date-type="end"
                                                :start-date="searchParam.confirmArrivalStartTime"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="开票金额:">
                            <el-input v-model="searchParam.invoiceAmount"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="顺丰C端:">
                            <el-switch v-model="searchParam.isSfClient" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="float: right">
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
            <!--<el-button v-if="btnLoading" v-permission="'/xx/export'" size="mini" type="primary"
                       icon="el-icon-download" @click="exportData">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>-->
            <el-button v-if="addBillLoading" :disabled="multipleSelection.length==0" v-permission="'/supplierSettlementWaybill/add'"
                       size="mini" type="primary" icon="el-icon-check"
                       style="display: inline-block; margin-left: 10px;"
                       @click="addBill()">勾选生成账单
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>生成中...</el-button>
            <el-button v-if="addAllBillLoading" v-permission="'/supplierSettlementWaybill/addAll'"
                       size="mini" type="danger" icon="el-icon-search"
                       style="display: inline-block; margin-left: 10px;"
                       @click="addAllBill()">全部生成账单
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>生成中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit highlight-current-row stripe :height="tableHeight">
                <el-table-column type="selection"/>
                <el-table-column type="index" label="索引" min-width="65" width="65" fixed>
                    <template slot-scope="scope">
                        {{ tableIndex(scope.row,scope.$index) }}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单编号" prop="waybillCode" min-width="120px" fixed/>
                <el-table-column align="center" label="序列号" prop="departureNumber" min-width="120" show-overflow-tooltip/>
                <el-table-column label="运单状态" prop="waybillStatus" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAY_BILL_STATUS" :value="scope.row.waybillStatus"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="客户全称" prop="customerName" min-width="120px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="大区" prop="regionName" min-width="120px"/>
                <el-table-column header-align="center" label="小区" prop="belongOrgName" min-width="120px"/>
                <el-table-column header-align="center" label="供应商" prop="supplierName" min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="承运商" prop="shipperName" min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="车牌号" prop="vehicleLicenseNum" min-width="120px"/>
                <el-table-column header-align="center" label="实际发车时间" prop="actualDepartureTime" min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="实际到达时间" prop="confirmArrivalTime" min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="签收时间" prop="signTime" min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="油卡卡号" prop="oilCardNumber" min-width="150px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="线路" prop="lineName" min-width="250px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="应付运费" prop="paidVehicleAmount" min-width="120px"/>
                <el-table-column header-align="center" label="调整金额" prop="adjustAmount" min-width="120px"/>
                <el-table-column header-align="center" label="质量扣款(调减)" prop="qualityDeductionsAmount" min-width="120px"/>
                <el-table-column header-align="center" label="线路管理费" prop="insuranceFee" min-width="120px"/>
                <el-table-column header-align="center" label="开票金额" prop="invoiceAmount" min-width="120px"/>
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

                <el-table-column header-align="center" label="运单备注" prop="waybillRemark" min-width="200px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.repeatSettlement ? "运单价格差异补差价" : scope.row.waybillRemark}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="始发地" prop="startStationName" min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="目的地" prop="endStationName" min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="营运类型" prop="operationType" min-width="120px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_OPERATION_TYPE"  :value="scope.row.operationType"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车长" prop="vehicleSpecification" min-width="120px"/>
                <el-table-column header-align="center" label="主司机姓名" prop="driverName" min-width="120px"/>
                <el-table-column header-align="center" label="主司机电话" prop="driverMobile" min-width="120px"/>
                <el-table-column header-align="center" label="应付合同号" prop="contractCode" min-width="150px" show-overflow-tooltip/>
            </el-table>
            <el-row>
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 100, 500, 1000]"
                        :page-size="searchParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchResult.totalCount">
                    </el-pagination>
                </div>
            </el-row>
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
        </el-main>
    </el-container>
</template>

<script>
    import {Api, Common, Constant, Http, Validate} from 'src/global'
    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: false,
                btnLoading: true,
                addBillLoading: true,
                addAllBillLoading: true,
                Api: Api,
                searchParam: {//查询参数
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
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                tableHeight: window.innerHeight > 800 ? 430 : null
            }
        },
        computed: {
            invoiceAmount() {
                let num = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    this.multipleSelection.forEach((a) => {
                        num = Common.util.numberFormat(num + Common.util.numberFormat(a.settlementOfFreight - a.qualityDeductionsAmount - a.insuranceFee, 2));
                    });
                }
                return num.toFixed(2);
            },
            settlementOfFreight1() {
                let num = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    this.multipleSelection.forEach((a) => {
                        num = Common.util.numberFormat(num + a.settlementOfFreight, 2);
                    });
                }
                return num.toFixed(2);
            },
            agingDeductions() {
                let num = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    this.multipleSelection.forEach((a) => {
                        num = Common.util.numberFormat(num + a.qualityDeductionsAmount, 2);
                    });
                }
                return num.toFixed(2);
            },
            lineAmount() {
                let num = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    this.multipleSelection.forEach((a) => {
                        num = Common.util.numberFormat(num + a.insuranceFee, 2);
                    });
                }
                return num.toFixed(2);
            }
        },
        methods: {
            tableIndex(row, index) {
                row.index = index;
                return index + 1
            },
            resetSearchParam() {//重置参数
                this.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    excludeList: [],
                    supplierCode: '',
                    waybillCode: '',
                    invoiceAmount: '',
                    isSfClient: false,
                    confirmArrivalStartTime: '',
                    confirmArrivalEndTime: ''
                }
            },
            searchList() {//查询
                if (!this.searchParam.supplierCode) {
                    this.$message.warning("请选择供应商");
                    return;
                }
                this.isLoading = true;
                Http.post(Api.payableConfirm.getSupplierSettlementWaybillPage, this.searchParam, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize
                    this.isLoading = false;
                }, ()=>{
                    this.isLoading = false;
                })
            },
            addBill() {
                let waybillList = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    waybillList.push(this.multipleSelection[i].waybillCode);
                }
                this.$confirm('是否根据勾选数据生成账单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.addBillLoading = false;
                    Http.post(Api.supplierBillOutInvite.add, waybillList, response => {
                        this.$message.success("成功")
                        this.searchList();
                        this.addBillLoading = true;
                    }, ()=>{
                        this.addBillLoading = true;
                    })
                })
            },
            addAllBill() {
                if (!this.searchParam.supplierCode) {
                    this.$message.warning("请选择供应商");
                    return;
                }
                if (!this.searchParam.confirmArrivalStartTime || !this.searchParam.confirmArrivalEndTime) {
                    this.$message.warning("全部生成账单必须选择【到达开始时间】和【到达结束时间】");
                    return;
                }
                if (this.searchParam.confirmArrivalEndTime > '2019-09-01') {
                    this.$message.warning("【到达结束时间】必须在2019-09-01之前");
                    return;
                }
                let waybillList = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    waybillList.push(this.multipleSelection[i].waybillCode);
                }
                this.$confirm('是否根据所选条件生成账单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.addAllBillLoading = false;
                    Http.post(Api.supplierBillOutInvite.addAll, this.searchParam, response => {
                        this.$message.success("成功")
                        this.searchList();
                        this.addAllBillLoading = true;
                    }, ()=>{
                        this.addAllBillLoading = true;
                    })
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
                this.btnLoading = false;
                let searchExportParam = _.cloneDeep(this.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.refuelingDriverAccount.page, {params: searchExportParam}, response => {
                    let header = ['油卡编号', '司机','司机电话', '账户余额'];
                    let filterVal = ['oilCardCode','driverName','driverPhone', 'accountAmount'];
                    Common.excel.downloadExl(response.result, header, filterVal, "结算运单导出");
                    this.btnLoading = true;
                }, () => {
                    this.btnLoading = true;
                })
            }
        }
    }
</script>

