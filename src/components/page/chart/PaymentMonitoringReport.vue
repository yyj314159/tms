<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>应付监控报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单编码:">
                            <el-input v-model="searchParam.waybillCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="大区:">
                            <org-select v-model="searchParam.regionCode" style="display:block"
                                        nature="AREA"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="小区:">
                            <org-select v-model="searchParam.belongOrgCode" style="display:block"
                                        nature="PARTITION"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input v-model="searchParam.vehicleLicenseNum"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineId" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierId" style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="签收时间:">
                            <el-date-picker
                                v-model="searchParam.signTime"
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
                    <el-col :span="12">
                        <el-form-item label="发车时间:">
                            <el-date-picker
                                v-model="searchParam.actualDepartureTime"
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
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select v-model="searchParam.vehicleNature" style="display:block"
                                               option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>

                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/paymentMonitoring/export'" icon="el-icon-download"
                       type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe height="350">
                <el-table-column align="center" label="运单号" prop="waybillCode" min-width="140" show-overflow-tooltip/>
                <el-table-column header-align="center" label="运单状态" prop="waybillStatus" min-width="100"/>
                <el-table-column align="center" label="序列号" prop="departureNumber" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="大区" prop="regionName" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="小区" prop="belongOrgName" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="线路名称" prop="lineName" min-width="350" show-overflow-tooltip/>
                <el-table-column header-align="center" label="车辆属性" prop="vehicleNature" min-width="120px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="车牌号" prop="vehicleLicenseNum" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="挂厢号" prop="trailerLicenseNum" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="供应商" prop="supplierName" min-width="300" show-overflow-tooltip/>
                <el-table-column align="center" label="实际发车时间" prop="actualDepartureTime" min-width="240"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="运单签收时间" prop="signTime" min-width="240" show-overflow-tooltip/>
                <el-table-column align="center" label="实际应收(应收)" prop="receiveAmount" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="应付运费(应付)" prop="paidVehicleAmount" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="运费调整(应付)" prop="adjustAmount" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="结算运费(应付)" prop="settlementAmount" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="时效扣款(应付)" prop="qualityDeductionsAmount" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="油价补差(应付)" prop="oilPriceSupplement" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="其他扣款(应付)" prop="otherDeductionsAmount" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="实际应付(应付)" prop="actualPaidVehicleAmount" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="尾款(应付)" prop="returnAmount" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="油卡卡号" prop="oilCardNumber" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="油卡金额" prop="oilCardAmount" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="预付打卡" prop="prepaidCardAmount" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="货到打款" prop="deliveryAmount" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="火灾险服务费" prop="insuranceFee" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="打款手续费(应付)" prop="handTransferFee" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="计价方式(应收)" prop="receivePriceType" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="计价数量(应收)" prop="receivePriceNum" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="计价方式(应付)" prop="paidPriceType" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="计价数量(应付)" prop="paidPriceNum" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="收款人" prop="payee" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="开户行" prop="openingBank" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="收款银行卡号" prop="dueBankCardNo" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="油卡押金" prop="oilCardDeposit" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="GPS押金" prop="gpsDeposit" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="回单押金" prop="returnDeposit" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="运单备注" prop="remark" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="始发地" prop="sta1Name" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="目的地" prop="sta2Name" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="运单性质" min-width="100" prop="operationType"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="线路里程" prop="distance" min-width="140" show-overflow-tooltip/>
                <el-table-column label="车厢类型" header-align="center" prop="vanType" width="100"/>
                <el-table-column align="center" label="主司机姓名" prop="driverName" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="主司机电话" prop="driMobile" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="回单号" prop="receiptCodes" min-width="140" show-overflow-tooltip/>
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
    import {Http, Api, Common} from 'src/global'
    import axios from 'axios'

    export default {
        data() {
            let permission = { //权限
                add: '/supplierUser/add',
                modify: '/supplierUser/modify',
                delete: '/supplierUser/delete',
                resetPassWord: '/supplierUser/resetPassWord',
                role: '/supplierUser/role',
            };
            return {
                initializeModel: {},
                common: Common,
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: "",
                    regionCode: "",
                    belongOrgCode: "",
                    vehicleLicenseNum: "",
                    lineId: "",
                    supplierId: "",
                    vehicleNature: "",
                    vehicleSize: "",
                    signTime: [],
                    signTimeStart: '',
                    signTimeEnd: '',
                    vanType: '',
                    actualDepartureTime: [Common.date.dateFormat(new Date(new Date() - 60 * 1000 * 60 * 24 * 30), "YYYY-MM-01 00:00:00"), Common.date.dateFormat(new Date(), "YYYY-MM-01 23:59:59")],
                    actualDepartureTimeStart: '',
                    actualDepartureTimeEnd: '',
                },
                isLoading: false,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                permission: permission,
                //导出
                exportLoading: true,

            }
        },
        mounted() {
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
                if (_this.searchParam.signTime) {
                    _this.searchParam.signTimeStart = _this.searchParam.signTime[0];
                    _this.searchParam.signTimeEnd = _this.searchParam.signTime[1];
                } else {
                    _this.searchParam.signTimeStart = '';
                    _this.searchParam.signTimeEnd = '';
                }
                if (_this.searchParam.actualDepartureTime) {
                    _this.searchParam.actualDepartureTimeStart = _this.searchParam.actualDepartureTime[0];
                    _this.searchParam.actualDepartureTimeEnd = _this.searchParam.actualDepartureTime[1];
                } else {
                    _this.searchParam.actualDepartureTimeStart = '';
                    _this.searchParam.actualDepartureTimeEnd = '';
                }
                if ((!_this.searchParam.signTimeStart && !_this.searchParam.signTimeEnd) && (!_this.searchParam.actualDepartureTimeStart || !_this.searchParam.actualDepartureTimeEnd)) {
                    //return this.$message.warning('请输入时间进行查询！')
                }
                _this.isLoading = true;
                Http.get(Api.paymentMonitoring.page, {params: _this.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
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
                axios.get(Api.paymentMonitoring.export, {
                    params: _this.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应收监控报表.xls';
                    link.click();
                    _this.exportLoading = true;
                }).catch(reason => {
                    _this.exportLoading = true;
                })
            }
        }
    }
</script>
