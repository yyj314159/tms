<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>亏损线路统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start"
                                                :end-date="searchParam.endActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end"
                                                :start-date="searchParam.startActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属客户:">
                            <customer-select v-model="searchParam.customerCode" auditStatus="PASS" level="top"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.regionCode" style="display: block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="是否显示小区:">
                            <el-select v-model="searchParam.isShowOrg" placeholder="请选择" style="display:block;">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/receiveMonitor/export'" icon="el-icon-download"
                       type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe >
                <el-table-column type="index" label="索引" min-width="65" width="65" fixed>
                    <template slot-scope="scope">
                        {{ scope.$index + addIndex }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所属大区" prop="regionName" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="所属分区" prop="belongOrgName" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="客户" prop="customerName" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="线路名称" prop="lineName" min-width="140"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" v-if="scope.row.lineName"
                           @click="detailSearchList(scope.row)">{{scope.row.lineName}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发车趟次" prop="waybillCodes" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="应收" prop="receiveAmount" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="应付" prop="actualPaidVehicleAmount" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="利润" prop="profit" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="毛利率" prop="proportion" min-width="140"
                                 show-overflow-tooltip/>
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


        <el-dialog title="详情" :visible.sync="detailDialog" width="80%">
            <el-table v-loading="detailIsLoading" size="small" class="content-table" :data="detailSearchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column type="index" label="索引" min-width="65" width="65" fixed>
                    <template slot-scope="scope">
                        {{ scope.$index + addIndex }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="运单号" min-width="130">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="客户简称" prop="waybill.dispatch.customer.name" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="收入主体" prop="receiveConfirm.incomeSubject" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="客户全称" prop="receiveConfirm.customerName" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="大区" prop="waybill.dispatch.region.name" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="小区" prop="waybill.dispatch.belongOrg.name" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="waybill.dispatch.dispatchLine.lineName"
                                 min-width="600" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.waybill.dispatch.dispatchLine.lineName}}{{`（${scope.row.waybill.dispatch.dispatchLine.startStation.name}
                        —— ${scope.row.waybill.dispatch.dispatchLine.endStation.name}）`}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="车辆属性" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                v-model="scope.row.waybill.dispatch.dispatchVehicle.vehicleNature"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="自营属性" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SELF_OPERATION_MODE"
                                                v-model="scope.row.waybill.dispatch.dispatchVehicle.selfOperationMode"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="供应商" prop="waybill.dispatch.dispatchVehicle.supplier.name"
                                 min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车牌号" prop="waybill.dispatch.dispatchVehicle.vehicleLicenseNum"
                                 min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.waybill.dispatch.dispatchVehicle.vehicleLicenseNum}
                        （${scope.row.waybill.dispatch.dispatchVehicle.specification} 米）`}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="挂厢号" prop="waybill.dispatch.dispatchVehicle.trailerLicenseNum"
                                 min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际发车时间" prop="waybill.actualDepartureTime" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际到达时间" prop="waybill.confirmArrivalTime" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="计价方式(应收)" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_PRICE_TYPE"
                                                v-model="scope.row.waybill.dispatch.dispatchPrice.receivePriceType"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="重量/体积(应收)" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.waybill.dispatch.dispatchPrice.receivePriceNum ? (
                        scope.row.waybill.dispatch.dispatchPrice.receivePriceType==Constant.LINE_PRICE_TYPE.WEIGHT ?
                        scope.row.waybill.dispatch.dispatchPrice.receivePriceNum +" 公斤" :
                        scope.row.waybill.dispatch.dispatchPrice.receivePriceType==Constant.LINE_PRICE_TYPE.VOLUME ?
                        scope.row.waybill.dispatch.dispatchPrice.receivePriceNum +" 方" : "" ) : "" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="计价方式(应付)" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_PRICE_TYPE"
                                                v-model="scope.row.waybill.dispatch.dispatchPrice.paidPriceType"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="重量/体积(应付)" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.waybill.dispatch.dispatchPrice.paidPriceNum ? (
                        scope.row.waybill.dispatch.dispatchPrice.paidPriceType==Constant.LINE_PRICE_TYPE.WEIGHT ?
                        scope.row.waybill.dispatch.dispatchPrice.paidPriceNum +" 公斤" :
                        scope.row.waybill.dispatch.dispatchPrice.paidPriceType==Constant.LINE_PRICE_TYPE.VOLUME ?
                        scope.row.waybill.dispatch.dispatchPrice.paidPriceNum +" 方" : "" ) : "" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="应收运费(应收)" prop="waybill.dispatch.dispatchPrice.receiveAmount"
                                 min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="应付运费(应付)" prop="waybill.dispatch.dispatchPrice.paidVehicleAmount"
                                 min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运费调整调增(应收)" prop="receiveConfirm.feeAdjustAmount" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运费调整(应付)" prop="waybillNotarizePayableDeduct.adjustAmount"
                                 min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算运费(应收)" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.receiveConfirm.settlementAmount ? scope.row.receiveConfirm.settlementAmount:
                        scope.row.waybill.dispatch.dispatchPrice.receiveAmount }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="结算运费(应付)" prop="paidSettlementAmount" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="质量扣款调减(应收)" prop="receiveConfirm.qualityDeductionsAmount"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="时效扣款(应付)"
                                 prop="waybillNotarizePayableDeduct.qualityDeductionsAmount" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="安全扣款调减(应收)" prop="receiveConfirm.securityDeductionsAmount"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油价补差调减(应收)" prop="receiveConfirm.oilPriceSupplement"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油价补差(应付)" prop="waybillNotarizePayableDeduct.oilPriceSupplement"
                                 min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="其他扣款调减(应收)" prop="receiveConfirm.otherDeductionsAmount"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="其他扣款(应付)"
                                 prop="waybillNotarizePayableDeduct.otherDeductionsAmount" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="火灾险服务费(应付)" prop="waybill.dispatch.dispatchPrice.insuranceFee"
                                 min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="火灾险服务费(应付)" prop="waybill.dispatch.dispatchPrice.insuranceFee"
                                 min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际应收(应收)" prop="receiveConfirm.actualReceiveAmount"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际应付(应付)"
                                 prop="waybill.dispatch.dispatchPrice.actualPaidVehicleAmount" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="尾款(应付)" prop="waybill.dispatch.dispatchPrice.returnAmount"
                                 min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="发票号" prop="receiveBill.invoiceNo" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="开票月份" prop="receiveBill.invoiceMonth" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="对账单号(应收)" prop="receiveBill.billCode" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算状态(应收)" prop="receiveConfirm.billGenerationTime"
                                 min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.receiveConfirm.billStatus ? "已结算" : "未结算"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="结算时间(应收)" prop="receiveConfirm.billGenerationTime"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算状态(应付)" prop="payableSettlementTime" min-width="140"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SETTLEMENT_STATE"
                                                :value="scope.row.payableConfirm.settlementState"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="结算时间(应付)" prop="payableConfirm.payableSettlementTime"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单状态" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAY_BILL_STATUS" :value="scope.row.waybill.status"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="运单签收时间" prop="waybill.signTime" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油卡卡号" prop="waybill.dispatch.dispatchPrice.oilCardNumber"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油卡金额" prop="waybill.dispatch.dispatchPrice.oilCardAmount"
                                 min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="预付打卡" prop="waybill.dispatch.dispatchPrice.prepaidCardAmount"
                                 min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="货到打款" prop="waybill.dispatch.dispatchPrice.deliveryAmount"
                                 min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="收款人" prop="waybill.payee" min-width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="开户行" prop="waybill.openingBank" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="收款银行卡号" prop="waybill.dueBankCardNo" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油卡押金" prop="waybill.dispatch.dispatchPrice.oilCardDeposit"
                                 min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="GPS押金" prop="waybill.dispatch.dispatchPrice.gpsDeposit"
                                 min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="回单押金" prop="waybill.dispatch.dispatchPrice.returnDeposit"
                                 min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单备注" prop="waybill.dispatch.remark" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="始发地" prop="waybill.dispatch.dispatchLine.startStation.city.name"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="目的地" prop="waybill.dispatch.dispatchLine.endStation.city.name"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单性质" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_OPERATION_TYPE"
                                                :value="scope.row.waybill.dispatch.dispatchLine.operationType"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="线路里程" prop="waybill.dispatch.dispatchLine.distance"
                                 min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车型" prop="waybill.dispatch.dispatchVehicle.specification"
                                 min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="主司机姓名" prop="waybill.dispatch.dispatchVehicle.driverName"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="主司机电话" prop="waybill.dispatch.dispatchVehicle.driverPhone"
                                 min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车主姓名" prop="vehicleOwner.name" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车主电话" prop="vehicleOwner.mobile" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="回单号" prop="waybill.receiptCodes" min-width="180"
                                 show-overflow-tooltip></el-table-column>
            </el-table>
            <el-form size="small" inline>
                <el-row>
                    <el-col :span="24">
                        <div class="content-pagination">
                            <el-pagination
                                @size-change="detailHandleSizeChange"
                                @current-change="detailHandleCurrentChange"
                                :page-sizes="[10, 20, 50, 100]"
                                :page-size="detailSearchParam.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="detailSearchResult.totalCount">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http, Api, Common, Constant} from 'src/global'
    import axios from 'axios'

    export default {
        data() {
            return {
                addIndex: 1,
                initializeModel: {},
                Constant: Constant,//常量
                common: Common,
                options: [
                    {
                        value: 1,
                        label: '是'
                    }, {
                        value: 0,
                        label: '否'
                    }
                ],
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: "",
                    regionCode: "",
                    isShowOrg: 0,
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")
                },
                isLoading: true,
                detailIsLoading: true,
                detailDialog: false,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                detailSearchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    actualDepartureEndTime: '',//发车时间
                    actualDepartureStartTime: '',
                    lineCode: '',
                    belongOrgCode: '',
                    grossProfitRate: true
                },
                detailSearchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true,
            }
        },
        created() {
            this.searchList();
            //拷贝一个 model 用于重置
            this.initializeModel = _.cloneDeep(this._data);
        },
        methods: {
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            resetSearchParam() {//重置参数
                this.searchParam = this.cloneMode().searchParam
            },
            searchList() {//查询
                let _this = this;
                if (!_this.searchParam.startActualDepartureTime && !_this.searchParam.endActualDepartureTime) {
                    return _this.$message.warning('请输入时间进行查询！')
                }
                _this.isLoading = true;
                Http.get(Api.lossLineStatistics.page, {params: _this.searchParam}, result => {
                    _this.searchResult.result = result.result;
                    _this.searchResult.totalCount = result.totalCount;
                    _this.detailSearchParam.actualDepartureStartTime = _this.searchParam.startActualDepartureTime;
                    _this.detailSearchParam.actualDepartureEndTime = _this.searchParam.endActualDepartureTime;
                    _this.searchParam.currentPage = result.currentPage;
                    _this.searchParam.pageSize = result.pageSize;
                    _this.isLoading = false;
                }, () => {
                    _this.isLoading = false;
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
            exportList() {
                let _this = this;
                _this.exportLoading = false;
                axios.get(Api.lossLineStatistics.export, {
                    params: _this.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '亏损线路统计.xls';
                    link.click();
                    _this.exportLoading = true;
                }).catch(reason => {
                    _this.exportLoading = true;
                })
            },

            showWayBill(row) { //运单详情------------------------------------
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
                // window.open(href, '_blank');
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
            },
            detailHandleSizeChange(val) {
                this.detailSearchParam.pageSize = val;
                this.detailSearchList();
            },
            detailHandleCurrentChange(val) {
                this.detailSearchParam.currentPage = val;
                this.detailSearchList();
            },
            detailSearchList(row) {//查询
                let _this = this;
                _this.detailIsLoading = true;
                _this.detailDialog = true
                if (row) {
                    _this.detailSearchParam.lineCode = row.lineCode
                    _this.detailSearchParam.belongOrgCode = row.belongOrgCode

                }
                Http.get(Api.departSummary.page, {params: _this.detailSearchParam}, result => {
                    this.detailSearchResult.result = result.result;
                    this.detailSearchResult.totalCount = result.totalCount;
                    this.detailSearchParam.currentPage = result.currentPage;
                    this.detailSearchParam.pageSize = result.pageSize;
                    _this.detailIsLoading = false;
                }, () => {
                    _this.detailIsLoading = false;
                })
            },
        }
    }
</script>
