<template>
    <el-dialog title="保证金信息" :visible.sync="visible" width="70%" @close="close">
        <el-form :model="depositForm" size="small" label-width="165px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="保证金编号:">
                        {{depositForm.code}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="履约金编号:">
                        {{depositForm.performanceCode}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="支付金额:">
                        {{depositForm.depositAmount}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="保证金状态:">
                        <template slot-scope="scope">
                            <span v-if="depositForm.depositStatus === 'APPLYING'">申请中</span>
                            <span v-else-if="depositForm.depositStatus === 'APPLY_REFUSE'">申请拒绝</span>
                            <span v-else-if="depositForm.depositStatus === 'USING'">使用中</span>
                            <span v-else-if="depositForm.depositStatus === 'OVERDUE'">逾期中</span>
                            <span v-else-if="depositForm.depositStatus === 'CANCEL'">已销账</span>
                            <span v-else-if="depositForm.depositStatus === 'BAD'">已坏账</span>
                            <span v-else></span>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目编号:">
                        {{depositForm.projectCode}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="项目名称:">
                        {{depositForm.projectName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="保证金剩余金额:">
                        {{depositForm.depositResidueAmount}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保证金转出金额:">
                        {{depositForm.depositOutAmount}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="保证金转出差额:">
                        {{depositForm.depositOutBalanceAmount}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="保证金退回金额:">
                        {{depositForm.depositReturnAmount}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="收款抬头:">
                        {{depositForm.collectCompany}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="收款银行:">
                        {{depositForm.collectBank}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="收款账号:">
                        {{depositForm.collectAccount}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="出款抬头:">
                        {{depositForm.paymentCompany}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="出款银行:">
                        {{depositForm.paymentBank}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="应支付日期:">
                        {{depositForm.paymentDate}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="应回款日期:">
                        {{depositForm.receivedDate}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="逾期超时（天）:">
                        {{depositForm.overdueDay}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="则一客户:">
                        {{depositForm.customerName}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请人:">
                        {{depositForm.createUser}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请时间:">
                        {{depositForm.createTime}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="附件:">
                        <show-image :url="depositForm.projectAttachment"></show-image>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="客户类型:">
                        <dictionary-select-name option-name="BUSINESS_CUSTOMER_TYPE"  v-model="depositForm.customerType"></dictionary-select-name>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="区域:">
                        {{depositForm.orgCodesString}}
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    import {Http, Api} from 'src/global'
    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            currentRow:{
                type: Object,
                default: null
            }
        },
        data() {
            return {
                visible: true,
                depositForm: {
                }
            }
        },
        watch:{
            //监听传入的visible参数
            dialogVisible(val){
                if(val){
                    this.visible = val;
                }
            }
        },
        created() {
            this.queryDepositInfo(this.currentRow.code);
        },
        methods: {
            queryDepositInfo(code) {
                let vm = this;
                if(code == null){
                    code = vm.currentRow.depositCode;
                }
                Http.get(Api.deposit.queryByCode, {params: {'code': code}}, result => {
                    vm.depositForm = result.result;
                })
            },
            close() {
                this.visible = false;
                this.$emit('close');
            }
        }
    }
</script>
<style scoped>
    .blue{
        color:#20a0ff;
        display: inline-block;
        width:150px;
        margin-bottom: 12px;
    }
</style>
