<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 奖金发放</el-breadcrumb-item>
                <el-breadcrumb-item>零散业务</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.code" style="display:block"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select v-model="searchParam.vehicleNature" style="display:block" option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start" :end-date="searchParam.endActualDepartureTime"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end" :start-date="searchParam.startActualDepartureTime"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务员:">
                            <all-user-select style="display:block;"  v-model="searchParam.salesman" @change-option="changeSalesman"></all-user-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否已发放:">
                            <dictionary-select option-name="GRANT_FLAG"  v-model="searchParam.grantFlag" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发放月份:">
                            <el-date-picker v-model="searchParam.grantMonth" style="width:100%;"
                                            type="month" value-format="yyyy-MM" placeholder="选择月份" :picker-options="month0"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" v-permission="'/scatteredBusiness/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-button v-if="downloadLoading" v-permission="'/scatteredBusiness/download'" icon="el-icon-download" type="primary" size="mini" style="margin-right:2px;" @click="downTemplate">模板下载</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>下载中...</el-button>
            <upload-excel :importUrl="uploadUrl" size="mini"  btn-name="导入" style="margin-left:210px;margin-top:-28px;"
                          v-permission="'/scatteredBusiness/uploads'" @success="uploadSuccess"></upload-excel>

            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="是否已发放" prop="grantFlag" min-width="120"></el-table-column>
                <el-table-column align="center" label="所属大区" prop="regionName" min-width="140"></el-table-column>
                <el-table-column align="center" label="所属分区" prop="orgName" min-width="140"></el-table-column>
                <el-table-column align="center" label="运单号" prop="waybillCode" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row.waybillCode)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="客户名称" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.customerName?scope.row.customerName:""}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="线路名称" prop="lineName" min-width="240" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="出发站点" prop="startStationName" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="目的站点" prop="endStationName" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车牌号" prop="vehicleLicenseNum" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车型" prop="specification" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车辆属性" prop="vehicleNature" min-width="120"></el-table-column>
                <el-table-column align="center" label="应收金额" prop="receiveAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="应收结算时间" prop="receiveSettlementTime" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="收款时间" prop="payeeTime" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="应付金额" prop="paidVehicleAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="定点加油金额" prop="refuelingAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="油卡金额" prop="oilCardAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际油比" prop="actualOilRatio" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="付款时间" prop="paidSettlementTime" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="税额" prop="dutyAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="资金成本" prop="firstCost" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="税金损失" prop="dutyCostLose" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="目标利润率" prop="scatteredTargetRate" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="实际利润率" prop="scatteredActualRate" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="超额利润" prop="excessProfit" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="预计提成金额" prop="royaltyAmount" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="计息" prop="penaltyInterest" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="业务员" prop="salesman" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="业务员所属组织" prop="salesmanOrgName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="业务员奖金" prop="salesManBonus" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="请车员" prop="carInviter" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="请车员所属组织" prop="carInviterOrgName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="请车团队奖金" prop="carTeamBonusPlease" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="区域奖金" prop="regionalBonus" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="发放月份" prop="grantMonth" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="发车时间" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.driverDepartureTime && Math.abs(new Date(scope.row.actualDepartureTime).getTime() - new Date(scope.row.driverDepartureTime).getTime())>1800000" style="color:red;">{{scope.row.actualDepartureTime}}</span>
                        <span v-else>{{scope.row.actualDepartureTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center"  fixed="right" min-width="150">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.grantFlag!='是'" type="text" v-permission="'/scatteredBusiness/modifyBonus'" icon="el-icon-edit" size="mini"
                                   @click="showModifyScatteredBusinessAuditDialog(scope.row)"></el-button>
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
        <!-- 修改奖金弹出框 -->
        <el-dialog title="修改奖金" :visible.sync="dialogModifyScatteredBusinessAuditVisible" width="800px">
            <el-form size="small" :model="modifyScatteredBusinessAuditForm" ref="modifyScatteredBusinessAuditForm" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="业务员奖金:" prop="salesManBonus" :rules="[validate.required('金额',true),validate.allMoney]">
                            <el-input style="display: block" v-model="modifyScatteredBusinessAuditForm.salesManBonus"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="请车团队奖金:" prop="carTeamBonusPlease" :rules="[validate.required('金额',true),validate.allMoney]">
                            <el-input v-model="modifyScatteredBusinessAuditForm.carTeamBonusPlease" style="display: block"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="区域奖金:" prop="regionalBonus" :rules="[validate.required('金额',true),validate.allMoney]">
                            <el-input v-model="modifyScatteredBusinessAuditForm.regionalBonus" style="display: block"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="dialogModifyScatteredBusinessAuditVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyScatteredBusinessAudit('modifyScatteredBusinessAuditForm')">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>

</template>

<script>
    import {Http,Api,Common} from 'src/global/index'
    import {Validate} from 'src/global/validate'
    import axios from 'axios'
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                validate: Validate,//校验
                month0: {
                    disabledDate(time) {
                        return time > new Date()
                    }
                },
                downloadLoading: true,
                uploadUrl:Api.scatteredBusiness.upload,//零散业务导入数据接口
                dialogModifyScatteredBusinessAuditVisible:false,//修改奖金弹出框
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    code: '',//运单号
                    vehicleNature: '',//车辆属性
                    startActualDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车开始时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),//发车结束时间
                    orgCode:'',//所属区域
                    salesman: '',//业务员
                    grantFlag: '',//是否已发放
                    grantMonth:'',//选择月份

                },
                //修改奖金金额
                modifyScatteredBusinessAuditForm:{
                    salesManBonus:'',//业务员奖金
                    carTeamBonusPlease:'',//请车团队奖金
                    regionalBonus:''//区域奖金
                },
                isLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true
            }
        },
        created() {
            this.searchList();
        },
        computed: {
            ...mapGetters([
                'user'
            ]),
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    code: '',//运单号
                    vehicleNature: '',//车辆属性
                    startActualDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 90*24*3600*1000),"YYYY-MM-DD 00:00:00"),//发车开始时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),//发车结束时间
                    orgCode:'',//所属区域
                    salesman: '',//业务员
                    grantFlag: '',//是否已发放
                    grantMonth:'',//选择月份
                };
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.scatteredBusiness.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            //根据waybillCode查询出要修改的数据
            showModifyScatteredBusinessAuditDialog(row) {
                let vm = this;
                Http.get(Api.scatteredBusiness.queryBywaybillCode, {params: {'waybillCode': row.waybillCode}}, result => {
                    vm.modifyScatteredBusinessAuditForm = result.result;//将数据库中通过waybillCode查询到的数据赋值给修改框
                    vm.dialogModifyScatteredBusinessAuditVisible = true;
                })
            },
            //修改奖金金额
            modifyScatteredBusinessAudit(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.scatteredBusiness.modifyBonus, vm.modifyScatteredBusinessAuditForm, response => {
                            vm.dialogModifyScatteredBusinessAuditVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
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
                axios.get(Api.scatteredBusiness.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '零散业务报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            showWayBill(waybillCode){ //运单详情------------------------------------
                this.$router.push({path: '/operation/waybillDetail', query: {code: waybillCode}})
            },
            changeSalesman(obj){
                let vm = this;
                if(!_.isNil(obj)){
                    vm.searchParam.salesman = `${obj.name} ${obj.username}`;
                }else{
                    vm.searchParam.salesman = '';
                }
            },
            //模板下载
            downTemplate(){
                let vm = this;
                vm.downloadLoading = false;
                axios.get(Api.scatteredBusiness.getExcel, {responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '零散业务奖金提成导入模板.xls';
                    link.click();
                    vm.downloadLoading = true;
                }).catch(reason => {
                    vm.downloadLoading = true;
                })
            },
            //导入数据成功
            uploadSuccess() {
                let vm = this;
                vm.searchList();
            },
        }
    }
</script>

<style scoped>

</style>
