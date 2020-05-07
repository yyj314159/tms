<template>
    <el-dialog :title="title" :visible.sync="visible" width="80%" @close="$emit('close')">
        <el-form size="small" :model="sendSupplierForm" ref="sendSupplierForm" :rules="sendSupplierFormRules" label-width="100px">
            <el-row>
                <el-col :span="3">
                    <el-form-item>
                        <el-row>
                            <el-col>
                                &nbsp;<el-button type="primary" size="mini" @click="showLineSelect = true" v-if="this.from!=='dispatch'">选择线路</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="业务类型:" prop="businessType">
                        <dictionary-select :exclude-options="excludeBusinessArr" :disabled="businessTypeDisabled" v-model="sendSupplierForm.businessType" option-name="LINE_BUSINESS_TYPE" style="display:block" @change="businessTypeChange"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="预计发车:" prop="expectDepartureTime">
                        <el-date-picker style="display:block; width:100%;" v-model="sendSupplierForm.expectDepartureTime" :default-time="defaultTime"
                                        value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="业务员:"  prop="salesman" :rules="[{required: salesmanRequired, message: '请选择业务员', trigger: 'blur'}]">
                        <multiple-user-select v-model="sendSupplierForm.salesman" style="display:block;"></multiple-user-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">
                    <el-form-item>
                        &nbsp;
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="请车员:"  prop="carInviter">
                        <all-user-select style="display:block;" placeholder="请输入请车员"  v-model="sendSupplierForm.carInviter" @change-option="changeCarInviter"></all-user-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="客户订单:" prop="customerOrderCode">
                        <el-input placeholder="请输入客户订单"  v-model="sendSupplierForm.customerOrderCode" :disabled="from!=='dispatch'"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">
                    <el-form-item>
                        <span class="blue">车辆信息</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="厢型:" prop="vanType">
                        <dictionary-select v-model="sendSupplierForm.vanType" option-name="VEHICLE_COMPARTMENT_TYPE" style="display:block;"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="车型:" prop="specification">
                        <dictionary-select v-model="sendSupplierForm.specification" option-name="VEHICLE_SPECIFICATION" style="display:block;" @change="sendSupplierForm.receiveAmount=''"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="供应商:" prop="supplierCode">
                        <supplier-select ref="supplier" v-model="sendSupplierForm.supplierCode" style="display:block;" disabled></supplier-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">
                    <el-form-item>
                        <span class="blue">应收信息</span>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="计价方式:" prop="receivePriceType" :rules="[{required: true, message: '请选择计价方式', trigger: 'blur'}]">
                        <dictionary-select :exclude-options="['ALL_DAY']" v-model="sendSupplierForm.receivePriceType" :clearable="false" option-name="LINE_PRICE_TYPE"
                                           style="display: block"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" :class="{'hidden': receiveUnitPrice>0 }">
                    <el-form-item label="应收金额:" prop="receiveAmount" :rules="[{required: normalReceiveType, message: '请输入应收金额', trigger: 'blur'}, Validate.money]">
                        <el-input :value="receiveAmount" @input="val=>sendSupplierForm.receiveAmount=val" placeholder=" 元" :disabled="!normalReceiveType || receiveUnitPrice>0"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="3">
                    <el-form-item>
                        &nbsp;
                    </el-form-item>
                </el-col>
                <el-col :span="18">
                    <el-form-item label="备注信息：">
                        <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="sendSupplierForm.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="width: 70%; margin: 0 auto;">
            <el-button size="small" style="margin-left: 50px;" @click="$emit('close')"> 取&nbsp;&nbsp;&nbsp;&nbsp; 消 </el-button>
            <el-button size="small" type="primary" v-loading="submitLoading" @click="submit"> 确&nbsp;&nbsp;&nbsp;&nbsp; 定 </el-button>
        </div>
        <line-select v-if="showLineSelect" :dialog-visible="showLineSelect" @close="hideLineSelect"></line-select>
    </el-dialog>
</template>

