<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>业务员提成</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务审核状态:">
                            <dictionary-select option-name="SALESMAN_AUDIT_STATUS"  v-model="searchParam.auditStatus" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.code" style="display:block"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单状态:">
                            <dictionary-select option-name="WAY_BILL_STATUS_NO_BEEN_ABANDONED"  v-model="searchParam.status" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select v-model="searchParam.vehicleNature" style="display:block" option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="尾款付款状态:">
                            <dictionary-select v-model="searchParam.returnAmountPaymentStatus" option-name="PAY_SETTLEMENT_STATE" style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应收结算状态:">
                            <dictionary-select option-name="MY_BUSINESS_RECEIVE_BILL_STATUS"  v-model="searchParam.receiveStatus" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start" :end-date="searchParam.endActualDepartureTime"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end" :start-date="searchParam.startActualDepartureTime"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务员:">
                            <all-user-select style="display:block;"  v-model="searchParam.salesman" @change-option="changeSalesman"></all-user-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否奖金激励:">
                            <dictionary-select option-name="BONUSINCENTIVE_FLAG"  v-model="searchParam.bonusIncentiveFlag" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <!--导出组件-->
            <export-button v-permission="'/salesmanCommission/export'" :href="Api.salesmanCommission.export" :params="searchParam" :download-name="'业务员提成'"></export-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="所属大区" prop="regionName" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="orgName" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="运单号" prop="waybillCode" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row.waybillCode)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="客户名称" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.customerName?scope.row.customerName:""}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="lineName" min-width="240" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="startStationName" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="endStationName" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车牌号" prop="vehicleLicenseNum" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车型" prop="specification" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车辆属性" prop="vehicleNature" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="运单状态" prop="waybillStatus" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="应收金额" prop="receiveAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <!--
                <el-table-column header-align="center" label="实际应收金额" prop="receiveActualReceiveAmount" min-width="120" show-overflow-tooltip></el-table-column>
                -->
                <el-table-column header-align="center" label="应收结算状态" prop="billStatus" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应收结算时间" prop="receiveSettlementTime" min-width="120" show-overflow-tooltip></el-table-column>

                <el-table-column header-align="center" label="应收收款状态" prop="payeeStatus" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="收款时间" prop="payeeTime" min-width="120" show-overflow-tooltip></el-table-column>

                <el-table-column header-align="center" label="应付金额" prop="paidVehicleAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="定点加油金额" prop="refuelingAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="油卡金额" prop="oilCardAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="实际油比" prop="actualOilRatio" min-width="120" show-overflow-tooltip></el-table-column>
                <!--
                <el-table-column header-align="center" label="实际应付金额" prop="actualPaidVehicleAmount" min-width="120" show-overflow-tooltip></el-table-column>
                -->
                <el-table-column header-align="center" label="应付结算状态" prop="settlementState" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="付款时间" prop="paidSettlementTime" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="税额" prop="dutyAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="资金成本" prop="firstCost" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="税金损失" prop="dutyCostLose" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目标利润率" prop="scatteredTargetRate" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="实际利润率" prop="scatteredActualRate" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="超额利润" prop="excessProfit" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="预计提成金额" prop="royaltyAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="计息" prop="penaltyInterest" min-width="120" show-overflow-tooltip></el-table-column>


                <el-table-column header-align="center" label="业务员" prop="salesman" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="业务员所属组织" prop="salesmanOrgName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="请车员" prop="carInviter" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="请车员所属组织" prop="carInviterOrgName" min-width="120" show-overflow-tooltip></el-table-column>

                <el-table-column header-align="center" label="零散业务审批状态" prop="auditStatus" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="是否享受奖金激励" prop="bonusIncentiveFlag" min-width="120" show-overflow-tooltip></el-table-column>
                <!--
                <el-table-column header-align="center" label="预计提成金额" prop="royaltyAmount" min-width="120" show-overflow-tooltip></el-table-column>
                -->
                <el-table-column header-align="center" label="发车时间" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.driverDepartureTime && Math.abs(new Date(scope.row.actualDepartureTime).getTime() - new Date(scope.row.driverDepartureTime).getTime())>1800000" style="color:red;">{{scope.row.actualDepartureTime}}</span>
                        <span v-else>{{scope.row.actualDepartureTime}}</span>
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
    import {Http,Api,Common} from 'src/global/index'
    import lineInfo from 'src/components/page/operation/myDispatch/LineInfoDialog'
    import axios from 'axios'
    import {mapGetters} from 'vuex';


    export default {
        data() {
            return {
                currentRow: null,//操作行的数据
                showLineInfo: false,//线路信息详情
                Api: Api,
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    orgCode:'',
                    customerCode: '',
                    vehicleCode: '',
                    auditStatus: '',//审核状态
                    bonusIncentiveFlag: '',
                    code: '',//运单号
                    status: '',//运单状态
                    salesman: '',
                    vehicleNature: '',
                    returnAmountPaymentStatus: '',
                    receiveStatus: '',//应收结算状态
                    startActualDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                },
                isLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true
            }
        },
        created() {
            this.searchList();
        },
        components:{
            lineInfo,axios
        },
        computed: {
            ...mapGetters([
                'user'
            ]),
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    orgCode:'',
                    customerCode: '',
                    vehicleCode: '',
                    auditStatus: '',//审核状态
                    bonusIncentiveFlag: '',
                    code: '',//运单号
                    status: '',//运单状态
                    salesman: '',
                    vehicleNature: '',
                    returnAmountPaymentStatus: '',
                    receiveStatus: '',//应收结算状态
                    startActualDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                console.log(this.$store.getters.user)
                Http.get(Api.salesmanCommission.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
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
            showWayBill(waybillCode){ //运单详情------------------------------------
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: waybillCode}});
                // window.open(href, '_blank');
                this.$router.push({path: '/operation/waybillDetail', query: {code: waybillCode}})
            },
            changeSalesman(obj){
                let vm = this;
                if(!_.isNil(obj)){
                    vm.searchParam.salesman = `${obj.name} ${obj.username}`;
                }else{
                    vm.searchParam.salesman = '';
                }
            },
        }
    }
</script>

<style scoped>

</style>
