<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>应收结算价格异常报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start"
                                                :end-date="searchParam.endActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end"
                                                :start-date="searchParam.startActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="所属大区:">
                            <current-org-select v-model="searchParam.regionCodeName" style="display: block"
                                                nature="AREA"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="指定值:">
                            <el-input
                                placeholder="请输入内容"
                                v-model="searchParam.checkValue"
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
            <el-button v-if="exportLoading" v-permission="'/receiveSettlementUnusual/export/'" icon="el-icon-download"
                       type="primary" size="mini" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" prop="regionCodeName" label="大区名称" width="120"></el-table-column>
                <el-table-column align="center" prop="belongOrgCodeName" label="分区名称" width="120"></el-table-column>
                <el-table-column align="center" prop="count" label="运单数量" width="120">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;"
                           @click="showReceivePaidDetail(scope.row,null,null)">{{scope.row.count}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="totalDiffAmount" label="差异金额" width="120"></el-table-column>
                <el-table-column align="center" label="运单量分布">
                    <el-table-column align="center" prop="jan" label="<=1个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,0,1)">{{scope.row.jan}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="feb" label="1~2个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,1,2)">{{scope.row.feb}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="mar" label="2~3个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,2,3)">{{scope.row.mar}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="apr" label="3~4个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,3,4)">{{scope.row.apr}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="may" label="4~5个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,4,5)">{{scope.row.may}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="jun" label="5~6个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,5,6)">{{scope.row.jun}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="jul" label="6~7个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,6,7)">{{scope.row.jul}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="aug" label="7~8个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,7,8)">{{scope.row.aug}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="sep" label="8~9个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,8,9)">{{scope.row.sep}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="oct" label="9~10个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,9,10)">{{scope.row.oct}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="nov" label="10~11个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,10,11)">{{scope.row.nov}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="dec" label="11~12个月" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,11,12)">{{scope.row.dec}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="out" label="12个月以上" width="100">
                        <template slot-scope="scope">
                            <a href="javascript:void(0)" style="color: #409EFF;"
                               @click="showReceivePaidDetail(scope.row,null,12)">{{scope.row.out}}</a>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[ 20, 50, 100]"
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
                                              :actualDepartureEndTime="endActualDepartureTime" :optionMenu="optionMenu"
                                              :checkValue="checkValue" :num1=num1 :num2=num2 :kabanFlag="kabanFlag" />
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
                    pageSize: 20,
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//实际发车开始时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),//实际发车结束时间
                    regionCodeName: '',//大区
                    checkValue: '500',//制定值大小
                    isNO: 'false'
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                startActualDepartureTime: '',
                endActualDepartureTime: '',
                receiveDetailDialog: false,
                currentRows: '',
                receiveAmount: '',
                checkValue: '',
                month: '',
                kabanFlag:'',
                optionMenu:'receiveSettlementUnusual'
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
                    pageSize: 20,
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//实际发车开始时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),//实际发车结束时间
                    checkValue: '500',//制定值大小
                    regionCodeName: '',
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.receiveSettlementUnusual.page, {params: vm.searchParam}, result => {
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
                axios.get(Api.receiveSettlementUnusual.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应收结算价格异常报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },

        }
    }
</script>

