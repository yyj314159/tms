<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 我的审批</el-breadcrumb-item>
                <el-breadcrumb-item>线路审批</el-breadcrumb-item>
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
                            <dictionary-select option-name="AUDIT_STATUS" v-model="searchParam.auditStatus"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请时间:">
                            <el-date-picker
                                v-model="searchParam.applyTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width:100%"
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
                            <station-select v-model="searchParam.departStationCode" auditStatus="PASS"
                                            style="display:block;"></station-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的站点:">
                            <station-select v-model="searchParam.destStationCode" auditStatus="PASS"
                                            style="display:block;"></station-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="业务类型:">
                            <dictionary-select v-model="searchParam.businessType" option-name="LINE_BUSINESS_TYPE"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" style="float: right">
                        <el-form-item style="float: right">
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
                <el-table-column header-align="center" label="客户编号" prop="customerCode" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="客户名称" prop="customer.name" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路编码" prop="code" min-width="260"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="name" min-width="260"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="所属区域" prop="belongOrgName" min-width="260"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="departStation.name" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="经停站点" prop="lineTransitStationStr" min-width="240"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="destStation.name" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路类型" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_TYPE"
                                                :value="scope.row.lineType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="营运类型" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_OPERATION_TYPE"
                                                :value="scope.row.operationType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="发车时间" prop="departTime" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="里程" prop="distance" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="客户时效" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.timeHour || 0}时${scope.row.timeMin || 0}分`}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="则一时效" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.timeZeyiHour || 0}时${scope.row.timeZeyiMin || 0}分`}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="考核方式" prop="evaluationMode" min-width="120"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_EVALUATION_MODE"
                                                :value="scope.row.evaluationMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="是否共建线路" prop="togetherFlag" min-width="120">
                    <template slot-scope="scope">
                        {{scope.row.togetherFlag ? "是" : "否"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="申请人" prop="applyUser" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="申请组织编号" prop="applyOrgCode" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="申请时间" prop="applyTime" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="申请类型" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_TYPE"
                                                v-model="scope.row.auditType"></dictionary-select-name>
                        线路
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="业务类型" prop="businessType" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_BUSINESS_TYPE"
                                                :value="scope.row.businessType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="回单类型" prop="receiptType" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="RECEIPT_TYPE"
                                                :value="scope.row.receiptType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核人" prop="auditUser" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核组织编号" prop="auditOrgCode" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核状态" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS"
                                                v-model="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核意见" prop="auditRemark" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核时间" prop="auditTime" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="业务员" prop="salesmanList" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" fixed="left" align="center" label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/lineAudit/audit'"
                                   :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED"
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

        <!-- 审核申请内容 -->
        <el-dialog :title="title" :visible.sync="showAuditDetail" width="45%" @close="resetAuditForm" :top="marginTop">
            <el-form :model="auditContentForm" size="small" label-position="left">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户:">
                            {{auditContentForm.customer?auditContentForm.customer.name:""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出发站点:">
                            {{auditContentForm.departStation?auditContentForm.departStation.name:""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="目的站点:">
                            {{auditContentForm.destStation?auditContentForm.destStation.name:""}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="发车时间:">
                            {{auditContentForm.departTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="线路类型:">
                            <dictionary-select-name option-name="LINE_TYPE"
                                                    :value="auditContentForm.lineType"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="营运类型:">
                            <dictionary-select-name option-name="LINE_OPERATION_TYPE"
                                                    :value="auditContentForm.operationType"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="总里程:">
                            {{auditContentForm.distance}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户时效:">
                            {{auditContentForm.timeHour?auditContentForm.timeHour:'0'}}小时
                            {{auditContentForm.timeMin?auditContentForm.timeMin:'0'}}分钟
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="则一时效:">
                            {{auditContentForm.timeZeyiHour?auditContentForm.timeZeyiHour:'0'}}小时
                            {{auditContentForm.timeZeyiMin?auditContentForm.timeZeyiMin:'0'}}分钟
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="考核方式:">
                            <dictionary-select-name option-name="LINE_EVALUATION_MODE"
                                                    :value="auditContentForm.evaluationMode"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否共建线路:">
                            {{auditContentForm.togetherFlag ? "是" : "否"}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="业务类型:" prop="businessType">
                            <dictionary-select-name :value="auditContentForm.businessType"
                                                    option-name="LINE_BUSINESS_TYPE"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="回单类型:" prop="receiptType">
                            <dictionary-select-name :value="auditContentForm.receiptType"
                                                    option-name="RECEIPT_TYPE"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="业务员:" prop="salesmanList">
                            {{auditContentForm.salesmanList}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属区域:" prop="belongOrgName">
                            {{auditContentForm.belongOrgName}}
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-table size="mini" class="content-table" :data="auditContentForm.stationInfoList" border>
                    <el-table-column align="center" label="经停站点" prop="transitStationName"></el-table-column>
                    <el-table-column align="center" label="里程">
                        <template slot-scope="scope">
                            <span>{{scope.row.distance}}公里</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="客户时效">
                        <template slot-scope="scope">
                            <span>{{scope.row.travelTimeHour ? scope.row.travelTimeHour : "0"}}小时</span>
                            <span>{{scope.row.travelTimeMin ? scope.row.travelTimeMin : "0"}}分钟</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="则一时效">
                        <template slot-scope="scope">
                            <span>{{scope.row.travelTimeZeyiHour ? scope.row.travelTimeZeyiHour : "0"}}小时</span>
                            <span>{{scope.row.travelTimeZeyiMin ?scope.row.travelTimeZeyiMin : "0"}}分钟</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <el-form size="small" :model="auditOpinionForm" label-position="left">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="审核：">
                            <el-switch v-model="auditOpinionForm.auditStatus" active-color="#13ce66"
                                       inactive-color="#ff4949"
                                       :active-value="Constant.AUDIT_STATUS.PASS"
                                       :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                       active-text="同意" inactive-text="拒绝"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！"
                                      v-model="auditOpinionForm.auditRemark"></el-input>
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
    import {Http, Api, Validate, Common, Constant} from 'src/global'

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
                    destStationCode: '',
                    businessType: '',
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
                this.searchParam.lineId = '';
                this.searchParam.customerCode = '';
                this.searchParam.departStationCode = '';
                this.searchParam.destStationCode = '';
                this.searchParam.businessType = '';
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                if (this.searchParam.applyTime) {
                    this.searchParam.startApplyTime = this.searchParam.applyTime[0];
                    this.searchParam.endApplyTime = this.searchParam.applyTime[1];
                } else {
                    this.searchParam.startApplyTime = "";
                    this.searchParam.endApplyTime = "";
                }
                Http.get(Api.lineAudit.page, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
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
            showAuditWindow(row) {
                let vm = this;
                if (row.auditType === 'ADD') {
                    vm.title = `新增线路审批`;
                } else if (row.auditType === 'MODIFY') {
                    vm.title = `修改线路审批`;
                } else {
                    vm.title = `删除线路审批`;
                }
                vm.auditContentForm = row;
                vm.showAuditDetail = true;
            },
            auditSubmit() {
                let vm = this;
                vm.auditOpinionForm.id = vm.auditContentForm.id;
                Http.post(Api.lineAudit.audit, vm.auditOpinionForm, result => {
                    vm.showAuditDetail = false;
                    vm.$message.success('审批完成！');
                    vm.searchList();
                })
            },
            resetAuditForm() {
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
