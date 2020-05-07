<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 发车计划</el-breadcrumb-item>
                <el-breadcrumb-item>预派车单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:">
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
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
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
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineCode" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预计发车开始:">
                            <date-picker-single v-model="searchParam.startExpectDepartureTime" date-type="start" :end-date="searchParam.endExpectDepartureTime" max-range-days="90" :disabled-future-date="false"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预计发车结束:">
                            <date-picker-single v-model="searchParam.endExpectDepartureTime" date-type="end" :start-date="searchParam.startExpectDepartureTime" max-range-days="90" :disabled-future-date="false"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="12">-->
                        <!--<el-form-item label="预计发车时间:">-->
                            <!--<el-date-picker-->
                                <!--v-model="searchParam.expectDepartureTime"-->
                                <!--:default-time="['00:00:00', '23:59:59']"-->
                                <!--style="width: 100%"-->
                                <!--type="datetimerange"-->
                                <!--range-separator="至"-->
                                <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                                <!--start-placeholder="开始日期"-->
                                <!--end-placeholder="结束日期" size="small">-->
                            <!--</el-date-picker>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="派车单号:">
                            <el-input  v-model="searchParam.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务类型:">
                            <dictionary-select v-model="searchParam.businessType" option-name="LINE_BUSINESS_TYPE" style="display:block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="确认状态:">
                            <dictionary-select v-model="searchParam.confirmStatus" option-name="DISPATCH_CONFIRM_STATUS" style="display:block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">

            <el-button size="mini" type="danger" icon="el-icon-plus" @click="openLineSelect" v-permission="permission.newReportTempDemand">临时加车</el-button>
            <el-button v-if="exportLoading" v-permission="permission.waitDispatchExport" size="mini" type="primary" icon="el-icon-download" @click="waitDispatchExport">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}" ref="dispatchForm">
                <el-table-column header-align="center" label="派车单号" min-width="120">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="AddVehicleView(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="确认状态" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name style="color: red;" v-if="scope.row.confirmStatus==='UNASSIGNED' || scope.row.confirmStatus==='WAIT_CONFIRM'" option-name="DISPATCH_CONFIRM_STATUS" :value="scope.row.confirmStatus"></dictionary-select-name>
                        <dictionary-select-name style="color: green;" v-else option-name="DISPATCH_CONFIRM_STATUS" :value="scope.row.confirmStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="客户" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.customerName}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="260" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showLine(scope.row)">{{scope.row.lineName}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="startStationName" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="预计发车时间" prop="expectDepartureTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车辆性质" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="scope.row.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车牌号码" prop="vehicleLicenseNum" min-width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.vehicleLicenseNum">
                            {{scope.row.vehicleLicenseNum}}
                            <i v-if="scope.row.vehicleLicenseNum && scope.row.vehicleNature!=='OUT_INVITE'" @click="trackVehicle(scope.row.vehicleLicenseNum)" class="fa fa-location-arrow" style="color:#409EFF; cursor: pointer;"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="挂厢号码" prop="trailerLicenseNum" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="供应商" prop="supplierName" min-width="240" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="司机" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.driverName}}({{scope.row.driverMobile}})
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="实际发车时间" prop="actualDepartureTime" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.actualDepartureTime}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="预计到达时间" prop="expectArrivalTime" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{Common.date.dateFormat(new Date(scope.row.expectDepartureTime).getTime() + ((scope.row.timeConsumeZeyiHour ? scope.row.timeConsumeZeyiHour : 0) * 1000 * 60 * 60 + (scope.row.timeConsumeZeyiMin ? scope.row.timeConsumeZeyiMin : 0) * 1000 * 60),"YYYY-MM-DD HH:mm:ss")}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="endStationName" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="所属区域" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.regionName}} / {{scope.row.belongOrgName}}
                    </template>
                </el-table-column>

                <el-table-column header-align="center" label="应付计价方式" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_PRICE_TYPE" :value="scope.row.paidPriceType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="应付车价" prop="paidVehicleAmount" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="预付打卡" prop="prepaidCardAmount" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="GPS押金" prop="gpsDeposit" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="回单押金" prop="returnDeposit" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="回单付款" prop="returnAmount" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="回货" prop="returnGoods" min-width="80" :formatter="tableColumnBooleanFormatter"></el-table-column>
                <el-table-column header-align="center" label="业务员" prop="salesman" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="请车员" prop="carInviter" min-width="130" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="业务类型" min-width="130">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_BUSINESS_TYPE" :value="scope.row.businessType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="确认人" prop="confirmUser" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="确认时间" prop="confirmTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="删除人" prop="deleteUser" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="删除时间" prop="deleteTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="删除原因" prop="deleteRemark" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="left" min-width="145">
                    <template slot-scope="scope">
                        <el-row>
                            <el-button type="text" size="mini" v-permission="permission.zeYiAssignVehicle" :disabled="scope.row.confirmStatus === 'DELETE'||(!!scope.row.actualDepartureTime)" @click="newConfirmVehicle(scope.row)">派车</el-button>
                            <el-button type="text" size="mini" v-permission="permission.zeYiAssignSupplier" :disabled="scope.row.confirmStatus === 'DELETE'||(!!scope.row.actualDepartureTime)" @click="newSendSupplier(scope.row)">派供应商</el-button>
                            <el-button type="text" size="mini" v-permission="permission.deleteDispatch" icon="el-icon-delete" :disabled="scope.row.status === constant.DISPATCH_STATUS.STARTED || scope.row.status === constant.DISPATCH_STATUS.IN ||  scope.row.confirmStatus === 'DELETE'" @click="deleteDispatch(scope.row)"></el-button>
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

        <!-- 派车单车详情 -->
        <new-add-send-view v-if="showNewAddSendView"  :dialogVisible="showNewAddSendView" @close="hideNewAddSendView"  :currentRow="currentRow"></new-add-send-view>

        <!-- 线路信息详情 -->
        <line-info v-if="showLineInfo"  :dialogVisible="showLineInfo" @close="hideLineInfo"  :currentRow="currentRow"></line-info>

        <!-- 车辆定位 -->
        <el-dialog :title="title" :visible.sync="showTrackReplay" width="90%" :top="marginTop">
            <el-main class="content-main" style="padding: 0;">
                <iframe :src="trackReplayUrl" frameborder="0" width="100%" :height="minHeight"></iframe>
            </el-main>
        </el-dialog>

        <!-- 删除派车单 -->
        <el-dialog title="删除派车单"  :visible.sync="showDeleteDispatch" width="40%" @close="resetDeleteDispatchForm">
            <el-form size="small" :model="deleteDispatchForm" ref="deleteDispatchForm" label-width="120px">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="提醒：" style="color: red;">
                            正在删除派车单{{deleteDispatchForm.code}}，请备注原因！
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="备注：" prop="remark" :rules="validate.required('备注',true)">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model.trim="deleteDispatchForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showDeleteDispatch = false">取 消</el-button>
                <el-button size="small" type="primary" :disabled="isDeleteBtnDisabled" @click="deleteDispatchSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!--派车确认-->
        <confirm-vehicle v-if="showConfirmVehicle"  :dialogVisible="showConfirmVehicle" @close="hideConfirmVehicle" :currentRow="currentRow" from="dispatch" :currentLine="currentLine"></confirm-vehicle>

        <!--指派供应商-->
        <send-supplier v-if="showSendSupplier"  :dialogVisible="showSendSupplier" @close="hideSendSupplier" :currentRow="currentRow" from="dispatch" :currentLine="currentLine"></send-supplier>

        <!--线路选择-->
        <new-line-select v-if="showLineSelect"  :dialogVisible="showLineSelect" @close="hideLineSelect"></new-line-select>

    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Common} from 'src/global/common'
    import {Validate} from 'src/global/validate'
    import {Api} from 'src/global/api'
    import lineInfo from './LineInfoDialog'
    import {Constant} from 'src/global/constant'
    import DataDictionary from 'src/components/common/data/data.js'
    import axios from 'axios'
    //新派车确认和修改指派供应商
    import confirmVehicle from './ConfirmVehicle'
    import sendSupplier from '../CustomerOrder/SendSupplier'
    //新上报临时需求
    import newLineSelect from './newLineSelect'
    import newAddSendView from './NewAddSendView'

    export default {
        data() {
            return {
                Common: Common,
                showTrackReplay: false, // 显示车牌定位
                title: "",
                trackReplayUrl: '',
                DataDictionary:DataDictionary,
                constant: Constant,//常量
                validate: Validate,
                isLoading: true,
                showNewAddSendView: false,//新详情
                showLineInfo: false,//线路详情
                exportLoading: true,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    startCityArr: [],
                    startCity: '',
                    endCityArr: [],
                    endCity: '',
                    orgCode: '',
                    lineCode: '',
                    startCreateTime: '',
                    endCreateTime: '',
                    startExpectDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 1*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    endExpectDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() + 2*24*3600*1000),"YYYY-MM-DD 23:59:59"),
                    vehicleCode: '',
                    path: '',
                    code: '',
                    businessType: '',
                    confirmStatus: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null,//操作行的数据
                currentLine: null,//选中的线路
                tableHeight: window.innerHeight>800?430:null,
                vehicleType:'', // 加入派车界面模式
                permission: {
                    reportDemand: '/order/reportDemand',
                    reportTempDemand: '/order/temporaryAdd',

                    newReportTempDemand: '/order/newTemporaryAdd',//新临时加车
                    waitDispatchExport: '/dispatch/waitDispatchExport',
                    vehicleConfirm: '/dispatch/confirm',
                    modifyDispatch: '/dispatch/modify',
                    deleteDispatch: '/dispatch/delete',
                    zeYiAssignSupplier: '/dispatch/assignSupplier',
                    zeYiAssignVehicle: '/dispatch/assignVehicle',
                },
                //删除派车单
                showDeleteDispatch: false,
                isDeleteBtnDisabled: false,
                deleteDispatchForm: {
                    code: '',
                    remark: '',
                    ids: []
                },
                //新派车确认和修改
                showConfirmVehicle: false,
                showSendSupplier: false,
                showLineSelect: false,
            }
        },
        components:{
            //新派车详情
            newAddSendView,
            lineInfo,
            //新派车确认和修改
            confirmVehicle,
            sendSupplier,
            //新上报临时需求
            newLineSelect
        },
        created() {
            if(this.$route.query.startTime && this.$route.query.endTime){
                this.searchParam.startExpectDepartureTime = this.$route.query.startTime;
                this.searchParam.endExpectDepartureTime = this.$route.query.endTime;
                this.searchParam.confirmStatus = 'UNASSIGNED'
            }
            this.searchList();
        },
        activated(){
            if(this.$route.query.startTime && this.$route.query.endTime){
                this.searchParam.startExpectDepartureTime = this.$route.query.startTime;
                this.searchParam.endExpectDepartureTime = this.$route.query.endTime;
                this.searchParam.confirmStatus = 'UNASSIGNED'
            }
            this.searchList();
        },
        computed:{
            minHeight: function () { //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "700";
                } else if (document.documentElement.clientHeight < 700) {
                    return "500";
                } else {
                    return "600";
                }
            },
            marginTop: function () {
                if (document.documentElement.clientHeight > 900) {
                    return "10vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "6vh";
                }
            }
        },
        methods: {
            //新派车确认
            newConfirmVehicle(row){
                Http.get(Api.dispatch.queryByCode, {params: {code: row.code}}, result => {
                    this.currentRow = result.result;
                    this.showConfirmVehicle = true;
                })
            },
            hideConfirmVehicle(){
                this.showConfirmVehicle = false;
                this.searchList();
            },
            //新指派供应商
            newSendSupplier(row){
                Http.get(Api.dispatch.queryByCode, {params: {code: row.code}}, result => {
                    this.currentRow = result.result;
                    this.showSendSupplier = true;
                })
            },
            hideSendSupplier(){
                this.showSendSupplier = false;
                this.searchList();
            },
            //新上报临时需求
            openLineSelect(){
                this.showLineSelect = true;
            },
            hideLineSelect(line,type){
                this.showLineSelect = false;
                this.currentRow = null;
                this.currentLine = _.cloneDeep(line)
                if(type==='vehicle'){
                    this.showConfirmVehicle = true;
                }else if(type==='supplier'){
                    this.showSendSupplier = true;
                }
            },
             trackVehicle(vehicleNo) {
                let vm = this;
                Http.get(Api.g7.vehicleFollowUrl, {params: {vehicleNo: vehicleNo}}, result => {
                    vm.trackReplayUrl = result.result;
                    vm.title = "轨迹跟踪";
                    vm.showTrackReplay = true;
                })
            },
            tableColumnBooleanFormatter(row, column, cellValue) {
                if (cellValue) {
                    return '是';
                }
                return '否';
            },
            resetSearchParam() {//重置查询参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    startCityArr: [],
                    startCity: '',
                    endCityArr: [],
                    endCity: '',
                    orgCode: '',
                    lineCode: '',
                    startCreateTime: '',
                    endCreateTime: '',
                    startExpectDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 1*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    endExpectDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() + 2*24*3600*1000),"YYYY-MM-DD 23:59:59"),
                    vehicleCode: '',
                    path: '',
                    code: '',
                    businessType: '',
                    confirmStatus: ''
                }
            },
            searchList() {//查询
                let vm = this;
                vm.currentRow = null;
                vm.currentLine = null;

                this.searchParam.startCity = this.searchParam.startCityArr[1];
                this.searchParam.endCity = this.searchParam.endCityArr[1];
                if(!this.searchParam.endExpectDepartureTime || !this.searchParam.startExpectDepartureTime){
                    this.$message.warning('请选择预计发车时间进行查询');
                    return;
                }
                vm.isLoading = true;
                Http.get(Api.dispatch.waitSendPage,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, result => {
                    vm.isLoading = false;
                })
            },
            waitDispatchExport(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.dispatch.waitDispatchExport, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '预派车单.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
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
            AddVehicleView(row){ //派车单详情------------------------------------
                Http.get(Api.dispatch.queryByCode, {params: {code: row.code}}, result => {
                    this.currentRow = result.result;
                    this.showNewAddSendView = true;
                })
            },
            hideNewAddSendView(){ // 关闭派车单详情------------------------------------
                this.showNewAddSendView = false;
            },
            showLine(row){//线路详情
                Http.get(Api.dispatch.queryByCode, {params: {code: row.code}}, result => {
                    this.currentRow = result.result;
                    this.showLineInfo = true;
                })
            },
            hideLineInfo(){//关闭线路详情
                this.showLineInfo = false;
            },
            deleteDispatch(row){ //删除---------------------------------
                this.deleteDispatchForm.ids.push(row.id);
                this.deleteDispatchForm.code = row.code;
                this.showDeleteDispatch = true;
            },
            deleteDispatchSubmit(){
                this.$refs.deleteDispatchForm.validate((valid) => {
                    if(valid){
                        this.isDeleteBtnDisabled = true;
                        Http.post(Api.dispatch.delete, this.deleteDispatchForm, result => {
                            this.$message.success('删除成功！');
                            this.isDeleteBtnDisabled = false;
                            this.showDeleteDispatch = false;
                            this.searchList();
                        },reason => {
                            this.isDeleteBtnDisabled = false;
                        })
                    }
                })
            },
            resetDeleteDispatchForm(){
                this.deleteDispatchForm = {
                    code: '',
                    remark: '',
                    ids: []
                }
            }
        }
    }
</script>

