<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 我的审批</el-breadcrumb-item>
                <el-breadcrumb-item>保证金审批</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="申请人:">
                            <user-select v-model="searchParam.applyUser" style="display:block;"></user-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select option-name="AUDIT_STATUS" v-model="searchParam.auditStatus"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请时间:">
                            <el-date-picker
                                v-model="searchParam.applyTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width:100%"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="保证金编号:">
                            <el-input v-model="searchParam.depositCode" style="display:block"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="操作类型:">
                            <dictionary-select option-name="DEPOSIT_OPERATION_TYPE" v-model="searchParam.operationType"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" style="float: right">
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
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="保证金编号" prop="depositCode" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;display:inline-block;" @click="showDeposit(scope.row)">{{scope.row.depositCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="操作类型" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="DEPOSIT_OPERATION_TYPE"
                                                :value="scope.row.operationType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="保证金金额" prop="depositAmount" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="转出金额" prop="depositOutAmount" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="转出差额" prop="depositOutBalanceAmount" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="退回金额" prop="depositReturnAmount" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="备注" prop="remark" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="申请人" prop="createUser" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="申请时间" prop="createTime" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核人" prop="auditor" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核状态" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS"
                                                v-model="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核意见" prop="auditRemark" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核时间" prop="auditTime" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" fixed="left" align="center" label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/depositAudit/audit'"
                                   :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED || scope.row.operationType === 'DEPOSIT_TRANSFER'"
                                   icon="el-icon-tickets" size="mini" @click="showAuditWindow(scope.row)">审批
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

        <!-- 审核申请内容 -->
        <el-dialog :title="title" :visible.sync="showAuditDetail" width="45%" @close="resetAuditForm" :top="marginTop" id="AuditDetail">
            <el-form :model="auditContentForm" size="small" label-position="left">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="保证金编号:">
                            {{auditContentForm.depositCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="操作类型:">
                            <dictionary-select-name option-name="DEPOSIT_OPERATION_TYPE"
                                                    :value="auditContentForm.operationType"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="保证金金额:">
                            {{auditContentForm.depositAmount}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="转出金额:">
                            {{auditContentForm.depositOutAmount}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="转出差额:">
                            {{auditContentForm.depositOutBalanceAmount}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="退回金额:">
                            {{auditContentForm.depositReturnAmount}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="备注:">
                            {{auditContentForm.remark}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <span class="blue" v-show="isTransfer">保证金转履约金信息</span>
                <el-row v-show="isTransfer">
                    <el-col :span="8">
                        <el-form-item label="收款抬头:">
                            {{auditContentForm.performance ? auditContentForm.performance.collectCompany : ""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="收款银行:">
                            {{auditContentForm.performance ? auditContentForm.performance.collectBank : ""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="收款账号:">
                            {{auditContentForm.performance ? auditContentForm.performance.collectAccount : ""}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isTransfer">
                    <el-col :span="8">
                        <el-form-item label="应回款时间:">
                            {{auditContentForm.performance ? auditContentForm.performance.receivedDate : ""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="逾期提醒:">
                            {{auditContentForm.performance ? auditContentForm.performance.overdueDay : ""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出款抬头:">
                            {{auditContentForm.performance ? auditContentForm.performance.paymentCompany : ""}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isTransfer">
                    <el-col :span="8">
                        <el-form-item label="出款银行:">
                            {{auditContentForm.performance ? auditContentForm.performance.paymentBank : ""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="应支付日期:">
                            {{auditContentForm.performance ? auditContentForm.performance.paymentDate : ""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合同附件:">
                            <show-image :url="auditContentForm.performance ? auditContentForm.performance.contractAttachment : ''" class1="preImg"></show-image>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isTransfer">
                    <el-col :span="8">
                        <el-form-item label="则一客户:">
                            {{auditContentForm.performance ? auditContentForm.performance.customerName : ""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="业务经手人:">
                            {{auditContentForm.performance ? auditContentForm.performance.handler : ""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合同编号:">
                            {{auditContentForm.performance ? auditContentForm.performance.contractCode : ""}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isTransfer">
                    <el-col :span="8">
                        <el-form-item label="合同名称:">
                            {{auditContentForm.performance ? auditContentForm.performance.contractName : ""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合同线路备注:">
                            {{auditContentForm.performance ? auditContentForm.performance.lineRemark : ""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="备注:">
                            {{auditContentForm.performance ? auditContentForm.performance.remark : ""}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-form size="small" :model="auditOpinionForm" label-position="left">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="审核：">
                            <el-switch v-model="auditOpinionForm.auditStatus" active-color="#13ce66"
                                       inactive-color="#ff4949"
                                       :active-value="Constant.AUDIT_STATUS.PASS"
                                       :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                       active-text="同意" inactive-text="拒绝"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！"
                                      v-model="auditOpinionForm.auditRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAuditDetail = false">取 消</el-button>
                <el-button size="small" type="primary" @click="auditSubmit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 保证金详情 -->
        <deposit-info-dialog v-if="showDepositInfo"  :dialogVisible="showDepositInfo" @close="hideDepositInfo"  :currentRow="currentRow"></deposit-info-dialog>
    </el-container>
</template>

<script>
    import {Http, Api, Validate, Common, Constant} from 'src/global'
    import depositInfoDialog from 'src/components/page/business/DepositInfoDialog'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                isTransfer: false,
                showAuditDetail: false,//申请内容
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    applyUser: '',//申请人
                    auditStatus: Constant.AUDIT_STATUS.UNAUDITED,//审核状态
                    applyTime: [],//创建时间
                    startApplyTime: '',
                    endApplyTime: '',
                    depositCode: '',
                    operationType: '',
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null,//操作行的数据
                title: "",
                auditContentForm: {
                    performance: {}
                },
                auditOpinionForm: {
                    auditStatus: Constant.AUDIT_STATUS.PASS,
                    auditRemark: ""
                },
                showDepositInfo: false
            }
        },
        components:{
            depositInfoDialog
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
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.applyUser = '';
                this.searchParam.auditStatus = '';
                this.searchParam.applyTime = [];
                this.searchParam.startApplyTime = '';
                this.searchParam.endApplyTime = '';
                this.searchParam.depositCode = '';
                this.searchParam.operationType = '';
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
                Http.get(Api.depositAudit.page, {params: vm.searchParam}, result => {
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
            showAuditWindow(row) {
                let vm = this;
                Http.get(Api.depositAudit.queryById, {params: {'id': row.id}}, result => {
                    vm.auditContentForm = result.result;
                    if (vm.auditContentForm.operationType === 'ADD' || vm.auditContentForm.operationType === 'MODIFY') {
                        vm.title = `保证金新增修改审批`;
                        vm.isTransfer = false;
                    } else if (vm.auditContentForm.operationType === 'RETURN') {
                        vm.title = `保证金退回审批`;
                        vm.isTransfer = false;
                    } else if (vm.auditContentForm.operationType === 'BAD'){
                        vm.title = `保证金坏账审批`;
                        vm.isTransfer = false;
                    } else{
                        vm.title = `保证金转履约金审批`;
                        vm.isTransfer = true;
                    }
                    vm.showAuditDetail = true;
                })
            },
            auditSubmit() {
                let vm = this;
                vm.auditOpinionForm.id = vm.auditContentForm.id;
                vm.auditOpinionForm.operationType = vm.auditContentForm.operationType;
                Http.post(Api.depositAudit.audit, vm.auditOpinionForm, result => {
                    vm.showAuditDetail = false;
                    vm.$message.success('审批完成！');
                    vm.searchList();
                })
            },
            resetAuditForm() {
                let vm = this;
                vm.auditOpinionForm.auditStatus = Constant.AUDIT_STATUS.PASS;
                vm.auditOpinionForm.auditRemark = '';
            },
            showDeposit(row){//保证金详情
                this.currentRow = row;
                this.showDepositInfo = true;
            },
            hideDepositInfo(){//关闭保证金详情
                this.showDepositInfo = false;
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

    .el-form-item {
        margin-bottom: 8px;
    }

    #AuditDetail .preImg{
        width: 50%;
    }
</style>
