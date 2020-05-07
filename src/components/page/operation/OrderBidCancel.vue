<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>司机竞价取消</el-breadcrumb-item>
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
                        <el-form-item label="司机姓名:">
                            <driver-select ref="addVehicleFormDriverName" v-model="searchParam.driverId"
                                           :is-allow="true" style="display: block" ></driver-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="车型:">
                            <dictionary-select style="display:block;" v-model="searchParam.vehicleLength"
                                               option-name="VEHICLE_SPECIFICATION"></dictionary-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="6">
                        <el-form-item label="状态:" prop="status">
                            <dictionary-select v-model="searchParam.status" style="display:block;"
                                               option-name="ORDER_BID_CANCEL_STATUS"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <!-- <el-col :span="6">
                        <el-form-item label="厢型:" prop="vanType">
                            <dictionary-select v-model="searchParam.vanType" style="display:block;"
                                               option-name="VEHICLE_COMPARTMENT_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col> -->
                    <!-- <el-col :span="6">
                        <el-form-item label="状态:" prop="status">
                            <dictionary-select v-model="searchParam.status" style="display:block;"
                                               option-name="ORDER_BID_CANCEL_STATUS"></dictionary-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="6" style="float: right">
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
            <export-button v-permission="permission.export" :href="Api.orderBidCancel.export" :params="searchParam" :download-name="'司机取消竞价'" style="display: inline-block"></export-button>
            <!-- table -->
            <el-table v-loading="isLoading" :data="searchResult.result" element-loading-text="拼命加载中"
                      class="content-table" size="small" border fit highlight-current-row stripe>
                <el-table-column label="订单编号" header-align="center" prop="orderBidRecord.orderBid.orderCode" min-width="150">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showDetail(scope.row.orderBidRecord.orderBid.order)">{{scope.row.orderBidRecord.orderBid.orderCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="竞价单编号" header-align="center" prop="orderBidRecord.bidCode" min-width="150"/>
                <!-- <el-table-column label="申请用户类型" header-align="center" prop="orderCode" min-width="150">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showDetail(scope.row.order)">{{scope.row.orderCode}}</a>
                    </template>
                </el-table-column> -->
                <el-table-column label="用户类型" header-align="center" prop="orderBidRecord.userType" min-width="150">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ORDER_BID_USER_TYPE" :value="scope.row.orderBidRecord.userType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="线路名称" header-align="center" prop="order.line.name" min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.order ? (scope.row.order.line ? scope.row.order.line.name : ''): ''}}
                    </template>
                </el-table-column>
                <el-table-column label="始发区域" header-align="center" prop="order.line.departStation.name" min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.order ? (scope.row.order.line ? (scope.row.order.line.departStation ? scope.row.order.line.departStation.name : "") : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="目的区域" header-align="center" prop="order.line.destStation.name" min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.order ? (scope.row.order.line ? (scope.row.order.line.destStation ? scope.row.order.line.destStation.name : "") : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="车型" header-align="center" prop="order.vehicleLength" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.order ? scope.row.order.vehicleLength : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="车厢类型" header-align="center" prop="vanType" min-width="150">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE" :value="scope.row.order ? scope.row.order.vanType : ''"/>
                    </template>
                </el-table-column>
                <el-table-column label="应付车价" header-align="center" prop="order.paidVehicleAmount" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.order ? (scope.row.order.dispatch ? (scope.row.order.dispatch.dispatchPrice ? (scope.row.order.dispatch.dispatchPrice.paidVehicleAmount):''):'') : ''}}
                    </template>
                </el-table-column> -->
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
                <el-table-column label="指派车辆车长" header-align="center" prop="orderBidRecord.driverVehicleLength" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="指派车辆箱型" header-align="center" prop="orderBidRecord.driverVanType" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE" :value="scope.row.orderBidRecord.driverVanType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="指派车辆" header-align="center" prop="vehicleLicenseNum" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="指派车挂" header-align="center" prop="trailerLicenseNum" min-width="150" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="报价金额" header-align="center" prop="price" min-width="150">
                </el-table-column>
                <el-table-column label="抢单时效(分钟)" header-align="center" prop="" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.order ? ( scope.row.order.grabEndTime && scope.row.order.grabStartTime ? (((new Date(scope.row.order.grabEndTime).getTime() - new Date(scope.row.order.grabStartTime).getTime()))/60000).toFixed(2) : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="抢单余时（分钟）" header-align="center" prop="" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.order ? (scope.row.order.grabEndTime ? (((new Date(scope.row.order.grabEndTime).getTime() - new Date().getTime()))/60000).toFixed(2) :'') : ''}}
                    </template>
                </el-table-column> -->
                <el-table-column label="取消申请时间" header-align="center" prop="applyTime" min-width="150"/>
                <el-table-column label="取消原因" header-align="center" prop="remark" min-width="150" show-overflow-tooltip/>
                <el-table-column label="状态" header-align="center" prop="status" min-width="150">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ORDER_BID_CANCEL_STATUS" :value="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="受理人" header-align="center" prop="acceptUser" min-width="150"/>
                <el-table-column label="受理时间" header-align="center" prop="acceptTime" min-width="150"/>
                <el-table-column label="受理意见" header-align="center" prop="acceptRemark" min-width="150" show-overflow-tooltip/>
                <el-table-column label="创建人" header-align="center" prop="createUser" min-width="150"/>
                <el-table-column label="创建时间" header-align="center" prop="createTime" min-width="150"/>
                <el-table-column label="修改人" header-align="center" prop="modifyUser" min-width="150"/>
                <el-table-column label="修改时间" header-align="center" prop="modifyTime" min-width="150"/>
                <el-table-column label="操作" header-align="center" align="center" fixed="left" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="confirmDriver(scope.row)" :disabled="scope.row.status !== dataDec.ORDER_BID_CANCEL_STATUS[0].code">受理</el-button>
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
        <!-- 派车弹出框 -->
        <order-send
            v-if="showAddSend" :dialogVisible="showAddSend" @close="hideAddSend" :currentRow="currentRow" :dispatchVehicle="currentRow.vehicle" :dispatchPrice="currentRow.order.dispatch.dispatchPrice" :driverInfo="currentRow.driver"></order-send>
        <!-- 订单弹出框 -->
        <order-edit v-if="OrderEditFlag"  :dialogVisible="OrderEditFlag" @close="hideOrderEdit" :currentRow="currentRow" :type="editType"></order-edit>

        <!-- 指派车辆弹出框 -->
        <el-dialog
            title="受理"
            v-if="confirmDriverFlag"
            :visible.sync="confirmDriverFlag"
            width="30%"
            @close="closeDriver"
            >
            <el-form ref="driverForm" :model="driverForm" label-width="80px">
                <el-row>
                    <el-col :span="24">
                         <el-form-item label="是否同意:" prop="status">
                             <el-switch
                                 v-model="driverForm.status"
                             >
                             </el-switch>
                         </el-form-item>
                    </el-col>
                    <el-col :span="24">
                         <el-form-item label="备注:" prop="acceptRemark">
                            <el-input v-model="driverForm.acceptRemark" size="small"></el-input>
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
    import {Http, Api, Constant, Common} from "src/global";
    import dataDec from "src/components/common/data/data.js";
    import DatadictionaryName from "../../common/select/DatadictionaryName";
    import axios from "axios";
    import orderSend from "../operation/myDispatch/OrderSendDialog";
    import orderEdit from './OrderEdit.vue'
    import {Validate} from 'src/global/validate'


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
                    vanType: ''

                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                permission: {
                    /*权限*/
                    export: "/orderBidCancel/export", //导出
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
                },
                confirmDriverFlag:false,
                driverForm:{
                    status:true,
                    acceptRemark:''
                }
            };
        },
        components: {
            orderSend,
            DatadictionaryName,
            orderEdit

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
                let postData = _.cloneDeep(this.driverForm)
                postData.id = this.currentRow.id
                postData.status = vm.formatStatus(postData.status)
                this.$refs.driverForm.validate((val) => {
                    if(val){
                        Http.post(
                            Api.orderBidCancel.approval,
                            postData,
                            result => {
                                   vm.$message.success('受理成功')
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
            formatStatus(val){
                return val?dataDec.ORDER_BID_CANCEL_STATUS[1].code:dataDec.ORDER_BID_CANCEL_STATUS[2].code
            },
            closeDriver(){
                this.confirmDriverFlag = false
                this.driverForm = {
                    status:true,
                    acceptRemark:'',
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
                this.dispatchVehicle.trailerLicenseNum = obj.licenseNumber
            },
            confirmDriver(item){
                this.confirmDriverFlag = true
                this.currentRow = item
            },
            // sendVehicle(row) {
            //     console.log(row)
            //     //派车---------------------------------------
            //     this.currentRow = row;
            //     this.showAddSend = true;
            // },
            setDriver(row){
                this.currentRow = row;
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
                    Api.orderBidCancel.page,
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
                    status: "",
                    currentPage: 1,
                    pageSize: 10,
                    driverId: '',
                    driverMobile: '',
                    vehicleLength: '',
                    vanType: ''
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

