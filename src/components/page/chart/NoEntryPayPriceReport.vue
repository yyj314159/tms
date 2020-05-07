<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>未录入应付</el-breadcrumb-item>
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
                    <el-col :span="6">
                        <el-form-item label="所属大区:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block" nature="AREA"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/noEntryPayReport/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="所属大区" prop="org" min-width="130" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="1月份"  prop="jan" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409eff;" @click="showPaidDetail(scope.row,'01')">{{scope.row.jan}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="2月份"  prop="feb" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showPaidDetail(scope.row,'02')">{{scope.row.feb}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="3月份"  prop="mar" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showPaidDetail(scope.row,'03')">{{scope.row.mar}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="4月份"  prop="apr" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showPaidDetail(scope.row,'04')">{{scope.row.apr}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="5月份"  prop="may" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showPaidDetail(scope.row,'05')">{{scope.row.may}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="6月份"  prop="jun" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showPaidDetail(scope.row,'06')">{{scope.row.jun}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="7月份"  prop="jul" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showPaidDetail(scope.row,'07')">{{scope.row.jul}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="8月份"  prop="aug" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showPaidDetail(scope.row,'08')">{{scope.row.aug}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="9月份"  prop="sep" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showPaidDetail(scope.row,'09')">{{scope.row.sep}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="10月份"  prop="oct" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showPaidDetail(scope.row,'10')">{{scope.row.oct}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="11月份"  prop="nov" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showPaidDetail(scope.row,'11')">{{scope.row.nov}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="12月份"  prop="dec" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showPaidDetail(scope.row,'12')">{{scope.row.dec}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="合计"  prop="sum" min-width="130" show-overflow-tooltip disabled></el-table-column>
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
        <!--应付明细-->
        <paidDetail v-if="paidDetailDialog" :visible="paidDetailDialog" @close="hidePaidDetail"
                           :currentRowed="currentRows" :actualDepartureStartTime="startActualDepartureTime"
                           :actualDepartureEndTime="endActualDepartureTime"
                           :month="month" :orgCode="orgCode"/>
    </el-container>
</template>

<script>
    import {Http,Api,Common} from 'src/global'
    import axios from 'axios'
    import paidDetail from "./PaidDetailDialog";

    export default {
        components: {paidDetail},
        data() {
            return {
                paidDetailDialog:false,//应收应付明显对话框
                currentRows: null,//操作行的数据
                startActualDepartureTime:'',
                endActualDepartureTime:'',
                month:'',//用来标识月份
                orgCode:'',//用来标识所选大区时，点击合计对应大区
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 20,
                    startActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    orgCode: ''
                },
                isLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true,
                status:true
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 20,
                    startActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    orgCode: ''
                };
            },
            searchList() {//查询
                let vm = this;
                if(!this.searchParam.startActualDepartureTime || !this.searchParam.endActualDepartureTime){
                    return this.$message.warning('请输入时间进行查询！')
                }
                vm.isLoading = true;
                Http.get(Api.noEntryPayReport.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            //显示应付明细对话框
            showPaidDetail(row,month){
                let vm = this;
                vm.orgCode = vm.searchParam.orgCode;//如果查询条件选了大区，就将该大区传入对应合计中去
                vm.currentRows = row;
                vm.month=month;
                vm.paidDetailDialog=true;
                vm.startActualDepartureTime=vm.searchParam.startActualDepartureTime;
                vm.endActualDepartureTime=vm.searchParam.endActualDepartureTime;
            },
            //关闭应付明细对话框
            hidePaidDetail(){
                this.paidDetailDialog=false;
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
                axios.get(Api.noEntryPayReport.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '未录入应付价格报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
