<template>
    <el-dialog :title="title" :visible.sync="visible" width="90%" :top="marginTop" @close="close">
        <el-form size="small" label-width="95px">
            <el-row>
                <el-col :span="5">
                    <el-form-item label="业务类型:">
                        <dictionary-select-name option-name="LINE_BUSINESS_TYPE" v-model="addVehicleForm.businessType"></dictionary-select-name>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="预计发车:">
                        {{addVehicleForm.expectDepartureTime}}
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="业务员:" label-width="75px">
                        {{addVehicleForm.salesman ? addVehicleForm.salesman : "无"}}
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="请车员:" label-width="75px">
                        {{addVehicleForm.carInviter}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户订单:" label-width="75px">
                        {{addVehicleForm.customerOrderCode}}
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">车辆信息</span>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="车牌号码:">
                         {{addVehicleForm.dispatchVehicle.vehicleLicenseNum}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="挂厢号码:">
                        {{addVehicleForm.dispatchVehicle.trailerLicenseNum ? addVehicleForm.dispatchVehicle.trailerLicenseNum : "无"}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="厢型:">
                        <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE" v-model="addVehicleForm.dispatchVehicle.vanType"></dictionary-select-name>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="车型:">
                        <dictionary-select-name option-name="VEHICLE_SPECIFICATION" v-model="addVehicleForm.dispatchVehicle.specification"></dictionary-select-name>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="承载方数:">
                        {{addVehicleForm.dispatchVehicle.trailerCode ? (addVehicleForm.dispatchVehicle.trailer ? addVehicleForm.dispatchVehicle.trailer.loadSquare : "") : (addVehicleForm.dispatchVehicle.vehicle ? addVehicleForm.dispatchVehicle.vehicle.loadSquare : '')}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="车辆性质:">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" v-model="addVehicleForm.dispatchVehicle.vehicleNature"></dictionary-select-name>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="addVehicleForm.dispatchVehicle.vehicleNature === constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT">
                <el-col :span="4">
                    <el-form-item label="司机姓名:">
                        {{addVehicleForm.dispatchVehicle.driver ? addVehicleForm.dispatchVehicle.driver.name : ""}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="司机电话:">
                        {{addVehicleForm.dispatchVehicle.driver ? addVehicleForm.dispatchVehicle.driver.mobile : ""}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="司机姓名2:">
                        {{addVehicleForm.dispatchVehicle.spareDriver ? addVehicleForm.dispatchVehicle.spareDriver.name : ""}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="司机电话2:">
                        {{addVehicleForm.dispatchVehicle.spareDriver ? addVehicleForm.dispatchVehicle.spareDriver.mobile : ""}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="回货:" label-width="75px">
                        {{addVehicleForm.returnGoods ? "是" : "否"}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-else>
                <el-col :span="4">
                    <el-form-item label="司机姓名:">
                        {{addVehicleForm.dispatchVehicle.driver ? addVehicleForm.dispatchVehicle.driver.name : ""}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="司机电话:">
                        {{addVehicleForm.dispatchVehicle.driver ? addVehicleForm.dispatchVehicle.driver.mobile : ""}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="供应商:">
                        {{addVehicleForm.dispatchVehicle.supplier ? addVehicleForm.dispatchVehicle.supplier.name : "无"}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="回货:" label-width="75px">
                        {{addVehicleForm.returnGoods ? "是" : "否"}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10"><span class="blue">应收信息</span></el-col>
                <el-col :span="14"><span class="blue">应付信息</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    <el-form-item label="计价方式:">
                        <dictionary-select-name option-name="LINE_PRICE_TYPE" v-model="addVehicleForm.dispatchPrice.receivePriceType"></dictionary-select-name>
                    </el-form-item>
                </el-col>
                <el-col :span="5" style="visibility: hidden;">
                    <el-form-item label="应收金额:">
                        {{addVehicleForm.dispatchPrice.receiveAmount}} 元
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="计价方式:">
                        <dictionary-select-name option-name="LINE_PRICE_TYPE" v-model="addVehicleForm.dispatchPrice.paidPriceType"></dictionary-select-name>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="应付车价:">
                        {{addVehicleForm.dispatchPrice.paidVehicleAmount}} 元
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">应付明细</span>
            <el-row>
                <el-col :span="5">
                    <el-form-item label="预付打卡:">
                        {{addVehicleForm.dispatchPrice.prepaidCardAmount}} 元
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="使用GPS:">
                        {{addVehicleForm.dispatchPrice.useGps?'是':'否'}}
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="GPS号码:">
                        {{addVehicleForm.dispatchPrice.gpsCode}}
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="GPS费用:">
                        {{addVehicleForm.dispatchPrice.gpsFee}} 元
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="回单押金:">
                        {{addVehicleForm.dispatchPrice.returnDeposit}} 元
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    <el-form-item label="火灾险服务费:">
                        {{addVehicleForm.dispatchPrice.insuranceFee}} 元
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="回单付款:">
                        {{addVehicleForm.dispatchPrice.returnAmount}} 元
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注信息：">
                        <p  style="word-break:break-all;">{{addVehicleForm.remark ? addVehicleForm.remark : "无"}}</p>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    import {Http,Api} from 'src/global'
    import {Constant} from 'src/global/constant'

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
                constant: Constant,//常量
                title:`派车详情 ：  【${this.currentRow.belongOrg.name}】【${this.currentRow.customer.name}】 【${this.currentRow.dispatchLine.lineName}】 【出发站点：${this.currentRow.dispatchLine.startStation.name}】`,
                addVehicleForm: {
                    belongOrg:{},
                    dispatchVehicle: {
                        driver:{},
                        spareDriver:{},
                        supplier: {},
                        shipper: {}
                    },
                    dispatchPrice: {
                        oilCard:{},
                        gps:{}
                    },
                    businessType: this.currentRow.businessType//业务类型
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
            this.init(this.currentRow.code);
        },
        computed:{
            marginTop:function(){ //根据不同屏幕高度设置弹框的位置
                if(document.documentElement.clientHeight>900){
                    return "15vh";
                }else if(document.documentElement.clientHeight<700){
                    return "2vh";
                }else{
                    return "8vh";
                }
            }
        },
        methods: {
            close() {
                this.visible = false;
                this.$emit('close');
            },
            init(code){
                let vm = this;
                Http.get(Api.dispatch.queryByCode,{params:{'code':code}},result =>{
                    vm.addVehicleForm = result.result;
                })
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
