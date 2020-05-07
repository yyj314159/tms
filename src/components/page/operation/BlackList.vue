<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 运力管理</el-breadcrumb-item>
                <el-breadcrumb-item>黑名单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" style="height: 90px;">
            <el-form label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select style="display: block" v-model="searchParam.vehicleNo"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="类型:">
                            <dictionary-select v-model="searchParam.type"
                                               option-name="BLACKLIST_TYPE" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierId" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机:">
                            <driver-select v-model="searchParam.driverId" style="display: block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select v-model="searchParam.auditStatus"
                                               option-name="BLACKlIST_AUDIT_STATUS" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="申请开始时间:">
                            <date-picker-single v-model="searchParam.startCreateTime" date-type="start"
                                                :end-date="searchParam.endCreateTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="申请结束时间:">
                            <date-picker-single v-model="searchParam.endCreateTime" date-type="end"
                                                :start-date="searchParam.startCreateTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float:right" label-width="0">
                            <el-button type="success" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchBlackList()">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetWinform">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addBlackList"
                       v-permission="'/blackList/add'">新增
            </el-button>
            <!--<el-button size="mini" type="primary" icon="el-icon-view" @click="auditList"-->
            <!--v-permission="'/blackList/audit'">审核-->
            <!--</el-button>-->
            <el-button v-if="btnLoading" v-permission="'/blackList/export'" size="mini" type="primary"
                       icon="el-icon-download" @click="exportData">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" class="content-table" element-loading-text="拼命加载中"
                      :data="searchResult.result"
                      border fit
                      highlight-current-row stripe
                      @selection-change="handleSelectionChange"
                      size="small"
                      :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" align="center" label="操作" fixed="left" width="120px;">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-view" @click="queryById(scope.row)"
                                   v-permission="'/blackList/audit'">审核
                        </el-button>
                        <el-button type="text" icon="el-icon-edit" size="mini"
                                   @click="modifyBlackList(scope.row)" v-permission="'/blackList/modify'"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini"
                                   @click="deleteList(scope.row)" v-permission="'/blackList/delete'"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="类型" prop="type" width="120px;"></el-table-column>
                <el-table-column label="车牌" prop="licenseNumber" width="120px;"></el-table-column>
                <el-table-column label="供应商/车主" prop="supplierOrVehicle" width="150px;"
                                 showOverflowTooltip></el-table-column>
                <el-table-column label="银行卡号/身份证" prop="idCardNoOrDueBankCardNo" width="150px;"
                                 showOverflowTooltip></el-table-column>
                <el-table-column label="联系方式" prop="contactWay" width="120px;" showOverflowTooltip></el-table-column>
                <el-table-column label="司机" prop="driverName" width="120px;" showOverflowTooltip></el-table-column>
                <el-table-column label="司机身份证" prop="driverIdCardNo" width="150px;"></el-table-column>
                <el-table-column label="司机联系方式" prop="driverMobile" width="120px;"></el-table-column>
                <el-table-column label="拉黑原因" prop="reason" width="200px;" showOverflowTooltip/>
                <el-table-column label="附件" prop="attachment" width="120px;" showOverflowTooltip>
                    <template slot-scope="scope">
                        <show-image-and-file :url="scope.row.attachment"></show-image-and-file>
                    </template>
                </el-table-column>
                <el-table-column label="申请区域" prop="createOrgCode" width="100px;"></el-table-column>
                <el-table-column label="申请人" prop="createUser" width="150px;" showOverflowTooltip></el-table-column>
                <el-table-column label="申请时间" prop="createTime" width="150px;" showOverflowTooltip></el-table-column>
                <el-table-column label="审核状态" prop="auditStatus" width="100px;" showOverflowTooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="BLACKlIST_AUDIT_STATUS" :value="scope.row.auditStatus"/>
                    </template>
                </el-table-column>
                <el-table-column label="审核人" prop="auditUser" width="150px;" showOverflowTooltip></el-table-column>
                <el-table-column label="审核区域" prop="auditOrgCode" showOverflowTooltip></el-table-column>
                <el-table-column label="审核时间" prop="auditTime" width="150px;" showOverflowTooltip></el-table-column>
                <el-table-column label="审核备注" prop="auditRemarks" width="150px;" showOverflowTooltip></el-table-column>
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
        <el-dialog title="新增黑名单" :visible.sync="addBlackListWin" width="800px" :before-close="handleClose">
            <el-form inline size="small" :model="addVehicleWinForm" label-width="150px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型">
                            <dictionary-select option-name="BLACKLIST_TYPE" v-model="addVehicleWinForm.type">
                            </dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车牌号:" prop="vehicleNo" v-show="addVehicleWinForm.type==='vehicleId'">
                            <vehicle-select v-model="addVehicleWinForm.licenseNumber" ref="VehiclelicenseNumber"
                                            @change-option="Vehiclechange"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="司机:" prop="dirverId" v-show="addVehicleWinForm.type==='driverId'">
                            <driver-select v-model="addVehicleWinForm.driverId" @driver="selectDriver">
                            </driver-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供应商:" prop="supplierId" v-show="addVehicleWinForm.type==='supplierId'">
                            <supplier-select v-model="addVehicleWinForm.supplierId" @supplier="supplierSelect">
                            </supplier-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车主:" prop="vehicleOwner" v-show="addVehicleWinForm.type==='vehicleId'">
                            {{addVehicleWinForm.vehicleOwner}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车主身份证/营业执照:" prop="vehicleCardNo"
                                      v-show="addVehicleWinForm.type==='vehicleId'">
                            {{addVehicleWinForm.vehicleCardNo}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车主联系方式:" prop="vehicleMobile"
                                      v-show="addVehicleWinForm.type==='vehicleId'">
                            {{addVehicleWinForm.vehicleMobile}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="司机身份证:" prop="dirverCardNo" v-show="addVehicleWinForm.type==='driverId'">
                            {{addVehicleWinForm.dirverCardNo}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="司机联系方式:" prop="dirverMobile" v-show="addVehicleWinForm.type==='driverId'">
                            {{addVehicleWinForm.dirverMobile}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商银行卡号:" prop="supplierCardNo"
                                      v-show="addVehicleWinForm.type==='supplierId'">
                            {{addVehicleWinForm.supplierCardNo}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供应商联系方式:" prop="supplierMobile"
                                      v-show="addVehicleWinForm.type==='supplierId'">
                            {{addVehicleWinForm.supplierMobile}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="reason" label="拉黑原因:">
                            <el-input type="textarea" placeholder="请输入拉黑内容(限定100字以内)"
                                      v-model="addVehicleWinForm.reason"
                                      resize="none"
                                      autofocus="true"
                                      maxlength="100"
                                      style="width:600px;" :rows="3">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="attachment" label="附件:">
                            <upload-image ref="attachment" v-model="addVehicleWinForm.attachment"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="submitBlackList">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改信息" :visible.sync="modifyBlackListWin" width="800px" :before-close="handleClose">
            <el-form inline size="small" :model="modifyForm" label-width="120px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="reason" label="拉黑原因:">
                            <el-input type="textarea" placeholder="请输入拉黑内容(限定100字以内)"
                                      v-model="modifyForm.reason"
                                      resize="none"
                                      autofocus="true"
                                      maxlength="100"
                                      style="width:600px;" :rows="3">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="attachment" label="附件:">
                            <upload-image ref="attachment"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="modifySubmitBlackList('modifyForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="黑名单审核" :visible.sync="auditBlackListWin" width="1200px" :before-close="handleClose">
            <el-form inline size="small" label-width="115px" :model="auditForm">
                <div v-if="auditForm.type==='供应商'">
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="类型:">{{auditForm.type}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="供应商:">{{auditForm.supplierOrVehicle}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="银行卡号:">{{auditForm.idCardNoOrDueBankCardNo}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="联系方式:">{{auditForm.contactWay}}</el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div v-if="auditForm.type==='司机'">
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="类型:">{{auditForm.type}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="司机姓名:">{{auditForm.driverName}}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="身份证号:">{{auditForm.driverIdCardNo}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="司机联系方式:" v-if="auditForm.type==='司机'">{{auditForm.driverMobile}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div v-if="auditForm.type==='车辆'">
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="类型:">{{auditForm.type}}</el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="车牌号:">{{auditForm.licenseNumber}}</el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="车主:">{{auditForm.supplierOrVehicle}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车主身份证:">{{auditForm.idCardNoOrDueBankCardNo}}</el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="联系方式:">{{auditForm.contactWay}}</el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <el-row>
                    <el-col :span="24">
                        <el-form-item label="拉黑原因:">{{auditForm.reason}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件:" prop="attachment">
                            <show-image-and-file :url="auditForm.attachment"></show-image-and-file>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--审核-->
                <el-form size="small" :model="auditOpinionForm">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="审核:" class="lableSty">
                                <el-switch v-model="auditOpinionForm.auditStatus" active-color="#13ce66"
                                           inactive-color="#ff4949"
                                           :active-value="Constant.AUDIT_STATUS.PASS"
                                           :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                           active-text="同意" inactive-text="拒绝"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="备注:" class="lableSty">
                                <el-input type="textarea" :rows="4" :cols="135" :maxlength="200" placeholder="请输入内容"
                                          v-model="auditOpinionForm.auditRemarks"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="24" style="text-align: right;margin: 20px 0px;">
                        <el-button type="primary" size="small" @click="auditSubmitBlackList()">确 定</el-button>
                        <el-button size="small" @click="cancel">取 消</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Api, Common, Constant, Http} from 'src/global'

    export default {

        data() {
            return {
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    vehicleNo: '',
                    type: '',
                    auditStatus: '',
                    supplierId: '',
                    driverId: '',
                    startCreateTime: '',
                    endCreateTime: ''
                },//返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                Constant: Constant,
                btnLoading: true,
                isLoading: true,
                modifyBlackListWin: false,
                multipleSelection: [],
                addBlackListWin: false,
                auditBlackListWin: false,
                addVehicleWinForm: {
                    vehicleNo: '',
                    vehicleId: '',
                    vehicleOwner: '',
                    vehicleCardNo: '',
                    vehicleMobile: '',
                    dirverCardNo: '',
                    dirverMobile: '',
                    reason: '',
                    type: '',
                    supplierId: '',
                    supplierCardNo: '',
                    supplierMobile: '',
                    licenseNumber: '',
                    driverId: '',
                    result: [],
                },
                modifyForm: {
                    reason: '',
                    id: '',
                },
                auditForm: {
                    id: '',
                    supplierOrVehicle: '',
                    driverName: '',
                    licenseNumber: '',
                    idCardNoOrDueBankCardNo: '',
                    supplierOrVehicle: '',
                    idCardNo: '',
                    contactWay: '',
                    reason: '',
                    auditRemarks: '',
                    auditStatus: '',
                    driverMobile: '',
                    attachment: ''
                },
                auditOpinionForm: {
                    id: '',
                    auditRemarks: '',
                    auditStatus: Constant.AUDIT_STATUS.PASS,
                },
                tableHeight: window.innerHeight > 800 ? 480 : null
            }
        },
        mounted() {
            this.searchBlackList();
        },
        methods: {
            //通用
            handleCurrentChange(val) {
                let vm = this
                vm.searchParam.currentPage = val
                this.searchBlackList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            handleSizeChange(val) {
                let vm = this
                vm.searchParam.pageSize = val
                this.searchBlackList()
            },
            searchBlackList() {
                let vm = this
                Http.get(Api.blackList.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result
                    vm.searchResult.totalCount = result.totalCount
                    vm.searchParam.currentPage = result.currentPage
                    vm.searchParam.pageSize = result.pageSize
                })
            },
            //新增
            addBlackList() {
                this.cancel();
                this.addBlackListWin = true;
            },
            Vehiclechange(item) {
                this.addVehicleWinForm.vehicleId = item.id;
                this.addVehicleWinForm.vehicleNo = item.code;
                if (item.vehicleOwner) {
                    this.addVehicleWinForm.vehicleOwner = item.vehicleOwner.name;
                    this.addVehicleWinForm.vehicleCardNo = item.vehicleOwner.idCardNo;
                    this.addVehicleWinForm.vehicleMobile = item.vehicleOwner.mobile;
                } else {
                    this.addVehicleWinForm.vehicleOwner = '';
                    this.addVehicleWinForm.vehicleCardNo = '';
                    this.addVehicleWinForm.vehicleMobile = '';
                }
            },
            selectDriver(item) {
                this.addVehicleWinForm.driverId = item.id;
                this.addVehicleWinForm.dirverCardNo = item.idCardNo;
                this.addVehicleWinForm.dirverMobile = item.mobile;
            },
            supplierSelect(item) {
                this.addVehicleWinForm.supplierId = item.id;
                this.addVehicleWinForm.supplierCardNo = item.dueBankCardNo;
                this.addVehicleWinForm.supplierMobile = item.contact;
            },
            //新增
            submitBlackList() {
                let vm = this;
                vm.addVehicleWinForm.attachment = vm.$refs.attachment.getFileList().join(",");//图片路径
                if (vm.addVehicleWinForm.reason.trim() == '') {
                    this.$message('请填写拉黑原因');
                } else {
                    if (vm.addVehicleWinForm.type === '') {
                        this.$message('请选择类型');
                    } else {
                        if (vm.addVehicleWinForm.type === 'vehicleId' && vm.addVehicleWinForm.vehicleId == '') {
                            this.$message('请输入对应的车牌号');
                        } else if (vm.addVehicleWinForm.type === 'driverId' && vm.addVehicleWinForm.driverId === '') {
                            this.$message('请输入对应的司机');
                        } else if (vm.addVehicleWinForm.type === 'supplierId' && vm.addVehicleWinForm.supplierId === '') {
                            this.$message('请输入对应的供应商');
                        } else {
                            Http.post(Api.blackList.add, vm.addVehicleWinForm, function (res) {
                                vm.addBlackListWin = false
                                vm.searchBlackList();
                            })
                        }
                    }
                }
            },
            //查询
            searchBlackList() {
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.blackList.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result
                    vm.searchResult.totalCount = result.totalCount
                    vm.searchParam.currentPage = result.currentPage
                    vm.searchParam.pageSize = result.pageSize
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                })
            },
            formatter(row) {
                if (row.type === 'vehicleId') {
                    if (row.vehicle && row.vehicle.vehicleOwner) {
                        return row.vehicle.vehicleOwner.name
                    }
                    return '';
                } else if (row.type === 'supplierId') {
                    if (row.supplier) {
                        return row.supplier.name
                    }
                    return '';
                }
            },
            formatterCard(row) {
                if (row.type === 'vehicleId') {
                    if (row.vehicle && row.vehicle.vehicleOwner) {
                        return row.vehicle.vehicleOwner.idCardNo
                    }
                    return '';
                } else if (row.type === 'supplierId') {
                    if (row.supplier) {
                        return row.supplier.dueBankCardNo
                    }
                    return ''
                }
            }, formatterLink(row) {
                if (row.type === 'vehicleId') {
                    if (row.vehicle && row.vehicle.vehicleOwner) {
                        return row.vehicle.vehicleOwner.mobile
                    }
                    return '';
                } else if (row.type === 'supplierId') {
                    if (row.supplier) {
                        return row.supplier.contact
                    }
                    return '';
                }
            },
            resetWinform() {
                let vm = this;
                vm.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    vehicleNo: '',
                    type: '',
                    auditStatus: '',
                    supplierId: '',
                    driverId: '',
                    startCreateTime: '',
                    endCreateTime: ''
                }
            },
            cancel() {
                let vm = this;
                this.addBlackListWin = false;
                this.modifyBlackListWin = false;
                this.auditBlackListWin = false;
                vm.addVehicleWinForm = {
                    vehicleNo: '',
                    vehicleId: '',
                    vehicleOwner: '',
                    vehicleCardNo: '',
                    vehicleMobile: '',
                    dirverCardNo: '',
                    dirverMobile: '',
                    reason: '',
                    type: '',
                    supplierId: '',
                    supplierCardNo: '',
                    supplierMobile: '',
                    licenseNumber: '',
                    driverId: '',
                    attachment: '',
                    result: [],
                },
                    vm.modifyForm = {
                        reason: '',
                        ids: '',
                        attachment: ''
                    },
                    vm.auditOpinionForm = {
                        auditStatus: Constant.AUDIT_STATUS.PASS,
                        auditRemarks: ''
                    },
                    vm.$nextTick(() => {
                        if (vm.$refs.attachment) {
                            vm.$refs.attachment.clearFileList();
                        }
                    });

            }, handleClose() {
                this.addBlackListWin = false;
                this.modifyBlackListWin = false
                this.cancel();
            },
            deleteList(row) {
                let vm = this;
                var ids = [];
                ids.push(row.id);
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.blackList.delete, ids, result => {
                        vm.searchBlackList();
                    })
                })
            },
            // 批量修改
            modifyBlackList(row) {
                let vm = this;
                vm.$nextTick(() => {
                    if (vm.$refs.attachment) {
                        vm.$refs.attachment.clearFileList();
                    }
                });
                vm.cancel();
                var id = [];
                id.push(row.id);
                vm.modifyForm.ids = id;
                vm.modifyForm.reason = row.reason;
                vm.$nextTick(() => {
                    if (vm.$refs.attachment) {
                        vm.$refs.attachment.setFileList(row.attachment ? row.attachment.split(",") : []);
                    }
                })
                vm.modifyBlackListWin = true;
            },
            modifySubmitBlackList() {
                let vm = this;
                vm.modifyForm.attachment = vm.$refs.attachment.getFileList().join(",");//图片路径
                if (vm.modifyForm.reason.trim() == '') {
                    this.$message('请输入修改的拉黑原因');
                } else {
                    Http.post(Api.blackList.modify, vm.modifyForm, result => {
                        vm.searchBlackList();
                        this.$message.success('更新成功！');
                        vm.modifyBlackListWin = false
                    })
                }

            }, queryById(row) {
                let vm = this;
                Http.get(Api.blackList.queryById, {params: {'id': row.id}}, function (res) {
                    vm.auditForm = res.result;
                    vm.auditBlackListWin = true;
                });
            },
            auditSubmitBlackList() {
                let _this = this;
                _this.auditOpinionForm.id = _this.auditForm.id;
                Http.post(Api.blackList.audit, _this.auditOpinionForm, result => {
                    _this.cancel();
                    _this.searchBlackList();
                    _this.$message.success("审核成功");
                });
            },
            exportData() {
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.blackList.page, {params: searchExportParam}, response => {
                    let header = ['类型', '车牌', '供应商/车主', '银行卡号/身份证', '联系方式', '司机', '司机身份证', '司机联系方式', '拉黑原因', '申请区域', '申请人', '申请时间', '审核状态', '审核人', '审核区域', '审核时间', '审核备注'];
                    let filterVal = ['type', 'licenseNumber', 'supplierOrVehicle', 'idCardNoOrDueBankCardNo', 'contactWay', 'driverName', 'driverIdCardNo', 'driverMobile', 'reason', 'createOrgCode', 'createUser', 'createTime', {
                        type: 'dictionary',
                        'code': 'BLACKlIST_AUDIT_STATUS',
                        'name': 'auditStatus'
                    }, 'auditUser', 'auditOrgCode', 'auditTime', 'auditRemarks'];
                    Common.excel.downloadExl(response.result, header, filterVal, "黑名单导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            },
        }
    }
</script>
<style>
    .lableSty .el-form-item__label{
        width: 115px;
    }
</style>
