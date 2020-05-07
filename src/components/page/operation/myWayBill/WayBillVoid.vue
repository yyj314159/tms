<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 运单管理</el-breadcrumb-item>
                <el-breadcrumb-item>运单作废</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input  v-model="searchParam.waybillCode" style="display:block;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆性质:">
                            <dictionary-select option-name="VEHICLE_OPERATION_MODE"  v-model="searchParam.vehicleNature" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出款类型:">
                            <dictionary-select option-name="PAYMENT_TYPE"  v-model="searchParam.paymentType" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select option-name="AUDIT_STATUS"  v-model="searchParam.auditStatus" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="钉钉审批编号:">
                            <el-input  v-model="searchParam.auditNo" style="display:block;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="异常处理状态:">
                            <dictionary-select option-name="WAYBILL_INVALID_HANDLED_STATUS"  v-model="searchParam.handledStatus" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请时间:" label-width="120px">
                            <el-date-picker
                                v-model="searchParam.applyTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                range-separator="至"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-if="btnLoading" v-permission="'/waybillInvalid/export'" size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="运单号" min-width="130">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车辆性质" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" v-model="scope.row.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="申请人" prop="applyUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="申请人所属组织" prop="applyOrgName" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="申请时间" prop="applyTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="运单作废原因" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAYBILL_VOID_REASON" v-model="scope.row.invalidReason"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单作废备注" prop="remark" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出款类型" prop="paymentType" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核状态" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核人" prop="auditUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核时间" prop="auditTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核意见" prop="auditOpinion" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="钉钉审批编号" prop="auditNo" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="异常处理状态" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAYBILL_INVALID_HANDLED_STATUS" v-model="scope.row.handledStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="异常处理备注" prop="handledRemark" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="left" min-width="150">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED" size="mini" type="text" icon="el-icon-tickets" v-permission="'/waybillInvalid/audit'" @click="auditAdjustment(scope.row)">审核</el-button>
                        <el-button size="mini" type="text" icon="el-icon-tickets" v-permission="'/waybillInvalid/modify'" @click="showModify(scope.row)">修改</el-button>
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

        <!-- 审核 -->
        <el-dialog title="审核" :visible.sync="showAuditDialog" width="35%" @close="resetauditForm">
            <el-form size="small" :model="auditForm" ref="auditForm" label-width="120px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="审核状态：">
                            <el-switch v-model="auditForm.auditStatus" active-color="#13ce66" inactive-color="#ff4949"
                                       :active-value="Constant.AUDIT_STATUS.PASS" :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                       active-text="同意" inactive-text="拒绝"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="审核意见：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="auditForm.auditOpinion"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAuditDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="auditAdjustmentSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="异常出款信息修改" :visible.sync="showModifyDialog" width="50%" @close="resetModifyForm">
            <el-form size="small" :model="modifyForm" ref="modifyForm" label-width="120px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="运单号:">
                            {{modifyForm.waybillCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="作废原因:">
                            <dictionary-select-name option-name="WAYBILL_VOID_REASON" v-model="modifyForm.invalidReason"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出款类型:">
                            {{modifyForm.paymentType}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="作废备注:">
                            {{modifyForm.remark}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="钉钉审批编号:">
                            {{modifyForm.auditNo}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="异常处理状态:">
                            <dictionary-select option-name="WAYBILL_INVALID_HANDLED_STATUS"  v-model="modifyForm.handledStatus" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="审核意见：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="modifyForm.handledRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showModifyDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifySubmit">确 定</el-button>
            </span>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http,Api,Validate,Common,Constant} from 'src/global'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                btnLoading: true,
                showAuditDialog: false,//审核弹框
                showModifyDialog: false,//修改弹框
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',//运单号
                    auditStatus: 'UNAUDITED',//审核状态
                    vehicleNature: '',//车辆性质
                    paymentType: '',//出款类型
                    auditNo: '',//钉钉审批编号
                    handledStatus: '',//钉钉审批编号
                    applyTime: [],//申请时间
                    applyStartTime: '',
                    applyEndTime: '',
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                auditForm: {
                    id: '',
                    auditStatus: Constant.AUDIT_STATUS.PASS,
                    auditOpinion: ''
                },
                modifyForm: {
                    id: '',

                    waybillCode:'',
                    invalidReason:'',
                    paymentType:'',
                    remark:'',
                    auditNo:'',

                    handledStatus: '',
                    handledRemark: ''
                },
                tableHeight: window.innerHeight>800?480:null
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.waybillCode = '';
                this.searchParam.auditStatus = 'UNAUDITED';
                this.searchParam.applyTime = [];
                this.searchParam.applyStartTime = '';
                this.searchParam.applyEndTime = '';
                this.searchParam.vehicleNature = '';
                this.searchParam.paymentType = '';
                this.searchParam.auditNo = '';
                this.searchParam.handledStatus = '';
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                if(this.searchParam.applyTime){
                    this.searchParam.applyStartTime = this.searchParam.applyTime[0];
                    this.searchParam.applyEndTime = this.searchParam.applyTime[1];
                }else{
                    this.searchParam.applyStartTime = "";
                    this.searchParam.applyEndTime = "";
                }
                Http.get(Api.waybillInvalid.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
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
            showWayBill(row){ //运单详情------------------------------------
                this.$router.push({ path: '/operation/waybillDetail',query: {code: row.waybillCode}});
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
                // window.open(href, '_blank');
            },
            auditAdjustment(val){
                let vm = this;
                vm.showAuditDialog = true;
                vm.auditForm.id = val.id;
            },
            auditAdjustmentSubmit(){
                let vm = this;
                Http.post(Api.waybillInvalid.audit,vm.auditForm, result => {
                    vm.showAuditDialog = false;
                    vm.$message.success('审批成功！');
                    vm.searchList();
                })
            },
            resetauditForm(){
                let vm = this;
                vm.auditForm.auditStatus = Constant.AUDIT_STATUS.PASS;
                vm.searchList();
            },
            showModify(row){
                this.showModifyDialog = true;
                this.modifyForm.id = row.id;
                this.modifyForm.waybillCode = row.waybillCode;
                this.modifyForm.invalidReason = row.invalidReason;
                this.modifyForm.paymentType = row.paymentType;
                this.modifyForm.remark = row.remark;
                this.modifyForm.auditNo = row.auditNo;
                this.modifyForm.handledStatus = row.handledStatus;
                this.modifyForm.handledRemark = row.handledRemark;
            },
            modifySubmit(){
                Http.post(Api.waybillInvalid.modify,this.modifyForm, () => {
                    this.showModifyDialog = false;
                    this.$message.success('修改成功!');
                    this.searchList();
                })
            },
            resetModifyForm(){
                this.modifyForm.handledStatus = '';
                this.modifyForm.handledRemark = '';
                this.searchList();
            },
            exportData() {//导出
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.waybillInvalid.page, {params: searchExportParam}, response => {
                    let header = ['运单号', '车辆性质', '申请人', '申请人所属组织', '申请时间', '运单作废原因', '运单作废备注', '出款类型', '审核状态', '审核人', '审核时间', '审核意见', '钉钉审批编号', '异常处理状态', '异常处理备注'];
                    let filterVal = ['waybillCode', {
                        type: 'dictionary',
                        code: 'VEHICLE_OPERATION_MODE',
                        name: 'vehicleNature'
                    }, 'applyUser', 'applyOrgName', 'applyTime', {
                        type: 'dictionary',
                        code: 'WAYBILL_VOID_REASON',
                        name: 'invalidReason'
                    }, 'remark', 'paymentType', {
                        type: 'dictionary',
                        code: 'AUDIT_STATUS',
                        name: 'auditStatus'
                    }, 'auditUser', 'auditTime', 'auditOpinion', 'auditNo', {
                        type: 'dictionary',
                        code: 'WAYBILL_INVALID_HANDLED_STATUS',
                        name: 'handledStatus'
                    }, 'handledRemark'];
                    Common.excel.downloadExl(response.result, header, filterVal, "运单作废");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            },
        }
    }
</script>

