<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 我的审批</el-breadcrumb-item>
                <el-breadcrumb-item>外请应付审批</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="派车单编号:">
                            <el-input v-model="searchParam.dispatchCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select option-name="AUDIT_STATUS" v-model="searchParam.auditState"
                                               style="display:block;"/>
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
                        <el-form-item label="大区编号:">
                            <org-select v-model="searchParam.regionCode" style="display:block" nature="AREA"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域编号:">
                            <org-select v-model="searchParam.belongOrgCode" style="display:block" nature="PARTITION"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select option-name="VEHICLE_OPERATION_MODE" v-model="searchParam.vehicleType"
                                               :exclude-options="['SELF_SUPPORT']"
                                               style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right;" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="派车单编号" prop="dispatchCode" min-width="150"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showDispatch(scope.row)">{{scope.row.dispatchCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="客户全称" prop="dispatch.customer.name"
                                 min-width="200" show-overflow-tooltip/>
                <el-table-column header-align="center" label="线路名称" prop="dispatch.dispatchLine.lineName"
                                 min-width="260" show-overflow-tooltip/>
                <el-table-column header-align="center" label="出发站点" prop="dispatch.dispatchLine.startStation.name"
                                 min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="经停站点" prop="dispatch.dispatchLine.stopOverStationName"
                                 min-width="280" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="dispatch.dispatchLine.endStation.name"
                                 min-width="150" show-overflow-tooltip></el-table-column>

                <el-table-column header-align="center" label="大区" prop="dispatch.region.name" min-width="100"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="分区" prop="dispatch.belongOrg.name" min-width="100"
                                 show-overflow-tooltip/>

                <el-table-column header-align="center" label="车辆属性" prop="vehicleNature" min-width="120px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="scope.row.vehicleNature"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车牌号"
                                 prop="dispatch.dispatchVehicle.vehicleLicenseNum" min-width="120px"/>
                <el-table-column header-align="center" label="车型" prop="dispatch.dispatchVehicle.specification" min-width="120px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_SPECIFICATION" :value="scope.row.dispatch.dispatchVehicle.specification"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="挂厢号码" prop="trailerNumber" min-width="100"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" label="挂车类型" prop="specification" min-width="120px">
                    <template slot-scope="scope">
                        {{ scope.row.specification }}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="供应商" prop="dispatch.dispatchVehicle.supplier.name"
                                 min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="承运商" prop="dispatch.dispatchVehicle.shipper.name"
                                 min-width="200px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="应收计价方式" prop="receivePriceType" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_PRICE_TYPE" :value="scope.row.receivePriceType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="应收计价数量" prop="receivePriceNum" min-width="120px"/>
                <el-table-column header-align="center" label="应收单价" prop="receiveUnitPrice" min-width="120px"/>
                <el-table-column header-align="center" label="应收金额" prop="receiveAmount" min-width="120px"/>

                <el-table-column header-align="center" label="应付运费" prop="paidVehicleAmount" min-width="120px"/>
                <el-table-column header-align="center" label="预付打卡" prop="prepaidCardAmount" min-width="120px"/>
                <el-table-column header-align="center" label="货到打卡" prop="deliveryAmount" min-width="120px"/>
                <el-table-column header-align="center" label="油卡金额" prop="oilCardAmount" min-width="120px"/>
                <el-table-column header-align="center" label="油卡押金" prop="oilCardDeposit" min-width="120px"/>
                <el-table-column header-align="center" label="GPS使用费" prop="gpsFee" min-width="120px"/>
                <el-table-column header-align="center" label="GPS押金" prop="gpsDeposit" min-width="120px"/>
                <el-table-column header-align="center" label="回单押金" prop="returnDeposit" min-width="120px"/>
                <el-table-column header-align="center" label="定点加油金额" prop="refuelingAmount" min-width="120px"/>
                <el-table-column header-align="center" label="回单付金额" prop="returnAmount" min-width="120px"/>

                <el-table-column header-align="center" label="审核人" prop="auditUser" min-width="140"/>
                <el-table-column header-align="center" label="审核状态" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.auditState"/>
                    </template>
                </el-table-column><!--
                <el-table-column header-align="center" label="备注" prop="remark" min-width="140"
                                 show-overflow-tooltip/>-->
                <el-table-column header-align="center" label="审核时间" prop="auditTime" min-width="150"/>
                <el-table-column header-align="center" label="审核意见" prop="auditRemark" min-width="300"
                                 show-overflow-tooltip/>
                <el-table-column header-align="center" fixed="left" align="center" label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/paymentCheckBeforeApproval/audit'"
                                   :disabled="scope.row.auditState !== Constant.AUDIT_STATUS.UNAUDITED || scope.row.notarizeType"
                                   icon="el-icon-tickets" size="mini" @click="showAuditWindow(scope.row)">审批
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


        <el-dialog title="应付审核" :visible.sync="auditWin.visible.dialogAuditStationVisible" width="80%">
            <el-form size="small" :model="auditWin.auditStationForm" ref="auditStationForm" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="派车单编号:">
                            {{ auditWin.auditStationForm.dispatchCode }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            {{ auditWin.auditStationForm.licenseNumber }}
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="车辆类型:">
                            <dictionary-select-name style="display:block;" option-name="VEHICLE_TYPE"
                                                    v-model="auditWin.auditStationForm.vehicleType"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="挂车类型:">
                            <dictionary-select-name style="display:block;" option-name="VEHICLE_SPECIFICATION"
                                                    v-model="auditWin.auditStationForm.specification"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="出发站点:">
                            {{
                            auditWin.auditStationForm.dispatch?auditWin.auditStationForm.dispatch.dispatchLine.startStation.name:''
                            }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的站点:">
                            {{
                            auditWin.auditStationForm.dispatch?auditWin.auditStationForm.dispatch.dispatchLine.endStation.name
                            :''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="线路名称:">
                            {{
                            auditWin.auditStationForm.dispatch?auditWin.auditStationForm.dispatch.dispatchLine.lineName:''
                            }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="应收计价方式:">
                            <dictionary-select-name v-model="auditWin.auditStationForm.receivePriceType"
                                               option-name="LINE_PRICE_TYPE" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应收计价数量:">
                            {{ auditWin.auditStationForm.receivePriceNum }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应收单价:">
                            {{ auditWin.auditStationForm.receiveUnitPrice }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应收金额:">
                            {{ auditWin.auditStationForm.receiveAmount }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="应付运费:">
                            {{ auditWin.auditStationForm.paidVehicleAmount }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预付打卡:">
                            {{ auditWin.auditStationForm.prepaidCardAmount }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货到打卡:">
                            {{ auditWin.auditStationForm.deliveryAmount }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="油卡金额:">
                            {{ auditWin.auditStationForm.oilCardAmount }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="油卡押金:">
                            {{ auditWin.auditStationForm.oilCardDeposit }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="GPS使用费:">
                            {{ auditWin.auditStationForm.gpsFee }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="GPS押金:">
                            {{ auditWin.auditStationForm.gpsDeposit }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="回单押金:">
                            {{ auditWin.auditStationForm.returnDeposit }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="定点加油金额:">
                            {{ auditWin.auditStationForm.refuelingAmount }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="回单付金额:">
                            {{ auditWin.auditStationForm.returnAmount }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否开票:">
                            {{ auditWin.auditStationForm.dispatch ?(auditWin.auditStationForm.dispatch.dispatchVehicle.ticket?"开票":"不开票") :"" }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="派车单备注:" style="word-break:break-all;">
                            {{ auditWin.auditStationForm.dispatch ? auditWin.auditStationForm.dispatch.remark :"" }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="审核状态:">
                            <el-switch
                                v-model="auditWin.auditStationForm.auditState"
                                active-value="PASS"
                                inactive-value="NO_PASS"
                                active-text="通过"
                                active-color="#13ce66" inactive-color="#ff4949"
                                inactive-text="不通过">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <span style="color:red; font-size: 22px; font-weight: bolder; line-height: 30px;">{{msg}}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="备注:">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！"
                                      v-model="auditWin.auditStationForm.auditRemark"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="auditWin.visible.dialogAuditStationVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="auditStation()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 派车,临时加车详情 -->
        <add-send-view v-if="showAddSendView" :dialogVisible="showAddSendView" @close="hideAddSendView"
                       :currentRow="currentRow"></add-send-view>
    </el-container>
</template>

<script>
    import {Http, Api, Validate, Common, Constant} from 'src/global'
    import addSendView from '../../operation/myDispatch/AddSendView'

    export default {
        data() {
            return {
                initializeModel: {},//拷贝 初始化data
                showAddSendView: false,//加车派车详情
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                showAuditDetail: false,//申请内容
                searchParam: {//查询参数
                    vehicleType: '',
                    currentPage: 1,
                    pageSize: 10,
                    dispatchCode: '',//申请人
                    auditState: Constant.AUDIT_STATUS.UNAUDITED,//审核状态
                    region: '',
                    belongOrg: '',
                    auditTime: [],//创建时间
                    auditStartTime: '',
                    auditEndTime: '',
                    actualDepartureTime: [],//发车时间
                    departStartTime: '',
                    departEndTime: '',
                    endApplyTime: '',
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
                auditWin: {
                    visible: {
                        dialogAuditStationVisible: false
                    },
                    auditStationForm: {
                        id: '',
                        auditState: Constant.AUDIT_STATUS.PASS,
                        auditRemark: '',
                        refuelingAmount: '',
                        paidVehicleAmount: '',
                        prepaidCardAmount: '',
                        deliveryAmount: '',
                        oilCardAmount: '',
                        oilCardDeposit: '',
                        gpsFee: '',
                        gpsDeposit: '',
                        returnDeposit: '',
                        fuelingAmount: '',
                        eturnAmount: ''
                    }
                }
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
            },
            msg: function() {
                if(this.auditWin.auditStationForm.receiveAmount && this.auditWin.auditStationForm.paidVehicleAmount){
                    if((this.auditWin.auditStationForm.receiveAmount - this.auditWin.auditStationForm.paidVehicleAmount)/this.auditWin.auditStationForm.receiveAmount<0.07){
                        return `利润过低（利润率  ${((this.auditWin.auditStationForm.receiveAmount - this.auditWin.auditStationForm.paidVehicleAmount)/this.auditWin.auditStationForm.receiveAmount*100).toFixed(2)}% ）！请注意审核`
                    }else{
                        return ''
                    }
                }else{
                    return '应收或应付信息不完整！请注意审核'
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
                let vm = this;
                vm.isMoreItemShow = true;
            },
            showLess() {
                let vm = this;
                vm.isMoreItemShow = false;
            },
            resetSearchParam() {//重置参数
                this.searchParam = this.cloneMode().searchParam;
                this.searchParam.auditState = '';
            },
            searchList() {//查询
                let _this = this;
                _this.isLoading = true;
                if (this.searchParam.auditTime) {
                    this.searchParam.auditStartTime = this.searchParam.auditTime[0];
                    this.searchParam.auditEndTime = this.searchParam.auditTime[1];
                } else {
                    this.searchParam.auditStartTime = "";
                    this.searchParam.auditEndTime = "";
                }
                if (this.searchParam.actualDepartureTime) {
                    this.searchParam.departStartTime = this.searchParam.actualDepartureTime[0];
                    this.searchParam.departEndTime = this.searchParam.actualDepartureTime[1];
                } else {
                    this.searchParam.departStartTime = "";
                    this.searchParam.departEndTime = "";
                }
                Http.get(Api.paymentAudit.page, {params: _this.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    _this.isLoading = false;
                }, () => {
                    _this.isLoading = false;
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
            showAuditWindow(row) {
                let _this = this;
                Http.get(Api.paymentAudit.selectById, {params: {id: row.id}}, result => {
                    if (result) {
                        result.result.auditState = Constant.AUDIT_STATUS.PASS;
                        _this.auditWin.auditStationForm = result.result;
                        _this.auditWin.visible.dialogAuditStationVisible = true;
                    }
                })
            },
            auditStation() {
                let _this = this;
                Http.post(Api.paymentAudit.audit, _this.auditWin.auditStationForm, result => {
                    _this.auditWin.visible.dialogAuditStationVisible = false;
                    _this.$message.success('审批完成！');
                    _this.auditWin.auditStationForm.auditRemark = '';
                    _this.searchList();
                })
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
            }
        }
    }
</script>
<style scoped>
    .blue {
        color: #20a0ff;
        display: inline-block;
        width: 150px;
        margin-bottom: 12px;
    }

    .el-form-item {
        margin-bottom: 8px;
    }
</style>
