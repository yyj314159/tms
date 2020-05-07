<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>竞价管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header height class="content-header">
            <el-form :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="订单编号:">
                            <el-input v-model="searchParam.orderCode" style="display:block" size="small"
                                      clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="竞价编号:">
                            <el-input v-model="searchParam.bidCode" style="display:block" size="small"
                                      clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机姓名:">
                            <driver-select ref="addVehicleFormDriverName" v-model="searchParam.driverId"
                                           :is-allow="true" style="display: block"></driver-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车型:">
                            <dictionary-select style="display:block;" v-model="searchParam.vehicleLength"
                                               option-name="VEHICLE_SPECIFICATION"></dictionary-select>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="厢型:" prop="vanType">
                            <dictionary-select v-model="searchParam.vanType" style="display:block;"
                                               option-name="VEHICLE_COMPARTMENT_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态:" prop="status">
                            <dictionary-select v-model="searchParam.status" style="display:block;"
                                               option-name="ORDER_BID_STATUS"></dictionary-select>
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
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18" style="float: right">
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
            <export-button v-permission="permission.export" :href="Api.orderBid.export" :params="searchParam"
                           :download-name="'订单竞价'" style="display: inline-block"></export-button>
            <!-- table -->
            <el-table v-loading="isLoading" :data="searchResult.result" element-loading-text="拼命加载中"
                      class="content-table" size="small" border fit highlight-current-row stripe>
                <el-table-column label="竞价单编号" header-align="center" prop="bidCode" min-width="150"/>
                <el-table-column label="订单编号" header-align="center" prop="orderCode" min-width="150">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showDetail(scope.row.order)">{{scope.row.orderCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="所属大区" header-align="center" prop="order.regionOrg.name" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.order ? (scope.row.order.regionOrg ? scope.row.order.regionOrg.name : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="所属分区" header-align="center" prop="order.belongOrg.name" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.order ? (scope.row.order.belongOrg ? scope.row.order.belongOrg.name : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" header-align="center" prop="status" min-width="150">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ORDER_BID_STATUS"
                                                :value="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="报价记录" header-align="center" prop="orderBidRecordCount" min-width="150">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color:#409EFF;"
                           @click="dialogOrderBidQuotationDetailDialog(scope.row)">{{scope.row.orderBidRecordCount}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="线路名称" header-align="center" prop="order.line.name" min-width="250">
                    <template slot-scope="scope">
                        {{scope.row.order ? (scope.row.order.dispatch?scope.row.order.dispatch.dispatchLine?scope.row.order.dispatch.dispatchLine.lineName:'':'') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="创建人" header-align="center" prop="createUser" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="指派车辆车长" header-align="center" prop="driverVehicleLength" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="承载方数" header-align="center" prop="loadSquare" width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="指派车辆箱型" header-align="center" prop="driverVanType" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE" v-model="scope.row.driverVanType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="指派车辆" header-align="center" prop="vehicleLicenseNum" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="指派车挂" header-align="center" prop="trailerLicenseNum" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="指派司机姓名" header-align="center" prop="driverName" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="指派司机电话" header-align="center" prop="driverMobile" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="中标司机姓名" header-align="center" prop="driverName" min-width="150"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.driver ? scope.row.driver.name : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="中标司机电话" header-align="center" prop="driverMobile" min-width="150"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.driver ? scope.row.driver.mobile : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="始发区域" header-align="center" prop="order.line.departStation.name"
                                 min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.order ? (scope.row.order.dispatch?(scope.row.order.dispatch.dispatchLine.startStation.city.name+scope.row.order.dispatch.dispatchLine.startStation.area.name):'') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="目的区域" header-align="center" prop="order.line.destStation.name" min-width="200">
                    <template slot-scope="scope">
                        {{scope.row.order ? (scope.row.order.dispatch?(scope.row.order.dispatch.dispatchLine.endStation.city.name+scope.row.order.dispatch.dispatchLine.endStation.area.name):'') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="竞价开始时间" header-align="center" prop="startTime"
                                 min-width="150"></el-table-column>
                <el-table-column label="竞价结束时间" header-align="center" prop="endTime" min-width="150"></el-table-column>
                <el-table-column label="订单车型" header-align="center" prop="order.vehicleLength" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row.order ? scope.row.order.vehicleLength : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="订单厢型" header-align="center" prop="vanType" min-width="150">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE"
                                                :value="scope.row.order ? scope.row.order.vanType : ''"/>
                    </template>
                </el-table-column>
                <el-table-column label="竞价参考车价" header-align="center" prop="paidVehicleAmount" min-width="150"></el-table-column>
                <el-table-column label="定标金额" header-align="center" prop="price" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="预付款" prop="order.prepaidCardAmount" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="货到款" prop="order.deliveryAmount" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="油卡金额" prop="order.oilCardAmount" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="预计发车时间" prop="order.expectDepartureTime" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="预计到达时间" prop="order.expectArrivalTime" min-width="150"></el-table-column>
                <el-table-column label="定标人" header-align="center" prop="confirmBidUser" min-width="150"></el-table-column>
                <el-table-column label="定标时间" header-align="center" prop="confirmBidTime" min-width="150"></el-table-column>
                <el-table-column label="供应商" header-align="center" prop="supplier.name" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.supplier ? scope.row.supplier.name : ''}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="取消人" prop="cancelUser" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="取消时间" prop="cancelTime" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="取消原因" prop="cancelRemark" min-width="250"></el-table-column>
                <el-table-column header-align="center" label="竞价失败人" prop="failureUser" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="竞价失败时间" prop="failureTime" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="完善订单备注" prop="remark" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="操作记录" prop="describtion" min-width="300" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" header-align="center" prop="createTime" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="修改人" header-align="center" prop="modifyUser" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="修改时间" header-align="center" prop="modifyTime" min-width="150" show-overflow-tooltip></el-table-column>
                <!--<el-table-column label="抢单时效(分钟)" header-align="center" prop="" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row ? (scope.row.startTime ? (((new Date(scope.row.endTime).getTime() - new Date(scope.row.startTime).getTime()))/60000).toFixed(2) : '') : ''}}
                    </template>
                </el-table-column>
                <el-table-column label="抢单余时（分钟）" header-align="center" prop="" min-width="150">
                    <template slot-scope="scope">
                        {{scope.row ? (scope.row.endTime ? (((new Date(scope.row.endTime).getTime() - new Date().getTime()))/60000).toFixed(2) :'') : ''}}
                    </template>
                </el-table-column>-->
                <el-table-column label="操作" header-align="center" align="center" fixed="left" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="cancelOrderBid(scope.row)"
                                   v-permission="'/orderBid/cancelOrderBid'"
                                   :disabled="scope.row.status === dataDec.ORDER_BID_STATUS[2].code || scope.row.status === dataDec.ORDER_BID_STATUS[3].code">
                            取消
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

            <el-dialog title="报价记录详情" :visible.sync="dialogOrderBidQuotationDetailVisible" width="90%" @close="resetQuotationDetailSearchParam">
                <div style="min-height: 600px;">
                    <el-header height class="content-header">
                        <el-form :model="quotationDetailRow" label-width="120px">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="线路名称:">
                                        {{quotationDetailRow.order ? (quotationDetailRow.order.dispatch ? (quotationDetailRow.order.dispatch.dispatchLine ? quotationDetailRow.order.dispatch.dispatchLine.lineName:''):'') : ''}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="预计发车时间:" min-width="200">
                                            {{quotationDetailRow.order ? quotationDetailRow.order.expectDepartureTime : ''}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="预计到达时间:" min-width="200">
                                            {{quotationDetailRow.order ? quotationDetailRow.order.expectArrivalTime : ''}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="竞价参考车价:" min-width="200">
                                            {{quotationDetailRow.paidVehicleAmount}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="订单预付款:">
                                        {{quotationDetailRow.order ? quotationDetailRow.order.prepaidCardAmount : ''}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="订单货到款:" min-width="200">
                                        {{quotationDetailRow.order ? quotationDetailRow.order.deliveryAmount : ''}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="订单油卡金额:" min-width="200">
                                        {{quotationDetailRow.order ? quotationDetailRow.order.oilCardAmount : ''}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>

                        <el-form :model="searchQuotationDetailParam" label-width="120px">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="司机">
                                        <driver-select v-model="searchQuotationDetailParam.driverId" :is-allow="true"
                                                       style="display: block"></driver-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="状态:" prop="status">
                                        <dictionary-select v-model="searchQuotationDetailParam.status"
                                                           style="display:block;"
                                                           option-name="DIALOG_RECORD_STATUS"></dictionary-select>
                                    </el-form-item>
                                </el-col>
                                <!--<el-col :span="6">
                                    <el-form-item label="司机报价:" prop="price">
                                        <el-input v-model="searchQuotationDetailParam.price" style="display:block;"
                                                  size="small" clearable/>
                                    </el-form-item>
                                </el-col>-->
                                <el-col :span="6" style="float: right">
                                    <el-form-item style="float: right" label-width="0">
                                        <el-button type="success" icon="el-icon-search"
                                                   @click="searchQuotationDetailList" size="small">查询
                                        </el-button>
                                        <el-button type="warning" @click="resetQuotationDetailSearchParam" size="small">
                                            重置
                                        </el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-header>
                    <el-main class="content-main">

                        <el-button v-permission="'/orderBid/modifyOrderBidFailure'" type="primary" size="mini"
                                   style="margin-left: 10px;" @click="modifyOrderBidFailure()">竞价失败
                        </el-button>
                        <el-table v-loading="dialogIsLoading" :data="quotationDetailResult.result"
                                  element-loading-text="拼命加载中" min-height="500"
                                  class="content-table" size="small" border fit highlight-current-row stripe>
                            <el-table-column label="订单编号" header-align="center" prop="orderCode" min-width="150">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showDetail(scope.row.orderBid.order)">{{scope.row.orderCode}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="竞价单编号" header-align="center" prop="bidCode" min-width="150"/>
                            <el-table-column label="用户类型" header-align="center" prop="userType" min-width="150">
                                <template slot-scope="scope">
                                    <dictionary-select-name option-name="ORDER_BID_USER_TYPE"
                                                            :value="scope.row.userType"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" header-align="center" prop="status" min-width="150">
                                <template slot-scope="scope">
                                    <dictionary-select-name option-name="ORDER_BID_RECORD_STATUS"
                                                            :value="scope.row.status"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="报价金额" header-align="center" prop="price" min-width="150"></el-table-column>
                            <el-table-column label="供应商" header-align="center" prop="supplier.name" min-width="150"
                                             show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{scope.row.supplier ? scope.row.supplier.name : ''}}
                                </template>
                            </el-table-column>
                            <el-table-column label="司机姓名" header-align="center" prop="driverName" min-width="150"
                                             show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{scope.row.driver ? scope.row.driver.name : ''}}
                                </template>
                            </el-table-column>
                            <el-table-column label="司机电话" header-align="center" prop="driverMobile" min-width="150"
                                             show-overflow-tooltip>
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
                            </el-table-column>                            <el-table-column label="指派车辆" header-align="center" prop="vehicleLicenseNum" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column label="指派车挂" header-align="center" prop="trailerLicenseNum" min-width="150" show-overflow-tooltip></el-table-column>
                            <el-table-column label="报价时间" header-align="center" prop="bidTime" min-width="150"></el-table-column>
                            <el-table-column label="备注" header-align="center" prop="remark" min-width="250" show-overflow-tooltip></el-table-column>
                            <el-table-column label="订单车型" header-align="center" prop="orderBid.order.vehicleLength" min-width="150">
                                <template slot-scope="scope">
                                    {{scope.row.orderBid.order ? scope.row.orderBid.order.vehicleLength : ''}}
                                </template>
                            </el-table-column>
                            <el-table-column label="订单厢型" header-align="center" prop="orderBid.order.vanType" min-width="150">
                                <template slot-scope="scope">
                                    <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE" :value="scope.row.orderBid.order ? scope.row.orderBid.order.vanType : ''"/>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column label="应付车价" header-align="center" prop="order.paidVehicleAmount" min-width="150">
                                <template slot-scope="scope">
                                    {{scope.row.order ? (scope.row.order.dispatch ? (scope.row.order.dispatch.dispatchPrice ? (scope.row.order.dispatch.dispatchPrice.paidVehicleAmount):''):'') : ''}}
                                </template>
                            </el-table-column>-->
                            <el-table-column label="创建人" header-align="center" prop="createUser" min-width="150">
                            </el-table-column>
                            <el-table-column label="创建时间" header-align="center" prop="createTime" min-width="150">
                            </el-table-column>
                            <el-table-column label="修改人" header-align="center" prop="modifyUser" min-width="150">
                            </el-table-column>
                            <el-table-column label="修改时间" header-align="center" prop="modifyTime" min-width="150">
                            </el-table-column>
                            <el-table-column label="操作" header-align="center" align="center" fixed="left"
                                             min-width="140">
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini" @click="confirmDriver(scope.row)"
                                               v-permission="'/orderBid/confirmOrderBid'"
                                               :disabled="scope.row.status != dataDec.ORDER_BID_RECORD_STATUS[0].code">
                                        确定
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="content-pagination">
                            <el-pagination
                                @size-change="quotationDetailHandleSizeChange"
                                @current-change="quotationDetailHandleCurrentChange"
                                :page-sizes="[10, 20, 50, 100]"
                                :page-size="searchQuotationDetailParam.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="quotationDetailResult.totalCount">
                            </el-pagination>
                        </div>
                    </el-main>
                </div>
            </el-dialog>
        </el-main>
        <!-- 派车弹出框 -->
        <order-send
            v-if="showAddSend" :dialogVisible="showAddSend" @close="hideAddSend" :currentRow="currentRow"
            :dispatchVehicle="currentRow.vehicle" :dispatchPrice="currentRow.order.dispatch.dispatchPrice"
            :driverInfo="currentRow.driver"></order-send>
        <!-- 订单弹出框 -->
        <order-edit v-if="OrderEditFlag" :dialogVisible="OrderEditFlag" @close="hideOrderEdit" :currentRow="currentRow"
                    :type="editType"></order-edit>

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
                            <dictionary-select style="display:block;" v-model="currentRow.order.vehicleLength"
                                               option-name="VEHICLE_SPECIFICATION" disabled></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="厢型:" prop="vehicleCode">
                            <dictionary-select style="display:block;" v-model="currentRow.order.vanType"
                                               option-name="VEHICLE_COMPARTMENT_TYPE" disabled></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车牌号码:" prop="vehicleCode" :rules="[validate.required('车牌号码',true)]">
                            <vehicle-select ref="vehicleLicenseNum" v-model="dispatchVehicle.vehicleCode"
                                            :type="[constant.VEHICLE_TYPE.VAN,constant.VEHICLE_TYPE.TRACTOR]"
                                            :is-allow="true"
                                            @change-option="queryVehicleInfo" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="挂厢号码:" prop="trailerCode">
                            <vehicle-select ref="trailerLicenseNum" v-model="dispatchVehicle.trailerCode"
                                            @change-option="queryTrailerVehicleInfo"
                                            :type="[constant.VEHICLE_TYPE.TRAILER]"
                                            :disabled="dispatchVehicle.isTrailerLicenseNumDisabled" :is-allow="true"
                                            :licenseNumber.sync="dispatchVehicle.trailerLicenseNum"
                                            style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDriver">取 消</el-button>
                <el-button type="primary" @click="submitDriver">确 定</el-button>
            </span>
        </el-dialog>

        <!--取消竞价原因弹框-->
        <el-dialog title="取消竞价"
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
                bidCode: "",
                Api: Api,
                constant: Constant,
                validate: Validate,//校验
                currentRow: {
                    order: {}
                },//操作行的数据
                quotationDetailRow: {
                    order: {}
                },
                OrderEditFlag: false, // 订单详情
                editType: '',  // 订单详情类型
                exportLoading: true, // 导出状态
                showAddSend: false, //加车派车
                cancelOrderFlag: false,
                cancelOrderForm: {
                    bidCode: '',
                    cancelRemark: '',
                },
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
                    orgCode: '',
                    startCreateTime: '',
                    endCreateTime: '',
                    startExpectDepartureTime: Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() - 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() - 3*24*3600*1000).getMonth(), new Date(new Date().getTime() - 3*24*3600*1000).getDate(),0,0,0)),
                    endExpectDepartureTime: Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() + 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() + 3*24*3600*1000).getMonth(), new Date(new Date().getTime() + 3*24*3600*1000).getDate(),23,59,59)),
                    currentOrgCode: this.$store.getters.user.orgCode

                },
                searchQuotationDetailParam: {
                    currentPage: 1,
                    pageSize: 10,
                    status:'',
                    driverId: '',
                    price: '',
                    //statusList:[dataDec.ORDER_BID_RECORD_STATUS[3].code,dataDec.ORDER_BID_RECORD_STATUS[4].code],
                    bidCode: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                quotationDetailResult: {
                    totalCount: 0,
                    result: []
                },
                permission: {
                    /*权限*/
                    export: "/orderBid/export", //导出
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
                showDriver: false,
                dispatchVehicle: {
                    vehicleCode: '',
                    trailerCode: '',
                    licenseNumber: '',
                    trailerLicenseNum: ''
                },
                dialogOrderBidQuotationDetailVisible: false,
                dialogIsLoading: false,
                kyOrderQuotationDetailForm: {},
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
        watch: {
            //监听传入的visible参数
            dialogOrderBidQuotationDetailVisible(val) {
                if (!val) {
                    this.searchList();
                }
            }
        },
        methods: {
            submitDriver() {
                let vm = this;
                console.log(this.dispatchVehicle.vehicleCode, this.dispatchVehicle.trailerCode, this.currentRow)
                let postData = this.currentRow
                postData.order.licenseNumber = this.dispatchVehicle.licenseNumber
                postData.order.trailerLicenseNum = this.dispatchVehicle.trailerLicenseNum
                this.$refs.dispatchVehicle.validate((val) => {
                    if (val) {
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
            closeDriver() {
                this.showDriver = false
                this.dispatchVehicle = {
                    vehicleCode: '',
                    trailerCode: '',
                    licenseNumber: '',
                    trailerLicenseNum: ''
                }
            },
            queryVehicleInfo(obj) {
                if (obj) {
                    this.dispatchVehicle.licenseNumber = obj.licenseNumber
                } else {
                    this.$nextTick(() => {
                        this.dispatchVehicle.licenseNumber = this.$refs.vehicleLicenseNum.currentValue
                    })
                }
            },
            getDriverInfo() {

            },
            cancelOrderBid(item) {
                let vm = this;
                vm.cancelOrderForm.bidCode = item.bidCode
                vm.cancelOrderFlag = true
            },
            queryTrailerVehicleInfo(obj) {
                this.dispatchVehicle.trailerLicenseNum = obj.licenseNumber
            },
            confirmDriver(item) {
                let vm = this
                this.$confirm('确定选择该司机?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(
                        Api.orderBidRecord.confirmOrderBidRecord,
                        {id: item.id},
                        result => {
                            vm.$message.success('确认成功')
                            vm.searchQuotationDetailList()
                            //vm.dialogOrderBidQuotationDetailVisible = false;
                            //vm.searchList();
                        },
                        result => {
                            vm.$message.error(result.message)
                        }
                    );
                })
            },
            modifyOrderBidFailure() {
                let vm = this
                this.$confirm('确认此竞价失败?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(
                        Api.orderBid.modifyOrderBidFailure,
                        {bidCode: vm.bidCode},
                        result => {
                            vm.$message.success('确认成功')
                            vm.dialogOrderBidQuotationDetailVisible = false;
                            //vm.searchList();
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
            setDriver(row) {
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
                    Api.orderBid.page,
                    {params: vm.searchParam},
                    result => {
                        this.searchResult.result = result.result;
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
                    bidCode: "",
                    status: "",
                    currentPage: 1,
                    pageSize: 10,
                    driverId: '',
                    driverMobile: '',
                    vehicleLength: '',
                    vanType: '',
                    orgCode: '',
                    startCreateTime: '',
                    endCreateTime: '',
                    startExpectDepartureTime: Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() - 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() - 3*24*3600*1000).getMonth(), new Date(new Date().getTime() - 3*24*3600*1000).getDate(),0,0,0)),
                    endExpectDepartureTime: Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() + 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() + 3*24*3600*1000).getMonth(), new Date(new Date().getTime() + 3*24*3600*1000).getDate(),23,59,59)),
                    currentOrgCode: this.$store.getters.user.orgCode
                }
            },
            searchQuotationDetailList() {
                let vm = this;
                vm.dialogIsLoading = true;
                Http.get(Api.orderBidRecord.notCancelPage, {params: vm.searchQuotationDetailParam}, result => {
                        if (result.result) {
                            this.quotationDetailResult.result = result.result;
                            this.quotationDetailResult.totalCount = result.totalCount;
                            this.searchQuotationDetailParam.currentPage = result.currentPage;
                            this.searchQuotationDetailParam.pageSize = result.pageSize;
                            vm.dialogIsLoading = false;
                        }
                    },
                    result => {
                        vm.dialogIsLoading = false;
                    })
            },
            resetQuotationDetailSearchParam() {
                this.searchQuotationDetailParam.currentPage = 1;
                this.searchQuotationDetailParam.pageSize = 10;
                this.searchQuotationDetailParam.status = '';
                this.searchQuotationDetailParam.driverId = '';
                this.searchQuotationDetailParam.price = '';
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
            quotationDetailHandleSizeChange(val) {
                let vm = this;
                vm.searchQuotationDetailParam.pageSize = val;
                this.dialogOrderBidQuotationDetailDialog(this.quotationDetailRow);
            },
            quotationDetailHandleCurrentChange(val) {
                let vm = this;
                vm.searchQuotationDetailParam.currentPage = val;
                this.dialogOrderBidQuotationDetailDialog(this.quotationDetailRow);
            },
            showDetail(item) {
                this.currentRow = item
                this.OrderEditFlag = true
                this.editType = 'show'
            },
            hideOrderEdit() {
                this.OrderEditFlag = false
            },
            dialogOrderBidQuotationDetailDialog(row) {
                this.quotationDetailRow = row;
                let vm = this;
                vm.bidCode = row.bidCode
                vm.searchQuotationDetailParam.bidCode = row.bidCode
                Http.get(Api.orderBidRecord.notCancelPage, {params: vm.searchQuotationDetailParam}, result => {
                    if (result.result) {
                        this.quotationDetailResult.result = result.result;
                        this.quotationDetailResult.totalCount = result.totalCount;
                        this.searchQuotationDetailParam.currentPage = result.currentPage;
                        this.searchQuotationDetailParam.pageSize = result.pageSize;
                    }
                    vm.dialogOrderBidQuotationDetailVisible = true;
                })
            },
            cancelOrderClose(){
                this.cancelOrderFlag = false
                this.cancelOrderForm = {
                    bidCode: '',
                    cancelRemark: '',
                }
                this.$refs.cancelOrderForm.resetFields()
            },
            goCancelOrder(){
                let vm = this
                this.$refs.cancelOrderForm.validate((val) => {
                    if(val){
                        Http.post(Api.orderBid.cancelOrderBid, vm.cancelOrderForm,
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
        }
    };
</script>
<style>
</style>

