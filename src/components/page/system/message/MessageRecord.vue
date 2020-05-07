<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 短信管理</el-breadcrumb-item>
                <el-breadcrumb-item>短信记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="手机号:" >
                            <el-input v-model="searchParam.mobile"></el-input>
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
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      border fit
                      highlight-current-row stripe>
                <el-table-column header-align="center" label="手机号" prop="mobile" min-width="180px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="签名" prop="signName" min-width="160px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="模板编号" prop="templateCode" min-width="140px"></el-table-column>
                <el-table-column header-align="center" label="模板参数" prop="templateParam" min-width="150px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="请求内容" prop="requestContent" min-width="200px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="返回内容" prop="responseContent" min-width="200px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="发送时间" prop="sendTime" min-width="150px"></el-table-column>
                <el-table-column header-align="center" label="异常信息" prop="exception" min-width="130px"></el-table-column>
                <el-table-column header-align="center" label="是否成功" prop="successFlag" min-width="130px">
                   <template slot-scope="scope">
                       {{scope.row.successFlag === true ? '是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="是否删除" prop="deleteFlag" min-width="130px">
                    <template slot-scope="scope">
                        {{scope.row.deleteFlag === true ? '是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="150px"></el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" min-width="130px"></el-table-column>
                <el-table-column header-align="center" label="修改时间" prop="modifyTime" min-width="150px"></el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" min-width="130px"></el-table-column>
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
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'

    export default {
        data() {
            return {
                searchParam: {//查询短信记录参数
                    currentPage: 1,
                    pageSize: 10,
                    mobile: '',
                },
                searchResult: {//短信记录返回结果
                    totalCount: 0,
                    result: []
                },
            }
        },
        mounted() {
            this.searchList();//查询表格
        },
        methods: {
            resetSearchParam() {//重置方法
                let vm = this;
                vm.searchParam.mobile = '';
            },
            searchList() {//查询短信记录
                let vm = this;
                Http.get(Api.messageRecord.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = 1;
                    vm.searchParam.pageSize = result.pageSize;
                })
            },
            handleSizeChange(val) {//改变每页显示的记录数
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {//改变当前页
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            }
        }
    }
</script>
