    <template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item>差错管理</el-breadcrumb-item>
                <el-breadcrumb-item>补单明细</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input  v-model="searchParam.waybillCode" style="display:block;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆性质:">
                            <dictionary-select v-model="searchParam.operationMode" style="display:block" option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="派车开始时间:">
                            <date-picker-single v-model="searchParam.startSendTime" date-type="start" :end-date="searchParam.endSendTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车结束时间:">
                            <date-picker-single v-model="searchParam.endSendTime" date-type="end" :start-date="searchParam.startSendTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start" :end-date="searchParam.endActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end" :start-date="searchParam.startActualDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/supplementWaybill/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" label="客户" prop="customerName" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="所属大区" prop="regionName" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="orgName" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="lineName" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路类型" prop="lineType" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="运单号" prop="waybillCode" min-width="130"></el-table-column>
                <el-table-column header-align="center" label="派车单号" prop="dispatchCode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="运单属性" prop="waybillMode" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="车牌号码" prop="vehicleLicenseNum" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="挂厢号码" prop="trailerLicenseNum" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车型" prop="specification" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="车辆属性" prop="vehicleNature" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="承运方" prop="shipperName" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="司机姓名" prop="driverName" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="司机电话" prop="driverMobile" min-width="120"></el-table-column>
                <el-table-column header-align="center" label="运单状态" prop="waybillStatus" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="需求时间" prop="demandTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="派车时间" prop="sendTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="司机发车时间" prop="driverDepartureTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="确认发车时间" prop="confirmDepartureTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="预计到达时间" prop="expectArrivalTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="司机到达时间" prop="driverArrivalTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="实际到达时间" prop="confirmArrivalTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="则一时效" prop="timeConsumeZeYi" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="是否准点（则一）" prop="onTimeFlag" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="晚点时长(则一)(分钟)" prop="overTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="客户时效" prop="timeConsume" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="是否准点（客户）" prop="customerOnTimeFlag" min-width="140"></el-table-column>

                <el-table-column header-align="center" label="晚点时长(客户)(分钟)" prop="customerOverTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="回单号" prop="receiptCode" min-width="240" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="回单签收状态" prop="receiptStatus" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="油卡卡号" prop="oilCardCode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="油卡签收状态" prop="oilCardStatus" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="GPS号" prop="gpsCode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="GPS签收状态" prop="gpsStatus" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="应付审批状态" prop="paidAuditStatus" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="请车员" prop="carInviter" min-width="100"></el-table-column>
                <el-table-column header-align="center" label="调度员" prop="dispatchUser" min-width="100"></el-table-column>
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
                    startSendTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//派车时间
                    endSendTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    startActualDepartureTime: '',//发车时间
                    endActualDepartureTime: '',
                    waybillCode: '',
                    vehicleCode: '',
                    orgCode: '',
                    operationMode: ''
                },
                isLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true,
                tableHeight: window.innerHeight>800?430:null
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
                    startSendTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//派车时间
                    endSendTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    startActualDepartureTime: '',
                    endActualDepartureTime: '',
                    waybillCode: '',
                    vehicleCode: '',
                    orgCode: '',
                    operationMode: ''
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.supplementWaybill.page,{ params : vm.searchParam }, result => {
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
                axios.get(Api.supplementWaybill.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '补单明细.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
