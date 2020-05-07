<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>营运报表</el-breadcrumb-item>
                <el-breadcrumb-item>派车明细</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="派车开始时间:">
                            <date-picker-single v-model="searchParam.startSendTime" date-type="start" :end-date="searchParam.endSendTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车结束时间:">
                            <date-picker-single v-model="searchParam.endSendTime" date-type="end" :start-date="searchParam.startSendTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单状态:">
                            <dictionary-select option-name="WAY_BILL_STATUS"  v-model="searchParam.status" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" style="display:block"></customer-select>
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
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆性质:">
                            <dictionary-select v-model="searchParam.vehicleNature" option-name="VEHICLE_OPERATION_MODE" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/dispatchDetailReport/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="派车单号" prop="code" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="运单号" prop="waybillCode" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="客户" prop="customerName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="大区" prop="regionName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="分区" prop="orgName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路" prop="lineName" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路类型" prop="lineType" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车牌号" prop="vehicleLicenseNum" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车辆性质" prop="vehicleNature" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车型" prop="specification" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="是否开票" prop="ticket" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应收计价方式" prop="receivePriceType" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应收车价" prop="receiveAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应付计价方式" prop="paidPriceType" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应付车价" prop="paidVehicleAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="预付打卡金额" prop="prepaidCardAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="油卡金额" prop="oilCardAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="油卡卡号" prop="oilCardNumber" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="油卡押金" prop="oilCardDeposit" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="油卡余额" prop="oilCardBalance" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="是否使用GPS" prop="useGps" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="GPS编号" prop="gpsCode" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="GPS押金" prop="gpsDeposit" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="GPS使用费" prop="gpsFee" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="回单押金" prop="returnDeposit" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="货到打款金额" prop="deliveryAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="回单付款金额" prop="returnAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="司机姓名" prop="driverName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="司机电话" prop="driverPhone" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="供应商" prop="supplierName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="承运方" prop="shipperName" min-width="120" show-overflow-tooltip></el-table-column>
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
    import {Http,Api,Common} from 'src/global'
    import axios from 'axios'

    export default {
        data() {
            return {
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    startSendTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 00:00:00"),
                    endSendTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    vehicleCode: '',
                    status:'',
                    customerCode: '',
                    lineCode: '',
                    vehicleNature: ''
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
                    startSendTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 00:00:00"),
                    endSendTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    vehicleCode: '',
                    status:'',
                    customerCode: '',
                    lineCode: '',
                    vehicleNature: ''
                };
            },
            searchList() {//查询
                let vm = this;
                if(!this.searchParam.startSendTime && !this.searchParam.endSendTime){
                    return this.$message.warning('请输入派车时间进行查询！')
                }
                vm.isLoading = true;
                Http.get(Api.dispatchDetailReport.page,{ params : vm.searchParam }, result => {
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
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.dispatchDetailReport.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '派车明细报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>

<style scoped>

</style>
