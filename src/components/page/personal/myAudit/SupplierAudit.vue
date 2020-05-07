<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 我的审批</el-breadcrumb-item>
                <el-breadcrumb-item>供应商审批</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6" style="display:block;">
                        <el-form-item label="供应商名称:">
                            <el-input v-model="searchParam.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select v-model="searchParam.reviewType" style="display:block;"
                                               option-name="AUDIT_STATUS"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="操作状态:">
                            <dictionary-select option-name="SUPPLIER_OPERATION_STATUS"
                                               v-model="searchParam.operationStatus"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="申请人:">
                            <el-input v-model="searchParam.applyUser" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="申请时间:" label-width="100px">
                            <el-date-picker
                                v-model="searchParam.applyTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column label="大区" prop="regionCode" min-width="150"></el-table-column>
                <el-table-column label="分区" prop="belongOrgCode" min-width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="供应商名称" prop="name" min-width="100" show-overflow-tooltip/>
                <el-table-column label="类型" prop="type" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SUPPLIER_TYPE"
                                                :value="scope.row.type"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="联系人" prop="linkMan" min-width="100" show-overflow-tooltip/>
                <el-table-column label="联系方式" prop="contact" min-width="100" show-overflow-tooltip/>
                <el-table-column label="操作状态" prop="operationStatus" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SUPPLIER_OPERATION_STATUS"
                                                :value="scope.row.operationStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="结款周期" prop="payingCycle" min-width="100" show-overflow-tooltip/>
                <el-table-column label="押金状态" prop="depositStatus" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SUPPLIER_DEPOSIT_STATUS"
                                                :value="scope.row.depositStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="押金金额" prop="depositAmount" min-width="100" show-overflow-tooltip/>
                <el-table-column label="申请人" prop="createUser" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="申请时间" prop="createTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="审核人" prop="auditUser" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="审核时间" prop="auditTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="审核状态" min-width="140" prop="reviewType">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS"
                                                :value="scope.row.reviewType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="审核意见" prop="auditView" min-width="300" show-overflow-tooltip></el-table-column>
                <el-table-column label="作废意见" prop="invalidResult" min-width="300" show-overflow-tooltip></el-table-column>
                <el-table-column fixed="left" align="center" label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" :disabled="scope.row.reviewType !== Constant.AUDIT_STATUS.UNAUDITED"
                                   icon="el-icon-tickets" size="mini" @click="showAuditWindow(scope.row)"
                                   v-permission="'/supplier/audit'">审批
                        </el-button>
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
    import {Http, Api, Validate, Common, Constant} from 'src/global'
    import DatadictionaryName from "../../../common/select/DatadictionaryName";

    export default {
        components: {DatadictionaryName},
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                showAuditDetail: false,//申请内容
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    applyUser: '',//申请人
                    operationStatus: '',
                    reviewType: 'UNAUDITED',
                    applyTime: [],//创建时间
                    startApplyTime: '',
                    endApplyTime: '',
                    name: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null,//操作行的数据
                title: "",
                auditContentForm: {},
                auditOpinionForm: {
                    ids: [],
                    auditType: Constant.AUDIT_STATUS.PASS,
                    auditView: ''
                },
                selections: [],
                tableHeight: window.innerHeight > 800 ? 480 : null
            }
        },
        created() {
            this.searchList();
        },
        computed: {
            marginTop: function () { //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "15vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "8vh";
                }
            }
        },
        activated(){
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.applyUser = '';
                this.searchParam.operationStatus = '';
                this.searchParam.applyTime = [];
                this.searchParam.startApplyTime = '';
                this.searchParam.endApplyTime = '';
                this.searchParam.reviewType = '';
                this.searchParam.name = '';
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                if (this.searchParam.applyTime) {
                    this.searchParam.startApplyTime = this.searchParam.applyTime[0];
                    this.searchParam.endApplyTime = this.searchParam.applyTime[1];
                } else {
                    this.searchParam.startApplyTime = "";
                    this.searchParam.endApplyTime = "";
                }
                Http.get(Api.supplierAudit.page, {params: vm.searchParam}, result => {
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
            handleSelectionChange(val) {
                this.selections = val;
            },
            showAuditWindow(row) { //供应商审批详情------------------------------------
                if (this.$_permission('/personal/supplierExamine')) {
                    return this.$router.push({path: '/personal/supplierExamine', query: {detail: row}})
                }
            },
        }
    }
</script>
<style scoped>
    .blue {
        color: #20a0ff;
        display: inline-block;
        width: 150px;
        margin-bottom: 12px;
    }
</style>
