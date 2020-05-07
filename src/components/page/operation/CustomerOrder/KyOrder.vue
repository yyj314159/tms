<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item>客户订单</el-breadcrumb-item>
                <el-breadcrumb-item>跨越订单</el-breadcrumb-item>
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
                        <el-form-item label="装货开始时间:">
                            <el-date-picker
                                v-model="searchParam.loadStartTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="date"
                                placeholder="选择日期时间" style="width:100%;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="装货结束时间:">
                            <el-date-picker
                                v-model="searchParam.loadEndTime"
                                value-format="yyyy-MM-dd 23:59:59"
                                type="date"
                                placeholder="选择日期时间" style="width:100%;">
                            </el-date-picker>
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
                        <el-form-item label="订单编号:">
                            <el-input  v-model="searchParam.thirdSn" style="display:block;"/>
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
                            <date-time-picker-single v-model="searchParam.createStartTime" date-type="start"></date-time-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建结束时间:">
                            <date-time-picker-single v-model="searchParam.createEndTime" date-type="end"></date-time-picker-single>
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
            <el-button v-if="exportLoading" icon="el-icon-download" v-permission="'/kyOrder/export'" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <!--<el-table-column header-align="center" label="订单编号" prop="orderSn" min-width="160">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color:#409EFF;" @click="showKyOrderDetailDialog(scope.row)">{{scope.row.orderSn}}</a>
                    </template>
                </el-table-column>-->
                <el-table-column header-align="center" label="订单编号" prop="thirdSn" min-width="140">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color:#409EFF;" @click="showKyOrderDetailDialog(scope.row)">{{scope.row.thirdSn}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="业务单号" prop="thirdSn" min-width="140">
                    <template slot-scope="scope">
                        {{scope.row.thirdSn.substring(0,scope.row.thirdSn.lastIndexOf("-"))}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="是否派车" prop="dispatchFlag" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="CERT_COMPLETE_FLAG" :value="scope.row.dispatchFlag"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="装货时间" prop="loadTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="装货地市名称" prop="startCityName" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="装货地址详细地址" prop="startAddress" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="卸货地市名称" prop="endCityName" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="卸货地址详细地址" prop="endAddress" min-width="160" show-overflow-tooltip></el-table-column>
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
                <el-table-column header-align="center" label="卸货时间" prop="unloadTime" min-width="140" show-overflow-tooltip></el-table-column>

                <el-table-column header-align="center" label="是否需要回单" prop="needReceipt" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="CUSTOMER_ORDER_NEED" :value="scope.row.needReceipt"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="是否需要尾板" prop="isTailBoard" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="CUSTOMER_ORDER_NEED" :value="scope.row.isTailBoard"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="装货服务" prop="loadService" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="CUSTOMER_ORDER_NEED" :value="scope.row.loadService"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="卸货服务" prop="unloadService" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="CUSTOMER_ORDER_NEED" :value="scope.row.unloadService"/>
                    </template>
                </el-table-column>

                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="160"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="300">
                    <template slot-scope="scope">
                        <el-button v-permission="'/kyOrder/driverPrice'" type="text" size="mini"  @click="driverPriceDialog(scope.row)" :disabled="!(scope.row.status === Constant.CUSTOMER_ORDER_STATUS.NEW_CREATE||scope.row.status === Constant.CUSTOMER_ORDER_STATUS.OFFER)"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;报价</el-button>
                        <el-button v-permission="'/kyOrder/cancelDriverPrice'" type="text" size="mini"  @click="cancelDriverPrice(scope.row)" :disabled="!(scope.row.status === Constant.CUSTOMER_ORDER_STATUS.OFFER)"><i class="fa fa-file-text-o "></i>&nbsp;&nbsp;取消报价</el-button>
                        <!--指派-->
                        <el-button v-permission="'/kyOrder/appoint'" type="text" size="mini"  @click="appoint(scope.row)" :disabled="!(scope.row.status === Constant.CUSTOMER_ORDER_STATUS.CONFIRM)||(scope.row.dispatchFlag || scope.row.supplierFlag)"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;指派</el-button>
                        <el-button v-permission="'/kyOrder/quotation'" type="text" size="mini"  @click="dialogKyOrderQuotationDetailDialog(scope.row)"><i class="fa fa-file-text-o"></i>报价详情</el-button>
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
            <el-dialog title="报价" :visible.sync="dialogDriverPriceVisible" width="400px">
                <el-form size="small" inline :model="driverPriceForm" :rules="driverPriceRules"  ref="driverPriceForm"
                         label-width="120px">
                    <el-form-item label="价格:" prop="actualPrice">
                        <el-input v-model="driverPriceForm.actualPrice"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogDriverPriceVisible = false;driverPriceForm.actualPrice = ''">取 消</el-button>
                    <el-button size="small" type="primary" @click="driverPrice('driverPriceForm')">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="跨越订单详情" :visible.sync="dialogKyOrderDetailVisible" width="90%">
                <el-form inline size="small" :model="kyOrderDetailForm"  ref="kyOrderDetailForm" label-width="100px">
                    <el-col :span="6">
                        <el-form-item label="订单编号:" prop="thirdSn">
                            {{kyOrderDetailForm.thirdSn}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="装货时间:" prop="loadTime">
                            {{kyOrderDetailForm.loadTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单状态:" prop="status">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CUSTOMER_STATUS" :value="kyOrderDetailForm.status"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="中标时间:" prop="orderConfirm.createTime">
                            {{kyOrderDetailForm.orderConfirm?kyOrderDetailForm.orderConfirm.createTime:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车:" prop="dispatchFlag">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CERT_COMPLETE_FLAG" :value="kyOrderDetailForm.dispatchFlag"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车单号:" prop="dispatchCode">
                            {{kyOrderDetailForm.dispatchCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系人:" prop="contact">
                            {{kyOrderDetailForm.contact}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系人手机:" prop="contactMobile">
                            {{kyOrderDetailForm.contactMobile}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属大区:" prop="org">
                            {{kyOrderDetailForm.region?kyOrderDetailForm.region.name:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属分区:" prop="org">
                            {{kyOrderDetailForm.org?kyOrderDetailForm.org.name:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路公里数:" prop="referenceDistance">
                            {{kyOrderDetailForm.referenceDistance}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货物名称:" prop="goodsName">
                            {{kyOrderDetailForm.goodsName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货物重量:" prop="goodsWeight">
                            {{kyOrderDetailForm.goodsWeight}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货物体积/m³:" prop="goodsVolume">
                            {{kyOrderDetailForm.goodsVolume}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="装货地省名称:" prop="">
                            {{kyOrderDetailForm.startProvinceName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="装货地市名称:" prop="startCityName">
                            {{kyOrderDetailForm.startCityName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="装货地区名称:" prop="startDistrictName">
                            {{kyOrderDetailForm.startDistrictName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="装货详细地址:" prop="startAddress">
                            {{kyOrderDetailForm.startAddress}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="卸货地省名称:" prop="endProvinceName">
                            {{kyOrderDetailForm.endProvinceName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="卸货地市名称:" prop="endCityName">
                            {{kyOrderDetailForm.endCityName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="卸货地区名称:" prop="endDistrictName">
                            {{kyOrderDetailForm.endDistrictName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="卸货详细地址:" prop="endAddress">
                            {{kyOrderDetailForm.endAddress}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="卸货时间:" prop="unloadTime">
                            {{kyOrderDetailForm.unloadTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车型:" prop="truckType">
                            {{kyOrderDetailForm.truckType}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车长:" prop="truckLength">
                            {{kyOrderDetailForm.truckLength}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否需要回单:" prop="needReceipt">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CUSTOMER_ORDER_NEED" :value="kyOrderDetailForm.needReceipt"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否需要尾板:" prop="isTailBoard">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CUSTOMER_ORDER_NEED" :value="kyOrderDetailForm.isTailBoard"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="装货服务:" prop="loadService">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CUSTOMER_ORDER_NEED" :value="kyOrderDetailForm.loadService"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="卸货服务:" prop="unloadService">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CUSTOMER_ORDER_NEED" :value="kyOrderDetailForm.unloadService"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item header-align="center" label="修改人" prop="modifyUser"
                                      min-width="140">{{kyOrderDetailForm.modifyUser}}</el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item header-align="center" label="修改时间" prop="modifyTime"
                                      min-width="140">{{kyOrderDetailForm.modifyTime}}</el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item header-align="center" label="创建时间" prop="createTime"
                                      min-width="100">{{kyOrderDetailForm.createTime}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注:" prop="remark">
                            {{kyOrderDetailForm.remark}}
                        </el-form-item>
                    </el-col>
                </el-form>
                <el-table  size="small" class="content-table" :data="kyOrderDetailForm.stopOverStation"  border fit highlight-current-row stripe :height="200" :style="{height:'auto'}">
                    <el-table-column header-align="center" label="经停点省名称" prop="provinceName" min-width="100" ></el-table-column>
                    <el-table-column header-align="center" label="经停点市名称" prop="cityName" min-width="140"></el-table-column>
                    <el-table-column header-align="center" label="经停点区名称" prop="districtName" min-width="140"></el-table-column>
                    <el-table-column header-align="center" label="经停点详细地址" prop="address" min-width="140"></el-table-column>
                    <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="100"></el-table-column>
                </el-table>
            </el-dialog>
            <el-dialog title="报价记录详情" :visible.sync="dialogKyOrderQuotationDetailVisible" width="90%">
                <el-table  size="small" class="content-table" :data="kyOrderQuotationDetailForm"  border fit highlight-current-row stripe :height="200" :style="{height:'auto'}">
                    <el-table-column header-align="center" label="订单号" prop="thirdSn" min-width="100" ></el-table-column>
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

        </el-main>
        <!--指派-->
        <new-line-select v-if="showAppoint"  :dialogVisible="showAppoint" @close="hideAppoint" :currentRow="currentRow"></new-line-select>
        <!--新供应商系统配套--派车-->
        <send-vehicle v-if="showSendVehicle"  :dialogVisible="showSendVehicle" @close="hideSendVehicle" :currentRow="currentRow" :from="'KY'" :currentLine="currentLine"></send-vehicle>
        <!--新供应商系统配套--指派供应商-->
        <send-supplier v-if="showSendSupplier"  :dialogVisible="showSendSupplier" @close="hideSendSupplier" :currentRow="currentRow" :from="'KY'" :currentLine="currentLine"></send-supplier>
    </el-container>
</template>

<script>
    import newLineSelect from '../myDispatch/newLineSelect'
    import sendVehicle from '../myDispatch/ConfirmVehicle'
    import sendSupplier from './SendSupplier.vue'
    import {Http,Api,Common,Constant} from 'src/global'
    import axios from 'axios'
    const Day = 1000*60*60*24*30 // 30天
    export default {
        data() {
            return {
                common: Common,
                Constant:Constant,
                currentRow:{},
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    status:'',
                    thirdSn: '',
                    loadStartTime:Common.date.dateFormat(new Date(),"YYYY-MM-DD 00:00:00"),
                    loadEndTime:Common.date.dateFormat((new Date().getTime()+Day),"YYYY-MM-DD 23:59:59"),
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
                driverPriceForm:{
                    actualPrice: '',
                    taskNo:'',
                    orderSn:''
                },
                createOrderForm:{
                    actualPrice: '',
                    lineId:'',
                    vanType:'',
                    truckLength:'',
                    thirdSn:''
                },
                createOrderRules:{
                    lineId: [
                        {required: true, message: '请选择线路', trigger: 'blur'}
                    ],
                    vanType: [
                        {required: true, message: '请选择厢型', trigger: 'blur'}
                    ],
                    truckLength: [
                        {required: true, message: '请选择车长', trigger: 'blur'}
                    ]
                },
                driverPriceRules: {
                    actualPrice: [
                        {required: true, message: '请输入价格', trigger: 'blur'}
                    ],
                },
                //报价相关
                dialogDriverPriceVisible: false,
                tableHeight: window.innerHeight>800?430:null,
                dialogKyOrderDetailVisible:false,
                dialogKyOrderQuotationDetailVisible:false,
                dialogCreateOrderVisible:false,
                kyOrderDetailForm:{
                    stopOverStation:[],
                    orderConfirm:{}
                },
                kyOrderQuotationDetailForm:{},
                //新供应商系统配套--派车按钮
                showSendVehicle: false,
                //新供应商系统配套--指派供应商
                showSendSupplier: false,
                //指派
                showAppoint: false,
                currentLine: null,//选中的线路
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
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    status:'',
                    thirdSn: '',
                    loadStartTime:Common.date.dateFormat(new Date(),"YYYY-MM-DD 00:00:00"),
                    loadEndTime:Common.date.dateFormat((new Date().getTime()+Day),"YYYY-MM-DD 23:59:59"),
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
                Http.get(Api.kyOrder.page,{ params : vm.searchParam }, result => {
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
            driverPriceDialog(row) {
                this.dialogDriverPriceVisible = true;
                this.currentRow = row;
            },
            driverPrice(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.driverPriceForm.taskNo = vm.currentRow.thirdSn
                        vm.driverPriceForm.orderSn = vm.currentRow.orderSn
                        Http.post(Api.kyOrder.driverPrice, vm.driverPriceForm, response => {
                            vm.driverPriceForm.actualPrice='';
                            vm.dialogDriverPriceVisible = false;
                            this.$message({
                                message: '报价成功!',
                                type: 'success'
                            });
                            vm.isLoading = true;
                            setTimeout(() => {
                                vm.searchList();
                            },500)

                        })
                    } else {
                        return false;
                    }
                });
            },
            //取消报价
            cancelDriverPrice(row) {
                this.$confirm('确定取消报价吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let cancelDriverPrice = {};
                    cancelDriverPrice.taskNo = row.thirdSn;
                    Http.post(Api.kyOrder.cancelDriverPrice, cancelDriverPrice, response => {
                        this.$message({
                            message: '取消报价成功!',
                            type: 'success'
                        });
                        this.isLoading = true;
                        setTimeout(()=>{
                            this.searchList();
                        },500)
                    })

                })
            },
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.kyOrder.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '跨越订单.xls';
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
            showKyOrderDetailDialog(row){
                let vm = this;
                Http.get(Api.kyOrder.queryByOrderSn,{params:{'thirdSn':row.thirdSn}},result =>{
                    if (result.result) {
                        vm.kyOrderDetailForm = result.result;
                    }
                    vm.dialogKyOrderDetailVisible = true;
                })
            },
            dialogKyOrderQuotationDetailDialog(row) {
                let vm = this;
                Http.get(Api.kyOrder.quotationDetail, {params: {'thirdSn': row.thirdSn}}, result => {
                    if (result.result) {
                        vm.kyOrderQuotationDetailForm = result.result;
                    }
                    vm.dialogKyOrderQuotationDetailVisible = true;
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
                    this.currentRow.customerOrderCode = row.thirdSn;
                }else if(type==='supplier'){
                    this.showSendSupplier = true;
                    this.currentRow.customerOrderCode = row.thirdSn;
                    this.currentRow.vanType = row.truckType;
                    this.currentRow.specification = row.truckLength;
                }
            },
            //新派车确认
            hideSendVehicle(){
                this.showSendVehicle = false;
                this.searchList();
            },
            //新指派供应商
            hideSendSupplier(){
                this.showSendSupplier = false;
                this.searchList();
            },
        }
    }
</script>
