<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 设备管理</el-breadcrumb-item>
                <el-breadcrumb-item>ETC充值</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="ETC卡号:">
                            <el-input v-model="searchParam.cardCode" style="display: block;" placeholder="请输入卡号"
                                      :clearable="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态">
                            <dictionary-select v-model="searchParam.status" style="display: block;"
                                               option-name="ETC_RECHARGE_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属分区:">
                            <org-select v-model="searchParam.belongOrgCode" style="display: block;"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="申请时间:">
                            <el-date-picker
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width:100%;"
                                v-model="searchParam.applyTime"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :clearable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="充值时间:">
                            <el-date-picker
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width:100%;"
                                v-model="searchParam.rechargeTime"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :clearable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="批次号:">
                            <el-input v-model="searchParam.rechargeNum" placeholder="请输入充值批次号"
                                      :clearable=true></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="流水号:">
                            <el-input v-model="searchParam.applyNum"
                                      :clearable=true placeholder="请输入流水号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆模式:">
                            <dictionary-select v-model="searchParam.operationMode" style="display: block" size="small"
                                               option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input v-model="searchParam.vehicleCode" style="display: block" :clearable="true" placeholder="请输入车牌号"
                                      :settlementMode="Constant.SETTLEMENT_MODE_TYPE.NO_LONG_TERM_OUT_INVITE"  size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="ETC供应商:">
                            <dictionary-select v-model="searchParam.supplier" style="display: block"
                                               size="small" option-name="ETC_SUPPILER"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="自营模式:">
                            <dictionary-select v-model="searchParam.supportMode" style="display: block"
                                               size="small" option-name="SELF_OPERATION_MODE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode" placeholder="运单号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float:right">
                            <el-button type="text" v-show="!isMoreItemShow" @click="showMore" size="small">展开更多搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="showLess" size="small">收起搜索项<<
                            </el-button>
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetWinform">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" @click="exportExcelMoney" v-permission="'/etcRecharge/apply'">导出充值
            </el-button>
            <el-button v-if="exportLoading" v-permission="'/etcRecharge/export'" icon="el-icon-download"
                       type="primary" size="mini" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-button size="mini" type="primary" @click="unWorkMoney" :disabled="this.disabled.unWorkMoneys"
                       v-permission="'/etcRecharge/cancel'">撤销
            </el-button>
            <el-button size="mini" type="primary" @click="inValidMoney" :disabled="this.disabled.inValidMoneys"
                       v-permission="'/etcRecharge/invalid'">作废
            </el-button>
            <el-table class="content-table" element-loading-text="拼命加载中"
                      :data="searchResult.result"
                      border fit
                      highlight-current-row stripe
                      @selection-change="handleSelectionChange"
                      size="small">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="申请流水号" prop="applyOperationNumber" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="充值批次号" prop="rechargeBatchNumber" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="卡号" prop="cardCode" min-width="200" show-overflow-tooltip/>
                <el-table-column label="所属组织" prop="belongOrgCode" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.vehicles.belongOrgCode}}
                    </template>
                </el-table-column>
                <el-table-column label="ETC供应商" prop="supplier" min-width="160">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ETC_SUPPILER" :value="scope.row.supplier"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="车牌号" prop="vehicleCode" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="车辆类型" prop="operationMode">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                :value="scope.row.operationMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="自营模式" prop="supportMode">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SELF_OPERATION_MODE"
                                                :value="scope.row.supportMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="平台公司" prop="platformCompanyName" width="200px;"></el-table-column>
                <el-table-column label="结算模式" prop="settlementMode" width="100px;">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SETTLEMENT_MODE"
                                                :value="scope.row.settlementMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="运单号" prop="waybillCode" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="充值金额" prop="rechargeAmount" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="申请时间" prop="applyTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="申请人" prop="applyUser" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="申请人组织" prop="applyOrgCode" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" prop="status" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ETC_RECHARGE_TYPE"
                                                :value="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="充值人" prop="rechargeUser" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="充值时间" prop="rechargeTime" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="充值备注" prop="rechargeRemark" min-width="160" show-overflow-tooltip/>
                <el-table-column label="备注" prop="remark" min-width="160" show-overflow-tooltip/>
            </el-table>
            <!--分页-->
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
        <el-dialog title="新增ETC卡信息" :visible.sync="addEtcWin" width="800px" :before-close="handleClose">
            <el-form inline size="small" :model="addEtcWinForm" label-width="120px" ref="addEtcWinForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车牌号" prop="vehicleCode">
                            <vehicle-select v-model="addEtcWinForm.vehicleCode"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="ETC卡号" prop="cardCode">
                            <el-input v-model="addEtcWinForm.cardCode" style="width: 215px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="每月额度:" prop="monthAmount">
                            <el-input type="number" placeholder="请填写金额" style="width: 215px;"
                                      v-model="addEtcWinForm.monthAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类型:" prop="type">
                            <dictionary-select v-model="addEtcWinForm.type"
                                               option-name="ETC_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商:" prop="supplierId">
                            <dictionary-select v-model="addEtcWinForm.supplierId"
                                               option-name="ETC_SUPPILER"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="submitEtcList('addEtcWinForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改ETC卡信息" :visible.sync="modifyOilCardWin" width="800px" :before-close="handleClose">
            <el-form inline size="small" :model="modifyForm" label-width="120px" ref="modifyForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车牌号" prop="vehicleCode">
                            <label style="width: 215px">{{modifyForm.vehicleCode}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="ETC卡号" prop="cardCode">
                            <label style="width: 215px">{{modifyForm.cardCode}}</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="每月额度:" prop="monthAmount">
                            <el-input type="number" placeholder="请填写金额" style="width: 215px;"
                                      v-model="modifyForm.monthAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类型:" prop="type">
                            <dictionary-select v-model="modifyForm.type"
                                               option-name="ETC_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商:" prop="supplierId">
                            <dictionary-select v-model="modifyForm.supplierId"
                                               option-name="ETC_SUPPILER"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="modifySubmitEtcList('modifyForm')">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Api, Common, Http,Constant} from 'src/global';
    import axios from 'axios'
    export default {
        data() {
            return {
                Constant:Constant,
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    cardCode: '',
                    belongOrgCode: '',
                    status: 'UN_RECHARGE',
                    applyStartTime: '',
                    applyEndTime: '',
                    supportMode:'',
                    rechargeStartTime: '',
                    rechargeEndTime: '',
                    rechargeNum: '',
                    applyNum: '',
                    applyTime: [],
                    rechargeTime: [],
                    vehicleCode: '',
                    waybillCode: '',
                    settlementMode:'NO_LONG_TERM_OUT_INVITE',
                    originType:'TMS'
                },//返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                exportLoading: true,
                isMoreItemShow: false,
                modifyOilCardWin: false,
                multipleSelection: [],
                addEtcWin: false,
                BindVehicleWin: false,
                BindVehicleForm: {
                    vehicleCode: '',
                    cardCodes: []
                },
                addEtcWinForm: {
                    cardCode: '',
                    supplierId: '',
                    orgCode: '',
                    type: '',
                    vehicleCode: '',
                    monthAmount: undefined,
                    status: '',
                    remark: '',
                    cityCodes: [],
                },
                modifyForm: {
                    cardCode: '',
                    supplierId: '',
                    orgCode: '',
                    type: '',
                    vehicleCode: '',
                    monthAmount: undefined,
                    status: '',
                    remark: '',
                    vehicleCode: [],
                },
                addBaseOilCard: {
                    cardCode: [
                        {required: true, message: '请输入卡号', trigger: 'blur'},
                        {pattern: /^\d{20}$/, message: '请输入20位的ETC卡号'}
                    ],
                    supplierId: [
                        {required: true, message: '请输入关联供应商', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'blur'},
                        {min: 1, max: 12, message: '请选择状态', trigger: 'blur'}
                    ],
                    mouthAmount: [
                        {required: true, message: '请填写金额', trigger: 'blur'},
                        {pattern: /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/, message: '请输入正确的金额!'},
                    ],
                    cityCode: [
                        {required: true, message: '请选择城市', trigger: 'blur'},
                        {min: 1, max: 12, message: '请选择城市', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择类型', trigger: 'blur'},
                        {min: 1, max: 12, message: '请选择类型', trigger: 'blur'}
                    ],
                    vehicleCode: [
                        {required: true, message: '请选择车辆', trigger: 'blur'},
                        {min: 1, max: 12, message: '请选择车辆', trigger: 'blur'}
                    ]
                },
                disabled: {
                    unWorkMoneys: true,
                    inValidMoneys: true,
                },
            }
        },
        mounted() {
            this.searchList();
        },
        watch: { //数据监听
            multipleSelection(val) {
                this.disabled.unWorkMoneys = val.length <= 0
                this.disabled.inValidMoneys = val.length <= 0
            }
        },
        methods: {
            //通用
            handleCurrentChange(val) {
                let vm = this
                vm.searchParam.currentPage = val
                this.searchList()
            },
            showMore() {
                let vm = this;
                vm.isMoreItemShow = true;
            },
            showLess() {
                let vm = this;
                vm.isMoreItemShow = false;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            handleSizeChange(val) {
                let vm = this
                vm.searchParam.pageSize = val
                this.searchList()
            },
            //新增
            addEtcList() {
                this.addEtcWin = true;
            },
            //新增
            submitEtcList(formName) {
                let vm = this;
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.etcManager.add, vm.addEtcWinForm, function (res) {
                            vm.searchList();
                            vm.addEtcWin = false;
                        })
                    }
                })
            },
            //查询
            searchList() {
                let vm = this;
                if (vm.searchParam.applyTime) {
                    vm.searchParam.applyStartTime = this.searchParam.applyTime[0];
                    vm.searchParam.applyEndTime = this.searchParam.applyTime[1];
                }
                if (vm.searchParam.rechargeTime) {
                    vm.searchParam.rechargeStartTime = this.searchParam.rechargeTime[0];
                    vm.searchParam.rechargeEndTime = this.searchParam.rechargeTime[1];
                }
                if (vm.searchParam.settlementMode==''||vm.searchParam.settlementMode==null){
                    vm.searchParam.settlementMode='NO_LONG_TERM_OUT_INVITE';
                }
                if (vm.searchParam.originType==''||vm.searchParam.originType==null||vm.searchParam.originType!='TMS'){
                    vm.searchParam.originType='TMS';
                }
                Http.get(Api.etcRecharge.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result
                    vm.searchResult.result.forEach((item) => {
                        if (!item.vehicles) {
                            item.vehicles = {}
                        }
                    })
                    vm.searchResult.totalCount = result.totalCount
                    vm.searchParam.currentPage = result.currentPage
                    vm.searchParam.pageSize = result.pageSize
                })
            },
            resetWinform() {
                let vm = this;
                vm.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    cardCode: '',
                    belongOrgCode: '',
                    status: 'UN_RECHARGE',
                    applyStartTime: '',
                    applyEndTime: '',
                    supportMode:'',
                    rechargeStartTime: '',
                    rechargeEndTime: '',
                    rechargeNum: '',
                    applyNum: '',
                    applyTime: [],
                    rechargeTime: [],
                    vehicleCode: '',
                    waybillCode: '',
                    settlementMode: 'NO_LONG_TERM_OUT_INVITE',
                    originType:'TMS'
                }
            },
            cancel() {
                this.addEtcWin = false;
                this.modifyOilCardWin = false
                this.BindVehicleWin = false
                this.addEtcWinForm = {
                    cardCode: '',
                    supplierId: '',
                    orgCode: '',
                    type: '',
                    vehicleCode: '',
                    monthAmount: undefined,
                    status: '',
                    remark: '',
                    cityCodes: [],
                },
                    this.modifyForm = {
                        cardCode: '',
                        supplierId: '',
                        orgCode: '',
                        type: '',
                        vehicleCode: '',
                        monthAmount: undefined,
                        status: '',
                        remark: '',
                        vehicleCode: [],
                    },
                    this.BindVehicleForm = {
                        vehicleCode: '',
                        cardCode: []
                    }
            },
            handleClose() {
                this.addEtcWin = false;
                this.modifyOilCardWin = false
                this.BindVehicleWin = false
                this.cancel();
            },
            deleteList(row) {
                let vm = this
                var ids = []
                ids.push(row.id)
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.etcManager.delete, ids, result => {
                        vm.searchList()
                    })
                })
            },
            // 通过ID数据回显
            modifyEtcList(row) {
                let vm = this;
                Http.get(Api.etcManager.getDeTailById, {params: {'id': row.id}}, result => {
                    vm.modifyForm = result.result
                    vm.modifyOilCardWin = true;
                })
            },
            modifySubmitEtcList(formName) {
                let vm = this;
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.etcManager.modify, vm.modifyForm, function (res) {
                            vm.searchList();
                            vm.modifyOilCardWin = false;
                        })
                    }
                })
            },
            exportExcelMoney() {
                let _this = this;
                let model = _.cloneDeep(_this.searchParam);
                model.pageSize = 3000;
                model.currentPage = 1;
                model.applyTime = new Date();
                Http.get(Api.etcRecharge.getExcelData, {params: model}, result => {
                    //导出GPS
                    let header = ['申请流水号', '充值批次号', '卡号', '所属组织','结算模式', 'ETC提供商','车牌号', '车辆模型','自营模式', '充值金额', '申请时间', '申请人', '申请人组织', '状态', '充值人', '充值时间','充值备注'];
                    let filterVal = ['applyOperationNumber', 'rechargeBatchNumber', 'cardCode',
                        'vehicles.belongOrgCode',,'settlementMode',{
                            type: 'dictionary',
                            'code': 'ETC_SUPPILER',
                            'name': 'supplier'
                        },'vehicleCode', 'operationMode', {
                            type: 'dictionary',
                            'code': 'SELF_OPERATION_MODE',
                            'name': 'supportMode'
                        }, 'rechargeAmount', 'applyTime', 'applyUser', 'applyOrgCode', 'status', 'rechargeUser', 'rechargeTime','rechargeRemark'];
                    Common.excel.downloadExl(result.result, header, filterVal, "ETC充值");
                })
            },
            unWorkMoney() {
                let vm = this
                var ids = []
                this.multipleSelection.forEach((item) => {
                    if (item.status !== 'UN_RECHARGE') {
                        this.$message.warning("只能撤销未充值的数据");
                    } else {
                        ids.push(item.id);
                        this.$confirm('是否撤回?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            Http.post(Api.etcRecharge.unWorkMoney, ids, result => {
                                vm.searchList()
                            })
                        })
                    }
                })
            },
            inValidMoney() {
                let vm = this
                var ids = []
                this.multipleSelection.forEach((item) => {
                    ids.push(item.id);
                })
                this.$confirm('是否作废?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.etcRecharge.inValidMoney, ids, result => {
                        vm.searchList()
                    })
                })
            },
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.etcRecharge.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = 'etc充值导出.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
        }
    }
</script>
