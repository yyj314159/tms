<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 在途管理</el-breadcrumb-item>
                <el-breadcrumb-item>运单跟踪</el-breadcrumb-item>
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
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.code" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单属性:">
                            <dictionary-select option-name="WAY_BILL_NATURE" v-model="searchParam.tempVehicle"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单状态:">
                            <dictionary-select option-name="WAY_BILL_STATUS" v-model="searchParam.status"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="所属分区:">
                            <current-org-select nature="PARTITION" v-model="searchParam.belongOrgCode"
                                                style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发车时间:">
                            <el-date-picker
                                v-model="searchParam.departureTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineId" style="display: block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车单号:">
                            <el-input v-model="searchParam.dispatchCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="回单号:">
                            <el-input v-model="searchParam.receiptCode"></el-input>
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
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="预计到达开始:">
                            <date-picker-single v-model="searchParam.startArrivalTime" date-type="start" :end-date="searchParam.endArrivalTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预计到达结束:">
                            <date-picker-single v-model="searchParam.endArrivalTime" date-type="end" :start-date="searchParam.startArrivalTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应到未到:">
                            <dictionary-select option-name="NO_ARRIVAL_VEHICLE_FLAG" v-model="searchParam.noArrivalVehicleFlag"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :offset=6>
                        <el-form-item label-width="0" style="float: right">
                            <el-button type="text" v-show="!isMoreItemShow" @click="isMoreItemShow = true" size="small">
                                展开更多>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="isMoreItemShow = false" size="small">
                                收起<
                            </el-button>
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-if="trackLoading" v-permission="'/waybillTrackExport/export'" size="mini" type="primary" icon="el-icon-download" @click="waybillTrackExport">运单跟踪导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-button v-if="exceptionLoading" v-permission="'/driverReportException/export'" size="mini" type="primary" icon="el-icon-download" @click="driverReportExport">司机上报导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <!--gps异常导出-->
            <export-button v-permission="'/gpsExceptionReport/export'" :href="Api.waybillTrack.gpsExport" :params="searchParam" :download-name="'gps异常上报'" style="display: inline-block;margin-right: 10px;"></export-button>

            <el-button v-if="followingLoading" v-permission="'/waybillFollowing/export'" size="mini" type="primary" icon="el-icon-download" @click="followingExport">客服跟踪导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-button v-if="driverExceptionImageLoading" v-permission="'/driverExceptionImage/download'" size="mini" type="primary" icon="el-icon-download" @click="driverExceptionImageDownload">司机异常图片</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-button v-if="waybillTrackImageLoading" v-permission="'/customerExceptionImage/download'" size="mini" type="primary" icon="el-icon-download" @click="waybillTrackImageDownload">客服异常图片</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      @selection-change="handleSelectionChange"    element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="所属分区" prop="dispatch.belongOrg.name"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="客户" min-width="140">
                    <template slot-scope="scope">
                        {{scope.row.dispatch.customer?scope.row.dispatch.customer.name:""}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单号" min-width="140">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="派车单号" prop="dispatch.code"
                                 min-width="120"></el-table-column>
                <el-table-column header-align="center" label="车牌号码" min-width="220" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.dispatch.dispatchVehicle.vehicleLicenseNum}
                        （${scope.row.dispatch.dispatchVehicle.specification} 米）`}}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <i @click="trackVehicle(scope.row.dispatch.dispatchVehicle.vehicleLicenseNum)"
                           class="fa fa-location-arrow" style="color:#409EFF; cursor: pointer;" v-if="scope.row.dispatch.dispatchVehicle.vehicleNature!=='OUT_INVITE'"></i>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <i @click="replayVehicle(scope.row.dispatch.dispatchVehicle.vehicleLicenseNum,scope.row.dispatch.departureTime,scope.row.confirmArrivalTime)"
                           class="fa fa-caret-square-o-right" style="color:#409EFF; cursor: pointer;" v-if="scope.row.dispatch.dispatchVehicle.vehicleNature!=='OUT_INVITE'"></i>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="挂厢号码" prop="dispatch.dispatchVehicle.trailerLicenseNum"
                                 min-width="120"></el-table-column>
                <el-table-column header-align="center" label="车辆属性" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                v-model="scope.row.dispatch.dispatchVehicle.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="司机姓名" prop="dispatch.dispatchVehicle.driver.name"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="司机电话" prop="dispatch.dispatchVehicle.driver.mobile"
                                 min-width="120"></el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="600" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;display: inline-block;"
                           @click="showLine(scope.row.dispatch)">{{scope.row.dispatch.dispatchLine.lineName}}</a>
                        {{`（${scope.row.dispatch.dispatchLine.startStation.name} ——
                        ${scope.row.dispatch.dispatchLine.endStation.name}）`}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路类型" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_TYPE"
                                                :value="scope.row.dispatch.dispatchLine.lineType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="dispatch.dispatchLine.startStation.name"
                                 min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="经停站点" prop="dispatch.dispatchLine.stopOverStationName"
                                 min-width="280" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="dispatch.dispatchLine.endStation.name"
                                 min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="司机上报" min-width="120">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="exception(scope.row)">{{scope.row.waybillExceptionList?scope.row.waybillExceptionList.length:0}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="客服跟踪" min-width="120">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="waybillTrackHistory(scope.row)">{{(scope.row.waybillTrackList?scope.row.waybillTrackList.length:0)+(scope.row.confirmWaybillExceptionList?scope.row.confirmWaybillExceptionList.length:0)}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="GPS上报" min-width="120">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="gpsReport(scope.row)">{{scope.row.gpsExceptionNum}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单属性" min-width="100">
                    <template slot-scope="scope">
                        {{scope.row.dispatch.tempVehicle? "临时":"正班"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单状态" prop="status" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAY_BILL_STATUS"
                                                :value="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="需求时间" prop="dispatch.demandTime"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="发车时间" prop="dispatch.departureTime"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="预计到达时间" prop="arrivalTime"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="司机到达时间" prop="actualArrivalTime"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="确认到达时间" prop="confirmArrivalTime"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="则一时效" prop="dispatch.dispatchLine.timeConsumeZeyi" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="是否准点（则一）" prop="onTimeFlag" min-width="140">
                    <template slot-scope="scope">
                        <span v-if="scope.row.onTimeFlag === true">准点</span>
                        <span v-else-if="scope.row.onTimeFlag === false" style="color: red; font-weight: bold;">晚点</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="晚点时长(则一)(分钟)" prop="overTimeMin" min-width="140"></el-table-column>
                 <el-table-column header-align="center" label="客户时效" prop="dispatch.dispatchLine.timeConsume" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="是否准点（客户）" prop="onTimeFlag" min-width="140">
                    <template slot-scope="scope">
                        <span v-if="scope.row.dispatch.customerOnTimeFlag === true">准点</span>
                        <span v-else-if="scope.row.dispatch.customerOnTimeFlag === false" style="color: red; font-weight: bold;">晚点</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="晚点时长(客户)(分钟)" prop="dispatch.customerOverTimeMin" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="回单号" prop="receiptCodes" min-width="310"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column type="selection" width="40" fixed="left"/>
                <el-table-column align="center" label="操作" fixed="left" min-width="140">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/waybillTrack/add'" size="mini"
                                   @click="waybillTrack(scope.row)"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;跟踪
                        </el-button>
                        <el-button type="text" v-permission="'/waybill/confirmArrive'" size="mini"
                                   @click="outArrival(scope.row)"
                                   :disabled="scope.row.status!==constant.WAY_BILL_STATUS.IN_TRANSIT"><i
                            class="fa fa-check-circle-o"></i>&nbsp;&nbsp;到达
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

        <!-- 确认到达 -->
        <el-dialog title="确认到达" :visible.sync="showConfirmArrival" width="45%" @close="resetConfirmArrivalForm">
            <el-form size="small" ref='confirmArrivalForm' :model="confirmArrivalForm" label-width="40%">
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="司机到车时间：">
                            <el-checkbox v-model="confirmArrivalForm.checked" @change="changeArrivalTime">
                                （勾选同步至到车时间）{{confirmArrivalForm.driverArrivalTime||""}}
                            </el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="进入围栏时间：">
                            {{rowData.dispatch.dispatchLine.stopOverStation.length>0&&rowData.dispatch.dispatchLine.stopOverStation[rowData.dispatch.dispatchLine.stopOverStation.length-1].stationFence?rowData.dispatch.dispatchLine.stopOverStation[rowData.dispatch.dispatchLine.stopOverStation.length-1].stationFence.inTime:''}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="离开围栏时间：">
                            {{rowData.dispatch.dispatchLine.stopOverStation.length>0&&rowData.dispatch.dispatchLine.stopOverStation[rowData.dispatch.dispatchLine.stopOverStation.length-1].stationFence?rowData.dispatch.dispatchLine.stopOverStation[rowData.dispatch.dispatchLine.stopOverStation.length-1].stationFence.outTime:''}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="canSearch">
                    <el-col :span="16">
                        <el-form-item label="客户到车时间：">
                            <el-checkbox v-model="confirmArrivalForm.clientCheck" @change="changeClientArrivalTime">
                                （勾选同步至到车时间）{{confirmArrivalForm.clientArrivalTime||""}}
                            </el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item ref="confirmArrivalTimeForm" label="到车时间：" prop="confirmArrivalTime"
                                      :rules="{required:true,message:'请输入到车时间！'}">
                            <el-date-picker style="display:block; width:100%;"
                                            v-model="confirmArrivalForm.confirmArrivalTime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            :picker-options="pickerOptions0"
                                            type="datetime" placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        &nbsp;
                    </el-col>
                    <el-col :span="7" style="margin-top: 7px">
                        <span v-if="onTimeFlag&&onTimeFlag==='晚点'" style="color: red">{{onTimeFlag}} {{overTimeStr}}</span>
                        <span v-else >{{onTimeFlag}}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16" v-if="!confirmArrivalForm.receiptInputs.length">
                        <el-form-item label="回单号：" prop="inputValue">
                            <el-tag v-for="tag in dynamicTags" :key="tag.index" style="min-width: 100%" closable
                                    :disable-transitions="false" @close="handleClose(tag)">{{tag}}
                            </el-tag>
                            <el-input maxlength="24" class="input-new-tag" v-if="inputVisible" v-model="inputValue"
                                      ref="saveTagInput"
                                      size="small" @keyup.enter.native="handleInputConfirm">
                                       <el-button slot="append" type="primary" plain v-if="canSearch" @click="searchMoreBill">查询更多回单</el-button>
                            </el-input>
                            <el-button v-if="inputVisible" type="text" @click="handleInputConfirm"
                                       icon="el-icon-circle-check-outline"></el-button>
                            <el-button v-else type="text" @click="showInput" circle icon="el-icon-circle-plus-outline"
                                       :disabled="dynamicTags.length >= 20"></el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16" v-else>
                        <el-form-item label="回单号：">
                            <el-input v-for="(item,index) in confirmArrivalForm.receiptInputs" :key="index" :value="dynamicInputs[index]" :placeholder="item.placeholder" @input="val => $set(dynamicInputs, index, val)">
                                <template slot="prepend">{{item.receiptType}}</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showConfirmArrival = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confirmArrivalSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 跟踪 -->
        <el-dialog title="运单跟踪" :visible.sync="showWaybillTrack" width="40%" @close="resetWaybillTrackForm">
            <el-form size="small" :model="waybillTrackForm" ref="waybillTrackForm" label-width="40%">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="跟踪时间：" prop="trackTime" :rules="[{required: true,message:'请输入跟踪时间！'}]">
                            <el-date-picker style="display:block; width:100%;" v-model="waybillTrackForm.trackTime"
                                            value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                            placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="跟踪方式：" prop="trackType" :rules="[{required: true,message:'请选择跟踪方式！'}]">
                            <dictionary-select option-name="TRACK_TYPE" v-model="waybillTrackForm.trackType"
                                               style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="是否正常：">
                            <el-switch v-model="waybillTrackForm.normalFlag" active-color="#13ce66"
                                       inactive-color="#ff4949" active-text="是" inactive-text="否"
                                       @change="normalFlagChange"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="!waybillTrackForm.normalFlag">
                    <el-col :span="18">
                        <el-form-item label="异常类型：" prop="exceptionType" :rules="[{required: true,message:'请选择异常类型！'}]">
                            <dictionary-select option-name="EXCEPTION_TYPE" v-model="waybillTrackForm.exceptionType"
                                               style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18" v-if="!waybillTrackForm.normalFlag">
                        <el-form-item label="异常开始时间：" prop="exceptionStartTime" :rules="[{required: true,message:'请输入异常开始时间！'}]">
                            <el-date-picker style="display:block; width:100%;" v-model="waybillTrackForm.exceptionStartTime"
                                            value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                            placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18" v-if="!waybillTrackForm.normalFlag">
                        <el-form-item label="异常结束时间：" prop="exceptionEndTime" :rules="[{required: true,message:'请输入异常结束时间！'}]">
                            <el-date-picker style="display:block; width:100%;" v-model="waybillTrackForm.exceptionEndTime"
                                            value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                            placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="跟踪附件：" :rules="[{required: true}]">
                            <upload-image ref="exceptionAttachment"
                                          v-model="waybillTrackForm.exceptionAttachment"></upload-image>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！"
                                      v-model="waybillTrackForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showWaybillTrack = false">取 消</el-button>
                <el-button size="small" type="primary" @click="waybillTrackSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 跟踪查看 -->
        <el-dialog :visible.sync="showWaybillTrackHistory" width="65%">
            <el-tabs v-model="activeTabName">
                <el-tab-pane label="跟踪记录" name="first">
                    <el-table size="small" class="content-table" :data="waybillTrackList" element-loading-text="拼命加载中"
                              border
                              fit highlight-current-row stripe>
                        <el-table-column header-align="center" prop="trackUser" label="跟踪人"
                                         min-width="120"></el-table-column>
                        <el-table-column header-align="center" prop="trackTime" label="跟踪时间"
                                         min-width="140"></el-table-column>
                        <el-table-column header-align="center" label="跟踪方式" min-width="120">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="TRACK_TYPE"
                                                        v-model="scope.row.trackType"></dictionary-select-name>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="是否正常" min-width="80">
                            <template slot-scope="scope">
                                {{scope.row.normalFlag?'是':'否'}}
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="异常类型" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="EXCEPTION_TYPE"
                                                        v-model="scope.row.exceptionType"></dictionary-select-name>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="异常图片" min-width="100">
                            <template slot-scope="scope">
                                <show-image :url="scope.row.exceptionAttachment"></show-image>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" prop="remark" label="备注" min-width="200"
                                         show-overflow-tooltip></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="确认异常" name="second">
                    <el-table size="small" class="content-table" :data="confirmWaybillExceptionList"
                              element-loading-text="拼命加载中" border
                              fit highlight-current-row stripe>
                        <el-table-column header-align="center" label="异常类型" min-width="120">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="EXCEPTION_TYPE"
                                                        v-model="scope.row.type"></dictionary-select-name>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" prop="address" label="异常地点" min-width="140"
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column header-align="center" label="异常时间" min-width="280">
                            <template slot-scope="scope">
                                {{scope.row. exceptionStartTime}} &nbsp;&nbsp;&nbsp;&nbsp;至 &nbsp;&nbsp;&nbsp;&nbsp;{{scope.row.exceptionEndTime}}
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="现场照片" min-width="100">
                            <template slot-scope="scope">
                                <show-image :url="scope.row.attachment"></show-image>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" prop="remark" label="备注" min-width="180"
                                         show-overflow-tooltip></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

        <!-- 司机上报 -->
        <el-dialog title="司机上报" :visible.sync="showException" width="80%" @close="searchList">
            <el-table size="small" class="content-table" :data="waybillExceptionList" element-loading-text="拼命加载中"
                      border
                      fit highlight-current-row stripe>
                <el-table-column header-align="center" label="异常类型" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="EXCEPTION_TYPE"
                                                v-model="scope.row.type"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" prop="address" label="异常地点" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="" label="异常时间" min-width="280">
                    <template slot-scope="scope">
                        {{scope.row. exceptionStartTime}} &nbsp;&nbsp;&nbsp;&nbsp;至 &nbsp;&nbsp;&nbsp;&nbsp;{{scope.row.exceptionEndTime}}
                        &nbsp;&nbsp;&nbsp;&nbsp;<el-button type="text" icon="el-icon-edit"
                                                           @click="modifyException(scope.row)"
                                                           :disabled="scope.row.confirmFlag"></el-button>
                        &nbsp;&nbsp;&nbsp;&nbsp;<el-button type="text"
                                                           :disabled="!scope.row. exceptionStartTime || !scope.row.exceptionEndTime || scope.row.confirmFlag"
                                                           icon="el-icon-check" @click="checkException(scope.row)">确认异常
                    </el-button>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="现场照片" min-width="100">
                    <template slot-scope="scope">
                        <show-image :url="scope.row.attachment"></show-image>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" prop="remark" label="备注" min-width="180"
                                 show-overflow-tooltip></el-table-column>
            </el-table>
            <el-dialog :visible.sync="showModifyException" append-to-body title="修改异常时间" width="40%">
                <el-form size="small" :model="modifyExceptionTimeForm" ref="modifyExceptionTimeForm" label-width="30%">
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="异常开始时间：" prop="exceptionStartTime"
                                          :rules="[{required: true,message:'请选择异常开始时间！'}]">
                                <el-date-picker :editable="false" v-model="modifyExceptionTimeForm.exceptionStartTime"
                                                style="width: 100%"
                                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss" size="small">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="异常结束时间：" prop="exceptionEndTime"
                                          :rules="[{required: true,message:'请选择异常结束时间！'}]">
                                <el-date-picker :editable="false" v-model="modifyExceptionTimeForm.exceptionEndTime"
                                                style="width: 100%"
                                                type="datetime" value-format="yyyy-MM-dd HH:mm:ss" size="small">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="showModifyException = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="modifyExceptionSubmit">确 定</el-button>
                </span>
            </el-dialog>
        </el-dialog>

        <!-- 轨迹回放 -->
        <el-dialog :title="title" :visible.sync="showTrackReplay" width="90%" :top="marginTop">
            <el-main class="content-main" style="padding: 0;">
                <iframe :src="trackReplayUrl" frameborder="0" width="100%" :height="minHeight"></iframe>
            </el-main>
        </el-dialog>

        <!-- 线路信息详情 -->
        <line-info v-if="showLineInfo" :dialogVisible="showLineInfo" @close="hideLineInfo"
                   :currentRow="currentRow"></line-info>

        <!-- 经停点出发到达时间/确认到达 -->
        <el-dialog title="经停/到达" :visible.sync="showStopOverOrArrival" width="60%" @close="resetRowData">
            <el-table class="content-table" :data="rowData.dispatch.dispatchLine.stopOverStation" border fit
                      highlight-current-row stripe>
                <el-table-column header-align="center" label="站点名称" min-width="240" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.station.name}}</template>
                </el-table-column>
                <el-table-column header-align="center" label="到达时间" prop="distance" min-width="180"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.$index===0">---</span>
                        <span v-else-if="scope.$index===rowData.dispatch.dispatchLine.stopOverStation.length-1"><el-button
                            type="text" size="mini" @click="confirmArrival(rowData.code);stopOverStationCurrentRow = scope.row" ><i
                            class="fa fa-check-circle-o"></i>&nbsp;&nbsp;到达</el-button></span>
                        <span v-else>{{scope.row.confirmArrivalTime}} <el-button type="text" icon="el-icon-edit"
                                                                                 @click="showAddStopOverStationArrivalTimeDialog(scope.row)"></el-button></span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="出发时间" prop="distance" min-width="180"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.$index===0">{{rowData.actualDepartureTime}} </span>
                        <span
                            v-else-if="scope.$index===rowData.dispatch.dispatchLine.stopOverStation.length-1">---</span>
                        <span v-else>{{scope.row.confirmDepartureTime}} <el-button type="text" icon="el-icon-edit"
                                                                                   @click="showAddDepartureTimeDialog(scope.row)"></el-button></span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 经停站点到车时间 -->
            <el-dialog :title="stopOverStationConfirmArrivalForm.title"
                       :visible.sync="showStopOverStationConfirmArrivalTime" width="40%"
                       @close="resetStopOverStationConfirmArrivalForm" append-to-body>
                <el-form size="small" :model="stopOverStationConfirmArrivalForm" ref="stopOverStationConfirmArrivalForm"
                         label-width="30%">
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="司机到车时间：">
                                <el-checkbox v-model="stopOverStationConfirmArrivalForm.checked"
                                             @change="changeStopOverStationConfirmArrivalTime">&nbsp;&nbsp;&nbsp;&nbsp;(勾选同步至到车时间)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{stopOverStationConfirmArrivalForm.dirverArrivalTime}}
                                </el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="进入围栏时间：">
                                {{stopOverStationConfirmArrivalForm.inTime||""}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="离开围栏时间：">
                                {{stopOverStationConfirmArrivalForm.outTime||""}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="canSearch">
                        <el-col :span="16">
                            <el-form-item label="客户到车时间：">
                                <el-checkbox v-model="stopOverStationConfirmArrivalForm.clientCheck"
                                             @change="changeStopOverStationConfirmClientArrivalTime">&nbsp;&nbsp;&nbsp;&nbsp;(勾选同步至到车时间)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{stopOverStationConfirmArrivalForm.clientArrivalTime}}
                                </el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="到车时间：" prop="confirmArrivalTime"
                                          :rules="{required:true,message:'请输入到车时间！'}">
                                <el-date-picker style="display:block; width:100%;"
                                                v-model="stopOverStationConfirmArrivalForm.confirmArrivalTime"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                type="datetime" placeholder="选择日期时间"
                                                :picker-options="pickerOptions"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="1">
                            &nbsp;
                        </el-col>
                        <el-col :span="7" style="margin-top: 7px">
                            <span v-if="onTimeFlag&&onTimeFlag==='晚点'" style="color: red">{{onTimeFlag}} {{overTimeStr}}</span>
                            <span v-else >{{onTimeFlag}}</span>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="showStopOverStationConfirmArrivalTime = false">取 消</el-button>
                    <el-button size="small" type="primary"
                               @click="stopOverStationConfirmArrivalFormSubmit">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 经停站点发车时间 -->
            <el-dialog :title="confirmDepartureForm.title" :visible.sync="showConfirmDepartureTime" width="40%"
                       @close="resetConfirmDepartureForm" append-to-body>
                <el-form size="small" :model="confirmDepartureForm" ref="confirmDepartureForm" label-width="30%">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="司机发车时间：">
                                <el-checkbox v-model="confirmDepartureForm.checked"
                                             @change="changeConfirmDepartureTime">&nbsp;&nbsp;&nbsp;&nbsp;(勾选同步至发车时间)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{confirmDepartureForm.dirverDepartureTime}}
                                </el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="进入围栏时间：">
                                {{confirmDepartureForm.inTime||""}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="离开围栏时间：">
                                {{confirmDepartureForm.outTime||""}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="canSearch">
                        <el-col :span="22">
                            <el-form-item label="客户发车时间：">
                                <el-checkbox v-model="confirmDepartureForm.clientCheck"
                                             @change="changeConfirmClientDepartureTime">&nbsp;&nbsp;&nbsp;&nbsp;(勾选同步至发车时间)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{confirmDepartureForm.clientDepartureTime}}
                                </el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="发车时间：" prop="confirmDepartureTime"
                                          :rules="{required:true,message:'请输入发车时间！'}">
                                <el-date-picker style="display:block; width:100%;"
                                                v-model="confirmDepartureForm.confirmDepartureTime"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                type="datetime" placeholder="选择日期时间"
                                                :picker-options="pickerOptions"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showConfirmDepartureTime = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confirmDepartureFormSubmit">确 定</el-button>
            </span>
            </el-dialog>

        </el-dialog>

        <!-- GPS上报 -->
        <el-dialog title="GPS上报" :visible.sync="gpsReportDialog.dialogVisible" width="80%" @close="resetGpsReportDialog">
            <el-table size="small" class="content-table" :data="gpsReportDialog.data" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="运单号" prop="waybillCode" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="车牌号" prop="vehicleLicenseNumber" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="异常类型" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="GPS_REPORT_RXCEPTION_TYPE" v-model="scope.row.exceptionType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" prop="currentLocation" label="当前位置" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="reportUser" label="上报人" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="reportTime" label="上报时间" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="remindTime" label="提醒开始时间" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-date-picker v-if="scope.$index==0 && gpsReportDialog.searchParam.currentPage==1" @change="remindTimeChange(scope.row)" v-model="scope.row.remindTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间"></el-date-picker>
                        <span v-else>{{ scope.row.remindTime }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div style="padding: 15px; overflow: hidden;">
                <el-pagination
                    @size-change="gpsReportHandleSizeChange"
                    @current-change="gpsReportHandleCurrentChange"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="gpsReportDialog.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="gpsReportDialog.totalCount"
                    style="float: right">
                </el-pagination>
            </div>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Validate} from 'src/global/validate'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import lineInfo from '../myDispatch/LineInfoDialog'
    import {Constant} from 'src/global/constant'
    import timeCalculation from 'src/components/common/util/timeCalculation.js'
    import axios from 'axios'

    export default {
        data() {
            return {
                Api: Api,
                options: [{
                    value: true,
                    label: '是'
                }, {
                    value: false,
                    label: '否'
                }],
                onTimeFlag: '',
                overTimeStr: '',
                //派车单经停站点选中行
                stopOverStationCurrentRow:{},
                multipleSelection:[],
                isLoading: true,
                constant: Constant,//常量
                validate: Validate,
                isMoreItemShow: false,
                showConfirmArrival: false,
                showLineInfo: false,
                showWaybillTrack: false,
                showWaybillTrackHistory: false,
                waybillTrackList: [],
                confirmWaybillExceptionList: [],
                waybillExceptionList: [],
                showException: false,
                showModifyException: false,
                showTrackReplay: false,
                title: "",
                trackReplayUrl: '',
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',//客户编号
                    code: '',//运单号
                    vehicleCode: '',//车牌号
                    status: Constant.WAY_BILL_STATUS.IN_TRANSIT,//状态默认查询运输中的
                    belongOrgCode: '',//所属区域
                    tempVehicle: '',//运单属性
                    departureTime: [],//发车时间
                    startDepartureTime: '',
                    endDepartureTime: '',
                    dispatchCode: '',
                    receiptCode: '',
                    lineId: '',
                    noArrivalVehicleFlag: '',
                    startArrivalTime: Common.date.dateFormat(new Date(new Date().getTime() - 24*3600*1000),"YYYY-MM-DD 00:00:00"),
                    endArrivalTime: Common.date.dateFormat(new Date(new Date().getTime() + 24*3600*1000),"YYYY-MM-DD 23:59:59")
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null,//操作行的数据
                confirmArrivalForm: {
                    checked: false,
                    clientCheck:false,
                    driverArrivalTime: "",
                    clientArrivalTime: "",
                    receiptCodeList: [],
                    receiptInputs: [],
                    confirmArrivalTime: "",//确认到车时间
                    code: '',
                    waybillCode: '',
                    departureTime: ''
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                },
                waybillTrackForm: {
                    waybillCode: "",
                    trackTime: Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date()),
                    exceptionStartTime: "",
                    exceptionEndTime: "",
                    trackType: "",
                    normalFlag: true,
                    exceptionType: "",
                    exceptionAttachment: "",
                    remark: ""
                },
                modifyExceptionTimeForm: {
                    waybillCode: '',
                    id: "",
                    exceptionStartTime: "",
                    exceptionEndTime: ""
                },
                dynamicTags: [],
                dynamicInputs: [],
                inputVisible: false,
                inputValue: '',
                activeTabName: 'first',
                //经停站点到车发车时间功能
                rowData: {
                    code: '',
                    dispatch: {
                        dispatchLine: {
                            stopOverStation: []
                        }
                    }
                },
                showStopOverOrArrival: false,
                //经停站点--到车时间
                showStopOverStationConfirmArrivalTime: false,
                stopOverStationConfirmArrivalForm: {
                    title: '编辑到车时间',
                    code: '',
                    stationId: '',
                    checked: false,
                    clientCheck: false,
                    clientArrivalTime: '',
                    dirverArrivalTime: '',
                    confirmArrivalTime: '',
                    inTime:'',
                    outTime:''
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                //经停站点--发车时间
                showConfirmDepartureTime: false,
                confirmDepartureForm: {
                    title: '编辑发车时间',
                    code: this.$route.query.code,
                    stationId: '',
                    checked: false,
                    clientCheck: false,
                    dirverDepartureTime: '',
                    clientDepartureTime: '',
                    confirmDepartureTime: '',
                    inTime:'',
                    outTime:''
                },
                tableHeight: window.innerHeight>800?430:null,
                canSearch:false,
                currentWayBillCode:'',
                exceptionLoading: true,
                followingLoading: true,
                trackLoading: true,
                driverExceptionImageLoading: true,
                waybillTrackImageLoading: true,
                //gps上报
                gpsReportDialog: {
                    dialogVisible: false,
                    searchParam: {
                        currentPage: 1,
                        pageSize: 10,
                        waybillCode: ''
                    },
                    data: []
                }
            }
        },
        components: {
            lineInfo
        },
        computed: {
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
        created() {
            this.searchList();
        },
        watch: {
            'confirmArrivalForm.confirmArrivalTime'(confirmArrivalTime) {
                if (!confirmArrivalTime) {
                    this.onTimeFlag = '';
                    this.overTimeStr = '';
                    return;
                }
                let line = this.currentRow.dispatch.dispatchLine;
                let flag = timeCalculation.isOnTime(this.currentRow.dispatch.dispatchLine.stopOverStation, this.currentRow.arrivalTime, this.currentRow.actualDepartureTime, confirmArrivalTime, line.timeConsumeZeyiHour, line.timeConsumeZeyiMin, line.evaluationMode);
                this.onTimeFlag = flag?'准点':'晚点';
                let overTimeStr =  timeCalculation.getOverTimeStr(this.currentRow.dispatch.dispatchLine.stopOverStation, this.currentRow.arrivalTime, this.currentRow.actualDepartureTime, confirmArrivalTime,line.timeConsumeZeyiHour, line.timeConsumeZeyiMin, line.evaluationMode)
                this.overTimeStr = overTimeStr;
            },
            'stopOverStationConfirmArrivalForm.confirmArrivalTime'(confirmArrivalTime){
                if (!confirmArrivalTime) {
                    this.onTimeFlag = '';
                    this.overTimeStr = '';
                    return;
                }
                let flag =  timeCalculation.isOnTimeOfStopOverStation(this.currentRow.dispatch.dispatchLine.stopOverStation, this.stopOverStationCurrentRow.sort,this.currentRow.actualDepartureTime, confirmArrivalTime)
                this.onTimeFlag = flag?'准点':'晚点';
                let overTimeStr =  timeCalculation.getOverTimeOfStopOverStation(this.currentRow.dispatch.dispatchLine.stopOverStation, this.stopOverStationCurrentRow.sort, this.currentRow.actualDepartureTime,confirmArrivalTime)
                this.overTimeStr = overTimeStr;
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
                    status: Constant.WAY_BILL_STATUS.IN_TRANSIT,//状态默认查询运输中的
                    belongOrgCode: '',//所属区域
                    tempVehicle: '',//运单属性
                    departureTime: [],//发车时间
                    startDepartureTime: '',
                    endDepartureTime: '',
                    dispatchCode: '',
                    receiptCode: '',
                    lineId: '',
                    startArrivalTime: '',
                    endArrivalTime: '',
                    noArrivalVehicleFlag: ''
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                if (this.searchParam.departureTime) {
                    this.searchParam.startDepartureTime = this.searchParam.departureTime[0];
                    this.searchParam.endDepartureTime = this.searchParam.departureTime[1];
                } else {
                    this.searchParam.startDepartureTime = "";
                    this.searchParam.endDepartureTime = "";
                }
                Http.get(Api.waybill.trackPage, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
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
            //点击到车按钮
            outArrival(row) {
                let vm = this;
                this.currentRow = row;
                vm.canSearch = Common.bill.canSearch(row.dispatch.customer.topCode);
                vm.rowData.code = row.code;
                vm.currentWayBillCode = row.dispatch.waybillCode;
                Http.get(Api.waybill.queryByCode, {params: {'code': row.code}}, result => {
                    _.merge(vm.rowData, result.result);
                    vm.rowData.dispatch.dispatchLine.stopOverStation = result.result.dispatch.dispatchLine.stopOverStation;
                    if (result.result.dispatch.dispatchLine.stopOverStation.length > 2) {
                        vm.showStopOverOrArrival = true;
                    } else {
                        vm.confirmArrival(vm.rowData.code,vm.rowData.dispatchCode);
                    }
                    vm.getCustomer(row)
                })
            },
            getCustomer(row){
                let vm = this;
                if(vm.canSearch){
                    Http.get(Api.waybill.getCustomerWaybill,{params:{'waybillCode':row.code}},result => {
                        if(result.result) {
                            vm.confirmArrivalForm.clientArrivalTime = result.result.destActTime
                            if(vm.showStopOverOrArrival){
                                let stationsMore = vm.deleteProperty(result.result.timeDetails, ["id"]);
                                if(stationsMore){
                                    vm.rowData.dispatch.dispatchLine.stopOverStation = vm.addProperty(vm.rowData.dispatch.dispatchLine.stopOverStation,stationsMore)
                                }
                            }else {
                                if(vm.confirmArrivalForm.clientArrivalTime){
                                    vm.confirmArrivalForm.clientCheck = true
                                    vm.changeClientArrivalTime(true)
                                }
                            }
                        }
                    })
                }
            },
            confirmArrival(code,dispatchCode) {//确认到达
                let vm = this;
                vm.showConfirmArrival = true;
                if(vm.confirmArrivalForm.clientArrivalTime){
                    vm.confirmArrivalForm.clientCheck = true
                    vm.changeClientArrivalTime(true)
                }
                vm.confirmArrivalForm.code = code;
                //是否显示input组件
                Http.get(Api.dispatch.getCustomerReceipt, {params: {dispatchCode: dispatchCode}}, result => {
                    this.confirmArrivalForm.receiptInputs = result.result;
                    this.dynamicInputs = this.confirmArrivalForm.receiptInputs.map((item,index)=>{
                        return ''
                    })
                    Http.get(Api.waybill.queryByCode, {params: {'code': code}}, result => {
                        vm.confirmArrivalForm.driverArrivalTime = result.result.actualArrivalTime;
                        vm.confirmArrivalForm.departureTime = result.result.dispatch.departureTime;
                        let Arry = [];
                        if (!_.isNil(result.result.waybillReceiptList)) {
                            result.result.waybillReceiptList.forEach((item) => {
                                Arry.push(item.code);
                            });
                        }
                        vm.dynamicTags = Arry;
                        //vm.dynamicInputs = Arry;
                        Arry.forEach((item,index)=>{
                            vm.$set(vm.dynamicInputs, index, item)
                        })
                    })
                })
            },
            changeArrivalTime(val) {
                let vm = this;
                if (val) {
                    vm.confirmArrivalForm.clientCheck = false;
                    vm.confirmArrivalForm.confirmArrivalTime = vm.confirmArrivalForm.driverArrivalTime;
                }
            },
            changeClientArrivalTime(val) {
                let vm = this;
                if (val) {
                    vm.confirmArrivalForm.checked = false;
                    vm.confirmArrivalForm.confirmArrivalTime = vm.confirmArrivalForm.clientArrivalTime;
                }
            },
            confirmArrivalSubmit() {
                let vm = this;
                if(!vm.confirmArrivalForm.receiptInputs || !(vm.confirmArrivalForm.receiptInputs.length>0)){
                    if (!vm.handleInputConfirm()) {
                        return
                    }
                    vm.confirmArrivalForm.receiptCodeList = vm.dynamicTags;
                }else{
                    vm.confirmArrivalForm.receiptCodeList = vm.dynamicInputs;
                    let arr1 = vm.confirmArrivalForm.receiptInputs.filter((item,index)=>{
                        return  !vm.confirmArrivalForm.receiptCodeList[index] && item.required
                    })
                    if(arr1 && arr1.length>0){
                        vm.$message.warning(arr1[0].receiptType+'必填！');
                        return;
                    }
                    let arr2 = vm.confirmArrivalForm.receiptInputs.filter((item,index)=>{
                        return !!vm.confirmArrivalForm.receiptCodeList[index] && !eval(item.regExp).test(vm.confirmArrivalForm.receiptCodeList[index])
                    })
                    if(arr2 && arr2.length>0){
                        vm.$message.warning(arr2[0].errorMessage);
                        return;
                    }
                }
                vm.$refs.confirmArrivalForm.validate((valid) => {
                    if (valid) {
                        if (new Date(vm.confirmArrivalForm.confirmArrivalTime).getTime() > new Date().getTime()) {
                            vm.$message.warning('确认到达时间不能大于当前时间！');
                            vm.confirmArrivalForm.confirmArrivalTime = '';
                            return;
                        }
                        if (new Date(vm.confirmArrivalForm.confirmArrivalTime).getTime() < new Date(vm.confirmArrivalForm.departureTime).getTime()) {
                            vm.$message.warning('确认到达时间不能小于发车时间！');
                            vm.confirmArrivalForm.confirmArrivalTime = '';
                            return;
                        }
                        if (!vm.$_permission('/dispatch/arrivalVehicleTime')) {//无到车时间权限发车校验时间
                            if (new Date(vm.confirmArrivalForm.confirmArrivalTime).getTime() < new Date().getTime() - 24 * 60 * 60 * 1000) {
                                vm.$message.warning('确认到达时间不能早于当前时间24小时！');
                                vm.confirmArrivalForm.confirmArrivalTime = '';
                                return;
                            }
                        }
                        Http.post(Api.waybill.confirmArrive, vm.confirmArrivalForm, result => {
                            vm.showConfirmArrival = false;
                            vm.showStopOverOrArrival = false;
                            this.$message.success("确认到车成功！");
                            this.searchList();
                        })
                    }
                });
            },
            resetRowData() {
                this.rowData = {
                    code: '',
                    dispatch: {
                        dispatchLine: {
                            stopOverStation: []
                        }
                    }
                };
                this.searchList();
                this.resetConfirmArrivalForm()
            },
            handleClose(tag) {
                let vm = this;
                vm.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                let vm = this;
                let reg = Validate.receipt.pattern;
                let inputValue = vm.inputValue;
                if (inputValue) {
                    if (reg.test(inputValue)) {
                        for (let i = 0; i < vm.dynamicTags.length; i++) {
                            if (inputValue == vm.dynamicTags[i]) {
                                vm.inputValue = '';
                                vm.inputVisible = false;
                                vm.$message.error('请勿重复添加回单！');
                                return false
                            }
                        }
                        vm.dynamicTags.push(inputValue);
                    } else {
                        vm.$message.error('请输入正确的回单号！');
                        vm.inputValue = '';
                        return false
                    }
                }
                vm.inputValue = '';
                vm.inputVisible = false;
                return true;
            },
            resetConfirmArrivalForm() {
                let vm = this;
                vm.confirmArrivalForm.checked = false,
                vm.confirmArrivalForm.driverArrivalTime = "";
                vm.confirmArrivalForm.clientCheck = false,
                vm.confirmArrivalForm.receiptCodeList = [];
                vm.confirmArrivalForm.confirmArrivalTime = "";//到车时间
                vm.confirmArrivalForm.code = '';
                if(this.showStopOverOrArrival) return
                vm.confirmArrivalForm.clientArrivalTime = "";
            },
            showWayBill(row) { //运单详情------------------------------------
                this.$router.push({ path: '/operation/waybillDetail',query: {code: row.code}});
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.code}});
                // window.open(href, '_blank');
            },
            showLine(row) {//线路详情
                this.currentRow = row;
                this.showLineInfo = true;
            },
            hideLineInfo() {//关闭线路详情
                this.showLineInfo = false;
            },
            waybillTrack(row) {
                let vm = this;
                vm.showWaybillTrack = true;
                vm.waybillTrackForm.waybillCode = row.code;
            },
            waybillTrackSubmit() {
                let vm = this;
                vm.$refs.waybillTrackForm.validate((valid) => {
                    if (valid) {
                        if (!vm.waybillTrackForm.normalFlag) {
                            if (vm.waybillTrackForm.exceptionEndTime<=vm.waybillTrackForm.exceptionStartTime){
                                vm.$message.warning('异常结束时间不能小于等于异常开始时间！');
                                return false;
                            }
                        }
                        vm.waybillTrackForm.exceptionAttachment = vm.$refs.exceptionAttachment.getFileList().join(',');
                        if (!vm.waybillTrackForm.exceptionAttachment) {
                            vm.$message.warning('跟踪附件不能为空！');
                            return false;
                        }
                        Http.post(Api.waybillTrack.add, vm.waybillTrackForm, result => {
                            vm.showWaybillTrack = false;
                            vm.$message.success('追踪成功！');
                            vm.searchList();
                        })
                    }
                })
            },
            resetWaybillTrackForm() {
                let vm = this;
                vm.waybillTrackForm.trackTime = Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date());
                vm.waybillTrackForm.trackType = "";
                vm.waybillTrackForm.normalFlag = true;
                vm.waybillTrackForm.exceptionType = "";
                vm.waybillTrackForm.exceptionAttachment = "";
                vm.$refs.exceptionAttachment.clearFileList();
                vm.waybillTrackForm.exceptionStartTime = "";
                vm.waybillTrackForm.exceptionEndTime = "";
                vm.waybillTrackForm.remark = "";
            },
            normalFlagChange(val) {
                let vm = this;
                if (val) {
                    vm.waybillTrackForm.exceptionType = "";
                    vm.waybillTrackForm.exceptionAttachment = "";
                    vm.$refs.exceptionAttachment.clearFileList();
                    vm.waybillTrackForm.exceptionStartTime = "";
                    vm.waybillTrackForm.exceptionEndTime = "";
                }
            },
            waybillTrackHistory(row) {
                let vm = this;
                vm.showWaybillTrackHistory = true;
                vm.waybillTrackList = row.waybillTrackList;
                vm.confirmWaybillExceptionList = row.confirmWaybillExceptionList;
            },
            exception(row) {
                let vm = this;
                vm.showException = true;
                Http.get(Api.waybillException.getByWaybillCode, {params: {waybillCode: row.code}}, result => {
                    vm.waybillExceptionList = result.result;
                })
            },
            modifyException(row) {
                let vm = this;
                vm.showModifyException = true;
                vm.modifyExceptionTimeForm.id = row.id;
                vm.modifyExceptionTimeForm.waybillCode = row.waybillCode;
                vm.modifyExceptionTimeForm.exceptionStartTime = row.exceptionStartTime;
                vm.modifyExceptionTimeForm.exceptionEndTime = row.exceptionEndTime;
            },
            checkException(row) {
                let vm = this;
                vm.$confirm('是否确认该异常?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.waybillException.confirmException, {'id': row.id}, result => {
                        vm.$message.success('异常确认成功！');
                        Http.get(Api.waybillException.getByWaybillCode, {params: {'waybillCode': row.waybillCode}}, result => {
                            vm.waybillExceptionList = result.result;
                        })
                    })
                })
            },
            modifyExceptionSubmit() {
                let vm = this;
                vm.$refs.modifyExceptionTimeForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.waybillException.modifyExceptionTime, vm.modifyExceptionTimeForm, result => {
                            vm.$message.success('异常时间修改成功');
                            Http.get(Api.waybillException.getByWaybillCode, {params: {waybillCode: vm.modifyExceptionTimeForm.waybillCode}}, result => {
                                vm.waybillExceptionList = result.result;
                                vm.showModifyException = false;
                                vm.modifyExceptionTimeForm.exceptionStartTime = '';
                                vm.modifyExceptionTimeForm.exceptionEndTime = '';
                            })
                        })
                    }
                });
            },
            trackVehicle(vehicleNo) {
                let vm = this;
                Http.get(Api.g7.vehicleFollowUrl, {params: {vehicleNo: vehicleNo}}, result => {
                    vm.trackReplayUrl = result.result;
                    vm.title = "轨迹跟踪";
                    vm.showTrackReplay = true;
                })
            },
            replayVehicle(vehicleNo, beginTime, endTime) {
                let vm = this;
                Http.get(Api.g7.vehicleReviewUrl, {
                    params: {
                        vehicleNo: vehicleNo,
                        beginTime: beginTime,
                        endTime: endTime ? endTime : Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date())
                    }
                }, result => {
                    vm.trackReplayUrl = result.result;
                    vm.title = "轨迹回放";
                    vm.showTrackReplay = true;
                })
            },
            //经停站点--添加/编辑到车时间
            showAddStopOverStationArrivalTimeDialog(item) {
                this.stopOverStationCurrentRow = item;
                this.stopOverStationConfirmArrivalForm.title = `编辑到车时间 【${item.station.name}】`;
                this.stopOverStationConfirmArrivalForm.code = this.rowData.code;
                this.stopOverStationConfirmArrivalForm.stationId = item.id;
                this.stopOverStationConfirmArrivalForm.confirmArrivalTime = item.confirmArrivalTime || '';
                this.stopOverStationConfirmArrivalForm.dirverArrivalTime = item.actualArrivalTime;
                this.showStopOverStationConfirmArrivalTime = true;
                this.stopOverStationConfirmArrivalForm.clientArrivalTime = item.destActTime;
                if(item.stationFence){
                    this.stopOverStationConfirmArrivalForm.inTime = item.stationFence.inTime;  // 进入围栏时间
                    this.stopOverStationConfirmArrivalForm.outTime = item.stationFence.outTime; // 离开围栏时间
                }
                 if(this.stopOverStationConfirmArrivalForm.clientArrivalTime){
                    this.changeStopOverStationConfirmClientArrivalTime(true)
                    this.stopOverStationConfirmArrivalForm.clientCheck = true
                }
            },
            changeStopOverStationConfirmArrivalTime(val) {
                if ( val ) this.stopOverStationConfirmArrivalForm.clientCheck = false;
                if (val && this.stopOverStationConfirmArrivalForm.dirverArrivalTime) {
                    this.stopOverStationConfirmArrivalForm.confirmArrivalTime = this.stopOverStationConfirmArrivalForm.dirverArrivalTime;
                }
            },
            changeStopOverStationConfirmClientArrivalTime(val) {
                if ( val ) this.stopOverStationConfirmArrivalForm.checked = false;
                if (val && this.stopOverStationConfirmArrivalForm.clientArrivalTime) {
                    this.stopOverStationConfirmArrivalForm.checked = false;
                    this.stopOverStationConfirmArrivalForm.confirmArrivalTime = this.stopOverStationConfirmArrivalForm.clientArrivalTime;
                }
            },
            stopOverStationConfirmArrivalFormSubmit() {
                let vm = this;
                vm.$refs.stopOverStationConfirmArrivalForm.validate((valid) => {
                    if (valid) {
                        if (new Date(vm.stopOverStationConfirmArrivalForm.confirmArrivalTime).getTime() > new Date().getTime()) {
                            vm.$message.warning('站点确认到车时间不能大于当前时间！');
                            vm.stopOverStationConfirmArrivalForm.confirmArrivalTime = '';
                            return;
                        }
                        Http.post(Api.waybill.confirmArriveStation, vm.stopOverStationConfirmArrivalForm, result => {
                            this.stopOverStationCurrentRow.confirmArrivalTime = vm.stopOverStationConfirmArrivalForm.confirmArrivalTime;
                            Http.get(Api.waybill.queryByCode, {params: {'code': vm.rowData.code}}, result => {
                                _.merge(vm.rowData, result.result);
                                vm.rowData.dispatch.dispatchLine.stopOverStation = result.result.dispatch.dispatchLine.stopOverStation;
                                this.currentRow.dispatch.dispatchLine.stopOverStation = result.result.dispatch.dispatchLine.stopOverStation;
                                vm.showStopOverStationConfirmArrivalTime = false;
                                vm.$message.success("到车时间编辑成功！");
                                vm.getCustomer(vm.rowData)
                            })
                        })
                    }
                });
            },
            resetStopOverStationConfirmArrivalForm() {
                this.stopOverStationConfirmArrivalForm = {
                    title: '编辑到车时间',
                    code: '',
                    stationCode: '',
                    checked: false,
                    clientCheck:false,
                    clientArrivalTime: '',
                    dirverArrivalTime: '',
                    confirmArrivalTime: '',
                    inTime:'',
                    outTime:''
                };
            },
            //经停站点--添加发车时间
            showAddDepartureTimeDialog(item) {
                this.confirmDepartureForm.title = `编辑发车时间 【${item.station.name}】`;
                this.confirmDepartureForm.stationId = item.id;
                this.confirmDepartureForm.code = this.rowData.code;
                this.confirmDepartureForm.confirmDepartureTime = item.confirmDepartureTime;
                this.confirmDepartureForm.dirverDepartureTime = item.actualDepartureTime;
                this.showConfirmDepartureTime = true;
                this.confirmDepartureForm.clientDepartureTime = item.srcActTime;
                this.confirmDepartureForm.inTime = item.stationFence.inTime; // 进入围栏时间
                this.confirmDepartureForm.outTime = item.stationFence.outTime; // 离开围栏时间
                if(this.confirmDepartureForm.clientDepartureTime){
                    this.changeConfirmClientDepartureTime(true)
                    this.confirmDepartureForm.clientCheck = true
                }
            },
            changeConfirmDepartureTime(val) {
                if ( val ) this.confirmDepartureForm.clientCheck = false;
                if (val && this.confirmDepartureForm.dirverDepartureTime) {
                    this.confirmDepartureForm.confirmDepartureTime = this.confirmDepartureForm.dirverDepartureTime;
                }
            },
            changeConfirmClientDepartureTime(val) {
                if ( val ) this.confirmDepartureForm.checked = false;
                if (val && this.confirmDepartureForm.clientDepartureTime) {
                    this.confirmDepartureForm.confirmDepartureTime = this.confirmDepartureForm.clientDepartureTime;
                }
            },
            confirmDepartureFormSubmit() {
                let vm = this;
                vm.$refs.confirmDepartureForm.validate((valid) => {
                    if (valid) {
                        if (new Date(vm.confirmDepartureForm.confirmDepartureTime).getTime() > new Date().getTime()) {
                            vm.$message.warning('站点确认发车时间不能大于当前时间！');
                            vm.confirmDepartureForm.confirmDepartureTime = '';
                            return;
                        }
                        Http.post(Api.waybill.confirmDepartureStation, vm.confirmDepartureForm, result => {
                            this.stopOverStationCurrentRow.confirmDepartureTime = vm.confirmDepartureForm.confirmDepartureTime;
                            Http.get(Api.waybill.queryByCode, {params: {'code': vm.rowData.code}}, result => {
                                _.merge(vm.rowData, result.result);
                                vm.rowData.dispatch.dispatchLine.stopOverStation = result.result.dispatch.dispatchLine.stopOverStation;
                                this.currentRow.dispatch.dispatchLine.stopOverStation = result.result.dispatch.dispatchLine.stopOverStation;
                                vm.showConfirmDepartureTime = false;
                                vm.$message.success("发车时间编辑成功！");
                                vm.getCustomer(vm.rowData)
                            })
                        })
                    }
                });
            },
            resetConfirmDepartureForm() {
                this.confirmDepartureForm = {
                    title: '编辑发车时间',
                    code: '',
                    stationCode: '',
                    checked: false,
                    clientCheck: false,
                    dirverDepartureTime: '',
                    clientDepartureTime: '',
                    confirmDepartureTime: '',
                    inTime:'',
                    outTime:''
                };
            },
            // 查询更多回单
            async searchMoreBill(){
                let vm = this;
                if(!vm.handleInputConfirm()){
                    return;
                }
                await Common.bill.searchBill(vm.dynamicTags[vm.dynamicTags.length-1],vm.currentWayBillCode).then((res) => {
                    vm.dynamicTags = vm.dynamicTags.concat(res)
                    vm.dynamicTags = Common.util.clean(vm.dynamicTags)
                })
            },
            addProperty(arr,arr2){
                if(!Array.isArray(arr)||!Array.isArray(arr2)) return
                for(let i = 0; i<arr.length; i++){
                    let tempArr2 = _.omit(arr2[i], ['sort']);
                    arr[i] = _.merge(arr[i],tempArr2)
                }
                return arr
            },
            deleteProperty(arr, prop) {
                if(!Array.isArray(arr)||!Array.isArray(prop)) return;
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = _.omit(arr[i], prop);
                }
                return arr;
            },
            //司机上报导出
            driverReportExport(){
                let vm = this;
                vm.exceptionLoading = false;
                axios.get(Api.waybillTrackExport.driverReportExport, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '司机上报记录.xls';
                    link.click();
                    vm.exceptionLoading = true;
                }).catch(reason => {
                    vm.exceptionLoading = true;
                })
            },
            //客服跟踪导出
            followingExport(){
                let vm = this;
                vm.followingLoading = false;
                axios.get(Api.waybillTrackExport.followingExport, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '客服跟踪记录.xls';
                    link.click();
                    vm.followingLoading = true;
                }).catch(reason => {
                    vm.followingLoading = true;
                })
            },
            //运单跟踪导出
            waybillTrackExport(){
                let vm = this;
                vm.trackLoading = false;
                axios.get(Api.waybillTrackExport.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '运单跟踪记录.xls';
                    link.click();
                    vm.trackLoading = true;
                }).catch(reason => {
                    vm.trackLoading = true;
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //司机异常图片下载
            driverExceptionImageDownload(){
                let waybillCodes = [];
                this.multipleSelection.forEach(row => {
                    waybillCodes.push(row.code)
                });
                if (!waybillCodes || waybillCodes.length==0) {
                    this.$message.warning('请选择运单！');
                    return;
                }
                this.driverExceptionImageLoading = false;
                axios.get(Api.waybillTrack.downDriverExceptionImage, {params: {waybillCodes:waybillCodes}, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-zip' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '司机异常图片.zip';
                    link.click();
                    this.driverExceptionImageLoading = true;
                }).catch(reason => {
                    this.driverExceptionImageLoading = true;
                })
            },
            //客服异常图片下载
            waybillTrackImageDownload(){
                let waybillCodes = [];
                this.multipleSelection.forEach(row => {
                    waybillCodes.push(row.code)
                });
                if (!waybillCodes || waybillCodes.length==0) {
                    this.$message.warning('请选择运单！');
                    return;
                }
                this.waybillTrackImageLoading = false;
                axios.get(Api.waybillTrack.downCustomerExceptionImage, {params: {waybillCodes:waybillCodes}, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-zip' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '客服异常图片.zip';
                    link.click();
                    this.waybillTrackImageLoading = true;
                }).catch(reason => {
                    this.waybillTrackImageLoading = true;
                })
            },
            //gps上报
            gpsReport(row) {
                let vm = this;
                vm.gpsReportDialog.searchParam.waybillCode = row.code;
                Http.get(Api.waybillTrack.gpsPage, {params: vm.gpsReportDialog.searchParam}, result => {
                    vm.gpsReportDialog.data = result.result || [];
                    vm.gpsReportDialog.dialogVisible = true;
                })
            },
            gpsReportHandleSizeChange(val){
                this.gpsReportDialog.searchParam.pageSize = val;
                Http.get(Api.waybillTrack.gpsPage, {params: this.gpsReportDialog.searchParam}, result => {
                    this.gpsReportDialog.data = result.result || [];
                })
            },
            gpsReportHandleCurrentChange(val){
                this.gpsReportDialog.searchParam.currentPage = val;
                Http.get(Api.waybillTrack.gpsPage, {params: this.gpsReportDialog.searchParam}, result => {
                    this.gpsReportDialog.data = result.result || [];
                })
            },
            remindTimeChange(row){
                let vm = this;
                Http.post(Api.waybillTrack.gpsModifyRemindTime, {id: row.id, remindTime: row.remindTime}, result => {
                    vm.$message.success('提醒开始时间修改成功！');
                    vm.gpsReportDialog.dialogVisible = false;
                })
            },
            resetGpsReportDialog(){
                this.gpsReportDialog.searchParam = {
                    pageSize: 10,
                    currentPage: 1,
                    waybillCode: ''
                }
                this.gpsReportDialog.data = [];
                this.searchList();
            },
        }
    }
</script>