<script>
    import {Http, Api, Common, Constant, Validate} from 'src/global'
    import lineSelect from '../Line/lineSelect'
    import dataDictionary from 'src/components/common/data/data.js'


    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            currentRow: {
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
            from: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                visible: this.dialogVisible,//窗口显示/隐藏
                Validate: Validate,
                title: '',
                showLineSelect: false,//选择线路
                sendSupplierForm: {
                    code: "",//派车单编号
                    lineCode: "",//线路编码
                    businessType: "",//业务类型
                    expectDepartureTime: '',//预计发车时间
                    salesman: [],//业务员
                    carInviter: "",//请车员
                    customerOrderCode: '',//客户订单号
                    vanType: '',//厢型
                    specification: '',//车型
                    supplierCode: '',//供应商
                    receivePriceType: '',//应收计价方式
                    receiveAmount: '',//应收金额
                    remark: "",//备注
                },
                sendSupplierFormRules: {
                    businessType: [{required: true, message: '请选择业务类型', trigger: 'blur'}],//业务类型
                    expectDepartureTime: [{required: true, message: '请选择预计发车时间', trigger: 'blur'}],//预计发车时间
                    carInviter: [{required: true, message: '请选择请车员', trigger: 'blur'}],
                    customerOrderCode:  [{required: this.from!=='dispatch', message: '请填写客户订单号', trigger: 'blur'}],//客户订单号
                    vanType: [{required: true, message: '请选择车辆厢型', trigger: 'blur'}],//厢型
                    specification: [{required: true, message: '请选择车辆车型', trigger: 'blur'}],//车型
                    supplierCode:  [{required: true, message: '请选择供应商', trigger: 'blur'}],//供应商
                    receivePriceType: [{required: true, message: '请输入应收计价方式', trigger: 'blur'}],//车型
                    receiveAmount:  [{required: true, message: '请输入应收金额', trigger: 'blur'},Validate.money],//供应商
                },
                repayInfoObj: null,
                submitLoading: false,

                defaultTime: '',//默认预计发车时间的时间部分
                pickerOptions: {},
            }
        },
        mounted() {
            this.sendSupplierForm = Object.assign({}, this.sendSupplierForm, _.pick(this.currentRow, _.keys(this.sendSupplierForm)))
            //初始化派车单业务员回显
            if (this.sendSupplierForm.salesman && this.sendSupplierForm.salesman.length>0) {
                this.sendSupplierForm.salesman = _.split(this.sendSupplierForm.salesman, ',');
            }else {
                this.sendSupplierForm.salesman = [];
            }
            //如果车型不对置空
            let specList = _.cloneDeep(dataDictionary['VEHICLE_SPECIFICATION']).map((item)=>{
                return item.code;
            })
            if(this.sendSupplierForm.specification>0 && !specList.includes(this.sendSupplierForm.specification)){
                this.sendSupplierForm.specification = '';
            }
            if(this.currentLine && this.currentLine.code){
                this.hideLineSelect(this.currentLine);
            }
            //初始化线路数据回显
            if(this.currentRow && this.currentRow.code && this.currentRow.lineCode){
                this.initPage(this.from, this.currentRow.lineCode)
            }
        },
        computed:{
            //业务类型是否禁用
            businessTypeDisabled(){
                return this.sendSupplierForm.businessType === 'NEW_BUSINESS_TYPE';
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
                return this.sendSupplierForm.businessType === 'SCATTERED_BUSINESS_TYPE'
            },
            //应收按趟
            normalReceiveType(){
                return this.sendSupplierForm.receivePriceType === 'NORMAL';
            },
            //应收单价-----------------
            receiveUnitPrice() {
                if(_.isNil(this.repayInfoObj) || _.isNil(this.repayInfoObj.lineContract)){
                    return this.sendSupplierForm.receiveUnitPrice = ''
                }
                if(!this.normalReceiveType){//不按趟
                    if(this.sendSupplierForm.receivePriceType === this.repayInfoObj.lineContract.priceType){
                        return this.sendSupplierForm.receiveUnitPrice = this.repayInfoObj.lineContract.unitPrice;
                    }
                    return this.sendSupplierForm.receiveUnitPrice = ''
                }
                let vehicleSizeList = this.repayInfoObj.lineContract.vehicleSizeList;
                if(!this.sendSupplierForm.specification || !vehicleSizeList || !vehicleSizeList.length) {
                    return this.sendSupplierForm.receiveUnitPrice = '';
                }
                for (let i = 0; i < vehicleSizeList.length; i++) {
                    if (vehicleSizeList[i].vehicleSize == this.sendSupplierForm.specification) {
                        return this.sendSupplierForm.receiveUnitPrice = vehicleSizeList[i].unitPrice;
                    }
                }
                if(this.sendSupplierForm.specification == 12.5 || this.sendSupplierForm.specification == 13.5){//12米5和13米5的车价格通用
                    for (let i = 0; i < vehicleSizeList.length; i++) {
                        if (vehicleSizeList[i].vehicleSize == 12.5 || vehicleSizeList[i].vehicleSize == 13.5) {
                            return this.sendSupplierForm.receiveUnitPrice = vehicleSizeList[i].unitPrice;
                        }
                    }
                }
                if(this.sendSupplierForm.specification == 16.5 || this.sendSupplierForm.specification == 17.5){//16米5和17米5的车价格通用
                    for (let i = 0; i < vehicleSizeList.length; i++) {
                        if (vehicleSizeList[i].vehicleSize == 16.5 || vehicleSizeList[i].vehicleSize == 17.5) {
                            return this.sendSupplierForm.receiveUnitPrice = vehicleSizeList[i].unitPrice;
                        }
                    }
                }
            },
            //应收价格
            receiveAmount:{
                get(){
                    if(!this.normalReceiveType){
                        return this.sendSupplierForm.receiveAmount = 0;
                    }
                    if(this.receiveUnitPrice>0){
                        return this.sendSupplierForm.receiveAmount = this.receiveUnitPrice;
                    }
                    return this.sendSupplierForm.receiveAmount = this.sendSupplierForm.receiveAmount;
                },
                set(val){
                    this.$emit('input',val)
                }
            },
        },
        components:{
            lineSelect
        },
        methods: {
            //初始化页面
            initPage(val, code){
                //获取合同线路应收付信息
                Http.get(Api.line.queryDetailById, {params: {'id': code}}, result => {
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
                    this.sendSupplierForm = Object.assign({}, this.sendSupplierForm, _.pick(this.currentRow, _.keys(this.sendSupplierForm)))
                    if(val==='dispatch'){//预派车单指派供应商
                        this.title = `指派供应商 ：【${this.currentRow.belongOrg.name}】 【${this.currentRow.customer.name}】 【${this.currentRow.dispatchLine.lineName}】 【出发站点：${this.currentRow.dispatchLine.startStation.name}】`
                        this.sendSupplierForm = Object.assign({}, this.sendSupplierForm, _.pick(this.currentRow.dispatchVehicle, _.keys(this.sendSupplierForm)))
                        this.sendSupplierForm = Object.assign({}, this.sendSupplierForm, _.pick(this.currentRow.dispatchPrice, _.keys(this.sendSupplierForm)))
                        //预计发车时间
                        if(this.currentRow.confirmStatus !== 'CONFIRM'){
                            this.sendSupplierForm.expectDepartureTime = '';
                        }
                        //初始化派车单业务员回显
                        if (this.sendSupplierForm.salesman && this.sendSupplierForm.salesman.length>0) {
                            this.sendSupplierForm.salesman = _.split(this.sendSupplierForm.salesman, ',');
                        }else {
                            this.sendSupplierForm.salesman = [];
                        }
                        this.sendSupplierForm.lineCode = this.currentRow.dispatchLine.id;
                        this.$nextTick(() => {
                            this.sendSupplierForm.supplierCode = this.currentRow.belongOrg.outsideSupplier.id;
                            this.$refs.supplier.setCurrentSupplier(this.currentRow.belongOrg.outsideSupplier)
                        })
                    }
                    //当前没有请车员的话，默认为登陆人员
                    if(!this.sendSupplierForm.carInviter){
                        this.sendSupplierForm.carInviter = `${this.$store.getters.user.name} ${this.$store.getters.user.username}`;
                    }
                    //么有业务员，设置默认业务员
                    if((!this.sendSupplierForm.salesman ||!(this.sendSupplierForm.salesman.length>0)) && !_.isNil(this.repayInfoObj) && this.repayInfoObj.salesmanList && this.repayInfoObj.salesmanList.length>0){
                        this.sendSupplierForm.salesman = this.repayInfoObj.salesmanList.split(',');
                    }
                    //没有应收计价方式，设置应收计价方式
                    if(!this.sendSupplierForm.receivePriceType && !_.isNil(this.repayInfoObj) && this.repayInfoObj.lineContract && this.repayInfoObj.lineContract.priceType){
                        this.sendSupplierForm.receivePriceType = this.repayInfoObj.lineContract.priceType
                    }
                })
            },
            //选择线路
            hideLineSelect(val){
                if(!_.isNil(val)){
                    this.sendSupplierForm.lineCode = val.id;
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
                        Http.get(Api.org.queryByCityCode, {params: {'cityCode': val.departStation.areaCode?val.departStation.areaCode:val.departStation.cityCode}}, result => {
                            //title
                            this.title = `指派供应商 ：【${result.result.name}】 【${val.customer.name}】【${val.name}】 【出发站点：${val.departStation.name}】`
                            //所属区域
                            this.sendSupplierForm.belongOrgCode = result.result.code;
                            this.sendSupplierForm.belongOrgName = result.result.name;
                            if(!_.isNil(result.result.outsideSupplier)){
                                this.sendSupplierForm.supplierCode = result.result.outsideSupplier.id;
                                this.$nextTick(()=>{
                                    this.$refs.supplier.setCurrentSupplier(result.result.outsideSupplier)
                                })
                            }
                            //设置业务类型
                            if(!this.repayInfoObj.businessType){
                                if(!!this.repayInfoObj.customer && !!this.repayInfoObj.customer.top && this.repayInfoObj.customer.top.newBusinessCustomer === '1'){
                                    this.sendSupplierForm.businessType = 'NEW_BUSINESS_TYPE';//新业务
                                }else{
                                    this.sendSupplierForm.businessType = "FIXATION_BUSINESS_TYPE";//传统业务
                                }
                            }else{
                                this.sendSupplierForm.businessType = this.repayInfoObj.businessType;//线路规定的业务类型
                            }
                            //当前没有请车员的话，默认为登陆人员
                            if(!this.sendSupplierForm.carInviter){
                                this.sendSupplierForm.carInviter = `${this.$store.getters.user.name} ${this.$store.getters.user.username}`;
                            }
                            //设置默认业务员
                            if(!_.isNil(this.repayInfoObj) &&this.repayInfoObj.salesmanList && this.repayInfoObj.salesmanList.length>0){
                                this.sendSupplierForm.salesman = this.repayInfoObj.salesmanList.split(',');
                            }
                            //没有应收计价方式，设置应收计价方式
                            if(!this.sendSupplierForm.receivePriceType && !_.isNil(this.repayInfoObj) && this.repayInfoObj.lineContract && this.repayInfoObj.lineContract.priceType){
                                this.sendSupplierForm.receivePriceType = this.repayInfoObj.lineContract.priceType
                            }
                        })
                    })
                }
                this.showLineSelect = false;
            },
            //选择业务类型
            businessTypeChange(val){
                if(val === 'SCATTERED_BUSINESS_TYPE'){
                    this.sendSupplierForm.salesman = [];
                    this.sendSupplierForm.carInviter = '';
                }
            },
            //选择业务员
            changeSalesman(obj){
                if(!_.isNil(obj)){
                    this.sendSupplierForm.salesman = `${obj.name} ${obj.username}`;
                }else{
                    this.sendSupplierForm.salesman = '';
                }
            },
            //选择请车员
            changeCarInviter(obj){
                if(!_.isNil(obj)){
                    this.sendSupplierForm.carInviter = `${obj.name} ${obj.username}`;
                }else{
                    this.sendSupplierForm.carInviter = '';
                }
            },
            //提交表单
            submit() {
                this.$refs.sendSupplierForm.validate((valid) => {
                    if (valid) {
                        this.submitLoading = true
                        let url='';
                        if(this.currentLine && this.currentLine.code){
                            url = Api.dispatch.tempAssignSupplier
                        }else{
                            url = Api.dispatch.assignSupplier
                        }
                        let sendSupplierForm =  _.cloneDeep(this.sendSupplierForm);
                        if (Array.isArray(sendSupplierForm.salesman)) {
                            if (sendSupplierForm.salesman.length > 0) {
                                sendSupplierForm.salesman = _.join(sendSupplierForm.salesman, ',');
                            } else {
                                sendSupplierForm.salesman = '';
                            }
                        }
                        Http.post(url, sendSupplierForm, result => {
                            this.$message.success('操作成功')
                            this.submitLoading = false
                            this.$emit('close');
                        }, err => {
                            this.submitLoading = false
                        })
                    };
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
    .hidden {
        visibility: hidden;
    }
</style>
