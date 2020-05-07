<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item>客户运单</el-breadcrumb-item>
                <el-breadcrumb-item>百世运单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.srcActStartTime" date-type="start" :end-date="searchParam.srcActEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.srcActEndTime" date-type="end" :start-date="searchParam.srcActStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达开始时间:">
                            <date-picker-single v-model="searchParam.destActStartTime" date-type="start" :end-date="searchParam.destActEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达结束时间:">
                            <date-picker-single v-model="searchParam.destActEndTime" date-type="end" :start-date="searchParam.destActStartTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="任务单号:">
                            <el-input  v-model="searchParam.jobCode" style="display:block;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="任务P,C码:">
                            <el-input  v-model="searchParam.pinCode" style="display:block;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <org-select-report  v-model="searchParam.belongOrg" style="display:block;"></org-select-report>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号是否为空:">
                            <dictionary-select option-name="WAYBILL_IS_NULL"
                                               v-model="searchParam.wayBillIsNull"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/bestWaybill/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="任务单号" prop="jobCode" min-width="160">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color:#409EFF;" @click="showBestWaybillDetailDialog(scope.row)">{{scope.row.jobCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="则一运单号" prop="waybillCode" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="任务P,C码" prop="pinCode" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="任务S,M码" prop="scanCode" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="线路编号" prop="routeCode" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="百世线路" prop="routeName" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="百世车牌" prop="licensePlate" min-width="100" ></el-table-column>
                <el-table-column header-align="center" label="百世车挂" prop="trailerLicensePlate" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="则一线路" prop="lineName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="则一车牌" prop="licenseNumber" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="则一车挂" prop="trailerLicenseNumber" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="百世业务类型" prop="businessType" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="是否金融" prop="financialFlag" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="BOOLEAN_FLAG" :value="scope.row.financialFlag"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="百世派车时间" prop="submitTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="BS实际出发时间" prop="srcActTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="BS实际到达时间" prop="destActTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="ZY实际出发时间" prop="actualDepartureTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="ZY实际到达时间" prop="confirmArrivalTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="百世分公司" prop="nodeName" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="承运商" prop="carrierName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="快递/快运" prop="baseZone" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="所属大区" prop="orgName" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="areaOrgName" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="客户名称" prop="customerName" min-width="150"></el-table-column>
                <el-table-column header-align="center" label="线路参考里程" prop="mileageReference" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="参考装载重量" prop="weightReference" min-width="100" ></el-table-column>
                <el-table-column header-align="center" label="参考装载件量" prop="amountReference" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="160"></el-table-column>
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
            <el-dialog title="百世运单详情" :visible.sync="dialogBestWaybillDetailVisible" width="90%">
                <el-form inline size="small" :model="bestWaybillDetailForm"  ref="bestWaybillDetailForm" label-width="100px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="任务单号:" prop="jobCode">
                                {{bestWaybillDetailForm.jobCode}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="则一运单号:" prop="waybillCode">
                                {{bestWaybillDetailForm.waybillCode}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="任务P,C码:" prop="pinCode">
                                {{bestWaybillDetailForm.pinCode}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="任务S,M码:" prop="scanCode">
                                {{bestWaybillDetailForm.scanCode}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="线路编号:" prop="routeCode">
                                {{bestWaybillDetailForm.routeCode}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="百世线路:" prop="routeName">
                                {{bestWaybillDetailForm.routeName}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="百世车牌:" prop="licensePlate">
                                {{bestWaybillDetailForm.licensePlate}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="百世车挂:" prop="trailerLicensePlate">
                                {{bestWaybillDetailForm.trailerLicensePlate}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="百世派车时间:" prop="submitTime">
                                {{bestWaybillDetailForm.submitTime}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="则一线路:" prop="lineName">
                                {{bestWaybillDetailForm.lineName}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="则一车牌:" prop="licenseNumber">
                                {{bestWaybillDetailForm.licenseNumber}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="则一车挂:" prop="trailerLicenseNumber">
                                {{bestWaybillDetailForm.trailerLicenseNumber}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="百世出发时间:" prop="srcActTime">
                                {{bestWaybillDetailForm.srcActTime}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="百世到达时间:" prop="destActTime">
                                {{bestWaybillDetailForm.destActTime}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="则一出发时间:" prop="actualDepartureTime">
                                {{bestWaybillDetailForm.actualDepartureTime}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="则一到达时间:" prop="confirmArrivalTime">
                                {{bestWaybillDetailForm.confirmArrivalTime}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="百世分公司:" prop="nodeName">
                                {{bestWaybillDetailForm.nodeName}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="承运商:" prop="carrierName">
                                {{bestWaybillDetailForm.carrierName}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="快递/快运:" prop="baseZone">
                                {{bestWaybillDetailForm.baseZone}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属大区:" prop="orgName">
                                {{bestWaybillDetailForm.orgName}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属分区:" prop="areaOrgName">
                                {{bestWaybillDetailForm.areaOrgName}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="客户名称:" prop="customerName">
                                {{bestWaybillDetailForm.customerName}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="线路参考里程:" prop="mileageReference">
                                {{bestWaybillDetailForm.mileageReference}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="参考装载重量:" prop="weightReference">
                                {{bestWaybillDetailForm.weightReference}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="参考装载件量:" prop="amountReference">
                                {{bestWaybillDetailForm.amountReference}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="创建时间:" prop="createTime">
                                {{bestWaybillDetailForm.createTime}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-table  size="small" class="content-table" :data="bestWaybillDetailForm.timeDetail"  border fit highlight-current-row stripe :height="200" :style="{height:'auto'}">
                    <el-table-column header-align="center" label="站点编号" prop="apportionId" min-width="100" ></el-table-column>
                    <el-table-column header-align="center" label="站点" prop="apportionName" min-width="140"></el-table-column>
                    <el-table-column header-align="center" label="预计发车时间" prop="srcPlanTime" min-width="140"></el-table-column>
                    <el-table-column header-align="center" label="预计到达时间" prop="destPlanTime" min-width="140"></el-table-column>
                    <el-table-column header-align="center" label="实际发车时间" prop="srcActTime" min-width="140"></el-table-column>
                    <el-table-column header-align="center" label="实际到达时间" prop="destActTime" min-width="140"></el-table-column>
                    <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="100"></el-table-column>
                </el-table>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
    import {Http,Api,Common} from 'src/global'
    import axios from 'axios'

    export default {
        data() {
            return {
                common: Common,
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    srcActStartTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),
                    srcActEndTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    destActStartTime: '',
                    destActEndTime: '',
                    vehicleCode: '',
                    belongOrg:'',
                    wayBillIsNull:'',
                    jobCode: '',
                    pinCode:''
                },
                isLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true,
                tableHeight: window.innerHeight>800?430:null,
                dialogBestWaybillDetailVisible:false,
                bestWaybillDetailForm:{
                    jobCode: '',
                    scanCode: '',
                    pinCode: '',
                    routeCode: '',
                    routeName: '',
                    mileageReference: '',
                    weightReference: '',
                    amountReference: '',
                    licensePlate: '',
                    trailerLicensePlate: '',
                    submitTime: '',
                    nodeName: '',
                    carrierName: '',
                    baseZone: '',
                    srcActTime: '',
                    destActTime: '',
                    waybillCode: '',
                    orgName: '',
                    areaOrgName: '',
                    customerName:'',
                    lineName: '',
                    licenseNumber: '',
                    trailerLicenseNumber: '',
                    actualDepartureTime: '',
                    confirmArrivalTime: '',
                    createTime: '',
                    timeDetail:[]
                }
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    srcActStartTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),
                    srcActEndTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    destActStartTime: '',
                    destActEndTime: '',
                    vehicleCode: '',
                    jobCode: '',
                    pinCode:'',
                    belongOrg:'',
                    wayBillIsNull:''
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.bestWaybill.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
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
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.bestWaybill.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '百世运单.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            showBestWaybillDetailDialog(row){
                let vm = this;
                Http.get(Api.bestWaybill.queryByJobCode,{params:{'jobCode':row.jobCode}},result =>{
                    if (result.result) {
                        vm.bestWaybillDetailForm = result.result;
                    }
                    vm.dialogBestWaybillDetailVisible = true;
                })
            }
        }
    }
</script>
