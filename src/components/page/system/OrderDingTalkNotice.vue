<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>订单钉钉通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户编号:">
                            <customer-select v-model="searchParam.customerCode" size="small" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="组织编号:">
                            <org-select style="display: block; width:100%;" v-model="searchParam.orgCode" size="small" mounted="true"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="用户名:">
                            <user-select style="display: block" v-model="searchParam.username" size="small"></user-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam" size="small">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" v-permission="'/orderDingTalkNotice/add'" icon="el-icon-plus" @click="dialogAddOrderDingTalkNoticeVisible=true">新增</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center" label="客户" prop="customerCode" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="组织" prop="orgCode" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="用户名" prop="username" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="150px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="修改时间" prop="modifyTime" min-width="150px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/orderDingTalkNotice/modify'" icon="el-icon-edit" size="mini" @click="showModifyOrderDingTalkNoticeDialog(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/orderDingTalkNotice/delete'" icon="el-icon-delete" size="mini"  @click="deleteOrderDingTalkNotice(scope.row)"></el-button>
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
        <!-- 新增订单钉钉通知弹出框 -->
        <el-dialog title="新增订单钉钉通知" :visible.sync="dialogAddOrderDingTalkNoticeVisible" width="380px">
            <el-form size="small" inline :model="addOrderDingTalkNoticeForm" :rules="addOrderDingTalkNoticeRules" ref="addOrderDingTalkNoticeForm" label-width="100px">
                <el-form-item label="客户:" prop="customerCode">
                    <customer-select v-model="addOrderDingTalkNoticeForm.customerCode" style="display:block"></customer-select>
                </el-form-item>
                <el-form-item label="组织:" prop="orgCode">
                    <!--<el-input v-model="addOrderDingTalkNoticeForm.orgCode"></el-input>-->
                    <org-select style="display: block; width:100%;" v-model="addOrderDingTalkNoticeForm.orgCode"
                                mounted="true"/>
                </el-form-item>
                <el-form-item label="用户名:" prop="username">
                    <user-select style="display: block"  v-model="addOrderDingTalkNoticeForm.username" size="small"></user-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddOrderDingTalkNoticeVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addOrderDingTalkNotice('addOrderDingTalkNoticeForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改订单钉钉通知弹出框 -->
        <el-dialog title="修改订单钉钉通知" :visible.sync="dialogModifyOrderDingTalkNoticeVisible" width="380px">
            <el-form size="small" inline :model="modifyOrderDingTalkNoticeForm" :rules="addOrderDingTalkNoticeRules" ref="modifyOrderDingTalkNoticeForm" label-width="100px">
                <el-form-item label="客户:" prop="customerCode">
                    <el-input v-model="modifyOrderDingTalkNoticeForm.customerCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="组织:" prop="orgCode">
                    <org-select style="display: block; width:100%;" v-model="modifyOrderDingTalkNoticeForm.orgCode"
                                mounted="true"/>
                </el-form-item>
                <el-form-item label="用户名:" prop="username">
                    <user-select style="display: block"  v-model="modifyOrderDingTalkNoticeForm.username" size="small"></user-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyOrderDingTalkNoticeVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyOrderDingTalkNotice('modifyOrderDingTalkNoticeForm')">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import { Message } from 'element-ui';
    export default {
        data() {
            return {
                multipleSelection: [],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    customerCode:'',
                    orgCode:'',
                    username:''
                },
                isLoading: true,
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                dialogAddOrderDingTalkNoticeVisible: false,
                addOrderDingTalkNoticeForm: {
                    customerCode:'',
                    orgCode:'',
                    username:'',
                    value: '',
                    remark: ''
                },
                textareaClass: {
                    width: '107%',
                    'font-family': 'initial;'
                },
                addOrderDingTalkNoticeRules: {
                    customerCode: [
                        {required: true, message: '请输入客户编号', trigger: 'blur'},
                    ],
                    orgCode: [
                        {required: true, message: '请输入组织', trigger: 'blur'}
                    ],
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                },
                dialogModifyOrderDingTalkNoticeVisible: false,
                modifyOrderDingTalkNoticeForm: {
                    customerCode: '',
                    orgCode: '',
                    username: ''
                }
            }
        },
        mounted() {
            //查询表格
            this.searchList();
        },
        methods: {
            addOrderDingTalkNotice(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.orderDingTalkNotice.add,vm.addOrderDingTalkNoticeForm,response =>{
                            vm.resetAddOrderDingTalkNoticeForm();
                            vm.dialogAddOrderDingTalkNoticeVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddOrderDingTalkNoticeForm(){
                let vm = this;
                vm.addOrderDingTalkNoticeForm = {
                    customerCode: '',
                    orgCode: '',
                    username :'',
                }
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam.customerCode = '';
                vm.searchParam.orgCode = ''
                vm.searchParam.username = ''
            },
            searchList() {
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.orderDingTalkNotice.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //通过ID回显数据
            showModifyOrderDingTalkNoticeDialog(row){
                let vm = this;
                Http.get(Api.orderDingTalkNotice.queryById,{params:{'id':row.id}},result =>{
                    vm.modifyOrderDingTalkNoticeForm = result.result;
                    vm.dialogModifyOrderDingTalkNoticeVisible = true;
                })
            },
            modifyOrderDingTalkNotice(formName){
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.orderDingTalkNotice.modify,vm.modifyOrderDingTalkNoticeForm,response =>{
                            vm.dialogModifyOrderDingTalkNoticeVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除
            deleteOrderDingTalkNotice(row){
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.orderDingTalkNotice.delete, ids, result => {
                        vm.searchList();
                    })
                })
            }
        }
    }
</script>
