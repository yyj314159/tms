<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 调整单管理</el-breadcrumb-item>
                <el-breadcrumb-item>应付调整</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="90px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="调整单编号:">
                            <el-input v-model="searchParam.adjustCode" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单编号:">
                            <el-input v-model="searchParam.waybillCode" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="调整人员:">
                            <el-input v-model="searchParam.createUser" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核人员:">
                            <el-input v-model="searchParam.auditUser" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="大区:">
                            <org-select v-model="searchParam.regionCode" style="display:block"
                                        nature="AREA"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="小区:">
                            <org-select v-model="searchParam.belongOrgCode" style="display:block"
                                        nature="PARTITION"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam" size="small">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="payableAdjustBillAddDialog=true"
                       v-permission="permission.add">新增
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-tickets"
                       @click="auditStatusSubmit" v-permission="permission.auditStatus">审核

            </el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"/>
                <el-table-column align="center" min-width="140" label="调整单编号" prop="adjustCode"/>
                <el-table-column align="center" min-width="140" label="运单编号" prop="waybillCode"/>
                <el-table-column align="center" min-width="140" label="大区" prop="regionName"/>
                <el-table-column align="center" min-width="140" label="小区" prop="belongOrgName"/>
                <el-table-column align="center" min-width="140" label="调整金额(调增)" prop="settlementAmountAdjust"/>
                <el-table-column align="center" min-width="140" label="时效扣款(调减)"
                                 prop="qualityDeductionsAmountAdjust"/>
                <el-table-column align="center" min-width="140" label="油价补差(调增)" prop="oilPriceSupplementAdjust"/>
                <el-table-column align="center" min-width="140" label="其他扣款(调减)" prop="otherDeductionsAmountAdjust"/>
                <el-table-column align="center" min-width="140" label="调整人员" prop="createUser"/>
                <el-table-column align="center" min-width="140" label="调整时间" prop="createTime"/>
                <el-table-column align="center" min-width="140" label="审核状态" prop="auditStatus">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS"
                                                :value="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="140" label="审核人员" prop="auditUser">
                </el-table-column>
                <el-table-column align="center" min-width="140" label="审核时间" prop="auditTime">
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini" v-if="scope.row.auditStatus!='PASS' "
                                   @click="payableAdjustBillModify(scope.row)" :v-permission="permission.modify"/>
                        <el-button type="text" icon="el-icon-delete" size="mini" v-if="scope.row.auditStatus!='PASS' "
                                   @click="deletePayableAdjustBill(scope.row)" :v-permission="permission.delete"/>
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

        <!-- 新增账单调整弹出框 -->
        <el-dialog title="新增账单调整信息" :visible.sync="payableAdjustBillAddDialog" width="580px">
            <el-form size="small" inline :model="payableAdjustBillAddForm" :rules="payableAdjustBillRules"
                     ref="payableAdjustBillAddForm" label-width="190px">
                <el-form-item label="运单编号:" prop="waybillCode">
                    <el-input v-model="payableAdjustBillAddForm.waybillCode" style="width:252px"></el-input>
                </el-form-item>
                <el-form-item label="调整金额(调增):" prop="settlementAmountAdjust">
                    <el-input v-model="payableAdjustBillAddForm.settlementAmountAdjust">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="时效扣款(调减):" prop="qualityDeductionsAmountAdjust">
                    <el-input v-model="payableAdjustBillAddForm.qualityDeductionsAmountAdjust" >
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="油价补差(调增):" prop="oilPriceSupplementAdjust">
                    <el-input v-model="payableAdjustBillAddForm.oilPriceSupplementAdjust">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="其他扣款(调减):" prop="otherDeductionsAmountAdjust">
                    <el-input v-model="payableAdjustBillAddForm.otherDeductionsAmountAdjust">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="payableAdjustBillAddDialog = false">取 消</el-button>
                <el-button size="small" type="primary"
                           @click="savePayableAdjustBillAddForm('payableAdjustBillAddForm')">确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 修改账单调整弹出框 -->
        <el-dialog title="修改账单调整信息" :visible.sync="payableAdjustBillModifyDialog" width="580px">
            <el-form size="small" inline :model="payableAdjustBillModifyForm" :rules="payableAdjustBillRules"
                     ref="payableAdjustBillModifyForm" label-width="190px">
                <el-form-item label="运单编号:" prop="waybillCode">
                    {{payableAdjustBillModifyForm.waybillCode}}
                </el-form-item>
                <el-form-item label="调整金额:" prop="settlementAmountAdjust">
                    <el-input v-model="payableAdjustBillModifyForm.settlementAmountAdjust">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="时效扣款(调减):" prop="qualityDeductionsAmountAdjust">
                    <el-input v-model="payableAdjustBillModifyForm.qualityDeductionsAmountAdjust" >
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <!--<el-form-item label="安全扣款(调减):" prop="securityDeductionsAmountAdjust">-->
                    <!--<el-input v-model="payableAdjustBillModifyForm.securityDeductionsAmountAdjust" style="width:200px">-->
                        <!--<template slot="append">元</template>-->
                    <!--</el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="油价补差(调增):" prop="oilPriceSupplementAdjust">
                    <el-input v-model="payableAdjustBillModifyForm.oilPriceSupplementAdjust" >
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="其他扣款(调减):" prop="otherDeductionsAmountAdjust">
                    <el-input v-model="payableAdjustBillModifyForm.otherDeductionsAmountAdjust" >
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="payableAdjustBillModifyDialog = false">取 消</el-button>
                <el-button size="small" type="primary"
                           @click="savePayableAdjustBillModifyForm('payableAdjustBillModifyForm')">确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 审核 -->
        <el-dialog title="调整单审核" :visible.sync="auditDialog" width="400px">
            <el-form inline size="small" :model="auditForm" ref="auditForm" label-width="100px">
                <el-switch
                    v-model="auditForm.auditStatus"
                    active-value="PASS"
                    inactive-value="NO_PASS"
                    active-text="通过"
                    inactive-text="不通过">
                </el-switch>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="auditDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="saveAuditStatus()">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http, Constant, Api, Validate} from 'src/global'

    export default {
        data() {
            var permission = {
                add: '/payableAdjustBill/add',
                modify: '/payableAdjustBill/modify',
                delete: '/payableAdjustBill/delete',
                auditStatus: '/payableAdjustBill/auditStatus'
            }
            return {
                permission: permission,
                multipleSelection: [],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    regionCode:'',
                    belongOrgCode:'',
                    adjustCode: '',
                    waybillCode: '',
                    adjustUser: '',
                    auditUser: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                payableAdjustBillAddDialog: false,
                payableAdjustBillAddForm: {
                    waybillCode: '',
                    settlementAmountAdjust: '',
                    qualityDeductionsAmountAdjust: '',
                    securityDeductionsAmountAdjust: '',
                    oilPriceSupplementAdjust: '',
                    otherDeductionsAmountAdjust: ''
                },
                payableAdjustBillModifyDialog: false,
                payableAdjustBillModifyForm: {
                    waybillCode: '',
                    settlementAmountAdjust: '',
                    qualityDeductionsAmountAdjust: '',
                    securityDeductionsAmountAdjust: '',
                    oilPriceSupplementAdjust: '',
                    otherDeductionsAmountAdjust: ''
                },
                payableAdjustBillRules: {
                    waybillCode: [
                        {required: true, message: '请输入运单编码', trigger: 'blur'}
                    ],
                    settlementAmountAdjust: [Validate.allMoney],
                    qualityDeductionsAmountAdjust: [Validate.allMoney],
                    securityDeductionsAmountAdjust: [Validate.allMoney],
                    oilPriceSupplementAdjust:[Validate.allMoney],
                    otherDeductionsAmountAdjust:[Validate.allMoney]
                },
                auditDialog: false,
                auditForm: {
                    auditStatus: "PASS",
                    ids: []
                }
            }
        },
        mounted() {
            //查询表格
            this.searchList();
        },
        methods: {
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam.waybillCode = '';
                vm.searchParam.adjustUser = '';
                vm.searchParam.auditUser = '';
            },
            searchList() {
                let vm = this;
                Http.get(Api.payableAdjustBill.page, {params: vm.searchParam}, response => {
                    vm.searchResult.result = response.result;
                    vm.searchResult.totalCount = response.totalCount;
                    vm.searchParam.currentPage = response.currentPage;
                    vm.searchParam.pageSize = response.pageSize;
                })
            },
            savePayableAdjustBillAddForm(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.payableAdjustBill.add, vm.payableAdjustBillAddForm, response => {
                            vm.resetPayableAdjustBillAddForm();
                            vm.payableAdjustBillAddDialog = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetPayableAdjustBillAddForm() {
                let vm = this;
                vm.payableAdjustBillAddForm = {
                    waybillCode: '',
                    settlementAmountAdjust: '',
                    qualityDeductionsAmountAdjust: '',
                    securityDeductionsAmountAdjust: '',
                    oilPriceSupplementAdjust: '',
                    otherDeductionsAmountAdjust: ''
                }
            },
            //通过ID回显数据
            payableAdjustBillModify(row) {
                let vm = this;
                Http.get(Api.payableAdjustBill.queryById, {params: {'id': row.id}}, response => {
                    vm.payableAdjustBillModifyForm = response.result;
                    vm.payableAdjustBillModifyDialog = true;
                })
            },
            savePayableAdjustBillModifyForm(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.payableAdjustBill.modify, vm.payableAdjustBillModifyForm, response => {
                            vm.payableAdjustBillModifyDialog = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除
            deletePayableAdjustBill(row) {
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.payableAdjustBill.delete, ids, response => {
                        vm.searchList();
                    })
                })
            },
            auditStatusSubmit() {
                let vm = this;
                if (vm.multipleSelection && vm.multipleSelection.length == 0) {
                    this.$message('请选择需要审核的数据');
                    return;
                }
                for (let i = 0; i < vm.multipleSelection.length; i++) {
                    if (vm.multipleSelection[i].auditStatus != Constant.AUDIT_STATUS.UNAUDITED) {
                        this.$message('请选择未审核的数据');
                        return;
                    }
                }
                vm.auditDialog = true;
            },
            restAuditStatusForm() {
                let vm = this;
                vm.auditForm = {
                    auditStatus: "PASS",
                    ids: []
                }
            },
            saveAuditStatus() {
                let vm = this;
                vm.auditForm.ids = [];
                if (vm.multipleSelection && vm.multipleSelection.length > 0) {
                    vm.multipleSelection.forEach(item => {
                        vm.auditForm.ids.push(item.id);
                    });
                    Http.post(Api.payableAdjustBill.auditStatus, vm.auditForm, response => {
                        vm.auditDialog = false;
                        if (response.success) {
                            this.$message({
                                message: '审核成功',
                                type: 'success'
                            });
                            vm.restAuditStatusForm();
                        }
                        vm.searchList();
                    })
                }
            },
        }
    }
</script>
