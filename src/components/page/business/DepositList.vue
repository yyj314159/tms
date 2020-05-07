<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 商务管理</el-breadcrumb-item>
                <el-breadcrumb-item> 保证金</el-breadcrumb-item>
                <el-breadcrumb-item> 保证金</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="保证金编号:">
                            <el-input v-model="searchParam.code" style="display:block"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="履约金编号:">
                            <el-input v-model="searchParam.performanceCode" style="display:block"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="项目名称:">
                            <el-input v-model="searchParam.projectName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="项目编号:">
                            <el-input v-model="searchParam.projectCode" style="display:block"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select style="display: block" option-name="AUDIT_STATUS" v-model="searchParam.auditStatus"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="操作类型:">
                            <dictionary-select option-name="DEPOSIT_OPERATION_TYPE"  v-model="searchParam.operationType" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否有收据:">
                            <dictionary-select option-name="IS_RECEIVED"  v-model="searchParam.receivedFlag" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否有凭证:">
                            <dictionary-select option-name="IS_VOUCHER"  v-model="searchParam.voucherFlag" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="业务经手人:">
                            <user-select v-model="searchParam.handler" style="display:block"></user-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户名称:">
                            <customer-select v-model="searchParam.customerCode" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="申请开始时间:">
                            <date-picker-single v-model="searchParam.applyStartTime" date-type="start" :end-date="searchParam.applyEndTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="申请结束时间:">
                            <date-picker-single v-model="searchParam.applyEndTime" date-type="end" :start-date="searchParam.applyStartTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="保证金状态:">
                            <dictionary-select style="display: block" option-name="DEPOSIT_PERFORMANCE_STATUS" v-model="searchParam.depositStatus"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="!isMoreItemShow">
                        <el-form-item label="申请开始时间:">
                            <date-picker-single v-model="searchParam.applyStartTime" date-type="start" :end-date="searchParam.applyEndTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="!isMoreItemShow">
                        <el-form-item label="申请结束时间:">
                            <date-picker-single v-model="searchParam.applyEndTime" date-type="end" :start-date="searchParam.applyStartTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="isMoreItemShow ? 18:6">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="text" v-show="!isMoreItemShow" @click="isMoreItemShow = true" size="small">展开更多搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="isMoreItemShow = false" size="small">收起搜索项<<
                            </el-button>
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" v-permission="'/deposit/add'" @click="addDeposit">新增</el-button>
            <export-button v-permission="'/deposit/export'" :href="Api.deposit.export" :params="searchParam" :download-name="'保证金数据'" style="display: inline-block;"></export-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe
                      :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="保证金编号" prop="code" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;display:inline-block;" @click="showDeposit(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="项目编号" prop="projectCode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="履约金编号" prop="performanceCode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="保证金状态" prop="depositStatus" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.depositStatus === 'APPLYING'">申请中</span>
                        <span v-else-if="scope.row.depositStatus === 'APPLY_REFUSE'">申请拒绝</span>
                        <span v-else-if="scope.row.depositStatus === 'USING'">使用中</span>
                        <span v-else-if="scope.row.depositStatus === 'OVERDUE'">逾期中</span>
                        <span v-else-if="scope.row.depositStatus === 'CANCEL'">已销账</span>
                        <span v-else-if="scope.row.depositStatus === 'BAD'">已坏账</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="操作类型" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="DEPOSIT_OPERATION_TYPE"
                                                :value="scope.row.operationType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核状态" prop="depositAudit.auditStatus" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.auditStatus"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="支付金额" prop="depositAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="保证金剩余金额" prop="depositResidueAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="保证金转出金额" prop="depositOutAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="保证金转出差额" prop="depositOutBalanceAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="保证金退回金额" prop="depositReturnAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="逾期超时（天）" prop="overdueDay" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应支付日期" prop="paymentDate" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="收款抬头" prop="collectCompany" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="收款银行" prop="collectBank" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="收款账号" prop="collectAccount" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出款抬头" prop="paymentCompany" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出款银行" prop="paymentBank" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应回款日期" prop="receivedDate" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="项目名称" prop="projectName" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="则一客户" prop="customerName" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="申请人员" prop="createUser" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="申请时间" prop="createTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审批人员" prop="depositAudit.auditor" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审批时间" prop="depositAudit.auditTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="300">
                    <template slot-scope="scope">
                        <el-button v-permission="'/deposit/modify'" :disabled="!(scope.row.depositStatus === 'APPLYING' || scope.row.depositStatus === 'APPLY_REFUSE')" size="mini" type="text" icon="el-icon-edit" @click="modifyDeposit(scope.row)">修改</el-button>
                        <el-button v-permission="'/deposit/changeReturn'" :disabled="!(scope.row.depositStatus === 'USING' || scope.row.depositStatus === 'OVERDUE')" size="mini" type="text" icon="el-icon-edit" @click="changeReturn(scope.row)">转退</el-button>
                        <el-button v-permission="'/deposit/voucherMaintain'" size="mini" type="text" icon="el-icon-edit" @click="voucherMaintain(scope.row)">凭证维护</el-button>
                        <el-button v-permission="'/deposit/upload'" size="mini" type="text" icon="el-icon-edit" @click="editDepositAttachment(scope.row)" style="font-weight: bold;">上传附件</el-button>
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

        <!-- 编辑附件 -->
        <el-dialog title="附件"  :visible.sync="showEditDepositAttachment" width="35%">
            <el-form size="small" :model="editDepositAttachmentForm" ref="editDepositAttachmentForm" label-width="30%">
                <el-row>
                    <el-col :span="2" v-if="false">
                        <el-form-item label="保证金编号:">
                            <el-input v-model="editDepositAttachmentForm.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="22">
                        <el-form-item label="附件：" :rules="{required:true,message:'请选择附件！'}">
                            <upload-image ref="projectAttachment" v-model="editDepositAttachmentForm.projectAttachment" :limit="4"></upload-image>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showEditDepositAttachment = false">取 消</el-button>
                <el-button size="small" type="primary" @click="editDepositAttachmentFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增 -->
        <deposit-add v-if="showAddDeposit"  :dialogVisible="showAddDeposit" @close="hideAdd"  :currentRow="currentRow"></deposit-add>
        <!-- 修改 -->
        <deposit-modify v-if="showUpdateDeposit"  :dialogVisible="showUpdateDeposit" @close="hideModify"  :currentRow="currentRow"></deposit-modify>
        <!-- 转寄 -->
        <deposit-transfer-return v-if="showTransferDeposit"  :dialogVisible="showTransferDeposit" @close="hideTransfer"  :currentRow="currentRow"></deposit-transfer-return>
        <!-- 凭证 -->
        <deposit-evidence v-if="showEvidence"  :dialogVisible="showEvidence" @close="hideEvidence"  :currentRow="currentRow"></deposit-evidence>
        <!-- 保证金详情 -->
        <deposit-info-dialog v-if="showDepositInfo"  :dialogVisible="showDepositInfo" @close="hideDepositInfo"  :currentRow="currentRow"></deposit-info-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import depositAdd from './DepositAdd.vue'
    import depositModify from './DepositModify.vue'
    import depositInfoDialog from './DepositInfoDialog.vue'
    import depositTransferReturn from './DepositTransferReturn.vue'
    import depositEvidence from "./DepositEvidence.vue"

    export default {
        data() {
            return {
                isLoading: false,
                Api: Api,
                isMoreItemShow: false,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',//客户编号
                    projectName: '',//项目名称
                    projectCode: '',//项目编码
                    operationType: '',//操作类型
                    voucherFlag: '',//是否有凭证
                    handler: '',//业务经手人
                    performanceCode: '',//履约金编号
                    depositStatus: '',//保证金状态
                    auditStatus: '',//审核状态
                    receivedFlag: '',//是否有收据
                    code: '',//保证金编号
                    applyStartTime: Common.date.dateFormat(new Date(new Date().getTime() - 30*24*3600*1000),"YYYY-MM-DD 00:00:00"),
                    applyEndTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59")
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //附件
                showEditDepositAttachment: false,
                editDepositAttachmentForm:{
                    code: '',
                    projectAttachment:''
                },
                currentRow: null,//操作行的数据
                tableHeight: window.innerHeight>800?430:null,
                showAddDeposit: false,
                showUpdateDeposit: false,
                showTransferDeposit: false,
                //维护凭证
                showEvidence: false,
                showDepositInfo: false
            }
        },
        components:{
            depositAdd,
            depositModify,
            depositTransferReturn,
            depositEvidence,
            depositInfoDialog
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',//客户编号
                    projectName: '',//项目名称
                    projectCode: '',//项目编码
                    operationType: '',//操作类型
                    voucherFlag: '',//是否有凭证
                    handler: '',//业务经手人
                    performanceCode: '',//履约金编号
                    depositStatus: '',//保证金状态
                    auditStatus: '',//审核状态
                    receivedFlag: '',//是否有收据
                    code: '',//保证金编号
                    applyStartTime: Common.date.dateFormat(new Date(new Date().getTime() - 30*24*3600*1000),"YYYY-MM-DD 00:00:00"),
                    applyEndTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59")
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.deposit.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            //编辑附件
            editDepositAttachment(row){
                let vm=this;
                setTimeout(()=>{
                    vm.$refs.projectAttachment.clearFileList();
                    Http.get(Api.deposit.queryByCode, {params: {'code': row.code}}, result => {
                        vm.editDepositAttachmentForm.code = result.result.code;
                        if(result.result.projectAttachment != null){
                            /*设置附件*/
                            vm.$refs.projectAttachment.setFileList(result.result.projectAttachment.split(","));
                        }
                    });
                }, 0)
                vm.showEditDepositAttachment = true;
            },
            editDepositAttachmentFormSubmit(){
                let vm = this;
                vm.editDepositAttachmentForm.projectAttachment = vm.$refs.projectAttachment.getFileList().join(",");//图片路径
                Http.post(Api.deposit.upload, vm.editDepositAttachmentForm, result => {
                    vm.$message.success('附件编辑成功！');
                    vm.showEditDepositAttachment = false;
                    this.$emit('close');
                    this.searchList();
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
            //新增
            addDeposit(row){
                this.showAddDeposit = true;
            },
            hideAdd(){
                this.showAddDeposit = false;
                this.searchList();
            },
            //修改
            modifyDeposit(row){
                this.currentRow = row;
                this.showUpdateDeposit = true;
            },
            hideModify(){
                this.showUpdateDeposit = false;
                this.searchList();
            },
            //转退
            changeReturn(row){
                this.currentRow = row;
                this.showTransferDeposit = true;
            },
            hideTransfer(){
                this.showTransferDeposit = false;
                this.searchList();
            },
            //凭证
            voucherMaintain(row){
                this.currentRow = row;
                this.showEvidence = true;
            },
            hideEvidence(){
                this.showEvidence = false;
                this.searchList();
            },
            showDeposit(row){//保证金详情
                this.currentRow = row;
                this.showDepositInfo = true;
            },
            hideDepositInfo(){//关闭保证金详情
                this.showDepositInfo = false;
            },
        }
    }
</script>

