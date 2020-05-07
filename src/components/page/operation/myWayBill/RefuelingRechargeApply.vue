<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 定点加油</el-breadcrumb-item>
                <el-breadcrumb-item>充值申请</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="加油供应商:">
                            <dictionary-select v-model="searchParam.refuelingSupplier"
                                               option-name="GAS_STATION" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="充值供应商:">
                            <supplier-select v-model="searchParam.supplierCode"
                                             :types="Constant.SUPPLIER_TYPE.PLANTFORM_COMPANY"
                                             style="display: block;"></supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="充值开始时间:">
                            <date-picker-single v-model="searchParam.startTime" date-type="start"
                                                :end-date="searchParam.endTime" :default-time="['00:00:00', '23:59:59']"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="充值结束时间:">
                            <date-picker-single v-model="searchParam.endTime" date-type="end"
                                                :start-date="searchParam.startTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchList">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="btnLoading" v-permission="'/refuelingRechargeApply/add'" size="mini" type="primary"
                       icon="el-icon-plus" @click="dialogAddRefuelingRechargeApplyVisible=true">新增
            </el-button>
            <el-button v-if="btnLoading" v-permission="'/refuelingRechargeApply/modify'" size="mini" type="primary"
                       icon="el-icon-edit" @click="modifyRefuelingRechargeApplyClick">修改
            </el-button>
            <el-button v-if="btnLoading" v-permission="'/refuelingRechargeApply/export'" size="mini" type="primary"
                       icon="el-icon-download" @click="exportData">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="审批编号" prop="approveNo" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="充值日期" prop="rechargeDate" min-width="130" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油供应商" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="GAS_STATION"
                                                v-model="scope.row.refuelingSupplier"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="充值供应商" prop="supplierName" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="分配金额" prop="distributionAmount" min-width="130"></el-table-column>
                <el-table-column align="center" label="备注" prop="remarks" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="创建人" prop="createUser" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="创建时间" prop="createTime" min-width="150" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-row>
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 20, 50, 300]"
                        :page-size="searchParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchResult.totalCount">
                    </el-pagination>
                </div>
            </el-row>
            <el-row style="font-size:13px; font-weight: bold;">
                <span style=" margin-right:20px;">勾选条数：{{multipleSelection.length}}条</span>
                <span style="color:red; margin-right:20px;">交易金额：{{distributionAmountValue}}元</span>
            </el-row>
        </el-main>

        <!-----------------------------------------S 【新增】充值申请信息弹出框 --------------------------------------->
        <el-dialog title="电子加油充值申请" :visible.sync="dialogAddRefuelingRechargeApplyVisible" width="860px" size="small"
                   @close="closeAddRefuelingRechargeApplyForm">
            <el-form size="small" inline :model="addRefuelingRechargeApplyForm" :rules="addRefuelingRechargeApplyFormRules"
                     ref="addRefuelingRechargeApplyForm"  label-width="120px" id="addRefuelingRechargeApplyForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="审批编号:" prop="approveNo">
                            <el-input v-model="addRefuelingRechargeApplyForm.approveNo" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="加油供应商:" prop="refuelingSupplier">
                            <dictionary-select v-model="addRefuelingRechargeApplyForm.refuelingSupplier" option-name="GAS_STATION"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row>
                     <el-col :span="12">
                         <el-form-item label="充值总金额:" prop="rechargeAmount">
                             <el-input v-model="addRefuelingRechargeApplyForm.rechargeAmount"></el-input>
                         </el-form-item>
                     </el-col>
                    <el-col :span="12">
                        <el-form-item label="充值日期:" prop="rechargeDate">
                            <el-date-picker v-model="addRefuelingRechargeApplyForm.rechargeDate" type="date"
                                            placeholder="选择日期"
                                            value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!--------------S 添加充值明细-------------->
                <div style="color: #20a0ff">充值明细</div>
                <el-form size="small" inline :model="addRefuelingRechargeApplyDetailForm" :rules="addRefuelingRechargeApplyDetailFormRules"
                         ref="addRefuelingRechargeApplyDetailForm" label-width="130px" id="addRefuelingRechargeApplyDetailForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="充值供应商:" prop="supplierCode">
                                <supplier-select v-model="addRefuelingRechargeApplyDetailForm.supplierCode" ref="addSupplierObject" :types="Constant.SUPPLIER_TYPE.PLANTFORM_COMPANY"></supplier-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="分配金额:" prop="distributionAmount">
                                <el-input v-model="addRefuelingRechargeApplyDetailForm.distributionAmount" style="width:200px"></el-input>
                            </el-form-item>
                            <el-button size="small" type="primary" @click="addRefuelingRechargeApplyDetail('addRefuelingRechargeApplyDetailForm')">添加</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <!--------------E 添加充值明细-------------->
                <!--------------S 充值明细列表-------------->
                <el-row>
                    <el-col :span="24">
                        <el-table size="small" class="content-table" :data="addRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList" border>
                            <el-table-column align="center" label="充值供应商id"  prop="supplierCode" v-if="false" ></el-table-column>
                            <el-table-column align="center" label="充值供应商" prop="supplierName"></el-table-column>
                            <el-table-column align="center" label="分配金额" prop="distributionAmount"></el-table-column>
                            <el-table-column align="center" label="操作" fixed="right" width="140">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-delete" size="mini"
                                               @click="deleteRefuelingRechargeApply(scope.$index,addRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <!--------------E 充值明细列表-------------->
                &nbsp;
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :cols="80" :maxlength="200" placeholder="最多200个字符！" v-model="addRefuelingRechargeApplyForm.remarks"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddRefuelingRechargeApplyVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addRefuelingRechargeApply('addRefuelingRechargeApplyForm')">确 定
                </el-button>
            </div>
        </el-dialog>
        <!-----------------------------------------E 【新增】充值申请信息弹出框 --------------------------------------->

        <!-----------------------------------------S 【修改】充值申请信息弹出框 --------------------------------------->
        <el-dialog title="电子加油充值申请" :visible.sync="dialogModifyRefuelingRechargeApplyVisible" width="860px" size="small"
                   @close="closeModifyRefuelingRechargeApplyForm">
            <el-form size="small" inline :model="modifyRefuelingRechargeApplyForm" :rules="addRefuelingRechargeApplyFormRules"
                     ref="modifyRefuelingRechargeApplyForm"  label-width="120px" id="modifyRefuelingRechargeApplyForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="审批编号:" prop="approveNo">
                            <el-input v-model="modifyRefuelingRechargeApplyForm.approveNo" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="加油供应商:" prop="refuelingSupplier">
                            <dictionary-select v-model="modifyRefuelingRechargeApplyForm.refuelingSupplier" option-name="GAS_STATION"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="充值总金额:" prop="rechargeAmount">
                            <el-input v-model="modifyRefuelingRechargeApplyForm.rechargeAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="充值日期:" prop="rechargeDate">
                            <el-date-picker v-model="modifyRefuelingRechargeApplyForm.rechargeDate" type="date"
                                            placeholder="选择日期"
                                            value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!--------------S 修改充值明细-------------->
                <div style="color: #20a0ff">充值明细</div>
                <el-form size="small" inline :model="modifyRefuelingRechargeApplyDetailForm" :rules="addRefuelingRechargeApplyDetailFormRules"
                         ref="modifyRefuelingRechargeApplyDetailForm" label-width="130px" id="modifyRefuelingRechargeApplyDetailForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="充值供应商:" prop="supplierCode">
                                <supplier-select v-model="modifyRefuelingRechargeApplyDetailForm.supplierCode" ref="modifySupplierObject" :types="Constant.SUPPLIER_TYPE.PLANTFORM_COMPANY"></supplier-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="分配金额:" prop="distributionAmount">
                                <el-input v-model="modifyRefuelingRechargeApplyDetailForm.distributionAmount" style="width:200px"></el-input>
                            </el-form-item>
                            <el-button size="small" type="primary" @click="modifyRefuelingRechargeApplyDetail('modifyRefuelingRechargeApplyDetailForm')">添加</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <!--------------E 修改充值明细-------------->
                <!--------------S 充值明细列表-------------->
                <el-row>
                    <el-col :span="24">
                        <el-table size="small" class="content-table" :data="modifyRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList" border>
                            <el-table-column align="center" label="充值供应商id" prop="supplierCode" v-if="false"></el-table-column>
                            <el-table-column align="center" label="充值供应商" prop="supplierName"></el-table-column>
                            <el-table-column align="center" label="分配金额" prop="distributionAmount"></el-table-column>
                            <el-table-column align="center" label="操作" fixed="right" width="140">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-delete" size="mini"
                                               @click="deleteRefuelingRechargeApply(scope.$index,modifyRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <!--------------E 充值明细列表-------------->
                &nbsp;
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :cols="80" :maxlength="200" placeholder="最多200个字符！" v-model="modifyRefuelingRechargeApplyForm.remarks"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyRefuelingRechargeApplyVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyRefuelingRechargeApply('modifyRefuelingRechargeApplyForm')">确 定
                </el-button>
            </div>
        </el-dialog>
        <!-----------------------------------------E 【修改】充值申请信息弹出框 --------------------------------------->
    </el-container>
