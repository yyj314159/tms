<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>报表导出记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="报表名称:">
                            <el-input v-model="searchParam.reportName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="导出用户:">
                            <el-input v-model="searchParam.exportUser"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam()">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="报表名称" prop="reportName" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="请求路径" prop="requestUrl" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="导出用户" prop="exportUser" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="导出开始时间" prop="exportStartTime" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="导出结束时间" prop="exportStopTime" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="导出数量" prop="exportNumber" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" show-overflow-tooltip
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" show-overflow-tooltip
                                 min-width="140"></el-table-column>
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


    </el-container>
</template>

<script>
    import {Http, Api, Validate, Common, Constant} from 'src/global'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    reportName:'',
                    exportUser:''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //操作行
                multipleSelection: [],
            }
        },
        mounted() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.exportReport.page, {params: vm.searchParam}, result => {
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
            }
        }
    }

</script>
