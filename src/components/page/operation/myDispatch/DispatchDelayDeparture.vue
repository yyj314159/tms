<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 发车计划</el-breadcrumb-item>
                <el-breadcrumb-item>压车未发</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
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
                        <el-form-item label="上报时间开始:">
                            <date-picker-single v-model="searchParam.startReportTime" date-type="start" :end-date="searchParam.endReportTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="上报时间结束:">
                            <date-picker-single v-model="searchParam.endReportTime" date-type="end" :start-date="searchParam.startReportTime"></date-picker-single>
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
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预计发车开始:">
                            <date-picker-single v-model="searchParam.startExpectDepartureTime" date-type="start" :end-date="searchParam.endExpectDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预计发车结束:">
                            <date-picker-single v-model="searchParam.endExpectDepartureTime" date-type="end" :start-date="searchParam.startExpectDepartureTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="派车单号:">
                            <el-input  v-model="searchParam.dispatchCode"></el-input>
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
            <export-button v-permission="'/dispatchDelayDeparture/export'" :href="Api.dispatchDelayDeparture.export" :params="searchParam" :download-name="'压车未发报表'"></export-button>

            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" prop="dispatchCode" label="派车单号" min-width="120"></el-table-column>
                <el-table-column header-align="center" prop="licenseNumber" label="车牌号" min-width="120"></el-table-column>
                <el-table-column header-align="center" prop="vehicleNature" label="车辆性质" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="scope.row.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" prop="remark" label="备注" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="regionOrgName" label="所属大区" min-width="120"></el-table-column>
                <el-table-column header-align="center" prop="belongOrgName" label="所属分区" min-width="120"></el-table-column>
                <el-table-column header-align="center" prop="customerName" label="客户" min-width="120"></el-table-column>
                <el-table-column header-align="center" prop="lineName" label="线路名称" min-width="240" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" prop="sendTime" label="派车时间" min-width="140"></el-table-column>
                <el-table-column header-align="center" prop="expectDepartureTime" label="预计发车时间" min-width="140"></el-table-column>
                <el-table-column header-align="center" prop="againstStationConfirmTime" label="司机签到时间" min-width="140"></el-table-column>
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
                <el-table-column header-align="center" prop="createUser" label="上报人" min-width="120"></el-table-column>
                <el-table-column header-align="center" prop="createTime" label="上报时间" min-width="140"></el-table-column>
                <el-table-column align="center" label="操作" fixed="left" min-width="140">
                    <template slot-scope="scope">
                        <el-button v-permission="'/dispatchDelayDeparture/modify'" type="text" size="mini" @click="showModifyForm(scope.row)">修改</el-button>
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

        <!-- 修改 -->
        <el-dialog title="修改预计发车时间"  :visible.sync="modifyForm.dialogVisible" width="40%" @close="resetModifyForm">
            <el-form size="small" ref="modifyForm" :model="modifyForm" label-width="20%">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="派车单号：">
                            {{modifyForm.data.dispatchCode}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="预计发车时间：" prop="data.expectDepartureTime" :rules="[{required: true, message: '请选择预计发车时间', trigger: 'blur,change'}]">
                            <el-date-picker style="display:block; width:100%;" v-model="modifyForm.data.expectDepartureTime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            type="datetime" placeholder="选择日期时间" :picker-options="modifyForm.pickerOptions"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="modifyForm.dialogVisible = false">取 消</el-button>
                <el-button :disabled="modifyForm.submitBtnDisabled" size="small" type="primary" @click="modifyFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'

    export default {
        data() {
            return {
                Api: Api,
                tableHeight: window.innerHeight>800?430:null,
                isLoading: true,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    orgCode: '',
                    dispatchCode: '',
                    vehicleCode: '',
                    startExpectDepartureTime: '',//预计发车时间
                    endExpectDepartureTime: '',
                    startReportTime: '',//上报时间
                    endReportTime: '',
                    lineId: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                modifyForm: {
                    dialogVisible: false,
                    submitBtnDisabled: false,
                    data: {
                        id: '',
                        dispatchCode: '',
                        expectDepartureTime: ''
                    },
                    pickerOptions: {
                        disabledDate(time) {
                            return time.getTime() < Date.now();
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
                    startExpectDepartureTime: '',//申请时间
                    endExpectDepartureTime: '',
                    startReportTime: '',
                    endReportTime: '',
                    lineId: ''
                }
            },
            searchList() {//查询
                this.isLoading  = true;
                Http.get(Api.dispatchDelayDeparture.page,{ params : this.searchParam }, result => {
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
            showModifyForm(row){
                this.modifyForm.data = Object.assign({}, this.modifyForm.data, _.pick(row, _.keys(this.modifyForm.data)));
                this.modifyForm.data.expectDepartureTime = '';
                this.modifyForm.dialogVisible = true;
            },
            modifyFormSubmit(){
                this.$refs.modifyForm.validate((valid) => {
                    if (valid) {
                        this.modifyForm.submitBtnDisabled = true;
                        Http.post(Api.dispatchDelayDeparture.modify,this.modifyForm.data,() =>{
                            this.modifyForm.submitBtnDisabled = false;
                            this.modifyForm.dialogVisible = false;
                            this.searchList();
                        },()=>{
                            this.modifyForm.submitBtnDisabled = false;
                        })
                    }
                });
            },
            resetModifyForm(){
                this.modifyForm.data = {
                    id: '',
                    dispatchCode: '',
                    expectDepartureTime: ''
                }
                this.$refs.modifyForm.clearValidate();
            }
        }
    }
</script>

