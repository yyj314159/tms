<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 应付管理</el-breadcrumb-item>
                <el-breadcrumb-item>付款查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单编号:">
                            <el-input v-model="searchParam.waybillCode" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input v-model="searchParam.licenseNum" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierCode" placeholder="请输入供应商"
                                             style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="承运方:">
                            <supplier-select v-model="searchParam.shipperCode" placeholder="请输入供应商"
                                             style="display: block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start"
                                                :end-date="searchParam.endActualDepartureTime"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end"
                                                :start-date="searchParam.startActualDepartureTime"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="尾款付款状态:">
                            <dictionary-select v-model="searchParam.payment" option-name="PAY_STATUS"
                                               style="display:block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
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
            <el-button v-if="exportLoading" v-permission="'/paymentQueryReport/export'" icon="el-icon-download"
                       type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="运单编号" prop="waybillCode" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="车牌号" prop="licenseNum" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="大区" prop="regionName" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="小区" prop="belongOrgName" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="供应商" prop="supplierName" min-width="250" show-overflow-tooltip/>
                <el-table-column align="center" label="承运方" prop="shipperName" min-width="250" show-overflow-tooltip/>
                <el-table-column align="center" label="发车时间" prop="actualDepartureTime" min-width="200" show-overflow-tooltip/>

                <el-table-column align="center" label="预付打卡" prop="prepaidCardAmount" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="定点加油升数" prop="refuelingVolume" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="定点加油金额" prop="refuelingAmount" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="油卡卡号" prop="oilCardNumber" min-width="200" show-overflow-tooltip/>
                <el-table-column align="center" label="油卡金额" prop="oilCardAmount" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="油卡押金" prop="oilCardDeposit" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="GPS押金" prop="gpsDeposit" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="GPS号" prop="gpsCode" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="GPS使用费" prop="gpsFee" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="回单押金" prop="returnDeposit" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="火灾险服务费" prop="insuranceFee" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="打款手续费" prop="handTransferFee" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="货到打卡" prop="deliveryAmount" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="回单付款" prop="returnAmount" min-width="140" show-overflow-tooltip/>

                <el-table-column align="center" label="预付款付款状态" prop="prepaymentPaymentType" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="预付款付款人" prop="prepaymentPaymentUser" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="预付款付款时间" prop="prepaymentPaymentTime" min-width="200" show-overflow-tooltip/>

                <el-table-column align="center" label="货到款付款状态" prop="theGoodsToType" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="货到款付款人" prop="theGoodsToUser" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="货到款付款时间" prop="theGoodsToTime" min-width="200" show-overflow-tooltip/>

                <el-table-column align="center" label="尾款付款状态" prop="payType" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="尾款付款人" prop="paymentUser" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="尾款付款时间" prop="paymentTime" min-width="200" show-overflow-tooltip/>



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
            return {
                common: Common,
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: "",
                    licenseNum: "",
                    supplierCode: "",
                    shipperCode: "",
                    orgCode: "",
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),
                    payment:'NOT_PAYMENT'
                },
                isLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: "",
                    licenseNum: "",
                    supplierCode: "",
                    shipperCode: "",
                    orgCode: "",
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")
                };
            },
            searchList() {//查询
                let vm = this;
                if (!this.searchParam.startActualDepartureTime && !this.searchParam.endActualDepartureTime) {
                    return this.$message.warning('请输入时间进行查询！')
                }
                vm.isLoading = true;
                Http.get(Api.paymentQueryReport.page, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
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
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.paymentQueryReport.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '付款查询.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
