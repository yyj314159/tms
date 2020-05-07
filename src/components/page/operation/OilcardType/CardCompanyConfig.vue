<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 油品管理</el-breadcrumb-item>
                <el-breadcrumb-item>油卡平台公司配置参数</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="平台编码:">
                            <el-input v-model="searchParam.cardCompanyCode" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="平台名称:">
                            <el-input v-model="searchParam.cardCompanyName" size="small"></el-input>
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
            <el-button size="mini" type="primary" v-permission="'/cardCompanyConfig/add'" icon="el-icon-plus" @click="dialogAddConfigParamVisible=true">新增</el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center" label="平台编码" prop="cardCompanyCode" min-width="150px"></el-table-column>
                <el-table-column header-align="center" label="平台名称" prop="cardCompanyName" min-width="150px"></el-table-column>
                <el-table-column header-align="center" label="APP_KEY值" prop="cardCompanyAppKey" min-width="150px"></el-table-column>
                <el-table-column header-align="center" label="APP_SECRET值" prop="cardCompanyAppSecret" min-width="150px" show-overflow-tooltip/>
                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="180px"></el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" min-width="150px"></el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" min-width="150px"></el-table-column>
                <el-table-column header-align="center" label="修改时间" prop="modifyTime" min-width="180px"></el-table-column>
                <el-table-column header-align="center" label="备注" prop="remark" min-width="150px"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/cardCompanyConfig/modify'" icon="el-icon-edit" size="mini" @click="showModifyConfigParamDialog(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/cardCompanyConfig/delete'" icon="el-icon-delete" size="mini"  @click="deleteConfigParam(scope.row)"></el-button>
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
        <!-- 新增配置参数弹出框 -->
        <el-dialog title="新增配置参数" :visible.sync="dialogAddConfigParamVisible" width="380px">
            <el-form size="small" inline :model="addConfigParamForm" :rules="addConfigParamRules" ref="addConfigParamForm" label-width="120px">
                <el-form-item label="平台编码:" prop="cardCompanyCode">
                    <el-input v-model="addConfigParamForm.cardCompanyCode"></el-input>
                </el-form-item>
                <el-form-item label="平台名称:" prop="cardCompanyName">
                    <el-input v-model="addConfigParamForm.cardCompanyName"></el-input>
                </el-form-item>
                <el-form-item label="APP_KEY:" prop="cardCompanyAppKey">
                    <el-input v-model="addConfigParamForm.cardCompanyAppKey"></el-input>
                </el-form-item>
                <el-form-item label="APP_SECRET:" prop="cardCompanyAppSecret">
                    <el-input v-model="addConfigParamForm.cardCompanyAppSecret"></el-input>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input type="textarea" :rows="3" :maxlength="200" placeholder="最多200个字符！" v-bind:style="textareaClass" v-model="addConfigParamForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddConfigParamVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addConfigParam('addConfigParamForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改配置参数弹出框 -->
        <el-dialog title="修改配置参数" :visible.sync="dialogModifyConfigParamVisible" width="380px">
            <el-form size="small" inline :model="modifyConfigParamForm" :rules="addConfigParamRules" ref="modifyConfigParamForm" label-width="120px">
                <el-form-item label="平台编码:" prop="cardCompanyCode">
                    <el-input v-model="modifyConfigParamForm.cardCompanyCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="平台名称:" prop="cardCompanyName">
                    <el-input v-model="modifyConfigParamForm.cardCompanyName"></el-input>
                </el-form-item>
                <el-form-item label="APP_KEY:" prop="cardCompanyAppKey">
                    <el-input v-model="modifyConfigParamForm.cardCompanyAppKey"></el-input>
                </el-form-item>
                <el-form-item label="APP_SECRET:" prop="cardCompanyAppSecret">
                    <el-input v-model="modifyConfigParamForm.cardCompanyAppSecret"></el-input>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input type="textarea" :rows="3" :maxlength="200" placeholder="最多200个字符！" v-bind:style="textareaClass" v-model="modifyConfigParamForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyConfigParamVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyConfigParam('modifyConfigParamForm')">确 定</el-button>
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
                    cardCompanyCode: '',
                    cardCompanyName: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                dialogAddConfigParamVisible: false,
                addConfigParamForm: {
                    cardCompanyCode: '',
                    cardCompanyName: '',
                    cardCompanyAppKey: '',
                    cardCompanyAppSecret:'',
                    remark: ''
                },
                textareaClass: {
                    width: '107%',
                    'font-family': 'initial;'
                },
                addConfigParamRules: {
                    cardCompanyCode: [
                        {required: true, message: '请输入编码', trigger: 'blur'},
                        {min: 1, max: 50, message: '编码最长50个字符', trigger: 'blur'}
                    ],
                    cardCompanyName: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    cardCompanyAppKey: [
                        {required: true, message: '请输入值', trigger: 'blur'}
                    ],
                    cardCompanyAppSecret: [
                        {required: true, message: '请输入值', trigger: 'blur'}
                    ],
                    remark: [
                        {required: false, message: '请输入备注', trigger: 'blur'},
                        {min: 1, max: 200, message: '备注最长200个字符', trigger: 'blur'}
                    ]
                },
                dialogModifyConfigParamVisible: false,
                modifyConfigParamForm: {
                    cardCompanyCode: '',
                    cardCompanyName: '',
                    cardCompanyAppKey: '',
                    cardCompanyAppSecret:'',
                    remark: ''
                }
            }
        },
        mounted() {
            //查询表格
            this.searchList();
        },
        methods: {
            addConfigParam(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.cardCompanyConfig.add,vm.addConfigParamForm,response =>{
                            vm.resetAddConfigParamForm();
                            vm.dialogAddConfigParamVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddConfigParamForm(){
                let vm = this;
                vm.addConfigParamForm = {
                    cardCompanyCode: '',
                    cardCompanyName: '',
                    cardCompanyAppKey: '',
                    cardCompanyAppSecret:'',
                    remark: ''
                }
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam.cardCompanyCode = '';
                vm.searchParam.cardCompanyName = ''
                vm.searchParam.cardCompanyAppKey='',
                vm.searchParam.cardCompanyAppSecret=''
            },
            searchList() {
                let vm = this;
                Http.get(Api.cardCompanyConfig.page, {params: vm.searchParam}, result => {
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
            //通过ID回显数据
            showModifyConfigParamDialog(row){
                let vm = this;
                Http.get(Api.cardCompanyConfig.queryById,{params:{'id':row.id}},result =>{
                    vm.modifyConfigParamForm = result.result;
                    vm.dialogModifyConfigParamVisible = true;
                })
            },
            modifyConfigParam(formName){
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.cardCompanyConfig.modify,vm.modifyConfigParamForm,response =>{
                            vm.dialogModifyConfigParamVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除
            deleteConfigParam(row){
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.cardCompanyConfig.delete, ids, result => {
                        vm.searchList();
                    })
                })
            }
        }
    }
</script>
