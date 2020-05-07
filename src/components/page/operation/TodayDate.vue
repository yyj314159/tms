<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础数据</el-breadcrumb-item>
                <el-breadcrumb-item>工作日</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="年份:">
                            <el-input v-model="searchParam.year" style="display: block;" clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否为工作日:">
                            <dictionary-select v-model="searchParam.workDay" style="display:block" option-name="FLAG"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="查询时间:">
                            <el-date-picker
                                v-model="searchParam.todayDate"
                                value-format="yyyy-MM-dd"
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
                            <el-button type="success" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchList()">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-permission="permission.update" size="small" type="primary" @click="openUpdateWorkDayWin"
            >更 新
            </el-button>
            <el-button v-permission="permission.getPredictAccountTime" size="small" type="primary" @click="openQueryWorkDayWin">查询工作日</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="年份" prop="year" min-width="80"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="日期" prop="todayDate" min-width="80"
                                 show-overflow-tooltip>

                </el-table-column>
                <el-table-column align="center" label="是否工作日" prop="workDay" min-width="80"/>
                <el-table-column align="center" label="星期(数字格式)" prop="dayOfTheWeek" min-width="80"/>
                <el-table-column align="center" label="星期(中文格式)" prop="numOfTheWeek" min-width="80"/>
                <el-table-column align="center" label="创建人" prop="createUser" min-width="120px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="创建时间" prop="createTime" min-width="160px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="修改人" prop="modifyUser" min-width="120px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="修改时间" prop="modifyTime" min-width="160px"
                                 show-overflow-tooltip/>

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
        <!--更新开始时间之后的工作日-->
        <el-dialog title="更新工作日" :visible.sync="updateWorkDayWin" width="1200px" :before-close="handleClose">
            <el-form size="small" :model="updateWorkDaySearchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="选择开始时间:">
                            <el-date-picker type="date" value-format="yyyy-MM-dd"
                                            v-model="updateWorkDaySearchParam.updateStartDate" placeholder="选择开始日期"
                                            :picker-options="pickerBeginDateBefore"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="结束结束时间:">
                            <el-date-picker type="date" value-format="yyyy-MM-dd"
                                            v-model="updateWorkDaySearchParam.updateEndDate" placeholder="选择结束日期"
                                            :picker-options="pickerBeginDateAfter"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="updateWorkDay()">更新
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <!--查询工作日-->
        <el-dialog title="查询工作日" :visible.sync="queryWorkDayWin" width="1200px" :before-close="handleClose">
            <el-form size="small" :model="queryWorkDaySearchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="查询日期:">
                            <date-picker-single v-model="queryWorkDaySearchParam.requestDate"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="多少天后:">
                            <el-input-number v-model="queryWorkDaySearchParam.num" style="display: block;" clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="queryWorkDaySearchList()">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetQueryWorkDaySearch">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-form size="small" :model="queryWorkDaySearchResult" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="返回工作日期:">
                            <label>{{queryWorkDaySearchResult.workDay}}</label>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
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
                queryWorkDayWin: false,//查询工作日
                updateWorkDayWin: false,//更新工作日
                permission: {
                    update: '/todayDate/update',//日期更新
                    getPredictAccountTime: '/todayDate/getPredictAccountTime'//日期查询
                },
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    todayDate: [],
                    todayDateStart: '',
                    todayDateEnd: '',
                    year: '',
                    workDay: '',
                },
                updateWorkDaySearchParam: {//更新开始时间至结束时间工作日
                    updateStartDate: '',
                    updateEndDate: '',
                },
                queryWorkDaySearchParam: {//查询多少天后工作日期
                    requestDate: '',
                    num: '',
                },
                queryWorkDaySearchResult: {//查询多少天后工作日期
                    workDay: '',//返回工作日
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                pickerBeginDateBefore: {
                    disabledDate: (time) => {
                        if (this.updateWorkDaySearchParam.updateEndDate) {
                            return time.getTime() > new Date(this.updateWorkDaySearchParam.updateEndDate).getTime() || time.getTime() < Date.now() - 8.64e7;
                        } else {
                            return time.getTime() < Date.now() - 8.64e7;
                        }
                    }
                },
                pickerBeginDateAfter: {
                    disabledDate: (time) => {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                }
            }
        },
        created() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            this.searchList();
        },
        methods: {
            cloneModel() {
                return _.cloneDeep(this.initializeModel);
            },
            resetSearchParam() {//重置参数
                this.searchParam = this.cloneModel().searchParam;
            },
            resetQueryWorkDaySearch() {//重置查询工作日参数
                this.queryWorkDaySearchParam = this.cloneModel().queryWorkDaySearchParam;
                this.queryWorkDayWin = false;
                this.updateWorkDayWin = false;
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                if (vm.searchParam.todayDate) {
                    vm.searchParam.todayDateStart = vm.searchParam.todayDate[0];
                    vm.searchParam.todayDateEnd = vm.searchParam.todayDate[1];
                } else {
                    vm.searchParam.todayDateStart = "";
                    vm.searchParam.todayDateEnd = "";
                }
                Http.get(Api.todayDate.page, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                })
            },
            queryWorkDaySearchList() {//查询
                let vm = this;
                if (this.queryWorkDaySearchParam.requestDate == '' || this.queryWorkDaySearchParam.num == '') {
                    return this.$message.error("查询时间和查询天数不能为空!!!");
                }
                Http.get(Api.todayDate.getPredictAccountTime, {params: vm.queryWorkDaySearchParam}, result => {
                    this.queryWorkDaySearchResult.workDay = result.result;
                }, () => {
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
            //打开查询工作日接口
            openQueryWorkDayWin() {
                this.queryWorkDayWin = true;
            },
            //打开更新工作日窗口
            openUpdateWorkDayWin() {
                this.updateWorkDayWin = true;
            },
            //关闭查询工作日页面
            handleClose() {
                this.resetSearchParam();
                this.resetQueryWorkDaySearch();
            },
            updateWorkDay() {//更新工作日
                let vm = this;
                let updateStartDate = this.updateWorkDaySearchParam.updateStartDate;
                let updateEndDate = this.updateWorkDaySearchParam.updateEndDate;
                if (updateStartDate == '' || updateEndDate == '') {
                    return this.$message.error("查询开始时间和查询结束时间都不能为空!!!");
                }
                if (Common.date.dateFormat(Common.date.dateFormat(updateStartDate,'yyyy-MM-dd'), Common.date.dateFormat(updateEndDate,'yyyy-MM-dd')) > 99) {
                    return this.$message.error("两个时间差不能大于99天!!!");
                }
                Http.post(Api.todayDate.update, vm.updateWorkDaySearchParam, result => {
                    vm.$message.success("更新成功!!!");
                    this.updateWorkDayWin = false;
                    this.searchList();
                })
            },
        }
    }
</script>

<style scoped>

</style>
