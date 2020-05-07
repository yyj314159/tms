<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 商务管理</el-breadcrumb-item>
                <el-breadcrumb-item> 履约金</el-breadcrumb-item>
                <el-breadcrumb-item> 履约金</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="履约金编号:">
                            <el-input v-model="searchParam.code" style="display:block"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="保证金编号:">
                            <el-input v-model="searchParam.depositCode" style="display:block"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="合同名称:">
                            <el-input v-model="searchParam.contractName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="合同编号:">
                            <el-input v-model="searchParam.contractCode" style="display:block"></el-input>
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
                            <dictionary-select option-name="PERFORMANCE_OPERATION_TYPE"  v-model="searchParam.operationType" style="display:block;"></dictionary-select>
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
                        <el-form-item label="履约金状态:">
                            <dictionary-select style="display: block" option-name="DEPOSIT_PERFORMANCE_STATUS" v-model="searchParam.performanceStatus"></dictionary-select>
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
            <el-button size="mini" type="primary" icon="el-icon-plus" v-permission="'/performance/add'" @click="addPerformance">新增</el-button>
            <export-button v-permission="'/performance/export'" :href="Api.performance.export" :params="searchParam" :download-name="'履约金数据'" style="display: inline-block;"></export-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe
                      :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="履约金编号" prop="code" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;display:inline-block;" @click="showPerformance(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="投标保证金编号" prop="depositCode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="履约金续约编号" prop="continueCode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="履约金状态" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.performanceStatus === 'APPLYING'">申请中</span>
                        <span v-else-if="scope.row.performanceStatus === 'APPLY_REFUSE'">申请拒绝</span>
                        <span v-else-if="scope.row.performanceStatus === 'USING'">使用中</span>
                        <span v-else-if="scope.row.performanceStatus === 'OVERDUE'">逾期中</span>
                        <span v-else-if="scope.row.performanceStatus === 'CANCEL'">已销账</span>
                        <span v-else-if="scope.row.performanceStatus === 'BAD'">已坏账</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="操作类型" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="PERFORMANCE_OPERATION_TYPE"
                                                :value="scope.row.operationType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核状态" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.auditStatus == null">未审核</span>
                        <span v-else>
                            <dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.auditStatus"/>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="支付金额" prop="performanceAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="履约金剩余金额" prop="performanceResidueAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="履约金转出金额" prop="performanceOutAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="履约金转出差额" prop="performanceOutBalanceAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="履约金退回金额" prop="performanceReturnAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="逾期超时（天）" prop="overdueDay" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应支付日期" prop="paymentDate" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="收款抬头" prop="collectCompany" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="收款银行" prop="collectBank" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="收款账号" prop="collectAccount" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出款抬头" prop="paymentCompany" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出款银行" prop="paymentBank" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应回款日期" prop="receivedDate" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="合同编号" prop="contractCode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="合同名称" prop="contractName" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="则一客户" prop="customerName" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="申请人员" prop="createUser" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="申请时间" prop="createTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审批人员" prop="performanceAudit.auditor" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审批时间" prop="performanceAudit.auditTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="300">
                    <template slot-scope="scope">
                        <el-button v-permission="'/performance/modify'" :disabled="!(scope.row.performanceStatus === 'APPLYING' || scope.row.performanceStatus === 'APPLY_REFUSE')" size="mini" type="text" icon="el-icon-edit" @click="modifyPerformance(scope.row)">修改</el-button>
                        <el-button v-permission="'/performance/changeReturn'" :disabled="!(scope.row.performanceStatus === 'USING' || scope.row.performanceStatus === 'OVERDUE')" size="mini" type="text" icon="el-icon-edit" @click="changeReturn(scope.row)">转退</el-button>
                        <el-button v-permission="'/performance/voucherMaintain'" size="mini" type="text" icon="el-icon-edit" @click="voucherMaintain(scope.row)">凭证维护</el-button>
                        <el-button v-permission="'/performance/upload'" size="mini" type="text" icon="el-icon-edit" @click="editPerformanceAttachment(scope.row)" style="font-weight: bold;">上传附件</el-button>
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
        <el-dialog title="附件"  :visible.sync="showEditPerformanceAttachment" width="35%">
            <el-form size="small" :model="editPerformanceAttachmentForm" ref="editPerformanceAttachmentForm" label-width="30%">
                <el-row>
                    <el-col :span="2" v-if="false">
                        <el-form-item label="履约金编号:">
                            <el-input v-model="editPerformanceAttachmentForm.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="22">
                        <el-form-item label="附件：" :rules="{required:true,message:'请选择附件！'}">
                            <upload-image ref="contractAttachment" v-model="editPerformanceAttachmentForm.contractAttachment" :limit="4"></upload-image>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showEditPerformanceAttachment = false">取 消</el-button>
                <el-button size="small" type="primary" @click="editPerformanceAttachmentFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增 -->
        <performance-add v-if="showAddPerformance"  :dialogVisible="showAddPerformance" @close="hideAdd"  :currentRow="currentRow"></performance-add>
        <!-- 修改 -->
        <performance-modify v-if="showUpdatePerformance"  :dialogVisible="showUpdatePerformance" @close="hideModify"  :currentRow="currentRow"></performance-modify>
        <!-- 转寄 -->
        <performance-transfer-return v-if="showTransferPerformance"  :dialogVisible="showTransferPerformance" @close="hideTransfer"  :currentRow="currentRow"></performance-transfer-return>
        <!-- 凭证 -->
        <performance-evidence v-if="showEvidence"  :dialogVisible="showEvidence" @close="hideEvidence"  :currentRow="currentRow"></performance-evidence>
        <!-- 履约金详情 -->
        <performance-info-dialog v-if="showPerformanceInfo"  :dialogVisible="showPerformanceInfo" @close="hidePerformanceInfo"  :currentRow="currentRow"></performance-info-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import performanceAdd from './PerformanceAdd.vue'
    import performanceModify from './PerformanceModify.vue'
    import performanceInfoDialog from './PerformanceInfoDialog'
    import performanceTransferReturn from './PerformanceTransferReturn.vue'
    import performanceEvidence from "./PerformanceEvidence.vue"

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
                    contractName: '',//合同名称
                    contractCode: '',//合同编码
                    operationType: '',//操作类型
                    voucherFlag: '',//是否有凭证
                    handler: '',//业务经手人
                    performanceStatus: '',//履约金状态
                    auditStatus: '',//审核状态
                    receivedFlag: '',//是否有收据
                    depositCode: '',//保证金编号
                    code: '',//履约金编号
                    applyStartTime: Common.date.dateFormat(new Date(new Date().getTime() - 30*24*3600*1000),"YYYY-MM-DD 00:00:00"),
                    applyEndTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59")
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //附件
                showEditPerformanceAttachment: false,
                editPerformanceAttachmentForm:{
                    code: '',
                    contractAttachment:''
                },
                currentRow: null,//操作行的数据
                tableHeight: window.innerHeight>800?430:null,
                showAddPerformance: false,
                showUpdatePerformance: false,
                showTransferPerformance: false,
                //维护凭证
                showEvidence: false,
                showPerformanceInfo: false
            }
        },
        components:{
            performanceAdd,
            performanceModify,
            performanceTransferReturn,
            performanceEvidence,
            performanceInfoDialog
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
                    contractName: '',//合同名称
                    contractCode: '',//合同编码
                    operationType: '',//操作类型
                    voucherFlag: '',//是否有凭证
                    handler: '',//业务经手人
                    performanceStatus: '',//履约金状态
                    auditStatus: '',//审核状态
                    receivedFlag: '',//是否有收据
                    depositCode: '',//保证金编号
                    code: '',//履约金编号
                    applyStartTime: Common.date.dateFormat(new Date(new Date().getTime() - 30*24*3600*1000),"YYYY-MM-DD 00:00:00"),
                    applyEndTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59")
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.performance.page,{ params : vm.searchParam }, result => {
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
            editPerformanceAttachment(row){
                let vm=this;
                setTimeout(()=>{
                    vm.$refs.contractAttachment.clearFileList();
                    Http.get(Api.performance.queryByCode, {params: {'code': row.code}}, result => {
                        vm.editPerformanceAttachmentForm.code = result.result.code;
                        if(result.result.contractAttachment != null){
                            /*设置附件*/
                            vm.$refs.contractAttachment.setFileList(result.result.contractAttachment.split(","));
                        }
                    });
                }, 0)
                vm.showEditPerformanceAttachment = true;
            },
            editPerformanceAttachmentFormSubmit(){
                let vm = this;
                vm.editPerformanceAttachmentForm.contractAttachment = vm.$refs.contractAttachment.getFileList().join(",");//图片路径
                Http.post(Api.performance.upload, vm.editPerformanceAttachmentForm, result => {
                    vm.$message.success('附件编辑成功！');
                    vm.showEditPerformanceAttachment = false;
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
            addPerformance(row){
                this.showAddPerformance = true;
            },
            hideAdd(){
                this.showAddPerformance = false;
                this.searchList();
            },
            //修改
            modifyPerformance(row){
                this.currentRow = row;
                this.showUpdatePerformance = true;
            },
            hideModify(){
                this.showUpdatePerformance = false;
                this.searchList();
            },
            //转退
            changeReturn(row){
                this.currentRow = row;
                this.showTransferPerformance = true;
            },
            hideTransfer(){
                this.showTransferPerformance = false;
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
            showPerformance(row){//履约金详情
                this.currentRow = row;
                this.showPerformanceInfo = true;
            },
            hidePerformanceInfo(){//关闭履约金详情
                this.showPerformanceInfo = false;
            },
        }
    }
</script>

