<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>不发应付审批</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户名称:">
                            <customer-select v-model="searchParam.customerCode" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchList()">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="addVisible=true">新增</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="客户名称" prop="customerName" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="修改时间" prop="modifyTime" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" fixed="left" align="center" label="操作" width="210">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" size="mini" @click="deleteRow(scope.row)">删除
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

        <!-- 新增 -->
        <el-dialog title="新增客户" :visible.sync="addVisible" width="40%" :top="marginTop">
            <el-form size="small" :model="addForm" ref="addForm" label-width="90px">
                <el-row>
                    <el-col>
                        <el-form-item label="客户名称:" prop="customerCode" :rules="Validate.required('客户名称',true)">
                            <customer-select v-model="addForm.customerCode" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="addVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Api, Constant, Http, Validate} from 'src/global'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //操作行
                multipleSelection: [],
                //新增
                addVisible: false,
                addForm: {
                    customerCode: ''
                },
            }
        },
        computed: {
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
                    customerCode: ''
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.noDingtalkAuditCustomer.page, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
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
            addSubmit() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.noDingtalkAuditCustomer.add, this.addForm, () => {
                            this.$message.success('新增报表成功!');
                            this.addVisible = false;
                            this.resetAddForm();
                            this.searchList();
                        })
                    }
                })
            },
            resetAddForm() {
                this.addForm = {
                    customerCode: ''
                }
            },
            deleteRow(row) {
                this.multipleSelection.push(row.id);
                this.$confirm('删除本条数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.noDingtalkAuditCustomer.delete, this.multipleSelection, () => {
                        this.$message.success('删除成功！');
                        this.searchList();
                    })
                })
            }
        }
    }
</script>
