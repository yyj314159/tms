<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 我的审批</el-breadcrumb-item>
                <el-breadcrumb-item>零散业务审批</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户名称:">
                            <customer-select v-model="searchParam.customerCode" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="false">
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
                        <el-form-item label="派车单号:">
                            <el-input v-model="searchParam.dispatchCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆性质:">
                            <dictionary-select style="display: block" v-model="searchParam.vehicleNature" option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select option-name="AUDIT_STATUS"  v-model="searchParam.auditStatus" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务类型:">
                            <dictionary-select v-model="searchParam.businessType" option-name="LINE_BUSINESS_TYPE" style="display:block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核开始时间:">
                            <date-picker-single v-model="searchParam.auditStartTime" date-type="start" :end-date="searchParam.auditEndTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核结束时间:">
                            <date-picker-single v-model="searchParam.auditEndTime" date-type="end" :start-date="searchParam.auditStartTime"></date-picker-single>
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
            <export-button v-permission="'/scatteredBusinessAudit/export'" :href="Api.scatteredBusinessAudit.export" :params="searchParam" :download-name="'零散业务审批情况'"></export-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="所属大区" prop="dispatch.region.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="dispatch.belongOrg.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="运单号" prop="waybillCode" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="派车单号" prop="dispatch.code" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="业务类型" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_BUSINESS_TYPE" :value="scope.row.dispatch.businessType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="业务员" prop="dispatch.salesman" min-width="130"></el-table-column>
                <el-table-column header-align="center" label="请车员" prop="dispatch.carInviter" min-width="130"></el-table-column>
                <el-table-column header-align="center" label="奖金激励" prop="bonusIncentiveFlag" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.bonusIncentiveFlag===true?'是': (scope.row.bonusIncentiveFlag===false?'否':scope.row.bonusIncentiveFlag)}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="客户全称" prop="dispatch.customer.name" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="dispatch.dispatchLine.startStation.name" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="dispatch.dispatchLine.endStation.name" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车辆性质" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="scope.row.dispatch.dispatchVehicle.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车牌号" prop="dispatch.dispatchVehicle.vehicleLicenseNum" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车辆类型" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name style="display:block;" option-name="VEHICLE_TYPE" v-model="scope.row.dispatch.dispatchVehicle.vehicle.type"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="挂厢号码" prop="dispatch.dispatchVehicle.trailerLicenseNum" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车型" prop="dispatch.dispatchVehicle.specification" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="供应商" prop="dispatch.dispatchVehicle.supplier.name" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="承运方" prop="dispatch.dispatchVehicle.shipper.name" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应收计价方式" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_PRICE_TYPE" :value="scope.row.dispatch.dispatchPrice.receivePriceType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="应收计价数量" prop="dispatch.dispatchPrice.receivePriceNum" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应收单价" prop="dispatch.dispatchPrice.receiveUnitPrice" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应收金额" prop="dispatch.dispatchPrice.receiveAmount" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="应付运费" prop="dispatch.dispatchPrice.paidVehicleAmount" min-width="140" show-overflow-tooltip></el-table-column>

                <el-table-column header-align="center" label="审核人" prop="auditor" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核状态" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核时间" prop="auditTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核意见" prop="auditRemark" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="报备人" prop="reportUser" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="报备时间" prop="reportTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="备注" prop="reportRemark" min-width="140" show-overflow-tooltip></el-table-column>

                <el-table-column header-align="center" fixed="left" align="center" label="操作" min-width="200">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/scatteredBusinessAudit/reportScatteredBusinessAudit'"  :disabled="scope.row.auditStatus !== 'UNAUDITED'" icon="el-icon-tickets" size="mini" @click="showAuditWindow(scope.row)">审批</el-button>
                        <el-button type="text" v-permission="'/scatteredBusinessAudit/modify'"  :disabled="scope.row.bonusIncentiveFlag == null" icon="el-icon-tickets" size="mini" @click="showModifyWindow(scope.row)">报备</el-button>
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

        <!-- 审批 -->
        <el-dialog title="审批"  :visible.sync="showAuditDetail" width="60%" @close="resetAuditForm">
            <el-form :model="auditContentForm" size="small" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="派车单号：">
                            {{auditContentForm.dispatch.code}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务类型：">
                            <dictionary-select-name option-name="LINE_BUSINESS_TYPE" :value="auditContentForm.dispatch.businessType" style="color:red; font-weight: bold;"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务员：">
                            {{auditContentForm.dispatch.salesman}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="请车员：">
                            {{auditContentForm.dispatch.carInviter}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="线路名称：">
                            {{auditContentForm.dispatch.dispatchLine.lineName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出发站点：">
                            {{auditContentForm.dispatch.dispatchLine.startStation.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的站点：">
                            {{auditContentForm.dispatch.dispatchLine.endStation.name}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车辆性质：">
                            <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="auditContentForm.dispatch.dispatchVehicle.vehicleNature"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号：">
                            {{auditContentForm.dispatch.dispatchVehicle.vehicleLicenseNum}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆类型：">
                            <dictionary-select-name style="display:block;" option-name="VEHICLE_TYPE" v-model="auditContentForm.dispatch.dispatchVehicle.vehicle.type"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车型：">
                            <dictionary-select-name style="display:block;" option-name="VEHICLE_SPECIFICATION" v-model="auditContentForm.dispatch.dispatchVehicle.vehicle.specification"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="应收计价方式：">
                            <dictionary-select-name v-if="auditContentForm.dispatch.dispatchPrice" option-name="LINE_PRICE_TYPE" :value="auditContentForm.dispatch.dispatchPrice.receivePriceType"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应收计价数量：">
                            {{auditContentForm.dispatch.dispatchPrice.receivePriceNum}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应收单价：">
                            {{auditContentForm.dispatch.dispatchPrice.receiveUnitPrice}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应收金额：">
                            {{auditContentForm.dispatch.dispatchPrice.receiveAmount}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="应付计价方式：">
                            <dictionary-select-name v-if="auditContentForm.dispatch.dispatchPrice" option-name="LINE_PRICE_TYPE" :value="auditContentForm.dispatch.dispatchPrice.paidPriceType"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应付计价数量：">
                            {{auditContentForm.dispatch.dispatchPrice.paidPriceNum}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应付单价：">
                            {{auditContentForm.dispatch.dispatchPrice.paidUnitPrice}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应付金额：">
                            {{auditContentForm.dispatch.dispatchPrice.paidVehicleAmount}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="目标毛利率：">
                            {{auditContentForm.scatteredTargetRate | fixNumber}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="实际毛利率：" v-bind:style="{ color: activeColor}" style="font-weight: bold;">
                            {{auditContentForm.scatteredActualRate | fixNumber}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预计提成金额：">
                            {{auditContentForm.estimatedRoyalties}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span style="color:#20a0ff;">审核意见</span>
            <el-form size="small" :model="auditOpinionForm" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="审核：">
                            <el-switch v-model="auditOpinionForm.auditStatus" active-color="#13ce66" inactive-color="#ff4949"
                                       active-value="PASS" inactive-value="NO_PASS"
                                       active-text="同意" inactive-text="拒绝" @change="changeBonusIncentiveFlag"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="是否奖金激励：">
                            <el-switch v-model="auditOpinionForm.bonusIncentiveFlag" active-color="#13ce66" inactive-color="#ff4949" :disabled="bonusIncentiveFlagDisabled"
                                       active-text="是" inactive-text="否"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="auditOpinionForm.auditRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAuditDetail = false">取 消</el-button>
                <el-button size="small" type="primary" @click="auditSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 报备 -->
        <el-dialog title="报备"  :visible.sync="showModifyDetail" width="50%" @close="resetModifyForm">
            <el-form size="small" :model="modifyOpinionForm" label-width="120px" ref="modifyOpinionForm">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="奖金激励：" prop="bonusIncentiveFlag" :rules="validate.required('奖金激励',true)">
                            <dictionary-select style="display: block" v-model="modifyOpinionForm.bonusIncentiveFlag" option-name="BONUSINCENTIVE_FLAG"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="modifyOpinionForm.reportRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showModifyDetail = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifySubmit">确 定</el-button>
            </span>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http,Api} from 'src/global'
    import {Validate} from 'src/global/validate'
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                validate: Validate,//校验
                Api: Api,
                isLoading: true,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    orgCode: this.$store.getters.user.orgCode,
                    customerCode: '',
                    waybillCode: '',
                    dispatchCode: '',
                    vehicleNature:'',
                    auditStatus: 'UNAUDITED',//审核状态
                    businessType: '',
                    auditStartTime: '',
                    auditEndTime: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                showAuditDetail: false,//审核窗口
                currentRow: null,//操作行的数据
                auditContentForm: {
                    dispatch:{
                        dispatchLine:{
                            startStation:{},
                            endStation:{}
                        },
                        dispatchVehicle:{vehicle:{}},
                        dispatchPrice: {}
                    },
                    scatteredTargetRate:null,
                    scatteredActualRate:null,
                    estimatedRoyalties:null

                },
                activeColor: '#13ce66',
                bonusIncentiveFlagDisabled: false,
                auditOpinionForm: {
                    auditStatus: 'PASS',
                    bonusIncentiveFlag: true,
                    auditRemark: ""
                },
                showModifyDetail: false,
                modifyOpinionForm: {
                    bonusIncentiveFlag:'',
                    reportRemark: ""
                }
            }
        },
        filters:{
            fixNumber: function (value) {
                value = Number(value);
                return value.toFixed(2)+'%';
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
            changeBonusIncentiveFlag(val){
                if(val === 'NO_PASS'){
                    this.auditOpinionForm.bonusIncentiveFlag = false;
                    this.bonusIncentiveFlagDisabled = true;
                }else if(val === 'PASS'){
                    this.bonusIncentiveFlagDisabled = false;
                }
            },
            //重置参数
            resetSearchParam() {
                this.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    orgCode: this.$store.getters.user.orgCode,
                    customerCode: '',
                    waybillCode: '',
                    dispatchCode: '',
                    vehicleNature:'',
                    auditStatus: 'UNAUDITED',//审核状态
                    businessType: '',
                    auditStartTime: '',
                    auditEndTime: ''
                }
            },
            //查询
            searchList() {
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.scatteredBusinessAudit.page,{ params : vm.searchParam }, result => {
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
            showAuditWindow(row){
                let vm = this;
                vm.auditContentForm = row;
                vm.activeColor = vm.auditContentForm.scatteredActualRate < vm.auditContentForm.scatteredTargetRate ? '#ff4949' : '#13ce66';
                vm.showAuditDetail = true;
            },
            auditSubmit(){
                let vm = this;
                vm.auditOpinionForm.id = vm.auditContentForm.id;
                Http.post(Api.scatteredBusinessAudit.audit,vm.auditOpinionForm, result => {
                    vm.showAuditDetail = false;
                    vm.$message.success('审批完成！');
                    vm.searchList();
                })
            },
            resetAuditForm(){
                let vm = this;
                vm.auditOpinionForm.auditStatus = 'PASS';
                vm.auditOpinionForm.auditRemark = '';
            },
            showModifyWindow(row){
                let vm = this;
                vm.showModifyDetail = true;
                vm.modifyOpinionForm.id = row.id;
                vm.modifyOpinionForm.dispatchCode = row.dispatch.code;
            },
            modifySubmit(){
                let vm = this;
                vm.$refs.modifyOpinionForm.validate((valid) => {
                    if(valid){
                        Http.post(Api.scatteredBusinessAudit.modify, vm.modifyOpinionForm, result => {
                            vm.showModifyDetail = false;
                            vm.$message.success('报备完成！');
                            vm.searchList();
                        })
                    }else {
                        vm.$message.error('奖金激励不能为空！');
                    }
                })
            },
            resetModifyForm(){
                let vm = this;
                vm.modifyOpinionForm.auditRemark = '';
            },
            showWayBill(row){ //运单详情------------------------------------
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
                // window.open(href, '_blank');
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}})
            }
        }
    }
</script>

