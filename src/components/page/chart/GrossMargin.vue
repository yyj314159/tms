<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>毛利率区间分布表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start" :end-date="searchParam.endActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end" :start-date="searchParam.startActualDepartureTime"></date-picker-single>
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
            <el-button v-if="exportLoading" v-permission="'/grossMargin/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="毛利率区间" prop="grossMarginRate" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="1月份" prop="jan" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showGrossMarginDialog(scope.row,'01',n)">{{scope.row.jan}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="2月份" prop="feb" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showGrossMarginDialog(scope.row,'02')">{{scope.row.feb}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="3月份" prop="mar" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showGrossMarginDialog(scope.row,'03')">{{scope.row.mar}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="4月份" prop="apr" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showGrossMarginDialog(scope.row,'04')">{{scope.row.apr}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="5月份" prop="may" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showGrossMarginDialog(scope.row,'05')">{{scope.row.may}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="6月份" prop="jun" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showGrossMarginDialog(scope.row,'06')">{{scope.row.jun}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="7月份" prop="jul" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showGrossMarginDialog(scope.row,'07')">{{scope.row.jul}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="8月份" prop="aug" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showGrossMarginDialog(scope.row,'08')">{{scope.row.aug}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="9月份" prop="sep" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showGrossMarginDialog(scope.row,'09')">{{scope.row.sep}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="10月份" prop="oct" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showGrossMarginDialog(scope.row,'10')">{{scope.row.oct}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="11月份" prop="nov" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showGrossMarginDialog(scope.row,'11')">{{scope.row.nov}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="12月份" prop="dec" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showGrossMarginDialog(scope.row,'12')">{{scope.row.dec}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="合计" prop="sumWay" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showGrossMarginDialog(scope.row)">{{scope.row.sumWay}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="占比" prop="rate" min-width="140" show-overflow-tooltip></el-table-column>
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
        <!--毛利率区间明细-->
        <grossMarginDialog v-if="grossMarginDialog" :visible="grossMarginDialog" @close="hideGrossMarginDialog" :currentRowed="currentRows" :startActualDepartureTime="startActualDepartureTime"
                           :endActualDepartureTime="endActualDepartureTime"
                           :month="month"/>
    </el-container>
</template>

<script>
    import {Http,Api,Common} from 'src/global'
    import axios from 'axios'
    import grossMarginDialog from "./GrossMarginDialog";

    export default {
        components: {grossMarginDialog},
        data() {
            return {
                grossMarginDialog:false,//毛利率区间明显对话框
                currentRows: null,//操作行的数据
                startActualDepartureTime:'',
                endActualDepartureTime:'',
                month:'',//用来表示月份
                common: Common,
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    startActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59")
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
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    startActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59")
                };
            },
            searchList() {//查询
                let vm = this;
                if(!this.searchParam.startActualDepartureTime || !this.searchParam.endActualDepartureTime){
                    return this.$message.warning('请输入时间进行查询！')
                }
                vm.isLoading = true;
                Http.get(Api.grossMargin.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            showGrossMarginDialog(row,month){//显示毛利率区间明细对话框
                let vm = this;
                vm.grossMarginDialog=true;
                vm.currentRows=row;
                vm.month=month;
                vm.startActualDepartureTime=vm.searchParam.startActualDepartureTime;
                vm.endActualDepartureTime=vm.searchParam.endActualDepartureTime;
            },
            hideGrossMarginDialog(){
              this.grossMarginDialog=false;
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
                axios.get(Api.grossMargin.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '毛利率区间分布报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
