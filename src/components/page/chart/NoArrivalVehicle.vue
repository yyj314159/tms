<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>营运报表</el-breadcrumb-item>
                <el-breadcrumb-item>应到未到车辆</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <org-select v-model="searchParam.orgCode" style="display:block"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车单号:">
                            <el-input v-model="searchParam.dispatchCode" style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode" style="display:block"/>
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
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleCode"
                                            style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineCode" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
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
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="预计到达开始:">
                            <date-picker-single v-model="searchParam.startArrivalTime" date-type="start"
                                                :end-date="searchParam.endArrivalTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预计到达结束:">
                            <date-picker-single v-model="searchParam.endArrivalTime" date-type="end"
                                                :start-date="searchParam.startArrivalTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchList()">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <!--导出组件-->
            <export-button  v-permission="'/noArrivalWaybill/export'" :href="Api.noArrivalWaybill.export" :params="searchParam" :download-name="'应到未到车辆报表'"></export-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="运单号" prop="waybillCode" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="派车单号" prop="dispatchCode" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="大区" prop="regionName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="分区" prop="orgName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="客户" prop="customerName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路" prop="lineName" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="始发站点" prop="startStationName" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="endStationName" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车牌号" prop="vehicleLicenseNum" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="挂车号" prop="trailerLicenseNum" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车辆性质" prop="vehicleNature" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车型" prop="specification" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="司机姓名" prop="driverName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="司机电话" prop="driverPhone" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="实际发车时间" prop="actualDepartureTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="预计到达时间" prop="arrivalTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="司机到达时间" prop="driverArrivalTime" min-width="160" show-overflow-tooltip></el-table-column>
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
                Api: Api,
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    startSendTime: '',
                    endSendTime: '',
                    vehicleCode: '',
                    orgCode: '',
                    customerCode: '',
                    lineCode: '',
                    startActualDepartureTime: '',
                    endActualDepartureTime: '',
                    startArrivalTime: '',
                    endArrivalTime: ''
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
                    startSendTime: '',
                    endSendTime: '',
                    vehicleCode: '',
                    orgCode: '',
                    customerCode: '',
                    lineCode: '',
                    startActualDepartureTime: '',
                    endActualDepartureTime: '',
                    startArrivalTime: '',
                    endArrivalTime: ''
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.noArrivalWaybill.page,{ params : vm.searchParam }, result => {
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
            }
        }
    }
</script>

<style scoped>

</style>
