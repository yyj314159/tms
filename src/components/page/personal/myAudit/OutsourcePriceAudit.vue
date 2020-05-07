<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 我的审批</el-breadcrumb-item>
                <el-breadcrumb-item>合作应付审批</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单编号:">
                            <el-input v-model="searchParam.waybillCode" clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车单编号:">
                            <el-input v-model="searchParam.dispatchCode" clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="审核时间:" label-width="120px">
                            <el-date-picker
                                v-model="searchParam.auditTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属大区:">
                            <org-select v-model="searchParam.regionCode" style="display:block" nature="AREA"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属分区:">
                            <org-select v-model="searchParam.belongOrgCode" style="display:block" nature="PARTITION"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.departStartTime" date-type="start" :end-date="searchParam.departEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.departEndTime" date-type="end" :start-date="searchParam.departStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select option-name="AUDIT_STATUS" v-model="searchParam.auditState"
                                               style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input v-model="searchParam.vehicleLicenseNum" clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select isTmp="false" v-model="searchParam.lineId" style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right;" label-width="0">
                            <el-button type="success" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchList()">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addOutsourcePriceAuditWinShow"
                       v-permission="permission.add">新增
            </el-button>
            <el-button v-if="btnLoading" v-permission="permission.export" size="mini" type="primary"
                       icon="el-icon-download" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="运单编号" prop="waybillCode" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="线路名称" prop="lineName" min-width="260" show-overflow-tooltip/>
                <el-table-column align="center" label="车牌号" prop="vehicleLicenseNum" min-width="120px"/>
                <el-table-column align="center" label="车型" prop="specification" min-width="120px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_SPECIFICATION" :value="scope.row.specification"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="应付运费" prop="applyPrice" min-width="120px"/>
                <el-table-column align="center" label="派车单编号" prop="dispatchCode" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showDispatch(scope.row)">{{scope.row.dispatchCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="线路总里程" prop="distance"
                                 min-width="100" show-overflow-tooltip/>
                <el-table-column align="center" label="出发站点" prop="startStationName"
                                 min-width="150" show-overflow-tooltip/>
                <el-table-column align="center" label="经停站点" prop="stopOverStationName"
                                 min-width="280" show-overflow-tooltip/>
                <el-table-column align="center" label="目的站点" prop="endStationName"
                                 min-width="150" show-overflow-tooltip/>
                <el-table-column align="center" label="大区" prop="regionName" min-width="100"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="分区" prop="belongOrgName" min-width="100"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="挂厢号码" prop="trailerLicenseNum"
                                 min-width="100"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="挂车类型" prop="vanType"
                                 min-width="120px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE"
                                                :value="scope.row.vanType"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="供应商" prop="supplierName"
                                 min-width="200px" show-overflow-tooltip/>

                <el-table-column align="center" label="申请人" prop="applyUser" min-width="140"/>
                <el-table-column align="center" label="申请时间" prop="applyTime" min-width="150"/>
                <el-table-column align="center" label="备注" prop="remark" min-width="300"/>
                <el-table-column align="center" label="审核人" prop="auditUser" min-width="140"/>
                <el-table-column align="center" label="审核状态" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.auditStatus"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="审核时间" prop="auditTime" min-width="150"/>
                <el-table-column align="center" label="审核意见" prop="auditRemark" min-width="300"/>
                <el-table-column fixed="left" align="center" label="操作" min-width="200">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="permission.auditOutsourcePrice"
                                   :disabled="!(scope.row.auditStatus === Constant.AUDIT_STATUS.UNAUDITED && !scope.row.notarizeType)"
                                   icon="el-icon-tickets" size="mini"
                                   @click="auditOutsourcePriceAuditWinShow(scope.row)">审批
                        </el-button>
                        <el-button type="text" v-permission="permission.modify"
                                   :disabled="!(scope.row.auditStatus === Constant.AUDIT_STATUS.UNAUDITED && !scope.row.notarizeType && scope.row.source === Constant.DATA_SOURCE_TYPE.WEB)"
                                   icon="el-icon-tickets" size="mini"
                                   @click="editOutsourcePriceAuditWinShow(scope.row)">修改
                        </el-button>
                        <el-button type="text" v-permission="permission.delete"
                                   :disabled="!(scope.row.auditStatus === Constant.AUDIT_STATUS.UNAUDITED && !scope.row.notarizeType && scope.row.source ===Constant.DATA_SOURCE_TYPE.WEB)"
                                   icon="el-icon-tickets" size="mini"
                                   @click="deleteOutsourcePriceAuditWinShow(scope.row)">删除
                        </el-button>
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

        <!-- 新增 -->
        <el-dialog title="新增合作车价审批" :visible.sync="addOutsourcePriceAuditWin.visible" width="55%">
            <el-form size="small" :model="addOutsourcePriceAuditWin.model" ref="addOutsourcePriceAuditWinForm"
                     label-width="140px" :rules="rules">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="运单编号：" prop="waybillCode">
                            <el-input v-model="addOutsourcePriceAuditWin.model.waybillCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="合作车价：" prop="applyPrice">
                            <el-input v-model="addOutsourcePriceAuditWin.model.applyPrice"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注原因：" prop="remark">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！"
                                      v-model.trim="addOutsourcePriceAuditWin.model.remark"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button size="small" type="primary"
                           @click="addOutsourcePriceAuditWinSubmit('addOutsourcePriceAuditWinForm')"
                           :disabled="addBtnDisabled">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="修改合作车价审批" :visible.sync="editOutsourcePriceAuditWin.visible" width="55%">
            <el-form size="small" :model="editOutsourcePriceAuditWin.model" ref="editOutsourcePriceAuditWinForm"
                     :rules="rules"
                     label-width="140px">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="运单编号：" prop="waybillCode">
                            {{ editOutsourcePriceAuditWin.model.waybillCode }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="合作车价：" prop="applyPrice">
                            <el-input v-model="editOutsourcePriceAuditWin.model.applyPrice"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注原因：" prop="remark">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！"
                                      v-model.trim="editOutsourcePriceAuditWin.model.remark"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button size="small" type="primary"
                           @click="editOutsourcePriceAuditWinSubmit('editOutsourcePriceAuditWinForm')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="查看合作车价审批" :visible.sync="detailOutsourcePriceAuditWin.visible" width="55%">
            <el-form size="small" :model="detailOutsourcePriceAuditWin.model" label-width="140px">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="运单编号：" prop="waybillCode">
                            {{ detailOutsourcePriceAuditWin.model.waybillCode }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="合作车价：" prop="applyPrice">
                            {{ detailOutsourcePriceAuditWin.model.applyPrice }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注原因：" prop="remark">
                            {{ detailOutsourcePriceAuditWin.model.remark }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="detailOutsourcePriceAuditWin.visible = false">关 闭</el-button>
            </span>
        </el-dialog>

        <!-- 审核 -->
        <el-dialog title="合作应付审核" :visible.sync="auditOutsourcePriceAuditWin.visible" width="50%">
            <el-form size="small" :model="auditOutsourcePriceAuditWin.model" ref="auditOutsourcePriceAuditWinForm"
                     label-width="120px">
                <div v-if="auditOutsourcePriceAuditWin.model.source == Constant.DATA_SOURCE_TYPE.WEB">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="申请人：">
                                {{ auditOutsourcePriceAuditWin.model.applyUser }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="申请时间：">
                                {{ auditOutsourcePriceAuditWin.model.applyTime }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="备注：">
                                {{ auditOutsourcePriceAuditWin.model.remark }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="线路名称:">
                            {{auditOutsourcePriceAuditWin.model.dispatch.dispatchLine.lineName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车牌号:">
                            {{auditOutsourcePriceAuditWin.model.dispatch.dispatchVehicle.vehicleLicenseNum}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车型:">
                            <dictionary-select-name option-name="VEHICLE_SPECIFICATION"
                                                    :value="auditOutsourcePriceAuditWin.model.dispatch.dispatchVehicle?auditOutsourcePriceAuditWin.model.dispatch.dispatchVehicle.specification:''"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单公里成本:">
                            {{
                            (auditOutsourcePriceAuditWin.model.applyPrice/auditOutsourcePriceAuditWin.model.dispatch.dispatchLine.distance).toFixed(2)
                            }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="申请车价:">
                            {{ auditOutsourcePriceAuditWin.model.applyPrice }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="审核状态:">
                            <el-switch v-model="auditOutsourcePriceAuditWin.model.auditStatus"
                                       active-color="#13ce66"
                                       inactive-color="#ff4949"
                                       :active-value="Constant.AUDIT_STATUS.PASS"
                                       :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                       active-text="同意"
                                       inactive-text="拒绝"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="审核意见:">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！"
                                      v-model="auditOutsourcePriceAuditWin.model.auditRemark"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="auditOutsourcePriceAuditWin.visible = false">取 消</el-button>
                <el-button size="small" type="primary"
                           @click="auditOutsourcePriceAuditWinSubmit('auditOutsourcePriceAuditWinForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 派车,临时加车详情 -->
        <add-send-view v-if="showAddSendView" :dialogVisible="showAddSendView" @close="hideAddSendView"
                       :currentRow="currentRow"/>
    </el-container>
</template>

<script>
    import {Api, Common, Constant, Http, Validate} from 'src/global'
    import addSendView from '../../operation/myDispatch/AddSendView'

    export default {
        data() {
            return {
                initializeModel: {},//拷贝 初始化data
                showAddSendView: false,//加车派车详情
                Validate: Validate,
                Constant: Constant,
                permission: {
                    add: '/outsourcePriceAudit/add',
                    export: '/outsourcePriceAudit/export',
                    modify: '/outsourcePriceAudit/modify',
                    delete: '/outsourcePriceAudit/delete',
                    auditOutsourcePrice: '/outsourcePriceAudit/auditOutsourcePrice',
                },
                isLoading: true,
                showAuditDetail: false,//申请内容
                searchParam: {//查询参数
                    vehicleType: '',
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',
                    dispatchCode: '',//申请人
                    auditState: Constant.AUDIT_STATUS.UNAUDITED,//审核状态
                    region: '',
                    belongOrg: '',
                    auditTime: [],//创建时间
                    auditStartTime: '',
                    auditEndTime: '',
                    departStartTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间,
                    departEndTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    endApplyTime: '',
                    lineId: '',
                    vehicleLicenseNum: ''//车牌号
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null,//操作行的数据
                title: "",
                auditContentForm: {
                    lineContract: {}
                },
                addOutsourcePriceAuditWin: {
                    visible: false,
                    model: {
                        waybillCode: '',
                        applyPrice: '',
                        remark: ''
                    },
                },
                rules: {
                    waybillCode: [
                        {required: true, message: '请输入运单编码', trigger: 'blur'},
                        Validate.waybill
                    ],
                    applyPrice: [
                        {required: true, message: '请输入合作车价', trigger: 'blur'},
                        Validate.notZeroMoney
                    ],
                    remark: [
                        {required: true, message: '请输入调整原因', trigger: 'blur'}
                    ]
                },
                editOutsourcePriceAuditWin: {
                    visible: false,
                    model: {
                        waybillCode: '',
                        applyPrice: '',
                        remark: ''
                    },
                },
                detailOutsourcePriceAuditWin: {
                    visible: false,
                    model: {
                        waybillCode: '',
                        applyPrice: '',
                        remark: ''
                    },
                },
                auditOutsourcePriceAuditWin: {
                    visible: false,
                    rules: {
                        waybillCode: [
                            {required: true, message: '请输入运单编码', trigger: 'blur'},
                            Validate.waybill
                        ],
                        applyPrice: [
                            {required: true, message: '请输入合作车价', trigger: 'blur'},
                            Validate.notLimitMoney
                        ],
                        remark: [
                            {required: true, message: '请输入调整原因', trigger: 'blur'}
                        ]
                    },
                    model: {
                        waybillCode: '',
                        applyPrice: '',
                        auditRemark: '',
                        auditStatus: Constant.AUDIT_STATUS.PASS,
                        //构建派车单详情
                        dispatch: {
                            dispatchLine: [],//线路
                            dispatchVehicle: [],//派车单车辆
                        },
                    },
                },
                btnLoading: true,
                addBtnDisabled: false
            }
        },
        components: {
            addSendView
        },
        created() {
            this.searchList();
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
            }
        },
        mounted() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data)
        },

        methods: {
            /*拷贝初始化对象*/
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            showMore() {
                let _this = this;
                _this.isMoreItemShow = true;
            },
            showLess() {
                let _this = this;
                _this.isMoreItemShow = false;
            },
            resetSearchParam() {//重置参数
                this.searchParam = this.cloneMode().searchParam;
                this.searchParam.auditState = Constant.AUDIT_STATUS.UNAUDITED//审核状态
            },
            cancel() {
                debugger
                let _this = this;
                _this.addOutsourcePriceAuditWin.model = _this.cloneMode().addOutsourcePriceAuditWin.model;
                _this.editOutsourcePriceAuditWin.model = _this.cloneMode().editOutsourcePriceAuditWin.model;
                _this.addOutsourcePriceAuditWin.visible = false;
                _this.editOutsourcePriceAuditWin.visible = false;
            },
            searchList() {//查询
                if (this.searchParam.auditTime) {
                    this.searchParam.auditStartTime = this.searchParam.auditTime[0];
                    this.searchParam.auditEndTime = this.searchParam.auditTime[1];
                } else {
                    this.searchParam.auditStartTime = "";
                    this.searchParam.auditEndTime = "";
                }
                this.isLoading = true;
                Http.get(Api.outsourcePriceAudit.page, {params: this.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    this.isLoading = false;
                }, () => {
                    this.isLoading = false;
                })
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            showDispatch(row) {
                let _this = this;
                Http.get(Api.dispatch.queryByCode, {params: {code: row.dispatchCode}}, result => {
                    _this.currentRow = result.result;
                    _this.showAddSendView = true;
                })
            },
            hideAddSendView() { // 关闭派车单详情------------------------------------
                this.showAddSendView = false;
            },
            showWayBill(row) { //运单详情------------------------------------
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
                // window.open(href, '_blank');
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
            },
            //导出
            exportList() {
                let vm = this;
                if (!this.searchParam.auditState) {
                    return this.$message.error("请选择审核状态!");
                }
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.outsourcePriceAudit.page, {params: searchExportParam}, response => {
                    let header = ['运单编号', '线路名称', '车牌号', '车型', '应付运费',
                        '派车单编号', '线路总里程', '出发站点', '经停站点', '目的站点', '大区', '分区',
                        '挂厢号码', '挂车类型', '供应商', '申请人', '申请时间', '备注', '审核人', '审核状态', '审核时间', '审核意见'];
                    let filterVal = ['waybillCode', 'dispatch.dispatchLine.lineName', 'dispatch.dispatchVehicle.vehicleLicenseNum',
                        {
                            type: 'dictionary',
                            'code': 'VEHICLE_SPECIFICATION',
                            'name': 'dispatch.dispatchVehicle.specification'
                        },
                        'applyPrice', 'dispatchCode', 'dispatch.dispatchLine.distance', 'dispatch.dispatchLine.startStation.name', 'dispatch.dispatchLine.stopOverStationName',
                        'dispatch.dispatchLine.endStation.name', 'dispatch.region.name', 'dispatch.belongOrg.name', 'dispatch.dispatchVehicle.trailerLicenseNum',
                        {
                            type: 'dictionary',
                            code: 'VEHICLE_COMPARTMENT_TYPE',
                            name: 'dispatch.dispatchVehicle.vanType'
                        }, 'dispatch.dispatchVehicle.supplier.name', 'applyUser', 'applyTime', 'remark', 'auditUser',
                        {
                            type: 'dictionary',
                            code: 'AUDIT_STATUS',
                            name: 'auditStatus'
                        }, 'auditTime', 'auditRemark'
                    ];
                    Common.excel.downloadExl(response.result, header, filterVal, "合作应付审批导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            },
            //新增审批
            addOutsourcePriceAuditWinShow() {
                this.addOutsourcePriceAuditWin.model = this.cloneMode().addOutsourcePriceAuditWin.model;
                this.addOutsourcePriceAuditWin.visible = true;
            },
            addOutsourcePriceAuditWinSubmit(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.addBtnDisabled = true;
                        Http.post(Api.outsourcePriceAudit.add, _this.addOutsourcePriceAuditWin.model, result => {
                            _this.addOutsourcePriceAuditWin.visible = false;
                            _this.addOutsourcePriceAuditWinReset();
                            _this.searchList();
                            _this.addBtnDisabled = false;
                        }, result => {
                            _this.addBtnDisabled = false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            addOutsourcePriceAuditWinReset() {
                let _this = this;
                _this.addOutsourcePriceAuditWin = _this.cloneMode().addOutsourcePriceAuditWin
            },
            //修改审批
            editOutsourcePriceAuditWinShow(row) {
                let _this = this;
                _this.editOutsourcePriceAuditWin.model = _this.cloneMode().editOutsourcePriceAuditWin.model;
                if (row.source !== Constant.DATA_SOURCE_TYPE.WEB) {
                    _this.$message.error("只有界面新增的审批才允许修改");
                    return;
                }
                Http.get(Api.outsourcePriceAudit.getOutsourcePriceAuditById, {params: {id: row.id}}, result => {
                    if (result) {
                        _this.editOutsourcePriceAuditWin.model = result.result;
                        _this.editOutsourcePriceAuditWin.visible = true;
                    }
                });
            },
            editOutsourcePriceAuditWinSubmit(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.outsourcePriceAudit.modify, _this.editOutsourcePriceAuditWin.model, response => {
                            _this.editOutsourcePriceAuditWin.visible = false;
                            _this.editOutsourcePriceAuditWinReset();
                            _this.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            editOutsourcePriceAuditWinReset() {
                let _this = this;
                _this.editOutsourcePriceAuditWin = _this.cloneMode().editOutsourcePriceAuditWin
            },
            //审核审批
            auditOutsourcePriceAuditWinShow(row) {
                let _this = this;
                _this.auditOutsourcePriceAuditWin.model = this.cloneMode().auditOutsourcePriceAuditWin.model;
                Http.get(Api.outsourcePriceAudit.getOutsourcePriceAuditById, {params: {id: row.id}}, result => {
                    if (result) {
                        result.result.auditStatus = Constant.AUDIT_STATUS.PASS;
                        _this.auditOutsourcePriceAuditWin.model = result.result;
                        _this.auditOutsourcePriceAuditWin.visible = true;
                    }
                });
            },
            auditOutsourcePriceAuditWinSubmit(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.outsourcePriceAudit.auditOutsourcePrice, _this.auditOutsourcePriceAuditWin.model, response => {
                            _this.auditOutsourcePriceAuditWin.visible = false;
                            _this.$message.success('审批完成！');
                            _this.auditOutsourcePriceAuditWinReset();
                            _this.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            auditOutsourcePriceAuditWinReset() {
                let _this = this;
                _this.auditOutsourcePriceAuditWin = _this.cloneMode().auditOutsourcePriceAuditWin
            },
            //删除审批
            deleteOutsourcePriceAuditWinShow(row) {
                let _this = this;
                if (row.source !== Constant.DATA_SOURCE_TYPE.WEB) {
                    _this.$message.error("只有界面新增的审批才允许删除");
                    return;
                }
                if (row.source !== Constant.DATA_SOURCE_TYPE.WEB) {
                    _this.$message.error("只有界面新增的审批才允许删除");
                    return;
                }
                if (row.notarizeType) {
                    _this.$message.error("已失效 不允许删除");
                    return;
                }
                if (row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED) {
                    _this.$message.error("只有未审核才可以删除");
                    return;
                }
                Http.post(Api.outsourcePriceAudit.delete, [row.id], result => {
                    _this.$message.success("删除成功");
                    _this.searchList();
                });
            }
        }
    }
</script>
