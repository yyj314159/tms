<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运报表</el-breadcrumb-item>
                <el-breadcrumb-item>发车汇总</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="收入主体:" prop="incomeSubject">
                            <dictionary-select v-model="searchParam.incomeSubject"
                                               option-name="LINE_INCOME_SUBJECT"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商全称:">
                            <supplier-select v-model="searchParam.supplierCode" style="display: block"></supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.belongOrgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select v-model="searchParam.vehicleNature" style="display:block" option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
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
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" auditStatus="PASS"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户全称:">
                            <settlement-customer-select v-model="searchParam.customerName" style="display:block"></settlement-customer-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
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
                    <el-col :span="6">
                        <el-form-item label="车型:">
                            <dictionary-select style="display: block" option-name="VEHICLE_SPECIFICATION" v-model="searchParam.specification"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="油卡卡号:">
                            <oil-card-select v-model="searchParam.oilCardNumber" style="display: block;"></oil-card-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleLicenseNum" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineCode" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发地:">
                            <district-select  v-model="searchParam.departCityArr" style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的地:">
                            <district-select  v-model="searchParam.destCityArr" style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单状态:">
                            <dictionary-select v-model="searchParam.waybillStatus" style="display:block" option-name="WAY_BILL_STATUS"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单签收开始:">
                            <date-picker-single v-model="searchParam.waybillSignTimeStartTime" date-type="start" :end-date="searchParam.waybillSignTimeEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单签收结束:">
                            <date-picker-single v-model="searchParam.waybillSignTimeEndTime" date-type="end" :start-date="searchParam.waybillSignTimeStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="应收结算开始:">
                            <date-picker-single v-model="searchParam.receiveSettlementStartTime" date-type="start" :end-date="searchParam.receiveSettlementEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应收结算结束:">
                            <date-picker-single v-model="searchParam.receiveSettlementEndTime" date-type="end" :start-date="searchParam.receiveSettlementStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应付结算开始:">
                            <date-picker-single v-model="searchParam.paidSettlementStartTime" date-type="start" :end-date="searchParam.paidSettlementEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应付结算结束:">
                            <date-picker-single v-model="searchParam.paidSettlementEndTime" date-type="end" :start-date="searchParam.paidSettlementStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="应收计价方式:">
                            <dictionary-select style="display: block" option-name="LINE_PRICE_TYPE" :excludeOptions="['ALL_DAY']"
                                               v-model="searchParam.receivePriceType"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="text" v-show="!isMoreItemShow" @click="isMoreItemShow = true" size="small">展开更多搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="isMoreItemShow = false" size="small">收起搜索项<<
                            </el-button>
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/launchSummary/export'" icon="el-icon-download"  type="primary" size="mini"  @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="运单号" min-width="130">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="客户简称" prop="customerAllName" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="收入主体" prop="incomeSubject" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="客户全称" prop="customerName" min-width="220" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="大区" prop="regionName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="小区" prop="belongOrgName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="lineName" min-width="300" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车辆属性" prop="vehicleNature" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="自营属性" prop="selfOperationMode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="供应商" prop="supplierName" min-width="220" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车牌号" prop="vehicleLicenseNum" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="挂厢号" prop="trailerLicenseNum" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际发车时间" prop="actualDepartureTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际到达时间" prop="confirmArrivalTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="计价方式(应收)" prop="receivePriceType" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="重量/体积(应收)" prop="receivePriceNum" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="计价方式(应付)" prop="paidPriceType" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="重量/体积(应付)" prop="paidPriceNum" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="应收运费(应收)" prop="receiveAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="应付运费(应付)" prop="paidVehicleAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运费调整调增(应收)" prop="receiveFeeAdjustAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运费调整(应付)" prop="paidAdjustAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算运费(应收)"  prop="receiveSettlementAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算运费(应付)" prop="paidSettlementAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="质量扣款调减(应收)" prop="receiveQualityDeductionsAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="时效扣款(应付)" prop="paidQualityDeductionsAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="安全扣款调减(应收)" prop="receiveSecurityDeductionsAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油价补差调减(应收)" prop="receiveOilPriceSupplement" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油价补差(应付)" prop="paidOilPriceSupplement" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="其他扣款调减(应收)" prop="receiveOtherDeductionsAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="其他扣款(应付)" prop="paidOtherDeductionsAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="火灾险服务费(应付)" prop="insuranceFee" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="打款手续费(应付)" prop="handTransferFee" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际应收(应收)" prop="receiveActualReceiveAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际应付(应付)" prop="actualPaidVehicleAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="尾款(应付)"    prop="paidReturnAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="发票号" prop="invoiceNo" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="开票月份" prop="invoiceMonth" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="对账单号(应收)" prop="receiveBillCode" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算状态(应收)" prop="receiveSettlementStatus" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算时间(应收)" prop="receiveSettlementTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算状态(应付)" prop="paidSettlementStatus" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算时间(应付)" prop="paidSettlementTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单状态" prop="waybillStatus" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单签收时间" prop="receiptSignTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油卡卡号" prop="oilCardNumber" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油卡金额" prop="oilCardAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="定点加油金额" prop="refuelingAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="预付打卡" prop="prepaidCardAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="货到打款" prop="deliveryAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="收款人" prop="paidPayee" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="开户行" prop="paidOpeningBank" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="收款银行卡号" prop="dueBankCardNo" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油卡押金" prop="oilCardDeposit" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="GPS押金" prop="gpsDeposit" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="回单押金" prop="returnDeposit" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单备注" prop="remark" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="始发地" prop="startCityName" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="目的地" prop="endCityName" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单性质" prop="operationType" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="线路里程" prop="distance" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车型" prop="specification" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="主司机姓名" prop="driverName" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="主司机电话" prop="driverPhone" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车主姓名" prop="vehicleOwnerName" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车主电话" prop="vehicleOwnerMobile" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="回单号" prop="receiptCodes" min-width="180" show-overflow-tooltip></el-table-column>
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
    </el-container>
