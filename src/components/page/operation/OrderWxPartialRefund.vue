<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>定货费退款</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header height class="content-header">
            <el-form :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="订单编号:">
                            <el-input v-model="searchParam.orderCode" style="display:block" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode" style="display:block" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机">
                            <driver-select ref="addVehicleFormDriverName" v-model="searchParam.driverId"
                                           :is-allow="true" style="display: block"></driver-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:" prop="vehicleLicenseNum">
                            <vehicle-select  v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>

                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start" :end-date="searchParam.endExpectDepartureTime" :disabled-future-date="false" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end" :start-date="searchParam.startExpectDepartureTime" :disabled-future-date="false" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="退款标识:">
                            <dictionary-select v-model="searchParam.wxRefundFlag" option-name="SEARCH_ORDER_BID_RECORD_WX_REFUND_FLAG" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" style="float: right">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" @click="resetSearchParam" size="small">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <!-- table -->
            <el-table v-loading="isLoading" :data="searchResult.result" element-loading-text="拼命加载中"
                      class="content-table" size="small" border fit highlight-current-row stripe>
                <el-table-column label="订单编号" header-align="center" prop="orderCode" min-width="150">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showDetail(scope.row.orderBid.order)">{{scope.row.orderCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="竞价编号" header-align="center" prop="bidCode" min-width="150"/>
                <el-table-column label="运单号" header-align="center" prop="orderBid.order.dispatch.waybillCode" min-width="150">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" v-if="scope.row.orderBid.order.dispatch.waybill ? scope.row.orderBid.order.dispatch.waybill.departureFlag : false" @click="showWayBill(scope.row.orderBid.order.dispatch.waybillCode)">{{scope.row.orderBid ? (scope.row.orderBid.order ? (scope.row.orderBid.order.dispatch ? scope.row.orderBid.order.dispatch.waybillCode : '') : '') : ''}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="车牌号" header-align="center" prop="orderBid.order.dispatch.dispatchVehicle.vehicleLicenseNum" min-width="150">
                    <template slot-scope="scope">
                        {{((scope.row.orderBid ? (scope.row.orderBid.order ? (scope.row.orderBid.order.dispatch ? (scope.row.orderBid.order.dispatch.waybillCode ? scope.row.orderBid.order.dispatch.waybillCode : '') : '') : '') : '') == '') ? '' : (scope.row.orderBid ? (scope.row.orderBid.order ? (scope.row.orderBid.order.dispatch ? (scope.row.orderBid.order.dispatch.dispatchVehicle ?  scope.row.orderBid.order.dispatch.dispatchVehicle.vehicleLicenseNum : '') : '') : '') : '')}}
                    </template>
                </el-table-column>
                <el-table-column label="所属大区" header-align="center" prop="orderBid.order.regionOrg.name" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.orderBid ? (scope.row.orderBid.order ? (scope.row.orderBid.order.regionOrg ? scope.row.orderBid.order.regionOrg.name : '') : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="所属分区" header-align="center" prop="orderBid.order.belongOrg.name" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.orderBid ? (scope.row.orderBid.order ? (scope.row.orderBid.order.belongOrg ? scope.row.orderBid.order.belongOrg.name : '') : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="用户类型" header-align="center" prop="userType" min-width="150">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ORDER_BID_USER_TYPE" :value="scope.row.userType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="中标金额" header-align="center" prop="price" min-width="150"></el-table-column>
                <el-table-column label="确认中标时间" header-align="center" prop="orderBid.confirmBidTime" min-width="150"></el-table-column>
                <el-table-column label="定货费" header-align="center" prop="orderCostPrice" min-width="150"></el-table-column>
                <!--<el-table-column label="定货费支付标识" header-align="center" prop="payFLag" min-width="150">
                    <template slot-scope="scope">
                        <datadictionary-name option-name="ORDER_BID_RECORD_PAY_FLAG" :value="scope.row.payFlag" />
                    </template>
                </el-table-column>-->
                <el-table-column label="定货费退款金额" header-align="center" prop="refundAmountPrice" min-width="150"></el-table-column>
                <el-table-column label="退款标识" header-align="center" prop="wxRefundFlag" min-width="150">
                    <template slot-scope="scope">
                        <datadictionary-name option-name="ORDER_BID_RECORD_WX_REFUND_FLAG" :value="scope.row.wxRefundFlag" />
                    </template>
                </el-table-column>
                <el-table-column label="确认发车时间" header-align="center" prop="orderBid.order.dispatch.waybill.actualDepartureTime" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.orderBid ? (scope.row.orderBid.order ? (scope.row.orderBid.order.dispatch ? (scope.row.orderBid.order.dispatch.waybill ?  scope.row.orderBid.order.dispatch.waybill.actualDepartureTime : '') : '') : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="报价时间" header-align="center" prop="bidTime" min-width="150"></el-table-column>
                <el-table-column label="线路名称" header-align="center" prop="orderBid.order.line.name" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.orderBid ? (scope.row.orderBid.order ? (scope.row.orderBid.order.dispatch ? (scope.row.orderBid.order.dispatch.dispatchLine ? scope.row.orderBid.order.dispatch.dispatchLine.lineName:''):'') : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="始发区域" header-align="center" prop="orderBid.order.line.departStation.name" min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.orderBid ? (scope.row.orderBid.order ? (scope.row.orderBid.order.dispatch?(scope.row.orderBid.order.dispatch.dispatchLine.startStation.city.name+scope.row.orderBid.order.dispatch.dispatchLine.startStation.area.name):'') : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="目的区域" header-align="center" prop="orderBid.order.line.destStation.name" min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.orderBid ? (scope.row.orderBid.order ? (scope.row.orderBid.order.dispatch?(scope.row.orderBid.order.dispatch.dispatchLine.endStation.city.name+scope.row.orderBid.order.dispatch.dispatchLine.endStation.area.name):'') : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="订单预计发车时间" header-align="center" prop="orderBid.order.expectDepartureTime" min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.orderBid ? (scope.row.orderBid.order ? scope.row.orderBid.order.expectDepartureTime : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="订单预计到达时间" header-align="center" prop="orderBid.order.expectArrivalTime" min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.orderBid ? (scope.row.orderBid.order ? scope.row.orderBid.order.expectArrivalTime : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="竞价参考车价" header-align="center" prop="orderBid.paidVehicleAmount" min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.orderBid ? scope.row.orderBid.paidVehicleAmount : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="订单车型" header-align="center" prop="orderBid.order.vehicleLength" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.orderBid.order ? scope.row.orderBid.order.vehicleLength : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="订单车厢类型" header-align="center" prop="orderBid.order.vanType" min-width="150">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE" :value="scope.row.orderBid.order ? scope.row.orderBid.order.vanType : ''"/>
                    </template>
                </el-table-column>
                <el-table-column label="司机姓名" header-align="center" prop="driverName" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.driver ? scope.row.driver.name : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="司机电话" header-align="center" prop="driverMobile" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.driver ? scope.row.driver.mobile : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="备注" header-align="center" prop="remark" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" header-align="center" align="center" fixed="left"
                                 min-width="140">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="showModifyRefundAmountPrice(scope.row)"
                                   v-permission="'/orderBidRecord/modifyRefundAmountPrice'"
                                   :disabled="scope.row.wxRefundFlag === 'REFUND' || scope.row.payFlag !== 'PAY' || (scope.row.orderBid.order.dispatch.waybill ? (scope.row.orderBid.order.dispatch.waybill.departureFlag === false) : true)">
                            修改退款金额
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
        <!-- 订单弹出框 -->
        <order-edit v-if="OrderEditFlag"  :dialogVisible="OrderEditFlag" @close="hideOrderEdit" :currentRow="currentRow" :type="editType"></order-edit>
        <!-- 修改退款金额弹框 -->
        <el-dialog
            title="修改定货费退款金额"
            v-if="showModifyRefundAmountPriceFlag"
            :visible.sync="showModifyRefundAmountPriceFlag"
            width="30%"
            @close="closeModifyDialog">
            <el-form ref="orderBidRecord" :model="orderBidRecord" label-width="120px" :rules="rules">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="定货费退款金额:" prop="refundAmountPrice">
                            <el-input v-model="orderBidRecord.refundAmountPrice"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeModifyDialog">取 消</el-button>
                <el-button type="primary" @click="submitModifyDialog">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>
<script>
    import {Http, Api, Constant, Common} from "src/global";
    import dataDec from "src/components/common/data/data.js";
    import DatadictionaryName from "../../common/select/DatadictionaryName";
    import axios from "axios";
    import orderSend from "../operation/myDispatch/OrderSendDialog";
    import orderEdit from './OrderEdit.vue'
    import {Validate} from 'src/global/validate'
    import {mapGetters} from 'vuex';

    const MaxDay = 31; // 最大天数
    export default {
        data() {
            let user = this.$store.getters.user;
            return {
                Api: Api,
                constant: Constant,
                validate: Validate,//校验
                currentRow: {
                    order: {}
                },//操作行的数据
                OrderEditFlag: false, // 订单详情
                editType: '',  // 订单详情类型
                exportLoading: true, // 导出状态
                showAddSend: false, //加车派车
                searchParam: {
                    orderCode: '',
                    waybillCode: '',
                    currentPage: 1,
                    pageSize: 10,
                    driverId: '',
                    orgCode: '',
                    vehicleCode: '',
                    wxRefundFlag: 'NO_REFUND',
                    startActualDepartureTime: Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(new Date(new Date().getTime() - 3 * 24 * 3600 * 1000).getFullYear(), new Date(new Date().getTime() - 3 * 24 * 3600 * 1000).getMonth(), new Date(new Date().getTime() - 3 * 24 * 3600 * 1000).getDate(), 0, 0, 0)),
                    endActualDepartureTime: Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(new Date(new Date().getTime() + 3 * 24 * 3600 * 1000).getFullYear(), new Date(new Date().getTime() + 3 * 24 * 3600 * 1000).getMonth(), new Date(new Date().getTime() + 3 * 24 * 3600 * 1000).getDate(), 23, 59, 59)),
                    currentOrgCode: this.$store.getters.user.orgCode

                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                permission: {
                    /*权限*/
                    export: "/orderBidRecord/export", //导出
                },
                checkRule: {},
                checkedList: [],
                dataDec: dataDec,
                isLoading: false,
                showModifyRefundAmountPriceFlag: false,
                orderBidRecord: {
                    refundAmountPrice: '',
                },
                rules: {
                    refundAmountPrice: [
                    {required: true, message: '请输入退款金额', trigger: 'blur'},
                    Validate.notZeroMoneyTrue
                ],
            },

            };
        },
        components: {
            orderSend,
            DatadictionaryName,
            orderEdit,
            ...mapGetters([
                'user'
            ]),

        },
        mounted() {
        },
        // watch: {
        //     $route() {
        //         this.searchList();
        //     }
        // },
        created() {
            this.searchList();
        },
        methods: {
            showWayBill(waybillCode){ //运单详情------------------------------------
                this.$router.push({path: '/operation/waybillDetail', query: {code: waybillCode}})
            },
            showModifyRefundAmountPrice(row){
                let vm = this
                vm.orderBidRecord.id = row.id
                vm.orderBidRecord.refundAmountPrice = row.refundAmountPrice
                vm.orderBidRecord.orderCostPrice = row.orderCostPrice
                vm.showModifyRefundAmountPriceFlag = true
            },
            submitModifyDialog(){
                let vm = this;
                this.$refs.orderBidRecord.validate((val) => {
                    if(val){
                        if (parseFloat(vm.orderBidRecord.orderCostPrice) - 100 > parseFloat(vm.orderBidRecord.refundAmountPrice)) {
                            vm.$message.error("退款金额不能小于" + (parseFloat(vm.orderBidRecord.orderCostPrice) - 100))
                            return
                        }
                        if (parseFloat(vm.orderBidRecord.orderCostPrice) < parseFloat(vm.orderBidRecord.refundAmountPrice)) {
                            vm.$message.error("退款金额不能大于定货费" + (parseFloat(vm.orderBidRecord.orderCostPrice)))
                            return
                        }
                        Http.post(
                            Api.orderBidRecord.modifyRefundAmountPrice,
                            vm.orderBidRecord,
                            result => {
                                vm.$message.success('修改退款金额成功')
                                vm.closeModifyDialog()
                                vm.searchList();
                            },
                            result => {
                                vm.$message.error(result.message)
                            }
                        );
                    }
                })
            },
            searchList() {
                let vm = this;
                vm.isLoading = true;
                Http.get(
                    Api.orderBidRecord.confirmPage,
                    {params: vm.searchParam},
                    result => {
                        this.searchResult.result = result.result;
                        this.searchResult.totalCount = result.totalCount;
                        this.searchParam.currentPage = result.currentPage;
                        this.searchParam.pageSize = result.pageSize;
                        vm.isLoading = false;
                    },
                    result => {
                        vm.isLoading = false;
                    }
                );
            },
            resetSearchParam() {
                this.searchParam = {
                    orderCode: '',
                    waybillCode: '',
                    currentPage: 1,
                    pageSize: 10,
                    driverId: '',
                    driverMobile: '',
                    orgCode: '',
                    vehicleCode: '',
                    wxRefundFlag: 'NO_REFUND',
                    startActualDepartureTime: Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() - 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() - 3*24*3600*1000).getMonth(), new Date(new Date().getTime() - 3*24*3600*1000).getDate(),0,0,0)),
                    endActualDepartureTime: Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() + 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() + 3*24*3600*1000).getMonth(), new Date(new Date().getTime() + 3*24*3600*1000).getDate(),23,59,59)),
                    currentOrgCode: this.$store.getters.user.orgCode
                }
            },
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            },
            showDetail(item){
                console.log(item)
                this.currentRow = item
                this.OrderEditFlag =true
                this.editType = 'show'
            },
            hideOrderEdit(){
                this.OrderEditFlag = false
            },
            closeModifyDialog() {
                let vm = this
                vm.orderBidRecord = {
                    refundAmountPrice: '',
                }
                vm.showModifyRefundAmountPriceFlag = false
            },

        }
    };
</script>
<style>
</style>

