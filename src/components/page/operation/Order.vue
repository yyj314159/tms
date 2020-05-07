<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>订单发布</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="订单编号:">
                            <el-input v-model="searchParam.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户名称:">
                            <customer-select v-model="searchParam.customerCode" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发地:">
                            <district-select  v-model="searchParam.startCityArr" style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的地:">
                            <district-select  v-model="searchParam.endCityArr" style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                           <line-select v-model="searchParam.lineId" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预计发车时间:">
                            <el-date-picker
                                v-model="searchParam.createTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="datetimerange"
                                range-separator="至"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small"
                                @change="createTimeChange">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车型:">
                            <dictionary-select
                                           style="display:block;" v-model="searchParam.vehicleLength"
                                           option-name="VEHICLE_SPECIFICATION"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="厢型:">
                             <dictionary-select
                                           v-model="searchParam.vanType" style="display:block;"
                                           option-name="VEHICLE_COMPARTMENT_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单状态:">
                             <dictionary-select
                                           v-model="searchParam.status" style="display:block;"
                                           option-name="ORDER_STATUS"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车单:">
                            <el-input v-model="searchParam.dispatchCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-permission="permission.add" size="mini" type="primary" icon="el-icon-plus" @click="showOrderEdit">新增</el-button>
            <el-button v-permission="permission.release" size="mini" type="primary"  @click="toGrabDialog" :disabled="selectList.length !== 1">发布</el-button>
             <el-button v-permission="permission.cancel" size="mini" type="primary"  @click="toCancel" :disabled="selectList.length !== 1">取消</el-button>
             <export-button v-permission="permission.export" :href="Api.order.export" :params="searchParam" :download-name="'订单管理'" style="display: inline-block"></export-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}" @selection-change="selectChange">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column header-align="center" label="订单编号" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showDetail(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="派车单编号" min-width="160" show-overflow-tooltip prop="dispatchCode">
                </el-table-column>
                <el-table-column header-align="center" label="订单状态" prop="status" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ORDER_STATUS" :value="scope.row.status?scope.row.status:''"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="客户名称" min-width="150" show-overflow-tooltip prop="customer.name"></el-table-column>
                <el-table-column header-align="center" label="所属大区" min-width="150" show-overflow-tooltip prop="regionOrg.name">
                    <template slot-scope="scope">
                        {{scope.row.regionOrg ? scope.row.regionOrg.name : ''}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="所属组织" min-width="150" show-overflow-tooltip prop="belongOrg.name"></el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="260" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.dispatch?scope.row.dispatch.dispatchLine?scope.row.dispatch.dispatchLine.lineName:'':''}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="始发区域" prop="" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.dispatch?(scope.row.dispatch.dispatchLine.startStation.city.name+scope.row.dispatch.dispatchLine.startStation.area.name):''}}
                         </div>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="目的区域" prop="dispatch.dispatchLine.endStation.name" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.dispatch?(scope.row.dispatch.dispatchLine.endStation.city.name+scope.row.dispatch.dispatchLine.endStation.area.name):''}}
                         </div>
                    </template>
                </el-table-column>
                <el-table-column label="车型" header-align="center" prop="oneWheel" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name
                        option-name="VEHICLE_SPECIFICATION"
                        :value="scope.row.vehicleLength"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="车厢类型" header-align="center" prop="vanType" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name
                        option-name="VEHICLE_COMPARTMENT_TYPE"
                        :value="scope.row.vanType"
                        />
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="参考车价" prop="paidVehicleAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="司机中标金额" prop="confirmPrice" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="预付款" prop="prepaidCardAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="货到款" prop="deliveryAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="油卡金额" prop="oilCardAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路里程(KM)" min-width="120" prop="dispatch.dispatchLine.distance" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="则一时效" prop="dispatch.dispatchLine.timeConsumeZeyi" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="预计发车时间" prop="expectDepartureTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="预计到车时间" prop="expectArrivalTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="备注" min-width="200" prop="remark" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="上报人" prop="reportUser" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="上报时间" prop="reportTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="取消人" prop="cancelUser" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="取消时间" prop="cancelTime" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="取消原因" prop="cancelRemark" min-width="250" show-overflow-tooltip></el-table-column>
                <el-table-column label="中标司机姓名" header-align="center" prop="driver.name" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.driver?scope.row.driver.name:''}}
                    </template>
                </el-table-column>
                <el-table-column label="中标司机电话" header-align="center" prop="driver.mobile" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.driver?scope.row.driver.mobile:''}}
                    </template>
                </el-table-column>
                <el-table-column label="指派车辆车长" header-align="center" prop="driverVehicleLength" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="承载方数" header-align="center" prop="loadSquare" width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="指派车辆箱型" header-align="center" prop="driverVanType" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE" v-model="scope.row.driverVanType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="指派车辆" header-align="center" prop="vehicleLicenseNum" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="指派车挂" header-align="center" prop="trailerLicenseNum" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建人" header-align="center" prop="createUser" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" header-align="center" prop="createTime" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="修改人" header-align="center" prop="modifyUser" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="修改时间" header-align="center" prop="modifyTime" min-width="150" show-overflow-tooltip></el-table-column>

                <el-table-column align="center" label="操作" fixed="right" min-width="200">
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="12">
                                 &nbsp;<el-button type="text" size="mini" @click="sendVehicle(scope.row)" v-permission="permission.sendVehicle" :disabled="!(scope.row.status == dataDec.ORDER_STATUS[0].code || scope.row.status == dataDec.ORDER_STATUS[1].code || scope.row.status == dataDec.ORDER_STATUS[7].code) || (scope.row.dispatch ? scope.row.dispatch.confirmStatus === 'CONFIRM' : false)"><i class="fa fa-ambulance"></i>&nbsp;&nbsp;派车</el-button>
                            </el-col>
                            <el-col :span="12">
                                &nbsp;<el-button type="text" size="mini" icon="el-icon-edit" @click="editOrder(scope.row)" v-permission="permission.modify" :disabled="!(scope.row.status == dataDec.ORDER_STATUS[0].code || scope.row.status == dataDec.ORDER_STATUS[1].code)">完善订单</el-button>
                            </el-col>
                            <!-- <el-col :span="8">
                                &nbsp;<el-button type="text" size="mini" :disabled="scope.row.status === constant.DISPATCH_STATUS.STARTED || scope.row.status === constant.DISPATCH_STATUS.IN" icon="el-icon-delete"  @click="deleteDispatch(scope.row)">清除</el-button>
                            </el-col> -->
                        </el-row>
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
        <add-send v-if="showAddSend"  :dialogVisible="showAddSend" @close="hideAddSend" :currentRow="currentRow" origin="order"></add-send>
        <!-- 订单弹出框 -->
        <order-edit v-if="OrderEditFlag"  :dialogVisible="OrderEditFlag" @close="hideOrderEdit" :currentRow="currentRow" :type="editType" :url="url"></order-edit>

        <!-- 发布要求输入抢单时间 -->
        <el-dialog
            title="抢单时间"
            :visible.sync="grabTimeFlag"
            width="50%"
            @close="grabCancel"
            >
            <el-form size="small" :model="orderForm" ref="orderForm" :rules="rules" label-width="140px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="抢单开始时间：" prop="startTime">
                            <el-date-picker
                                value-format="yyyy-MM-dd HH:mm:ss"
                                v-model="orderForm.startTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                style="width:100%"
                                @change="changeStartTime"
                                >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="抢单结束时间：" prop="endTime">
                            <el-date-picker
                                value-format="yyyy-MM-dd HH:mm:ss"
                                v-model="orderForm.endTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                style="width:100%"
                                >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="参考车价：" prop="paidVehicleAmount">
                            <el-input v-model="orderForm.paidVehicleAmount" size="small"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="司机报价通知开关：" prop="quotedPriceDingTalkFlag">
                            <el-switch v-model="orderForm.quotedPriceDingTalkFlag" active-color="#13ce66" inactive-color="#ff4949"
                                       active-text="开启" inactive-text="关闭" ></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="grabCancel">取 消</el-button>
                <el-button type="primary" @click="goGrab">确 定</el-button>
            </span>
        </el-dialog>

        <!--取消订单原因弹框-->
        <el-dialog title="取消订单"
                   :visible.sync="cancelOrderFlag"
                   width="40%"
                   @close="cancelOrderClose">
            <el-form size="small" :model="cancelOrderForm" ref="cancelOrderForm" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="取消原因：" prop="cancelRemark" :rules="{required:true,message:'请输入取消原因！'}">
                            <el-input type="textarea" :rows="4"  :maxlength="200" placeholder="最多200个字符！" v-model="cancelOrderForm.cancelRemark" style="width: 200%;" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelOrderClose">取 消</el-button>
                <el-button type="primary" @click="goCancelOrder">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Common} from 'src/global/common'
    import {Api} from 'src/global/api'
    import {Constant} from 'src/global/constant'
    import addSend from '../operation/myDispatch/AddSendDialog'
    import orderEdit from './OrderEdit.vue'
    import dataDec from '../../common/data/data.js'
    import {Validate} from 'src/global/validate'
    import {mapGetters} from 'vuex';


    export default {
        data() {
            return {
                Api:Api,
                dataDec:dataDec,
                constant: Constant,//常量
                validate: Validate,//校验
                isLoading: true,
                showAddSend: false,//加车派车
                cancelOrderFlag: false,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    startCityArr: [],
                    startCity: '',
                    endCityArr: [],
                    endCity: '',
                    status: '',
                    createTime: [Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() - 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() - 3*24*3600*1000).getMonth(), new Date(new Date().getTime() - 3*24*3600*1000).getDate(),0,0,0)),Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() + 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() + 3*24*3600*1000).getMonth(), new Date(new Date().getTime() + 3*24*3600*1000).getDate(),23,59,59))],
                    startCreateTime: '',
                    endCreateTime: '',
                    code: '',
                    lineId:'',
                    vehicleLength:'',
                    vanType:'',
                    dispatchCode:'',
                    orgCode: '',
                    currentOrgCode: this.$store.getters.user.orgCode
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                permission:{
                     /*权限*/
                    add: "/order/add",
                    modify: "/order/modify",
                    cancel: "/order/cancel",
                    release: "/order/release",
                    export: "/order/export", //导出
                    sendVehicle:"/order/sendVehicle" // 派车
                },
                multipleSelection: [],//要操作的行
                currentRow: null,//操作行的数据
                tableHeight: window.innerHeight>800?430:null,
                OrderEditFlag:false, // 订单详情
                editType:'',  // 订单详情类型
                url:'', // 订单请求地址
                selectList:[], // 选中的内容
                grabTimeFlag:false, // 抢单时间的弹窗
                orderForm:{
                    startTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD HH:mm:ss"),
                    endTime: '',
                    quotedPriceDingTalkFlag:true,
                    paidVehicleAmount:''
                },
                cancelOrderForm:{
                    cancelRemark: '',
                    codeList: [],
                },
                rules:{
                    startTime:[
                      { required: true, message: '请输入抢单开始时间', trigger: 'blur' },
                    ],
                    endTime:[
                      { required: true, message: '请选择抢单结束时间', trigger: 'blur' }
                    ],
                    paidVehicleAmount: [
                        {required: true, message: '请输入参考车价', trigger: 'blur'},
                        Validate.money
                    ],
                }
            }
        },
        components:{
           addSend,
           orderEdit,
           ...mapGetters([
                'user'
           ]),
        },
        /*watch:{
            orderForm(val){
                const towHour = 1000 * 60 * 60 * 2
                this.orderForm.endTime = Common.date.dateFormat(val.startTime.getTime() + towHour, "YYYY-MM-DD HH:mm:ss") ;
            }
        },*/
        created() {
            this.changeStartTime();
            this.searchList();
        },
        methods: {
            changeStartTime(){
                const towHour = 1000 * 60 * 60 * 2
                this.orderForm.endTime = Common.date.dateFormat(new Date(this.orderForm.startTime).getTime() + towHour, "YYYY-MM-DD HH:mm:ss")
            },
            toGrabDialog(){
                this.grabTimeFlag = true
                this.currentRow = this.selectList[0]
                this.orderForm.paidVehicleAmount = this.currentRow.paidVehicleAmount
                this.changeStartTime();
            },
            toCancel(){ // 取消订单
                let vm = this;
                let ids = []
                ids = vm.selectList.map(el => el.code)
                vm.cancelOrderForm.codeList = ids
                vm.cancelOrderFlag = true
            },
            selectChange(val){
                this.selectList = val
            },
            resetSearchParam() {//重置参数
                this.searchParam.currentPage = 1;
                this.searchParam.pageSize = 10;
                this.searchParam.customerCode = '';
                this.searchParam.startCityArr = [];
                this.searchParam.endCityArr = [];
                this.searchParam.createTime = [Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() - 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() - 3*24*3600*1000).getMonth(), new Date(new Date().getTime() - 3*24*3600*1000).getDate(),0,0,0)),Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() + 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() + 3*24*3600*1000).getMonth(), new Date(new Date().getTime() + 3*24*3600*1000).getDate(),23,59,59))];
                this.searchParam.startCreateTime = [];
                this.searchParam.endCreateTime = [];
                this.searchParam.status = '';
                this.searchParam.code = '';
                this.searchParam.lineId = '';
                this.searchParam.vehicleLength = '';
                this.searchParam.vanType = '';
                this.searchParam.dispatchCode = '';
                this.searchParam.startCity = '';
                this.searchParam.endCity = '';
                this.searchParam.orgCode = '';
                this.searchParam.currentOrgCode = this.$store.getters.user.orgCode

            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                this.searchParam.startCity = this.searchParam.startCityArr[1];
                this.searchParam.endCity = this.searchParam.endCityArr[1];
                if(this.searchParam.createTime){
                    this.searchParam.startCreateTime = this.searchParam.createTime[0];
                    this.searchParam.endCreateTime = this.searchParam.createTime[1];
                }else{
                    this.searchParam.startCreateTime = "";
                    this.searchParam.endCreateTime = "";
                }
                Http.get(Api.order.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, result => {
                    vm.isLoading = false;
                })
            },
            grabCancel(){
                this.grabTimeFlag = false
                this.orderForm = {
                    startTime:Common.date.dateFormat(new Date(),"YYYY-MM-DD HH:mm:ss"),
                    endTime:'',
                    quotedPriceDingTalkFlag:true,
                    paidVehicleAmount:''
                }
                this.$refs.orderForm.resetFields()
            },
            goGrab(){
                this.$refs.orderForm.validate((val) => {
                    if(val){
                        if(this.orderForm.startTime>=this.orderForm.endTime){
                            this.$message.error('开始时间不能等于大于结束时间')
                            return
                        }
                        if (new Date(this.orderForm.endTime).getTime() <= new Date().getTime()) {
                            this.$message.error('结束时间不能小于等于当前时间')
                            return
                        }
                        this.toPublish()
                    }
                })
            },
            cancelOrderClose(){
                this.cancelOrderFlag = false
                this.cancelOrderForm = {
                    cancelRemark: '',
                    codeList: [],
                }
                this.$refs.cancelOrderForm.resetFields()
            },
            goCancelOrder(){
                let vm = this
                this.$refs.cancelOrderForm.validate((val) => {
                    if(val){
                        Http.post(Api.order.cancel, vm.cancelOrderForm,
                            result => {
                                vm.$message.success('取消成功')
                                vm.cancelOrderClose()
                                vm.searchList()
                            },
                            err => {
                                vm.$message.error(err.message)
                            }
                        )
                    }
                })
            },
            toPublish(){
                let vm = this;
                let ids = []
                ids = vm.selectList.map(el => el.code)
                let postData = vm.orderForm
                postData.codeList = ids
                Http.post(Api.order.release,postData,
                    result => {
                        vm.$message.success('发布成功')
                        vm.searchList()
                        vm.grabCancel()
                    },
                    err => {
                        vm.$message.error(err.message)
                    }
                )
            },
            showDetail(item){
                this.currentRow = item
                this.OrderEditFlag =true
                this.editType = 'show'
            },
            editOrder(item){
                this.currentRow = item
                this.OrderEditFlag = true
                this.editType = 'edit'
                this.url = Api.order.modify
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            sendVehicle(row){ //派车---------------------------------------
                this.currentRow = row.dispatch;
                this.showAddSend = true;
            },
            showOrderEdit(){
                this.OrderEditFlag = true
                this.editType = 'add'
                this.url = Api.order.add
            },
            hideOrderEdit(){
                this.OrderEditFlag = false
                this.searchList()
            },
            hideAddSend(){ // 关闭派车------------------------------------
                this.showAddSend = false;
                this.searchList();
            },
            deleteDispatch(row){ // 清除---------------------------------
                let ids = [];
                ids.push(row.id);
                this.$confirm('删除本条数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.dispatch.delete, ids, result => {
                        this.$message.success('删除成功！');
                        this.searchList();
                    })
                })
            },
            // 导出
            toExport(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(vm.href, {params: vm.params, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = vm.downloadName + '.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            //时间修改
            createTimeChange(createTime){
                if(createTime) {
                    this.searchParam.startCreateTime = createTime[0]
                    this.searchParam.endCreateTime = createTime[1]
                } else {
                    this.searchParam.startCreateTime = ''
                    this.searchParam.endCreateTime = ''
                }
            }
        }
    }
</script>

