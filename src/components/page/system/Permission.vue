<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="编号:">
                            <el-input v-model="searchParam.code" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="名称:">
                            <el-input v-model="searchParam.name" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="路径:">
                            <el-input v-model="searchParam.url" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="上级编码:" prop="parentCode">
                            <permission-select v-model="searchParam.parentCode" style="display: block; width:100%;"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="类型:">
                            <dictionary-select v-model="searchParam.type" option-name="TYPE_OPTION"
                                               style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item label-width="0px" style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" @click="resetSearchParam" size="small">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="dialogAddPermissionVisible=true">新增
            </el-button>
            <el-table class="content-table" size="small" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" header-align="center" width="40"></el-table-column>
                <el-table-column label="编号" header-align="center" prop="code" width="150"></el-table-column>
                <el-table-column label="名称" header-align="center" prop="name" width="150"></el-table-column>
                <el-table-column label="上级编号" header-align="center" prop="parentCode" width="150"></el-table-column>
                <el-table-column label="上级名称" header-align="center" prop="parent.name" width="150"></el-table-column>
                <el-table-column header-align="center" label="类型" min-width="100px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="TYPE_OPTION" :value="scope.row.type"/>
                    </template>
                </el-table-column>
                <el-table-column label="路径" header-align="center" prop="url" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="显示顺序" header-align="center" prop="sort" width="150"></el-table-column>
                <el-table-column label="图标" header-align="center" prop="icon" width="150"></el-table-column>
                <el-table-column label="级别" header-align="center" prop="level" width="150"></el-table-column>
                <el-table-column label="创建时间" header-align="center" prop="createTime" width="180"></el-table-column>
                <el-table-column label="创建人" header-align="center" prop="createUser" width="150"></el-table-column>
                <el-table-column label="修改时间" header-align="center" prop="modifyTime" width="180"></el-table-column>
                <el-table-column label="修改人" header-align="center" prop="modifyUser" width="150"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center" fixed="right" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini" v-if="scope.row.deleteFlag === false"
                                   @click="showModifyPermissionDialog(scope.row)"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini" v-if="scope.row.deleteFlag === false"
                                   @click="deletePermission(scope.row)"></el-button>
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
        <!-- 新增权限弹出框 -->
        <el-dialog title="新增权限" :visible.sync="dialogAddPermissionVisible" width="400px">
            <el-form inline size="small" :model="addPermissionForm" :rules="addPermissionRules" ref="addPermissionForm"
                     label-width="120px">
                <el-form-item label="名称:" prop="name">
                    <el-input v-model="addPermissionForm.name"></el-input>
                </el-form-item>
                <el-form-item label="上级编码:" prop="parentCode">
                    <permission-select v-model="addPermissionForm.parentCode" style="display: block; width:92%;"/>
                </el-form-item>
                <el-form-item label="类型:" prop="type">
                    <dictionary-select v-model="addPermissionForm.type" option-name="TYPE_OPTION"
                                       style="display: block; width:92%;"/>
                </el-form-item>
                <el-form-item label="路径:" prop="url">
                    <el-input v-model="addPermissionForm.url"></el-input>
                </el-form-item>
                <el-form-item label="显示顺序:" prop="sort">
                    <el-input v-model="addPermissionForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="显示图标:" prop="icon">
                    <el-input v-model="addPermissionForm.icon"></el-input>
                </el-form-item>
                <el-form-item label="级别:" prop="level">
                    <el-input v-model="addPermissionForm.level"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddPermissionVisible = false">取 消</el-button>
                <el-button type="primary" @click="addPermission('addPermissionForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改用户弹出框 -->
        <el-dialog title="修改权限" :visible.sync="dialogModifyPermissionVisible" width="400px">
            <el-form inline size="small" :model="modifyPermissionForm" :rules="addPermissionRules"
                     ref="modifyPermissionForm" label-width="120px">
                <el-form-item label="编号:" prop="code">
                    <el-input v-model="modifyPermissionForm.code" disabled></el-input>
                </el-form-item>
                <el-form-item label="名称:" prop="name">
                    <el-input v-model="modifyPermissionForm.name"></el-input>
                </el-form-item>
                <el-form-item label="上级编码:" prop="parentCode">
                    <permission-select v-model="modifyPermissionForm.parentCode" style="display: block; width:92%;"/>
                </el-form-item>
                <el-form-item label="类型:" prop="type">
                    <dictionary-select v-model="modifyPermissionForm.type" option-name="TYPE_OPTION"
                                       style="display: block; width:92%;"/>
                </el-form-item>
                <el-form-item label="路径:" prop="url">
                    <el-input v-model="modifyPermissionForm.url"></el-input>
                </el-form-item>
                <el-form-item label="显示顺序:" prop="sort">
                    <el-input v-model="modifyPermissionForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="显示图标:" prop="icon">
                    <el-input v-model="modifyPermissionForm.icon"></el-input>
                </el-form-item>
                <el-form-item label="级别:" prop="level">
                    <el-input v-model="modifyPermissionForm.level"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogModifyPermissionVisible = false" size="small">取 消</el-button>
                <el-button type="primary" size="small" @click="modifyPermission('modifyPermissionForm')">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>


