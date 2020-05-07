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
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="申请人:">
                            <user-select v-model="searchParam.applyUser" style="display:block;"></user-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select option-name="AUDIT_STATUS"  v-model="searchParam.auditStatus" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请时间:">
                            <el-date-picker
                                v-model="searchParam.applyTime"
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
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineId" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" level="lowest" auditStatus="PASS"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出发站点:">
                            <station-select v-model="searchParam.departStationCode" auditStatus="PASS" style="display:block;"></station-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的站点:">
                            <station-select v-model="searchParam.destStationCode" auditStatus="PASS"  style="display:block;"></station-select>
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
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="线路名称" prop="line.name" min-width="260" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="客户" prop="line.customer.name" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="line.departStation.name" min-width="260" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="line.destStation.name" min-width="260" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="关联供应商" prop="supplierInfo.name" min-width="260" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="计价方式" prop="priceType" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_PRICE_TYPE" :value="scope.row.priceType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车型规格" prop="vehicleSize" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="计价单价" prop="priceUnit" min-width="140" show-overflow-tooltip></el-table-column>
               <!-- <el-table-column header-align="center" label="是否开票" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.isInvoice==='1'?'是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="开票类型" prop="invoiceType" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_INVOICE_TYPE" :value="scope.row.invoiceType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="开票比例（%）" prop="invoiceRatio" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="开票金额" prop="invoiceAmount" min-width="140" show-overflow-tooltip></el-table-column>-->
                <el-table-column header-align="center" label="油卡金额" prop="oilCardAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="申请人" prop="applyUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="申请人所属组织" prop="applyOrg.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="申请时间" prop="applyTime" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="申请类型" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_TYPE" v-model="scope.row.auditType"></dictionary-select-name>外请应付
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核人" prop="auditUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核人所属组织" prop="auditOrg.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核状态" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核时间" prop="auditTime" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="审核意见" prop="auditRemark" min-width="300" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" fixed="left" align="center" label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/lineOutInviteAudit/audit'" :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED" icon="el-icon-tickets" size="mini" @click="showAuditWindow(scope.row)">审批</el-button>
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

        <!-- 审核申请内容 -->
        <el-dialog :title="title"  :visible.sync="showAuditDetail" width="45%" @close="resetAuditForm">
            <el-form :model="auditContentForm" size="small" label-width="120px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="线路名称：">
                            {{auditContentForm.line?auditContentForm.line.name:''}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="出发站点：">
                            {{auditContentForm.line.departStation?auditContentForm.line.departStation.name:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="目的站点：">
                            {{auditContentForm.line.destStation?auditContentForm.line.destStation.name:''}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="关联供应商：">
                            {{auditContentForm.supplierInfo?auditContentForm.supplierInfo.name:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="计价方式：">
                            <dictionary-select-name option-name="LINE_PRICE_TYPE" :value="auditContentForm.priceType"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车型规格：">
                            <dictionary-select-name option-name="VEHICLE_SPECIFICATION" :value="auditContentForm.vehicleSize"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="计价单价：">
                            {{auditContentForm.priceUnit}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="油卡金额：">
                            {{auditContentForm.oilCardAmount}}
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="8">
                        <el-form-item label="是否开票：">
                            {{auditContentForm.isInvoice==='1'?'是':'否'}}
                        </el-form-item>
                    </el-col>-->
                </el-row>
                <!--<el-row>
                    <el-col :span="8">
                        <el-form-item label="开票类型：">
                            <dictionary-select-name option-name="LINE_INVOICE_TYPE" :value="auditContentForm.invoiceType"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开票比例：">
                            {{auditContentForm.invoiceRatio}} %
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开票金额：">
                            {{auditContentForm.invoiceAmount}}
                        </el-form-item>
                    </el-col>
                </el-row>-->
            </el-form>
            <span class="blue">审核意见</span>
            <el-form size="small" :model="auditOpinionForm" label-width="120px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="审核：">
                            <el-switch v-model="auditOpinionForm.auditStatus" active-color="#13ce66" inactive-color="#ff4949"
                                       :active-value="Constant.AUDIT_STATUS.PASS" :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                       active-text="同意" inactive-text="拒绝"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="auditOpinionForm.auditRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAuditDetail = false">取 消</el-button>
                <el-button size="small" type="primary" @click="auditSubmit">确 定</el-button>
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
                showAuditDetail: false,//申请内容
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    applyUser: '',//申请人
                    auditStatus: Constant.AUDIT_STATUS.UNAUDITED,//审核状态
                    applyTime: [],//创建时间
                    startApplyTime: '',
                    endApplyTime: '',
                    lineId: '',
                    customerCode: '',
                    departStationCode: '',
                    destStationCode: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null,//操作行的数据
                title: "",
                auditContentForm: {
                    lineContract:{},
                    line:{
                        departStation:{},
                        destStation:{}
                    }
                },
                auditOpinionForm: {
                    auditStatus: Constant.AUDIT_STATUS.PASS,
                    auditRemark: ""
                }
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.applyUser = '';
                this.searchParam.auditStatus = '';
                this.searchParam.applyTime = [];
                this.searchParam.startApplyTime = '';
                this.searchParam.endApplyTime = '';
                this.searchParam.lineId = '';
                this.searchParam.customerCode = '';
                this.searchParam.departStationCode = '';
                this.searchParam.destStationCode = '';
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                if(this.searchParam.applyTime){
                    this.searchParam.startApplyTime = this.searchParam.applyTime[0];
                    this.searchParam.endApplyTime = this.searchParam.applyTime[1];
                }else{
                    this.searchParam.startApplyTime = "";
                    this.searchParam.endApplyTime = "";
                }
                Http.get(Api.lineOutInviteAudit.page,{ params : vm.searchParam }, result => {
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
            showAuditWindow(row){
                let vm = this;
                if(row.auditType==='ADD'){
                    vm.title = `新增外请应付审批`;
                }else if(row.auditType==='MODIFY'){
                    vm.title = `修改外请应付审批`;
                }else{
                    vm.title = `删除外请应付审批`;
                }
                vm.auditContentForm = row;
                vm.showAuditDetail = true;
            },
            auditSubmit(){
                let vm = this;
                vm.auditOpinionForm.id = vm.auditContentForm.id;
                Http.post(Api.lineOutInviteAudit.audit,vm.auditOpinionForm, result => {
                    vm.showAuditDetail = false;
                    vm.$message.success('审批完成！');
                    vm.searchList();
                })
            },
            resetAuditForm(){
                let vm = this;
                vm.auditOpinionForm.auditStatus = Constant.AUDIT_STATUS.PASS;
                vm.auditOpinionForm.auditRemark = '';
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
