<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 车辆管理</el-breadcrumb-item>
                <el-breadcrumb-item>排班设定</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header height class="content-header">
            <el-form :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineId" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="创建时间:">
                            <el-date-picker v-model="searchParam.createTime" :default-time="['00:00:00', '23:59:59']"
                                            range-separator="至"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期" size="small" style="width: 100%"
                                            @change="initCreateTimeAndEndTime"
                                            type="daterange">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="含有空车标识:">
                            <dictionary-select v-model="searchParam.hasVehicle" option-name="ORDER_SCHEDULE_SHIFTS_HAS_VEHICLE_FLAG" style="display:block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="float: right">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" @click="resetSearchParam" size="small">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <!-- btn -->
            <el-button size="mini" type="primary" icon="el-icon-plus" v-permission="permission.add"
                       @click="addScheduleDialog">新增
            </el-button>
            <el-button icon="el-icon-download" type="primary" size="mini" style="margin-right: 9px" @click="getExcel"
                       v-permission="permission.getExcel">模板下载
            </el-button>
            <upload-excel :importUrl="Api.orderSchedule.upload" @success="uploadSuccess" btn-name="导入"
                          style="display: inline-block;" v-permission="permission.upload"></upload-excel>
            <export-button v-permission="permission.export" :href="Api.orderSchedule.export" :params="searchParam"
                           :download-name="'订单排班'" style="display: inline-block"></export-button>

            <!-- table -->
            <el-table class="content-table" size="small" :data="searchResult.result" element-loading-text="拼命加载中" border
                      fit highlight-current-row stripe>
                <el-table-column label="客户名称" header-align="center" min-width="150" prop="customer.name">
                    <template slot-scope="scope">
                        {{scope.row.customer ? scope.row.customer.name : ""}}
                    </template>
                </el-table-column>
                <el-table-column label="线路名称" header-align="center" min-width="300" prop="line.name">
                    <template slot-scope="scope">
                        {{scope.row.line?scope.row.line.name:""}}
                    </template>
                </el-table-column>
                <el-table-column label="始发站点" header-align="center" prop="line.departStation.name" min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.line ? (scope.row.line.departStation ? scope.row.line.departStation.name : "") : "" }}
                    </template>
                </el-table-column>
                <el-table-column label="经停站点" header-align="center" prop="type" min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.line ? scope.row.line.lineTransitStationStr : "" }}
                    </template>
                </el-table-column>
                <el-table-column label="目的站点" header-align="center" prop="type" min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.line ? (scope.row.line.destStation ? scope.row.line.destStation.name : "") : "" }}
                    </template>
                </el-table-column>
                <el-table-column label="排班规则" header-align="center" prop="ruleType" min-width="150"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SCHEDULE_TYPE" :value="scope.row.ruleType"/>
                    </template>
                </el-table-column>
                <el-table-column label="排班明细" header-align="center" prop="ruleContent" min-width="150">
                </el-table-column>
                <el-table-column label="创建时间" header-align="center" prop="createTime" width="180"/>
                <el-table-column label="创建人" header-align="center" prop="createUser" width="150"/>
                <el-table-column label="修改时间" header-align="center" prop="modifyTime" width="180"/>
                <el-table-column label="修改人" header-align="center" prop="modifyUser" width="150"/>
                <el-table-column label="操作" header-align="center" align="center" fixed="right" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini" v-permission="permission.modify"
                                   @click="editScheduleDialog(scope.row)"/>
                        <el-button type="text" icon="el-icon-delete" v-permission="permission.delete" size="mini"
                                   @click="deleteSchedule(scope.row)"/>
                    </template>
                </el-table-column>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>

        <!--新增或修改-->
        <el-dialog :title="scheduleEdit.title" :visible.sync="scheduleEdit.flag" width="60%" @close="scheduleEditClose">
            <el-form :model="scheduleEditForm" :rules="checkRule" ref="scheduleEditForm" label-width="120px"
                     size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="线路名称:" prop="lineId">
                            <line-select v-model="scheduleEditForm.lineId" style="display:block" isTmp="false"
                                         :isDisabled="scheduleEdit.isDisable"
                                         @lineClick="lineClick" ref="lineDom"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排班周期:" prop="ruleType">
                            <dictionary-select :clearable="false" style="display: block" option-name="SCHEDULE_TYPE"
                                               v-model="scheduleEditForm.ruleType" disabled/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="日期:">
                            <el-checkbox-group v-model="scheduleEditForm.ruleContent"
                                               v-if="scheduleEditForm.ruleType != dataDec['SCHEDULE_TYPE'][0].code">
                                <el-checkbox v-for="item in checkedList" :label="item" :key="item"
                                             style="margin-left:30px;">
                                    {{item}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 车辆司机新增或修改 -->
                <!-- <el-dialog :title="driverEdit.title" :visible.sync="driverEdit.flag" width="40%" @close="driverEditClose"
                            append-to-body>-->
                <!-- </el-dialog>-->
            </el-form>
            <el-form :model="driverEditForm" :rules="checkRule" ref="driverEditForm" label-width="120px"
                     size="small">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="车牌号码:" prop="vehicleCode">
                            <vehicle-select v-model="driverEditForm.vehicleCode" style="display:block;"
                                            :type="[constant.VEHICLE_TYPE.VAN,constant.VEHICLE_TYPE.TRACTOR]"
                                            @change-option="vehicleClick"
                                            :licenseNumber.sync="driverEditForm.licenseNumber"
                                            ref="vehicleDom"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="挂厢号码:" prop="trailerCode">
                            <vehicle-select ref="trailerLicenseNum" v-model="driverEditForm.trailerCode"
                                            @change-option="queryTrailerVehicleInfo"
                                            :disabled="driverEditForm.isTrailerLicenseNumDisabled"
                                            :type="[constant.VEHICLE_TYPE.TRAILER]"
                                            :licenseNumber.sync="driverEditForm.trailerLicenseNum"
                                            style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="班次:" prop="shifts">
                            <el-select :clearable="false" style="display: block"
                                       v-model="driverEditForm.shifts">
                                <el-option
                                    v-for="item in currentList"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="当前排班标识:" prop="nextShiftsFlag">
                            <dictionary-select v-model="driverEditForm.nextShiftsFlag" style="display:block;" option-name="ORDER_SCHEDULE_SHIFTS_NEXT_FLAG"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="供应商:" prop="supplierId">
                            <supplier-select ref="supplierSelect" v-model="driverEditForm.supplierId" types="CAR_TEAM,DEPARTMENT_OF_INFORMATION" is-exist="INVOICE" :disabled="supplierIdDisabled" placeholder="请输入供应商" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <el-button type="primary" @click="driverEditAdd()" size="small">添加</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table class="content-table" :data="driverEditFormList" element-loading-text="拼命加载中"
                      border fit
                      size="small"
                      highlight-current-row stripe>
                <el-table-column header-align="center" label="车牌号码" prop="vehicle.licenseNumber" min-width="180px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="挂厢号码" prop="trailerVehicle.licenseNumber" min-width="180px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="供应商" prop="supplier.name" min-width="200px" show-overflow-tooltip>
                </el-table-column>
                <el-table-column header-align="center" label="班次" prop="shifts" min-width="60px"></el-table-column>
                <el-table-column header-align="center" label="当前班次标识" prop="nextShiftsFlag" min-width="100px">
                    <template slot-scope="scope">
                        <datadictionary-name option-name="ORDER_SCHEDULE_SHIFTS_CURRENT_FLAG"
                                             :value="scope.row.nextShiftsFlag"></datadictionary-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="80px">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" size="mini" v-permission="permission.shiftsDelete"
                                   @click="deleteDriver(scope.$index,driverEditFormList)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bottom clearfix" style="margin-top: 20px; margin-left: 45%;">
                <el-button type="primary" @click="scheduleEditSubmit()" size="small">确定</el-button>
                <el-button size="small" @click="scheduleEditClose()">取消</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
    import {Http, Api, Constant, Common} from "src/global";
    import dataDec from "src/components/common/data/data.js";
    import DatadictionaryName from "../../common/select/DatadictionaryName";
    import axios from "axios";


    const MaxDay = 31; // 最大天数
    export default {
        components: {DatadictionaryName},
        data() {
            let user = this.$store.getters.user;
            return {
                constant: Constant,
                Api: Api,
                initializeModel:{},
                downloadUrl: Api.orderSchedule.getExcel,
                downloadName: '订单排班导入模板',
                exportLoading: true, // 导出状态
                searchParam: {
                    customerCode: "",
                    vehicleCode: "",
                    lineId: "",
                    ruleType: "",
                    createTime: [],//创建时间
                    startCreateTime: '',
                    endCreateTime: '',
                    currentPage: 1,
                    pageSize: 10,
                    hasVehicle: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                permission: {
                    /*权限*/
                    add: "/orderSchedule/add",
                    modify: "/orderSchedule/modify",
                    delete: "/orderSchedule/delete",
                    getExcel: "/orderSchedule/getExcel",
                    upload: "/orderSchedule/upload",
                    export: "/orderSchedule/export", //导出
                    shiftsAdd: "/orderScheduleShifts/add",// 班次新增
                    shiftsModify: "/orderScheduleShifts/modify",// 班次编辑
                    shiftsDelete: "/orderScheduleShifts/delete",// 班次删除
                },
                checkRule: {
                    lineId: [
                        {required: true, message: '请选择线路', trigger: 'blur'},
                    ],
                    // vehicleCode: [
                    //     {required: true, message: '请选择车牌', trigger: 'blur'},
                    // ],
                    // driverId: [
                    //     {required: true, message: '请选择司机姓名', trigger: 'blur'},
                    // ],
                    // driverMobile: [
                    //     {required: true, message: '请输入司机电话', trigger: 'blur'},
                    // ],
                    ruleType: [
                        {required: true, message: '请选择排班周期', trigger: 'blur'}
                    ],
                    shifts: [
                        {required: true, message: '请选择班次', trigger: 'blur'}
                    ],
                    supplierId: [
                        {required: true, message: '请选择供应商', trigger: 'blur'}
                    ],
                    trailerCode: [
                        {required: false, message: '请选择挂车', trigger: 'blur'}
                    ],
                },
                scheduleEdit: {
                    title: "",
                    flag: false,
                    type: '',
                    isDisable: false
                },
                scheduleEditForm: {
                    id: null,
                    ruleContent: [],
                    ruleType: dataDec["SCHEDULE_TYPE"][1].code,
                    vehicleCode: ''
                },
                checkedList: [],
                days: {
                    BY_WEEK: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                    BY_MONTH: this.monthSet()
                },
                dataDec: dataDec,
                scheduleList: [], // 当前的排班list
                driverEditForm: {
                    licenseNumber: '',
                    vehicleCode: '',
                    shifts: '',
                    nextShiftsFlag: false,
                    trailerCode: '',
                    supplierId: '',
                    trailerLicenseNum: '',
                    isTrailerLicenseNumDisabled: false
                },
                driverEditFormList:[],
                //查询
                searchPlanParam: {
                    orderScheduleId: null,
                    currentPage: 1,
                    pageSize: 10
                },
                planFlag: false,
                currentRow: {}, // 选取的当前排班
                maxNum: 1, // 可以选择的班次最大值
                currentList: [], // 可选择的班次列表
                nextShiftsFlagList: [],
                supplierIdDisabled: false, //新增修改班次窗口显示供应商
            };
        },
        created() {
            this.searchList();
        },
        mounted() {
        },
        watch: {
            "scheduleEditForm.ruleType": {
                handler: function (newVal, oldVal) {
                    if (newVal != dataDec["SCHEDULE_TYPE"][0].code) {
                        this.checkedList = this.days[newVal];
                    }
                    if (oldVal) {
                        this.scheduleEditForm.ruleContent = []
                    }
                },
                immediate: true
            }
        },
        methods: {
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            lineCheck() {
                if (this.scheduleEditForm.lineId) {
                    Http.get(Api.orderSchedule.hasSameOrderSchedule, {params: {lineId: this.scheduleEditForm.lineId}}, result => {
                        if (result.result) {
                            this.$message.error('该线路已存在排班，无法更改')
                            this.scheduleEditForm.lineId = ''
                        }
                    }, (err) => {
                        this.$message.error(err.message)
                    })
                }
            },
            vehicleClick(item) {
                if (item) {
                    this.driverEditForm.licenseNumber = item.licenseNumber
                    this.driverEditForm.vehicleCode = item.code
                    if (item.operationMode === 'OUT_INVITE') {
                        this.checkRule.supplierId[0].required = true;
                        this.supplierIdDisabled = false;
                    }
                    if (item.operationMode === 'SELF_SUPPORT' || item.operationMode === 'OUTSOURCE') {
                        this.driverEditForm.supplierId = '';
                        this.checkRule.supplierId[0].required = false;
                        this.supplierIdDisabled = true;
                    }
                    if (item.type === 'TRACTOR') {
                        this.checkRule.trailerCode[0].required = true;
                    } else {
                        this.checkRule.trailerCode[0].required = false;
                    }
                } else {
                    this.driverEditForm.licenseNumber = '';
                    this.driverEditForm.vehicleCode = '';
                    this.checkRule.supplierId[0].required = true;
                    this.supplierIdDisabled = false;
                    this.checkRule.trailerCode[0].required = false;
                }
                this.controlTractor(item)
            },
            queryTrailerVehicleInfo(item) {
                if (item) {
                    this.driverEditForm.trailerCode = item.code
                    this.driverEditForm.trailerLicenseNum = item.licenseNumber
                } else {
                    this.driverEditForm.trailerCode = '';
                    this.driverEditForm.trailerLicenseNum = ''
                }
            },
            creatList() {
                let res = []
                for (let i = 0; i < this.maxNum; i++) {
                    let obj = {
                        key: i + 1,
                        value: i + 1
                    }
                    res.push(obj)
                }
                this.currentList = res
            },
            async getMaxNum() {
                let allNum = 1 // 后台返回的是当前排班长度，加1得到可以选择的最大班次,编辑则就是当前长度
                await Http.get(Api.orderScheduleShifts.getMaxShifts, {params: {orderScheduleId: this.currentRow.id}}, result => {
                    this.maxNum = result.result + allNum
                    this.creatList()
                }, (err) => {
                    this.$message.error(err.message)
                })
            },
            handleSizeChangeSub(val) {
                let vm = this;
                vm.searchPlanParam.pageSize = val;
                this.getPlanList();
            },
            handleCurrentChangeSub(val) {
                let vm = this;
                vm.searchPlanParam.currentPage = val;
                this.getPlanList();
            },
            getExcel() {
                let vm = this;
                axios.get(vm.downloadUrl, {responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = vm.downloadName + '.xls';
                    link.click();
                }).catch(reason => {
                })
            },
            lineClick(item) {
                console.log(item)
                this.scheduleEditForm.lineName = item.name
                this.scheduleEditForm.departStationCode = item.departStationCode
                if (item) {
                    this.lineCheck()
                }
            },
            controlTractor(item) {
                if (item && item.type !== this.constant.VEHICLE_TYPE.TRACTOR) {
                    this.driverEditForm.isTrailerLicenseNumDisabled = true
                    this.driverEditForm.trailerCode = ''
                } else {
                    this.driverEditForm.isTrailerLicenseNumDisabled = false
                }
            },
            deleteDriver(index,rows) {
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    rows.splice(index, 1)
                    this.maxNum -=1;
                    this.creatList();
                })
            },
            driverEditAdd() {
                this.$refs.driverEditForm.validate((val) => {
                    if (val) {
                        let postData =_.cloneDeep( this.driverEditForm);
                        postData.orderScheduleLineId = this.currentRow.lineId
                        postData.orderScheduleId = this.currentRow.id
                        console.log(postData);
                        let supplier = this.$refs.supplierSelect.getObject();
                        if (supplier) {
                            let newSupplier = {
                                "name": supplier.name
                            }
                            postData.supplier = newSupplier;
                        }
                        let vehicle = this.$refs.vehicleDom.getObject();
                        if (vehicle) {
                            let newVehicle = {
                                'licenseNumber':vehicle.licenseNumber
                            }
                            postData.vehicle = newVehicle
                        }
                        let trailer = this.$refs.trailerLicenseNum.getObject();
                        if (trailer) {
                            let trailerVehicle = {
                                'licenseNumber':trailer.licenseNumber
                            }
                            postData.trailerVehicle = trailerVehicle
                        }
                        this.maxNum +=1;
                        this.creatList();
                        this.driverEditFormList.push(postData);
                    }
                })

            },
            driverEditClose() {
                this.checkRule.supplierId[0].required = true;
                this.supplierIdDisabled = false;
                this.resetDriverEditForm();
                this.driverEditFormList = [];
            },
            resetDriverEditForm() {
                this.driverEditForm = {
                    licenseNumber: '',
                    vehicleCode: '',
                    shifts: '',
                    nextShiftsFlag: false,
                    trailerCode: '',
                    supplierId: '',
                    trailerLicenseNum: '',
                    isTrailerLicenseNumDisabled: false
                }
            },
            resetSchedule() {
                this.scheduleEditForm = {
                    ruleType: dataDec["SCHEDULE_TYPE"][1].code,
                    ruleContent: [],
                    vehicleCode: '',
                    id: null
                }
            },
            monthSet() {
                let dayList = [];
                for (let i = 1; i <= MaxDay; i++) {
                    dayList.push(this.formatNum(i));
                }
                return dayList;
            },
            formatNum(num) {
                return num > 9 ? num.toString() : `0${num}`;
            },
            str2arr(str) {
                return str.split(",");
            },
            arr2str(arr) {
                return arr.join(",");
            },
            searchList() {
                let vm = this
                Http.get(Api.orderSchedule.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                    result.result.forEach((list, index) => {
                        if (list.ruleContentList) {
                            let ruleContent = [];
                            list.ruleContentList.forEach((rule, i) => {
                                if (rule == '1') {
                                    ruleContent.push('周一');
                                } else if (rule == '2') {
                                    ruleContent.push('周二');
                                } else if (rule == '3') {
                                    ruleContent.push('周三');
                                } else if (rule == '4') {
                                    ruleContent.push('周四');
                                } else if (rule == '5') {
                                    ruleContent.push('周五');
                                } else if (rule == '6') {
                                    ruleContent.push('周六');
                                } else if (rule == '7') {
                                    ruleContent.push('周日');
                                }
                            })
                            list.ruleContent = vm.arr2str(ruleContent);
                        }

                    })
                });
            },
            resetSearchParam() {
                this.searchParam = {
                    customerCode: "",
                    vehicleCode: "",
                    lineId: "",
                    ruleType: "",
                    createTime: [],//创建时间
                    startCreateTime: '',
                    endCreateTime: '',
                    currentPage: 1,
                    pageSize: 10,
                    hasVehicle: '',
                }
            },
            checkSchedule() {
                if (this.scheduleEditForm.ruleType == dataDec['SCHEDULE_TYPE'][0].code) {
                    return true
                }
                if (this.scheduleEditForm.ruleType != dataDec['SCHEDULE_TYPE'][0].code) {
                    return this.scheduleEditForm.ruleContent.length > 0 ? true : false
                }
            },
            addScheduleDialog() {
                this.scheduleEdit.flag = true;
                this.scheduleEdit.title = "新增排班";
                this.scheduleEdit.type = 'add'
                this.scheduleEdit.isDisable = false;
                this.maxNum = 1;
                this.creatList();
            },
            editScheduleDialog(item) {
                this.currentRow = item
                console.log(item)
                this.scheduleEdit.flag = true;
                this.scheduleEdit.type = 'edit'
                this.scheduleEdit.title = "修改排班";
                this.scheduleEdit.isDisable = true;
                this.scheduleEditForm = _.cloneDeep(item);
                // this.scheduleEditForm.ruleType = item.ruleType;
                if (this.scheduleEditForm.ruleType != dataDec["SCHEDULE_TYPE"][0].code) {
                    this.scheduleEditForm.ruleContent = typeof this.scheduleEditForm.ruleContent == 'string' ? this.scheduleEditForm.ruleContent.split(',') : this.scheduleEditForm.ruleContent
                }
                this.$nextTick(() => {
                    this.$refs.lineDom.setCurrentLine(item.line)
                })
                Http.get(Api.orderScheduleShifts.getByOrderScheduleId,{params:{"orderScheduleId":item.id}},result =>{
                    this.driverEditFormList = result.result;
                })
                this.getMaxNum();
            },
            deleteSchedule(item) {
                this.$confirm('删除本条数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.orderSchedule.delete, [item.id], result => {
                        this.$message.success('删除成功！');
                        this.searchList();
                    }, () => {
                        this.$message.error('删除失败')
                    })
                }).catch(() => {
                    console.log("用户操作取消")
                })
            },
            // 提交排班
            scheduleEditSubmit() {
                let vm = this
                if (!vm.checkSchedule()) {
                    this.$message.error('请选择排班周期')
                    return
                }
                let postData = {}
                postData.lineId = vm.scheduleEditForm.lineId
                postData.ruleType = vm.scheduleEditForm.ruleType
                postData.ruleContent = this.formatContent(this.scheduleEditForm.ruleContent, this.scheduleEditForm.ruleType)
                postData.orderScheduleShiftsList = this.driverEditFormList;
                if (this.scheduleEdit.type == 'add') {
                    this.$refs.scheduleEditForm.validate((val) => {
                        if (val) {
                            Http.post(Api.orderSchedule.addOrderSchedule, postData, result => {
                                console.log(result)
                                vm.searchList();
                                this.$message.success('新增成功')
                                this.scheduleEditClose()
                            }, (err) => {
                                this.$message.error(err.message)
                                this.scheduleEditClose()
                                vm.searchList();
                            });
                        }
                    })
                } else {
                    this.$refs.scheduleEditForm.validate((val) => {
                        if (val) {
                            postData.id = this.scheduleEditForm.id
                            Http.post(Api.orderSchedule.modifyRuleContent, postData, result => {
                                console.log(result)
                                vm.searchList();
                                this.$message.success('修改成功')
                                this.scheduleEditClose()
                            }, (err) => {
                                this.$message.error(err.message)
                                this.scheduleEditClose()
                                vm.searchList();
                            });
                        }
                    })
                }
                // let vm = this
                // if (this.scheduleEdit.type == 'add') {
                //     if (this.scheduleList.length == 0) {
                //         this.$message.error('排班列表中无数据，请先添加排班到排班列表，再点击保存')
                //         return
                //     }
                //     let postData = this.formatData()
                //     Http.post(Api.orderSchedule.addList, postData, result => {
                //         console.log(result)
                //         vm.searchList();
                //         this.$message.success('增加成功')
                //         this.scheduleEditClose()
                //     }, () => {
                //         this.$message.error('增加失败')
                //         this.scheduleEditClose()
                //         vm.searchList();
                //     });
                // } else {
                //     let postData = {
                //         id: this.scheduleEditForm.id,
                //         lineId: this.scheduleEditForm.lineId,
                //         vehicleCode: this.scheduleEditForm.vehicleCode,
                //         driverId: this.scheduleEditForm.driverId,
                //         driverMobile: this.scheduleEditForm.driverMobile,
                //         ruleType: this.scheduleEditForm.ruleType,
                //         ruleContent: this.formatContent(this.scheduleEditForm.ruleContent, this.scheduleEditForm.ruleType),
                //         departStationCode: this.scheduleEditForm.line.departStationCode
                //     }
                //     console.log(postData)
                //     this.$refs.scheduleEditForm.validate((val) => {
                //         if (val) {
                //             Http.post(Api.orderSchedule.modify, postData, result => {
                //                 console.log(result)
                //                 vm.searchList();
                //                 this.$message.success('修改成功')
                //                 this.scheduleEditClose()
                //             }, () => {
                //                 this.$message.error('修改失败')
                //                 this.scheduleEditClose()
                //                 vm.searchList();
                //             });
                //         }
                //     })
                // }
            },
            formatData() {
                let arr = []
                for (let i = 0; i < this.scheduleList.length; i++) {
                    let val = this.scheduleList[i]
                    let obj = {}
                    obj.lineId = val.lineId
                    obj.vehicleCode = val.vehicleCode
                    obj.driverId = val.driverId
                    obj.driverMobile = val.driverMobile
                    obj.driverName = val.driverName
                    obj.ruleType = val.ruleType
                    obj.ruleContent = this.formatContent(val.ruleContent, val.ruleType)
                    obj.departStationCode = val.departStationCode
                    arr.push(obj)
                }
                return arr
            },
            formatContent(val, type) {
                if (type != dataDec["SCHEDULE_TYPE"][1].code) return typeof val == 'string' ? val : this.arr2str(val)
                const WEEK = [{value: "周一", key: 1}, {value: "周二", key: 2}, {value: "周三", key: 3}, {
                    value: "周四",
                    key: 4
                }, {value: "周五", key: 5}, {value: "周六", key: 6}, {value: "周日", key: 7}]
                let list = typeof val == 'string' ? this.str2arr(val) : val
                let arr = []
                for (let i = 0; i < list.length; i++) {
                    let val = list[i]
                    for (let j = 0; j < WEEK.length; j++) {
                        if (val == WEEK[j].value) {
                            arr.push(WEEK[j].key)
                        }
                    }
                }

                return this.arr2str(arr.sort())
            },
            // 重置排班
            scheduleEditClose() {
                this.scheduleEdit.flag = false;
                this.scheduleList = []
                this.resetSchedule()
                this.$refs.scheduleEditForm.resetFields()
                this. driverEditClose();
            },
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            },
            initCreateTimeAndEndTime(date) {
                let vm = this;
                if (date) {
                    vm.searchParam.startCreateTime = date[0];
                    vm.searchParam.endCreateTime = date[1];
                } else {
                    vm.searchParam.startCreateTime = '';
                    vm.searchParam.endCreateTime = '';
                }
            },
            uploadSuccess() {
                let vm = this;
                vm.searchList();
            }
        }
    };
</script>
<style>
</style>