</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Message} from 'element-ui';

    export default {
        data() {
            return {
                //拷贝 初始化data
                initializeModel: {},
                multipleSelection: [],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    code: '',
                    name: '',
                    url: '',
                    type: '',
                    parentCode: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                orgList: [],
                permissionList: [],
                dialogAddPermissionVisible: false,
                addPermissionForm: {
                    name: '',
                    parentCode: '',
                    type: '',
                    url: '',
                    sort: '',
                    icon: '',
                    level: ''
                },
                addPermissionRules: {
                    code: [
                        {required: true, message: '请输入编号', trigger: 'blur'},
                        {min: 1, max: 50, message: '编号最长50个字符', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: '请输入路径', trigger: 'blur'}
                    ]
                },
                dialogModifyPermissionVisible: false,
                modifyPermissionForm: {
                    code: '',
                    name: '',
                    parentCode: '',
                    type: '',
                    url: '',
                    sort: '',
                    icon: '',
                    level: ''
                },
                typeOption: [{
                    value: 'BUTTON',
                    label: '按钮'
                }, {
                    value: 'MENU',
                    label: '菜单'
                }, {
                    value: 'PAGE',
                    label: '页面'
                }]
            }
        },
        mounted() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            //查询表格
            this.searchList();
        },
        methods: {
            /*拷贝初始化对象*/
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            tableColumnBooleanFormatter(row, column, cellValue) {
                if (cellValue) {
                    return '是';
                }
                return '否';
            },
            addPermission(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.permission.add, vm.addPermissionForm, response => {
                            vm.resetAddPermissionForm();
                            vm.dialogAddPermissionVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddPermissionForm() {
                let vm = this;
                vm.addPermissionForm = vm.cloneMode().addPermissionForm
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam = vm.cloneMode().searchParam
            },
            searchList() {
                let vm = this;
                Http.get(Api.permission.page, {params: vm.searchParam}, result => {
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
            //修改权限相关
            showModifyPermissionDialog(row) {
                let vm = this;
                Http.get(Api.permission.queryByCode, {params: {'code': row.code}}, result => {
                    vm.modifyPermissionForm = result.result;
                    vm.permissionList = [];
                    if (result.result.parent) {
                        vm.permissionList.push(result.result.parent);
                    }
                    vm.dialogModifyPermissionVisible = true;
                })
            },
            modifyPermission(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.permission.modify, vm.modifyPermissionForm, response => {
                            vm.dialogModifyPermissionVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除权限
            deletePermission(row) {
                let vm = this;
                let ids = [];
                ids.push(row.id)
                this.$confirm('删除用户后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.permission.delete, ids, result => {
                        vm.searchList();
                    })
                })
            }
        }
    }
</script>
