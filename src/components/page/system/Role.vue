<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form  size="small" label-width="80px" :model="searchParam">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="编号:">
                            <el-input v-model="searchParam.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="名称:">
                            <el-input v-model="searchParam.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="0px" style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询</el-button>
                            <el-button type="warning" @click="resetSearchParam" size="small">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="dialogAddRoleVisible=true">新增</el-button>
            <el-table class="content-table" size="small" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" header-align="center"  width="40"></el-table-column>
                <el-table-column label="编号" header-align="center"  prop="code" width="150"></el-table-column>
                <el-table-column label="名称" header-align="center"  prop="name" width="150"></el-table-column>
                <el-table-column label="创建时间" header-align="center"  prop="createTime" width="180"></el-table-column>
                <el-table-column label="创建人" header-align="center"  prop="createUser" width="150"></el-table-column>
                <el-table-column label="修改时间" header-align="center"  prop="modifyTime" width="180"></el-table-column>
                <el-table-column label="修改人" header-align="center"  prop="modifyUser" width="150"></el-table-column>
                <el-table-column label="备注"  header-align="center" prop="remark"></el-table-column>
                <el-table-column label="操作"  header-align="center" align="center" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini" v-if="scope.row.deleteFlag === false" @click="showModifyRoleDialog(scope.row)"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini" v-if="scope.row.deleteFlag === false" @click="deleteRole(scope.row)"></el-button>
                        <el-button type="text" icon="el-icon-plus" size="mini" v-if="scope.row.deleteFlag === false" @click="showPermissionDialog(scope.row)"></el-button>
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
        <!-- 新增角色弹出框 -->
        <el-dialog title="新增角色" :visible.sync="dialogAddRoleVisible" width="600px">
            <el-form size="small" :model="addRoleForm" :rules="addRoleRules" ref="addRoleForm" label-width="120px">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="编号:" prop="code">
                            <el-input v-model="addRoleForm.code"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="名称:" prop="name">
                            <el-input v-model="addRoleForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="19">
                        <el-form-item label="备注:" prop="remark">
                            <el-input type="textarea" :rows="3" :maxlength="200" placeholder="最多200个字符！" v-bind:style="textareaClass" v-model="addRoleForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddRoleVisible = false" size="small">取 消</el-button>
                <el-button type="primary" size="small" @click="addRole('addRoleForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配权限 -->
        <el-dialog title="分配权限" :visible.sync="dialogAddPermissionVisible" width="600px">
            <el-form inline size="small" :model="addPermissionForm" :rules="addPermissionRules" ref="addPermissionForm" label-width="100px">
                <el-tree
                    :data="permissionTree" :model="permissionTreeModel" ref="permissionTreeModel"
                    show-checkbox
                    :check-strictly=checkStrictly
                    node-key="id"
                    @check = "checkPermissionNode"
                    :default-expanded-keys="permissionExpandedNode"
                    :default-checked-keys="permissionCheckedNode"
                    :props="defaultProps">
                </el-tree>
                <el-form-item  prop="code">
                    <el-input v-show="false" v-model="addPermissionForm.roleCode"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddPermissionVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addRolePermission()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改角色弹出框 -->
        <el-dialog title="修改角色" :visible.sync="dialogModifyRoleVisible" width="400px">
            <el-form inline size="small" :model="modifyRoleForm" :rules="addRoleRules" ref="modifyRoleForm" label-width="120px">
                <el-form-item label="编号:" prop="code">
                    <el-input v-model="modifyRoleForm.code" disabled></el-input>
                </el-form-item>
                <el-form-item label="名称:" prop="name">
                    <el-input v-model="modifyRoleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input type="textarea" :rows="3" :maxlength="200" placeholder="最多200个字符！" v-bind:style="textareaClass" v-model="modifyRoleForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyRoleVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyRole('modifyRoleForm')">确 定</el-button>
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
                    code: '',
                    name: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                orgList: [],
                dialogAddRoleVisible: false,
                dialogAddPermissionVisible: false,
                addRoleForm: {
                    code: '',
                    name: '',
                    remark: ''
                },
                textareaClass:{
                    width: '107%',
                    'font-family': 'initial;'
                },
                addRoleRules: {
                    code: [
                        {required: true, message: '请输入编号', trigger: 'blur'},
                        {min: 1, max: 50, message: '编号最长50个字符', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    remark: [
                        {required: false, message: '请输入备注', trigger: 'blur'},
                        {min: 1, max: 200, message: '备注最长200个字符', trigger: 'blur'}
                    ]
                },
                addPermissionRules: {},
                addPermissionForm: {
                    roleCode: {

                    }
                },
                permissionTreeModel: {},
                dialogModifyRoleVisible: false,
                modifyRoleForm:{
                    code: '',
                    name: '',
                    remark: ''
                },
                permissionTree: [],
                defaultProps: {
                    children: 'children',
                },
                checkStrictly: true,
                permissionCheckedNode:[],
                permissionExpandedNode:[]
            }
        },
        mounted() {
            //查询表格
            this.searchList();
            //初始化权限树
            this.initPermissionTree();
        },
        methods: {
            tableColumnBooleanFormatter(row, column, cellValue) {
                if (cellValue) {
                    return '是';
                }
                return '否';
            },
            roleStatusFormatter(row, column, cellValue) {
                if (row.deleteFlag) {
                    return '已注销';
                }
                if (row.disable) {
                    return '已禁用';
                }
                return '使用中';
            },
            addRole(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.role.add,vm.addRoleForm,response =>{
                            vm.resetAddRoleForm();
                            vm.dialogAddRoleVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddRoleForm(){
                let vm = this;
                vm.addRoleForm = {
                    code: '',
                    name: '',
                    remark: ''
                }
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam.code = '';
                vm.searchParam.name = '';
                vm.searchParam.remark = '';
            },
            searchList() {
                let vm = this;
                Http.get(Api.role.page, {params: vm.searchParam}, result => {
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
            initPermissionTree() {
                let vm = this;
                Http.get(Api.permission.queryPermissionTree,null,result => {
                    vm.permissionTree = result.result;
                });
            },
            checkPermissionNode(node, checkedStatus) {
                let vm = this;
                let checkedKeys = checkedStatus.checkedKeys;
                let isChecked = false;
                let isExistChildChecked = false;
                if(checkedKeys) {
                    for (let i = 0; i < checkedKeys.length; i++) {
                        if(checkedKeys[i] == node.data.code) {
                            isChecked = true;
                        }
                        if(node.children) {
                            for (let j = 0; j < node.children.length; j++) {
                                if(checkedKeys[i] == node.children[j].data.code) {
                                    isExistChildChecked = true;
                                }
                            }
                        }
                    }
                }
                if(isChecked && node.data.parentCode) {
                    checkedKeys.push(node.data.parentCode);
                }
                if(isExistChildChecked) {
                    checkedKeys.push(node.data.code);
                }
                vm.$refs.permissionTreeModel.setCheckedKeys(checkedKeys);
            },
            showPermissionDialog(row) {
                let vm = this;
                let checkedNode = [];
                Http.get(Api.rolePermission.queryByRole,{params:{'roleCode':row.code}},result =>{
                    if(result.result) {
                        for (var i = 0; i < result.result.length; i++) {
                            checkedNode.push(result.result[i].permissionCode);
                        }
                        let permissionTreeModel = vm.$refs.permissionTreeModel;
                        permissionTreeModel.setCheckedKeys(checkedNode);
                    }

                });
                vm.addPermissionForm.roleCode = row.code;
                vm.dialogAddPermissionVisible = true;
            },
            //修改角色相关
            showModifyRoleDialog(row){
                let vm = this;
                Http.get(Api.role.queryByCode,{params:{'code':row.code}},result =>{
                    vm.modifyRoleForm = result.result;
                    vm.dialogModifyRoleVisible = true;
                })
            },
            modifyRole(formName){
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.role.modify,vm.modifyRoleForm,response =>{
                            vm.dialogModifyRoleVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除角色
            deleteRole(row){
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除用户后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.role.delete, ids, result => {
                        vm.searchList();
                    })
                })
            },
            //分配权限
            addRolePermission() {
                let vm = this;
                let checkedKeys = this.$refs.permissionTreeModel.getCheckedKeys();
                let roleCode = vm.addPermissionForm.roleCode;
                let rolePermission = {
                    roleCode: roleCode,
                    permissionCodeList: checkedKeys
                };
                Http.post(Api.rolePermission.addList, rolePermission, result => {
                    vm.dialogAddPermissionVisible = false;
                    vm.searchList();
                })
            }
        }
    }
</script>
