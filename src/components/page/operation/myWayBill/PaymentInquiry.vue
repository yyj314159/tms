<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 运单管理</el-breadcrumb-item>
                <el-breadcrumb-item>付款查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input  v-model="searchParam.code" style="display:block;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属组织:">
                            <current-org-select v-model="searchParam.belongOrgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="付款状态:">
                            <dictionary-select style="display: block" option-name="PAY_STATUS" v-model="searchParam.payment"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="发车时间:">
                            <el-date-picker
                                v-model="searchParam.departureTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="float: right">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="所属分区" prop="dispatch.belongOrg.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="客户" min-width="140">
                    <template slot-scope="scope">
                        {{scope.row.dispatch.customer?scope.row.dispatch.customer.name:""}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="280" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showLine(scope.row.dispatch)">{{scope.row.dispatch.dispatchLine.lineName}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路类型" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_TYPE" :value="scope.row.dispatch.dispatchLine.lineType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单号" min-width="140">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row.code)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单属性" min-width="100">
                    <template slot-scope="scope">
                        {{scope.row.dispatch.tempVehicle? "临时":"正班"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车牌号码" prop="dispatch.dispatchVehicle.vehicleLicenseNum" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="挂厢号码" prop="dispatch.dispatchVehicle.trailerLicenseNum" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车型" prop="dispatch.dispatchVehicle.specification" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="车辆属性" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" v-model="scope.row.dispatch.dispatchVehicle.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="司机姓名" prop="dispatch.dispatchVehicle.driver.name" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="司机电话" prop="dispatch.dispatchVehicle.driver.mobile" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="运单状态" prop="status" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAY_BILL_STATUS" :value="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="预付打卡" prop="dispatch.dispatchPrice.prepaidCardAmount" min-width="90"></el-table-column>
                <el-table-column header-align="center" label="打卡银行" prop="dispatch.dispatchVehicle.driver.openingBank" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="银行卡号" prop="dispatch.dispatchVehicle.driver.dueBankCardNo" min-width="200"></el-table-column>
                <el-table-column header-align="center" label="付款状态" prop="payment" min-width="90">
                    <template slot-scope="scope">
                        {{scope.row.payment!==''?(scope.row.payment?'已付款':'未付款'):''}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="发车时间" prop="dispatch.departureTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="始发站点" prop="dispatch.dispatchLine.startStation.name" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="dispatch.dispatchLine.endStation.name" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="是否回货" min-width="100">
                    <template slot-scope="scope">
                        {{scope.row.returnGoods?'是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="预计到达时间" prop="arrivalTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="司机到达时间" prop="actualArrivalTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="确认到达时间" prop="confirmArrivalTime" min-width="160"></el-table-column>
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
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import lineInfo from '../myDispatch/LineInfoDialog'

    export default {
        data() {
            return {
                isLoading: true,
                showLineInfo: false,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    vehicleCode: '',//车牌号
                    code: '',//运单号
                    payment: '',//状态
                    belongOrgCode: '',//所属区域
                    departureTime: [],//发车时间
                    startDepartureTime: '',
                    endDepartureTime: '',
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null
            }
        },
        created() {
            this.searchList();
        },
        components:{
            lineInfo
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.vehicleCode = '';
                this.searchParam.code = '';
                this.searchParam.payment = '';
                this.searchParam.belongOrgCode = '';
                this.searchParam.departureTime = [];
                this.searchParam.startDepartureTime = '';
                this.searchParam.endDepartureTime = '';
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                if(this.searchParam.departureTime){
                    this.searchParam.startDepartureTime = this.searchParam.departureTime[0];
                    this.searchParam.endDepartureTime = this.searchParam.departureTime[1];
                }else{
                    this.searchParam.startDepartureTime = "";
                    this.searchParam.endDepartureTime = "";
                }
                Http.get(Api.waybill.paymentPage,{ params : vm.searchParam }, result => {
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
            showWayBill(code){ //运单详情------------------------------------
                this.$router.push({ path: '/operation/waybillDetail',query: {code: code}});
            },
            showLine(row){//线路详情
                this.currentRow = row;
                this.showLineInfo = true;
            },
            hideLineInfo(){//关闭线路详情
                this.showLineInfo = false;
            }
        }
    }
</script>

