<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>油卡报表</el-breadcrumb-item>
                <el-breadcrumb-item>油卡比例统计报表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start"
                                                :end-date="searchParam.endActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end"
                                                :start-date="searchParam.startActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="大区:">
                            <org-select v-model="searchParam.regionCode" style="display: block" nature="AREA"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="小区:">
                            <org-select v-model="searchParam.belongOrgCode" style="display: block" nature="PARTITION"></org-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <data-dictionary-select v-model="searchParam.operationMode" style="display: block"
                                                    option-name="VEHICLE_OPERATION_MODE"></data-dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否显示小区:">
                            <data-dictionary-select v-model="searchParam.belongOrgCodeFlag" style="display: block"
                                                    option-name="BOOLEAN_FLAG"
                                                    :clearable="false"></data-dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
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
                <el-table-column label="所属区域" min-width="140"
                                 show-overflow-tooltip prop="name"></el-table-column>
                <el-table-column label="1月份" min-width="140"
                                 show-overflow-tooltip>
                    <el-table-column label="应付" prop="jan" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油费" prop="jan1" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油比" prop="janTotal" show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="2月份" min-width="140"
                                 show-overflow-tooltip>
                    <el-table-column label="应付" prop="feb" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油费" prop="feb2" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油比" prop="feb2Total" show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="3月份" min-width="140"
                                 show-overflow-tooltip>
                    <el-table-column label="应付" prop="mar" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油费" prop="mar3" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油比" prop="mar3Total" show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="4月份" min-width="140"
                                 show-overflow-tooltip>
                    <el-table-column label="应付" prop="apr" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油费" prop="apr4" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油比" prop="apr4Total" show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="5月份" min-width="140"
                                 show-overflow-tooltip>
                    <el-table-column label="应付" prop="may" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油费" prop="may5" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油比" prop="may5Total" show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="6月份" min-width="140"
                                 show-overflow-tooltip>
                    <el-table-column label="应付" prop="jun" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油费" prop="jun6" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油比" prop="jun6Total" show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="7月份" min-width="140"
                                 show-overflow-tooltip>
                    <el-table-column label="应付" prop="jul" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油费" prop="jul7" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油比" prop="jul7Total" show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="8月份" min-width="140"
                                 show-overflow-tooltip>
                    <el-table-column label="应付" prop="aug" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油费" prop="aug8" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油比" prop="aug8Total" show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="9月份" min-width="140"
                                 show-overflow-tooltip>
                    <el-table-column label="应付" prop="sep" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油费" prop="sep9" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油比" prop="sep9Total" show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="10月份" min-width="140"
                                 show-overflow-tooltip>
                    <el-table-column label="应付" prop="oct" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油费" prop="oct10" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油比" prop="oct10Total" show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="11月份" min-width="140"
                                 show-overflow-tooltip>
                    <el-table-column label="应付" prop="nov" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油费" prop="nov11" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油比" prop="nov11Total" show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="12月份" min-width="140"
                                 show-overflow-tooltip>
                    <el-table-column label="应付" prop="dec" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油费" prop="dec12" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油比" prop="dec12Total" show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="小计（平均）" min-width="140"
                                 show-overflow-tooltip>
                    <el-table-column label="应付" prop="avgTableMonth" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油费" prop="avgTablereceiveAmount" show-overflow-tooltip></el-table-column>
                    <el-table-column label="油比" prop="avgTableroundTotal" show-overflow-tooltip></el-table-column>
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
    import {Http, Api, Common} from 'src/global'
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
                    startActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-01-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),
                    belongOrgCodeFlag: false,
                    regionCode: '',
                    belongOrgCode: '',
                    operationMode: 'OUT_INVITE'
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
                    endActualDepartureTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),
                    belongOrgCodeFlag:false
                };
            },
            searchList() {//查询
                let vm = this
                if (!vm.searchParam.startActualDepartureTime || !vm.searchParam.endActualDepartureTime) {
                    return this.$message.warning('必须存在开始时间和结束时间！')
                }
                vm.isLoading = true;
                Http.get(Api.oilRatioCount.page, {params: vm.searchParam}, result => {
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
                axios.get(Api.oilRatioCount.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '油卡比例统计报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
