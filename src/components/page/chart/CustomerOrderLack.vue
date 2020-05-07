<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item>异常管理</el-breadcrumb-item>
                <el-breadcrumb-item>客户订单缺失</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input  v-model="searchParam.code" style="display:block;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start" :end-date="searchParam.endActualDepartureTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end" :start-date="searchParam.startActualDepartureTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="派车单号:">
                            <el-input  v-model="searchParam.dispatchCode" style="display:block;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单属性:">
                            <dictionary-select option-name="WAY_BILL_NATURE"  v-model="searchParam.tempVehicle" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单状态:">
                            <dictionary-select option-name="WAY_BILL_STATUS"  v-model="searchParam.status" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineId" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="缺失状态:">
                            <dictionary-select option-name="LACK_STATUS"  v-model="searchParam.lackStatus" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" icon="el-icon-download" v-permission="'/customerOrderLack/export'" type="primary" size="mini" style="" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="客户" min-width="140">
                    <template slot-scope="scope">
                        {{scope.row.waybill.dispatch.customer?scope.row.waybill.dispatch.customer.name:""}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="所属大区" prop="waybill.dispatch.region.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="waybill.dispatch.belongOrg.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="线路名称" min-width="600" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;display:inline-block;" @click="showLine(scope.row.waybill.dispatch)">{{scope.row.waybill.dispatch.dispatchLine.lineName}}</a>
                        {{`（${scope.row.waybill.dispatch.dispatchLine.startStation.name} —— ${scope.row.waybill.dispatch.dispatchLine.endStation.name}）`}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单号" min-width="130">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybill.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="发车序号" prop="waybill.departureNumber" min-width="130" show-overflow-tooltip>
                </el-table-column>
                <el-table-column header-align="center" label="派车单号" prop="waybill.dispatch.code" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="运单属性" min-width="100">
                    <template slot-scope="scope">
                        {{scope.row.waybill.dispatch.tempVehicle? "临时":"正班"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车牌号码" prop="waybill.dispatch.dispatchVehicle.vehicleLicenseNum" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.waybill.dispatch.dispatchVehicle.vehicleLicenseNum}  （${scope.row.waybill.dispatch.dispatchVehicle.specification} 米）`}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="挂厢号码" prop="waybill.dispatch.dispatchVehicle.trailerLicenseNum" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车型" prop="waybill.dispatch.dispatchVehicle.specification" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="车辆属性" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" v-model="scope.row.waybill.dispatch.dispatchVehicle.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单状态" prop="status" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAY_BILL_STATUS" :value="scope.row.waybill.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="确认发车时间" prop="actualDepartureTime" min-width="160">
                    <template slot-scope="scope">
                        <span v-if="scope.row.waybill.dispatch.driverDepartureTime && Math.abs(new Date(scope.row.waybill.actualDepartureTime).getTime() - new Date(scope.row.waybill.dispatch.driverDepartureTime).getTime())>1800000" style="color:red;">{{scope.row.waybill.actualDepartureTime}}</span>
                        <span v-else>{{scope.row.waybill.actualDepartureTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="缺失状态" prop="status" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LACK_STATUS" :value="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="80">
                    <template slot-scope="scope">
                        <el-button v-permission="'/customerOrderLack/modify'" size="mini" type="text" icon="el-icon-edit" @click="improveWaybill(scope.row.waybill)">完善资料</el-button>
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
        <line-info v-if="showLineInfo"  :dialogVisible="showLineInfo" @close="hideLineInfo"  :currentRow="currentRow"></line-info>

        <!-- 完善资料 -->
        <imporve-waybill v-if="showModify"  :dialogVisible="showModify" @close="hideModify"  :currentRow="currentRow"></imporve-waybill>

    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import lineInfo from 'src/components/page/operation/myDispatch/LineInfoDialog'
    import modifyWaybill from 'src/components/page/operation/myWayBill/ModifyWaybill'
    import axios from 'axios'
    import ImporveWaybill from "../operation/myWayBill/ImporveWaybill";

    export default {
        data() {
            return {
                isLoading: false,
                showLineInfo: false,//线路信息详情
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',//客户编号
                    code: '',//运单号
                    orgCode: '',//所属区域
                    vehicleCode: '',//车牌号
                    status: '',//状态
                    lackStatus: '',//缺失状态
                    tempVehicle: '',//运单属性
                    startActualDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    lineId: '',//线路名称
                    dispatchCode: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],//要操作的行
                currentRow: null,//操作行的数据
                tableHeight: window.innerHeight>800?430:null,
                //导出
                exportLoading: true,
                //修改运单
                showModify: false
            }
        },
        components:{
            ImporveWaybill,
            lineInfo,
            modifyWaybill
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',//客户编号
                    code: '',//运单号
                    orgCode: '',//所属区域
                    vehicleCode: '',//车牌号
                    status: '',//状态
                    lackStatus: '',//缺失状态
                    tempVehicle: '',//运单属性
                    startActualDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    lineId: '',//线路名称
                    dispatchCode: ''
                };
            },
            searchList() {//查询
                let vm = this;
                if(!!vm.searchParam.code || !!vm.searchParam.dispatchCode){
                    vm.searchParam.startActualDepartureTime = '';
                    vm.searchParam.endActualDepartureTime = '';
                }else{
                    if(!vm.searchParam.startActualDepartureTime && !vm.searchParam.endActualDepartureTime){
                        return vm.$message.warning('请选择发车时间进行查询！');
                    }
                }
                vm.isLoading = true;
                Http.get(Api.customerOrderLack.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            //导出
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.customerOrderLack.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    ;//配置下载的文件名
                    link.download = '客户订单缺失明细.xls'
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
            showWayBill(row){ //运单详情------------------------------------
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
                // window.open(href, '_blank');
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}})
            },
            showLine(row){//线路详情
                this.currentRow = row;
                this.showLineInfo = true;
            },
            hideLineInfo(){//关闭线路详情
                this.showLineInfo = false;
            },
            //完善资料
            improveWaybill(row){
                this.currentRow = row;
                this.showModify = true;
            },
            hideModify(){
                this.showModify = false;
                this.searchList();
            }
        }
    }
</script>
