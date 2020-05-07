<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>钉钉审批配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="名称:">
                            <el-input v-model="searchParam.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" v-permission="'/auditConfig/add'" icon="el-icon-plus" @click="dialogAddAuditConfigVisible=true">新增</el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center" label="类型" prop="auditType" min-width="180px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="名称" prop="name" min-width="160px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="钉钉审批流编号" prop="processCode" min-width="200px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审批回调topic" prop="topic" min-width="160px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审批回调tag" prop="tag" min-width="160px" show-overflow-tooltip></el-table-column>>
                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="140px"></el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" min-width="130px"></el-table-column>
                <el-table-column header-align="center" label="修改时间" prop="modifyTime" min-width="140px"></el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" min-width="130px"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/auditConfig/modify'" icon="el-icon-edit" size="mini" @click="showModifyAuditConfigDialog(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/auditConfig/delete'" icon="el-icon-delete" size="mini" @click="deleteAuditConfig(scope.row)"></el-button>
                        <el-button type="text" icon="el-icon-plus" size="mini" @click="dialogAddAuditConfigSubWindowValue(scope.row)"></el-button>
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
        <el-dialog title="新增审批配置" :visible.sync="dialogAddAuditConfigVisible" width="580px">
            <el-form size="small"  inline :model="addAuditConfigForm" :rules="addAuditConfigRules" ref="addAuditConfigForm" label-width="130px">
                <el-form-item label="类型:" prop="auditType">
                    <el-input v-model="addAuditConfigForm.auditType" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="名称:" prop="name">
                    <el-input v-model="addAuditConfigForm.name" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="钉钉审批编号:" prop="processCode">
                    <el-input v-model="addAuditConfigForm.processCode" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="审批回调topic:" prop="topic">
                    <el-input v-model="addAuditConfigForm.topic" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="审批回调tag:" prop="tag">
                    <el-input v-model="addAuditConfigForm.tag" style="width:320px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddAuditConfigVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addAuditConfig('addAuditConfigForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改审批配置" :visible.sync="dialogModifyAuditConfigVisible" width="580px">
            <el-form size="small"  inline :model="modifyAuditConfigForm" :rules="addAuditConfigRules" ref="modifyAuditConfigForm" label-width="130px">
                <el-form-item label="类型:" prop="auditType">
                    <el-input v-model="modifyAuditConfigForm.auditType" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="名称:" prop="name">
                    <el-input v-model="modifyAuditConfigForm.name" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="钉钉审批编号:" prop="processCode">
                    <el-input v-model="modifyAuditConfigForm.processCode" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="审批回调topic:" prop="topic">
                    <el-input v-model="modifyAuditConfigForm.topic" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="审批回调tag:" prop="tag">
                    <el-input v-model="modifyAuditConfigForm.tag" style="width:320px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyAuditConfigVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyAuditConfig('modifyAuditConfigForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="审批节点信息" :visible.sync="dialogAddAuditConfigSubWindow" width="70%">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="dialogAddAuditConfigSubVisible=true">新增</el-button>
            <el-table class="content-table" :data="searchSubResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChangeSub"
                      border fit
                      size="small"
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center"  label="审批节点" prop="nodeCode" min-width="180px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name v-if="scope.row.nodeType === 'POSITION'" option-name="DINGTALK_AUDIT_NODE" :value="scope.row.nodeCode"></dictionary-select-name>
                        <span v-else>{{scope.row.user?scope.row.user.name:''}}</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center"  label="审批条件" prop="condition" min-width="280px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center"  label="节点顺序" prop="sort" min-width="180px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="140px"></el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" min-width="130px"></el-table-column>
                <el-table-column header-align="center" label="修改时间" prop="modifyTime" min-width="140px"></el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" min-width="130px"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="80px">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini" @click="showModifyAuditConfigSubDialog(scope.row)"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini"  @click="deleteAuditConfigSub(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 新增数据字典子表弹出框 -->
        <el-dialog title="新增审批节点信息" :visible.sync="dialogAddAuditConfigSubVisible" width="580px">
            <el-form size="small"  inline :model="addAuditConfigSubForm" :rules="addAuditConfigSubRules" ref="addAuditConfigSubForm" label-width="130px">
                <el-form-item label="节点类型:">
                    <el-switch v-model="addAuditConfigSubForm.nodeType" active-text="职务职责" inactive-text="具体用户"
                               active-value="POSITION" inactive-value="USER" @change="addAuditConfigSubForm.nodeCode = ''"></el-switch>
                </el-form-item>
                <el-form-item label="审批节点:" prop="nodeCode" v-if="addAuditConfigSubForm.nodeType==='POSITION'">
                    <dictionary-select option-name="DINGTALK_AUDIT_NODE" style="width:320px;"
                                       v-model="addAuditConfigSubForm.nodeCode"/>
                </el-form-item>
                <el-form-item label="审批节点:" prop="nodeCode" v-else>
                    <all-user-select  style="width:320px;" v-model="addAuditConfigSubForm.nodeCode"/>
                </el-form-item>
                <el-form-item label="审批条件:" prop="condition">
                    <el-input v-model="addAuditConfigSubForm.condition" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="节点顺序:" prop="sort">
                    <el-input-number v-model="addAuditConfigSubForm.sort" :min="1" :max="1000" style="width:320px"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddAuditConfigSubVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addAuditConfigSub('addAuditConfigSubForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改数据字典子表弹出框 -->
        <el-dialog title="修改审批节点信息" :visible.sync="dialogModifyAuditConfigSubVisible" width="580px">
            <el-form size="small" inline :model="modifyAuditConfigSubForm" :rules="addAuditConfigSubRules" ref="modifyAuditConfigSubForm" label-width="130px">
                <el-form-item label="节点类型:">
                    <el-switch v-model="modifyAuditConfigSubForm.nodeType" active-text="职务职责" inactive-text="具体用户"
                               active-value="POSITION" inactive-value="USER" @change="modifyAuditConfigSubForm.nodeCode = ''"></el-switch>
                </el-form-item>
                <el-form-item label="审批节点:" prop="nodeCode" v-if="modifyAuditConfigSubForm.nodeType==='POSITION'">
                    <dictionary-select option-name="DINGTALK_AUDIT_NODE" style="width:320px;"
                                       v-model="modifyAuditConfigSubForm.nodeCode"/>
                </el-form-item>
                <el-form-item label="审批节点:" prop="nodeCode" v-else>
                    <all-user-select ref="user"  style="width:320px;" v-model="modifyAuditConfigSubForm.nodeCode"/>
                </el-form-item>
                <el-form-item label="审批条件:" prop="condition">
                    <el-input v-model="modifyAuditConfigSubForm.condition" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="节点顺序:" prop="valueName">
                    <el-input-number v-model="modifyAuditConfigSubForm.sort" :min="1" :max="1000" style="width:320px"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyAuditConfigSubVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyAuditConfigSub('modifyAuditConfigSubForm')">确 定</el-button>
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
                    name: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                //查询字典值参数
                searchSubParam: {
                    currentPage: 1,
                    pageSize: 10
                },
                //返回字典值结果
                searchSubResult: {
                    totalCount: 0,
                    result: []
                },
                dialogAddAuditConfigVisible: false,
                addAuditConfigForm: {
                    auditType: '',
                    name: '',
                    processCode: '',
                    topic: '',
                    tag: ''
                },
                textAreaClass:{
                    width: '320px',
                    'font-family': 'initial;'
                },
                addAuditConfigRules: {
                    auditType: [
                        {required: true, message: '请输入类型', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    processCode: [
                        {required: true, message: '请输入钉钉审批流编号', trigger: 'blur'}
                    ],
                    topic: [
                        {required: true, message: '请输入审批回调MQ topic', trigger: 'blur'}
                    ],
                    tag: [
                        {required: true, message: '请输入审批回调MQ tag', trigger: 'blur'}
                    ]
                },
                dialogModifyAuditConfigVisible: false,
                modifyAuditConfigForm:{
                    auditType: '',
                    name: '',
                    processCode: '',
                    topic: '',
                    tag: ''
                },
                addAuditConfigSubRules: {
                    nodeCode: [
                        {required: true, message: '请选择审批节点', trigger: 'blur'},
                        {min: 1, max: 50, message: '编号最长50个字符', trigger: 'blur'}
                    ],
                    sort: [
                        {required: true, message: '请输入顺序', trigger: 'blur'}
                    ]
                },
                dialogAddAuditConfigSubWindow: false,
                dialogAddAuditConfigSubVisible: false,
                dialogModifyAuditConfigSubVisible: false,
                addAuditConfigSubForm: {
                    auditType: '',
                    nodeType: 'POSITION',
                    nodeCode:'',
                    condition:'',
                    sort: ''
                },
                modifyAuditConfigSubForm:{
                    auditType: '',
                    nodeType: 'POSITION',
                    nodeCode:'',
                    condition:'',
                    sort: ''
                },
                currentAuditConfigCode: ''
            }
        },
        mounted() {
            //查询表格
            this.searchList();
        },
        methods: {
            addAuditConfig(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.auditConfig.add,vm.addAuditConfigForm,response =>{
                            vm.resetAddAuditConfigForm();
                            vm.dialogAddAuditConfigVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddAuditConfigForm(){
                let vm = this;
                vm.addAuditConfigForm = {
                    type: '',
                    name: '',
                    processCode: '',
                    topic: '',
                    tag: ''
                }
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam.name = '';
            },
            searchList() {
                let vm = this;
                Http.get(Api.auditConfig.page, {params: vm.searchParam}, result => {
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
            //根据ID回显数据字典
            showModifyAuditConfigDialog(row){
                let vm = this;
                Http.get(Api.auditConfig.queryById,{params:{'id':row.id}},result =>{
                    vm.modifyAuditConfigForm = result.result;
                    vm.dialogModifyAuditConfigVisible = true;
                })
            },
            modifyAuditConfig(formName){
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.auditConfig.modify,vm.modifyAuditConfigForm,response =>{
                            vm.dialogModifyAuditConfigVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除角色
            deleteAuditConfig(row){
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.auditConfig.delete, ids, result => {
                        vm.searchList();
                    })
                })
            },
            //新增弹出子表信息列表
            dialogAddAuditConfigSubWindowValue(row){
                let vm = this;
                vm.currentAuditConfigCode=row.auditType;
                vm.searchSubParam.auditType=row.auditType;
                Http.get(Api.auditNode.list, {params: vm.searchSubParam}, result => {
                    vm.dialogAddAuditConfigSubWindow = true;
                    vm.searchSubResult.result = result.result;
                })
            },
            addAuditConfigSub(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.addAuditConfigSubForm.auditType = vm.currentAuditConfigCode;
                        Http.post(Api.auditNode.add,vm.addAuditConfigSubForm,response =>{
                            vm.resetAddAuditConfigSubForm();
                            vm.dialogAddAuditConfigSubVisible = false;
                            vm.searchSubList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddAuditConfigSubForm(){
                let vm = this;
                vm.addAuditConfigSubForm = {
                    auditType: '',
                    nodeCode:'',
                    sort: '',
                    condition:''
                }
            },
            //根据ID回显数据字典值的信息
            showModifyAuditConfigSubDialog(row){
                let vm = this;
                Http.get(Api.auditNode.queryById,{params:{'id':row.id}},result =>{
                    vm.modifyAuditConfigSubForm = result.result;
                    if(result.result.nodeType === 'USER'){
                        vm.$nextTick(()=>{
                            vm.$refs.user.setCurrentAuditApprovers(result.result.user);
                        })
                    }
                    vm.dialogModifyAuditConfigSubVisible = true;
                })
            },
            searchSubList() {
                let vm = this;
                Http.get(Api.auditNode.list, {params: vm.searchSubParam}, result => {
                    vm.searchSubResult.result = result.result;
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
            },
            handleSelectionChangeSub(val) {
                this.multipleSelection = val;
            },
            modifyAuditConfigSub(formName){
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.auditNode.modify,vm.modifyAuditConfigSubForm,response =>{
                            vm.dialogModifyAuditConfigSubVisible = false;
                            vm.searchSubList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除
            deleteAuditConfigSub(row){
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.auditNode.delete, ids, result => {
                        vm.searchSubList();
                    })
                })
            }
        }
    }
</script>
