<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>营运报表</el-breadcrumb-item>
                <el-breadcrumb-item>油路费占比报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <org-select v-model="searchParam.belongOrgCode" style="display: block"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input v-model="searchParam.vehicleCode" style="display: block"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车主姓名:">
                            <el-input v-model="searchParam.name" style="display: block"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车主电话:">
                            <el-input v-model="searchParam.mobile" style="display:block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="Etc类型:">
                            <dictionary-select style="display: block" option-name="ETC_TYPE"
                                               v-model="searchParam.type"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start"
                                                :end-date="searchParam.endActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end"
                                                :start-date="searchParam.startActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/oilEtcRatio/export'" icon="el-icon-download" type="primary"
                       size="mini" style="margin-left: 10px;" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column label="所属大区" prop="regionCode" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="所属分区" prop="belongOrgCode" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="车辆号码" prop="vehicleCode" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="规格" prop="specification" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="车主" prop="name" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="车主电话" prop="mobile" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="ETC卡类别" prop="type" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="ETC充值金额" prop="totalEtcBill" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="油卡充值金额" prop="totalOilCardRecharge" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="定点加油金额" prop="totalRefuling" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="成本合计" prop="totalCost" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="运费" prop="totalWaybill" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="占比（%）" prop="ratio" min-width="140" show-overflow-tooltip></el-table-column>
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
    import {Http, Api, Common} from 'src/global'
    import axios from 'axios'

    export default {
        data() {
            return {
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    belongOrgCode: '',
                    vehicleCode: '',
                    name: '',
                    mobile: '',
                    type: '',
                    startActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")
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
                    startActualDepartureTime: Common.date.dateFormat(new Date().getTime() - 3600 * 1000 * 24 * 7, "YYYY-MM-DD 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")
                };
            },
            searchList() {//查询
                let vm = this
                if (!vm.searchParam.startActualDepartureTime || !vm.searchParam.endActualDepartureTime) {
                    return this.$message.warning('必须存在开始时间和结束时间！')
                }
                vm.isLoading = true;
                Http.get(Api.oilEtcRatio.page, {params: vm.searchParam}, result => {
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
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.oilEtcRatio.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '油路费占比报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
