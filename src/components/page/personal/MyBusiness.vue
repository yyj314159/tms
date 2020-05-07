<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>我的业务</el-breadcrumb-item>
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
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
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
                    <el-col :span="6" v-show="false">
                        <el-form-item label="业务员:">
                            <el-input v-model="searchParam.salesman" style="display:block"></el-input>
                        </el-form-item>
                    </el-col>
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
                        <el-form-item label="是否奖金激励:">
                            <dictionary-select option-name="BONUSINCENTIVE_FLAG"  v-model="searchParam.bonusIncentiveFlag" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
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
            <export-button v-permission="'/myBusiness/export'" :href="Api.myBusiness.export" :params="searchParam" :download-name="'我的业务'"></export-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="运单号" prop="code" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="客户名称" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.dispatch.customer?scope.row.dispatch.customer.name:""}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="240" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;display:inline-block;" @click="showLine(scope.row.dispatch)">{{scope.row.dispatch.dispatchLine.lineName}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="dispatch.dispatchLine.startStation.name" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="dispatch.dispatchLine.endStation.name" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车牌号" prop="dispatch.dispatchVehicle.vehicleLicenseNum" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.dispatch.dispatchVehicle.vehicleLicenseNum}  （${scope.row.dispatch.dispatchVehicle.specification} 米）`}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车型" prop="dispatch.dispatchVehicle.specification" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车辆属性" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" v-model="scope.row.dispatch.dispatchVehicle.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单状态" prop="status" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAY_BILL_STATUS" :value="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="实际应收金额" prop="receiveConfirm.actualReceiveAmount" min-width="120" show-overflow-tooltip>

                </el-table-column>
                <el-table-column header-align="center" label="应收结算状态" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.receiveConfirm.billStatus===true ? "已结算" : "未结算"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="应收收款状态" prop="receiveConfirm.payeeStatus" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="PAYEE_STATUS" :value="scope.row.receiveConfirm.payeeStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="应付结算状态" prop="payableConfirm.settlementState" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SETTLEMENT_STATE" :value="scope.row.payableConfirm.settlementState"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="实际应付金额" prop="dispatch.dispatchPrice.actualPaidVehicleAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="业务员" prop="dispatch.salesman" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="业务员所属组织" prop="dispatch.salesmanOrgObject" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.dispatch.salesmanOrgObject?scope.row.dispatch.salesmanOrgObject.name:scope.row.salesmanOrgName}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="是否享受奖金激励" prop="bonusIncentiveFlag" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="BONUSINCENTIVE_FLAG" :value="scope.row.bonusIncentiveFlag"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="提成金额" min-width="120" show-overflow-tooltip>
                    <!--<template slot-scope="scope">
                        {{scope.row.receiveConfirm.billStatus===true && scope.row.payableConfirm.settlementState==='ALREADY_SETTLEMENT'}}
                    </template>-->
                </el-table-column>
                <el-table-column header-align="center" label="发车时间" prop="actualDepartureTime" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.dispatch.driverDepartureTime && Math.abs(new Date(scope.row.actualDepartureTime).getTime() - new Date(scope.row.dispatch.driverDepartureTime).getTime())>1800000" style="color:red;">{{scope.row.actualDepartureTime}}</span>
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
        <!-- 线路信息详情 -->
        <line-info v-if="showLineInfo"  :dialogVisible="showLineInfo" @close="hideLineInfo"  :currentRow="currentRow"></line-info>

    </el-container>

</template>

<script>
    import {Http,Api,Common} from 'src/global'
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
                    customerCode: '',
                    vehicleCode: '',
                    code: '',//运单号
                    status: '',//运单状态
                    salesman: this.$store.getters.user.name+' '+this.$store.getters.user.username,
                    vehicleNature: '',
                    returnAmountPaymentStatus: '',
                    bonusIncentiveFlag: '',
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
                    customerCode: '',
                    vehicleCode: '',
                    code: '',//运单号
                    status: '',//运单状态
                    salesman: this.$store.getters.user.name+' '+this.$store.getters.user.username,
                    vehicleNature: '',
                    returnAmountPaymentStatus: '',
                    bonusIncentiveFlag: '',
                    receiveStatus: '',//应收结算状态
                    startActualDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.myBusiness.page,{ params : vm.searchParam }, result => {
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
            showWayBill(row){ //运单详情------------------------------------
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.code}});
                // window.open(href, '_blank');
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.code}});
            },
            showLine(row){//线路详情
                this.currentRow = row;
                this.showLineInfo = true;
            },
            hideLineInfo(){//关闭线路详情
                this.showLineInfo = false;
            },
        }
    }
</script>

<style scoped>

</style>
