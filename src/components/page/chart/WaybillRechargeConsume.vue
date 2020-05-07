<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 定点加油报表</el-breadcrumb-item>
                <el-breadcrumb-item>运单充值消费</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机姓名:">
                            <el-input v-model="searchParam.driverName" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机电话:">
                            <el-input v-model="searchParam.driverPhone" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierCode"
                                             :types="Constant.SUPPLIER_TYPE.PLANTFORM_COMPANY"
                                             style="display: block;"></supplier-select>
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
                        <el-form-item label="充值开始时间:">
                            <date-picker-single v-model="searchParam.startTime" date-type="start"
                                                :end-date="searchParam.endTime" :default-time="['00:00:00', '23:59:59']"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="充值结束时间:">
                            <date-picker-single v-model="searchParam.endTime" date-type="end"
                                                :start-date="searchParam.startTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchList">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/waybillRechargeConsume/export'"
                       icon="el-icon-download"
                       type="primary" size="mini" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="充值时间" prop="createTime" min-width="140"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" label="运单号" prop="waybillCode" min-width="140"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" label="充值供应商" prop="supplierName" min-width="160"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" label="业务类型" prop="businessType" min-width="130"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="充值金额" prop="amount1" min-width="100"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="司机姓名" prop="driverName" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="司机手机" prop="driverPhone" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="加油供应商" prop="createUser" min-width="140"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="消费金额" prop="amount2" min-width="100"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="转出金额" prop="amount3" min-width="100"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="转入金额" prop="amount4" min-width="100"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="余额" prop="afterBusinessAmount" min-width="100"
                                 show-overflow-tooltip/>
            </el-table>
            <el-row>
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
            </el-row>
            <el-row style="font-size:13px; font-weight: bold;">
                <span style=" margin-right:20px;">勾选条数：{{multipleSelection.length}}条</span>
                <span style="color:red; margin-right:20px;">充值金额：{{amount1Value}}元</span>
                <span style="color:red; margin-right:20px;">消费金额：{{amount2Value}}元</span>
                <span style="color:red; margin-right:20px;">余额：{{(amount1Value - amount2Value).toFixed(2)}}元</span>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    import {Api, Common,Constant, Http} from 'src/global'
    import RefuelingSupplierSelect from "../../common/select/RefuelingSupplierSelect"
    import axios from 'axios'

    export default {
        components: {RefuelingSupplierSelect},
        data() {
            return {
                Constant: Constant,
                isLoading: true,
                exportLoading: true,
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',// 运单号
                    driverName: '',//司机姓名
                    driverPhone: '',//司机电话
                    supplierCode: '',//充值供应商
                    createUser: '', //油卡供应商
                    startTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//充值开始时间
                    endTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")// 充值结束时间
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                multipleSelection: []
            }
        },
        created() {
            this.searchList();
        },
        computed: {
            amount1Value() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].amount1)
                    }
                }
                return sum.toFixed(2);
            },
            amount2Value() {
                let sum = 0;
                if (this.multipleSelection && this.multipleSelection.length != 0) {
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        sum += Common.util.numberFormat(this.multipleSelection[i].amount2)
                    }
                }
                return sum.toFixed(2);
            }
        },
        methods: {
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
            /*查询*/
            searchList() {
                let vm = this;
                Http.get(Api.waybillRechargeConsume.page, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                })
            },
            //重置参数
            resetSearchParam() {
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',// 运单号
                    driverName: '',//司机姓名
                    driverPhone: '',//司机电话
                    supplierCode: '',//充值供应商
                    createUser: '', //油卡供应商
                    startTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//充值开始时间
                    endTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")// 充值结束时间
                };
            },
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.waybillRechargeConsume.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '运单加油消费.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
        }
    }
</script>
