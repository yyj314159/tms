<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 到达管理</el-breadcrumb-item>
                <el-breadcrumb-item>到达车辆</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="到达区域:">
                            <current-org-select v-model="searchParam.destOrgCode"
                                                style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达城市:">
                            <district-select v-model="searchParam.destCityArr" style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预计到达时间:" label-width="120px">
                            <el-date-picker
                                v-model="searchParam.expectArrivalTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="线路类型:">
                            <dictionary-select option-name="LINE_TYPE" v-model="searchParam.lineType"
                                               style="display:block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select v-model="searchParam.vehicleNature" style="display:block"
                                               option-name="VEHICLE_OPERATION_MODE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单状态:">
                            <dictionary-select v-model="searchParam.status" style="display:block"
                                               option-name="WAY_BILL_STATUS"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="包天车辆:">
                            <dictionary-select v-model="searchParam.allDayVehicle" style="display:block"
                                               option-name="FLAG"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <export-button :href="Api.exportExcel.exportExcel" :params="searchParam"
                           :download-name="'到达车辆信息'" style="display: inline-block"></export-button>
            <!--<el-button size="mini" type="primary" icon="el-icon-download" @click="exportExcel">导出
            </el-button>-->
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border
                      fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="到达大区" prop="destRegionName"min-width="120"></el-table-column>
                <el-table-column header-align="center" label="到达分区" prop="destOrgName"
                                 min-width="120"></el-table-column>
                <el-table-column header-align="center" label="到达城市" prop="destCityName"
                                 min-width="120"></el-table-column>
                <el-table-column header-align="center" label="客户" prop="customerName" min-width="140">
                </el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="600" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.lineName}}
                        {{`（${scope.row.startStationName} ——
                        ${scope.row.endStationName}）`}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车辆属性" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                :value="scope.row.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车牌号码" prop="vehicleLicenseNum"
                                 min-width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column header-align="center" label="挂厢号码" prop="vehicleTrailerLicenseNum"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="车型" prop="vehicleSpecification"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="线路类型" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_TYPE"
                                                :value="scope.row.lineType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单号" min-width="130">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="发车时间" prop="departureTime"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="运单状态" prop="waybillStatus" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAY_BILL_STATUS"
                                                :value="scope.row.waybillStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="预计到达时间" prop="expectArrivalTime"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="司机到达时间" prop="actualArrivalTime"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="到达时间" prop="arrivalTime"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="司机姓名" prop="driverName"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="司机电话" prop="driverMobile"
                                 min-width="120"></el-table-column>
                <el-table-column header-align="center" label="包天车辆" min-width="100">
                    <template slot-scope="scope">
                        {{scope.row.allDayVehicle? "是":"否"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="是否回货" min-width="100">
                    <template slot-scope="scope">
                        {{scope.row.returnGoods? "是":"否"}}
                    </template>
                </el-table-column>

                <!--<el-table-column align="center" label="操作" fixed="right" min-width="130">
                    <template slot-scope="scope">
                        <el-button v-permission="'/dispatch/arrangeReturnGood'"
                                   :type="scope.row.dispatch.dispatchLine.lineType === Constant.LINE_TYPE.DOUBLE?'primary':'success'"
                                   size="mini"
                                   v-show="scope.row.dispatch.returnGoods || scope.row.dispatch.dispatchLine.lineType !== Constant.LINE_TYPE.ONCE"
                                   :disabled="!scope.row.dispatch.returnGoods && scope.row.dispatch.dispatchLine.lineType === Constant.LINE_TYPE.ONCE"
                                   @click="arrangeReturnGoods(scope.row)"><i class="fa fa-arrow-circle-o-left "></i>&nbsp;&nbsp;回货
                        </el-button>
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

        <!-- 线路信息详情 -->
        <line-info v-if="showLineInfo" :dialogVisible="showLineInfo" @close="hideLineInfo"
                   :currentRow="currentRow"></line-info>

        <!-- 单边回货线路选择 -->
        <rg-line-select v-if="showLineSelect" :dialogVisible="showLineSelect" @close="hideLineSelect"
                        :currentRow="currentRow"></rg-line-select>

    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import lineInfo from '../myDispatch/LineInfoDialog'
    import rgLineSelect from './RGLineSelectDialog'
    import addSend from '../myDispatch/AddSendDialog'
    import {Constant} from 'src/global/constant'

    export default {
        data() {
            return {
                isLoading: true,
                Constant: Constant,//常量
                isMoreItemShow: false,
                showConfirmArrival: false,
                showLineInfo: false,
                showLineSelect: false,
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    expectArrivalTime: [Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2)), Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 23, 59, 59))],//预计到达时间
                    startExpectArrivalTime: '',
                    endExpectArrivalTime: '',
                    destCityArr: [],
                    destCityCode: '',
                    destOrgCode: '',  //到达区域
                    lineType: '',//线路类型
                    status: '', //运单状态
                    allDayVehicle: '', //包天车辆
                    vehicleNature: ''//车辆属性
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null,//操作行的数据
                rowData: {
                    dispatchVehicle: {},
                    dispatch: {}
                },
                tableHeight: window.innerHeight > 800 ? 430 : null
            }
        },
        components: {
            lineInfo,
            rgLineSelect
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    expectArrivalTime: [Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 2)), Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 23, 59, 59))],//预计到达时间
                    startExpectArrivalTime: '',
                    endExpectArrivalTime: '',
                    destCityArr: [],
                    destCityCode: '',
                    destOrgCode: '',  //到达区域
                    lineType: '',//线路类型
                    status: '', //运单状态
                    allDayVehicle: '', //包天车辆
                    vehicleNature: ''//车辆属性
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                this.searchParam.destCityCode = this.searchParam.destCityArr[1];
                this.searchParam.startExpectArrivalTime = this.searchParam.expectArrivalTime[0];
                this.searchParam.endExpectArrivalTime = this.searchParam.expectArrivalTime[1];
                Http.get(Api.waybill.arrivalVehiclePage, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                })
            },
            /*exportExcel() { //导出
                let _this = this;
                let model = _.cloneDeep(_this.searchParam);

                model.pageSize = 3000;
                model.currentPage = 1;
                Http.get(Api.exportExcel.exportExcel, {params: model}, result => {
                    //导出
                    let header = ['到达大区', '到达分区', '到达城市', '客户名称', '线路名称', '车辆号码', '挂箱号码', '车型', '所属分区', '线路类型', '运单号', '运单属性', '预计到达时间', '发车时间', '车辆属性', '司机姓名', '司机电话', '运单状态', '司机到达时间', '确认到达时间', '始发站点', '目的站点', '是否回货'];
                    let filterVal = ['destRegionName', 'destOrgName', 'destCityName', 'customerName', 'lineName', 'vehicleLicenseNum', 'trailerLicenseNum', 'specification', 'startOrgName', 'lineType', 'code', 'lineOperationType', 'expectArrivalTime', 'actualDepartureTime', 'vehicleNature', 'driverName', 'driverMobile', 'waybillStatus', 'actualArrivalTime', 'confirmArrivalTime', 'startStationName', 'endStationName', 'returnGoods'
                    ];
                    Common.excel.downloadExl(result.result, header, filterVal, "到达车辆信息导出");
                })
            },*/
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            showWayBill(row) { //运单详情------------------------------------
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
            },
            showLine(row) {//线路详情
                this.currentRow = row;
                this.showLineInfo = true;
            },
            hideLineInfo() {//关闭线路详情
                this.showLineInfo = false;
            },
            hideLineSelect() {
                let vm = this;
                vm.showLineSelect = false;
                vm.searchList();
            },
            arrangeReturnGoods(row) {
                let vm = this;
                vm.currentRow = row;
                vm.showLineSelect = true;
            }
        }
    }
</script>

