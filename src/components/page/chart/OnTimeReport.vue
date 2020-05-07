<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>时效报表报表</el-breadcrumb-item>
                <el-breadcrumb-item>准点率报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="到车开始时间:">
                            <date-picker-single v-model="searchParam.startConfirmArrivalTime" date-type="start" :end-date="searchParam.endConfirmArrivalTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到车结束时间:">
                            <date-picker-single v-model="searchParam.endConfirmArrivalTime" date-type="end" :start-date="searchParam.startConfirmArrivalTime"></date-picker-single>
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
            <el-button v-if="exportLoading" v-permission="'/arrivalRate/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result1" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="区域" prop="regionName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="到车数" prop="arrivalCount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="准点数" prop="onTimeCount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="准点率" prop="onTimeRate" min-width="140" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result2" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="大区" prop="regionName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="分区" prop="orgName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="到车数" prop="arrivalCount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="准点数" prop="onTimeCount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="准点率" prop="onTimeRate" min-width="140" show-overflow-tooltip></el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
    import {Http,Api,Common} from 'src/global'
    import axios from 'axios'

    export default {
        data() {
            return {
                //查询
                searchParam: {//查询参数
                    startConfirmArrivalTime: Common.date.dateFormat(new Date(new Date().getTime()-3*24*60*60*1000),"YYYY-MM-01 00:00:00"),//发车时间
                    endConfirmArrivalTime: Common.date.dateFormat(new Date(new Date().getTime()-3*24*60*60*1000),"YYYY-MM-DD 23:59:59")
                },
                isLoading: true,
                searchResult: {//返回结果
                    result1: [],
                    result2: []
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
                this.searchParam = {//查询参数
                    startConfirmArrivalTime: Common.date.dateFormat(new Date(new Date().getTime()-3*24*60*60*1000),"YYYY-MM-01 00:00:00"),//发车时间
                    endConfirmArrivalTime: Common.date.dateFormat(new Date(new Date().getTime()-3*24*60*60*1000),"YYYY-MM-DD 23:59:59")
                };
            },
            searchList() {//查询
                let vm = this;
                if(!this.searchParam.startConfirmArrivalTime && !this.searchParam.endConfirmArrivalTime){
                    return this.$message.warning('请输入时间进行查询！')
                }
                vm.isLoading = true;
                Http.get(Api.arrivalRate.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result1 = result.result.filter((item)=>{
                        return item.type !== 'PARTITION'
                    });
                    this.searchResult.result2 = result.result.filter((item)=>{
                        return item.type === 'PARTITION'
                    });
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.arrivalRate.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '准点率报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
