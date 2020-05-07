<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>客户利润报表</el-breadcrumb-item>
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
            <el-tabs type="border-card" v-model="defaultShow" @tab-click="handleClick">
                <el-tab-pane label="按地区:" name="auto">
                    <el-button v-if="regionExportLoading" v-permission="'/customerProfitChartRegion/export'"
                               icon="el-icon-download"
                               type="primary" size="mini" @click="regionExportList">导出(地区)
                    </el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
                    </el-button>
                    <el-table v-loading="isLoading" size="small" class="content-table"
                              :data="searchResult.regionResult"
                              element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                        <el-table-column label="顶级客户" min-width="100" header-align="center" align="center"
                                         show-overflow-tooltip prop="customerName"></el-table-column>
                        <el-table-column label="上海区" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="shq" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00000064')">{{scope.row.shq === null ?
                                        '0':scope.row.shq}}</a>

                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="shq1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.shq1 === null ? '0':scope.row.shq1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="shq2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.shq2 === null ? '0':scope.row.shq2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="shq3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.shq3 === null ? '0':scope.row.shq3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="shq4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.shq4 === null ? '0':scope.row.shq4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="东北大区" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="dbdq" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00000001')">{{scope.row.dbdq === null ?
                                        '0':scope.row.dbdq}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="dbdq1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.dbdq1 === null ? '0':scope.row.dbdq1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="dbdq2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.dbdq2 === null ? '0':scope.row.dbdq2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="dbdq3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.dbdq3 === null ? '0':scope.row.dbdq3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="dbdq4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.dbdq4 === null ? '0':scope.row.dbdq4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="中原大区" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="zydq" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00000009')">{{scope.row.zydq === null ?
                                        '0':scope.row.zydq}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="zydq1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.zydq1 === null ? '0':scope.row.zydq1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="zydq2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.zydq2 === null ? '0':scope.row.zydq2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="zydq3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.zydq3 === null ? '0':scope.row.zydq3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="zydq4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.zydq4 === null ? '0':scope.row.zydq4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="华中大区" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="hzdq" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00000004')">{{scope.row.hzdq === null ?
                                        '0':scope.row.hzdq}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="hzdq1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.hzdq1 === null ? '0':scope.row.hzdq1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="hzdq2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.hzdq2 === null ? '0':scope.row.hzdq2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="hzdq3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.hzdq3 === null ? '0':scope.row.hzdq3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="hzdq4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.hzdq4 === null ? '0':scope.row.hzdq4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="华北大区" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="hbdq" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00000002')">{{scope.row.hbdq === null ?
                                        '0':scope.row.hbdq}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="hbdq1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.hbdq1 === null ? '0':scope.row.hbdq1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="hbdq2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.hbdq2 === null ? '0':scope.row.hbdq2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="hbdq3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.hbdq3 === null ? '0':scope.row.hbdq3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="hbdq4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.hbdq4 === null ? '0':scope.row.hbdq4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="华南大区" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="hndq" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00000003')">{{scope.row.hndq === null ?
                                        '0':scope.row.hndq}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="hndq1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.hndq1 === null ? '0':scope.row.hndq1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="hndq2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.hndq2 === null ? '0':scope.row.hndq2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="hndq3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.hndq3 === null ? '0':scope.row.hndq3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="hndq4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.hndq4 === null ? '0':scope.row.hndq4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="新疆区" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="xjq" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00000062')">{{scope.row.xjq === null ?
                                        '0':scope.row.xjq}}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="xjq1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.xjq1 === null ? '0':scope.row.xjq1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="xjq2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.xjq2 === null ? '0':scope.row.xjq2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="xjq3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.xjq3 === null ? '0':scope.row.xjq3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="xjq4" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.xjq4 === null ? '0':scope.row.xjq4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="江苏区" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="jsq" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00000065')">{{scope.row.jsq === null ?
                                        '0':scope.row.jsq}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="jsq1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jsq1 === null ? '0':scope.row.jsq1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="jsq2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jsq2 === null ? '0':scope.row.jsq2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="jsq3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jsq3 === null ? '0':scope.row.jsq3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="jsq4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jsq4 === null ? '0':scope.row.jsq4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="浙皖大区" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="zwdq" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00000008')">{{scope.row.zwdq === null ?
                                        '0':scope.row.zwdq}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="zwdq1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.zwdq1 === null ? '0':scope.row.zwdq1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="zwdq2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.zwdq2 === null ? '0':scope.row.zwdq2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="zwdq3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.zwdq3 === null ? '0':scope.row.zwdq3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="zwdq4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.zwdq4 === null ? '0':scope.row.zwdq4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="福建区" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="fjq" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00000063')">{{scope.row.fjq === null ?
                                        '0':scope.row.fjq}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="fjq1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.fjq1 === null ? '0':scope.row.fjq1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="fjq2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.fjq2 === null ? '0':scope.row.fjq2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="fjq3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.fjq3 === null ? '0':scope.row.fjq3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="fjq4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.fjq4 === null ? '0':scope.row.fjq4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="西北大区" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="xbdq" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00000006')">{{scope.row.xbdq === null ?
                                        '0':scope.row.xbdq}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="xbdq1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.xbdq1 === null ? '0':scope.row.xbdq1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="xbdq2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.xbdq2 === null ? '0':scope.row.xbdq2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="xbdq3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.xbdq3 === null ? '0':scope.row.xbdq3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="xbdq4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.xbdq4 === null ? '0':scope.row.xbdq4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="西南大区" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="xndq" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00000007')">{{scope.row.xndq === null ?
                                        '0':scope.row.xndq}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="xndq1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.xndq1 === null ? '0':scope.row.xndq1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="xndq2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.xndq2 === null ? '0':scope.row.xndq2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="xndq3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.xndq3 === null ? '0':scope.row.xndq3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="xndq4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.xndq4 === null ? '0':scope.row.xndq4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="合计" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="count" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00000000')">{{scope.row.count}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="count1" width="120px" header-align="center"
                                             align="center"></el-table-column>
                            <el-table-column label="应付" prop="count2" width="120px" header-align="center"
                                             align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="count3" width="120px" header-align="center"
                                             align="center"></el-table-column>
                            <el-table-column label="利润率" prop="count4" header-align="center"
                                             align="center"></el-table-column>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="按月份:" name="manual">
                    <el-button v-if="monthExportLoading" v-permission="'/customerProfitChartMonth/export'"
                               icon="el-icon-download"
                               type="primary" size="mini" @click="monthExportList">导出(月份)
                    </el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
                    </el-button>
                    <el-table v-loading="isLoading" size="small" class="content-table"
                              :data="searchResult.monthResult"
                              element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                        <el-table-column label="顶级客户" header-align="center" align="center"
                                         show-overflow-tooltip prop="monthCustomerName"></el-table-column>
                        <el-table-column label="1月" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="jan" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'01')">{{scope.row.jan === null ?
                                        '0':scope.row.jan}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="jan1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jan1 === null ? '0':scope.row.jan1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="jan2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jan2 === null ? '0':scope.row.jan2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="jan3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jan3 === null ? '0':scope.row.jan3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="jan4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jan4 === null ? '0':scope.row.jan4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="2月" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="feb" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'02')">{{scope.row.feb === null ?
                                        '0':scope.row.feb}}</a>

                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="feb1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.feb1 === null ? '0':scope.row.feb1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="feb2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.feb2 === null ? '0':scope.row.feb2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="feb3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.feb3 === null ? '0':scope.row.feb3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="feb4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.feb4 === null ? '0':scope.row.jan4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="3月" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="mar" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'03')">{{scope.row.mar === null ?
                                        '0':scope.row.mar}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="mar1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.mar1 === null ? '0':scope.row.mar1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="mar2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.mar2 === null ? '0':scope.row.mar2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="mar3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.mar3 === null ? '0':scope.row.mar3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="mar4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.mar4 === null ? '0':scope.row.mar4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="4月" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="apr" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'04')">{{scope.row.apr === null ?
                                        '0':scope.row.apr}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="apr1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.apr1 === null ? '0':scope.row.apr1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="apr2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.apr2 === null ? '0':scope.row.apr2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="apr3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.apr3 === null ? '0':scope.row.apr3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="apr4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.apr4 === null ? '0':scope.row.apr4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="5月" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="may" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'05')">{{scope.row.may === null ?
                                        '0':scope.row.may}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="may1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.may1 === null ? '0':scope.row.may1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="may2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.may2 === null ? '0':scope.row.may2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="may3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.may3 === null ? '0':scope.row.may3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="may4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.may4 === null ? '0':scope.row.may4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="6月" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="jun" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'06')">{{scope.row.jun === null ?
                                        '0':scope.row.jun}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="jun1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jun1 === null ? '0':scope.row.jun1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="jun2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jun2 === null ? '0':scope.row.jun2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="jun3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jun3 === null ? '0':scope.row.jun3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="jun4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jun4 === null ? '0':scope.row.jun4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="7月" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="jul" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'07')">{{scope.row.jul === null ?
                                        '0':scope.row.jul}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="jul1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jul1 === null ? '0':scope.row.jul1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="jul2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jul2 === null ? '0':scope.row.jul2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="jul3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jul3 === null ? '0':scope.row.jul3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="jul4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.jul4 === null ? '0':scope.row.jul4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="8月" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="aug" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'08')">{{scope.row.aug === null ?
                                        '0':scope.row.aug}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="aug1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.aug1 === null ? '0':scope.row.aug1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="aug2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.aug2 === null ? '0':scope.row.aug2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="aug3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.aug3 === null ? '0':scope.row.aug3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="aug4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.aug4 === null ? '0':scope.row.aug4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="9月" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="sep" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'09')">{{scope.row.sep === null ?
                                        '0':scope.row.sep}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="sep1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.sep1 === null ? '0':scope.row.sep1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="sep2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.sep2 === null ? '0':scope.row.sep2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="sep3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.sep3 === null ? '0':scope.row.sep3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="sep4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.sep4 === null ? '0':scope.row.sep4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="10月" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="oct" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'10')">{{scope.row.oct === null ?
                                        '0':scope.row.oct}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="oct1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.oct1 === null ? '0':scope.row.oct1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="oct2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.oct2 === null ? '0':scope.row.oct2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="oct3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.oct3 === null ? '0':scope.row.oct3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="oct4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.oct4 === null ? '0':scope.row.oct4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="11月" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="nov" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'11')">{{scope.row.nov === null ?
                                        '0':scope.row.nov}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="nov1" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.nov1 === null ? '0':scope.row.nov1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="nov2" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.nov2 === null ? '0':scope.row.nov2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="nov3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.nov3 === null ? '0':scope.row.nov3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="nov4" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.nov4 === null ? '0':scope.row.nov4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="12月" show-overflow-tooltip header-align="center"
                                         align="center">
                            <el-table-column label="发车趟次" prop="dec" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'12')">{{scope.row.dec === null ?
                                        '0':scope.row.dec}}</a>

                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="dec1" width="120px" header-align="center" align="center">
                                <template slot-scope="scope">
                                    {{scope.row.dec1 === null ? '0':scope.row.dec1}}
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="dec2" width="120px" header-align="center" align="center">
                                <template slot-scope="scope">
                                    {{scope.row.dec2 === null ? '0':scope.row.dec2}}
                                </template>
                            </el-table-column>
                            <el-table-column label="经营利润" prop="dec3" width="120px" header-align="center"
                                             align="center">
                                <template slot-scope="scope">
                                    {{scope.row.dec3 === null ? '0':scope.row.dec3}}
                                </template>
                            </el-table-column>
                            <el-table-column label="利润率" prop="dec4" header-align="center" align="center">
                                <template slot-scope="scope">
                                    {{scope.row.dec4 === null ? '0':scope.row.dec4}}
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="合计" show-overflow-tooltip header-align="center" align="center">
                            <el-table-column label="发车趟次" prop="monthCount" header-align="center" align="center">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showCustomerPaidDetail(scope.row,'00')">{{scope.row.monthCount}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="应收" prop="monthCount1" width="120px" header-align="center"
                                             align="center"></el-table-column>
                            <el-table-column label="应付" prop="monthCount2" width="120px" header-align="center"
                                             align="center"></el-table-column>
                            <el-table-column label="经营利润" prop="monthCount3" width="120px" header-align="center"
                                             align="center"></el-table-column>
                            <el-table-column label="利润率" prop="monthCount4" header-align="center"
                                             align="center"></el-table-column>
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
        <receiveSettlementUnusualDetailDialog v-if="receiveDetailDialog" :visible="receiveDetailDialog"
                                              @close="hideReceiveDetail"
                                              :currentRowed="currentRows"
                                              :actualDepartureStartTime="startActualDepartureTime"
                                              :actualDepartureEndTime="endActualDepartureTime"
                                              :month="month" :regionCode="regionCode" :customerCode="customerCode"
                                              :kabanFlag="kabanFlag" :optionMenu="optionMenu"
        />
    </el-container>