</template>

<script>
    import {Api, Common, Constant, Http, Validate} from 'src/global'
    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                btnLoading: true,
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    refuelingSupplier: '',//加油供应商
                    supplierCode: '',//充值供应商
                    startTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//充值开始时间
                    endTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")// 充值结束时间
                },
                dialogAddRefuelingRechargeApplyDetailVisible:true,
                dialogAddRefuelingRechargeApplyVisible: false,
                dialogModifyRefuelingRechargeApplyDetailVisible:true,
                dialogModifyRefuelingRechargeApplyVisible: false,
                addRefuelingRechargeApplyForm: {
                    refuelingRechargeApplyDetailList: [],
                    approveNo: '',
                    refuelingSupplier: '',
                    rechargeAmount:'',
                    rechargeDate: '',
                    endDate: '',
                    auditStatus: '',
                    operationStatus: '',
                    remarks: ''
                },
                modifyRefuelingRechargeApplyForm: {
                    id:'',
                    refuelingRechargeApplyDetailList: [],
                    approveNo: '',
                    refuelingSupplier: '',
                    rechargeAmount:'',
                    rechargeDate: '',
                    endDate: '',
                    auditStatus: '',
                    operationStatus: '',
                    remarks: ''
                },
                addRefuelingRechargeApplyDetailForm: {
                    supplierCode: '',
                    supplierName: '',
                    distributionAmount: ''
                },
                modifyRefuelingRechargeApplyDetailForm: {
                    supplierCode: '',
                    supplierName: '',
                    distributionAmount: ''
                },
                addRefuelingRechargeApplyFormRules: {
                    approveNo: [
                        {required: true, message: '请输审批编号', trigger: 'blur'}
                    ],
                    refuelingSupplier: [
                        {required: true, message: '请选择加油供应商', trigger: 'blur'}
                    ],
                    rechargeAmount: [
                        {required: true, message: '请输入充值金额', trigger: 'blur'},
                        Validate.threeMoney
                    ],
                    rechargeDate: [
                        {required: true, message: '请选择充值日期', trigger: 'blur'}
                    ]
                },
                addRefuelingRechargeApplyDetailFormRules: {
                    supplierCode: [
                        {required: true, message: '请选充值供应商', trigger: 'blur'}
                    ],
                    distributionAmount: [
                        {required: true, message: '请输入分配金额', trigger: 'blur'},
                        Validate.threeMoney
                    ]
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                tableHeight: window.innerHeight > 800 ? 480 : null
            }
        },
        created() {
            this.searchList();
        },
        computed: {
            distributionAmountValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].distributionAmount)
                    }
                }
                return sum.toFixed(2);
            }
        },
        methods: {
            closeAddRefuelingRechargeApplyForm(){
                this.$refs.addRefuelingRechargeApplyForm.resetFields()
            },
            closeModifyRefuelingRechargeApplyForm(){
                this.$refs.modifyRefuelingRechargeApplyForm.resetFields()
            },
            modifyRefuelingRechargeApplyClick() {
                let vm = this;
                if (vm.multipleSelection == null || vm.multipleSelection.length != 1) {
                    this.$message.warning('请选择一条数据修改');
                    return;
                }
                Http.get(Api.refuelingRechargeApply.queryById, {params: {'id': vm.multipleSelection[0].id}}, result => {
                    setTimeout(function () {
                        vm.modifyRefuelingRechargeApplyForm = result.result;
                    }, 0);
                    vm.dialogModifyRefuelingRechargeApplyVisible = true;
                })
            },

            modifyRefuelingRechargeApplyDetail(formName) {
                let vm = this;
                let supplier = this.$refs.modifySupplierObject.getObject();
                vm.modifyRefuelingRechargeApplyDetailForm.supplierName = supplier.name;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (vm.modifyRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList.length > 0) {
                            let list = vm.modifyRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList;
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].supplierCode == vm.modifyRefuelingRechargeApplyDetailForm.supplierCode) {
                                    this.$message.warning('充值供应商不能重复');
                                    return;
                                }
                            }
                        }
                        vm.modifyRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList.push(vm.modifyRefuelingRechargeApplyDetailForm);
                        vm.modifyRefuelingRechargeApplyDetailForm = {
                            supplierCode: '',
                            supplierName:'',
                            distributionAmount: ''
                        }
                    }
                });
            },
            addRefuelingRechargeApplyDetail(formName) {
                let vm = this;
                let supplier = this.$refs.addSupplierObject.getObject();
                vm.addRefuelingRechargeApplyDetailForm.supplierName = supplier.name;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (vm.addRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList.length > 0) {
                            let list = vm.addRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList;
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].supplierCode == vm.addRefuelingRechargeApplyDetailForm.supplierCode) {
                                    this.$message.warning('充值供应商不能重复');
                                    return;
                                }
                            }
                        }
                        vm.addRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList.push(vm.addRefuelingRechargeApplyDetailForm);
                        vm.addRefuelingRechargeApplyDetailForm = {
                            supplierCode: '',
                            supplierName:'',
                            distributionAmount: ''
                        }
                    }
                });
            },
            addRefuelingRechargeApply(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (vm.addRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList == null) {
                            this.$message.warning('请选择充值供应商');
                            return;
                        }
                        let list = vm.addRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList;
                        let distributionAmountTotal = 0;
                        for (let i = 0; i < list.length; i++) {
                            distributionAmountTotal += Common.util.numberFormat(list[i].distributionAmount);
                        }
                        if (distributionAmountTotal != vm.addRefuelingRechargeApplyForm.rechargeAmount) {
                            this.$message.warning('分配金额总和必须等于充值总金额');
                            return;
                        }
                        Http.post(Api.refuelingRechargeApply.add, vm.addRefuelingRechargeApplyForm, response => {
                            vm.resetAddRefuelingRechargeApplyForm();
                            vm.dialogAddRefuelingRechargeApplyVisible = false;
                            vm.searchList();
                        }, result => {
                        })
                    }
                });
            },
            modifyRefuelingRechargeApply(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (vm.modifyRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList == null) {
                            this.$message.warning('请选择充值供应商');
                            return;
                        }
                        let list = vm.modifyRefuelingRechargeApplyForm.refuelingRechargeApplyDetailList;
                        let distributionAmountTotal = 0;
                        for (let i = 0; i < list.length; i++) {
                            distributionAmountTotal += Common.util.numberFormat(list[i].distributionAmount);
                        }
                        if (distributionAmountTotal != vm.modifyRefuelingRechargeApplyForm.rechargeAmount) {
                            this.$message.warning('分配金额总和必须等于充值总金额');
                            return;
                        }
                        Http.post(Api.refuelingRechargeApply.modify, vm.modifyRefuelingRechargeApplyForm, response => {
                            vm.resetModifyRefuelingRechargeApplyForm();
                            vm.dialogModifyRefuelingRechargeApplyVisible = false;
                            vm.searchList();
                        }, result => {
                        })
                    }
                });
            },
            deleteRefuelingRechargeApply(index, refuelingRechargeApplyDetailList) {
                refuelingRechargeApplyDetailList.splice(index, 1);
            },
            resetAddRefuelingRechargeApplyForm() {
                let vm = this;
                vm.addRefuelingRechargeApplyForm = {
                    refuelingRechargeApplyDetailList: [],
                    approveNo: '',
                    refuelingSupplier: '',
                    rechargeAmount:'',
                    rechargeDate: '',
                    endDate: '',
                    auditStatus: '',
                    operationStatus: '',
                    remarks: ''
                }
            },
            resetModifyRefuelingRechargeApplyForm() {
                let vm = this;
                vm.addRefuelingRechargeApplyForm = {
                    id:'',
                    refuelingRechargeApplyDetailList: [],
                    approveNo: '',
                    refuelingSupplier: '',
                    rechargeAmount:'',
                    rechargeDate: '',
                    endDate: '',
                    auditStatus: '',
                    operationStatus: '',
                    remarks: ''
                }
            },
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    refuelingSupplier: '',//加油供应商
                    supplierCode: '',//充值供应商
                    startTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//充值开始时间
                    endTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")// 充值结束时间
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.refuelingRechargeApply.page, {params: vm.searchParam}, result => {
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
                this.multipleSelection = val;
            },
            exportData() {
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.refuelingRechargeApply.page, {params: searchExportParam}, response => {
                    let header = ['审批编号', '充值日期','加油供应商', '充值供应商', '分配金额', '备注', '创建人', '创建时间'];
                    let filterVal = ['approveNo','rechargeDate',
                        {
                            type: 'dictionary',
                            'code': 'GAS_STATION',
                            'name': 'refuelingSupplier'
                        },'supplierName', 'distributionAmount', 'remarks', 'createUser', 'createTime'
                    ];
                    Common.excel.downloadExl(response.result, header, filterVal, "充值申请导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            },
            uploadSuccess() {
                let vm = this;
                vm.searchList();
            }
        }
    }
</script>

