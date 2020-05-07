<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 应收管理</el-breadcrumb-item>
                <el-breadcrumb-item>应收导入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="导入编码:">
                            <el-input v-model="searchParam.importCode" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户全称:">
                            <settlement-customer-select v-model="searchParam.customerName"
                                                        style="display:block"></settlement-customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="导入时间:">
                            <el-date-picker
                                v-model="searchParam.createTime"
                                style="width: 100%"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="账单生成人员:">
                            <!--<all-user-select style="display: block" v-model="searchParam.createUser" ></all-user-select>-->
                            <el-input style="display: block" v-model="searchParam.createUser"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否生成账单:">
                            <dictionary-select style="display: block" option-name="BILL_STATUS" v-model="searchParam.billStatus"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam" size="small">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <!--<a :href="downloadUrl" style="margin-right: 11px"><el-button v-permission="'/receiveImport/templateDownload'" size="mini" type="primary" icon="el-icon-download" >模板下载</el-button></a>-->
            <el-button v-if="downloadLoading" icon="el-icon-download" v-permission="'/receiveImport/templateDownload'" type="primary" size="mini" style="margin-right:4px;" @click="exportList">模板下载</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>下载中...</el-button>
            <el-button size="mini" type="primary" icon="el-icon-upload2" v-permission="'/receiveImport/upload'" @click="importData">导入</el-button>
            <el-button v-if="createBillLoading" size="mini" type="primary" icon="el-icon-check" :disabled="createBillButtonDisabled" v-permission="'/receiveImport/createBill'"
                       @click="createCustomerBill">生成应收对账单
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>生成中...</el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" v-loading="isLoading" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="导入编号" prop="importCode" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="收入主体" prop="incomeSubject" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="客户全称" prop="customerName" min-width="220" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="总记录数" prop="totalCount" min-width="90" show-overflow-tooltip>
                    <template slot-scope="scope">
                         <span v-if='scope.row.totalCount == "0" '>
                           {{scope.row.totalCount}}
                        </span>
                        <span v-else>
                            <el-button type="text" size="mini" style="color: limeGreen" @click="importDetail(scope.row)">{{scope.row.totalCount}}</el-button>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="成功记录数" prop="successCount" min-width="90" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="失败记录数" prop="failCount" min-width="90" show-overflow-tooltip>
                    <template slot-scope="scope">
                         <span v-if='scope.row.failCount == "0" '>
                           {{scope.row.failCount}}
                        </span>
                        <span v-else>
                            <el-button type="text" size="mini" style="color: red" @click="importFailDetail(scope.row)">{{scope.row.failCount}}</el-button>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="结算运费" prop="settlementAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="质量扣款" prop="qualityDeductionsAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="安全扣款" prop="securityDeductionsAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油价补差" prop="oilPriceSupplement" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="其他扣款" prop="otherDeductionsAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际应收" prop="actualReceiveAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="导入时间" prop="createTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="导入人员" prop="createUser" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="是否生成对账单" prop="billStatus" min-width="110" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.billStatus ? "是" : "否"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="160">
                    <template slot-scope="scope">
                        <el-button v-if='scope.row.failCount != "0" ' type="text" size="mini"
                                   style="color: red" v-permission="'/receiveImport/failUpload'"
                                   @click="importFail(scope.row)">失败导入
                        </el-button>
                        <el-button type="text" v-if="!scope.row.billStatus" v-permission="'/receiveImport/modify'"
                                   icon="el-icon-edit" size="mini" @click="modifyReceiveImport(scope.row)"></el-button>
                        <el-button type="text" v-if="!scope.row.billStatus"
                                   icon="el-icon-delete" size="mini" v-permission="'/receiveImport/delete'"
                                   @click="deleteReceiveImport(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="content-pagination">
                <el-pagination @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :page-sizes="[10, 20, 50, 100]"
                               :page-size="searchParam.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="searchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>

        <!-- 导入 -->
        <el-dialog title="导入明细" :visible.sync="importDetailDialog" width="450px">
            <el-form size="small" inline :model="importDetailForm" :rules="importDetailFormRules" ref="importDetailForm"
                     label-width="130px">
                <el-form-item label="收入主体:" prop="incomeSubject">
                    <dictionary-select v-model="importDetailForm.incomeSubject" option-name="LINE_INCOME_SUBJECT"
                                       style="width:220px"></dictionary-select>
                </el-form-item>
                <el-form-item label="客户全称:" prop="customerName">
                    <settlement-customer-select v-model="importDetailForm.customerName"
                                                style="width:220px"></settlement-customer-select>
                </el-form-item>
                <el-form-item label="账单明细:" prop="billDetail">
                    <el-upload
                        id="importStyleId1"
                        action=""
                        :before-upload="beforeUpload1"
                        ref="upload1"
                        accept=".xls"
                        :on-exceed="handleExceed"
                        :limit=1
                        :file-list=fileList1
                        :auto-upload="false">
                        <el-button size="small" type="primary">文件上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="importDetailDialog = false">取 消</el-button>
                <el-button size="small" type="primary" :disabled="saveImportDetailBtn" @click="saveImportDetail('importDetailForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 导入失败数据-->
        <el-dialog title="导入失败明细" :visible.sync="importFailDialog" width="450px">
            <el-form size="small" inline :model="importFailForm" ref="importFailForm" label-width="130px">
                <el-form-item label="失败账单明细:">
                    <el-upload
                        id="importStyleId2"
                        action=""
                        :before-upload="beforeUpload2"
                        ref="upload2"
                        accept=".xls"
                        :on-exceed="handleExceed"
                        :limit=1
                        :file-list=fileList2
                        :auto-upload="false">
                        <el-button size="small" type="primary">文件上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="importFailDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="saveImportFail('importFailForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="importDetailModifyDialog" width="420px">
            <el-form size="small" inline :model="importDetailModifyForm" :rules="importDetailModifyFormRules" ref="importDetailModifyForm"
                     label-width="110px">

                <el-form-item label="收入主体:" prop="incomeSubject">
                    <dictionary-select v-model="importDetailModifyForm.incomeSubject" option-name="LINE_INCOME_SUBJECT"
                                       style="width:220px"></dictionary-select>
                </el-form-item>
                <el-form-item label="客户全称:" prop="customerName">
                    <settlement-customer-select v-model="importDetailModifyForm.customerName"
                                                style="width:220px"></settlement-customer-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="importDetailModifyDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="saveImportDetailModify('importDetailModifyForm')">确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 导入的table-->
        <el-dialog :title=importDetailTitle :visible.sync="importFailDetailDialog" width="70%">
            <el-button v-if="exportLoading" size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table size="small" class="content-table" :data="searchFailResult.result" element-loading-text="拼命加载中"
                      border fit
                      highlight-current-row stripe>
                <el-table-column align="center" label="导入编号" prop="importCode" min-width="150px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="运单号" prop="waybillCode" min-width="150px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="回单号1" prop="returnCodeOne" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="回单号2" prop="returnCodeTwo" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="回单号3" prop="returnCodeThree" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="回单号4" prop="returnCodeFour" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算运费" prop="settlementAmount" min-width="80px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="质量扣款" prop="qualityDeductionsAmount" min-width="80px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="安全扣款" prop="securityDeductionsAmount" min-width="80px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油价补差" prop="oilPriceSupplement" min-width="80px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="其他扣款" prop="otherDeductionsAmount" min-width="80px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="客户车牌号" prop="customerLicenseNumber" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="客户挂箱号" prop="customerTrailer" min-width="100px" show-overflow-tooltip></el-table-column>
            </el-table>
            <div style="height:45px" v-if="importFailDetailDialog">
                <div class="content-pagination">
                    <el-pagination @size-change="handleSizeChangeFail"
                                   @current-change="handleCurrentChangeFail"
                                   :page-sizes="[10, 20, 50, 100]"
                                   :page-size="searchFailParam.pageSize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="searchFailResult.totalCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import axios from 'axios';

    export default {
        data() {
            return {
                downloadLoading: true,
                exportLoading: true,
                createBillLoading: true,
                tmpFailFlag: false,
                saveImportDetailBtn:false,
                tmpImportCode: "",
                fileList1: [],
                fileList2: [],
                importDetailTitle: "",
                multipleSelection: [],
                isLoading:true,
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    importCode: '',
                    customerName: '',
                    createTime: [],
                    createUser:'',
                    billStatus:''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                //查询参数
                searchFailParam: {
                    currentPage: 1,
                    pageSize: 10,
                    importCode: '',
                    failFlag: false
                },
                //返回结果
                searchFailResult: {
                    totalCount: 0,
                    result: []
                },
                importDetailDialog: false,
                importDetailForm: {
                    incomeSubject: '马鞍山则一物流有限公司',
                    customerName: ''
                },
                importDetailModifyDialog: false,
                importDetailModifyForm: {
                    incomeSubject: '',
                    customerName: ''
                },
                importFailDetailDialog: false,
                importFailDetailList: [],
                importFailDialog: false,
                importFailForm: {
                    id: ''
                },
                importDetailFormRules: {
                    incomeSubject: [
                        {required: true, message: '请输入收入主体', trigger: 'blur'}
                    ],
                    customerName: [
                        {required: true, message: '请输入客户全称', trigger: 'blur'}
                    ]
                },
                importDetailModifyFormRules: {
                    incomeSubject: [
                        {required: true, message: '请输入收入主体', trigger: 'blur'}
                    ],
                    customerName: [
                        {required: true, message: '请输入客户全称', trigger: 'blur'}
                    ]
                }
            }
        },
        computed: {
            createBillButtonDisabled(){
                return this.multipleSelection.length !== 1;
            }
        },
        mounted() {
            //查询表格
            this.searchList();
        },
        methods: {
            resetSearchParam() {
                let vm = this;
                vm.searchParam.importCode = '';
                vm.searchParam.customerName = '';
                vm.searchParam.createTime = [];
                vm.searchParam.createUser = '';
                vm.searchParam.billStatus = '';
            },
            searchList() {
                let vm = this;
                if (vm.searchParam.createTime) {
                    vm.searchParam.createStartTime = vm.searchParam.createTime[0];
                    vm.searchParam.createEndTime = vm.searchParam.createTime[1];
                } else {
                    vm.searchParam.createStartTim = "";
                    vm.searchParam.createEndTime = "";
                }
                vm.isLoading = true;
                Http.get(Api.receiveImport.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = 1;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            searchFailList(){
                let vm = this;
                Http.get(Api.receiveImport.queryFailByImportCode, {params: vm.searchFailParam}, response => {
                    vm.searchFailResult.result = response.result;
                    vm.searchFailResult.totalCount = response.totalCount;
                })
            },
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                vm.searchList();
            },
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                vm.searchList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChangeFail(val) {
                let vm = this;
                vm.searchFailParam.pageSize = val;
                vm.searchFailList();
            },
            handleCurrentChangeFail(val) {
                let vm = this;
                vm.searchFailParam.currentPage = val;
                vm.searchFailList();
            },
            templateDownload() {
                Common.excel.downloadExl([], ["回单号1", "回单号2", "回单号3", "回单号4",
                    "结算运费", "质量扣款", "安全扣款", "油价补差", "其他扣款"], null, '应收导入模板');
            },
            resetImportDetailForm() {
                let vm = this;
                vm.importDetailForm = {
                    incomeSubject: '',
                    customerName: ''
                }
            },
            modifyReceiveImport(row) {
                let vm = this;
                Http.get(Api.receiveImport.queryById, {params: {'id': row.id}}, response => {
                    vm.importDetailModifyForm = response.result;
                    vm.importDetailModifyDialog = true;
                })
            },
            deleteReceiveImport(row) {
                let vm = this;
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.receiveImport.delete, {'id': row.id}, response => {
                        vm.searchList();
                    })
                })
            },
            saveImportDetailModify(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.receiveImport.modify, vm.importDetailModifyForm, response => {
                            vm.importDetailModifyDialog = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            importFailDetail(row) {
                let vm = this;
                vm.importDetailTitle = "导入失败明细";
                vm.tmpImportCode = row.importCode;
                vm.tmpFailFlag = true;
                vm.searchFailParam.importCode = row.importCode;
                vm.searchFailParam.failFlag = true;
                vm.searchFailParam.currentPage = 1;
                Http.get(Api.receiveImport.queryFailByImportCode, {params: vm.searchFailParam}, response => {
                    vm.searchFailResult.result = response.result;
                    vm.searchFailResult.totalCount = response.totalCount;
                    vm.importFailDetailDialog = true;
                })
            },
            importDetail(row) {
                let vm = this;
                vm.importDetailTitle = "导入明细";
                vm.tmpImportCode = row.importCode;
                vm.tmpFailFlag = false;
                vm.searchFailParam.importCode = row.importCode;
                vm.searchFailParam.failFlag = false;
                vm.searchFailParam.currentPage = 1;
                Http.get(Api.receiveImport.queryFailByImportCode, {params: vm.searchFailParam}, response => {
                    vm.searchFailResult.result = response.result;
                    vm.searchFailResult.totalCount = response.totalCount;
                    vm.importFailDetailDialog = true;
                })
            },
            createCustomerBill() {
                if (this.multipleSelection && this.multipleSelection.length == 0) {
                    this.$message('请选择一条需要生成应收对账结算单的数据');
                    return;
                }
                if (this.multipleSelection.length != 1) {
                    this.$message('只能选择一条数据');
                    return;
                }
                let row = this.multipleSelection[0];
                if (row.billStatus) {
                    this.$message('该结算账单已生成');
                    return;
                }
                if (row.failCount != "0") {
                    this.$message('成功导入的才能生成对账单');
                    return;
                }

                // var ids = [];
                // for (let i = 0; i < vm.multipleSelection.length; i++) {
                //     if (vm.multipleSelection[0].incomeSubject != vm.multipleSelection[i].incomeSubject ||
                //         vm.multipleSelection[0].customerName != vm.multipleSelection[i].customerName) {
                //         this.$message('只有收入主体与客户全称相同才能生成账单');
                //         return;
                //     }
                //     if (vm.multipleSelection[i].billStatus) {
                //         this.$message('该结算账单已生成');
                //         return;
                //     }
                //     if (vm.multipleSelection[i].failCount != "0") {
                //         this.$message('需要全部成功才能生成对账单');
                //         return;
                //     }
                //     ids.push(vm.multipleSelection[i].id);
                // }
                this.$confirm('是否生成应收对账结算单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.createBillLoading = false;
                    Http.post(Api.receiveImport.createBill, {'id': row.id}, response => {
                        if (response.success) {
                            this.$message({
                                message: '生成应收对账结算单成功',
                                type: 'success'
                            });
                        }
                        this.createBillLoading = true;
                        this.searchList();
                    }, () => {
                        this.createBillLoading = true;
                    })
                })
            },
            importData() {
                let vm = this;
                this.fileList1 = [];
                vm.importDetailDialog = true;
            },
            saveImportDetail(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$refs.upload1.submit();
                    }
                });
            },
            //文件超出个数限制时的钩子
            handleExceed() {
                this.$message.warning(`已经选择 1 个文件`);
            },
            //上传文件之前的钩子(利用before-upload属性,将其他数据绑定上去,主要是拿到file)
            beforeUpload1(file) {
                let vm = this;
                vm.saveImportDetailBtn = true;
                let formData = new FormData();
                formData.append('incomeSubject', vm.importDetailForm.incomeSubject);
                formData.append('customerName', vm.importDetailForm.customerName);
                formData.append('failFlag', false);
                formData.append('file', file);

                axios.post(Api.receiveImport.upload, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    var result = response.data;
                    if (result.success) {
                        vm.searchList();
                        vm.importDetailDialog = false;
                        vm.saveImportDetailBtn = false;
                        vm.resetImportDetailForm();
                    } else {
                        if (result.businessException) {
                            this.$message({
                                showClose: true,
                                message: result.message,
                                type: 'error'
                            });
                        } else {
                            console.log(response);
                            this.$message({
                                showClose: true,
                                message: '系统异常',
                                type: 'error'
                            });
                        }
                        vm.saveImportDetailBtn = false;
                    }

                })
            },
            importFail(row) {
                let vm = this;
                vm.fileList2 = [];
                vm.importFailForm.id = row.id;
                vm.importFailDialog = true;
            },
            saveImportFail(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$refs.upload2.submit();
                    }
                });
            },
            beforeUpload2(file) {
                let vm = this;
                let formData = new FormData();
                formData.append('id', vm.importFailForm.id);
                formData.append('failFlag', true);
                formData.append('file', file);

                axios.post(Api.receiveImport.upload, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    var result = response.data;
                    if (result.success) {
                        vm.searchList();
                        vm.importFailDialog = false;
                    } else {
                        if (result.businessException) {
                            this.$message({
                                showClose: true,
                                message: result.message,
                                type: 'error'
                            });
                        } else {
                            console.log(response);
                            this.$message({
                                showClose: true,
                                message: '系统异常',
                                type: 'error'
                            });
                        }
                    }
                })
            },
            exportList(){
                let vm = this;
                vm.downloadLoading = false;
                axios.get(Api.receiveImport.templateDownload, {responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '应收导入模板.xls';
                    link.click();
                    vm.downloadLoading = true;
                }).catch(reason => {
                    vm.downloadLoading = true;
                })
            },
            exportData() {
                let vm = this;
                vm.exportLoading = false;
                let searchExportParam = {};
                searchExportParam.importCode = vm.tmpImportCode;
                searchExportParam.failFlag = vm.tmpFailFlag;
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.receiveImport.queryFailByImportCode, {params: searchExportParam}, response => {
                    let header = ['导入编号','运单号', "回单号1", "回单号2", "回单号3", "回单号4",
                        "结算运费", "质量扣款", "安全扣款", "油价补差", "其他扣款","客户车牌号","客户挂箱号"
                    ];
                    let filterVal = ['importCode','waybillCode', 'returnCodeOne', 'returnCodeTwo', 'returnCodeThree', 'returnCodeFour',
                        'settlementAmount', 'qualityDeductionsAmount', 'securityDeductionsAmount',
                        'oilPriceSupplement', 'otherDeductionsAmount','customerLicenseNumber','customerTrailer'
                    ];
                    Common.excel.downloadExl(response.result, header, filterVal, vm.tmpFailFlag ? "导出失败记录数据" : "导出总记录数据");
                    vm.exportLoading = true;
                },()=>{
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
<style>
    #importStyleId1 .el-upload--text {
        border: 0;
        width: auto;
        height: auto;
    }

    #importStyleId2 .el-upload--text {
        border: 0;
        width: auto;
        height: auto;
    }
</style>
