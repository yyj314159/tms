<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 运单管理</el-breadcrumb-item>
                <el-breadcrumb-item>运单查询</el-breadcrumb-item>
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
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start" :end-date="searchParam.endActualDepartureTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end" :start-date="searchParam.startActualDepartureTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row  v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="到达开始时间:">
                            <date-picker-single v-model="searchParam.startConfirmArrivalTime" date-type="start" :end-date="searchParam.endConfirmArrivalTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达结束时间:">
                            <date-picker-single v-model="searchParam.endConfirmArrivalTime" date-type="end" :start-date="searchParam.startConfirmArrivalTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row  v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select option-name="VEHICLE_OPERATION_MODE"  v-model="searchParam.vehicleNature" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否准点:">
                            <el-select v-model="searchParam.onTimeFlag" placeholder="请选择"  style="display:block;">
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="回单号:">
                            <el-input v-model="searchParam.receiptCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="油卡卡号:">
                            <oil-card-select v-model="searchParam.oilCardCode" style="display: block;"></oil-card-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row  v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="GPS号码:">
                            <gps-select v-model="searchParam.gpsCode" style="display:block;"></gps-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单状态:">
                            <dictionary-multiple-select option-name="WAY_BILL_STATUS" :multiple="true"  v-model="searchParam.multipleStatus" style="display:block;"></dictionary-multiple-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineId" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.shipperCode" style="display: block;"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="派车单号:">
                            <el-input  v-model="searchParam.dispatchCode" style="display:block;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车开始时间:">
                            <date-picker-single v-model="searchParam.startSendTime" date-type="start" :end-date="searchParam.endSendTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车结束时间:">
                            <date-picker-single v-model="searchParam.endSendTime" date-type="end" :start-date="searchParam.startSendTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务员:">
                            <all-user-select v-model="searchParam.salesman" style="display: block;"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="请车员:">
                            <all-user-select v-model="searchParam.carInviter" style="display: block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="text" v-show="!isMoreItemShow" @click="isMoreItemShow = true" size="small">展开更多搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="isMoreItemShow = false" size="small">收起搜索项<<
                            </el-button>
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-if="btnLoading" v-permission="'/waybill/download'" icon="el-icon-download" type="primary" size="mini" @click="templateDownload">模板下载</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>下载中...</el-button>
            <upload-excel v-permission="'/waybill/upload'" :importUrl="Api.waybill.upload" @success="uploadSuccess" btn-name="导入重量体积件数" style="display: inline-block; margin-left: 10px;"></upload-excel>
            <el-button v-if="exportLoading" icon="el-icon-download" v-permission="'/waybill/export123'" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe
                      :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="运单号" min-width="120">
                    <template slot-scope="scope">

                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="派车单号" prop="dispatch.code" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="回单号" prop="receiptCodes" min-width="240" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="运单状态" prop="status" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAY_BILL_STATUS" :value="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="所属区域" min-width="140">
                    <template slot-scope="scope">
                        {{scope.row.dispatch.region.name}} / {{scope.row.dispatch.belongOrg.name}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="客户" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.dispatch.customer?scope.row.dispatch.customer.name:""}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="590" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;display:inline-block;" @click="showLine(scope.row.dispatch)">{{scope.row.dispatch.dispatchLine.lineName}}</a>
                        {{`（${scope.row.dispatch.dispatchLine.startStation.name} —— ${scope.row.dispatch.dispatchLine.endStation.name}）`}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车牌号码" prop="dispatch.dispatchVehicle.vehicleLicenseNum" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.dispatch.dispatchVehicle.vehicleLicenseNum}  （${scope.row.dispatch.dispatchVehicle.specification} 米）`}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="挂厢号码" prop="dispatch.dispatchVehicle.trailerLicenseNum" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车辆属性" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" v-model="scope.row.dispatch.dispatchVehicle.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="供应商" prop="dispatch.dispatchVehicle.supplier.name" min-width="200"></el-table-column>
                <el-table-column header-align="center" label="司机" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.dispatch.dispatchVehicle.driver.name}}({{scope.row.dispatch.dispatchVehicle.driver.mobile}})
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="请车员" prop="carInviter" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="派车时间" prop="dispatch.sendTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="发车时间" prop="actualDepartureTime" min-width="160">
                    <template slot-scope="scope">
                        <span v-if="scope.row.dispatch.driverDepartureTime && Math.abs(new Date(scope.row.actualDepartureTime).getTime() - new Date(scope.row.dispatch.driverDepartureTime).getTime())>1800000" style="color:red;">{{scope.row.actualDepartureTime}}</span>
                        <span v-else>{{scope.row.actualDepartureTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="到达时间" prop="confirmArrivalTime" min-width="160">
                    <template slot-scope="scope">
                        <span v-if="scope.row.dispatch.actualArrivalTime && Math.abs(new Date(scope.row.confirmArrivalTime).getTime() - new Date(scope.row.actualArrivalTime).getTime())>1800000">{{scope.row.confirmArrivalTime}}</span>
                        <span v-else>{{scope.row.confirmArrivalTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="则一时效" prop="dispatch.dispatchLine.timeConsumeZeyi" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="是否准点(则一)" prop="onTimeFlag" min-width="110">
                    <template slot-scope="scope">
                        <span v-if="scope.row.onTimeFlag === true">准点</span>
                        <span v-else-if="scope.row.onTimeFlag === false" style="color: red; font-weight: bold;">晚点</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="晚点时长(则一)(分钟)" prop="overTimeMin" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="客户时效" prop="dispatch.dispatchLine.timeConsume" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="是否准点(客户)" prop="onTimeFlag" min-width="110">
                    <template slot-scope="scope">
                        <span v-if="scope.row.dispatch.customerOnTimeFlag === true">准点</span>
                        <span v-else-if="scope.row.dispatch.customerOnTimeFlag === false" style="color: red; font-weight: bold;">晚点</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <!--<el-table-column header-align="center" label="所属大区" prop="dispatch.region.name" min-width="140"></el-table-column>-->
                <!--<el-table-column header-align="center" label="所属分区" prop="dispatch.belongOrg.name" min-width="140"></el-table-column>-->
                <!--<el-table-column header-align="center" label="线路类型" min-width="100">-->
                    <!--<template slot-scope="scope">-->
                        <!--<dictionary-select-name option-name="LINE_TYPE" :value="scope.row.dispatch.dispatchLine.lineType"></dictionary-select-name>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column header-align="center" label="发车序号" prop="departureNumber" min-width="130" show-overflow-tooltip>-->
                <!--</el-table-column>-->
                <!--<el-table-column header-align="center" label="运单属性" min-width="100">-->
                    <!--<template slot-scope="scope">-->
                        <!--{{scope.row.dispatch.tempVehicle? "临时":"正班"}}-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column header-align="center" label="司机姓名" prop="dispatch.dispatchVehicle.driver.name" min-width="120"></el-table-column>-->
                <!--<el-table-column header-align="center" label="司机电话" prop="dispatch.dispatchVehicle.driver.mobile" min-width="120"></el-table-column>-->
                <!--<el-table-column header-align="center" label="需求时间" prop="dispatch.demandTime" min-width="160"></el-table-column>-->
                <!--<el-table-column header-align="center" label="派车时间" prop="dispatch.sendTime" min-width="160"></el-table-column>-->
                <!--<el-table-column header-align="center" label="预计发车时间" min-width="160">-->
                    <!--<template slot-scope="scope">-->
                        <!--{{scope.row.dispatch.dispatchLine.stopOverStation[0]?scope.row.dispatch.dispatchLine.stopOverStation[0].expectDepartureTime:''}}-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column header-align="center" label="司机签到时间" prop="" min-width="160">-->
                    <!--<template slot-scope="scope">-->
                        <!--{{scope.row.dispatch.dispatchLine.stopOverStation[0]?scope.row.dispatch.dispatchLine.stopOverStation[0].signInTime:''}}-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column header-align="center" label="司机发车时间" prop="dispatch.driverDepartureTime" min-width="160"></el-table-column>-->

                <!--<el-table-column header-align="center" label="预计到达时间" prop="arrivalTime" min-width="160"></el-table-column>-->
                <!--<el-table-column header-align="center" label="司机到达时间" prop="actualArrivalTime" min-width="160"></el-table-column>-->



                <!--<el-table-column header-align="center" label="晚点时长(客户)(分钟)" prop="dispatch.customerOverTimeMin" min-width="140"></el-table-column>-->
                <!--<el-table-column header-align="center" label="回单签收状态" min-width="100">-->
                    <!--<template slot-scope="scope">-->
                        <!--<dictionary-select-name option-name="EQUIPMENT_SIGN_STATUS" v-model="scope.row.receiptStatus"></dictionary-select-name>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column header-align="center" label="油卡卡号" prop="dispatch.dispatchPrice.oilCardNumber" min-width="140" show-overflow-tooltip></el-table-column>-->
                <!--<el-table-column header-align="center" label="油卡签收状态" min-width="100">-->
                    <!--<template slot-scope="scope">-->
                        <!--<dictionary-select-name option-name="EQUIPMENT_SIGN_STATUS" v-model="scope.row.oilCardStatus"></dictionary-select-name>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column header-align="center" label="GPS号" prop="dispatch.dispatchPrice.gpsCode" min-width="140" show-overflow-tooltip></el-table-column>-->
                <!--<el-table-column header-align="center" label="GPS签收状态" prop="gpsStatus" min-width="100">-->
                    <!--<template slot-scope="scope">-->
                        <!--<dictionary-select-name option-name="EQUIPMENT_SIGN_STATUS" v-model="scope.row.gpsStatus"></dictionary-select-name>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column header-align="center" label="应付审批状态" min-width="100">-->
                    <!--<template slot-scope="scope">-->
                        <!--<dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.paidAuditStatus"></dictionary-select-name>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column header-align="center" label="业务类型" min-width="130">-->
                    <!--<template slot-scope="scope">-->
                        <!--<dictionary-select-name option-name="LINE_BUSINESS_TYPE" :value="scope.row.dispatch.businessType"></dictionary-select-name>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column align="center" label="操作" fixed="right" min-width="80">
                    <template slot-scope="scope">
                        <el-button v-permission="'/waybill/modify'" :disabled="scope.row.status === 'BEEN_ABANDONED'" size="mini" type="text" icon="el-icon-edit" @click="modifyWaybill(scope.row)">修改</el-button>
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

        <!-- 修改运单 -->
        <modify-waybill v-if="showModify"  :dialogVisible="showModify" @close="hideModify"  :currentRow="currentRow"></modify-waybill>

    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import lineInfo from '../myDispatch/LineInfoDialog'
    import modifyWaybill from './ModifyWaybill'
    import axios from 'axios'

    export default {
        data() {
            return {
                options: [{
                    value: true,
                    label: '是'
                }, {
                    value: false,
                    label: '否'
                }],
                isLoading: false,
                btnLoading: true,
                exportLoading: true,
                showLineInfo: false,//线路信息详情
                isMoreItemShow: false,
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',//客户编号
                    code: '',//运单号
                    vehicleCode: '',//车牌号
                    vehicleNature: '',//车辆属性
                    multipleStatus: [],//状态
                    statusList: '',//状态
                    orgCode: '',//所属区域
                    tempVehicle: '',//运单属性
                    startActualDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    startConfirmArrivalTime: '',//到达时间
                    endConfirmArrivalTime: '',
                    onTimeFlag: '',
                    receiptCode: '',
                    oilCardCode: '',
                    gpsCode: '',
                    lineId: '',//线路名称
                    shipperCode: '',
                    startSendTime: '',//派车时间
                    endSendTime: '',
                    dispatchCode: '',
                    salesman: '',
                    carInviter: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],//要操作的行
                currentRow: null,//操作行的数据
                tableHeight: window.innerHeight>800?430:null,
                //修改运单
                showModify: false
            }
        },
        components:{
            lineInfo,
            modifyWaybill
        },
        created() {
            if(this.$route.query.startTime && this.$route.query.endTime){
                this.searchParam.startActualDepartureTime = this.$route.query.startTime;
                this.searchParam.endActualDepartureTime = this.$route.query.endTime;
                this.searchList();
            }
        },
        activated(){
            if(this.$route.query.startTime && this.$route.query.endTime){
                this.searchParam.startExpectDepartureTime = this.$route.query.startTime;
                this.searchParam.endExpectDepartureTime = this.$route.query.endTime;
                this.searchList();
            }
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',//客户编号
                    code: '',//运单号
                    vehicleCode: '',//车牌号
                    multipleStatus: [],//状态
                    statusList: '',//状态
                    orgCode: '',//所属区域
                    tempVehicle: '',//运单属性
                    startActualDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    startConfirmArrivalTime: '',//到达时间
                    endConfirmArrivalTime: '',
                    onTimeFlag: '',
                    receiptCode: '',
                    oilCardCode: '',
                    gpsCode: '',
                    lineId: '',//线路名称
                    shipperCode: '',
                    startSendTime: '',//派车时间
                    endSendTime: '',
                    dispatchCode: '',
                    salesman: '',
                    carInviter: ''
                };
            },
            searchList() {//查询
                let vm = this;
                if(!!vm.searchParam.code || !!vm.searchParam.dispatchCode || !!vm.searchParam.receiptCode){
                    vm.searchParam.startActualDepartureTime = '';
                    vm.searchParam.endActualDepartureTime = '';
                }else{
                    if((!vm.searchParam.startActualDepartureTime && !vm.searchParam.endActualDepartureTime
                        && !vm.searchParam.startConfirmArrivalTime && !vm.searchParam.endConfirmArrivalTime
                        &&!vm.searchParam.startSendTime && !vm.searchParam.endSendTime) || !!vm.searchParam.startActualDepartureTime != !!vm.searchParam.endActualDepartureTime
                        || !!vm.searchParam.startConfirmArrivalTime != !!vm.searchParam.endConfirmArrivalTime
                        || !!vm.searchParam.startSendTime != !!vm.searchParam.endSendTime){
                        return vm.$message.warning('请至少选择派车，发车,到达时间中的一个进行查询！');
                    }
                }
                vm.isLoading = true;
                vm.searchParam.statusList = vm.searchParam.multipleStatus.join(',');
                Http.get(Api.waybill.page,{ params : vm.searchParam }, result => {
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
                if(this.$_permission('/operation/waybillDetail')){
                    return this.$router.push({path: '/operation/waybillDetail', query: {code: row.code}})
                }
                // if(this.$_permission('/operation/newWaybillDetail')){
                //     this.$router.push({path: '/operation/newWaybillDetail', query: {code: row.code}})
                // }
            },
            showLine(row){//线路详情
                this.currentRow = row;
                this.showLineInfo = true;
            },
            hideLineInfo(){//关闭线路详情
                this.showLineInfo = false;
            },
            templateDownload(){
                this.btnLoading = false;
                Common.excel.downloadExl([],["运单号","重量","体积","件数"],null,'运单重量体积模板');
                this.btnLoading = true;
            },
            uploadSuccess(){
                let vm = this;
                vm.searchList();
            },
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                let exportStatusList = vm.searchParam.multipleStatus.map((item)=>{
                    return `'${item}'`;
                })
                vm.searchParam.statusList = exportStatusList.join(',')
                axios.get(Api.waybillExport.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '运单数据.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            //修改运单
            modifyWaybill(row){
                this.currentRow = row;
                this.showModify = true;
            },
            hideModify(){
                this.showModify = false;
                this.searchList();
            }
        }
    }
</script>

