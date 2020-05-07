<template>
    <el-dialog :title="title" :visible.sync="visible" width="95%" :top="marginTop" @close="close">
        <el-form size="small" :model="addVehicleForm" ref="addVehicleForm" label-width="95px">
            <el-row>
                <el-col :span="5">
                    <el-form-item label="业务类型:" prop="businessType" :rules="validate.required('业务类型',true)">
                        <dictionary-select v-model="addVehicleForm.businessType" option-name="LINE_BUSINESS_TYPE" style="display:block" @change="businessTypeChange"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="预计发车:" prop="expectDepartureTime" :rules="validate.required('预计发车时间',true)">
                        <el-date-picker style="display:block; width:100%;" v-model="addVehicleForm.expectDepartureTime"
                                        value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"
                                        type="datetime" placeholder="选择日期时间" @change="resetVehicleInfo"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="业务员:"  prop="salesman" :rules="validate.required('业务员',addVehicleForm.businessType==='SCATTERED_BUSINESS_TYPE')">
                        <multiple-user-select v-model="addVehicleForm.salesman" style="display:block;"></multiple-user-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="请车员:"  prop="carInviter" :rules="validate.required('请车员',true)">
                        <all-user-select placeholder="请输入请车员姓名" style="display:block;"  v-model="addVehicleForm.carInviter" @change-option="changeCarInviter"></all-user-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="客户订单:">
                        <el-input placeholder="请输入客户订单"  v-model="addVehicleForm.customerOrderCode" :disabled="addVehicleForm.systemDockFlag"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <span class="blue">车辆信息</span><b style="color:red;margin-left: 90px;font-size: 12px;font-weight: bold;" v-show="hasDieselCard && addVehicleForm.dispatchVehicle.vehicleNature === constant.VEHICLE_OPERATION_MODE.OUT_INVITE">【该车已绑定柴油联名卡】</b>
            <el-row>
                <el-col :span="4">
                    <el-form-item label="车牌号码:" prop="dispatchVehicle.vehicleCode" :rules="[validate.required('车牌号码',true)]">
                        <vehicle-select ref="vehicleLicenseNum" v-model="addVehicleForm.dispatchVehicle.vehicleCode" :type="[constant.VEHICLE_TYPE.VAN,constant.VEHICLE_TYPE.TRACTOR]" :is-allow="true"
                                        @change-option="queryVehicleInfo" style="display:block;"></vehicle-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="挂厢号码:" prop="dispatchVehicle.trailerCode" :rules="[{ required: addVehicleForm.dispatchVehicle.isTrailerLicenseNumRequired, message: '挂厢号码不能为空', trigger: 'blur'}]">
                        <vehicle-select placeholder="请输入挂厢号" ref="trailerLicenseNum" v-model="addVehicleForm.dispatchVehicle.trailerCode" @change-option="queryTrailerVehicleInfo"
                                        :type="[constant.VEHICLE_TYPE.TRAILER]" :disabled="addVehicleForm.dispatchVehicle.isTrailerLicenseNumDisabled" :is-allow="true"
                                        :licenseNumber.sync="addVehicleForm.dispatchVehicle.trailerLicenseNum" style="display:block;"></vehicle-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="厢型:" prop="dispatchVehicle.vanType" :rules="validate.required('厢型',true)">
                        <dictionary-select :disabled="addVehicleForm.dispatchVehicle.isVanTypeDisabled"
                                           v-model="addVehicleForm.dispatchVehicle.vanType" style="display:block;"
                                           option-name="VEHICLE_COMPARTMENT_TYPE"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="车型:" prop="dispatchVehicle.specification"
                                  :rules="validate.required('车型',true)">
                        <dictionary-select :disabled="addVehicleForm.dispatchVehicle.isSpecificationDisabled"
                                           style="display:block;" v-model="addVehicleForm.dispatchVehicle.specification"
                                           option-name="VEHICLE_SPECIFICATION"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="承载方数:" prop="dispatchVehicle.loadSquare" :rules="validate.required('承载方数',!selfOutsourceVehicle)">
                        <el-input placeholder="请输入承载方数" v-model="addVehicleForm.dispatchVehicle.loadSquare" :disabled="addVehicleForm.dispatchVehicle.isLoadSquareDisabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="车辆性质:" prop="dispatchVehicle.vehicleNature"
                                  :rules="validate.required('车辆性质',true)">
                        <dictionary-select :disabled="addVehicleForm.dispatchVehicle.isVehicleNatureDisabled"
                                           style="display:block;" v-model="addVehicleForm.dispatchVehicle.vehicleNature"
                                           option-name="VEHICLE_OPERATION_MODE"></dictionary-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="addVehicleForm.dispatchVehicle.vehicleNature === constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT">
                <el-col :span="4">
                    <el-form-item label="司机姓名:" prop="dispatchVehicle.driverId" :rules="validate.required('司机姓名',true)">
                        <driver-select ref="addVehicleFormDriverName" v-model="addVehicleForm.dispatchVehicle.driverId" @driver="getDriverInfo" :is-allow="true" style="display: block"></driver-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="司机电话:" prop="dispatchVehicle.driverPhone" :rules="[validate.required('司机电话',true),validate.phone]">
                        <el-input v-model="addVehicleForm.dispatchVehicle.driverPhone" :disabled="addVehicleForm.dispatchVehicle.isDriverPhoneDisabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="司机姓名2:">
                        <driver-select ref="addVehicleFormSpareDriverName" v-model="addVehicleForm.dispatchVehicle.spareDriverId" @driver="getDriverInfo2" :is-allow="true" style="display: block"></driver-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="司机电话2:" prop="dispatchVehicle.spareDriverPhone"  :rules="[validate.phone]">
                        <el-input v-model="addVehicleForm.dispatchVehicle.spareDriverPhone" :disabled="addVehicleForm.dispatchVehicle.isSpareDriverPhoneDisabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="回货:" prop="returnGoods"  :rules="[validate.required('回货',true)]">
                        <dictionary-select v-model="addVehicleForm.returnGoods" option-name="BOOLEAN_FLAG" style="display: block;"></dictionary-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-else>
                <el-col :span="4">
                    <el-form-item label="司机姓名:" prop="dispatchVehicle.driverId" :rules="validate.required('司机姓名',true)">
                        <driver-select ref="addVehicleFormDriverName" v-model="addVehicleForm.dispatchVehicle.driverId" @driver="getDriverInfo" :is-allow="true" style="display: block"></driver-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="司机电话:" prop="dispatchVehicle.driverPhone" :rules="[validate.required('司机电话',true),validate.phone]">
                        <el-input v-model="addVehicleForm.dispatchVehicle.driverPhone" :disabled="addVehicleForm.dispatchVehicle.isDriverPhoneDisabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="承运方:" prop="dispatchVehicle.shipperCode">
                        <supplier-select placeholder="请输入承运方名称或手机号" ref="shipper" :types="constant.SUPPLIER_TYPE.CAR_TEAM+','+constant.SUPPLIER_TYPE.DEPARTMENT_OF_INFORMATION" @supplier="getShipperInfo"
                                         :disabled="selfOutsourceVehicle" v-model="addVehicleForm.dispatchVehicle.shipperCode" style="display: block"
                                         auditType=''
                                         ></supplier-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="是否开票:" prop="dispatchVehicle.ticket">
                        <el-switch v-model="addVehicleForm.dispatchVehicle.ticket" active-color="#13ce66" inactive-color="#ff4949"
                                   active-text="是" inactive-text="否" :disabled="selfOutsourceVehicle || !addVehicleForm.dispatchVehicle.shipperCode" @change="ticketChange"></el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="回货:" prop="returnGoods"  :rules="[validate.required('回货',true)]">
                        <dictionary-select v-model="addVehicleForm.returnGoods" option-name="BOOLEAN_FLAG" style="display: block;"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4" v-if="jdOrderFlag">
                    <el-form-item label="京东车型:" prop="actualVehicleType"  :rules="[validate.required('京东车型',true)]">
                        <jd-vehicle-type-select v-model="addVehicleForm.actualVehicleType" style="display: block;"></jd-vehicle-type-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10"><span class="blue">应收信息：</span></el-col>
                <el-col :span="14"><span class="blue">应付信息：<i v-if="payUnitPrice>0" style="color:red; font-size:12px;">{{payUnitPrice}}{{priceUnit(addVehicleForm.dispatchPrice.paidPriceType)}}</i></span></el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    <el-form-item label="计价方式:">
                        <dictionary-select :exclude-options="['ALL_DAY']" v-model="addVehicleForm.dispatchPrice.receivePriceType" option-name="LINE_PRICE_TYPE" :clearable="false" style="display: block"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5" :class="{'hidden': receiveUnitPrice>0 }">
                    <el-form-item label="应收金额:" prop="dispatchPrice.receiveAmount" :rules="[validate.required('应收金额',true),validate.money]">
                        <el-input :value="receiveAmount" :disabled="addVehicleForm.dispatchPrice.receivePriceType !== constant.LINE_PRICE_TYPE.NORMAL || receiveUnitPrice>0" @input="val=>addVehicleForm.dispatchPrice.receiveAmount=val" placeholder=" 元"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="计价方式:">
                        <dictionary-select :value="payType" :disabled="!excludeItem" @input="val=>addVehicleForm.dispatchPrice.paidPriceType=val"
                                           option-name="LINE_PRICE_TYPE" :exclude-options="[excludeItem]" :clearable="false" style="display: block"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="应付车价:" prop="dispatchPrice.paidVehicleAmount" :rules="[validate.required('应付车价',true),validate.money]">
                        <el-input :disabled="payType !== constant.LINE_PRICE_TYPE.NORMAL || payUnitPrice>0" :value="paidVehicleAmount" @input="val=>addVehicleForm.dispatchPrice.paidVehicleAmount=val" placeholder=" 元"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4" v-show="!(receiveUnitPrice>0)">
                    <span style="font-weight: bold; padding-left: 20px;" v-if="profitRate>=0.07">{{`（利润率 ${(profitRate*100).toFixed(2)} %）`}}</span>
                    <span style="color: red;font-weight: bold; padding-left: 20px;" v-else v-show="paidVehicleAmount>0&&receiveAmount>0">{{`（利润率 ${(profitRate*100).toFixed(2)} %）`}}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">
                    <span class="blue">应付明细</span>
                </el-col>
                <template v-if="addVehicleForm.dispatchVehicle.vehicleNature === constant.VEHICLE_OPERATION_MODE.OUT_INVITE">
                    <el-col :span="4" style="font-weight: bold; color: darkgreen;">收款人：{{bankInfo.payee}}</el-col>
                    <el-col :span="8" style="font-weight: bold; color: darkgreen;">收款银行：{{bankInfo.dueBank}}</el-col>
                    <el-col :span="8" style="font-weight: bold; color: darkgreen;">银行卡号：{{bankInfo.bankCardNo}}</el-col>
                </template>
            </el-row>
            <el-row>
                <el-col :span="5">
                    <el-form-item label="预付打卡:" prop="dispatchPrice.prepaidCardAmount" :rules="[validate.money]">
                        <el-input :value="prepaidCardAmount" :disabled="prepaidCardAmountDisabled" @input="val=>addVehicleForm.dispatchPrice.prepaidCardAmount=val" placeholder=" 元" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="油卡金额:" prop="dispatchPrice.oilCardAmount" :rules="[validate.required('油卡金额',false),validate.money]">
                        <el-input :value="oilCardAmount" :disabled="oilCardAmountDisabled" @input="val=>addVehicleForm.dispatchPrice.oilCardAmount=val" placeholder=" 元"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="油卡卡号:" prop="dispatchPrice.oilCardNumber" :rules="validate.required('油卡卡号',false)">
                        <oil-card-select ref="addVehicleFormOilCardNumber" v-model="addVehicleForm.dispatchPrice.oilCardNumber" :disabled="oilCardNumberDisabled"
                                         :supplier-code="defaultSupplier.id" style="display: block;" :default-list="oilCardList" :current-user="$store.getters.user.username"
                                         :remote = "!isFixedOilCard" @change="getOilCardInfo"></oil-card-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="油卡余额:" prop="dispatchPrice.oilCardBalance"
                                  :rules="[validate.money]">
                        <el-input v-model="addVehicleForm.dispatchPrice.oilCardBalance" placeholder=" 元" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="油卡押金:">
                        <el-input :value="oilCardDeposit" placeholder=" 元" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    <el-form-item label="定点加油:" prop="dispatchPrice.refuelingAmount" :rules="[validate.money]">
                        <el-row>
                            <el-col :span="12">
                                <el-input :value="refuelingAmount" :disabled="refuelingAmountDisabled" @input="val=>addVehicleForm.dispatchPrice.refuelingAmount=val" placeholder=" 元"></el-input>
                            </el-col>
                            <el-col :span="12">
                                <dictionary-select option-name="REFUELING_TYPE" :clearable="false" :disabled="!(refuelingAmount>0) || !addVehicleForm.dispatchVehicle.shipperCode" :value="refuelingType"
                                @change="val=>addVehicleForm.dispatchPrice.refuelingType=val"></dictionary-select>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="充值手机:">
                        {{rechargePhone}}
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="使用GPS:" prop="dispatchPrice.useGps">
                        <el-switch v-model="addVehicleForm.dispatchPrice.useGps" active-color="#13ce66" inactive-color="#ff4949"
                                   active-text="是" inactive-text="否":disabled="selfOutsourceVehicle && !addVehicleForm.dispatchVehicle.ticket" @change="useGpsChange"></el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="GPS号码:" prop="dispatchPrice.gpsCode">
                        <gps-select ref="gpsNum" v-model="addVehicleForm.dispatchPrice.gpsCode" style="display:block;" @gpsObj="getGpsInfo"
                                  :disabled="!addVehicleForm.dispatchPrice.useGps"></gps-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="GPS押金:">
                        <el-input :value="gpsDeposit" placeholder=" 元" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    <el-form-item label="GPS费用:">
                        <el-input :value="gpsFee" placeholder=" 元" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="货到打卡:" prop="dispatchPrice.deliveryAmount" :rules="[validate.money]">
                        <el-input :value="deliveryAmount" :disabled="deliveryAmountDisabled" @input="val=>addVehicleForm.dispatchPrice.deliveryAmount=val" placeholder=" 元"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="回单押金:" prop="dispatchPrice.returnDeposit" :rules="[validate.money,validate.threeNum]">
                        <el-input :value="returnDeposit" :disabled="returnDepositDisabled" @input="val=>addVehicleForm.dispatchPrice.returnDeposit=val"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="回单付款:">
                        {{returnAmount}} 元
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="20">
                    <el-form-item label="备注信息：">
                        <el-input type="textarea" :rows="1" :maxlength="200" placeholder="最多200个字符！" v-model="addVehicleForm.remark"></el-input>
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
    import {Common} from 'src/global/common'
    import constData from 'src/components/common/data/data.js'

    const CONFIRM = "confirm"; // 目前的确认按钮值
    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            currentRow: {
                type: Object,
                default: null
            },
            isStandby:{
                type: Boolean,
                default: false
            },
            type:{
                type:String, // 新增确认按钮指向
                default:null
            }
        },
        data() {
            return {
                prepaidFlag: false,//当前合作车是否可以预付款
                jdOrderFlag: false,//当前订单是否是京东订单
                visible: true,
                title:`${this.getTitle()} ： 【${this.currentRow.belongOrg.name}】 【${this.currentRow.customer.name}】 【${this.currentRow.dispatchLine.lineName}】 【出发站点：${this.currentRow.dispatchLine.startStation.name}】`,
                validate: Validate,//校验
                constant: Constant,//常量
                common: Common,//公共方法
                repayInfo: {
                    lineContract: {//应收
                        priceType: "",
                        unitPrice: "",
                        VehicleSizeList: []
                    },
                    lineOutInviteList: [],//外请应付
                    lineOutsourceList: []//合作车应付
                },//应收应付list
                addVehicleForm: {
                    belongOrgCode: this.currentRow.belongOrg?this.currentRow.belongOrg.code:'',
                    belongOrgName: this.currentRow.belongOrg?this.currentRow.belongOrg.name:'',
                    code: this.currentRow.code,
                    lineCode: this.currentRow.lineCode,
                    dispatchVehicle: {//--------------车辆信息
                        vehicleCode: "",//车牌号
                        vehicleLicenseNum: "",
                        trailerCode: "",//挂厢号
                        trailerLicenseNum: "",
                        isTrailerLicenseNumRequired: false,
                        isTrailerLicenseNumDisabled: false,
                        vanType: "",//厢型
                        isVanTypeDisabled: false,
                        specification: "",//车长
                        isSpecificationDisabled: false,
                        loadSquare: '',//承载方数
                        isLoadSquareDisabled: false,
                        vehicleNature: "",//车辆属性
                        isVehicleNatureDisabled: false,
                        selfOperationMode: '',
                        driverName: "",//司机姓名
                        driverId: "",
                        driver: {
                            id: "",
                            name: ""
                        },
                        driverPhone: "",//司机电话
                        isDriverPhoneDisabled: false,
                        spareDriverName: "",//司机姓名2
                        spareDriverId: "",
                        spareDriverPhone: "",//司机电话2
                        isSpareDriverPhoneDisabled: false,
                        shipperCode: "",//承运方
                        shipperName: "",//承运方
                        ticket: false,
                    },
                    expectDepartureTime: "",
                    returnGoods: '',
                    actualVehicleType:'',
                    salesman: [],
                    carInviter: "",
                    customerOrderCode: '',//客户订单号
                    dispatchPrice: {//---------------收付信息
                        receivePriceType: Constant.LINE_PRICE_TYPE.NORMAL,//应收信息
                        receiveUnitPrice: '',
                        receiveAmount: "",
                        paidPriceType: Constant.LINE_PRICE_TYPE.NORMAL,//应付信息
                        paidUnitPrice: '',
                        paidVehicleAmount: "",
                        prepaidCardAmount: "",//预付打卡
                        refuelingVolume: "",//定点加油
                        refuelingAmount: "",//定点加油金额
                        refuelingType: "",
                        oilCardNumber: "",//油卡卡号
                        oilCardAmount: "",//油卡金额
                        oilCardBalance: "",//油卡余额
                        oilCardDeposit: "",//油卡押金
                        returnDeposit: "",//回单押金
                        useGps: false,
                        gpsCode: "",
                        gpsDeposit: "",//gps押金
                        gpsFee: "",//gps使用费
                        deliveryAmount: "",//货到打卡
                        returnAmount: ""//回单付款
                    },
                    remark: "",//备注
                    businessType: this.currentRow.businessType//业务类型
                },//表单提交项
                oilCardAmountWatch: false,//是否走侦听
                dispatchVehicleCloneObj: null,
                dispatchPriceCloneObj: null,
                defaultSupplier: this.currentRow.belongOrg?(this.currentRow.belongOrg.outsideSupplier?this.currentRow.belongOrg.outsideSupplier:{id:"",name:""}):{id:"",name:""},
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                oilCardList: [],
                dieselCardList: [],//柴油联名卡
                //包天车辆返回对象
                allDayVehicleData: null,
                MoilCardAmount: '',
                CoilCardAmount: '',
                MvehicleCode: '',
                //外请车显示收款账户信息
                shipperObj: null,
                driverObj: null
            }
        },
        mounted() {
            this.dispatchVehicleCloneObj = _.cloneDeep(this.addVehicleForm.dispatchVehicle);
            this.dispatchPriceCloneObj = _.cloneDeep(this.addVehicleForm.dispatchPrice);
            this.init(this.currentRow);
        },
        computed: {
            marginTop: function () { //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "15vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "8vh";
                }
            },
            //合作车或者自营车
            selfOutsourceVehicle(){
                return this.addVehicleForm.dispatchVehicle.vehicleNature === Constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT || this.addVehicleForm.dispatchVehicle.vehicleNature === Constant.VEHICLE_OPERATION_MODE.OUTSOURCE
            },
            //返回普通自营车
            isNormalSelfVehicle(){
                return this.addVehicleForm.dispatchVehicle.vehicleNature === Constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT && this.addVehicleForm.dispatchVehicle.selfOperationMode === Constant.SELF_OPERATION_MODE.SELF_SELF_SUPPORT;
            },
            //承运方是否绑定固定油卡
            isFixedOilCard() {
                return !_.isEmpty(this.oilCardList);
            },
            //车辆是否绑定柴油联名卡
            hasDieselCard(){
                return !_.isEmpty(this.dieselCardList);
            },
            //单价单位
            priceUnit() {
                return function(priceType){
                    if (priceType === Constant.LINE_PRICE_TYPE.NORMAL) {
                        return "元 /趟";
                    } else if (priceType === Constant.LINE_PRICE_TYPE.WEIGHT) {
                        return "元 /公斤";
                    } else if(priceType === Constant.LINE_PRICE_TYPE.VOLUME){
                        return "元 /方";
                    }else{
                        return "";
                    }
                }
            },
            //应收单价
            receiveUnitPrice(){
                return this.addVehicleForm.dispatchPrice.receiveUnitPrice = this.getReceiveUnitPrice(this.addVehicleForm.dispatchPrice.receivePriceType,this.addVehicleForm.dispatchVehicle.specification);
            },
            //应收金额
            receiveAmount: {
                get(){
                    return this.addVehicleForm.dispatchPrice.receiveAmount = this.getReceiveAmount(this.addVehicleForm.dispatchPrice.receivePriceType,this.receiveUnitPrice,this.addVehicleForm.dispatchPrice.receiveAmount);
                },
                set(val){
                    this.$emit('input',val);
                }
            },
            //应付计价方式
            payType:{
                get(){
                    return this.addVehicleForm.dispatchPrice.paidPriceType = this.getPaidPriceType(this.addVehicleForm.dispatchVehicle.vehicleCode, this.addVehicleForm.dispatchVehicle.vehicleNature, this.allDayVehicleData, this.addVehicleForm.dispatchVehicle.shipperCode, this.addVehicleForm.dispatchPrice.receivePriceType, this.addVehicleForm.dispatchPrice.paidPriceType);
                },
                set(){
                    this.$emit('input',val);
                }
            },
            //应付计价方式排除项
            excludeItem(){
                if(_.isNil(this.allDayVehicleData)){
                    return Constant.LINE_PRICE_TYPE.ALL_DAY;
                }else{
                    return ''
                }
            },
            //应付单价
            payUnitPrice(){
                return this.addVehicleForm.dispatchPrice.paidUnitPrice = this.getPayUnitPrice(this.addVehicleForm.dispatchPrice.paidPriceType, this.addVehicleForm.dispatchVehicle.specification, this.addVehicleForm.dispatchVehicle.vehicleNature, this.addVehicleForm.dispatchVehicle.vehicleCode, this.addVehicleForm.dispatchVehicle.shipperCode);
            },
            //应付金额
            paidVehicleAmount:{
                get(){
                    return this.addVehicleForm.dispatchPrice.paidVehicleAmount = this.getPaidVehicleAmount(this.addVehicleForm.dispatchPrice.paidPriceType, this.addVehicleForm.dispatchVehicle.vehicleNature, this.addVehicleForm.dispatchVehicle.selfOperationMode, this.receiveAmount, this.payUnitPrice,this.addVehicleForm.dispatchPrice.paidVehicleAmount);
                },
                set(val){
                    this.$emit('input',val);
                }
            },
            //计算预付打卡
            prepaidCardAmount:{
                get(){
                    return this.addVehicleForm.dispatchPrice.prepaidCardAmount = this.getPrepaidCardAmount(this.addVehicleForm.dispatchVehicle.vehicleNature,this.prepaidFlag,this.allDayVehicleData,this.addVehicleForm.dispatchVehicle.ticket,this.addVehicleForm.dispatchPrice.prepaidCardAmount);
                },
                set(val){
                    this.$emit('input',val);
                }
            },
            prepaidCardAmountDisabled(){
                return this.addVehicleForm.dispatchVehicle.vehicleNature === 'SELF_SUPPORT' || (this.addVehicleForm.dispatchVehicle.vehicleNature === 'OUTSOURCE' && !this.prepaidFlag)  || !_.isNil(this.allDayVehicleData) || this.addVehicleForm.dispatchVehicle.ticket;
            },
            //计算油卡金额
            oilCardAmount:{
                get(){
                    return this.addVehicleForm.dispatchPrice.oilCardAmount = this.getOilCardAmount(this.selfOutsourceVehicle,this.allDayVehicleData,this.addVehicleForm.dispatchVehicle.shipperCode,
                        this.addVehicleForm.dispatchVehicle.ticket,this.addVehicleForm.dispatchVehicle.specification,this.payType,this.addVehicleForm.dispatchPrice.oilCardAmount);
                },
                set(val){
                    this.$emit('input',val);
                }
            },
            oilCardAmountDisabled(){
                return this.selfOutsourceVehicle || (!_.isNil(this.allDayVehicleData) && this.allDayVehicleData.oilCardAmount>0 && !(this.CoilCardAmount>0)) || this.addVehicleForm.dispatchVehicle.ticket;
            },
            //油卡卡号
            oilCardNumberDisabled(){
                return !(this.addVehicleForm.dispatchPrice.oilCardAmount>0) || (!_.isNil(this.allDayVehicleData) && !!this.allDayVehicleData.oilCardNumber &&  !(this.CoilCardAmount>0));
            },
            //油卡押金
            oilCardDeposit(){
                return  this.addVehicleForm.dispatchPrice.oilCardDeposit = this.getOilCardDeposit(this.addVehicleForm.dispatchVehicle.vehicleNature,this.addVehicleForm.dispatchVehicle.shipperCode, this.addVehicleForm.dispatchVehicle.ticket,this.addVehicleForm.dispatchPrice.oilCardAmount, this.hasDieselCard,this.addVehicleForm.dispatchPrice.oilCardNumber,this.addVehicleForm.dispatchPrice.paidVehicleAmount,this.allDayVehicleData);
            },
            //gps押金
            gpsDeposit(){
                return  this.addVehicleForm.dispatchPrice.gpsDeposit = this.getGpsDeposit(this.addVehicleForm.dispatchVehicle.vehicleNature,this.addVehicleForm.dispatchVehicle.shipperCode, this.addVehicleForm.dispatchVehicle.ticket,this.addVehicleForm.dispatchPrice.useGps,this.allDayVehicleData);
            },
            //gps使用费
            gpsFee(){
                return  this.addVehicleForm.dispatchPrice.gpsFee = this.getGpsFee(this.addVehicleForm.dispatchPrice.useGps,this.allDayVehicleData);
            },
            //货到打卡
            deliveryAmount:{
                get(){
                    return this.addVehicleForm.dispatchPrice.deliveryAmount = this.getDeliveryAmount(this.selfOutsourceVehicle,this.allDayVehicleData,this.addVehicleForm.dispatchVehicle.ticket,this.addVehicleForm.dispatchPrice.deliveryAmount);
                },
                set(val){
                    this.$emit('input',val);
                }
            },
            deliveryAmountDisabled(){
                return this.selfOutsourceVehicle || !_.isNil(this.allDayVehicleData) || this.addVehicleForm.dispatchVehicle.ticket;
            },
            //回单押金
            returnDeposit:{
                get(){
                    return  this.addVehicleForm.dispatchPrice.returnDeposit = this.getReturnDeposit(this.addVehicleForm.dispatchVehicle.vehicleNature,this.addVehicleForm.dispatchPrice.returnDeposit);
                },
                set(val){
                    this.$emit('input',val);
                }
            },
            returnDepositDisabled(){
                return  this.addVehicleForm.dispatchVehicle.vehicleNature !== Constant.VEHICLE_OPERATION_MODE.OUT_INVITE;
            },
            //回单金额
            returnAmount(){
                return  this.addVehicleForm.dispatchPrice.returnAmount = this.getReturnAmount(this.addVehicleForm.dispatchVehicle.vehicleNature,this.addVehicleForm.dispatchPrice.paidVehicleAmount, this.addVehicleForm.dispatchPrice.prepaidCardAmount, this.addVehicleForm.dispatchPrice.oilCardAmount, this.oilCardDeposit,this.addVehicleForm.dispatchPrice.returnDeposit, this.gpsDeposit,this.addVehicleForm.dispatchPrice.gpsFee,this.addVehicleForm.dispatchPrice.deliveryAmount,this.refuelingAmount);
            },
            //计算利润率
            profitRate(){
                return this.getProfitRate(this.receiveAmount,this.paidVehicleAmount);
            },
            //确定收款账户信息
            bankInfo(){
                return this.getBankInfo();
            },
            //定点加油金额
            refuelingAmount:{
                get(){
                    return  this.addVehicleForm.dispatchPrice.refuelingAmount = this.getRefuelingAmount(this.addVehicleForm.dispatchVehicle.vehicleNature,this.addVehicleForm.dispatchVehicle.ticket,this.oilCardAmount,this.addVehicleForm.dispatchPrice.refuelingAmount);
                },
                set(val){
                    this.$emit('input',val);
                }
            },
            refuelingAmountDisabled(){
                return  this.addVehicleForm.dispatchVehicle.vehicleNature !== Constant.VEHICLE_OPERATION_MODE.OUT_INVITE || this.addVehicleForm.dispatchVehicle.ticket || !!this.oilCardAmount;
            },
            refuelingType(){
                if(!(this.refuelingAmount>0)){
                    return this.addVehicleForm.dispatchPrice.refuelingType=''
                }
                if(!this.addVehicleForm.dispatchVehicle.shipperCode){
                    return this.addVehicleForm.dispatchPrice.refuelingType='DRIVER'
                }
                return this.addVehicleForm.dispatchPrice.refuelingType = this.addVehicleForm.dispatchPrice.refuelingType || 'SHIPPER'
            },
            //充值手机
            rechargePhone(){
                if(!this.refuelingType){
                    return ''
                }
                if(this.refuelingType==='SHIPPER' &&  !_.isNil(this.shipperObj)){
                    return (this.shipperObj?this.shipperObj.linkMan:'') + '' + (this.shipperObj?this.shipperObj.contact:'');
                }
                if(this.refuelingType==='DRIVER'){
                    return this.addVehicleForm.dispatchVehicle.driverName+''+this.addVehicleForm.dispatchVehicle.driverPhone;
                }
            },
            //回单应付最大占比
            tailPaymentRatio(){
                return !this.addVehicleForm.dispatchVehicle.shipperCode ||!this.shipperObj || !this.shipperObj.tailPaymentRatio?0.1:this.shipperObj.tailPaymentRatio
            }
        },
        watch: {
            //监听传入的visible参数
            dialogVisible(val) {
                if (val) {
                    this.visible = val;
                }
            },
            //油卡金额的侦听
            'addVehicleForm.dispatchPrice.oilCardAmount'(val) {
                let vm = this;
                if(vm.oilCardAmountWatch){
                    if(!(val>0)){
                        vm.addVehicleForm.dispatchPrice.oilCardNumber = '';
                        vm.addVehicleForm.dispatchPrice.oilCardBalance = '';
                    }
                }else{
                    if(val>0 && val<10){
                        if(!(val>0)){
                            vm.addVehicleForm.dispatchPrice.oilCardNumber = '';
                            vm.addVehicleForm.dispatchPrice.oilCardBalance = '';
                        }
                    }
                    vm.oilCardAmountWatch = true;
                }
            }
        },
        methods: {
            setPrice(){  // 当订单来自排班时，后台返回的数据，可能存在应收和应付都为0，默认值的情况，设置为空字符串
                if(this.currentRow&&this.currentRow.createDispatchType === this.constant.ORDER_ORIGIN.BY_ORDER_SCHEDULE){
                    if(this.addVehicleForm.dispatchPrice.paidVehicleAmount == 0){
                        this.addVehicleForm.dispatchPrice.paidVehicleAmount = ''
                    }
                    if(this.addVehicleForm.dispatchPrice.receiveAmount == 0){
                        this.addVehicleForm.dispatchPrice.receiveAmount = ''
                    }
                }
            },
            getTitle(){
                return this.type === CONFIRM ? '确认':'修改'
            },
            //页面初始化
            init(row) {
                let vm = this;
                vm.queryDetailInfo(row.code);
            },
            //修改时回显
            queryDetailInfo(code) {
                let vm = this;
                Http.get(Api.dispatch.queryByCode, {params: {'code': code}}, result => {
                    _.merge(vm.addVehicleForm,result.result);
                    if(vm.addVehicleForm.salesman && vm.addVehicleForm.salesman.length>0){
                        vm.addVehicleForm.salesman = result.result.salesman.split(',');
                    }else{
                        vm.addVehicleForm.salesman = [];
                    }
                    //当前没有请车员的话，默认为登陆人员
                    if(!vm.addVehicleForm.carInviter && this.currentRow.businessType!=='SCATTERED_BUSINESS_TYPE'){
                        vm.addVehicleForm.carInviter = `${this.$store.getters.user.name} ${this.$store.getters.user.username}`;
                    }
                    vm.CoilCardAmount = result.result.dispatchPrice.oilCardAmount;
                    vm.MoilCardAmount = result.result.dispatchPrice.oilCardAmount;
                    vm.MvehicleCode = result.result.dispatchVehicle.vehicleCode;
                    if(result.result.dispatchVehicle.vehicle){
                        vm.prepaidFlag = result.result.dispatchVehicle.vehicle.prepaidFlag;
                    }
                    setTimeout(()=>{
                        vm.$refs.vehicleLicenseNum.setCurrentVehicle({
                            code: result.result.dispatchVehicle.vehicleCode,
                            licenseNumber: result.result.dispatchVehicle.vehicleLicenseNum
                        });
                        //查询是否绑定柴油联名卡
                        if(!_.isNil(result.result.dispatchVehicle.vehicle)){
                            vm.dieselCardList = result.result.dispatchVehicle.vehicle.dieselOilCardList;
                        }
                        vm.$refs.trailerLicenseNum.setCurrentVehicle({
                            code: result.result.dispatchVehicle.trailerCode,
                            licenseNumber: result.result.dispatchVehicle.trailerLicenseNum
                        });
                        if(!_.isNil(result.result.actualVehicleType)){
                            vm.jdOrderFlag = true;
                        }
                        if(!_.isNil(result.result.dispatchVehicle.driver)){
                            vm.$refs.addVehicleFormDriverName.setCurrentDriver(result.result.dispatchVehicle.driver);
                            vm.addVehicleForm.dispatchVehicle.isDriverPhoneDisabled = true;
                            vm.driverObj = result.result.dispatchVehicle.driver;
                        }
                        if(!_.isNil(result.result.dispatchVehicle.spareDriver)){
                            vm.$refs.addVehicleFormSpareDriverName.setCurrentDriver(result.result.dispatchVehicle.spareDriver);
                            vm.addVehicleForm.dispatchVehicle.isSpareDriverPhoneDisabled = true;
                        }
                        if(!_.isNil(result.result.dispatchVehicle.shipper)){
                            vm.oilCardList = result.result.dispatchVehicle.shipper.oilCardList;
                            vm.$refs.shipper.setCurrentSupplier(result.result.dispatchVehicle.shipper);
                            vm.addVehicleForm.dispatchVehicle.shipperName = result.result.dispatchVehicle.shipper.name;
                            vm.shipperObj = result.result.dispatchVehicle.shipper;
                            vm.confirmLinkMan(vm.shipperObj)
                        }
                        if(!_.isNil(result.result.dispatchPrice.oilCard)){
                            vm.$refs.addVehicleFormOilCardNumber.setCurrentOilCard(result.result.dispatchPrice.oilCard);
                            if(vm.oilCardList.length>0){
                                vm.addVehicleForm.dispatchPrice.oilCardBalance =  '';
                            }else{
                                vm.addVehicleForm.dispatchPrice.oilCardBalance =  result.result.dispatchPrice.oilCard.balanceAmount;
                            }
                        }
                        if(!_.isNil(result.result.dispatchPrice.gps)){
                            vm.$refs.gpsNum.setCurrentGps(result.result.dispatchPrice.gps);
                        }
                        vm.initParam();
                    },0)
                    if (result.result.dispatchVehicle && !!result.result.dispatchVehicle.trailerCode) {//挂厢号码有显示 车头
                        vm.addVehicleForm.dispatchVehicle.isTrailerLicenseNumRequired = true;
                        vm.addVehicleForm.dispatchVehicle.isTrailerLicenseNumDisabled = false;
                    } else {//无挂厢
                        vm.addVehicleForm.dispatchVehicle.isTrailerLicenseNumRequired = false;
                        vm.addVehicleForm.dispatchVehicle.isTrailerLicenseNumDisabled = true;
                    }
                    vm.addVehicleForm.dispatchVehicle.isVanTypeDisabled = true;//厢型不能改
                    vm.addVehicleForm.dispatchVehicle.isSpecificationDisabled = true;//车长不能改
                    vm.addVehicleForm.dispatchVehicle.isVehicleNatureDisabled = true;//修改时车辆属性初始不能修改不能更改
                    if (vm.addVehicleForm.dispatchVehicle.vehicleNature === vm.constant.VEHICLE_OPERATION_MODE.OUT_INVITE) {//外请车

                        if(vm.currentRow.createDispatchType === vm.constant.ORDER_ORIGIN.BY_ORDER_SCHEDULE&&_.isNil(vm.addVehicleForm.dispatchVehicle.vehicleCode)){ // 存在来自排班的没有车牌的情况

                        }else{
                            //包天车辆判断
                            Http.get(Api.allDayVehicle.queryByVehicleCode, {params: {'vehicleCode': vm.addVehicleForm.dispatchVehicle.vehicleCode,'demandTime':vm.addVehicleForm.expectDepartureTime}}, response => {
                                vm.allDayVehicleData = response.result;
                            })
                        }
                        if(vm.addVehicleForm.dispatchVehicle.ticket){
                            //清空应付明细
                            vm.addVehicleForm.dispatchPrice.refuelingVolume = "";
                            vm.addVehicleForm.dispatchPrice.oilCardNumber = "";
                            vm.addVehicleForm.dispatchPrice.oilCardAmount = "";
                            vm.addVehicleForm.dispatchPrice.oilCardBalance = "";
                        }
                    } else {//外包或自营车
                        vm.addVehicleForm.dispatchVehicle.shipperCode = "";//承运方

                        //清空应付明细
                        vm.addVehicleForm.dispatchPrice.refuelingVolume = "";
                        vm.addVehicleForm.dispatchPrice.oilCardNumber = "";
                        vm.addVehicleForm.dispatchPrice.oilCardAmount = "";
                        vm.addVehicleForm.dispatchPrice.oilCardBalance = "";
                        vm.addVehicleForm.dispatchPrice.returnAmount = "";
                    }
                    vm.queryRepayInfo(vm.currentRow.lineCode);
                })
            },
            //初始化参数承载方数
            initParam() {
                let vm = this;
                if (vm.addVehicleForm.dispatchVehicle.vehicleCode && !vm.addVehicleForm.dispatchVehicle.loadSquare) {
                    Http.get(Api.vehicle.queryByCode, {params: {'code': vm.addVehicleForm.dispatchVehicle.vehicleCode}}, result => {
                        if (result.result.type === vm.constant.VEHICLE_TYPE.VAN) {
                            vm.addVehicleForm.dispatchVehicle.loadSquare = result.result.loadSquare;
                            if (vm.addVehicleForm.dispatchVehicle.loadSquare) {
                                vm.addVehicleForm.dispatchVehicle.isLoadSquareDisabled = true;
                            }
                        }else if (result.result.type === vm.constant.VEHICLE_TYPE.TRACTOR && vm.addVehicleForm.dispatchVehicle.trailerCode) {
                            Http.get(Api.vehicle.queryByCode, {params: {'code': vm.addVehicleForm.dispatchVehicle.trailerCode}}, result => {
                                vm.addVehicleForm.dispatchVehicle.loadSquare = result.result.loadSquare;
                                if (vm.addVehicleForm.dispatchVehicle.loadSquare) {
                                    vm.addVehicleForm.dispatchVehicle.isLoadSquareDisabled = true;
                                }
                            }, error => {
                                vm.$message.error("初始化查询挂牌号错误，" + error.message);
                            })
                        }
                    }, error => {
                        vm.$message.error("初始化查询车牌号错误，" + error.message);
                    })
                }
            },
            //根据线路查询应收,应付信息对象
            queryRepayInfo(lineCode) {
                let vm = this;
                Http.get(Api.line.queryDetailById, {params: {'id': lineCode}}, result => {
                    vm.repayInfo = result.result;
                    this.setPrice()
                    //设置默认业务员
                    if (this.type === 'confirm') {
                        if((!this.addVehicleForm.salesman ||!(this.addVehicleForm.salesman.length>0)) &&vm.repayInfo.salesmanList && vm.repayInfo.salesmanList.length>0){
                            vm.addVehicleForm.salesman = vm.repayInfo.salesmanList.split(',');
                        }
                    }
                    //重置应收方式
                    if(!_.isNil(vm.repayInfo.lineContract) && vm.repayInfo.lineContract.priceType){
                        vm.addVehicleForm.dispatchPrice.receivePriceType = vm.repayInfo.lineContract.priceType;
                    }
                    //重置应付方式
                    this.addVehicleForm.dispatchPrice.paidPriceType = this.getPaidPriceType(this.addVehicleForm.dispatchVehicle.vehicleCode, this.addVehicleForm.dispatchVehicle.vehicleNature, this.allDayVehicleData, this.addVehicleForm.dispatchVehicle.shipperCode, this.addVehicleForm.dispatchPrice.receivePriceType, this.addVehicleForm.dispatchPrice.paidPriceType);
                    if(result.result.lineOutsourceList.length>0){//若线路有合作车相关信息，相关车辆List添加到车辆选择器
                        let vehicleList = [];
                        _.cloneDeep(result.result.lineOutsourceList).forEach((item)=>{
                            vehicleList.push(item.vehicleInfo);
                        });
                        setTimeout(()=>{
                            vm.$refs.vehicleLicenseNum.setCurrentVehicle(vehicleList);
                        },0)
                    }
                })
            },
            //车牌号回调
            queryVehicleInfo(obj) {
                let vm = this;
                if(!_.isNil(obj)){//选择已有车牌号
                    vm.resetVehicleInfo();
                    if(!vm.addVehicleForm.expectDepartureTime){
                        return vm.$message.warning('请先选择预计发车时间！')
                    }
                    vm.addVehicleForm.dispatchVehicle.vehicleCode = obj.code;
                    if(vm.addVehicleForm.dispatchVehicle.vehicleCode === vm.MvehicleCode){
                        vm.CoilCardAmount = vm.CoilCardAmount;
                    }else{
                        vm.CoilCardAmount = '';
                    }
                    vm.addVehicleForm.dispatchVehicle.vehicleLicenseNum = obj.licenseNumber;
                    vm.dieselCardList = obj.dieselOilCardList;
                    Http.get(Api.vehicle.queryByCode, {params: {'code': obj.code}}, result => {
                        if (result.result.blacklist === true) {
                            vm.resetVehicleInfo();
                            return vm.$message('此车辆已被列入系统黑名单,不能选择!');
                        }
                        if (result.result.status === 'FORBIDDEN') {
                            vm.resetVehicleInfo();
                            return vm.$message('此车辆已被禁用,不能选择!');
                        }
                        if (result.result.operationStatus === 'DISCARDED') {
                            vm.resetVehicleInfo();
                            return vm.$message('此车辆已报废,不能选择!');
                        }
                        if (result.result.operationStatus === 'SEALED') {
                            vm.resetVehicleInfo();
                            return vm.$message('此车辆已封存,不能选择!');
                        }
                        if(result.result.type === vm.constant.VEHICLE_TYPE.TRACTOR){//车头，挂厢必填，解禁
                            vm.addVehicleForm.dispatchVehicle.isTrailerLicenseNumRequired = true;
                            vm.addVehicleForm.dispatchVehicle.isTrailerLicenseNumDisabled = false;
                            if(result.result.vehicleList&&result.result.vehicleList.length>0){
                                vm.$refs.trailerLicenseNum.setCurrentVehicle(result.result.vehicleList);
                                vm.addVehicleForm.dispatchVehicle.trailerCode = result.result.vehicleList[0].code;
                                vm.addVehicleForm.dispatchVehicle.trailerLicenseNum = result.result.vehicleList[0].licenseNumber;
                                Http.get(Api.vehicle.queryByCode, {params: {'code': result.result.vehicleList[0].code}}, result => {
                                    vm.addVehicleForm.dispatchVehicle.vanType = result.result.vanType;//厢型--带出后不能修改
                                    vm.addVehicleForm.dispatchVehicle.isVanTypeDisabled = true;
                                    vm.addVehicleForm.dispatchVehicle.specification = result.result.specification;//规格（车长）--带出后不能修改
                                    vm.addVehicleForm.dispatchVehicle.isSpecificationDisabled = true;
                                    vm.addVehicleForm.dispatchVehicle.loadSquare = result.result.loadSquare;
                                    if(result.result.loadSquare>0){
                                        vm.addVehicleForm.dispatchVehicle.isLoadSquareDisabled = true;
                                    }else{
                                        vm.addVehicleForm.dispatchVehicle.isLoadSquareDisabled = false;
                                    }
                                })
                            }
                        }else{
                            vm.addVehicleForm.dispatchVehicle.isTrailerLicenseNumRequired = false;
                            vm.addVehicleForm.dispatchVehicle.isTrailerLicenseNumDisabled = true;
                            vm.addVehicleForm.dispatchVehicle.vanType = result.result.vanType;//厢型--带出后不能修改
                            vm.addVehicleForm.dispatchVehicle.isVanTypeDisabled = true;
                            vm.addVehicleForm.dispatchVehicle.specification = result.result.specification;//规格（车长）--带出后不能修改
                            vm.addVehicleForm.dispatchVehicle.isSpecificationDisabled = true;
                            vm.addVehicleForm.dispatchVehicle.loadSquare = result.result.loadSquare;
                            if(result.result.loadSquare>0){
                                vm.addVehicleForm.dispatchVehicle.isLoadSquareDisabled = true;
                            }else{
                                vm.addVehicleForm.dispatchVehicle.isLoadSquareDisabled = false;
                            }
                        }
                        vm.addVehicleForm.dispatchVehicle.vehicleNature = result.result.operationMode;//带出车辆性质，禁用
                        vm.addVehicleForm.dispatchVehicle.isVehicleNatureDisabled = true;
                        if(result.result.operationMode === vm.constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT){//自营车
                            vm.addVehicleForm.returnGoods = '';//默认回货为空
                            vm.addVehicleForm.dispatchVehicle.selfOperationMode = result.result.selfOperationMode;
                        }else if(result.result.operationMode === vm.constant.VEHICLE_OPERATION_MODE.OUTSOURCE){//合作车
                            vm.addVehicleForm.returnGoods = false;//默认不回货
                            vm.prepaidFlag = result.result.prepaidFlag;
                        }else{//外请车
                            vm.addVehicleForm.returnGoods = false;//默认不回货
                            if(!_.isNil(result.result.dieselOilCardList) && result.result.dieselOilCardList.length>0){//判断外请车是否绑定柴油联名卡--回货回写
                                vm.dieselCardList = result.result.dieselOilCardList;
                            }
                            //包天车辆判断
                            Http.get(Api.allDayVehicle.queryByVehicleCode, {params: {'vehicleCode': obj.code,'demandTime':vm.addVehicleForm.expectDepartureTime}}, response => {
                                vm.allDayVehicleData = response.result;
                            })
                        }
                        if (result.result.driverList && result.result.driverList.length > 0) { //关联常用司机
                            if(result.result.driverList[0].blacklist) return;
                            vm.$refs.addVehicleFormDriverName.setCurrentDriver(result.result.driverList);
                            vm.driverObj = result.result.driverList[0];
                            vm.addVehicleForm.dispatchVehicle.driverId = result.result.driverList[0].id;
                            vm.addVehicleForm.dispatchVehicle.driverName = result.result.driverList[0].name;
                            vm.addVehicleForm.dispatchVehicle.driverPhone = result.result.driverList[0].mobile;
                            vm.addVehicleForm.dispatchVehicle.isDriverPhoneDisabled = true;
                        }
                    });
                    return;
                }
                vm.addVehicleForm.dispatchVehicle.vehicleLicenseNum = '';
                if(vm.addVehicleForm.dispatchVehicle.vehicleCode && !vm.addVehicleForm.dispatchVehicle.vehicleLicenseNum){//新添加的车牌号
                    let vehicleCode = vm.addVehicleForm.dispatchVehicle.vehicleCode;
                    vm.resetVehicleInfo();
                    if (!vm.validate.licenseNumber.pattern.test(vehicleCode)) {//验证新输入的车牌号是否符合规则
                        return vm.$message("车牌号格式不正确！");
                    }
                    vm.addVehicleForm.dispatchVehicle.vehicleCode = vehicleCode;
                    vm.addVehicleForm.dispatchVehicle.vehicleNature = Constant.VEHICLE_OPERATION_MODE.OUT_INVITE;//车辆性质外请，禁用
                    vm.addVehicleForm.dispatchVehicle.isVehicleNatureDisabled = true;
                    vm.addVehicleForm.dispatchVehicle.isTrailerLicenseNumRequired = false;//挂厢解除必填，解除禁用
                    vm.addVehicleForm.dispatchVehicle.isTrailerLicenseNumDisabled = false;
                    return;
                }
                vm.resetVehicleInfo();
            },
            //重置车牌号带出的信息
            resetVehicleInfo() {
                let vm = this;
                vm.addVehicleForm.dispatchVehicle = _.cloneDeep(vm.dispatchVehicleCloneObj);
                vm.addVehicleForm.dispatchPrice = _.cloneDeep(vm.dispatchPriceCloneObj);
                vm.addVehicleForm.returnGoods = '';//默认回货为空
                vm.oilCardAmountWatch = true;
                vm.$refs.addVehicleFormDriverName.clearDriverList();//清空常用司机数组
                vm.$refs.trailerLicenseNum.clearVehicleList()//清空常用挂厢数组;
                vm.addVehicleForm.dispatchVehicle.isDriverPhoneDisabled = false;
                vm.addVehicleForm.dispatchVehicle.isSpareDriverPhoneDisabled = false;
                vm.dieselCardList = [];//柴油联名卡
                vm.allDayVehicleData = null;//包天车辆
                vm.MoilCardAmount = '';
                vm.driverObj = null;
                if(!_.isNil(vm.repayInfo.lineContract) && !!vm.repayInfo.lineContract.priceType){
                    vm.addVehicleForm.dispatchPrice.receivePriceType = vm.repayInfo.lineContract.priceType;
                }
                vm.prepaidFlag = false;
            },
            //挂厢号回调
            queryTrailerVehicleInfo(obj) {
                let vm = this;
                vm.addVehicleForm.dispatchVehicle.vanType = "";//厢型
                vm.addVehicleForm.dispatchVehicle.isVanTypeDisabled = false;
                vm.addVehicleForm.dispatchVehicle.specification = "";//规格（车长）
                vm.addVehicleForm.dispatchVehicle.isSpecificationDisabled = false;
                vm.addVehicleForm.dispatchVehicle.loadSquare = '';
                vm.addVehicleForm.dispatchVehicle.isLoadSquareDisabled = false;
                if(!_.isNil(obj)){
                    vm.addVehicleForm.dispatchVehicle.trailerCode = obj.code;
                    vm.addVehicleForm.dispatchVehicle.trailerLicenseNum = obj.licenseNumber;
                    Http.get(Api.vehicle.queryByCode, {params: {'code': obj.code}}, result => {
                        if (result.result.status === 'FORBIDDEN') {
                            vm.addVehicleForm.dispatchVehicle.trailerCode = "";
                            vm.addVehicleForm.dispatchVehicle.vanType = "";//厢型
                            vm.addVehicleForm.dispatchVehicle.isVanTypeDisabled = false;
                            vm.addVehicleForm.dispatchVehicle.specification = "";//规格（车长）
                            vm.addVehicleForm.dispatchVehicle.isSpecificationDisabled = false;
                            vm.addVehicleForm.dispatchVehicle.loadSquare = '';
                            vm.addVehicleForm.dispatchVehicle.isLoadSquareDisabled = false;
                            vm.$message('此挂厢已被禁用,不能选择!');
                            return;
                        }
                        vm.addVehicleForm.dispatchVehicle.vanType = result.result.vanType;//厢型--带出后不能修改
                        vm.addVehicleForm.dispatchVehicle.isVanTypeDisabled = true;
                        vm.addVehicleForm.dispatchVehicle.specification = result.result.specification;//规格（车长）--带出后不能修改
                        vm.addVehicleForm.dispatchVehicle.isSpecificationDisabled = true;
                        vm.addVehicleForm.dispatchVehicle.loadSquare = result.result.loadSquare;
                        if(result.result.loadSquare>0){
                            vm.addVehicleForm.dispatchVehicle.isLoadSquareDisabled = true;
                        }else{
                            vm.addVehicleForm.dispatchVehicle.isLoadSquareDisabled = false;
                        }
                    })
                    return;
                }
                vm.addVehicleForm.dispatchVehicle.trailerLicenseNum = '';
                if(vm.addVehicleForm.dispatchVehicle.trailerCode && !vm.addVehicleForm.dispatchVehicle.trailerLicenseNum){
                    if (!vm.validate.trailerLicenseNumber.pattern.test(vm.addVehicleForm.dispatchVehicle.trailerCode)) {
                        vm.addVehicleForm.dispatchVehicle.trailerCode = "";
                        vm.$message('挂厢号格式不正确!');
                    }
                }
            },
            //司机姓名回调
            getDriverInfo(obj) {
                let vm = this;
                vm.driverObj = null;
                vm.addVehicleForm.dispatchVehicle.driverName = '';
                vm.addVehicleForm.dispatchVehicle.driverPhone = "";
                vm.addVehicleForm.dispatchVehicle.isDriverPhoneDisabled = false;
                if(!_.isNil(obj)){
                    vm.addVehicleForm.dispatchVehicle.driverId = '';
                    if(obj.blacklist === true){
                        return vm.$message('此司机已被列入系统黑名单,不能选择!');
                    }
                    if(_.isNil(obj.name) || obj.name === ''){
                        return vm.$message.warning('该司机信息不完整，请完善司机信息！');
                    }
                    if(obj.name === obj.id){
                        vm.addVehicleForm.dispatchVehicle.driverId = obj.id;
                        return;
                    }
                    vm.addVehicleForm.dispatchVehicle.driverId = obj.id;
                    vm.addVehicleForm.dispatchVehicle.driverName = obj.name;
                    vm.addVehicleForm.dispatchVehicle.driverPhone = obj.mobile;
                    vm.addVehicleForm.dispatchVehicle.isDriverPhoneDisabled = true;
                    vm.driverObj = obj;
                }
            },
            //司机姓名2回调
            getDriverInfo2(obj) {
                let vm = this;
                vm.addVehicleForm.dispatchVehicle.spareDriverName = '';
                vm.addVehicleForm.dispatchVehicle.spareDriverPhone = "";
                vm.addVehicleForm.dispatchVehicle.isSpareDriverPhoneDisabled = false;
                if(!_.isNil(obj)){
                    vm.addVehicleForm.dispatchVehicle.spareDriverId = '';
                    if(obj.blacklist === true){
                        return vm.$message('此司机已被列入系统黑名单,不能选择!');
                    }
                    if(_.isNil(obj.name) || obj.name === ''){
                        return vm.$message.warning('该司机信息不完整，请完善司机信息！');
                    }
                    if(obj.name === obj.id){
                        vm.addVehicleForm.dispatchVehicle.spareDriverId = obj.id;
                        return;
                    }
                    vm.addVehicleForm.dispatchVehicle.spareDriverId = obj.id;
                    vm.addVehicleForm.dispatchVehicle.spareDriverName = obj.name;
                    vm.addVehicleForm.dispatchVehicle.spareDriverPhone = obj.mobile;
                    vm.addVehicleForm.dispatchVehicle.isSpareDriverPhoneDisabled = true;
                }
            },
            //承运方回调
            getShipperInfo(obj) {
                let vm = this;
                vm.resetShipperInfo();
                if(!vm.addVehicleForm.belongOrgCode) {
                    return vm.$message.info('请先维护所属区域信息!');
                }
                if(!_.isNil(obj)){
                    if(obj.reviewType === constData.AUDIT_STATUS[2].code){
                        vm.resetShipperInfo();
                        return vm.$message('此承运方审核未通过,不能选择!');
                    }
                    if (obj.blacklist === true) {
                        vm.resetShipperInfo();
                        return vm.$message('此承运方已被列入系统黑名单,不能选择!');
                    }
                    if (obj.operationStatus&&obj.operationStatus === constData.SUPPLIER_OPERATION_STATUS[5].code) {
                        vm.resetShipperInfo();
                        return vm.$message('该承运方状态为已作废，不允许进行派车操作！');
                    }
                    if (obj.operationStatus&&obj.operationStatus === constData.SUPPLIER_OPERATION_STATUS[4].code) {
                        vm.resetShipperInfo();
                        return vm.$message('该承运方状态为已过期，不允许进行派车操作！');
                    }
                    if (obj.operationStatus&&obj.operationStatus === constData.SUPPLIER_OPERATION_STATUS[0].code) {
                        vm.resetShipperInfo();
                        return vm.$message('该承运方状态为审核中，不允许进行派车操作！');
                    }
                    let checkInvoice = vm.repayInfo.lineOutInviteList.length > 0 ? vm.repayInfo.lineOutInviteList : false;
                    let key = false;
                    if(checkInvoice){
                        checkInvoice.forEach((el) => {
                            if(el.supplier === obj.id){
                                key = el.isInvoice
                            }
                        })
                        if(key == '1'){
                            if(!vm.addVehicleForm.dispatchVehicle.ticket) vm.addVehicleForm.dispatchVehicle.ticket = true
                        }
                    }
                    if(key === false && obj.isExist&&obj.isExist === constData.IS_INVOICE[0].code){
                        if(!vm.addVehicleForm.dispatchVehicle.ticket) vm.addVehicleForm.dispatchVehicle.ticket = true
                    }
                    vm.addVehicleForm.dispatchVehicle.shipperCode = obj.id;
                    vm.addVehicleForm.dispatchVehicle.shipperName = obj.name;
                    vm.oilCardList = obj.oilCardList;
                    vm.shipperObj = obj;
                    vm.confirmLinkMan(vm.shipperObj)
                    //不同车长的外请应付--带出油卡金额
                    if(!this.selfOutsourceVehicle && !vm.addVehicleForm.dispatchVehicle.ticket && !_.isNil(this.repayInfo.lineOutInviteList) && this.repayInfo.lineOutInviteList.length>0){
                        if(this.payType === Constant.LINE_PRICE_TYPE.NORMAL){//按趟
                            for (let i = 0; i < this.repayInfo.lineOutInviteList.length; i++) {
                                if (this.repayInfo.lineOutInviteList[i].supplier === vm.addVehicleForm.dispatchVehicle.shipperCode && this.repayInfo.lineOutInviteList[i].priceType ===  Constant.LINE_PRICE_TYPE.NORMAL && this.repayInfo.lineOutInviteList[i].vehicleSize === vm.addVehicleForm.dispatchVehicle.specification && this.repayInfo.lineOutInviteList[i].oilCardAmount>0) {
                                    this.addVehicleForm.dispatchPrice.oilCardAmount = this.repayInfo.lineOutInviteList[i].oilCardAmount;
                                }
                            }
                            if(vm.addVehicleForm.dispatchVehicle.specification == 12.5 || vm.addVehicleForm.dispatchVehicle.specification == 13.5){
                                for (let i = 0; i < this.repayInfo.lineOutInviteList.length; i++) {
                                    if (this.repayInfo.lineOutInviteList[i].supplier === vm.addVehicleForm.dispatchVehicle.shipperCode && this.repayInfo.lineOutInviteList[i].priceType ===  Constant.LINE_PRICE_TYPE.NORMAL && (this.repayInfo.lineOutInviteList[i].vehicleSize == 12.5 || this.repayInfo.lineOutInviteList[i].vehicleSize == 13.5) && this.repayInfo.lineOutInviteList[i].oilCardAmount>0) {
                                        this.addVehicleForm.dispatchPrice.oilCardAmount = this.repayInfo.lineOutInviteList[i].oilCardAmount;
                                    }
                                }
                            }
                            if(vm.addVehicleForm.dispatchVehicle.specification == 16.5 || vm.addVehicleForm.dispatchVehicle.specification == 17.5){
                                for (let i = 0; i < this.repayInfo.lineOutInviteList.length; i++) {
                                    if (this.repayInfo.lineOutInviteList[i].supplier === vm.addVehicleForm.dispatchVehicle.shipperCode && this.repayInfo.lineOutInviteList[i].priceType ===  Constant.LINE_PRICE_TYPE.NORMAL && (this.repayInfo.lineOutInviteList[i].vehicleSize == 16.5 || this.repayInfo.lineOutInviteList[i].vehicleSize == 17.5) && this.repayInfo.lineOutInviteList[i].oilCardAmount>0) {
                                        this.addVehicleForm.dispatchPrice.oilCardAmount = this.repayInfo.lineOutInviteList[i].oilCardAmount;
                                    }
                                }
                            }
                        }else{//计重按方
                            for (let i = 0; i < this.repayInfo.lineOutInviteList.length; i++) {//外请应付查找油卡金额
                                if (this.repayInfo.lineOutInviteList[i].supplier === vm.addVehicleForm.dispatchVehicle.shipperCode && this.repayInfo.lineOutInviteList[i].oilCardAmount>0) {
                                    this.addVehicleForm.dispatchPrice.oilCardAmount = this.repayInfo.lineOutInviteList[i].oilCardAmount;
                                }
                            }
                        }
                    }
                }
            },
            //重置承运方回调带出的信息
            resetShipperInfo(){
                let vm = this;
                vm.addVehicleForm.dispatchVehicle.shipperCode = "";
                vm.addVehicleForm.dispatchVehicle.shipperName = "";
                vm.oilCardList = [];
                vm.addVehicleForm.dispatchVehicle.ticket = false;
                vm.addVehicleForm.dispatchPrice.oilCardAmount = '';
                vm.addVehicleForm.dispatchPrice.refuelingAmount = '';
                vm.addVehicleForm.dispatchPrice.useGps = false;
                vm.addVehicleForm.dispatchPrice.gpsCode = '';
                vm.shipperObj = null;
            },
            //是否开票
            ticketChange(val){
                let vm = this;
                if(vm.addVehicleForm.dispatchVehicle.shipperCode && val){
                    //清空应付明细
                    vm.addVehicleForm.dispatchPrice.refuelingVolume = "";
                    vm.addVehicleForm.dispatchPrice.oilCardNumber = "";
                    vm.addVehicleForm.dispatchPrice.oilCardAmount = "";
                    vm.addVehicleForm.dispatchPrice.oilCardBalance = "";
                    vm.addVehicleForm.dispatchPrice.useGps = false;
                }
            },
            //获取应收单价
            getReceiveUnitPrice(priceType, vehicleSize) {
                let vm = this;
                if(!_.isNil(vm.repayInfo.lineContract)){
                    if(priceType === Constant.LINE_PRICE_TYPE.NORMAL){//按趟
                        let vehicleSizeList = vm.repayInfo.lineContract.vehicleSizeList;
                        if(!vehicleSize || !vehicleSizeList) {
                            return '';
                        }
                        for (let i = 0; i < vehicleSizeList.length; i++) {
                            if (vehicleSizeList[i].vehicleSize == vehicleSize) {
                                return vehicleSizeList[i].unitPrice;
                            }
                        }
                        if(vehicleSize == 12.5 || vehicleSize == 13.5){//12米5和13米5的车价格通用
                            for (let i = 0; i < vehicleSizeList.length; i++) {
                                if (vehicleSizeList[i].vehicleSize == 12.5 || vehicleSizeList[i].vehicleSize == 13.5) {
                                    return vehicleSizeList[i].unitPrice;
                                }
                            }
                        }
                        if(vehicleSize == 16.5 || vehicleSize == 17.5){//16米5和17米5的车价格通用
                            for (let i = 0; i < vehicleSizeList.length; i++) {
                                if (vehicleSizeList[i].vehicleSize == 16.5 || vehicleSizeList[i].vehicleSize == 17.5) {
                                    return vehicleSizeList[i].unitPrice;
                                }
                            }
                        }
                    }else{
                        if(priceType === vm.repayInfo.lineContract.priceType){
                            return vm.repayInfo.lineContract.unitPrice;
                        }else{
                            return '';
                        }
                    }
                }
            },
            //获取应收价格
            getReceiveAmount(priceType, receiveUnitPrice, receiveAmount) {
                if(priceType !== Constant.LINE_PRICE_TYPE.NORMAL){
                    return 0;
                }
                if(receiveUnitPrice>0){
                    return receiveUnitPrice;
                }
                return receiveAmount
            },
            //获取应付计价方式
            getPaidPriceType(vehicleCode, vehicleNature, allDayVehicleData, shipperCode, receivePriceType, paidPriceType){
                if(vehicleNature === Constant.VEHICLE_OPERATION_MODE.OUTSOURCE){//合作车
                    for (let i = 0; i < this.repayInfo.lineOutsourceList.length; i++) {
                        if (this.repayInfo.lineOutsourceList[i].vehicle === vehicleCode) {
                            return Constant.LINE_PRICE_TYPE.NORMAL;
                        }
                    }
                }
                if(vehicleNature === Constant.VEHICLE_OPERATION_MODE.OUT_INVITE){//外请车
                    if(!_.isNil(allDayVehicleData)){
                        return Constant.LINE_PRICE_TYPE.ALL_DAY;
                    }
                    for (let i = 0; i < this.repayInfo.lineOutInviteList.length; i++) {//外请应付带出应付计价方式
                        if (this.repayInfo.lineOutInviteList[i].supplier == shipperCode) {
                            if(this.repayInfo.lineOutInviteList[i].priceType){
                                return this.repayInfo.lineOutInviteList[i].priceType
                            }
                        }
                    }
                }
                return paidPriceType;
            },
            //获取应付单价
            getPayUnitPrice(priceType, vehicleSize, nature, vehicleCode, shipperCode) {
                let vm = this;
                if(nature === Constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT){//自营车
                    return '';
                }
                if(nature === Constant.VEHICLE_OPERATION_MODE.OUTSOURCE){//合作车
                    if(!vehicleCode){
                        return '';
                    }
                    if(priceType !== Constant.LINE_PRICE_TYPE.NORMAL){
                        return '';
                    }
                    if (vm.repayInfo.lineOutsourceList.length > 0) {//遍历车牌号
                        for (let i = 0; i < vm.repayInfo.lineOutsourceList.length; i++) {
                            if (vm.repayInfo.lineOutsourceList[i].vehicle === vehicleCode) {
                                return vm.repayInfo.lineOutsourceList[i].outsourcePrice;
                            }
                        }
                    }
                }
                if(nature === Constant.VEHICLE_OPERATION_MODE.OUT_INVITE){//外请车
                    if(!shipperCode){
                        return '';
                    }
                    for (let i = 0; i < vm.repayInfo.lineOutInviteList.length; i++) {
                        if (vm.repayInfo.lineOutInviteList[i].supplier == shipperCode && vm.repayInfo.lineOutInviteList[i].priceType === priceType) {
                            if(priceType === Constant.LINE_PRICE_TYPE.NORMAL){//按趟
                                if(vm.repayInfo.lineOutInviteList[i].vehicleSize === vehicleSize){
                                    return vm.repayInfo.lineOutInviteList[i].priceUnit;
                                }
                            }else if(priceType === Constant.LINE_PRICE_TYPE.WEIGHT || priceType === Constant.LINE_PRICE_TYPE.VOLUME){
                                return vm.repayInfo.lineOutInviteList[i].priceUnit;
                            }else{
                                return ''
                            }
                        }
                    }
                    if(vehicleSize == 12.5 || vehicleSize == 13.5){//12米5和13米5的车价格通用
                        for (let i = 0; i < vm.repayInfo.lineOutInviteList.length; i++) {
                            if (vm.repayInfo.lineOutInviteList[i].supplier == shipperCode && vm.repayInfo.lineOutInviteList[i].priceType === priceType) {
                                if(priceType === Constant.LINE_PRICE_TYPE.NORMAL){//按趟
                                    if(vm.repayInfo.lineOutInviteList[i].vehicleSize == 12.5 || vm.repayInfo.lineOutInviteList[i].vehicleSize == 13.5){
                                        return vm.repayInfo.lineOutInviteList[i].priceUnit;
                                    }
                                }
                            }
                        }
                    }
                    if(vehicleSize == 16.5 || vehicleSize == 17.5){//16米5和17米5的车价格通用
                        for (let i = 0; i < vm.repayInfo.lineOutInviteList.length; i++) {
                            if (vm.repayInfo.lineOutInviteList[i].supplier == shipperCode && vm.repayInfo.lineOutInviteList[i].priceType === priceType) {
                                if(priceType === Constant.LINE_PRICE_TYPE.NORMAL){//按趟
                                    if(vm.repayInfo.lineOutInviteList[i].vehicleSize == 16.5 || vm.repayInfo.lineOutInviteList[i].vehicleSize == 17.5){
                                        return vm.repayInfo.lineOutInviteList[i].priceUnit;
                                    }
                                }
                            }
                        }
                    }
                    return ''

                }
            },
            //获取应付价格
            getPaidVehicleAmount(priceType, nature, selfOperationMode, receiveAmount, payUnitPrice, paidVehicleAmount) {
                if(priceType !== Constant.LINE_PRICE_TYPE.NORMAL){
                    return 0;
                }
                return payUnitPrice || paidVehicleAmount;
            },
            //计算利润率
            getProfitRate(receiveAmount,paidVehicleAmount){
                if(!(receiveAmount>0)){
                    return ''
                }
                if(!(paidVehicleAmount>0)){
                    return ''
                }
                if(receiveAmount == paidVehicleAmount){
                    return 0;
                }
                return ((receiveAmount - paidVehicleAmount)/receiveAmount);
            },
            //计算预付打卡
            getPrepaidCardAmount(vehicleNature,prepaidFlag,allDayVehicleData,ticket,prepaidCardAmount){
                if(vehicleNature==='SELF_SUPPORT'){//自营车无预付款
                    return '';
                }
                if(vehicleNature==='OUTSOURCE' && !prepaidFlag){//合作车不能预付款的为空
                    return '';
                }
                if(ticket){//开票的无预付款
                    return '';
                }
                if(!_.isNil(allDayVehicleData)){//包天车辆
                    return '';
                }
                return prepaidCardAmount;
            },
            //计算油卡金额
            getOilCardAmount(selfOutsourceVehicle,allDayVehicleData,shipperCode,ticket,specification,payType,oilCardAmount){
                if(selfOutsourceVehicle){//自营合作车无
                    return '';
                }
                if(ticket){//开票的无
                    return '';
                }
                if(!_.isNil(allDayVehicleData) && allDayVehicleData.oilCardAmount>0){//包天车辆有油卡金额
                    if(oilCardAmount>0){
                        return oilCardAmount;
                    }
                    return '';
                }
                return oilCardAmount;
            },
            //油卡回调
            getOilCardInfo(obj){
                let vm = this;
                if(obj){
                    vm.addVehicleForm.dispatchPrice.oilCardBalance = obj.balanceAmount;
                    if(obj.cardClaimStatus === 'UN_CLAIM'){
                        vm.addVehicleForm.dispatchPrice.oilCardNumber = '';
                        vm.addVehicleForm.dispatchPrice.oilCardBalance = '';
                        vm.$message.warning('未认领的油卡，不能选择！');
                        return;
                    }
                    if(obj.status === 'INVALID'){
                        vm.addVehicleForm.dispatchPrice.oilCardNumber = '';
                        vm.addVehicleForm.dispatchPrice.oilCardBalance = '';
                        vm.$message.warning('该油卡已作废，不能选择！');
                        return;
                    }
                    if(obj.oilCardType === 'INVALID'){
                        vm.addVehicleForm.dispatchPrice.oilCardNumber = '';
                        vm.addVehicleForm.dispatchPrice.oilCardBalance = '';
                        vm.$message.warning('该油卡已挂失，不能选择！');
                        return;
                    }
                    if(obj.kabanFlag){
                        vm.addVehicleForm.dispatchPrice.oilCardNumber = '';
                        vm.addVehicleForm.dispatchPrice.oilCardBalance = '';
                        vm.$message.warning('该油卡为卡班所有，不能选择！');
                        return;
                    }
                    if(obj.prohibit){
                        vm.addVehicleForm.dispatchPrice.oilCardNumber = '';
                        vm.addVehicleForm.dispatchPrice.oilCardBalance = '';
                        vm.$message.warning('该油卡已被禁用，不能选择！');
                        return;
                    }
                    //是固定油卡
                    if(vm.isFixedOilCard){
                        vm.addVehicleForm.dispatchPrice.oilCardBalance = '';
                        return;
                    }
                    if((obj.waybillCode || obj.oilCardType === 'IN_USE') && obj.waybillCode!==vm.currentRow.waybillCode){
                        vm.addVehicleForm.dispatchPrice.oilCardNumber = '';
                        vm.addVehicleForm.dispatchPrice.oilCardBalance = '';
                        vm.$message.warning('该油卡已被使用，不能选择！');
                        return;
                    }
                    if(vm.addVehicleForm.dispatchVehicle.vehicleNature === vm.constant.VEHICLE_OPERATION_MODE.OUT_INVITE && obj.cardholderType === 'VEHICLE'){
                        vm.addVehicleForm.dispatchPrice.oilCardNumber = '';
                        vm.addVehicleForm.dispatchPrice.oilCardBalance = '';
                        vm.$message.warning('该油卡已绑定车辆，不能选择！');
                    }
                }else{
                    vm.addVehicleForm.dispatchPrice.oilCardBalance = '';
                }

            },
            //计算油卡押金
            getOilCardDeposit(vehicleNature,shipper,ticket,oilCardAmount,hasDieselCard,oilCardNumber,paidVehicleAmount,allDayVehicleData){
                if(vehicleNature !== Constant.VEHICLE_OPERATION_MODE.OUT_INVITE){//非外请车不收押金
                    return ''
                }
                if(shipper){//选择了承运方不收押金
                    return ''
                }
                if(ticket){//开票的无押金
                    return ''
                }
                if(!(oilCardAmount>0)){//未输入油卡金额或输入了0，押金为空
                    return ''
                }
                if(hasDieselCard && !oilCardNumber){//有柴油联名卡，未选择卡号不收押金
                    return ''
                }
                if(!_.isNil(allDayVehicleData)){//包天车辆不收押金
                    return '';
                }
                if(paidVehicleAmount >= 5000){//应付车价大于等于5000收500块押金
                    return 500
                }
                return 200
            },
            //是否使用GPS
            useGpsChange(val) {
                let vm = this;
                if(!val){
                    vm.addVehicleForm.dispatchPrice.gpsCode = '';
                }
            },
            //gps回调
            getGpsInfo(obj){
                let vm = this;
                if(obj.cardClaimStatus === 'UN_CLAIM'){
                    vm.addVehicleForm.dispatchPrice.gpsCode = '';
                    vm.$message.warning('未认领的GPS，不能选择！');
                    return;
                }
                if(obj.status === 'INVALID'){
                    vm.addVehicleForm.dispatchPrice.gpsCode = '';
                    vm.$message.warning('该GPS已挂失，不能选择！');
                    return;
                }
                if(obj.waybillCode && obj.waybillCode!==vm.currentRow.waybillCode){
                    vm.addVehicleForm.dispatchPrice.gpsCode = '';
                    vm.$message.warning('该GPS已被使用，不能选择！');
                }
                if(obj.prohibit=='0'){
                    vm.addVehicleForm.dispatchPrice.gpsCode = '';
                    vm.$message.warning('该GPS已被禁用，不能选择！');
                }
            },
            //计算GPS押金
            getGpsDeposit(vehicleNature,shipper,ticket,useGps,allDayVehicleData){
                if(vehicleNature !== Constant.VEHICLE_OPERATION_MODE.OUT_INVITE){//非外请车不收押金
                    return ''
                }
                if(shipper){//选择了承运方不收押金
                    return ''
                }
                if(ticket){//开票的无押金
                    return ''
                }
                if(!useGps){//不使用gps，押金为空
                    return ''
                }
                if(!_.isNil(allDayVehicleData)){//包天车辆不收押金
                    return '';
                }
                return 500
            },
            //计算gps使用费
            getGpsFee(useGps,allDayVehicleData){
                if(!useGps){//不使用gps，不收使用费
                    return ''
                }
                if(!_.isNil(allDayVehicleData)){//包天车辆不收使用费
                    return '';
                }
                return 15
            },
            //计算货到打卡
            getDeliveryAmount(selfOutsourceVehicle,allDayVehicleData,ticket,deliveryAmount){
                if(selfOutsourceVehicle){//自营合作车
                    return '';
                }
                if(ticket){//开票的
                    return '';
                }
                if(!_.isNil(allDayVehicleData)){//包天车辆
                    return '';
                }
                return deliveryAmount;
            },
            //计算定点加油
            getRefuelingAmount(vehicleNature,ticket,oilCardAmount,refuelingAmount){
                if(vehicleNature !== Constant.VEHICLE_OPERATION_MODE.OUT_INVITE){//非外请车不使用定点加油
                    return ''
                }
                if(ticket){//开票不使用定点加油
                    return ''
                }
                if(!!oilCardAmount){//有油卡金额不能定点加油
                    return ''
                }
                return refuelingAmount
            },
            //计算回单押金
            getReturnDeposit(vehicleNature,returnDeposit){
                if(vehicleNature !== Constant.VEHICLE_OPERATION_MODE.OUT_INVITE){//非外请车不收押金
                    return ''
                }
                return returnDeposit || 100
            },
            //计算回单付款
            getReturnAmount(vehicleNature,paidVehicleAmount,prepaidCardAmount,oilCardAmount,oilCardDeposit,returnDeposit,gpsDeposit,gpsFee,deliveryAmount,refuelingAmount){
                if(vehicleNature !== Constant.VEHICLE_OPERATION_MODE.OUT_INVITE){
                    return ''
                }
                if(paidVehicleAmount >= 0 && paidVehicleAmount !== ''){
                    return (Common.util.numberFormat(paidVehicleAmount) - Common.util.numberFormat(prepaidCardAmount) - Common.util.numberFormat(oilCardAmount) - Common.util.numberFormat(oilCardDeposit) - Common.util.numberFormat(returnDeposit) - Common.util.numberFormat(gpsDeposit) - Common.util.numberFormat(gpsFee) - Common.util.numberFormat(deliveryAmount) - Common.util.numberFormat(refuelingAmount)).toFixed(1);
                }
                return ''
            },
            //关闭窗口
            close() {
                this.visible = false;
                this.$emit('close');
            },
            //确定提交表单
            submit() {
                let vm = this;
                vm.$refs.addVehicleForm.validate((valid) => {
                    if (valid) {
                        if(!vm.addVehicleForm.dispatchVehicle.trailerCode && vm.addVehicleForm.dispatchVehicle.specification>9.6){//未选择挂厢--非挂车
                            return vm.$message.warning('非挂车车型过长，请核查！')
                        }
                        if(vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.oilCardAmount) < vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.oilCardBalance)){
                            return vm.$message.warning('油卡余额不能大于油卡金额!');
                        }
                        // if(vm.addVehicleForm.dispatchPrice.paidPriceType === Constant.LINE_PRICE_TYPE.NORMAL && this.refuelingAmount>this.paidVehicleAmount*0.8){
                        //     return vm.$message.warning('定点加油金额不能大于应付金额的80%');
                        // }
                        if(vm.addVehicleForm.dispatchPrice.receivePriceType !== Constant.LINE_PRICE_TYPE.NORMAL && !vm.receiveUnitPrice){//应收计价方式计重/按方，必须有应收单价
                            return vm.$message.warning('应收计价方式为计重/按方，请先维护应收单价!');
                        }
                        if(vm.addVehicleForm.dispatchPrice.paidPriceType !== Constant.LINE_PRICE_TYPE.NORMAL && !vm.payUnitPrice){//应付计价方式计重/按方，必须有应付单价
                            return vm.$message.warning('应付计价方式为计重/按方，请先维护应付单价!');
                        }
                        if(_.isNil(vm.allDayVehicleData) && !this.selfOutsourceVehicle && vm.addVehicleForm.dispatchPrice.paidPriceType === Constant.LINE_PRICE_TYPE.NORMAL){
                            if(vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.paidVehicleAmount) < vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.prepaidCardAmount)){
                                return vm.$message.warning('预付打卡金额不能大于应付金额!');
                            }
                            if(vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.paidVehicleAmount) < vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.deliveryAmount)){
                                return vm.$message.warning('货到打卡金额不能大于应付金额!');
                            }
                            if(vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.paidVehicleAmount) < vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.deliveryAmount) + vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.prepaidCardAmount)){
                                return vm.$message.warning('预付打卡金额与货到打卡金额之和不能大于应付金额!');
                            }
                            if(vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.returnAmount) + vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.returnDeposit) < vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.paidVehicleAmount)*vm.tailPaymentRatio){
                                return vm.$message.warning(`回单付款金额与回单押金之和不能小于应付金额的${vm.tailPaymentRatio*100}%！`);
                            }
                        }
                        let warn1 = vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.paidVehicleAmount) > vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.receiveAmount) ? "应付金额大于应收金额! " : "";
                        let warn2 = vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.oilCardAmount) > vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.paidVehicleAmount) - vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.prepaidCardAmount) ? "油卡金额与预付打款之和大于应收金额!  " : "";
                        let warn3 = (vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.receiveAmount) - vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.paidVehicleAmount))/vm.common.util.numberFormat(vm.addVehicleForm.dispatchPrice.receiveAmount) > 0.25 ? "收益率大于25%! " : "";
                        let addVehicleForm =  _.cloneDeep(vm.addVehicleForm);
                        if (Array.isArray(addVehicleForm.salesman)) {
                            if (addVehicleForm.salesman.length > 0) {
                                addVehicleForm.salesman = _.join(addVehicleForm.salesman, ',');
                            } else {
                                addVehicleForm.salesman = '';
                            }
                        }
                        if (warn1 + warn2 + warn3) {
                            let newData = [];
                            const h = vm.$createElement;
                            newData.push(h('p', warn1));
                            newData.push(h('p', warn2));
                            newData.push(h('p', warn3));
                            newData.push(h('p', "是否继续?"));
                            vm.$confirm(h('div', newData), '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                if(vm.isStandby){
                                    Http.post(Api.dispatch.modifyDepartedDispatch, addVehicleForm, result => {
                                        vm.$message.success('修改完成！');
                                        vm.close();
                                    });
                                }else if(vm.type === CONFIRM){
                                    Http.post(Api.dispatch.confirm, addVehicleForm, result => {
                                        vm.$message.success('确认完成！');
                                        vm.close();
                                    });
                                }else {
                                    Http.post(Api.dispatch.modify, addVehicleForm, result => {
                                        vm.$message.success('修改完成！');
                                        vm.close();
                                    });
                                }
                            })
                        } else {
                            if(vm.isStandby){
                                Http.post(Api.dispatch.modifyDepartedDispatch, addVehicleForm, result => {
                                    vm.$message.success('修改完成！');
                                    vm.close();
                                });
                            }else if(vm.type === CONFIRM){
                                Http.post(Api.dispatch.confirm, addVehicleForm, result => {
                                    vm.$message.success('确认完成！');
                                    vm.close();
                                });
                            }else{
                                Http.post(Api.dispatch.modify, addVehicleForm, result => {
                                    vm.$message.success('修改完成！');
                                    vm.close();
                                });
                            }
                        }
                    }
                });
            },
            //确定收款账户信息
            getBankInfo(){
                if(!this.addVehicleForm.dispatchVehicle.shipperCode){//无承运方
                    return {
                        payee: !_.isNil(this.driverObj)?this.driverObj.payee:'',
                        dueBank: !_.isNil(this.driverObj)?this.driverObj.openingBank:'',
                        bankCardNo: !_.isNil(this.driverObj)?this.driverObj.dueBankCardNo:''
                    }
                }
                if(!this.addVehicleForm.dispatchVehicle.ticket){//不开票--取私账户
                    return {
                        payee: !_.isNil(this.shipperObj)?this.shipperObj.privatePayee:'',
                        dueBank: !_.isNil(this.shipperObj)?this.shipperObj.privateDueBank:'',
                        bankCardNo: !_.isNil(this.shipperObj)?this.shipperObj.privateDueBankCardNo:''
                    }
                }
                //取对公账户
                return {
                    payee: !_.isNil(this.shipperObj)?this.shipperObj.payee:'',
                    dueBank: !_.isNil(this.shipperObj)?this.shipperObj.dueBank:'',
                    bankCardNo: !_.isNil(this.shipperObj)?this.shipperObj.dueBankCardNo:''
                }
            },
            changeCarInviter(obj){
                let vm = this;
                if(!_.isNil(obj)){
                    vm.addVehicleForm.carInviter = `${obj.name} ${obj.username}`;
                }else{
                    vm.addVehicleForm.carInviter = '';
                }
            },
            businessTypeChange(val){
                let vm = this;
                if(val === 'SCATTERED_BUSINESS_TYPE'){
                    vm.addVehicleForm.salesman = [];
                    vm.addVehicleForm.carInviter = '';
                }
            },
            confirmLinkMan(obj){
                if(_.isNil(obj) || !obj.contact){
                    return
                }
                Http.get(Api.driver.getDriverByMobile, {params: {'mobile': obj.contact}}, result => {
                    if(result.result && result.result.name){
                        this.shipperObj.linkMan = result.result.name;
                    }
                })
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
    .hidden{
        visibility: hidden;
    }
</style>
