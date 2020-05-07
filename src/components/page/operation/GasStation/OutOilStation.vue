<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 定点加油</el-breadcrumb-item>
                <el-breadcrumb-item>外请加油站点</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="站点名称:">
                            <el-input v-model="searchParam.stationName" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="省:">
                            <el-input v-model="searchParam.provinceName" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="市:">
                            <el-input v-model="searchParam.cityName" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="区域:">
                            <el-input v-model="searchParam.districtName" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="加油供应商:">
                            <dictionary-select v-model="searchParam.currentCompany" style="display:block" option-name="GAS_STATION"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否高速站点:">
                            <dictionary-select v-model="searchParam.highSpeedStation" style="display:block" option-name="HIGH_SPEED_STATION"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="站点状态:">
                            <dictionary-select v-model="searchParam.stationStatus" style="display:block" option-name="OUT_STATION_STATUS"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否禁用:">
                            <dictionary-select v-model="searchParam.disableStatus" style="display:block" option-name="OUT_STATION_DISABLE_STATUS"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
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
            <el-button v-if="btnLoading" v-permission="'/OutOilStation/export'" size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column align="center" label="加油供应商" min-width="110" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="GAS_STATION"
                                                v-model="scope.row.currentCompany"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="站点名称" prop="stationName" min-width="230" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="省" prop="provinceName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="市" prop="cityName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="区域" prop="districtName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="地址" prop="address" min-width="250" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="经度" prop="lng" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="纬度" prop="lat" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="是否高速站点" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name  option-name="HIGH_SPEED_STATION" v-model="scope.row.highSpeedStation"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="站点状态" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name  option-name="OUT_STATION_STATUS" v-model="scope.row.stationStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="禁用状态" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if='scope.row.disableStatus'>
                            {{"已启用"}}
                        </span>
                        <span v-else style="color: red">
                            {{"已禁用"}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="100">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.disableStatus" v-permission="'/OutOilStation/disable'" type="text" size="mini"  @click="changeDisabledStatus(scope.row,!scope.row.disableStatus)"><i class="fa fa-ban"></i>禁用</el-button>
                        <el-button v-else v-permission="'/OutOilStation/disable'" type="text" size="mini"  @click="changeDisabledStatus(scope.row,!scope.row.disableStatus)"><i class="fa fa-check"></i>启用</el-button>
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
    </el-container>
</template>

<script>
    import {Http,Api,Validate,Common,Constant} from 'src/global'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                btnLoading: true,
                isLoading: true,
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    stationName: '',//站点名称
                    provinceName:'', //省
                    cityName: '',//市
                    districtName: '',//区域
                    currentCompany: '',//加油供应商
                    highSpeedStation: '',//是否高速站点
                    stationStatus: '',//站点状态
                    disableStatus: ''//是否禁用
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
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    stationName: '',//站点名称
                    provinceName:'', //省
                    cityName: '',//市
                    districtName: '',//区域
                    currentCompany: '',//加油供应商
                    highSpeedStation: '',//是否高速站点
                    stationStatus: '',//站点状态
                    disableStatus: ''//是否禁用
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.outOilStation.page,{ params : vm.searchParam }, result => {
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
            changeDisabledStatus(row,flag){
                let newRow = _.cloneDeep(row);
                newRow.disableStatus = flag;
                let str = flag?`确定要启用该站点？`:`确定要禁用该站点？`;
                let msg = flag?`站点启用成功！`:`站点禁用成功！`;
                this.$confirm(str, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.outOilStation.disable, newRow, result => {
                        this.$message.success(msg);
                        this.searchList();
                    })
                })
            },
            exportData() {
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.outOilStation.page, {params: searchExportParam}, response => {
                    let header = ['加油供应商', '站点名称', '省', '市', '区域', '地址', '经度', '纬度', '是否高速站点', '站点状态', '禁用状态'];
                    let filterVal = [
                        {
                            type: 'dictionary',
                            code: 'GAS_STATION',
                            name: 'currentCompany'
                        },
                        'stationName','provinceName', 'cityName', 'districtName', 'address', 'lng', 'lat',
                        {
                            type: 'dictionary',
                            code: 'HIGH_SPEED_STATION',
                            name: 'highSpeedStation'
                        },
                        {
                            type: 'dictionary',
                            code: 'OUT_STATION_STATUS',
                            name: 'stationStatus'
                        },
                        {
                            type: 'dictionary',
                            code: 'OUT_STATION_DISABLE_STATUS',
                            name: 'disableStatus'
                        }
                    ];
                    Common.excel.downloadExl(response.result, header, filterVal, "外请加油站点导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            }
        }
    }
</script>

