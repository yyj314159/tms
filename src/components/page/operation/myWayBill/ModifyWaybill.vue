<template>
    <el-dialog :title="title" :visible.sync="visible" width="95%" :top="marginTop" @close="close">
        <el-form size="small" :model="waybillForm" ref="waybillForm" label-width="95px">
            <el-row>
                <el-col :span="5">
                    <el-form-item label="业务类型:" prop="dispatch.businessType" :rules="Validate.required('业务类型',true)">
                        <dictionary-select v-model="waybillForm.dispatch.businessType" option-name="LINE_BUSINESS_TYPE" style="display:block"  @change="businessTypeChange"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="客户名称:" prop="dispatch.customerCode" :rules="[Validate.required('客户名称',true)]">
                        <customer-select ref="customer" v-model="waybillForm.dispatch.customerCode" auditStatus="PASS" style="display:block"></customer-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="线路名称:" prop="dispatch.lineCode" :rules="[Validate.required('线路名称',true)]">
                        <line-select ref="line" v-model="waybillForm.dispatch.lineCode" style="display:block"></line-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="业务员:"  prop="dispatch.salesman" :rules="Validate.required('业务员',waybillForm.dispatch.businessType==='SCATTERED_BUSINESS_TYPE')">
                        <multiple-user-select v-model="waybillForm.dispatch.salesman" style="display:block;"></multiple-user-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="请车员:"  prop="dispatch.carInviter" :rules="Validate.required('请车员',waybillForm.dispatch.businessType==='SCATTERED_BUSINESS_TYPE')">
                        <all-user-select placeholder="请输入请车员姓名" style="display:block;"  v-model="waybillForm.dispatch.carInviter" @change-option="changeCarInviter"></all-user-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">车辆信息</span>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="车牌号码:" prop="dispatch.dispatchVehicle.vehicleCode" :rules="[Validate.required('车牌号码',true)]">
                        <vehicle-select ref="vehicle" v-model="waybillForm.dispatch.dispatchVehicle.vehicleCode" @change-option="changeVehicle"
                                        :type="[Constant.VEHICLE_TYPE.VAN,Constant.VEHICLE_TYPE.TRACTOR]" style="display:block;"></vehicle-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="挂厢号码:" prop="dispatch.dispatchVehicle.trailerCode" :rules="[{ required: vehicleType===Constant.VEHICLE_TYPE.TRACTOR, message: '挂厢号码不能为空', trigger: 'blur'}]">
                        <vehicle-select placeholder="请输入挂厢号" ref="trailer" :disabled="vehicleType!==Constant.VEHICLE_TYPE.TRACTOR" v-model="waybillForm.dispatch.dispatchVehicle.trailerCode" @change-option="changeTrailer"
                                        :type="[Constant.VEHICLE_TYPE.TRAILER]" style="display:block;"></vehicle-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="厢型:">
                        <dictionary-select-name :value="waybillForm.dispatch.dispatchVehicle.vanType" option-name="VEHICLE_COMPARTMENT_TYPE"></dictionary-select-name>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="车型:">
                        <dictionary-select-name :value="waybillForm.dispatch.dispatchVehicle.specification" option-name="VEHICLE_SPECIFICATION"></dictionary-select-name>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="承载方数:">
                        {{waybillForm.dispatch.dispatchVehicle.loadSquare}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="车辆性质:">
                        <dictionary-select-name :value="waybillForm.dispatch.dispatchVehicle.vehicleNature" option-name="VEHICLE_OPERATION_MODE"></dictionary-select-name>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="司机姓名:" prop="dispatch.dispatchVehicle.driverId" :rules="Validate.required('司机姓名',true)">
                        <driver-select ref="driver" v-model="waybillForm.dispatch.dispatchVehicle.driverId" @driver="changeDriver"
                                       style="display: block"></driver-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="司机电话:">
                        {{waybillForm.dispatch.dispatchVehicle.driver.mobile}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="供应商:" prop="dispatch.dispatchVehicle.supplierCode">
                        <supplier-select  placeholder="请输入供应商名称或手机号" ref="supplier"
                                         v-model="waybillForm.dispatch.dispatchVehicle.supplierCode" @supplier="changeShipper" style="display: block"></supplier-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户订单:">
                        <el-input placeholder="请输入客户订单"  v-model="waybillForm.dispatch.customerOrderCode"></el-input>
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
                        <dictionary-select :exclude-options="['ALL_DAY']" :clearable="false" v-model="waybillForm.dispatch.dispatchPrice.receivePriceType" option-name="LINE_PRICE_TYPE" style="display: block;"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="应收金额:" prop="dispatch.dispatchPrice.receiveAmount" :rules="[Validate.required('应收金额',true),Validate.money]">
                        <el-input v-model="waybillForm.dispatch.dispatchPrice.receiveAmount"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="计价方式:">
                        <dictionary-select-name :value="waybillForm.dispatch.dispatchPrice.paidPriceType" option-name="LINE_PRICE_TYPE"></dictionary-select-name>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="应付车价:">
                        {{waybillForm.dispatch.dispatchPrice.paidVehicleAmount}}
                    </el-form-item>
                </el-col>
                <el-col :span="4"></el-col>
            </el-row>
            <el-row>
                <el-col :span="4">
                    <span class="blue">应付明细</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    <el-form-item label="使用GPS:">
                        {{waybillForm.dispatch.dispatchPrice.useGps?'是':'否'}}
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="GPS号码:">
                        {{waybillForm.dispatch.dispatchPrice.gpsCode}}
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="GPS押金:">
                        {{waybillForm.dispatch.dispatchPrice.gpsDeposit}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="GPS费用:">
                        {{waybillForm.dispatch.dispatchPrice.gpsFee}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="火灾险服务费:">
                        {{waybillForm.dispatch.dispatchPrice.insuranceFee}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    <el-form-item label="回单押金:">
                        {{waybillForm.dispatch.dispatchPrice.returnDeposit}}
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="回单付款:">
                        {{waybillForm.dispatch.dispatchPrice.returnAmount}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="备注信息：">
                        {{waybillForm.dispatch.remark}}
                    </el-form-item>
                </el-col>
                <el-col :span="4" style="text-align: center">
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
                title:`修改运单信息【${this.currentRow.code}】`,
                Validate: Validate,//校验
                Constant: Constant,//常量
                waybillForm: {
                    dispatch:{
                        lineCode: '',
                        customer: {},//客户
                        customerCode: '',
                        belongOrg:{},//所属区域
                        customerOrderCode: '',//客户订单
                        dispatchVehicle: {
                            vehicleCode: "",//车牌号
                            vehicleLicenseNum: "",
                            trailerCode: "",//挂厢号
                            trailerLicenseNum: "",
                            vanType: "",//厢型
                            specification: "",//车长
                            vehicleNature: "",//车辆属性
                            selfOperationMode: '',
                            driver: {},
                            driverId: "",
                            driverName: "",//司机姓名
                            driverPhone: "",//司机电话
                            shipper: {},
                            shipperCode: "",//供应商
                        },
                        dispatchPrice: {},
                        remark: "",//备注
                        businessType: '',//this.currentRow.businessType//业务类型
                        salesman: [],
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
                    //回显业务员
                    if(vm.waybillForm.dispatch.salesman){
                        vm.waybillForm.dispatch.salesman = vm.waybillForm.dispatch.salesman.split(',');
                    }else{
                        vm.waybillForm.dispatch.salesman = []
                    }
                    vm.$nextTick(()=>{
                        if(!_.isNil(result.result.dispatch.dispatchLine)){//线路
                            vm.$refs.line.setCurrentLine({id:result.result.dispatch.lineCode,name:result.result.dispatch.dispatchLine.lineName});
                        }
                        if(!_.isNil(result.result.dispatch.customer)){//客户
                            vm.$refs.customer.setCurrentCustomer(result.result.dispatch.customer);
                        }
                        if(!_.isNil(result.result.dispatch.dispatchVehicle.vehicle)){//车牌号
                            vm.$refs.vehicle.setCurrentVehicle(result.result.dispatch.dispatchVehicle.vehicle);
                        }
                        if(!_.isNil(result.result.dispatch.dispatchVehicle.trailer)){//挂厢号
                            vm.$refs.trailer.setCurrentVehicle(result.result.dispatch.dispatchVehicle.trailer);
                            vm.vehicleType = Constant.VEHICLE_TYPE.TRACTOR;//有挂厢号说明是车头
                        }
                        if(!_.isNil(result.result.dispatch.dispatchVehicle.driver)){//司机姓名
                            vm.$refs.driver.setCurrentDriver(result.result.dispatch.dispatchVehicle.driver);
                        }
                        if(!_.isNil(result.result.dispatch.dispatchVehicle.supplier)){//供应商
                            vm.$refs.supplier.setCurrentSupplier(result.result.dispatch.dispatchVehicle.supplier);
                            vm.waybillForm.dispatch.dispatchVehicle.supplierName = result.result.dispatch.dispatchVehicle.supplier.name;
                        }
                    })
                })
            },
            changeVehicle(obj){
                let vm = this;
                vm.waybillForm.dispatch.dispatchVehicle.vehicleCode = '';
                vm.waybillForm.dispatch.dispatchVehicle.vehicleLicenseNum = '';
                vm.waybillForm.dispatch.dispatchVehicle.trailerCode = '';
                vm.waybillForm.dispatch.dispatchVehicle.trailerLicenseNum = '';
                vm.waybillForm.dispatch.dispatchVehicle.vanType = '';
                vm.waybillForm.dispatch.dispatchVehicle.specification = '';
                vm.waybillForm.dispatch.dispatchVehicle.vehicleNature = '';
                vm.vehicleType = '';
                if(!_.isNil(obj)){//选择一个车牌号
                    Http.get(Api.vehicle.queryByCode, {params: {'code': obj.code}}, result => {
                        if (result.result.blacklist === true) {
                            return vm.$message('此车辆已被列入系统黑名单,不能选择!');
                        }
                        if (result.result.status === 'FORBIDDEN') {
                            return vm.$message('此车辆已被禁用,不能选择!');
                        }
                        if (result.result.operationStatus === 'DISCARDED') {
                            return vm.$message('此车辆已报废,不能选择!');
                        }
                        if (result.result.operationStatus === 'SEALED') {
                            vm.resetVehicleInfo();
                            return vm.$message('此车辆已封存,不能选择!');
                        }
                        vm.waybillForm.dispatch.dispatchVehicle.vehicleCode = obj.code;
                        vm.waybillForm.dispatch.dispatchVehicle.vehicleLicenseNum = obj.licenseNumber;
                        vm.vehicleType = result.result.type;
                        if(result.result.type !== Constant.VEHICLE_TYPE.TRACTOR){//厢车
                            vm.waybillForm.dispatch.dispatchVehicle.vanType = result.result.vanType;
                            vm.waybillForm.dispatch.dispatchVehicle.specification = result.result.specification;
                        }
                        vm.waybillForm.dispatch.dispatchVehicle.vehicleNature = result.result.operationMode;//车辆属性
                    });
                }
            },
            changeTrailer(obj){
                let vm = this;
                vm.waybillForm.dispatch.dispatchVehicle.trailerCode = '';
                vm.waybillForm.dispatch.dispatchVehicle.trailerLicenseNum = '';
                vm.waybillForm.dispatch.dispatchVehicle.vanType = '';
                vm.waybillForm.dispatch.dispatchVehicle.specification = '';
                if(!_.isNil(obj)){
                    Http.get(Api.vehicle.queryByCode, {params: {'code': obj.code}}, result => {
                        if (result.result.status === 'FORBIDDEN') {
                            return vm.$message('此挂厢已被禁用,不能选择!');
                        }
                        vm.waybillForm.dispatch.dispatchVehicle.trailerCode = obj.code;
                        vm.waybillForm.dispatch.dispatchVehicle.trailerLicenseNum = obj.licenseNumber;
                        vm.waybillForm.dispatch.dispatchVehicle.vanType = result.result.vanType;
                        vm.waybillForm.dispatch.dispatchVehicle.specification = result.result.specification;
                    })
                }
            },
            changeDriver(obj){
                let vm = this;
                vm.waybillForm.dispatch.dispatchVehicle.driver = {};
                vm.waybillForm.dispatch.dispatchVehicle.driverId = '';
                vm.waybillForm.dispatch.dispatchVehicle.driverName = '';
                vm.waybillForm.dispatch.dispatchVehicle.driverPhone = "";
                if(!_.isNil(obj)){
                    if(obj.blacklist === true){
                        return vm.$message('此司机已被列入系统黑名单,不能选择!');
                    }
                    if(_.isNil(obj.name) || obj.name === ''){
                        return vm.$message.warning('该司机信息不完整，请先完善司机信息！');
                    }
                    vm.waybillForm.dispatch.dispatchVehicle.driver = obj;
                    vm.waybillForm.dispatch.dispatchVehicle.driverId = obj.id;
                    vm.waybillForm.dispatch.dispatchVehicle.driverName = obj.name;
                    vm.waybillForm.dispatch.dispatchVehicle.driverPhone = obj.mobile;
                }
            },
            changeShipper(obj){
                let vm = this;
                vm.waybillForm.dispatch.dispatchVehicle.supplierCode = "";
                vm.waybillForm.dispatch.dispatchVehicle.supplierName = "";
                if(!_.isNil(obj)){
                    if (obj.blacklist === true) {
                        return vm.$message('此供应商已被列入系统黑名单,不能选择!');
                    }
                    vm.waybillForm.dispatch.dispatchVehicle.supplierCode = obj.id;
                    vm.waybillForm.dispatch.dispatchVehicle.supplierName = obj.name;
                }
            },
            //关闭窗口
            close() {
                this.visible = false;
                this.$emit('close');
            },
            //确定提交修改表单
            submit() {
                let vm = this;
                vm.$refs.waybillForm.validate((valid) => {
                    if (valid) {
                        let waybillForm = _.cloneDeep(vm.waybillForm);
                        waybillForm.dispatch.salesman = waybillForm.dispatch.salesman.join(',');
                        Http.post(Api.waybill.modify, waybillForm, result => {
                            vm.$message.success('运单修改成功！');
                            vm.close();
                        });
                    }
                });
            },
            changeCarInviter(obj){
                let vm = this;
                if(!_.isNil(obj)){
                    vm.waybillForm.dispatch.carInviter = `${obj.name} ${obj.username}`;
                }else{
                    vm.waybillForm.dispatch.carInviter = '';
                }
            },
            businessTypeChange(val){
                let vm = this;
                if(val === 'SCATTERED_BUSINESS_TYPE'){
                    vm.waybillForm.dispatch.salesman = [];
                    vm.waybillForm.dispatch.carInviter = '';
                }
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
