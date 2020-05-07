<template>
    <el-dialog title="履约金凭证维护" :visible.sync="visible" width="50%" @close="close">
        <el-form size="small" :model="voucherMaintainForm" ref="voucherMaintainForm" label-width="35%">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="收据凭证：">
                        <upload-image ref="receiptVoucher" v-model="voucherMaintainForm.receiptVoucher" :limit="4"></upload-image>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="出款凭证：">
                        <upload-image ref="paymentVoucher" v-model="voucherMaintainForm.paymentVoucher" :limit="4"></upload-image>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="收款凭证：">
                        <upload-image ref="collectVoucher" v-model="voucherMaintainForm.collectVoucher" :limit="4"></upload-image>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="close">取 消</el-button>
            <el-button size="small" type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {Http, Api, Constant, Validate} from 'src/global'

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
                voucherMaintainForm: {
                    receiptVoucher: '',
                    paymentVoucher: '',
                    collectVoucher: '',
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
                    vm.voucherMaintainForm = result.result;
                    if(vm.voucherMaintainForm.receiptVoucher != null){
                        vm.$refs.receiptVoucher.setFileList(vm.voucherMaintainForm.receiptVoucher.split(","));
                    }
                    if(vm.voucherMaintainForm.paymentVoucher != null){
                        vm.$refs.paymentVoucher.setFileList(vm.voucherMaintainForm.paymentVoucher.split(","));
                    }
                    if(vm.voucherMaintainForm.collectVoucher != null){
                        vm.$refs.collectVoucher.setFileList(vm.voucherMaintainForm.collectVoucher.split(","));
                    }
                })
            },
            //关闭窗口
            close() {
                this.visible = false;
                this.$emit('close');
            },
            //提交表单
            submit() {
                let vm = this;
                vm.voucherMaintainForm.receiptVoucher = this.$refs.receiptVoucher.getFileList().join(",");
                vm.voucherMaintainForm.paymentVoucher = this.$refs.paymentVoucher.getFileList().join(",");
                vm.voucherMaintainForm.collectVoucher = this.$refs.collectVoucher.getFileList().join(",");
                vm.$refs.voucherMaintainForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.performance.voucherMaintain, vm.voucherMaintainForm, result => {
                            vm.$message.success('履约金凭证维护成功！');
                            vm.close();
                        });
                    } else {
                        vm.$message.error("请检查必填项");
                    }
                });
            }
        }
    }
</script>
