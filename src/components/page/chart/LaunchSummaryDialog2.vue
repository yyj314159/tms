<template>
    <el-container>
        <el-dialog title="合作车应付结算进度明细详情" :visible.sync="Visible" width="90%" :top="marginTop" @close="close">
            <el-main class="content-main">
                <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                    <el-table-column align="center" label="运单号" min-width="130">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="客户简称" prop="waybill.dispatch.customer.name" min-width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="收入主体" prop="receiveConfirm.incomeSubject" min-width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="客户全称" prop="receiveConfirm.customerName" min-width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="大区" prop="waybill.dispatch.region.name" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="小区" prop="waybill.dispatch.belongOrg.name" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="线路名称" prop="waybill.dispatch.dispatchLine.lineName" min-width="600" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.waybill.dispatch.dispatchLine.lineName}}{{`（${scope.row.waybill.dispatch.dispatchLine.startStation.name} —— ${scope.row.waybill.dispatch.dispatchLine.endStation.name}）`}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="车辆属性" min-width="100">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" v-model="scope.row.waybill.dispatch.dispatchVehicle.vehicleNature"/>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="自营属性" min-width="140">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="SELF_OPERATION_MODE" v-model="scope.row.waybill.dispatch.dispatchVehicle.selfOperationMode"/>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="供应商" prop="waybill.dispatch.dispatchVehicle.supplier.name" min-width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="车牌号" prop="waybill.dispatch.dispatchVehicle.vehicleLicenseNum" min-width="160" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{`${scope.row.waybill.dispatch.dispatchVehicle.vehicleLicenseNum}  （${scope.row.waybill.dispatch.dispatchVehicle.specification} 米）`}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="挂厢号" prop="waybill.dispatch.dispatchVehicle.trailerLicenseNum" min-width="120px" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="实际发车时间" prop="waybill.actualDepartureTime" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="实际到达时间" prop="waybill.confirmArrivalTime" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="计价方式(应收)" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="LINE_PRICE_TYPE" v-model="scope.row.waybill.dispatch.dispatchPrice.receivePriceType"/>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="重量/体积(应收)" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.waybill.dispatch.dispatchPrice.receivePriceNum ? (
                            scope.row.waybill.dispatch.dispatchPrice.receivePriceType==Constant.LINE_PRICE_TYPE.WEIGHT ? scope.row.waybill.dispatch.dispatchPrice.receivePriceNum +" 公斤" :
                            scope.row.waybill.dispatch.dispatchPrice.receivePriceType==Constant.LINE_PRICE_TYPE.VOLUME ? scope.row.waybill.dispatch.dispatchPrice.receivePriceNum +" 方" : "" ) : "" }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="计价方式(应付)" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="LINE_PRICE_TYPE" v-model="scope.row.waybill.dispatch.dispatchPrice.paidPriceType"/>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="重量/体积(应付)" min-width="120" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.waybill.dispatch.dispatchPrice.paidPriceNum ? (
                            scope.row.waybill.dispatch.dispatchPrice.paidPriceType==Constant.LINE_PRICE_TYPE.WEIGHT ? scope.row.waybill.dispatch.dispatchPrice.paidPriceNum +" 公斤" :
                            scope.row.waybill.dispatch.dispatchPrice.paidPriceType==Constant.LINE_PRICE_TYPE.VOLUME ? scope.row.waybill.dispatch.dispatchPrice.paidPriceNum +" 方" : "" ) : "" }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="应收运费(应收)" prop="waybill.dispatch.dispatchPrice.receiveAmount" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="应付运费(应付)" prop="waybill.dispatch.dispatchPrice.paidVehicleAmount" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="运费调整调增(应收)" prop="receiveConfirm.feeAdjustAmount" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="运费调整(应付)" prop="waybillNotarizePayableDeduct.adjustAmount" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="结算运费(应收)"  min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                    {{scope.row.receiveConfirm.settlementAmount ?  scope.row.receiveConfirm.settlementAmount: scope.row.waybill.dispatch.dispatchPrice.receiveAmount }}
                    </template>
                    </el-table-column>
                    <el-table-column align="center" label="结算运费(应付)" prop="paidSettlementAmount" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="质量扣款调减(应收)" prop="receiveConfirm.qualityDeductionsAmount" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="时效扣款(应付)" prop="waybillNotarizePayableDeduct.qualityDeductionsAmount" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="安全扣款调减(应收)" prop="receiveConfirm.securityDeductionsAmount" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="油价补差调减(应收)" prop="receiveConfirm.oilPriceSupplement" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="油价补差(应付)" prop="waybillNotarizePayableDeduct.oilPriceSupplement" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="其他扣款调减(应收)" prop="receiveConfirm.otherDeductionsAmount" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="其他扣款(应付)" prop="waybillNotarizePayableDeduct.otherDeductionsAmount" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="火灾险服务费(应付)" prop="waybill.dispatch.dispatchPrice.insuranceFee" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="打款手续费(应付)" prop="waybill.dispatch.dispatchPrice.handTransferFee" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="实际应收(应收)" prop="receiveConfirm.actualReceiveAmount" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="实际应付(应付)" prop="waybill.dispatch.dispatchPrice.actualPaidVehicleAmount" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="尾款(应付)"    prop="waybill.dispatch.dispatchPrice.returnAmount" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="发票号" prop="receiveBill.invoiceNo" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="开票月份" prop="receiveBill.invoiceMonth" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="对账单号(应收)" prop="receiveBill.billCode" min-width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="结算状态(应收)" prop="receiveConfirm.billGenerationTime" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                    {{scope.row.receiveConfirm.billStatus ? "已结算" : "未结算"}}
                    </template>
                    </el-table-column>
                    <el-table-column align="center" label="结算时间(应收)" prop="receiveConfirm.billGenerationTime" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="结算状态(应付)" prop="payableSettlementTime" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                    <dictionary-select-name option-name="SETTLEMENT_STATE" :value="scope.row.payableConfirm.settlementState"/>
                    </template>
                    </el-table-column>
                    <el-table-column align="center" label="结算时间(应付)" prop="payableConfirm.payableSettlementTime" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="运单状态" min-width="100">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="WAY_BILL_STATUS" :value="scope.row.waybill.status"/>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="运单签收时间" prop="waybill.signTime" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="油卡卡号" prop="waybill.dispatch.dispatchPrice.oilCardNumber" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="油卡金额" prop="waybill.dispatch.dispatchPrice.oilCardAmount" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="预付打卡" prop="waybill.dispatch.dispatchPrice.prepaidCardAmount" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="货到打款" prop="waybill.dispatch.dispatchPrice.deliveryAmount" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="收款人" prop="waybill.payee" min-width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="开户行" prop="waybill.openingBank" min-width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="收款银行卡号" prop="waybill.dueBankCardNo" min-width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="油卡押金" prop="waybill.dispatch.dispatchPrice.oilCardDeposit" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="GPS押金" prop="waybill.dispatch.dispatchPrice.gpsDeposit" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="回单押金" prop="waybill.dispatch.dispatchPrice.returnDeposit" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="运单备注" prop="waybill.dispatch.remark" min-width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="始发地" prop="waybill.dispatch.dispatchLine.startStation.city.name" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="目的地" prop="waybill.dispatch.dispatchLine.endStation.city.name" min-width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="运单性质" min-width="100">
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
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Constant} from 'src/global/constant'
    export default {
        //接收父组件传过来的value
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            currentRowed: {
                type: Object,
                default: null
            },
            vehicleNature:{
                type:String,
                default:null
            },
            startActualDepartureTime:{
                type:String,
                default:null
            },
            endActualDepartureTime:{
                type:String,
                default:null
            },
            num1:{
                type:Number,
                default:null
            },
            num2:{
                type:Number,
                default:null
            },
            orgCode:{
                type:String,
                default:null
            }
        },
        data() {
            return {
                Visible: true,
                Constant: Constant,
                isLoading:true,
                searchParam:{//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    belongOrgCode:'',//所属区域
                    vehicleNature:'',//车辆属性
                    // waybillStatusFlag:'BEEN_ABANDONED', //发车汇总 除去已作废  应收应付明细没有去除已作废
                    waybillStatus:'SIGNED',
                    actualDepartureStartTime:'',//发车开始时间
                    actualDepartureEndTime:'',//获取结束时间
                    num1:'',//月份范围的起始位置
                    num2:'',//月份范围的结束位置
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                }
            }
        },
        created() {
            this.searchList();
        },
        computed: {//计算属性
            marginTop: function () {
                if (document.documentElement.clientHeight > 900) {
                    return "10vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "6vh";
                }
            }
        },
        watch: {//监听属性
            //监听传入的visible参数
            visible(val) {
                if (val) {
                    this.Visible = val;
                }
            }
        },
        methods: {
            close() {//关闭
                this.Visible = false;
                this.$emit('close');
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                vm.searchParam.belongOrgCode=vm.currentRowed.code;
                if(this.orgCode!='99999999' && this.orgCode!=''){//如果查询条件不为空的话，就将改查询条件作为点击合计时的条件,总部除外
                    vm.searchParam.belongOrgCode=vm.orgCode;
                }
                vm.searchParam.vehicleNature=vm.vehicleNature;
                vm.searchParam.actualDepartureStartTime=vm.startActualDepartureTime;
                vm.searchParam.actualDepartureEndTime=vm.endActualDepartureTime;
                vm.searchParam.num1=vm.num1;
                vm.searchParam.num2=vm.num2;
                Http.get(Api.departSummary.payableSettlement2,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
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
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
            },
        }
    }
</script>

