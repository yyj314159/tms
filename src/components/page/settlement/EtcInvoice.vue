<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item>基础信息</el-breadcrumb-item>
                <el-breadcrumb-item>ETC开票</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start" :end-date="searchParam.endActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end" :start-date="searchParam.startActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="平台公司:">
                            <supplier-select v-model="searchParam.supplierCode"
                                             :types="Constant.SUPPLIER_TYPE.PLANTFORM_COMPANY"
                                             style="display: block;"></supplier-select>
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
            <el-button v-if="vehicleLoading"  icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="vehicleList">车辆</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>下载中...</el-button>
            <el-button v-if="startLoading"  icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="startList">开始</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>下载中...</el-button>
            <el-button v-if="endLoading"  icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="endList">结束</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>下载中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="公司编号" prop="companyNum" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单号" prop="num" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车牌号" prop="plateNum" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车牌颜色" prop="plateColor" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单开始时间" prop="startTime" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单开始地址" prop="sourceAddr" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单目的地址" prop="destAddr" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单预计完成时间" prop="predictEndTime" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="费用" prop="fee" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="发票抬头类型" prop="titleType" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="税号" prop="taxplayerCode" min-width="180" show-overflow-tooltip></el-table-column>
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
    import {Http,Api,Common,Constant} from 'src/global'

    export default {
        data() {
            return {
                common: Common,
                Constant: Constant,
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    startActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    supplierCode:''
                },
                isLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                vehicleLoading: true,
                startLoading: true,
                endLoading: true
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
                    startActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    supplierCode:''
                };
            },
            searchList() {//查询
                let vm = this;
                if(!this.searchParam.startActualDepartureTime && !this.searchParam.endActualDepartureTime){
                    return this.$message.warning('请输入时间进行查询！')
                }
                vm.isLoading = true;
                Http.get(Api.etcInvoice.page,{ params : vm.searchParam }, result => {
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
            vehicleList(){
                let vm = this;
                vm.vehicleLoading = false;
                Http.get(Api.etcInvoice.vehicle,{ params : vm.searchParam }, response => {
                    let link = document.createElement('a');
                    link.href = response.result;
                    link.click();
                    vm.vehicleLoading = true;
                },()=>{
                    vm.vehicleLoading = true;
                })
            },
            startList(){
                let vm = this;
                vm.startLoading = false;
                Http.get(Api.etcInvoice.start,{ params : vm.searchParam }, response => {
                    let link = document.createElement('a');
                    link.href = response.result;
                    link.click();
                    vm.startLoading = true;
                },()=>{
                    vm.startLoading = true;
                })
            },
            endList(){
                let vm = this;
                vm.endLoading = false;
                Http.get(Api.etcInvoice.end,{ params : vm.searchParam }, response => {
                    let link = document.createElement('a');
                    link.href = response.result;
                    link.click();
                    vm.endLoading = true;
                },()=>{
                    vm.endLoading = true;
                })
            }
        }
    }
</script>
