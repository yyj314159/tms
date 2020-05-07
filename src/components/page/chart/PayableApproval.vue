<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>运营报表</el-breadcrumb-item>
                <el-breadcrumb-item>应付审批统计表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.createTime" date-type="start" :end-date="searchParam.endTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endTime" date-type="end" :start-date="searchParam.createTime" max-range-days="90"></date-picker-single>
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
            <el-button v-if="exportLoading" v-permission="'/payableApproval/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px; margin-bottom: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-tabs type="border-card" v-model="defaultShow">
                <el-tab-pane label="自动审核占比" name="auto">
                    <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                        <el-table-column header-align="center" label="大区" prop="regionName" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="审核通过总数" prop="passCount" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="自动审核数" prop="autoPassCount" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="自动审核占比" prop="autoPassProportion" min-width="160" show-overflow-tooltip></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="手动审核明细" name="manual">
                    <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe >
                        <el-table-column header-align="center" label="大区" prop="regionName" min-width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="分区" prop="partOrgName" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="派车单号" prop="dispatchCode" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="线路名称" prop="lineName" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="出发站点" prop="startStationName" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="经停站点" prop="stopOverStation" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="目的站点" prop="endStationName" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="车牌号" prop="licenseNumber" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="车型" prop="vehicleType" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="车厢号码" prop="trailerLicenseNum" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="挂车类型" prop="specification" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="请车时均价" prop="averagePrice" min-width="160" show-overflow-tooltip   label-class-name="headerRed"></el-table-column>
                        <el-table-column header-align="center" label="应付车价" prop="paidVehicleAmount" min-width="160" show-overflow-tooltip label-class-name="headerRed"></el-table-column>
                        <el-table-column header-align="center" label="浮动比例" prop="floatRate" min-width="160" show-overflow-tooltip label-class-name="headerRed"></el-table-column>
                        <el-table-column header-align="center" label="审核状态" prop="auditState" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="审核人" prop="auditUser" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="审核时间" prop="auditTime" min-width="160" show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="审核意见" prop="auditRemark" min-width="160" show-overflow-tooltip></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
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
                    orgCode: '',
                    createTime:Common.date.dateFormat(new Date(new Date().getTime() - 2*24*3600*1000),"YYYY-MM-DD 00:00:00"),
                    endTime:Common.date.dateFormat(new Date,"YYYY-MM-DD 23:59:59")

                },
                isLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true,
                defaultShow:'auto'
            }
        },
        created() {
            this.searchList();
        },
        watch: {
            defaultShow(val){
                let vm = this;
                vm.searchParam.currentPage = 1;
                vm.searchParam.pageSize = 10;
                vm.searchList();
            }
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    orgCode: '',
                    createTime:Common.date.dateFormat(new Date(new Date().getTime() - 2*24*3600*1000),"YYYY-MM-DD 00:00:00"),
                    endTime:Common.date.dateFormat(new Date,"YYYY-MM-DD 23:59:59")
                };
            },
            searchList() {//查询
                let vm = this;
                let autoResult = [];
                vm.isLoading = true;
                let url = '';
                if(this.defaultShow === 'auto'){
                    url = Api.payableApprovalAppt.page;
                }else if(this.defaultShow === 'manual'){
                    url = Api.payableApprovalMppt.page;
                }
                Http.get(url,{ params : vm.searchParam }, result => {
                    if(this.defaultShow === 'auto' && result.result.length > 0){
                        autoResult = result.result;
                        let passCount = 0;
                        let autoPassCount = 0;
                        autoResult.forEach((value,index)=>{
                            passCount += value.passCount
                            autoPassCount += value.autoPassCount
                        })
                        let autoPassProportion = (autoPassCount / passCount * 100).toFixed(2);
                        autoResult.push({
                            "regionName": "总计",
                            "passCount": passCount,
                            "autoPassCount": autoPassCount,
                            "autoPassProportion": autoPassProportion+"%"});
                        result.result = autoResult;
                    }
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
                let url = '';
                let downloadName = '';
                if(this.defaultShow === 'auto'){
                    url = Api.payableApprovalAppt.export;
                    downloadName = '应付审批自动审核占比表.xls';
                }else if(this.defaultShow === 'manual'){
                    url = Api.payableApprovalMppt.export;
                    downloadName = '应付审批手动审核明细表.xls';
                }
                axios.get(url, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = downloadName;
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
<style>
.headerRed{
    color: red;
}
</style>

