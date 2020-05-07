<template>
    <el-container id="standby">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 发车计划</el-breadcrumb-item>
                <el-breadcrumb-item>待发车辆</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="派车单号:">
                            <el-input v-model="searchParam.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机发车:">
                            <dictionary-select option-name="BOOLEAN_FLAG" v-model="searchParam.driverDepartureFlag"
                                               style="display:block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode"
                                                style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="回单号:">
                            <el-input v-model="searchParam.receiptCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发地:">
                            <district-select v-model="searchParam.startCityArr" style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的地:">
                            <district-select v-model="searchParam.endCityArr" style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="预计发车开始:">
                            <date-picker-single v-model="searchParam.startExpectDepartureTime" date-type="start"
                                                :end-date="searchParam.endExpectDepartureTime"
                                                :disabled-future-date="false"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预计发车结束:">
                            <date-picker-single v-model="searchParam.endExpectDepartureTime" date-type="end"
                                                :start-date="searchParam.startExpectDepartureTime"
                                                :disabled-future-date="false"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应付审批审核:">
                            <dictionary-select option-name="PAYMENT_CHECK_BEFORE_APPROVAL_FLAG"
                                               v-model="searchParam.paymentCheckBeforeApprovalFlag"
                                               style="display:block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应发未发:">
                            <dictionary-select option-name="NO_DEPART_VEHICLE_FLAG"
                                               v-model="searchParam.noDepartVehicleFlag"
                                               style="display:block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="text" v-show="!isMoreItemShow" @click="isMoreItemShow = true" size="mini">
                                展开搜索项>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="isMoreItemShow = false" size="mini">
                                收起搜索项<
                            </el-button>
                            <el-button type="success" size="mini" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchList()">查询
                            </el-button>
                            <el-button type="warning" size="mini" class="fa fa-repeat" @click="resetSearchParam">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-if="exportLoading" icon="el-icon-download" v-permission="'/waitDepartExport/export'"
                       type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe
                      :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="派车单号" min-width="150">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="AddVehicleView(scope.row)">{{scope.row.code}}</a>
                        <el-tag size="mini" type="danger" v-if="(new Date(scope.row.sendTime).getTime())-(new Date(scope.row.expectDepartureTime).getTime())>24*60*60*1000">补</el-tag>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车牌号码" prop="dispatchVehicle.vehicleLicenseNum"
                                 min-width="100">
                    <template slot-scope="scope">
                        <div v-if="scope.row.vehicleLicenseNum">
                            {{scope.row.vehicleLicenseNum}}
                            <i v-if="scope.row.vehicleLicenseNum && scope.row.vehicleNature!=='OUT_INVITE'"
                               @click="trackVehicle(scope.row.vehicleLicenseNum)"
                               class="fa fa-location-arrow" style="color:#409EFF; cursor: pointer;"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车辆性质" min-width="70">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                :value="scope.row.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="司机上报" prop="" min-width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.driverReportExceptionCount>0" style="color: #409EFF;cursor: pointer;" @click="driverAbnormalSearch(scope.row)">{{scope.row.driverReportExceptionCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="所属区域" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.regionName}} / {{scope.row.belongOrgName}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="客户" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.customerName}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="260" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" @click="showLine(scope.row)" style="color: #409EFF;">{{scope.row.lineName}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="startStationName"
                                 min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="派车时间" prop="sendTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="司机发车时间" prop="driverDepartureTime"
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="预计发车时间" min-width="140">
                    <template slot-scope="scope">
                        {{scope.row.expectDepartureTime}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="司机" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.driverName}}({{scope.row.driverMobile}})</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="请车员" prop="carInviter" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="回单号" prop="receiptCodes" min-width="240"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="endStationName" min-width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应付审核状态" min-width="160">
                    <template slot-scope="scope">
                        <span v-if="scope.row.paymentCheckBeforeApprovalAuditState"><dictionary-select-name
                            option-name="AUDIT_STATUS"
                            :value="scope.row.paymentCheckBeforeApprovalAuditState"></dictionary-select-name></span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="应付审核备注" prop="paymentCheckBeforeApprovalAuditRemark"
                                 min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="left" min-width="140">
                    <template slot-scope="scope">
                        <el-button v-permission="'/dispatch/departVehicle'" type="text" size="mini"
                                   :disabled="disabledDepartVehicle(scope.row)" @click="departVehicle(scope.row)">发车
                        </el-button>
                        <el-button v-permission="'/dispatch/reportAbnormal'" type="text" size="mini" :disabled="scope.row.exceptionFlag"
                                   @click="reportAbnormal(scope.row)">异常上报
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

        <!-- 线路信息详情 -->
        <line-info v-if="showLineInfo" :dialogVisible="showLineInfo" @close="hideLineInfo"
                   :currentRow="currentRow"></line-info>

        <!-- 派车单详情 -->
        <add-send-view v-if="showAddSendView" :dialogVisible="showAddSendView" @close="hideAddSendView"
                       :currentRow="currentRow"></add-send-view>

        <!-- 发车时间 -->
        <el-dialog title="发车时间" :visible.sync="showDeparture" width="80%" @close="resetDepartureForm"
                   style="margin-left: 50%;">
            <span slot="title" style="color: #66b1ff;">发车时间 <el-tag size="mini" type="danger" v-if="(new Date(departure.sendTime).getTime())-(new Date(departure.expectDepartureTime).getTime())>24*60*60*1000">补</el-tag></span>
            <el-form size="small" :model="departure" ref="departureForm" label-width="120px"
                     :class="{'electron':departure.dispatchLine.receiptType==='ELECTRON_TYPE','paper':departure.dispatchLine.receiptType==='PAPER_TYPE'}">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="司机发车：" style="margin-bottom: 0;">
                            <span v-if="departure.driverDepartureTime"><el-checkbox v-model="departure.checked"
                                                                                    @change="changeDepartureTime"> ( 勾选同步至发车时间 ) {{departure.driverDepartureTime}}</el-checkbox></span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="canSearch && departure.clientDepartureTime">
                    <el-col :span="22">
                        <el-form-item label="客户发车：" style="margin-bottom: 0;">
                            <span v-if="departure.clientDepartureTime"><el-checkbox v-model="departure.clientCheck"
                                                                                    @change="changeClientDepartureTime"> ( 勾选同步至发车时间 ) {{departure.clientDepartureTime}}</el-checkbox></span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="departure.dispatchLine&&departure.dispatchLine.stopOverStation&&departure.dispatchLine.stopOverStation[0].stationFence&&departure.dispatchLine.stopOverStation[0].stationFence.inTime">
                    <el-col :span="22">
                        <el-form-item label="进入围栏时间：" style="margin-bottom: 0;">
                            <span>{{departure.dispatchLine.stopOverStation[0].stationFence.inTime?departure.dispatchLine.stopOverStation[0].stationFence.inTime:''}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="departure.dispatchLine&&departure.dispatchLine.stopOverStation&&departure.dispatchLine.stopOverStation[0].stationFence&&departure.dispatchLine.stopOverStation[0].stationFence.outTime">
                    <el-col :span="22">
                        <el-form-item label="离开围栏时间：" style="margin-bottom: 0;">
                            <span>{{departure.dispatchLine.stopOverStation[0].stationFence.outTime?departure.dispatchLine.stopOverStation[0].stationFence.outTime:''}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="司机回单：" id="toInline" style="margin-bottom: 0;">
                                <span v-show="departure.url">
                                    <el-checkbox v-model="departure.urlChecked" @change="synchronous"></el-checkbox>
                                    <show-image ref="showImage" :url="departure.url"></show-image>(勾选同步至回单附件)
                                </span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="!!departure.remark">
                    <el-col :span="22">
                        <el-form-item label="派车备注：" style="margin-bottom: 0;">
                            {{departure.remark}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="发车时间：" prop="departureTime" :rules="{required:true,message:'请输入发车时间！'}">
                            <el-date-picker style="display:block; width:100%;" v-model="departure.departureTime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            type="datetime" placeholder="选择日期时间"
                                            :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22" v-if="!departure.receiptInputs.length">
                        <el-form-item label="回单号：" prop="receiptCodes" :rules="{required:true,message:'请输入回单号！'}">
                            <el-tag v-for="tag in dynamicTags" :key="tag.index" style="min-width: 100%" closable
                                    :disable-transitions="false" @close="handleClose(tag)">{{tag}}
                            </el-tag>
                            <el-input maxlength="24" class="input-new-tag" v-if="inputVisible" v-model="inputValue"
                                      ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm">
                                <el-button slot="append" type="primary" plain v-if="canSearch" @click="searchMoreBill">
                                    查询更多回单
                                </el-button>
                            </el-input>
                            <el-button v-if="inputVisible" type="text" @click="handleInputConfirm"
                                       icon="el-icon-circle-check-outline"></el-button>
                            <el-button v-else type="text" @click="showInput" circle icon="el-icon-circle-plus-outline"
                                       :disabled="dynamicTags.length >= 20"></el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="22" v-else>
                        <el-form-item label="回单号：">
                            <el-input v-for="(item,index) in departure.receiptInputs" :key="index" :value="dynamicInputs[index]" :placeholder="item.placeholder" @input="val => $set(dynamicInputs, index, val)">
                                <template slot="prepend">{{item.receiptType}}</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="回单照片：" prop="receiptUrl" :rules="{required:true,message:'请上传回单附件！'}">
                            <upload-picture-small cleanList ref="receiptAttachment" :maxNumber="20" :limit="20" v-model="departure.receiptUrl"></upload-picture-small>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="departure.isWeight">
                    <el-col :span="22">
                        <el-form-item label="磅重照片：">
                            <upload-picture-small cleanList ref="weightAttachment" :maxNumber="3" :limit="3"
                                            v-model="departure.weightAttachment"></upload-picture-small>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showDeparture = false">取 消</el-button>
                <el-button size="small" :disabled="isSubmitBtnDisabled" type="primary" @click="confirmDepartureSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 车辆定位 -->
        <el-dialog :title="title" :visible.sync="showTrackReplay" width="90%" :top="marginTop">
            <el-main class="content-main" style="padding: 0;">
                <iframe :src="trackReplayUrl" frameborder="0" width="100%" :height="minHeight"></iframe>
            </el-main>
        </el-dialog>

        <!-- 异常上报 -->
        <el-dialog title="异常上报" :visible.sync="abnormalDialog.dialogVisible" width="60%" @close="resetAbnormalDialog">
            <el-form ref="abnormalForm" :model="abnormalDialog" label-width="100px">
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="派车单号:">
                            {{abnormalDialog.data.dispatchCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="客户名称:">
                            {{abnormalDialog.data.customerName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="线路名称:" show-overflow-tooltip>
                            {{abnormalDialog.data.lineName}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="车牌号:">
                            {{abnormalDialog.data.vehicleLicenseNum}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="司机:">
                            {{abnormalDialog.data.driverName}}{{abnormalDialog.data.driverPhone}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="预计发车时间:">
                            {{abnormalDialog.data.expectDepartureTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="异常类型：">
                            <el-radio-group v-model="abnormalDialog.data.selectRemark" size="small" @change="abnormalDialog.data.remark = abnormalDialog.data.selectRemark">
                                <el-radio label="重复指派" border>重复指派</el-radio>
                                <el-radio label="任务取消" border>任务取消</el-radio>
                                <el-radio label="压车未发" border>压车未发</el-radio>
                                <el-radio label="司机错误" border>司机错误</el-radio>
                                <el-radio label="车辆错误" border>车辆错误</el-radio>
                                <el-radio label="" border>其他</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注:" prop="data.remark" :rules="[{required: true, message: '请输入备注', trigger: 'blur,change'}]">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="abnormalDialog.data.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="abnormalDialog.dialogVisible = false">取 消</el-button>
                <el-button size="small" :disabled="abnormalDialog.submitBtnDisabled" type="primary"
                           @click="abnormalDialogSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 司机上报异常 -->
        <el-dialog title="司机上报异常" :visible.sync="driverAbnormalDialog.dialogVisible" width="80%" @close="driverAbnormalDialog.data = []">
            <el-table :data="driverAbnormalDialog.data" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="派车单号" prop="dispatchCode" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车牌号" prop="licenseNumber" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="异常类型" prop="type" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="TASK_EXCEPTION_TYPE" :value="scope.row.type"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="备注" prop="remark" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="现场照片" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <show-image style="display: inline-block" :url="scope.row.attachment"></show-image>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="上报人" prop="reportUser" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="上报时间" prop="reportTime" min-width="140" show-overflow-tooltip></el-table-column>
            </el-table>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import addSendView from './AddSendView'
    import modify from './ModifyDialog'
    import lineInfo from './LineInfoDialog'
    import {Constant} from 'src/global/constant'
    import {Validate} from 'src/global/validate'
    import axios from 'axios'

    export default {
        data() {
            return {
                Api: Api,
                isLoading: true,
                isMoreItemShow: false,
                constant: Constant,//常量
                common: Common,
                Validate: Validate,
                showAddSendView: false,//加车派车详情
                showLineInfo: false,//线路详情
                showDeparture: false,//发车
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    orgCode: '',
                    code: '',
                    startCityArr: [],
                    startCity: '',
                    endCityArr: [],
                    endCity: '',
                    status: '',
                    vehicleCode: '',
                    startExpectDepartureTime: '',//需求时间
                    endExpectDepartureTime: '',
                    receiptCode: '',
                    driverDepartureFlag: '',
                    paymentCheckBeforeApprovalFlag: '',
                    noDepartVehicleFlag: '',
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],//要操作的行
                currentRow: null,//操作行的数据
                departure: {
                    checked: false,
                    clientCheck: false,
                    isWeight: false,
                    remark: '',
                    vehicleNature: '',
                    driverDepartureTime: "",
                    clientDepartureTime: "",
                    receiptCodes: [],
                    receiptInputs: [],
                    departureTime: '',//发车时间
                    code: '',
                    waybillCode: '',
                    sendTime: '',
                    expectDepartureTime: '',
                    url: '',
                    urlChecked: false,
                    receiptUrl: '',
                    dispatchLine: {
                        receiptType: ''//回单类型
                    },
                },
                dynamicTags: [],
                dynamicInputs: [],
                inputVisible: false,
                inputValue: '',
                isSubmitBtnDisabled: false,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                //导出
                exportLoading: true,
                tableHeight: window.innerHeight > 800 ? 430 : null,
                canSearch: false,
                //轨迹跟踪
                trackReplayUrl: '',
                title: '',
                showTrackReplay: false,
                //异常上报
                abnormalDialog: {
                    dialogVisible: false,
                    submitBtnDisabled: false,
                    data: {
                        dispatchCode: '',
                        customerName: '',
                        lineName: '',
                        driverName: '',
                        driverPhone: '',
                        vehicleLicenseNum: '',
                        expectDepartureTime: '',
                        selectRemark: '',
                        remark: ''
                    },
                    url: Api.taskException.add
                },
                //司机上报异常查询
                driverAbnormalDialog: {
                    dialogVisible: false,
                    data: []
                }
            }
        },
        components: {
            addSendView,
            lineInfo,
            modify
        },
        watch: {
            $route() {
                this.searchList();
            }
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
            if(this.$route.query.startTime && this.$route.query.endTime){
                this.searchParam.startExpectDepartureTime = this.$route.query.startTime;
                this.searchParam.endExpectDepartureTime = this.$route.query.endTime;
            }
            this.searchList();
        },
        activated(){
            if(this.$route.query.startTime && this.$route.query.endTime){
                this.searchParam.startExpectDepartureTime = this.$route.query.startTime;
                this.searchParam.endExpectDepartureTime = this.$route.query.endTime;
            }
            this.searchList();
        },
        methods: {
            //置灰发车按钮
            disabledDepartVehicle(row) {
                return row.status !== Constant.DISPATCH_STATUS.ASSIGNED && row.status !== Constant.DISPATCH_STATUS.BY_STATION
                    || row.emptyStatus === Constant.AUDIT_STATUS.UNAUDITED || row.exceptionFlag;
            },
            tableColumnBooleanFormatter(row, column, cellValue) {
                if (cellValue) {
                    return '是';
                }
                return '否';
            },
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    orgCode: '',
                    code: '',
                    startCityArr: [],
                    startCity: '',
                    endCityArr: [],
                    endCity: '',
                    status: '',
                    vehicleCode: '',
                    startExpectDepartureTime: '',//需求时间
                    endExpectDepartureTime: '',
                    receiptCode: '',
                    driverDepartureFlag: '',
                    paymentCheckBeforeApprovalFlag: '',
                    noDepartVehicleFlag: '',
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                this.searchParam.startCity = this.searchParam.startCityArr[1];
                this.searchParam.endCity = this.searchParam.endCityArr[1];
                Http.get(Api.dispatch.waitDepartPage, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, result => {
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
            showLine(row) {//线路详情
                Http.get(Api.dispatch.queryByCode, {params: {code: row.code}}, result => {
                    this.currentRow = result.result;
                    this.showLineInfo = true;
                })
            },
            hideLineInfo() {//关闭线路详情
                this.showLineInfo = false;
            },
            AddVehicleView(row) { //派车单详情------------------------------------
                Http.get(Api.dispatch.queryByCode, {params: {code: row.code}}, result => {
                    this.currentRow = result.result;
                    this.showAddSendView = true;
                })
            },
            hideAddSendView() { // 关闭派车单详情------------------------------------
                this.showAddSendView = false;
            },
            departVehicle(row) {//发车
                let vm = this;
                if (row.vehicleNature === 'OUT_INVITE' && row.paymentCheckBeforeApprovalAuditState === 'UNAUDITED') {
                    vm.$message.warning('应付车价未审核！');
                    return
                }
                vm.showDeparture = true;
                vm.departure.code = row.code;
                vm.departure.vehicleNature = row.vehicleNature;
                vm.departure.waybillCode = row.waybillCode;
                vm.departure.remark = row.remark;
                vm.departure.departureTime = Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 6, 0, 0));
                //是否显示input组件
                Http.get(Api.dispatch.getCustomerReceipt, {params: {dispatchCode: this.departure.code}}, result => {
                    this.departure.receiptInputs = result.result;
                    this.dynamicInputs = this.departure.receiptInputs.map((item,index)=>{
                        return ''
                    })
                    Http.get(Api.waybill.queryByCode, {params: {'code': row.waybillCode}}, result => {
                        vm.departure.url = !result.result.dispatch.dispatchLine.stopOverStation[0] ? '' : result.result.dispatch.dispatchLine.stopOverStation[0].attachment;
                        vm.departure.driverDepartureTime = result.result.dispatch.driverDepartureTime;//司机发车时间
                        vm.departure.sendTime = result.result.dispatch.sendTime;//派车时间
                        vm.departure.expectDepartureTime = result.result.dispatch.expectDepartureTime;//预计发车时间
                        vm.departure.dispatchLine = result.result.dispatch.dispatchLine
                        if (result.result.dispatch.dispatchPrice.receivePriceType == "WEIGHT") {
                            vm.departure.isWeight = true;
                            if (result.result.dispatch.weightAttachment != null) {
                                /*设置附件*/
                                vm.$refs.weightAttachment.setFileList(result.result.dispatch.weightAttachment.split(","));
                            }
                        }
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
                vm.canSearch = Common.bill.canSearch(row.customerTopCode)
                if (vm.canSearch) {
                    Http.get(Api.waybill.getCustomerWaybill, {params: {'waybillCode': row.waybillCode}}, result => {
                        if (result.result) {
                            vm.departure.clientDepartureTime = result.result.srcActTime
                            if (vm.departure.clientDepartureTime) {
                                vm.departure.clientCheck = true
                                vm.changeClientDepartureTime(true)
                            }
                        }
                    })
                }

            },
            synchronous(val) {
                let vm = this;
                if (val && vm.departure.url) {
                    vm.$refs.receiptAttachment.setFileList(vm.departure.url.split(","));
                }
            },
            changeDepartureTime(val) {
                let vm = this;
                if (val) {
                    vm.departure.clientCheck = false
                    vm.departure.departureTime = vm.departure.driverDepartureTime ? vm.departure.driverDepartureTime : Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 6, 0, 0));
                } else {
                    vm.departure.departureTime = Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 6, 0, 0));
                }
            },
            changeClientDepartureTime(val) {
                let vm = this;
                if (val) {
                    vm.departure.checked = false
                    vm.departure.departureTime = vm.departure.clientDepartureTime ? vm.departure.clientDepartureTime : Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 6, 0, 0));
                } else {
                    vm.departure.departureTime = Common.date.dateFtt("yyyy-MM-dd hh:mm:ss", new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 6, 0, 0));
                }
            },
            confirmDepartureSubmit() {
                let vm = this;
                if (!vm.handleInputConfirm()) {
                    return;
                }
                if(!vm.departure.receiptInputs || !(vm.departure.receiptInputs.length>0)){
                    vm.departure.receiptCodes = vm.dynamicTags;
                }else{
                    vm.departure.receiptCodes = vm.dynamicInputs;
                    let arr1 = vm.departure.receiptInputs.filter((item,index)=>{
                        return  !vm.departure.receiptCodes[index] && item.required
                    })
                    if(arr1 && arr1.length>0){
                        vm.$message.warning(arr1[0].receiptType+'必填！');
                        return;
                    }
                    let arr2 = vm.departure.receiptInputs.filter((item,index)=>{
                        return !!vm.departure.receiptCodes[index] && !eval(item.regExp).test(vm.departure.receiptCodes[index])
                    })
                    if(arr2 && arr2.length>0){
                        vm.$message.warning(arr2[0].errorMessage);
                        return;
                    }
                }
                if (new Date(vm.departure.departureTime).getTime() > new Date().getTime()) {
                    vm.$message.warning('确认发车时间不能大于当前时间！');
                    vm.departure.departureTime = '';
                    return;
                }
                if(!vm.$_permission('/dispatch/departVehicleTime')){//无发车时间权限发车校验时间
                    if(new Date(vm.departure.departureTime).getTime()<new Date().getTime()-24*60*60*1000){
                        vm.$message.warning('确认发车时间不能早于当前时间24小时！');
                        vm.departure.departureTime = '';
                        return;
                    }
                }
                vm.departure.receiptUrl = vm.$refs.receiptAttachment.getFileList().join(',')
                vm.departure.weightAttachment = vm.$refs.weightAttachment.getFileList().join(',')
                vm.$refs.departureForm.validate((valid) => {
                    if (valid) {
                        vm.isSubmitBtnDisabled = true;
                        Http.post(Api.dispatch.departVehicle, vm.departure, result => {
                            this.$message.success("发车成功！");
                            this.searchList();
                            vm.showDeparture = false;
                            vm.isSubmitBtnDisabled = false;
                        }, result => {
                            vm.isSubmitBtnDisabled = false;
                        })
                    }
                });
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
                        return false;
                    }
                }
                vm.inputValue = '';
                vm.inputVisible = false;
                return true;
            },
            resetDepartureForm() {
                let vm = this;
                vm.handleInputConfirm()
                vm.departure = {
                    checked: false,
                    clientCheck: false,
                    isWeight: false,
                    remark: '',
                    vehicleNature: '',
                    driverDepartureTime: "",
                    clientDepartureTime: "",
                    receiptCodes: [],
                    receiptInputs: [],
                    departureTime: '',//发车时间
                    code: '',
                    waybillCode: '',
                    sendTime: '',
                    //isTemp: '',
                    url: '',
                    urlChecked: false,
                    receiptUrl: '',
                    dispatchLine: {
                        receiptType: ''//回单类型
                    }
                }
                vm.$refs.showImage.closeViewer();
                vm.$refs.showImage.closeViewer();
                vm.$refs.weightAttachment.clearFileList();
                vm.$refs.receiptAttachment.clearFileList();
            },
            //导出
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.waitDepartExport.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '待发车辆.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            // 查询更多回单
            async searchMoreBill() {
                let vm = this;
                if (!vm.handleInputConfirm()) {
                    return;
                }
                await Common.bill.searchBill(vm.dynamicTags[vm.dynamicTags.length - 1], vm.departure.waybillCode).then((res) => {
                    vm.dynamicTags = vm.dynamicTags.concat(res)
                    vm.dynamicTags = vm.common.util.clean(vm.dynamicTags)
                });
            },
            //轨迹跟踪
            trackVehicle(vehicleNo) {
                let vm = this;
                Http.get(Api.g7.vehicleFollowUrl, {params: {vehicleNo: vehicleNo}}, result => {
                    vm.trackReplayUrl = result.result;
                    vm.title = "轨迹跟踪";
                    vm.showTrackReplay = true;
                })
            },
            //异常上报
            reportAbnormal(row) {
                this.abnormalDialog.data.dispatchCode = row.code;
                this.abnormalDialog.data.customerName = row.customerName;
                this.abnormalDialog.data.lineName = row.lineName;
                this.abnormalDialog.data.vehicleLicenseNum = row.vehicleLicenseNum;
                this.abnormalDialog.data.driverName = row.driverName;
                this.abnormalDialog.data.driverPhone = row.driverPhone;
                this.abnormalDialog.data.expectDepartureTime = row.expectDepartureTime;
                this.abnormalDialog.dialogVisible = true;
            },
            resetAbnormalDialog() {
                this.abnormalDialog.data = {
                    dispatchCode: '',
                    customerName: '',
                    lineName: '',
                    driverName: '',
                    driverPhone: '',
                    vehicleLicenseNum: '',
                    expectDepartureTime: '',
                    selectRemark: '',
                    remark: ''
                }
                this.abnormalDialog.url = '';
            },
            abnormalDialogSubmit(){
                this.$refs.abnormalForm.validate((valid)=>{
                    if(valid){
                        this.abnormalDialog.submitBtnDisabled = true;
                        Http.post(Api.taskException.add, this.abnormalDialog.data, result => {
                            this.abnormalDialog.submitBtnDisabled = false;
                            this.abnormalDialog.dialogVisible = false;
                            this.$message.success("异常上报成功！");
                            this.searchList();
                        }, result => {
                            this.abnormalDialog.submitBtnDisabled = false;
                        })
                    }
                })
            },
            //司机上报异常查询
            driverAbnormalSearch(row){
                Http.get(Api.dispatch.getByDispatchCode, {params: {dispatchCode: row.code}}, result => {
                    this.driverAbnormalDialog.data = result.result;
                    this.driverAbnormalDialog.dialogVisible = true;
                })
            }
        }
    }
</script>
<style>
    #standby .imageViewerMask {
        width: 50% !important;
        right: 50% !important;
    }

    #toInline .el-form-item__content span {
        display: flex;
        align-items: center;
    }

    #toInline .el-form-item__content span > div {
        margin: 0 20px;
    }
</style>
<style scoped>
    .electron {
        background: url("../../../../../static/img/dianzihuidan.png") right top no-repeat;
    }

    .paper {
        background: url("../../../../../static/img/zhizhihuidan.png") right top no-repeat;
    }
</style>
