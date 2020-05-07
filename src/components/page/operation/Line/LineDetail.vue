<template>
    <el-container>
        <el-header height="" style="padding-left: 0">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                    <el-breadcrumb-item>线路管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-header>
        <el-main class="content-main" style="margin-left: 10px; border:1px solid #aaa; width: 100%">
            <el-form inline size="small" :model="detailLineInfoForm" ref="detailLineInfoForm" label-width="130px">
                <el-row>
                    <el-col :span="12">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>基本信息</span>
                            </div>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="客户:">
                                        {{detailLineInfoForm.customer?detailLineInfoForm.customer.name:""}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="发车时间:">
                                        {{detailLineInfoForm.departTime}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="出发站点:">
                                        {{detailLineInfoForm.departStation?detailLineInfoForm.departStation.name:""}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="目的站点:">
                                        {{detailLineInfoForm.destStation?detailLineInfoForm.destStation.name:""}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="线路类型:">
                                        <dictionary-select-name option-name="LINE_TYPE"
                                                                :value="detailLineInfoForm.lineType"></dictionary-select-name>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="营运类型:">
                                        <dictionary-select-name option-name="LINE_OPERATION_TYPE"
                                                                :value="detailLineInfoForm.operationType"></dictionary-select-name>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="考核方式:">
                                        <dictionary-select-name option-name="LINE_EVALUATION_MODE"
                                                                :value="detailLineInfoForm.evaluationMode"></dictionary-select-name>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="总里程:">
                                        {{detailLineInfoForm.distance}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="行驶时间:">
                                        {{detailLineInfoForm.timeHour ? detailLineInfoForm.timeHour : 0}}小时
                                        {{detailLineInfoForm.timeMin ? detailLineInfoForm.timeMin : 0 }}分钟
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="则一行驶时间:">
                                        {{detailLineInfoForm.timeZeyiHour ? detailLineInfoForm.timeZeyiHour : 0}}小时
                                        {{detailLineInfoForm.timeZeyiMin ? detailLineInfoForm.timeZeyiMin : 0}}分钟
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="业务类型:">
                                        <dictionary-select-name option-name="LINE_BUSINESS_TYPE"
                                                                :value="detailLineInfoForm.businessType"></dictionary-select-name>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="回单类型:">
                                        <dictionary-select-name option-name="RECEIPT_TYPE"
                                                                :value="detailLineInfoForm.receiptType"></dictionary-select-name>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="业务员:">
                                        <!--{{detailLineInfoForm.salesmanUserNameList}}-->
                                        {{detailLineInfoForm.salesmanList}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-table size="small" class="content-table" :data="detailLineInfoForm.stationInfoList"
                                      border>
                                <el-table-column align="center" label="经停站点"
                                                 prop="transitStationName"></el-table-column>
                                <el-table-column align="center" label="里程">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.distance}}公里</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="行驶时间">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.travelTimeHour ? scope.row.travelTimeHour : "0"}}小时</span>
                                        <span>{{scope.row.travelTimeMin ? scope.row.travelTimeMin : "0"}}分钟</span>
                                    </template>
                                </el-table-column>

                                <!--<el-table-column align="center" label="停留时间">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.stayTimeHour ? scope.row.stayTimeZeyiHour : "0"}}小时</span>
                                        <span>{{scope.row.stayTimeMin ? scope.row.stayTimeMin : "0"}}分钟</span>
                                    </template>
                                </el-table-column>-->
                                <el-table-column align="center" label="则一行驶时间">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.travelTimeZeyiHour ? scope.row.travelTimeZeyiHour : "0"}}小时</span>
                                        <span>{{scope.row.travelTimeZeyiMin ?scope.row.travelTimeZeyiMin : "0"}}分钟</span>
                                    </template>
                                </el-table-column>

                                <!--<el-table-column align="center" label="则一停留时间">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.stayTimeZeyiHour ? scope.row.stayTimeZeyiHour : "0"}}小时</span>
                                        <span>{{scope.row.stayTimeZeyiMin ? scope.row.stayTimeZeyiMin : "0"}}分钟</span>
                                    </template>
                                </el-table-column>-->
                            </el-table>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card class="box-card" style="margin-left: 1%">
                            <div slot="header" class="clearfix">
                                <span>应收信息</span>
                            </div>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="收入主体:" prop="incomeSubject">
                                        <dictionary-select-name option-name="LINE_INCOME_SUBJECT"
                                                                :value="detailLineInfoForm.lineContract.incomeSubject"></dictionary-select-name>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="客户全称:">
                                        {{detailLineInfoForm.lineContract.customerName}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="客户合同编号:">
                                        {{detailLineInfoForm.lineContract.customerContractNo}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="客户合同图片:">
                                        <span v-if="!detailLineInfoForm.lineContract.customerContractImage"></span>
                                        <el-button type="text" size="mini" v-else
                                                   @click="openLink(detailLineInfoForm.lineContract.customerContractImage)">
                                            查看
                                        </el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="合同开始时间:">
                                        {{detailLineInfoForm.lineContract.startDate | moment("YYYY-MM-DD")}}
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="合同结束时间:">
                                        {{detailLineInfoForm.lineContract.endDate | moment("YYYY-MM-DD")}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="计价方式:">
                                        <dictionary-select-name option-name="LINE_PRICE_TYPE"
                                                                :value="detailLineInfoForm.lineContract.priceType"></dictionary-select-name>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12" v-if="detailLineInfoForm.lineContract.priceType === Constant.LINE_PRICE_TYPE.WEIGHT">
                                    <el-form-item label="计价模式:">
                                        <dictionary-select-name option-name="VALUATION_PRICE_MPDEL"
                                                                :value="detailLineInfoForm.lineContract.valuationPriceModel"></dictionary-select-name>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="单价:"
                                                  v-if='detailLineInfoForm.lineContract.priceType!="NORMAL" '>
                                        {{detailLineInfoForm.lineContract.unitPrice}}
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-table size="small" v-if='detailLineInfoForm.lineContract.priceType=="NORMAL" '
                                              class="content-table"
                                              :data="detailLineInfoForm.lineContract.vehicleSizeList" border>
                                        <el-table-column align="center" label="车型规格" prop="vehicleSize">
                                            <template slot-scope="scope">
                                                <dictionary-select-name option-name="VEHICLE_SPECIFICATION"
                                                                        :value="scope.row.vehicleSize"></dictionary-select-name>
                                            </template>
                                        </el-table-column>
                                        <el-table-column align="center" label="单价" prop="unitPrice"></el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-card class="box-card" style="margin-top: 1%">
                            <div slot="header" class="clearfix">
                                <span>外包应付</span>
                            </div>
                            <el-table size="small" class="content-table" :data="detailLineInfoForm.lineOutsourceList"
                                      border>
                                <el-table-column align="center" label="关联车辆"
                                                 prop="vehicleInfo.licenseNumber"></el-table-column>
                                <template v-if="$_permission('/lineOutsource/priceLinkageAdd')">
                                    <el-table-column align="center" label="车型" prop="vehicleSize"></el-table-column>
                                </template>
                                <el-table-column align="center" label="外包价格" prop="outsourcePrice"></el-table-column>
                                <!--<template v-if="$_permission('/lineOutsource/priceLinkageAdd')">-->
                                    <el-table-column align="center" label="百公里油耗" prop="oilConsumption"></el-table-column>
                                <!--</template>-->
                                <!--<template v-if="$_permission('/lineOutsource/priceLinkageAdd')">-->
                                    <el-table-column align="center" label="基准油价" prop="baseOilPrice"></el-table-column>
                                <!--</template>-->
                                <!--<template v-if="$_permission('/lineOutsource/priceLinkageAdd')">-->
                                    <el-table-column align="center" label="结算里程" prop="baseDistance"></el-table-column>
                                <!--</template>-->
                                <!--<template v-if="$_permission('/lineOutsource/priceLinkageAdd')">-->
                                    <el-table-column align="center" label="是否享受油价联动" prop="priceLinkage">
                                        <template slot-scope="scope">
                                            {{scope.row.priceLinkage ? "是" : "否"}}
                                        </template>
                                    </el-table-column>
                                <!--</template>-->
                            </el-table>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card class="box-card" style="margin-left: 1%; margin-top: 1%">
                            <div slot="header" class="clearfix">
                                <span>外请应付</span>
                            </div>
                            <el-table size="small" class="content-table" :data="detailLineInfoForm.lineOutInviteList"
                                      border>
                                <el-table-column align="center" label="关联供应商" prop="supplierInfo.name"
                                                 min-width="120"></el-table-column>
                                <el-table-column align="center" label="计价方式">
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="LINE_PRICE_TYPE"
                                                                :value="scope.row.priceType"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="车型规格" prop="vehicleSize">
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="VEHICLE_SPECIFICATION"
                                                                :value="scope.row.vehicleSize"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="计价单价" prop="priceUnit"></el-table-column>
                                <el-table-column align="center" label="油卡金额" prop="oilCardAmount"></el-table-column>
                                <el-table-column align="center" label="是否开票" prop="isInvoice">
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="IS_EXIST"
                                                                :value="scope.row.isInvoice"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="开票类型" prop="invoiceType">
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="LINE_INVOICE_TYPE"
                                                                :value="scope.row.invoiceType"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="开票比例" prop="invoiceRatio"></el-table-column>
                                <el-table-column align="center" label="开票金额" prop="invoiceAmount"></el-table-column>
                            </el-table>
                        </el-card>
                    </el-col>
                </el-row>
            </el-form>
        </el-main>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import { Constant, Common } from 'src/global'

    export default {
        data() {
            return {
                Constant:Constant,
                detailLineInfoForm: {
                    customer: {
                        code: '',
                        name: ''
                    },
                    departStation: {
                        code: '',
                        name: ''
                    },
                    destStation: {
                        code: '',
                        name: ''
                    },
                    departStationCode: '',
                    departTime: '',
                    operationType: '',
                    evaluationMode: '',
                    lineType: '',
                    businessType: '',
                    receiptType: '',
                    distance: '',
                    stationInfoList: [],
                    salesmanList:'',
                    salesmanUserNameList:[],
                    lineContract: {
                        priceType: '',
                        unitPrice: '',
                        totalPrice: '',
                        customerContractNo: '',
                        customerContractImage: '',
                        startDate: '',
                        endDate: ''
                    },
                    lineOutsourceList: [],
                    lineOutInviteList: []
                }
            }
        },
        mounted() {
            this.initDetailLineInfoForm();
        },
        methods: {
            initDetailLineInfoForm() {
                let lineId = this.$route.query.lineId;
                let vm = this;
                Http.get(Api.line.queryDetailById, {params: {'id': lineId}}, result => {
                    vm.detailLineInfoForm = result.result;
                    if (!result.result.lineContract) {
                        vm.detailLineInfoForm.lineContract = '';
                    }
                    if (result.result.salesmanUserNameList) {
                        _.join(vm.detailLineInfoForm.salesmanUserNameList, ',');
                        vm.detailLineInfoForm.salesmanUserNameList = vm.detailLineInfoForm.salesmanUserNameList.toString();
                    }
                })
            },
            openLink(url) {
                window.open(url);
            }
        }
    }
</script>
