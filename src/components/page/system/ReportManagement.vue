<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>报表管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="报表名称:">
                            <el-input v-model="searchParam.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="编号:">
                            <el-input v-model="searchParam.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="addVisible=true">新增</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="报表名称" prop="name" show-overflow-tooltip min-width="140"></el-table-column>
                <el-table-column header-align="center" label="编号" prop="code" show-overflow-tooltip min-width="140"></el-table-column>
                <el-table-column header-align="center" label="报表分类" prop="category" show-overflow-tooltip min-width="140"></el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" show-overflow-tooltip min-width="140"></el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" show-overflow-tooltip min-width="140"></el-table-column>
                <el-table-column header-align="center" label="备注" prop="remark" show-overflow-tooltip min-width="200"></el-table-column>
                <el-table-column header-align="center" fixed="left" align="center" label="操作" width="210">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" size="mini" @click="detailWin(scope.row)">查看</el-button>
                        <el-button type="text" icon="el-icon-edit" size="mini" @click="modifyWin(scope.row)">修改</el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini" @click="deleteRow(scope.row)">删除</el-button>
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

        <!-- 新增 -->
        <el-dialog title="新增报表" :visible.sync="addVisible" width="75%" :top="marginTop">
            <el-form size="small" :model="addForm" ref="addForm" label-width="90px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="报表名称:" prop="name" :rules="Validate.required('报表名称',true)">
                            <el-input v-model="addForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="编号:" prop="code" :rules="Validate.required('编号',true)">
                            <el-input v-model="addForm.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报表分类:">
                            <el-input v-model="addForm.category"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="SQL:">
                            <el-input type="textarea" :rows="14" v-model="addForm.sqlText"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="列属性:">
                            <el-input type="textarea" :rows="4" v-model="addForm.metaColumns"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="配置项:">
                            <el-input type="textarea" :rows="2" v-model="addForm.options"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注:">
                            <el-input type="textarea" :rows="2" v-model="addForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="addVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addSubmit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog title="报表详情" :visible.sync="detailVisible" width="75%" :top="marginTop">
            <el-form size="small" :model="detailForm" label-width="80px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="报表名称:">
                            {{detailForm.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="编号:">
                            {{detailForm.code}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报表分类:">
                            {{detailForm.category}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="SQL:">
                            <el-input type="textarea" :rows="14" v-model="detailForm.sqlText" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="列属性:">
                            <el-input type="textarea" :rows="4" v-model="detailForm.metaColumns" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="配置项:">
                            {{detailForm.options}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注:">
                            {{detailForm.remark}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="修改报表" :visible.sync="modifyVisible" width="75%" :top="marginTop">
            <el-form size="small" :model="modifyForm" ref="modifyForm" label-width="90px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="报表名称:" prop="name" :rules="Validate.required('报表名称',true)">
                            <el-input v-model="modifyForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="编号:" prop="code" :rules="Validate.required('编号',true)">
                            <el-input v-model="modifyForm.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="报表分类:">
                            <el-input v-model="modifyForm.category"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="SQL:">
                            <el-input type="textarea" :rows="14" v-model="modifyForm.sqlText"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="列属性:">
                            <el-input type="textarea" :rows="4" v-model="modifyForm.metaColumns"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="配置项:">
                            <el-input type="textarea" :rows="2" v-model="modifyForm.options"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注:">
                            <el-input type="textarea" :rows="2" v-model="modifyForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="modifyVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifySubmit">确 定</el-button>
            </div>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http,Api,Validate,Common,Constant} from 'src/global'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    name: '',
                    code: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //操作行
                multipleSelection: [],
                //新增
                addVisible: false,
                addForm:{
                    name: '',
                    code: '',
                    category: '',
                    sqlText: '',
                    metaColumns: '',
                    options: '',
                    remark: '',
                    createUser: '',
                    modifyUser: ''
                },
                //修改
                modifyVisible: false,
                modifyForm:{
                    name: '',
                    code: '',
                    category: '',
                    sqlText: '',
                    metaColumns: '',
                    options: '',
                    remark: '',
                    createUser: '',
                    modifyUser: ''
                },
                //查看
                detailVisible: false,
                detailForm:{
                    name: '',
                    code: '',
                    category: '',
                    sqlText: '',
                    metaColumns: '',
                    options: '',
                    remark: '',
                    createUser: '',
                    modifyUser: ''
                }
            }
        },
        computed:{
            marginTop: function () { //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "15vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "8vh";
                }
            },
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    name: '',
                    code: ''
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.report.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            //添加
            addSubmit(){
                this.$refs.addForm.validate((valid)=>{
                    if(valid){
                        Http.post(Api.report.add, this.addForm, response => {
                            this.$message.success('新增报表成功!');
                            this.addVisible = false;
                            this.resetAddForm();
                            this.searchList();
                        })
                    }
                })
            },
            resetAddForm(){
                this.addForm = {
                    name: '',
                    code: '',
                    category: '',
                    sqlText: '',
                    metaColumns: '',
                    options: '',
                    remark: '',
                    createUser: '',
                    modifyUser: ''
                }
            },
            //详情
            detailWin(row){
                _.merge(this.detailForm,row);
                this.detailVisible = true;
            },
            //修改
            modifyWin(row){
                _.merge(this.modifyForm,row);
                this.modifyVisible = true;
            },
            modifySubmit(){
                this.$refs.modifyForm.validate((valid)=>{
                    if(valid){
                        Http.post(Api.report.modify, this.modifyForm, response => {
                            this.modifyVisible = false;
                            this.$message.success('报表修改成功!');
                            this.searchList();
                        })
                    }
                })
            },
            deleteRow(row){
                this.multipleSelection.push(row.id);
                this.$confirm('删除本条数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.report.delete, this.multipleSelection, result => {
                        this.$message.success('删除成功！');
                        this.searchList();
                    })
                })
            }
        }
    }
</script>
