<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>我的回单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input  v-model="searchParam.waybillCode" style="display:block;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="回单号:">
                            <el-input style="display:block;" v-model="searchParam.code"></el-input>
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
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="运单号" min-width="140">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row.waybillCode)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="回单号" prop="code" min-width="320" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="签收时间" prop="signTime" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="回单交接人" prop="handoverUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="回单交接时间" prop="handoverTime" min-width="180"></el-table-column>
                <el-table-column header-align="center" label="回单接收人" prop="receiveUser" min-width="140"></el-table-column>
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
    import {Common} from 'src/global/common'
    import {Constant} from 'src/global/constant'

    export default {
        data() {
            return {
                Constant:Constant,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',//运单号
                    code: ""
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                }
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.waybillCode='';
                this.searchParam.code="";
            },
            searchList() {//查询
                let vm = this;
                Http.get(Api.waybillReceipt.myReceiptPage,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
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
            showWayBill(code){ //运单详情------------------------------------
                this.$router.push({ path: '/operation/waybillDetail',query: {code: code}});
            }
        }
    }
</script>

