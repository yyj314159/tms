<template>
    <el-dialog :visible.sync="visible" width="50%" @close="resetOperationPerformance">
        <span slot="title" class="dialog-title">
            履约金操作
            <el-radio-group v-model="radio">
                <el-radio label="isTransfer">转履约金</el-radio>
                <el-radio label="isReturn">退回</el-radio>
                <el-radio label="isBad">坏账</el-radio>
            </el-radio-group>
        </span>
        <el-form size="small" :model="transferPerformanceForm" ref="transferPerformanceForm" label-width="120px" v-if="radio === 'isTransfer'">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="履约金编号：">
                        <el-input v-model="transferPerformanceForm.code" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="履约金金额：" prop="performanceAmount">
                        <el-input v-model="transferPerformanceForm.performanceAmount" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="操作金额：" prop="performanceOutAmount" :rules="[Validate.required('操作金额',true),Validate.notZeroMoney]">
                        <el-input v-model="transferPerformanceForm.performanceOutAmount" v-on:blur="cal" placeholder="请输入金额"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="转入差额：" prop="performanceOutBalanceAmount">
                        <el-input v-model="transferPerformanceForm.performanceOutBalanceAmount" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="客户类型：" prop="performance.customerType" :rules="Validate.required('客户类型',true)">
                        <dictionary-select option-name="BUSINESS_CUSTOMER_TYPE"  v-model="transferPerformanceForm.performance.customerType" style="display:block;"></dictionary-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">收款信息（必填）</span>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="收款抬头：" prop="performance.collectCompany" :rules="Validate.required('收款抬头',true)">
                        <el-input v-model="transferPerformanceForm.performance.collectCompany"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="收款账号:" prop="performance.collectAccount" :rules="[Validate.required('收款账号',true),Validate.number]">
                        <el-input  v-model="transferPerformanceForm.performance.collectAccount"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="收款银行：" prop="performance.collectBank" :rules="Validate.required('收款银行',true)">
                        <el-input v-model="transferPerformanceForm.performance.collectBank"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="应回款时间：" prop="performance.receivedDate" :rules="Validate.required('应回款时间',true)">
                        <el-date-picker style="display:block; width:100%;" v-model="transferPerformanceForm.performance.receivedDate"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="逾期提醒：" prop="performance.overdueDay" :rules="[Validate.required('逾期提醒',true),Validate.number]">
                        <el-input v-model="transferPerformanceForm.performance.overdueDay"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">出款信息（必填）</span>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="出款抬头：" prop="performance.paymentCompany" :rules="Validate.required('出款抬头',true)">
                        <dictionary-select option-name="LINE_INCOME_SUBJECT"  v-model="transferPerformanceForm.performance.paymentCompany" style="display:block;"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出款银行:" prop="performance.paymentBank" :rules="Validate.required('出款银行',true)">
                        <el-input  v-model="transferPerformanceForm.performance.paymentBank"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="应支付时间：" prop="performance.paymentDate" :rules="Validate.required('应支付时间',true)">
                        <el-date-picker style="display:block; width:100%;" v-model="transferPerformanceForm.performance.paymentDate"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="附件:" prop="performance.contractAttachment" :rules="Validate.required('附件',true)">
                        <upload-image ref="contractAttachment"
                                      fileModule="performance"
                                      v-model="transferPerformanceForm.performance.contractAttachment"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">项目信息</span>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="则一客户：" prop="performance.customerCode" :rules="Validate.required('则一客户',true)">
                        <customer-select v-model="transferPerformanceForm.performance.customerCode" style="display:block"></customer-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="业务经手人:" prop="performance.handler" :rules="Validate.required('业务经手人',true)">
                        <user-select v-model="transferPerformanceForm.performance.handler" style="display:block"></user-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="则一合同名称：" prop="performance.contractName" :rules="Validate.required('则一合同名称',true)">
                        <el-input v-model="transferPerformanceForm.performance.contractName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="则一合同编号:" prop="performance.contractCode" :rules="Validate.required('则一合同编号',true)">
                        <el-input  v-model="transferPerformanceForm.performance.contractCode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="合同线路备注:">
                        <el-input  v-model="transferPerformanceForm.performance.lineRemark"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="备注:">
                        <el-input  v-model="transferPerformanceForm.performance.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="钉钉通道:">
                        <el-switch v-model="transferPerformanceForm.performance.aisle" active-color="#13ce66" inactive-color="#ff4949" active-text="总部" inactive-text="地区"></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="组织" prop="performance.orgCodes">
                        <multiple-org-select ref="orgCodes" v-model="transferPerformanceForm.performance.orgCodes" :multiple="true" ></multiple-org-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-form size="small" :model="returnPerformanceForm" ref="returnPerformanceForm" label-width="35%"  v-else-if="radio === 'isReturn'">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="履约金编号：">
                        <el-input v-model="returnPerformanceForm.code" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="履约金金额：">
                        <el-input v-model="returnPerformanceForm.performanceAmount" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="出款抬头：">
                        <el-input v-model="returnPerformanceForm.paymentCompany" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="收款抬头：">
                        <el-input v-model="returnPerformanceForm.collectCompany" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="合同编号：">
                        <el-input v-model="returnPerformanceForm.contractCode" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合同名称：">
                        <el-input v-model="returnPerformanceForm.contractName" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="履约金退回金额：" prop="performanceReturnAmount">
                        <el-input v-model="returnPerformanceForm.performanceReturnAmount" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="备注：">
                        <el-input v-model="returnPerformanceForm.remark"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="钉钉审批:">
                        <el-switch v-model="returnPerformanceForm.aisle" active-color="#13ce66" inactive-color="#ff4949" active-text="总部" inactive-text="地区"></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-form size="small" :model="badPerformanceForm" ref="badPerformanceForm" label-width="35%"  v-else-if="radio === 'isBad'">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="履约金编号：">
                        <el-input v-model="badPerformanceForm.code" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="履约金金额：">
                        <el-input v-model="badPerformanceForm.performanceAmount" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="出款抬头：">
                        <el-input v-model="badPerformanceForm.paymentCompany" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="收款抬头：">
                        <el-input v-model="badPerformanceForm.collectCompany" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="合同编号：">
                        <el-input v-model="badPerformanceForm.contractCode" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="合同名称：">
                        <el-input v-model="badPerformanceForm.contractName" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="履约金坏账金额：" prop="performanceBadAmount">
                        <el-input v-model="badPerformanceForm.performanceBadAmount" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="特殊说明：">
                        <el-input v-model="badPerformanceForm.remark"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="钉钉审批:">
                        <el-switch v-model="badPerformanceForm.aisle" active-color="#13ce66" inactive-color="#ff4949" active-text="总部" inactive-text="地区"></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="resetOperationPerformance">取消</el-button>
            <el-button size="small" type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {Http, Api} from 'src/global'
    import {Constant} from 'src/global/constant'
    import {Validate} from 'src/global/validate'

    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            currentRow: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                visible: true,
                Validate: Validate,//校验
                Constant: Constant,//常量
                radio: 'isTransfer',
                transferPerformanceForm: {//履约金实体
                    code: '',//保证金编号
                    performanceAmount: '',//履约金金额
                    performanceOutAmount: '',//履约金转出金额
                    performanceOutBalanceAmount: '',//履约金转出差额
                    contractCode:'',//合同编号
                    contractName:'',//合同名称
                    receivedDate: '',//回款日期
                    performance: {//新履约金实体
                        orgCodes: [],//组织集合
                        collectCompany: '',//收款抬头
                        collectAccount: '',//收款账号
                        collectBank: '',//收款银行
                        receivedDate: '',//回款日期
                        overdueDay: '',//逾期提醒
                        paymentCompany: '',//付款抬头
                        paymentBank: '',//付款银行
                        paymentDate: '',//支付日期
                        contractAttachment: '',//附件
                        customerType: '',//客户类型
                        customerCode: '',//客户
                        handler: '',//业务经手人
                        contractName: '',//合同名称
                        contractCode: '',//合同编号
                        aisle: true,//钉钉通道
                        remark: '',//备注
                        lineRemark: ''//线路备注
                    }
                },
                //
                returnPerformanceForm: {//履约金实体
                    code: '',//履约金编号
                    performanceAmount: '',//履约金金额
                    performanceReturnAmount: '',//履约金退回金额
                    collectCompany: '',//收款抬头
                    paymentCompany: '',//付款抬头
                    contractName: '',//合同名称
                    contractCode: '',//合同编号
                    remark: '',//备注
                    aisle: true//钉钉通道
                },
                //坏帐
                badPerformanceForm: {//履约金实体
                    code: '',//履约金编号
                    performanceAmount: '',//履约金金额
                    performanceBadAmount: '',//履约金坏账金额
                    collectCompany: '',//收款抬头
                    paymentCompany: '',//付款抬头
                    contractName: '',//合同名称
                    contractCode: '',//合同编号
                    remark: '',//备注
                    aisle: true//钉钉通道
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                }
            }
        },
        mounted() {
            this.queryPerformanceInfo(this.currentRow.code);
        },
        methods: {
            queryPerformanceInfo(code) {
                let vm = this;
                Http.get(Api.performance.queryByCode, {params: {'code': code}}, result => {
                    vm.transferPerformanceForm.code = result.result.code;
                    vm.transferPerformanceForm.performanceAmount = result.result.performanceAmount;
                    vm.transferPerformanceForm.performance.customerType = result.result.customerType;
                    vm.transferPerformanceForm.performance.collectCompany = result.result.collectCompany;
                    vm.transferPerformanceForm.performance.collectAccount = result.result.collectAccount;
                    vm.transferPerformanceForm.performance.collectBank = result.result.collectBank;
                    vm.transferPerformanceForm.performance.overdueDay = result.result.overdueDay;
                    vm.transferPerformanceForm.performance.paymentCompany = result.result.paymentCompany;
                    vm.transferPerformanceForm.performance.paymentBank = result.result.paymentBank;
                    vm.transferPerformanceForm.performance.handler = result.result.handler;
                    vm.transferPerformanceForm.performanceOutBalanceAmount = 0
                    vm.transferPerformanceForm.performanceOutAmount = '';
                    vm.returnPerformanceForm = result.result;
                    vm.badPerformanceForm = result.result;
                    vm.returnPerformanceForm.performanceReturnAmount = result.result.performanceResidueAmount;
                    vm.badPerformanceForm.performanceBadAmount = result.result.performanceResidueAmount;
                    if(vm.transferPerformanceForm.performance.contractAttachment != null){
                        /*设置附件*/
                        vm.$refs.contractAttachment.setFileList(vm.transferPerformanceForm.performance.contractAttachment.split(","));
                    }
                })
            },
            cal() {
                let vm = this;
                if(!vm.transferPerformanceForm.performanceOutAmount.match(/^(([1-9]\d*)|0)(\.\d{1,2})?$/)){
                    return;
                }
                if(vm.transferPerformanceForm.performanceOutAmount > vm.transferPerformanceForm.performanceAmount){
                    vm.transferPerformanceForm.performanceOutBalanceAmount = vm.transferPerformanceForm.performanceOutAmount - vm.transferPerformanceForm.performanceAmount;
                }else{
                    vm.transferPerformanceForm.performanceOutBalanceAmount = 0;
                }
            },
            //关闭窗口
            resetOperationPerformance() {
                this.transferPerformanceForm = {
                    code: '',
                    performanceAmount: '',//履约金金额
                    performanceOutAmount: '',//履约金转出金额
                    performanceOutBalanceAmount: '',//履约金转出差额
                    performance: {
                        orgCodes: [],//组织集合
                        collectCompany: '',
                        collectAccount: '',
                        collectBank: '',
                        receivedDate: '',
                        overdueDay: '',
                        paymentCompany: '',
                        paymentBank: '',
                        paymentDate: '',
                        contractAttachment: '',
                        customerType: '',
                        customerCode: '',
                        handler: '',
                        contractName: '',
                        contractCode: '',
                        aisle: true,
                        remark: '',
                        lineRemark: '',
                    }
                };
                this.returnPerformanceForm = {
                    code: '',
                    performanceAmount: '',
                    collectCompany: '',
                    paymentCompany: '',
                    contractName: '',
                    contractCode: '',
                    performanceReturnAmount:'',
                    remark: '',
                    aisle: true
                };
                this.badPerformanceForm = {
                    code: '',
                    performanceAmount: '',
                    performanceBadAmount: '',//履约金坏账金额
                    collectCompany: '',
                    paymentCompany: '',
                    contractName: '',
                    contractCode: '',
                    remark: '',
                    aisle: true
                };
                this.visible = false;
                this.$emit('close');
            },
            submit(){
                switch (this.radio) {
                    case 'isTransfer':
                        this.transferPerformanceSubmit();
                        break;
                    case 'isReturn':
                        this.returnPerformanceSubmit();
                        break;
                    case 'isBad':
                        this.badPerformanceSubmit();
                        break;
                    default:
                        break;
                }
            },
            //确定提交表单
            transferPerformanceSubmit() {
                let vm = this;
                Http.get(Api.performance.queryByCode, {params: {'code': this.currentRow.code}}, result => {
                    vm.transferPerformanceForm.receivedDate = result.result.receivedDate;
                })
                if (vm.transferPerformanceForm.performance.receivedDate != null && new Date(vm.transferPerformanceForm.performance.receivedDate).getTime() <= new Date(vm.transferPerformanceForm.receivedDate).getTime()) {
                    vm.$message.error('应回款日期不能小于等于转换源（履约金）的应回款日期！');
                    return false;
                }
                vm.transferPerformanceForm.performance.contractAttachment = this.$refs.contractAttachment.getFileList().join(",");
                vm.$refs.transferPerformanceForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.performance.performanceTransfer, vm.transferPerformanceForm, result => {
                            vm.$message.success('履约金转履约金成功！');
                            vm.resetOperationPerformance();
                        });
                    } else {
                        vm.$message.error("请检查必填项");
                        return false;
                    }
                });
            },
            //确定提交表单
            returnPerformanceSubmit() {
                let vm = this;
                vm.$refs.returnPerformanceForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.performance.performanceReturn, vm.returnPerformanceForm, result => {
                            vm.$message.success('履约金退回成功！');
                            vm.resetOperationPerformance();
                        });
                    } else {
                        vm.$message.error("请检查必填项");
                        return false;
                    }
                });
            },
            //确定提交表单
            badPerformanceSubmit() {
                let vm = this;
                vm.$refs.badPerformanceForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.performance.performanceBad, vm.badPerformanceForm, result => {
                            vm.$message.success('履约金坏账成功！');
                            vm.resetOperationPerformance();
                        });
                    } else {
                        vm.$message.error("请检查必填项");
                        return false;
                    }
                });
            }
        }
    }
</script>
<style scoped>
    .blue {
        color: #20a0ff;
        display: inline-block;
        margin-bottom: 12px;
    }
</style>
