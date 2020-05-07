<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务报表</el-breadcrumb-item>
                <el-breadcrumb-item>核算应收应付明细</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="收入主体:" prop="incomeSubject">
                            <dictionary-select v-model="searchParam.incomeSubject"
                                               option-name="LINE_INCOME_SUBJECT"
                                               style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商全称:">
                            <supplier-select v-model="searchParam.supplierCode" style="display: block" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属大区:">
                            <current-org-select v-model="searchParam.regionCode" style="display: block" nature="AREA"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属小区:">
                                <current-org-select v-model="searchParam.belongOrgCode" style="display: block" nature="PARTITION"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleLicenseNum" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" auditStatus="PASS"
                                             style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户全称:">
                            <settlement-customer-select v-model="searchParam.customerName" style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select v-model="searchParam.vehicleNature" style="display:block"
                                               option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="车型:">
                            <dictionary-select style="display: block" option-name="VEHICLE_SPECIFICATION" v-model="searchParam.specification"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="开票状态(应收):">
                            <el-select v-model="searchParam.kpzt" placeholder="请选择" style="display:block;">
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
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineCode" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row >
                    <el-col :span="6">
                        <el-form-item label="到达开始月份:">
                            <el-date-picker v-model="searchParam.adjustAccountsMonth" style="width:100%;" type="month" value-format="yyyy-MM" placeholder="选择月" :picker-options="month0"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="text" v-show="!isMoreItemShow" @click="isMoreItemShow = true" size="small">展开更多搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="isMoreItemShow = false" size="small">收起搜索项<<
                            </el-button>
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-if="exportLoading"  icon="el-icon-download"  type="primary" size="mini"  @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="运单号" min-width="130">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.ydbh}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="序列号" prop="xlh" min-width="180" show-overflow-tooltip/>
                <el-table-column align="center" label="收入主体" prop="srzt" min-width="180" show-overflow-tooltip/>
                <el-table-column align="center" label="顶级客户" prop="topCustomer" min-width="180" show-overflow-tooltip/>
                <el-table-column align="center" label="客户简称" prop="khjc" min-width="180" show-overflow-tooltip/>
                <el-table-column align="center" label="客户全称" prop="settlementCustomerCode" min-width="250" show-overflow-tooltip/>
                <el-table-column align="center" label="结算客户" prop="khqc" min-width="180" show-overflow-tooltip/>
                <el-table-column align="center" label="大区" prop="dq" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="小区" prop="xq" min-width="120" show-overflow-tooltip/>
                <el-table-column header-align="center" label="线路名称" prop="xlmc" min-width="250" show-overflow-tooltip/>

                <el-table-column align="center" label="始发地" prop="sfd" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="目的地" prop="mdd" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="运单性质" prop="ydxz" min-width="100"/>

                <el-table-column align="center" label="线路里程" prop="zlc" min-width="100" show-overflow-tooltip/>

                <el-table-column align="center" label="车辆属性" prop="clsx" min-width="120px" show-overflow-tooltip/>
                <el-table-column align="center" label="自营属性" prop="zysx" min-width="100" show-overflow-tooltip/>
                <el-table-column align="center" label="车牌号" prop="cph" min-width="180" show-overflow-tooltip/>
                <el-table-column align="center" label="挂箱号" prop="gxh" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="车型" prop="cx" min-width="140" show-overflow-tooltip/>
                <el-table-column align="center" label="供应商" prop="gys" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="发车时间" prop="fcsj" min-width="180" show-overflow-tooltip/>
                <el-table-column align="center" label="到达时间" prop="ddsj" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="应收运费" prop="ysyf" min-width="140" show-overflow-tooltip/>

                <el-table-column align="center" label="应收对账单号" prop="yszdbh" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="开票月份" prop="yskpyf" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="发票号" prop="ysfph" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="应收开票状态" prop="kpzt" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="结算状态(应收)" prop="ysjszt" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="结算时间(应收)" prop="jssj" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="结算运费(应付)" prop="jsyf" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="G7油卡" prop="g7" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="金润二当家" prop="jrdj" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="上海石化" prop="shsh" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="天地会" prop="tdh" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="中交兴路(柴油卡)" prop="zar" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="深海石化" prop="shenHaiShihua" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="找油网" prop="faYouWebsite" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="一海富" prop="haiFu" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="九车能源" prop="nengLian" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="易智道" prop="yiZhiDao" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="裕恒" prop="yuHeng" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="中油易通" prop="zhongYouYiTong" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="齐鲁交通B卡" prop="lutongCard" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="山东高速B卡" prop="shandongHighSpeed" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="云通卡B卡" prop="yunTongCard" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="齐鲁交通A卡" prop="luTongAcard" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="百世A卡" prop="baishiAcard" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="线路管理费" prop="insuranceFee" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="保险费" prop="insurance" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="折旧费" prop="depreciation" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="质量扣款" prop="zlkk" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="实际应付" prop="ssfcj" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="账单编号应付" prop="yfzdbh" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="开票时间" prop="yfkpsj" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="发票号" prop="yffph" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="应付结算时间" prop="yfjssj" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="运单状态" prop="ydzt" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="油卡卡号" prop="ykkh" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="计价方式(应收)" prop="ysjjfs" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="计价数量(应收)" prop="ysjjsl" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="计价方式(应付)" prop="yfjjfs" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="计价数量(应付)" prop="yfjjsl" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="签收时间" prop="qssj" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="回单号" prop="hdh" min-width="120" show-overflow-tooltip/>
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
    </el-container>
