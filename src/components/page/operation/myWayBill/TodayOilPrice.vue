<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 定点加油</el-breadcrumb-item>
                <el-breadcrumb-item>今日油价</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="省份:">
                            <el-input v-model="searchParam.prov" style="display: block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="查询时间:">
                            <el-date-picker
                                v-model="searchParam.queryTime"
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :clearable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-permission="permission.update" size="small" type="primary" @click="updateData"
            >更 新
            </el-button>
            <el-button v-if="btnLoading" v-permission="permission.export" size="small" type="primary"
                       icon="el-icon-download" @click="exportData">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight"
                      :style="{height:'auto'}">
                <el-table-column align="center" label="省份" prop="prov" min-width="80"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="日期" prop="validTime" :formatter="dateFormat" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="0号柴油" prop="p0" min-width="80"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="89号汽油" prop="p89" min-width="80"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="90号汽油" prop="p90" min-width="80"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="92号汽油" prop="p92" min-width="80"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="93号汽油" prop="p93" min-width="80"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="95号汽油" prop="p95" min-width="80"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="97号汽油" prop="p97" min-width="80"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="98号汽油" prop="p98" min-width="80"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="更新时间" prop="ct" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="创建人" prop="createUser" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="创建时间" prop="createTime" min-width="160px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="修改人" prop="modifyUser" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="修改时间" prop="modifyTime" min-width="160px"
                                 show-overflow-tooltip></el-table-column>

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
    import {Http, Common, Api} from 'src/global'
    import moment from 'moment'

    export default {
        data() {
            return {
                btnLoading: true,
                isLoading: true,
                Api: Api,
                permission: {
                    export: '/oilPrice/export',//油价导出
                    update: '/oilPrice/update'//油价更新
                },
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    queryTime: [],
                    queryTimeStart: '',
                    queryTimeEnd: '',
                    prov: '',
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                tableHeight: window.innerHeight > 800 ? 480 : null
            }
        },
        created() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data)
            this.searchList();
        },
        methods: {
            cloneModel() {
                return _.cloneDeep(this.initializeModel)
            },
            resetSearchParam() {//重置参数
                this.searchParam = this.cloneModel().searchParam
            },
            dateFormat: function (row, column) {
                console.log(row, column)
                const date = row[column.property]
                if (date === undefined) {
                    return ''
                }
                // # 这里的格式根据需求修改
                return moment(date).format('YYYY-MM-DD')
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                if (vm.searchParam.queryTime) {
                    vm.searchParam.queryTimeStart = vm.searchParam.queryTime[0];
                    vm.searchParam.queryTimeEnd = vm.searchParam.queryTime[1];
                } else {
                    vm.searchParam.queryTimeStart = "";
                    vm.searchParam.queryTimeEnd = "";
                }
                Http.get(Api.oilPrice.page, {params: vm.searchParam}, result => {
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
            updateData() {
                let vm = this;
                Http.get(Api.oilPrice.update, '', (result) => {
                },result=>{
                    vm.$message.success("更新成功!!!");
                    this.searchList();
                })
            },
            exportData() {
                let vm = this;
                debugger
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.oilPrice.page, {params: searchExportParam}, response => {
                    let header = ['省份', '日期', '0号柴油', '89号汽油', '90号汽油', '92号汽油', '93号汽油', '95号汽油', '97号汽油', '98号汽油',  '更新时间','创建人', '创建时间', '更新人', '更新时间'];
                    let filterVal = ['prov', {
                        type: 'function',
                        render: function (val) {
                            return Common.date.dateFormat(val.validTime, 'YYYY-MM-DD')
                        }
                    }, 'p0', 'p89', 'p90', 'p92', 'p93', 'p95', 'p97', 'p98', 'ct', 'createUser', 'createTime', 'modifyUser', 'modifyTime'];
                    Common.excel.downloadExl(response.result, header, filterVal, "今日油价导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            }
        }
    }
</script>

