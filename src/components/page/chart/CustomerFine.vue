<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item>异常管理</el-breadcrumb-item>
                <el-breadcrumb-item>客户罚款</el-breadcrumb-item>
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
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.belongOrgCode" style="display: block"></current-org-select>
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
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input v-model="searchParam.waybillCode" style="display:block" clearable></el-input>
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
            <el-button size="mini" type="primary" v-permission="'/receiveConfirm/modifyQualityDeductionsAmount'" icon="el-icon-plus" @click="addReceiveConfirmForm">新增</el-button>
            <el-button v-if="downloadLoading" icon="el-icon-download" type="primary" size="mini"
                       v-permission="'/receiveConfirm/customerDownload'"
                       @click="templateDownload">模板下载
            </el-button>
           <upload-excel :importUrl="Api.receiveConfirm.customerFinesUpload" v-permission="'/receiveConfirm/customerUpload'" btn-name="导入"  style="display: inline-block; margin-left: 10px;" @success="uploadSuccess"></upload-excel>
            <el-button v-if="exportLoading" v-permission="'/customerFine/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="运单编号" min-width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="客户" prop="customerAllName" show-overflow-tooltip min-width="120px"></el-table-column>
                <el-table-column align="center" label="大区" prop="regionName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="小区" prop="belongOrgName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算运费" prop="settlementAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="质量扣款" prop="qualityDeductionsAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="时效扣款" prop="tmsQualityDeductionsAmount" min-width="120px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="安全扣款" prop="securityDeductionsAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="其他扣款" prop="otherDeductionsAmount" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="lineName" show-overflow-tooltip min-width="240px"></el-table-column>
                <el-table-column align="center" label="车辆属性" prop="vehicleNature" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车牌号" prop="vehicleLicenseNum" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="挂厢号" prop="trailerLicenseNum" min-width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" header-align="center" label="操作" fixed="right" min-width="110">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" v-permission="'/receiveConfirm/modifyQualityDeductionsAmount'" @click="modifyQualityDeductionsAmount(scope.row)">修改</el-button>
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

        <!--新增彈出框-->
        <el-dialog :title="addCustomerFineDialogTitle" :visible.sync="showAddCustomerFineDialog" width="40%" @close="resetEditReceiveConfirmForm">
            <el-form size="small" :model="editReceiveConfirmForm" ref="editReceiveConfirmForm" label-width="30%">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="运单编号：" prop="waybillCode" :rules="[validate.required('请输入运单号！',true)]">
                            <el-input v-model="editReceiveConfirmForm.waybillCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="22">
                        <el-form-item label="时效扣款：" prop="tmsQualityDeductionsAmount" :rules="[validate.required('请输入时效扣款！',true), validate.negativeMoney]">
                            <el-input v-model="editReceiveConfirmForm.tmsQualityDeductionsAmount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="resetEditReceiveConfirmForm">取 消</el-button>
                <el-button size="small" type="primary" @click="editReceiveConfirmFormSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http,Api,Common,Constant} from 'src/global'
    import {Validate} from 'src/global/validate'
    import axios from 'axios'

    export default {
        data() {
            return {
                Api: Api,
                Constant: Constant,
                validate: Validate,
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    startActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    belongOrgCode: '',
                    customerCode: '',
                    waybillCode: '',
                },
                isLoading: true,
                downloadLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true,
                addCustomerFineDialogTitle: '新增时效扣款',
                showAddCustomerFineDialog: false,
                editReceiveConfirmForm: {
                    waybillCode: '',
                    tmsQualityDeductionsAmount: '',
                },
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            // 下载模板
            templateDownload(){
                let vm = this;
                vm.downloadLoading = false;
                axios.get(Api.receiveConfirm.customerFinesDownload, {responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '客户罚款导入模板.xls';
                    link.click();
                    vm.downloadLoading = true;
                }).catch(reason => {
                    vm.downloadLoading = true;
                })
            },
            addReceiveConfirmForm() {
                let vm = this;
                vm.addCustomerFineDialogTitle = '新增时效扣款';
                vm.showAddCustomerFineDialog = true;
                vm.editReceiveConfirmForm = {
                    waybillCode: '',
                    tmsQualityDeductionsAmount: '',
                };
            },
            resetAddCustomerFineDialog() {
                let vm = this;
                vm.addCustomerFineDialogTitle = '新增时效扣款';
                vm.showAddCustomerFineDialog = true;
                vm.editReceiveConfirmForm = {
                    waybillCode: '',
                    tmsQualityDeductionsAmount: '',
                };
            },
            resetEditReceiveConfirmForm() {
                let vm = this;
                vm.addCustomerFineDialogTitle = '新增时效扣款';
                vm.showAddCustomerFineDialog = false;
                vm.editReceiveConfirmForm = {
                    waybillCode: '',
                    tmsQualityDeductionsAmount: '',
                };
            },
            modifyQualityDeductionsAmount(row) {
                let vm = this;
                vm.addCustomerFineDialogTitle = '修改时效扣款';
                vm.showAddCustomerFineDialog = true;
                vm.editReceiveConfirmForm.waybillCode = row.waybillCode;
                vm.editReceiveConfirmForm.tmsQualityDeductionsAmount = row.tmsQualityDeductionsAmount;
            },
            editReceiveConfirmFormSubmit() {
                let vm = this;
                vm.$refs.editReceiveConfirmForm.validate((valid)=> {
                    if (valid) {
                        Http.post(Api.receiveConfirm.modifyQualityDeductionsAmount,vm.editReceiveConfirmForm, result => {
                            vm.$message.success(vm.addCustomerFineDialogTitle + '成功！');
                            vm.resetEditReceiveConfirmForm();
                            vm.searchList();
                        },err => {
                            vm.$message.error(vm.addCustomerFineDialogTitle + '失败！' + err.message);
                            vm.resetEditReceiveConfirmForm();
                        });
                    }
                })
            },
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    startActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),//发车时间
                    endActualDepartureTime: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    belongOrgCode: '',
                    customerCode: '',
                    waybillCode: '',
                };
            },
            searchList() {//查询
                let vm = this;
                if(!this.searchParam.startActualDepartureTime && !this.searchParam.endActualDepartureTime){
                    return this.$message.warning('请输入时间进行查询！')
                }
                vm.isLoading = true;
                Http.get(Api.customerFine.page,{ params : vm.searchParam }, result => {
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
            showWayBill(row){ //运单详情------------------------------------
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
                // window.open(href, '_blank');
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
            },
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.customerFine.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '客户罚款报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            uploadSuccess() {
                let vm = this;
                vm.searchList();
            },
        }
    }
</script>
