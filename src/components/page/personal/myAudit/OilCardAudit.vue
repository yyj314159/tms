<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 我的审批</el-breadcrumb-item>
                <el-breadcrumb-item>油卡审批</el-breadcrumb-item>
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
            <el-table  size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column  label="运单号" prop="waybillCode" min-width="150"></el-table-column>
                <el-table-column  label="油卡卡号" prop="cardNo" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column  label="合作公司" prop="cardCompany" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OIL_CARD_COMPANY"
                                                :value="scope.row.cardCompany"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column  label="车牌号" prop="vehicleCode" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column  label="车辆类型" prop="operationMode" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                :value="scope.row.operationMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column  label="充值金额" prop="rechargeAmount" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column  label="充值类型" min-width="140" prop="rechargeType">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OIL_RECHARGE_STATUS"
                                                :value="scope.row.rechargeType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column  label="申请人" prop="applyUser" min-width="140"></el-table-column>
                <el-table-column  label="申请人所属组织" prop="applyOrgCode" min-width="140"></el-table-column>
                <el-table-column  label="申请时间" prop="applyTime" min-width="140"></el-table-column>
                <el-table-column  label="审核人" prop="auditUser" min-width="140"></el-table-column>
                <el-table-column  label="审核人所属组织" prop="auditOrgCode" min-width="140"></el-table-column>
                <el-table-column  label="审核状态" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column  label="审核时间" prop="auditTime" min-width="140"></el-table-column>
                <el-table-column  label="审核意见" prop="auditRemark" min-width="300"></el-table-column>
                <el-table-column  fixed="left" align="center" label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/oilCardAudit/audit'" :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED" icon="el-icon-tickets" size="mini" @click="showAuditWindow(scope.row)">审批</el-button>
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
                        <el-form-item label="油卡卡号:">
                            {{auditContentForm.cardNo}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合作公司:">
                            <datadictionary-name :value="auditContentForm.cardCompany" option-name="OIL_CARD_COMPANY"></datadictionary-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="车牌号:">
                            {{auditContentForm.vehicleCode}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="充值金额:">
                            {{auditContentForm.rechargeAmount}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="充值类型:">
                            <datadictionary-name :value="auditContentForm.rechargeType" option-name="OIL_RECHARGE_STATUS"></datadictionary-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="运单号:">
                            {{auditContentForm.waybillCode}}
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
                                       active-text="同意" inactive-text="拒绝" :disabled="true"></el-switch>
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
    import DatadictionaryName from "../../../common/select/DatadictionaryName";

    export default {
        components: {DatadictionaryName},
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
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null,//操作行的数据
                title: "",
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
                Http.get(Api.oilCardAudit.page,{ params : vm.searchParam }, result => {
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
                vm.title = `油卡审批`;
                vm.auditContentForm = row;
                vm.showAuditDetail = true;
            },
            auditSubmit(){
                let vm = this;
                vm.auditOpinionForm.id = vm.auditContentForm.id;
                Http.post(Api.oilCardAudit.audit,vm.auditOpinionForm, result => {
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
