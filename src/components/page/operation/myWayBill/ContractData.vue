<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 运单管理</el-breadcrumb-item>
                <el-breadcrumb-item>合同管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="派车单号:">
                            <el-input v-model="searchParam.dispatchCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="甲方公司:">
                            <supplier-select :type="'PLANTFORM_COMPANY'" v-model="searchParam.supplierCode"
                                             style="display:block"></supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="模板编号:">
                            <el-input v-model="searchParam.templateId"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="合同状态:">
                            <dictionary-select v-model="searchParam.status" option-name="CONTRACT_DATA_STATUS"
                                               style="display: block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
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
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border
                      fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="运单号" min-width="120">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="派车单号" prop="dispatchCode"
                                 min-width="120"></el-table-column>
                <el-table-column header-align="center" label="模板编号" prop="templateId"
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="合同编号" prop="contractId"
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="甲方(托运人)" prop="companyName"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="乙方(承运人)" prop="driverName"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="合同状态" prop="status"
                                 min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="CONTRACT_DATA_STATUS" :value="scope.row.status"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="乙方手机号" prop="driverPhone"
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="乙方身份证号码" prop="certifyNum"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="车牌号/车型" prop="vehicleNumber"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="起运地" show-overflow-tooltip prop="departAddress"
                                 min-width="150"></el-table-column>
                <el-table-column header-align="center" label="途中上下货地" show-overflow-tooltip prop="transitAddress"
                                 min-width="150"></el-table-column>
                <el-table-column header-align="center" label="目的地" show-overflow-tooltip prop="destAddress"
                                 min-width="150"></el-table-column>
                <el-table-column header-align="center" label="起运时间" prop="shipmentTime"
                                 min-width="170"></el-table-column>
                <el-table-column header-align="center" label="到达时间" prop="arriveTime"
                                 min-width="170"></el-table-column>
                <el-table-column header-align="center" label="时效小时" prop="runtimeHour"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="时效分钟" prop="runtimeMinute"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="总运费" prop="totalAmount"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="预付油卡金额" prop="oilCardAmount"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="油卡卡号" prop="oilCardNumber"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="油卡押金" prop="oilCardDeposit"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="定点加油金额" prop="refuelingAmount"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="充油手机号" prop="refuelingPhone"
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="预付打卡" prop="prepaidCardAmount"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="货到打卡" prop="deliveryAmount"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="回单付款" prop="returnAmount"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="回单押金" prop="returnDeposit"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="GPS使用费" prop="gpsFee"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="GPS押金" prop="gpsDeposit"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="尾款" prop="finalAmount"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="收款人姓名" prop="payeeName"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="开户银行" prop="bankName"
                                 min-width="150"></el-table-column>
                <el-table-column header-align="center" label="账号" prop="bankCardNumber"
                                 min-width="160"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="120">
                    <template slot-scope="scope">
                        <el-button v-permission="'/contractData/update'" type="text" size="mini"
                                   @click="updateContractData(scope.row.waybillCode)">更新合同
                        </el-button>
                        <el-button v-permission="'/contractData/show'" type="text" size="mini"
                                   @click="openContract(scope.row.attachment)">查看
                        </el-button>
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
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Constant} from 'src/global/constant'

    export default {
        data() {
            return {
                isLoading: true,
                Constant: Constant,//常量
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    dispatchCode: '',
                    waybillCode: '',
                    supplierCode: '',
                    templateId: '',
                    status: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null,//操作行的数据
                tableHeight: window.innerHeight > 800 ? 430 : null
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
                    dispatchCode: '',
                    waybillCode: '',
                    supplierCode: '',
                    templateId: '',
                    status: ''
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.contractData.page, {params: vm.searchParam}, result => {
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
            updateContractData(waybillCode) {
                Http.post(Api.contractData.update, {'waybillCode': waybillCode}, result => {
                    this.$message({
                        message: '更新成功!',
                        type: 'success'
                    });
                    this.searchList();
                })
            },
            showWayBill(row) { //运单详情------------------------------------
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
            },
            openContract(url){
                window.open(url);
            }
        }
    }
</script>