</template>

<script>
    import {Http,Api,Validate,Common,Constant} from 'src/global'
    import axios from 'axios'
    import moment from 'moment'

    export default {
        data() {
            return {
                month0: {
                    disabledDate(time) {
                        return time > new Date()
                    }
                },
                options: [
                    {
                        value: '',
                        label: ''
                    }, {
                        value: 0,
                        label: '开票'
                    }, {
                        value: 1,
                        label: '未开票'
                    }],
                Validate: Validate,
                Constant: Constant,
                isLoading: false,
                isMoreItemShow: false,
                exportLoading: true,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    incomeSubject: '',//收入主体
                    waybillCode: '',//运单号
                    regionCode:'',//大区
                    belongOrgCode: '',//小区
                    actualDepartureStartTime: '',
                    actualDepartureEndTime: '',
                    adjustAccountsMonth:Common.date.dateFormat(new Date(), "YYYY-MM"),
                    confirmArrivalStartTime: '',//到达时间
                    confirmArrivalEndTime: '',
                    lineCode: '',//线路名
                    customerName: '',//客户全称
                    supplierCode: '',//供应商
                    vehicleNature: '',//车辆属性
                    vehicleLicenseNum: '',//车牌号
                    receiveSettlementStartTime: '',//应收结算时间
                    receiveSettlementEndTime: '',
                    paidSettlementStartTime: '',//申请付款时间
                    paidSettlementEndTime: '',
                    operationDepartureStartTime: '',//操作发车时间
                    operationDepartureEndTime: '',
                    oilCardNumber: '',//油卡卡号
                    specification: '',//车型
                    departCityArr: [],//始发地
                    departCityCode: '',
                    destCityArr: [],//目的地
                    waybillStatus: '',
                    customerCode: '',
                    destCityCode: '',
                    waybillSignTimeStartTime:'',//运单签收时间
                    waybillSignTimeEndTime:'',
                    receiveInvoiceMonth:'',
                    paidInvoiceMonth:'',
                    receiveInvoiceStatus:'',
                    paidInvoiceStatus:'',
                    kpzt:'',/*应收开票状态*/
                    yfkp:''/*应付是否已开票*/
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                }
            }
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    incomeSubject: '',//收入主体
                    waybillCode: '',//运单号
                    belongOrgCode: '',//小区
                    actualDepartureStartTime: '',//发车时间
                    actualDepartureEndTime: '',
                    confirmArrivalStartTime: '',//到达时间
                    confirmArrivalEndTime: '',
                    operationDepartureStartTime: '',//操作发车时间
                    operationDepartureEndTime: '',
                    lineCode: '',//线路名
                    customerName: '',//客户全称
                    supplierCode: '',//供应商
                    vehicleNature: '',//车辆属性
                    vehicleLicenseNum: '',//车牌号
                    receiveSettlementStartTime: '',//应收结算时间
                    receiveSettlementEndTime: '',
                    paidSettlementStartTime: '',//应付结算时间
                    paidSettlementEndTime: '',
                    oilCardNumber: '',//油卡卡号
                    specification: '',//车型
                    departCityArr: [],//始发地
                    departCityCode: '',
                    destCityArr: [],//目的地
                    waybillStatus: '',
                    customerCode: '',
                    destCityCode: '',
                    waybillSignTimeStartTime:'',//运单签收时间
                    waybillSignTimeEndTime:'',
                };
            },
            searchList() {//查询
                let _this = this;
                _this.searchParam.departCityCode = _this.searchParam.departCityArr[1];
                _this.searchParam.destCityCode = _this.searchParam.destCityArr[1];
                if(!_this.searchParam.adjustAccountsMonth){
                    _this.$message.error("请选择到达月份");
                    throw "请选择到达月份"
                }
                _this.isLoading = true;
                Http.get(Api.checkComputationReceivePaidDetail.page,{ params : _this.searchParam }, result => {
                    _this.searchResult.result = result.result;
                    _this.searchResult.totalCount = result.totalCount;
                    _this.searchParam.currentPage = result.currentPage;
                    _this.searchParam.pageSize = result.pageSize;
                    _this.isLoading = false;
                },()=>{
                    _this.isLoading = false;
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
            showWayBill(row) { //运单详情------------------------------------
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.ydbh}});
            },
            exportList(){
                let _this = this;
                _this.exportLoading = false;
                _this.searchParam.departCityCode = _this.searchParam.departCityArr[1];
                _this.searchParam.destCityCode = _this.searchParam.destCityArr[1];
                if(!_this.searchParam.adjustAccountsMonth){
                    return _this.$message.error("请选择到达月份");
                }
                axios.get(Api.checkComputationReceivePaidDetail.export, {params: _this.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '核算应收应付明细.xls';
                    link.click();
                    _this.exportLoading = true;
                }).catch(reason => {
                    _this.exportLoading = true;
                })
            }
        }
    }
</script>

