<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 应收管理</el-breadcrumb-item>
                <el-breadcrumb-item>应收调整</el-breadcrumb-item>
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
                        <el-form-item label="运单号:">
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
                    <el-col :span="24">
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
            <el-button size="mini" type="primary" icon="el-icon-plus" v-permission="'/receiveAdjustBill/add'"
                       @click="receiveAdjustBillAddDialog=true">新增
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-tickets" v-permission="'/receiveAdjustBill/auditStatus'"
                       @click="auditStatusSubmit">审核
            </el-button>
            <el-button v-if="exportLoading" icon="el-icon-download" v-permission="'/receiveAdjustBill/export'" type="primary" size="mini" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" min-width="160px" label="调整单编号" prop="adjustCode" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" min-width="150px" label="运单号" prop="waybillCode" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" min-width="150px" label="调整前结算运费" prop="settlementAmount"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" min-width="150px" label="结算运费调整" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span style="color: red">{{scope.row.settlementAmountAdjustDiff}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="150px" label="调整后结算运费" prop="settlementAmountAdjust"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" min-width="120px" label="质量扣款调整" prop="qualityDeductionsAmountAdjust"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" min-width="120px" label="安全扣款调整" prop="securityDeductionsAmountAdjust"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" min-width="120px" label="油价补差调整" prop="oilPriceSupplementAdjust"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" min-width="120px" label="其他扣款调整" prop="otherDeductionsAmountAdjust"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" min-width="120px" label="调整后实际应收"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span style="color: #409EFF;">{{scope.row.actualReceiveAmount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="180px" label="调整原因" prop="adjustBillResult" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" min-width="150px" label="调整人员" prop="createUser" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" min-width="150px" label="调整时间" prop="createTime" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" min-width="100px" label="审核状态" prop="auditStatus" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS"
                                                :value="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="140px" label="审核人员" prop="auditUser">
                </el-table-column>
                <el-table-column align="center" min-width="135px" label="审核时间" prop="auditTime">
                </el-table-column>
                <el-table-column align="center" min-width="80px" label="发票日期" prop="invoiceMonth">
                </el-table-column>
                <el-table-column align="center" min-width="150px" label="发票号" show-overflow-tooltip
                                 prop="invoiceNo">
                </el-table-column>
                <el-table-column align="center" min-width="180px" label="发票备注" show-overflow-tooltip
                                 prop="invoiceRemark">
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini" v-if="scope.row.auditStatus!='PASS' "
                                   v-permission="'/receiveAdjustBill/modify'"
                                   @click="receiveAdjustBillModify(scope.row)"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini" v-if="scope.row.auditStatus!='PASS' "
                                   v-permission="'/receiveAdjustBill/delete'"
                                   @click="deleteReceiveAdjustBill(scope.row)"></el-button>
                        <el-button type="text" size="mini" @click="invoiceInfo(scope.row)"
                                   v-permission="'/receiveAdjustBill/invoice'">发票
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

        <!-- 新增账单调整弹出框 -->
        <el-dialog title="新增账单调整信息" :visible.sync="receiveAdjustBillAddDialog" width="800px">
            <el-form size="small" inline :model="receiveAdjustBillAddForm" :rules="receiveAdjustBillRules"
                     ref="receiveAdjustBillAddForm" label-width="140px">
                <el-form-item label="运单号:" prop="waybillCode">
                    <el-input v-model="receiveAdjustBillAddForm.waybillCode"></el-input>
                </el-form-item>
                <el-form-item label="调整后结算运费:" prop="settlementAmountAdjust">
                    <el-input v-model="receiveAdjustBillAddForm.settlementAmountAdjust" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="质量扣款调整:" prop="qualityDeductionsAmountAdjust">
                    <el-input v-model="receiveAdjustBillAddForm.qualityDeductionsAmountAdjust" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="安全扣款调整:" prop="securityDeductionsAmountAdjust">
                    <el-input v-model="receiveAdjustBillAddForm.securityDeductionsAmountAdjust" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="油价补差调整:" prop="oilPriceSupplementAdjust">
                    <el-input v-model="receiveAdjustBillAddForm.oilPriceSupplementAdjust" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="其他扣款调整:" prop="otherDeductionsAmountAdjust">
                    <el-input v-model="receiveAdjustBillAddForm.otherDeductionsAmountAdjust" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="调整原因:" prop="adjustBillResult">
                    <el-input type="textarea" :rows="3" v-model="receiveAdjustBillAddForm.adjustBillResult" style="width:555px">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="receiveAdjustBillAddDialog = false">取 消</el-button>
                <el-button size="small" type="primary"
                           @click="saveReceiveAdjustBillAddForm('receiveAdjustBillAddForm')">确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 修改账单调整弹出框 -->
        <el-dialog title="修改账单调整信息" :visible.sync="receiveAdjustBillModifyDialog" width="800px">
            <el-form size="small" inline :model="receiveAdjustBillModifyForm" :rules="receiveAdjustBillRules"
                     ref="receiveAdjustBillModifyForm" label-width="140px">
                <el-form-item label="运单号:" prop="waybillCode">
                    <el-input v-model="receiveAdjustBillModifyForm.waybillCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="结算运费调整:" prop="settlementAmountAdjust">
                    <el-input v-model="receiveAdjustBillModifyForm.settlementAmountAdjust" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="质量扣款调整:" prop="qualityDeductionsAmountAdjust">
                    <el-input v-model="receiveAdjustBillModifyForm.qualityDeductionsAmountAdjust" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="安全扣款调整:" prop="securityDeductionsAmountAdjust">
                    <el-input v-model="receiveAdjustBillModifyForm.securityDeductionsAmountAdjust" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="油价补差调整:" prop="oilPriceSupplementAdjust">
                    <el-input v-model="receiveAdjustBillModifyForm.oilPriceSupplementAdjust" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="其他扣款调整:" prop="otherDeductionsAmountAdjust">
                    <el-input v-model="receiveAdjustBillModifyForm.otherDeductionsAmountAdjust" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="调整原因:" prop="adjustBillResult">
                    <el-input type="textarea" :rows="3" v-model="receiveAdjustBillModifyForm.adjustBillResult" style="width:555px">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="receiveAdjustBillModifyDialog = false">取 消</el-button>
                <el-button size="small" type="primary"
                           @click="saveReceiveAdjustBillModifyForm('receiveAdjustBillModifyForm')">确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 发票的弹出框 -->
        <el-dialog title="发票信息" :visible.sync="receiveAdjustInvoiceDialog" width="30%">
            <el-form size="small" :model="receiveAdjustInvoiceForm" label-width="120px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="发票日期:" prop="invoiceMonth">
                            <el-date-picker
                                v-model="receiveAdjustInvoiceForm.invoiceMonth"
                                type="month"
                                style="width:100%;"
                                value-format="yyyy-MM"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="发票号:" prop="invoiceNo">
                            <el-input v-model="receiveAdjustInvoiceForm.invoiceNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="发票备注:" prop="invoiceRemark">
                            <el-input type="textarea" :rows="3" v-model="receiveAdjustInvoiceForm.invoiceRemark"> </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="receiveAdjustInvoiceDialog = false">取 消</el-button>
                <el-button size="small" type="primary"
                           @click="saveReceiveAdjustInvoiceForm()">确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 审核 -->
        <el-dialog title="调整单审核" :visible.sync="auditDialog" width="400px">
            <el-form inline size="small" :model="auditForm" ref="auditForm" label-width="130px">
                <el-form-item label="审核：">
                    <el-switch
                        v-model="auditForm.auditStatus"
                        active-value="PASS"
                        inactive-value="NO_PASS"
                        active-text="通过"
                        inactive-text="不通过">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="auditDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="saveAuditStatus()">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http,Common, Constant, Api, Validate} from 'src/global'

    export default {
        data() {
            return {
                exportLoading: true,//导出
                multipleSelection: [],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
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
                receiveAdjustBillAddDialog: false,
                receiveAdjustBillAddForm: {
                    waybillCode: '',
                    settlementAmountAdjust: '',
                    qualityDeductionsAmountAdjust: '',
                    securityDeductionsAmountAdjust: '',
                    oilPriceSupplementAdjust: '',
                    otherDeductionsAmountAdjust: '',
                    adjustBillResult: ''
                },
                receiveAdjustBillModifyDialog: false,
                receiveAdjustBillModifyForm: {
                    waybillCode: '',
                    settlementAmountAdjust: '',
                    qualityDeductionsAmountAdjust: '',
                    securityDeductionsAmountAdjust: '',
                    oilPriceSupplementAdjust: '',
                    otherDeductionsAmountAdjust: '',
                    adjustBillResult: ''
                },
                receiveAdjustInvoiceDialog: false,
                receiveAdjustInvoiceForm: {
                    invoiceNo: '',
                    invoiceMonth: '',
                    invoiceRemark: ''
                },
                receiveAdjustBillRules: {
                    waybillCode: [
                        {required: true, message: '请输入运单号', trigger: 'blur'}
                    ],
                    settlementAmountAdjust: [Validate.allMoney],
                    qualityDeductionsAmountAdjust: [Validate.allMoney],
                    securityDeductionsAmountAdjust: [Validate.allMoney],
                    oilPriceSupplementAdjust: [Validate.allMoney],
                    otherDeductionsAmountAdjust: [Validate.allMoney],
                    adjustBillResult: [
                        {required: true, message: '请输入调整原因', trigger: 'blur'}
                    ]
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
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
        },
        methods: {
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
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
                vm.searchParam = vm.cloneMode().searchParam;
            },
            searchList() {
                let vm = this;
                Http.get(Api.receiveAdjustBill.page, {params: vm.searchParam}, response => {
                    vm.searchResult.result = response.result;
                    vm.searchResult.totalCount = response.totalCount;
                    vm.searchParam.currentPage = response.currentPage;
                    vm.searchParam.pageSize = response.pageSize;
                })
            },
            saveReceiveAdjustBillAddForm(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.receiveAdjustBill.add, vm.receiveAdjustBillAddForm, response => {
                            vm.resetReceiveAdjustBillAddForm();
                            vm.receiveAdjustBillAddDialog = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetReceiveAdjustBillAddForm() {
                let vm = this;
                vm.receiveAdjustBillAddForm = vm.cloneMode().receiveAdjustBillAddForm;
            },
            //通过ID回显数据
            receiveAdjustBillModify(row) {
                let vm = this;
                Http.get(Api.receiveAdjustBill.queryById, {params: {'id': row.id}}, response => {
                    vm.receiveAdjustBillModifyForm = response.result;
                    vm.receiveAdjustBillModifyDialog = true;
                })
            },
            saveReceiveAdjustBillModifyForm(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.receiveAdjustBill.modify, vm.receiveAdjustBillModifyForm, response => {
                            vm.receiveAdjustBillModifyDialog = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除
            deleteReceiveAdjustBill(row) {
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.receiveAdjustBill.delete, ids, response => {
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
                vm.auditForm = vm.cloneMode().auditForm;
            },
            saveAuditStatus() {
                let vm = this;
                vm.auditForm.ids = [];
                if (vm.multipleSelection && vm.multipleSelection.length > 0) {
                    vm.multipleSelection.forEach(item => {
                        vm.auditForm.ids.push(item.id);
                    });
                    Http.post(Api.receiveAdjustBill.auditStatus, vm.auditForm, response => {
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
            invoiceInfo(row) {
                let vm = this;
                Http.get(Api.receiveAdjustBill.queryById, {params: {'id': row.id}}, response => {
                    vm.receiveAdjustInvoiceForm = response.result;
                    vm.receiveAdjustInvoiceDialog = true;
                })
            },
            saveReceiveAdjustInvoiceForm() {
                let vm = this;
                Http.post(Api.receiveAdjustBill.modifyInvoice, vm.receiveAdjustInvoiceForm, response => {
                    vm.receiveAdjustInvoiceDialog = false;
                    vm.searchList();
                })
            },
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.receiveAdjustBill.page, {params: searchExportParam}, response => {
                    let header = ['调整单编号', '运单号', '调整前结算运费', '结算运费调整', '调整后结算运费',
                        '质量扣款调整', '安全扣款调整', '油价补差调整', '其他扣款调整', '调整后实际应收',
                        '调整原因', '调整人员', '调整时间', '审核状态', '审核人员',
                        '审核时间', '发票日期','发票号','发票备注'];
                    let filterVal = ['adjustCode', 'waybillCode', 'settlementAmount', 'settlementAmountAdjustDiff','settlementAmountAdjust',
                        'qualityDeductionsAmountAdjust', 'securityDeductionsAmountAdjust', 'oilPriceSupplementAdjust', 'otherDeductionsAmountAdjust', 'actualReceiveAmount',
                        'adjustBillResult', 'createUser', 'createTime', {
                            type: 'dictionary',
                            'code': 'AUDIT_STATUS',
                            'name': 'auditStatus'
                        }, 'auditUser',
                        'auditTime', 'invoiceMonth','invoiceNo','invoiceRemark'];
                    Common.excel.downloadExl(response.result, header, filterVal, "应收调整导出");
                    vm.exportLoading = true;
                }, () => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
