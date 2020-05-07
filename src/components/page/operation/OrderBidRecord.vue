<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>司机报价</el-breadcrumb-item>
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
                        <el-form-item label="竞价编号:">
                            <el-input v-model="searchParam.bidCode" style="display:block" size="small" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机">
                            <driver-select ref="addVehicleFormDriverName" v-model="searchParam.driverId"
                                           :is-allow="true" style="display: block"></driver-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态:" prop="status">
                            <dictionary-select v-model="searchParam.status" style="display:block;"
                                               option-name="ORDER_BID_RECORD_STATUS"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="6">
                        <el-form-item label="车型:">
                            <dictionary-select style="display:block;" v-model="searchParam.vehicleLength"
                                               option-name="VEHICLE_SPECIFICATION"></dictionary-select>
                        </el-form-item>
                    </el-col>-->
                </el-row>
                <el-row>
                    <!--<el-col :span="6">
                        <el-form-item label="厢型:" prop="vanType">
                            <dictionary-select v-model="searchParam.vanType" style="display:block;"
                                               option-name="VEHICLE_COMPARTMENT_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>-->
                    <el-col :span="6">
                        <el-form-item label="司机报价:" prop="price">
                            <el-input v-model="searchParam.price" style="display:block;" size="small" clearable/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预计发车开始:">
                            <date-picker-single v-model="searchParam.startExpectDepartureTime" date-type="start" :end-date="searchParam.endExpectDepartureTime" :disabled-future-date="false" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预计发车结束:">
                            <date-picker-single v-model="searchParam.endExpectDepartureTime" date-type="end" :start-date="searchParam.startExpectDepartureTime" :disabled-future-date="false" max-range-days="90"></date-picker-single>
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
            <!-- btn -->
            <export-button v-permission="permission.export" :href="Api.orderBidRecord.export" :params="searchParam" :download-name="'司机报价'" style="display: inline-block"></export-button>
            <!-- table -->
            <el-table v-loading="isLoading" :data="searchResult.result" element-loading-text="拼命加载中"
                      class="content-table" size="small" border fit highlight-current-row stripe>
                <el-table-column label="订单编号" header-align="center" prop="orderCode" min-width="150">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showDetail(scope.row.orderBid.order)">{{scope.row.orderCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="竞价单编号" header-align="center" prop="bidCode" min-width="150"/>
                <el-table-column label="所属大区" header-align="center" prop="order.regionOrg.name" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.orderBid ? (scope.row.orderBid.order ? (scope.row.orderBid.order.regionOrg ? scope.row.orderBid.order.regionOrg.name : '') : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="所属分区" header-align="center" prop="order.belongOrg.name" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.orderBid ? (scope.row.orderBid.order ? (scope.row.orderBid.order.belongOrg ? scope.row.orderBid.order.belongOrg.name : '') : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="用户类型" header-align="center" prop="userType" min-width="150">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ORDER_BID_USER_TYPE" :value="scope.row.userType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="状态" header-align="center" prop="status" min-width="150">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ORDER_BID_RECORD_STATUS" :value="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="报价金额" header-align="center" prop="price" min-width="150"></el-table-column>
                <el-table-column label="报价时间" header-align="center" prop="bidTime" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="取消人" prop="cancelUser" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="取消时间" prop="cancelTime" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="申请取消时间" prop="applyCancelTime" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="取消原因" prop="cancelRemark" min-width="250"></el-table-column>
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
                <!-- <el-table-column label="应付车价" header-align="center" prop="order.paidVehicleAmount" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.order ? (scope.row.order.dispatch ? (scope.row.order.dispatch.dispatchPrice ? (scope.row.order.dispatch.dispatchPrice.paidVehicleAmount):''):'') : ''}}
                    </template>
                </el-table-column>-->
                <el-table-column label="供应商" header-align="center" prop="supplier.name" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.supplier ? scope.row.supplier.name : ''}}
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
                <el-table-column label="定货费" header-align="center" prop="orderCostPrice" min-width="150"></el-table-column>
                <el-table-column label="定货费支付标识" header-align="center" prop="payFLag" min-width="150">
                    <template slot-scope="scope">
                        <datadictionary-name option-name="ORDER_BID_RECORD_PAY_FLAG" :value="scope.row.payFlag" />
                    </template>
                </el-table-column>
                <el-table-column label="退款标识" header-align="center" prop="wxRefundFlag" min-width="150">
                    <template slot-scope="scope">
                        <datadictionary-name option-name="ORDER_BID_RECORD_WX_REFUND_FLAG" :value="scope.row.wxRefundFlag" />
                    </template>
                </el-table-column>
                <el-table-column label="指派车辆车长" header-align="center" prop="driverVehicleLength" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="承载方数" header-align="center" prop="loadSquare" width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="指派车辆箱型" header-align="center" prop="driverVanType" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE" v-model="scope.row.driverVanType"></dictionary-select-name>
                    </template>
                </el-table-column>                <el-table-column label="指派车辆" header-align="center" prop="vehicleLicenseNum" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="指派车挂" header-align="center" prop="trailerLicenseNum" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" header-align="center" prop="remark" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建人" header-align="center" prop="createUser" min-width="150"></el-table-column>
                <el-table-column label="创建时间" header-align="center" prop="createTime" min-width="150"></el-table-column>
                <el-table-column label="修改人" header-align="center" prop="modifyUser" min-width="150"></el-table-column>
                <el-table-column label="修改时间" header-align="center" prop="modifyTime" min-width="150"></el-table-column>
                <!-- <el-table-column label="抢单时效(分钟)" header-align="center" prop="" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.order ? ( scope.row.order.grabEndTime && scope.row.order.grabStartTime ? (((new Date(scope.row.order.grabEndTime).getTime() - new Date(scope.row.order.grabStartTime).getTime()))/60000).toFixed(2) : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="抢单余时（分钟）" header-align="center" prop="" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.order ? (scope.row.order.grabEndTime ? (((new Date(scope.row.order.grabEndTime).getTime() - new Date().getTime()))/60000).toFixed(2) :'') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="抢单时间" header-align="center" prop="grabTime" min-width="150"/> -->
                <!--<el-table-column label="操作" header-align="center" align="center" fixed="left" min-width="140">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="confirmDriver(scope.row)" v-permission="'/orderBid/confirmOrderBid'" :disabled="scope.row.status != dataDec.ORDER_BID_RECORD_STATUS[0].code">确认</el-button>
                        <el-button type="text" size="mini" @click="setDriver(scope.row)" v-permission="'/orderBid/dispatchOrderBid'" :disabled="scope.row.status != dataDec.ORDER_BID_RECORD_STATUS[1].code">指派车辆</el-button>
                    </template>
                </el-table-column>-->
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
        <!-- 派车弹出框 -->
        <order-send
            v-if="showAddSend" :dialogVisible="showAddSend" @close="hideAddSend" :currentRow="currentRow" :dispatchVehicle="currentRow.vehicle" :dispatchPrice="currentRow.order.dispatch.dispatchPrice" :driverInfo="currentRow.driver"></order-send>
        <!-- 订单弹出框 -->
        <order-edit v-if="OrderEditFlag"  :dialogVisible="OrderEditFlag" @close="hideOrderEdit" :currentRow="currentRow" :type="editType"></order-edit>

        <!-- 指派车辆弹出框 -->
        <el-dialog
            title="指派车辆"
            v-if="showDriver"
            :visible.sync="showDriver"
            width="50%"
            @close="closeDriver"
            >
            <el-form ref="dispatchVehicle" :model="dispatchVehicle" label-width="80px">
                <el-row>
                    <el-col :span="12">
                         <el-form-item label="车型:" prop="vehicleCode">
                            <dictionary-select style="display:block;" v-model="currentRow.order.vehicleLength" option-name="VEHICLE_SPECIFICATION" disabled></dictionary-select>
                         </el-form-item>
                    </el-col>
                    <el-col :span="12">
                         <el-form-item label="厢型:" prop="vehicleCode">
                            <dictionary-select style="display:block;" v-model="currentRow.order.vanType" option-name="VEHICLE_COMPARTMENT_TYPE" disabled></dictionary-select>
                         </el-form-item>
                    </el-col>
                </el-row>
               <el-row>
                    <el-col :span="12">
                        <el-form-item label="车牌号码:" prop="vehicleCode" :rules="[validate.required('车牌号码',true)]">
                            <vehicle-select ref="vehicleLicenseNum" v-model="dispatchVehicle.vehicleCode" :type="[constant.VEHICLE_TYPE.VAN,constant.VEHICLE_TYPE.TRACTOR]" :is-allow="true"
                                            @change-option="queryVehicleInfo" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="挂厢号码:" prop="trailerCode">
                            <vehicle-select ref="trailerLicenseNum" v-model="dispatchVehicle.trailerCode" @change-option="queryTrailerVehicleInfo"
                                            :type="[constant.VEHICLE_TYPE.TRAILER]" :disabled="dispatchVehicle.isTrailerLicenseNumDisabled" :is-allow="true"
                                            :licenseNumber.sync="dispatchVehicle.trailerLicenseNum" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
               </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDriver">取 消</el-button>
                <el-button type="primary" @click="submitDriver">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>
<script>
    //司机报价页面
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
                constant:Constant,
                validate: Validate,//校验
                currentRow: {
                    order:{}
                },//操作行的数据
                OrderEditFlag:false, // 订单详情
                editType:'',  // 订单详情类型
                exportLoading: true, // 导出状态
                showAddSend: false, //加车派车
                searchParam: {
                    orderCode: "",
                    bidCode: "",
                    status: "",
                    currentPage: 1,
                    pageSize: 10,
                    driverId: '',
                    driverMobile: '',
                    vehicleLength: '',
                    vanType: '',
                    price:'',
                    orgCode: '',
                    startCreateTime: '',
                    endCreateTime: '',
                    startExpectDepartureTime: Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() - 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() - 3*24*3600*1000).getMonth(), new Date(new Date().getTime() - 3*24*3600*1000).getDate(),0,0,0)),
                    endExpectDepartureTime: Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() + 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() + 3*24*3600*1000).getMonth(), new Date(new Date().getTime() + 3*24*3600*1000).getDate(),23,59,59)),
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
                scheduleEdit: {
                    title: "",
                    flag: false
                },
                scheduleEditForm: {
                    type: [],
                    specification: ""
                },
                checkedList: [],
                dataDec: dataDec,
                isLoading: false,
                showDriver:false,
                dispatchVehicle:{
                    vehicleCode:'',
                    trailerCode:'',
                    licenseNumber:'',
                    trailerLicenseNum:''
                }
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
            submitDriver(){
                let vm = this;
                console.log(this.dispatchVehicle.vehicleCode,this.dispatchVehicle.trailerCode,this.currentRow)
                let postData = this.currentRow
                postData.order.licenseNumber = this.dispatchVehicle.licenseNumber
                postData.order.trailerLicenseNum = this.dispatchVehicle.trailerLicenseNum
                this.$refs.dispatchVehicle.validate((val) => {
                    if(val){
                        Http.post(
                            Api.orderBid.dispatchOrder,
                            postData,
                            result => {
                                   vm.$message.success('指派成功')
                                   vm.closeDriver()
                                   vm.searchList();
                            },
                            result => {
                                vm.$message.error(result.message)
                            }
                        );
                    }
                })
            },
            closeDriver(){
                this.showDriver = false
                this.dispatchVehicle = {
                    vehicleCode:'',
                    trailerCode:'',
                    licenseNumber:'',
                    trailerLicenseNum:''
                }
            },
            queryVehicleInfo(obj) {
                if(obj){
                    this.dispatchVehicle.licenseNumber = obj.licenseNumber
                }else{
                    this.$nextTick(() => {
                       this.dispatchVehicle.licenseNumber = this.$refs.vehicleLicenseNum.currentValue
                    })
                }
            },
            getDriverInfo(){

            },
            queryTrailerVehicleInfo(obj){
                if(obj){

                    this.dispatchVehicle.trailerLicenseNum = obj.licenseNumber
                }else{
                    this.dispatchVehicle.trailerLicenseNum = ''
                }
            },
            confirmDriver(item){
                let vm = this
                console.log(item)
                this.$confirm('确定选择该司机?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    vm.confirmDriverLoading = true;
                    Http.post(
                        Api.orderBidRecord.confirmOrderBidRecord,
                        {id:item.id},
                        result => {
                           vm.$message.success('确认成功')
                           vm.searchList();
                        },
                        result => {
                           vm.$message.error(result.message)
                        }
                    );
                })
            },
            // sendVehicle(row) {
            //     console.log(row)
            //     //派车---------------------------------------
            //     this.currentRow = row;
            //     this.showAddSend = true;
            // },
            setDriver(row){
                this.currentRow = row.orderBid;
                this.showDriver = true
            },
            hideAddSend() {
                // 关闭派车------------------------------------
                this.showAddSend = false;
                this.searchList();
            },
            searchList() {
                let vm = this;
                vm.isLoading = true;
                Http.get(
                    Api.orderBidRecord.page,
                    {params: vm.searchParam},
                    result => {
                        this.searchResult.result = result.result;
                        console.log(this.searchResult.result)
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
                    orderCode: "",
                    bidCode: '',
                    status: "",
                    currentPage: 1,
                    pageSize: 10,
                    driverId: '',
                    driverMobile: '',
                    vehicleLength: '',
                    vanType: '',
                    price:'',
                    orgCode: '',
                    startCreateTime: '',
                    endCreateTime: '',
                    startExpectDepartureTime: Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() - 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() - 3*24*3600*1000).getMonth(), new Date(new Date().getTime() - 3*24*3600*1000).getDate(),0,0,0)),
                    endExpectDepartureTime: Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() + 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() + 3*24*3600*1000).getMonth(), new Date(new Date().getTime() + 3*24*3600*1000).getDate(),23,59,59)),
                    currentOrgCode: this.$store.getters.user.orgCode
                }
            },
            deleteSchedule() {
            },
            // 提交排班
            scheduleEditSubmit() {
            },
            // 重置排班
            scheduleEditClose() {
                this.scheduleEdit.flag = false;
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
        }
    };
</script>
<style>
</style>

