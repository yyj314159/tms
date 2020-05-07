<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 到达管理</el-breadcrumb-item>
                <el-breadcrumb-item>设备签收</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户名称:">
                            <customer-select style="display: block"
                                             v-model="searchParam.customerCode"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.code"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单状态:">
                            <dictionary-select option-name="WAY_BILL_STATUS" v-model="searchParam.status"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
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
                            <el-input type="text" v-model="searchParam.receiptCode" :clearable="true"
                                      placeholder="请输入卡号" style="min-width:200px">
                                <template slot="append">
                                    <el-popover
                                        placement="bottom"
                                        width="98%"
                                        trigger="click">
                                        <div style="width: 200px;">
                                            <el-input type="textarea"
                                                      :autosize="{ minRows: 6, maxRows: 8}" resize="none"
                                                      v-model.trim="searchParam.selectReceiptCodeList"
                                                      placeholder="最多输入1000个号,进行查询。按ENTER键进行换行,按重置按钮进行清空"></el-input>
                                        </div>
                                        <el-button slot="reference" style="width:2%;">批量查询</el-button>
                                    </el-popover>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="油卡卡号:">
                            <oil-card-select v-model="searchParam.oilCardCode"
                                             style="display: block;"></oil-card-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="GPS号码:">
                            <gps-select v-model="searchParam.gpsCode" style="display:block;"></gps-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
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
                        <el-form-item label="是否定责:">
                            <dictionary-select v-model="searchParam.fixDutyFlag"
                                               option-name="FINE_AUDIT_FLAG"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达开始时间:">
                            <date-picker-single v-model="searchParam.startConfirmArrivalTime" date-type="start"
                                                :end-date="searchParam.endConfirmArrivalTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达结束时间:">
                            <date-picker-single v-model="searchParam.endConfirmArrivalTime" date-type="end"
                                                :start-date="searchParam.startConfirmArrivalTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.shipperCode" style="display: block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="油卡状态:">
                            <dictionary-select option-name="EQUIPMENT_SIGN_STATUS" v-model="searchParam.oilCardStatus"
                                               style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="回单类型:">
                            <dictionary-select v-model="searchParam.receiptType"
                                               option-name="RECEIPT_TYPE"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select v-model="searchParam.vehicleNature"
                                               option-name="VEHICLE_OPERATION_MODE"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start"
                                                :end-date="searchParam.endActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end"
                                                :start-date="searchParam.startActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right">
                            <el-button type="text" v-show="!isMoreItemShow" @click="isMoreItemShow = true" size="small">
                                展开更多搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="isMoreItemShow = false" size="small">
                                收起搜索项<<
                            </el-button>
                            <el-button type="success" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchList()">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-permission="'/waybill/signReceipt'" type="primary" size="mini" style="margin-left: 10px;"
                       :disabled="receiptBtnDisabled" @click="signReceipt(multipleSelection)">回单签收
            </el-button>
            <el-button v-permission="'/waybill/signOilCard'" type="primary" size="mini" style="margin-left: 10px;"
                       :disabled="oilCardBtnDisabled" @click="signOilCard(multipleSelection)">油卡签收
            </el-button>
            <el-button v-permission="'/waybill/signGps'" type="primary" size="mini" style="margin-left: 10px;"
                       :disabled="gpsBtnDisabled" @click="signGps(multipleSelection)">GPS签收
            </el-button>
            <el-button v-if="exportLoading" icon="el-icon-download" v-permission="'/waybill/exportSign'" type="primary"
                       size="mini" style="margin-left: 10px;" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight"
                      :style="{height:'auto'}" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45" :selectable="checkSelectable"></el-table-column>
                <el-table-column header-align="center" label="所属大区" prop="dispatch.region.name"
                                 min-width="120"></el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="dispatch.belongOrg.name"
                                 min-width="120"></el-table-column>
                <el-table-column header-align="center" label="客户" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.dispatch.customer?scope.row.dispatch.customer.name:""}}
                    </template>
                </el-table-column>
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
                <el-table-column header-align="center" label="车牌号" prop="dispatch.dispatchVehicle.vehicleLicenseNum"
                                 min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.dispatch.dispatchVehicle.vehicleLicenseNum}
                        （${scope.row.dispatch.dispatchVehicle.specification} 米）`}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车辆属性" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                :value="scope.row.dispatch.dispatchVehicle.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="司机姓名" prop="dispatch.dispatchVehicle.driver.name"
                                 min-width="130" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="司机电话" prop="dispatch.dispatchVehicle.driver.mobile"
                                 min-width="130" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车主姓名" prop="dispatch.dispatchVehicle.vehicleOwner.name"
                                 min-width="130" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车主电话" prop="dispatch.dispatchVehicle.vehicleOwner.mobile"
                                 min-width="130" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="运单号" min-width="130">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="发车时间" prop="actualDepartureTime"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="到达时间" prop="confirmArrivalTime"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="运单状态" min-width="130">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAY_BILL_STATUS"
                                                v-model="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="承运方" prop="dispatch.dispatchVehicle.shipper.name"
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="签收人" prop="signUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="签收时间" prop="signTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="回单号" min-width="300" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.receiptCodes?scope.row.receiptCodes:''}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="回单类型" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="RECEIPT_TYPE"
                                                :value="scope.row.dispatch.dispatchLine.receiptType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="回单是否丢失" min-width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.waybillReceiptLose">{{scope.row.waybillReceiptLose.receiptLoseFlag?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="回单签收状态" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="!scope.row.receiptCodes"></span>
                        <dictionary-select-name v-else option-name="EQUIPMENT_SIGN_STATUS"
                                                v-model="scope.row.receiptStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="回单签收备注" prop="waybillReceiptLose.remark" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="签收人" prop="receiptSignUser"
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="签收时间" prop="receiptSignTime"
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="油卡卡号" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.dispatch.dispatchPrice.oilCardNumber?scope.row.dispatch.dispatchPrice.oilCardNumber:''}}
                        <span v-if="!!scope.row.dispatch.dispatchSupplierPrice">{{scope.row.dispatch.dispatchSupplierPrice.oilCardNumber?scope.row.dispatch.dispatchSupplierPrice.oilCardNumber:''}}</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="油卡是否丢失" min-width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.waybillOilCardLose">{{scope.row.waybillOilCardLose.oilCardLoseFlag?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="油卡签收状态" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="!scope.row.dispatch.dispatchPrice.oilCardNumber"></span>
                        <dictionary-select-name v-else option-name="EQUIPMENT_SIGN_STATUS"
                                                v-model="scope.row.oilCardStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="油卡签收备注" prop="waybillOilCardLose.remark" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="签收人" prop="oilCardSignUser"
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="签收时间" prop="oilCardSignTime"
                                 min-width="140"></el-table-column>
                <el-table-column header-align="center" label="GPS号" prop="dispatch.dispatchPrice.gpsCode"
                                 min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.dispatch.dispatchPrice.gpsCode?scope.row.dispatch.dispatchPrice.gpsCode:''}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="GPS是否丢失" min-width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.waybillGpsLose">{{scope.row.waybillGpsLose.gpsLoseFlag?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="GPS签收状态" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="!scope.row.dispatch.dispatchPrice.gpsCode"></span>
                        <dictionary-select-name v-else option-name="EQUIPMENT_SIGN_STATUS"
                                                v-model="scope.row.gpsStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="GPS签收备注" prop="waybillGpsLose.remark" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="签收人" prop="gpsSignUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="签收时间" prop="gpsSignTime"
                                 min-width="140"></el-table-column>
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

        <!--回单签收-->
        <el-dialog title="签收回单" :visible.sync="showReceiptSignDialog" width="95%" @close="receiptSignForm = []">
            <el-table size="small" class="content-table" :data="receiptSignForm" border>
                <el-table-column header-align="center" prop="code" label="运单号" min-width="110"></el-table-column>
                <el-table-column header-align="center" prop="receiptCodes" label="回单号" min-width="100"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="回单类型" min-width="75">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="RECEIPT_TYPE"
                                                :value="scope.row.receiptType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="是否丢失" min-width="92">
                    <template slot-scope="scope">
                        <el-switch v-if="scope.row.code" v-model="scope.row.waybillReceiptLose.receiptLoseFlag" active-color="#13ce66"
                                   inactive-color="#ff4949"
                                   @change="equipmentLoseSwitchChange(scope.row.waybillReceiptLose.receiptLoseFlag)"
                                   active-text="是" inactive-text="否"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="司机发车" min-width="130">
                    <template slot-scope="scope" v-if="!!scope.row.departureUrl">
                        <show-image style="display: inline-block" :url="scope.row.departureUrl"></show-image>
                        ({{scope.row.departureUrl.split(',').length}})
                        <el-button size="small" type="text" style="margin-left: 15px;"
                                   @click="synchronousReceipt(scope.$index, scope.row.departureUrl)"> 同 步
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="司机到达" min-width="100">
                    <template slot-scope="scope" v-if="!!scope.row.arrivalUrl">
                        <show-image style="display: inline-block" :url="scope.row.arrivalUrl"></show-image>
                        ({{scope.row.arrivalUrl.split(',').length}})
                        <el-button size="small" type="text" style="margin-left: 20px;"
                                   @click="synchronousReceipt(scope.$index, scope.row.arrivalUrl)"> 同 步
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="回单附件" min-width="280">
                    <template slot-scope="scope">
                        <upload-picture-small v-if="scope.row.code" :ref="'receiptAttachment'+scope.row.code" :cleanList="true"
                                        :limit="20" @listChange="val=>scope.row.receiptAttachment=val"></upload-picture-small>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="备注" min-width="200">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.code" type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！"
                                  v-model="scope.row.waybillReceiptLose.remark"></el-input>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="操作" min-width="80">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.code" size="mini" icon="el-icon-delete" type="text" @click="deleteRow(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showReceiptSignDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="receiptSignFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!--油卡签收-->
        <el-dialog title="签收油卡" :visible.sync="showOilCardSignDialog" width="85%" @close="oilCardSignForm = []">
            <el-table size="small" class="content-table" :data="oilCardSignForm" border>
                <el-table-column header-align="center" prop="code" label="运单号" min-width="100"></el-table-column>
                <el-table-column header-align="center" prop="oilCardNumber" label="油卡卡号" min-width="100"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="是否丢失" min-width="80">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.waybillOilCardLose.oilCardLoseFlag" active-color="#13ce66"
                                   inactive-color="#ff4949"
                                   @change="equipmentLoseSwitchChange(scope.row.waybillOilCardLose.oilCardLoseFlag)"
                                   active-text="是" inactive-text="否"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="备注" min-width="200">
                    <template slot-scope="scope">
                        <el-input type="textarea" :rows="1" :maxlength="200" placeholder="最多200个字符！"
                                  v-model="scope.row.waybillOilCardLose.remark"></el-input>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="操作" min-width="80">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-delete" type="text" @click="oilCardSignForm.splice(scope.$index,1)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showOilCardSignDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="oilCardSignFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!--GPS签收-->
        <el-dialog title="签收GPS" :visible.sync="showGpsSignDialog" width="75%" @close="gpsSignForm = []">
            <el-table size="small" class="content-table" :data="gpsSignForm" border>
                <el-table-column header-align="center" prop="code" label="运单号" min-width="100"></el-table-column>
                <el-table-column header-align="center" prop="gpsCode" label="gps号码" min-width="100"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="是否丢失" min-width="80">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.waybillGpsLose.gpsLoseFlag" active-color="#13ce66"
                                   inactive-color="#ff4949"
                                   @change="equipmentLoseSwitchChange(scope.row.waybillGpsLose.gpsLoseFlag)"
                                   active-text="是" inactive-text="否"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="备注" min-width="200">
                    <template slot-scope="scope">
                        <el-input type="textarea" :rows="1" :maxlength="200" placeholder="最多200个字符！"
                                  v-model="scope.row.waybillGpsLose.remark"></el-input>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="操作" min-width="80">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-delete" type="text" @click="gpsSignForm.splice(scope.$index,1)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showGpsSignDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="gpsSignFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="温馨提示" :visible.sync="showEquipmentLoseSwitchChangeTipsDialog" width="25%" @close="showEquipmentLoseSwitchChangeTipsDialog = false">
            <span style="color: red">您选择了设备丢失选项,签收后将不会退押金给司机!</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="showEquipmentLoseSwitchChangeTipsDialog = false">确 定</el-button>
            </span>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import {Constant} from 'src/global/constant'
    import lineInfo from '../myDispatch/LineInfoDialog'
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
                isLoading: true,
                exportLoading: true,
                isMoreItemShow: false,
                showLineInfo: false,//线路信息详情
                showReceiptSignDialog: false,
                showOilCardSignDialog: false,
                showGpsSignDialog: false,
                showEditReceiptAttachment: false,//回单附件
                showEquipmentLoseSwitchChangeTipsDialog: false,//回单附件
                Constant: Constant,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    status: '',//运单状态
                    oilCardCode: '',//油卡卡号
                    gpsCode: '',//gps
                    receiptCode: '',//回单号
                    selectReceiptCodeList: '',//回单号集合
                    receiptCodeList: [],//传给后台回单号集合
                    vehicleCode: '',
                    code: '',
                    customerCode: '',//客户
                    orgCode: '',//所属区域
                    startActualDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    startConfirmArrivalTime: '',//到达时间
                    endConfirmArrivalTime: '',
                    shipperCode: '',
                    oilCardStatus: '',
                    receiptType: '',
                    vehicleNature: '',
                    onTimeFlag: '',
                    fixDutyFlag: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                receiptSignForm: [],
                oilCardSignForm: [],
                gpsSignForm: [],
                tableHeight: window.innerHeight > 800 ? 430 : null,
                multipleSelection: [],//要操作的行
            }
        },
        created() {
            this.searchList();
        },
        components: {
            lineInfo
        },
        computed: {
            receiptBtnDisabled() {
                if (!(this.multipleSelection.length > 0)) {
                    return true
                }
                return !this.multipleSelection.some((item) => {
                    return this.receiptSignable(item) == true
                })
            },
            oilCardBtnDisabled() {
                if (!(this.multipleSelection.length > 0)) {
                    return true
                }
                return !this.multipleSelection.some((item) => {
                    return this.oilCardSignable(item) == true
                })
            },
            gpsBtnDisabled() {
                if (!(this.multipleSelection.length > 0)) {
                    return true
                }
                return !this.multipleSelection.some((item) => {
                    return this.gpsSignable(item) == true
                })
            }
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    status: '',//运单状态
                    oilCardCode: '',//油卡卡号
                    gpsCode: '',//gps
                    receiptCode: '',//回单号
                    selectReceiptCodeList: '',//回单号集合
                    receiptCodeList: [],//传给后台回单号集合
                    vehicleCode: '',
                    code: '',
                    customerCode: '',//客户
                    orgCode: '',//所属区域
                    startActualDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    startConfirmArrivalTime: '',//到达时间
                    endConfirmArrivalTime: '',
                    shipperCode: '',
                    oilCardStatus: '',
                    receiptType: '',
                    vehicleNature: '',
                    onTimeFlag: '',
                    fixDutyFlag: ''
                }
            },
            searchList() {//查询
                let _this = this;
                _this.isLoading = true;
                let selectReceiptCodeList = _this.searchParam.selectReceiptCodeList;
                let newReceiptCodeList = [];
                if (selectReceiptCodeList && selectReceiptCodeList.length > 0) {
                    var regex = new RegExp('\n|\n|\n', 'g');
                    let match = selectReceiptCodeList.replace(regex, ',');
                    newReceiptCodeList = match.split(",");
                    if (newReceiptCodeList.length > 1000) {
                        return this.$message.warning("批量查询的单号个数不超过1000个");
                    }
                    _this.searchParam.receiptCodeList = newReceiptCodeList;
                }
                if(_this.searchParam.code&&_this.searchParam!=null&&_this.searchParam!=""){
                    _this.searchParam = {//查询参数
                        currentPage: 1,
                        pageSize: 10,
                        status: '',//运单状态
                        oilCardCode: '',//油卡卡号
                        gpsCode: '',//gps
                        receiptCode: '',//回单号
                        selectReceiptCodeList: '',//回单号集合
                        receiptCodeList: [],//传给后台回单号集合
                        vehicleCode: '',
                        code: _this.searchParam.code,
                        customerCode: '',//客户
                        orgCode: '',//所属区域
                        startActualDepartureTime: '',//发车时间
                        endActualDepartureTime: '',
                        startConfirmArrivalTime: '',//到达时间
                        endConfirmArrivalTime: '',
                        shipperCode: '',
                        oilCardStatus: '',
                        receiptType: '',
                        vehicleNature: '',
                        onTimeFlag: '',
                        fixDutyFlag: ''
                    }
                }

                Http.post(Api.waybill.signPage, _this.searchParam, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    _this.isLoading = false;
                    if (_this.searchParam.selectReceiptCodeList) {
                        _this.searchParam.selectReceiptCodeList = '';
                        _this.searchParam.receiptCodeList = [];
                    }
                }, () => {
                    _this.isLoading = false;
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            showWayBill(row) { //运单详情------------------------------------
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.code}});
            },
            showLine(row) {//线路详情
                this.currentRow = row;
                this.showLineInfo = true;
            },
            hideLineInfo() {//关闭线路详情
                this.showLineInfo = false;
            },
            //回单签收
            signReceipt() {
                let arr = _.cloneDeep(this.multipleSelection).filter((item) => {
                    return this.receiptSignable(item)
                })
                let newArr = arr.map((item) => {
                    if (!_.isNil(item.receiptAttachment)) {
                        item.receiptAttachment = item.receiptAttachment.split(",");
                    } else {
                        item.receiptAttachment = []
                    }
                    return item;
                })
                newArr.forEach((item, index) => {
                    this.$set(this.receiptSignForm, index, {
                        code: item.code,
                        receiptCodes: item.receiptCodes,
                        receiptType: item.dispatch.dispatchLine.receiptType,
                        waybillReceiptLose: {
                            receiptLoseFlag: false,
                            remark: ''
                        },
                        receiptAttachment: item.receiptAttachment,
                        departureUrl: item.dispatch.dispatchLine.stopOverStation[0].attachment,
                        arrivalUrl: item.dispatch.dispatchLine.stopOverStation[item.dispatch.dispatchLine.stopOverStation.length - 1].attachment
                    })

                })
                this.showReceiptSignDialog = true;//显示窗口
                this.$nextTick(() => {
                    this.receiptSignForm.forEach((item) => {
                        this.$refs['receiptAttachment' + item.code].setFileList(item.receiptAttachment);
                    })
                })
            },
            synchronousReceipt(index, url) {
                this.$refs['receiptAttachment' + this.receiptSignForm[index].code].setFileList(url.split(','));
            },
            deleteRow(index){
                this.$refs['receiptAttachment' + this.receiptSignForm[index].code].clearFileList();
                this.receiptSignForm.splice(index,1,{waybillReceiptLose:{}});
            },
            receiptSignFormSubmit() {
                if(!(this.receiptSignForm.length>0)||this.receiptSignForm.every((item)=>!item.code)){
                    return this.$message.warning('请返回重新选择回单签收！');
                }
                let checkLengthArr = this.receiptSignForm.filter((item, index) => {
                    return item.code && (this.$refs['receiptAttachment' + item.code].getFileList().length > 20 || !(this.$refs['receiptAttachment' + item.code].getFileList().length > 0))
                })
                if (checkLengthArr.length > 0) {
                    return this.$message.warning(`运单${checkLengthArr[0].code}回单附件缺失或个数超出限制！`)
                }
                let submitForm = this.receiptSignForm.filter((item, index) => {
                    return !!item.code;
                })
                Http.post(Api.waybill.signReceipt, submitForm, result => {
                    this.$message.success('回单签收成功！');
                    this.searchList();
                    this.showReceiptSignDialog = false;
                })
            },
            //油卡签收
            signOilCard() {
                let arr = _.cloneDeep(this.multipleSelection).filter((item) => {
                    return this.oilCardSignable(item)
                })
                arr.forEach((item, index) => {
                    this.$set(this.oilCardSignForm, index, {
                        code: item.code,
                        oilCardNumber: item.dispatch.dispatchPrice.oilCardNumber || item.dispatch.dispatchSupplierPrice.oilCardNumber,
                        waybillOilCardLose: {
                            oilCardLoseFlag: false,
                            remark: ''
                        }
                    })
                })
                this.showOilCardSignDialog = true;
            },
            oilCardSignFormSubmit() {
                if(!(this.oilCardSignForm.length>0)){
                    return this.$message.warning('请返回重新选择油卡签收！');
                }
                Http.post(Api.waybill.signOilCard, this.oilCardSignForm, result => {
                    this.$message.success('油卡签收成功！');
                    this.searchList();
                    this.showOilCardSignDialog = false;
                })
            },
            //gps签收
            signGps() {
                let arr = _.cloneDeep(this.multipleSelection).filter((item) => {
                    return this.gpsSignable(item)
                })
                arr.forEach((item, index) => {
                    this.$set(this.gpsSignForm, index, {
                        code: item.code,
                        gpsCode: item.dispatch.dispatchPrice.gpsCode,
                        waybillGpsLose: {
                            gpsLoseFlag: false,
                            remark: ''
                        }
                    })
                })
                this.showGpsSignDialog = true;
            },
            gpsSignFormSubmit() {
                if(!(this.gpsSignForm.length>0)){
                    return this.$message.warning('请返回重新选择GPS签收！');
                }
                Http.post(Api.waybill.signGps, this.gpsSignForm, result => {
                    this.$message.success('gps签收成功！');
                    this.searchList();
                    this.showGpsSignDialog = false;
                })
            },
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.equipmentSignExport.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '运单设备签收数据.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },

            //------------------------------
            //某行是否可回单签收
            receiptSignable(row) {
                return !!row.receiptCodes && (row.status === 'IN' || row.status === 'SIGNED') && row.receiptStatus === 'WAIT_SIGN'
            },
            //某行是否可油卡签收
            oilCardSignable(row) {
                return (row.dispatch && row.dispatch.dispatchPrice && !!row.dispatch.dispatchPrice.oilCardNumber || row.dispatch && row.dispatch.dispatchSupplierPrice && !!row.dispatch.dispatchSupplierPrice.oilCardNumber) && row.status !== 'IN_TRANSIT' && row.oilCardStatus === 'WAIT_SIGN'
            },
            //某行是否可gps签收
            gpsSignable(row) {
                return row.dispatch && row.dispatch.dispatchPrice && !!row.dispatch.dispatchPrice.gpsCode && row.status !== 'IN_TRANSIT' && row.gpsStatus === 'WAIT_SIGN'
            },
            //某行是否可选
            checkSelectable(row) {
                return this.receiptSignable(row) || this.oilCardSignable(row) || this.gpsSignable(row)
            },
            //设备丢失开关改变
            equipmentLoseSwitchChange(value){
                if (value){
                    this.showEquipmentLoseSwitchChangeTipsDialog = true;
                }
            }
        }
    }
</script>
<style>
    .receiptClass {
        width: 600px !important;
    }
</style>

