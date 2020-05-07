<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 合作应付</el-breadcrumb-item>
                <el-breadcrumb-item>合作车价</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户名称:">
                            <customer-select v-model="searchParam.customerCode" style="display: block;"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="月份:">
                            <el-date-picker v-model="searchParam.month" type="month" style="display: block; width:100%;" value-format="yyyy-MM" placeholder="选择月"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineId" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否确认:">
                            <dictionary-select option-name="FLAG" v-model="searchParam.confirmFlag" style="display: block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select option-name="AUDIT_STATUS"  v-model="searchParam.auditStatus" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">

            <el-button v-if="btnLoading" v-permission="'/dispatchPriceConfirm/export'" size="mini" type="primary" icon="el-icon-download" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>

            <el-button v-permission="'/dispatchPriceConfirm/templateDownload'" size="mini" type="primary" icon="el-icon-download" @click="templateDownload">导入模板下载</el-button>
            <upload-excel v-permission="'/dispatchPriceConfirm/upload'" :importUrl="Api.dispatchPriceConfirm.upload" @success="uploadSuccess" btn-name="导入合作车价" style="display: inline-block; margin-left: 10px;"></upload-excel>

            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="客户名称" prop="line.customer.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="所属大区" prop="region.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="org.name" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="月份" prop="month" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="线路Id" prop="lineId" min-width="240" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="line.name" min-width="240" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车牌号" prop="vehicleLicenseNumber" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="运单数量" prop="waybillNum" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="应付车价" prop="paidAmount" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="是否确认" prop="confirmFlag" min-width="140">
                    <template slot-scope="scope">{{scope.row.confirmFlag?'已确认':'未确认'}}</template>
                </el-table-column>
                <el-table-column header-align="center" label="确认人" prop="confirmUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="确认时间" prop="confirmTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核状态" prop="auditStatus" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" :value="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核人" prop="auditUser" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="审核意见" prop="auditRemark" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核时间" prop="auditTime" min-width="160"></el-table-column>
                <el-table-column align="center" label="操作" fixed="left" min-width="260">
                    <template slot-scope="scope">
                        <el-button v-permission="'/dispatchPriceConfirm/confirm'"
                                   :disabled="scope.row.confirmFlag || !!scope.row.auditStatus"
                                   size="mini" type="text" @click="showConfirm(scope.row.id)">确认</el-button>

                        <el-button v-permission="'/dispatchPriceConfirm/modify'"
                                   :disabled="scope.row.confirmFlag || scope.row.auditStatus === Constant.AUDIT_STATUS.PASS"
                                   size="mini" type="text" @click="showModify(scope.row.id)">修改</el-button>

                        <el-button v-permission="'/dispatchPriceConfirm/audit'"
                                   :disabled="scope.row.confirmFlag || scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED"
                                   size="mini" type="text" @click="showAudit(scope.row.id)">审核</el-button>

                        <el-button v-permission="'/dispatchPriceConfirm/delete'"
                                   :disabled="scope.row.confirmFlag || scope.row.auditStatus === Constant.AUDIT_STATUS.PASS"
                                   size="mini" type="text" @click="deleteRow(scope.row.id)">删除</el-button>

                        <el-button v-permission="'/dispatchPriceConfirm/modifyConfirm'"
                                   :disabled="!scope.row.confirmFlag && scope.row.auditStatus !== Constant.AUDIT_STATUS.PASS"
                                   size="mini" type="text" @click="showModifyConfirm(scope.row.id)">修改确认</el-button>
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

        <!--确认-->
        <el-dialog title="应付车价确认"  :visible.sync="showConfirmDialog" width="55%" @close="resetConfirmForm">
            <el-form size="small" :model="confirmForm" ref="confirmForm" label-width="35%">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所属大区：">
                            {{confirmForm.region.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属分区：">
                            {{confirmForm.org.name}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="线路名称：">
                            {{confirmForm.line.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="月份：">
                            {{confirmForm.month}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车牌号：">
                            {{confirmForm.vehicleLicenseNumber}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应付车价：">
                            {{confirmForm.paidAmount}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showConfirmDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confirmSubmit">确 认</el-button>
            </span>
        </el-dialog>

        <!--修改-->
        <el-dialog title="应付车价修改"  :visible.sync="showModifyDialog" width="55%" @close="resetModifyForm">
            <el-form size="small" :model="modifyForm" ref="modifyForm" label-width="35%">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所属大区：">
                            {{modifyForm.region.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属分区：">
                            {{modifyForm.org.name}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="线路名称：">
                            {{modifyForm.line.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="月份：">
                            {{modifyForm.month}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车牌号：">
                            {{modifyForm.vehicleLicenseNumber}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应付车价：" prop="paidAmount" :rules="[Validate.required('应付车价',true),Validate.money]">
                            <el-input v-model="modifyForm.paidAmount" style="width:60%;" placeholder="元"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showModifyDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifySubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 应付车价修改确认 -->
        <el-dialog title="应付车价修改确认"  :visible.sync="showModifyConfirmDialog" width="55%" @close="resetModifyForm">
            <el-form size="small" :model="modifyForm" ref="modifyForm" label-width="35%">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所属大区：">
                            {{modifyForm.region.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属分区：">
                            {{modifyForm.org.name}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="线路名称：">
                            {{modifyForm.line.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="月份：">
                            {{modifyForm.month}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车牌号：">
                            {{modifyForm.vehicleLicenseNumber}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应付车价：" prop="paidAmount" :rules="[Validate.required('应付车价',true),Validate.money]">
                            <el-input v-model="modifyForm.paidAmount" style="width:60%;" placeholder="元"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showModifyConfirmDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyConfirmSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!--审核-->
        <el-dialog title="应付车价审核"  :visible.sync="showAuditDialog" width="55%" @close="resetAuditForm">
            <el-form size="small" :model="auditForm" ref="auditForm" label-width="35%">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所属大区：">
                            {{auditForm.region.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属分区：">
                            {{auditForm.org.name}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="线路名称：">
                            {{auditForm.line.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="月份：">
                            {{auditForm.month}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车牌号：">
                            {{auditForm.vehicleLicenseNumber}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应付车价：">
                            {{auditForm.paidAmount}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="审核：" label-width="15%">
                            <el-switch v-model="auditForm.auditStatus" active-color="#13ce66" inactive-color="#ff4949"
                                       :active-value="Constant.AUDIT_STATUS.PASS" :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                       active-text="同意" inactive-text="拒绝"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="备注：" label-width="15%">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="auditForm.auditRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAuditDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="auditSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Validate} from 'src/global/validate'
    import {Constant} from 'src/global/constant'
    import axios from 'axios'

    export default {
        data() {
            return {
                Api: Api,
                isLoading: true,
                showConfirmDialog: false,
                showModifyDialog: false,
                showAuditDialog: false,
                showModifyConfirmDialog: false,
                Constant:Constant,
                Validate: Validate,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    lineId: '',
                    vehicleCode: '',
                    confirmFlag: '',
                    month: '',
                    orgCode: '',//所属区域
                    auditStatus: '',
                    customerCode: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                confirmForm:{//确认
                    id: '',
                    region: {
                        name: ''
                    },
                    org: {
                        name: ''
                    },
                    line: {
                        name: ''
                    },
                    vehicleLicenseNumber: '',
                    month: '',
                    paidAmount: ''
                },
                modifyForm:{//修改
                    id: '',
                    region: {
                        name: ''
                    },
                    org: {
                        name: ''
                    },
                    line: {
                        name: ''
                    },
                    vehicleLicenseNumber: '',
                    month: '',
                    paidAmount: ''
                },
                auditForm:{//审核
                    id: '',
                    region: {
                        name: ''
                    },
                    org: {
                        name: ''
                    },
                    line: {
                        name: ''
                    },
                    vehicleLicenseNumber: '',
                    month: '',
                    paidAmount: '',
                    auditStatus: Constant.AUDIT_STATUS.PASS,
                    auditRemark: ''
                },
                btnLoading: true
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    lineId: '',
                    vehicleCode: '',
                    confirmFlag: '',
                    month: '',
                    orgCode: '',//所属区域
                    auditStatus: '',
                    customerCode: ''
                }
            },
            searchList() {//查询
                this.isLoading = true;
                Http.get(Api.dispatchPriceConfirm.page,{ params : this.searchParam }, result => {
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
            //确认
            showConfirm(id){
                Http.get(Api.dispatchPriceConfirm.queryById,{ params : {'id':id} }, result => {
                    this.confirmForm = result.result;
                    this.showConfirmDialog = true;
                })
            },
            confirmSubmit(){
                Http.post(Api.dispatchPriceConfirm.confirm, this.confirmForm, result => {
                    this.$message.success('应付车价确认成功！');
                    this.showConfirmDialog = false;
                    this.searchList();
                })
            },
            resetConfirmForm(){
                this.confirmForm = {
                    region: {
                        name: ''
                    },
                    org: {
                        name: ''
                    },
                    line: {
                        name: ''
                    },
                    vehicle: {
                        vehicleLicenseNumber: ''
                    },
                    month: '',
                    paidAmount: ''
                }
            },
            //修改
            showModify(id){
                Http.get(Api.dispatchPriceConfirm.queryById,{ params : {'id':id} }, result => {
                    this.modifyForm = result.result;
                    this.showModifyDialog = true;
                })
            },
            //修改
            showModifyConfirm(id){
                Http.get(Api.dispatchPriceConfirm.queryById,{ params : {'id':id} }, result => {
                    this.modifyForm = result.result;
                    this.showModifyConfirmDialog = true;
                })
            },
            modifySubmit(){
                this.$refs.modifyForm.validate((valid)=>{
                    if(valid){
                        Http.post(Api.dispatchPriceConfirm.modify, this.modifyForm, result => {
                            this.$message.success('应付车价修改成功！');
                            this.showModifyDialog = false;
                            this.searchList();
                        })
                    }
                });
            },
            modifyConfirmSubmit() {
                this.$refs.modifyForm.validate((valid)=>{
                    if(valid){
                        Http.post(Api.dispatchPriceConfirm.modifyConfirm, this.modifyForm, result => {
                            this.$message.success('应付车价修改确认成功！');
                            this.showModifyConfirmDialog = false;
                            this.searchList();
                        })
                    }
                });
            },
            resetModifyForm(){
                this.modifyForm = {
                    region: {
                        name: ''
                    },
                    org: {
                        name: ''
                    },
                    line: {
                        name: ''
                    },
                    vehicle: {
                        vehicleLicenseNumber: ''
                    },
                    month: '',
                    paidAmount: ''
                }
            },
            //审核
            showAudit(id){
                Http.get(Api.dispatchPriceConfirm.queryById,{ params : {'id':id} }, result => {
                    this.auditForm = result.result;
                    this.auditForm.auditStatus = this.Constant.AUDIT_STATUS.PASS;
                    this.showAuditDialog = true;
                })
            },
            auditSubmit(){
                Http.post(Api.dispatchPriceConfirm.audit, this.auditForm, result => {
                    this.$message.success('应付车价审核成功！');
                    this.showAuditDialog = false;
                    this.searchList();
                })
            },
            resetAuditForm(){
                this.auditForm = {//审核
                    id: '',
                    region: {
                        name: ''
                    },
                    org: {
                        name: ''
                    },
                    line: {
                        name: ''
                    },
                    vehicleLicenseNumber: '',
                    month: '',
                    paidAmount: '',
                    auditStatus: this.Constant.AUDIT_STATUS.PASS,
                    auditRemark: ''
                }
            },
            //删除
            deleteRow(id){
                this.$confirm('删除本条数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.dispatchPriceConfirm.delete, [id], result => {
                        this.$message.success('删除成功！');
                        this.searchList();
                    })
                })
            },
            exportList(){
                let vm = this;
                vm.btnLoading = false;
                axios.get(Api.dispatchPriceConfirm.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '合作车价.xls';
                    link.click();
                    vm.btnLoading = true;
                }).catch(reason => {
                    vm.btnLoading = true;
                })
            },
            templateDownload() {
                let vm = this;
                vm.btnLoading = false;
                axios.get(Api.dispatchPriceConfirm.templateDownload, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '合作车价模板.xls';
                    link.click();
                    vm.btnLoading = true;
                }).catch(reason => {
                    vm.btnLoading = true;
                })
            },
            uploadSuccess(){
                let vm = this;
                vm.searchList();
            },
        }
    }
</script>

