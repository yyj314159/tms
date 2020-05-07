<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>应付结算价格异常报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start"
                                                :end-date="searchParam.endActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end"
                                                :start-date="searchParam.startActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="所属大区:">
                            <org-select v-model="searchParam.regionCode" style="display: block"
                                        nature="AREA"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="指定值:">
                            <el-input
                                placeholder="请输入内容"
                                v-model="searchParam.checkValue" style="width:100%;"
                                clearable>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" style="float: right">
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
            <el-button v-if="exportLoading" v-permission="'/receivePaidDetail/export'" icon="el-icon-download"
                       type="primary" size="mini" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" prop="region" label="大区名称" width="120"></el-table-column>
                <el-table-column align="center" prop="belongOrg" label="分区名称" width="120"></el-table-column>
                <el-table-column align="center" prop="lineName" label="线路" width="300"></el-table-column>
                <el-table-column align="center" prop="specification" label="车型" width="120"></el-table-column>
                <el-table-column align="center" prop="lowPaidVehicleAmount" label="最低价格" width="140"></el-table-column>
                <el-table-column align="center" prop="count" label="异常价格运单量" width="120">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;"
                           @click="showReceivePaidDetail(scope.row,null,null)">{{scope.row.count}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="paidVehicleAmountSum" label="运费差异" width="120"></el-table-column>
                <el-table-column align="center" label="高价运单量分布">
                    <el-table-column align="center" prop="firstData" label="<=1个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,0,1)">{{scope.row.firstData}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="secondData" label="1~2个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,1,2)">{{scope.row.secondData}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="thirdData" label="2~3个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,2,3)">{{scope.row.thirdData}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="fourthData" label="3~4个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,3,4)">{{scope.row.fourthData}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="fifthData" label="4~5个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,4,5)">{{scope.row.fifthData}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="sixData" label="5~6个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,5,6)">{{scope.row.sixData}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="sevenData" label="6~7个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,6,7)">{{scope.row.sevenData}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="eightData" label="7~8个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,7,8)">{{scope.row.eightData}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="nineData" label="8~9个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,8,9)">{{scope.row.nineData}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="tenData" label="9~10个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,9,10)">{{scope.row.tenData}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="eleData" label="10~11个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,10,11)">{{scope.row.eleData}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="twelveData" label="11~12个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,11,12)">{{scope.row.twelveData}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="overData" label="12个月以上" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,null,12)">{{scope.row.overData}}</a>
                        </template>
                    </el-table-column>
                </el-table-column>
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
        <receiveSettlementUnusualDetailDialog v-if="receiveDetailDialog" :visible="receiveDetailDialog"
                                              @close="hideReceiveDetail"
                                              :currentRowed="currentRows"
                                              :actualDepartureStartTime="startActualDepartureTime"
                                              :actualDepartureEndTime="endActualDepartureTime"
                                              :checkValue="checkValue" :num1=num1 :num2=num2 :kabanFlag="kabanFlag"
                                              :optionMenu="optionMenu"/>
    </el-container>
</template>

<script>
    import {Http, Api, Validate, Common, Constant} from 'src/global/index'
    import axios from 'axios'
    import receiveSettlementUnusualDetailDialog from "./ReceiveSettlementUnusualDetailDialog"

    export default {
        components: {receiveSettlementUnusualDetailDialog},
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                exportLoading: true,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    regionCode: '',
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//实际发车开始时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),//实际发车结束时间
                    checkValue: '500',//制定值大小
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                startActualDepartureTime: '',//实际发车开始时间
                endActualDepartureTime: '',//实际发车结束时间
                receiveDetailDialog: false,
                currentRows: '',
                receiveAmount: '',
                checkValue: '',
                month: '',
                kabanFlag: '',
                optionMenu: 'payableSettlementUnusual'
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            //关闭应付明细对话框
            hideReceiveDetail() {
                this.receiveDetailDialog = false;
            },
            //显示应付明细对话框
            showReceivePaidDetail(row, num1, num2) {
                let vm = this;
                vm.currentRows = row;
                vm.num1 = num1;
                vm.num2 = num2;
                vm.month = null;
                vm.kabanFlag = '0';
                vm.receiveDetailDialog = true;
                vm.checkValue = vm.searchParam.checkValue;
                vm.startActualDepartureTime = vm.searchParam.startActualDepartureTime;
                vm.endActualDepartureTime = vm.searchParam.endActualDepartureTime;
            },
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    checkValue: '500',//制定值大小
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//实际发车开始时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),//实际发车结束时间
                };
            },
            searchList() {//查询
                debugger
                let vm = this;
                if (!vm.searchParam.startActualDepartureTime || !vm.searchParam.endActualDepartureTime) {
                    throw vm.$message.warning("必须选择开始时间和结束时间!")
                }
                vm.isLoading = true;
                Http.get(Api.payableSettlementUnusual.page, {params: vm.searchParam}, result => {
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
                axios.get(Api.payableSettlementUnusual.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应付结算异常价格报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
        }
    }
</script>

