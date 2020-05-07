<template>
    <el-dialog title="履约金信息" :visible.sync="visible" width="70%" @close="close">
        <el-form :model="performanceForm" size="small" label-width="165px">
            <span class="blue">履约金信息</span>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="履约金编号:">
                        {{performanceForm.code}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="履约金续约编号:">
                        {{performanceForm.continueCode}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="支付金额:">
                        {{performanceForm.performanceAmount}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="履约金状态:">
                        <template slot-scope="scope">
                            <span v-if="performanceForm.performanceStatus === 'APPLYING'">申请中</span>
                            <span v-else-if="performanceForm.performanceStatus === 'APPLY_REFUSE'">申请拒绝</span>
                            <span v-else-if="performanceForm.performanceStatus === 'USING'">使用中</span>
                            <span v-else-if="performanceForm.performanceStatus === 'OVERDUE'">逾期中</span>
                            <span v-else-if="performanceForm.performanceStatus === 'CANCEL'">已销账</span>
                            <span v-else-if="performanceForm.performanceStatus === 'BAD'">已坏账</span>
                            <span v-else></span>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合同编号:">
                        {{performanceForm.contractCode}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合同名称:">
                        {{performanceForm.contractName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="履约金剩余金额:">
                        {{performanceForm.performanceResidueAmount}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="履约金转出金额:">
                        {{performanceForm.performanceOutAmount}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="履约金转出差额:">
                        {{performanceForm.performanceOutBalanceAmount}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="履约金退回金额:">
                        {{performanceForm.performanceReturnAmount}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="收款抬头:">
                        {{performanceForm.collectCompany}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="收款银行:">
                        {{performanceForm.collectBank}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="收款账号:">
                        {{performanceForm.collectAccount}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="出款抬头:">
                        {{performanceForm.paymentCompany}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="出款银行:">
                        {{performanceForm.paymentBank}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="应支付日期:">
                        {{performanceForm.paymentDate}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="应回款日期:">
                        {{performanceForm.receivedDate}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="逾期超时（天）:">
                        {{performanceForm.overdueDay}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="则一客户:">
                        {{performanceForm.customerName}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请人:">
                        {{performanceForm.createUser}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请时间:">
                        {{performanceForm.createTime}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="投标保证金编号:">
                        {{performanceForm.depositCode}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="附件:">
                        <show-image :url="performanceForm.contractAttachment"></show-image>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="客户类型:">
                        <dictionary-select-name option-name="BUSINESS_CUSTOMER_TYPE"  v-model="performanceForm.customerType"></dictionary-select-name>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="区域:">
                        {{performanceForm.orgCodesString}}
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
                performanceForm: {
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
            this.queryPerformanceInfo(this.currentRow.code);
        },
        methods: {
            queryPerformanceInfo(code) {
                let vm = this;
                if(code == null){
                    code = vm.currentRow.performanceCode;
                }
                Http.get(Api.performance.queryByCode, {params: {'code': code}}, result => {
                    vm.performanceForm = result.result;
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
