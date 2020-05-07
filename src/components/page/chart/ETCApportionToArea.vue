<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 核算报表</el-breadcrumb-item>
                <el-breadcrumb-item>ETC分摊统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select v-model="searchParam.operationMode" style="display:block"
                                               option-name="VEHICLE_OPERATION_MODE" :excludeOptions="['OUT_INVITE']"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="结算模式">
                            <dictionary-select v-model="searchParam.settlementModel" style="display: block"
                                               option-name="SETTLEMENT_MODEL"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="ETC卡号:">
                            <el-input type="text" v-model="searchParam.cardCode" :clearable="true"
                                      style="display: block"
                                      placeholder="请输入卡号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="分摊月份:">
                            <el-date-picker
                                v-model="searchParam.adjustAccountsMonth" type="month" value-format="yyyy-MM"
                                placeholder="请选择月份" style="width:100%;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="ETC供应商:">
                            <dictionary-select v-model="searchParam.supplier"
                                               option-name="ETC_SUPPILER" :clearable="true"
                                               style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="账单月份:">
                            <el-date-picker
                                v-model="searchParam.billMonth" type="month" value-format="yyyy-MM"
                                placeholder="请选择月份" style="width:100%;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="float: right">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchList()">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/etcFinancialAccounting/export'" icon="el-icon-download"
                       type="primary" size="mini" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" prop="licenseNumber" label="车牌号" width="120"></el-table-column>
                <el-table-column align="center" prop="operationMode" label="车辆属性" width="100"></el-table-column>
                <el-table-column align="center" prop="selfOperationMode" label="自营模式" width="120"></el-table-column>
                <el-table-column align="center" prop="settlementMode" label="结算模式" width="100"></el-table-column>
                <el-table-column align="center" prop="topCustomer" label="顶级客户" width="100"></el-table-column>
                <el-table-column align="center" prop="etcCardCode" label="ETC卡号" width="160"></el-table-column>
                <el-table-column align="center" prop="etcSupplier" label="ETC供应商" width="120"></el-table-column>
                <el-table-column align="center" prop="etcType" label="ETC类型" width="120"></el-table-column>
                <el-table-column align="center" prop="regionName" label="分摊后所属大区" width="120"></el-table-column>
                <el-table-column align="center" prop="belongOrgName" label="分摊后所属分区" width="120"></el-table-column>
                <el-table-column align="center" prop="apportionMoney" label="分摊金额" width="140"></el-table-column>
                <el-table-column align="center" prop="count" label="运单数量" width="120"></el-table-column>
                <el-table-column align="center" prop="month" label="分摊月份" width="110"></el-table-column>
                <el-table-column align="center" prop="kaban" label="是否卡班" width="120"></el-table-column>
                <el-table-column align="center" prop="runningStatus" label="是否本月运行" width="120"></el-table-column>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10,20, 50, 100]"
                    :page-size="searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    import {Http, Api, Validate, Common, Constant} from 'src/global/index'
    import axios from 'axios'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                exportLoading: true,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    vehicleCode: '',
                    cardCode: '',
                    supplier: '',
                    settlementModel: '',
                    selfOperationMode: '',
                    operationMode: '',
                    operationStatus: '',
                    adjustAccountsMonth: Common.date.dateFormat(new Date(), "YYYY-MM"),
                    billMonth: '',
                    lastMonth:''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    adjustAccountsMonth: Common.date.dateFormat(new Date(), "YYYY-MM"),
                    billMonth:'',
                    lastMonth:'',
                };
            },
            searchList() {//查询
                let vm = this;
                //自营车
                if (vm.searchParam.settlementModel == 'SELF_SELF_SUPPORT') {
                    vm.searchParam.selfOperationMode = 'SELF_SELF_SUPPORT';
                }
                //承包车
                if (vm.searchParam.settlementModel == 'SELF_OUTSOURCE') {
                    vm.searchParam.selfOperationMode = 'SELF_OUTSOURCE';
                }
                //合作车
                if (vm.searchParam.settlementModel == 'OUTSOURCE_NOT_TRANSFERRED') {
                    vm.searchParam.operationMode = 'OUTSOURCE';
                    vm.searchParam.operationStatus = 'NOT_TRANSFER';
                }
                //长期外请车
                if (vm.searchParam.settlementModel == 'OUTSOURCE_TRANSFERRED') {
                    vm.searchParam.operationMode = 'OUTSOURCE';
                    vm.searchParam.operationStatus = 'TRANSFERRED';
                }
                if (this.searchParam.adjustAccountsMonth && this.searchParam.billMonth) {
                    return this.$message.error("分摊月份和账单月份只能选择一个");
                }
                if (!this.searchParam.adjustAccountsMonth && !this.searchParam.billMonth) {
                    return this.$message.error("分摊月份和账单月份需选择一个");
                }
                if(this.searchParam.billMonth){
                    this.searchParam.lastMonth =
                    Common.date.dateFormat(new Date(_.add(this.searchParam.billMonth,'-01 00:00:00')).getTime() - 30 * 24 * 3600 * 1000, "YYYY-MM");
                }
                vm.isLoading = true;
                Http.get(Api.etcFinancialAccounting.page, {params: vm.searchParam}, result => {
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
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                if (this.searchParam.adjustAccountsMonth && this.searchParam.billMonth) {
                    return this.$message.error("分摊月份和账单月份只能选择一个");
                }
                if (!this.searchParam.adjustAccountsMonth && !this.searchParam.billMonth) {
                    return this.$message.error("分摊月份和账单月份需选择一个");
                }
                axios.get(Api.etcFinancialAccounting.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = 'ETC费用分摊统计报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },

        }
    }
</script>

