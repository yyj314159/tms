<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>油卡比例监控报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <org-select v-model="searchParam.applyOrgCode" style="display: block"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="用油比例:">
                            <dictionary-select  v-model="searchParam.oilRatio" style="display: block" option-name="OIL_RATIO"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="查询时间:">
                            <el-date-picker
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width:100%;"
                                v-model="searchParam.rechargeTime"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :clearable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading"  icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList" v-permission="'/oilRatio/export'">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" fit border highlight-current-row stripe >
                <el-table-column  label="用油比例" prop="oilRatio" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属组织" prop="applyOrgCode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="运单数量" prop="totalWaybillCode" min-width="120" show-overflow-tooltip></el-table-column>
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
    import {Http,Api,Common} from 'src/global'
    import axios from 'axios'
    import DataDictionarySelect from "../../common/select/DataDictionarySelect";

    export default {
        components: {DataDictionarySelect},
        data() {
            return {
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    rechargeStartTime: undefined,
                    rechargeEndTime: undefined,
                    applyOrgCode:'',
                    rechargeTime: [Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")]
                },
                isLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                let vm = this;
                vm.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    rechargeStartTime: undefined,
                    rechargeEndTime:undefined,
                    applyOrgCode:'',
                    rechargeTime: []
                };
            },
            searchList() {//查询
                let vm = this;
                if (vm.searchParam.rechargeTime) {
                    vm.searchParam.rechargeStartTime = this.searchParam.rechargeTime[0];
                    vm.searchParam.rechargeEndTime = this.searchParam.rechargeTime[1];
                }
                vm.isLoading = true;
                Http.get(Api.oilRatio.page,{ params : vm.searchParam }, result => {
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
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.oilRatio.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '油卡比例监控报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
