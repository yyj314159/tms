<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>当月利润统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <!--<el-col :span="6">-->
                        <!--<el-form-item label="开始时间:">-->
                            <!--<date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start"-->
                                                <!--:end-date="searchParam.endActualDepartureTime"></date-picker-single>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <el-col :span="6">
                        <el-form-item label="年份:">
                            <el-date-picker
                                v-model="searchParam.yearActualDepartureTime" type="year"  placeholder="请选择年份">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="6">-->
                        <!--<el-form-item label="结束时间:">-->
                            <!--<date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end"-->
                                                <!--:start-date="searchParam.startActualDepartureTime"></date-picker-single>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <el-col :span="6">
                        <el-form-item label="月份:">
                            <el-date-picker
                                v-model="searchParam.monthActualDepartureTime" type="month"  placeholder="请选择月份" format="yyyy-MM">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12" style="float: right">
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
            <el-button v-if="exportLoading" v-permission="'/monthlyProfitStatistics/export'" icon="el-icon-download"
                       type="primary" size="mini" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" prop="yearName" label="大区名称" width="120"></el-table-column>
                <el-table-column align="center" label="本月合计">
                    <el-table-column align="center" prop="monthCount" label="趟次" width="100">
                        <template slot-scope="scope">
                            {{scope.row.monthCount == null ? "0" : scope.row.monthCount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="monthReceiveAmount" label="应收" width="100">
                        <template slot-scope="scope">
                            {{scope.row.monthReceiveAmount == null ? "0" : scope.row.monthReceiveAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="monthActualPaidVehicleAmount" label="应付" width="100">
                        <template slot-scope="scope">
                            {{scope.row.monthActualPaidVehicleAmount == null ? "0" : scope.row.monthActualPaidVehicleAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="monthOperationMargins" label="运营毛利" width="100">
                        <template slot-scope="scope">
                            {{scope.row.monthOperationMargins == null ? "0" : scope.row.monthOperationMargins }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="monthOperationMargin" label="运营毛利率" width="100">
                        <template slot-scope="scope">
                            {{scope.row.monthOperationMargin == null ? "0" : scope.row.monthOperationMargin }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="monthCompanyComprehensiveCost" label="公司综合成本" width="100">
                        <template slot-scope="scope">
                            {{scope.row.monthCompanyComprehensiveCost == null ? "0" : scope.row.monthCompanyComprehensiveCost }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="monthGrossMarginAfterDeduction" label="扣除后运营毛利率" width="120">
                        <template slot-scope="scope">
                            {{scope.row.monthGrossMarginAfterDeduction == null ? "0" : scope.row.monthGrossMarginAfterDeduction }}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="本年合计">
                    <el-table-column align="center" prop="yearCount" label="趟次" width="100">
                        <template slot-scope="scope">
                            {{scope.row.yearCount == null ? "0" : scope.row.yearCount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="yearReceiveAmount" label="应收" width="100">
                        <template slot-scope="scope">
                            {{scope.row.yearReceiveAmount == null ? "0" : scope.row.yearReceiveAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="yearActualPaidVehicleAmount" label="应付" width="100">
                        <template slot-scope="scope">
                            {{scope.row.yearActualPaidVehicleAmount == null ? "0" : scope.row.yearActualPaidVehicleAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="yearOperationMargins" label="运营毛利"  width="100">
                        <template slot-scope="scope">
                            {{scope.row.yearOperationMargins == null ? "0" : scope.row.yearOperationMargins }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="yearOperationMargin" label="运营毛利率" width="100">
                        <template slot-scope="scope">
                            {{scope.row.yearOperationMargin == null ? "0" : scope.row.yearOperationMargin }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="yearCompanyComprehensiveCost" label="公司综合成本" width="100">
                        <template slot-scope="scope">
                            {{scope.row.yearCompanyComprehensiveCost == null ? "0" : scope.row.yearCompanyComprehensiveCost }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="yearGrossMarginAfterDeduction" label="扣除后运营毛利率" width="120">
                        <template slot-scope="scope">
                            {{scope.row.yearGrossMarginAfterDeduction == null ? "0" : scope.row.yearGrossMarginAfterDeduction }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="" label="年度应收目标" width="120">
                        <!--<template slot-scope="scope">-->
                            <!--{{scope.row.monthGrossMarginAfterDeduction == null ? "0" : scope.row.monthGrossMarginAfterDeduction }}-->
                        <!--</template>-->
                    </el-table-column>
                    <el-table-column align="center" prop="" label="目标完成率" width="120">
                        <!--<template slot-scope="scope">-->
                            <!--{{scope.row.monthGrossMarginAfterDeduction == null ? "0" : scope.row.monthGrossMarginAfterDeduction }}-->
                        <!--</template>-->
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" prop="yearName" label="大区名称" width="120"></el-table-column>
                <el-table-column align="center" label="外请">
                    <el-table-column align="center" prop="outInviteValueCount" label="趟次" width="100">
                        <template slot-scope="scope">
                            {{scope.row.outInviteValueCount == null ? "0" : scope.row.outInviteValueCount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="outInviteValueReceiveAmount" label="应收" width="100">
                        <template slot-scope="scope">
                            {{scope.row.outInviteValueReceiveAmount == null ? "0" : scope.row.outInviteValueReceiveAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="outInviteValueActualPaidVehicleAmount" label="应付" width="100">
                        <template slot-scope="scope">
                            {{scope.row.outInviteValueActualPaidVehicleAmount == null ? "0" : scope.row.outInviteValueActualPaidVehicleAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="outInviteValueOperationMargins" label="运营毛利" width="100">
                        <template slot-scope="scope">
                            {{scope.row.outInviteValueOperationMargins == null ? "0" : scope.row.outInviteValueOperationMargins }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="outInviteValueOperationMargin" label="运营毛利率" width="100">
                        <template slot-scope="scope">
                            {{scope.row.outInviteValueOperationMargin == null ? "0" : scope.row.outInviteValueOperationMargin }}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="合作">
                    <el-table-column align="center" prop="outSourceValueCount" label="趟次" width="100">
                        <template slot-scope="scope">
                            {{scope.row.outSourceValueCount == null ? "0" : scope.row.outSourceValueCount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="outSourceValueReceiveAmount" label="应收" width="100">
                        <template slot-scope="scope">
                            {{scope.row.outSourceValueReceiveAmount == null ? "0" : scope.row.outSourceValueReceiveAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="outSourceValueActualPaidVehicleAmount" label="应付" width="100">
                        <template slot-scope="scope">
                            {{scope.row.outSourceValueActualPaidVehicleAmount == null ? "0" : scope.row.outSourceValueActualPaidVehicleAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="outSourceValueOperationMargins" label="运营毛利" width="100">
                        <template slot-scope="scope">
                            {{scope.row.outSourceValueOperationMargins == null ? "0" : scope.row.outSourceValueOperationMargins }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="outSourceValueOperationMargin" label="运营毛利率" width="100">
                        <template slot-scope="scope">
                            {{scope.row.outSourceValueOperationMargin == null ? "0" : scope.row.outSourceValueOperationMargin }}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="自营">
                    <el-table-column align="center" prop="selfSupportValueCount" label="趟次" width="100">
                        <template slot-scope="scope">
                            {{scope.row.selfSupportValueCount == null ? "0" : scope.row.selfSupportValueCount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="selfSupportValueReceiveAmount" label="应收"  width="100">
                        <template slot-scope="scope">
                            {{scope.row.selfSupportValueReceiveAmount == null ? "0" : scope.row.selfSupportValueReceiveAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="selfSupportValueActualPaidVehicleAmount" label="应付" width="100">
                        <template slot-scope="scope">
                            {{scope.row.selfSupportValueActualPaidVehicleAmount == null ? "0" : scope.row.selfSupportValueActualPaidVehicleAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="selfSupportValueOperationMargins" label="运营毛利" width="100">
                        <template slot-scope="scope">
                            {{scope.row.selfSupportValueOperationMargins == null ? "0" : scope.row.selfSupportValueOperationMargins }}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="selfSupportValueOperationMargin" label="运营毛利率" width="100">
                        <template slot-scope="scope">
                            {{scope.row.selfSupportValueOperationMargin == null ? "0" : scope.row.selfSupportValueOperationMargin }}
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[20, 50, 100]"
                    :page-size="searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import {Http, Api, Validate, Common, Constant} from 'src/global/index'
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
                    pageSize: 20,
                    yearActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 00:00:00"),//实际发车开始时间
                    monthActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),//实际发车结束时间
                    // yearActualDepartureTime:'',
                    // monthActualDepartureTime:'',
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 20,
                    yearActualDepartureTime:Common.date.dateFormat(new Date(), "YYYY-MM-DD"),
                    monthActualDepartureTime:Common.date.dateFormat(new Date(), "yyyy-MM-dd 23:59:59"),
                    // yearActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//实际发车开始时间
                    // monthActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),//实际发车结束时间
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                vm.searchParam.yearActualDepartureTime = Common.date.dateFormat(vm.searchParam.yearActualDepartureTime,"YYYY-MM-DD");
                vm.searchParam.monthActualDepartureTime = Common.date.dateFormat(vm.searchParam.monthActualDepartureTime,"YYYY-MM-DD 23:59:59");
                Http.get(Api.monthlyProfitStatistics.page, {params: vm.searchParam}, result => {
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
                axios.get(Api.monthlyProfitStatistics.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '当月利润统计报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },

        }
    }
</script>

