<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户组织</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="用户:">
                            <user-select style="display: block"  v-model="searchParam.username"></user-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属组织:">
                            <org-select style="display: block"  v-model="searchParam.orgCode"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam" size="small">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" v-permission="'/userOrg/add'" icon="el-icon-plus" @click="addUserOrgDialog=true">新增</el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="用户" prop="user.name" min-width="150px"></el-table-column>
                <el-table-column align="center" label="所属组织" prop="org.name" min-width="180px"></el-table-column>
                <el-table-column align="center" label="创建时间" prop="createTime" min-width="180px"></el-table-column>
                <el-table-column align="center" label="创建人" prop="createUser" min-width="150px"></el-table-column>
                <el-table-column align="center" label="修改时间" prop="modifyTime" min-width="180px"></el-table-column>
                <el-table-column align="center" label="修改人" prop="modifyUser" min-width="150px"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="150px">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/userOrg/modify'" icon="el-icon-edit" size="mini" @click="modifyUserOrg(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/userOrg/delete'" icon="el-icon-delete" size="mini"  @click="deleteUserOrg(scope.row)"></el-button>
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
        <!-- 新增用户组织弹出框 -->
        <el-dialog title="新增用户组织" :visible.sync="addUserOrgDialog" width="380px">
            <el-form size="small" inline :model="addUserOrgForm" :rules="userOrgRules" ref="addUserOrgForm" label-width="100px">
                <el-form-item label="用户:" prop="username">
                    <user-select v-model="addUserOrgForm.username" style="width: 200px"></user-select>
                </el-form-item>
                <el-form-item label="所属组织:" prop="orgCode">
                    <org-select v-model="addUserOrgForm.orgCode"  style="width: 200px"></org-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="addUserOrgDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addSaveUserOrg('addUserOrgForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改用户组织弹出框 -->
        <el-dialog title="修改用户组织" :visible.sync="modifyUserOrgDialog" width="380px">
            <el-form size="small" inline :model="modifyUserOrgForm" :rules="userOrgRules" ref="modifyUserOrgForm" label-width="100px">
                <el-form-item label="用户:" prop="username">
                    <user-select v-model="modifyUserOrgForm.username" ref="modifyUsernameSelect" style="width: 200px" disabled></user-select>
                </el-form-item>
                <el-form-item label="所属组织:" prop="orgCode">
                    <org-select v-model="modifyUserOrgForm.orgCode"  ref="modifyOrgCodeSelect" style="width: 200px"></org-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="modifyUserOrgDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifySaveUserOrg('modifyUserOrgForm')">确 定</el-button>
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
                multipleSelection: [],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    username: '',
                    orgCode: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                addUserOrgDialog: false,
                addUserOrgForm: {
                    username: '',
                    orgCode: ''
                },
                userOrgRules: {
                    username: [
                        {required: true, message: '请选择用户', trigger: 'change'}
                    ],
                    orgCode: [
                        {required: true, message: '请选择所属组织', trigger: 'change'}
                    ]
                },
                modifyUserOrgDialog: false,
                modifyUserOrgForm: {
                    username: '',
                    orgCode: ''
                }
            }
        },
        mounted() {
            //查询表格
            this.searchList();
        },
        methods: {
            addSaveUserOrg(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.userOrg.add,vm.addUserOrgForm,response =>{
                            vm.resetAddUserOrgForm();
                            vm.addUserOrgDialog = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddUserOrgForm(){
                let vm = this;
                vm.addUserOrgForm = {
                    username: '',
                    orgCode: ''
                }
            },
            //通过ID回显数据
            modifyUserOrg(row){
                let vm = this;
                Http.get(Api.userOrg.queryById,{params:{'id':row.id}},result =>{
                    vm.modifyUserOrgDialog = true;
                    setTimeout(() => {
                        vm.$refs.modifyUsernameSelect.setCurrentUser(result.result.user);
                        vm.$refs.modifyOrgCodeSelect.setCurrentOrg(result.result.org);
                        vm.modifyUserOrgForm = result.result;
                    }, 0)
                })
            },
            modifySaveUserOrg(formName){
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.userOrg.modify,vm.modifyUserOrgForm,response =>{
                            vm.modifyUserOrgDialog = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除
            deleteUserOrg(row){
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除用户后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.userOrg.delete, ids, result => {
                        vm.searchList();
                    })
                })
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam.username = '';
                vm.searchParam.orgCode = ''
            },
            searchList() {
                let vm = this;
                Http.get(Api.userOrg.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
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
            }
        }
    }
</script>
