<template>
    <el-container style="height: 100%;" id="fence">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 异常管理</el-breadcrumb-item>
                <el-breadcrumb-item>围栏异常</el-breadcrumb-item>
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
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input clearable v-model="searchParam.waybillCode" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="操作类型:">
                            <template>
                                <el-select v-model="searchParam.operationType" clearable style="display: block;">
                                    <el-option
                                        v-for="item in operationTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="异常类型:">
                            <template>
                                <el-select v-model="searchParam.exceptionType" clearable style="display: block;">
                                    <el-option
                                        v-for="item in exceptionOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="处理状态:">
                            <el-select v-model="searchParam.handleFlag" clearable style="display: block;">
                                <el-option
                                    v-for="item in handleFlagOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="异常开始时间:">
                            <date-picker-single v-model="searchParam.startCreateTime" date-type="start" :end-date="searchParam.endCreateTime" max-range-days="90" ></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="异常结束时间:">
                            <date-picker-single v-model="searchParam.endCreateTime" date-type="end" :start-date="searchParam.startCreateTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item label-width="0px" style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" @click="resetSearchParam" size="small">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main" style="">
            <el-button v-if="btnLoading" v-permission="'/fence/export'" size="mini" type="primary"
                       icon="el-icon-download" @click="exportData">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" class="content-table" size="small" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="所属大区" prop="regionName"
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="belongOrgName"
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="客户" min-width="150" show-overflow-tooltip prop="customerName"></el-table-column>
                <el-table-column label="车牌号" header-align="center" prop="vehicleLicenseNum" width="150"></el-table-column>
                <el-table-column label="派车单号" header-align="center" prop="dispatchCode" width="150"></el-table-column>
                <el-table-column label="运单号" header-align="center" prop="waybillCode" width="150">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="操作类型" header-align="center" prop="operationType" width="160">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="FENCE_OPERATION_TYPE"
                                                :value="scope.row.operationType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="异常类型" header-align="center" prop="exceptionType" width="160">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="FENCE_EXCEPTION_TYPE"
                                                :value="scope.row.exceptionType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="异常原因" header-align="center" prop="exceptionReason" width="220"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="600" prop="dispatch"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!--<a href="javascript:void(0)" style="color: #409EFF;display:inline-block;"@click="showLine(scope.row)"></a>-->
                            {{scope.row.lineName}}
                        {{`（${scope.row.startStationName} ——
                        ${scope.row.endStationName}）`}}
                    </template>
                </el-table-column>
                <el-table-column label="站点名称" header-align="center" prop="stationName" min-width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="处理状态" header-align="center" prop="handleFlag" width="150">
                    <template slot-scope="scope">
                       {{scope.row.handleFlag ? "已处理" : "未处理"}}
                    </template>
                </el-table-column>
                <el-table-column label="处理意见" header-align="center" prop="handleRemark" width="200"></el-table-column>
               <!-- <el-table-column label="创建人" header-align="center" prop="createUser" width="150"></el-table-column>-->
                <el-table-column label="创建时间" header-align="center" prop="createTime" width="150"></el-table-column>
                <el-table-column label="处理人" header-align="center" prop="modifyUser" width="150"></el-table-column>
                <el-table-column label="处理时间" header-align="center" prop="handleTime" width="150"></el-table-column>
                <el-table-column
                    fixed="right"
                    min-width="240"
                    header-align="center"
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button v-permission="'/fence/showErrDetailDialog'" @click="showErrDetailDialog(scope.row)"
                                   type="text" size="small">查看
                        </el-button>
                        <el-button type="text" v-permission="'/fence/handleException'" size="mini" :disabled="scope.row.handleFlag"
                                   @click="showHandleException(scope.row)" >{{scope.row.handleFlag ? "已处理" : "待处理"}}
                        </el-button>
                        <el-button type="text" size="mini" @click="watchGrantList(scope.row)"
                                   v-permission="'/fence/watchGrantList'">查看处理详情
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
        <el-dialog title="异常详情" :visible.sync="dialogErrDetailVisible" width="90%" :top="marginTop" @close="close">
            <el-form inline size="small" :model="ErrDetailForm" ref="ErrDetailForm" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车牌号:" prop="vehicleLicenseNum">
                            {{ErrDetailForm.vehicleLicenseNum}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:" prop="waybillCode">
                            {{ErrDetailForm.waybillCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="线路名称:" prop="lineName">
                            {{ErrDetailForm.lineName}}{{`（${ErrDetailForm.startStationName}
                            ——
                            ${ErrDetailForm.endStationName}）`}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="操作类型:" prop="operationType">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="FENCE_OPERATION_TYPE"
                                                        :value="ErrDetailForm.operationType"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="异常类型:" prop="exceptionType">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="FENCE_EXCEPTION_TYPE"
                                                        :value="ErrDetailForm.exceptionType"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="异常描述:" prop="exceptionReason">
                            {{ErrDetailForm.exceptionReason}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="站点名称:" prop="stationName">
                            {{ErrDetailForm.stationName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="站点位置:" prop="stationLat">
                            {{stationMap}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="GPS显示位置:" prop="gpsLat">
                            {{GPSMap}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机显示位置:" prop="mobileLat">
                            {{mobileMap}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4" :offset="20" >
                        <el-button-group>
                            <el-button type="primary" size="small" plain autofocus :disabled="!(stationLng||stationLat)"
                                       @click="changeCenter(0)">站点
                            </el-button>
                            <el-button type="primary" size="small" :disabled="!(GPSLng||GPSLat)" plain
                                       @click="changeCenter(1)">GPS
                            </el-button>
                            <el-button type="primary" size="small" :disabled="!(mobileLng||mobileLat)" plain
                                       @click="changeCenter(2)">手机
                            </el-button>
                        </el-button-group>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div id="detailMapContainer" style="width:100%; height:400px"></div>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <!-- 修改发车时间 -->
        <el-dialog title="修改发车时间" :visible.sync="editActualDepartureTimeVisible" width="70%"
                   @close="resetActualDepartureTimeForm" style="margin-left: 50%;">
            <el-form size="small" :model="editActualDepartureTimeForm" ref="editActualDepartureTimeForm"
                     label-width="30%">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="进入围栏时间：">
                            {{clearNull('driverFenceException.dispatch.dispatchLine.stopOverStation[0].stationFence.inTime')}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="离开围栏时间：">
                            {{clearNull('driverFenceException.dispatch.dispatchLine.stopOverStation[0].stationFence.outTime')}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="canSearch">
                    <el-col :span="22">
                        <el-form-item label="客户发车：">
                            <span v-if="departure.clientDepartureTime"><el-checkbox v-model="departure.clientCheck" @change="changeClientDepartureTime"> ( 勾选同步至发车时间 ) {{departure.clientDepartureTime}}</el-checkbox></span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="发车时间：" prop="actualDepartureTime"
                                      :rules="{required:true,message:'请输入发车时间！'}">
                            <el-date-picker style="display:block; width:100%;"
                                            v-model="editActualDepartureTimeForm.actualDepartureTime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            type="datetime" placeholder="选择日期时间"
                                            :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="回单附件：" id="toInline">
                             <el-checkbox v-model="urlChecked" @change="synchronous"></el-checkbox>
                            <show-image ref="showImage" :url="url"></show-image>(勾选同步至回单照片)
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22"  v-if="!editActualDepartureTimeForm.receiptInputs || !editActualDepartureTimeForm.receiptInputs.length">
                        <el-form-item label="回单号：">
                            <el-tag v-for="tag in dynamicTags" :key="tag.index" style="min-width: 100%" closable :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
                            <el-input maxlength="24" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm">
                                <el-button slot="append" type="primary" plain v-if="canSearch" @click="searchMoreBill">查询更多回单</el-button>
                            </el-input>
                            <el-button v-if="inputVisible" type="text" @click="handleInputConfirm" icon="el-icon-circle-check-outline"></el-button>
                            <el-button v-else type="text" @click="showInput" circle icon="el-icon-circle-plus-outline" :disabled="dynamicTags.length >= 20"></el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="22" v-else>
                        <el-form-item label="回单号：">
                            <el-input v-for="(item,index) in editActualDepartureTimeForm.receiptInputs" :key="index" :value="dynamicInputs[index]" :placeholder="item.placeholder" @input="val => $set(dynamicInputs, index, val)">
                                <template slot="prepend">{{item.receiptType}}</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="回单照片：">
                            <upload-picture ref="receiptAttachment" :maxNumber="20" :limit="20" v-model="editActualDepartureTimeForm.receiptUrl" cleanList></upload-picture>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="异常原因:">
                            <template>
                                <el-select v-model="handleExceptionReason" style="display: block;">
                                    <el-option
                                        v-for="item in exceptionReasonTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="处理意见：" prop="handleRemark" :rules="{required:true,message:'请输入处理意见！'}">
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="editActualDepartureTimeForm.handleRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="editActualDepartureTimeVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="actualDepartureTimeFormSubmit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改到车时间 -->
        <el-dialog title="修改到车时间" :visible.sync="editConfirmArrivalTimeVisible" width="80%"
                   @close="resetConfirmArrivalTimeForm" style="margin-left: 50%;">
            <el-form size="small" :model="editConfirmArrivalTimeForm" ref="editConfirmArrivalTimeForm"
                     label-width="30%">
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="进入围栏时间：">
                            {{formatInTime()}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="离开围栏时间：">
                            {{formatOutTime()}}
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
                        <el-form-item label="到达时间：" prop="confirmArrivalTime"
                                      :rules="{required:true,message:'请输入到达时间！'}">
                            <el-date-picker style="display:block; width:100%;"
                                            v-model="editConfirmArrivalTimeForm.confirmArrivalTime"
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
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="回单附件：">
                            <show-image ref="showImage" :url="url"></show-image>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16"  v-if="!editConfirmArrivalTimeForm.receiptInputs || !editConfirmArrivalTimeForm.receiptInputs.length">
                        <el-form-item label="回单号：">
                            <el-tag v-for="tag in dynamicTags" :key="tag.index" style="min-width: 100%" closable :disable-transitions="false" @close="handleClose(tag)">{{tag}}</el-tag>
                            <el-input maxlength="24" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm">
                                <el-button slot="append" type="primary" plain v-if="canSearch" @click="searchMoreBill">查询更多回单</el-button>
                            </el-input>
                            <el-button v-if="inputVisible" type="text" @click="handleInputConfirm" icon="el-icon-circle-check-outline"></el-button>
                            <el-button v-else type="text" @click="showInput" circle icon="el-icon-circle-plus-outline" :disabled="dynamicTags.length >= 4"></el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16" v-else>
                        <el-form-item label="回单号：">
                            <el-input v-for="(item,index) in editConfirmArrivalTimeForm.receiptInputs" :key="index" :value="dynamicInputs[index]" :placeholder="item.placeholder" @input="val => $set(dynamicInputs, index, val)">
                                <template slot="prepend">{{item.receiptType}}</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="异常原因:">
                            <template>
                                <el-select v-model="handleExceptionReason" style="display: block;">
                                    <el-option
                                        v-for="item in exceptionReasonTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="处理意见：" prop="handleRemark" :rules="{required:true,message:'请输入处理意见！'}">
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="editConfirmArrivalTimeForm.handleRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="editConfirmArrivalTimeVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confirmArrivalTimeFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 经停站点到车时间 -->
        <el-dialog :title="confirmArrivalForm.title" :visible.sync="showConfirmArrivalTime" width="50%"
                   @close="resetConfirmArrivalForm">
            <el-form size="small" :model="confirmArrivalForm" ref="confirmArrivalForm" label-width="30%">

                <el-row>
                    <el-col :span="16">
                        <el-form-item label="司机到车时间：">
                            <el-checkbox v-model="confirmArrivalForm.checked" @change="changeConfirmArrivalTime">&nbsp;&nbsp;&nbsp;&nbsp;(勾选同步至到车时间)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{confirmArrivalForm.dirverArrivalTime}}</el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="进入围栏时间：">
                            {{confirmArrivalForm.inTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="离开围栏时间：">
                            {{confirmArrivalForm.outTime}}
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
                                            v-model="confirmArrivalForm.confirmArrivalTime"
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
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="异常原因:">
                            <template>
                                <el-select v-model="handleExceptionReason" style="display: block;">
                                    <el-option
                                        v-for="item in exceptionReasonTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="处理意见：" prop="handleRemark" :rules="{required:true,message:'请输入处理意见！'}">
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="confirmArrivalForm.handleRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showConfirmArrivalTime = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confirmArrivalFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 经停站点发车时间 -->
        <el-dialog :title="confirmDepartureForm.title" :visible.sync="showConfirmDepartureTime" width="40%"
                   @close="resetConfirmDepartureForm">
            <el-form size="small" :model="confirmDepartureForm" ref="confirmDepartureForm" label-width="30%">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="司机发车时间：">
                            <el-checkbox v-model="confirmDepartureForm.checked" @change="changeConfirmDepartureTime">
                                &nbsp;&nbsp;&nbsp;&nbsp;(勾选同步至发车时间)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{confirmDepartureForm.dirverDepartureTime}}
                            </el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="进入围栏时间：">
                            {{confirmDepartureForm.inTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="离开围栏时间：">
                            {{confirmDepartureForm.outTime}}
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
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="异常原因:">
                            <template>
                                <el-select v-model="handleExceptionReason" style="display: block;">
                                    <el-option
                                        v-for="item in exceptionReasonTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="处理意见：" prop="handleRemark" :rules="{required:true,message:'请输入处理意见！'}">
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="confirmDepartureForm.handleRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showConfirmDepartureTime = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confirmDepartureFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 线路信息详情 -->
        <line-info v-if="showLineInfo" :dialogVisible="showLineInfo" @close="hideLineInfo"
                   :currentRow="currentRow"></line-info>
        <!--查看异常处理明细-->
        <DriverFenceExceptionRecordDetail v-if="showExceptionRecordDetail" :visible="showExceptionRecordDetail" @close="hideDetailExceptionRecord"
                         :currentRows="currentRows"></DriverFenceExceptionRecordDetail>
    </el-container>
</template>
<script>

    import {Http, Api, Validate, Common} from 'src/global'
    import AMap from 'AMap'
    import lineInfo from 'src/components/page/operation/myDispatch/LineInfoDialog'
    import DriverFenceExceptionRecordDetail from '../operation/DriverFenceExceptionRecordDetail'
    import ElRow from "element-ui/packages/row/src/row";
    import axios from 'axios'
    import timeCalculation from 'src/components/common/util/timeCalculation.js'

    export default {
        data() {
            return {
                lineFrom: {
                    customer:{name:''},
                    dispatchLine: {
                        lineName: '',
                        startStation: {
                            name: '',
                            city:{name:''}
                        },
                        endStation: {
                            name: '',
                            city:{name:''}
                        },
                        lineType:{name:''},
                        operationType:{name:''}
                    },
                    stopOverCityName:'',
                },
                url:'',//回单图片
                urlChecked:false, // 默认勾选回单附件
                //回单号
                common: Common,
                onTimeFlag: '',
                overTimeStr: '',
                waybillCode: '',
                dynamicTags: [],
                dynamicInputs: [],
                inputVisible: false,
                inputValue: '',
                canSearch:false,
                departure:{
                    checked: false,
                    clientCheck:false,
                    departureTime:"",
                    driverDepartureTime: "",
                    clientDepartureTime: ""
                },
                zeyiDepartureTime: "",
                zeyiConfirmArrivalTime: "",
                zeyiStopOverStationConfirmArrivalTime: "",
                zeyiConfirmDepartureTime: "",
                //显示围栏异常处理明细
                currentRows: null,//操作行的数据
                showExceptionRecordDetail:false,
                //经停站点--到车时间
                showConfirmArrivalTime: false,
                confirmArrivalForm: {
                    title: '编辑到车时间',
                    driverFenceExceptionId:'',
                    code: '',
                    stationId: '',
                    checked: false,
                    dirverArrivalTime: '',
                    confirmArrivalTime: '',
                    handleRemark: '',
                    clientCheck:false,
                    clientArrivalTime: "",
                    handleExceptionReason: this.handleExceptionReason,
                    inTime:'',
                    outTime:''

                },
                stopOverStationConfirmArrivalForm: {
                    checked: false,
                    clientCheck: false,
                    clientArrivalTime: ''
                },
                //经停站点--发车时间
                showConfirmDepartureTime: false,
                confirmDepartureForm: {
                    title: '编辑发车时间',
                    driverFenceExceptionId:'',
                    code: '',
                    stationId: '',
                    checked: false,
                    dirverDepartureTime: '',
                    confirmDepartureTime: '',
                    handleRemark: '',
                    clientCheck: false,
                    clientDepartureTime: '',
                    handleExceptionReason: this.handleExceptionReason,
                    inTime:'',
                    outTime:''
                },
                //修改发车时间
                editActualDepartureTimeVisible: false,
                editActualDepartureTimeForm: {
                    driverFenceExceptionId:'',
                    code:'',
                    receiptUrl:'',
                    actualDepartureTime: '',
                    handleRemark: '',
                    receiptCodeList:[],
                    receiptInputs: [],
                    handleExceptionReason: this.handleExceptionReason
                },
                //修改到车时间
                editConfirmArrivalTimeVisible: false,
                editConfirmArrivalTimeForm: {
                    driverFenceExceptionId:'',
                    code: '',
                    confirmArrivalTime: '',
                    handleRemark: '',
                    receiptCodeList:[],
                    receiptInputs: [],
                    handleExceptionReason: this.handleExceptionReason
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                currentRow: null,//操作行的数据
                showLineInfo: false,//线路信息详情
                handleExceptionRemark: '',
                driverFenceException: {
                    dispatch:{
                        dispatchLine:{
                            stopOverStation:[]
                        }
                    }
                },
                handleExceptionReason: '',
                exceptionReasonTypeOptions: [{
                    value: 'DRIVER_OPERATION_ERROR',
                    label: '司机操作错误'
                },{
                    value: 'DISPATCH_ASSIGNMENT_ERROR',
                    label: '调度指派错误'
                },{
                    value: 'STATION_ADDRESS_ERROR',
                    label: '站点地址错误'
                },{
                    value: 'VEHICLE_GPS_ERROR',
                    label: '车辆GPS异常'
                },{
                    value: 'MODIFY_LINE_OR_STATION_ERROR',
                    label: '更换线路或站点'
                },{
                    value: 'OTHER_ERROR',
                    label: '其他'
                }],
                operationTypeOptions:[{
                    value: 'DRIVER_DEPARTURE',
                    label: '发车'
                },{
                    value: 'DRIVER_IN_STATION_SIGN',
                    label: '经停进站'
                },{
                    value: 'DRIVER_OUT_STATION_SIGN',
                    label: '经停出站'
                },{
                    value: 'DRIVER_ARRIVE_SIGN',
                    label: '到达'
                }],
                exceptionOptions: [{
                    value: 'DRIVER_VEHICLE_EXCEPTION',
                    label: '车辆异常'
                }, {
                    value: 'DRIVER_TIME_EXCEPTION',
                    label: '时间异常'
                }, {
                    value: 'DRIVER_OUT_FENCE_EXCEPTION',
                    label: '围栏异常'
                }],
                handleFlagOptions: [{
                    value: true,
                    label: '已处理'
                }, {
                    value: false,
                    label: '未处理'
                }],
                mapAddress: '', // 地图返回的地址
                multipleSelection: [],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    orgCode: '',
                    vehicleCode: '',
                    dispatchCode: '',
                    waybillCode: '',
                    operationType:'',
                    exceptionType: '',
                    handleFlag: false,
                    customerCode: '',
                    startCreateTime: Common.date.dateFormat(new Date(new Date().getTime() - 30*24*3600*1000),"YYYY-MM-DD 00:00:00"),//异常时间
                    endCreateTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59")
                },
                isLoading: false,
                btnLoading: true,
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                stationList: [],
                cityList: [],
                customerList: [],
                ErrDetailForm: {
                    dispatchCode: '',
                    waybillCode: '',
                    operationType:'',
                    exceptionType: '',
                    exceptionReason: '',
                    stationName: '',
                    vehicleLicenseNum:'',
                    lineName:'',
                    startStationName:'',
                    endStationName:'',
                    stationLat: '',
                    stationLng: '',
                    stationRadius: 0,
                    gpsLat: '',
                    gpaLng: '',
                    mobileLat: '',
                    mobileLng: ''
                },
                searchKey: '',
                modifySearchKey: '',
                positionPicker: null,
                map: null,
                mapCircle: null,
                tableHeight: window.innerHeight > 800 ? 500 : null,
                dialogErrDetailVisible: false,
                stationLng: '',
                stationLat: '',
                stationMap: '',
                GPSLng: '',
                GPSLat: '',
                GPSMap: '',
                mobileLng: '',
                mobileLat: '',
                mobileMap: ''
            }
        },
        mounted() {
            //查询表格
            this.searchList();
        },
        components: {
            ElRow,
            lineInfo,DriverFenceExceptionRecordDetail
        },
        computed: {
            marginTop: function () { //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "15vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "8vh";
                }
            },
        },
        watch: {
            'editConfirmArrivalTimeForm.confirmArrivalTime'(confirmArrivalTime) {
                if (!confirmArrivalTime) {
                    this.onTimeFlag = '';
                    this.overTimeStr = '';
                    return;
                }
                let line = this.currentRow.dispatch.dispatchLine;
                let flag = timeCalculation.isOnTime(this.currentRow.dispatch.dispatchLine.stopOverStation, this.currentRow.dispatch.waybill.arrivalTime, this.currentRow.dispatch.waybill.actualDepartureTime, confirmArrivalTime, line.timeConsumeZeyiHour, line.timeConsumeZeyiMin, line.evaluationMode);
                this.onTimeFlag = flag ? '准点' : '晚点';
                let overTimeStr = timeCalculation.getOverTimeStr(this.currentRow.dispatch.dispatchLine.stopOverStation, this.currentRow.dispatch.waybill.arrivalTime, this.currentRow.dispatch.waybill.actualDepartureTime, confirmArrivalTime, line.timeConsumeZeyiHour, line.timeConsumeZeyiMin, line.evaluationMode)
                this.overTimeStr = overTimeStr;
            },
            'confirmArrivalForm.confirmArrivalTime'(confirmArrivalTime) {
                if (!confirmArrivalTime) {
                    this.onTimeFlag = '';
                    this.overTimeStr = '';
                    return;
                }
                let flag = timeCalculation.isOnTimeOfStopOverStation(this.currentRow.dispatch.dispatchLine.stopOverStation, this.currentRow.dispatchStopOverStation.sort, this.currentRow.waybill.actualDepartureTime, confirmArrivalTime)
                this.onTimeFlag = flag ? '准点' : '晚点';
                let overTimeStr = timeCalculation.getOverTimeOfStopOverStation(this.currentRow.dispatch.dispatchLine.stopOverStation, this.currentRow.dispatchStopOverStation.sort, this.currentRow.waybill.actualDepartureTime, confirmArrivalTime)
                this.overTimeStr = overTimeStr;
            }
        },
        methods: {
            formatInTime(){
                let res = ''
                try{
                    res = this.driverFenceException.dispatch.dispatchLine.stopOverStation[this.driverFenceException.dispatch.dispatchLine.stopOverStation.length-1].stationFence.inTime
                }
                catch(err) {
                    res = ''
                }
                return res
            },
              formatOutTime(){
                let res = ''
                try{
                    res = this.driverFenceException.dispatch.dispatchLine.stopOverStation[this.driverFenceException.dispatch.dispatchLine.stopOverStation.length-1].stationFence.outTime
                }
                catch(err) {
                    res = ''
                }
                return res
            },
            clearNull(val){
                let vm = this
                let hasFake = false
                if(val){
                    if(val.includes('[')){
                        val = val.replace('[','.')
                        val = val.replace(']','')
                        hasFake = true
                    }
                    let list = val.split('.')
                    list = list.join('_')
                    list = list.replace(/,/g,'.')
                    list = list.split('_')
                    let res = ''
                    for(let i = 0;i<list.length;i++){
                        let item = list[i]
                        if(i == 0){
                            if(!vm[item]){
                                return res = ''
                            }else{
                                res = vm[item]
                            }
                        }else{
                            if(!res[item]){
                                return res = ''
                            }else{
                                res = res[item]
                            }
                        }
                    }
                    return res
                }
            },
            synchronous(val){
                let vm = this;
                if(val && vm.url){
                    vm.$refs.receiptAttachment.setFileList(vm.url.split(","));
                }
            },
            //回单处理
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
            // 查询更多回单
            async searchMoreBill(){
                let vm = this;
                if(!vm.handleInputConfirm()){
                    return;
                }
                await Common.bill.searchBill(vm.dynamicTags[vm.dynamicTags.length-1],vm.waybillCode).then((res) => {
                    vm.dynamicTags = vm.dynamicTags.concat(res)
                    vm.dynamicTags = vm.common.util.clean(vm.dynamicTags)
                });
            },
            handleInputConfirm() {
                let vm = this;
                let reg = Validate.receipt.pattern;
                let inputValue = vm.inputValue;
                if(inputValue){
                    if (reg.test(inputValue)) {
                        for(let i=0; i<vm.dynamicTags.length; i++){
                            if(inputValue == vm.dynamicTags[i]){
                                vm.inputValue = '';
                                vm.inputVisible = false;
                                vm.$message.error('请勿重复添加回单！');
                                return false
                            }
                        }
                        vm.dynamicTags.push(inputValue);
                    }else{
                        vm.$message.error('请输入正确的回单号！');
                        vm.inputValue = '';
                        return false;
                    }
                }
                vm.inputValue = '';
                vm.inputVisible = false;
                return true;
            },
            //记录围栏异常处理明细
            watchGrantList(row){
                this.currentRows = row;
                this.showExceptionRecordDetail = true;
            },
            //隐藏围栏异常明细
            hideDetailExceptionRecord(){
                this.showExceptionRecordDetail = false;
            },
            //发车修改发车时间
            actualDepartureTimeFormSubmit() {
                let vm = this;
                vm.$refs.editActualDepartureTimeForm.validate((valid) => {
                    if (valid) {
                        if (new Date(vm.editActualDepartureTimeForm.actualDepartureTime).getTime() > new Date().getTime()) {
                            vm.$message.warning('发车时间不能大于当前时间！');
                            vm.editActualDepartureTimeForm.actualDepartureTime = '';
                            vm.editActualDepartureTimeForm.handleRemark = '';
                            vm.editActualDepartureTimeForm.driverFenceExceptionId = '';
                            vm.editActualDepartureTimeForm.receiptUrl = '';
                            return;
                        }
                        //vm.editActualDepartureTimeForm.receiptCodeList = vm.dynamicTags;
                        if(!vm.editActualDepartureTimeForm.receiptInputs || !(vm.editActualDepartureTimeForm.receiptInputs.length>0)){
                            if (!vm.handleInputConfirm()) {
                                return
                            }
                            vm.editActualDepartureTimeForm.receiptCodeList = vm.dynamicTags;
                        }else{
                            vm.editActualDepartureTimeForm.receiptCodeList = vm.dynamicInputs;
                            let arr1 = vm.editActualDepartureTimeForm.receiptInputs.filter((item,index)=>{
                                return  !vm.editActualDepartureTimeForm.receiptCodeList[index] && item.required
                            })
                            if(arr1 && arr1.length>0){
                                vm.$message.warning(arr1[0].receiptType+'必填！');
                                return;
                            }
                            let arr2 = vm.editActualDepartureTimeForm.receiptInputs.filter((item,index)=>{
                                return !!vm.editActualDepartureTimeForm.receiptCodeList[index] && !eval(item.regExp).test(vm.editActualDepartureTimeForm.receiptCodeList[index])
                            })
                            if(arr2 && arr2.length>0){
                                vm.$message.warning(arr2[0].errorMessage);
                                return;
                            }
                        }
                        vm.editActualDepartureTimeForm.handleExceptionReason = vm.handleExceptionReason;
                        vm.editActualDepartureTimeForm.receiptUrl = vm.$refs.receiptAttachment.getFileList().join(',')
                        Http.post(Api.driverFenceException.modifyDepartureTime, vm.editActualDepartureTimeForm, result => {
                            vm.editActualDepartureTimeVisible = false;
                            vm.$message.success("发车时间编辑成功！");
                            vm.searchList();
                        })
                    }
                });
            },
            resetActualDepartureTimeForm() {
                this.editActualDepartureTimeForm = {
                    driverFenceExceptionId:'',
                    code: '',
                    receiptUrl:'',
                    stationId: '',
                    actualDepartureTime: '',
                    handleRemark: '',
                    receiptCodeList:[],
                    receiptInputs: [],
                    handleExceptionReason:''
                }
                this.$refs.receiptAttachment.clearFileList();
                this.url = ""
                this.urlChecked = false
            },
            //到达修改到达时间
            confirmArrivalTimeFormSubmit() {
                let vm = this;
                vm.$refs.editConfirmArrivalTimeForm.validate((valid) => {
                    if (valid) {
                        if (new Date(vm.editConfirmArrivalTimeForm.confirmArrivalTime).getTime() > new Date().getTime()) {
                            vm.$message.warning('到达时间不能大于当前时间！');
                            vm.editConfirmArrivalTimeForm.confirmArrivalTime = '';
                            vm.editConfirmArrivalTimeForm.handleRemark = '';
                            vm.editConfirmArrivalTimeForm.driverFenceExceptionId = '';
                            return;
                        }
                        //vm.editConfirmArrivalTimeForm.receiptCodeList = vm.dynamicTags;
                        if(!vm.editConfirmArrivalTimeForm.receiptInputs || !(vm.editConfirmArrivalTimeForm.receiptInputs.length>0)){
                            if (!vm.handleInputConfirm()) {
                                return
                            }
                            vm.editConfirmArrivalTimeForm.receiptCodeList = vm.dynamicTags;
                        }else{
                            vm.editConfirmArrivalTimeForm.receiptCodeList = vm.dynamicInputs;
                            let arr1 = vm.editConfirmArrivalTimeForm.receiptInputs.filter((item,index)=>{
                                return  !vm.editConfirmArrivalTimeForm.receiptCodeList[index] && item.required
                            })
                            if(arr1 && arr1.length>0){
                                vm.$message.warning(arr1[0].receiptType+'必填！');
                                return;
                            }
                            let arr2 = vm.editConfirmArrivalTimeForm.receiptInputs.filter((item,index)=>{
                                return !!vm.editConfirmArrivalTimeForm.receiptCodeList[index] && !eval(item.regExp).test(vm.editConfirmArrivalTimeForm.receiptCodeList[index])
                            })
                            if(arr2 && arr2.length>0){
                                vm.$message.warning(arr2[0].errorMessage);
                                return;
                            }
                        }
                        vm.editConfirmArrivalTimeForm.handleExceptionReason = vm.handleExceptionReason;
                        Http.post(Api.driverFenceException.modifyArrivalTime, vm.editConfirmArrivalTimeForm, result => {
                            vm.editConfirmArrivalTimeVisible = false;
                            vm.$message.success("到达时间编辑成功！");
                            vm.searchList();
                        })
                    }
                });
            },
            resetConfirmArrivalTimeForm() {
                this.editConfirmArrivalTimeForm = {
                    driverFenceExceptionId:'',
                    code: '',
                    confirmArrivalTime: '',
                    handleRemark: '',
                    receiptCodeList:[],
                    receiptInputs: [],
                    handleExceptionReason:''
                }
            },
            //经停站点--添加/编辑到车时间
            resetConfirmArrivalForm() {
                this.confirmArrivalForm = {
                    title: '编辑到车时间',
                    driverFenceExceptionId: '',
                    code: '',
                    stationId: '',
                    checked: false,
                    dirverArrivalTime: '',
                    confirmArrivalTime: '',
                    handleRemark: '',
                    handleExceptionReason:'',
                    inTime:'',
                    outTime:''
                };
            },
            changeConfirmArrivalTime(val) {
                if(val){
                    this.stopOverStationConfirmArrivalForm.clientCheck = false;
                }
                if (val && this.confirmArrivalForm.dirverArrivalTime) {
                    this.confirmArrivalForm.confirmArrivalTime = this.confirmArrivalForm.dirverArrivalTime;
                }else {
                    this.confirmArrivalForm.confirmArrivalTime = this.zeyiStopOverStationConfirmArrivalTime;
                }
            },
            confirmArrivalFormSubmit() {
                let vm = this;
                vm.$refs.confirmArrivalForm.validate((valid) => {
                    if (valid) {
                        if (new Date(vm.confirmArrivalForm.confirmArrivalTime).getTime() > new Date().getTime()) {
                            vm.$message.warning('站点确认到车时间不能大于当前时间！');
                            vm.confirmArrivalForm.confirmArrivalTime = '';
                            vm.confirmArrivalForm.handleRemark = '';
                            vm.confirmArrivalForm.driverFenceExceptionId = '';
                            vm.confirmArrivalForm.stationId = '';
                            return;
                        }
                        vm.confirmArrivalForm.handleExceptionReason = vm.handleExceptionReason;
                        Http.post(Api.driverFenceException.confirmArriveStation, vm.confirmArrivalForm, result => {
                            vm.showConfirmArrivalTime = false;
                            vm.$message.success("到车时间编辑成功！");
                            vm.searchList();
                        })
                    }
                });
            },
            //经停站点--添加发车时间
            changeConfirmDepartureTime(val) {
                if(val){
                    this.confirmDepartureForm.clientCheck = false;
                }
                if (val && this.confirmDepartureForm.dirverDepartureTime) {
                    this.confirmDepartureForm.confirmDepartureTime = this.confirmDepartureForm.dirverDepartureTime;
                }
            },
            confirmDepartureFormSubmit() {
                let vm = this;
                vm.$refs.confirmDepartureForm.validate((valid) => {
                    if (valid) {
                        if (new Date(vm.confirmDepartureForm.confirmDepartureTime).getTime() > new Date().getTime()) {
                            vm.$message.warning('站点确认发车时间不能大于当前时间！');
                            vm.confirmDepartureForm.confirmDepartureTime = '';
                            vm.confirmDepartureForm.handleRemark = '';
                            vm.confirmDepartureForm.driverFenceExceptionId = '';
                            vm.confirmDepartureForm.stationId = '';
                            return;
                        }
                        vm.confirmDepartureForm.handleExceptionReason = vm.handleExceptionReason;
                        Http.post(Api.driverFenceException.confirmDepartureStation, vm.confirmDepartureForm, result => {
                            vm.showConfirmDepartureTime = false;
                            vm.$message.success("发车时间编辑成功！");
                            vm.searchList();
                        })
                    }
                });
            },
            resetConfirmDepartureForm() {
                this.confirmDepartureForm = {
                    title: '编辑发车时间',
                    driverFenceExceptionId:'',
                    code: '',
                    stationId: '',
                    checked: false,
                    dirverDepartureTime: '',
                    confirmDepartureTime: '',
                    handleRemark: '',
                    handleExceptionReason:'',
                    outTime:'',
                    inTime:''
                };
            },
            showLine(row) {//线路详情
                this.currentRow = row;
                this.lineFrom.customer.name=row.customerName;
                this.lineFrom.dispatchLine.lineName = row.lineName;
                this.lineFrom.dispatchLine.startStation.name=row.startStationName;
                this.lineFrom.dispatchLine.startStation.city.name=row.startStationCityName;
                this.lineFrom.dispatchLine.endStation.name=row.endStationName;
                this.lineFrom.dispatchLine.endStation.city.name=row.endStationCityName;
                this.lineFrom.dispatchLine.lineType=row.lineType
                this.lineFrom.dispatchLine.operationType=row.operationType
                this.lineFrom.dispatchLine.stopOverCityName=row.dispatchLine
                this.showLineInfo = true;
            },
            hideLineInfo() {//关闭线路详情
                this.showLineInfo = false;
            },
            close() {
                this.map.destroy();
                this.stationLng = ''
                this.stationLat = ''
                this.stationMap = ''
                this.GPSLng = ''
                this.GPSLat = ''
                this.GPSMap = ''
                this.mobileLng = ''
                this.mobileLat = ''
                this.mobileMap = ''
            },
            // 参数依次是：地图所在容器缩放比例，站点经度，站点纬度，手机经度，手机纬度，GPS经度，GPS纬度，半径
            initMap: function (id, zoom, stationLng, stationLat, mobileLng, mobileLat, GPSLng, GPSLat, radius) {
                let vm = this;
                let mapConfig = {
                    resizeEnable: true,
                    zoom: zoom //10 add,14 modify
                };
                if (stationLng && stationLat) {
                    mapConfig.center = [stationLng, stationLat];
                }
                //console.log(stationLat, stationLng)
                vm.infoWindow(stationLng, stationLat)
                this.map = new AMap.Map(id, mapConfig);
                let map = this.map;
                map.plugin(["AMap.ToolBar"], function () {
                    map.addControl(new AMap.ToolBar());
                });
                if (location.href.indexOf('&guide=1') !== -1) {
                    map.setStatus({scrollWheel: false})
                }
                let mapCircle = new AMap.Circle({
                    map: map,
                    center: [stationLng, stationLat],
                    radius: radius,
                    strokeColor: "#F33",
                    strokeOpacity: 1,
                    strokeWeight: 3,
                    fillColor: "ee2200",
                    fillOpacity: 0.35
                });

                map.plugin(["AMap.CircleEditor"], function () {
                    let circleEditor = new AMap.CircleEditor(map, mapCircle);
                    circleEditor.open();
                });
                this.mapCircle = mapCircle;

                AMapUI.loadUI(['overlay/SimpleMarker'], function (SimpleMarker) {
                    if (vm._isNotEmpty(stationLng) && vm._isNotEmpty(stationLat)) {
                        let stationMarker = new SimpleMarker({
                            //普通文本
                            iconLabel: {
                                innerHTML: '<div>站点</div>',
                                style: {
                                    color: 'white'//设置文字颜色
                                }
                            },
                            iconStyle: 'blue',

                            map: map,
                            position: [stationLng, stationLat]
                        });
                        stationMarker.on('click', (e) => {
                            vm.map.setCenter([vm.stationLng, vm.stationLat])
                            vm.infoWindow(vm.stationLng, vm.stationLat)
                        })
                    }
                    if (vm._isNotEmpty(mobileLng) && vm._isNotEmpty(mobileLat)) {
                        let telMarker = new SimpleMarker({
                            //普通文本
                            iconLabel: {
                                innerHTML: '<div>手机</div>',
                                style: {
                                    color: 'white'//设置文字颜色
                                }
                            },

                            iconStyle: 'green',

                            map: map,
                            position: [mobileLng, mobileLat]
                        });
                        telMarker.on('click', (e) => {
                            vm.map.setCenter([vm.mobileLng, vm.mobileLat])
                            vm.infoWindow(vm.mobileLng, vm.mobileLat)
                        })
                    }
                    if (vm._isNotEmpty(GPSLng) && vm._isNotEmpty(GPSLat)) {
                        let GPSMarker = new SimpleMarker({

                            //普通文本
                            iconLabel: {
                                innerHTML: '<div>GPS</div>',
                                style: {
                                    color: 'white'//设置文字颜色
                                }
                            },
                            iconStyle: 'red',
                            map: map,
                            position: [GPSLng, GPSLat]
                        });
                        GPSMarker.on('click', (e) => {
                            vm.map.setCenter([vm.GPSLng, vm.GPSLat])
                            vm.infoWindow(vm.GPSLng, vm.GPSLat)
                        })
                    }
                });
            },
            changeClientDepartureTime(val){
                let vm = this;
                if(val){
                    vm.departure.checked = false
                    vm.editActualDepartureTimeForm.actualDepartureTime = vm.departure.departureTime = vm.departure.clientDepartureTime ? vm.departure.clientDepartureTime : vm.zeyiDepartureTime;
                }else{
                    vm.editActualDepartureTimeForm.actualDepartureTime = vm.departure.departureTime = vm.zeyiDepartureTime ? vm.zeyiDepartureTime : Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),6,0,0));
                }
            },
            changeClientArrivalTime(val) {
                let vm = this;
                if (val) {
                    vm.editConfirmArrivalTimeForm.confirmArrivalTime = vm.confirmArrivalForm.clientArrivalTime;
                }else {
                    vm.editConfirmArrivalTimeForm.confirmArrivalTime = vm.zeyiConfirmArrivalTime;
                }
            },
            changeStopOverStationConfirmClientArrivalTime(val) {
                console.log(this.stopOverStationConfirmArrivalForm.clientArrivalTime + "---"+val)
                if ( val ) this.stopOverStationConfirmArrivalForm.checked = false;
                if (val && this.stopOverStationConfirmArrivalForm.clientArrivalTime) {
                    this.stopOverStationConfirmArrivalForm.checked = false;
                    this.confirmArrivalForm.confirmArrivalTime = this.stopOverStationConfirmArrivalForm.clientArrivalTime;
                    this.confirmArrivalForm.checked = false;
                }else {
                    this.confirmArrivalForm.confirmArrivalTime  = this.zeyiStopOverStationConfirmArrivalTime;
                }
            },
            changeConfirmClientDepartureTime(val) {
                if ( val ) {
                    this.confirmDepartureForm.checked = false;
                }
                if (val && this.confirmDepartureForm.clientDepartureTime) {
                    this.confirmDepartureForm.confirmDepartureTime = this.confirmDepartureForm.clientDepartureTime;
                }else {
                    this.confirmDepartureForm.confirmDepartureTime = this.zeyiConfirmDepartureTime;
                }
            },
            changeCenter(index) {
                let vm = this
                if (index === 0 && vm._isNotEmpty(vm.stationLng) && vm._isNotEmpty(vm.stationLat)) {
                    this.map.setCenter([vm.stationLng, vm.stationLat])
                    this.infoWindow(vm.stationLng, vm.stationLat)
                } else if (index === 1 && vm._isNotEmpty(vm.GPSLng) && vm._isNotEmpty(vm.GPSLat)) {
                    this.map.setCenter([vm.GPSLng, vm.GPSLat])
                    this.infoWindow(vm.GPSLng, vm.GPSLat)
                } else if (index === 2 && vm._isNotEmpty(vm.mobileLng) && vm._isNotEmpty(vm.mobileLat)) {
                    this.map.setCenter([vm.mobileLng, vm.mobileLat])
                    this.infoWindow(vm.mobileLng, vm.mobileLat)
                }
            },
            _isNotEmpty(obj) {
                if (typeof obj == "undefined" || obj == null || obj == "") {
                    return false;
                } else {
                    return true;
                }
            },
            toTranslate(lng, lat) {
                let geocoder
                let vm = this;
                if (!geocoder) {
                    geocoder = new AMap.Geocoder({
                        /*city: "010", //城市设为北京，默认：“全国”
                        radius: 500 //范围，默认：500*/
                    });
                }
                return new Promise((resolve, reject) => {
                    geocoder.getAddress([lng, lat], function (status, result) {
                        if (status === 'complete' && result.regeocode) {
                            var address = result.regeocode.formattedAddress;
                            resolve(address)
                        } else {
                            reject("未找到地址信息")
                        }
                    });
                })
            },
            async initMapPosition() {
                let vm = this;
                if (vm._isNotEmpty(vm.stationLng) && vm._isNotEmpty(vm.stationLat)) {
                    vm.stationMap = await vm.toTranslate(vm.stationLng, vm.stationLat).catch(() => vm.stationMap = "暂无法获取站点位置信息")
                } else {
                    vm.stationMap = "获取站点信息失败"
                }
                if (vm._isNotEmpty(vm.GPSLng) && vm._isNotEmpty(vm.GPSLat)) {
                    vm.GPSMap = await vm.toTranslate(vm.GPSLng, vm.GPSLat).catch(() => vm.GPSMap = "暂无法获取GPS位置信息")
                } else {
                    vm.GPSMap = "获取GPS信息失败"
                }
                if (vm._isNotEmpty(vm.mobileLng) && vm._isNotEmpty(vm.mobileLat)) {
                    vm.mobileMap = await vm.toTranslate(vm.mobileLng, vm.mobileLat).catch(() => vm.mobileMap = "暂无法获取手机位置信息")
                } else {
                    vm.mobileMap = "获取手机信息失败"
                }
            },
            async infoWindow(lng, lat) {
                let vm = this;
                vm.mapAddress = await vm.toTranslate(lng, lat).catch(res => vm.mapAddress = res)
                let info = [];
                info.push("<div><h4 style=\"border-bottom:1px solid;line-height:20px\">地址信息</h4>");
                info.push(`<p style=\"margin-top:10px;\">${vm.mapAddress}</p></div>`);
                let opt = {
                    content: info.join(""),
                    offset: new AMap.Pixel(0, -38),
                    position: new AMap.LngLat(lng, lat)
                }
                let windowBox = new AMap.InfoWindow(opt)
                windowBox.open(vm.map)

                // 使用地图ui，定制型存在问题，已更换直接使用原生api

                // AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
                //     var marker = new AMap.Marker({
                //         map: vm.map,
                //         zIndex: 9999999,
                //         position: vm.map.getCenter()
                //     });

                //     var infoWindow = new SimpleInfoWindow({

                //         infoTitle: '<strong>地址信息</strong>',
                //         infoBody: `<p>${vm.mapAddress}</p>`,

                //         //基点指向marker的头部位置
                //         offset: new AMap.Pixel(0, -61)
                //     });

                //     function openInfoWin() {
                //         console.log("点击了")
                //         infoWindow.open(vm.map, marker.getPosition());
                //     }

                //     //marker 点击时打开
                //     AMap.event.addListener(marker, 'click', function() {
                //         openInfoWin();
                //     });

                //     openInfoWin();
                // });
            },

            //搜索
            handleSearch(searchKey, zoom) {
                let searchKeyForCircle = searchKey;
                let oldMapCircle = this.mapCircle;
                let map = this.map;
                let positionPicker = this.positionPicker;
                let vm = this;
                AMap.service('AMap.Geocoder', function () {//回调函数
                    //实例化Geocoder
                    let geocoder = new AMap.Geocoder({});
                    geocoder.getLocation(searchKeyForCircle, function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            //获得了有效经纬度，可以做一些展示工作
                            //比如在获得的经纬度上打上一个Marker
                            oldMapCircle.setCenter(result.geocodes[0].location);
                            positionPicker.start(result.geocodes[0].location);
                            map.setZoomAndCenter(zoom, result.geocodes[0].location);
                            vm.infoWindow(result.geocodes[0].location.lng, result.geocodes[0].location.lat)
                        } else {
                            //获取经纬度失败
                        }
                    });
                })
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    orgCode: '',
                    vehicleCode: '',
                    dispatchCode: '',
                    waybillCode: '',
                    operationType:'',
                    exceptionType: '',
                    handleFlag: false,
                    customerCode: '',
                    startCreateTime: Common.date.dateFormat(new Date(new Date().getTime() - 30*24*3600*1000),"YYYY-MM-DD 00:00:00"),//异常时间
                    endCreateTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59")
                }
            },
            searchList() {
                let vm = this;
                if (!vm.searchParam.startCreateTime || !vm.searchParam.endCreateTime){
                    return vm.$message.warning('请选择异常开始时间和异常结束时间进行查询！');
                }
                vm.isLoading = true;
                Http.get(Api.driverFenceException.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            showWayBill(row) { //运单详情------------------------------------
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
                // window.open(href, '_blank');
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
            },
            showErrDetailDialog(row) {
                let vm = this;
                //console.log(row)
                vm.ErrDetailForm = row;
                vm.dialogErrDetailVisible = true;
                vm.stationLng = vm.ErrDetailForm.stationLng
                vm.stationLat = vm.ErrDetailForm.stationLat
                vm.mobileLng = vm.ErrDetailForm.mobileLng
                vm.mobileLat = vm.ErrDetailForm.mobileLat
                vm.GPSLng = vm.ErrDetailForm.gpsLng
                vm.GPSLat = vm.ErrDetailForm.gpsLat
                setTimeout(function () {
                    vm.initMap("detailMapContainer", 14, vm.stationLng, vm.stationLat, vm.mobileLng, vm.mobileLat, vm.GPSLng, vm.GPSLat, vm.ErrDetailForm.stationRadius);
                    vm.initMapPosition()
                }, 0);
                /*Http.get(Api.driverFenceException.queryById, {params: {'id': row.id}}, result => {
                    console.log(result.result)

                })*/
            },
            showHandleException(row) {
                let vm = this;
                vm.waybillCode = row.waybillCode;
                //是否显示input组件
                Http.get(Api.dispatch.getCustomerReceipt, {params: {dispatchCode: row.dispatchCode}}, result => {
                    this.editConfirmArrivalTimeForm.receiptInputs = result.result || [];
                    this.editActualDepartureTimeForm.receiptInputs = result.result || [];
                    this.dynamicInputs = this.editActualDepartureTimeForm.receiptInputs.map((item,index)=>{
                        return ''
                    })
                    Http.get(Api.driverFenceException.queryById, {params: {'id': row.id}}, result => {
                        //console.log(result.result)
                        this.currentRow = result.result;
                        vm.driverFenceException = result.result;
                        if (vm.driverFenceException.operationType === 'DRIVER_DEPARTURE') {
                            vm.editActualDepartureTimeVisible = true;
                            vm.editActualDepartureTimeForm.code = vm.driverFenceException.waybillCode;
                            vm.editActualDepartureTimeForm.actualDepartureTime = vm.driverFenceException.waybill.actualDepartureTime;
                            vm.editActualDepartureTimeForm.driverFenceExceptionId = row.id;
                            vm.editActualDepartureTimeForm.stationId = vm.driverFenceException.dispatchStopOverStationId;
                            vm.zeyiDepartureTime = vm.editActualDepartureTimeForm.actualDepartureTime;
                            vm.url = vm.driverFenceException.dispatch.dispatchLine.stopOverStation[0].attachment;
                            if(row.exceptionType == 'DRIVER_VEHICLE_EXCEPTION'){
                                vm.handleExceptionReason = 'VEHICLE_GPS_ERROR';
                            }else if(row.exceptionType == 'DRIVER_TIME_EXCEPTION' || row.exceptionType == 'DRIVER_OUT_FENCE_EXCEPTION'){
                                vm.handleExceptionReason = 'DRIVER_OPERATION_ERROR';
                            }
                            vm.canSearch = Common.bill.canSearch(row.customerTopCode);
                            let Arry =[];
                            if(!_.isNil(result.result.waybillReceiptList)){
                                result.result.waybillReceiptList.forEach((item)=>{
                                    Arry.push(item.code);
                                });
                            }
                            vm.dynamicTags = Arry;
                            //vm.dynamicInputs = Arry;
                            Arry.forEach((item,index)=>{
                                vm.$set(vm.dynamicInputs, index, item)
                            })
                            if(vm.canSearch){
                                Http.get(Api.waybill.getCustomerWaybill,{params:{'waybillCode':row.waybillCode}},customerResult => {
                                    if(customerResult.result) {
                                        vm.departure.clientDepartureTime = customerResult.result.srcActTime
                                        if(vm.departure.clientDepartureTime){
                                            vm.departure.clientCheck = true
                                            vm.changeClientDepartureTime(true)
                                        }
                                    }
                                })
                            }

                        } else if (vm.driverFenceException.operationType === 'DRIVER_ARRIVE_SIGN') {
                            vm.editConfirmArrivalTimeVisible = true;
                            vm.editConfirmArrivalTimeForm.code = vm.driverFenceException.waybillCode;
                            vm.editConfirmArrivalTimeForm.confirmArrivalTime = vm.driverFenceException.waybill.confirmArrivalTime;
                            vm.editConfirmArrivalTimeForm.driverFenceExceptionId = row.id;
                            let stopOverStation = this.currentRow.dispatch.dispatchLine.stopOverStation;
                            vm.url = stopOverStation[stopOverStation.length-1].attachment;
                            if(row.exceptionType == 'DRIVER_VEHICLE_EXCEPTION'){
                                vm.handleExceptionReason = 'VEHICLE_GPS_ERROR';
                            }else if(row.exceptionType == 'DRIVER_TIME_EXCEPTION' || row.exceptionType == 'DRIVER_OUT_FENCE_EXCEPTION'){
                                vm.handleExceptionReason = 'DRIVER_OPERATION_ERROR';
                            }

                            vm.zeyiConfirmArrivalTime = vm.editConfirmArrivalTimeForm.confirmArrivalTime;
                            vm.canSearch = Common.bill.canSearch(row.customerTopCode);
                            let Arry =[];
                            if(!_.isNil(result.result.waybillReceiptList)){
                                result.result.waybillReceiptList.forEach((item)=>{
                                    Arry.push(item.code);
                                });
                            }
                            vm.dynamicTags = Arry;
                            //vm.dynamicInputs = Arry;
                            Arry.forEach((item,index)=>{
                                vm.$set(vm.dynamicInputs, index, item)
                            })
                            if(vm.canSearch){
                                Http.get(Api.waybill.getCustomerWaybill,{params:{'waybillCode':row.waybillCode}},customerResult => {
                                    if(customerResult.result) {
                                        vm.confirmArrivalForm.clientArrivalTime = customerResult.result.destActTime
                                        if(vm.confirmArrivalForm.clientArrivalTime){
                                            vm.confirmArrivalForm.clientCheck = true
                                            vm.changeClientArrivalTime(true)
                                        }
                                    }
                                })
                            }

                        } else if (vm.driverFenceException.operationType === 'DRIVER_IN_STATION_SIGN') {
                            vm.confirmArrivalForm.title = `编辑到车时间 【${vm.driverFenceException.station ? vm.driverFenceException.station.name : ''}】`;
                            vm.confirmArrivalForm.code = vm.driverFenceException.waybillCode;
                            vm.confirmArrivalForm.stationId = vm.driverFenceException.dispatchStopOverStationId;
                            vm.confirmArrivalForm.confirmArrivalTime = (vm.driverFenceException.dispatchStopOverStation ? vm.driverFenceException.dispatchStopOverStation.confirmArrivalTime : '') || '';
                            vm.confirmArrivalForm.dirverArrivalTime = vm.driverFenceException.dispatchStopOverStation ? vm.driverFenceException.dispatchStopOverStation.actualArrivalTime : '';
                            vm.confirmArrivalForm.driverFenceExceptionId = row.id;
                            vm.confirmArrivalForm.inTime = vm.getTransitInTime();
                            vm.confirmArrivalForm.outTime = vm.getTransitOutTime();
                            if(row.exceptionType == 'DRIVER_VEHICLE_EXCEPTION'){
                                vm.handleExceptionReason = 'VEHICLE_GPS_ERROR';
                            }else if(row.exceptionType == 'DRIVER_TIME_EXCEPTION' || row.exceptionType == 'DRIVER_OUT_FENCE_EXCEPTION'){
                                vm.handleExceptionReason = 'DRIVER_OPERATION_ERROR';
                            }
                            vm.canSearch = Common.bill.canSearch(row.customerTopCode);
                            vm.zeyiStopOverStationConfirmArrivalTime = vm.confirmArrivalForm.confirmArrivalTime;
                            if(vm.canSearch){
                                Http.get(Api.waybill.getCustomerWaybill,{params:{'waybillCode':row.waybillCode}},customerResult => {
                                    if(customerResult.result) {
                                        let timeDetail = customerResult.result.timeDetails.find(function(value, index, arr) {
                                            return result.result.dispatchStopOverStation ? (result.result.dispatchStopOverStation.sort = index) : null;
                                        });
                                        vm.stopOverStationConfirmArrivalForm.clientArrivalTime = timeDetail ? timeDetail.destActTime : null;
                                        if(vm.stopOverStationConfirmArrivalForm.clientArrivalTime){
                                            vm.stopOverStationConfirmArrivalForm.clientCheck = true
                                            vm.changeStopOverStationConfirmClientArrivalTime(true)
                                        }
                                    }
                                })
                            }
                            vm.showConfirmArrivalTime = true;

                        } else if (vm.driverFenceException.operationType === 'DRIVER_OUT_STATION_SIGN') {
                            vm.confirmDepartureForm.title = `编辑发车时间 【${vm.driverFenceException.station ? vm.driverFenceException.station.name : ''}】`;
                            vm.confirmDepartureForm.code = vm.driverFenceException.waybillCode;
                            vm.confirmDepartureForm.stationId = vm.driverFenceException.dispatchStopOverStationId;
                            vm.confirmDepartureForm.confirmDepartureTime = vm.driverFenceException.dispatchStopOverStation ? vm.driverFenceException.dispatchStopOverStation.confirmDepartureTime : '';
                            vm.confirmDepartureForm.dirverDepartureTime = vm.driverFenceException.dispatchStopOverStation ? vm.driverFenceException.dispatchStopOverStation.actualDepartureTime : '';
                            vm.confirmDepartureForm.driverFenceExceptionId = row.id;
                            vm.confirmDepartureForm.inTime = vm.getTransitInTime();
                            vm.confirmDepartureForm.outTime = vm.getTransitOutTime();
                            if(row.exceptionType == 'DRIVER_VEHICLE_EXCEPTION'){
                                vm.handleExceptionReason = 'VEHICLE_GPS_ERROR';
                            }else if(row.exceptionType == 'DRIVER_TIME_EXCEPTION' || row.exceptionType == 'DRIVER_OUT_FENCE_EXCEPTION'){
                                vm.handleExceptionReason = 'DRIVER_OPERATION_ERROR';
                            }
                            vm.canSearch = Common.bill.canSearch(row.customerTopCode);
                            vm.zeyiConfirmDepartureTime = vm.confirmDepartureForm.confirmDepartureTime;
                            if(vm.canSearch){
                                Http.get(Api.waybill.getCustomerWaybill,{params:{'waybillCode':row.waybillCode}},customerResult => {
                                    if(customerResult.result) {
                                        let timeDetail = customerResult.result.timeDetails.find(function(value, index, arr) {
                                            return result.result.dispatchStopOverStation ? (result.result.dispatchStopOverStation.sort = index) : null;
                                        });
                                        vm.confirmDepartureForm.clientDepartureTime = timeDetail ? timeDetail.srcActTime : null;
                                        if(vm.confirmDepartureForm.clientDepartureTime){
                                            vm.confirmDepartureForm.clientCheck = true
                                            vm.changeConfirmClientDepartureTime(true)
                                        }
                                    }
                                })
                            }
                            vm.showConfirmDepartureTime = true;
                        }
                    })
                })
            },
            getTransitInTime(){
                let res = ''
                let stationCode = this.driverFenceException.dispatchStopOverStationId
                try{
                    let list = this.driverFenceException.dispatch.dispatchLine.stopOverStation
                    for(let i = 0;i<list.length;i++){
                        let item = list[i]
                        if(item.id === stationCode){
                            if(item.stationFence){
                                res = item.stationFence.inTime
                            }
                        }
                    }

                }
                catch(err) {
                    res = ''
                }
                console.log(res)
                return res
            },
            getTransitOutTime(){
                let res = ''
                let stationCode = this.driverFenceException.dispatchStopOverStationId
                try{
                    let list = this.driverFenceException.dispatch.dispatchLine.stopOverStation
                    for(let i = 0;i<list.length;i++){
                        let item = list[i]
                        if(item.id === stationCode){
                            if(item.stationFence){
                                res = item.stationFence.outTime
                            }
                        }
                    }

                }
                catch(err) {
                    res = ''
                }
                return res
            },
            exportData() {
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                axios.get(Api.driverFenceException.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    ;//配置下载的文件名
                    link.download = '围栏异常表.xls'
                    link.click();
                    vm.btnLoading = true;
                }).catch(reason => {
                    vm.btnLoading = true;
                })
            }
        }
    }
</script>
<style scoped>
    .el-dialog__body {
        padding-top: 0;
        padding-bottom: 0;
    }
</style>
<style>
 #fence .imageViewerMask{
        width:50%!important;
        right:50%!important;
    }
    #toInline .el-form-item__content{
        display: flex;
    }
    #toInline .el-form-item__content>div{
        margin: 0 20px;
    }
</style>

