<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 发车计划</el-breadcrumb-item>
                <el-breadcrumb-item>我的线路</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="lineStoreSearchForm" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="lineStoreSearchForm.customerCode"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="lineStoreSearchForm.id" isTmp="0" style="display: block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出发城市:" prop="startCity">
                            <district-select v-model="lineStoreSearchForm.startCityArr"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的城市:" prop="endCity">
                            <district-select v-model="lineStoreSearchForm.endCityArr"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float:right;">
                            <el-button type="success" icon="el-icon-search" @click="lineStoreSearchList">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetLineStoreSearchForm">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addNewLine">新增收藏</el-button>
            <el-button size="mini" type="primary" :disabled="multipleSelection.length<=0" @click="handLineCollect">生成今日派车单</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="lineStoreSearchResult.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChangeLineStore"
                      border fit
                      ref="multipleTable"
                      highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center" label="客户" prop="line.customer.name"
                                 min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路编码" prop="line.code" min-width="300" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="line.name" min-width="260" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="line.departStation.name"
                                 min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="经停站点" prop="stopOverStationName"
                                 min-width="280" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="line.destStation.name"
                                 min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核状态" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS"
                                                :value="scope.row.line ? scope.row.line.auditStatus : null"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路类型" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_TYPE"
                                                :value="scope.row.line ? scope.row.line.lineType: null"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="营运类型" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_OPERATION_TYPE"
                                                :value="scope.row.line ? scope.row.line.operationType : null"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="考核方式" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_EVALUATION_MODE"
                                                :value="scope.row.line ? scope.row.line.evaluationMode : null"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="发车时间" prop="line.departTime"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="客户时效" min-width="150">
                    <template slot-scope="scope">
                        {{(scope.row.line.timeHour ? scope.row.line.timeHour : 0) + "小时" + (scope.row.line.timeMin ?
                        scope.row.line.timeMin : 0) + "分钟"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="则一时效" min-width="150">
                    <template slot-scope="scope">
                        {{(scope.row.line.timeZeyiHour ? scope.row.line.timeZeyiHour : 0) + "小时" +
                        (scope.row.line.timeZeyiMin ? scope.row.line.timeZeyiMin : 0) + "分钟"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="里程" prop="line.distance" min-width="80"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteLine(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChangeLineStore"
                    @current-change="handleCurrentChangeLineStore"
                    :page-sizes="[10,20,50]"
                    :page-size="lineStoreSearchForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="lineStoreSearchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>

        <add-line v-if="showAddLine" :dialogVisible="showAddLine" @close="hideAddLine"></add-line>
        <prompt-expect-departure-time-dialog :dialogVisible="showDepartureTimeDialog" :line-collect-form="multipleSelection" @close="hideDepartureTimeDialog"></prompt-expect-departure-time-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import addLine from './addLineDialog';
    import {Common} from 'src/global/common'
    import PromptExpectDepartureTimeDialog from "./PromptExpectDepartureTimeDialog";

    export default {
        data() {
            return {
                Common: Common,
                isLoading: true,
                showAddLine: false,
                showDepartureTimeDialog: false,
                lineStoreSearchForm: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    startCityArr: [],
                    startCity: '',
                    endCityArr: [],
                    endCity: '',
                    id: ''
                },
                lineStoreSearchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                addLineForm: {
                    lineId: ""
                },
                tableHeight: window.innerHeight>800?430:null
            }
        },
        components:{
            PromptExpectDepartureTimeDialog,
            addLine,
        },
        created() {
            this.lineStoreSearchList();
        },
        methods: {
            lineStoreSearchList() {    //查询
                let vm = this;
                vm.isLoading = true;
                this.lineStoreSearchForm.startCity = this.lineStoreSearchForm.startCityArr[1];
                this.lineStoreSearchForm.endCity = this.lineStoreSearchForm.endCityArr[1];
                vm.lineStoreSearchForm.lineId = vm.lineStoreSearchForm.id;
                Http.get(Api.lineCollect.page, {params: vm.lineStoreSearchForm}, result => {
                    this.lineStoreSearchResult.result = result.result;
                    this.lineStoreSearchResult.totalCount = result.totalCount;
                    this.lineStoreSearchResult.currentPage = result.currentPage;
                    this.lineStoreSearchResult.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            resetLineStoreSearchForm() {     //重置
                this.lineStoreSearchForm.customerCode = "";
                this.lineStoreSearchForm.startCityArr = [];
                this.lineStoreSearchForm.startCity = "";
                this.lineStoreSearchForm.endCityArr = [];
                this.lineStoreSearchForm.endCity = "";
                this.lineStoreSearchForm.id = "";
            },
            handleSizeChangeLineStore(val) {
                this.lineStoreSearchForm.pageSize = val;
                this.lineStoreSearchList();
            },
            handleCurrentChangeLineStore(val) {
                this.lineStoreSearchForm.currentPage = val;
                this.lineStoreSearchList();
            },
            handleSelectionChangeLineStore(val) {
                this.multipleSelection = val;
            },
            addNewLine() {
                this.showAddLine = true;
            },
            hideAddLine() {
                this.showAddLine = false;
                this.lineStoreSearchList();
            },
            hideDepartureTimeDialog() {
                this.showDepartureTimeDialog = false;
                this.lineStoreSearchList();
            },
            handLineCollect() {//根据所选的id生成派车单
                let vm = this;
                let ids = [];
                this.showDepartureTimeDialog = true;
            },
            deleteLine(row) {  //删除线路
                let vm = this
                let ids = []
                ids.push(row.id)
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.lineCollect.delete, ids, result => {
                        vm.lineStoreSearchList();
                    })
                })

            },
        }
    }
</script>

