<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>应收应付汇总报表</el-breadcrumb-item>
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
                        <el-form-item label="收入主体:" prop="incomeSubject">
                            <dictionary-select v-model="searchParam.incomeSubject"
                                               option-name="LINE_INCOME_SUBJECT"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode"  nature="AREA"
                                                style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属客户:">
                            <customer-select v-model="searchParam.customerCode" auditStatus="PASS" level="top"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select v-model="searchParam.vehicleNature" style="display:block" option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/receivePaidSummary/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="收入主体" prop="incomeSubject" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="所属区域" prop="orgCode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="顶级客户" prop="customerCode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车辆属性" prop="vehicleNature" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际应收" prop="receiveActualReceiveAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际应付" prop="actualPaidVehicleAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="毛利率" prop="amountRate" min-width="140" show-overflow-tooltip></el-table-column>
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
                common: Common,
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    incomeSubject:"",
                    orgCode:"",
                    customerCode:"",
                    vehicleNature:"",
                    startActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59")
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
                    incomeSubject:"",
                    orgCode:"",
                    customerCode:"",
                    vehicleNature:"",
                    startActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59")
                };
            },
            searchList() {//查询
                let vm = this;
                if((!this.searchParam.startActualDepartureTime && !this.searchParam.endActualDepartureTime)||!!this.searchParam.startActualDepartureTime !=!!this.searchParam.endActualDepartureTime){
                    return this.$message.warning('请输入发车时间进行查询！')
                }
                vm.isLoading = true;
                Http.get(Api.receivePaidSummary.page,{ params : vm.searchParam }, result => {
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
                axios.get(Api.receivePaidSummary.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应收应付汇总报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
