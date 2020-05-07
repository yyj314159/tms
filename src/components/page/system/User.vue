<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="工号:">
                            <el-input v-model="searchParam.username"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="姓名:">
                            <el-input v-model="searchParam.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属组织:">
                            <org-select style="display: block" v-model="searchParam.orgCode"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label-width="0px" style="float: right">
                            <el-button type="success" @click="searchParam.currentPage=1;searchList()" size="small">查询</el-button>
                            <el-button type="warning" @click="resetSearchParam" size="small">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" v-permission="'/user/add'" icon="el-icon-plus"
                       @click="dialogAddUserVisible=true">新增
            </el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40" fixed=""></el-table-column>
                <el-table-column header-align="center" label="工号" prop="username" width="90"></el-table-column>
                <el-table-column header-align="center" label="钉钉ID" prop="dingTalkUserId" width="150"></el-table-column>
                <el-table-column header-align="center" label="姓名" prop="name" width="90"></el-table-column>
                <el-table-column header-align="center" label="手机号" prop="mobile" width="150"></el-table-column>
                <el-table-column header-align="center" label="所属组织" prop="org.name" width="150"></el-table-column>
                <el-table-column header-align="center" label="最近登录时间" prop="recentLoginTime"
                                 width="180"></el-table-column>
                <el-table-column header-align="center" label="是否管理员" prop="admin"
                                 :formatter="tableColumnBooleanFormatter"
                                 width="100"></el-table-column>
                <el-table-column header-align="center" label="状态" prop="disable" :formatter="userStatusFormatter"
                                 width="100"></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" width="180"></el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" width="150"></el-table-column>
                <el-table-column header-align="center" label="修改时间" prop="modifyTime" width="180"></el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" width="150"></el-table-column>
                <el-table-column header-align="center" label="操作" fixed="right" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/user/modify'" icon="el-icon-edit" size="mini"
                                   v-show="scope.row.deleteFlag === false"
                                   @click="showModifyUserDialog(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/user/delete'" icon="el-icon-delete" size="mini"
                                   v-show="scope.row.deleteFlag === false"
                                   @click="deleteUser(scope.row)"></el-button>
                        <!--<el-button v-permission="'/user/resetPassword'" type="text" size="mini"-->
                                   <!--v-show="scope.row.deleteFlag === false" @click="showResetPasswordDialog(scope.row)">-->
                            <!--重置密码-->
                        <!--</el-button>-->
                        <el-button v-permission="'/user/username'" type="text" size="mini"
                                   v-show="scope.row.deleteFlag === false" @click="showRoleDialog(scope.row)">角色
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
        <!-- 新增用户弹出框 -->
        <el-dialog title="新增用户" :visible.sync="dialogAddUserVisible" width="400px">
            <el-form size="small" inline :model="addUserForm" :rules="addUserRules" ref="addUserForm"
                     label-width="120px">
                <el-form-item label="用户工号:" prop="username">
                    <el-input v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item label="钉钉ID:" prop="dingTalkUserId">
                    <el-input v-model="addUserForm.dingTalkUserId"></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="password">
                    <el-input v-model="addUserForm.password"></el-input>
                </el-form-item>
                <el-form-item label="姓名:" prop="name">
                    <el-input v-model="addUserForm.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号:" prop="mobile">
                    <el-input v-model="addUserForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="所属组织:" prop="orgCode">
                    <org-select style="width: 200px" v-model="addUserForm.orgCode"></org-select>
                </el-form-item>
                <el-form-item label="管理员">
                    <el-checkbox v-model="addUserForm.admin"></el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddUserVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addUser('addUserForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改用户弹出框 -->
        <el-dialog title="修改用户" :visible.sync="dialogModifyUserVisible" width="400px">
            <el-form size="small" inline :model="modifyUserForm" :rules="addUserRules" ref="modifyUserForm"
                     label-width="100px">
                <el-form-item label="用户工号:" prop="username">
                    <el-input v-model="modifyUserForm.username" readonly></el-input>
                </el-form-item>
                <el-form-item label="钉钉ID:" prop="dingTalkUserId">
                    <el-input v-model="modifyUserForm.dingTalkUserId"></el-input>
                </el-form-item>
                <el-form-item label="姓名:" prop="name">
                    <el-input v-model="modifyUserForm.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号:" prop="mobile">
                    <el-input v-model="modifyUserForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="所属组织:" prop="orgCode">
                    <org-select style="width: 200px" v-model="modifyUserForm.orgCode"
                                ref="modifyUserOrgSelect"></org-select>
                </el-form-item>
                <el-form-item label="管理员">
                    <el-checkbox v-model="modifyUserForm.admin"></el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyUserVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyUser('modifyUserForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 重置密码 -->
        <el-dialog title="重置密码" :visible.sync="dialogResetPasswordVisible" width="400px">
            <el-form size="small" inline :model="resetPasswordForm" :rules="addUserRules" ref="resetPasswordForm"
                     label-width="100px">
                <el-form-item label="用户工号:" prop="username">
                    <el-input v-model="resetPasswordForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="姓名:" prop="name">
                    <el-input v-model="resetPasswordForm.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="password">
                    <el-input v-model="resetPasswordForm.password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogResetPasswordVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="resetPassword('resetPasswordForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配角色 -->
        <el-dialog title="角色分配" :visible.sync="dialogRoleVisible" width="600px">
            <el-transfer size="small" v-model="modifyUserRoleForm.roleCodes"
                         filterable
                         filter-placeholder="请输入角色名称"
                         :data="allRoles"
                         :titles="['所有角色', '已有角色']"
                         :props="{
                            key: 'code',
                            label: 'name'
                        }" style="width: 500px; margin: 0 auto;">
            </el-transfer>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogRoleVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyUserRole()">确 定</el-button>
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
                    name: '',
                    orgCode: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                //新增用户相关
                dialogAddUserVisible: false,
                addUserForm: {
                    username: '',
                    dingTalkUserId: '',
                    password: '',
                    name: '',
                    mobile: '',
                    orgCode: '',
                    admin: false
                },
                addUserRules: {
                    username: [
                        {required: true, message: '请输入用户工号', trigger: 'blur'},
                        //{min: 6, max: 6, message: '工号长度为6个字符', trigger: 'blur'}
                    ],
                    dingTalkUserId: [
                        {required: true, message: '请输入钉钉ID', trigger: 'blur'},
                        {min: 1, max: 30, message: '钉钉ID最长30个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                        {min: 1, max: 20, message: '姓名最长20个字符', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {pattern: /^1\d{10}$/, message: '请输入正确的手机号码'}
                    ],
                    orgCode: [
                        {required: true, message: '请选择所属组织', trigger: 'change'},
                    ]
                },
                //修改用户相关
                dialogModifyUserVisible: false,
                modifyUserForm: {
                    username: '',
                    dingTalkUserId: '',
                    name: '',
                    mobile: '',
                    orgCode: '',
                    admin: false
                },
                //重置密码相关
                dialogResetPasswordVisible: false,
                resetPasswordForm: {
                    username: '',
                    name: '',
                    password: ''
                },
                //分配角色相关
                dialogRoleVisible: false,
                modifyUserRoleForm: {
                    username: '',
                    roleCodes: []
                },
                allRoles: []
            }
        },
        mounted() {
            //查询表格
            this.searchList();
            //获取所有角色
            this.getAllRoles();
        },
        methods: {
            //查询结果表格相关
            tableColumnBooleanFormatter(row, column, cellValue) {
                if (cellValue) {
                    return '是';
                }
                return '否';
            },
            userStatusFormatter(row, column, cellValue) {
                if (row.deleteFlag) {
                    return '已注销';
                }
                if (row.disable) {
                    return '已禁用';
                }
                return '使用中';
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam.orgCode = '';
                vm.searchParam.username = '';
                vm.searchParam.name = '';
            },
            searchList() {
                let vm = this;
                Http.get(Api.user.page, {params: vm.searchParam}, result => {
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
            },
            //新增用户相关
            addUser(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.user.add, vm.addUserForm, response => {
                            vm.resetAddUserForm();
                            vm.dialogAddUserVisible = false;
                            this.$message({
                                message: '新增用户成功!',
                                type: 'success'
                            });
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddUserForm() {
                let vm = this;
                vm.addUserForm = {
                    username: '',
                    password: '',
                    name: '',
                    mobile: '',
                    orgCode: '',
                    admin: false
                }
            },
            //修改用户相关
            showModifyUserDialog(row) {
                let vm = this;
                Http.get(Api.user.username, {params: {'username': row.username}}, result => {
                    vm.dialogModifyUserVisible = true;
                    setTimeout(() => {
                        vm.$refs.modifyUserOrgSelect.setCurrentOrg(result.result.org);
                        vm.modifyUserForm = result.result;
                    }, 0)
                })
            },
            modifyUser(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.user.modify, vm.modifyUserForm, response => {
                            vm.dialogModifyUserVisible = false;
                            this.$message({
                                message: '修改用户成功!',
                                type: 'success'
                            });
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除用户
            deleteUser(row) {
                let vm = this;
                var username = [];
                username.push(row.username);
                this.$confirm('删除用户后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.user.delete, username, result => {
                        this.$message({
                            message: '删除用户成功!',
                            type: 'success'
                        });
                        vm.searchList();
                    })
                }).catch(() => {

                });

            },
            //重置密码
            showResetPasswordDialog(row) {
                let vm = this;
                vm.resetPasswordForm.name = row.name;
                vm.resetPasswordForm.username = row.username;
                vm.resetPasswordForm.password = '';
                vm.dialogResetPasswordVisible = true;
            },
            resetPassword(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.user.resetPassword, vm.resetPasswordForm, response => {
                            vm.dialogResetPasswordVisible = false;
                            this.$message({
                                message: '重置密码成功!',
                                type: 'success'
                            });
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //分配角色相关
            getAllRoles() {
                let vm = this;
                Http.get(Api.role.all, null, result => {
                    vm.allRoles = result.result;
                })
            },
            showRoleDialog(row) {
                let vm = this;
                Http.get(Api.user.username, {params: {'username': row.username}}, result => {
                    vm.modifyUserRoleForm.roleCodes = result.result.roleCodes;
                    vm.modifyUserRoleForm.username = row.username;
                    vm.dialogRoleVisible = true;
                })
            },
            modifyUserRole() {
                var vm = this;
                Http.post(Api.userRole.modify, vm.modifyUserRoleForm, result => {
                    this.$message({
                        message: '分配角色成功!',
                        type: 'success'
                    });
                    vm.dialogRoleVisible = false;
                })
            }

        }
    }
</script>
<style scoped>
    /*.el-select {
        display: block;
    }*/
</style>
