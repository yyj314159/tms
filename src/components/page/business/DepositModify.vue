<template>
    <el-dialog title="修改投标保证金" :visible.sync="visible" width="50%" @close="resetUpdateDeposit">
        <el-form size="small" :model="updateDepositForm" ref="updateDepositForm" label-width="120px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="支付金额：" prop="depositAmount" :rules="[Validate.required('支付金额',true),Validate.notZeroMoney]">
                        <el-input v-model="updateDepositForm.depositAmount"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="客户类型：" prop="customerType" :rules="Validate.required('客户类型',true)">
                        <dictionary-select option-name="BUSINESS_CUSTOMER_TYPE"  v-model="updateDepositForm.customerType" style="display:block;"></dictionary-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">收款信息（必填）</span>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="收款抬头：" prop="collectCompany" :rules="{required:true,message:'请输入收款抬头！'}">
                        <el-input v-model="updateDepositForm.collectCompany"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="收款账号:" prop="collectAccount" :rules="[{required:true,message:'请输入收款账号！'},Validate.number]">
                        <el-input  v-model="updateDepositForm.collectAccount"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="收款银行：" prop="collectBank" :rules="{required:true,message:'请输入收款银行！'}">
                        <el-input v-model="updateDepositForm.collectBank"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="应回款时间：" prop="receivedDate" :rules="{required:true,message:'请输入应回款时间！'}">
                        <el-date-picker style="display:block; width:100%;" v-model="updateDepositForm.receivedDate"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="逾期提醒：" prop="overdueDay" :rules="[{required:true,message:'请输入逾期提醒！'},Validate.number]">
                        <el-input v-model="updateDepositForm.overdueDay"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">出款信息（必填）</span>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="出款抬头：" prop="paymentCompany" :rules="{required:true,message:'请输入出款抬头！'}">
                        <dictionary-select option-name="LINE_INCOME_SUBJECT"  v-model="updateDepositForm.paymentCompany" style="display:block;"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出款银行:" prop="paymentBank" :rules="{required:true,message:'请输入出款银行！'}">
                        <el-input  v-model="updateDepositForm.paymentBank"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="应支付时间：" prop="paymentDate" :rules="{required:true,message:'请输入应支付时间！'}">
                        <el-date-picker style="display:block; width:100%;" v-model="updateDepositForm.paymentDate"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        type="datetime" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="附件:" prop="projectAttachment" :rules="{required:true,message:'请选择附件！'}">
                        <upload-image ref="projectAttachment"
                                      fileModule="deposit"
                                      v-model="updateDepositForm.projectAttachment"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">项目信息</span>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="则一客户：" prop="customerCode" :rules="{required:true,message:'请输入则一客户！'}">
                        <customer-select ref="customer" v-model="updateDepositForm.customerCode" style="display:block"></customer-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="业务经手人:" prop="handler" :rules="{required:true,message:'请输入业务经手人！'}">
                        <user-select v-model="updateDepositForm.handler" style="display:block"></user-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="项目名称：" prop="projectName" :rules="{required:true,message:'请输入项目名称！'}">
                        <el-input v-model="updateDepositForm.projectName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="项目编号:" prop="projectCode" :rules="{required:true,message:'请输入项目编号！'}">
                        <el-input  v-model="updateDepositForm.projectCode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="钉钉通道:">
                        <el-switch v-model="updateDepositForm.aisle" active-color="#13ce66" inactive-color="#ff4949" active-text="总部" inactive-text="地区"></el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="备注:">
                        <el-input  v-model="updateDepositForm.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="区域" prop="orgCodes">
                        <multiple-org-select ref="orgCodes" v-model="updateDepositForm.orgCodes"  :multiple="true" ></multiple-org-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="close">取消</el-button>
            <el-button size="small" type="primary" @click="updateDepositSubmit">确 定</el-button>
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
                updateDepositForm: {
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
                    customer: {},//客户
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
                },
                marginTop: window.innerHeight>800?'15vh':'2vh'
            }
        },
        mounted() {
            this.queryDepositInfo(this.currentRow.code);
        },
        methods: {
            queryDepositInfo(code) {
                let vm = this;
                Http.get(Api.deposit.queryByCode, {params: {'code': code}}, result => {
                    vm.updateDepositForm = result.result;
                    if(vm.updateDepositForm.projectAttachment !== null){
                        /*设置附件*/
                        vm.$refs.projectAttachment.setFileList(vm.updateDepositForm.projectAttachment.split(","));
                    }
                    vm.$nextTick(()=>{
                        vm.$refs.orgCodes.setOrgList(result.result.orgCodes);
                        if(!_.isNil(result.result.customer)){//客户
                            vm.$refs.customer.setCurrentCustomer(result.result.customer);
                        }
                    })
                })
            },
            //关闭窗口
            close() {
                this.visible = false;
                this.$emit('close');
            },
            resetUpdateDeposit() {
                this.updateDepositForm = {
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
            updateDepositSubmit() {
                let vm = this;
                if (vm.updateDepositForm.receivedDate != null && new Date(vm.updateDepositForm.receivedDate).getTime() <= new Date().getTime()) {
                    return vm.$message.error('应回款时间不能小于等于当前时间！')
                }
                vm.updateDepositForm.projectAttachment = this.$refs.projectAttachment.getFileList().join(",");
                vm.$refs.updateDepositForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.deposit.modify, vm.updateDepositForm, result => {
                            vm.$message.success('保证金修改成功！');
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
