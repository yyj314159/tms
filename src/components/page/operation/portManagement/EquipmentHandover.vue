<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 到达管理</el-breadcrumb-item>
                <el-breadcrumb-item>设备交接记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input  v-model="searchParam.waybillCode" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备编号:">
                            <el-input  v-model="searchParam.equipmentCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态:">
                            <dictionary-select option-name="EQUIPMENT_SIGN_STATUS"  v-model="searchParam.status" style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <!--<el-col :span="12">-->
                        <!--<el-form-item label="交接时间:">-->
                            <!--<el-date-picker-->
                                <!--v-model="searchParam.handoverTime"-->
                                <!--:default-time="['00:00:00', '23:59:59']"-->
                                <!--style="width: 100%"-->
                                <!--type="daterange"-->
                                <!--range-separator="至"-->
                                <!--start-placeholder="开始日期"-->
                                <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                                <!--end-placeholder="结束日期" size="small">-->
                            <!--</el-date-picker>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <el-col :span="6">
                        <el-form-item label="交接开始时间:">
                            <date-picker-single v-model="searchParam.handoverStartTime" date-type="start" :end-date="searchParam.handoverEndTime" ></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="交接结束时间:">
                            <date-picker-single v-model="searchParam.handoverEndTime" date-type="end" :start-date="searchParam.handoverStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备类型:">
                            <dictionary-select option-name="WAYBILL_EQUIPMENT_TYPE"  v-model="searchParam.type" style="display: block;"></dictionary-select>
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
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="运单号" min-width="140">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row.waybillCode)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车牌号" prop="waybill.dispatch.dispatchVehicle.vehicleLicenseNum" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.waybill.dispatch.dispatchVehicle.vehicleLicenseNum}  （${scope.row.waybill.dispatch.dispatchVehicle.specification} 米）`}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="设备类型" prop="type" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAYBILL_EQUIPMENT_TYPE"  v-model="scope.row.type" style="display: block;"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="设备编号" min-width="240" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === Constant.WAYBILL_EQUIPMENT_TYPE.OIL_CARD">{{scope.row.oilCardCode}}</span>
                        <span v-else-if="scope.row.type === Constant.WAYBILL_EQUIPMENT_TYPE.GPS">{{scope.row.gpsCode}}</span>
                        <span v-else-if="scope.row.type === Constant.WAYBILL_EQUIPMENT_TYPE.RECEIPT">{{scope.row.code}}</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="状态" prop="status" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="EQUIPMENT_SIGN_STATUS"  v-model="scope.row.status" style="display: block;"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="交接方式" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="EQUIPMENT_SIGN_MODE"  v-model="scope.row.mode" style="display: block;"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="快递公司" prop="expressCompanyName" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="快递单号" prop="expressNo" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="接收人" prop="receiver" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="手机号" prop="receiverMobile" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="附件" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <show-image :url="scope.row.attachment"></show-image>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="交接时间" prop="handoverTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="签收人" prop="signInUser" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="签收时间" prop="signInTime" min-width="140" show-overflow-tooltip></el-table-column>
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
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import {Constant} from 'src/global/constant'

    export default {
        data() {
            return {
                isLoading: true,
                Constant:Constant,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',//运单号
                    equipmentCode: "",//设备编号
                    vehicleCode: '',//车牌号
                    status: '',//签收状态
                    // handoverTime: [],//交接时间
                    handoverStartTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//交接时间
                    handoverEndTime: Common.date.dateFormat(new Date,"YYYY-MM-DD 23:59:59"),
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                tableHeight: window.innerHeight>800?430:null
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.waybillCode='';
                this.searchParam.equipmentCode="";
                this.searchParam.vehicleCode='';
                this.searchParam.status="";
                // this.searchParam.handoverTime=[];
                this.searchParam.handoverStartTime =Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00");//交接时间
                this.searchParam.handoverEndTime =Common.date.dateFormat(new Date,"YYYY-MM-DD 23:59:59");
                this.searchParam.type = '';
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                // if(this.searchParam.handoverTime){
                //     this.searchParam.handoverStartTime = this.searchParam.handoverTime[0];
                //     this.searchParam.handoverEndTime = this.searchParam.handoverTime[1];
                // }else{
                //     this.searchParam.handoverStartTime = "";
                //     this.searchParam.handoverEndTime = "";
                // }
                Http.get(Api.equipmentHandover.page,{ params : vm.searchParam }, result => {
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
            showWayBill(code){ //运单详情------------------------------------
                this.$router.push({ path: '/operation/waybillDetail',query: {code: code}});
            }
        }
    }
</script>

