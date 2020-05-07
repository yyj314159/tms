<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 设备管理</el-breadcrumb-item>
                <el-breadcrumb-item>ETC消费记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="ETC卡号:">
                            <el-input v-model="searchParam.cardCode" style="display: block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="消费时间:">
                            <el-date-picker
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width: 100%;"
                                v-model="searchParam.consumerTime"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :clearable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属分区:">
                            <el-input v-model="searchParam.belongOrgCode" style="display: block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="导入时间:">
                            <el-date-picker
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width: 100%;"
                                v-model="searchParam.createTime"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :clearable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="账单月份:">
                            <el-input v-model="searchParam.billMonth" style="display: block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input type="text" v-model="searchParam.licenseNumber" :clearable="true"
                                      :settlementMode="Constant.SETTLEMENT_MODE_TYPE.NO_LONG_TERM_OUT_INVITE"  placeholder="请输入车牌号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆性质:">
                            <dictionary-select v-model="searchParam.vehicleModel"
                                               option-name="VEHICLE_OPERATION_MODE"
                                               style="display: block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float:right" label-width="0">
                            <el-button type="success" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchList()">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetWinform">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <div style="display: inline-flex;">
                <el-button icon="el-icon-download" type="primary" size="mini" style="margin-right: 8px;"
                           v-permission="'/etcConsumeRecord/download'"
                           @click="Common.templateDownload.getExcel(Api.etcConsumerRecord.getExcel,'ETC消费记录导入模板')">模板下载
                </el-button>
                <upload-excel v-permission="'/etcRecord/upload'" :importUrl="Api.etcConsumerRecord.upload"
                              @success="uploadSuccess" btn-name="导入" style="margin-right: 5px;"></upload-excel>
                <el-button v-if="exportLoading" v-permission="'/etcConsumeRecord/export'" icon="el-icon-download"
                           type="primary" size="mini" @click="exportList">导出
                </el-button>
                <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
                </el-button>
            </div>
            <el-table class="content-table" element-loading-text="拼命加载中"
                      :data="searchResult.result"
                      border fit
                      highlight-current-row stripe
                      @selection-change="handleSelectionChange"
                      size="small">
                <el-table-column label="卡号" prop="cardCode" min-width="200" show-overflow-tooltip/>
                <el-table-column label="所属分区" prop="belongOrgCode" min-width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="车辆" prop="vehicleCode" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="车辆性质" prop="vehicleModel" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                :value="scope.row.vehicleModel"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="供应商" prop="supplierCode" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="ETC_SUPPILER"
                                                :value="scope.row.supplierCode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="自营模式" prop="supportModel">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SELF_OPERATION_MODE"
                                                :value="scope.row.supportModel"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="平台公司" prop="platformCompanyName" width="200px;"></el-table-column>
                <el-table-column label="结算模式" prop="settlementMode" min-width="160">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SETTLEMENT_MODE"
                                                :value="scope.row.settlementMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="消费金额" prop="balanceAmount" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="消费时间" prop="consumerTime" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="消费地点" prop="consumerArea" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="导入时间" prop="createTime" min-width="150" show-overflow-tooltip/>
                <el-table-column label="账单月份" prop="billMonth" min-width="150" show-overflow-tooltip/>
            </el-table>
            <!--分页-->
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
    import axios from 'axios'
    import DataDictionarySelect from "../../../common/select/DataDictionarySelect";

    export default {
        components: {DataDictionarySelect, Common},
        data() {
            return {
                Constant:Constant,
                Api: Api,
                downloadLoading: true,
                downloadUrl: Api.etcConsumerRecord.getExcel,
                Common: Common,
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    cardCode: '',
                    startTime: '',
                    endTime: '',
                    consumerTime: [],
                    belongOrgCode: '',
                    vehicleModel: '',
                    supportModel: '',
                    balanceAmount: undefined,
                    billMonth: '',
                    createTime: [],
                    startCreateTime: '',
                    endCreateTime: '',
                    licenseNumber: '',
                    settlementMode:'NO_LONG_TERM_OUT_INVITE',
                    originType:'TMS'
                },//返回结果
                exportLoading: true,
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],

            }
        },
        mounted() {
            this.searchList();
        },
        methods: {
            //通用
            handleCurrentChange(val) {
                let vm = this
                vm.searchParam.currentPage = val
                this.searchList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            handleSizeChange(val) {
                let vm = this
                vm.searchParam.pageSize = val
                this.searchList()
            },
            //查询
            searchList() {
                let vm = this;
                if (vm.searchParam.settlementMode==''||vm.searchParam.settlementMode==null){
                    vm.searchParam.settlementMode='NO_LONG_TERM_OUT_INVITE';
                }
                if (vm.searchParam.originType==''||vm.searchParam.originType==null||vm.searchParam.originType!='TMS'){
                    vm.searchParam.originType='TMS';
                }
                if (this.searchParam.consumerTime.length > 0) {
                    this.searchParam.startTime = this.searchParam.consumerTime[0];
                    this.searchParam.endTime = this.searchParam.consumerTime[1];
                }
                if (this.searchParam.createTime.length > 0) {
                    this.searchParam.startCreateTime = this.searchParam.createTime[0];
                    this.searchParam.endCreateTime = this.searchParam.createTime[1];
                }
                Http.get(Api.etcConsumerRecord.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result
                    vm.searchResult.totalCount = result.totalCount
                    vm.searchParam.currentPage = result.currentPage
                    vm.searchParam.pageSize = result.pageSize
                })
            },
            resetWinform() {
                let vm = this;
                vm.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    cardCode: '',
                    consumerTime: '',
                    belongOrgCode: '',
                    vehicleModel: '',
                    balanceAmount: undefined,
                    billMonth: '',
                    createTime: [],
                    startCreateTime: '',
                    endCreateTime: '',
                    settlementMode:'NO_LONG_TERM_OUT_INVITE',
                    originType:'TMS'
                }
            },
            uploadSuccess() {
                let vm = this;
                vm.searchList();
            },
            templateDownload() {
                Common.excel.downloadExl([], ["ETC卡号", "所属分区", "车辆", "供应商", "车辆模型", "自营模式", "消费金额",
                    "消费时间", "消费地点"], null, 'ETC消费记录导入模板');
            },
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.etcConsumerRecord.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = 'etc消费导出.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
        }
    }
</script>
