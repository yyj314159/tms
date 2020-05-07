<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>钉钉审批记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="审批类型:">
                            <ding-talk-autid-type-select style="display: block"  v-model="searchParam.auditType"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审批id:">
                            <el-input v-model="searchParam.auditId" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="钉钉审批id:">
                            <el-input v-model="searchParam.dingtalkAuditId" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="申请人:">
                            <audit-approvers-select style="display: block" v-model="searchParam.originatorUserId" ></audit-approvers-select>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="审批人:">
                            <audit-approvers-select style="display: block" v-model="searchParam.approvers" ></audit-approvers-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="表单字段:">
                            <el-input v-model="searchParam.formComponentValues" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      :border="true"
                      fit
                      highlight-current-row stripe>
                <el-table-column header-align="center" label="审批类型" prop="auditType" min-width="100px"></el-table-column>
                <el-table-column header-align="center" label="审批id" prop="auditId" min-width="250px"></el-table-column>
                <el-table-column header-align="center" label="钉钉审批id" prop="dingtalkAuditId" min-width="250px"></el-table-column>
                <el-table-column header-align="center" label="请求内容" prop="requestContent" min-width="150px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="返回内容" prop="responseContent" min-width="150px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审批流编码" prop="processCode" min-width="150px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="表单字段" prop="formComponentValues" min-width="160px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="申请人" prop="originatorUserId" min-width="100px"></el-table-column>
                <el-table-column header-align="center" label="审批人" prop="approvers" min-width="150px"></el-table-column>
                <el-table-column header-align="center" label="申请人部门" prop="deptId" min-width="150px"></el-table-column>
                <el-table-column header-align="center" label="抄送人" prop="ccList" min-width="160px"></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="160px"></el-table-column>
                <el-table-column header-align="center" label="抄送时间" prop="ccPosition" min-width="160px"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button type="text"  @click="dialogDetailAuditCallback(scope.row)">详情</el-button>
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
        <!-- 钉钉审批记录列表信息 -->
        <el-dialog title="钉钉审批回调记录信息" :visible.sync="dialogDetailAuditCallbackWindow" width="60%">
            <el-table class="content-table" :data="searchSubResult.result" element-loading-text="拼命加载中"
                      border fit
                      size="small"
                      highlight-current-row stripe>
                <el-table-column header-align="center" label="类型" prop="type" min-width="60px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_CALLBACK_TYPE" :value="scope.row.type"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="结果" prop="result" min-width="60px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_CALLBACK_RESULT" :value="scope.row.result"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审批人" prop="staffId" min-width="60px"></el-table-column>
                <el-table-column header-align="center" label="备注" prop="remark" min-width="100px"></el-table-column>
                <el-table-column header-align="center" label="回调内容" prop="callbackContext" min-width="150px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="150px"></el-table-column>
            </el-table>
            <div style="height: 45px">
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChangeSub"
                        @current-change="handleCurrentChangeSub"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="searchSubParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchSubResult.totalCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    export default {
        data() {
            return {
                //钉钉审批查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    auditType: '',
                    auditId: '',
                    dingtalkAuditId:'',
                    originatorUserId:'',
                    approvers:'',
                    formComponentValues:''
                },
                //钉钉审批返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                //钉钉审批记录查询参数
                searchSubParam:{
                    currentPage: 1,
                    pageSize: 10,
                    dingtalkAuditId:'',
                },
                //钉钉审批记录返回结果
                searchSubResult:{
                    totalCount: 0,
                    result: []
                },
                //钉钉审批记录信息表
                dialogDetailAuditCallbackWindow: false,
            }
        },
        mounted() {//页面初始化，就显示数据
            this.searchList();
        },
        methods: {
            resetSearchParam() {//钉钉审批重置方法
                let vm = this;
                vm.searchParam.auditType = '';
                vm.searchParam.auditId = '';
                vm.searchParam.dingtalkAuditId = '';
                vm.searchParam.approvers = '';
                vm.searchParam.originatorUserId='';
                vm.searchParam.formComponentValues='';
            },
            searchList() {//钉钉审批查寻方法
                let vm = this;
                Http.get(Api.auditProcess.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = 1;
                    vm.searchParam.pageSize = result.pageSize;
                })
            },
            handleSizeChange(val) {//一页显示几条数据
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {//改变当前页数
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            },
            dialogDetailAuditCallback(row){//钉钉审批记录信息列表
                let vm = this;
                vm.searchSubParam.dingtalkAuditId=row.dingtalkAuditId;
                Http.get(Api.auditCallback.page, {params: vm.searchSubParam}, result => {
                    vm.dialogDetailAuditCallbackWindow = true;
                    vm.searchSubResult.result = result.result;
                    vm.searchSubResult.totalCount = result.totalCount;
                    vm.searchSubParam.currentPage = result.currentPage;
                    vm.searchSubParam.pageSize = result.pageSize;
                })
            },
            handleSizeChangeSub(val) {
                let vm = this;
                vm.searchSubParam.pageSize = val;
                this.searchSubList();
            },
            handleCurrentChangeSub(val) {
                let vm = this;
                vm.searchSubParam.currentPage = val;
                this.searchSubList();
            }
        }
    }
</script>
