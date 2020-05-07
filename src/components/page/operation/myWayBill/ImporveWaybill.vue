<template>
    <el-dialog :title="title" :visible.sync="visible" width="60%" :top="marginTop" @close="close">
        <el-form size="small" :model="waybillForm" ref="waybillForm" label-width="95px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="派车单号:">
                        {{waybillForm.dispatch.code}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="客户名称:">
                        {{waybillForm.dispatch.customer.name}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="线路名称:">
                        {{waybillForm.dispatch.dispatchLine.lineName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="业务员:">
                        {{waybillForm.dispatch.salesman}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="请车员:">
                        {{waybillForm.dispatch.carInviter}}
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">车辆信息</span>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="车牌号码:">
                        {{waybillForm.dispatch.dispatchVehicle.vehicleLicenseNum}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="挂厢号码:">
                        {{waybillForm.dispatch.dispatchVehicle.trailerCode}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="车型:">
                        {{waybillForm.dispatch.dispatchVehicle.specification}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="司机电话:">
                        {{waybillForm.dispatch.dispatchVehicle.driver.mobile}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="司机姓名:">
                        {{waybillForm.dispatch.dispatchVehicle.driverName}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否开票:" >
                        <span  v-if="waybillForm.dispatch.dispatchVehicle.ticket">
                            是
                        </span>
                        <span v-else>
                            否
                        </span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="客户订单:">
                        <el-input  v-model="waybillForm.dispatch.customerOrderCode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="text-align: center">
                    <el-button size="small" @click="close" style="margin-left: 30px;">取消</el-button>
                    <el-button type="primary" @click="submit" size="small">确定</el-button>
                </el-col>
            </el-row>
        </el-form>
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
                title:`完善运单信息【${this.currentRow.code}】`,
                Validate: Validate,//校验
                Constant: Constant,//常量
                waybillForm: {
                    dispatch:{
                        customerOrderCode: ''//客户订单
                    }
                },
                marginTop: window.innerHeight>800?'15vh':'2vh',
                vehicleType: ''
            }
        },
        mounted() {
            this.queryWaybillInfo(this.currentRow.code);
        },
        watch: {
            //监听传入的visible参数
            dialogVisible(val) {
                if (val) {
                    this.visible = val;
                }
            }
        },
        methods: {
            //回写运单信息
            queryWaybillInfo(code) {
                let vm = this;
                Http.get(Api.waybill.queryByCode, {params: {'code': code}}, result => {
                    vm.waybillForm = result.result;
                })
            },
            //关闭窗口
            close() {
                this.visible = false;
                this.$emit('close');
            },
            //确定提交完善表单
            submit() {
                let vm = this;
                vm.$refs.waybillForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.customerOrderLack.modify, vm.waybillForm, result => {
                            vm.$message.success('运单完善成功！');
                            vm.close();
                        });
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
