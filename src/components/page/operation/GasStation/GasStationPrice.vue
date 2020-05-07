<template>
    <el-container>
        <el-dialog title="维护油价详情" :visible.sync="Visible" width="90%" :top="marginTop" @close="close">
            <el-header class="content-header" height="">
                <el-form size="small" :model="oilCardVehicleForm" label-width="80px">
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="维护时间:" prop="maintenanceTime">
                                <el-date-picker
                                    v-model="oilCardVehicleForm.maintenanceTime"
                                    type="date"
                                    placeholder="选择日期时间"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item style="float:right;">
                                <el-button type="success" icon="el-icon-search" @click="gasStationSearchList">查询
                                </el-button>
                                <el-button type="warning" class="fa fa-repeat" @click="resetLineStoreSearchForm">&nbsp;&nbsp;重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-header>
            <el-main class="content-main">
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addGasStationPrice"
                           v-permission="'/gasStationPrice/add'">
                    新增油价
                </el-button>
                <el-table class="content-table" :data="oilCardVehicleResult.result"
                          element-loading-text="拼命加载中" size="small"
                          border fit>
                    <el-table-column label="加油站名称" prop="gasStationId"  min-width="220px" show-overflow-tooltip/>
                    <el-table-column label="油品种类" prop="oilsType" min-width="160px" >
                        <template  slot-scope="scope">
                            <dictionary-select-name :value="scope.row.oilsType" option-name="OILS_TYPE"/>
                        </template>
                    </el-table-column>
                    <template v-if="$_permission('/gasStationPrice/balancePrice')">
                        <el-table-column label="结算油价" prop="balancePrice" min-width="100px" show-overflow-tooltip/>
                    </template>
                    <el-table-column label="合作车油价" prop="operationPrice" min-width="100px" show-overflow-tooltip></el-table-column>
                    <el-table-column label="外请车油价" prop="outPrice" min-width="100px" show-overflow-tooltip></el-table-column>
                    <el-table-column label="开始维护时间" prop="startTime" min-width="150px" show-overflow-tooltip/>
                    <el-table-column label="结束维护时间" prop="endTime" min-width="150px" show-overflow-tooltip></el-table-column>
                    <el-table-column label="创建时间" prop="createTime" min-width="150px" show-overflow-tooltip/>
                    <el-table-column label="创建人" prop="createUser" min-width="140px" show-overflow-tooltip></el-table-column>
                    <el-table-column label="修改人" prop="modifyUser" min-width="140px" show-overflow-tooltip/>
                    <el-table-column label="修改时间" prop="modifyTime" min-width="140px" show-overflow-tooltip/>
                    <el-table-column header-align="center" align="center" label="操作" fixed="right" min-width="100px;" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" size="mini"
                                       @click="modifyGasPriceList(scope.row)"
                                       v-permission="'/gasStationPrice/modify'">修改
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChangeLineStore"
                        @current-change="handleCurrentChangeLineStore"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="oilCardVehicleForm.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="oilCardVehicleResult.totalCount">
                    </el-pagination>
                </div>
            </el-main>
        </el-dialog>
        <el-dialog title="新增油价信息" :visible.sync="addGasStationWin" width="800px" :before-close="handleClose">
            <el-form inline size="small" :model="addGasStationWinForm" label-width="120px"
                     ref="addGasStationWinForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="油品种类:" prop="oilsType">
                            <dictionary-select v-model="addGasStationWinForm.oilsType" style="display: block" option-name="OILS_TYPE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结算油价:" prop="balancePrice">
                            <el-input v-model="addGasStationWinForm.balancePrice" type="number" placeholder="请填写金额"
                                      style="width: 215px;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合作车油价:" prop="operationPrice">
                            <el-input v-model="addGasStationWinForm.operationPrice" type="number"
                                      placeholder="请填写金额"
                                      style="width: 215px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="外请车油价:" prop="outPrice">
                            <el-input v-model="addGasStationWinForm.outPrice" type="number" placeholder="请填写金额"
                                      style="width: 215px;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="维护时间:" prop="maintenanceTime">
                            <el-date-picker
                                v-model="addGasStationWinForm.maintenanceTime"
                                :default-time="['00:00:00','23:59:59']"
                                type="datetimerange"
                                range-separator="-"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                style="width: 595px;"
                                value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="submitGasStationPrice('addGasStationWinForm')">确 定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改油价信息" :visible.sync="modifyGasStationWin" width="800px" :before-close="handleClose">
            <el-form inline size="small" :model="modifyGasStationWinForm" label-width="120px"
                     ref="modifyGasStationWinForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="油品种类:" prop="oilsType" validateDisabled="true">
                            <dictionary-select v-model="modifyGasStationWinForm.oilsType" style="display: block" option-name="OILS_TYPE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结算油价:" prop="balancePrice">
                            <el-input v-model="modifyGasStationWinForm.balancePrice" type="number" placeholder="请填写金额"
                                      style="width: 215px;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合作车油价:" prop="operationPrice">
                            <el-input v-model="modifyGasStationWinForm.operationPrice" type="number"
                                      placeholder="请填写金额"
                                      style="width: 215px;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="外请车油价:" prop="outPrice">
                            <el-input v-model="modifyGasStationWinForm.outPrice" type="number" placeholder="请填写金额"
                                      style="width: 215px;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="维护时间:" prop="maintenanceTime">
                            <el-date-picker
                                v-model="modifyGasStationWinForm.maintenanceTime"
                                :default-time="['00:00:00','23:59:59']"
                                type="datetimerange"
                                range-separator="-"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                style="width: 595px;"
                                value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="modifyGasStationPrice('modifyGasStationWinForm')">确 定
                </el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'

    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            currentRowed: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                Visible: true,
                dialogVisible: false,//内层弹框
                showVehicle: false,
                addGasStationWin: false,
                modifyGasStationWin:false,
                modifyGasStationWinForm:{
                    gasStationId: '',
                    balancePrice: 0,
                    operationPrice: 0,
                    outPrice: 0,
                    startTime: undefined,
                    endTime: undefined,
                    maintenanceTime:[],
                    oilsType:''
                },
                // currentRowed: null,//操作行的数据
                oilCardVehicleForm: {//查询参数
                    id:'',
                    currentPage: 1,
                    pageSize: 10,
                    gasStationId: '',
                    maintenanceTime: ''
                },
                oilCardVehicleResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                addBaseOilCard: {
                    balancePrice: [
                        {required: true, message: '请选择油价', trigger: 'blur'},
                    ],
                    operationPrice: [
                        {required: true, message: '请选择油价', trigger: 'blur'},
                    ],
                    outPrice: [
                        {required: true, message: '请选择油价', trigger: 'blur'},
                    ],
                    maintenanceTime: [
                        {required: true, message: '请选择时间', trigger: 'blur'},
                    ],
                    oilsType:[
                        {required: true, message: '请选择油品', trigger: 'blur'},
                    ]
                },
                addGasStationWinForm: {
                    gasStationId: '',
                    balancePrice: 0,
                    operationPrice: 0,
                    outPrice: 0,
                    startTime: undefined,
                    endTime: undefined,
                    maintenanceTime: [],
                    oilsType:''
                },
                multipleSelection: [],
                ids: [],
            }
        },
        created() {
            this.addGasStationWinForm.gasStationId = this.currentRowed.id;
            this.oilCardVehicleForm.gasStationId = this.currentRowed.id;
            this.gasStationSearchList();
        },
        computed: {
            marginTop: function () {
                if (document.documentElement.clientHeight > 900) {
                    return "10vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "6vh";
                }
            }
        },
        watch: {
            //监听传入的visible参数
            visible(val) {
                if (val) {
                    this.Visible = val;
                }
            }
        },
        methods: {
            close() {
                this.Visible = false;
                this.$emit('close');
            },
            gasStationSearchList() {
                let vm = this;
                vm.oilCardVehicleForm.id=this.currentRowed.id,
                Http.get(Api.gasStationPrice.page, {params: vm.oilCardVehicleForm}, result => {
                    this.oilCardVehicleResult.result = result.result;
                    this.oilCardVehicleResult.totalCount = result.totalCount;
                    this.oilCardVehicleResult.currentPage = result.currentPage;
                    this.oilCardVehicleResult.pageSize = result.pageSize;
                })
            },
            handleSizeChangeLineStore(val) {
                this.oilCardVehicleForm.pageSize = val;
            },
            handleCurrentChangeLineStore(val) {
                this.oilCardVehicleForm.currentPage = val;
                this.gasStationSearchList();
            },
            handleSelectionChangeLineStore(val) {
                this.multipleSelection = val;
            },
            hideVehicle() {
                this.showVehicle = false;
            },
            showVehicleDetails(row) {
                this.currentRowed = row
                this.showVehicle = true;
            },
            addGasStationPrice() {
                this.addGasStationWin = true;
            },
            //新增
            submitGasStationPrice(formName) {
                let vm = this;
                vm.addGasStationWinForm.endTime = vm.addGasStationWinForm.maintenanceTime[vm.addGasStationWinForm.maintenanceTime.length - 1]
                vm.addGasStationWinForm.startTime = vm.addGasStationWinForm.maintenanceTime[vm.addGasStationWinForm.maintenanceTime.length - 2]
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.addGasStationWinForm.gasStationId=this.currentRowed.id
                        Http.post(Api.gasStationPrice.add, vm.addGasStationWinForm, function (res) {
                            vm.$message.success("新增成功");
                            vm.resetLineStoreSearchForm;
                            vm.gasStationSearchList();
                            vm.addGasStationWin = false;
                        })
                    }
                })
            },
            resetLineStoreSearchForm() {
                this.addGasStationWinForm = {
                    gasStationId: '',
                    balancePrice: 0,
                    operationPrice: 0,
                    outPrice: 0,
                    startTime: undefined,
                    endTime: undefined,
                    maintenanceTime: []
                },
                    this.oilCardVehicleForm = {//查询参数
                        currentPage: 1,
                        pageSize: 10,
                        gasStationId: '',
                        maintenanceTime: []
                    }
            },
            cancel() {
                this.addGasStationWin = false
                this.modifyGasStationWin=false
                this.addGasStationWinForm = {
                    gasStationId: '',
                    balancePrice: 0,
                    operationPrice: 0,
                    outPrice: 0,
                    startTime: undefined,
                    endTime: undefined,
                    maintenanceTime: []
                }, this.oilCardVehicleForm = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    gasStationId: '',
                    maintenanceTime: []
                },this.modifyGasStationWinForm={
                        gasStationId: '',
                        balancePrice: 0,
                        operationPrice: 0,
                        outPrice: 0,
                        startTime: undefined,
                        endTime: undefined,
                        maintenanceTime: []
                }
            },
            handleClose() {
                this.cancel();
            },
            //通过加油站ID回显
            modifyGasPriceList(row){
                let _this=this;
                Http.get(Api.gasStationPrice.getDeTailById, {params: {'id': row.id}}, result => {
                    _this.modifyGasStationWin=true;
                    if(result.result.startTime || result.result.endTime){
                        result.result.maintenanceTime = [result.result.startTime,result.result.endTime]
                    }
                    _this.modifyGasStationWinForm = result.result
                })
            },
            //修改油价
            modifyGasStationPrice(formName){
                let _this = this;
                _this.modifyGasStationWinForm.endTime = _this.modifyGasStationWinForm.maintenanceTime[_this.modifyGasStationWinForm.maintenanceTime.length - 1]
                _this.modifyGasStationWinForm.startTime = _this.modifyGasStationWinForm.maintenanceTime[_this.modifyGasStationWinForm.maintenanceTime.length - 2]
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.modifyGasStationWinForm.gasStationId=this.currentRowed.id
                        Http.post(Api.gasStationPrice.modify, _this.modifyGasStationWinForm, function (res) {
                            _this.$message.success("修改油价成功");
                            _this.gasStationSearchList();
                            _this.modifyGasStationWin = false;
                        })
                    }
                })
            }
        }
    }
</script>

