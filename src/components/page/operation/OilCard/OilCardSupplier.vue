<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 设备管理</el-breadcrumb-item>
                <el-breadcrumb-item>油卡平台</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="类型:">
                            <dictionary-select filterable option-name="TYPE_OF_COMPANY" style="width:100%;"
                                               v-model="searchParam.belongType"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierId" style="display: block;"></supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属公司:">
                            <el-input v-model="searchParam.name" style="display: block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float:right;">
                            <el-button v-permission="'/oilCardSupplier/query'" type="success" icon="el-icon-search"
                                       @click="searchOilCardSupplierList">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetoilCardSupplierSearchForm">
                                &nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <div style="display: inline-flex;">
                <el-button size="mini" v-permission="'/oilCardSupplier/add'" type="primary" icon="el-icon-plus"
                           @click="addNewOilCardSupplier">新增
                </el-button>
                <el-button v-if="btnLoading" v-permission="'/oilCardRecharge/export'" icon="el-icon-download"
                           type="primary" size="mini" @click="exportExcel">导出
                </el-button>
                <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
                </el-button>
            </div>
            <el-table class="content-table" v-loading="isLoading" element-loading-text="拼命加载中"
                      :data="searchResult.result"
                      border fit
                      highlight-current-row stripe
                      size="small">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="类型" prop="belongType" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="TYPE_OF_COMPANY"
                                                v-model="scope.row.belongType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="油卡所属公司" prop="name"></el-table-column>
                <el-table-column label="供应商" prop="supplierName"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteOilCardSupplier(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
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

            <add-oill-card-supplier-dialog v-if="showAddOilCardSupplier" :dialogVisible="showAddOilCardSupplier"
                                           @close="hideAddOilCardSupplier"></add-oill-card-supplier-dialog>
        </el-main>
    </el-container>
</template>

<script>
    import {Api, Common, Http} from 'src/global';
    import axios from 'axios';
    import AddOillCardSupplierDialog from './AddOilCardSupplierDialog';
    import PromptExpectDepartureTimeDialog from "../myDispatch/PromptExpectDepartureTimeDialog";

    export default {
        data() {
            return {
                exportLoading: true,
                Api: Api,
                isLoading: true,
                btnLoading: true,
                showAddOilCardSupplier: false,
                showDepartureTimeDialog: false,
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    name: '',//油卡所属公司
                    supplierName: '',//供应商名称
                    belongTYpe: '',//所属类型
                    supplierId: '',
                    id:''
                },//返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                multipleSelection: []
            }
        },
        created() {
            this.searchOilCardSupplierList();
        },
        components: {
            AddOillCardSupplierDialog,
            PromptExpectDepartureTimeDialog
        },
        computed: {
            auditDataFlag() {
                if (!this.multipleSelection || this.multipleSelection.length == 0) {
                    return true;
                }
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection[i].auditFlag) {
                        return true;
                    }
                }
                return false;
            }
        },
        methods: {
            searchOilCardSupplierList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.oilCardSupplier.page, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                })
            },
            resetoilCardSupplierSearchForm() {
                let vm = this;
                vm.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    name: '',
                    supplierId: '',
                    belongTYpe: '',
                    id:''
                }
            },
            addNewOilCardSupplier() {
                this.showAddOilCardSupplier = true;
            },
            hideAddOilCardSupplier() {
                this.showAddOilCardSupplier = false;
                this.searchOilCardSupplierList();
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchOilCardSupplierList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchOilCardSupplierList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            exportExcel() {
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.oilCardSupplier.page, {params: searchExportParam}, response => {
                    let header = ['类型', '油卡所属公司', '供应商'];
                    let filterVal = [
                        {
                            type: 'dictionary',
                            'code': 'TYPE_OF_COMPANY',
                            'name': 'belongType'
                        },
                        'name', 'supplierName'
                    ];
                    Common.excel.downloadExl(response.result, header, filterVal, "油卡所属公司导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            },
            deleteOilCardSupplier(row) {  //删除线路
                console.log(row)
                let vm = this
                let ids = []
                ids.push(row.id)
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.oilCardSupplier.delete, ids, result => {
                        vm.searchOilCardSupplierList();
                    })
                })

            },
        }
    }
</script>
