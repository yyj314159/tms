<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 设备管理</el-breadcrumb-item>
                <el-breadcrumb-item>把枪管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form :model="model.searchParam" label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="PDA设备号:">
                            <pda-select v-model="model.searchParam.code" style="display: block"></pda-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="型号:">
                            <dictionary-select option-name="PDA_MODEL" style="display: block"
                                               v-model="model.searchParam.model"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属组织:">
                            <org-select style="display: block" v-model="model.searchParam.belongOrgCode"
                                        mounted="true"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="品牌:" prop="brand">
                            <data-dictionary-select style="display: block" option-name="PDA_BRAND"
                                                    v-model="model.searchParam.brand"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="状态:">
                            <data-dictionary-select option-name="GPS_STATUS" style="display: block"
                                                    v-model="model.searchParam.status"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="认领:">
                            <dictionary-select v-model="model.searchParam.cardClaimStatus"
                                               option-name="OIL_CLAIM" style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float:right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchGpsForMainList">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetMainSearchParam">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addGpsWinShow"
                       v-permission="permission.add">新增
            </el-button>
            <!--<el-button size="mini" type="primary" @click="bindVehicle" :disabled="disabled.bindOilCardDisabled"-->
                       <!--v-permission="permission.bindVehicles">绑定车辆-->
            <!--</el-button>-->
            <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="sendOutGpsWinShow"
                       v-permission="permission.setGpsInUse" :disabled="disabled.sendOutGpsDisabled">下发
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="gpsUnworkedSubmit"
                       v-permission="permission.setUnworked" :disabled="disabled.unworkedGpsDisabled">回收
            </el-button>
            <el-button size="mini" type="primary" v-permission="permission.getExcelData" @click="exportExcelSubmit">导出
            </el-button>
            <el-button size="mini" type="primary" @click="claim" :disabled="selections.length<=0"
                       v-permission="permission.claimed">认领
            </el-button>
            <el-table class="content-table" element-loading-text="拼命加载中"
                      :data="model.searchResult.result"
                      border fit
                      @selection-change="handlerChange"
                      @on-dbclick="handleRowHandle"
                      @feature-click="operationClick"
                      highlight-current-row stripe
                      size="small">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="PDA设备号" prop="code" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="handleRowHandle(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="PDA名称" prop="pdaName" min-width="160" show-overflow-tooltip/>
                <el-table-column label="PDA单价" prop="pdaPrice"min-width="160"></el-table-column>
                <el-table-column label="品牌" prop="brand" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.brand"
                                                option-name="PDA_BRAND"/>
                    </template>
                </el-table-column>
                <el-table-column label="型号" prop="model" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="持有人" prop="pdaHolder" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="采购日期" prop="payTime" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.payTime | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column label="所属组织" prop="belongOrgCode" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" prop="status" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.status"
                                                option-name="GPS_STATUS"/>
                    </template>
                </el-table-column>
                <el-table-column label="认领状态" prop="cardClaimStatus" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.cardClaimStatus"
                                                option-name="OIL_CLAIM"/>
                    </template>
                </el-table-column>
                <el-table-column label="认领组织" prop="cardClaimOrgCode" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="认领人" prop="cardClaimUser" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="认领时间" prop="cardClaimTime" min-width="150px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="创建人" prop="createUser" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="createTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="修改人" prop="modifyUser" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="修改时间" prop="modifyTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" prop="remark" min-width="100" show-overflow-tooltip/>
                <el-table-column header-align="center" align="center" label="操作" fixed="right" min-width="200"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini"
                                   @click="editGpsWinShow(scope.row)" v-permission="permission.modify"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini"
                                   @click="deleteGpsSubmit(scope.row)" v-permission="permission.delete"></el-button>
                        <el-button type="text" size="mini"
                                   @click="cancelClaim(scope.row)" v-permission="permission.cancelClaimed">取消认领
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
                    :page-size="model.searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="model.searchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>
        <!--新增PDA win-->
        <el-dialog :title="win.winTitle.gpsAddWinTitle" :visible.sync="win.winShow.gpsAddWin" width="800px">
            <el-form :model="model.gpsAddWinModel" :rules="verification" ref="gpsAddWinForm" label-width="100px"
                     size="small">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="设备号:" prop="code">
                            <el-input v-model="model.gpsAddWinModel.code"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="型号:" prop="model">
                            <dictionary-select option-name="PDA_MODEL" v-model="model.gpsAddWinModel.model"
                                               style="display: block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="名称:">
                            <el-input v-model="model.gpsAddWinModel.pdaName"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="单价:" prop="pdaPrice">
                            <el-input v-model="model.gpsAddWinModel.pdaPrice" type="number"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="品牌:" prop="brand">
                            <data-dictionary-select option-name="PDA_BRAND" style="display: block"
                                                    v-model="model.gpsAddWinModel.brand"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="所属机构:" prop="belongOrgCode">
                            <org-select style="display: block" v-model="model.gpsAddWinModel.belongOrgCode"
                                        ref="modifyGpsOrgSelect"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="购买日期:">
                            <el-date-picker
                                v-model="model.gpsAddWinModel.payTime"
                                type="date" style="display: block;width: 100%;"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="win.winShow.gpsAddWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addGpsWinSubmit('gpsAddWinForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改GPS win-->
        <el-dialog :title="win.winTitle.gpsEditWinTitle" :visible.sync="win.winShow.gpsEditWin" width="800px">
            <el-form :model="model.gpsEditWinModel" :rules="verification" ref="gpsEditWinForm" label-width="100px"
                     size="small">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="设备号:" prop="code">
                            {{model.gpsEditWinModel.code}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="品牌:" prop="brand">
                            <data-dictionary-select option-name="PDA_BRAND" style="display: block"
                                                    v-model="model.gpsEditWinModel.brand"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="名称:">
                            <el-input v-model="model.gpsEditWinModel.pdaName"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="单价:" prop="pdaPrice">
                            <el-input v-model="model.gpsEditWinModel.pdaPrice" type="number"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="型号:" prop="model">
                            <dictionary-select option-name="PDA_MODEL" v-model="model.gpsEditWinModel.model"
                                               style="display: block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="所属机构:" prop="belongOrgCode">
                            <org-select style="display: block" v-model="model.gpsEditWinModel.belongOrgCode"
                                        ref="modifyGpsOrgSelect"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="购买日期:">
                            <el-date-picker
                                v-model="model.gpsEditWinModel.payTime"
                                type="date" style="width: 100%; display: block;"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="win.winShow.gpsEditWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="editGpsWinSubmit('gpsEditWinForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!--查看GPS win-->
        <el-dialog :title="win.winTitle.gpsDetailsWinTitle" :visible.sync="win.winShow.gpsDetailsWin"
                   width="800px">
            <el-form :model="model.gpsDetailsWinModel" label-width="100px"
                     size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="PDA号码:" prop="code">
                            <label>{{ model.gpsDetailsWinModel.code }}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属机构:" prop="org.name">
                            <label>{{model.gpsDetailsWinModel.org.name}}</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="品牌:" prop="brand">
                            <datadictionary-name :value="model.gpsDetailsWinModel.brand"
                                                 option-name="PDA_BRAND"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="型号:" prop="model">
                            <datadictionary-name :value="model.gpsDetailsWinModel.model"
                                                 option-name="PDA_MODEL"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备号:" prop="code">
                            {{model.gpsDetailsWinModel.code}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态:" prop="status">
                            <datadictionary-name :value="model.gpsDetailsWinModel.status"
                                                 option-name="GPS_STATUS"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <el-dialog title="绑定车辆" :visible.sync="win.winShow.bindOilCardWin" width="600px">
            <el-form size="small" :model="model.bindOilCardForm" label-width="150px" ref="bindOilCardForm"
                     :rules="verification">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="车牌号:" prop="vehicleCode">
                            <vehicle-select v-model="model.bindOilCardForm.vehicleCode" style="display: block;"
                                            :type="TRAILER"></vehicle-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="win.winShow.bindOilCardWin = false">取 消</el-button>
                <el-button type="primary" size="small" @click="bindWinSubmit('bindOilCardForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 下发GPS win -->
        <el-dialog :title="win.winTitle.gpsSendOutWinTitle" :visible.sync="win.winShow.gpsSendOutWin"
                   width="600px">
            <el-form :model="model.gpsSendOutWinModel" :rules="verification" ref="gpsSendOutWinForm" label-width="150px"
                     size="small">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="下发类型:" prop="type">
                            <dictionary-select v-model="model.gpsSendOutWinModel.type" style="display: block;"
                                               option-name="OIL_CARD_GRANT_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="组织:" v-show="model.gpsSendOutWinModel.type==='ORGCODE'"
                                      prop="organization">
                            <org-select v-model="model.gpsSendOutWinModel.orgCode" style="display: block;"></org-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="用户:" v-show="model.gpsSendOutWinModel.type==='USER'" prop="user">
                            <user-select v-model="model.gpsSendOutWinModel.user" style="display: block;"></user-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="win.winShow.gpsSendOutWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="sendOutWinSubmit('gpsSendOutWinForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="win.winTitle.gpsSendOutDetailsWinTitle" :visible.sync="win.winShow.gpsSendOutDetailsWin"
                   width="850px">
            <el-table class="content-table" size="small" :data="model.gpsSendOutDetailsTableModel"
                      element-loading-text="拼命加载中"
                      border fitheader-align="center" width="220"
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"/>
                <el-table-column header-align="center" prop="gpsCode" label="gps编号"/>
                <el-table-column header-align="center" prop="vehicle.licenseNumber" label="关联车辆"/>
                <el-table-column header-align="center" prop="driver.name" label="关联司机"/>
                <el-table-column header-align="center" prop="operationUser" label="下发人"/>
                <el-table-column header-align="center" prop="operationDate" label="下发时间">
                    <template slot-scope="scope">
                        {{scope.row.operationDate | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" width="120px" prop="valid" label="是否有效">
                    <template slot-scope="scope">
                        {{scope.row.valid == false ? "使用中":"已失效" }}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </el-container>
</template>


<script>
    import {Api, Common, Http} from 'src/global';
    import DatadictionaryName from '../../../common/select/DatadictionaryName';
    import DataDictionarySelect from "../../../common/select/DataDictionarySelect";

    export default {
        components: {DataDictionarySelect, DatadictionaryName},
        data() {
            let permission = { //权限
                add: '/pda/add',
                modify: '/pda/modify',
                delete: '/pda/delete',
                setUnworked: '/pda/setUnworked',
                setGpsInUse: '/pda/setGpsInUse',
                getExcelData: '/pda/getExcelData',
                claimed: '/pda/claimed',
                cancelClaimed:'/pda/cancelClaimed'
            };
            return {
                initializeModel: {},
                model: {
                    searchParam: {//查询参数
                        currentPage: 1,
                        pageSize: 10,
                        code: '',
                        type: '',
                        belongOrgCode: '',
                        brand: '',
                        model: '',
                        simNumber: '',
                        remark: '',
                        status: '',
                        createUser: '',
                        modifyUse: '',
                        driverId: '',
                        vehicleCode: '',
                        cardClaimStatus: ''
                    },
                    gpsAddWinModel: {
                        code: '',
                        belongOrgCode: '',
                        brand: 'awst',
                        model: 'IWRIST i7',
                        simNumber: '',
                        remark: '',
                        status: 'UN_USE',
                        payTime: '',
                        pdaName:'',
                        pdaPrice:undefined,
                        org: {
                            code: '',
                            name: ''
                        }
                    },
                    searchResult: {
                        totalCount: 0,
                        result: [],
                    },
                    gpsEditWinModel: {
                        code: '',
                        belongOrgCode: '',
                        brand: '',
                        model: '',
                        simNumber: '',
                        remark: '',
                        status: '',
                        pdaName:'',
                        pdaPrice:undefined,
                        org: {
                            code: '',
                            name: ''
                        }
                    },
                    bindOilCardForm: {
                        vehicleCode: ''
                    },
                    gpsDetailsWinModel: {
                        code: '',
                        belongOrgCode: '',
                        brand: '',
                        model: '',
                        simNumber: '',
                        remark: '',
                        status: '',
                        org: {
                            code: '',
                            name: ''
                        }
                    },
                    gpsSendOutWinModel: {
                        type: '',
                        orgCode: '',
                        user: '',
                        cardNos: []
                    },
                    gpsSendOutDetailsTableModel: []
                },
                TRAILER: ['VAN', 'TRACTOR'],
                verification: {//表单验证
                    code: [
                        {required: true, message: '请输入pda设备号', trigger: 'blur'},
                        {pattern: /^(\d{15})$/, message: '请输入15位的设备号'}
                    ],
                    type: [
                        {required: true, message: '请输入pda类型', trigger: 'blur'},
                    ],
                    brand: [
                        {required: true, message: '请输入pda品牌', trigger: 'blur'},
                    ],
                    belongOrgCode: [
                        {required: true, message: '请选择所属机构', trigger: 'blur'}
                    ],
                    model: [
                        {required: true, message: '请输入型号', trigger: 'blur'},
                    ],
                    status: [
                        {required: true, message: '请输入状态', trigger: 'blur'}
                    ],
                    remark: [
                        {required: false, message: '请输入备注信息', trigger: 'blur'}
                    ],
                    gpsCode: [
                        {required: true, message: '设备号不能为空', trigger: 'blur'}
                    ],
                    vehicleCode: [
                        {required: true, message: '请选择绑定车辆', trigger: 'blur'}
                    ],
                    driverId: [
                        {required: false, message: '请输入司机信息', trigger: 'blur'}
                    ],
                    operationUser: [
                        {required: true, message: '请填写下发人', trigger: 'blur'}
                    ],
                    payTime: [
                        {required: true, message: '请填写采购日期', trigger: 'blur'}
                    ]
                },
                win: {
                    winTitle: { //弹出框 表头
                        gpsAddWinTitle: '新增PDA设备',
                        gpsEditWinTitle: '修改PDA设备',
                        gpsDetailsWinTitle: '查看PDA设备信息',
                        gpsSendOutWinTitle: '下派设备',
                        gpsSendOutDetailsWinTitle: '查看明细',
                    },
                    winShow: {//是否显示弹框
                        gpsAddWin: false,
                        gpsEditWin: false,
                        gpsDetailsWin: false,
                        gpsSendOutWin: false,
                        gpsSendOutDetailsWin: false,
                        bindOilCardWin: false,
                    }
                },
                disabled: {
                    sendOutGpsDisabled: true,
                    unworkedGpsDisabled: true,
                    invalidGpsDisabled: true,
                    bindOilCardDisabled: true,
                },
                selections: [],
                permission: permission,
            }
        },
        watch: { //数据监听
            selections(val) {
                this.disabled.sendOutGpsDisabled = val.length != 1
                this.disabled.invalidGpsDisabled = val.length <= 0
                this.disabled.unworkedGpsDisabled = val.length <= 0
                this.disabled.bindOilCardDisabled = val.length <= 0
            }
        },
        mounted() { //立即执行
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            this.searchGpsForMainList();
        },
        methods: {
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            //方法
            //main
            searchGpsForMainList() {//main 查询
                let vm = this;
                // _this.$refs.mainTable.gridDataInit(Api.pda.page, _this.model.searchParam);
                Http.get(Api.pda.page, {params: vm.model.searchParam}, result => {
                    vm.model.searchResult.result = result.result
                    vm.model.searchResult.result.forEach((item) => {
                        if (!item.org) {
                            item.org = {}
                        }
                    })
                    vm.model.searchResult.totalCount = result.totalCount
                    vm.model.searchParam.currentPage = result.currentPage
                    vm.model.searchParam.pageSize = result.pageSize
                })
            },
            resetMainSearchParam() {
                this.model.searchParam = this.cloneMode().model.searchParam
            },
            //table
            handlerChange(rows) { //选中时触发
                this.selections = rows
            },
            handleCurrentChange(val) {
                let vm = this
                vm.model.searchParam.currentPage = val
                this.searchGpsForMainList()
            },
            handleSizeChange(val) {
                let vm = this
                vm.model.searchParam.pageSize = val
                this.searchGpsForMainList()
            },
            handleRowHandle(row) {
                this.detailsGpsWinShow(row);
            },
            operationClick(id, row) {
                let _this = this;
                switch (id) {
                    case "0":
                        //查看明细
                        _this.useDetailsWinShow(row);
                        break
                    case "1"://编辑
                        _this.editGpsWinShow(row);
                        break;
                    case "2"://删除
                        _this.deleteGpsSubmit(row);
                        break;
                    default:
                }
            },
            //show
            addGpsWinShow() {
                this.win.winShow.gpsAddWin = true
            },
            sendOutGpsWinShow() {
                let vm = this;
                let cardNos = [];
                vm.selections.forEach(res => {
                    cardNos.push(res.code);
                });
                vm.model.gpsSendOutWinModel.cardNos = cardNos
                vm.win.winShow.gpsSendOutWin = true;
            },
            editGpsWinShow(row) {
                let _this = this;
                Http.get(Api.pda.getGpsById, {params: {'id': row.id}}, result => {
                    this.resetGpsEditWin();
                    _this.win.winShow.gpsEditWin = true;
                    setTimeout(() => {
                        _this.$refs.modifyGpsOrgSelect.setCurrentOrg(result.result.org);
                        _this.model.gpsEditWinModel = result.result
                    }, 0)
                })
            },
            useDetailsWinShow(row) {//发放明细
                let _this = this;
                Http.get(Api.pda.getGpsById, {params: {'id': row.id}}, result => {
                    _this.win.winShow.gpsSendOutDetailsWin = true;
                    let details = [];
                    if (result.result.gpsSendOut) {
                        details.push(result.result.gpsSendOut)
                    }
                    if (result.result.gpsSendOuts) {
                        result.result.gpsSendOuts.forEach(gpsSendOut => {
                            details.push(gpsSendOut)
                        })
                    }
                    _this.model.gpsSendOutDetailsTableModel = details
                })
            },
            detailsGpsWinShow(row) {
                let _this = this;
                Http.get(Api.pda.getGpsById, {params: {'id': row.id}}, result => {
                    _this.resetGpsDetailsWin();
                    _this.model.gpsDetailsWinModel = result.result;
                    _this.win.winShow.gpsDetailsWin = true
                })
            },
            //submit
            addGpsWinSubmit(formName) {
                let _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.pda.add, _this.model.gpsAddWinModel, function (res) {
                            _this.resetGpsAddWin();
                            _this.win.winShow.gpsAddWin = false;
                            _this.searchGpsForMainList();
                        })
                    }
                })
            },
            editGpsWinSubmit(formName) {
                let _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.pda.modify, _this.model.gpsEditWinModel, function (res) {
                            _this.resetGpsEditWin();
                            _this.win.winShow.gpsEditWin = false;
                            _this.searchGpsForMainList();
                        })
                    }
                })
            },
            sendOutWinSubmit(formName) {
                let _this = this;
                if (_this.model.gpsSendOutWinModel.type === 'USER') {
                    if (!_this.model.gpsSendOutWinModel.user) {
                        this.$message.warning("用户不能为空");
                    }
                }
                if (_this.model.gpsSendOutWinModel.type === 'ORGCODE') {
                    if (!_this.model.gpsSendOutWinModel.orgCode) {
                        this.$message.warning("组织不能为空");
                    }
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.get(Api.pda.setGpsInUse, {
                            params: {
                                'type': _this.model.gpsSendOutWinModel.type,
                                'user': _this.model.gpsSendOutWinModel.user,
                                'orgCode': _this.model.gpsSendOutWinModel.orgCode,
                                'cardNos': _this.model.gpsSendOutWinModel.cardNos
                            }
                        }, function (res) {
                            _this.resetSendOutGpsWin();
                            _this.win.winShow.gpsSendOutWin = false;
                            _this.$message.success('pda发放成功！');
                            _this.searchGpsForMainList();
                        })
                    }
                })
            },
            gpsInvalidSubmit() {
                let _this = this;
                var codes = [];
                _this.selections.forEach(res => {
                    codes.push(res.code);
                })
                this.$confirm('是否作废设备?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.gps.setGpsInvalid, codes, result => {
                        _this.searchGpsForMainList()
                    })
                })
            },
            gpsUnworkedSubmit() {
                let _this = this;
                var codes = [];
                _this.selections.forEach(res => {
                    codes.push(res.code);
                })
                this.$confirm('是否回收设备?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.pda.setUnworked, codes, result => {
                        _this.searchGpsForMainList()
                    })
                })
            },
            exportExcelSubmit() {
                let _this = this;
                let model = _.cloneDeep(_this.model.searchParam);
                model.pageSize = 3000;
                model.currentPage = 1;
                Http.get(Api.pda.getExcelData, {params: model}, result => {
                    //导出PDA
                    let header = ['PDA设备号', 'PDA名称','PDA单价', '所属组织', '状态', '品牌', '型号', '持有人', '采购日期', '认领状态', '认领人', '认领组织', '认领时间', '创建人', '创建时间','修改人','修改时间','备注'];
                    let filterVal = ['code', 'pdaName','pdaPrice', 'belongOrgCode', 'status', 'brand', 'model', 'pdaHolder', 'payTime', 'cardClaimStatus', 'cardClaimUser', 'cardClaimOrgCode', 'cardClaimTime', 'createUser', 'createTime','modifyUser','modifyTime','remark'];
                    Common.excel.downloadExl(result.result, header, filterVal, "PDA");
                })
            },
            deleteGpsSubmit(row) {
                let _this = this;
                var ids = [];
                ids.push(row.id);
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.pda.delete, ids, result => {
                        _this.searchGpsForMainList()
                    })
                })
            },
            bindVehicle() {
                let vm = this;
                vm.win.winShow.bindOilCardWin = true
            },
            //绑定车辆
            bindWinSubmit(formName) {
                let vm = this;
                let cardNos = []
                vm.selections.forEach(res => {
                    cardNos.push(res.code);
                })
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.get(Api.gps.bindVehicle, {
                            params: {
                                'cardNos': cardNos,
                                'vehicleCode': vm.model.bindOilCardForm.vehicleCode
                            }
                        }, function (res) {
                            vm.resetbindOilCardWin();
                            vm.searchGpsForMainList();
                            vm.win.winShow.bindOilCardWin = false;
                        })
                    }
                })
            },
            handleClose() {
                this.win.winShow.gpsAddWin = false,
                    this.win.winShowgpsEditWin = false,
                    this.win.winShow.gpsDetailsWin = false,
                    this.win.winShow.gpsSendOutWin = false,
                    this.win.winShow.gpsSendOutDetailsWin = false,
                    this.win.winShow.bindOilCardWin = false
            },
            cancel() {

            },
            //reset
            resetGpsAddWin() {//重置PDA新增form
                this.model.gpsAddWinModel = this.cloneMode().model.gpsAddWinModel
            },
            resetGpsEditWin() {//重置PDA修改form
                this.model.gpsEditWinModel = this.cloneMode().model.gpsEditWinModel
            },
            resetGpsDetailsWin() {//重置PDA明细form
                this.model.gpsDetailsWinModel = this.cloneMode().model.gpsDetailsWinModel
            },
            resetSendOutGpsWin() {//重置下派PDA form
                this.model.gpsSendOutWinModel = this.cloneMode().model.gpsSendOutWinModel
            },
            resetbindOilCardWin() {//重置绑定车辆
                this.model.bindOilCardForm = this.cloneMode().model.bindOilCardForm
            },
            claim() {
                let _this = this;
                var cardNo = [];
                _this.selections.forEach(res => {
                    cardNo.push(res.code);
                })
                this.$confirm('是否认领PDA?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.pda.claimed, cardNo, result => {
                        _this.$message.success("认领成功");
                        _this.searchGpsForMainList()
                    })
                })
            },
            cancelClaim(row) {
                let _this = this;
                let code = row.code;
                if (row.cardClaimStatus === 'UN_CLAIM') {
                    this.$message.warning("该PDA未认领,不能点击取消认领");
                    return;
                }
                this.$confirm('是否取消认领PDA?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.get(Api.pda.cancelClaim, {params: {'code': code}}, result => {
                        _this.$message.success("取消认领成功");
                        _this.searchGpsForMainList()
                    })
                })
            }
        }
    }
</script>
