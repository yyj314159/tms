<template>
    <el-container style="height: 100%;">
        <el-header height="" style="padding-left: 0">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                    <el-breadcrumb-item><i class="el-icon-date"></i> 智能调度</el-breadcrumb-item>
                    <el-breadcrumb-item>运单详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-header>

        <el-form id="waybill" size="small" label-position="left">
            <!--运单信息-->
            <el-row class="card" :class="{'electron':searchResult.dispatch.dispatchLine.receiptType==='ELECTRON_TYPE','paper':searchResult.dispatch.dispatchLine.receiptType==='PAPER_TYPE'}">
                <el-row>
                    <span class="title">运单信息 :</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span style="color:red; font-size: 18px; font-weight: bold;">{{searchResult.code}}<b style="font-size:15px; color:black;">{{`（ ${searchResult.dispatch.code} ）`}}</b></span>&nbsp;&nbsp;
                    <span style="font-size: 16px; font-weight: bold;" :class="{green:searchResult.status===Constant.WAY_BILL_STATUS.IN_TRANSIT,gray:searchResult.status===Constant.WAY_BILL_STATUS.BEEN_ABANDONED,purple:searchResult.status===Constant.WAY_BILL_STATUS.IN}">
                        <dictionary-select-name option-name="WAY_BILL_STATUS"  v-model="searchResult.status"></dictionary-select-name>
                    </span>
                    <span style="margin-left:50px;"></span>
                    <el-button v-show="waybillVoidBtnShow" type="danger" size="mini" @click="waybillVoid"><i class="fa fa-trash" aria-hidden="true"></i> 运单作废</el-button>
                </el-row>
                <el-row class="card-body">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="线路名称：">{{searchResult.dispatch.dispatchLine?searchResult.dispatch.dispatchLine.lineName:''}}</el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="共建线路：">
                                <span v-if="searchResult.dispatch.dispatchLine">
                                    <span v-if="searchResult.dispatch.dispatchLine.financeLineFlag === true">是</span>
                                    <span v-else-if="searchResult.dispatch.dispatchLine.financeLineFlag === false">否</span>
                                    <span v-else></span>
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="金融运单：">
                                <span v-if="searchResult.dispatch.financeFlag === true">是</span>
                                <span v-else-if="searchResult.dispatch.financeFlag === false">否</span>
                                <span v-else></span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="业务类型: ">
                                <dictionary-select-name option-name="LINE_BUSINESS_TYPE" v-model="searchResult.dispatch.businessType"></dictionary-select-name>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="客户：">{{searchResult.dispatch.customer?searchResult.dispatch.customer.name:''}}</el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="客户订单号：">{{searchResult.dispatch.customerOrderCode}}</el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="所属分区: ">{{searchResult.dispatch.belongOrg?searchResult.dispatch.belongOrg.name:''}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="预计发车:">{{searchResult.dispatch.expectDepartureTime}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="派车时间:">{{searchResult.dispatch.sendTime}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="体积/重量/件数：">
                                {{bulkfactorForm.volume?`${bulkfactorForm.volume} (方)`:''}}&nbsp;&nbsp;{{bulkfactorForm.weight?`${bulkfactorForm.weight} (公斤)`:''}}&nbsp;&nbsp;{{bulkfactorForm.number?`${bulkfactorForm.number} (件数)`:''}}
                                <el-button v-show="hasDataPermission && $_permission('/waybill/modifyWeight') && (searchResult.dispatch.dispatchPrice.receivePriceType === Constant.LINE_PRICE_TYPE.WEIGHT ||searchResult.dispatch.dispatchPrice.receivePriceType === Constant.LINE_PRICE_TYPE.VOLUME || searchResult.dispatch.dispatchPrice.receivePriceType === Constant.LINE_PRICE_TYPE.NORMAL ||searchResult.dispatch.dispatchPrice.paidPriceType === Constant.LINE_PRICE_TYPE.WEIGHT ||searchResult.dispatch.dispatchPrice.paidPriceType === Constant.LINE_PRICE_TYPE.VOLUME || searchResult.dispatch.dispatchPrice.paidPriceType === Constant.LINE_PRICE_TYPE.NORMAL)" size="small" type="text" @click="addBulkfactor" icon="el-icon-edit"></el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="回货:">{{searchResult.dispatch.returnGoods ? "是" : "否"}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="业务员:">{{searchResult.dispatch.salesman ? searchResult.dispatch.salesman : "无"}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="请车员:">{{searchResult.dispatch.carInviter}}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="调度人：">{{searchResult.dispatch.dispatchUser}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="调度电话：">{{searchResult.dispatch.dispatchPhone}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="则一时效：">{{searchResult.dispatch.dispatchLine?searchResult.dispatch.dispatchLine.timeConsumeZeyi:''}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="运输时效：">
                                <span v-if="searchResult.actualTimeConsumeHour || searchResult.actualTimeConsumeMin">{{searchResult.actualTimeConsumeHour}}小时{{searchResult.actualTimeConsumeMin}}分钟</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="是否准点（则一）：">
                                <span v-if="searchResult.onTimeFlag === true">准点</span>
                                <span v-else-if="searchResult.onTimeFlag === false" style="color: red; font-weight: bold;">晚点 {{searchResult.overTime}}</span>
                                <span v-else></span>
                                <el-button v-show="hasDataPermission && $_permission('/waybill/modifyOnTimeFlagAndOverTime')" size="small" type="text" @click="showModifyOnTimeFlagAndOverTime = true" icon="el-icon-edit"></el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="考核方式：">
                                <dictionary-select-name option-name="LINE_EVALUATION_MODE" :value="searchResult.dispatch.dispatchLine.evaluationMode"></dictionary-select-name>
                                <el-button v-show="hasDataPermission && $_permission('/waybill/modifyEvaluationMode')" size="small" type="text" @click="showModifyEvaluationMode = true" icon="el-icon-edit"></el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="客户时效：">{{searchResult.dispatch.dispatchLine?searchResult.dispatch.dispatchLine.timeConsume:''}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="是否准点（客户）：">
                                <span v-if="searchResult.dispatch.customerOnTimeFlag === true">准点</span>
                                <span v-else-if="searchResult.dispatch.customerOnTimeFlag === false" style="color: red; font-weight: bold;">晚点 {{searchResult.dispatch.customerOverTime}}</span>
                                <span v-else></span>
                                <el-button v-show="hasDataPermission && $_permission('/waybill/modifyCustomerOnTimeFlagAndCustomerOverTime')" size="small" type="text" @click="showModifyCustomerOnTimeFlagAndCustomerOverTime = true" icon="el-icon-edit"></el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="运单签收人：">{{searchResult.signUser}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="签收时间：">{{searchResult.signTime}}</el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="回单号：" style="word-break:break-all;">
                                <span style="font-weight: bold; margin-right: 25px;" v-for="(item,index) in receiptArry" :key="index">{{item}}</span>
                                <show-image style="display: inline-block!important; margin-left: 25px;" :url="receiptAttachment"></show-image>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row  v-show="!isWeight">
                        <el-col :span="24">
                            <el-form-item label="备注信息：">
                                <p style="word-break:break-all;">{{searchResult.dispatch.remark ? searchResult.dispatch.remark : "无"}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row  v-show="isWeight">
                        <el-col :span="3">
                            <el-form-item label="重量图片：">
                                <show-image :url="searchResult.dispatch.weightAttachment"></show-image>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item>
                                <el-button v-show="hasDataPermission" v-permission="'/dispatch/addWeightAttachment'" size="mini" type="text" icon="el-icon-edit" @click="editWeightAttachment" style="font-weight: bold;">磅重附件</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="18">
                            <el-form-item label="备注信息：">
                                <p style="word-break:break-all;">{{searchResult.dispatch.remark ? searchResult.dispatch.remark : "无"}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-row>
            </el-row>

            <!--车辆信息-->
            <el-row class="card">
                <el-row>
                    <span class="title">车辆信息 :</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-button v-if="searchResult.dispatch.dispatchVehicle.vehicleNature != 'OUT_INVITE'" type="text" size="mini" icon="el-icon-view" @click="showRunningTrack" style="font-weight: bold;">查看运行轨迹</el-button>
                    <el-button v-if="searchResult.dispatch.dispatchVehicle.vehicleNature == 'OUT_INVITE'" type="text" size="mini" icon="el-icon-view" @click="showOutRunningTrack" style="font-weight: bold;">查看运行轨迹</el-button>
                </el-row>
                <el-row class="card-body">
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="车牌号：">
                                <b style="font-size: 16px;">{{searchResult.dispatch.dispatchVehicle?searchResult.dispatch.dispatchVehicle.vehicleLicenseNum:''}}</b>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="车挂号：">
                                <b style="font-size: 16px;">{{searchResult.dispatch.dispatchVehicle?searchResult.dispatch.dispatchVehicle.trailerLicenseNum:''}}</b></el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="厢型："><dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE" v-model="searchResult.dispatch.dispatchVehicle.vanType"></dictionary-select-name>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="车型："><dictionary-select-name option-name="VEHICLE_SPECIFICATION" v-model="searchResult.dispatch.dispatchVehicle.specification"></dictionary-select-name>(米)
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="承载方数:">
                                <span v-if="searchResult.dispatch.dispatchVehicle && searchResult.dispatch.dispatchVehicle.trailer">{{searchResult.dispatch.dispatchVehicle.trailer.loadSquare}}</span>
                                <span v-else-if="searchResult.dispatch.dispatchVehicle && searchResult.dispatch.dispatchVehicle.vehicle">{{searchResult.dispatch.dispatchVehicle.vehicle.loadSquare}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="车辆性质：">
                                <b style="font-size: 16px;"><dictionary-select-name option-name="VEHICLE_OPERATION_MODE" v-model="searchResult.dispatch.dispatchVehicle.vehicleNature"></dictionary-select-name></b>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="searchResult.dispatch.dispatchVehicle.vehicleNature!==Constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT">
                        <el-col :span="4">
                            <el-form-item label="司机：">{{searchResult.dispatch.dispatchVehicle?searchResult.dispatch.dispatchVehicle.driver?searchResult.dispatch.dispatchVehicle.driver.name:"":''}}</el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="司机电话：">{{searchResult.dispatch.dispatchVehicle?searchResult.dispatch.dispatchVehicle.driver?searchResult.dispatch.dispatchVehicle.driver.mobile:"":''}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="供应商:">
                                {{searchResult.dispatch.dispatchVehicle.supplier ? searchResult.dispatch.dispatchVehicle.supplier.name : "无"}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-form-item label="金融车辆：">
                                <span v-if="searchResult.dispatch.dispatchVehicle">
                                    <span v-if="searchResult.dispatch.dispatchVehicle.financeVehicleFlag === true">是</span>
                                    <span v-else-if="searchResult.dispatch.dispatchVehicle.financeVehicleFlag === false">否</span>
                                    <span v-else></span>
                                </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="车主姓名:">
                                {{searchResult.dispatch.dispatchVehicle.vehicleOwner ? searchResult.dispatch.dispatchVehicle.vehicleOwner.name : ""}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="车主电话:">
                                {{searchResult.dispatch.dispatchVehicle.vehicleOwner ? searchResult.dispatch.dispatchVehicle.vehicleOwner.mobile : ""}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-else>
                        <el-col :span="4">
                            <el-form-item label="司机：">{{searchResult.dispatch.dispatchVehicle?searchResult.dispatch.dispatchVehicle.driver?searchResult.dispatch.dispatchVehicle.driver.name:"":''}}</el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="司机电话：">{{searchResult.dispatch.dispatchVehicle?searchResult.dispatch.dispatchVehicle.driver?searchResult.dispatch.dispatchVehicle.driver.mobile:"":''}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="司机2：">{{searchResult.dispatch.dispatchVehicle?searchResult.dispatch.dispatchVehicle.spareDriver?searchResult.dispatch.dispatchVehicle.spareDriver.name:"":''}}</el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="司机电话2：">{{searchResult.dispatch.dispatchVehicle?searchResult.dispatch.dispatchVehicle.spareDriver?searchResult.dispatch.dispatchVehicle.spareDriver.mobile:"":''}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="车主姓名:">
                                {{searchResult.dispatch.dispatchVehicle.vehicleOwner ? searchResult.dispatch.dispatchVehicle.vehicleOwner.name : ""}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="车主电话:">
                                {{searchResult.dispatch.dispatchVehicle.vehicleOwner ? searchResult.dispatch.dispatchVehicle.vehicleOwner.mobile : ""}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="金融车辆：">
                                <span v-if="searchResult.dispatch.dispatchVehicle">
                                    <span v-if="searchResult.dispatch.dispatchVehicle.financeVehicleFlag === true">是</span>
                                    <span v-else-if="searchResult.dispatch.dispatchVehicle.financeVehicleFlag === false">否</span>
                                    <span v-else></span>
                                </span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                    </el-row>
                </el-row>
            </el-row>

            <!--出发到达信息-->
            <el-row class="card">
                <el-row>
                    <span class="title">出发到达信息 :</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>{{searchResult.dispatch.dispatchLine?searchResult.dispatch.dispatchLine.lineName:''}}</span>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>{{searchResult.dispatch.dispatchLine?searchResult.dispatch.dispatchLine.distance:''}} 公里</span>
                    <el-button type="text" icon="el-icon-edit" size="mini" round @click="showAddStation"
                               v-if="hasDataPermission && ($_permission('/waybill/addStopOverStation') ||  $_permission('/waybill/updateStopOverStation'))" style="font-weight: bolder;">经停</el-button>
                </el-row>
                <el-row class="card-body">
                    <el-col :span="2" v-if="searchResult.dispatch.dispatchLine.stopOverStation.length>2">
                        <div :style="{height:searchResult.dispatch.dispatchLine.stopOverStation.length*150+'px',marginTop:25+'px'}">
                            <el-steps direction="vertical" :active="searchResult.dispatch.dispatchLine.stopOverStation.length">
                                <el-step v-for="(item,index) in searchResult.dispatch.dispatchLine.stopOverStation" :key="index"
                                         :title="index==0?'始发':index==searchResult.dispatch.dispatchLine.stopOverStation.length-1?'终点':'经停'"></el-step>
                            </el-steps>
                        </div>
                    </el-col>
                    <el-col :span="2" v-else>
                        <div style="height:188px; margin-top: 25px;">
                            <el-steps direction="vertical" :active="2">
                                <el-step title="始发"></el-step>
                                <el-step title="终点"></el-step>
                            </el-steps>
                        </div>
                    </el-col>
                    <el-col :span="22">
                        <!--始发地-->
                        <el-row>
                            <el-row style="margin-top: 20px;">
                                <el-col :span="24">
                                    <el-form-item label-width="0">
                                        地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址 ： {{searchResult.dispatch.dispatchLine.stopOverStation[0]?searchResult.dispatch.dispatchLine.stopOverStation[0].stationAddress:''}}
                                        <show-image style="display: inline-block; font-weight: bold;" :url="searchResult.dispatch.dispatchLine.stopOverStation[0]?searchResult.dispatch.dispatchLine.stopOverStation[0].attachment:''"></show-image>
                                        {{searchResult.dispatch.dispatchLine.stopOverStation[0]?`（ ${searchResult.dispatch.dispatchLine.stopOverStation[0].station.name} ）`:''}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="" label-width="0">
                                        司机签到 ： {{searchResult.dispatch.dispatchLine.stopOverStation[0]?searchResult.dispatch.dispatchLine.stopOverStation[0].signInTime:''}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        预计发车 ： {{searchResult.dispatch.dispatchLine.stopOverStation[0]?searchResult.dispatch.dispatchLine.stopOverStation[0].expectDepartureTime:''}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        司机发车 ： {{searchResult.dispatch.driverDepartureTime}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        发车时间 ： {{searchResult.actualDepartureTime}}
                                        <el-button type="text" icon="el-icon-edit" @click="editActualDepartureTime(searchResult.actualDepartureTime)"
                                        v-show="hasDataPermission && ($_permission('/waybill/modifyDepartureTime') || $_permission('/waybill/customerModifyDepartureTime'))"></el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row style="border-bottom: 1px solid #dddddd; margin-bottom: 20px;">
                                <el-col :span="6">
                                    <el-form-item label-width="0">
                                        驶入围栏 ： {{searchResult.dispatch.dispatchLine.stopOverStation[0]?(searchResult.dispatch.dispatchLine.stopOverStation[0].stationFence?searchResult.dispatch.dispatchLine.stopOverStation[0].stationFence.inTime:''):''}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        驶出围栏 ： {{searchResult.dispatch.dispatchLine.stopOverStation[0]?(searchResult.dispatch.dispatchLine.stopOverStation[0].stationFence?searchResult.dispatch.dispatchLine.stopOverStation[0].stationFence.outTime:''):''}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-row>
                        <!--经停点-->
                        <el-row v-for="item in stopOverStationData" :key="item.index">
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item>
                                        地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址 ： {{item.station.address}}
                                        <show-image style="display: inline-block; font-weight: bold;" :url="item.attachment"></show-image>
                                        {{`（ ${item.station.name} ）`}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item>
                                        预计到车: {{item.expectArrivalTime}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="">
                                        司机到车: {{item.actualArrivalTime}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item  label="">
                                        到车时间：{{item.confirmArrivalTime}} <el-button v-if="hasDataPermission && ($_permission('/waybill/confirmArriveStation') || $_permission('/waybill/customerConfirmArriveStation'))" type="text" icon="el-icon-edit" @click="showAddArrivalTimeDialog(item)"></el-button>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="">
                                        司机发车: {{item.actualDepartureTime}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="">
                                        发车时间：{{item.confirmDepartureTime}} <el-button  v-if="hasDataPermission && ($_permission('/waybill/confirmDepartureStation') || $_permission('/waybill/customerConfirmDepartureStation'))" type="text" icon="el-icon-edit" @click="showAddDepartureTimeDialog(item)"></el-button>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        则一时效：{{item.travelTimeZeyiHour>0?`${item.travelTimeZeyiHour}小时`:''}} {{item.travelTimeZeyiMin>0?`${item.travelTimeZeyiMin}分钟`:''}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        运输时效：{{item.actualTimeConsume}}
                                        <span v-if="item.onTimeFlag === true">(准点)</span>
                                        <span v-else-if="item.onTimeFlag === false" style="color: red; font-weight: bold;">(超时)</span>
                                        <span v-else></span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        超时时间：<span style="color:red;">{{item.overTime}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row style="border-bottom: 1px solid #dddddd; margin-bottom: 20px;">
                                <el-col :span="6">
                                    <el-form-item label-width="0">
                                        驶入围栏 ： {{item.stationFence?item.stationFence.inTime:''}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        驶出围栏 ： {{item.stationFence? item.stationFence.outTime : ''}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-row>
                        <!--目的地-->
                        <el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item>
                                        地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址： {{searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1]?searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1].stationAddress:''}}
                                        <show-image style="display: inline-block; font-weight: bold;" :url="searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1]?searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1].attachment:''"></show-image>
                                        {{searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1]?`（ ${searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1].station.name} ）`:''}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item>
                                        预计到达： {{searchResult.arrivalTime}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        司机到达： {{searchResult.actualArrivalTime}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        到达时间： {{searchResult.confirmArrivalTime}}
                                        <el-button type="text" icon="el-icon-edit" @click="editConfirmArrivalTime(searchResult.confirmArrivalTime)"
                                                   v-if="!!searchResult.confirmArrivalTime && hasDataPermission && ($_permission('/waybill/modifyArrivalTime') || $_permission('/waybill/customerModifyArrivalTime'))"></el-button>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        则一时效：{{searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1]?(searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1].travelTimeZeyiHour>0?`${searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1].travelTimeZeyiHour}小时`:''):''}}
                                                 {{searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1]?(searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1].travelTimeZeyiMin>0?`${searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1].travelTimeZeyiMin}分钟`:''):''}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item>
                                        运输时效：{{searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1]?searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1].actualTimeConsume:''}}
                                        <span v-if="searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1]">
                                            <span v-if="searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1].onTimeFlag === true">(准点)</span>
                                            <span v-else-if="searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1].onTimeFlag === false" style="color: red; font-weight: bold;">(超时)</span>
                                            <span v-else></span>
                                        </span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item>
                                        超时时间：<span style="color:red;">{{searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1]?searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1].overTime:''}}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label-width="0">
                                        驶入围栏 ： {{searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1]?(searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1].stationFence?searchResult.dispatch.dispatchLine.stopOverStation[searchResult.dispatch.dispatchLine.stopOverStation.length-1].stationFence.inTime:''):''}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-row>
                    </el-col>
                </el-row>
            </el-row>

            <!--应收信息-->
            <el-row class="card" v-if="$_permission('/waybillDetail/receiveConfirm') && hasDataPermission">
                <el-row>
                    <span class="title">应收信息 :</span> <span style="padding-left: 30px;font-size:12px; font-weight: bold;">{{searchResult.dispatch.dispatchPrice.receiveAmount}} 元
                    （<dictionary-select-name option-name="LINE_PRICE_TYPE" v-model="searchResult.dispatch.dispatchPrice.receivePriceType"></dictionary-select-name>
                    <span style="padding-left: 30px;font-size:12px;" v-if="searchResult.dispatch.dispatchPrice.receivePriceType==='WEIGHT'">{{searchResult.dispatch.dispatchPrice.receiveUnitPrice}} 元/公斤</span>
                    <span style="padding-left: 30px;font-size:12px;" v-if="searchResult.dispatch.dispatchPrice.receivePriceType==='VOLUME'">{{searchResult.dispatch.dispatchPrice.receiveUnitPrice}} 元/方</span>）</span>

                    <span style="padding-left: 30px;color:red; font-weight: bold;">实际应收 {{receiveConfirm.actualReceiveAmount}}  元</span>
                </el-row>
                <el-row class="card-body">
                    <el-row>
                        <el-col :span="9">
                            <el-form-item label="客户全称:">
                                {{receiveConfirm.customerName}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="收入主体:">
                                {{receiveConfirm.incomeSubject}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="运价调整:">
                                {{receiveConfirm.feeAdjustAmount}} 元
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="结算运费:">
                                {{receiveConfirm.settlementAmount}} 元
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="质量扣款:">
                                {{receiveConfirm.qualityDeductionsAmount}} 元
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="安全扣款:">
                                {{receiveConfirm.securityDeductionsAmount}} 元
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="油价补差:">
                                {{receiveConfirm.oilPriceSupplement}} 元
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="其它扣款:">
                                {{receiveConfirm.otherDeductionsAmount}} 元
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-row>
            </el-row>

            <!--应付信息-->
            <el-row class="card" v-if="$_permission('/waybillDetail/paidConfirm')">
                <el-row>
                    <span class="title">应付信息 :</span> <span style="padding-left: 30px;font-size:12px; font-weight: bold;">{{searchResult.dispatch.dispatchPrice.paidVehicleAmount}} 元
                （<dictionary-select-name option-name="LINE_PRICE_TYPE" v-model="searchResult.dispatch.dispatchPrice.paidPriceType"></dictionary-select-name>
                    <span style="padding-left: 30px;font-size:12px;" v-show="searchResult.dispatch.dispatchPrice.paidPriceType==='WEIGHT'">{{searchResult.dispatch.dispatchPrice.paidUnitPrice}} 元/公斤</span>
                    <span style="padding-left: 30px;font-size:12px;" v-show="searchResult.dispatch.dispatchPrice.paidPriceType==='VOLUME'">{{searchResult.dispatch.dispatchPrice.paidUnitPrice}} 元/方</span>）</span>

                    <span style="padding-left: 30px;color:red; font-weight: bold;">实际应付 {{searchResult.dispatch.dispatchPrice.actualPaidVehicleAmount}}  元</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </el-row>
                <el-row class="card-body">
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="预付打卡:">
                                {{searchResult.dispatch.dispatchPrice.prepaidCardAmount}}元
                                <b v-show="searchResult.dispatch.dispatchPrice.prepaidCardAmount>0 && $_permission('/waybillDetail/paidStatus')">
                                    <span v-if="searchResult.outInvitePrepaymentStatus===Constant.PAY_STATUS.PAID" style="color:green;">(已付)</span>
                                    <span style="color:red;" v-else>(未付)</span>
                                </b>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="油卡金额:">
                                {{searchResult.dispatch.dispatchPrice.oilCardAmount}}元
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="油卡押金:">
                                {{searchResult.dispatch.dispatchPrice.oilCardDeposit}}元
                                <b v-show="searchResult.dispatch.dispatchPrice.oilCardDeposit > 0 && $_permission('/waybillDetail/paidStatus')">
                                    <span v-if="searchResult.supplierPayableBill && searchResult.supplierPayableBill.oilCardDeposit===Constant.PAYMENT_TYPE.PAYMENT" style="color:green;">(已退)</span>
                                    <span style="color:red;" v-else>(未退)</span>
                                </b>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="定点加油:">
                                {{searchResult.dispatch.dispatchPrice.refuelingAmount}}元
                                <span v-show="searchResult.dispatch.dispatchPrice.refuelingAmount>0">(<dictionary-select-name option-name="REFUELING_TYPE" :value="searchResult.dispatch.dispatchPrice.refuelingType"></dictionary-select-name>)</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="使用GPS:">
                                {{searchResult.dispatch.dispatchPrice.useGps?'是':'否'}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="GPS号码:">
                                {{searchResult.dispatch.dispatchPrice.gpsCode}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="GPS押金:">
                                {{searchResult.dispatch.dispatchPrice.gpsDeposit}}元
                                <b v-show="searchResult.dispatch.dispatchPrice.gpsDeposit > 0 && $_permission('/waybillDetail/paidStatus')">
                                    <span v-if="searchResult.supplierPayableBill && searchResult.supplierPayableBill.gpsDeposit===Constant.PAYMENT_TYPE.PAYMENT" style="color:green;">(已退)</span>
                                    <span style="color:red;" v-else>(未退)</span>
                                </b>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="GPS费用:">
                                {{searchResult.dispatch.dispatchPrice.gpsFee}}元
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="货到打卡:">
                                {{searchResult.dispatch.dispatchPrice.deliveryAmount}}元
                                <b v-show="searchResult.dispatch.dispatchPrice.deliveryAmount>0 && $_permission('/waybillDetail/paidStatus')">
                                    <span v-if="searchResult.outInviteCodStatus===Constant.PAY_STATUS.PAID" style="color:green;">(已付)</span>
                                    <span style="color:red;" v-else>(未付)</span>
                                </b>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="回单押金:">
                                {{searchResult.dispatch.dispatchPrice.returnDeposit}}元
                                <b v-show="searchResult.dispatch.dispatchPrice.returnDeposit > 0 && $_permission('/waybillDetail/paidStatus')">
                                    <span v-if="(searchResult.supplierPayableBill && searchResult.supplierPayableBill.returnDeposit===Constant.PAYMENT_TYPE.PAYMENT)||(searchResult.payableBill && searchResult.payableBill[0] && searchResult.payableBill[0].paymentState === Constant.PAY_STATUS.PAID)" style="color:green;">(已退)</span>
                                    <span style="color:red;" v-else>(未退)</span>
                                </b>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="回单付款:">
                                {{searchResult.dispatch.dispatchPrice.returnAmount}}元
                                <b v-show="searchResult.dispatch.dispatchPrice.returnAmount && $_permission('/waybillDetail/paidStatus')">
                                    <span v-if="isReturnAmountPaid()" style="color:green;">(已付)</span>
                                    <span style="color:red;" v-else>(未付)</span>
                                </b>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="调整金额:">
                                {{searchResult.waybillNotarizePayableDeduct?searchResult.waybillNotarizePayableDeduct.adjustAmount:0}}元
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" v-if="hideInsuranceFee && searchResult.dispatch.dispatchVehicle.vehicleNature==='OUTSOURCE'">
                            <el-form-item label="质量扣款:">
                                {{((searchResult.waybillNotarizePayableDeduct?searchResult.waybillNotarizePayableDeduct.qualityDeductionsAmount:0)|| 0) + (searchResult.dispatch.dispatchPrice.insuranceFee || 0) }}元
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" v-else>
                            <el-form-item label="质量扣款:">
                                {{ searchResult.waybillNotarizePayableDeduct?searchResult.waybillNotarizePayableDeduct.qualityDeductionsAmount:0 }}元
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="质量奖励:">
                                {{searchResult.waybillNotarizePayableDeduct?searchResult.waybillNotarizePayableDeduct.qualityAward:0}} 元
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="压车费:">
                                {{searchResult.waybillNotarizePayableDeduct?searchResult.waybillNotarizePayableDeduct.detentionCharge:0}}元
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="油价补差:">
                                {{searchResult.waybillNotarizePayableDeduct?searchResult.waybillNotarizePayableDeduct.oilPriceSupplement:0}}元
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="其它扣款:">
                                {{searchResult.waybillNotarizePayableDeduct?searchResult.waybillNotarizePayableDeduct.otherDeductionsAmount:0}}元
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" v-if="!(hideInsuranceFee && searchResult.dispatch.dispatchVehicle.vehicleNature==='OUTSOURCE')">
                            <el-form-item label="火灾险服务费:">
                                {{searchResult.dispatch.dispatchPrice.insuranceFee}}元
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" v-show="showHandTransferFee">
                            <el-form-item label="打款手续费:">
                                {{searchResult.dispatch.dispatchPrice.handTransferFee}}元
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="收款人:">
                                {{searchResult.payee}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="收款银行:">
                                {{searchResult.openingBank}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="收款卡号:">
                                {{searchResult.dueBankCardNo}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-button v-if="$_permission('/waybill/synchronizePayee') && hasDataPermission" type="text" size="mini" icon="el-icon-refresh" @click="refreshPayeeInfo(searchResult.code)" style="font-weight: bold;">同步收款人信息</el-button>
                        </el-col>
                        <el-col :span="3">
                            <el-button v-if="$_permission('/waybill/updateWaybillPayee') && hasDataPermission" :disabled="!hasDataPermission" type="text" size="mini" icon="el-icon-edit" @click="updateWaybillPayeeShow(searchResult)" style="font-weight: bold;">修改收款人信息</el-button>
                        </el-col>
                        <el-col :span="3">
                            <el-button v-if="$_permission('/waybill/synchronizeWaybillPayee') && hasDataPermission" :disabled="!hasDataPermission" type="text" size="mini" icon="el-icon-refresh" @click="refreshWaybillPayeeInfo(searchResult.code)" style="font-weight: bold;">同步运单收款人信息</el-button>
                        </el-col>
                    </el-row>
                </el-row>
            </el-row>

            <!--付款信息-->
            <el-row class="card" v-if="$_permission('/waybillDetail/paymentInfo') && hasDataPermission && searchResult.dispatch.dispatchVehicle.vehicleNature!=='SELF_SUPPORT'">
                <el-row>
                    <span class="title">付款信息 :</span>&nbsp;
                </el-row>
                <el-row class="card-body">
                    <el-col :span="4">
                        <el-form-item label="申请状态:" style="margin-bottom: -10px;">
                            <dictionary-select-name v-if="searchResult.supplierPayableBill" option-name="PAYMENT_APPLY_AUDIT_STATUS" :value="searchResult.supplierPayableBill.applyForStatus"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                    <el-form-item label="申请人:" style="margin-bottom: -10px;">{{searchResult.supplierPayableBill?searchResult.supplierPayableBill.applyForPayment:''}}</el-form-item>
                </el-col>
                    <el-col :span="5">
                        <el-form-item label="申请时间:" style="margin-bottom: -10px;">{{searchResult.supplierPayableBill?searchResult.supplierPayableBill.applyForDate:''}}</el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="审核人:" style="margin-bottom: -10px;">{{searchResult.supplierPayableBill?searchResult.supplierPayableBill.verifier:''}}</el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="审核时间:" style="margin-bottom: -10px;">{{searchResult.supplierPayableBill?searchResult.supplierPayableBill.auditTime:''}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row class="card-body">
                    <el-tabs v-model="paymentInfoTabsActiveName">
                        <el-tab-pane label="预付款" name="first" v-if="!!searchResult.dispatch.dispatchPrice.prepaidCardAmount">
                            <el-table :data="searchResult.outInvitePrepaymentList" size="small" class="content-table" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                                <el-table-column label="收款人" min-width="120" prop="payee" show-overflow-tooltip></el-table-column>
                                <el-table-column label="开户行" min-width="120" prop="openingBank" show-overflow-tooltip></el-table-column>
                                <el-table-column label="银行卡号" min-width="180" prop="dueBankCardNo" show-overflow-tooltip></el-table-column>
                                <el-table-column label="金额(元)" min-width="120" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        {{searchResult.dispatch.dispatchPrice.prepaidCardAmount}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="付款人" min-width="120" prop="paymentUser" show-overflow-tooltip></el-table-column>
                                <el-table-column label="付款状态" min-width="120" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="PAY_STATUS" :value="scope.row.payment"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column label="付款时间" min-width="140" prop="paymentTime" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="货到款" name="second" v-if="!!searchResult.dispatch.dispatchPrice.deliveryAmount">
                            <el-table :data="searchResult.outInviteCodList" size="small" class="content-table" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                                <el-table-column label="收款人" min-width="120" prop="payee" show-overflow-tooltip></el-table-column>
                                <el-table-column label="开户行" min-width="120" prop="openingBank" show-overflow-tooltip></el-table-column>
                                <el-table-column label="银行卡号" min-width="180" prop="dueBankCardNo" show-overflow-tooltip></el-table-column>
                                <el-table-column label="金额(元)" min-width="120" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        {{searchResult.dispatch.dispatchPrice.deliveryAmount}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="付款人" min-width="120" prop="paymentUser" show-overflow-tooltip></el-table-column>
                                <el-table-column label="付款状态" min-width="120" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="PAY_STATUS" :value="scope.row.payment"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column label="付款时间" min-width="140" prop="paymentTime" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="尾款" name="third" v-if="searchResult.supplierPaymentRecordList.length>0">
                            <el-table :data="searchResult.supplierPaymentRecordList" size="small" class="content-table" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                                <el-table-column label="收款人" min-width="100" prop="payee" show-overflow-tooltip></el-table-column>
                                <el-table-column label="开户行" min-width="100" prop="openingBank" show-overflow-tooltip></el-table-column>
                                <el-table-column label="银行卡号" min-width="180" prop="dueBankCardNo" show-overflow-tooltip></el-table-column>
                                <el-table-column label="类型" min-width="100" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        {{scope.row.remainAmountRefunds?'尾款':'押金'}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="金额(元)" prop="amountOfMoney" min-width="120" show-overflow-tooltip></el-table-column>
                                <el-table-column label="付款人" min-width="120" prop="confirmer" show-overflow-tooltip></el-table-column>
                                <el-table-column label="付款状态" min-width="100" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="PAY_STATUS" :value="scope.row.pay"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column label="付款时间" min-width="120" prop="acknowledgingTime" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="账单" name="third" v-if="searchResult.payableBill && searchResult.payableBill.length>0">
                            <el-table :data="searchResult.payableBill" size="small" class="content-table" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                                <el-table-column label="账单编号" min-width="140" prop="code" show-overflow-tooltip></el-table-column>
                                <el-table-column label="供应商" min-width="100" prop="supplierName" show-overflow-tooltip></el-table-column>
                                <el-table-column label="承运方" min-width="180" prop="shipperName" show-overflow-tooltip></el-table-column>
                                <el-table-column label="付款状态" min-width="100" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="PAY_STATUS" :value="scope.row.paymentState"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column label="发票号" prop="invoiceNumber" min-width="120" show-overflow-tooltip></el-table-column>
                                <el-table-column label="开户行" min-width="100" prop="openingBank" show-overflow-tooltip></el-table-column>
                                <el-table-column label="收款人" min-width="100" prop="payee" show-overflow-tooltip></el-table-column>
                                <el-table-column label="银行卡号" min-width="180" prop="dueBankCardNo" show-overflow-tooltip></el-table-column>
                                <el-table-column label="付款人" min-width="120" prop="paymentUser" show-overflow-tooltip></el-table-column>
                                <el-table-column label="付款时间" min-width="120" prop="paymentTime" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </el-row>

            <!--其他信息-->
            <el-row class="card">
                <el-row>
                    <span class="title">其他信息 :</span>
                </el-row>
                <el-row class="card-body">
                    <el-tabs v-model="equipmentTabsActiveName">
                        <el-tab-pane label="回单" name="first">
                            <el-row>
                                <el-col :span="6">
                                    <el-button size="mini"   v-permission="'/waybillReceipt/add'"  v-if="hasDataPermission && ( $_permission('/waybillReceipt/billStatusEdit')|| !receiveConfirm.billStatus)"  type="text" icon="el-icon-edit" @click="showEditReceiptList=true" style="font-weight: bold;">回单</el-button>
                                    <span style="margin-right: 50px;"></span>
                                    <el-button v-show="hasDataPermission"   v-permission="'/waybill/addReceiptAttachment'" size="mini" type="text" icon="el-icon-edit" @click="editReceiptAttachment" style="font-weight: bold;">回单附件</el-button>
                                </el-col>
                                <el-col :span="18">
                                    <el-form-item label="回单编号:" style="word-break:break-all;">
                                        {{searchResult.receiptCodes}}
                                        <show-image :url="receiptAttachment" style="display: inline-block!important; margin-left: 25px;"></show-image>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="签收状态:">
                                        <b><dictionary-select-name option-name="EQUIPMENT_SIGN_STATUS" v-model="searchResult.receiptStatus" :class="{green:searchResult.receiptStatus===Constant.EQUIPMENT_SIGN_STATUS.SIGNED,gray:searchResult.receiptStatus===Constant.EQUIPMENT_SIGN_STATUS.WAIT_SIGN}"></dictionary-select-name></b>
                                        <span v-if="searchResult.waybillReceiptLose" style="color: red;">{{searchResult.waybillReceiptLose.receiptLoseFlag?`( 丢失 )`:''}}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="签收人:">
                                        {{searchResult.receiptSignUser}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="签收时间:">
                                        {{searchResult.receiptSignTime}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="收件人:">
                                        {{searchResult.waybillReceiptAddress.receiptRecipient}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="收件电话:">
                                        {{searchResult.waybillReceiptAddress.receiptRecipientPhone}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="收件地址:">
                                        {{searchResult.waybillReceiptAddress.receiptAddress}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="备注:">
                                        <span v-if="searchResult.waybillReceiptLose">{{searchResult.waybillReceiptLose.remark}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="油卡" name="second" v-if="searchResult.dispatch.dispatchPrice.oilCardAmount>0">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="油卡卡号:">
                                        {{searchResult.dispatch.dispatchPrice.oilCardNumber}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="油卡金额:">
                                        {{searchResult.dispatch.dispatchPrice.oilCardAmount}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="油卡余额:">
                                        {{searchResult.dispatch.dispatchPrice.oilCardBalance}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="签收状态:">
                                        <b><dictionary-select-name option-name="EQUIPMENT_SIGN_STATUS" v-model="searchResult.oilCardStatus"
                                                                   :class="{green:searchResult.oilCardStatus===Constant.EQUIPMENT_SIGN_STATUS.SIGNED,
                                                                gray:searchResult.oilCardStatus===Constant.EQUIPMENT_SIGN_STATUS.WAIT_SIGN}"></dictionary-select-name></b>
                                        <span v-if="searchResult.waybillOilCardLose" style="color: red;">{{searchResult.waybillOilCardLose.oilCardLoseFlag?`( 丢失 )`:''}}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="签收人:">
                                        {{searchResult.oilCardSignUser}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="签收时间:">
                                        {{searchResult.oilCardSignTime}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="备注:">
                                        <span v-if="searchResult.waybillOilCardLose">{{searchResult.waybillOilCardLose.remark}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-table style="margin-top:-35px;" :data="oilCardRecharge" size="small" class="content-table" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                                <el-table-column label="充值卡号" min-width="120" prop="cardNo" show-overflow-tooltip></el-table-column>
                                <el-table-column label="油卡类型" min-width="120" prop="supplier" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="OIL_CARD_SUPPLIER" :value="scope.row.supplier"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column label="充值金额" min-width="120" prop="rechargeAmount" show-overflow-tooltip></el-table-column>
                                <el-table-column label="充值状态" min-width="120" prop="status" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="ETC_RECHARGE_TYPE" v-model="scope.row.status"
                                                                :class="{green:scope.row.status===Constant.EQUIPMENT_SIGN_STATUS.SIGNED,
                                                                gray:scope.row.status===Constant.EQUIPMENT_SIGN_STATUS.WAIT_SIGN}"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column label="充值人" min-width="120" prop="rechargeUser" show-overflow-tooltip></el-table-column>
                                <el-table-column label="充值时间" min-width="160" prop="rechargeTime" show-overflow-tooltip></el-table-column>
                                <el-table-column label="备注" min-width="160" prop="remark" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="GPS" name="third" v-if="searchResult.dispatch.dispatchPrice.gpsCode">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="GPS号码:">
                                        {{searchResult.dispatch.dispatchPrice.gpsCode}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="签收状态:">
                                        <b><dictionary-select-name option-name="EQUIPMENT_SIGN_STATUS" v-model="searchResult.gpsStatus"
                                                                   :class="{green:searchResult.gpsStatus===Constant.EQUIPMENT_SIGN_STATUS.SIGNED,
                                                                gray:searchResult.gpsStatus===Constant.EQUIPMENT_SIGN_STATUS.WAIT_SIGN}"></dictionary-select-name></b>
                                        <span v-if="searchResult.waybillGpsLose" style="color:red;">{{searchResult.waybillGpsLose.gpsLoseFlag?`( 丢失 )`:''}}</span>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="签收人:">
                                        {{searchResult.gpsSignUser}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="签收时间:">
                                        {{searchResult.gpsSignTime}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form-item label="备注:">
                                        <span v-if="searchResult.waybillGpsLose">{{searchResult.waybillGpsLose.remark}}</span>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="定点加油" name="four" v-if="searchResult.refuelingRecordList && searchResult.refuelingRecordList.length>0">
                            <el-row class="card-body">
                                <el-table size="small" class="content-table" :data="searchResult.refuelingRecordList" border fit highlight-current-row stripe>
                                    <el-table-column header-align="center" label="加油站" prop="gasStation.name" min-width="200" show-overflow-tooltip></el-table-column>
                                    <el-table-column header-align="center" label="加油时间" prop="createTime" min-width="140"></el-table-column>
                                    <el-table-column header-align="center" label="司机" prop="driver.name" min-width="140"></el-table-column>
                                    <el-table-column header-align="center" label="升数" prop="refuelingVolume" min-width="80" show-overflow-tooltip></el-table-column>
                                    <el-table-column header-align="center" label="油价(元)" prop="receiveUnitPrice" min-width="120"></el-table-column>
                                    <el-table-column header-align="center" label="油费(元)" prop="receiveAmount" min-width="120"></el-table-column>
                                    <el-table-column header-align="center" label="现场拍照" min-width="120">
                                        <template slot-scope="scope">
                                            <show-image :url="scope.row.attachment"></show-image>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane label="定点加油" name="five" v-if="searchResult.refuelingDriverAccountRecordList && searchResult.refuelingDriverAccountRecordList.length>0">
                            <el-row class="card-body">
                                <el-table size="small" class="content-table" :data="searchResult.refuelingDriverAccountRecordList" border fit highlight-current-row stripe>
                                    <el-table-column header-align="center" label="司机姓名" prop="driverName" min-width="140" show-overflow-tooltip></el-table-column>
                                    <el-table-column header-align="center" label="司机电话" prop="driverPhone" min-width="140"></el-table-column>
                                    <el-table-column header-align="center" label="业务单号" prop="businessCode" min-width="140"></el-table-column>
                                    <el-table-column header-align="center" label="业务类型" min-width="80" show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <dictionary-select-name option-name="REFUELING_DRIVER_RECORD_BUSINESS_TYPE" :value="scope.row.businessType"></dictionary-select-name>
                                        </template>
                                    </el-table-column>
                                    <el-table-column header-align="center" label="充值金额(元)" prop="businessAmount" min-width="120"></el-table-column>
                                    <el-table-column header-align="center" label="充值时间" prop="createTime" min-width="140"></el-table-column>
                                </el-table>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </el-row>

            <!--运单跟踪-->
            <el-row class="card">
                <el-row>
                    <span class="title">运单跟踪 :</span>
                </el-row>
                <el-row class="card-body">
                    <el-tabs v-model="exceptionTabsActiveName">
                        <el-tab-pane label="司机上报" name="first">
                            <el-row :gutter="40" v-if="ubnormalData.length>0">
                                <el-col :span="6" v-for="item in ubnormalData" :key="item.index" style="height:450px;overflow-y: auto;">
                                    <el-row >
                                        <el-col>
                                            <show-image-t class1="ubnormalImg" :url="item.attachment"></show-image-t>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col>
                                            <el-form-item style="margin-bottom: 0;">类型：
                                                <dictionary-select-name option-name="EXCEPTION_TYPE" v-model="item.type"></dictionary-select-name>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col><el-form-item style="margin-bottom: 0;">地点：{{item.address}}</el-form-item></el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col><el-form-item style="margin-bottom: 0;">备注：{{item.remark}}</el-form-item></el-col>
                                    </el-row>
                                    <el-row v-if="item.type !== Constant.EXCEPTION_TYPE.TRAFFIC_JAM">
                                        <el-col><el-form-item style="margin-bottom: 0;">时间：{{item.exceptionTime}}</el-form-item></el-col>
                                    </el-row>
                                    <el-row v-else>
                                        <el-row>
                                            <el-col><el-form-item style="margin-bottom: 0;">开始时间：{{item.exceptionStartTime}}</el-form-item></el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col><el-form-item style="margin-bottom: 0;">结束时间：{{item.exceptionEndTime}}</el-form-item></el-col>
                                        </el-row>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <p v-else style="color:#ccc; font-size:12px; height: 91px; line-height: 91px;">暂无数据!</p>
                        </el-tab-pane>
                        <el-tab-pane label="客服跟踪" name="second">
                            <el-table size="small" class="content-table" v-if="searchResult.waybillTrackList && searchResult.waybillTrackList.length>0" :data="searchResult.waybillTrackList" border fit highlight-current-row stripe>
                                <el-table-column header-align="center" prop="trackUser" label="跟踪人" min-width="100"></el-table-column>
                                <el-table-column header-align="center" prop="trackTime" label="跟踪时间" min-width="140"></el-table-column>
                                <el-table-column header-align="center" label="跟踪方式" min-width="120">
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="TRACK_TYPE" v-model="scope.row.trackType"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column header-align="center" label="是否正常" min-width="80">
                                    <template slot-scope="scope">
                                        {{scope.row.normalFlag?'是':'否'}}
                                    </template>
                                </el-table-column>
                                <el-table-column header-align="center" label="异常类型" min-width="120" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="EXCEPTION_TYPE" v-model="scope.row.exceptionType"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column header-align="center" label="异常图片" min-width="100">
                                    <template slot-scope="scope">
                                        <show-image :url="scope.row.exceptionAttachment"></show-image>
                                    </template>
                                </el-table-column>
                                <el-table-column header-align="center" prop="remark" label="备注" min-width="200" show-overflow-tooltip></el-table-column>
                            </el-table>
                            <p v-else style="color:#ccc; font-size:12px; height: 91px; line-height: 91px;">暂无数据!</p>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </el-row>

            <!--日志与备注-->
            <el-row class="card">
                <el-row class="card-body">
                    <el-tabs v-model="remarkTabsActiveName">
                        <el-tab-pane label="运输日志" name="first">
                            <el-table :data="transportLogData" size="small" class="content-table" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                                <el-table-column label="操作人" min-width="80" prop="operationUser" show-overflow-tooltip></el-table-column>
                                <el-table-column label="生成时间" min-width="120" prop="recordTime" show-overflow-tooltip></el-table-column>
                                <el-table-column label="日志类型" min-width="70" prop="type" show-overflow-tooltip></el-table-column>
                                <el-table-column label="日志描述" min-width="200" prop="description" show-overflow-tooltip></el-table-column>
                                <el-table-column label="备注" min-width="280" prop="remark" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="运单备注" name="second">
                            <el-button v-show="hasDataPermission" type="primary" size="mini" icon="el-icon-plus" @click="showAddRemark = true">添加</el-button>
                            <el-table :data="waybillRemarkList" size="small" class="content-table" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                                <el-table-column label="记录人" min-width="120" prop="recorder" show-overflow-tooltip></el-table-column>
                                <el-table-column label="记录时间" min-width="120" prop="recordTime" show-overflow-tooltip></el-table-column>
                                <el-table-column label="备注信息" min-width="280" prop="remark"></el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </el-row>
        </el-form>

        <!-- 运单作废原因 -->
        <el-dialog title="运单作废"  :visible.sync="showWaybillVoid" width="40%" @close="resetWaybillVoidForm">
            <el-form size="small" :model="waybillVoidForm" ref="waybillVoidForm" label-width="120px">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="作废原因：" prop="invalidReason" :rules="{required: true,message:'请选择作废原因！'}">
                            <dictionary-select :excludeOptions="['VEHICLE_ERROR','WAYBILL_ERROR','OTHER']" option-name="WAYBILL_VOID_REASON" v-model="waybillVoidForm.invalidReason" style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="waybillVoidForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showWaybillVoid = false">取 消</el-button>
                <el-button size="small" type="primary" @click="waybillVoidSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑回单 -->
        <el-dialog title="编辑回单"  :visible.sync="showEditReceiptList" width="30%">
            <el-button type="text"   v-permission="'/waybillReceipt/add'" size="mini" icon="el-icon-plus" @click="showAddReceipt=true" style="font-weight: bold;" :disabled="searchResult.waybillReceiptList&&searchResult.waybillReceiptList.length>=20">添加</el-button>
            <el-table size="mini" class="content-table" :data="searchResult.waybillReceiptList" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="回单号" prop="code" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button   v-permission="'/waybillReceipt/delete'" size="mini" icon="el-icon-delete" type="text" style="font-weight: bold;" @click="deleteReceiptSubmit(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="新增回单"  :visible.sync="showAddReceipt" width="30%" append-to-body>
                <el-form size="small" :model="addReceiptForm" ref="addReceiptForm" label-width="100px">
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="回单号：" prop="code" :rules="[{required: true, message:'请输入新添加的回单号！'},validate.receipt]">
                                <el-input v-model="addReceiptForm.code" maxlength="24">
                                    <el-button slot="append" type="primary" size="mini" plain v-if="Common.bill.canSearch(customerCodeTop)" @click="searchMoreBill">查询更多回单</el-button>
                                </el-input>
                                <el-tag
                                    v-for="tag in readyReceipt"
                                    :key="tag"
                                    @close="handleClose(tag)"
                                    closable>
                                    {{tag}}
                                </el-tag>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="showAddReceipt = false">取 消</el-button>
                    <el-button :disabled="addReceiptBtnDisabled" size="small" type="primary" @click="addReceiptSubmit">确 定</el-button>
                </span>
            </el-dialog>
        </el-dialog>

        <!-- 添加运单备注 -->
        <el-dialog title="添加备注信息"  :visible.sync="showAddRemark" width="40%">
            <el-form size="small" :model="addRemarkForm" ref="addRemarkForm" label-width="120px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注信息：" prop="remark" :rules="{required: true, message:'请输入备注信息！'}">
                            <el-input type="textarea" :rows="3" :maxlength="200" placeholder="最多200个字符！" v-model="addRemarkForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAddRemark = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addRemarkFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑磅重附件 -->
        <el-dialog title="磅重附件"  :visible.sync="showEditWeightAttachment" width="35%">
            <el-form size="small" :model="editWeightAttachmentForm" ref="editWeightAttachmentForm" label-width="30%">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="附件：">
                            <upload-image ref="weightAttachment" v-model="editWeightAttachmentForm.weightAttachment" :limit="3"></upload-image>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showEditWeightAttachment = false">取 消</el-button>
                <el-button size="small" type="primary" @click="editWeightAttachmentFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑回单附件 -->
        <el-dialog title="回单附件"  :visible.sync="showEditReceiptAttachment" width="35%">
            <el-form size="small" :model="editReceiptAttachmentForm" ref="editReceiptAttachmentForm" label-width="30%">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="附件：">
                            <upload-image ref="receiptAttachment" v-model="editReceiptAttachmentForm.receiptAttachment" :limit="20"></upload-image>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showEditReceiptAttachment = false">取 消</el-button>
                <el-button size="small" type="primary" @click="editReceiptAttachmentFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 经停站点到车时间 -->
        <el-dialog :title="confirmArrivalForm.title" :visible.sync="showConfirmArrivalTime" width="40%" @close="resetConfirmArrivalForm">
            <el-form size="small" :model="confirmArrivalForm" ref="confirmArrivalForm" label-width="30%">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="司机到车时间：">
                            <el-checkbox v-model="confirmArrivalForm.checked" @change="changeConfirmArrivalTime">&nbsp;&nbsp;&nbsp;&nbsp;(勾选同步至到车时间)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{confirmArrivalForm.dirverArrivalTime}}</el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="到车时间：" prop="confirmArrivalTime" :rules="{required:true,message:'请输入到车时间！'}">
                            <el-date-picker style="display:block; width:100%;" v-model="confirmArrivalForm.confirmArrivalTime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            type="datetime" placeholder="选择日期时间"
                                            :picker-options="pickerOptions"></el-date-picker>
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
        <el-dialog :title="confirmDepartureForm.title" :visible.sync="showConfirmDepartureTime" width="40%" @close="resetConfirmDepartureForm">
            <el-form size="small" :model="confirmDepartureForm" ref="confirmDepartureForm" label-width="30%">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="司机发车时间：">
                            <el-checkbox v-model="confirmDepartureForm.checked" @change="changeConfirmDepartureTime">&nbsp;&nbsp;&nbsp;&nbsp;(勾选同步至发车时间)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{confirmDepartureForm.dirverDepartureTime}}</el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="发车时间：" prop="confirmDepartureTime" :rules="{required:true,message:'请输入发车时间！'}">
                            <el-date-picker style="display:block; width:100%;" v-model="confirmDepartureForm.confirmDepartureTime"
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

        <!--录入修改重量体积-->
        <el-dialog title="添加/修改 体积重量件数" :visible.sync="showBulkfactor" width="30%">
            <el-form size="small" :model="editBulkfactorForm" ref="editBulkfactorForm" label-width="150px">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="体积(方)：" prop="volume" :rules="validate.plus">
                            <el-input v-model="editBulkfactorForm.volume" placeholder="m³"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="重量(公斤)：" prop="weight" :rules="validate.plus">
                            <el-input v-model="editBulkfactorForm.weight" placeholder="kg"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="件数：" prop="number" :rules="validate.plus">
                            <el-input v-model="editBulkfactorForm.number" placeholder="件"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showBulkfactor = false">取 消</el-button>
                <el-button size="small" type="primary" @click="editBulkfactorFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!--修改则一准点-->
        <el-dialog title="修改则一准点/晚点" :visible.sync="showModifyOnTimeFlagAndOverTime" width="30%">
            <el-form size="small" :model="editOnTimeFlagAndOverTimeForm" ref="editOnTimeFlagAndOverTimeForm" label-width="150px">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="准点/晚点：" prop="onTimeFlag" :rules="validate.required('准点/晚点标识', true)">
                            <el-switch v-model="editOnTimeFlagAndOverTimeForm.onTimeFlag" active-color="#13ce66" inactive-color="#ff4949"
                                       active-text="准点" inactive-text="晚点"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="editOnTimeFlagAndOverTimeForm.onTimeFlag === false">
                    <el-col :span="18">
                        <el-form-item label="小时：" prop="overTimeHour" :rules="validate.number">
                            <el-input v-model="editOnTimeFlagAndOverTimeForm.overTimeHour"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="editOnTimeFlagAndOverTimeForm.onTimeFlag === false">
                    <el-col :span="18">
                        <el-form-item label="分钟：" prop="overTimeMin" :rules="validate.number">
                            <el-input v-model="editOnTimeFlagAndOverTimeForm.overTimeMin"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showModifyOnTimeFlagAndOverTime = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyOnTimeFlagAndOverTimeSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!--修改客户准点-->
        <el-dialog title="修改客户准点/晚点" :visible.sync="showModifyCustomerOnTimeFlagAndCustomerOverTime" width="30%">
            <el-form size="small" :model="editCustomerOnTimeFlagAndCustomerOverTimeForm" ref="editCustomerOnTimeFlagAndCustomerOverTimeForm" label-width="150px">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="准点/晚点：" prop="customerOnTimeFlag" :rules="validate.required('准点/晚点标识', true)">
                            <el-switch v-model="editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOnTimeFlag" active-color="#13ce66" inactive-color="#ff4949"
                                       active-text="准点" inactive-text="晚点"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOnTimeFlag === false">
                    <el-col :span="18">
                        <el-form-item label="小时：" prop="customerOverTimeHour" :rules="validate.number">
                            <el-input v-model="editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOverTimeHour"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOnTimeFlag === false">
                    <el-col :span="18">
                        <el-form-item label="分钟：" prop="customerOverTimeMin" :rules="validate.number">
                            <el-input v-model="editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOverTimeMin"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showModifyCustomerOnTimeFlagAndCustomerOverTime = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyCustomerOnTimeFlagAndCustomerOverTimeSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!--修改考核方式-->
        <el-dialog title="修改考核方式" :visible.sync="showModifyEvaluationMode" width="30%">
            <el-form size="small" :model="editEvaluationModeForm" ref="editEvaluationModeForm" label-width="150px">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="考核方式：" prop="evaluationMode" :rules="validate.required('考核方式',true)">
                            <dictionary-select option-name="LINE_EVALUATION_MODE" v-model="editEvaluationModeForm.evaluationMode"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showModifyEvaluationMode = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyEvaluationModeSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增经停站点 -->
        <el-dialog title="新增经停站点" :visible.sync="addStopOverStationVisible" width="70%" @close="resetAddStationForm">
            <el-table size="mini" class="content-table" :data="addStationForm.stopOverStationList" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="站点名称" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.station.name}}</template>
                </el-table-column>
                <el-table-column header-align="center" label="里程" prop="distance" width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.$index===0">--始发--</span>
                        <span v-else>{{scope.row.distance}}公里</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="时效" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.$index===0">--始发--</span>
                        <span v-else>
                            <span v-show="scope.row.travelTimeZeyiHour">{{scope.row.travelTimeZeyiHour}}小时</span>
                            <span v-show="scope.row.travelTimeZeyiMin">{{scope.row.travelTimeZeyiMin}}分钟</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="到达时间" prop="confirmArrivalTime" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="发车时间" prop="confirmDepartureTime" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" width="240" label="操作">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-plus" type="text" style="font-weight: bold;" @click="addStation(scope.$index+1)">新增</el-button>
                        <el-button :disabled="scope.$index===0" icon="el-icon-edit" type="text" style="font-weight: bold;" @click="modifyStation(scope.row,scope.$index)">修改</el-button>
                        <el-button :disabled="scope.$index===0" icon="el-icon-delete" type="text" style="font-weight: bold;" @click="deleteStation(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="新增站点信息"  :visible.sync="stationAddFormVisible" width="40%" append-to-body @close="resetStationAddForm">
                <el-form size="mini" :model="stationAddForm" ref="stationAddForm" label-width="120px">
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="站点名称：" prop="stationCode" :rules="[validate.required('站点名称',true)]">
                                <station-select v-model="stationAddForm.stationCode" :customerCode="customerCodeTop" @change="selectStationAdd" style="display: block;"></station-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="里程：" prop="distance" :rules="[validate.required('里程',true),validate.allNumber]">
                                <el-input v-model="stationAddForm.distance"><template slot="append">公里</template></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="时效(时)：" prop="travelTimeZeyiHour" :rules="[{pattern: /^([1-9]\d*|[0]{1,1})$/, message: '格式不正确'}]">
                                <el-input v-model="stationAddForm.travelTimeZeyiHour"><template slot="append">小时</template></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="时效(分)：" prop="travelTimeZeyiMin" :rules="[validate.minute]">
                                <el-input v-model="stationAddForm.travelTimeZeyiMin"><template slot="append">分钟</template></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="到达时间：" prop="confirmArrivalTime">
                                <el-date-picker style="display:block; width:100%;" v-model="stationAddForm.confirmArrivalTime"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                type="datetime" placeholder="选择日期时间"
                                                :picker-options="pickerOptions"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="发车时间：" prop="actualDepartureTime">
                                <el-date-picker style="display:block; width:100%;" v-model="stationAddForm.confirmDepartureTime"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                type="datetime" placeholder="选择日期时间"
                                                :picker-options="pickerOptions"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="stationAddFormVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="stationAddFormSubmit">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="修改站点信息"  :visible.sync="stationModifyFormVisible" width="40%" append-to-body @close="resetStationModifyForm">
                <el-form size="mini" :model="stationModifyForm" ref="stationModifyForm" label-width="120px">
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="站点名称：" prop="stationCode" :rules="[validate.required('站点名称',true)]">
                                <station-select ref="stationName" v-model="stationModifyForm.stationCode" :customerCode="customerCodeTop" @change="selectStationModify" style="display: block;"></station-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="里程：" prop="distance" :rules="[validate.required('里程',true),validate.allNumber]">
                                <el-input v-model="stationModifyForm.distance"><template slot="append">公里</template></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="时效(时)：" prop="travelTimeZeyiHour" :rules="[{pattern: /^([1-9]\d*|[0]{1,1})$/, message: '格式不正确'}]">
                                <el-input v-model="stationModifyForm.travelTimeZeyiHour"><template slot="append">小时</template></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="时效(分)：" prop="travelTimeZeyiMin" :rules="[validate.minute]">
                                <el-input v-model="stationModifyForm.travelTimeZeyiMin"><template slot="append">分钟</template></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="到达时间：" prop="confirmArrivalTime">
                                <el-date-picker style="display:block; width:100%;" v-model="stationModifyForm.confirmArrivalTime"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                type="datetime" placeholder="选择日期时间"
                                                :picker-options="pickerOptions"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="发车时间：" prop="actualDepartureTime">
                                <el-date-picker style="display:block; width:100%;" v-model="stationModifyForm.confirmDepartureTime"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                type="datetime" placeholder="选择日期时间"
                                                :picker-options="pickerOptions"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="stationModifyFormVisible = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="stationModifyFormSubmit">确 定</el-button>
                </span>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="addStopOverStationVisible = false">取 消</el-button>
                <el-button :disabled="addStationBtnDisabled" size="small" type="primary" @click="addStationFormSubmit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改发车时间 -->
        <el-dialog title="修改发车时间" :visible.sync="editActualDepartureTimeVisible" width="40%" @close="resetActualDepartureTimeForm">
            <el-form size="small" :model="editActualDepartureTimeForm" ref="editActualDepartureTimeForm" label-width="30%">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="发车时间：" prop="actualDepartureTime" :rules="{required:true,message:'请输入发车时间！'}">
                            <el-date-picker style="display:block; width:100%;" v-model="editActualDepartureTimeForm.actualDepartureTime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            type="datetime" placeholder="选择日期时间"
                                            :picker-options="pickerOptions"></el-date-picker>
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
        <el-dialog title="修改到车时间" :visible.sync="editConfirmArrivalTimeVisible" width="40%" @close="resetConfirmArrivalTimeForm">
            <el-form size="small" :model="editConfirmArrivalTimeForm" ref="editConfirmArrivalTimeForm" label-width="30%">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="到达时间：" prop="confirmArrivalTime" :rules="{required:true,message:'请输入到达时间！'}">
                            <el-date-picker style="display:block; width:100%;" v-model="editConfirmArrivalTimeForm.confirmArrivalTime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            type="datetime" placeholder="选择日期时间"
                                            :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="editConfirmArrivalTimeVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confirmArrivalTimeFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改银行卡信息" :visible.sync="editBankCard" width="400px" ref="editBankCard">
            <el-form :model="editBankCardModel"  ref="tm" label-width="100px" size="small"
                     align="center" :rules="editRules">
                <el-row>
                    <el-form-item label="收款人:" width="80" prop="payee">
                        <el-input v-model="editBankCardModel.payee" />
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="收款银行:" width="200" prop="openingBank">
                        <el-input v-model="editBankCardModel.openingBank" />
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="收款卡号:" prop="dueBankCardNo">
                        <el-input v-model="editBankCardModel.dueBankCardNo" />
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="备注:" prop="remark">
                        <el-input v-model="editBankCardModel.remark" />
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editBankCard = false" size="small">取 消</el-button>
                <el-button type="primary" @click="editWaybillPayee"  size="small">确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 外请车轨迹 -->
        <out-invite-trail v-if="dialogOutTrailVisible" :dialogVisible="dialogOutTrailVisible" @close="hideTrail" :code="waybillNo"/>
    </el-container>
</template>
<script>
    import {Http,Api} from 'src/global'
    import {Validate} from 'src/global/validate'
    import {Common} from 'src/global/common'
    import {Constant} from 'src/global/constant'
    import OutInviteTrail from './OutInviteTrail'
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                validate: Validate,//校验
                Constant: Constant,//常量
                Common: Common,//常量
                isWeight: false,
                waybillNo:'',
                //运单详情查询结果
                searchResult: {
                    dispatch:{
                        customer:{},
                        weightAttachment: '',
                        belongOrgCode: '',
                        belongOrg:{},
                        dispatchLine:{
                            stopOverStation:[]
                        },
                        dispatchVehicle:{},
                        dispatchPrice:{}
                    },
                    oilCardRecharge:{
                        status:''
                    },
                    waybillReceiptAddress:{},
                    waybillReceiptList:[],
                    supplierPayableBill:{},
                    outInvitePrepaymentList: [],
                    outInviteCodList: [],
                    supplierPaymentRecordList: []
                },
                receiptArry: [],//回单号
                receiptAttachment: '',//回单附件
                receiveConfirm: {},//应收确认信息
                paymentInfoTabsActiveName: 'third',
                oilCardRecharge:[],//油卡充值记录list
                equipmentTabsActiveName: 'first',
                transportLogData:[],//运输日志
                waybillRemarkList:[],//运单备注list
                remarkTabsActiveName: 'first',
                ubnormalData: [],//司机上报异常list
                exceptionTabsActiveName: 'first',
                stopOverStationData:[],//经停站点list
                //运单作废
                showWaybillVoid: false,
                //打款手续费
                showHandTransferFee: false,
                waybillVoidForm: {
                    invalidReason: '',
                    waybillCode: this.$route.query.code
                },
                //编辑回单
                showEditReceiptList: false,
                dialogOutTrailVisible: false,
                showAddReceipt: false,
                addReceiptForm:{
                    code: '',
                    waybillCode:this.$route.query.code
                },
                addReceiptBtnDisabled: false,//添加回单放重复提交
                //添加备注信息
                showAddRemark: false,
                addRemarkForm: {
                    remark:'',
                    waybillCode: this.$route.query.code
                },
                //磅重附件
                showEditWeightAttachment: false,
                editWeightAttachmentForm:{
                    waybillCode: this.$route.query.code,
                    weightAttachment:''
                },
                //回单附件
                showEditReceiptAttachment: false,
                editReceiptAttachmentForm:{
                    code: this.$route.query.code,
                    receiptAttachment:''
                },
                //经停站点--到车时间
                showConfirmArrivalTime: false,
                confirmArrivalForm:{
                    title:'编辑到车时间',
                    code: this.$route.query.code,
                    stationId:'',
                    checked: false,
                    dirverArrivalTime:'',
                    confirmArrivalTime:''
                },
                //经停站点--发车时间
                showConfirmDepartureTime: false,
                confirmDepartureForm:{
                    title:'编辑发车时间',
                    code: this.$route.query.code,
                    stationId:'',
                    checked: false,
                    dirverDepartureTime:'',
                    confirmDepartureTime:''
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                //录入修改重量体积
                showBulkfactor: false,
                bulkfactorForm:{//回写
                    volume: '',
                    weight: '',
                    number: ''
                },
                editBulkfactorForm:{//录入
                    volume: '',
                    weight: '',
                    number: '',
                    code:this.$route.query.code
                },
                //修改考核方式
                showModifyEvaluationMode: false,
                editEvaluationModeForm: {
                    evaluationMode: '',
                    code:this.$route.query.code
                },
                //修改则一准点
                showModifyOnTimeFlagAndOverTime: false,
                editOnTimeFlagAndOverTimeForm: {
                    onTimeFlag: '',
                    overTimeHour: '',
                    overTimeMin: '',
                    code:this.$route.query.code
                },
                //修改客户准点
                showModifyCustomerOnTimeFlagAndCustomerOverTime: false,
                editCustomerOnTimeFlagAndCustomerOverTimeForm: {
                    customerOnTimeFlag: '',
                    customerOverTimeHour: '',
                    customerOverTimeMin: '',
                    code:this.$route.query.code
                },
                //新增经停站点
                addStopOverStationVisible: false,
                stations: [],
                customerCodeTop: '',
                stationAddFormVisible: false,
                stationAddForm: {
                    index: '',
                    station: {},
                    deletable: true,
                    stationCode: '',
                    distance: '',
                    confirmArrivalTime: '',
                    confirmDepartureTime: '',
                    travelTimeZeyiHour: '',
                    travelTimeZeyiMin: ''
                },
                stationModifyFormVisible: false,
                stationModifyForm: {
                    station: {},
                    stationCode: '',
                    distance: '',
                    confirmArrivalTime: '',
                    confirmDepartureTime: '',
                    travelTimeZeyiHour: '',
                    travelTimeZeyiMin: ''
                },
                addStationForm:{
                    waybillCode: this.$route.query.code,
                    stopOverStationList: []
                },
                addStationBtnDisabled: false,
                //修改发车时间
                editActualDepartureTimeVisible: false,
                editActualDepartureTimeForm:{
                    code: this.$route.query.code,
                    actualDepartureTime:''
                },
                //修改到车时间
                editConfirmArrivalTimeVisible: false,
                editConfirmArrivalTimeForm:{
                    code: this.$route.query.code,
                    confirmArrivalTime:''
                },
                //修改银行卡
                editBankCard:false,
                editBankCardModel:{
                    code     : '',
                    remark:'',
                    payee           : '',
                    openingBank     : '',
                    dueBankCardNo   : '',
                },
                readyReceipt:[], // 可查询回单的备选列表
                editRules: {
                    payee: [
                        {required: true, message: '请输入收款人'},
                    ],
                    openingBank: [
                        {required: true, message: '请输入收款银行'},
                    ],
                    dueBankCardNo: [
                        {required: true, message: '请输入收款卡号'},
                    ],
                    remark: [
                        {required: true, message: '请输入备注'},
                    ]
                },
            }
        },
        created() {
            this.getWayBillDetail(this.$route.query.code);
        },
        components:{
            OutInviteTrail
        },
        computed:{
            ...mapGetters([
                'user'
            ]),
            hasDataPermission: function (){//是否有当前页面的权限
                return _.indexOf(this.user.orgCodes, this.searchResult.dispatch.belongOrgCode) >= 0;
            },
            //是否显示运单作废按钮
            waybillVoidBtnShow: function(){
                return this.hasDataPermission && this.$_permission('/waybill/invalid') && (this.searchResult.status===Constant.WAY_BILL_STATUS.IN_TRANSIT || this.searchResult.status===Constant.WAY_BILL_STATUS.IN || this.$_permission('/waybill/signed_invalid'))
            },
            //是否隐藏火灾险服务费
            hideInsuranceFee: function (){
                return this.$_permission('/waybillDetail/hideInsuranceFee') && !this.user.admin;
            },
            marginTop: function () { //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "15vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "8vh";
                }
            }
        },
        methods: {
            isReturnAmountPaid(){//回单付款是否已付
                return (this.searchResult.supplierPayableBill && this.searchResult.supplierPayableBill.remainAmountRefunds) || (this.searchResult.payableBill && this.searchResult.payableBill[0] && this.searchResult.payableBill[0].paymentState === Constant.PAY_STATUS.PAID);
            },
            //获取运单详情
            getWayBillDetail(code){
                let vm = this;
                Http.get(Api.waybill.queryByCode,{params:{'code':code}},result =>{
                    _.merge(vm.searchResult,result.result);
                    //回单号
                    vm.searchResult.waybillReceiptList = result.result.waybillReceiptList;
                    let Arry =[];
                    result.result.waybillReceiptList.forEach((item)=>{
                        Arry.push(item.code);
                    });
                    vm.receiptArry = Arry;
                    //回单附件list
                    vm.receiptAttachment = result.result.receiptAttachment;
                    //应收确认信息
                    vm.receiveConfirm = result.result.receiveConfirm;
                    //运单日志list
                    vm.transportLogData = result.result.waybillRecordList;
                    //运单备注list
                    vm.waybillRemarkList = result.result.waybillRemarkList;
                    //司机上报异常list
                    vm.ubnormalData = result.result.waybillExceptionList;
                    //油卡充值记录list
                    vm.oilCardRecharge = result.result.oilCardRecharge;
                    //经停站点list，不含始发站和终点站
                    vm.searchResult.dispatch.dispatchLine.stopOverStation = result.result.dispatch.dispatchLine.stopOverStation;
                    if(result.result.dispatch && result.result.dispatch.dispatchLine.stopOverStation.length>2){
                        vm.stopOverStationData = _.cloneDeep(result.result.dispatch.dispatchLine.stopOverStation).splice(1,result.result.dispatch.dispatchLine.stopOverStation.length-2);
                    }else{
                        vm.stopOverStationData = [];
                    }
                    if(result.result.dispatch.dispatchVehicle.vehicleNature === 'OUT_INVITE'){
                        vm.showHandTransferFee = true;
                    }
                    //所有站点
                    vm.stations = _.cloneDeep(result.result.dispatch.dispatchLine.stopOverStation);
                    //回写体积重量弹框里面的信息
                    vm.bulkfactorForm.volume = result.result.volume;
                    vm.bulkfactorForm.weight = result.result.weight;
                    vm.bulkfactorForm.number = result.result.number;
                    //根据查出的客户信息获取顶级客户--用于新增经停站点
                    Http.get(Api.customer.topLevelCustomer, {params: {'code': vm.searchResult.dispatch.customer.code}}, result => {
                        vm.customerCodeTop = result.result.code;
                    });
                    //是否是计重
                    if(result.result.dispatch.dispatchPrice.receivePriceType == "WEIGHT"){
                        vm.isWeight = true;
                        //磅重附件list
                        vm.searchResult.dispatch.weightAttachment = result.result.dispatch.weightAttachment;
                    }
                    //回显时效以及准点晚点,考核方式
                    vm.editOnTimeFlagAndOverTimeForm.onTimeFlag = result.result.onTimeFlag;
                    vm.editOnTimeFlagAndOverTimeForm.overTimeHour = result.result.overTimeMin ? Math.floor(parseFloat(result.result.overTimeMin) / 60) : '';
                    vm.editOnTimeFlagAndOverTimeForm.overTimeMin = result.result.overTimeMin ? (parseFloat(result.result.overTimeMin) % 60) : '';
                    vm.editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOnTimeFlag = result.result.dispatch.customerOnTimeFlag;
                    vm.editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOverTimeHour = result.result.dispatch.customerOverTimeMin ? Math.floor(parseFloat(result.result.overTimeMin) / 60) : '';
                    vm.editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOverTimeMin = result.result.dispatch.customerOverTimeMin ? (parseFloat(result.result.overTimeMin) % 60) : '';
                    vm.editEvaluationModeForm.evaluationMode = result.result.dispatch.dispatchLine.evaluationMode;
                })
            },

            //运行轨迹
            showRunningTrack(){
                let vm = this;
                vm.$router.push({ path: '/operation/runningTrack',query: {vehicleNo: vm.searchResult.dispatch.dispatchVehicle.vehicleLicenseNum,beginTime:vm.searchResult.actualDepartureTime,endTime:vm.searchResult.confirmArrivalTime || vm.Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date())}});
            },

            //外请运行轨迹
            showOutRunningTrack(){
                let vm = this;
                vm.$router.push({ path: '/operation/outRunningTrack',query: {driverId:vm.searchResult.dispatch.dispatchVehicle.driver.id, vehicleNo:vm.searchResult.dispatch.dispatchVehicle.vehicleLicenseNum,beginTime:vm.searchResult.actualDepartureTime,endTime:vm.searchResult.confirmArrivalTime || vm.Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date())}});
            },

            hideTrail(){
                this.dialogOutTrailVisible = false;
            },

            //运单作废
            waybillVoid(){
                let vm = this;
                vm.showWaybillVoid = true;
            },
            waybillVoidSubmit(){
                let vm = this;
                vm.$refs.waybillVoidForm.validate((valid)=>{
                    if(valid){
                        vm.$confirm('确定作废运单吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            Http.post(Api.waybillInvalid.add, vm.waybillVoidForm, result => {
                                vm.$message.success('运单作废申请已提交！');
                                vm.showWaybillVoid = false;
                            });
                        })
                    }
                });
            },
            resetWaybillVoidForm(){
                let vm = this;
                vm.waybillVoidForm.invalidReason = '';
            },

            //编辑回单
            addReceiptSubmit(){
                let vm = this;
                vm.addReceiptBtnDisabled = true;
                let rule = Common.bill.canSearch(vm.searchResult.dispatch.customer.topCode);
                if(vm.readyReceipt.length>0&&rule){
                    let str = Common.util.clean(vm.readyReceipt).join(',')
                    let obj = _.clone(vm.addReceiptForm)
                    obj.code = str
                    vm.addReceiptHTTP(obj)
                    return
                }
                vm.$refs.addReceiptForm.validate((valid)=>{
                    if(valid){
                        for(let i=0; i<vm.receiptArry.length; i++){
                            if(vm.addReceiptForm.code == vm.receiptArry[i]){
                                vm.addReceiptBtnDisabled = false;
                                return vm.$message.error('请勿重复添加回单！');
                            }
                        }
                        this.addReceiptHTTP(vm.addReceiptForm)
                    }else{
                        vm.addReceiptBtnDisabled = false;
                    }
                })
            },
            // 增加回单
            addReceiptHTTP(data){
                let vm = this;
                Http.post(Api.waybillReceipt.add,data,result =>{
                            vm.$message.success('回单添加成功！');
                            vm.getWayBillDetail(vm.$route.query.code);
                            vm.showAddReceipt = false;
                            vm.addReceiptBtnDisabled = false;
                            vm.addReceiptForm.code = '' // 成功之后清空回单
                },reson=>{
                    vm.addReceiptBtnDisabled = false;
                });
            },
            deleteReceiptSubmit(row){//删除回单
                let vm = this;
                vm.$confirm('删除本条数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.waybillReceipt.delete,row,result =>{
                        vm.$message.success('回单删除成功！');
                        vm.getWayBillDetail(vm.$route.query.code);
                    });
                })
            },

            //运单备注
            addRemarkFormSubmit(){
                let vm = this;
                vm.$refs.addRemarkForm.validate((valid)=>{
                    if(valid){
                        Http.post(Api.waybillRemark.add,vm.addRemarkForm,result =>{
                            vm.$message.success('运单备注添加成功！');
                            vm.getWayBillDetail(vm.$route.query.code);
                            vm.addRemarkForm.remark = '';
                            vm.showAddRemark = false;
                        });
                    }
                })
            },

            //编辑磅重附件
            editWeightAttachment(){
                let vm=this;
                setTimeout(()=>{
                    vm.$refs.weightAttachment.clearFileList();
                    if(vm.searchResult.dispatch.weightAttachment){
                        vm.$refs.weightAttachment.setFileList(vm.searchResult.dispatch.weightAttachment.split(","));
                    }
                }, 0)
                vm.showEditWeightAttachment = true;
            },
            editWeightAttachmentFormSubmit(){//编辑磅重附件
                let vm = this;
                vm.editWeightAttachmentForm.weightAttachment = vm.$refs.weightAttachment.getFileList().join(",");//图片路径
                Http.post(Api.dispatch.modifyWeightAttachment, vm.editWeightAttachmentForm, result => {
                    vm.$message.success('附件编辑成功！');
                    vm.getWayBillDetail(vm.$route.query.code);
                    vm.showEditWeightAttachment = false;
                })
            },

            //编辑回单附件
            editReceiptAttachment(){
                let vm=this;
                setTimeout(()=>{
                    vm.$refs.receiptAttachment.clearFileList();
                    if(vm.receiptAttachment){
                        vm.$refs.receiptAttachment.setFileList(vm.receiptAttachment.split(","));
                    }
                }, 0)
                vm.showEditReceiptAttachment = true;
            },
            editReceiptAttachmentFormSubmit(){//编辑回单附件
                let vm = this;
                vm.editReceiptAttachmentForm.receiptAttachment = vm.$refs.receiptAttachment.getFileList().join(",");//图片路径
                Http.post(Api.waybill.addReceiptAttachment, vm.editReceiptAttachmentForm, result => {
                    vm.$message.success('附件编辑成功！');
                    vm.getWayBillDetail(vm.$route.query.code);
                    vm.showEditReceiptAttachment = false;
                })
            },

            //经停站点--添加/编辑到车时间
            showAddArrivalTimeDialog(item){
                this.confirmArrivalForm.title = `编辑到车时间 【${item.station.name}】`;
                this.confirmArrivalForm.stationId = item.id;
                this.confirmArrivalForm.confirmArrivalTime = item.confirmArrivalTime || '';
                this.confirmArrivalForm.dirverArrivalTime = item.actualArrivalTime;
                this.showConfirmArrivalTime = true;
            },
            changeConfirmArrivalTime(val){
                if(val && this.confirmArrivalForm.dirverArrivalTime){
                    this.confirmArrivalForm.confirmArrivalTime = this.confirmArrivalForm.dirverArrivalTime;
                }
            },
            confirmArrivalFormSubmit(){
                let vm = this;
                vm.$refs.confirmArrivalForm.validate((valid) => {
                    if(valid){
                        if(new Date(vm.confirmArrivalForm.confirmArrivalTime).getTime()>new Date().getTime()){
                            vm.$message.warning('站点确认到车时间不能大于当前时间！');
                            vm.confirmArrivalForm.confirmArrivalTime = '';
                            return;
                        }
                        let url = '';
                        if(vm.$_permission('/waybill/customerConfirmArriveStation')){
                            url = Api.waybill.customerConfirmArriveStation;
                        }
                        if(vm.$_permission('/waybill/confirmArriveStation')){
                            url = Api.waybill.confirmArriveStation;
                        }
                        Http.post(url, vm.confirmArrivalForm, result => {
                            vm.showConfirmArrivalTime = false;
                            vm.$message.success("到车时间编辑成功！");
                            vm.getWayBillDetail(vm.$route.query.code);
                        })
                    }
                });
            },
            resetConfirmArrivalForm(){
                this.confirmArrivalForm = {
                    title:'编辑到车时间',
                    code: this.$route.query.code,
                    stationCode:'',
                    checked: false,
                    dirverArrivalTime:'',
                    confirmArrivalTime:''
                };
            },

            //经停站点--添加发车时间
            showAddDepartureTimeDialog(item){
                this.confirmDepartureForm.title = `编辑发车时间 【${item.station.name}】`;
                this.confirmDepartureForm.stationId = item.id;
                this.confirmDepartureForm.confirmDepartureTime = item.confirmDepartureTime;
                this.confirmDepartureForm.dirverDepartureTime = item.actualDepartureTime;
                this.showConfirmDepartureTime = true;
            },
            changeConfirmDepartureTime(val){
                if(val && this.confirmDepartureForm.dirverDepartureTime){
                    this.confirmDepartureForm.confirmDepartureTime = this.confirmDepartureForm.dirverDepartureTime;
                }
            },
            confirmDepartureFormSubmit(){
                let vm = this;
                vm.$refs.confirmDepartureForm.validate((valid) => {
                    if(valid){
                        if(new Date(vm.confirmDepartureForm.confirmDepartureTime).getTime()>new Date().getTime()){
                            vm.$message.warning('站点确认发车时间不能大于当前时间！');
                            vm.confirmDepartureForm.confirmDepartureTime = '';
                            return;
                        }
                        let url = '';
                        if(vm.$_permission('/waybill/customerConfirmDepartureStation')){
                            url = Api.waybill.customerConfirmDepartureStation;
                        }
                        if(vm.$_permission('/waybill/confirmDepartureStation')){
                            url = Api.waybill.confirmDepartureStation;
                        }
                        Http.post(url, vm.confirmDepartureForm, result => {
                            vm.showConfirmDepartureTime = false;
                            vm.$message.success("发车时间编辑成功！");
                            vm.getWayBillDetail(vm.$route.query.code);
                        })
                    }
                });
            },
            resetConfirmDepartureForm(){
                this.confirmDepartureForm = {
                    title:'编辑发车时间',
                    code: this.$route.query.code,
                    stationCode:'',
                    checked: false,
                    dirverDepartureTime:'',
                    confirmDepartureTime:''
                };
            },

            //添加体积重量
            addBulkfactor(){
                let vm = this;
                vm.showBulkfactor = true;
                vm.editBulkfactorForm.volume = vm.bulkfactorForm.volume;
                vm.editBulkfactorForm.weight = vm.bulkfactorForm.weight;
                vm.editBulkfactorForm.number = vm.bulkfactorForm.number;
            },
            //修改考核方式
            modifyEvaluationModeSubmit() {
                let vm = this;
                vm.$refs.editEvaluationModeForm.validate((valid)=>{
                    if(valid){
                        Http.post(Api.waybill.modifyEvaluationMode,vm.editEvaluationModeForm, result => {
                            vm.$message.success('修改考核方式成功！');
                            vm.getWayBillDetail(vm.$route.query.code);
                            vm.showModifyEvaluationMode = false;
                        },err => {
                            vm.$message.error('修改考核方式失败！' + err.message);
                        });
                    }
                });
            },
            modifyOnTimeFlagAndOverTimeSubmit() {
                let vm = this;
                vm.$refs.editOnTimeFlagAndOverTimeForm.validate((valid)=>{
                    if(valid){
                        if (!vm.editOnTimeFlagAndOverTimeForm.onTimeFlag && (vm.editOnTimeFlagAndOverTimeForm.overTimeHour.toString() == '' || vm.editOnTimeFlagAndOverTimeForm.overTimeMin.toString() == '')) {
                            vm.$message.error('晚点则必填小时和分钟！');
                            return;
                        }
                        if (!vm.editOnTimeFlagAndOverTimeForm.onTimeFlag && (vm.editOnTimeFlagAndOverTimeForm.overTimeHour == 0) && (vm.editOnTimeFlagAndOverTimeForm.overTimeMin == 0)) {
                            vm.$message.error('晚点小时分钟不可同时为0！');
                            return;
                        }
                        Http.post(Api.waybill.modifyOnTimeFlagAndOverTime,vm.editOnTimeFlagAndOverTimeForm, result => {
                            vm.$message.success('修改则一准点/晚点成功！');
                            vm.getWayBillDetail(vm.$route.query.code);
                            vm.showModifyOnTimeFlagAndOverTime = false;
                        },err => {
                            vm.$message.error('修改则一准点/晚点失败！' + err.message);
                        });
                    }
                });
            },
            modifyCustomerOnTimeFlagAndCustomerOverTimeSubmit() {
                let vm = this;
                vm.$refs.editCustomerOnTimeFlagAndCustomerOverTimeForm.validate((valid)=>{
                    if(valid){
                        if (!vm.editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOnTimeFlag && (vm.editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOverTimeHour.toString() == '' || vm.editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOverTimeMin.toString() == '')) {
                            vm.$message.error('晚点则必填小时和分钟！');
                            return;
                        }
                        if (!vm.editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOnTimeFlag && (vm.editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOverTimeHour == 0) && (vm.editCustomerOnTimeFlagAndCustomerOverTimeForm.customerOverTimeMin == 0)) {
                            vm.$message.error('晚点小时分钟不可同时为0！');
                            return;
                        }
                        Http.post(Api.waybill.modifyCustomerOnTimeFlagAndCustomerOverTime,vm.editCustomerOnTimeFlagAndCustomerOverTimeForm, result => {
                            vm.$message.success('修改客户准点/晚点成功！');
                            vm.getWayBillDetail(vm.$route.query.code);
                            vm.showModifyCustomerOnTimeFlagAndCustomerOverTime = false;
                        },err => {
                            vm.$message.error('修改客户准点/晚点失败！' + err.message);
                        });
                    }
                });
            },
            editBulkfactorFormSubmit(){
                let vm = this;
                vm.$refs.editBulkfactorForm.validate((valid)=>{
                    if(valid){
                        if(vm.editBulkfactorForm.volume > 250 || vm.editBulkfactorForm.weight > 100000){
                            return vm.$message.error('请输入正确的体积/重量！');
                        }
                        if (vm.editBulkfactorForm.number && vm.editBulkfactorForm.number > 999999) {
                            return vm.$message.error('请输入正确的件数！');
                        }
                        if(vm.editBulkfactorForm.volume ||  vm.editBulkfactorForm.weight){
                            Http.post(Api.waybill.modifyWeight,vm.editBulkfactorForm,result =>{
                                vm.$message.success('体积/重量信息编辑成功！');
                                vm.getWayBillDetail(vm.$route.query.code);
                                vm.showBulkfactor = false;
                            });
                        }else{
                            vm.$message.error('请输入重量/体积后提交！');
                        }
                    }
                });
            },
            updateWaybillPayeeShow(waybill){
                let _this = this;
                _this.editBankCardModel = {
                    code            : waybill.code,
                    remark          : waybill.remark,
                    payee           : waybill.payee,
                    openingBank     : waybill.openingBank,
                    dueBankCardNo   : waybill.dueBankCardNo
                };
                _this.editBankCard = true;
            },
            //修改运单收款人
                editWaybillPayee(){
                let _this = this;
                this.$confirm('是否确认修改收款人信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$refs["tm"].validate((valid) => {
                        if(valid){
                            Http.post(Api.waybill.modifyPayee, _this.editBankCardModel, result => {
                                _this.$message.success('收款人信息修改成功！');
                                _this.getWayBillDetail(_this.editBankCardModel.code);
                                _this.editBankCard = false;
                            })
                        }else {
                            _this.$message('存在未填项');
                        }

                    })
                })
            },
            //同步运单收款人信息
            refreshWaybillPayeeInfo(code){
                this.$confirm('是否确认同步运单收款人信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.waybill.synchronizeWaybillPayee, {'code':code}, result => {
                        this.$message.success('收款人信息同步成功！');
                        this.getWayBillDetail(this.$route.query.code);
                    })
                })
            },

            //同步收款人信息
            refreshPayeeInfo(code){
                this.$confirm('是否确认同步最新收款人信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.waybill.synchronizePayee, {'code':code}, result => {
                        this.$message.success('收款人信息同步成功！');
                        this.getWayBillDetail(this.$route.query.code);
                    })
                })
            },

            //新增经停站点
            showAddStation(){
                let vm = this;
                vm.addStationForm.stopOverStationList = _.cloneDeep(vm.stations);
                vm.addStopOverStationVisible = true;
            },
            addStation(index){
                let vm = this;
                vm.stationAddForm.index = index;
                vm.stationAddFormVisible = true;
            },
            selectStationAdd(station){
                let vm = this;
                if(!_.isNil(station)){
                    vm.stationAddForm.station = station;
                }
            },
            stationAddFormSubmit(){
                let vm = this;
                if(!vm.stationAddForm.travelTimeZeyiHour&&!vm.stationAddForm.travelTimeZeyiMin){
                    return vm.$message.warning('请完善时效信息！');
                }
                vm.$refs.stationAddForm.validate((valid)=>{
                    if(valid){
                        vm.addStationForm.stopOverStationList.splice(vm.stationAddForm.index,0,vm.stationAddForm);
                        vm.stationAddFormVisible = false;
                    }
                })
            },
            resetStationAddForm(){
                let vm = this;
                vm.stationAddForm = {
                    index: '',
                    station: {},
                    deletable: true,
                    stationCode: '',
                    distance: '',
                    confirmArrivalTime: '',
                    confirmDepartureTime: '',
                    travelTimeZeyiHour: '',
                    travelTimeZeyiMin: ''
                }
            },
            modifyStation(row,index){
                let vm = this;
                vm.stationModifyForm.index = index;
                _.merge(vm.stationModifyForm,row);
                vm.$nextTick(()=>{
                    vm.$refs.stationName.setCurrentStation(vm.stationModifyForm.station);
                })
                vm.stationModifyFormVisible = true;
            },
            selectStationModify(station){
                let vm = this;
                if(!_.isNil(station)){
                    vm.stationModifyForm.station = station;
                }
            },
            stationModifyFormSubmit(){
                let vm = this;
                if(!vm.stationModifyForm.travelTimeZeyiHour&&!vm.stationModifyForm.travelTimeZeyiMin){
                    return vm.$message.warning('请完善时效信息！');
                }
                vm.$refs.stationModifyForm.validate((valid)=>{
                    if(valid){
                        //_.merge(vm.addStationForm.stopOverStationList[vm.stationModifyForm.index],vm.stationModifyForm);
                        vm.$set(vm.addStationForm.stopOverStationList[vm.stationModifyForm.index],'station',vm.stationModifyForm.station)
                        vm.$set(vm.addStationForm.stopOverStationList[vm.stationModifyForm.index],'stationCode',vm.stationModifyForm.stationCode)
                        vm.$set(vm.addStationForm.stopOverStationList[vm.stationModifyForm.index],'distance',vm.stationModifyForm.distance)
                        vm.$set(vm.addStationForm.stopOverStationList[vm.stationModifyForm.index],'confirmArrivalTime',vm.stationModifyForm.confirmArrivalTime)
                        vm.$set(vm.addStationForm.stopOverStationList[vm.stationModifyForm.index],'confirmDepartureTime',vm.stationModifyForm.confirmDepartureTime)
                        vm.$set(vm.addStationForm.stopOverStationList[vm.stationModifyForm.index],'travelTimeZeyiHour',vm.stationModifyForm.travelTimeZeyiHour)
                        vm.$set(vm.addStationForm.stopOverStationList[vm.stationModifyForm.index],'travelTimeZeyiMin',vm.stationModifyForm.travelTimeZeyiMin)
                        vm.stationModifyFormVisible = false;
                    }
                })
            },
            resetStationModifyForm(){
                let vm = this;
                vm.stationModifyForm = {
                    index: '',
                    station: {},
                    stationCode: '',
                    distance: '',
                    confirmArrivalTime: '',
                    confirmDepartureTime: '',
                    travelTimeZeyiHour: '',
                    travelTimeZeyiMin: ''
                }
            },
            deleteStation(index){
                let vm = this;
                vm.addStationForm.stopOverStationList.splice(index, 1);
            },
            addStationFormSubmit(){
                let vm = this;
                if(vm.addStationForm.stopOverStationList.length<2){
                    vm.$message.warning('目的站点不能为空！');
                    return;
                }
                vm.addStationBtnDisabled = true;
                if(vm.hasDataPermission && vm.$_permission('/waybill/updateStopOverStation')){
                    Http.post(Api.waybill.updateStopOverStation,vm.addStationForm,result =>{
                        vm.$message.success('经停站点信息已修改！');
                        vm.getWayBillDetail(vm.$route.query.code);
                        vm.addStopOverStationVisible = false;
                        vm.addStationBtnDisabled = false;
                    },()=>{
                        vm.addStationBtnDisabled = false;
                    });
                }else{
                    Http.post(Api.waybill.addStopOverStationNew,vm.addStationForm,result =>{
                        vm.$message.success('经停站点信息已修改！');
                        vm.getWayBillDetail(vm.$route.query.code);
                        vm.addStopOverStationVisible = false;
                        vm.addStationBtnDisabled = false;
                    },()=>{
                        vm.addStationBtnDisabled = false;
                    });
                }
            },
            resetAddStationForm(){
                this.addStationForm = {
                    waybillCode: this.$route.query.code,
                    stopOverStationList: []
                }
            },

            //修改发车时间
            editActualDepartureTime(time){
                this.editActualDepartureTimeVisible = true;
                this.editActualDepartureTimeForm.actualDepartureTime = time;
            },
            actualDepartureTimeFormSubmit(){
                let vm = this;
                vm.$refs.editActualDepartureTimeForm.validate((valid) => {
                    if(valid){
                        if(new Date(vm.editActualDepartureTimeForm.actualDepartureTime).getTime()>new Date().getTime()){
                            vm.$message.warning('发车时间不能大于当前时间！');
                            vm.editActualDepartureTimeForm.actualDepartureTime = '';
                            return;
                        }
                        let url = '';
                        if(vm.$_permission('/waybill/customerModifyDepartureTime')){
                            url = Api.waybill.customerModifyDepartureTime;
                        }
                        if(vm.$_permission('/waybill/modifyDepartureTime')){
                            url = Api.waybill.modifyDepartureTime;
                        }
                        Http.post(url, vm.editActualDepartureTimeForm, result => {
                            vm.editActualDepartureTimeVisible = false;
                            vm.$message.success("发车时间编辑成功！");
                            vm.getWayBillDetail(vm.$route.query.code);
                        })
                    }
                });
            },
            resetActualDepartureTimeForm(){
                this.editActualDepartureTimeForm = {
                    code: this.$route.query.code,
                    actualDepartureTime:''
                }
            },
            //修改到车时间
            editConfirmArrivalTime(time){
                this.editConfirmArrivalTimeVisible = true;
                this.editConfirmArrivalTimeForm.confirmArrivalTime = time;
            },
            confirmArrivalTimeFormSubmit(){
                let vm = this;
                vm.$refs.editConfirmArrivalTimeForm.validate((valid) => {
                    if(valid){
                        if(new Date(vm.editConfirmArrivalTimeForm.confirmArrivalTime).getTime()>new Date().getTime()){
                            vm.$message.warning('到达时间不能大于当前时间！');
                            vm.editConfirmArrivalTimeForm.confirmArrivalTime = '';
                            return;
                        }
                        let url = '';
                        if(vm.$_permission('/waybill/customerModifyArrivalTime')){
                            url = Api.waybill.customerModifyArrivalTime;
                        }
                        if(vm.$_permission('/waybill/modifyArrivalTime')){
                            url = Api.waybill.modifyArrivalTime;
                        }
                        Http.post(url, vm.editConfirmArrivalTimeForm, result => {
                            vm.editConfirmArrivalTimeVisible = false;
                            vm.$message.success("到达时间编辑成功！");
                            vm.getWayBillDetail(vm.$route.query.code);
                        })
                    }
                });
            },
            resetConfirmArrivalTimeForm(){
                this.editConfirmArrivalTimeForm = {
                    code: this.$route.query.code,
                    confirmArrivalTime:''
                }
            },
            // 查询更多回单
            async searchMoreBill(){
                let vm = this;
                vm.$refs.addReceiptForm.validate(async (valid)=>{
                    if(valid){
                        for(let i=0; i<vm.receiptArry.length; i++){
                            if(vm.addReceiptForm.code == vm.receiptArry[i]){
                                return vm.$message.error('请勿重复添加回单！');
                            }
                        }
                        vm.readyReceipt.push(vm.addReceiptForm.code)
                        await Common.bill.searchBill(vm.addReceiptForm.code,vm.$route.query.code).then((res) => {
                            res.map((el) => {
                                vm.receiptArry.includes(el)?'':vm.readyReceipt.push(el)
                                vm.readyReceipt = Common.util.clean(vm.readyReceipt)
                            })
                        });
                        vm.$refs.addReceiptForm.resetFields()
                        // moreReceipt = Common.util.clean(moreReceipt).join(',')
                        // let obj = _.clone(vm.addReceiptForm)
                        // obj.code = moreReceipt
                        // this.addReceiptHTTP(obj)
                    }
                })
            },
            handleClose(tag){
                this.readyReceipt.splice(this.readyReceipt.indexOf(tag), 1);
            },
        },
        watch:{
            showAddReceipt(newVal,oldVal){
                if(newVal) return
                this.readyReceipt = [];
                this.$refs.addReceiptForm.resetFields()

            },
            editBankCard(newVal,oldVal){
                if(newVal) return
                this.$refs.tm.resetFields()
            }
        }
    }
</script>
<style>
    #waybill .card{
        border: 1px solid #aaaaaa;
        padding:15px;
        margin-bottom:20px;
    }
    #waybill .title{
        color: #20a0ff;
        font-size: 18px;
        font-weight: bold;
    }
    #waybill .green{
        color: #33B7F3;
    }
    #waybill .gray{
        color: #cccccc;
    }
    #waybill .purple{
        color: purple;
    }
    #waybill .card-body{
        padding:10px 25px 0px;
    }
    #waybill .ubnormalImg{
        height:250px;
        width:250px;
        border: 1px solid #aaaaaa;
        cursor: pointer;
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
