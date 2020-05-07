<template>
    <el-dialog :title="title" :visible.sync="visible" width="95%" :top="marginTop" @close="$emit('close')">
        <el-form size="small" :model="confirmForm" ref="confirmForm" :rules="confirmFormRules" label-width="95px">
            <el-row>
                <el-col :span="4">
                    <el-form-item label="业务类型:" prop="businessType">
                        <dictionary-select :exclude-options="excludeBusinessArr" :disabled="businessTypeDisabled" v-model="confirmForm.businessType" option-name="LINE_BUSINESS_TYPE" @change="businessTypeChange" style="display:block"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="预计发车:" prop="expectDepartureTime">
                        <el-date-picker v-model="confirmForm.expectDepartureTime" :default-time="defaultTime"
                                        value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"
                                        style="display:block; width:100%;" :picker-options="pickerOptions"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="业务员:"  prop="salesman" :rules="[{required: salesmanRequired, message: '请选择业务员', trigger: 'blur'}]">
                        <multiple-user-select v-model="confirmForm.salesman" style="display:block;"></multiple-user-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="请车员:"  prop="carInviter">
                        <all-user-select style="display:block;" placeholder="请输入请车员"  v-model="confirmForm.carInviter" @change-option="changeCarInviter" ref="carInviterUser"></all-user-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户订单:">
                        <el-input placeholder="请输入客户订单"  v-model="confirmForm.customerOrderCode" :disabled="from!=='dispatch'"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">车辆信息</span>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="车牌号码:" prop="vehicleCode">
                        <vehicle-select ref="vehicle" v-model="confirmForm.vehicleCode"
                                        :type="['VAN','TRACTOR']" :is-allow="true"
                                        @change-option="queryVehicleInfo" style="display:block;"></vehicle-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="挂厢号码:" prop="trailerCode" :rules="[{required: trailerCodeRequired, message: '请选择挂厢', trigger: 'blur'}]">
                        <vehicle-select ref="trailer" v-model="confirmForm.trailerCode" placeholder="请输入挂厢号"
                                        :type="['TRAILER']" :disabled="trailerCodeDisabled" :is-allow="true"
                                        @change-option="queryTrailerVehicleInfo" style="display:block;"></vehicle-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="厢型:" prop="vanType">
                        <dictionary-select :disabled="vanTypeSpecificationDisabled"
                                           v-model="confirmForm.vanType" style="display:block;"
                                           option-name="VEHICLE_COMPARTMENT_TYPE"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="车型:" prop="specification">
                        <dictionary-select :disabled="vanTypeSpecificationDisabled"
                                           style="display:block;" v-model="confirmForm.specification"
                                           option-name="VEHICLE_SPECIFICATION" @change="confirmForm.receiveAmount=''"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="承载方数:" prop="loadSquare" :rules="[{required: outInvite, message: '请输入承载方数', trigger: 'blur'},Validate.volume]">
                        <el-input :disabled="loadSquareDisabled" placeholder="请输入承载方数" v-model="confirmForm.loadSquare"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="车辆性质:" prop="vehicleNature">
                        <dictionary-select disabled style="display:block;" v-model="confirmForm.vehicleNature" option-name="VEHICLE_OPERATION_MODE"></dictionary-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="司机姓名:" prop="driverId">
                        <driver-select ref="driver" v-model="confirmForm.driverId" @driver="getDriverInfo" :is-allow="true" style="display: block"></driver-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="司机电话:" prop="driverPhone">
                        <el-input placeholder="请输入司机电话" v-model="confirmForm.driverPhone" :disabled="!!currentDriverObj && !!currentDriverObj.mobile"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4" v-show="!outInvite">
                    <el-form-item label="副司机姓名:">
                        <driver-select ref="spareDriver" v-model="confirmForm.spareDriverId" @driver="getSpareDriverInfo" :is-allow="true" style="display: block"></driver-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4" v-show="!outInvite">
                    <el-form-item label="副司机电话:" prop="spareDriverPhone">
                        <el-input placeholder="请输入司机电话" v-model="confirmForm.spareDriverPhone" :disabled="!!currentSpareDriverObj && !!currentSpareDriverObj.mobile"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4" v-show="!selfSupport">
                    <el-form-item label="供应商:" prop="supplierCode" :rules="[{required: outInvite, message: '请选择供应商', trigger: 'blur'}]">
                        <supplier-select ref="supplier" placeholder="请输入供应商名称或手机号码" types="CAR_TEAM,DEPARTMENT_OF_INFORMATION" is-exist="INVOICE" @supplier="getSupplierInfo"
                                         :disabled="outSource" v-model="confirmForm.supplierCode" :is-exist="'INVOICE'"  style="display: block"></supplier-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4" v-show="jdOrderFlag">
                    <el-form-item label="京东车型:" prop="actualVehicleType" :rules="[{required: jdOrderFlag, message: '请选择京东车型', trigger: 'blur'}]">
                        <jd-vehicle-type-select v-model="confirmForm.actualVehicleType" style="display: block;"></jd-vehicle-type-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="outInvite && !!confirmForm.supplierCode">
                    <span style="color: red; line-height: 30px;"> &nbsp;&nbsp;&nbsp;&nbsp;提醒：车辆性质为外请，请确保当前供应商可开具发票！</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8"><span class="blue">应收信息</span></el-col>
                <el-col :span="4"><span class="blue">应付信息</span></el-col>
                <el-col :span="8" v-if="paidUnitPrice > 0">{{`${paidUnitPrice} ${priceUnit(confirmForm.paidPriceType)}`}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="计价方式:" prop="receivePriceType" :rules="[{required: true, message: '请选择应收计价方式', trigger: 'blur'}]">
                        <dictionary-select :exclude-options="['ALL_DAY']" v-model="confirmForm.receivePriceType" :clearable="false" option-name="LINE_PRICE_TYPE"
                                           style="display: block"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4" :class="{'hidden': receiveUnitPrice>0 }">
                    <el-form-item label="应收金额:" prop="receiveAmount" :rules="[{required: normalReceiveType, message: '请输入应收金额', trigger: 'blur'}, Validate.money]">
                        <el-input :value="receiveAmount" @input="val=>confirmForm.receiveAmount=val" placeholder=" 元" :disabled="!normalReceiveType || receiveUnitPrice>0"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="计价方式:" prop="paidPriceType" :rules="[{required: true, message: '请选择应付计价方式', trigger: 'blur'}]">
                        <dictionary-select v-model="confirmForm.paidPriceType" option-name="LINE_PRICE_TYPE" :clearable="false"
                                          style="display: block"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="应付车价:" prop="paidVehicleAmount" :rules="[{required: normalPayType, message: '请输入应付金额', trigger: 'blur'}, Validate.money]">
                        <el-input :value="paidVehicleAmount" @input="val=>confirmForm.paidVehicleAmount=val" placeholder=" 元" :disabled="!normalPayType || paidUnitPrice>0"></el-input>
                    </el-form-item>
                </el-col>
                <!--显示利润率-->
                <el-col :span="4" v-if="paidVehicleAmount > 0 && confirmForm.receiveAmount > 0">
                    <span style="font-weight: bold; padding-left: 20px;" v-if="profitRate>=0.07">{{`（利润率 ${(profitRate*100).toFixed(2)} %）`}}</span>
                    <span style="color: red;font-weight: bold; padding-left: 20px;" v-else>{{`（利润率 ${(profitRate*100).toFixed(2)} %）`}}</span>
                </el-col>
            </el-row>
            <!--合作车且有预付款标识或者外请车时显示应付明细-->
            <el-row v-if="prepaidFlag ||outInvite">
                <el-col :span="4">
                    <span class="blue">应付明细</span>
                </el-col>
            </el-row>
            <!--合作车且有预付款标识显示预付打卡-->
            <el-row v-if="prepaidFlag">
                <el-col :span="4">
                    <el-form-item label="预付打卡:" prop="prepaidCardAmount">
                        <el-input v-model="confirmForm.prepaidCardAmount" placeholder=" 元" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!--外请车显示gps及回单-->
            <el-row v-if="outInvite">
                <el-col :span="4">
                    <el-form-item label="使用GPS:">
                        <el-switch v-model="confirmForm.useGps" active-color="#13ce66" inactive-color="#ff4949"
                                   active-text="是" inactive-text="否" @change="confirmForm.gpsCode = ''"></el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="GPS号码:">
                        <gps-select v-model="confirmForm.gpsCode"  style="display:block;" @gpsObj="getGpsInfo" :disabled="!confirmForm.useGps"></gps-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="GPS费用:">
                        <el-input :value="gpsFee" placeholder=" 元" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="回单押金:" prop="returnDeposit">
                        <el-input :value="returnDeposit" @input="val => confirmForm.returnDeposit = val"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="火灾险服务费:">
                        {{insuranceFee}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="回单付款:">
                        {{returnAmount}} 元
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="outInvite">
                <el-col :span="4">
                    <el-form-item label="收款人:">
                        {{bankInfo.payee}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="收款银行:">
                        {{bankInfo.dueBank}}
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="银行卡号:">
                        {{bankInfo.bankCardNo}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="备注信息：">
                        <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="confirmForm.remark"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" style="text-align: center">
                    <el-button size="small" @click="$emit('close')" style="margin:20px 40px;"> 取&nbsp;&nbsp;&nbsp;&nbsp; 消 </el-button>
                    <el-button v-loading="submitBtnLoading" type="primary" @click="submit" size="small"> 确&nbsp;&nbsp;&nbsp;&nbsp; 定 </el-button>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
</template>

<script>
    import {Http, Api, Validate, Common} from 'src/global'

    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            currentRow:{
                type: Object,
                default(){
                    return {}
                }
            },
            currentLine: {
                type: Object,
                default(){
                    return {}
                }
            },
            from: String
        },
        data() {
            return {
                orgTitle:'',
                visible: this.dialogVisible,//窗口显示/隐藏
                jdOrderFlag: false,
                title: '',
                Validate: Validate,//校验
                Common: Common,//公共方法
                confirmForm: {
                    code: '',//派车单号
                    belongOrgCode: '',//所属区域
                    lineCode: '',//线路编码
                    businessType: "",//业务类型
                    expectDepartureTime: '',//预计发车时间
                    salesman: [],//业务员
                    carInviter: '',//请车员
                    customerOrderCode: '',//客户订单号
                    vehicleCode: "",//车牌号
                    vehicleLicenseNum: "",
                    trailerCode: "",//挂厢号
                    trailerLicenseNum: "",
                    vanType: "",//厢型
                    actualVehicleType:"",//京东实际车型
                    specification: "",//车长
                    loadSquare: '',//承载方数
                    vehicleNature: "",//车辆属性
                    selfOperationMode: '',//自营车运营性质
                    driverId: "",//司机姓名
                    driverName: "",
                    driverPhone: "",//司机电话
                    spareDriverName: "",//副司机
                    spareDriverId: "",
                    spareDriverPhone: "",//副司机电话
                    supplierCode: "",//供应商
                    receivePriceType: '',//应收信息
                    receiveUnitPrice: "",
                    receiveAmount: "",
                    paidPriceType:  '',//应付信息
                    paidUnitPrice: "",
                    paidVehicleAmount: "",
                    prepaidCardAmount: "",//预付打卡
                    useGps: false,
                    gpsCode: "",
                    gpsFee: "",//gps使用费
                    returnDeposit: "",//回单押金
                    returnAmount: "",//回单付款
                    insuranceFee: "",
                    remark: "",//备注
                },
                confirmFormRules: {
                    businessType: [{required: true, message: '请选择业务类型', trigger: 'blur'}],
                    expectDepartureTime: [{required: true, message: '请选择预计发车时间', trigger: 'blur'}],
                    carInviter: [{required: true, message: '请选择请车员', trigger: 'blur'}],
                    vehicleCode: [{required: true, message: '请选择车辆', trigger: 'blur'}],
                    vanType: [{required: true, message: '请选择厢型', trigger: 'blur'}],
                    specification: [{required: true, message: '请选择车型', trigger: 'blur'}],
                    vehicleNature: [{required: true, message: '请选择车辆属性', trigger: 'blur'}],
                    driverId: [{required: true, message: '请选择/输入司机', trigger: 'blur'}],
                    driverPhone: [{required: true, message: '请输入司机手机号', trigger: 'blur'}, Validate.phone],
                    spareDriverPhone: [Validate.phone],
                    returnDeposit: [Validate.money,Validate.threeNum],
                    prepaidCardAmount: [Validate.money],
                },
                submitBtnLoading: false,//确定按钮loading
                repayInfoObj: null,//合同线路应收应付对象
                currentVehicleObj: null,//当前车辆对象
                currentTrailerObj: null,//当前挂厢对象
                currentDriverObj: null,//当前司机对象
                currentSpareDriverObj: null,//当前副司机对象
                currentSupplierObj: null,//当前供应商对象

                defaultTime: '',//默认预计发车时间的时间部分
                pickerOptions: {},
            }
        },
        mounted() {
            this.confirmForm = Object.assign({}, this.confirmForm, _.pick(this.currentRow, _.keys(this.confirmForm)))
            //初始化业务员
            if (this.confirmForm.salesman && this.confirmForm.salesman.length>0) {
                this.confirmForm.salesman = this.confirmForm.salesman.split(',');
            }else {
                this.confirmForm.salesman = [];
            }
            this.$nextTick(() => {
                //回显请车员
                if (this.confirmForm.carInviter) {
                    let carInviterList = this.confirmForm.carInviter.split(' ');
                    if (carInviterList.length > 1) {
                        let carInviterUser = {'name': carInviterList[0], 'username': carInviterList[1]};
                        this.$refs.carInviterUser.setCurrentAuditApprovers(carInviterUser);
                    }
                }
            })
            if(this.from === "JD"){
                this.jdOrderFlag = true
            }
            if(this.currentLine && this.currentLine.code){
                this.hideLineSelect(this.currentLine);
            }
            if(this.currentRow && this.currentRow.code && this.currentRow.lineCode){
                this.title = `派车确认：【${this.currentRow.belongOrg.name}】 【${this.currentRow.customer.name}】 【${this.currentRow.dispatchLine.lineName}】 【出发站点：${this.currentRow.dispatchLine.startStation.name}】`
                this.initPageAndData(this.currentRow.code, this.currentRow.lineCode, this.currentRow.customerOrderCode)
            }
        },
        computed: {
            marginTop(){ //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "15vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "8vh";
                }
            },
            //业务类型是否禁用
            businessTypeDisabled(){
                return this.confirmForm.businessType === 'NEW_BUSINESS_TYPE';
            },
            //业务类型中的新业务类型是否禁用
            excludeBusinessArr(){
                if(this.businessTypeDisabled){
                    return [];
                }else{
                    return ['NEW_BUSINESS_TYPE']
                }
            },
            //业务员必填
            salesmanRequired(){
                return this.confirmForm.businessType === 'SCATTERED_BUSINESS_TYPE'
            },
            //挂厢号必填
            trailerCodeRequired(){
                return !_.isNil(this.currentVehicleObj) && this.currentVehicleObj.type === 'TRACTOR'
            },
            //挂厢号禁用
            trailerCodeDisabled(){
                return !_.isNil(this.currentVehicleObj) && this.currentVehicleObj.type !== 'TRACTOR'
            },
            //厢型车型禁用
            vanTypeSpecificationDisabled(){
                return (!_.isNil(this.currentVehicleObj) && !!this.currentVehicleObj.vanType) || (!_.isNil(this.currentTrailerObj) && !!this.currentTrailerObj.vanType)
            },
            //承载方数禁用
            loadSquareDisabled(){
                return (!_.isNil(this.currentVehicleObj) && this.currentVehicleObj.loadSquare>0) || (!_.isNil(this.currentTrailerObj) && this.currentTrailerObj.loadSquare>0)
            },
            //车辆属性-自营车
            selfSupport(){
                return this.confirmForm.vehicleNature === 'SELF_SUPPORT'
            },
            //车辆属性-合作车
            outSource(){
                return this.confirmForm.vehicleNature === 'OUTSOURCE'
            },
            //车辆属性-外请车
            outInvite(){
                return this.confirmForm.vehicleNature === 'OUT_INVITE'
            },
            //应收按趟
            normalReceiveType(){
                return this.confirmForm.receivePriceType === 'NORMAL';
            },
            //应收单价-----------------
            receiveUnitPrice() {
                if(_.isNil(this.repayInfoObj) || _.isNil(this.repayInfoObj.lineContract)){
                    return this.confirmForm.receiveUnitPrice = ''
                }
                if(!this.normalReceiveType){//不按趟
                    if(this.confirmForm.receivePriceType === this.repayInfoObj.lineContract.priceType){
                        return this.confirmForm.receiveUnitPrice = this.repayInfoObj.lineContract.unitPrice;
                    }
                    return this.confirmForm.receiveUnitPrice = ''
                }
                let vehicleSizeList = this.repayInfoObj.lineContract.vehicleSizeList;
                if(!this.confirmForm.specification || !vehicleSizeList || !vehicleSizeList.length) {
                    return this.confirmForm.receiveUnitPrice = '';
                }
                for (let i = 0; i < vehicleSizeList.length; i++) {
                    if (vehicleSizeList[i].vehicleSize == this.confirmForm.specification) {
                        return this.confirmForm.receiveUnitPrice = vehicleSizeList[i].unitPrice;
                    }
                }
                if(this.confirmForm.specification == 12.5 || this.confirmForm.specification == 13.5){//12米5和13米5的车价格通用
                    for (let i = 0; i < vehicleSizeList.length; i++) {
                        if (vehicleSizeList[i].vehicleSize == 12.5 || vehicleSizeList[i].vehicleSize == 13.5) {
                            return this.confirmForm.receiveUnitPrice = vehicleSizeList[i].unitPrice;
                        }
                    }
                }
                if(this.confirmForm.specification == 16.5 || this.confirmForm.specification == 17.5){//16米5和17米5的车价格通用
                    for (let i = 0; i < vehicleSizeList.length; i++) {
                        if (vehicleSizeList[i].vehicleSize == 16.5 || vehicleSizeList[i].vehicleSize == 17.5) {
                            return this.confirmForm.receiveUnitPrice = vehicleSizeList[i].unitPrice;
                        }
                    }
                }
            },
            //应收价格
            receiveAmount:{
                get(){
                    if(!this.normalReceiveType){
                        return this.confirmForm.receiveAmount = 0;
                    }
                    if(this.receiveUnitPrice>0){
                        return this.confirmForm.receiveAmount = this.receiveUnitPrice;
                    }
                    return this.confirmForm.receiveAmount = this.confirmForm.receiveAmount;
                },
                set(val){
                    this.$emit('input',val)
                }
            },
            //获取应付单价------------
            paidUnitPrice() {
                if(this.selfSupport){//自营车
                    return this.confirmForm.paidUnitPrice = '';
                }
                if(this.outSource){//合作车
                    if(!this.confirmForm.vehicleCode){
                        return this.confirmForm.paidUnitPrice = '';
                    }
                    if(!this.normalPayType){
                        return this.confirmForm.paidUnitPrice = '';
                    }
                    if(this.repayInfoObj && this.repayInfoObj.lineOutsourceList && this.repayInfoObj.lineOutsourceList.length>0){
                        for (let i = 0; i < this.repayInfoObj.lineOutsourceList.length; i++) {
                            if (this.repayInfoObj.lineOutsourceList[i].vehicle === this.confirmForm.vehicleCode) {
                                return this.confirmForm.paidUnitPrice = this.repayInfoObj.lineOutsourceList[i].outsourcePrice;
                            }
                        }
                    }
                }
                if(this.outInvite){//外请车
                    if(!this.confirmForm.supplierCode){
                        return this.confirmForm.paidUnitPrice = '';
                    }
                    if(this.repayInfoObj && this.repayInfoObj.lineOutInviteList && this.repayInfoObj.lineOutInviteList.length>0){
                        for (let i = 0; i < this.repayInfoObj.lineOutInviteList.length; i++) {
                            if (this.repayInfoObj.lineOutInviteList[i].supplier == this.confirmForm.supplierCode && this.repayInfoObj.lineOutInviteList[i].priceType === this.confirmForm.paidPriceType) {
                                if(this.normalPayType){//按趟校验车长是否一致
                                    if(this.repayInfoObj.lineOutInviteList[i].vehicleSize === this.confirmForm.specification){
                                        return this.confirmForm.paidUnitPrice = this.repayInfoObj.lineOutInviteList[i].priceUnit;
                                    }
                                }else{
                                    return this.confirmForm.paidUnitPrice = this.repayInfoObj.lineOutInviteList[i].priceUnit;
                                }
                            }
                        }
                        if(this.confirmForm.specification == 12.5 || this.confirmForm.specification == 13.5){//12米5和13米5的车价格通用
                            for (let i = 0; i < this.repayInfoObj.lineOutInviteList.length; i++) {
                                if (this.repayInfoObj.lineOutInviteList[i].supplier == this.confirmForm.supplierCode && this.repayInfoObj.lineOutInviteList[i].priceType === this.confirmForm.paidPriceType) {
                                    if(this.normalPayType){//按趟校验车长是否付合要求
                                        if(this.repayInfoObj.lineOutInviteList[i].vehicleSize == 12.5 || this.repayInfoObj.lineOutInviteList[i].vehicleSize == 13.5){
                                            return this.confirmForm.paidUnitPrice = this.repayInfoObj.lineOutInviteList[i].priceUnit;
                                        }
                                    }
                                }
                            }
                        }
                        if(this.confirmForm.specification == 16.5 || this.confirmForm.specification == 17.5){//16米5和17米5的车价格通用
                            for (let i = 0; i < this.repayInfoObj.lineOutInviteList.length; i++) {
                                if (this.repayInfoObj.lineOutInviteList[i].supplier == this.confirmForm.supplierCode && this.repayInfoObj.lineOutInviteList[i].priceType === this.confirmForm.paidPriceType) {
                                    if(this.normalPayType){//按趟校验车长是否付合要求
                                        if(this.repayInfoObj.lineOutInviteList[i].vehicleSize == 16.5 || this.repayInfoObj.lineOutInviteList[i].vehicleSize == 17.5){
                                            return this.confirmForm.paidUnitPrice = this.repayInfoObj.lineOutInviteList[i].priceUnit;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return this.confirmForm.paidUnitPrice = '';
            },
            //应付车价
            paidVehicleAmount:{
                get(){
                    if(!this.normalPayType){
                        return this.confirmForm.paidVehicleAmount = 0;
                    }
                    if(this.paidUnitPrice>0){
                        return this.confirmForm.paidVehicleAmount = this.paidUnitPrice;
                    }
                    return this.confirmForm.paidVehicleAmount = this.confirmForm.paidVehicleAmount;
                },
                set(val){
                    this.$emit('input',val)
                }
            },
            //单价单位
            priceUnit() {
                return function(priceType){
                    if (priceType === 'NORMAL') {
                        return "元 /趟";
                    } else if (priceType === 'WEIGHT') {
                        return "元 /公斤";
                    } else if(priceType === 'VOLUME'){
                        return "元 /方";
                    }
                }
            },
            //应付按趟
            normalPayType(){
                return this.confirmForm.paidPriceType === 'NORMAL'
            },
            //预付打卡标识
            prepaidFlag(){
                return this.outSource && !_.isNil(this.currentVehicleObj) && this.currentVehicleObj.prepaidFlag
            },
            //gps使用费
            gpsFee(){
                return  this.confirmForm.gpsFee = !this.confirmForm.useGps ? '' : 15;
            },
            //回单押金
            returnDeposit:{
                get(){
                    return this.confirmForm.returnDeposit = !this.outInvite? '' : (this.confirmForm.returnDeposit || 100)
                },
                set(val){
                    this.$emit('input',val)
                }
            },
            //回单金额
            returnAmount(){
                let amount = '';
                if(!this.outInvite){
                    return this.confirmForm.returnAmount = amount;
                }
                if(this.paidVehicleAmount >= 0 && this.paidVehicleAmount !== ''){
                    amount = (this.Num(this.paidVehicleAmount) - this.Num(this.gpsFee) - this.Num(this.confirmForm.returnDeposit) - this.Num(this.confirmForm.insuranceFee)).toFixed(2);
                }
                return this.confirmForm.returnAmount = amount;
            },
            //计算利润率
            profitRate(){
                if(!(this.confirmForm.receiveAmount>0) || !(this.paidVehicleAmount>0)){
                    return ''
                }
                if(this.confirmForm.receiveAmount === this.paidVehicleAmount){
                    return 0;
                }
                return ((this.confirmForm.receiveAmount - this.paidVehicleAmount)/this.confirmForm.receiveAmount);
            },
            //确定收款账户信息
            bankInfo(){
                return this.confirmForm.supplierCode?{
                    payee: !_.isNil(this.currentSupplierObj)?this.currentSupplierObj.payee:'',
                    dueBank: !_.isNil(this.currentSupplierObj)?this.currentSupplierObj.dueBank:'',
                    bankCardNo: !_.isNil(this.currentSupplierObj)?this.currentSupplierObj.dueBankCardNo:''
                }:{
                    payee: !_.isNil(this.currentDriverObj)?this.currentDriverObj.payee:'',
                    dueBank: !_.isNil(this.currentDriverObj)?this.currentDriverObj.openingBank:'',
                    bankCardNo: !_.isNil(this.currentDriverObj)?this.currentDriverObj.dueBankCardNo:''
                }
            },
            //回单应付最大占比
            tailPaymentRatio(){
                return !this.confirmForm.supplierCode ||!this.currentSupplierObj || !this.currentSupplierObj.tailPaymentRatio?0.1:this.currentSupplierObj.tailPaymentRatio
            },
            //火灾险服务费
            insuranceFee(){
                if(!this.outInvite){
                    return this.confirmForm.insuranceFee = ''
                }
                if(!this.confirmForm.specification){
                    return this.confirmForm.insuranceFee = ''
                }
                if(this.currentSupplierObj && this.currentSupplierObj.insuranceFlag===false){
                    return this.confirmForm.insuranceFee = ''
                }
                if(this.confirmForm.specification<=9.6){
                    return this.confirmForm.insuranceFee = 20;
                }else if(this.confirmForm.specification>9.6 && this.confirmForm.specification<=13.5 ){
                    return this.confirmForm.insuranceFee = 30;
                }else if(this.confirmForm.specification>13.5){
                    return this.confirmForm.insuranceFee = 35;
                }
            }
        },
        methods: {
            //线路选择
            hideLineSelect(val){
                if(!_.isNil(val)){
                    this.confirmForm.lineCode = val.id;
                    this.defaultTime = val.departTime+':00';
                    let vm = this;
                    this.pickerOptions = {
                        shortcuts: [{
                            text: '今天',
                            onClick(picker) {
                                picker.$emit('pick', new Date(Common.date.dateFtt("yyyy-MM-dd "+vm.defaultTime,new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),0,0,0))));
                            }
                        }, {
                            text: '明天',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(new Date(Common.date.dateFtt("yyyy-MM-dd "+vm.defaultTime,new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),0,0,0))).getTime() + 3600 * 1000 * 24);
                                picker.$emit('pick', date);
                            }
                        }, {
                            text: '后天',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(new Date(Common.date.dateFtt("yyyy-MM-dd "+vm.defaultTime,new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),0,0,0))).getTime() + 3600 * 1000 * 48);
                                picker.$emit('pick', date);
                            }
                        }]
                    }
                    //获取合同线路应收付信息
                    Http.get(Api.line.queryDetailById, {params: {'id': val.id}}, result => {
                        this.repayInfoObj = result.result;
                        this.orgTitle=result.result.belongOrgCode;
                        console.log(result.result.belongOrgCode)
                        Http.get(Api.org.queryByCityCode, {params: {'cityCode': val.departStation.areaCode?val.departStation.areaCode:val.departStation.cityCode}}, result => {
                            //所属区域
                            this.confirmForm.belongOrgCode = result.result.code;
                            this.title = `指派车辆 ： 【${result.result.name}】【${val.customer.name}】 【${val.name}】 【出发站点：${val.departStation.name}】`
                            //设置业务类型
                            if(!this.repayInfoObj.businessType){
                                if(!!this.repayInfoObj.customer && !!this.repayInfoObj.customer.top && this.repayInfoObj.customer.top.newBusinessCustomer === '1'){
                                    this.confirmForm.businessType = 'NEW_BUSINESS_TYPE';//新业务
                                }else{
                                    this.confirmForm.businessType = "FIXATION_BUSINESS_TYPE";//传统业务
                                }
                            }else{
                                this.confirmForm.businessType = this.repayInfoObj.businessType;//线路规定的业务类型
                            }
                            //设置请车员
                            if(this.confirmForm.businessType !== 'SCATTERED_BUSINESS_TYPE'){//非零散业务
                                this.confirmForm.carInviter = `${this.$store.getters.user.name} ${this.$store.getters.user.username}`;
                            }else{
                                this.confirmForm.carInviter = '';
                            }
                            //设置默认业务员
                            if(!_.isNil(this.repayInfoObj) &&this.repayInfoObj.salesmanList && this.repayInfoObj.salesmanList.length>0){
                                this.confirmForm.salesman = this.repayInfoObj.salesmanList.split(',');
                            }
                            //应收计价方式
                            if(!this.confirmForm.receivePriceType && !_.isNil(this.repayInfoObj) && this.repayInfoObj.lineContract && this.repayInfoObj.lineContract.priceType){
                                this.confirmForm.receivePriceType = this.repayInfoObj.lineContract.priceType
                            }
                        })
                    })
                }
            },
            //初始化页面/数据
            initPageAndData(code, lineCode, customerOrderCode){
                if(customerOrderCode){
                    //校验是否为京东订单
                    Http.get(Api.jdOrder.queryByOrderCode, {params: {'jdOrderCode': customerOrderCode}}, result => {
                        if (result.result.transJobCode){
                            this.jdOrderFlag = true;
                        }
                    })
                }
                //获取合同线路应收付信息
                Http.get(Api.line.queryDetailById, {params: {'id': lineCode}}, result => {
                    this.defaultTime = result.result.departTime+':00';
                    let vm = this;
                    this.pickerOptions = {
                        shortcuts: [{
                            text: '今天',
                            onClick(picker) {
                                picker.$emit('pick', new Date(Common.date.dateFtt("yyyy-MM-dd "+vm.defaultTime,new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),0,0,0))));
                            }
                        }, {
                            text: '明天',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(new Date(Common.date.dateFtt("yyyy-MM-dd "+vm.defaultTime,new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),0,0,0))).getTime() + 3600 * 1000 * 24);
                                picker.$emit('pick', date);
                            }
                        }, {
                            text: '后天',
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(new Date(Common.date.dateFtt("yyyy-MM-dd "+vm.defaultTime,new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),0,0,0))).getTime() + 3600 * 1000 * 48);
                                picker.$emit('pick', date);
                            }
                        }]
                    }
                    this.repayInfoObj = result.result;
                    Http.get(Api.dispatch.queryByCode, {params: {'code': code}}, result => {
                        this.confirmForm = Object.assign({}, this.confirmForm, _.pick(result.result, _.keys(this.confirmForm)))
                        this.confirmForm = Object.assign({}, this.confirmForm, _.pick(result.result.dispatchVehicle, _.keys(this.confirmForm)))
                        this.confirmForm = Object.assign({}, this.confirmForm, _.pick(result.result.dispatchPrice, _.keys(this.confirmForm)))
                        //业务员
                        if(this.confirmForm.salesman && this.confirmForm.salesman.length>0){
                            this.confirmForm.salesman = this.confirmForm.salesman.split(',');
                        }else{
                            this.confirmForm.salesman = []
                        }
                        //预计发车时间
                        if(result.result.confirmStatus !== 'CONFIRM'){
                            this.confirmForm.expectDepartureTime = '';
                        }
                        //当前车辆对象
                        this.currentVehicleObj = result.result.dispatchVehicle?result.result.dispatchVehicle.vehicle:null;
                        //当前挂厢对象
                        this.currentTrailerObj = result.result.dispatchVehicle?result.result.dispatchVehicle.trailer:null;
                        if(!_.isNil(this.currentTrailerObj)){
                            this.confirmForm.loadSquare = this.currentTrailerObj.loadSquare;
                        }else{
                            if(!_.isNil(this.currentVehicleObj)){
                                this.confirmForm.loadSquare = this.currentVehicleObj.loadSquare;
                            }
                        }
                        //当前司机对象
                        this.currentDriverObj = result.result.dispatchVehicle?result.result.dispatchVehicle.driver:null;
                        //当前副司机对象
                        this.currentSpareDriverObj = result.result.dispatchVehicle?result.result.dispatchVehicle.spareDriver:null;
                        //当前供应商对象
                        this.currentSupplierObj = result.result.dispatchVehicle?result.result.dispatchVehicle.supplier:null;
                        this.$nextTick(()=>{
                            //将当前车辆对象以及应收应付信息里面的相关合作车辆放入车辆选择框
                            let vehicleSelectList = [this.currentVehicleObj];
                            if(this.repayInfoObj && this.repayInfoObj.lineOutsourceList && this.repayInfoObj.lineOutsourceList.length>0){
                                this.repayInfoObj.lineOutsourceList.forEach((item)=>{
                                    if(!!item.vehicleInfo){
                                        vehicleSelectList.push(item.vehicleInfo)
                                    }
                                })
                            }
                            this.$refs.vehicle.setCurrentVehicle(vehicleSelectList);
                            this.$refs.trailer.setCurrentVehicle(this.currentTrailerObj);//挂厢
                            this.$refs.driver.setCurrentDriver(this.currentDriverObj);//司机
                            if(this.selfSupport || this.outSource){//自营车合作车
                                this.$refs.spareDriver.setCurrentDriver(this.currentSpareDriverObj || {});//副司机
                            }
                            if(this.outInvite || this.outSource){
                                this.$refs.supplier.setCurrentSupplier(this.currentSupplierObj || {});//供应商
                            }
                        })
                        //设置默认请车员
                        if (!this.confirmForm.carInviter) {
                            if(this.confirmForm.businessType !== 'SCATTERED_BUSINESS_TYPE'){//非零散业务
                                this.confirmForm.carInviter = `${this.$store.getters.user.name} ${this.$store.getters.user.username}`;
                            }else{
                                this.confirmForm.carInviter = '';
                            }
                        }
                        //设置默认业务员
                        if(!(this.confirmForm.salesman.length>0) && !_.isNil(this.repayInfoObj) && this.repayInfoObj.salesmanList && this.repayInfoObj.salesmanList.length>0){
                            this.confirmForm.salesman = this.repayInfoObj.salesmanList.split(',');
                        }
                        //应收计价方式
                        if(!this.confirmForm.receivePriceType && !_.isNil(this.repayInfoObj) && this.repayInfoObj.lineContract && this.repayInfoObj.lineContract.priceType){
                            this.confirmForm.receivePriceType = this.repayInfoObj.lineContract.priceType
                        }
                    })
                })
            },
            //选择业务类型
            businessTypeChange(val){
                if(val === 'SCATTERED_BUSINESS_TYPE'){
                    this.confirmForm.salesman = [];
                    this.confirmForm.carInviter = '';
                }
            },
            //选择请车员
            changeCarInviter(obj){
                if(!_.isNil(obj)){
                    this.confirmForm.carInviter = `${obj.name} ${obj.username}`;
                }else{
                    this.confirmForm.carInviter = '';
                }
            },
            //选择车辆
            queryVehicleInfo(obj) {
                let vehicleCode = this.confirmForm.vehicleCode;
                this.resetVehicleInfo();
                if(!vehicleCode){//清空了车牌号
                    return
                }
                if(!_.isNil(obj)){//选择已有车牌号
                    //根据车牌号查询车辆信息以及常用司机，供应商信息
                    Http.get(Api.vehicle.queryByCode, {params: {'code': obj.code}}, result => {
                        if (result.result.blacklist === true) {
                            return this.$message('此车辆已被列入系统黑名单,不能选择!');
                        }
                        if (result.result.status === 'FORBIDDEN') {
                            return this.$message('此车辆已被禁用,不能选择!');
                        }
                        if (result.result.operationStatus === 'DISCARDED') {
                            return this.$message('此车辆已报废,不能选择!');
                        }
                        if (result.result.operationStatus === 'SEALED') {
                            return this.$message('此车辆已封存,不能选择!');
                        }
                        this.currentVehicleObj = result.result;//当前选中的车辆
                        this.confirmForm.vehicleCode = obj.code;//车牌号
                        this.confirmForm.vehicleLicenseNum = obj.licenseNumber;
                        if(result.result.type === 'TRACTOR'){//车头
                            if(result.result.vehicleList && result.result.vehicleList.length>0){
                                //设置常用挂厢list
                                this.$refs.trailer.setCurrentVehicle(result.result.vehicleList);
                                this.confirmForm.trailerCode = result.result.vehicleList[0].code;//设置挂厢
                                this.confirmForm.trailerLicenseNum = result.result.vehicleList[0].licenseNumber;
                                //根据挂厢号查询挂厢信息
                                Http.get(Api.vehicle.queryByCode, {params: {'code': result.result.vehicleList[0].code}}, result => {
                                    this.currentTrailerObj = result.result;//当前选中的挂厢
                                    this.confirmForm.vanType = result.result.vanType;//厢型
                                    this.confirmForm.specification = result.result.specification;//车型
                                    this.confirmForm.loadSquare = result.result.loadSquare;//承载方数
                                })
                            }
                        }else{//非车头，无挂厢
                            this.confirmForm.vanType = result.result.vanType;//厢型
                            this.confirmForm.specification = result.result.specification;//车型
                            this.confirmForm.loadSquare = result.result.loadSquare;//承载方数
                        }
                        this.confirmForm.vehicleNature = result.result.operationMode;//车辆性质
                        if(result.result.operationMode === 'OUT_INVITE'){//外请车
                            //。。。
                        }
                        this.confirmForm.selfOperationMode = result.result.selfOperationMode;//自营性质
                        //关联常用司机
                        if (result.result.driverList && result.result.driverList.length > 0) {
                            if(result.result.driverList[0].blacklist){
                                return
                            }
                            this.$refs.driver.setCurrentDriver(result.result.driverList);
                            this.confirmForm.driverId = result.result.driverList[0].id;//选择司机
                            this.confirmForm.driverName = result.result.driverList[0].name;
                            this.confirmForm.driverPhone = result.result.driverList[0].mobile;
                            this.currentDriverObj = result.result.driverList[0];//当前司机对象
                            if((this.selfSupport || this.outSource) && result.result.driverList.length > 1){//自营车合作车
                                if(result.result.driverList[1].blacklist){
                                    return
                                }
                                this.$refs.spareDriver.setCurrentDriver(result.result.driverList);//副司机
                                this.confirmForm.spareDriverId = result.result.driverList[1].id;//选择副司机
                                this.confirmForm.spareDriverName = result.result.driverList[1].name;
                                this.confirmForm.spareDriverPhone = result.result.driverList[1].mobile;
                                this.currentSpareDriverObj = result.result.driverList[1];//当前副司机对象
                            }
                        }
                    });
                }else{
                    if (!Validate.licenseNumber.pattern.test(vehicleCode)) {//验证新输入的车牌号是否符合规则
                        return this.$message("车牌号格式不正确！");
                    }
                    this.confirmForm.vehicleCode = vehicleCode;//车牌号
                    this.confirmForm.vehicleNature = 'OUT_INVITE';//车辆性质外请
                }
            },
            //重置车辆
            resetVehicleInfo() {
                this.$refs.confirmForm.clearValidate('supplierCode');
                this.currentVehicleObj = null;//当前车辆对象
                this.confirmForm.vehicleCode = '';
                this.confirmForm.vehicleLicenseNum = '';
                this.$refs.trailer.clearVehicleList();//清空常用挂厢
                this.currentTrailerObj = null;//当前挂厢对象
                this.confirmForm.trailerCode = '';
                this.confirmForm.trailerLicenseNum = '';
                this.confirmForm.vanType = '';
                this.confirmForm.specification = '';
                this.confirmForm.vehicleNature = '';
                this.confirmForm.loadSquare = '';
                this.$refs.driver.clearDriverList();//清空常用司机
                this.currentDriverObj = null;//当前司机对象
                this.confirmForm.driverId = '';
                this.confirmForm.driverName = '';
                this.confirmForm.driverPhone = '';
                this.$refs.spareDriver.clearDriverList();//清空常用副司机
                this.currentSpareDriverObj = null;//当前副司机对象
                this.confirmForm.spareDriverId = '';
                this.confirmForm.spareDriverName = '';
                this.confirmForm.spareDriverPhone = '';
                this.currentSupplierObj = null;//当前供应商对象
                this.confirmForm.supplierCode = '';
                this.confirmForm.supplierName = '';

                this.confirmForm.receivePriceType = 'NORMAL';
                this.confirmForm.receiveAmount = '';
                this.confirmForm.paidPriceType = 'NORMAL';
                this.confirmForm.paidVehicleAmount = ''

                this.confirmForm.prepaidCardAmount = '';//清空预付打卡
                this.confirmForm.useGps = false;//清空gps
                this.confirmForm.gpsCode = '';
                this.confirmForm.gpsFee = '';
                this.confirmForm.returnDeposit = '';
                this.confirmForm.returnAmount = '';
            },
            //挂厢号回调
            queryTrailerVehicleInfo(obj) {
                let trailerCode = this.confirmForm.trailerCode;
                this.currentTrailerObj = null;//当前挂厢对象
                this.confirmForm.trailerCode = '';
                this.confirmForm.trailerLicenseNum = '';
                this.confirmForm.vanType = "";//厢型
                this.confirmForm.specification = "";//车型
                this.confirmForm.loadSquare = '';//承载方数
                if(!trailerCode){//清空了挂厢号
                    return
                }
                if(!_.isNil(obj)){
                    Http.get(Api.vehicle.queryByCode, {params: {'code': obj.code}}, result => {
                        if (result.result.status === 'FORBIDDEN') {
                            return this.$message.warning('此挂厢已被禁用,不能选择!');
                        }
                        this.currentTrailerObj = obj;//当前挂厢对象
                        this.confirmForm.trailerCode = obj.code;//挂厢号
                        this.confirmForm.trailerLicenseNum = obj.licenseNumber;
                        this.confirmForm.vanType = result.result.vanType;//厢型
                        this.confirmForm.specification = result.result.specification;//车型
                        this.confirmForm.loadSquare = result.result.loadSquare;//承载方数
                    })
                }else{
                    if (!Validate.trailerLicenseNumber.pattern.test(trailerCode)) {//验证新输入的挂厢号是否符合规则
                        return this.$message.warning('挂厢号格式不正确!');
                    }
                    this.confirmForm.trailerCode = trailerCode;//挂厢号
                }
            },
            //司机姓名回调
            getDriverInfo(obj) {
                let driverId = this.confirmForm.driverId;
                this.currentDriverObj = null;
                this.confirmForm.driverId = '';
                this.confirmForm.driverName = '';
                this.confirmForm.driverPhone = '';
                if(!driverId){//清空了司机
                    return
                }
                if(!_.isNil(obj)){
                    if(obj.blacklist === true){
                        return this.$message('此司机已被列入系统黑名单,不能选择!');
                    }
                    if(_.isNil(obj.name) || obj.name === ''){
                        return this.$message.warning('该司机信息不完整，请完善司机信息！');
                    }
                    if(obj.name === obj.id){//新添加的司机
                        return this.confirmForm.driverId = obj.id;
                    }
                    this.currentDriverObj = obj;//当前选择的司机对象
                    this.confirmForm.driverId = obj.id;
                    this.confirmForm.driverName = obj.name;
                    this.confirmForm.driverPhone = obj.mobile;
                }
            },
            //副司机姓名回调
            getSpareDriverInfo(obj) {
                let spareDriverId = this.confirmForm.spareDriverId;
                this.currentSpareDriverObj = null;//当前副司机对象
                this.confirmForm.spareDriverId = '';//副司机
                this.confirmForm.spareDriverName = '';
                this.confirmForm.spareDriverPhone = '';
                if(!spareDriverId){//清空了副司机
                    return
                }
                if(!_.isNil(obj)){
                    if(obj.blacklist === true){
                        return this.$message('此司机已被列入系统黑名单,不能选择!');
                    }
                    if(_.isNil(obj.name) || obj.name === ''){
                        return this.$message.warning('该司机信息不完整，请完善司机信息！');
                    }
                    // if(obj.name === obj.id){
                    //     return this.confirmForm.spareDriverId = obj.id;
                    // }//此代码存疑，先注释掉
                    this.currentSpareDriverObj = obj;//当前副司机对象
                    this.confirmForm.spareDriverId = obj.id;//副司机
                    this.confirmForm.spareDriverName = obj.name;
                    this.confirmForm.spareDriverPhone = obj.mobile;
                }else{
                    this.confirmForm.spareDriverId = spareDriverId;
                }
            },
            //供应商回调
            getSupplierInfo(obj) {
                let supplierCode = this.confirmForm.supplierCode;
                this.currentSupplierObj = null;
                this.confirmForm.supplierCode = "";
                this.confirmForm.supplierName = "";
                if(!supplierCode){//清空了供应商
                    return
                }
                if(!this.confirmForm.belongOrgCode) {
                    return this.$message.info('未选择线路!');
                }
                if(!_.isNil(obj)){
                    if(obj.reviewType === 'NO_PASS'){
                        return this.$message.warning('此供应商审核未通过,不能选择!');
                    }
                    if (obj.blacklist === true) {
                        return this.$message.warning('此供应商已被列入系统黑名单,不能选择!');
                    }
                    if (obj.operationStatus && obj.operationStatus === 'INVALIDED') {
                        return this.$message.warning('此供应商已作废，不允许派车！');
                    }
                    if (obj.operationStatus && obj.operationStatus === 'DELAY_AUDIT') {
                        return this.$message.warning('此供应商已过期，不允许派车！');
                    }
                    if (obj.operationStatus && obj.operationStatus === 'NEW_AUDIT') {
                        return this.$message.warning('此供应商正在审核中，不允许派车！');
                    }
                    this.currentSupplierObj = obj;//当前供应商对象
                    this.confirmForm.supplierCode = obj.id;//供应商
                    this.confirmForm.supplierName = obj.name;
                }
            },
            //gps回调
            getGpsInfo(obj){
                let gpsCode = this.confirmForm.gpsCode;
                this.confirmForm.gpsCode = '';
                if(!gpsCode){//清空了gps
                    return
                }
                if(!_.isNil(obj)){
                    if(obj.cardClaimStatus === 'UN_CLAIM'){
                        return this.$message.warning('未认领的GPS，不能选择！');
                    }
                    if(obj.status === 'INVALID'){
                        return this.$message.warning('该GPS已挂失，不能选择！');
                    }
                    if(obj.waybillCode){
                        return this.$message.warning('该GPS已被使用，不能选择！');
                    }
                    if(obj.prohibit=='0'){
                        return this.$message.warning('该GPS已被禁用，不能选择！');
                    }
                    this.confirmForm.gpsCode = gpsCode;
                }
            },
            //格式化成数字
            Num(val) {
                return Common.util.numberFormat(val)
            },
            //确定提交表单
            submit() {
                let warn1 = '',warn2 = '',warn3 = '';
                this.$refs.confirmForm.validate( valid => {
                    if (valid) {
                        if(this.confirmForm.lineCode){
                            //查询是否已经派车
                            Http.post(Api.dispatch.alreadySend, this.confirmForm, result => {
                                warn1 = !result.result?'':result.result;
                                if(!this.confirmForm.trailerCode && this.confirmForm.specification > 9.6){
                                    return this.$message.warning('非挂车车型过长，请核查！')
                                }
                                let reg = new RegExp("^[\u4E00-\u9FA5A-Za-z\\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$","g");
                                if(!this.confirmForm.driverName){
                                    if(!reg.test(this.confirmForm.driverId) || this.confirmForm.driverId.length>20){
                                        return this.$message.warning('司机姓名错误，请至司机管理页面修改该司机姓名！')
                                    }
                                }else{
                                    if(!reg.test(this.confirmForm.driverName) || this.confirmForm.driverName.length>20){
                                        return this.$message.warning('司机姓名错误，请至司机管理页面修改该司机姓名！')
                                    }
                                }
                                if(!this.normalReceiveType && !this.receiveUnitPrice){//应收不按趟，必须有单价
                                    return this.$message.warning('应收计价方式为计重/按方，请先维护应收单价!');
                                }
                                if(!this.normalPayType && !this.paidUnitPrice){//应付不按趟，必须有单价
                                    return this.$message.warning('应付计价方式为计重/按方，请先维护应付单价!');
                                }
                                if(this.prepaidFlag){//有预付款
                                    if(this.Num(this.confirmForm.paidVehicleAmount) < this.Num(this.confirmForm.prepaidCardAmount)){
                                        return this.$message.warning('预付打卡金额不能大于应付金额!');
                                    }
                                }
                                if(this.outInvite && this.normalPayType){
                                    if(this.Num(this.confirmForm.returnAmount) + this.Num(this.confirmForm.returnDeposit) < this.Num(this.confirmForm.paidVehicleAmount)*this.tailPaymentRatio){
                                        return this.$message.warning(`回单付款金额与回单押金之和不能小于应付金额的${this.tailPaymentRatio*100}%！`);
                                    }
                                }
                                if(this.normalPayType && this.normalReceiveType){//有应收应付价格
                                    warn2 = this.Num(this.confirmForm.paidVehicleAmount) > this.Num(this.confirmForm.receiveAmount) ? "应付金额大于应收金额! " : "";
                                    warn3 = (this.Num(this.confirmForm.receiveAmount) - this.Num(this.confirmForm.paidVehicleAmount))/this.Num(this.confirmForm.receiveAmount) > 0.25 ? "收益率大于25%! " : "";
                                }
                                let url='';
                                if(this.currentLine && this.currentLine.code){
                                    url = Api.dispatch.tempAssignVehicle
                                }else{
                                    url = Api.dispatch.assignVehicle
                                }
                                let confirmForm =  _.cloneDeep(this.confirmForm);
                                confirmForm.salesman = confirmForm.salesman.join(',');
                                if (warn1 + warn2 + warn3) {
                                    this.$confirm(this.$createElement('div', [this.$createElement('p', warn1),this.$createElement('p', warn2),this.$createElement('p', warn3),this.$createElement('p', "是否继续?")]), '提示', {
                                        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
                                    }).then(() => {
                                        this.submitBtnLoading = true;
                                        Http.post(url,confirmForm,() =>{
                                            this.$message.success('派车成功！');
                                            this.$emit('close')
                                        },() => {
                                            this.submitBtnLoading = false;
                                        })
                                    })
                                } else {
                                    this.submitBtnLoading = true;
                                    Http.post(url,confirmForm,() =>{
                                        this.$message.success('操作成功！');
                                        this.$emit('close')
                                    },() => {
                                        this.submitBtnLoading = false;
                                    });
                                }
                            })
                        }else{
                            this.$message.warning('未选择线路!');
                        }
                    };
                });
            },
        }
    }
</script>
<style scoped>
    .blue {
        color: #20a0ff;
        display: inline-block;
        margin-bottom: 12px;
    }
    .hidden {
        visibility: hidden;
    }
</style>
