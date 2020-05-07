<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运报表</el-breadcrumb-item>
                <el-breadcrumb-item>车价异常</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.belongOrgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
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
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" auditStatus="PASS"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="派车单号:">
                            <el-input v-model="searchParam.dispatchCode" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode" style="display:block;"></el-input>
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
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车型:">
                            <dictionary-select style="display: block" option-name="VEHICLE_SPECIFICATION" v-model="searchParam.specification"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/vehiclePriceException/export'" icon="el-icon-download"  type="primary" size="mini"  @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="客户名称" prop="customerName" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="所属大区" prop="regionName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="所属分区" prop="belongOrgName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单号" min-width="130">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="派车单号" prop="dispatchCode" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="lineName" min-width="250" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车牌号" prop="vehicleLicenseNum" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="挂厢号" prop="trailerLicenseNum" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车型" prop="specification" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="应收金额" prop="receiveAmount" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="应付金额" prop="paidVehicleAmount" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="毛利" prop="grossProfi" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="历史均价" prop="averagePrice" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="浮动比例" prop="floatRate" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="派车人" prop="confirmUser" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="派车确认时间" prop="confirmTime" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="审核人" prop="auditUser" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="审核时间" prop="auditTime" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="审核意见" prop="auditRemark" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="确认发车时间" prop="actualDepartureTime" min-width="140px" show-overflow-tooltip></el-table-column>
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
                exportLoading: true,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    belongOrgCode: '',//所属区域
                    actualDepartureStartTime: Common.date.dateFormat(new Date(new Date().getTime() - 30*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    actualDepartureEndTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    customerCode: '',//客户
                    specification: '',//车型
                    vehicleLicenseNum: '',//车牌号
                    lineCode: '',//线路名称
                    waybillCode: '',//运单号
                    dispatchCode: '',//派车单号
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
                    belongOrgCode: '',//所属区域
                    actualDepartureStartTime: Common.date.dateFormat(new Date(new Date().getTime() - 30*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    actualDepartureEndTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    customerCode: '',//客户
                    specification: '',//车型
                    vehicleLicenseNum: '',//车牌号
                    lineCode: '',//线路名称
                    waybillCode: '',//运单号
                    dispatchCode: '',//派车单号
                };
            },
            searchList() {//查询
                let vm = this;
                if((!vm.searchParam.actualDepartureStartTime || !vm.searchParam.actualDepartureEndTime)){
                    return vm.$message.warning('请选择发车时间进行查询！');
                }
                vm.isLoading = true;
                Http.get(Api.vehiclePriceException.page,{ params : vm.searchParam }, result => {
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
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}})
            },
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.vehiclePriceException.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '车价异常.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>

