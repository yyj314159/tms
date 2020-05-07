<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>亏损线路客户统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
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
                    <el-col :span="6" style="float: right">
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
            <el-tabs type="border-card" v-model="defaultShow">
                <el-tab-pane label="按地区:" name="auto">
                    <el-button v-if="exportLoading" v-permission="'/lossLineCustomerStatisticsRegion/export'" icon="el-icon-download" type="primary" size="mini" @click="regionExportList">导出(地区)</el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
                    <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.regionResult" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                        <el-table-column label="顶级客户" min-width="100px" align="center"  prop="topCustomerName"></el-table-column>
                        <el-table-column label="东北大区"   header-align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="dbdqCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showCustomerPaidDetail(scope.row,'00000001',1)">{{scope.row.dbdqCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="dbdqSumActaulReceiveVehicleAmount" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="dbdqSumActualPaidVehicleAmount" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="dbdqProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="dbdqMaoProfit" min-width="100px"  align="center"></el-table-column>
                        </el-table-column>

                        <el-table-column label="华北大区"  header-align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="hbdqCount"  align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showCustomerPaidDetail(scope.row,'00000002',1)">{{scope.row.hbdqCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="hbdqSumActaulReceiveVehicleAmount" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="hbdqSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="hbdqProfit" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="利润率" prop="hbdqMaoProfit" min-width="100px"  align="center"></el-table-column>
                        </el-table-column>

                        <el-table-column label="华南大区"  header-align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="hndqCount"  align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showCustomerPaidDetail(scope.row,'00000003',1)">{{scope.row.hndqCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="hndqSumActaulReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="hndqSumActualPaidVehicleAmount" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="hndqProfit" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="利润率" prop="hndqMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>

                        <el-table-column label="华中大区" header-align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="hzdqCount"  align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showCustomerPaidDetail(scope.row,'00000004',1)">{{scope.row.hzdqCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="hzdqSumActaulReceiveVehicleAmount" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="hzdqSumActualPaidVehicleAmount" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="hzdqProfit" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="利润率" prop="hzdqMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>

                        <el-table-column label="西北大区" header-align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="xbdqCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showCustomerPaidDetail(scope.row,'00000006',1)">{{scope.row.xbdqCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="xbdqSumActaulReceiveVehicleAmount" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="xbdqSumActualPaidVehicleAmount" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="xbdqProfit" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="利润率" prop="xbdqMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>

                        <el-table-column label="西南大区" header-align="center" >
                            <el-table-column label="发车趟次" min-width="100px" prop="xndqCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showCustomerPaidDetail(scope.row,'00000007',1)">{{scope.row.xndqCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="xndqSumActaulReceiveVehicleAmount" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="xndqSumActualPaidVehicleAmount" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="xndqProfit" min-width="100px"  align="center"></el-table-column>
                            <el-table-column label="利润率" prop="xndqMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>

                        <el-table-column label="浙皖大区"  header-align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="zwdqCount"  align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showCustomerPaidDetail(scope.row,'00000008',1)">{{scope.row.zwdqCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="zwdqSumActaulReceiveVehicleAmount" min-width="100px" header-align="center" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="zwdqSumActualPaidVehicleAmount" min-width="100px" header-align="center" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="zwdqProfit" min-width="100px" header-align="center" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="zwdqMaoProfit" min-width="100px" header-align="center" align="center"></el-table-column>
                        </el-table-column>

                        <el-table-column label="中原大区" header-align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="zydqCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showCustomerPaidDetail(scope.row,'00000009',1)">{{scope.row.zydqCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="zydqSumActaulReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="zydqSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="zydqProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="zydqMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>

                        <el-table-column label="新疆区" header-align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="xjqCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showCustomerPaidDetail(scope.row,'00000062',1)">{{scope.row.xjqCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="xjqSumActaulReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="xjqSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="xjqProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="xjqMaoProfit"  min-width="100px" align="center"></el-table-column>
                        </el-table-column>

                        <el-table-column label="福建区" header-align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="fjqCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showCustomerPaidDetail(scope.row,'00000063',1)">{{scope.row.fjqCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="fjqSumActaulReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="fjqSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="fjqProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="fjqMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>

                        <el-table-column label="上海区" header-align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="shqCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showCustomerPaidDetail(scope.row,'00000064',1)">{{scope.row.shqCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="shqSumActaulReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="shqSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="shqProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="shqMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>

                        <el-table-column label="江苏区" header-align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="jsqCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showCustomerPaidDetail(scope.row,'00000065',1)">{{scope.row.jsqCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="jsqSumActaulReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="jsqSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="jsqProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="jsqMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>

                        <el-table-column label="合计" header-align="center">
                            <el-table-column label="发车总趟次" min-width="100px" prop="totalCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showCustomerPaidDetail(scope.row,null,1)">{{scope.row.totalCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际总应收" prop="totalReceiveAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际总应付" prop="totalPaidAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="总经营利润" prop="totalProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="总利润率" prop="totalMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="按月份:" name="manual">
                    <el-button v-if="exportLoading" v-permission="'/lossLineCustomerStatisticsMonth/export'" icon="el-icon-download" type="primary" size="mini" @click="monthExportList">导出(月份)</el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
                    <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.monthResult" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                        <el-table-column label="顶级客户" min-width="100" align="center" prop="topCustomerName"></el-table-column>
                        <el-table-column label="1月" align="center">
                            <el-table-column label="发车趟次" min-width="100" prop="janCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'01',2)">{{scope.row.janCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="janSumActualReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="janSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="janProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="janMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="2月" align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="febCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'02',2)">{{scope.row.febCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="febSumActualReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="febSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="febProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="febMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="3月" align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="marCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'03',2)">{{scope.row.marCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="marSumActualReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="marSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="marProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="marMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="4月" align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="aprCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'04',2)">{{scope.row.aprCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="aprSumActualReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="aprSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="aprProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="aprMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="5月" align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="mayCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'05',2)">{{scope.row.mayCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="maySumActualReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="maySumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="mayProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="mayMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="6月" align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="junCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'06',2)">{{scope.row.junCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="junSumActualReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="junSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="junProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="junMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="7月" align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="julCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'07',2)">{{scope.row.julCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="julSumActualReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="julSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="julProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="julMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="8月" align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="augCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'08',2)">{{scope.row.augCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="augSumActualReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="augSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="augProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="augMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="9月" align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="sepCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'09',2)">{{scope.row.sepCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="sepSumActualReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="sepSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="sepProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="sepMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="10月" align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="octCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'10',2)">{{scope.row.octCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="octSumActualReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="octSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="octProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="octMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="11月" align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="novCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'11',2)">{{scope.row.novCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="novSumActualReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="novSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="novProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="novMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="12月" align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="decCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'11',2)">{{scope.row.decCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="实际应收" prop="decSumActualReceiveVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="实际应付" prop="decSumActualPaidVehicleAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="decProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="利润率" prop="decMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                        <el-table-column label="合计" align="center">
                            <el-table-column label="发车趟次" min-width="100px" prop="monthTotalCount" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,null,2)">{{scope.row.monthTotalCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="合计实际应收" prop="monthTotalReceiveAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="合计实际应付" prop="monthTotalPaidAmount" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="合计经营利润" prop="monthTotalProfit" min-width="100px" align="center"></el-table-column>
                            <el-table-column label="合计利润率" prop="monthTotalMaoProfit" min-width="100px" align="center"></el-table-column>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
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
        <lossLineCustomerStatisticsDialog v-if="lossLineCustomerStatisticsDialog" :visible="lossLineCustomerStatisticsDialog"
                                              @close="hideReceiveDetail"
                                              :startActualDepartureTime="startActualDepartureTime"
                                              :endActualDepartureTime="endActualDepartureTime"
                                              :currentRows="currentRows"
                                              :regionCode="regionCode"
                                              :month="month" />
    </el-container>
</template>

<script>
    import {Http, Api, Common} from 'src/global'
    import axios from 'axios'
    import lossLineCustomerStatisticsDialog from "./LossLineCustomerStatisticsDialog"

    export default {
        components: {lossLineCustomerStatisticsDialog},
        data() {
            return {
                lossLineCustomerStatisticsDialog: false,//亏损线路客户统计明细对话框
                startActualDepartureTime: '',//发车开始时间
                endActualDepartureTime: '',//发车结束时间
                currentRows: null,//操作行对象
                regionCode:'',//大区参数
                month:'',//月份
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 50,
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),
                },
                isLoading: true,
                defaultShow: 'auto',
                exportLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    regionResult: [],
                    monthResult: []
                },
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                let vm = this;
                vm.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 50,
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")
                };
            },
            searchList() {//查询
                let vm = this
                if (!vm.searchParam.startActualDepartureTime || !vm.searchParam.endActualDepartureTime) {
                    return this.$message.warning('请输入查询时间');
                }
                vm.isLoading = true;
                //查询地区的数据
                Http.get(Api.lossLineCustomerStatistics.pageRegion, {params: vm.searchParam}, result => {
                    this.searchResult.regionResult = result.result;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                });
                // //查询月份的数据
                Http.get(Api.lossLineCustomerStatistics.pageMonth, {params: vm.searchParam}, result => {
                    this.searchResult.monthResult = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                })
            },
            showCustomerPaidDetail(row, param,token) {//显示亏损线路明细对话框
                let vm = this;
                vm.lossLineCustomerStatisticsDialog = true;
                vm.currentRows=row;
                if(token===1){
                    vm.regionCode=param;
                }else{
                    vm.month=param;
                }
                vm.startActualDepartureTime=vm.searchParam.startActualDepartureTime;
                vm.endActualDepartureTime=vm.searchParam.endActualDepartureTime;
            },
            hideReceiveDetail() {//关闭亏损线路明细对话框
                this.lossLineCustomerStatisticsDialog = false;
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            regionExportList() {//导出地区数据
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.lossLineCustomerStatistics.exportRegion, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '亏损线路客户统计(地区).xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            monthExportList() {//导出月份数据
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.lossLineCustomerStatistics.exportMonth, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '亏损线路客户统计(月份).xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
        }
    }
</script>
