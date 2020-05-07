<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>岗位管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="岗位名称:">
                            <el-input v-model="searchParam.positionName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="角色名称:">
                            <el-input v-model="searchParam.roleName"></el-input>
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
            <el-button size="mini" type="primary" v-permission="'/position/add'" icon="el-icon-plus"
                       @click="dialogAddPositionVisible=true">新增
            </el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40" fixed=""></el-table-column>
                <el-table-column header-align="center" label="岗位编码" prop="positionCode" width="150"></el-table-column>
                <el-table-column header-align="center" label="岗位名称" prop="positionName" width="200"></el-table-column>
                <el-table-column header-align="center" label="备注" prop="remark" width="250"></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" width="180"></el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" width="150"></el-table-column>
                <el-table-column header-align="center" label="修改时间" prop="modifyTime" width="180"></el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" width="150"></el-table-column>
                <el-table-column header-align="center" label="操作" fixed="right" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/position/modify'" icon="el-icon-edit"
                                   v-show="scope.row.deleteFlag === false"
                                   @click="showModifyPositionDialog(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/position/delete'" icon="el-icon-delete"
                                   v-show="scope.row.deleteFlag === false"
                                   @click="deletePosition(scope.row)"></el-button>
                        <el-button v-permission="'/position/roleAssignment'" type="text"
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
        <!-- 新增岗位弹出框 -->
        <el-dialog title="新增岗位" :visible.sync="dialogAddPositionVisible" width="400px">
            <el-form size="small" inline :model="addPositionForm" :rules="addPositionRules" ref="addPositionForm"
                     label-width="120px">

                <el-form-item label="岗位编码:" prop="positionCode">
                    <el-input v-model="addPositionForm.positionCode"></el-input>
                </el-form-item>

                <el-form-item label="岗位名称:" prop="positionName">
                    <el-input v-model="addPositionForm.positionName"></el-input>
                </el-form-item>

                <el-form-item label="备注:" prop="remark">
                    <el-input type="textarea" :rows="3" :maxlength="200" placeholder="最多200个字符！"
                              v-bind:style="textareaClass" v-model="addPositionForm.remark"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddPositionVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addPosition('addPositionForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改岗位弹出框 -->
        <el-dialog title="修改岗位" :visible.sync="dialogModifyPositionVisible" width="400px">
            <el-form size="small" inline :model="modifyPositionForm" :rules="addPositionRules" ref="modifyPositionForm"
                     label-width="100px">
                <el-form-item label="岗位编码:" prop="positionCode">
                    <el-input v-model="modifyPositionForm.positionCode"></el-input>
                </el-form-item>
                <el-form-item label="岗位名称:" prop="positionName">
                    <el-input v-model="modifyPositionForm.positionName"></el-input>
                </el-form-item>
                <el-form-item label="岗位备注:" prop="remark">
                    <el-input type="textarea" :rows="3" :maxlength="200" placeholder="最多200个字符！"
                              v-bind:style="textareaClass" v-model="modifyPositionForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyPositionVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyPosition('modifyPositionForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 分配角色 -->
        <el-dialog title="角色分配" :visible.sync="dialogRoleVisible" width="600px">
            <el-transfer size="small" v-model="modifyPositionRoleForm.roleCodes"
                         :data="allRoles"
                         :titles="['所有角色', '已有角色']"
                         :props="{
                            key: 'code',
                            label: 'name'
                        }" style="width: 500px; margin: 0 auto;">
            </el-transfer>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogRoleVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyPositionRole()">确 定</el-button>
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
                    positionName: '',
                    roleName: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                //新增岗位相关
                dialogAddPositionVisible: false,
                addPositionForm: {
                    positionName: '',
                    positionCode: '',
                    remark: ''
                },
                addPositionRules: {
                    positionName: [
                        {required: true, message: '请输入岗位名称', trigger: 'blur'},
                        {min: 1, max: 30, message: '岗位名称最多30个字符', trigger: 'blur'}
                    ],
                    positionCode: [
                        {required: true, message: '请输入岗位编码', trigger: 'blur'},
                        {min: 1, max: 30, message: '岗位编码最多30个字符', trigger: 'blur'}
                    ]
                },
                //修改岗位相关
                dialogModifyPositionVisible: false,
                modifyPositionForm: {
                    positionName: '',
                    remark: ''
                },
                textareaClass: {
                    width: '107%',
                    'font-family': 'initial;'
                },

                //分配角色相关
                dialogRoleVisible: false,
                modifyPositionRoleForm: {
                    positionId: '',
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
            resetSearchParam() {
                let vm = this;
                vm.searchParam.positionName = '';
                vm.searchParam.roleName = '';
                vm.searchParam.name = '';
            },
            searchList() {
                let vm = this;
                Http.get(Api.position.page, {params: vm.searchParam}, result => {
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
            //新增岗位相关
            addPosition(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.position.add, vm.addPositionForm, response => {
                            vm.resetAddPositionForm();
                            vm.dialogAddPositionVisible = false;
                            this.$message({
                                message: '新增岗位成功!',
                                type: 'success'
                            });
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddPositionForm() {
                let vm = this;
                vm.addPositionForm = {
                    positionName: '',
                    remark: ''
                }
            },
            //修改岗位相关
            showModifyPositionDialog(row) {
                let vm = this;
                Http.get(Api.position.queryById, {params: {'id': row.id}}, result => {
                    vm.dialogModifyPositionVisible = true;
                    setTimeout(() => {
                        vm.modifyPositionForm = result.result;
                    }, 0)
                })
            },
            modifyPosition(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.position.modify, vm.modifyPositionForm, response => {
                            vm.dialogModifyPositionVisible = false;
                            this.$message({
                                message: '修改岗位成功!',
                                type: 'success'
                            });
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除岗位
            deletePosition(row) {
                let vm = this;
                var ids = [];
                ids.push(row.id);
                this.$confirm('删除岗位后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.position.delete, ids, result => {
                        this.$message({
                            message: '删除岗位成功!',
                            type: 'success'
                        });
                        vm.searchList();
                    })
                }).catch(() => {

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
                Http.get(Api.position.getRole, {params: {'positionId': row.id}}, result => {
                    vm.modifyPositionRoleForm.roleCodes = result.result.roleCodes;
                    vm.modifyPositionRoleForm.positionId = row.id;
                    vm.dialogRoleVisible = true;
                })
            },
            modifyPositionRole() {
                var vm = this;
                Http.post(Api.positionRole.modify, vm.modifyPositionRoleForm, result => {
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
