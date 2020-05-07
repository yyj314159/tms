<template xmlns="http://www.w3.org/1999/html">
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 设备管理</el-breadcrumb-item>
                <el-breadcrumb-item>ETC管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车牌号">
                            <vehicle-select :settlementMode="Constant.SETTLEMENT_MODE_TYPE.NO_LONG_TERM_OUT_INVITE" v-model="searchParam.vehicleCode" style="display: block;" :clearable="true" placeholder="请输入车牌号"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="ETC卡号:">
                            <etc-select v-model="searchParam.cardCode" style="display: block;"></etc-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车卡类型">
                            <dictionary-select v-model="searchParam.type" option-name="ETC_TYPE"
                                               style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <org-select v-model="searchParam.belongOrgCode" style="display: block;"></org-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="提供商:">
                            <dictionary-select v-model="searchParam.supplierId"
                                               option-name="ETC_SUPPILER" style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="认领:">
                            <dictionary-select v-model="searchParam.etcStatus"
                                               option-name="OIL_CLAIM" style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float:right">
                            <el-button type="success" icon="el-icon-search" @click="searchEtcList">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetWinform">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addEtcList"
                       v-permission="'/etcManager/add'">新增
            </el-button>
            <el-button size="mini" type="primary" @click="bindVehicle" :disabled="this.disabled.applyMoney"
                       v-permission="'/etcManager/apply'">充值申请
            </el-button>
            <el-button v-if="exportLoading" v-permission="'/etcManager/export'" icon="el-icon-download"
                       type="primary" size="mini" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-button size="mini" type="primary" @click="claim" :disabled="multipleSelection.length<=0"
                       v-permission="'/etcManager/claimed'">认领
            </el-button>
            <el-button size="mini" type="primary" @click="unBindVehicle" v-permission="'/etcManager/unBindVehicle'"
                       :disabled="multipleSelection.length!=1">解绑卡号
            </el-button>
            <el-button size="mini" type="primary" @click="inBindVehicle" v-permission="'/etcManager/inBindVehicle'"
                       :disabled="multipleSelection.length!=1">绑定卡号
            </el-button>
            <el-button size="mini" type="primary" @click="cancellation" :disabled="multipleSelection.length<=0"
                       v-permission="'/etcManager/cancellation'">挂失
            </el-button>
            <el-table class="content-table" element-loading-text="拼命加载中"
                      :data="searchResult.result"
                      border fit
                      highlight-current-row stripe
                      @selection-change="handleSelectionChange"
                      size="small">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="车牌号" prop="vehicleCode" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="卡号" prop="cardCode" min-width="200" show-overflow-tooltip/>
                <el-table-column label="类型" prop="type" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ETC_TYPE" :value="scope.row.type"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="所属大区" prop="regionOrg.name" min-width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="所属分区" prop="belongOrg.name" min-width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="提供商" prop="supplierId" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ETC_SUPPILER"
                                                :value="scope.row.supplierId"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="当月额度" prop="monthAmount" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="ETC状态" prop="status" min-width="160">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ETC_STATUS"
                                                :value="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="认领" prop="etcStatus" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OIL_CLAIM"
                                                :value="scope.row.etcStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="认领组织" prop="cardClaimOrgCode" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="认领人" prop="cardClaimUser" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <!--<el-table-column label="认领时间" prop="cardClaimTime" min-width="150px"-->
                <!--show-overflow-tooltip></el-table-column>-->
                <el-table-column label="创建人" prop="createUser" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="createTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="修改人" prop="modifyUser" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="修改时间" prop="modifyTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="操作" fixed="right" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini"
                                   @click="modifyEtcList(scope.row)" v-permission="'/etcManager/modify'"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini"
                                   @click="deleteList(scope.row)" v-permission="'/etcManager/delete'"></el-button>
                        <el-button type="text" size="mini"
                                   @click="cancelClaim(scope.row)" v-permission="'/etcManager/cancelClaim'">取消认领
                        </el-button>
                    </template>
                </el-table-column>
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
                            <vehicle-select  :settlementMode="Constant.SETTLEMENT_MODE_TYPE.NO_LONG_TERM_OUT_INVITE"
                                             v-model="addEtcWinForm.vehicleCode" :type="TRAILER"></vehicle-select>
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
                        <el-form-item label="ETC卡号">
                            <label style="width: 215px">{{modifyForm.cardCode}}</label>
                            <!--<el-input v-model="modifyForm.cardCode" style="width: 215px"></el-input>-->
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
        <el-dialog title="充值申请" :visible.sync="rechargeApplyWin" width="800px" :before-close="handleClose">
            <el-form inline size="small" :model="rechargeApplyForm" label-width="150px" ref="rechargeApplyForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车牌号" prop="vehicleCode">
                            <label style="width: 215px"><span
                                style="color: #409EFF;">{{rechargeApplyForm.vehicleCode}}</span></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="月充值额度" prop="monthAmount" style="margin-left: 10px;">
                            <label style="width: 215px"><span
                                style="color: #409EFF;">{{rechargeApplyForm.monthAmount}}</span></label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="已充值额度:" prop="rechargeAmount" style="margin-left: 25px;">
                            <label><span style="color: #409EFF;">{{rechargeApplyForm.rechargeAmount}}</span></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="剩余充值额度:" prop="restAmount" style="margin-left: 25px;">
                            <label><span style="color: #409EFF;">{{rechargeApplyForm.restAmount}}</span></label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="本月运费:" prop="freight" style="margin-left: 15px;">
                            <label><span style="color: #409EFF;">{{rechargeApplyForm.freight}}</span></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="本月油费:" prop="oilAmount">
                            <label><span style="color: #409EFF;">{{rechargeApplyForm.oilAmount}}</span></label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="充值金额" prop="balanceAmount" style="margin-left: 5px;">
                            <el-input type="number" placeholder="请填写金额" style="width: 215px;"
                                      v-model="rechargeApplyForm.balanceAmount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="reason" label="充值备注:">
                            <el-input type="textarea" placeholder="请输入充值原因(限定100字以内)"
                                      v-model="rechargeApplyForm.rechargeRemark"
                                      resize="none"
                                      autofocus="true"
                                      maxlength="100"
                                      style="width:600px;" :rows="3">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="applyMoneyEtcList('rechargeApplyForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="绑定卡号" :visible.sync="inBindVehicleWin" width="800px" :before-close="handleClose">
            <el-form size="small" :model="BindVehicleForm" label-width="120px" ref="BindVehicleForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="ETC号:" prop="cardCode">
                            <el-input v-model="BindVehicleForm.cardCode" style="width: 215px;" type="text"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="初始金额:" prop="initialAmount">
                            <el-input type="number" placeholder="请填写金额" style="width: 215px;"
                                      v-model="BindVehicleForm.initialAmount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="bindWinSubmit('BindVehicleForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改ETC状态" :visible.sync="cancellationWin" width="600px">
            <el-form :model="cancellationForm" ref="cancellationForm" label-width="120px"
                     size="small"
                     align="center">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="卡号" prop="cardCode">
                            {{ cancellationForm.cardCode }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="使用状态:" prop="status">
                            <el-switch v-model="cancellationForm.status"
                                       active-color="#13ce66"
                                       :active-value="Constant.ETC_STATUS.IN_USE"
                                       active-text="使用"
                                       inactive-color="#ff4949"
                                       :inactive-value="Constant.ETC_STATUS.LOSE_CARD"
                                       inactive-text="挂失"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancellationWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="cancellationSubmit('cancellationForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common, Validate, Constant} from 'src/global';
    import axios from 'axios'
    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                initializeModel: {},
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    cardCode: '',
                    supplier: '',
                    belongOrgCode: '',
                    type: '',
                    vehicleCode: '',
                    etcStatus: '',
                    settlementMode:'NO_LONG_TERM_OUT_INVITE',
                },//返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                exportLoading: true,
                inBindVehicleWin: false,
                modifyOilCardWin: false,
                cancellationWin: false,
                cancellationForm: {
                    cardCode: '',
                    status: Constant.ETC_STATUS.LOSE_CARD,
                },
                multipleSelection: [],
                addEtcWin: false,
                rechargeApplyWin: false,
                rechargeApplyForm: {
                    vehicleCode: '',
                    monthAmount: '',
                    rechargeAmount: '',
                    restAmount: '',
                    freight: '',
                    oilAmount: '',
                    balanceAmount: undefined,
                    cardCode: '',
                    status: ''
                },
                BindVehicleForm: {
                    cardCode: '',
                    initialAmount: 0
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
                        {pattern: /^\d{16,20}$/, message: '请输入16到20位的ETC卡号'}
                    ],
                    supplierId: [
                        {required: true, message: '请输入关联供应商', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'blur'},
                        {min: 1, max: 12, message: '请选择状态', trigger: 'blur'}
                    ],
                    monthAmount: [
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
                    ],
                    balanceAmount: [
                        {required: true, message: '请填写金额', trigger: 'blur'},
                        {pattern: /^([1-9]\d{0,8})([.]?|(\.\d{1,2})?)$/, message: '请输入正确的金额!'},
                    ],
                    initialAmount: [
                        {required: true, message: '请填写金额', trigger: 'blur'},
                        {pattern: /^([0-9]\d{0,8})([.]?|(\.\d{1,2})?)$/, message: '请输入正确的金额!'},
                    ],
                },
                disabled: {
                    applyMoney: true,
                },
                TRAILER: ['VAN', 'TRACTOR']
            }
        },
        mounted() {
            this.searchEtcList();
        },
        watch: { //数据监听
            multipleSelection(val) {
                this.disabled.applyMoney = val.length != 1
            }
        },
        methods: {
            //通用
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            //通用
            handleCurrentChange(val) {
                let vm = this
                vm.searchParam.currentPage = val
                this.searchEtcList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            handleSizeChange(val) {
                let vm = this
                vm.searchParam.pageSize = val
                this.searchEtcList()
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
                            vm.searchEtcList();
                            vm.addEtcWin = false;
                        })
                    }
                })
            },
            //查询
            searchEtcList() {
                let vm = this;
                if (vm.searchParam.settlementMode==''||vm.searchParam.settlementMode==null||vm.searchParam.settlementMode!='LONG_TERM_OUT_INVITE'){
                    vm.searchParam.settlementMode='NO_LONG_TERM_OUT_INVITE'
                }
                Http.get(Api.etcManager.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result
                    vm.searchResult.result.forEach((item) => {
                        if (!item.vehicle) {
                            item.vehicle = {}
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
                    supplier: '',
                    orgCode: ''
                }
            },
            cancel() {
                this.addEtcWin = false;
                this.modifyOilCardWin = false
                this.rechargeApplyWin = false,
                    this.inBindVehicleWin = false,
                    this.rechargeApplyForm = {
                        vehicleCode: '',
                        monthAmount: '',
                        rechargeAmount: '',
                        restAmount: '',
                        freight: '',
                        oilAmount: '',
                        balanceAmount: undefined,
                        type: '',
                        etcStatus:''
                    },
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
                        cardCode: '',
                        initialAmount: ''
                    }
            },
            handleClose() {
                this.addEtcWin = false;
                this.modifyOilCardWin = false
                this.inBindVehicleWin = false
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
                        vm.searchEtcList()
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
                            vm.searchEtcList();
                            vm.modifyOilCardWin = false;
                        })
                    }
                })
            },
            bindVehicle() {
                let vm = this;
                vm.multipleSelection.forEach((item) => {
                    vm.rechargeApplyForm.vehicleCode = item.vehicle.code;
                    vm.rechargeApplyForm.type = item.type;
                    vm.rechargeApplyForm.cardCode = item.cardCode;
                    vm.rechargeApplyForm.status = item.status;
                    vm.rechargeApplyForm.etcStatus=item.etcStatus;
                });
                if (vm.rechargeApplyForm.cardCode === '') {
                    this.$message.warning("ETC号为空,不能进行充值")
                    return;
                }
                if (vm.rechargeApplyForm.status === Constant.ETC_STATUS.LOSE_CARD) {
                    this.$message.warning("该ETC卡已经挂失,不能充值")
                    return;
                }
                if(vm.rechargeApplyForm.etcStatus===Constant.ETC_CLAIMED_STATUS.UN_CLAIM){
                    this.$message.warning("该ETC卡未认领,不能充值")
                    return;
                }
                if (vm.rechargeApplyForm.type === 'A_CARD') {
                    this.$message.warning("A卡不能进行充值操作")
                } else {
                    Http.get(Api.etcManager.applyAmount, {params: {'vehicleCode': vm.rechargeApplyForm.vehicleCode}}, result => {
                        vm.rechargeApplyForm = result.result;
                        vm.rechargeApplyWin = true;
                    })
                }
            },
            applyMoneyEtcList(formName) {
                let vm = this;
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.etcManager.auditAmount, vm.rechargeApplyForm, function (res) {
                            vm.rechargeApplyWin = false;
                            vm.$message.success('充值成功！')
                        })
                    }
                })
            },
            claim() {
                let _this = this;
                var cardNo = [];
                _this.multipleSelection.forEach(res => {
                    cardNo.push(res.cardCode);
                })
                this.$confirm('是否认领ETC?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.etcManager.claimed, cardNo, result => {
                        _this.$message.success("认领成功");
                        _this.searchEtcList();
                    })
                })
            },
            cancelClaim(row) {
                let _this = this;
                var cardCode = row.cardCode;
                if (row.etcStatus === 'UN_CLAIM') {
                    this.$message.warning("该ETC未认领,不能点击取消认领");
                    return;
                }
                this.$confirm('是否取消认领ETC?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.get(Api.etcManager.cancelClaim, {params: {'cardCode': cardCode}}, result => {
                        _this.$message.success("取消认领成功");
                        _this.searchEtcList()
                    })
                })
            },
            unBindVehicle() {
                let _this = this;
                let cardCode = [];
                let card = '';
                _this.multipleSelection.forEach(res => {
                    cardCode.push(res.vehicleCode);
                    card = res.cardCode;
                })
                if (card === '') {
                    this.$message.warning("该车辆已解绑");
                    return;
                }
                this.$confirm('是否取解除车辆绑定的ETC卡号?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.etcManager.unBindVehicle, cardCode, result => {
                        _this.$message.success("解绑成功");
                        _this.searchEtcList()
                    })
                })
            },
            inBindVehicle() {
                let vm = this;
                vm.inBindVehicleWin = true;
            },
            bindWinSubmit(formName) {
                let vm = this;
                let cardCodes = [];
                vm.multipleSelection.forEach((res) => {
                    cardCodes.push(res.id);
                })
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.get(Api.etcManager.inBindVehicle, {
                            params: {
                                'ids': cardCodes,
                                'cardCode': vm.BindVehicleForm.cardCode,
                                'initialAmount': vm.BindVehicleForm.initialAmount,
                            }
                        }, function (res) {
                            vm.searchEtcList();
                            vm.$message.success("绑定成功");
                            vm.inBindVehicleWin = false;
                        })
                    }
                })
            },
            cancellation() {//挂失
                let _this = this;
                if (_this.multipleSelection) {
                    _this.cancellationForm.cardCode = _this.multipleSelection[0].cardCode;
                    _this.cancellationWin = true
                }
            },
            cancellationSubmit(formName) {
                let _this = this
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.etcManager.cancellation, _this.cancellationForm, result => {
                            _this.cancellationWin = false;
                            _this.$message.success("成功");
                            _this.searchEtcList();
                        })
                    }
                })
            },
            exportList() {
                debugger
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.etcManager.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = 'etc导出.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
        }
    }
</script>
