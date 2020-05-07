<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 合作应付</el-breadcrumb-item>
                <el-breadcrumb-item>金融车价格导入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="导入编号:">
                            <el-input v-model="searchParam.code" size="small"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" >
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode" size="small"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="导入时间:">
                            <el-date-picker
                                v-model="searchParam.importTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" >
                        <el-form-item label="是否生效:">
                            <dictionary-select style="display: block" option-name="VALID_FLAG" v-model="searchParam.valid"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam" size="small">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <div style="display: inline-flex;">
                <el-button size="mini" type="primary" icon="el-icon-download" @click="exportData"
                           v-permission="permission.exportDataPermission">模板下载
                </el-button>
                <el-button size="mini" type="primary" icon="el-icon-download" @click="outsourceDeductionExport" >导出
                </el-button>
                <upload-excel :importUrl="api.upload" @success="uploadSuccess" style="margin: 0 10px 0 10px;"/>
            </div>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row >
                <el-table-column type="selection" width="40"/>
                <el-table-column header-align="center" label="导入编号" prop="code" min-width="120px"/>
                <el-table-column header-align="center" label="运单号" prop="waybillCode" min-width="120px"/>
                <el-table-column header-align="center" label="金额" prop="importMoney" min-width="160px"/>
                <el-table-column header-align="center" label="导入人员" prop="createUser" min-width="160px"/>
                <el-table-column header-align="center" label="导入时间" prop="createTime" min-width="160px"/>
                <el-table-column header-align="center" label="导入备注" prop="importRemark" min-width="120px"/>
                <el-table-column header-align="center" label="是否有效" prop="valid" min-width="120px">
                    <template slot-scope="scope">
                        {{ scope.row.valid?"生效" :"失效"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" min-width="160px"/>
                <el-table-column header-align="center" label="修改时间" prop="modifyTime" min-width="160px"/>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchResult.totalCount"/>
            </div>
        </el-main>
    </el-container>
</template>
<script>
    import {Http, Api, Common,Constant} from 'src/global'
    import {Validate} from 'src/global/validate'
    export default {
        data() {
            let permission = {
                exportData: '/financialPriceRecord/exportData',
                export: '/financialPriceRecord/export',
                import: '/financialPriceRecord/import'
            };
            return {
                initializeModel: {},
                exportLoading:true,
                api: Api.financialPriceRecord,
                permission: permission,
                multipleSelection: [],
                Validate:Validate,
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    code:'',
                    valid:'',
                    waybillCode:'',
                    importTime:'',
                    importStartTime:'',
                    importEndTime:'',
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                }
            }
        },
        mounted() {
            //查询表格
            this.searchList();
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
        },
        watch: {
            multipleSelection(val) {
                let _this = this;
                if (val) {
                    _this.buttonClick.confirmChargeButton = val.length < 1;
                    _this.buttonClick.uploadDetail = val.length != 1
                }
            }
        },
        methods: {
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            resetSearchParam() {
                let _this = this;
                _this.searchParam = _this.cloneMode().searchParam
            },
            searchList() {
                let _this = this;
                if (_this.searchParam.importTime) {
                    _this.searchParam.importStartTime = _this.searchParam.importTime[0];
                    _this.searchParam.importEndTime = _this.searchParam.importTime[1];
                }else{
                    _this.searchParam.importStartTime = '';
                    _this.searchParam.importEndTime = '';
                }
                Http.get(Api.financialPriceRecord.page, {params: _this.searchParam}, result => {
                    _this.searchResult.result = result.result;
                    _this.searchResult.totalCount = result.totalCount;
                    _this.searchParam.currentPage = result.currentPage;
                    _this.searchParam.pageSize = result.pageSize;
                })
            },
            handleSizeChange(val) {
                let _this = this;
                _this.searchParam.pageSize = val;
                _this.searchList();
            },
            handleCurrentChange(val) {
                let _this = this;
                _this.searchParam.currentPage = val;
                _this.searchList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            outsourceDeductionExport(){
                let _this = this;
                _this.exportLoading = false;
                Common.excel.reportExcel(Api.financialPriceRecord.export,_this.searchParam,"金融车价格导出.xls")
            },
            exportData() {
                Common.excel.downloadExl([], ["运单号","金额","备注"], null, '金融价格导入记录');
            },
            uploadSuccess() {
                let vm = this;
                vm.searchList();
            },
        }
    }
</script>

