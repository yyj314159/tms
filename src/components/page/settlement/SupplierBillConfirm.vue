<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 应付管理</el-breadcrumb-item>
                <el-breadcrumb-item>供应商确认</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-main class="content-main">
            <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="查询运单" name="first">
                    <el-header class="content-header" height="">
                        <el-form size="small" :model="searchParam" label-width="120px">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="供应商:">
                                        <supplier-select v-model="searchParam.supplierCode"
                                                         placeholder="请输入供应商"
                                                         type="PLANTFORM_COMPANY"
                                                         style="display: block"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <!--<el-form-item label="运单号:">
                                        <el-input v-model="searchParam.waybillCode"></el-input>
                                    </el-form-item>-->

                                    <el-form-item label="运单编码:">
                                        <el-input type="text" v-model="searchParam.waybillCode" :clearable="true"
                                                  placeholder="请输入运单编码" style="min-width:200px">
                                            <template slot="append">
                                                <el-popover
                                                    placement="bottom"
                                                    width="98%"
                                                    trigger="click">
                                                    <div style="width: 200px;">
                                                        <el-input type="textarea"
                                                                  :autosize="{ minRows: 6, maxRows: 8}" resize="none"
                                                                  v-model="searchParam.batchSelect"
                                                                  placeholder="最多输入1000个号,进行查询。按ENTER键进行换行或者使用英文逗号隔开,按重置按钮进行清空"></el-input>
                                                    </div>
                                                    <el-button slot="reference" style="width:2%;">批量查询</el-button>
                                                </el-popover>
                                            </template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="到达开始时间:">
                                        <date-picker-single v-model="searchParam.confirmArrivalStartTime"
                                                            date-type="start"
                                                            :end-date="searchParam.confirmArrivalEndTime"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="到达结束时间:">
                                        <date-picker-single v-model="searchParam.confirmArrivalEndTime"
                                                            date-type="end"
                                                            :start-date="searchParam.confirmArrivalStartTime"/>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="是否确认运单:">
                                        <dictionary-select v-model="searchParam.confirmStatus" option-name="IS_EXIST"
                                                           style="display:block"></dictionary-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="是否生成账单:">
                                        <dictionary-select v-model="searchParam.billStatus" option-name="IS_EXIST"
                                                           style="display:block"></dictionary-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" style="float: right">
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
                        <el-row>
                            <el-button v-if="exportLoading" icon="el-icon-download" v-permission="'/supplierBillConfirm/searchWaybillExport'" type="primary" size="mini" @click="exportList">导出</el-button>
                            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
                            <el-button type="primary" size="mini" icon="el-icon-tickets" v-permission="'/supplierBillConfirm/billConfirm'"
                                       :disabled="!multipleSelection.length>0" @click="supplierBillConfirm">确认账单
                            </el-button>
                            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                                      element-loading-text="拼命加载中"
                                      @selection-change="handleSelectionChange"
                                      border fit highlight-current-row stripe :height="tableHeight">
                                <el-table-column type="selection" min-width="40"/>
                                <el-table-column align="center" label="运单编号" prop="waybillCode" min-width="120px" fixed/>
                                <el-table-column align="center" label="确认状态" prop="confirmStatus" min-width="120px" show-overflow-tooltip/>
                                <el-table-column align="center" label="账单状态" prop="billStatus" min-width="120px" show-overflow-tooltip/>
                                <el-table-column align="center" label="供应商" prop="supplierName" min-width="200px" show-overflow-tooltip/>
                                <el-table-column align="center" label="客户名称" prop="customerName" min-width="200px" show-overflow-tooltip/>
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
                                <el-table-column align="center" label="实际发车时间" prop="actualDepartureTime" min-width="200px" show-overflow-tooltip/>
                                <el-table-column align="center" label="实际到达时间" prop="confirmArrivalTime" min-width="200px" show-overflow-tooltip/>
                                <el-table-column align="center" label="签收时间" prop="signTime" min-width="200px" show-overflow-tooltip/>
                            </el-table>
                            <div class="content-pagination">
                                <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :page-sizes="[10, 50, 300, 1000]"
                                    :page-size="searchParam.pageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="searchResult.totalCount">
                                </el-pagination>
                            </div>
                        </el-row>
                        <el-row style="font-size:13px; font-weight: bold;">
                            <span style=" margin-right:20px;">勾选条数：{{multipleSelection.length}}条</span>
                            <span style="color:red; margin-right:20px;">开票金额：{{invoiceAmountSum}}元</span>
                        </el-row>
                    </el-main>
                </el-tab-pane>
                <el-tab-pane label="生成账单" name="second">
                    <el-header class="content-header" height="">
                        <el-form size="small" :model="searchConfirmParam" label-width="120px">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="供应商:">
                                        <supplier-select v-model="searchConfirmParam.supplierCode"
                                                         placeholder="请输入供应商"
                                                         type="PLANTFORM_COMPANY"
                                                         style="display: block"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="运单号:">
                                        <el-input v-model="searchConfirmParam.waybillCode"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="到达开始时间:">
                                        <date-picker-single v-model="searchConfirmParam.confirmArrivalStartTime"
                                                            date-type="start"
                                                            :end-date="searchConfirmParam.confirmArrivalEndTime"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="到达结束时间:">
                                        <date-picker-single v-model="searchConfirmParam.confirmArrivalEndTime"
                                                            date-type="end"
                                                            :start-date="searchConfirmParam.confirmArrivalStartTime"/>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24" style="float: right">
                                    <el-form-item style="float: right">
                                        <el-button type="success" icon="el-icon-search" @click="searchConfirmParam.currentPage=1;searchConfirmList()">查询</el-button>
                                        <el-button type="warning" class="fa fa-repeat" @click="resetSearchBillParam">&nbsp;&nbsp;重置
                                        </el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-header>

                    <el-main class="content-main">
                        <el-button v-if="exportLoadingConfirm" icon="el-icon-download" type="primary" v-permission="'/supplierBillConfirm/createBillExport'" size="mini" @click="exportListConfirm">导出</el-button>
                        <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
                        <el-button type="primary" size="mini" icon="el-icon-tickets" v-permission="'/supplierBillConfirm/createBill'" @click="createSupplierBill">全部生成账单</el-button>
                        <el-button type="primary" size="mini" icon="el-icon-tickets" :disabled="!multipleSelectionConfirm.length>0" v-permission="'/supplierBillConfirm/batchDelete'" @click="batchDelete">批量删除</el-button>
                        <el-table v-loading="isLoadingConfirm" size="small" class="content-table" :data="searchConfirmResult.result"
                                  element-loading-text="拼命加载中"
                                  @selection-change="handleSelectionChangeConfirm"
                                  border fit highlight-current-row stripe :height="tableHeight">
                            <el-table-column type="selection" min-width="40"/>
                            <el-table-column align="center" label="运单编号" prop="waybillCode" min-width="120px" fixed/>
                            <el-table-column align="center" label="供应商" prop="supplierName" min-width="200px" show-overflow-tooltip/>
                            <el-table-column align="center" label="客户名称" prop="customerName" min-width="200px" show-overflow-tooltip/>
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
                            <el-table-column align="center" label="实际发车时间" prop="actualDepartureTime" min-width="200px" show-overflow-tooltip/>
                            <el-table-column align="center" label="实际到达时间" prop="confirmArrivalTime" min-width="200px" show-overflow-tooltip/>
                            <el-table-column align="center" label="签收时间" prop="signTime" min-width="200px" show-overflow-tooltip/>
                            <el-table-column label="操作" header-align="center" align="center" width="100" fixed="right">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-delete" v-permission="'/supplierBillConfirm/delete'" size="mini" @click="deleteSupplierConfirm(scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-row>
                            <div class="content-pagination">
                                <el-pagination
                                    @size-change="handleSizeChangeConfirm"
                                    @current-change="handleCurrentChangeConfirm"
                                    :page-sizes="[10, 50, 100, 300]"
                                    :page-size="searchConfirmParam.pageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="searchConfirmResult.totalCount">
                                </el-pagination>
                            </div>
                        </el-row>
                        <el-row>
                            <div style="font-weight: bold;font-size:13px;color:red;display: inline;" v-for="item in sum">
                                <span>{{item.supplierName}}:{{item.invoiceAmountSum}}元</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                        </el-row>
                    </el-main>
                </el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>
</template>

<script>
    import {Api,Http,Common} from 'src/global'
    import axios from 'axios'

    export default {
        data() {
            return {
                activeName: "first",
                isLoading: true,
                isLoadingConfirm: true,
                exportLoading: true,
                exportLoadingConfirm: true,

                searchParam: {//查询运单参数
                    currentPage: 1,
                    pageSize: 10,
                    supplierCode: '',
                    waybillCode: '',
                    confirmArrivalStartTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),// 开始时间
                    confirmArrivalEndTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),// 结束时间
                    confirmStatus: '',
                    billStatus: '',
                    batchSelect: '',
                    waybillCodes: '',
                },
                searchConfirmParam: {//生成账单参数
                    currentPage: 1,
                    pageSize: 10,
                    supplierCode: '',
                    waybillCode: '',
                    confirmArrivalStartTime: '',
                    confirmArrivalEndTime: ''
                },
                searchResult: {//查询运单返回结果
                    totalCount: 0,
                    result: []
                },
                sum: [],
                multipleSelection: [],
                searchConfirmResult: {//生成账单返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelectionConfirm: [],
                tableHeight: window.innerHeight > 800 ? 430 : null
            }
        },
        created() {
            this.searchList();
        },
        computed: {
            invoiceAmountSum() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].invoiceAmount)
                    }
                }
                return sum.toFixed(2);
            }
        },
        methods: {
            handleClick(tab) {
                if(tab.name==='first'){
                    this.searchList();
                }else{
                    this.searchConfirmList();
                }
            },
            resetSearchParam() {//重置参数
                this.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    supplierCode: '',
                    waybillCode: '',
                    confirmArrivalStartTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),// 开始时间
                    confirmArrivalEndTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59"),// 结束时间
                    confirmStatus: '',
                    billStatus: '',
                    batchSelect: '',
                    waybillCodes: '',
                }
            },
            searchList() {//查询
                let vm = this;
                this.isLoading = true;

                let batchSelect = this.searchParam.batchSelect;
                if (batchSelect) {
                    var regex = new RegExp('\n|\n|\n', 'g');
                    let match = batchSelect.replace(regex, ',');
                    let matchList = match.split(',');
                    let newMatchList = matchList.map((item)=>{
                        return `'${item}'`;
                    })
                    vm.searchParam.waybillCodes = newMatchList.join(',');
                    vm.searchParam.batchSelect = '';
                }
                Http.get(Api.supplierBill.queryPage,{params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                })
            },
            searchSum() {
                let vm = this;
                Http.get(Api.supplierBill.sum, vm.searchParam, result => {
                    this.sum = result.result;
                })
            },
            resetSearchBillParam() {//重置参数
                this.searchConfirmParam = {
                    currentPage: 1,
                    pageSize: 10,
                    supplierCode: '',
                    waybillCode: '',
                    confirmArrivalStartTime: '',
                    confirmArrivalEndTime: ''
                }
            },
            searchConfirmList() {//查询
                let vm = this;
                vm.isLoadingConfirm = true;
                Http.get(Api.supplierBill.confirmPage, {params: vm.searchConfirmParam}, result => {
                    this.searchConfirmResult.result = result.result;
                    this.searchConfirmResult.totalCount = result.totalCount;
                    this.searchConfirmParam.currentPage = result.currentPage;
                    this.searchConfirmParam.pageSize = result.pageSize;
                    this.searchSum();
                    vm.isLoadingConfirm = false;
                }, () => {
                    vm.isLoadingConfirm = false;
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChangeConfirm(val) {
                this.searchConfirmParam.pageSize = val;
                this.searchConfirmList();
            },
            handleCurrentChangeConfirm(val) {
                this.searchConfirmParam.currentPage = val;
                this.searchConfirmList();
            },
            handleSelectionChangeConfirm(val) {
                this.multipleSelectionConfirm = val;
            },
            showWayBill(row) { //运单详情------------------------------------
                this.$router.push({path: '/waybill/waybillDetail', query: {code: row.waybillCode}});
            },
            supplierBillConfirm() {
                let vm = this;
                let waybillCodeList = [];//运单号list
                vm.multipleSelection.forEach(row => {
                    waybillCodeList.push(row.waybillCode);
                });
                this.$confirm('是否确认账单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.supplierBill.confirmAdd,{'waybillCodeList': waybillCodeList}, result => {
                        vm.$message.success("账单确认成功！")
                        vm.searchList();
                    })
                })
            },
            createSupplierBill() {
                let vm = this;
                if (vm.searchConfirmParam.supplierCode == '' || vm.searchConfirmParam.supplierCode == null) {
                    vm.$message.warning("请选择供应商");
                    return;
                }
                let waybillCodeList = [];//运单号list
                vm.multipleSelection.forEach(row => {
                    waybillCodeList.push(row.waybillCode);
                });
                this.$confirm('是否确定生成供应商账单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.supplierBill.createBill,vm.searchConfirmParam, result => {
                        vm.$message.success("生成供应商账单成功！")
                        vm.searchConfirmList();
                    })
                })
            },
            deleteSupplierConfirm(id){
                this.$confirm('是否删除供应商确认数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.supplierBill.confirmDelete, [id], response => {
                        this.$message.success("删除成功");
                        this.searchConfirmList();
                    })
                })
            },
            batchDelete(){
                let ids = [];
                this.multipleSelectionConfirm.forEach((item)=>{
                    ids.push(item.id);
                });
                this.$confirm('是否删除所选供应商确认数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.supplierBill.confirmDelete, ids, response => {
                        this.$message.success("删除成功");
                        this.searchConfirmList();
                    })
                })
            },
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.supplierBill.queryExport, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '供应商运单信息.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            exportListConfirm(){
                let vm = this;
                vm.exportLoadingConfirm = false;
                axios.get(Api.supplierBill.confirmExport, {params: vm.searchConfirmParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '供应商运单确认信息.xls';
                    link.click();
                    vm.exportLoadingConfirm = true;
                }).catch(reason => {
                    vm.exportLoadingConfirm = true;
                })
            },
        }
    }
</script>

