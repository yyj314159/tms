<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item>财务信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="" >
            <el-form :model="searchParam" label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车辆号牌:">
                            <!--<el-input v-model="searchParam.licenseNumber"></el-input>-->
                            <el-input-number style="width: 100%" :controls="false"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <org-select style="display: block" v-model="searchParam.belongOrgCode"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆类型:">
                            <dictionary-select style="display: block" v-model="searchParam.vehicleType"
                                               option-name="VEHICLE_TYPE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select v-model="searchParam.auditStatus" style="display: block" size="small"
                                               option-name="AUDIT_STATUS"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item style="float:right">
                            <el-button type="success" icon="el-icon-search" @click="searchVehicleOutsourceForMainList">
                                查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetMainSearchParam">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-search" @click="auditVehicleOutsourceShow"
                       v-permission="permission.audit" :disabled="auditButtonDisabled">审核
            </el-button>
            <el-table class="content-table" size="small"
                      :data="searchResult.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handlerChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"/>
                <!--<el-table-column label="基础信息" header-align="center">-->
                <el-table-column label="车牌号" header-align="center" prop="licenseNumber" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleRowHandle(scope.row)">{{scope.row.licenseNumber}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="车辆类型" header-align="center" prop="vehicle.type" width="100">
                    <template slot-scope="scope">
                        <datadictionary-name :value="scope.row.vehicle.type" option-name="VEHICLE_TYPE"/>
                    </template>
                </el-table-column>
                <el-table-column label="车挂" header-align="center" prop="trailerNumber" width="150"
                                 show-overflow-tooltip/>
                <el-table-column label="所属区域" header-align="center" prop="org.name" width="120"/>
                <el-table-column label="车主" header-align="center" prop="vehicleOwner1.name" width="100"/>
                <el-table-column label="手机号" header-align="center" prop="vehicleOwner1.mobile" width="150"/>
                <el-table-column label="身份证号" header-align="center" prop="vehicleOwner1.idCardNo" width="200"
                                 show-overflow-tooltip/>
                <!--</el-table-column>
                <el-table-column label="采购信息" header-align="center">-->
                <el-table-column label="购置时间" header-align="center" prop="code" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.vehicle.purchaseDate | moment("YYYY-MM-DD") }}
                    </template>
                </el-table-column>
                <el-table-column label="购置总价" header-align="center" prop="vehicle.purchasePrice" width="120"/>
                <el-table-column label="保险总额" header-align="center" prop="vehicle.insurance" width="120"/>
                <el-table-column label="购置类型" header-align="center" prop="vehicle.imported" width="80">
                    <template slot-scope="scope">
                        <datadictionary-name :value="scope.row.vehicle.imported" option-name="VEHICLE_PROCUREMEN_TYPE"/>
                    </template>
                </el-table-column>
                <!--</el-table-column>
                <el-table-column label="包车信息" header-align="center">-->
                <el-table-column label="外包时间" header-align="center" prop="outsourceDate" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.outsourceDate | moment("YYYY-MM-DD") }}
                    </template>
                </el-table-column>
                <el-table-column label="外包总价" header-align="center" prop="outsourceTotalPrice" width="120"/>
                <el-table-column label="首付金额" header-align="center" prop="downPaymentAmount" width="120"/>
                <el-table-column label="首付时间" header-align="center" prop="downPaymentDate" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.downPaymentDate | moment("YYYY-MM-DD") }}
                    </template>
                </el-table-column>
                <el-table-column label="还款结束时间" header-align="center" prop="paymentEndDate" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.paymentEndDate | moment("YYYY-MM-DD") }}
                    </template>
                </el-table-column>
                <el-table-column label="分期月数" header-align="center" prop="periodNumber" width="80"/>
                <el-table-column label="月还本金" header-align="center" prop="principalMonth" width="120"/>
                <el-table-column label="月还利息" header-align="center" prop="interestMonth" width="120"/>
                <el-table-column label="已还月数" header-align="center" prop="repaymentPeriodNumber" width="80"/>
                <el-table-column label="剩余欠款金额" header-align="center" prop="remainAmount" width="120"/>
                <!--</el-table-column>
                <el-table-column label="操作信息" header-align="center">-->
                <el-table-column label="申请人" header-align="center" prop="createUser" width="120"/>
                <el-table-column label="申请时间" header-align="center" prop="createTime" width="150"/>
                <el-table-column label="审核人" header-align="center" prop="auditor" width="120"/>
                <el-table-column label="审核时间" header-align="center" prop="auditTime" width="150"/>
                <el-table-column label="审核状态" header-align="center" prop="auditStatus" width="120">
                    <template slot-scope="scope">
                        <datadictionary-name :value="scope.row.auditStatus" option-name="AUDIT_STATUS"/>
                    </template>
                </el-table-column>
                <!--</el-table-column>-->
                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini"
                                   @click="editVehicleOutsourceWinShow(scope.row)"
                                   v-permission="permission.modify"/>
                        <el-button type="text" icon="el-icon-delete" size="mini"
                                   @click="deleteVehicleOutsourceSubmit(scope.row)"
                                   v-permission="permission.delete"/>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>

        <el-dialog :title="win.winTitle.vehicleOutsourceAuditWinTitle"
                   :visible.sync="win.winShow.vehicleOutsourceAuditWin" width="400px">
            <el-form :model="model.auditWinModel" :rules="verification" ref="vehicleOutsourceAuditForm"
                     label-width="100px" size="small" align="center">
                <el-row>
                    <el-col :span="12">
                        <el-switch
                            v-model="model.auditWinModel.auditStatus"
                            active-text="通过"
                            inactive-text="不通过">
                        </el-switch>
                    </el-col>

                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="win.winShow.vehicleOutsourceAuditWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="auditVehicleOutsourceSubmit('vehicleOutsourceAuditForm')"
                           size="small">确 定
                </el-button>
            </div>
        </el-dialog>

        <edit-win ref="editWin" @close-edit-dialog="searchVehicleOutsourceForMainList"/>
        <details-win ref="detailsWin"/>
    </el-container>
