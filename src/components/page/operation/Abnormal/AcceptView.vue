<template>
    <el-dialog title="受理车辆异常详情" :visible.sync="visible" width="70%" @close="close">
        <el-form size="small" :model="form" ref="form" label-width="120px">
            <!--派车单信息-->
            <el-row class="card">
                <el-row>
                    <span class="title">派车单 :</span>{{form.waybill.dispatch.code}}
                </el-row>
                <el-row class="card-body">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="线路名称：">
                                {{form.waybill.dispatch.dispatchLine.lineName}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="所属大区：">{{form.waybill.dispatch.region.name}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所属分区: ">{{form.waybill.dispatch.belongOrg.name}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="派车单类型:">
                                {{form.waybill.tempVehicle? "临时加车":"正班线路"}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-row>
            </el-row>
            <!--原车辆信息-->
            <el-row class="card">
                <el-row>
                    <span class="title">原车辆信息 :</span>
                </el-row>
                <el-row class="card-body">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="车牌号：">
                                <b style="font-size: 16px;">{{form.waybill.dispatch.dispatchVehicle.vehicleLicenseNum}}</b>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车挂号：">
                                <b style="font-size: 16px;">{{form.waybill.dispatch.dispatchVehicle.trailerLicenseNum}}</b></el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="厢型：">
                                <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE" v-model="form.waybill.dispatch.dispatchVehicle.vanType"></dictionary-select-name>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车型：">
                                <dictionary-select-name option-name="VEHICLE_SPECIFICATION" v-model="form.waybill.dispatch.dispatchVehicle.specification"></dictionary-select-name>(米)
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="车辆性质：">
                                <b style="font-size: 16px;">
                                    <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" v-model="form.waybill.dispatch.dispatchVehicle.vehicleNature"></dictionary-select-name>
                                </b>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="司机：">{{form.waybill.dispatch.dispatchVehicle.driver?form.waybill.dispatch.dispatchVehicle.driver.name:''}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="司机电话：">{{form.waybill.dispatch.dispatchVehicle.driver?form.waybill.dispatch.dispatchVehicle.driver.mobile:''}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="承运方:">{{form.waybill.dispatch.dispatchVehicle.shipper?form.waybill.dispatch.dispatchVehicle.shipper.name:''}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="供应商:">
                                {{form.waybill.dispatch.dispatchVehicle.supplier?form.waybill.dispatch.dispatchVehicle.supplier.name:''}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="是否开票:">
                                {{form.waybill.dispatch.dispatchVehicle.ticket ? "是" : "否"}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车主姓名:">
                                {{form.waybill.dispatch.dispatchVehicle.vehicleOwner?form.waybill.dispatch.dispatchVehicle.vehicleOwner.name:''}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车主电话:">
                                {{form.waybill.dispatch.dispatchVehicle.vehicleOwner?form.waybill.dispatch.dispatchVehicle.vehicleOwner.mobile:''}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="金融车辆：">
                                {{form.waybill.dispatch.dispatchVehicle.financeVehicleFlag ? "是" : "否"}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-row>
            </el-row>
            <!--异常上报信息-->
            <el-row class="card">
                <el-row>
                    <span class="title">异常上报信息 :</span>
                </el-row>
                <el-row class="card-body">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="正确车牌号：">{{form.vehicleLicenseNum}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="正确车挂号：">{{form.trailerLicenseNum}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="上报时间：">
                               {{form.reportTime}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="异常照片：">
                                <span v-if="form.attachment&&form.attachment.length>0"><show-image-t  :show-all="true" :url="form.attachment"></show-image-t></span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-row>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    import {Http,Api,Validate,Common,Constant} from 'src/global'

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
                visible: true,//本组件窗口的显示隐藏
                btnLoading: false,
                form: {
                    waybill: {
                        dispatch:{
                            region:{},
                            belongOrg:{},
                            dispatchLine: {},
                            dispatchVehicle:{
                                driver: {},
                                shipper: {},
                                supplier: {},
                                vehicleOwner: {}
                            }
                        }
                    }
                },
            }
        },
        mounted() {
            this.form = Object.assign({},this.currentRow);
        },
        methods: {
            close(){
                this.visible = false;
                this.$emit('close');
            }
        }
    }
</script>
<style scoped>
    .title {
        color: #20a0ff;
        display: inline-block;
        margin-bottom: 12px;
    }
    .ubnormalImg {
        width: 80px;
    }
</style>
