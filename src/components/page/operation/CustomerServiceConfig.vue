<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础数据</el-breadcrumb-item>
                <el-breadcrumb-item>客服配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="大区名称:">
                            <org-select :nature="constant.ORGANIZATION.AREA" v-model="searchParam.orgCode" style="display: block" ></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户名称:">
                            <customer-select :level = "'top'" v-model="searchParam.customerCode" style="display: block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客服名称:">
                            <user-select v-model="searchParam.username" style="display: block"></user-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
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
            <el-button size="mini" v-permission="'/customerServiceConfig/add'" type="primary" icon="el-icon-plus" @click="isShowAddDialog=true">新增
            </el-button>
            <el-table class="content-table" size="mini" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" header-align="center" width="40"></el-table-column>
                <el-table-column label="大区名称" header-align="center" align="center" prop="orgName" min-width="150"></el-table-column>
                <el-table-column label="顶级客户" header-align="center" align="center" prop="customerName" min-width="150"></el-table-column>
                <el-table-column label="客服名称" header-align="center" align="center" prop="customerServiceName" min-width="150"></el-table-column>
                <el-table-column label="创建时间" header-align="center" align="center" prop="createTime"min-width="180"></el-table-column>
                <el-table-column label="创建人" header-align="center"  align="center" prop="createUser" min-width="150"></el-table-column>
                <el-table-column label="修改时间" header-align="center"  align="center" prop="modifyTime" min-width="180"></el-table-column>
                <el-table-column label="修改人" header-align="center" align="center" prop="modifyUser" min-width="150"></el-table-column>
                <el-table-column label="操作" header-align="center"  align="center" fixed="right" min-width="120">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" v-permission="'/customerServiceConfig/modify'" size="mini" v-if="scope.row.deleteFlag === false"
                                   @click="showModifyCustomerServiceConfig(scope.row)"></el-button>
                        <el-button type="text" icon="el-icon-delete" v-permission="'/customerServiceConfig/delete'" size="mini" v-if="scope.row.deleteFlag === false"
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
        <!-- 新增客服配置弹出框 -->
        <el-dialog title="新增客服配置" :visible.sync="isShowAddDialog" width="400px">
            <el-form inline size="small" :model="addCustomerServiceConfigForm" ref="addCustomerServiceConfigForm" :rules="addCustomerServiceConfigRules"
                     label-width="120px">
                <el-form-item label="大区名称:" prop="orgCode">
                    <org-select :nature="constant.ORGANIZATION.AREA" v-model="addCustomerServiceConfigForm.orgCode" style="display: block" ></org-select>
                </el-form-item>
                <el-form-item label="顶级客户:" prop="customerCode">
                    <customer-select :level = "'top'" v-model="addCustomerServiceConfigForm.customerCode" style="display: block"></customer-select>
                </el-form-item>
                <el-form-item label="客服名称:" prop="username">
                    <user-select v-model="addCustomerServiceConfigForm.username" style="display: block"></user-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="isShowAddDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addCustomerServiceConfig()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改客服配置弹出框 -->
        <el-dialog title="修改客服配置" :visible.sync="isShowModifyDialog" width="400px">
            <el-form inline size="small" :model="modifyCustomerServiceConfigForm" :rules="addCustomerServiceConfigRules"
                     ref="modifyCustomerServiceConfigForm" label-width="120px">
                <el-form-item label="大区名称:" prop="orgCode">
                    <org-select ref="modifyOrgSelect" :nature="constant.ORGANIZATION.AREA" v-model="modifyCustomerServiceConfigForm.orgCode" style="display: block" ></org-select>
                </el-form-item>
                <el-form-item label="顶级客户:" prop="customerCode">
                    <customer-select ref="modifyCustomerSelect" :level = "'top'" v-model="modifyCustomerServiceConfigForm.customerCode" style="display: block"></customer-select>
                </el-form-item>
                <el-form-item label="客服名称:" prop="username">
                    <user-select ref="modifyUserSelect" v-model="modifyCustomerServiceConfigForm.username" style="display: block"></user-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowModifyDialog = false" size="small">取 消</el-button>
                <el-button type="primary" size="small" @click="modifyCustomerServiceConfig()">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>

</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Constant} from 'src/global'

    export default {
        data() {
            return {
                //拷贝 初始化data
                initializeModel: {},
                multipleSelection: [],
                constant: Constant,
                isShowAddDialog: false,
                isShowModifyDialog: false,
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    orgCode: '',
                    customerCode: '',
                    username: '',
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                addCustomerServiceConfigForm: {
                    orgCode: '',
                    customerCode: '',
                    username: '',
                },
                modifyCustomerServiceConfigForm:{
                    orgCode: '',
                    customerCode: '',
                    username: '',
                    id:''
                },
                addCustomerServiceConfigRules: {
                    orgCode: [
                        {required: true, message: '请选择大区名称', trigger: 'blur'},
                    ],
                    customerCode: [
                        {required: true, message: '请选择顶级客户名称', trigger: 'blur'}
                    ],
                    username: [
                        {required: true, message: '请选择客服名称', trigger: 'blur'}
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
            addCustomerServiceConfig() {
                this.$refs.addCustomerServiceConfigForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.customerServiceConfig.add, this.addCustomerServiceConfigForm, () => {
                            this.resetAddCustomerServiceConfigForm();
                            this.isShowAddDialog = false;
                            this.$message.success("新增成功");
                            this.searchList();
                        })
                    }
                });
            },
            resetAddCustomerServiceConfigForm() {
                this.addCustomerServiceConfigForm = this.cloneMode().addCustomerServiceConfigForm
            },
            resetSearchParam() {
                this.searchParam = this.cloneMode().searchParam
            },
            searchList() {
                Http.get(Api.customerServiceConfig.page, {params: this.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
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
            //修改
            showModifyCustomerServiceConfig(row) {
                Http.get(Api.customerServiceConfig.queryById, {params: {'id': row.id}}, result => {
                    this.modifyCustomerServiceConfigForm = result.result;
                    if (result.result){
                        this.$nextTick(()=>{
                            this.$refs.modifyOrgSelect.setCurrentOrg({'code':result.result.orgCode,'name':result.result.orgName})
                            this.$refs.modifyCustomerSelect.setCurrentCustomer({'code':result.result.customerCode,'name':result.result.customerName})
                            this.$refs.modifyUserSelect.setCurrentUser({'username':result.result.userName,'name':result.result.customerServiceName})
                        })
                    }
                    this.isShowModifyDialog = true;
                })
            },
            modifyCustomerServiceConfig() {
                this.$refs.modifyCustomerServiceConfigForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.customerServiceConfig.modify, this.modifyCustomerServiceConfigForm, response => {
                            this.isShowModifyDialog = false;
                            this.$message.success("修改成功");
                            this.searchList();
                        })
                    }
                });
            },
            //删除
            deletePermission(row) {
                let ids = [];
                ids.push(row.id)
                this.$confirm('删除用户后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.customerServiceConfig.delete, ids, result => {
                        this.searchList();
                    })
                })
            }
        }
    }
</script>
