<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 设备管理</el-breadcrumb-item>
                <el-breadcrumb-item>油卡充值</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="油卡卡号:">
                            <el-input type="text" v-model="searchParam.cardNo" :clearable="true"
                                      placeholder="请输入卡号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input type="text" v-model="searchParam.vehicleCode" :clearable="true"
                                      placeholder="请输入车辆号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属组织:">
                            <org-select v-model="searchParam.orgCode" style="display: block;"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="充值状态:">
                            <dictionary-select option-name="OIL_RECHARGE_TYPE"
                                               v-model="searchParam.status" style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="充值类型:">
                            <dictionary-select option-name="OIL_RECHARGE_STATUS"
                                               v-model="searchParam.type" style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="批次号:">
                            <el-input v-model="searchParam.rechargeNum"
                                      :clearable=true placeholder="请输入充值批次号"></el-input>
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
                        <el-form-item label="合作公司:">
                            <dictionary-select option-name="OIL_CARD_COMPANY"
                                               v-model="searchParam.cardCompany"
                                               style="display: block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode" placeholder="请输入运单号" :clearable=true></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierId" style="display: block;"></supplier-select>
                        </el-form-item>
                    </el-col>
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
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="自营模式:">
                            <dictionary-select v-model="searchParam.selfSupportMode" style="display: block" size="small"
                                               option-name="SELF_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="油卡供应商:">
                            <dictionary-select v-model="searchParam.supplier"
                                               option-name="OIL_CARD_SUPPLIER"
                                               style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float:right" label-width="0">
                            <el-button type="text" v-show="!isMoreItemShow" @click="showMore" size="small">展开更多搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="showLess" size="small">收起搜索项<<
                            </el-button>
                            <el-button type="success" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchList()">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetWinform">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <div style="display: inline-flex;">
                <el-button size="mini" type="primary" @click="exportExcelMoney"
                           v-permission="'/oilCardRecharge/exportRecharge'">导出充值
                </el-button>
                <el-button v-if="exportLoading" v-permission="'/oilCardRecharge/export'" icon="el-icon-download"
                           type="primary" size="mini" @click="exportList">导出
                </el-button>
                <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
                </el-button>
                <el-button size="mini" type="primary" @click="inValidMoney" :disabled="this.disabled.inValidMoneys"
                           v-permission="'/oilCardRecharge/invalid'">作废
                </el-button>
                <el-button v-permission="'/oilCardRecharge/returnedDownload'" v-if="btnDownLoading"
                           icon="el-icon-download" type="primary" size="mini"
                           @click="templateDownload">圈回模板下载
                </el-button>
                <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>下载中...
                </el-button>
                <upload-excel v-permission="'/oilCardRecharge/returnedImport'" :importUrl="Api.oilCardRecharge.returned"
                              @success="uploadSuccess" btn-name="圈回导入" style="margin: 0 10px 0 10px;"></upload-excel>
            </div>
            <el-table class="content-table" element-loading-text="拼命加载中"
                      :data="searchResult.result"
                      border fit
                      highlight-current-row stripe
                      @selection-change="handleSelectionChange"
                      size="small">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="申请流水号" prop="applyOperationNumber" width="150px;"></el-table-column>
                <el-table-column label="充值批次号" prop="rechargeBatchNumber" width="150px;"></el-table-column>
                <el-table-column label="卡号" prop="cardNo" width="200px;" show-overflow-tooltip/>
                <el-table-column label="油卡所属大区" prop="largeArea" width="200px;" show-overflow-tooltip/>
                <el-table-column label="所属组织" prop="applyOrgCode" width="200px;"></el-table-column>
                <el-table-column label="平台公司" prop="supplierName" width="200px;"></el-table-column>
                <el-table-column label="所属合作公司" prop="cardCompany" width="150px;">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OIL_CARD_COMPANY"
                                                :value="scope.row.cardCompany"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="车牌号" prop="vehicleCode" width="150px;"></el-table-column>
                <el-table-column label="车辆类型" prop="operationMode">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                :value="scope.row.operationMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="自营模式" prop="selfSupportMode">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SELF_OPERATION_MODE"
                                                :value="scope.row.selfSupportMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="结算模式" prop="settlementMode" width="100px;">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SETTLEMENT_MODE"
                                                :value="scope.row.settlementMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="充值金额" prop="rechargeAmount"></el-table-column>
                <el-table-column label="充值类型" prop="type">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OIL_RECHARGE_STATUS"
                                                :value="scope.row.type"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="油卡供应商" prop="supplier" width="200px;">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OIL_CARD_SUPPLIER"
                                                :value="scope.row.supplier"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="固定外请车" prop="outInviteFlag" width="100px;">
                    <template slot-scope="scope">
                        {{scope.row.outInviteFlag === true ? '是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column label="发车承运方" prop="dispatcherShipper" width="150px;"></el-table-column>
                <el-table-column label="是否卡班" prop="kabanFlag" min-width="120px">
                    <template slot-scope="scope">
                        {{scope.row.kabanFlag === true ? '是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column label="运单号" prop="waybillCode" width="200px;"></el-table-column>
                <el-table-column label="申请时间" prop="applyTime" width="150px;"></el-table-column>
                <el-table-column label="申请人" prop="applyUser" width="150px;"></el-table-column>
                <el-table-column label="充值状态" prop="status">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OIL_RECHARGE_TYPE"
                                                :value="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="充值方式" prop="rechargeMethod">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OIL_CARD_RECHARGE_METHOD"
                                                :value="scope.row.rechargeMethod"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="充值人" prop="rechargeUser" width="150px;"></el-table-column>
                <el-table-column label="充值时间" prop="rechargeTime" width="150px;"></el-table-column>
                <el-table-column label="充值理由" prop="rechargeRemark" width="150px;" show-overflow-tooltip/>
                <el-table-column label="作废备注" prop="remark" width="200px;" show-overflow-tooltip/>
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
        <el-dialog title="新增油卡充值信息" :visible.sync="addEtcWin" width="800px" :before-close="handleClose">
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
        <el-dialog title="修改油卡充值信息" :visible.sync="modifyOilCardWin" width="800px" :before-close="handleClose">
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
        <el-dialog title="预充值信息" :visible.sync="preRechargeOilCardWin" width="600px" :before-close="handleClose">
            <el-form size="small" :model="preRechargeForm" label-width="100px" ref="preRechargeForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="12" style="display: block">
                        <el-form-item label="油卡卡号:" prop="cardNo">
                            <oil-card-select v-model="preRechargeForm.cardNo"></oil-card-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" style="display: block">
                        <el-form-item label="预充值金额:" prop="preAmount">
                            <el-input type="number" placeholder="请填写金额"
                                      v-model="preRechargeForm.preAmount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="preRechargeList('preRechargeForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="作废备注" :visible.sync="inValidMoneyRemarkWin" width="600px" :before-close="handleClose">
            <el-form size="small" :model="inValidMoneyRemarkForm" label-width="100px" ref="inValidMoneyRemarkForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！"
                                      v-model="inValidMoneyRemarkForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="inValidMoneyRemarkWin = false">取 消</el-button>
                <el-button size="small" type="primary" @click="inValidate">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Api, Common, Http} from 'src/global';
    import axios from 'axios'

    export default {
        data() {
            return {
                exportLoading: true,
                Api: Api,
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    cardNo: '',
                    orgCode: '',
                    status: 'UN_RECHARGE',
                    vehicleCode: '',
                    supplier: '',
                    type: '',
                    rechargeStartTime: undefined,
                    rechargeEndTime: undefined,
                    rechargeNum: '',
                    applyNum: '',
                    operationMode: '',
                    selfSupportMode: '',
                    cardCompany: '',
                    rechargeTime: [],
                    waybillCode: '',
                    supplierId: '',
                    originType:'TMS'
                },//返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                isMoreItemShow: false,
                modifyOilCardWin: false,
                preRechargeOilCardWin: false,
                multipleSelection: [],
                addEtcWin: false,
                BindVehicleWin: false,
                btnDownLoading: true,
                inValidMoneyRemarkWin: false,
                inValidMoneyRemarkForm: {
                    oilCardResult: [],
                    remark: ''
                },
                BindVehicleForm: {
                    vehicleCode: '',
                    cardCodes: []
                },
                preRechargeForm: {
                    cardNo: '',
                    preAmount: undefined
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
                    ],
                    preAmount: [
                        {required: true, message: '请填写金额', trigger: 'blur'},
                        {pattern: /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/, message: '请输入正确的金额!'},
                    ],
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
                if (vm.searchParam.rechargeTime) {
                    vm.searchParam.rechargeStartTime = this.searchParam.rechargeTime[0];
                    vm.searchParam.rechargeEndTime = this.searchParam.rechargeTime[1];
                }
                Http.get(Api.oilCardRecharge.page, {params: vm.searchParam}, result => {
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
                    cardNo: '',
                    vehicleCode: '',
                    status: '',
                    orgCode: '',
                    ApplyTime: '',
                    supplier: '',
                    status: '',
                    type: '',
                    rechargeNum: '',
                    applyNum: '',
                    operationMode: '',
                    cardCompany: '',
                    originType:'TMS'
                }
            },
            cancel() {
                this.addEtcWin = false;
                this.modifyOilCardWin = false
                this.BindVehicleWin = false
                this.preRechargeOilCardWin = false
                this.inValidMoneyRemarkWin = false
                this.inValidMoneyRemarkForm = {
                    oilCardResult: [],
                    remark: ''
                }
                this.preRechargeForm = {
                    cardNo: '',
                    preAmount: undefined
                }
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
                Http.get(Api.oilCardRecharge.getExcelData, {params: model}, result => {
                    //导出
                    let header = ['申请流水号', '充值批次号', '卡号', '油卡所属大区', '所属组织', '平台公司', '结算模式', '所属合作公司', '车牌号', '车辆类型', '自营模式', '充值金额', '充值类型', '供应商', '发车承运方', '是否卡班', '充值方式', '运单号', '申请时间', '申请人', '状态', '充值人', '充值时间', '充值理由', '作废备注'];
                    let filterVal = ['applyOperationNumber', 'rechargeBatchNumber', 'cardNo', 'largeArea', 'applyOrgCode', 'supplierName','settlementMode', {
                        type: 'dictionary',
                        'code': 'OIL_CARD_COMPANY',
                        'name': 'cardCompany'
                    }, 'vehicleCode', 'operationMode', {
                        type: 'dictionary',
                        'code': 'SELF_OPERATION_MODE',
                        'name': 'selfSupportMode'
                    }, 'rechargeAmount', 'type', {
                        type: 'dictionary',
                        'code': 'OIL_CARD_SUPPLIER',
                        'name': 'supplier'
                    }, 'dispatcherShipper',
                        {
                            type: 'function',
                            render: function (val) {
                                if (val.kabanFlag) {
                                    return val.kabanFlag === true ? '是' : '否'
                                }
                            }
                        },
                        {type: 'dictionary', 'code': 'OIL_CARD_RECHARGE_METHOD', 'name': 'rechargeMethod'},
                        'waybillCode', 'applyTime', 'applyUser', 'status', 'rechargeUser', 'rechargeTime', 'rechargeRemark', 'remark'];
                    Common.excel.downloadExl(result.result, header, filterVal, "油卡充值");
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
                            Http.post(Api.oilCardRecharge.unWorkMoney, ids, result => {
                                vm.searchList()
                            })
                        })
                    }
                })
            },
            inValidMoney() {
                this.inValidMoneyRemarkWin = true;
            },
            inValidate() {
                let vm = this
                var ids = []
                this.multipleSelection.forEach((item) => {
                    if (item.status == 'INVALIDED') {
                        this.$message.warning("该数据已作废");
                        return;
                    }
                    ids.push(item.id);
                    vm.inValidMoneyRemarkForm.oilCardResult = ids
                    Http.post(Api.oilCardRecharge.inValidMoney, vm.inValidMoneyRemarkForm, result => {
                        vm.inValidMoneyRemarkWin = false
                        vm.searchList()
                    })
                })
            },
            preRecharge() {
                this.preRechargeOilCardWin = true;
            },
            preRechargeList(formName) {
                let vm = this;
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.get(Api.oilCardRecharge.preRecharge, {
                            params: {
                                'cardNo': vm.preRechargeForm.cardNo,
                                'preAmount': vm.preRechargeForm.preAmount
                            }
                        }, function (res) {
                            vm.searchList();
                            vm.preRechargeOilCardWin = false;
                        })
                    }
                })
            },
            uploadSuccess() {
                let vm = this;
                vm.searchList();
            },
            templateDownload() {
                this.btnDownLoading = false;
                Common.excel.downloadExl([], ["申请流水号"], null, '油卡圈回模板');
                this.btnDownLoading = true;
            },
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.oilCardRecharge.export, {
                    params: {
                        'rechargeStartTime': vm.searchParam.rechargeTime[0],
                        'rechargeEndTime': vm.searchParam.rechargeTime[1],
                        'status': vm.searchParam.status,
                        'orgCode': vm.searchParam.orgCode,
                        'supplier': vm.searchParam.supplier,
                        'cardNo': vm.searchParam.cardNo,
                        'operationMode': vm.searchParam.operationMode,
                        'vehicleCode': vm.searchParam.vehicleCode,
                        'type': vm.searchParam.type,
                        'rechargeNum': vm.searchParam.rechargeNum,
                        'applyNum': vm.searchParam.applyNum,
                        'selfSupportMode': vm.searchParam.selfSupportMode,
                        'cardCompany': vm.searchParam.cardCompany,
                        'waybillCode': vm.searchParam.waybillCode,
                        'supplierId': vm.searchParam.supplierId,
                        'originType':vm.searchParam.originType,
                    },
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '油卡充值导出.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
        }
    }
</script>
