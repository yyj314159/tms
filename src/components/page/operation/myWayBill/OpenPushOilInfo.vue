<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 定点加油</el-breadcrumb-item>
                <el-breadcrumb-item>供应商油品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="油品ID:">
                            <el-input v-model="searchParam.id" style="display: block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="加油站:">
                            <refueling-supplier-select v-model="searchParam.skidId" style="display:block;"></refueling-supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="城市:">
                            <el-input v-model="searchParam.city" style="display: block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-if="btnLoading" v-permission="'/openPushOilInfo/export'" size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column align="center" label="油品" prop="id" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="省份" prop="province" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="城市" prop="city" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="区域" prop="region" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油品种类" prop="oilsType" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="价格" prop="zhaoyouPrice" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油站Id" prop="skidId" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油站名称" prop="pushStationInfo.oilsStationName" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油品来源" prop="oilsFrom" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油品类型" prop="oilsCategory" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="用油级别" prop="oilsLevel" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="标准价格" prop="basicPrice" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="是否下架" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.isStop=="1" ? "已下架":"正常" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" prop="createTime" min-width="140px" show-overflow-tooltip></el-table-column>
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
    import {Http,Common,Api} from 'src/global'

    export default {
        data() {
            return {
                btnLoading: true,
                isLoading: true,
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    id: '',
                    skidId: '',
                    city: '',
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                tableHeight: window.innerHeight>800?480:null
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.id = '';
                this.searchParam.city = '';
                this.searchParam.skidId = '';
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.openPushOilInfo.page,{ params : vm.searchParam }, result => {
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
            exportData() {
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.openPushOilInfo.page, {params: searchExportParam}, response => {
                    let header = ['油品ID', '省份', '城市', '区域', '油品种类', '价格', '油站ID','油站名称', '油品来源','油品类型','用油级别','标准价格'];
                    let filterVal = ['id','province','city','region','oilsType','zhaoyouPrice','skidId','pushStationInfo.oilsStationName','oilsFrom','oilsCategory','oilsLevel','basicPrice'];
                    Common.excel.downloadExl(response.result, header, filterVal, "供应商油品种类导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            }
        }
    }
</script>

