<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 应付管理</el-breadcrumb-item>
                <el-breadcrumb-item>供应商账单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form :model="searchParam" label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="账单编号:">
                            <el-input v-model="searchParam.code"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierId" style="display: block;" level="top"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="账单开始时间:">
                            <date-picker-single v-model="searchParam.generatedBillsStartTime" date-type="start"
                                                :end-date="searchParam.generatedBillsEndTime"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="账单结束时间:">
                            <date-picker-single v-model="searchParam.generatedBillsEndTime" date-type="end"
                                                :start-date="searchParam.generatedBillsStartTime"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发票号:">
                            <el-input v-model="searchParam.invoiceNo"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="开票月份:">
                            <el-date-picker v-model="searchParam.invoiceMonth" style="width:100%;" type="month"
                                            value-format="yyyy-MM" placeholder="选择开票月份"
                                            :picker-options="monthLimit"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label-width="0" style="float: right">
                            <el-button type="success" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetSearchParam" size="small">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" size="mini" type="primary" v-permission="permission.export" icon="el-icon-download" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary" ><i
                class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <!--列表-->
            <el-table class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      border fit
                      @selection-change="handleSelectionChange"
                      highlight-current-row stripe
                      size="small">
                <el-table-column type="selection" width="40"/>
                <el-table-column align="center" label="账单编号" prop="code" min-width="180px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showDetails(scope.row.code)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="供应商" prop="supplierName" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="结算运费" prop="settlementAmount" min-width="120px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="时效扣款" prop="timeFineAmount" min-width="120px"
                                 how-overflow-tooltip/>
                <el-table-column align="center" label="线路管理费" prop="lineAmount" min-width="120px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="开票金额" prop="invoiceAmount" min-width="120px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="发票号" prop="invoiceNo" min-width="200px" show-overflow-tooltip/>
                <el-table-column align="center" label="开票月份" prop="invoiceMonth" min-width="150px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="备注" prop="remark" min-width="200px" show-overflow-tooltip/>
                <el-table-column align="center" label="账单生成人" prop="billGenerationUser" min-width="150px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="账单生成时间" prop="billGenerationTime" min-width="150px"
                                 show-overflow-tooltip/>
                <el-table-column label="操作" header-align="center" align="center" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini"
                                   @click="modifySupplierBillDialog(scope.row)"
                                   v-permission="permission.modify"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini"
                                   @click="deleteSupplierBillDialog(scope.row.id)"
                                   v-permission="permission.delete"></el-button>
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
        </el-main>

        <el-dialog title="开票信息" :visible.sync="supplierBillInvoiceDialog" width="500px">
            <el-form size="small" :model="supplierBillInvoiceForm" label-width="80px"
                     :rules="supplierBillInvoiceFormRules" ref="supplierBillInvoiceForm">
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="发票号:">
                            <el-input v-model="supplierBillInvoiceForm.invoiceNo"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="23">
                        <el-form-item label="开票月份:">
                            <el-date-picker v-model="supplierBillInvoiceForm.invoiceMonth" style="width:100%;"
                                            type="month"
                                            value-format="yyyy-MM" placeholder="选择开票月份"
                                            :picker-options="monthLimit"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="23">
                        <el-form-item label="备注:">
                            <el-input type="textarea" :rows="3" v-model="supplierBillInvoiceForm.remark"
                                      style="width:100%;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="supplierBillInvoiceDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyFormSubmit">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="供应商账单明细" :visible.sync="billDetailDialog" width="80%">
            <el-button v-if="exportDetailLoading" size="mini" type="primary" icon="el-icon-download"
                       @click="exportBillDetail">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <!--列表-->
            <el-table class="content-table" :data="searchDetailResult.result"
                      element-loading-text="拼命加载中"
                      height="400px"
                      border fit
                      highlight-current-row stripe
                      size="small">
                <el-table-column align="center" label="运单编号" prop="waybillCode" min-width="120px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="供应商" prop="supplierName" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="客户名称" prop="customerName" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="大区" prop="regionName" min-width="120px"/>
                <el-table-column align="center" label="分区" prop="belongOrgName" min-width="120px"/>
                <el-table-column align="center" label="线路名称" prop="lineName" min-width="250px" show-overflow-tooltip/>
                <el-table-column align="center" label="车牌号" prop="vehicleLicenseNum" min-width="120px"/>
                <el-table-column align="center" label="应付运费" prop="paidVehicleAmount" min-width="120px"/>
                <el-table-column align="center" label="调整金额" prop="adjustAmount" min-width="120px"/>
                <el-table-column align="center" label="结算运费" prop="settlementAmount" min-width="120px"/>
                <el-table-column align="center" label="时效扣款" prop="timeFineAmount" min-width="120px"/>
                <el-table-column align="center" label="线路管理费" prop="lineAmount" min-width="120px"/>
                <el-table-column align="center" label="开票金额" prop="invoiceAmount" min-width="120px"/>
                <el-table-column align="center" label="实际发车时间" prop="actualDepartureTime" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="实际到达时间" prop="confirmArrivalTime" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="签收时间" prop="signTime" min-width="200px" show-overflow-tooltip/>
            </el-table>
            <div style="height: 50px" v-if="billDetailDialog">
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChangeDetail"
                        @current-change="handleCurrentChangeDetail"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="searchDetailParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchDetailResult.totalCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http, Api, Common} from 'src/global'
    import axios from 'axios'

    export default {
        data() {
            return {
                permission: { //权限
                    add: '/supplierBill/add',
                    modify: '/supplierBill/modify',
                    delete: '/supplierBill/delete',
                    export: '/supplierBill/export'
                },
                monthLimit: {
                    disabledDate(time) {
                        return time > new Date()
                    }
                },
                exportLoading: true,
                exportDetailLoading: true,
                multipleSelection: [],

                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    code: '',
                    supplierId: '',
                    invoiceNo: '',
                    invoiceMonth: '',
                    generatedBillsStartTime: '',
                    generatedBillsEndTime: '',
                    waybillCode: ''
                },
                searchDetailParam: {
                    currentPage: 1,
                    pageSize: 10
                },
                supplierBillInvoiceForm: {
                    id: '',
                    invoiceNo: '',
                    invoiceMonth: '',
                    remark: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                //返回结果
                searchDetailResult: {
                    totalCount: 0,
                    result: []
                },
                billDetailDialog: false,//账单明细winShow
                supplierBillInvoiceDialog: false,

                supplierBillInvoiceFormRules: {
                    invoiceNo: [
                        {required: true, message: '请输入编号', trigger: 'blur'},
                        {min: 1, max: 100, message: '编号最长50个字符', trigger: 'blur'}
                    ],
                    invoiceMonth: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ]
                },
            }
        },
        mounted() {
            //查询表格
            this.searchList();
        },
        methods: {
            resetSearchParam() { //重置参数
                this.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    code: '',
                    supplierId: '',
                    invoiceNo: '',
                    invoiceMonth: '',
                    generatedBillsStartTime: '',
                    generatedBillsEndTime: '',
                    waybillCode: ''
                }
            },
            searchList() {
                Http.get(Api.supplierBill.page, {params: this.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize
                })
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val
                this.searchList()
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val
                this.searchList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            handleSizeChangeDetail(val) {
                let vm = this;
                vm.searchDetailParam.pageSize = val;
                this.searchDetailList();
            },
            handleCurrentChangeDetail(val) {
                let vm = this;
                vm.searchDetailParam.currentPage = val;
                this.searchDetailList();
            },
            //通过ID回显数据(修改)
            modifySupplierBillDialog(row) {
                let vm = this;
                Http.get(Api.supplierBill.queryById, {params: {'id': row.id}}, result => {
                    vm.supplierBillInvoiceForm = result.result;
                    vm.supplierBillInvoiceDialog = true;
                })
            },
            modifyFormSubmit() {
                let vm = this;
                vm.$refs.supplierBillInvoiceForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.supplierBill.modify, vm.supplierBillInvoiceForm, result => {
                            this.$message.success('修改成功！');
                            this.searchList();
                            vm.supplierBillInvoiceDialog = false;
                        })
                    }
                })
            },
            deleteSupplierBillDialog(id) {
                this.$confirm('是否删除供应商账单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.supplierBill.delete, [id], response => {
                        this.$message.success("删除成功");
                        this.searchList();
                    })
                })
            },
            showDetails(billCode) {
                let vm = this;
                vm.searchDetailParam.billCode = billCode;
                vm.searchDetailParam.currentPage = 1;
                Http.get(Api.supplierBill.detailPage, {params: vm.searchDetailParam}, response => {
                    vm.searchDetailResult.result = response.result;
                    vm.searchDetailResult.totalCount = response.totalCount;
                    vm.billDetailDialog = true;
                })
            },
            searchDetailList() {
                let vm = this;
                Http.get(Api.supplierBill.detailPage, {params: vm.searchDetailParam}, response => {
                    vm.searchDetailResult.result = response.result;
                    vm.searchDetailResult.totalCount = response.totalCount;
                })
            },
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.supplierBill.page, {params: searchExportParam}, response => {
                    let header = ['账单编号', '供应商', '结算运费', '时效扣款', '线路管理费', '开票金额', '发票号', '开票月份', '备注', '账单生成人', '账单生成时间'];
                    let filterVal = ['code', 'supplierName', 'settlementAmount', 'timeFineAmount', 'lineAmount', 'invoiceAmount', 'invoiceNo',
                        'invoiceMonth', 'remark', 'billGenerationUser', 'billGenerationTime'
                    ];
                    Common.excel.downloadExl(response.result, header, filterVal, "新供应商账单导出");
                    vm.exportLoading = true;
                }, () => {
                    vm.exportLoading = true;
                })
            },
            exportBillDetail() {
                let vm = this;
                vm.exportDetailLoading = false;
                axios.get(Api.supplierBill.detailExport, {
                    params: vm.searchDetailParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '供应商账单明细导出.xls';
                    link.click();
                    vm.exportDetailLoading = true;
                }).catch(reason => {
                    vm.exportDetailLoading = true;
                })
            },
        }
    }
</script>

