<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 发车计划</el-breadcrumb-item>
                <el-breadcrumb-item>放空车辆</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
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
                    <el-col :span="6">
                        <el-form-item label="派车单号:">
                            <el-input  v-model="searchParam.dispatchCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select option-name="VEHICLE_OPERATION_MODE"  v-model="searchParam.vehicleNature" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="申请开始时间:">
                            <date-picker-single v-model="searchParam.startApplyTime" date-type="start" :end-date="searchParam.endApplyTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="申请结束时间:">
                            <date-picker-single v-model="searchParam.endApplyTime" date-type="end" :start-date="searchParam.startApplyTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select option-name="AUDIT_STATUS"  v-model="searchParam.auditStatus" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">

            <el-button v-if="btnLoading" v-permission="'/dispatchEmpty/export'" size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>

            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="派车单号" min-width="120">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="AddVehicleView(scope.row)">{{scope.row.dispatch.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" prop="dispatch.dispatchVehicle.vehicleLicenseNum" label="车牌号" min-width="120"></el-table-column>
                <el-table-column header-align="center" prop="vehicleNature" label="车辆性质" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="scope.row.dispatch.dispatchVehicle.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="放空费" prop="emptyAmount" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="放空原因" prop="emptyRemark" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="所属大区" prop="dispatch.region.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="dispatch.belongOrg.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="客户" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.dispatch.customer?scope.row.dispatch.customer.name:""}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="260" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showLine(scope.row)">{{scope.row.dispatch.dispatchLine?scope.row.dispatch.dispatchLine.lineName:''}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="签到时间" prop="dispatch.dispatchLine.stopOverStation[0].signInTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="确认放空时间" prop="emptyTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="放空时长" prop="emptyTimeLength" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="申请人" prop="applyUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="申请时间" prop="applyTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核人" prop="auditUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核时间" prop="auditTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核状态" prop="auditStatus" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" :value="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核意见" prop="auditRemark" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="收款人" prop="payee" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="开户行" prop="openingBank" min-width="240" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="收款银行卡号" prop="dueBankCardNo" min-width="240" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="付款状态" min-width="120" show-overflow-tooltip>
                   <!-- <template slot-scope="scope">
                        <dictionary-select-name option-name="PAY_STATUS" v-if="scope.row.supplierPaymentRecord" :value="scope.row.supplierPaymentRecord.pay"></dictionary-select-name>
                    </template>-->
                </el-table-column>
                <el-table-column header-align="center" label="付款人" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="付款时间" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="left" min-width="140">
                    <template slot-scope="scope">
                        <el-button v-permission="'/dispatchEmpty/audit'"  :disabled="scope.row.auditStatus === Constant.AUDIT_STATUS.PASS" type="text" size="mini" @click="auditEmpty(scope.row)">审核</el-button>
                        <el-button v-permission="'/dispatchEmpty/modifyEmptyAmount'"  :disabled="scope.row.auditStatus === Constant.AUDIT_STATUS.PASS" type="text" size="mini" @click="showModifyEmptyAmount(scope.row)">修改</el-button>
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

        <!-- 线路信息详情 -->
        <line-info v-if="showLineInfo"  :dialogVisible="showLineInfo" @close="hideLineInfo"  :currentRow="currentRow"></line-info>

        <!-- 派车单详情 -->
        <add-send-view v-if="showAddSendView"  :dialogVisible="showAddSendView" @close="hideAddSendView"  :currentRow="currentRow"></add-send-view>

        <!-- 审核 -->
        <el-dialog title="审核放空车辆"  :visible.sync="showAuditDialog" width="80%" @close="resetAuditForm">
            <el-form size="small" :model="auditForm" label-width="120px">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="派车单号：">
                            {{auditForm.dispatchCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="车牌号：">
                            {{auditForm.licenseNumber}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="车型：">
                            {{auditForm.specification}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="线路名称：">
                            {{auditForm.lineName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="车辆性质：">
                            <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="auditForm.vehicleNature"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="靠站时间：">
                            {{auditForm.signInTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="确认放空时间：">
                            {{auditForm.emptyTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="放空时长：">
                            {{auditForm.emptyTimeLength}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="放空费：">
                            {{auditForm.emptyAmount}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="15">
                        <el-form-item label="放空原因：">
                            {{auditForm.emptyRemark}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="审核：">
                            <el-switch v-model="auditForm.auditStatus" active-color="#13ce66" inactive-color="#ff4949"
                                       :active-value="Constant.AUDIT_STATUS.PASS" :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                       active-text="同意" inactive-text="拒绝"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="auditForm.auditRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAuditDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="auditSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改放空费"  :visible.sync="showModifyEmptyAmountDialog" width="30%" @close="hideModifyEmptyAmount()">
            <el-form size="small"  ref="modifyEmptyAmountForm" :model="modifyEmptyAmountForm" label-width="120px">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="放空费：" prop="emptyAmount"
                                      :rules="[{required: true, message: '请输入放空费',trigger: 'blur, change'},Validate.money]">
                            <el-input style="display: block"
                                      v-model="modifyEmptyAmountForm.emptyAmount"></el-input>

                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="hideModifyEmptyAmount()">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyEmptyAmount()">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import addSendView from './AddSendView'
    import lineInfo from './LineInfoDialog'
    import {Constant} from 'src/global/constant'
    import {Validate} from 'src/global/validate'

    export default {
        data() {
            return {
                url: '',
                isLoading: true,
                btnLoading: true,
                Constant: Constant,//常量
                Validate: Validate,
                common: Common,
                showAddSendView: false,//加车派车详情
                showLineInfo: false,//线路详情
                showAuditDialog: false,
                showModifyEmptyAmountDialog: false,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    orgCode: '',
                    dispatchCode: '',
                    vehicleCode: '',
                    auditStatus: '',
                    startApplyTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//申请时间
                    endApplyTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    lineId: '',
                    vehicleNature: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null,//操作行的数据
                auditForm: {
                    id: '',

                    dispatchCode: '',
                    lineName: '',
                    licenseNumber: '',
                    specification: '',
                    vehicleNature: '',
                    signInTime: '',
                    emptyTime: '',
                    emptyTimeLength: '',
                    emptyRemark: '',
                    emptyAmount: '',

                    auditStatus: Constant.AUDIT_STATUS.PASS,
                    auditRemark: ''
                },
                modifyEmptyAmountForm: {
                    id: '',
                    emptyAmount: '',
                },
                tableHeight: window.innerHeight>800?430:null
            }
        },
        components:{
            addSendView,
            lineInfo
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    orgCode: '',
                    dispatchCode: '',
                    vehicleCode: '',
                    auditStatus: '',
                    startApplyTime:  Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//申请时间
                    endApplyTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    lineId: '',
                    vehicleNature: ''
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading  = true;
                Http.get(Api.dispatchEmpty.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },result=>{
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
            showLine(row){//线路详情
                this.currentRow = row.dispatch;
                this.showLineInfo = true;
            },
            hideLineInfo(){//关闭线路详情
                this.showLineInfo = false;
            },
            AddVehicleView(row){ //派车单详情------------------------------------
                this.currentRow = row.dispatch;
                this.showAddSendView = true;
            },
            hideAddSendView(){ // 关闭派车单详情------------------------------------
                this.showAddSendView = false;
            },
            auditEmpty(row){
                let vm = this;
                vm.auditForm.id = row.id;
                Http.get(Api.dispatchEmpty.getAuditDetailById,{params: {'id': row.id}}, result => {
                    this.auditForm = Object.assign({}, this.auditForm, _.pick(result.result, _.keys(this.auditForm)))
                    vm.showAuditDialog = true;
                })
            },
            auditSubmit(){
                let vm = this;
                Http.post(Api.dispatchEmpty.audit,vm.auditForm, result => {
                    vm.$message.success('审批完成！');
                    vm.showAuditDialog = false;
                    vm.searchList();
                })
            },
            resetAuditForm(){
                let vm = this;
                vm.auditForm = {
                    id: '',

                    dispatchCode: '',
                    lineName: '',
                    licenseNumber: '',
                    specification: '',
                    vehicleNature: '',
                    signInTime: '',
                    emptyTime: '',
                    emptyTimeLength: '',
                    emptyRemark: '',
                    emptyAmount: '',

                    auditStatus: Constant.AUDIT_STATUS.PASS,
                    auditRemark: ''
                }
            },
            showModifyEmptyAmount(row){
                this.modifyEmptyAmountForm.id = row.id;
                this.modifyEmptyAmountForm.emptyAmount = row.emptyAmount;
                this.showModifyEmptyAmountDialog = true;
            },
            hideModifyEmptyAmount(){
                this.showModifyEmptyAmountDialog = false;
                this.resetModifyEmptyAmount();
            },
            resetModifyEmptyAmount(){
                this.modifyEmptyAmountForm.id = '';
                this.modifyEmptyAmountForm.emptyAmount = '';
            },
            //修改放空费
            modifyEmptyAmount() {
                this.$refs.modifyEmptyAmountForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.dispatchEmpty.modifyEmptyAmount, this.modifyEmptyAmountForm, () => {
                            this.$message.success('修改完成!');
                            this.showModifyEmptyAmountDialog = false;
                            this.searchList();
                        })
                    }
                })
            },
            exportData() {//导出
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.dispatchEmpty.page, {params: searchExportParam}, response => {
                    let header = ['派车单号', '放空费', '放空原因', '所属大区', '所属分区', '客户',
                        '线路名称', '签到时间', '确认放空时间', '放空时长',
                        '申请人','申请时间', '审核人', '审核时间', '审核状态', '审核意见'];
                    let filterVal = ['dispatch.code','emptyAmount', 'emptyRemark','dispatch.region.name', 'dispatch.belongOrg.name','dispatch.customer.name',
                        'dispatch.dispatchLine.lineName', 'dispatch.dispatchLine.stopOverStation[0].signInTime', 'emptyTime','emptyTimeLength',
                        'applyUser', 'applyTime', 'auditUser','auditTime', {
                            type: 'dictionary',
                            code: 'AUDIT_STATUS',
                            name: 'auditStatus'
                        }, 'auditRemark'];
                    Common.excel.downloadExl(response.result, header, filterVal, "放空车辆");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            }
        }
    }
</script>

