<template>
    <el-dialog title="新增线路" :visible.sync="Visible" width="90%" :top="marginTop" @close="close">
        <el-header class="content-header" height="">
            <el-form size="small" :model="addLineSearchForm" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="addLineSearchForm.customerCode"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="addLineSearchForm.lineId" isTmp="0"
                                         style="display: block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出发城市:">
                            <district-select v-model="addLineSearchForm.departCityCodeList"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达城市:">
                            <district-select v-model="addLineSearchForm.destCityCodeList"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float:right;">
                            <el-button type="success" icon="el-icon-search" @click="addLineSearchList">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetAddLineSearchForm">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-table size="small" class="content-table" :data="addLineSearchResult.result"
                      element-loading-text="拼命加载中"
                      border fit
                      highlight-current-row stripe>
                <el-table-column header-align="center" label="客户" prop="customer.name"
                                 min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路编码" prop="code" min-width="280"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="260" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="出发城市" prop="departStation.city.name"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="经停城市" prop="lineTransitCityStr"
                                 min-width="280" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的城市" prop="destStation.city.name"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="departStation.name"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="经停站点" prop="lineTransitStationStr"
                                 min-width="280" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="destStation.name"
                                 min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路类型" prop="lineType" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_TYPE"
                                                :value="scope.row.lineType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="营运类型" prop="operationType" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_OPERATION_TYPE"
                                                :value="scope.row.operationType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="考核方式" prop="evaluationMode" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_EVALUATION_MODE"
                                                :value="scope.row.evaluationMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="发车时间" prop="departTime" min-width="80"></el-table-column>
                <el-table-column header-align="center" label="客户时效" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.timeHour ? scope.row.timeHour : "0"}}小时</span>
                        <span>{{scope.row.timeMin ? scope.row.timeMin : "0"}}分钟</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="则一时效" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.timeZeyiHour ? scope.row.timeZeyiHour : "0"}}小时</span>
                        <span>{{scope.row.timeZeyiMin ? scope.row.timeZeyiMin : "0"}}分钟</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="里程" prop="distance" min-width="80"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-star-off"
                                   @click="addNewLineSubmit(scope.row)">收藏
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChangeAddLine"
                    @current-change="handleCurrentChangeAddLine"
                    :page-sizes="[5]"
                    :page-size="addLineSearchForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="addLineSearchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>
    </el-dialog>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import axios from 'axios';
    import {Loading, Message} from 'element-ui';

    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                Visible: true,
                addLineSearchForm: {//查询参数
                    currentPage: 1,
                    pageSize: 5,
                    auditStatus: "PASS",
                    departCityCodeList: [],
                    destCityCodeList: [],
                    customerCode: '',
                    departCityCode: '',
                    destCityCode: ''
                },
                addLineSearchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: []
            }
        },
        created() {
            this.addLineSearchList();
        },
        computed: {
            marginTop: function () {
                if (document.documentElement.clientHeight > 900) {
                    return "10vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "6vh";
                }
            }
        },
        watch: {
            //监听传入的visible参数
            dialogVisible(val) {
                if (val) {
                    this.Visible = val;
                }
            }
        },
        methods: {
            close() {
                this.Visible = false;
                this.$emit('close');
            },
            addLineSearchList() {    //查询
                let vm = this;
                if (vm.addLineSearchForm.departCityCodeList) {
                    vm.addLineSearchForm.departCityCode = vm.addLineSearchForm.departCityCodeList[1];
                }
                if (vm.addLineSearchForm.destCityCodeList) {
                    vm.addLineSearchForm.destCityCode = vm.addLineSearchForm.destCityCodeList[1];
                }
                Http.get(Api.line.page, {params: vm.addLineSearchForm}, result => {
                    vm.addLineSearchResult.result = result.result;
                    vm.addLineSearchResult.totalCount = result.totalCount;
                    vm.addLineSearchResult.currentPage = result.currentPage;
                    vm.addLineSearchResult.pageSize = result.pageSize;
                })
            },
            //重置
            resetAddLineSearchForm() {     //重置
                this.addLineSearchForm.customerCode = '';
                this.addLineSearchForm.departCityCodeList = [],
                this.addLineSearchForm.destCityCodeList = [],
                this.addLineSearchForm.departCityCode = '',
                this.addLineSearchForm.destCityCode = '',
                this.addLineSearchForm.lineId = '';
            },
            handleSizeChangeAddLine(val) {
                this.addLineSearchForm.pageSize = val;
                this.addLineSearchList();
            },
            handleCurrentChangeAddLine(val) {
                this.addLineSearchForm.currentPage = val;
                this.addLineSearchList();
            },
            addNewLineSubmit(row) { //提交添加线路
                let vm = this;
                //为了解决已收藏客户的问题
                axios.post(Api.lineCollect.add, {lineId: row.id}).then(response => {
                    var result = response.data;
                    if (result.success) {
                        vm.$message.success('线路收藏成功！');
                    } else {
                        if (result.businessException) {
                            if (result.message.indexOf('已经收藏这一条线路') !== -1) {
                                this.$confirm(result.message + "是否继续收藏", '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    Http.post(Api.lineCollect.addLine, {lineId: row.id}, result => {
                                        vm.$message.success('线路收藏成功！');
                                    })
                                })
                            } else {
                                Message({
                                    showClose: true,
                                    message: result.message,
                                    type: 'error'
                                });
                            }
                        } else {
                            console.log(response);
                            Message({
                                showClose: true,
                                message: '系统异常',
                                type: 'error'
                            });
                        }
                    }
                }).catch(reason => {
                    Message({
                        message: reason,
                        type: 'error'
                    });
                })
            }
        }
    }
</script>
