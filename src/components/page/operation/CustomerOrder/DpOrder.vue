<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item>客户订单</el-breadcrumb-item>
                <el-breadcrumb-item>德邦订单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="是否派车:">
                            <dictionary-select option-name="CERT_COMPLETE_FLAG"
                                               v-model="searchParam.dispatchFlag" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="用车开始时间:">
                            <date-picker-single v-model="searchParam.useCarStartTime" date-type="start" :end-date="searchParam.useCarEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="用车结束时间:">
                            <date-picker-single v-model="searchParam.useCarEndTime" date-type="end" :start-date="searchParam.useCarStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单状态:">
                            <dictionary-select option-name="CUSTOMER_STATUS"
                                               v-model="searchParam.status" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="德邦订单编号:">
                            <el-input  v-model="searchParam.dpOrderCode" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发城市:">
                            <el-input  v-model="searchParam.startCityName" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达城市:">
                            <el-input  v-model="searchParam.endCityName" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <org-select v-model="searchParam.belongOrgCode" style="display: block;"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车型:">
                            <dictionary-select v-model="searchParam.truckLength" option-name="VEHICLE_SPECIFICATION" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建开始时间:">
                            <date-picker-single v-model="searchParam.createStartTime" date-type="start" :end-date="searchParam.createEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建结束时间:">
                            <date-picker-single v-model="searchParam.createEndTime" date-type="end" :start-date="searchParam.createStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" >
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" icon="el-icon-download" v-permission="'/dpOrder/export'" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="德邦订单编号" prop="dpOrderCode" min-width="160">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color:#409EFF;" @click="showDpOrderDetailDialog(scope.row)">{{scope.row.dpOrderCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="是否派车" prop="dispatchFlag" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="CERT_COMPLETE_FLAG" :value="scope.row.dispatchFlag"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="用车时间" prop="useCarTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="到货时间" prop="goodsArriveTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="订单失效时间" prop="invalidTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="始发地市名称" prop="startCityName" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="始发地址详细地址" prop="startAddress" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的地市名称" prop="endCityName" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="目的地址详细地址" prop="endAddress" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路公里数" prop="referenceDistance" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="所属大区" prop="region.name" min-width="140" show-overflow-tooltip>
                </el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="org.name" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="货物名称" prop="goodsName" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="货物重量/kg" prop="goodsWeight" min-width="100" ></el-table-column>
                <el-table-column header-align="center" label="货物体积/m³" prop="goodsVolume" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="车型" prop="truckType" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="车长" prop="truckLength" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="备注" prop="remark" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="联系人" prop="contact" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="联系人手机" prop="contactMobile" min-width="180"></el-table-column>
                <el-table-column header-align="center" label="订单状态" prop="status" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="CUSTOMER_STATUS" :value="scope.row.status"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="派车单号" prop="dispatchCode" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="已报价格" prop="actualPrice" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="160"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="100">
                    <template slot-scope="scope">
                        <el-button v-permission="'/dpOrder/operationDetail'" type="text" size="mini"  @click="showOperation(scope.row)"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;订单详情</el-button>
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
            <!--报价-->
            <el-dialog title="报价" :visible.sync="dialogDriverPriceVisible" width="800px">
                <el-table size="small" class="content-table" :data="quotationPriceList" element-loading-text="拼命加载中" border
                          fit highlight-current-row stripe>
                    <el-table-column header-align="center" label="id" prop="id" min-width="50px" v-if="false"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="德邦订单号" prop="dpOrderCode" min-width="50px"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="车长" prop="truckLength" min-width="50px"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="车型" prop="truckType" min-width="50px"
                                     show-overflow-tooltip>
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE"
                                                    :value="scope.row.truckType"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" label="报价金额" prop="quotationPrice" min-width="30px">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.quotationPrice"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogDriverPriceVisible = false;quotationPriceList.quotationPrice = ''">取 消</el-button>
                    <el-button size="small" type="primary" @click="driverPrice()">确 定</el-button>
                </div>
            </el-dialog>
            <!--订单详情-->
            <el-dialog title="德邦订单详情" :visible.sync="dialogDpOrderDetailVisible" width="90%">
                <el-form inline size="small" :model="dpOrderDetailForm"  ref="dpOrderDetailForm" label-width="100px">
                    <el-col :span="6">
                        <el-form-item label="德邦订单编号:" prop="dpOrderCode">
                            {{dpOrderDetailForm.dpOrderCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="用车时间:" prop="useCarTime">
                            {{dpOrderDetailForm.useCarTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到货时间:" prop="goodsArriveTime">
                            {{dpOrderDetailForm.goodsArriveTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单失效时间:" prop="invalidTime">
                            {{dpOrderDetailForm.invalidTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单状态:" prop="status">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CUSTOMER_STATUS" :value="dpOrderDetailForm.status"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="报价金额:" prop="actualPrice">
                            {{dpOrderDetailForm.actualPrice}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="中标时间:" prop="bidDate">
                            {{dpOrderDetailForm.bidDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车:" prop="dispatchFlag">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CERT_COMPLETE_FLAG" :value="dpOrderDetailForm.dispatchFlag"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系人:" prop="contact">
                            {{dpOrderDetailForm.contact}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系人手机:" prop="contactMobile">
                            {{dpOrderDetailForm.contactMobile}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属大区:" prop="org">
                            {{dpOrderDetailForm.region?dpOrderDetailForm.region.name:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属分区:" prop="org">
                            {{dpOrderDetailForm.org?dpOrderDetailForm.org.name:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路公里数:" prop="referenceDistance">
                            {{dpOrderDetailForm.referenceDistance}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货物名称:" prop="goodsName">
                            {{dpOrderDetailForm.goodsName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货物重量:" prop="goodsWeight">
                            {{dpOrderDetailForm.goodsWeight}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货物体积/m³:" prop="goodsVolume">
                            {{dpOrderDetailForm.goodsVolume}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发地省名称:" prop="">
                            {{dpOrderDetailForm.startProvinceName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发地市名称:" prop="startCityName">
                            {{dpOrderDetailForm.startCityName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发地区名称:" prop="startDistrictName">
                            {{dpOrderDetailForm.startDistrictName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发详细地址:" prop="startAddress">
                            {{dpOrderDetailForm.startAddress}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的地省名称:" prop="endProvinceName">
                            {{dpOrderDetailForm.endProvinceName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的地市名称:" prop="endCityName">
                            {{dpOrderDetailForm.endCityName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的地区名称:" prop="endDistrictName">
                            {{dpOrderDetailForm.endDistrictName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的详细地址:" prop="endAddress">
                            {{dpOrderDetailForm.endAddress}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="装卸:" prop="loadUnloadFlag">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CERT_COMPLETE_FLAG" :value="dpOrderDetailForm.loadUnloadFlag"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="签收:" prop="signFlag">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CERT_COMPLETE_FLAG" :value="dpOrderDetailForm.signFlag"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="进仓:" prop="enterStoreFlag">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CERT_COMPLETE_FLAG" :value="dpOrderDetailForm.enterStoreFlag"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="代收贷款:" prop="collectionPayFlag">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CERT_COMPLETE_FLAG" :value="dpOrderDetailForm.collectionPayFlag"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="保价:" prop="insureFlag">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CERT_COMPLETE_FLAG" :value="dpOrderDetailForm.insureFlag"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="押车:" prop="truckFlag">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CERT_COMPLETE_FLAG" :value="dpOrderDetailForm.truckFlag"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item header-align="center" label="创建时间" prop="createTime"
                                      min-width="100">{{dpOrderDetailForm.createTime}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注:" prop="remark">
                            {{dpOrderDetailForm.remark}}
                        </el-form-item>
                    </el-col>
                    <el-table size="small" class="content-table" :data="dpOrderDetailForm.dpOrderTruckDetailList" border
                              fit
                              highlight-current-row stripe :height="150" :style="{height:'auto'}">
                        <el-table-column header-align="center" label="车长" prop="truckLength"
                                         min-width="100"></el-table-column>
                        <el-table-column header-align="center" label="车型" prop="truckType"
                                         min-width="100">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE"
                                                        :value="scope.row.truckType"></dictionary-select-name>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" label="德邦订单号" prop="dpOrderCode"
                                         min-width="100"></el-table-column>
                        <el-table-column header-align="center" label="车牌" prop="truckCode"
                                         min-width="100"></el-table-column>
                        <el-table-column header-align="center" label="派车单号" prop="dispatchCode"
                                         min-width="100"></el-table-column>
                        <el-table-column header-align="center" label="是否派车" prop="isDispatch"
                                         min-width="100">
                        </el-table-column>
                    </el-table>
                </el-form>
            </el-dialog>
            <el-dialog title="报价记录详情" :visible.sync="dialogDpOrderQuotationDetailVisible" width="90%">
                <el-table  size="small" class="content-table" :data="dpOrderQuotationDetailForm"  border fit highlight-current-row stripe :height="200" :style="{height:'auto'}">
                    <el-table-column header-align="center" label="德邦订单号" prop="dpOrderCode" min-width="100" ></el-table-column>
                    <el-table-column header-align="center" label="报价金额" prop="price" min-width="140"></el-table-column>
                    <el-table-column header-align="center" label="状态" prop="status" min-width="100">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="CUSTOMER_STATUS" :value="scope.row.status"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" label="取消时间" prop="cancelTime" min-width="100"></el-table-column>
                    <el-table-column header-align="center" label="取消人" prop="cancelUser" min-width="100"></el-table-column>
                    <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="100"></el-table-column>
                    <el-table-column header-align="center" label="创建人" prop="createUser" min-width="100"></el-table-column>
                </el-table>
            </el-dialog>
            <el-dialog title="德邦订单操作" :visible.sync="operationVisible" width="80%" @close="close" top="20vh" append-to-body>
                <el-table size="small" class="content-table" :data="operationForm" element-loading-text="拼命加载中" border
                          fit highlight-current-row stripe>
                    <el-table-column header-align="center" label="id" prop="id" min-width="50px" v-if="false"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="德邦订单号" prop="dpOrderCode" min-width="50px"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="派车单号" prop="dispatchCode" min-width="50px"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="车长" prop="truckLength" min-width="50px"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="车型" prop="truckType" min-width="50px"
                                     show-overflow-tooltip>
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE"
                                                    :value="scope.row.truckType"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" label="报价金额" prop="quotationPrice" min-width="30px"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="预计发车时间" prop="useCarTime" min-width="80px"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="预计到达时间" prop="goodsArriveTime" min-width="80px"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="操作" fixed="right" width="400">
                        <template slot-scope="scope">
                            <el-button v-permission="'/dpOrder/driverPrice'" type="text" size="mini"  @click="driverPriceDialog()" :disabled="!(scope.row.status === Constant.CUSTOMER_ORDER_STATUS.NEW_CREATE||scope.row.status === Constant.CUSTOMER_ORDER_STATUS.OFFER)"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;报价</el-button>
                            <el-button v-permission="'/dpOrder/appoint'" type="text" size="mini"  @click="appoint(scope.row)" :disabled="!(scope.row.status === Constant.CUSTOMER_ORDER_STATUS.CONFIRM && !scope.row.dispatchFlag && !scope.row.supplierFlag)"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;指派</el-button>
                            <el-button v-permission="'/dpOrder/quotation'" type="text" size="mini"  @click="dialogDpOrderQuotationDetailDialog(scope.row)"><i class="fa fa-file-text-o"></i>报价详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-main>
        <!-- 临时加车 -->
        <temporary v-if="showTemporary" :dialogVisible="showTemporary" @close="hideTemporary"
                   :customerCode="currentRow.orderCode" :customerSimpleName="'DP'"></temporary>

        <!--新供应商系统配套--派车-->
        <send-vehicle v-if="showSendVehicle"  :dialogVisible="showSendVehicle" @close="hideSendVehicle" :currentRow="currentRow" :from="'DP'" :currentLine="currentLine"></send-vehicle>
        <!--新供应商系统配套--指派供应商-->
        <send-supplier v-if="showSendSupplier"  :dialogVisible="showSendSupplier" @close="hideSendSupplier" :currentRow="currentRow" :from="'DP'" :currentLine="currentLine"></send-supplier>
        <!--指派-->
        <new-line-select v-if="showAppoint"  :dialogVisible="showAppoint" @close="hideAppoint" :currentRow="currentRow"></new-line-select>
    </el-container>
</template>

<script>
    import {Http,Api,Common,Constant} from 'src/global'
    import newLineSelect from '../myDispatch/newLineSelect'
    import sendVehicle from '../myDispatch/ConfirmVehicle'
    import sendSupplier from './SendSupplier.vue'
    import {Validate} from 'src/global/validate'
    import axios from 'axios'
    export default {
        data() {
            return {
                Validate: Validate,//校验
                common: Common,
                Constant:Constant,
                currentRow:{},
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    status:'',
                    dpOrderCode: '',
                    useCarTime: [Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() - 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() - 3*24*3600*1000).getMonth(), new Date(new Date().getTime() - 3*24*3600*1000).getDate(),0,0,0)),Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),23,59,59))],
                    useCarStartTime:'',
                    useCarEndTime:'',
                    createStartTime:'',
                    createEndTime:'',
                    dispatchFlag:'',
                    startCityName:'',
                    endCityName:'',
                    belongOrgCode:'',
                    truckLength:''
                },
                isLoading: true,
                exportLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //报价相关
                dialogDriverPriceVisible: false,
                tableHeight: window.innerHeight>800?430:null,
                dialogDpOrderDetailVisible:false,
                dialogDpOrderQuotationDetailVisible:false,
                //指派
                showAppoint: false,
                //新供应商系统配套--派车按钮
                showSendVehicle: false,
                //新供应商系统配套--指派供应商
                showSendSupplier: false,
                operationVisible: false,
                editType:'',
                url:'',
                currentLine: null,//选中的线路
                dpOrderQuotationDetailForm:{},
                operationForm:[],
                quotationPriceList:[],
                dpOrderDetailForm:{
                    dpOrderTruckDetailList:[]
                }
            }
        },
        created() {
            this.searchList();
        },
        components:{
            newLineSelect,
            sendVehicle,
            sendSupplier
        },
        methods: {
            close() {
                this.operationVisible = false;
                this.$emit('close');
                this.searchList();
            },
            showOperation(row){
                let vm = this;
                Http.get(Api.dpOrder.queryTruckByDpOrderCode,{params:{'dpOrderCode':row.dpOrderCode}},result =>{
                    if (result.result) {
                        vm.operationForm = result.result;
                    }
                    vm.operationVisible = true;
                })
            },
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    status:'',
                    dpOrderCode: '',
                    useCarTime: [Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date(new Date().getTime() - 3*24*3600*1000).getFullYear(), new Date(new Date().getTime() - 3*24*3600*1000).getMonth(), new Date(new Date().getTime() - 3*24*3600*1000).getDate(),0,0,0)),Common.date.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),23,59,59))],
                    useCarStartTime:'',
                    useCarEndTime:'',
                    dispatchFlag:'',
                    startCityName:'',
                    createStartTime:'',
                    createEndTime:'',
                    endCityName:'',
                    belongOrgCode:'',
                    truckLength:''
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.dpOrder.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            //报价相关
            driverPriceDialog() {
                this.dialogDriverPriceVisible = true;
                this.quotationPriceList =  _.cloneDeep(this.operationForm);
            },
            driverPrice() {
                let vm = this;
                let reg = /^[1-9]\d*$/;
                let dpOrderCode ='';
                let checkPrice = vm.quotationPriceList.filter((item,index)=>{
                    dpOrderCode = item.dpOrderCode;
                    return !reg.test(item.quotationPrice)
                })
                if(checkPrice.length>0){
                    this.$message.error(checkPrice[0].dpOrderCode+'报价金额不能为空或者报价金额输入错误!')
                    return
                }
                Http.post(Api.dpOrder.driverPrice, vm.quotationPriceList, response => {
                vm.quotationPriceList=[];
                vm.dialogDriverPriceVisible = false;
                vm.currentRow.dpOrderCode = dpOrderCode;
                this.$message({
                    message: '报价成功!',
                    type: 'success'
                });
                setTimeout(() => {
                    vm.showOperation(vm.currentRow);
                },500)
                });
            },
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.dpOrder.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '德邦订单.xls';
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
            //查看详情
            showDpOrderDetailDialog(row){
                let vm = this;
                Http.get(Api.dpOrder.queryByDpOrderCode,{params:{'dpOrderCode':row.dpOrderCode}},result =>{
                    if (result.result) {
                        vm.dpOrderDetailForm = result.result;
                    }
                    vm.dialogDpOrderDetailVisible = true;
                })
            },
            dialogDpOrderQuotationDetailDialog(row) {
                let vm = this;
                Http.get(Api.dpOrder.quotationDetail, {params: {'detailId': row.id}}, result => {
                    if (result.result) {
                        vm.dpOrderQuotationDetailForm = result.result;
                    }
                    vm.dialogDpOrderQuotationDetailVisible = true;
                })
            },
            //指派
            appoint(row){
                this.showAppoint = true;
                this.currentRow = _.cloneDeep(row)
            },
            hideAppoint(line,type,row){
                this.showAppoint = false;
                this.currentLine = _.cloneDeep(line)
                if(type==='vehicle'){
                    this.showSendVehicle = true;
                    this.currentRow.customerOrderCode = row.orderCode;
                }else if(type==='supplier'){
                    this.showSendSupplier = true;
                    this.currentRow.customerOrderCode = row.orderCode;
                    this.currentRow.vanType = row.truckType;
                    this.currentRow.specification = row.truckLength;
                }
            },
            //新派车确认
            hideSendVehicle(){
                this.showSendVehicle = false;
                this.operationVisible = false;
                this.searchList();
            },
            //新指派供应商
            hideSendSupplier(){
                this.showSendSupplier = false;
                this.operationVisible = false;
                this.searchList();
            },
        }
    }
</script>
