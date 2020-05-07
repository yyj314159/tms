<template>
    <el-container>
        <el-dialog :title="title" :visible.sync="lineBaseVisible" width="1000px" @close="close"
                   :append-to-body="isInside">
            <el-form size="small" inline :model="lineBaseForm" :rules="lineBaseFormRules" ref="lineBaseForm"
                     label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户:" prop="customerCode">
                            <customer-select v-model="lineBaseForm.customerCode" level="lowest"
                                             ref="refCustomerCode" auditStatus="PASS"
                                             :change="changeCustomerCodeInfo" style="width:200px"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出发站点:" prop="departStationCode">
                            <station-select v-model="lineBaseForm.departStationCode"
                                            :customerCode="customerCodeTmp" auditStatus="PASS"
                                            ref="refDepartStationCode" style="width:200px" @change="changeDepartStation">
                            </station-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="目的站点:" prop="destStationCode">
                            <station-select v-model="lineBaseForm.destStationCode"
                                            :customerCode="customerCodeTmp" auditStatus="PASS"
                                            ref="refDestStationCode" style="width:200px" @change="changeDestStation">
                            </station-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="发车时间:" prop="departTime">
                            <el-time-picker type="fixed-time" placeholder="请选择时间" format="HH:mm"
                                            value-format="HH:mm" v-model="lineBaseForm.departTime"
                                            style="width:200px"></el-time-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="线路类型:" prop="lineType">
                            <dictionary-select v-model="lineBaseForm.lineType" option-name="LINE_TYPE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="营运类型:" prop="operationType">
                            <dictionary-select v-model="lineBaseForm.operationType" option-name="LINE_OPERATION_TYPE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="总里程:" prop="distance">
                            <el-input v-model="lineBaseForm.distance" style="width:200px">
                                <template slot="append">公里</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户时效:" prop="timeHour">
                            <el-input v-model="lineBaseForm.timeHour" @input="changeTime1" style="width:93px">
                                <template slot="append">小时</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="timeMin">
                            <el-input v-model="lineBaseForm.timeMin" @input="changeTime2" style="width:93px">
                                <template slot="append">分钟</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="则一时效:" prop="timeZeyiHour">
                            <el-input v-model="lineBaseForm.timeZeyiHour" style="width:93px">
                                <template slot="append">小时</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="timeZeyiMin">
                            <el-input v-model="lineBaseForm.timeZeyiMin" style="width:93px">
                                <template slot="append">分钟</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="考核方式:" prop="evaluationMode">
                            <dictionary-select v-model="lineBaseForm.evaluationMode" option-name="LINE_EVALUATION_MODE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="业务类型:" prop="businessType">
                            <dictionary-select v-model="lineBaseForm.businessType" option-name="LINE_BUSINESS_TYPE"
                                               :disabled="lineBaseForm.lineBaseFormDisabled"
                                               :excludeOptions="lineBaseForm.exclude"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="回单类型:" prop="receiptType">
                            <dictionary-select v-model="lineBaseForm.receiptType"
                                               option-name="RECEIPT_TYPE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="业务员:" prop="salesmanList">
                            <MultipleUserSelect ref="salesmanUserNameList" style="width:200px" v-model="lineBaseForm.salesmanList"></MultipleUserSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="所属区域:" prop="belongOrgCode">
                            <current-org-select v-model="lineBaseForm.belongOrgCode" nature="PARTITION" style="display:block"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addStationInfo()">新增经停站点</el-button>
                <el-table size="small" class="content-table" :data="lineBaseForm.stationInfoList" border>
                    <el-table-column align="center" label="经停站点" prop="transitStationName"
                                     min-width="140"></el-table-column>
                    <el-table-column align="center" label="里程" prop="distance" min-width="100"></el-table-column>
                    <el-table-column align="center" label="客户时效" prop="travelTimeHour" min-width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.travelTimeHour ? scope.row.travelTimeHour:"0"}}小时</span>
                            <span>{{scope.row.travelTimeMin ? scope.row.travelTimeMin : "0"}}分钟</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column align="center" label="停留时间" prop="stayTime" width="130">
                         <template slot-scope="scope">
                             <span>{{scope.row.stayTimeHour ? scope.row.stayTimeZeyiHour : "0"}}小时</span>
                             <span>{{scope.row.stayTimeMin ? scope.row.stayTimeMin : "0"}}分钟</span>
                         </template>
                     </el-table-column>-->
                    <el-table-column align="center" label="则一时效" prop="travelTimeZeyi" min-width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.travelTimeZeyiHour ? scope.row.travelTimeZeyiHour : "0"}}小时</span>
                            <span>{{scope.row.travelTimeZeyiMin ?scope.row.travelTimeZeyiMin : "0"}}分钟</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column align="center" label="则一停留时间" prop="stayTimeZeyi" width="130">
                         <template slot-scope="scope">
                             <span>{{scope.row.stayTimeZeyiHour ? scope.row.stayTimeZeyiHour : "0"}}小时</span>
                             <span>{{scope.row.stayTimeZeyiMin ? scope.row.stayTimeZeyiMin : "0"}}分钟</span>
                         </template>
                     </el-table-column>-->
                    <el-table-column align="center" label="操作" fixed="right" min-width="100">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" size="mini"
                                       @click="modifyStationInfo(scope.$index,scope.row)"></el-button>
                            <el-button type="text" icon="el-icon-delete" size="mini"
                                       @click="deleteStationInfo(scope.$index,lineBaseForm.stationInfoList)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
                <el-button size="small" type="primary" @click="saveBaseInfoLine('lineBaseForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 线路站点信息form -->
        <el-dialog title="线路站点信息" :visible.sync="stationInfoVisible" width="450px" append-to-body>
            <el-form size="small" inline :model="stationInfoForm" :rules="stationInfoFormRules" ref="stationInfoForm"
                     label-width="125px">
                <el-form-item label="经停站点:" prop="transitStationCode">
                    <station-select v-model="stationInfoForm.transitStationCode" @change="obj=>stationInfoForm.transitStation=obj"
                                    :customerCode="customerCodeTmp" auditStatus="PASS"
                                    ref="refTransitStationCode"
                                    :stationName.sync="stationInfoForm.transitStationName" >
                    </station-select>
                </el-form-item>
                <el-form-item label="里程:" prop="distance">
                    <el-input v-model="stationInfoForm.distance" style="width:215px">
                        <template slot="append">公里</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="客户时效:" prop="travelTimeHour">
                    <el-input v-model="stationInfoForm.travelTimeHour" style="width:100px" @input="syncTime1">
                        <template slot="append">小时</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="travelTimeMin">
                    <el-input v-model="stationInfoForm.travelTimeMin" style="width:100px" @input="syncTime2">
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>
                <!--<el-form-item label="停留时间:" prop="stayTimeHour">
                    <el-input v-model="stationInfoForm.stayTimeHour" style="width:130px" @input="syncTime3">
                        <template slot="append">小时</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="stayTimeMin">
                    <el-input v-model="stationInfoForm.stayTimeMin" style="width:130px" @input="syncTime4">
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>-->

                <el-form-item label="则一时效:" prop="travelTimeZeyiHour">
                    <el-input v-model="stationInfoForm.travelTimeZeyiHour" style="width:100px">
                        <template slot="append">小时</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="travelTimeZeyiMin">
                    <el-input v-model="stationInfoForm.travelTimeZeyiMin" style="width:100px">
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>
                <!-- <el-form-item label="则一停留时间:" prop="stayTimeZeyiHour">
                     <el-input v-model="stationInfoForm.stayTimeZeyiHour" style="width:130px">
                         <template slot="append">小时</template>
                     </el-input>
                 </el-form-item>
                 <el-form-item prop="stayTimeZeyiMin">
                     <el-input v-model="stationInfoForm.stayTimeZeyiMin" style="width:130px">
                         <template slot="append">分钟</template>
                     </el-input>
                 </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="stationInfoVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="saveStationInfo(isModify)">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http, Api, Validate} from 'src/global';
    import MultipleUserSelect from "../../../common/select/MultipleUserSelect";


    export default {
        components: {MultipleUserSelect},
        props: {
            type: {
                type: String,
                default: ""
            },
            rowData: {
                type: Object,
                default: null
            },
            isInside: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isProjectCustomer:false,
                cityCode:'',
                areaCode:'',
                orgNature:'',
                topProjectCustomer:false,
                topBelongOrg:'',
                title: "",
                customerCodeTmp: '',
                lineBaseVisible: true,
                stationInfoVisible: false,
                isModify: true,
                stationInfoId: 0,
                isSubmitBtnDisabled: false,//提交按钮控制
                lineBaseForm: {
                    salesmanList:[],
                    customerCode: '',
                    departStationCode: '',
                    departStation: {},
                    destStationCode: '',
                    destStation: {},
                    departTime: '',
                    operationType: 'ON_WORK',
                    lineType: 'ONCE',
                    evaluationMode: 'OPER_TIME',
                    businessType: 'FIXATION_BUSINESS_TYPE',
                    receiptType: '',
                    timeHour: '',
                    timeMin: '',
                    timeZeyiHour: '',
                    timeZeyiMin: '',
                    distance: '',
                    stationInfoList: [],
                    belongOrgCode:'',
                    lineBaseFormDisabled: false,
                    exclude: ['NEW_BUSINESS_TYPE'],
                },
                stationInfoForm: {
                    transitStationCode: '',
                    transitStationName: '',
                    transitStation: {},
                    distance: '',
                    travelTimeHour: '',
                    travelTimeMin: '',
                    stayTimeHour: '',
                    stayTimeMin: '',
                    travelTimeZeyiHour: '',
                    travelTimeZeyiMin: '',
                    stayTimeZeyiHour: '',
                    stayTimeZeyiMin: ''
                },
                lineBaseFormRules: {
                    customerCode: [
                        {required: true, message: '请输入客户', trigger: 'blur'}
                    ],
                    departStationCode: [
                        {required: true, message: '请输入出发站点', trigger: 'blur'}
                    ],
                    destStationCode: [
                        {required: true, message: '请输入目的站点', trigger: 'blur'}
                    ],
                    departTime: [
                        {required: true, message: '请输入发车时间', trigger: 'blur'}
                    ],
                    distance: [
                        {required: true, message: '请输入里程', trigger: 'blur'},
                        Validate.allNumber
                    ],
                    businessType:[
                        {required: true, message: '请选择业务类型', trigger: 'blur'}
                    ],
                    receiptType:[
                        {required: true, message: '请选择回单类型', trigger: 'blur'}
                    ],
                    timeHour: [
                        {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '格式不正确'}
                    ],
                    timeMin: [
                        {pattern: /^[1-5]?[0-9]$/, message: '格式不正确'}
                    ],
                    timeZeyiHour: [
                        {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '格式不正确'}
                    ],
                    timeZeyiMin: [
                        {pattern: /^[1-5]?[0-9]$/, message: '格式不正确'}
                    ],
                    lineType: [
                        {required: true, message: '请输入线路类型', trigger: 'blur'}
                    ]
                },
                stationInfoFormRules: {
                    transitStationCode: [
                        {required: true, message: '请输入经停站点', trigger: 'blur'}
                    ],
                    distance: [
                        {required: true, message: '请输入里程', trigger: 'blur'},
                        Validate.allNumber
                    ],
                    travelTimeHour: [
                        {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '格式不正确'}
                    ],
                    travelTimeMin: [
                        {pattern: /^[1-5]?[0-9]$/, message: '格式不正确'}
                    ],
                    stayTimeHour: [
                        {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '格式不正确'}
                    ],
                    stayTimeMin: [
                        {pattern: /^[1-5]?[0-9]$/, message: '格式不正确'}
                    ],
                    travelTimeZeyiHour: [
                        {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '格式不正确'}
                    ],
                    travelTimeZeyiMin: [
                        {pattern: /^[1-5]?[0-9]$/, message: '格式不正确'}
                    ],
                    stayTimeZeyiHour: [
                        {pattern: /^([1-9]\d*|[0]{1,1})$/, message: '格式不正确'}
                    ],
                    stayTimeZeyiMin: [
                        {pattern: /^[1-5]?[0-9]$/, message: '格式不正确'}
                    ]
                },
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            changeDepartStation(obj){
                this.lineBaseForm.departStation = obj;
                if(!!this.lineBaseForm.departStationCode && !!this.lineBaseForm.destStationCode){
                    this.getDistance([this.lineBaseForm.departStation,...(this.lineBaseForm.stationInfoList),this.lineBaseForm.destStation],'lineBaseForm');
                }
                this.cityCode=obj.areaCode;
                Http.get(Api.org.queryByCityCode, {params: {'cityCode':this.cityCode }}, result => {
                    this.orgNature = result.result.nature;
                    if (this.orgNature && this.orgNature === 'PARTITION') {
                        this.areaCode = result.result.code;
                        if (this.isProjectCustomer == false) {
                            this.lineBaseForm.belongOrgCode = this.areaCode
                        }
                    }
                })
            },
            changeDestStation(obj){
                this.lineBaseForm.destStation = obj
                if(!!this.lineBaseForm.departStationCode && !!this.lineBaseForm.destStationCode){
                    this.getDistance([this.lineBaseForm.departStation,...(this.lineBaseForm.stationInfoList),this.lineBaseForm.destStation],'lineBaseForm');
                }
            },
            //获取路线距离
            getDistance(path,form){
                let vm = this;
                let driving = new AMap.TruckDriving({
                    map: this.map,
                    policy:9,
                    size:4,
                    city:'beijing'
                });
                let newPath = path.map((item)=>{
                    if(!item.lng && !item.lat){
                        return {
                            lnglat: [item.transitStation.lng, item.transitStation.lat]
                        }
                    }
                    return {
                        lnglat: [item.lng,item.lat]
                    }
                })
                driving.search(newPath, function(status, result) {
                    if (status === 'complete') {
                        vm[form].distance = (result.routes[0].distance/1000).toFixed(2);
                    }
                });
            },
            init() {
                let vm = this;
                switch (vm.type) {
                    case "add":
                        vm.title = "新增线路基本信息";
                        break;
                    case "modify":
                        vm.title = "修改线路基本信息";
                        vm.modifyBaseLine(vm.rowData)
                        break;
                }
            },
            modifyBaseLine(row) {
                let vm = this;
                Http.get(Api.tmpLine.queryById, {params: {'id': row.id}}, result => {
                    vm.$nextTick(()=>{
                        vm.lineBaseForm = result.result;
                        vm.queryTopCustomerCode(result.result.customerCode);
                        if (vm.lineBaseForm.salesmanList) {
                            vm.lineBaseForm.salesmanList = vm.lineBaseForm.salesmanList.split(',');
                        }else{
                            vm.lineBaseForm.salesmanList = []
                        }
                        vm.$refs.refCustomerCode.setCurrentCustomer(result.result.customer);
                        vm.$refs.refDepartStationCode.setCurrentStation(result.result.departStation);
                        vm.$refs.refDestStationCode.setCurrentStation(result.result.destStation);
                    }, 0);
                })
            },
            queryTopCustomerCode(value) {
                let vm = this;
                if (value) {
                    Http.get(Api.customer.topLevelCustomer, {params: {'code': value}}, result => {
                        if (result.result) {
                            vm.customerCodeTmp = result.result.code;
                            if (!!result.result.newBusinessCustomer && result.result.newBusinessCustomer === '1') {
                                vm.lineBaseForm.exclude = []
                                vm.lineBaseForm.businessType = 'NEW_BUSINESS_TYPE';
                                vm.lineBaseForm.lineBaseFormDisabled = true;
                            } else {
                                vm.lineBaseForm.lineBaseFormDisabled = false;
                                vm.lineBaseForm.exclude = ['NEW_BUSINESS_TYPE']
                            }
                        }
                    });
                }
            },
            changeCustomerCodeInfo(value) {
                let vm = this;
                if (value) {
                    Http.get(Api.customer.topLevelCustomer, {params: {'code': value}}, result => {
                        vm.customerCodeTmp = result.result.code;
                        vm.topProjectCustomer=result.result.projectCustomer;
                        vm.topBelongOrg=result.result.belongArea;
                        setTimeout(function () {
                            vm.$refs.refDepartStationCode.clearStationList();
                            vm.$refs.refDestStationCode.clearStationList();
                        }, 0);
                        vm.lineBaseForm.departStationCode = "";
                        vm.lineBaseForm.destStationCode = "";
                        vm.lineBaseForm.stationInfoList = [];
                        if (!!result.result.newBusinessCustomer && result.result.newBusinessCustomer === '1') {
                            vm.lineBaseForm.exclude = []
                            vm.lineBaseForm.businessType = 'NEW_BUSINESS_TYPE';
                            vm.lineBaseForm.lineBaseFormDisabled = true;
                        } else {
                            vm.lineBaseForm.businessType = '';
                            vm.lineBaseForm.lineBaseFormDisabled = false;
                            vm.lineBaseForm.exclude = ['NEW_BUSINESS_TYPE']
                        }
                        Http.get(Api.customer.commonSelect, {params: {'code': value}}, result => {
                            if (result.result && result.result[0] && result.result[0].projectCustomer==true){
                                vm.lineBaseForm.belongOrgCode=result.result[0].belongArea;
                                vm.isProjectCustomer=true;
                            } else if (vm.topProjectCustomer && vm.topProjectCustomer==true){
                                vm.lineBaseForm.belongOrgCode=vm.topBelongOrg;
                                vm.isProjectCustomer=true;
                            }else{
                                vm.isProjectCustomer=false;
                            }
                        });
                    });

                }
            },
            addStationInfo() {
                let vm = this;
                vm.isModify = false;
                vm.stationInfoVisible = true;
            },
            modifyStationInfo(index, row) {
                let vm = this;
                vm.isModify = true;
                vm.stationInfoId = index;
                let data = JSON.parse(JSON.stringify(row));
                vm.stationInfoForm = data;
                setTimeout(() => {
                    let stationInfo = {};
                    stationInfo.code = data.transitStationCode;
                    stationInfo.name = data.transitStationName;
                    vm.$refs.refTransitStationCode.setCurrentStation(stationInfo);
                }, 0)
                vm.stationInfoVisible = true;
            },
            deleteStationInfo(index, stationInfoList) {
                stationInfoList.splice(index, 1);
                if(!!this.lineBaseForm.departStationCode && !!this.lineBaseForm.destStationCode){
                    this.getDistance([this.lineBaseForm.departStation,...(this.lineBaseForm.stationInfoList),this.lineBaseForm.destStation],'lineBaseForm');
                }
            },
            saveStationInfo(flag) {
                let vm = this;
                let currId = vm.stationInfoId;
                this.$refs.stationInfoForm.validate((valid) => {
                    if (valid) {
                        vm.stationInfoForm.lng = vm.stationInfoForm.transitStation.lng;
                        vm.stationInfoForm.lat = vm.stationInfoForm.transitStation.lat;
                        if (!flag) {
                            vm.lineBaseForm.stationInfoList.push(vm.stationInfoForm);
                        } else {
                            let stationInfoIndexData = vm.lineBaseForm.stationInfoList[currId];
                            _.merge(stationInfoIndexData, vm.stationInfoForm);
                        }
                        if(!!vm.lineBaseForm.departStationCode && !!vm.lineBaseForm.destStationCode){
                            vm.getDistance([vm.lineBaseForm.departStation,...(vm.lineBaseForm.stationInfoList),vm.lineBaseForm.destStation],'lineBaseForm');
                        }
                        vm.resetStationInfo();
                        vm.stationInfoVisible = false;
                    }
                });
            },
            resetStationInfo() {
                let vm = this;
                vm.stationInfoForm = {
                    transitStationCode: '',
                    transitStation: {},
                    distance: '',
                    travelTimeHour: '',
                    travelTimeMin: '',
                    stayTimeHour: '',
                    stayTimeMin: '',
                    travelTimeZeyiHour: '',
                    travelTimeZeyiMin: '',
                    stayTimeZeyiHour: '',
                    stayTimeZeyiMin: ''
                }
            },
            resetLineBaseForm() {
                let vm = this;
                vm.lineBaseForm = {
                    businessType:'',
                    newBusinessCustomer:'',
                    customerCode: '',
                    departStationCode: '',
                    departStation: {},
                    destStationCode: '',
                    destStation: {},
                    lineType: '',
                    operationType: '',
                    departTime: '',
                    evaluationMode: '',
                    timeHour: '',
                    timeMin: '',
                    timeZeyiHour: '',
                    timeZeyiMin: '',
                    distance: '',
                    stationInfoList: [],
                    lineBaseFormDisabled: false,
                    exclude: ['NEW_BUSINESS_TYPE'],
                }
            },
            //取消
            close(value) {
                this.lineBaseVisible = false;
                this.$emit('close', value);
            },
            changeTime1(value) {
                let vm = this;
                vm.lineBaseForm.timeZeyiHour = value;
            },
            changeTime2(value) {
                let vm = this;
                vm.lineBaseForm.timeZeyiMin = value;
            },
            syncTime1(value) {
                this.stationInfoForm.travelTimeZeyiHour = value;
            },
            syncTime2(value) {
                this.stationInfoForm.travelTimeZeyiMin = value;
            },
            syncTime3(value) {
                this.stationInfoForm.stayTimeZeyiHour = value;
            },
            syncTime4(value) {
                this.stationInfoForm.stayTimeZeyiMin = value;
            },
            saveBaseInfoLine(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let lineBaseForm = _.cloneDeep(vm.lineBaseForm);
                        if (Array.isArray(lineBaseForm.salesmanList)) {
                            if (lineBaseForm.salesmanList.length > 0) {
                                lineBaseForm.salesmanList = _.join(lineBaseForm.salesmanList,',');
                            }else{
                                lineBaseForm.salesmanList = '';
                            }
                        }
                        if (vm.type && vm.type == "add") {
                            vm.isSubmitBtnDisabled = true;
                            Http.post(Api.tmpLine.add, lineBaseForm, response => {
                                vm.resetLineBaseForm();
                                vm.close(response.result);
                                vm.customerCodeTmp = "";
                                vm.isSubmitBtnDisabled = false;
                                vm.$message.success("新增临时线路成功")
                            }, result => {
                                vm.isSubmitBtnDisabled = false;
                                vm.$message.error(result.message)
                            })
                        } else {
                            vm.isSubmitBtnDisabled = true;
                            Http.post(Api.tmpLine.modify, lineBaseForm, response => {
                                vm.resetLineBaseForm();
                                vm.close();
                                vm.customerCodeTmp = "";
                                vm.isSubmitBtnDisabled = false;
                                vm.$message.success("修改临时线路成功")
                            }, result => {
                                vm.isSubmitBtnDisabled = false;
                                vm.$message.error(result.message)
                            })
                        }
                    }
                });
            },
            changeOrgSelect(org) {
                if (org) {
                    this.lineBaseForm.belongOrgCode = org.code
                }else {
                    this.lineBaseForm.belongOrgCode = ''
                }
            },
        }
    }
</script>
<style>
    .el-input-group__append, .el-input-group__prepend {
        padding: 0 6px;
    }
</style>
