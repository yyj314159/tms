<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>合作车应付明细</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单编号:">
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
                        <el-form-item label="分区:">
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
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierId" style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单状态:">
                            <dictionary-select option-name="WAY_BILL_STATUS" v-model="searchParam.status"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="区域审核状态:">
                            <el-select v-model="searchParam.auditCheck" placeholder="请选择" style="display:block;"
                                       :clearable="true">
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
                        <el-form-item label="车主是否确认:">
                            <el-select v-model="searchParam.driverVerifyStatus" placeholder="请选择" style="display:block;"
                                       :clearable="true">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineCode" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.departureStartTime" date-type="start"
                                                :end-date="searchParam.departureEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.departureEndTime" date-type="end"
                                                :start-date="searchParam.departureStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam" size="small">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/outsourceVehiclePayableConfirm/export'"
                       icon="el-icon-download"
                       type="primary" size="mini" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      border fit
                      highlight-current-row stripe>
                <el-table-column header-align="center" label="运单编号" prop="waybillCode" min-width="140" fixed>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单状态" prop="waybillStatus" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="区域审核" prop="auditCheck" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="区域审核人" prop="auditUser" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="区域审核时间" prop="auditTime" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="车主确认状态" prop="driverVerifyStatus" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="车主确认时间" prop="driverVerifyTime" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="客户全称" prop="customerName" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="大区" prop="regionName" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="分区" prop="belongOrgName" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="供应商" prop="supplierName" min-width="200"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="承运商" prop="shipperName" min-width="200"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="车牌号" prop="vehicleLicenseNum" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="线路" prop="lineName" min-width="240"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="派车单编号" prop="dispatchCode" min-width="240"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="调整金额" prop="adjustAmount" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="质量扣款(调减)" prop="qualityDeductionsAmount"
                                 min-width="120" show-overflow-tooltip/>
                <el-table-column header-align="center" label="油价补差(调增)" prop="oilPriceSupplement" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="其他扣款(调减)" prop="otherDeductionsAmount" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="安全扣款(调减)" prop="securityDeductionsAmount"
                                 min-width="120" show-overflow-tooltip/>
                <el-table-column header-align="center" label="压车费(调增)" prop="detentionCharge" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="质量奖励(调增)" prop="qualityAward" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="应付运费" prop="paidVehicleAmount" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="线路管理费" prop="insuranceFee" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="预付打款" prop="prepaidCardAmount" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="货到打款" prop="deliveryAmount" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="GPS押金" prop="gpsDeposit" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="油卡押金" prop="oilCardDeposit" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="回单押金" prop="returnDeposit" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="油卡余额" prop="oilCardAmount" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="定点加油" prop="refuelingAmount" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="尾款" prop="returnAmount" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="实际应付" prop="actualPaidVehicleAmount" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="发车时间" prop="actualDepartureTime" min-width="160"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="签收时间" prop="signTime" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="签收人" prop="signUser" min-width="120"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="始发地" prop="startStation" min-width="200"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="目的地" prop="endStation" min-width="200"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="回单号" prop="receiptCodes" min-width="200"
                                 show-overflow-tooltip/>
            </el-table>
            <el-row>
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
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    import {Http, Api, Constant, Common} from 'src/global/index'
    import axios from 'axios'

    export default {
        data() {
            return {
                isLoading: true,
                exportLoading: true,
                options: [
                    {
                        value: 1,
                        label: '是'
                    }, {
                        value: 0,
                        label: '否'
                    },
                ],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',
                    regionCode: '',
                    belongOrgCode: '',
                    vehicleLicenseNum: '',
                    supplierId: '',
                    status: 'SIGNED',
                    auditCheck: '',
                    lineCode: '',
                    driverVerifyStatus: '',
                    departureStartTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//发车时间
                    departureEndTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            /**分页*/
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            /*查询*/
            searchList() {
                let vm = this;
                let diffMonth = Common.date.getIntervalMonth(vm.searchParam.departureStartTime, vm.searchParam.departureEndTime);
                if (!vm.searchParam.departureStartTime || !vm.searchParam.departureStartTime || diffMonth > 3) {
                    return vm.$message.warning('请选择发车时间与结束时间,且两者相差需在3月内!!!');
                }
                Http.get(Api.outsourceVehiclePayableConfirm.page, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                })
            },
            //重置参数
            resetSearchParam() {
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    departureStartTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//发车时间
                    departureEndTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")
                };
            },
            showWayBill(row) { //运单详情------------------------------------
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
            },
            exportList() {
                let vm = this;
                let diffMonth = Common.date.getIntervalMonth(vm.searchParam.departureStartTime, vm.searchParam.departureEndTime);
                if (!vm.searchParam.departureStartTime || !vm.searchParam.departureStartTime || diffMonth > 3) {
                    return vm.$message.warning('请选择发车时间与结束时间,且两者相差需在3月内!!!');
                }
                vm.exportLoading = false;
                axios.get(Api.outsourceVehiclePayableConfirm.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '合作车应付明细.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
        }
    }
</script>
