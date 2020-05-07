<template>
    <el-dialog title="新增投标保证金" :visible.sync="visible" width="50%" @close="resetAddDeposit">
        <el-form size="small" :model="addDepositForm" ref="addDepositForm" label-width="120px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="支付金额：" prop="depositAmount" :rules="[Validate.required('支付金额',true),Validate.notZeroMoney]">
                        <el-input v-model="addDepositForm.depositAmount"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="客户类型：" prop="customerType" :rules="Validate.required('客户类型',true)">
                        <dictionary-select option-name="BUSINESS_CUSTOMER_TYPE"  v-model="addDepositForm.customerType" style="display:block;"></dictionary-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">收款信息（必填）</span>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="收款抬头：" prop="collectCompany" :rules="{required:true,message:'请输入收款抬头！'}">
                        <el-input v-model="addDepositForm.collectCompany"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="收款账号:" prop="collectAccount" :rules="[{required:true,message:'请输入收款账号！'},Validate.number]">
                        <el-input  v-model="addDepositForm.collectAccount"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="收款银行：" prop="collectBank" :rules="{required:true,message:'请输入收款银行！'}">
                        <el-input v-model="addDepositForm.collectBank"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="应回款时间：" prop="receivedDate" :rules="{required:true,message:'请输入应回款时间！'}">
                        <el-date-picker style="display:block; width:100%;" v-model="addDepositForm.receivedDate"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="逾期提醒：" prop="overdueDay" :rules="[{required:true,message:'请输入逾期提醒！'},Validate.number]">
                        <el-input v-model="addDepositForm.overdueDay"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">出款信息（必填）</span>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="出款抬头：" prop="paymentCompany" :rules="{required:true,message:'请输入出款抬头！'}">
                        <dictionary-select option-name="LINE_INCOME_SUBJECT"  v-model="addDepositForm.paymentCompany" style="display:block;"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出款银行:" prop="paymentBank" :rules="{required:true,message:'请输入出款银行！'}">
                        <el-input  v-model="addDepositForm.paymentBank"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="应支付时间：" prop="paymentDate" :rules="{required:true,message:'请输入应支付时间！'}">
                        <el-date-picker style="display:block; width:100%;" v-model="addDepositForm.paymentDate"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="附件:" prop="projectAttachment" :rules="{required:true,message:'请选择附件！'}">
                        <upload-image ref="projectAttachment"
                                      fileModule="deposit"
                                      v-model="addDepositForm.projectAttachment"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">项目信息</span>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="则一客户：" prop="customerCode" :rules="{required:true,message:'请输入则一客户！'}">
                        <customer-select v-model="addDepositForm.customerCode" style="display:block"></customer-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="业务经手人:" prop="handler" :rules="{required:true,message:'请输入业务经手人！'}">
                        <user-select v-model="addDepositForm.handler" style="display:block"></user-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="项目名称：" prop="projectName" :rules="{required:true,message:'请输入项目名称！'}">
                        <el-input v-model="addDepositForm.projectName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目编号:" prop="projectCode" :rules="{required:true,message:'请输入项目编号！'}">
                        <el-input  v-model="addDepositForm.projectCode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="钉钉通道:">
                        <el-switch v-model="addDepositForm.aisle" active-color="#13ce66" inactive-color="#ff4949" active-text="总部" inactive-text="地区"></el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="备注:">
                        <el-input  v-model="addDepositForm.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="区域:" prop="orgCodes">
                        <multiple-org-select ref="orgCodes" v-model="addDepositForm.orgCodes"  :multiple="true" ></multiple-org-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="close">取消</el-button>
            <el-button size="small" type="primary" @click="addDepositSubmit">确 定</el-button>
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
                addDepositForm: {
                    orgCodes: [],
                    depositAmount: '',
                    collectCompany: '',
                    collectAccount: '',
                    collectBank: '',
                    receivedDate: '',
                    overdueDay: '',
                    paymentCompany: '',
                    paymentBank: '',
                    paymentDate: '',
                    projectAttachment: '',
                    customerType: '',
                    customerCode: '',
                    handler: '',
                    projectName: '',
                    projectCode: '',
                    aisle: true,
                    remark: ''
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                }
            }
        },
        methods: {
            //关闭窗口
            close() {
                this.visible = false;
                this.$emit('close');
            },
            resetAddDeposit() {
                this.addDepositForm = {
                    orgCodes: [],
                    depositAmount: '',
                    collectCompany: '',
                    collectAccount: '',
                    collectBank: '',
                    receivedDate: '',
                    overdueDay: '',
                    paymentCompany: '',
                    paymentBank: '',
                    paymentDate: '',
                    projectAttachment: '',
                    customerType: '',
                    customerCode: '',
                    handler: '',
                    projectName: '',
                    projectCode: '',
                    aisle: true,
                    remark: ''
                };
                this.close();
            },
            //确定提交表单
            addDepositSubmit() {
                let vm = this;
                if (vm.addDepositForm.receivedDate != null && new Date(vm.addDepositForm.receivedDate).getTime() <= new Date().getTime()) {
                    return vm.$message.error('应回款时间不能小于等于当前时间！')
                }
                vm.addDepositForm.projectAttachment = this.$refs.projectAttachment.getFileList().join(",");
                vm.$refs.addDepositForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.deposit.add, vm.addDepositForm, result => {
                            vm.$message.success('保证金新增成功！');
                            vm.close();
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