</template>

<script>

    import {Api, Common, Http, Constant} from 'src/global'
    import DatadictionaryName from '../../../common/select/DatadictionaryName'
    import DetailsWin from './VehicleOutsourceDetailsWin'
    import EditWin from './VehicleOutsourceEditWin'


    export default {
        components: {
            DatadictionaryName,
            EditWin,
            DetailsWin
        },
        data() {
            let permission = { //权限
                add: '/vehicleOutsource/add',
                modify: '/vehicleOutsource/modify',
                delete: '/vehicleOutsource/delete',
                audit: '/vehicleOutsource/audit',
                getVehicleOutsourceById: '/vehicleOutsource/getVehicleOutsourceById'
            };
            return {
                vehicleOutsourceEditWin: false,
                searchParam: {//查询参数
                    belongOrgCode: '',
                    licenseNumber: '',
                    vehicleType: '',
                    auditStatus: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                model: {
                    vehicleOutsourceTableModel: [],
                    vehicleOutsourceEditWinModel: {},
                    vehicleOutsourceDetailsWinModel: {},
                    auditWinModel: {
                        ids: [],
                        auditStatus: false
                    }
                },
                verification: {//表单验证
                    name: [
                        {required: true, message: '请输入供应商名称', trigger: 'blur'}
                    ],
                    linkMan: [
                        {required: true, message: '请输入联系人', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择供应商类型', trigger: 'blur'}
                    ],
                    contact: [
                        {required: true, message: '请输入联系方式', trigger: 'blur'},
                        {pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号'}
                    ],
                    payee: [
                        {required: true, message: '请输入收款人', trigger: 'blur'}
                    ],
                    dueBank: [
                        {required: true, message: '请输入收款银行', trigger: 'blur'}
                    ],
                    dueBankCardNo: [
                        {required: true, message: '请输入收款银行卡号', trigger: 'blur'},
                        {min: 1, max: 20, message: '编号最长19个字符', trigger: 'blur'},
                        {pattern: /^\d{16,19}$/, message: '请输入正确的银行卡号'}
                    ],
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    openingBank: [
                        {required: true, message: '请再次开户行', trigger: 'blur'}
                    ]
                },
                win: {
                    winTitle: { //弹出框 表头
                        vehicleOutsourceEditWinTitle: '编辑合作车辆信息',
                        vehicleOutsourceDetailsWinTitle: '查看合作车辆信息',
                        vehicleOutsourceAuditWinTitle: '审核'
                    },
                    winShow: {//是否显示弹框
                        vehicleOutsourceEditWin: false,
                        vehicleOutsourceDetailsWin: false,
                        vehicleOutsourceAuditWin: false
                    }
                },
                table: {//表格对应属性

                },
                auditButtonDisabled: true,
                selections: [],
                permission: permission,
            }
        },
        watch: { //数据监听
            selections(val) {
                this.auditButtonDisabled = val.length <= 0
            },
            deep: true
        },
        mounted() { //立即执行
            this.searchVehicleOutsourceForMainList();
        },
        methods: {//方法
            //main
            searchVehicleOutsourceForMainList() {//main 查询
                const _this = this;
                Http.get(Api.vehicleOutsource.page, {params: _this.searchParam}, result => {
                    if (!result.result.vehicle) {
                        result.result.vehicle = {}
                    }
                    _this.searchResult.result = result.result
                    _this.searchResult.totalCount = result.totalCount
                    _this.searchParam.currentPage = result.currentPage
                    _this.searchParam.pageSize = result.pageSize
                })
            },
            resetMainSearchParam() {
                this.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    totalCount: '',
                    belongOrgCode: '',
                    contact: '',
                    reviewType: ''
                }
            },
            //table
            handlerChange(rows) {//选中时触发
                this.selections = rows
            },
            handleRowHandle(row) {
                this.detailsVehicleOutsourceWinShow(row);
            },
            //show
            editVehicleOutsourceWinShow(row) {
                const _this = this

                Http.get(Api.vehicleOutsource.getVehicleOutsourceById, {params: {'id': row.id}}, result => {
                    if (Constant.AUDIT_STATUS.PASS === result.result.auditStatus) {
                        _this.$message.error("已审核通过的不允许修改")
                    } else {
                        _this.$refs.editWin.showDialog(result.result)
                    }
                })
            },
            detailsVehicleOutsourceWinShow(row) {
                const _this = this;
                Http.get(Api.vehicleOutsource.getVehicleOutsourceById, {params: {'id': row.id}}, result => {
                    _this.$refs.detailsWin.showDialog(result.result)
                })
            },
            auditVehicleOutsourceShow() {
                const _this = this;
                _this.win.winShow.vehicleOutsourceAuditWin = true
            },
            deleteVehicleOutsourceSubmit(row) {
                const _this = this;
                var ids = [];
                ids.push(row.id);
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.vehicleOutsource.delete, ids, result => {
                        _this.searchVehicleOutsourceForMainList()
                    })
                })
            },
            auditVehicleOutsourceSubmit() {
                const _this = this;
                _this.$confirm('确定审核', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.model.auditWinModel.ids = [];
                    _this.selections.forEach(row => {
                        _this.model.auditWinModel.ids.push(row.id)
                    });
                    Http.post(Api.vehicleOutsource.audit, _this.model.auditWinModel, result => {
                        _this.win.winShow.vehicleOutsourceAuditWin = false;
                        _this.searchVehicleOutsourceForMainList();
                        _this.resetAuditWin();
                        this.$message({
                            message: "审核成功",
                            type: 'success'
                        });
                    })
                })
            },
            //reset
            resetAuditWin() {
                this.model.auditWinModel = {
                    ids: [],
                    auditStatus: true
                }
            },
        }
    }
</script>
