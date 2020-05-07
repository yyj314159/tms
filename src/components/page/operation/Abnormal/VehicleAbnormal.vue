<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 异常管理</el-breadcrumb-item>
                <el-breadcrumb-item>车辆异常</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineId" style="display: block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发地:">
                            <district-select  v-model="searchParam.startCityArr" style="display:block"></district-select>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="目的地:">
                            <district-select  v-model="searchParam.endCityArr" style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车单号:">
                            <el-input v-model="searchParam.dispatchCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="受理状态:">
                            <dictionary-select option-name="VEHICLE_ABNORMAL_ACCEPT_STATUS" v-model="searchParam.status"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆性质:">
                            <dictionary-select style="display: block" v-model="searchParam.operationMode"
                                               option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label-width="0" style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <!--导出组件-->
            <export-button  v-permission="'/vehicleException/export'" :href="Api.vehicleException.export" :params="searchParam" :download-name="'车辆异常'"></export-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="受理状态" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_ABNORMAL_ACCEPT_STATUS" :value="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="派车单号" prop="waybill.dispatch.code" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="派车单类型" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.waybill.dispatch.tempVehicle? "临时加车":"正班线路"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="所属大区" prop="waybill.dispatch.region.name" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="waybill.dispatch.belongOrg.name" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="waybill.dispatch.dispatchLine.lineName" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="原车牌号" prop="oldVehicleLicenseNum" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="原挂厢号" prop="oldTrailerLicenseNum" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车辆性质" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="scope.row.waybill.dispatch.dispatchVehicle.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="正确车牌号" prop="vehicleLicenseNum" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="正确挂厢号" prop="trailerLicenseNum" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="上报司机" prop="waybill.dispatch.dispatchVehicle.driver.name" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="电话" prop="waybill.dispatch.dispatchVehicle.driver.mobile" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="上报时间" prop="reportTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="请车员" prop="waybill.dispatch.carInviter" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="受理人" prop="acceptUser" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="受理时间" prop="acceptTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="left" min-width="180">
                    <template slot-scope="scope">
                        <el-button  v-permission="'/vehicleException/edit'" :disabled="scope.row.status!=='NO_ACCEPT'" type="text" size="mini" @click="openAcceptEdit(scope.row)">受理</el-button>
                        <el-button  v-permission="'/vehicleException/view'" type="text" size="mini" @click="openAcceptView(scope.row)">详情</el-button>
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
        <accept-edit v-if="showAcceptEdit" :dialog-visible="showAcceptEdit" @close="closeAcceptEdit" :current-row="currentRow"></accept-edit>
        <accept-view v-if="showAcceptView" :dialog-visible="showAcceptView" @close="closeAcceptView" :current-row="currentRow"></accept-view>
    </el-container>
</template>

<script>
    import {Http,Api,Validate,Common,Constant} from 'src/global'
    import acceptEdit from './AcceptEdit.vue'
    import acceptView from './AcceptView.vue'

    export default {
        data() {
            return {
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    lineId: '',
                    orgCode: '',//所属区域
                    vehicleCode: '',//车牌号
                    startCityArr: [],
                    startCity: '',
                    endCityArr: [],
                    endCity: '',
                    dispatchCode: '',
                    status: '',
                    operationMode: '',
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                tableHeight: window.innerHeight>800?430:null,
                currentRow: null,//操作行的数据
                showAcceptEdit: false,//受理
                showAcceptView: false,//查看详情
            }
        },
        components: {
            acceptEdit,
            acceptView,
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    lineId: '',
                    orgCode: '',//所属区域
                    vehicleCode: '',//车牌号
                    startCityArr: [],
                    startCity: '',
                    endCityArr: [],
                    endCity: '',
                    dispatchCode: '',
                    status: '',
                    operationMode: '',
                };
            },
            searchList() {//查询
                this.isLoading = true;
                this.searchParam.startCity = this.searchParam.startCityArr[1];
                this.searchParam.endCity = this.searchParam.endCityArr[1];
                Http.get(Api.vehicleException.page, {params: this.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    this.isLoading = false;
                }, () => {
                    this.isLoading = false;
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
            //受理
            openAcceptEdit(row){
                this.currentRow = row;
                this.showAcceptEdit = true;
            },
            closeAcceptEdit(){
                this.showAcceptEdit = false;
                this.searchList();
            },
            //详情
            openAcceptView(row){
                this.currentRow = row;
                this.showAcceptView = true;
            },
            closeAcceptView(){
                this.showAcceptView = false;
            },
        }
    }
</script>

