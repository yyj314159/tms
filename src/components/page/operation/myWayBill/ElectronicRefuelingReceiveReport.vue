<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 定点加油</el-breadcrumb-item>
                <el-breadcrumb-item>加油消费</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="流水号:">
                            <el-input v-model="searchParam.serialCode" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="消费开始时间:">
                            <date-picker-single v-model="searchParam.startTime" date-type="start"
                                                :end-date="searchParam.endTime" :default-time="['00:00:00', '23:59:59']"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="消费结束时间:">
                            <date-picker-single v-model="searchParam.endTime" date-type="end"
                                                :start-date="searchParam.startTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机:">
                            <DriverSelect v-model="searchParam.driverId" style="display:block;"></DriverSelect>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="加油供应商:">
                            <dictionary-select v-model="searchParam.createUser"
                                               option-name="GAS_STATION" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否开票:">
                            <dictionary-select v-model="searchParam.invoiceFlag"
                                               option-name="HAS_INVOICE" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="开票开始时间:">
                            <date-picker-single v-model="searchParam.startInvDate" date-type="start"
                                                :end-date="searchParam.endInvDate" :default-time="['00:00:00', '23:59:59']"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="开票结束时间:">
                            <date-picker-single v-model="searchParam.endInvDate" date-type="end"
                                                :start-date="searchParam.startInvDate"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="供应商单号:">
                            <el-input v-model="searchParam.supplierOrderId" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否高速站点:">
                            <dictionary-select v-model="searchParam.highSpeedStation" style="display:block" option-name="HIGH_SPEED_STATION"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="float: right">
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
            <el-button v-if="btnLoading" v-permission="'/electronicRefuelingReceiveReport/export'" size="mini" type="primary"
                       icon="el-icon-download" @click="exportData">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-button v-if="downloadLoading" icon="el-icon-download" type="primary" size="mini"
                       v-permission="'/electronicRefuelingReceiveReport/download'"
                       @click="templateDownload">模板下载
            </el-button>
            <upload-excel :importUrl="Api.refuelingInvoiceRecord.upload" @success="uploadSuccess" btn-name="导入"
                          style="display: inline-block; margin-left: 10px;" v-permission="'/electronicRefuelingReceiveReport/upload'"></upload-excel>

            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="加油供应商" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="GAS_STATION"
                                                v-model="scope.row.createUser"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="供应商单号" prop="supplierOrderId" min-width="190" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="是否高速站点" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name  option-name="HIGH_SPEED_STATION" v-model="scope.row.highSpeedStation"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="司机" prop="driverName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="消费时间" prop="createTime" min-width="150"></el-table-column>
                <el-table-column align="center" label="消费金额" prop="businessAmount" min-width="120"></el-table-column>
                <el-table-column align="center" label="业务类型" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="REFUELING_DRIVER_RECORD_BUSINESS_TYPE"
                                                v-model="scope.row.businessType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="余额" prop="afterBusinessAmount" min-width="120"></el-table-column>
                <el-table-column align="center" label="承运公司" prop="supplierName" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="流水号" prop="serialCode" min-width="180"></el-table-column>
                <!--<el-table-column align="center" label="加油单号" prop="businessCode" min-width="180"show-overflow-tooltip></el-table-column>-->
                <el-table-column align="center" label="运单号" prop="waybillCode" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="支付油费时间" prop="createTime1" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="支付油费" prop="payOil" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="是否开票" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="HAS_INVOICE"
                                                v-model="scope.row.invoiceFlag"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="开票日期" prop="invoiceDate" min-width="130" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-row>
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 20, 50, 300]"
                        :page-size="searchParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchResult.totalCount">
                    </el-pagination>
                </div>
            </el-row>
            <el-row style="font-size:13px; font-weight: bold;">
                <span style=" margin-right:20px;">勾选条数：{{multipleSelection.length}}条</span>
                <span style="color:red; margin-right:20px;">消费金额：{{businessAmountValue}}元</span>
                <span style="color:red; margin-right:20px;">余额：{{afterBusinessAmountValue}}元</span>
                <span style="color:red; margin-right:20px;">支付油费：{{payOilValue}}元</span>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    import {Api, Common, Constant, Http, Validate} from 'src/global'
    import RefuelingSupplierSelect from "../../../common/select/RefuelingSupplierSelect"
    import axios from 'axios'

    export default {
        components: {RefuelingSupplierSelect},
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                btnLoading: true,
                downloadLoading: true,
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    serialCode: '',//流水号
                    startTime: '',//开始时间
                    endTime: '',//结束时间
                    driverId: '',//司机姓名
                    createUser: '',// 加油供应商
                    invoiceFlag:'',// 是否开票
                    startInvDate: '',//开票开始时间
                    endInvDate: '',//开票结束时间
                    supplierOrderId: '',// 供应商单号
                    highSpeedStation: ''//是否高速站点
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                tableHeight: window.innerHeight > 800 ? 480 : null
            }
        },
        created() {
            this.searchList();
        },
        computed: {
            payOilValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        let payOil = this.multipleSelection[i].payOil;
                        if (payOil.indexOf(',') >= 0) {
                            let payOilArray = payOil.split(',');
                            for (const payOilElement of payOilArray) {
                                sum += Common.util.numberFormat(payOilElement)
                            }
                        } else {
                            sum += Common.util.numberFormat(payOil)
                        }
                    }
                }
                return sum.toFixed(2);
            },
            businessAmountValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].businessAmount)
                    }
                }
                return sum.toFixed(2);
            },
            afterBusinessAmountValue() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].afterBusinessAmount)
                    }
                }
                return sum.toFixed(2);
            }
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    serialCode: '',//流水号
                    startTime: '',//开始时间
                    endTime: '',//结束时间
                    driverId: '',//司机姓名
                    createUser: '',// 加油供应商
                    invoiceFlag:'',// 是否开票
                    startInvDate: '',//开票开始时间
                    endInvDate: '',//开票结束时间
                    supplierOrderId: '',// 供应商单号
                    highSpeedStation: ''//是否高速站点
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.electronicRefuelingReceiveReport.page, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
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
            //下载模板
            templateDownload(){
                let vm = this;
                vm.downloadLoading = false;
                axios.get(Api.refuelingInvoiceRecord.download, {responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '加油消费开票导入模板.xls';
                    link.click();
                    vm.downloadLoading = true;
                }).catch(reason => {
                    vm.downloadLoading = true;
                })
            },
            uploadSuccess() {
                let vm = this;
                vm.searchList();
            },
            exportData() {
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.electronicRefuelingReceiveReport.page, {params: searchExportParam}, response => {
                    let header = ['加油供应商', '供应商单号', '是否高速站点', '司机', '消费时间', '消费金额', '业务类型', '余额','承运公司', '流水号', '运单号', '支付油费时间', '支付油费', '是否开票', '开票日期'];
                    let filterVal = [{
                        type: 'dictionary',
                            'code': 'GAS_STATION',
                            'name': 'createUser'
                        }, 'supplierOrderId',
                        {
                            type: 'dictionary',
                            code: 'HIGH_SPEED_STATION',
                            name: 'highSpeedStation'
                        },
                        'driverName','createTime','businessAmount',
                        {
                            type: 'dictionary',
                            'code': 'REFUELING_DRIVER_RECORD_BUSINESS_TYPE',
                            'name': 'businessType'
                        }, 'afterBusinessAmount', 'supplierName', 'serialCode', 'waybillCode', 'createTime1', 'payOil',
                        {
                            type: 'dictionary',
                            'code': 'HAS_INVOICE',
                            'name': 'invoiceFlag'
                        },'invoiceDate'
                    ];
                    Common.excel.downloadExl(response.result, header, filterVal, "加油消费导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            }
        }
    }
</script>

