<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>数据字典</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="编码:">
                            <el-input v-model="searchParam.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="名称:">
                            <el-input v-model="searchParam.name"></el-input>
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
            <el-button size="mini" type="primary" v-permission="'/dataDictionary/add'" icon="el-icon-plus" @click="dialogAddDataDictionaryVisible=true">新增</el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center" label="编号" prop="code" min-width="180px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="名称" prop="name" min-width="160px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="140px"></el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" min-width="130px"></el-table-column>
                <el-table-column header-align="center" label="修改时间" prop="modifyTime" min-width="140px"></el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" min-width="130px"></el-table-column>
                <el-table-column header-align="center" label="备注" prop="remark" min-width="160px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/dataDictionary/modify'" icon="el-icon-edit" size="mini" @click="showModifyDataDictionaryDialog(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/dataDictionary/delete'" icon="el-icon-delete" size="mini" @click="deleteDataDictionary(scope.row)"></el-button>
                        <el-button type="text" icon="el-icon-plus" size="mini" @click="dialogAddDataDictionarySubWindowValue(scope.row)"></el-button>
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
        <!-- 新增数据字典弹出框 -->
        <el-dialog title="新增数据字典" :visible.sync="dialogAddDataDictionaryVisible" width="580px">
            <el-form size="small"  inline :model="addDataDictionaryForm" :rules="addDataDictionaryRules" ref="addDataDictionaryForm" label-width="130px">
                <el-form-item label="编号:" prop="code">
                    <el-input v-model="addDataDictionaryForm.code" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="名称:" prop="name">
                    <el-input v-model="addDataDictionaryForm.name" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input type="textarea" :rows="3" :maxlength="200" placeholder="最多200个字符！" v-bind:style="textAreaClass" v-model="addDataDictionaryForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddDataDictionaryVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addDataDictionary('addDataDictionaryForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改数据字典弹出框 -->
        <el-dialog title="修改数据字典" :visible.sync="dialogModifyDataDictionaryVisible" width="580px">
            <el-form size="small"  inline :model="modifyDataDictionaryForm" :rules="addDataDictionaryRules" ref="modifyDataDictionaryForm" label-width="130px">
                <el-form-item label="编号:" prop="code">
                    {{modifyDataDictionaryForm.code}}
                </el-form-item>
                <el-form-item label="名称:" prop="name">
                    <el-input v-model="modifyDataDictionaryForm.name" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input type="textarea" :rows="3" :maxlength="200" placeholder="最多200个字符！" v-bind:style="textAreaClass" v-model="modifyDataDictionaryForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyDataDictionaryVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyDataDictionary('modifyDataDictionaryForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增数据字典子表列表信息 -->
        <el-dialog title="数据字典值的信息" :visible.sync="dialogAddDataDictionarySubWindow" width="70%">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="dialogAddDataDictionarySubVisible=true">新增</el-button>
            <el-table class="content-table" :data="searchSubResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChangeSub"
                      border fit
                      size="small"
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center"  label="字典编码" prop="dictionaryCode" min-width="180px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="值编码" prop="valueCode" min-width="180px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="值名称" prop="valueName" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="顺序" prop="sort" min-width="60px"></el-table-column>
                <el-table-column header-align="center" label="备注" prop="remark" min-width="100px"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="80px">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini" @click="showModifyDataDictionarySubDialog(scope.row)"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini"  @click="deleteDataDictionarySub(scope.row)"></el-button>
                    </template>
                </el-table-column>
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
        <!-- 新增数据字典子表弹出框 -->
        <el-dialog title="新增数据字典值信息" :visible.sync="dialogAddDataDictionarySubVisible" width="580px">
            <el-form size="small"  inline :model="addDataDictionarySubForm" :rules="addDataDictionarySubRules" ref="addDataDictionarySubForm" label-width="130px">
                <el-form-item label="值编码:" prop="valueCode">
                    <el-input v-model="addDataDictionarySubForm.valueCode" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="值名称:" prop="valueName">
                    <el-input v-model="addDataDictionarySubForm.valueName" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="顺序:" prop="sort">
                    <el-input-number v-model="addDataDictionarySubForm.sort" :min="1" :max="1000" style="width:320px"></el-input-number>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input type="textarea" :rows="3" :maxlength="200" placeholder="最多200个字符！" v-bind:style="textAreaClass" v-model="addDataDictionarySubForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddDataDictionarySubVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addDataDictionarySub('addDataDictionarySubForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改数据字典子表弹出框 -->
        <el-dialog title="修改数据字典值信息" :visible.sync="dialogModifyDataDictionarySubVisible" width="580px">
            <el-form size="small" inline :model="modifyDataDictionarySubForm" :rules="addDataDictionarySubRules" ref="modifyDataDictionarySubForm" label-width="130px">
                <el-form-item label="值编码:" prop="valueCode">
                    {{modifyDataDictionarySubForm.valueCode}}
                </el-form-item>
                <el-form-item label="值名称:" prop="valueName">
                    <el-input v-model="modifyDataDictionarySubForm.valueName" style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="顺序:" prop="valueName">
                    <el-input-number v-model="modifyDataDictionarySubForm.sort" :min="1" :max="1000" style="width:320px"></el-input-number>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input type="textarea" :rows="3" :maxlength="200" placeholder="最多200个字符！" v-bind:style="textAreaClass" v-model="modifyDataDictionarySubForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyDataDictionarySubVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyDataDictionarySub('modifyDataDictionarySubForm')">确 定</el-button>
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
                    code: '',
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
                dialogAddDataDictionaryVisible: false,
                addDataDictionaryForm: {
                    code: '',
                    name: '',
                    remark: ''
                },
                textAreaClass:{
                    width: '320px',
                    'font-family': 'initial;'
                },
                addDataDictionaryRules: {
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
                dialogModifyDataDictionaryVisible: false,
                modifyDataDictionaryForm:{
                    code: '',
                    name: '',
                    remark: ''
                },
                addDataDictionarySubRules: {
                    valueCode: [
                        {required: true, message: '请输入值编码', trigger: 'blur'},
                        {min: 1, max: 50, message: '编号最长50个字符', trigger: 'blur'}
                    ],
                    valueName: [
                        {required: true, message: '请输入值名称', trigger: 'blur'}
                    ],
                    sort: [
                        {required: true, message: '请输入顺序', trigger: 'blur'}
                    ],
                    remark: [
                        {required: false, message: '请输入备注', trigger: 'blur'},
                        {min: 1, max: 200, message: '备注最长200个字符', trigger: 'blur'}
                    ]
                },
                dialogAddDataDictionarySubWindow: false,
                dialogAddDataDictionarySubVisible: false,
                dialogModifyDataDictionarySubVisible: false,
                addDataDictionarySubForm: {
                    dictionaryCode:'',
                    valueCode: '',
                    valueName: '',
                    sort: '',
                    remark: ''
                },
                modifyDataDictionarySubForm:{
                    dictionaryCode:'',
                    valueCode: '',
                    valueName: '',
                    sort: '',
                    remark: ''
                },
                currentDataDictionaryCode: ''
            }
        },
        mounted() {
            //查询表格
            this.searchList();
        },
        methods: {
            addDataDictionary(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.dataDictionary.add,vm.addDataDictionaryForm,response =>{
                            vm.resetAddDataDictionaryForm();
                            vm.dialogAddDataDictionaryVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddDataDictionaryForm(){
                let vm = this;
                vm.addDataDictionaryForm = {
                    code: '',
                    name: '',
                    remark: ''
                }
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam.code = '';
                vm.searchParam.name = '';
            },
            searchList() {
                let vm = this;
                Http.get(Api.dataDictionary.page, {params: vm.searchParam}, result => {
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
            showModifyDataDictionaryDialog(row){
                let vm = this;
                Http.get(Api.dataDictionary.queryById,{params:{'id':row.id}},result =>{
                    vm.modifyDataDictionaryForm = result.result;
                    vm.dialogModifyDataDictionaryVisible = true;
                })
            },
            modifyDataDictionary(formName){
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.dataDictionary.modify,vm.modifyDataDictionaryForm,response =>{
                            vm.dialogModifyDataDictionaryVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除角色
            deleteDataDictionary(row){
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.dataDictionary.delete, ids, result => {
                        vm.searchList();
                    })
                })
            },
            //新增弹出子表信息列表
            dialogAddDataDictionarySubWindowValue(row){
                let vm = this;
                vm.currentDataDictionaryCode=row.code;
                vm.searchSubParam.dictionaryCode=row.code;
                Http.get(Api.dataDictionary.pageSub, {params: vm.searchSubParam}, result => {
                    vm.dialogAddDataDictionarySubWindow = true;
                    vm.searchSubResult.result = result.result;
                    vm.searchSubResult.totalCount = result.totalCount;
                    vm.searchSubParam.currentPage = result.currentPage;
                    vm.searchSubParam.pageSize = result.pageSize;
                })
            },
            addDataDictionarySub(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.addDataDictionarySubForm.dictionaryCode = vm.currentDataDictionaryCode;
                        Http.post(Api.dataDictionary.addSub,vm.addDataDictionarySubForm,response =>{
                            vm.resetAddDataDictionarySubForm();
                            vm.dialogAddDataDictionarySubVisible = false;
                            vm.searchSubList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddDataDictionarySubForm(){
                let vm = this;
                vm.addDataDictionarySubForm = {
                    dictionaryCode:'',
                    valueCode: '',
                    valueName: '',
                    sort: '',
                    remark: ''
                }
            },
            //根据ID回显数据字典值的信息
            showModifyDataDictionarySubDialog(row){
                let vm = this;
                Http.get(Api.dataDictionary.queryByIdSub,{params:{'id':row.id}},result =>{
                    vm.modifyDataDictionarySubForm = result.result;
                    vm.dialogModifyDataDictionarySubVisible = true;
                })
            },
            searchSubList() {
                let vm = this;
                Http.get(Api.dataDictionary.pageSub, {params: vm.searchSubParam}, result => {
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
            },
            handleSelectionChangeSub(val) {
                this.multipleSelection = val;
            },
            modifyDataDictionarySub(formName){
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.dataDictionary.modifySub,vm.modifyDataDictionarySubForm,response =>{
                            vm.dialogModifyDataDictionarySubVisible = false;
                            vm.searchSubList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除
            deleteDataDictionarySub(row){
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.dataDictionary.deleteSub, ids, result => {
                        vm.searchSubList();
                    })
                })
            }
        }
    }
</script>
