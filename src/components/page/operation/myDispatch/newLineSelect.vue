<template>
    <el-dialog title="线路选择" :visible.sync="visible" width="90%" @close="$emit('close')">
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" auditStatus="PASS" level="lowest"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <el-input v-model="searchParam.lineName" style="display:block"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出发城市:">
                            <district-select v-model="searchParam.departCityCodeList"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达城市:">
                            <district-select v-model="searchParam.destCityCodeList"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addBaseLine">新增</el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border
                      fit highlight-current-row stripe>
                <el-table-column header-align="center" label="客户" prop="customer.name" min-width="140px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="name" min-width="240"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="departStation.name" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="经停站点" prop="lineTransitStationStr" min-width="240"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="destStation.name" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路类型" prop="lineType" min-width="80"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_TYPE"
                                                :value="scope.row.lineType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="业务类型" prop="businessType" min-width="80"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_BUSINESS_TYPE"
                                                :value="scope.row.businessType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="则一时效" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.timeZeyiHour ? scope.row.timeZeyiHour : "0"}}小时</span>
                        <span>{{scope.row.timeZeyiMin ? scope.row.timeZeyiMin : "0"}}分钟</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="里程" prop="distance" min-width="80"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="addToTemp(scope.row,'vehicle')">指派车辆</el-button>
                        <el-button type="text" size="mini" @click="addToTemp(scope.row,'supplier')">指派供应商</el-button>
                        <!--<el-button type="text" size="mini" icon="el-icon-delete" @click="deleteBaseLine(scope.row)">删除</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[6]"
                    :page-size="searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>
        <line-base v-if="showLineBase" type="add" :rowData="rowData" @close="closeLineBase" :is-inside="true"></line-base>
    </el-dialog>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import lineBase from '../Line/LineBase'

    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            currentRow: {
                type: Object,
                default(){
                    return {}
                }
            }
        },
        data() {
            return {
                visible: this.dialogVisible,
                rowData: null,
                showLineBase: false,
                addOrModify: "",
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 6,
                    departCityCodeList: [],
                    destCityCodeList: [],
                    customerCode: '',
                    lineName: '',
                    departCityCode: '',
                    destCityCode: '',
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                }
            }
        },
        components: {
            lineBase
        },
        mounted() {
            //查询表格
            this.searchList();
        },
        methods: {
            //重置
            resetSearchParam() {
                let vm = this;
                vm.searchParam.customerCode = '';
                vm.searchParam.departCityCode = '';
                vm.searchParam.lineName = '';
                vm.searchParam.destCityCode = '';
                vm.searchParam.departCityCodeList = [];
                vm.searchParam.destCityCodeList = [];
            },
            //查询
            searchList() {
                let vm = this;
                if (vm.searchParam.departCityCodeList) {
                    vm.searchParam.departCityCode = vm.searchParam.departCityCodeList[1];
                }
                if (vm.searchParam.destCityCodeList) {
                    vm.searchParam.destCityCode = vm.searchParam.destCityCodeList[1];
                }
                Http.get(Api.tmpLine.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                })
            },
            addBaseLine() {
                this.addOrModify = "add";
                this.showLineBase = true;
            },
            closeLineBase() {
                this.showLineBase = false;
                this.searchList();
            },
            addToTemp(row,type) {
                this.$emit('close', row, type, this.currentRow);
                this.$message.success('线路选择成功！');
            },
            //删除
            deleteBaseLine(row) {
                let vm = this;
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.tmpLine.delete, ids, result => {
                        this.$message.success('删除成功！');
                        vm.searchList();
                    })
                })
            },
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            }
        }
    }
</script>
