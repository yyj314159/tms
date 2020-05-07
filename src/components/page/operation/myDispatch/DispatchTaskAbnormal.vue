<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 发车计划</el-breadcrumb-item>
                <el-breadcrumb-item>任务异常</el-breadcrumb-item>
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
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineId" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车单号:">
                            <el-input  v-model="searchParam.dispatchCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="上报开始时间:">
                            <date-picker-single v-model="searchParam.startExpectDepartureTime" date-type="start" :end-date="searchParam.endExpectDepartureTime" :disabled-future-date="false"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="上报结束时间:">
                            <date-picker-single v-model="searchParam.endExpectDepartureTime" date-type="end" :start-date="searchParam.startExpectDepartureTime" :disabled-future-date="false"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="处理状态:">
                            <dictionary-select option-name="HANDLER_STATUS"
                                               v-model="searchParam.handlerStatus"
                                               style="display:block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="我的异常:">
                            <el-switch v-model="searchParam.selfFlag" active-color="#13ce66" inactive-color="#ff4949"
                                       :active-value="true" :inactive-value="false"
                                       active-text="是" inactive-text="否"></el-switch>
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

            <!--导出组件-->
            <export-button v-permission="'/taskException/export'" :href="Api.taskException.export" :params="searchParam" :download-name="'任务异常报表'"></export-button>

            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" prop="dispatchCode" label="派车单号" min-width="120"></el-table-column>
                <el-table-column header-align="center" prop="licenseNumber" label="车牌号" min-width="120"></el-table-column>
                <el-table-column header-align="center" prop="vehicleNature" label="车辆性质" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="scope.row.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>

                <el-table-column header-align="center" prop="type" label="异常原因" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="EXCEPTION_REASON" :value="scope.row.type"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" prop="remark" label="异常备注" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="handlerStatus" label="处理状态" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="HANDLER_STATUS" :value="scope.row.handlerStatus"></dictionary-select-name>
                    </template>
                </el-table-column>

                <el-table-column header-align="center" prop="regionOrgName" label="所属大区" min-width="120"></el-table-column>
                <el-table-column header-align="center" prop="belongOrgName" label="所属分区" min-width="120"></el-table-column>
                <el-table-column header-align="center" prop="customerName" label="客户" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="lineName" label="线路名称" min-width="240" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="sendTime" label="派车时间" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="expectDepartureTime" label="预计发车时间" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="driverName" label="司机" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.driverName}}({{scope.row.driverPhone}})
                    </template>
                </el-table-column>
                <el-table-column header-align="center" prop="carInviter" label="请车员" min-width="120"></el-table-column>
                <el-table-column header-align="center" prop="dispatchUser" label="派车人" min-width="120"></el-table-column>
                <el-table-column header-align="center" prop="startStationName" label="出发站点" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="overStationName" label="经停站点" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="endStationName" label="目的站点" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="reportUser" label="上报人" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="reportTime" label="上报时间" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="handledUser" label="处理人" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="handledTime" label="处理时间" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="handlerRemark" label="处理备注" min-width="140" show-overflow-tooltip></el-table-column>

                <el-table-column align="center" label="操作" fixed="left" min-width="140">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.handlerStatus==='ALREADY_HANDLED'" v-permission="'/taskException/handled'" type="text" size="mini" @click="showHandledForm(scope.row)">处理</el-button>
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

        <!-- 处理 -->
        <el-dialog title="任务异常处理"  :visible.sync="handledForm.dialogVisible" width="80%" @close="resetHandledForm">
            <el-form size="small" ref="handledForm" :model="handledForm" label-width="120px" >
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="线路名称：" prop="data.lineName">
                                {{handledForm.data.lineName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户名称：" prop="data.customerName">
                            {{handledForm.data.customerName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车牌号：" prop="data.licenseNumber">
                            {{handledForm.data.licenseNumber}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="车辆性质：" prop="data.vehicleNature">
                            <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                    :value="handledForm.data.vehicleNature"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="司机：" prop="data.driverName">
                            {{handledForm.data.driverName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="上报人：" prop="data.reportUser">
                            {{handledForm.data.reportUser}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="靠站签到时间：">
                            {{handledForm.data.againstStationConfirmTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="预计发车时间：" prop="data.showExpectDepartureTime">
                            {{handledForm.data.showExpectDepartureTime}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="异常备注：" prop="data.remark">
                            {{handledForm.data.remark}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="异常类型：" prop="data.type" :rules="[{required: true, message: '请选择异常类型',trigger: 'blur, change'}]">
                            <el-radio-group v-model="handledForm.data.type" size="small" @change="typeChange">
                                    <el-radio label="CUSTOMER_CANCEL" border>客户任务取消</el-radio>
                                    <el-radio label="EMPTY" border>放空车辆</el-radio>
                                    <el-radio label="REPEAT_TASK" border>重复任务</el-radio>
                                    <el-radio label="DELAY_DEPARTURE" border>压车未发</el-radio>
                                <el-radio label="ASSIGN_ERROR" border>指派错误</el-radio>
                                <el-radio label="DRIVER_CANCEL" border>司机放鸽子</el-radio>
                                <el-radio label="OTHER" border>其他</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <template v-if="handledForm.data.type==='CUSTOMER_CANCEL'||handledForm.data.type==='EMPTY'">
                    <el-row>
                        <el-col :span="11">
                            <el-form-item label="放空时间：" prop="data.emptyTime" :rules="[{required: handledForm.data.type==='CUSTOMER_CANCEL'||handledForm.data.type==='EMPTY', message: '请选择放空时间',trigger: 'blur, change'}]">
                                <el-date-picker style="display:block; width:100%;" v-model="handledForm.data.emptyTime"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                type="datetime" placeholder="选择日期时间"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="放空费：" prop="data.emptyAmount" :rules="[{required: handledForm.data.type==='CUSTOMER_CANCEL'||handledForm.data.type==='EMPTY', message: '请输入放空费',trigger: 'blur, change'},Validate.money]">
                                <el-input  :disabled="handledForm.emptyAmountDisabled"  v-model="handledForm.data.emptyAmount"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
                <template v-if="handledForm.data.type==='DELAY_DEPARTURE'">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="预计发车时间：" prop="data.expectDepartureTime" :rules="[{required: true, message: '请选择预计发车时间', trigger: 'blur,change'}]">
                                <el-date-picker style="display:block; width:100%;" v-model="handledForm.data.expectDepartureTime"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                type="datetime" placeholder="选择日期时间"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注：" prop="data.handlerRemark" :rules="[{required: handledForm.data.type==='ASSIGN_ERROR'||handledForm.data.type==='OTHER', message: '请输入备注',trigger: 'blur, change'}]" >
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="handledForm.data.handlerRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item  prop="data.tips" style="color: red">
                            {{handledForm.data.tips}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handledForm.dialogVisible = false">取 消</el-button>
                <el-button :disabled="handledForm.submitBtnDisabled" size="small" type="primary" @click="handledFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global/common'
    import {Validate} from 'src/global/validate'

    export default {
        data() {
            return {
                Api: Api,
                Validate: Validate,
                tableHeight: window.innerHeight>800?430:null,
                isLoading: true,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    orgCode: '',
                    dispatchCode: '',
                    vehicleCode: '',
                    startExpectDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 2*24*3600*1000),"YYYY-MM-DD 00:00:00"),//上报时间
                    endExpectDepartureTime: Common.date.dateFormat(new Date,"YYYY-MM-DD 23:59:59"),
                    lineId: '',
                    handlerStatus: 'WAIT_HANDLED',
                    selfFlag: false
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                handledForm: {
                    dialogVisible: false,
                    submitBtnDisabled: false,
                    emptyAmountDisabled: false,
                    data: {
                        id: '',
                        dispatchCode: '',
                        type: '',
                        handlerRemark: '',
                        againstStationConfirmTime: '',
                        emptyTime: '',
                        emptyAmount: '',
                        tips: '',
                        expectDepartureTime: '',
                        showExpectDepartureTime: '',
                        lineName: '',
                        customerName: '',
                        licenseNumber: '',
                        vehicleNature: '',
                        driverName: '',
                        reportUser: '',
                        remark: ''
                    },
                    pickerOptions: {
                        disabledDate(time) {
                            return time.getTime() > Date.now();
                        }
                    }
                }
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {
                this.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    orgCode: '',
                    dispatchCode: '',
                    vehicleCode: '',
                    startExpectDepartureTime: Common.date.dateFormat(new Date(new Date().getTime() - 3*24*3600*1000),"YYYY-MM-DD 00:00:00"),//上报时间
                    endExpectDepartureTime: Common.date.dateFormat(new Date,"YYYY-MM-DD 23:59:59"),
                    lineId: '',
                    handlerStatus: 'WAIT_HANDLED',
                    selfFlag: false
                }
            },
            searchList() {//查询
                this.isLoading  = true;
                Http.get(Api.taskException.page,{ params : this.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    this.isLoading = false;
                },()=>{
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
            showHandledForm(row){
                this.handledForm.data = Object.assign({}, this.handledForm.data, _.pick(row, _.keys(this.handledForm.data)));
                this.handledForm.data.showExpectDepartureTime = row.expectDepartureTime;
                if(row.vehicleNature === 'SELF_SUPPORT' || row.vehicleNature === 'OUTSOURCE'){
                    this.handledForm.emptyAmount = 0;
                    this.handledForm.emptyAmountDisabled = true;
                }
                this.handledForm.dialogVisible = true;
            },
            typeChange(){
                if(this.handledForm.emptyAmountDisabled){
                    this.handledForm.data.emptyAmount = 0;
                }else{
                    this.handledForm.data.emptyAmount = '';
                }
                this.handledForm.data.tips = '温馨提示:确定后将删除派车单';
                if(this.handledForm.data.type!=='CUSTOMER_CANCEL' && this.handledForm.data.type!=='EMPTY'){
                    this.handledForm.data.emptyTime = '';
                }
                if(this.handledForm.data.type!=='CUSTOMER_CANCEL' && this.handledForm.data.type!=='EMPTY' && this.handledForm.data.type!=='REPEAT_TASK'){
                    this.handledForm.data.tips = '';
                }
            },
            handledFormSubmit(){
                if(!this.handledForm.data.type){
                    this.$message.warning('未选择异常类型！');
                    return;
                }
                this.$refs.handledForm.validate((valid) => {
                    if (valid) {
                        this.handledForm.submitBtnDisabled = true;
                        Http.post(Api.taskException.handled,this.handledForm.data,() =>{
                            this.handledForm.submitBtnDisabled = false;
                            this.handledForm.dialogVisible = false;
                            this.searchList();
                        },()=>{
                            this.handledForm.submitBtnDisabled = false;
                        })
                    }
                });
            },
            resetHandledForm(){
                this.handledForm.data = {
                    id: '',
                    dispatchCode: '',
                    type: '',
                    handlerRemark: '',
                    againstStationConfirmTime: '',
                    emptyTime: '',
                    emptyAmount: '',
                    tips: '',
                    expectDepartureTime: '',
                    showExpectDepartureTime: '',
                    lineName: '',
                    customerName: '',
                    licenseNumber: '',
                    vehicleNature: '',
                    driverName: '',
                    reportUser: '',
                    remark: ''
                }
                this.handledForm.emptyAmountDisabled = false;
                this.$refs.handledForm.clearValidate();
            }
        }
    }
</script>

