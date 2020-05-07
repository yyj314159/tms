<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 核算报表</el-breadcrumb-item>
                <el-breadcrumb-item>保险折旧分摊统计</el-breadcrumb-item>
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
                        <el-form-item label="分摊月份:">
                            <el-date-picker
                                v-model="searchParam.adjustAccountsMonth" type="month" value-format="yyyy-MM"
                                style="width:100%;"
                                placeholder="请选择月份">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" style="float: right">
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
            <el-button v-if="exportLoading" v-permission="'/insuranceAndDepreciationFinancialAccounting/export'" icon="el-icon-download"
                       type="primary" size="mini" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" prop="licenseNumber" label="车牌号" width="130"/>
                <el-table-column align="center" prop="operationMode" label="车辆属性" width="130"/>
                <el-table-column align="center" prop="selfOperationMode" label="自营模式" width="130"/>
                <el-table-column align="center" prop="settlementMode" label="结算模式" width="130"/>
                <el-table-column align="center" prop="topCustomer" label="顶级客户" width="130"/>
                <el-table-column align="center" prop="driverName" label="车辆所属主体" width="120"/>
                <el-table-column align="center" prop="regionName" label="分摊后所属大区" width="120"/>
                <el-table-column align="center" prop="belongOrgName" label="分摊后所属分区" width="120"/>
                <el-table-column align="center" prop="amountInsurance" label="保险分摊金额" width="140"/>
                <el-table-column align="center" prop="amountDepreciation" label="折旧分摊金额" width="140"/>
                <el-table-column align="center" prop="amountInsuranceMonth" label="尾款保险分摊金额" width="140"/>
                <el-table-column align="center" prop="count" label="运单数量" width="130"/>
                <el-table-column align="center" prop="month" label="分摊月份" width="130"/>
                <el-table-column align="center" prop="kaban" label="是否卡班" width="130"/>
                <el-table-column align="center" prop="runningStatus" label="是否本月运行" width="120"/>
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
                    settlementModel: '',
                    selfOperationMode: '',
                    operationMode: '',
                    operationStatus: '',
                    adjustAccountsMonth: Common.date.dateFormat(new Date(), "YYYY-MM"),
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
                };
            },
            searchList() {//查询
                let vm = this;
                //自营车
                if (vm.searchParam.settlementModel == 'SELF_SELF_SUPPORT') {
                    vm.searchParam.selfOperationMode = 'SELF_SELF_SUPPORT'
                }
                //承包车
                if (vm.searchParam.settlementModel == 'SELF_OUTSOURCE') {
                    vm.searchParam.selfOperationMode = 'SELF_OUTSOURCE'
                }
                //合作车
                if (vm.searchParam.settlementModel == 'OUTSOURCE_NOT_TRANSFERRED') {
                    vm.searchParam.operationMode = 'OUTSOURCE'
                    vm.searchParam.operationStatus = 'NOT_TRANSFER'
                }
                //长期外请车
                if (vm.searchParam.settlementModel == 'OUTSOURCE_TRANSFERRED') {
                    vm.searchParam.operationMode = 'OUTSOURCE'
                    vm.searchParam.operationStatus = 'TRANSFERRED'
                }
                if(!this.searchParam.adjustAccountsMonth){
                    this.$message.error("请选择分摊月份");
                    throw "请选择分摊月份"
                }
                vm.isLoading = true;
                Http.get(Api.insuranceAndDepreciationFinancialAccounting.page, {params: vm.searchParam}, result => {
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
                axios.get(Api.insuranceAndDepreciationFinancialAccounting.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '保险折旧分摊统计报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },

        }
    }
</script>

