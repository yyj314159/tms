<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础信息</el-breadcrumb-item>
                <el-breadcrumb-item>区域利润扣除</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <el-input v-model="searchParam.orgCode"></el-input>
                            <!--<current-org-select v-model="searchParam.orgCode"-->
                            <!--style="display: block"></current-org-select>-->
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="类型:">
                            <dictionary-select v-model="searchParam.deductType" option-name="DEDUCT_TYPE"
                                               style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="display:block;">
                        <el-form-item label="钉钉审批编号:">
                            <el-input v-model="searchParam.approvalNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
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
            <el-button v-if="exportLoading" size="mini" type="primary" icon="el-icon-download" @click="exportForTable"
                       v-permission="'/areaProfitDeduct/export'">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight"
                      :style="{height:'auto'}">
                <el-table-column align="center" label="审批编号" prop="approvalNo" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="区域" prop="orgCode" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="扣除年份" prop="deductYear" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="扣除金额" prop="deductAmount" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="扣除类型" prop="deductType" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="关联审批" prop="relevanceApprovalNo" min-width="200"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="备注说明" prop="remarks" min-width="200"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="附件" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <show-image v-if="scope.row.attachment!='null'"
                                    :url="scope.row.attachment"></show-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="申请人" prop="applyUser" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="申请时间" prop="applyTime" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="审核状态" prop="auditStatus" min-width="140"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AREA_PROFIT_DEDUCT" v-model="scope.row.auditStatus"/>
                    </template>
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
    </el-container>
</template>

<script>
    import {Http, Api, Common} from 'src/global'

    export default {
        data() {
            return {
                common: Common,
                exportLoading: true,
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    orgCode: '',
                    deductType: '',
                    approvalNo: '',
                },
                isLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                tableHeight: window.innerHeight > 800 ? 480 : null,
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
                    orgCode: '',
                    deductType: '',
                    approvalNo: '',
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.areaProfitDeduct.page, {params: vm.searchParam}, result => {
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
            //导出
            exportForTable() {
                let vm = this;
                vm.exportLoading = false;
                Http.get(Api.areaProfitDeduct.page, {params: vm.searchParam}, result => {
                    let header = ['审批编号', '区域', '扣除年份', '扣除金额', '扣除类型', '关联审批', '备注说明', '申请人', '申请时间', '审核状态'];
                    let filterVal = ['approvalNo', 'orgCode', 'deductYear', 'deductAmount', 'deductType', 'relevanceApprovalNo', 'remarks', 'applyUser', 'applyTime', {
                        type: 'dictionary',
                        'code': 'AREA_PROFIT_DEDUCT',
                        'name': 'auditStatus'
                    }];
                    Common.excel.downloadExl(result.result, header, filterVal, "区域利润扣除导出");
                    vm.exportLoading = true;
                }, () => {
                    vm.exportLoading = true;
                })
            },
        }
    }
</script>
