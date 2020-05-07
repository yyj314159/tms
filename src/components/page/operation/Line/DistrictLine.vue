<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i>基础数据</el-breadcrumb-item>
                <el-breadcrumb-item>区域站点</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="区域:">
                            <district-select style="display: block" :level="3" v-model="searchParam.areaCodess"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item  style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam" size="small">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" v-permission="'/districtLine/add'" type="primary" icon="el-icon-plus" @click="dialogAddDistrictLineVisible=true">新增
            </el-button>
            <el-table class="content-table" size="small" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" align="center" width="40"></el-table-column>
                <el-table-column label="区域名称" align="center" prop="areaOrg.name" min-width="150"></el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" min-width="180"></el-table-column>
                <el-table-column label="创建人" align="center" prop="createUser" min-width="150"></el-table-column>
                <el-table-column label="修改时间" align="center" prop="modifyTime" min-width="180"></el-table-column>
                <el-table-column label="修改人" align="center" prop="modifyUser" min-width="150"></el-table-column>
                <el-table-column label="操作" align="center"  fixed="right" min-width="150">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/districtLine/modify'" icon="el-icon-edit" size="mini"
                                   @click="showModifyDistrictLineDialog(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/districtLine/delete'" icon="el-icon-delete" size="mini"
                                   @click="deleteDistrictLine(scope.row)"></el-button>
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
        <!-- 新增区域弹出框 -->
        <el-dialog title="新增区域" :visible.sync="dialogAddDistrictLineVisible" width="500px">
            <el-form inline size="small" :model="addDistrictLineForm" :rules="DistrictLineRules" ref="addDistrictLineForm" label-width="80px">
                <el-form-item label="区域:" prop="areaCodes">
                    <district-select style="width:300px " :level="3" v-model="addDistrictLineForm.areaCodes"></district-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="dialogAddDistrictLineVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addDistrictLine('addDistrictLineForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改区域弹出框 -->
        <el-dialog title="修改区域" :visible.sync="dialogModifyDistrictLineVisible" width="500px">
            <el-form inline size="small" :model="modifyDistrictLineForm" :rules="DistrictLineRules"
                     ref="modifyDistrictLineForm" label-width="80px">
                <el-form-item label="区域:" prop="areaCodes">
                    <district-select style="width:300px" :level="3" v-model="modifyDistrictLineForm.areaCodes"></district-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  @click="dialogModifyDistrictLineVisible = false" size="small">取 消</el-button>
                <el-button  type="primary" size="small" @click="modifyDistrictLine('modifyDistrictLineForm')">确 定</el-button>
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
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    areaCode1:'',
                    areaCodess: [],
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                dialogAddDistrictLineVisible: false,//新增区域对话框
                dialogModifyDistrictLineVisible: false,//修改区域弹出框
                //新增站点字段
                addDistrictLineForm: {
                    areaCodes: [],
                    areaCode:''
                },
                //区域校验规则
                DistrictLineRules: {
                    areaCodes: [
                        {required: true, message: '请选择区域', trigger: 'blur'}
                    ]
                },
                //修改区域参数
                modifyDistrictLineForm: {
                    areaCodes: [],
                    areaCode:''
                }
            }
        },
        mounted() {
            //查询表格
            this.searchList();
        },
        methods: {
            //新增区域线路
            addDistrictLine(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.addDistrictLineForm.areaCode=vm.addDistrictLineForm.areaCodes[2];
                        Http.post(Api.districtLine.add, vm.addDistrictLineForm, response => {
                            vm.dialogAddDistrictLineVisible = false;
                            vm. resetDistrictLineForm();
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //重置增加参数
            resetDistrictLineForm(){
                let vm = this;
                vm.addDistrictLineForm.areaCode='';
                vm.addDistrictLineForm.areaCodes=[];
            },
            //重置查询参数
            resetSearchParam() {
                let vm  = this;
                vm.searchParam.currentPage=1,
                vm.searchParam.pageSize=10,
                vm.searchParam.areaCode1='',
                vm.searchParam.areaCodess=''
            },
            //查询
            searchList() {
                let vm = this;
                vm.searchParam.areaCode1=vm.searchParam.areaCodess[2];
                Http.get(Api.districtLine.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                })
            },
            //修改一页的记录数
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            //修改当前页
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            },
            //全选
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //修改区域
            showModifyDistrictLineDialog(row) {
                let vm = this;
                Http.get(Api.districtLine.queryById, {params: {'id': row.id}}, result => {
                    vm.modifyDistrictLineForm = result.result;
                    vm.dialogModifyDistrictLineVisible = true;
                })
            },
            //修改区域
            modifyDistrictLine(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.modifyDistrictLineForm.areaCode = vm.modifyDistrictLineForm.areaCodes[2];
                        Http.post(Api.districtLine.modify, vm.modifyDistrictLineForm, response => {
                            vm.dialogModifyDistrictLineVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除区域
            deleteDistrictLine(row) {
                let vm = this;
                let ids = [];
                ids.push(row.id)
                this.$confirm('删除区域后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.districtLine.delete, ids, result => {
                        vm.searchList();
                    })
                })
            }
        }
    }
</script>
