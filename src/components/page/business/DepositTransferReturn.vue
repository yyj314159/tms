<template>
    <el-dialog :visible.sync="visible" width="50%" @close="resetOperationDeposit">
        <span slot="title" class="dialog-title">
            保证金操作
            <el-radio-group v-model="radio">
                <el-radio label="isTransfer">转履约金</el-radio>
                <el-radio label="isReturn">退回</el-radio>
                <el-radio label="isBad">坏账</el-radio>
            </el-radio-group>
        </span>
        <el-form size="small" :model="transferDepositForm" ref="transferDepositForm" label-width="120px" v-if="radio === 'isTransfer'">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="保证金编号：">
                        <el-input v-model="transferDepositForm.code" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="保证金金额：" prop="depositAmount">
                        <el-input v-model="transferDepositForm.depositAmount" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="操作金额：" prop="depositOutAmount" :rules="[Validate.required('操作金额',true),Validate.notZeroMoney]">
                        <el-input v-model="transferDepositForm.depositOutAmount" v-on:blur="cal" placeholder="请输入金额"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="转入差额：" prop="depositOutBalanceAmount">
                        <el-input v-model="transferDepositForm.depositOutBalanceAmount" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="客户类型：" prop="performanceDto.customerType" :rules="Validate.required('客户类型',true)">
                        <dictionary-select option-name="BUSINESS_CUSTOMER_TYPE"  v-model="transferDepositForm.performanceDto.customerType" style="display:block;"></dictionary-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">收款信息（必填）</span>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="收款抬头：" prop="performanceDto.collectCompany" :rules="Validate.required('收款抬头',true)">
                        <el-input v-model="transferDepositForm.performanceDto.collectCompany"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="收款账号:" prop="performanceDto.collectAccount" :rules="[Validate.required('收款账号',true),Validate.number]">
                        <el-input  v-model="transferDepositForm.performanceDto.collectAccount"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="收款银行：" prop="performanceDto.collectBank" :rules="Validate.required('收款银行',true)">
                        <el-input v-model="transferDepositForm.performanceDto.collectBank"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="应回款时间：" prop="performanceDto.receivedDate" :rules="Validate.required('应回款时间',true)">
                        <el-date-picker style="display:block; width:100%;" v-model="transferDepositForm.performanceDto.receivedDate"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="逾期提醒：" prop="performanceDto.overdueDay" :rules="[Validate.required('逾期提醒',true),Validate.number]">
                        <el-input v-model="transferDepositForm.performanceDto.overdueDay"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">出款信息（必填）</span>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="出款抬头：" prop="performanceDto.paymentCompany" :rules="Validate.required('出款抬头',true)">
                        <dictionary-select option-name="LINE_INCOME_SUBJECT"  v-model="transferDepositForm.performanceDto.paymentCompany" style="display:block;"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出款银行:" prop="performanceDto.paymentBank" :rules="Validate.required('出款银行',true)">
                        <el-input  v-model="transferDepositForm.performanceDto.paymentBank"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="应支付时间：" prop="performanceDto.paymentDate" :rules="Validate.required('应支付时间',true)">
                        <el-date-picker style="display:block; width:100%;" v-model="transferDepositForm.performanceDto.paymentDate"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="附件:" prop="performanceDto.contractAttachment" :rules="Validate.required('附件',true)">
                        <upload-image ref="contractAttachment"
                                      fileModule="performance"
                                      v-model="transferDepositForm.performanceDto.contractAttachment"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">项目信息</span>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="则一客户：" prop="performanceDto.customerCode" :rules="Validate.required('则一客户',true)">
                        <customer-select v-model="transferDepositForm.performanceDto.customerCode" style="display:block"></customer-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="业务经手人:" prop="performanceDto.handler" :rules="Validate.required('业务经手人',true)">
                        <user-select v-model="transferDepositForm.performanceDto.handler" style="display:block"></user-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="则一合同名称：" prop="performanceDto.contractName" :rules="Validate.required('则一合同名称',true)">
                        <el-input v-model="transferDepositForm.performanceDto.contractName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="则一合同编号:" prop="performanceDto.contractCode" :rules="Validate.required('则一合同编号',true)">
                        <el-input  v-model="transferDepositForm.performanceDto.contractCode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="合同线路备注:">
                        <el-input  v-model="transferDepositForm.performanceDto.lineRemark"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="备注:">
                        <el-input  v-model="transferDepositForm.performanceDto.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="钉钉通道:">
                        <el-switch v-model="transferDepositForm.performanceDto.aisle" active-color="#13ce66" inactive-color="#ff4949" active-text="总部" inactive-text="地区"></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="组织:" prop="performanceDto.orgCodes">
                        <multiple-org-select ref="orgCodes" v-model="transferDepositForm.performanceDto.orgCodes" :multiple="true" ></multiple-org-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-form size="small" :model="returnDepositForm" ref="returnDepositForm" label-width="35%"  v-else-if="radio === 'isReturn'">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="保证金编号：">
                        <el-input v-model="returnDepositForm.code" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="保证金金额：">
                        <el-input v-model="returnDepositForm.depositAmount" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="出款抬头：">
                        <el-input v-model="returnDepositForm.paymentCompany" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="收款抬头：">
                        <el-input v-model="returnDepositForm.collectCompany" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="项目编号：">
                        <el-input v-model="returnDepositForm.projectCode" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目编号名称：">
                        <el-input v-model="returnDepositForm.projectName" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="保证金退回金额：" prop="depositReturnAmount">
                        <el-input v-model="returnDepositForm.depositReturnAmount" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="备注：">
                        <el-input v-model="returnDepositForm.remark"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="钉钉审批:">
                        <el-switch v-model="transferDepositForm.aisle" active-color="#13ce66" inactive-color="#ff4949" active-text="总部" inactive-text="地区"></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-form size="small" :model="badDepositForm" ref="badDepositForm" label-width="35%"  v-else-if="radio === 'isBad'">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="保证金编号：">
                        <el-input v-model="badDepositForm.code" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="保证金金额：">
                        <el-input v-model="badDepositForm.depositAmount" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="出款抬头：">
                        <el-input v-model="badDepositForm.paymentCompany" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="收款抬头：">
                        <el-input v-model="badDepositForm.collectCompany" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="项目编号：">
                        <el-input v-model="badDepositForm.projectCode" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目编号名称：">
                        <el-input v-model="badDepositForm.projectName" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="保证金坏账金额：" prop="depositBadAmount">
                        <el-input v-model="badDepositForm.depositBadAmount" readOnly="true" :disabled=true></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="特殊说明：">
                        <el-input v-model="badDepositForm.remark"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="钉钉审批:">
                        <el-switch v-model="badDepositForm.aisle" active-color="#13ce66" inactive-color="#ff4949" active-text="总部" inactive-text="地区"></el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="resetOperationDeposit">取消</el-button>
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
                transferDepositForm: {//保证金实体
                    code: '',//保证金编号
                    depositAmount: '',//保证金金额
                    depositOutAmount: '',//保证金转出金额
                    depositOutBalanceAmount: '',//保证金转出差额
                    projectCode:'',//项目编号
                    projectName:'',//项目名称
                    receivedDate: '',//回款日期
                    performanceDto: {//履约金实体
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
                returnDepositForm: {//保证金实体
                    code: '',//保证金编号
                    depositAmount: '',//保证金金额
                    depositReturnAmount: '',//保证金退回金额
                    collectCompany: '',//收款抬头
                    paymentCompany: '',//付款抬头
                    projectCode:'',//项目编号
                    projectName:'',//项目名称
                    remark: '',//备注
                    aisle: true//钉钉通道
                },
                //坏帐
                badDepositForm: {//保证金实体
                    code: '',//保证金编号
                    depositAmount: '',//保证金金额
                    depositBadAmount: '',//保证金坏账金额
                    collectCompany: '',//收款抬头
                    paymentCompany: '',//付款抬头
                    projectCode:'',//项目编号
                    projectName:'',//项目名称
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
            this.queryDepositInfo(this.currentRow.code);
        },
        methods: {
            queryDepositInfo(code) {
                let vm = this;
                Http.get(Api.deposit.queryByCode, {params: {'code': code}}, result => {
                    vm.transferDepositForm =  Object.assign(result.result, vm.transferDepositForm, _.pick(result.result, _.keys(vm.transferDepositForm)));
                    vm.transferDepositForm.depositOutAmount = '';
                    vm.transferDepositForm.performanceDto = Object.assign({}, vm.transferDepositForm.performanceDto, result.result.performance);
                    vm.transferDepositForm.performanceDto.customerType = result.result.customerType;
                    vm.returnDepositForm = result.result;
                    vm.badDepositForm = result.result;
                    vm.returnDepositForm.depositReturnAmount = result.result.depositResidueAmount;
                    vm.returnDepositForm.depositBadAmount = result.result.depositResidueAmount;
                    if(vm.transferDepositForm.performanceDto.contractAttachment != null){
                        /*设置附件*/
                        vm.$refs.contractAttachment.setFileList(vm.transferDepositForm.performanceDto.contractAttachment.split(","));
                    }
                })
            },
            cal() {
                let vm = this;
                if(!vm.transferDepositForm.depositOutAmount.match(/^(([1-9]\d*)|0)(\.\d{1,2})?$/)){
                    return;
                }
                if(vm.transferDepositForm.depositOutAmount > vm.transferDepositForm.depositAmount){
                    vm.transferDepositForm.depositOutBalanceAmount = vm.transferDepositForm.depositOutAmount - vm.transferDepositForm.depositAmount;
                }else{
                    vm.transferDepositForm.depositOutBalanceAmount = 0;
                }
            },
            //关闭窗口
            resetOperationDeposit() {
                this.transferDepositForm = {//保证金实体
                    code: '',//保证金编号
                    depositAmount: '',//保证金金额
                    depositOutAmount: '',//保证金转出金额
                    depositOutBalanceAmount: '',//保证金转出差额
                    projectCode:'',//项目编号
                    projectName:'',//项目名称
                    receivedDate: '',//回款日期
                    performanceDto: {//履约金实体
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
                };
                this.returnDepositForm = {//保证金实体
                    code: '',//保证金编号
                    depositAmount: '',//保证金金额
                    depositReturnAmount: '',//保证金退回金额
                    collectCompany: '',//收款抬头
                    paymentCompany: '',//付款抬头
                    projectCode:'',//项目编号
                    projectName:'',//项目名称
                    remark: '',//备注
                    aisle: true//钉钉通道
                };
                this.badDepositForm = {//保证金实体
                    code: '',//保证金编号
                    depositAmount: '',//保证金金额
                    depositBadAmount: '',//保证金坏账金额
                    collectCompany: '',//收款抬头
                    paymentCompany: '',//付款抬头
                    projectCode:'',//项目编号
                    projectName:'',//项目名称
                    remark: '',//备注
                    aisle: true//钉钉通道
                };
                this.visible = false;
                this.$emit('close');
            },
            submit(){
                switch (this.radio) {
                    case 'isTransfer':
                        this.transferDepositSubmit();
                        break;
                    case 'isReturn':
                        this.returnDepositSubmit();
                        break;
                    case 'isBad':
                        this.badDepositSubmit();
                        break;
                    default:
                        break;
                }
            },
            //确定提交表单
            transferDepositSubmit() {
                let vm = this;
                Http.get(Api.deposit.queryByCode, {params: {'code': this.currentRow.code}}, result => {
                    vm.transferDepositForm.receivedDate = result.result.receivedDate;
                })
                if (vm.transferDepositForm.performanceDto.receivedDate != null && new Date(vm.transferDepositForm.performanceDto.receivedDate).getTime() <= new Date(vm.transferDepositForm.receivedDate).getTime()) {
                    vm.$message.error('应回款日期不能小于等于转换源（保证金）的应回款日期！');
                    return false;
                }
                vm.transferDepositForm.performanceDto.contractAttachment = this.$refs.contractAttachment.getFileList().join(",");
                vm.$refs.transferDepositForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.deposit.depositTransfer, vm.transferDepositForm, result => {
                            vm.$message.success('保证金转履约金成功！');
                            vm.resetOperationDeposit();
                        });
                    } else {
                        vm.$message.error("请检查必填项");
                        return false;
                    }
                });
            },
            //确定提交表单
            returnDepositSubmit() {
                let vm = this;
                vm.$refs.returnDepositForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.deposit.depositReturn, vm.returnDepositForm, result => {
                            vm.$message.success('保证金退回成功！');
                            vm.resetOperationDeposit();
                        });
                    } else {
                        vm.$message.error("请检查必填项");
                        return false;
                    }
                });
            },
            //确定提交表单
            badDepositSubmit() {
                let vm = this;
                vm.$refs.badDepositForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.deposit.depositBad, vm.badDepositForm, result => {
                            vm.$message.success('保证金坏账成功！');
                            vm.resetOperationDeposit();
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
