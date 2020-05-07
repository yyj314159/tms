<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础数据</el-breadcrumb-item>
                <el-breadcrumb-item>临时线路</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" level="lowest"
                                             style="display:block"></customer-select>
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
                    <el-col :span="6">
                        <el-form-item label="业务类型:">
                            <dictionary-select v-model="searchParam.businessType"
                                               option-name="LINE_BUSINESS_TYPE"
                                               style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <el-input v-model="searchParam.lineName" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="回单类型:">
                            <dictionary-select v-model="searchParam.receiptType"
                                               option-name="RECEIPT_TYPE"
                                               style="display:block;"></dictionary-select>
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
            <el-button size="mini" v-permission="'/tmpLine/add'" type="primary" icon="el-icon-plus"
                       @click="addBaseLine">新增
            </el-button>
            <el-button v-if="exportLoading" v-permission="'/tmpLine/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-button size="mini" type="primary"  icon="el-icon-check" :disabled="multipleSelection.length==0"
                       @click="changeTmpLine">转合同线路
            </el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center" label="客户" prop="customer.name" show-overflow-tooltip
                                 min-width="150px"></el-table-column>
                <el-table-column header-align="center" label="线路编码" prop="code" min-width="240"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="240" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="clickRow(scope.row)">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="出发城市" prop="departStation.city.name" min-width="80"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="经停城市" prop="lineTransitCityStr" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的城市" prop="destStation.city.name" min-width="80"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="departStation.name" min-width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="经停站点" prop="lineTransitStationStr" min-width="200"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="destStation.name" min-width="150"
                                 show-overflow-tooltip></el-table-column>
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
                <el-table-column header-align="center" label="业务类型" prop="businessType" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_BUSINESS_TYPE"
                                                :value="scope.row.businessType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="回单类型" prop="receiptType" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="RECEIPT_TYPE"
                                                :value="scope.row.receiptType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="业务员" prop="salesmanList" min-width="250" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/tmpLine/modify'" size="mini" icon="el-icon-edit"
                                   @click="modifyBaseLine(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/tmpLine/delete'" size="mini" icon="el-icon-delete"
                                   @click="deleteBaseLine(scope.row)"></el-button>
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

        <!-- 新增线路基本信息弹出框 -->
        <el-dialog class="appendClassStyle" title="线路基本信息" :visible.sync="baseLineDialog" width="850px">
            <el-form size="small" :model="baseLineForm" ref="baseLineForm" label-width="28%">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户:">
                            {{baseLineForm.customer?baseLineForm.customer.name:""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发车时间:">
                            {{baseLineForm.departTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="出发站点:">
                            {{baseLineForm.departStation?baseLineForm.departStation.name:""}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="目的站点:">
                            {{baseLineForm.destStation?baseLineForm.destStation.name:""}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="线路类型:">
                            <dictionary-select-name option-name="LINE_TYPE"
                                                    :value="baseLineForm.lineType"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="营运类型:">
                            <dictionary-select-name option-name="LINE_OPERATION_TYPE"
                                                    :value="baseLineForm.operationType"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="考核方式:">
                            <dictionary-select-name option-name="LINE_EVALUATION_MODE"
                                                    :value="baseLineForm.evaluationMode"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="总里程:">
                            {{baseLineForm.distance}} 公里
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="行驶时间:">
                            {{baseLineForm.timeHour ? baseLineForm.timeHour : 0}}小时
                            {{baseLineForm.timeMin ? baseLineForm.timeMin : 0 }}分钟
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="则一行驶时间:">
                            {{baseLineForm.timeZeyiHour ? baseLineForm.timeZeyiHour : 0}}小时
                            {{baseLineForm.timeZeyiMin ? baseLineForm.timeZeyiMin : 0}}分钟
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="业务类型:">
                            <dictionary-select-name option-name="LINE_BUSINESS_TYPE"
                                                    :value="baseLineForm.businessType"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="回单类型:">
                            <dictionary-select-name option-name="RECEIPT_TYPE"
                                                    :value="baseLineForm.receiptType"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="业务员:">
                            {{baseLineForm.salesmanList}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-table style="margin:0 0 25px 5%; width:90%" size="small" class="content-table"
                          :data="baseLineForm.stationInfoList" border>
                    <el-table-column align="center" label="经停站点" prop="transitStationName"></el-table-column>
                    <el-table-column align="center" label="里程">
                        <template slot-scope="scope">
                            <span>{{scope.row.distance}}公里</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="行驶时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.travelTimeHour ? scope.row.travelTimeHour : "0"}}小时</span>
                            <span>{{scope.row.travelTimeMin ? scope.row.travelTimeMin : "0"}}分钟</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="则一行驶时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.travelTimeZeyiHour ? scope.row.travelTimeZeyiHour : "0"}}小时</span>
                            <span>{{scope.row.travelTimeZeyiMin ?scope.row.travelTimeZeyiMin : "0"}}分钟</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </el-dialog>

        <line-base v-if="showLineBase" :type="addOrModify" :rowData="rowData" @close="closeLineBase"></line-base>

    </el-container>
</template>

<script>
    import {Api,Common,Http} from 'src/global'
    import lineBase from './LineBase'
    import axios from 'axios'

    export default {
        data() {
            return {
                Common:Common,
                //导出
                exportLoading: true,
                rowData: null,
                showLineBase: false,
                baseLineDialog: false,
                addOrModify: "",
                multipleSelection: [],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    departCityCodeList: [],
                    destCityCodeList: [],
                    customerCode: '',
                    departCityCode: '',
                    destCityCode: '',
                    businessType: '',
                    receiptType: '',
                    lineName:''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                baseLineForm: {
                    customer: {
                        code: '',
                        name: ''
                    },
                    departStation: {
                        code: '',
                        name: ''
                    },
                    destStation: {
                        code: '',
                        name: ''
                    },
                    departStationCode: '',
                    departTime: '',
                    operationType: '',
                    evaluationMode: '',
                    businessType:'',
                    receiptType:'',
                    lineType: '',
                    distance: '',
                    stationInfoList: []
                },
                tableHeight: window.innerHeight > 800 ? 500 : null
            }
        },
        components: {
            lineBase,
        },
        mounted() {
            //查询表格
            this.searchList();
        },
        methods: {
            // 导出
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 20000;
                searchExportParam.currentPage = 1;
                axios.get(Api.tmpLine.export, {params: searchExportParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '临时线路报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            //重置
            resetSearchParam() {
                let vm = this;
                vm.searchParam.customerCode = '';
                vm.searchParam.departCityCode = '';
                vm.searchParam.destCityCode = '';
                vm.searchParam.departCityCodeList = [];
                vm.searchParam.destCityCodeList = [];
                vm.searchParam.businessType = '';
                vm.searchParam.lineName = '';
                vm.searchParam.receiptType = '';
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
                Http.get(Api.tmpLine.tmpPage, {params: vm.searchParam}, result => {
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
            //回显
            modifyBaseLine(row) {
                let vm = this;
                vm.addOrModify = "modify";
                vm.rowData = row;
                vm.showLineBase = true;
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
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            clickRow(row) {
                Http.get(Api.line.queryDetailById, {params: {'id': row.id}}, result => {
                    this.baseLineForm = result.result;
                    this.baseLineDialog = true;
                })
            },
            changeTmpLine(){
                let vm = this;
                var ids = [];
                vm.multipleSelection.forEach((item) => {
                    ids.push(item.id);
                })
                this.$confirm('是否将临时线路转成合同线路, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.tmpLine.changeTmpLine, ids, result => {
                        this.$message.success('转合同线路成功！');
                        this.searchList();
                    })
                })
            }

        }
    }
</script>