</template>

<script>
    import {Http, Api, Common} from 'src/global'
    import axios from 'axios'
    import receiveSettlementUnusualDetailDialog from "./ReceiveSettlementUnusualDetailDialog"

    export default {
        components: {receiveSettlementUnusualDetailDialog},
        data() {
            return {
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 20,
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),
                },
                isLoading: true,
                defaultShow: 'auto',
                monthExportLoading: true,
                regionExportLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    regionResult: [],
                    monthResult: []
                },
                startActualDepartureTime: '',
                endActualDepartureTime: '',
                receiveDetailDialog: false,
                currentRows: '',
                receiveAmount: '',
                checkValue: '',
                month: '',
                regionCode: '',
                customerCode: '',
                monthCustomerCode: '',
                kabanFlag: '',
                optionMenu: 'customerProfitChart',
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
                    pageSize: 20,
                    // startActualDepartureTime: Common.date.dateFormat(new Date().getTime() - 3600 * 1000 * 24 * 7, "YYYY-MM-DD 00:00:00"),//发车时间
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")
                };
            },
            handleClick() {//重置传递参数
                let vm = this;
                vm.customerCode = '';
                vm.month = '';
                vm.regionCode = '';
                vm.receiveDetailDialog = '';
            },
            //关闭应付明细对话框
            hideReceiveDetail() {
                this.receiveDetailDialog = false;
            },
            //显示应付明细对话框
            showCustomerPaidDetail(row, common) {
                let vm = this;
                vm.currentRows = row;
                if (common.length == 2) {
                    if (common == '00') {
                        vm.month = null;
                    } else {
                        vm.month = common;
                    }
                    vm.customerCode = row.monthCustomerCode;
                }
                if (common.length == 8) {
                    if (common == '00000000') {
                        vm.regionCode = null;
                    } else {
                        vm.regionCode = common;
                    }
                    vm.customerCode = row.customerCode;
                }
                vm.kabanFlag = null;
                vm.receiveDetailDialog = true;
                vm.customerProfitChart = true;
                vm.startActualDepartureTime = vm.searchParam.startActualDepartureTime;
                vm.endActualDepartureTime = vm.searchParam.endActualDepartureTime;
            },
            searchList() {//查询
                let vm = this
                if (!vm.searchParam.startActualDepartureTime || !vm.searchParam.endActualDepartureTime) {
                    return this.$message.warning('必须存在开始时间和结束时间！')
                }
                vm.isLoading = true;
                Http.get(Api.customerProfitChart.pageRegion, {params: vm.searchParam}, result => {
                    this.searchResult.regionResult = result.result;
                    // this.searchResult.totalCount = result.totalCount;
                    // this.searchParam.currentPage = result.currentPage;
                    // this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                });
                Http.get(Api.customerProfitChart.pageMonth, {params: vm.searchParam}, result => {
                    this.searchResult.monthResult = result.result;
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
            regionExportList() {
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.customerProfitChart.exportRegion, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '客户利润统计(地区).xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            monthExportList() {
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.customerProfitChart.exportMonth, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '客户利润统计(月份).xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
        }
    }
</script>
