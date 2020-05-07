<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 我的审批</el-breadcrumb-item>
                <el-breadcrumb-item>客户审批</el-breadcrumb-item>
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
                        <el-form-item label="申请时间:" label-width="120px">
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
                        <el-form-item label="客户名称:">
                            <el-input v-model="searchParam.customerName"></el-input>
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
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="客户编码" prop="code" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="客户名称" prop="name" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="上级客户名称" prop="parentCustomer.name" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="收入主体" prop="incomeSubject" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="结算客户" prop="settlementCustomerCode" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column label="项目客户" header-align="center"  prop="projectCustomer" width="90">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="IS_PROJECT_CUSTOMER" :value="scope.row.projectCustomer"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="所属区域" prop="belongArea" min-width="200" show-overflow-tooltip></el-table-column>
                <!--<el-table-column header-align="center" label="是否需要回单" min-width="140">
                    <template slot-scope="scope">
                        {{scope.row.needReceipt?'是':'否'}}
                    </template>
                </el-table-column>-->
                <el-table-column header-align="center" label="新业务客户" prop="newBusinessCustomer" min-width="200" show-overflow-tooltip ></el-table-column>
                <el-table-column label="行业类型" header-align="center"  prop="industryType" width="90">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="INDUSTRY_TYPE" :value="scope.row.industryType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="申请人" prop="applyUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="申请人所属组织" prop="applyOrg.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="申请时间" prop="applyTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="申请类型" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_TYPE" v-model="scope.row.auditType"></dictionary-select-name>客户
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核人" prop="auditUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核人所属组织" prop="auditOrg.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核状态" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核时间" prop="auditTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核意见" prop="auditRemark" min-width="300"></el-table-column>
                <el-table-column header-align="center" fixed="left" align="center" label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/customerAudit/audit'" :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED" icon="el-icon-tickets" size="mini" @click="showAuditWindow(scope.row)">审批</el-button>
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
        <el-dialog :title="title"  :visible.sync="showAuditDetail" width="50%" @close="resetAuditForm" :top="marginTop">
            <el-form :model="auditContentForm" size="small" label-position="left">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户简称:">
                            {{auditContentForm.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="上级客户:">
                            {{auditContentForm.parentCustomer?auditContentForm.parentCustomer.name:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="收入主体:">
                            {{auditContentForm.incomeSubject}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="14">
                        <el-form-item label="结算客户:">
                            {{auditContentForm.settlementCustomerCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item  label="新业务客户:">
                            {{auditContentForm.newBusinessCustomer}}
                            <!--{{auditContentForm.newBusinessCustomer ? (auditContentForm.newBusinessCustomer === '1' ? '是' : '否') : ''}}-->
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="8" v-show="false">
                        <el-form-item label="是否需要回单:">
                            {{auditContentForm.needReceipt?'是':'否'}}
                        </el-form-item>
                    </el-col>-->
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="项目客户:">
                            {{auditContentForm.projectCustomer?'是':'否'}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属区域:">
                            {{auditContentForm.belongArea}}
                            <!--{{auditContentForm.needReceipt?'是':'否'}}-->
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="行业类型:">
                            <dictionary-select-name option-name="INDUSTRY_TYPE" :value="auditContentForm.industryType" ></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span class="blue">审核意见</span>
            <el-form size="small" :model="auditOpinionForm" label-position="left">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="审核：">
                            <el-switch v-model="auditOpinionForm.auditStatus" active-color="#13ce66" inactive-color="#ff4949"
                                       :active-value="Constant.AUDIT_STATUS.PASS" :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                       active-text="同意" inactive-text="拒绝"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
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
                    customerName: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null,//操作行的数据
                title: "",
                customerAudit:{},
                auditContentForm: {},
                auditOpinionForm: {
                    auditStatus: Constant.AUDIT_STATUS.PASS,
                    auditRemark: ""
                }
            }
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
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.applyUser = '';
                this.searchParam.auditStatus = '';
                this.searchParam.applyTime = [];
                this.searchParam.startApplyTime = '';
                this.searchParam.endApplyTime = '';
                this.searchParam.customerName = ''
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
                Http.get(Api.customerAudit.page,{ params : vm.searchParam }, result => {
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
                    vm.title = `新增客户审批`;
                }else if(row.auditType==='MODIFY'){
                    vm.title = `修改客户审批`;
                }else{
                    vm.title = `删除客户审批`;
                }
                vm.auditContentForm = row;
                vm.showAuditDetail = true;
            },
            auditSubmit(){
                let vm = this;
                vm.auditOpinionForm.id = vm.auditContentForm.id;
                Http.post(Api.customerAudit.audit,vm.auditOpinionForm, result => {
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
</style>