</template>

<script>
    import {Http,Api,Validate,Common,Constant} from 'src/global'
    import axios from 'axios'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                isMoreItemShow: false,
                exportLoading: true,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    incomeSubject: '',//收入主体
                    supplierCode: '',//供应商全称
                    belongOrgCode: '',//所属区域
                    vehicleNature: '',//车辆属性
                    actualDepartureStartTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 00:00:00"),//发车时间
                    actualDepartureEndTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    customerCode: '',//客户
                    customerName: '',//客户全称
                    confirmArrivalStartTime: '',//到达时间
                    confirmArrivalEndTime: '',
                    specification: '',//车型
                    oilCardNumber: '',//油卡卡号
                    vehicleLicenseNum: '',//车牌号
                    lineCode: '',//线路名称
                    departCityArr: [],//始发地
                    departCityCode: '',
                    destCityArr: [],//目的地
                    destCityCode: '',
                    waybillCode: '',//运单号
                    waybillStatus: '',//运单状态
                    waybillSignTimeStartTime:'',//运单签收时间
                    waybillSignTimeEndTime:'',
                    receiveSettlementStartTime: '',//应收结算时间
                    receiveSettlementEndTime: '',
                    paidSettlementStartTime: '',//应付结算时间
                    paidSettlementEndTime: '',
                    receivePriceType: '' //应收计价方式
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                }
            }
        },
        mounted() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    incomeSubject: '',//收入主体
                    supplierCode: '',//供应商全称
                    belongOrgCode: '',//所属区域
                    vehicleNature: '',//车辆属性
                    actualDepartureStartTime: '',//发车时间
                    actualDepartureEndTime: '',
                    customerCode: '',//客户
                    customerName: '',//客户全称
                    confirmArrivalStartTime: '',//到达时间
                    confirmArrivalEndTime: '',
                    specification: '',//车型
                    oilCardNumber: '',//油卡卡号
                    vehicleLicenseNum: '',//车牌号
                    lineCode: '',//线路名称
                    departCityArr: [],//始发地
                    departCityCode: '',
                    destCityArr: [],//目的地
                    destCityCode: '',
                    waybillCode: '',//运单号
                    waybillStatus: '',//运单状态
                    waybillSignTimeStartTime:'',//运单签收时间
                    waybillSignTimeEndTime:'',
                    receiveSettlementStartTime: '',//应收结算时间
                    receiveSettlementEndTime: '',
                    paidSettlementStartTime: '',//应付结算时间
                    paidSettlementEndTime: '',
                    receivePriceType: '' //应收计价方式
                };
            },
            searchList() {//查询
                let vm = this;
                this.searchParam.departCityCode = this.searchParam.departCityArr[1];
                this.searchParam.destCityCode = this.searchParam.destCityArr[1];
                if((!vm.searchParam.actualDepartureStartTime && !vm.searchParam.actualDepartureEndTime) || !!vm.searchParam.actualDepartureStartTime != !!vm.searchParam.actualDepartureEndTime){
                    return vm.$message.warning('请选择发车时间进行查询！');
                }
                vm.isLoading = true;
                Http.get(Api.departSummaryExport.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.pageSize = result.pageSize;
                    this.searchParam.currentPage = 1;
                    vm.isLoading = false;
                },()=>{
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
            showWayBill(row){ //运单详情------------------------------------
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
                // window.open(href, '_blank');
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}})
            },
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.departSummaryExport.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '发车汇总.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>

