<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 车辆管理</el-breadcrumb-item>
                <el-breadcrumb-item>车辆信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header height="" class="content-header">
            <el-form :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车辆号牌:">
                            <el-input v-model="searchParam.licenseNumber" size="small"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <org-select style="display: block" v-model="searchParam.belongOrgCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆类型:">
                            <dictionary-select v-model="searchParam.type" style="display: block" size="small"
                                               option-name="VEHICLE_TYPE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车型:">
                            <dictionary-select style="display: block" option-name="VEHICLE_SPECIFICATION"
                                               v-model="searchParam.specification"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="车辆性质:">
                            <dictionary-select style="display: block" v-model="searchParam.operationMode"
                                               option-name="VEHICLE_OPERATION_MODE" :excludeOptions="['OUT_INVITE']"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select style="display: block" v-model="searchParam.operationAttribute"
                                               option-name="VEHICLE_OPERATION_ATTRIBUTE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车主:">
                            <vehicle-owner-select size="small" style="display:block;"
                                                  v-model="searchParam.owner"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="认领状态">
                            <dictionary-select v-model="searchParam.claim"
                                               option-name="OIL_CLAIM" style="display: block;"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="使用状态:">
                            <dictionary-select v-model="searchParam.status"
                                               option-name="VEHICLE_STATUS" style="display: block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运营状态:">
                            <dictionary-select v-model="searchParam.operationStatus"
                                               option-name="VEHICLE_OPERATION_STATUS" style="display: block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="行驶证所有人:">
                            <dictionary-select v-model="searchParam.ownerCode"
                                               option-name="OWNERCODE" style="display: block;" :filterable='true'/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="证件是否齐全:">
                            <dictionary-select style="display: block" option-name="CERT_COMPLETE_FLAG"
                                               v-model="searchParam.certCompleteFlag"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" v-show="isMoreItemShow">
                        <el-form-item label="证件是否到期:">
                            <dictionary-select style="display: block" option-name="CERT_EXPIRE_FLAG"
                                               v-model="searchParam.certExpireFlag"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="isMoreItemShow">
                        <el-form-item label="承载方数:" prop="loadSquare">
                            <el-input v-model="searchParam.loadSquare" size="small"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="float: right">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="text" v-show="!isMoreItemShow" @click="showMore" size="small">展开更多搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="showLess" size="small">收起搜索项<<
                            </el-button>
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" @click="resetSearchParam" size="small">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" v-permission="permission.add" @click="addVehicle">
                新增
            </el-button>
            <el-button size="mini" type="primary" v-permission="permission.change" @click="changeVehicleShow"
                       :disabled="buttonDisabled.changeButtonDisabled">营运性质变更
            </el-button>
            <el-button size="mini" type="primary" v-permission="permission.updateStatus" @click="updateVehicleStatus"
                       :disabled="buttonDisabled.updateVehicleStatusButtonDisabled">
                修改车辆运行状态
            </el-button>
            <el-button size="mini" type="primary" v-permission="permission.transfer" @click="vehicleTransferShow"
                       :disabled="buttonDisabled.vehicleTransferButtonDisabled">运营状态变更
            </el-button>

            <el-button size="mini" type="primary" v-permission="permission.claim" @click="claimVehicle"
                       :disabled="buttonDisabled.claimVehicleButtonDisabled">车辆认领
            </el-button>
            <el-button size="mini" type="primary" v-permission="permission.notClaim" @click="notClaimVehicle"
                       :disabled="buttonDisabled.claimVehicleButtonDisabled">取消认领
            </el-button>
            <el-button v-if="exportLoading" size="mini" type="primary" v-permission="permission.export"
                       @click="vehicleExport">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-button v-if="certDownload" icon="el-icon-download" type="primary" size="mini"
                       v-permission="permission.certificatesDonwload" @click="certificatesDonwloadVisible=true"
            >车辆证件导出
            </el-button>
            <upload-vehicle-cert title="证件批量上传" v-permission="permission.certBatchUpload"
                                 style="display: inline-block;position: relative; top: 10px;"/>
            <upload-excel v-permission="permission.upload" :importUrl="Api.vehicle.upload" @success="uploadSuccess"
                          btn-name="导入" style="display: inline-block;"></upload-excel>
            <el-dialog title="车辆证件导出" :visible.sync="certificatesDonwloadVisible" width="25%">
                <el-form size="small" align="center">
                    <el-row>
                        <el-col :span="1">
                            &nbsp;
                        </el-col>
                        <el-col :span="9">
                            <el-input type="textarea"
                                      :autosize="{ minRows: 13, maxRows: 13}" resize="none"
                                      v-model.trim="certificate"
                                      placeholder="最多输入50个车牌号,进行导出。按ENTER键进行换行。"></el-input>
                        </el-col>
                        <el-col :span="2">
                            &nbsp;
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="行驶证:">
                                <el-row>
                                    <el-col :span="6">
                                        <el-switch v-model="vehicleCertDonwloadDto.vehicleLicenseFlag"
                                                   active-color="#13ce66" inactive-color="#ff4949"
                                                   active-text="是"
                                                   inactive-text="否"
                                        ></el-switch>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="营运证:">
                                <el-row>
                                    <el-col :span="6">
                                        <el-switch v-model="vehicleCertDonwloadDto.operatingLicenseFlag"
                                                   active-color="#13ce66" inactive-color="#ff4949"
                                                   active-text="是"
                                                   inactive-text="否"
                                        ></el-switch>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="交强险:">
                                <el-row>
                                    <el-col :span="6">
                                        <el-switch v-model="vehicleCertDonwloadDto.strongInsuranceFlag"
                                                   active-color="#13ce66" inactive-color="#ff4949"
                                                   active-text="是"
                                                   inactive-text="否"
                                        ></el-switch>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="商业保险:">
                                <el-row>
                                    <el-col :span="6">
                                        <el-switch v-model="vehicleCertDonwloadDto.commercialInsuranceFlag"
                                                   active-color="#13ce66" inactive-color="#ff4949"
                                                   active-text="是"
                                                   inactive-text="否"
                                        ></el-switch>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="车身照片:">
                                <el-row>
                                    <el-col :span="6">
                                        <el-switch v-model="vehicleCertDonwloadDto.vehicleBodyAttachmentFlag"
                                                   active-color="#13ce66" inactive-color="#ff4949"
                                                   active-text="是"
                                                   inactive-text="否"
                                        ></el-switch>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="登记证书:">
                                <el-row>
                                    <el-col :span="6">
                                        <el-switch v-model="vehicleCertDonwloadDto.vehicleRegisterAttachmentFlag"
                                                   active-color="#13ce66" inactive-color="#ff4949"
                                                   active-text="是"
                                                   inactive-text="否"
                                        ></el-switch>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer" align="center">
                    <el-button @click="certificatesDonwloadVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="certificatesDonwloadVehicle()" size="small">确 定
                    </el-button>
                </div>
            </el-dialog>

            <el-table class="content-table" size="small" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"/>
                <!-- <el-table-column label="车辆编码" header-align="center" prop="code" width="150"/> -->
                <!-- <el-table-column label="台账编号" header-align="center" prop="vehicleNo" width="150"/> -->
                <el-table-column label="车辆号牌" header-align="center" prop="licenseNumber" width="150">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;"
                           @click="showVehicleDetail(scope.row)">{{scope.row.licenseNumber }}</a>
                    </template>
                </el-table-column>
                <el-table-column label="所属大区" header-align="center" prop="org.name" width="150">
                    <template slot-scope="scope">
                        <div v-if="scope.row.org!=null&&scope.row.org.nature == 'PARTITION'">
                            {{scope.row.org.parent.name}}
                        </div>
                        <div v-else-if="scope.row.org!=null">
                            {{scope.row.org.name}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="所属分区" header-align="center" prop="org.name" width="150">
                    <template slot-scope="scope">
                        <div v-if="scope.row.org!=null&&scope.row.org.nature == 'PARTITION'">
                            {{scope.row.org.name}}
                        </div>
                        <div v-else>

                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="使用状态" header-align="center" prop="status" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_STATUS" :value="scope.row.status"/>
                    </template>
                </el-table-column>
                <el-table-column label="认领状态" header-align="center" prop="claim" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OIL_CLAIM" :value="scope.row.claim"/>
                    </template>
                </el-table-column>
                <el-table-column label="认领人" header-align="center" prop="claimUser" width="150"/>
                <el-table-column label="是否出租" header-align="center" prop="type" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="IS_EXIST" :value="scope.row.rentOut"/>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="是否租赁" header-align="center" prop="type" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="IS_EXIST" :value="scope.row.lease"/>
                    </template>
                </el-table-column> -->
                <el-table-column label="车辆类型" header-align="center" prop="type" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_TYPE" :value="scope.row.type"/>
                    </template>
                </el-table-column>
                <el-table-column label="规格" header-align="center" prop="specification" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_SPECIFICATION" :value="scope.row.specification"/>
                    </template>
                </el-table-column>
                <el-table-column label="驱动类型" header-align="center" prop="oneWheel" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SINGLE_AND_DOUBLE_DRIVE" :value="scope.row.oneWheel"/>
                    </template>
                </el-table-column>
                <el-table-column label="车厢类型" header-align="center" prop="vanType" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE" :value="scope.row.vanType"/>
                    </template>
                </el-table-column>
                <el-table-column label="车辆性质" header-align="center" prop="operationMode" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="scope.row.operationMode"/>
                    </template>
                </el-table-column>
                <el-table-column label="结算模式" header-align="center" prop="settlementMode" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SETTLEMENT_MODE" :value="scope.row.settlementMode"/>
                    </template>
                </el-table-column>
                <el-table-column label="承载方数" header-align="center" prop="loadSquare" width="100"
                                 show-overflow-tooltip/>
                <el-table-column label="自营模式" header-align="center" prop="selfOperationMode" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SELF_OPERATION_MODE" :value="scope.row.selfOperationMode"/>
                    </template>
                </el-table-column>
                <el-table-column label="车辆属性" header-align="center" prop="operationAttribute" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_ATTRIBUTE"
                                                :value="scope.row.operationAttribute"/>
                    </template>
                </el-table-column>
                <el-table-column label="行驶证所有人" header-align="center" prop="vehicleLicense.ownerCode" width="200"
                                 show-overflow-tooltip/>
                <el-table-column label="车主" header-align="center" prop="vehicleOwner.name" width="200"
                                 show-overflow-tooltip/>
                <el-table-column label="车主身份证" header-align="center" prop="vehicleOwner.idCardNo" width="200"
                                 show-overflow-tooltip/>
                <el-table-column label="车主电话" header-align="center" prop="vehicleOwner.mobile" width="200"
                                 show-overflow-tooltip/>
                <el-table-column label="油卡额度" header-align="center" prop="oilCardLimit" width="100"/>
                <!--<el-table-column label="油站额度" header-align="center" prop="petrolStationLimit" width="100" v-if="false"/>-->
                <el-table-column label="运营状态" header-align="center" prop="operationStatus" width="90">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_STATUS"
                                                :value="scope.row.operationStatus"/>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="过户时间" header-align="center" prop="changeTheTime" width="120">
                    <template slot-scope="scope">
                        {{scope.row.changeTheTime | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column label="过户执行人" header-align="center" prop="transferExecutor" width="90"/> -->
                <el-table-column label="进口/国产" header-align="center" prop="imported" width="90">
                    <template slot-scope="scope">
                        <datadictionary-name option-name="VEHICLE_PROCUREMEN_TYPE" :value="scope.row.imported"/>
                    </template>
                </el-table-column>
                <el-table-column label="行驶证有效日期" header-align="center" prop="vehicleLicense.effectiveDate" width="120">
                    <template slot-scope="scope">
                        <!-- <div  v-if="scope.row.vehicleLicense&&scope.row.vehicleLicense.expireFlag" class="changeRed">{{scope.row.vehicleLicense.effectiveDate | moment("YYYY-MM-DD")}}(到期)</div>
                    <div  v-if="scope.row.vehicleLicense&&!scope.row.vehicleLicense.expireFlag">{{scope.row.vehicleLicense.effectiveDate | moment("YYYY-MM-DD")}}</div> -->
                        <div v-if="scope.row.vehicleLicense">{{scope.row.vehicleLicense.effectiveDate |
                            moment("YYYY-MM-DD")}}
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="行驶证有效日期(旧)" header-align="center" prop="vehicleLicense.oldEffectiveDate" width="120">
                    <template slot-scope="scope">
                        <div  v-if="scope.row.vehicleLicense">{{scope.row.vehicleLicense.oldEffectiveDate | moment("YYYY-MM-DD")}}</div>
                    </template>
                </el-table-column> -->
                <el-table-column label="营运证有效日期" header-align="center" prop="vehicleOperatingLicense.effectiveDate"
                                 width="120">
                    <template slot-scope="scope">
                        <!-- <div  v-if="scope.row.vehicleOperatingLicense&&scope.row.vehicleOperatingLicense.expireFlag" class="changeRed">{{scope.row.vehicleOperatingLicense.effectiveDate | moment("YYYY-MM-DD")}}(到期)</div>
                    <div  v-if="scope.row.vehicleOperatingLicense&&!scope.row.vehicleOperatingLicense.expireFlag">{{scope.row.vehicleOperatingLicense.effectiveDate | moment("YYYY-MM-DD")}}</div> -->
                        <div v-if="scope.row.vehicleOperatingLicense">{{scope.row.vehicleOperatingLicense.effectiveDate
                            | moment("YYYY-MM-DD")}}
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="营运证有效日期(旧)" header-align="center" prop="vehicleOperatingLicense.oldEffectiveDate"
                                 width="120">
                    <template slot-scope="scope">
                        <div  v-if="scope.row.vehicleOperatingLicense">{{scope.row.vehicleOperatingLicense.oldEffectiveDate | moment("YYYY-MM-DD")}}</div>
                    </template>
                </el-table-column> -->
                <el-table-column label="交强险有效日期" header-align="center" prop="vehicleInsurance.strongInsuranceDate"
                                 width="120">
                    <template slot-scope="scope">
                        <!-- <div  v-if="scope.row.vehicleInsurance.strongInsuranceExpireFlag" class="changeRed">{{scope.row.vehicleInsurance.strongInsuranceDate | moment("YYYY-MM-DD")}}(到期)</div>
                        <div  v-if="!scope.row.vehicleInsurance.strongInsuranceExpireFlag">{{scope.row.vehicleInsurance.strongInsuranceDate | moment("YYYY-MM-DD")}}</div> -->
                        <div>{{scope.row.vehicleInsurance.strongInsuranceDate | moment("YYYY-MM-DD")}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="商业险有效日期" header-align="center" prop="vehicleInsurance.commercialInsuranceDate"
                                 width="120">
                    <template slot-scope="scope">
                        <!-- <div  v-if="scope.row.vehicleInsurance.commercialInsuranceExpireFlag" class="changeRed">{{scope.row.vehicleInsurance.commercialInsuranceDate | moment("YYYY-MM-DD")}}(到期)</div>
                        <div  v-if="!scope.row.vehicleInsurance.commercialInsuranceExpireFlag">{{scope.row.vehicleInsurance.commercialInsuranceDate | moment("YYYY-MM-DD")}}</div> -->
                        <div>{{scope.row.vehicleInsurance.commercialInsuranceDate | moment("YYYY-MM-DD")}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="是否卡班" prop="kabanFlag" min-width="120px">
                    <template slot-scope="scope">
                        {{scope.row.kabanFlag === true ? '是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" header-align="center" prop="createTime" width="180"/>
                <el-table-column label="创建人" header-align="center" prop="createUser" width="150"/>
                <el-table-column label="修改时间" header-align="center" prop="modifyTime" width="180"/>
                <el-table-column label="修改人" header-align="center" prop="modifyUser" width="150"/>
                <!-- <el-table-column label="报废时间" header-align="center" prop="discardedTime" width="180"/>
                <el-table-column label="报废人" header-align="center" prop="discardedUser" width="150"/> -->
                <el-table-column label="操作" header-align="center" align="center" fixed="right" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="ShowCertificatesManageDialog(scope.row)"
                                   v-permission="permission.certificatesManage"
                                   :class="scope.row.vehicleCertAudit&&scope.row.vehicleCertAudit.auditStatus == constant.AUDIT_STATUS.NO_PASS?'changeRed':''">
                            证件维护
                        </el-button>
                        <el-button type="text" icon="el-icon-edit" size="mini" v-permission="permission.modify"
                                   @click="showModifyVehicleDialog(scope.row)"/>
                        <el-button type="text" icon="el-icon-delete" v-permission="permission.delete" size="mini"
                                   @click="deleteVehicle(scope.row)"/>
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

        <!--性质变更-->
        <el-dialog :title="win.winTitle.vehicleChangeWinTitle" :visible.sync="win.winShow.vehicleChangeWin"
                   width="700px">
            <el-form :model="win.model.vehicleChangeWinFormModel" :rules="win.verification" ref="vehicleChangeWinForm"
                     label-width="100px" size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车牌号:" prop="licenseNumber">
                            <el-input v-model="win.model.vehicleChangeWinFormModel.licenseNumber" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车辆性质:" prop="operationMode">
                            <dictionary-select style="display: block" size="small"
                                               v-model="win.model.vehicleChangeWinFormModel.operationMode"
                                               option-name="VEHICLE_OPERATION_MODE"
                                               :disabled="true"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="win.model.vehicleChangeWinFormModel.control.show">
                    <el-col :span="12">
                        <el-form-item label="车主1:" prop="vehicleOwnerId">
                            <vehicle-owner-select v-model="win.model.vehicleChangeWinFormModel.vehicleOwnerId"
                                                  style="display: block" size="small" @driver="getDriver"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车主2:" prop="vehicleOwnerId2">
                            <vehicle-owner-select v-model="win.model.vehicleChangeWinFormModel.vehicleOwnerId2"
                                                  style="display: block" size="small" @driver="getDriver2"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <div v-if="win.model.vehicleChangeWinFormModel.control.show">
                        <el-col :span="12">
                            <el-form-item label="合作日期" prop="outsourceDate">
                                <date-picker-single v-model="win.model.vehicleChangeWinFormModel.outsourceDate"
                                                    :end-date="newData"/>
                            </el-form-item>
                        </el-col>
                    </div>
                    <div v-else>
                        <el-col :span="12">
                            <el-form-item label="自营日期" prop="selfSupportDate">
                                <date-picker-single v-model="win.model.vehicleChangeWinFormModel.selfSupportDate"
                                                    :end-date="newData"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="自营模式:" prop="selfOperationMode">
                                <dictionary-select option-name="SELF_OPERATION_MODE" style="display: block"
                                                   size="small"
                                                   v-model="win.model.vehicleChangeWinFormModel.selfOperationMode"/>
                            </el-form-item>
                        </el-col>
                    </div>
                </el-row>
            </el-form>
            <!--添加挂车-->
            <div v-if="win.model.vehicleChangeWinFormModel.control.show">
                <vehicle-select v-model="win.model.addTrailerWinFormModel.licenseNumber" :type="['TRAILER']"
                                :vehicle-operation-type="win.model.vehicleChangeWinFormModel.vehicleOperationType"
                                ref="addTrailerLicenseNumber" placeholder="查询挂车"
                                :org-code="win.model.vehicleChangeWinFormModel.org.code"
                                v-if="win.model.addButtonReadOnly "/>
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="trailerButtonSubmit()"
                           v-if="win.model.addButtonReadOnly"/>
                <el-table class="content-table" size="small" :data="win.model.vehicleChangeWinFormModel.trailerList"
                          element-loading-text="拼命加载中" v-if="win.model.addButtonReadOnly"
                          @selection-change="handleSelectionChange"
                          border fit
                          highlight-current-row stripe>
                    <el-table-column type="selection" width="40"></el-table-column>
                    <el-table-column prop="licenseNumber" label="车牌号"></el-table-column>
                    <el-table-column prop="type" label="车辆类型">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="VEHICLE_TYPE"
                                                    :value="scope.row.type"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" header-align="center" fixed="right" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-delete" v-permission="permission.delete" size="mini"
                                       @click="deleteVehicleForList(scope.$index, win.model.vehicleChangeWinFormModel.trailerList)"></el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="specification" label="规格"></el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="win.winShow.vehicleChangeWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="changeVehicleWinSubmit('vehicleChangeWinForm')" size="small">确 定
                </el-button>
            </div>
        </el-dialog>
        <!--过户 update >> 运营状态变更-->
        <el-dialog :title="win.winTitle.vehicleTransferWinTitle" :visible.sync="win.winShow.vehicleTransferWin"
                   width="700px"
                   @close="closeTransfer">
            <el-form :model="win.model.vehicleTransferWinWinFormModel" :rules="win.vehicleTransfer"
                     ref="vehicleTransferWinForm"
                     label-width="100px" size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车牌号:" prop="transferExecutor">
                            {{ win.model.vehicleTransferWinWinFormModel.licenseNumber }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="运营状态:" prop="transferExecutor">
                            <el-select v-model="win.model.vehicleTransferWinWinFormModel.operationStatus"
                                       placeholder="请选择">
                                <el-option
                                    v-for="item in statusList"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code"
                                    :disabled="item.disabled">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 过户模式显示 -->
                    <div v-show="toTransferFlag">
                        <el-col :span="12">
                            <el-form-item label="过户时间:" prop="changeTheTime">
                                <el-date-picker style="display: block; width:100%;"
                                                v-model="win.model.vehicleTransferWinWinFormModel.changeTheTime"
                                                type="date"
                                                value-format="yyyy-MM-dd HH:mm:ss"
                                                placeholder="选择日期"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="过户执行人:" prop="transferExecutor">
                                <el-input v-model="win.model.vehicleTransferWinWinFormModel.transferExecutor"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="附件:" prop="attachment">
                                <upload-image ref="transferOfNamesAttachment"
                                              fileModule="vehicle"
                                              v-model="win.model.vehicleTransferWinWinFormModel.transferOfNamesAttachment"/>
                            </el-form-item>
                        </el-col>
                    </div>

                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click="vehicleTransferWinSubmit(win.model.vehicleTransferWinWinFormModel)"
                           size="small">确 定
                </el-button>
                <el-button @click="win.winShow.vehicleTransferWin = false" size="small">取 消</el-button>
            </div>
        </el-dialog>
        <!--证件维护-->

        <el-dialog :title="win.winTitle.certificatesManageWinTitle" :visible.sync="win.winShow.certificatesManageWin"
                   width="1250px"
                   @close="certificatesClose"
                   id="certificates">
            <p v-if="currentItemAudit.auditStatus == constant.AUDIT_STATUS.NO_PASS" class="changeRed changePadding"
               v-html="'<span>审核未通过</span> 备注：'+currentItemAudit.auditRemark">{{}}</p>
            <el-form :model="certificatesManageWinForm"
                     :rules="checkRule"
                     ref="certificatesManageWinForm"
                     label-width="120px" size="small">
                <el-card class="box-card" body-style="padding:0px;" style="width: 100%; ">
                    <div slot="header" class="clearfix">
                        <span>行驶证</span>
                    </div>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="附件:" prop="vehicleLicense.attachment">
                                <el-row>
                                    <el-col :span="14">
                                        <uploadImage-Recognition ref="vehicleLicenseAttachment"
                                                                 @upload="uploadRecognition"
                                                                 fileModule="vehicle"
                                                                 v-model="certificatesManageWinForm.vehicleLicense.attachment"/>
                                    </el-col>
                                    <el-col :span="10">
                                        <show-image-t :url="require('../../../assets/example/driver.png')"
                                                      class1="preImg"></show-image-t>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所有人:" prop="vehicleLicense.ownerCode">
                                <el-input v-model="certificatesManageWinForm.vehicleLicense.ownerCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车辆类型:" prop="vehicleLicense.vehicleType"
                                          v-show="!certificatesManageWinForm.vehicleLicense.vehicleTypeShow && certificatesManageWinForm.vehicleLicense.vehicleTypeData">
                                <dictionary-select style="display:block;" option-name="HEAD_VEHICLE_TYPE"
                                                   :excludeOptions="['HEAD_HEAVY_MOTOR_TRACTOR']"
                                                   v-model="certificatesManageWinForm.vehicleLicense.vehicleType"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车辆类型:" prop="vehicleLicense.vehicleType"
                                          v-show="!certificatesManageWinForm.vehicleLicense.vehicleTypeShow && !certificatesManageWinForm.vehicleLicense.vehicleTypeData">
                                <dictionary-select style="display:block;" option-name="HEAD_VEHICLE_TYPE"
                                                   :excludeOptions="['HEAD_HEAVY_VAN','HEAD_HEAVY_BOX_TRUCK']"
                                                   v-model="certificatesManageWinForm.vehicleLicense.vehicleType"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车辆类型:" prop="vehicleLicense.vehicleType"
                                          v-show="certificatesManageWinForm.vehicleLicense.vehicleTypeShow">
                                <dictionary-select style="display:block;" option-name="SEMITRAILER_VEHICLE_TYPE"
                                                   v-model="certificatesManageWinForm.vehicleLicense.vehicleType"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="品牌型号:" prop="vehicleLicense.brandType"
                                          v-show="!certificatesManageWinForm.vehicleLicense.vehicleTypeShow">
                                <dictionary-select style="display:block;" option-name="HEAD_VEHICLE_BRAND"
                                                   v-model="certificatesManageWinForm.vehicleLicense.brandType"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="品牌型号:" prop="vehicleLicense.brandType"
                                          v-show="certificatesManageWinForm.vehicleLicense.vehicleTypeShow">
                                <dictionary-select style="display:block;" option-name="SEMITRAILER_VEHICLE_BRAND"
                                                   v-model="certificatesManageWinForm.vehicleLicense.brandType"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="车辆识别代号:" prop="vehicleLicense.vehicleNumber">
                                <el-input v-model="certificatesManageWinForm.vehicleLicense.vehicleNumber"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="发动机号码:" prop="vehicleLicense.engineCode">
                                <el-input v-model="certificatesManageWinForm.vehicleLicense.engineCode"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="挂车尺寸:" prop="vehicleLicense.trailerLength">
                                <dictionary-select style="display: block" size="small"
                                                   option-name="TRAILER_SIZE"
                                                   v-model="certificatesManageWinForm.vehicleLicense.trailerLength"
                                                   :disabled="certificatesManageWinForm.vehicleLicense.trailerLengthDisable"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="外廓尺寸:" prop="vehicleLicense.outLineSize">
                                <el-input v-model="certificatesManageWinForm.vehicleLicense.outLineSize"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="核定载质量(吨):" prop="vehicleLicense.loadMass">
                                <el-input v-model.number="certificatesManageWinForm.vehicleLicense.loadMass"
                                          ref="loadMassDom"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="注册日期:" prop="vehicleLicense.registerDate">
                                <el-date-picker
                                    v-model="certificatesManageWinForm.vehicleLicense.registerDate"
                                    type="date"
                                    style="width:100%;"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="有效日期:" prop="vehicleLicense.effectiveDate">
                                <el-date-picker
                                    v-model="certificatesManageWinForm.vehicleLicense.effectiveDate"
                                    type="date"
                                    style="width:100%;"
                                    value-format="yyyy-MM-dd 23:59:59"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
                <el-card class="box-card" body-style="padding:0px;"
                         style="margin-right: 3.6%; width: 100%; float: left;">
                    <div slot="header" class="clearfix">
                        <span>营运证</span>
                    </div>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="注册日期:" prop="vehicleOperatingLicense.registerDate">
                                <el-date-picker
                                    v-model="certificatesManageWinForm.vehicleOperatingLicense.registerDate"
                                    type="date"
                                    style="width:100%;"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="有效日期:" prop="vehicleOperatingLicense.registerDate">
                                <el-date-picker
                                    v-model="certificatesManageWinForm.vehicleOperatingLicense.effectiveDate"
                                    type="date"
                                    style="width:100%;"
                                    value-format="yyyy-MM-dd 23:59:59"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="附件:" prop="vehicleOperatingLicense.attachment">
                                <el-row>
                                    <el-col :span="14">
                                        <upload-image ref="vehicleOperatingLicenseAttachment"
                                                      fileModule="vehicle"
                                                      v-model="certificatesManageWinForm.vehicleOperatingLicense.attachment"/>
                                    </el-col>
                                    <el-col :span="10">
                                        <show-image-t :url="require('../../../assets/example/operation.png')"
                                                      class1="preImg"></show-image-t>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6"></el-col>
                    </el-row>
                </el-card>
                <el-card class="box-card" body-style="padding:0px;" style=" width: 100%">
                    <div slot="header" class="clearfix">
                        <span>车身照片</span>
                    </div>
                    <el-row v-if="certificatesManageWinForm.type != constant.VEHICLE_TYPE.TRAILER">
                        <el-col :span="6">
                            <el-form-item label="附件:" prop="vehicleBodyAttachment">
                                <el-row>
                                    <el-col :span="14">
                                        <upload-image ref="vehicleBodyAttachment0"
                                                      fileModule="vehicle"
                                                      :limit=1
                                                      v-model="certificatesManageWinForm.vehicleBodyAttachment"/>
                                        <span style="color: red">车身正面照</span>
                                    </el-col>
                                    <el-col :span="10">
                                        <show-image-t :url="require('../../../assets/example/0.jpg')"
                                                      class1="preImg mainImg"></show-image-t>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="附件:" prop="vehicleBodyAttachment">
                                <el-row>
                                    <el-col :span="14">
                                        <upload-image ref="vehicleBodyAttachment90"
                                                      fileModule="vehicle"
                                                      :limit=1
                                                      v-model="certificatesManageWinForm.vehicleBodyAttachment"/>
                                        <span style="color: red">车身侧面照</span>
                                    </el-col>
                                    <el-col :span="10">
                                        <show-image-t :url="require('../../../assets/example/90.jpg')"
                                                      class1="preImg"></show-image-t>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="附件:" prop="vehicleBodyAttachment">
                                <el-row>
                                    <el-col :span="14">
                                        <upload-image ref="vehicleBodyAttachment45"
                                                      fileModule="vehicle"
                                                      :limit=1
                                                      v-model="certificatesManageWinForm.vehicleBodyAttachment"/>
                                        <span style="color: red">车身45度照</span>
                                    </el-col>
                                    <el-col :span="10">
                                        <show-image-t :url="require('../../../assets/example/45.jpg')"
                                                      class1="preImg"></show-image-t>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="certificatesManageWinForm.type != constant.VEHICLE_TYPE.TRACTOR">
                            <el-form-item label="附件:" prop="vehicleBodyAttachment">
                                <el-row>
                                    <el-col :span="14">
                                        <upload-image ref="vehicleBodyAttachmentOpen"
                                                      fileModule="vehicle"
                                                      :limit=1
                                                      v-model="certificatesManageWinForm.vehicleBodyAttachment"/>
                                        <span style="color: red">车尾开门照</span>
                                    </el-col>
                                    <el-col :span="10">
                                        <show-image-t :url="require('../../../assets/example/open.png')"
                                                      class1="preImg mainImg"></show-image-t>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                    </el-row>


                    <!-- 区分挂车 -->


                    <el-row v-else>
                        <el-col :span="6">
                            <el-form-item label="附件:" prop="vehicleBodyAttachment">
                                <el-row>
                                    <el-col :span="14">
                                        <upload-image ref="vehicleBodyAttachment180"
                                                      fileModule="vehicle"
                                                      :limit=1
                                                      v-model="certificatesManageWinForm.vehicleBodyAttachment"/>
                                        <span style="color: red">车尾照</span>
                                    </el-col>
                                    <el-col :span="10">
                                        <show-image-t :url="require('../../../assets/example/180.jpg')"
                                                      class1="preImg mainImg"></show-image-t>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="certificatesManageWinForm.type != constant.VEHICLE_TYPE.TRACTOR">
                            <el-form-item label="附件:" prop="vehicleBodyAttachment">
                                <el-row>
                                    <el-col :span="14">
                                        <upload-image ref="vehicleBodyAttachmentOpen"
                                                      fileModule="vehicle"
                                                      :limit=1
                                                      v-model="certificatesManageWinForm.vehicleBodyAttachment"/>
                                        <span style="color: red">车尾开门照</span>
                                    </el-col>
                                    <el-col :span="10">
                                        <show-image-t :url="require('../../../assets/example/open.png')"
                                                      class1="preImg mainImg"></show-image-t>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
                <div class="bottom clearfix" style="margin-top: 20px; margin-left: 45%;">
                    <el-button type="primary" @click="commitCertificatesManage()" size="small">确定</el-button>
                    <el-button size="small" @click="cancelCertificatesManage()">取消</el-button>
                </div>
            </el-form>
        </el-dialog>

        <!--修改车辆状态-->
        <el-dialog :title="win.winTitle.modifyVehicleTypeWinTitle" :visible.sync="win.winShow.modifyVehicleTypeWin"
                   width="700px">
            <el-form :model="win.model.modifyVehicleTypeWinFormModel" :rules="win.modifVehicleType"
                     ref="modifyVehicleTypeWinForm"
                     label-width="100px" size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车牌号:" prop="licenseNumber">
                            <el-input v-model="win.model.modifyVehicleTypeWinFormModel.licenseNumber" disabled/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="运行状态:" prop="status">
                            <dictionary-select style="display: block" size="small"
                                               v-model="win.model.modifyVehicleTypeWinFormModel.status"
                                               option-name="VEHICLE_STATUS"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click="updateVehicleStatusSubmit('modifyVehicleTypeWinForm')" size="small">确
                    定
                </el-button>
                <el-button @click="win.winShow.modifyVehicleTypeWin = false" size="small">取 消</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
    import {Http, Api, Constant, Common} from 'src/global'
    import dataDec from 'src/components/common/data/data.js'
    import DatadictionaryName from "../../common/select/DatadictionaryName";
    import axios from 'axios'

    export default {
        components: {DatadictionaryName},
        data() {
            let user = this.$store.getters.user;
            return {
                Api: Api,
                currentStatus: '',// 当前选取的运营状态
                toTransferFlag: false, // 过户状态
                statusList: [], // 运营状态列表
                certificatesDonwloadIng: false, // 车辆证件导出状态
                initializeModel: {},
                newData: new Date(),
                constant: Constant,
                exportLoading: true,
                certDownload: true,
                dialogDetailOrgVisible: false,
                certificatesDonwloadVisible: false,
                isMoreItemShow: false,
                certificate: '',
                searchParam: {
                    claim: '',
                    status: '',
                    operationStatus: '',
                    certCompleteFlag: '',
                    certExpireFlag: '',
                    currentPage: 1,
                    pageSize: 10,
                    operationModeArray: 'SELF_SUPPORT,OUTSOURCE',
                    ownerCode: '',
                    loadSquare: ''
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                certificatesManageWinForm: {
                    licenseNumber: '',
                    engineModelNo: '',
                    vehicleModelNo: '',
                    vehicleBodyAttachment: '',
                    registerAttachment: '',
                    type: '',
                    vehicleLicense: {
                        ownerCode: '',
                        oneWheel: '',
                        vehicleType: '',
                        vehicleTypeShow: false,
                        vehicleTypeData: true,
                        trailerLengthDisable: true,
                        brandType: '',
                        vehicleNumber: '',
                        engineCode: '',
                        trailerLength: '',
                        loadMass: '',
                        attachment: '',
                        dateAll: [],
                        registerDate: '',
                        effectiveDate: '',
                        outLineSize: ''
                    },
                    vehicleOperatingLicense: {
                        dateAll: [],
                        attachment: '',
                        registerDate: '',
                        effectiveDate: ''
                    },
                    vehicleInsurance: {
                        strongInsuranceDateAll: [],
                        commercialInsuranceDateAll: [],
                        strongInsuranceAttachment: '',
                        commercialInsuranceAttachment: ''
                    }
                },
                vehicleCertDonwloadDto: {
                    vehicleLicenseFlag: true,
                    operatingLicenseFlag: true,
                    commercialInsuranceFlag: true,
                    strongInsuranceFlag: true,
                    vehicleBodyAttachmentFlag: true,
                    vehicleRegisterAttachmentFlag: true
                },
                permission: {
                    /*权限*/
                    add: '/vehicle/addButton',
                    modify: '/vehicle/modifyButton',
                    delete: '/vehicle/deleteButton',
                    change: '/vehicle/change',
                    updateStatus: '/vehicle/updateVehicleStatus',
                    transfer: '/vehicle/transfer',//过户
                    export: '/vehicle/export',//导出
                    claim: '/vehicle/claimVehicle',//确认车辆
                    notClaim: '/vehicle/notClaimVehicle',//取消认领
                    look: '/vehicle/lookMoney',
                    certificatesManage: '/vehicle/certificatesManage',
                    certBatchUpload: '/vehicle/certBatchUpload',
                    certificatesDonwload: '/vehicle/donwload',
                    upload: '/vehicle/upload'//油卡etc充值额度导入
                },
                win: {
                    winTitle: {
                        vehicleChangeWinTitle: '营运性质变更',
                        vehicleTransferWinTitle: '运营状态变更',
                        modifyVehicleTypeWinTitle: '修改车辆状态',
                        certificatesManageWinTitle: '证件维护'
                    },
                    winShow: {
                        vehicleChangeWin: false,
                        vehicleTransferWin: false,
                        modifyVehicleTypeWin: false,
                        certificatesManageWin: false
                    },
                    model: {
                        vehicleTransferWinWinFormModel: {
                            id: '',
                            licenseNumber: '',
                            changeTheTime: new Date(),
                            transferExecutor: user.name,
                            transferExecutorUser: user.username,
                            accessoryList: [],
                            transferOfNamesAttachment: '',
                            operationStatus: ''
                        },
                        addTrailerWinFormModel: {
                            licenseNumber: ''
                        },
                        vehicleChangeWinFormModel: {
                            control: {
                                show: ''
                            },
                            selfOperationMode: '',
                            selfSupportDate: '',
                            licenseNumber: '',
                            operationMode: '',
                            vehicleOwnerId: '',
                            vehicleOwnerId2: '',
                            outsourceDate: new Date(),
                            trailerList: [],
                            trailerNumber: '',
                            trailerCode:'',
                            supplier: '',
                            orgCode: '',
                            org: {
                                name: '',
                                code: ''
                            },
                            vehicleOperationType: ''
                        },
                        modifyVehicleTypeWinFormModel: {
                            vehicleCode: '',
                            licenseNumber: '',
                            status: ''
                        },
                        addButtonReadOnly: false //注:厢式货车不能添加挂车
                    },
                    verification: {
                        vehicleOwnerId: [
                            {required: true, message: '请选择车主', trigger: 'blur'}
                        ],
                        outsourceDate: [
                            {required: true, message: '请选择包车时间', trigger: 'blur'}
                        ],
                        selfSupportDate: [
                            {required: true, message: '请选择时间', trigger: 'blur'}
                        ]
                    },
                    vehicleTransfer: {
                        changeTheTime: [
                            {required: true, message: '请选择过户时间', trigger: 'blur'}
                        ],
                        transferExecutor: [
                            {required: true, message: '请选择过户执行人', trigger: 'blur'}
                        ]
                    },
                    modifVehicleType: {
                        changeTheTime: [
                            {required: true, message: '请选择过户时间', trigger: 'blur'}
                        ],
                    }
                },
                checkRule: {
                    'vehicleLicense.ownerCode': {required: true, message: '请输入所有人'},
                    'vehicleLicense.vehicleType': {required: true, message: '请选择车辆类型'},
                    'vehicleLicense.brandType': {required: true, message: '请选择品牌类型'},
                    'vehicleLicense.trailerLength': {validator: this.validatePass1, trigger: 'blur'},
                    'vehicleLicense.loadMass': [
                        {validator: this.validatePass, trigger: 'blur'},
                    ],
                    'vehicleLicense.registerDate': {required: true, message: '请选择注册日期'},
                    'vehicleLicense.effectiveDate': {required: true, message: '请选择有效日期'},
                    'vehicleOperatingLicense.registerDate': {required: true, message: '请选择注册日期'},
                    'vehicleOperatingLicense.registerDate': {required: true, message: '请选择有效日期'},
                    'vehicleLicense.vehicleNumber': [
                        // {required: true, message: '请输入车辆识别代号'},
                        // {max: 20, message:'输入长度过长',trigger: 'blur' }
                        {validator: this.validateVehicleNumber, trigger: 'blur'},
                    ],
                    'vehicleLicense.engineCode': [
                        // {required: true, message: '请输入发动机号码'},
                        // {max: 20, message:'输入长度过长',trigger: 'blur' }
                        {validator: this.validateEngineCode, trigger: 'blur'},
                    ],
                    'vehicleLicense.outLineSize': [
                        // {required: true, message: '请输入外廓尺寸'},
                        // {max: 20, message:'输入长度过长',trigger: 'blur' }
                        {validator: this.validateOutLineSize, trigger: 'blur'},
                    ],
                },
                selections: [],
                buttonDisabled: {
                    changeButtonDisabled: true,
                    updateVehicleStatusButtonDisabled: true,
                    vehicleTransferButtonDisabled: true,
                    claimVehicleButtonDisabled: true,
                    certificatesDonwloadButtonDisabled: true
                },
                currentItemAudit: {
                    auditStatus: '',
                    auditRemark: ''
                }
            };
        },
        watch: {
            'win.model.vehicleTransferWinWinFormModel.operationStatus'(val) {
                // 控制是否显示过户界面
                if (val === dataDec['VEHICLE_OPERATION_STATUS'][1].code) {
                    this.toTransferFlag = true
                } else {
                    this.toTransferFlag = false
                }
            },
            selections(val) {
                if (val.length > 0) {
                    const vm = this;
                    //控制列表上方 按钮是否可用
                    vm.buttonDisabled.changeButtonDisabled = val.length !== 1;
                    vm.buttonDisabled.updateVehicleStatusButtonDisabled = val.length !== 1;
                    vm.buttonDisabled.vehicleTransferButtonDisabled = val.length !== 1;
                    vm.buttonDisabled.claimVehicleButtonDisabled = val.length < 1
                    vm.buttonDisabled.certificatesDonwloadButtonDisabled = val.length < 1
                    if (val[0].operationMode === Constant.VEHICLE_OPERATION_MODE.OUT_INVITE || val[0].operationMode === Constant.VEHICLE_OPERATION_MODE.OUTSOURCE) {//外请车 不能进行变更
                        vm.buttonDisabled.changeButtonDisabled = true;
                    }
                    if (val[0].type === Constant.VEHICLE_TYPE.TRAILER) {//只允许车头带车挂 不允许单个车挂
                        vm.buttonDisabled.changeButtonDisabled = true;
                    }
                    vm.win.model.addButtonReadOnly = val[0].type !== Constant.VEHICLE_TYPE.VAN //箱式货车 性质变更界面不允许添加 挂车
                } else {
                    const vm = this;
                    //控制列表上方 按钮是否可用
                    vm.buttonDisabled.changeButtonDisabled = true;
                    vm.buttonDisabled.updateVehicleStatusButtonDisabled = true;
                    vm.buttonDisabled.vehicleTransferButtonDisabled = true;
                    vm.buttonDisabled.claimVehicleButtonDisabled = true
                    vm.buttonDisabled.certificatesDonwloadButtonDisabled = true
                    vm.win.model.addButtonReadOnly = false
                }
            },
            'win.model.vehicleChangeWinFormModel.trailerList'(val) {
                if (val) {
                    var trailerList = [];
                    val.forEach(tra => {
                        trailerList.push(tra.code)
                    });
                    this.win.model.vehicleChangeWinFormModel.trailerCode = trailerList.join("/");
                }
            },
            'win.winShow.vehicleChangeWin'(val) {
                if (val === false) {
                    this.win.model.vehicleChangeWinFormModel = this.cloneMode().win.model.vehicleChangeWinFormModel
                    this.win.model.addTrailerWinFormModel = this.cloneMode().win.model.addTrailerWinFormModel
                } else {
                    this.win.model.vehicleChangeWinFormModel.outsourceDate = new Date()
                }
            },
            'certificatesManageWinForm.type'(val) {//修改车辆类型
                let _this = this;
                if (Constant.VEHICLE_TYPE.VAN === val) {
                    _this.certificatesManageWinForm.vehicleLicense.vehicleTypeShow = false;
                    _this.certificatesManageWinForm.vehicleLicense.vehicleTypeData = true;
                } else if (Constant.VEHICLE_TYPE.TRACTOR === val) {
                    _this.certificatesManageWinForm.vehicleLicense.vehicleTypeShow = false;
                    _this.certificatesManageWinForm.vehicleLicense.vehicleTypeData = false;
                } else if (Constant.VEHICLE_TYPE.TRAILER === val) {
                    _this.certificatesManageWinForm.vehicleLicense.vehicleTypeShow = true;
                    _this.certificatesManageWinForm.vehicleLicense.trailerLengthDisable = false;
                }
            },
        },
        mounted() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            this.searchList();
            this.statusList = dataDec['VEHICLE_OPERATION_STATUS']
        },
        methods: {
            getDriver(item) {
                console.log(item)
                if (item && item.blacklistFlag) {
                    this.$message.error('该用户已被拉黑，无法选择')
                    this.win.model.vehicleChangeWinFormModel.vehicleOwnerId = ''
                }
            },
            getDriver2(item) {
                console.log(item)
                if (item && item.blacklistFlag) {
                    this.$message.error('该用户已被拉黑，无法选择')
                    this.win.model.vehicleChangeWinFormModel.vehicleOwnerId2 = ''
                }
            },
            validateVehicleNumber(rule, value, callback) {
                if (this.certificatesManageWinForm.vehicleLicense.vehicleNumber && this.certificatesManageWinForm.vehicleLicense.vehicleNumber.toString().length > 20) {
                    callback(new Error('长度过长'))
                } else {
                    callback()
                }
            },
            validateEngineCode(rule, value, callback) {
                if (this.certificatesManageWinForm.vehicleLicense.engineCode && this.certificatesManageWinForm.vehicleLicense.engineCode.toString().length > 40) {
                    callback(new Error('长度过长'))
                } else {
                    callback()
                }
            },
            validateOutLineSize(rule, value, callback) {
                if (this.certificatesManageWinForm.vehicleLicense.outLineSize && this.certificatesManageWinForm.vehicleLicense.outLineSize.toString().length > 20) {
                    callback(new Error('长度过长'))
                } else {
                    callback()
                }
            },
            closeTransfer() {
                this.$refs.transferOfNamesAttachment.clearFileList()
            },
            certificatesClose() {
                let vm = this;
                this.$refs.vehicleLicenseAttachment.clearFileList()
                this.$refs.vehicleOperatingLicenseAttachment.clearFileList()
                // this.$refs.strongInsuranceAttachmentInfo.clearFileList()
                // this.$refs.commercialInsuranceAttachmentInfo.clearFileList()
                vm.$refs.vehicleBodyAttachment0 && vm.$refs.vehicleBodyAttachment0.clearFileList();
                vm.$refs.vehicleBodyAttachment90 && vm.$refs.vehicleBodyAttachment90.clearFileList()
                vm.$refs.vehicleBodyAttachment45 && vm.$refs.vehicleBodyAttachment45.clearFileList()
                vm.$refs.vehicleBodyAttachment180 && vm.$refs.vehicleBodyAttachment180.clearFileList()
                vm.$refs.vehicleBodyAttachmentOpen && vm.$refs.vehicleBodyAttachmentOpen.clearFileList()
                this.$refs['certificatesManageWinForm'].resetFields();
                this.currentItemAudit = {
                    auditStatus: '',
                    auditRemark: ''
                }
            },
            validatePass(rule, value, callback) {
                if (this._isempty(value)) {
                    callback(new Error('请输入核定载质量'))
                } else if (typeof value != "number") {
                    callback(new Error('请输入数字'));
                } else if (value > 9999999999) {
                    callback(new Error('输入长度过长'))
                } else {
                    callback();
                }
            },
            validatePass1(rule, value, callback) {
                if (this.certificatesManageWinForm.vehicleLicense.trailerLengthDisable) {
                    callback()
                } else if (this._isempty(value)) {
                    callback('请选择挂车尺寸')
                } else {
                    callback()
                }
            },
            _isempty(obj) {
                if (typeof obj == "undefined" || obj == null || obj === "") {
                    return true;
                } else {
                    return false;
                }
            },
            uploadRecognition(res) {
                if (res.success) {
                    if (res.result.vehicleNumber && res.result.vehicleNumber != this.certificatesManageWinForm.licenseNumber) {
                        this.$message.error('上传图片车牌与该车车牌不符')
                        this.$nextTick(() => {
                            this.$refs.vehicleLicenseAttachment.clearLast()
                        })
                        return
                    }
                }
            },
            _resetUpImgForm() {
                this.certificatesManageWinForm.vehicleLicense.engineCode = ""
                this.certificatesManageWinForm.vehicleLicense.vehicleNumber = ""
                this.certificatesManageWinForm.vehicleLicense.ownerCode = ""
                this.certificatesManageWinForm.vehicleLicense.brandType = ""
                this.certificatesManageWinForm.vehicleLicense.vehicleType = ""
            },
            _getTypeList() {
                let list = []
                if (this.certificatesManageWinForm.vehicleLicense.vehicleTypeShow) {
                    list = dataDec['SEMITRAILER_VEHICLE_TYPE']
                } else {
                    if (this.certificatesManageWinForm.vehicleLicense.vehicleTypeData) {
                        list = dataDec['HEAD_VEHICLE_TYPE']
                        list = _.filter(list, (el) => {
                            return el.code != 'HEAD_HEAVY_MOTOR_TRACTOR'
                        })
                    } else if (!this.certificatesManageWinForm.vehicleLicense.vehicleTypeData) {
                        list = dataDec['HEAD_VEHICLE_TYPE']
                        list = _.filter(list, (el) => {
                            return el.code != 'HEAD_HEAVY_VAN' && el.code != 'HEAD_HEAVY_BOX_TRUCK'
                        })
                    }
                }
                return list
            },
            _getBrandList() {
                let list = []
                if (this.certificatesManageWinForm.vehicleLicense.vehicleTypeShow) {
                    list = dataDec['SEMITRAILER_VEHICLE_BRAND']
                } else if (!this.certificatesManageWinForm.vehicleLicense.vehicleTypeShow) {
                    list = dataDec['HEAD_VEHICLE_BRAND']
                }
                return list
            },
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            showMore() {
                let vm = this;
                vm.isMoreItemShow = true;
            },
            showLess() {
                let vm = this;
                vm.isMoreItemShow = false;
            },
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.selections = val;
            },
            searchList() {
                let vm = this;
                if (this.searchParam.vehicleLicenseDate) {
                    this.searchParam.vehicleLicenseEffectiveStartDate = this.searchParam.vehicleLicenseDate[0];
                    this.searchParam.vehicleLicenseEffectiveEndDate = this.searchParam.vehicleLicenseDate[1];
                } else {
                    this.searchParam.vehicleLicenseEffectiveStartDate = '';
                    this.searchParam.vehicleLicenseEffectiveEndDate = '';
                }
                if (this.searchParam.vehicleOperatingLicenseDate) {
                    this.searchParam.vehicleOperatingLicenseEffectiveStartDate = this.searchParam.vehicleOperatingLicenseDate[0];
                    this.searchParam.vehicleOperatingLicenseEffectiveEndDate = this.searchParam.vehicleOperatingLicenseDate[1];
                } else {
                    this.searchParam.vehicleOperatingLicenseEffectiveStartDate = '';
                    this.searchParam.vehicleOperatingLicenseEffectiveEndDate = '';
                }
                if (this.searchParam.strongInsuranceDate) {
                    this.searchParam.strongInsuranceEffectiveStartDate = this.searchParam.strongInsuranceDate[0];
                    this.searchParam.strongInsuranceEffectiveEndDate = this.searchParam.strongInsuranceDate[1];
                } else {
                    this.searchParam.strongInsuranceEffectiveStartDate = '';
                    this.searchParam.strongInsuranceEffectiveEndDate = '';
                }
                if (this.searchParam.commercialInsuranceDate) {
                    this.searchParam.commercialInsuranceEffectiveStartDate = this.searchParam.commercialInsuranceDate[0];
                    this.searchParam.commercialInsuranceEffectiveEndDate = this.searchParam.commercialInsuranceDate[1];
                } else {
                    this.searchParam.commercialInsuranceEffectiveStartDate = '';
                    this.searchParam.commercialInsuranceEffectiveEndDate = '';
                }

                Http.get(Api.vehicle.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.result.forEach(res => {
                        if (!res.vehicleOperatingLicense) {
                            res.vehicleOperatingLicense = {}
                        }
                        if (!res.vehicleInsurance) {
                            res.vehicleInsurance = {}
                        }
                    })
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                })
            },
            addVehicle() {
                this.$router.push({path: '/operation/vehicleAdd'});
            },
            showModifyVehicleDialog(row) {
                this.$router.push({path: '/operation/vehicleAdd', query: {code: row.code}});
            },
            showVehicleDetail(row) {
                this.$router.push({path: '/operation/vehicleDetail', query: {code: row.code}});
            },
            deleteVehicle(row) {
                let vm = this;
                var ids = [];
                ids.push(row.id);
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.vehicle.delete, ids, result => {
                        vm.searchList();
                    })
                })
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam = vm.cloneMode().searchParam
            },
            changeVehicleShow() {/*车辆性质变更*/
                let row = this.selections[0];
                const _this = this;
                Http.get(Api.vehicle.queryByCode, {params: {"code": row.code}}, function (res) {
                    if (res.result) {
                        res = _.merge(_this.cloneMode().win.model.vehicleChangeWinFormModel, res.result);
                        let vehicleChangeWinFormModel = _this.win.model.vehicleChangeWinFormModel;
                        vehicleChangeWinFormModel.licenseNumber = res.licenseNumber;
                        vehicleChangeWinFormModel.org = res.org;
                        vehicleChangeWinFormModel.orgCode = res.org.code;

                        vehicleChangeWinFormModel.vehicleOperationType = res.operationMode;
                        //2 如果选择为挂车 性质变更 默认显示在 挂车列表中
                        if (res.type === Constant.VEHICLE_TYPE.TRAILER) {
                            vehicleChangeWinFormModel.trailerList = [res]
                        }
                        if (res.operationMode === Constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT) {
                            vehicleChangeWinFormModel.operationMode = Constant.VEHICLE_OPERATION_MODE.OUTSOURCE;//外包
                            vehicleChangeWinFormModel.control.show = true;
                        } else {
                            vehicleChangeWinFormModel.operationMode = Constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT;//外包
                            vehicleChangeWinFormModel.control.show = false;
                        }
                        if (res.org && res.org.partnerSupplier) {
                            setTimeout(() => {
                                _this.$refs.vehicleChangeWinFormModelSupplier.setCurrentSupplier(res.org.partnerSupplier);
                                vehicleChangeWinFormModel.supplier = res.org.partnerSupplier.id
                            }, 0)
                        }
                        //3 显示win
                        _this.win.winShow.vehicleChangeWin = true;
                    } else {
                        _this.$message.error("请求车辆不存在,请刷新重试");
                        _this.searchList();
                    }
                })
            },
            updateVehicleStatus() {
                let row = this.selections[0];
                let _this = this;
                Http.get(Api.vehicle.queryByCode, {params: {'code': row.code}}, result => {
                    _this.win.model.modifyVehicleTypeWinFormModel.licenseNumber = result.result.licenseNumber;
                    _this.win.model.modifyVehicleTypeWinFormModel.vehicleCode = result.result.vehicleCode;
                    _this.win.model.modifyVehicleTypeWinFormModel.status = result.result.status;
                    _this.win.winShow.modifyVehicleTypeWin = true
                })
            },
            updateVehicleStatusSubmit(formName) {
                let _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.$confirm('是否修改车辆运行状态', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            Http.post(Api.vehicle.updateVehicleStatus, _this.win.model.modifyVehicleTypeWinFormModel, result => {
                                _this.searchList();
                                _this.win.winShow.modifyVehicleTypeWin = false
                            })
                        })
                    }
                })
            },
            //更改运营状态
            vehicleTransferShow() {
                let _this = this;
                let row = _this.selections[0];
                // if (row.whetherToChangeTheName) {
                //     _this.$message.info("车辆已经过户,不能重复过户");
                //     return;
                // }
                _this.statusList.forEach((el) => {
                    if (el.code === row.operationStatus) {
                        el.disabled = true
                    } else {
                        el.disabled = false
                    }
                })
                _this.win.model.vehicleTransferWinWinFormModel.id = row.id;
                _this.win.model.vehicleTransferWinWinFormModel.licenseNumber = row.licenseNumber;
                _this.win.model.vehicleTransferWinWinFormModel.operationStatus = row.operationStatus
                _this.win.winShow.vehicleTransferWin = true;
            },
            modelDefault(model) {
                if (model.vehicleInsurance) {
                    if (_.compact(_.concat(model.vehicleInsurance.strongInsuranceStartDate, model.vehicleInsurance.strongInsuranceDate)).length > 0) {
                        model.vehicleInsurance.strongInsuranceDateAll = _.concat(model.vehicleInsurance.strongInsuranceStartDate, model.vehicleInsurance.strongInsuranceDate)
                    }
                    if (_.compact(_.concat(model.vehicleInsurance.commercialInsuranceStartDate, model.vehicleInsurance.commercialInsuranceDate)).length > 0) {
                        model.vehicleInsurance.commercialInsuranceDateAll = _.concat(model.vehicleInsurance.commercialInsuranceStartDate, model.vehicleInsurance.commercialInsuranceDate)
                    }
                }
                //_this.operationModeRestrictOwner(model);
                return model;
            },
            cancelCertificatesManage() {
                let vm = this;
                vm.win.winShow.certificatesManageWin = false;
                vm.$refs.vehicleLicenseAttachment.clearFileList();
                vm.$refs.vehicleOperatingLicenseAttachment.clearFileList();
                // vm.$refs.commercialInsuranceAttachmentInfo.clearFileList();
                // vm.$refs.strongInsuranceAttachmentInfo.clearFileList();
                vm.$refs.vehicleBodyAttachment0 && vm.$refs.vehicleBodyAttachment0.clearFileList();
                vm.$refs.vehicleBodyAttachment90 && vm.$refs.vehicleBodyAttachment90.clearFileList()
                vm.$refs.vehicleBodyAttachment45 && vm.$refs.vehicleBodyAttachment45.clearFileList()
                vm.$refs.vehicleBodyAttachment180 && vm.$refs.vehicleBodyAttachment180.clearFileList()
                vm.$refs.vehicleBodyAttachmentOpen && vm.$refs.vehicleBodyAttachmentOpen.clearFileList()
                // vm.$refs.registerAttachment.clearFileList();
            },
            //证件维护
            ShowCertificatesManageDialog(row) {
                let vm = this;
                if (row.vehicleCertAudit) {
                    vm.currentItemAudit = row.vehicleCertAudit
                }
                vm.certificatesManageWinForm = vm.cloneMode().certificatesManageWinForm
                Http.get(Api.vehicle.queryByCode, {params: {'code': row.code}}, result => {
                    /*设置时间*/
                    vm.certificatesManageWinForm = this.modelDefault(_.merge(vm.certificatesManageWinForm, result.result));
                    /*设置附件*/
                    vm.$refs.vehicleLicenseAttachment.setFileList(vm.certificatesManageWinForm.vehicleLicense.attachment.split(","));
                    vm.$refs.vehicleOperatingLicenseAttachment.setFileList(vm.certificatesManageWinForm.vehicleOperatingLicense.attachment.split(","));
                    // vm.$refs.commercialInsuranceAttachmentInfo.setFileList(vm.certificatesManageWinForm.vehicleInsurance.commercialInsuranceAttachment.split(","));
                    // vm.$refs.strongInsuranceAttachmentInfo.setFileList(vm.certificatesManageWinForm.vehicleInsurance.strongInsuranceAttachment.split(","));
                    // vm.$refs.registerAttachment.setFileList(vm.certificatesManageWinForm.registerAttachment.split(","));
                    // 拆分车辆照片
                    vm.$nextTick(() => {
                        if (vm.certificatesManageWinForm.type != Constant.VEHICLE_TYPE.TRAILER) {
                            let urls = vm.certificatesManageWinForm.vehicleBodyAttachment.split(",")
                            vm.$refs.vehicleBodyAttachment0.setFileList([urls[0]]);
                            vm.$refs.vehicleBodyAttachment90.setFileList([urls[1]]);
                            vm.$refs.vehicleBodyAttachment45.setFileList([urls[2]]);
                            if (vm.certificatesManageWinForm.type != Constant.VEHICLE_TYPE.TRACTOR) {
                                vm.$refs.vehicleBodyAttachmentOpen.setFileList([urls[3]]);
                            }
                        } else {
                            let urls = vm.certificatesManageWinForm.vehicleBodyAttachment.split(",")
                            vm.$refs.vehicleBodyAttachment180.setFileList([urls[0]]);
                            if (vm.certificatesManageWinForm.type != Constant.VEHICLE_TYPE.TRACTOR) {
                                vm.$refs.vehicleBodyAttachmentOpen.setFileList([urls[1]]);
                            }
                        }
                    })
                    // 转化挂车类型值
                    vm.certificatesManageWinForm.vehicleLicense.trailerLength = vm.certificatesManageWinForm.vehicleLicense.trailerLength ? vm.certificatesManageWinForm.vehicleLicense.trailerLength.toString() : ''
                })
                vm.win.winShow.certificatesManageWin = true;
            },
            //证件维护
            commitCertificatesManage() {
                let vm = this;
                this.$refs['certificatesManageWinForm'].validate((valid) => {
                    if (valid) {
                        vm.certificatesManageWinForm.vehicleLicense.attachment = this.$refs.vehicleLicenseAttachment.getFileList().join(",");
                        vm.certificatesManageWinForm.vehicleOperatingLicense.attachment = this.$refs.vehicleOperatingLicenseAttachment.getFileList().join(",");
                        // vm.certificatesManageWinForm.vehicleInsurance.commercialInsuranceAttachment = this.$refs.commercialInsuranceAttachmentInfo.getFileList().join(",");
                        // vm.certificatesManageWinForm.vehicleInsurance.strongInsuranceAttachment = this.$refs.strongInsuranceAttachmentInfo.getFileList().join(",");
                        // vm.certificatesManageWinForm.registerAttachment = this.$refs.registerAttachment.getFileList().join(",");
                        if (vm.certificatesManageWinForm.type != Constant.VEHICLE_TYPE.TRAILER) {
                            vm.certificatesManageWinForm.vehicleBodyAttachment = this.$refs.vehicleBodyAttachment0.getFileList().join(",") + "," + this.$refs.vehicleBodyAttachment90.getFileList().join(",") + "," + this.$refs.vehicleBodyAttachment45.getFileList().join(",");
                            if (vm.certificatesManageWinForm.type != Constant.VEHICLE_TYPE.TRACTOR) {
                                vm.certificatesManageWinForm.vehicleBodyAttachment = vm.certificatesManageWinForm.vehicleBodyAttachment + "," + this.$refs.vehicleBodyAttachmentOpen.getFileList().join(",")
                            }
                        } else {
                            vm.certificatesManageWinForm.vehicleBodyAttachment = this.$refs.vehicleBodyAttachment180.getFileList().join(",") + "," + this.$refs.vehicleBodyAttachmentOpen.getFileList().join(",")
                        }

                        if (vm.certificatesManageWinForm.vehicleInsurance.strongInsuranceDateAll) {
                            vm.certificatesManageWinForm.vehicleInsurance.strongInsuranceStartDate = vm.certificatesManageWinForm.vehicleInsurance.strongInsuranceDateAll[0];
                            vm.certificatesManageWinForm.vehicleInsurance.strongInsuranceDate = vm.certificatesManageWinForm.vehicleInsurance.strongInsuranceDateAll[1]
                        }
                        if (vm.certificatesManageWinForm.vehicleInsurance.commercialInsuranceDateAll) {
                            vm.certificatesManageWinForm.vehicleInsurance.commercialInsuranceStartDate = vm.certificatesManageWinForm.vehicleInsurance.commercialInsuranceDateAll[0];
                            vm.certificatesManageWinForm.vehicleInsurance.commercialInsuranceDate = vm.certificatesManageWinForm.vehicleInsurance.commercialInsuranceDateAll[1]
                        }
                        Http.post(Api.vehicle.certificatesManage, vm.certificatesManageWinForm, response => {
                            vm.searchList();
                            setTimeout(() => {
                                vm.cancelCertificatesManage();
                            })
                        })
                    }
                })
            },
            changeVehicleWinSubmit(formName) {//性质变更提交
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        /*提交性质变更*/
                        Http.post(Api.vehicle.vehicleOutsourceAdd, {vehicleOutsource: vm.win.model.vehicleChangeWinFormModel}, function (res) {
                            vm.win.winShow.vehicleChangeWin = false;
                            vm.searchList()
                        })
                    }
                })
            },
            //过户
            vehicleTransferWinSubmit(formName) {
                let vm = this;
                let res = false;
                this.statusList.forEach((el) => {
                    if (el.disabled === true) {
                        if (vm.win.model.vehicleTransferWinWinFormModel.operationStatus === el.code) {
                            res = true
                        }
                    }
                })
                if (res) {
                    vm.$message.error("没有变更营运状态，无法提交")
                    return
                }
                if (formName.operationStatus === dataDec['VEHICLE_OPERATION_STATUS'][1].code) { // 过户过户流程
                    this.$refs['vehicleTransferWinForm'].validate((valid) => {
                        if (valid) {
                            vm.win.model.vehicleTransferWinWinFormModel.transferOfNamesAttachment = vm.$refs.transferOfNamesAttachment.getFileList().join(",");
                            /*提交性质变更*/
                            Http.post(Api.vehicle.vehicleTransfer, vm.win.model.vehicleTransferWinWinFormModel, function (res) {
                                vm.win.winShow.vehicleTransferWin = false;
                                vm.searchList()
                            })
                        }
                    })
                } else { // 更改其他运营状态
                    Http.post(Api.vehicle.vehicleTransfer, vm.win.model.vehicleTransferWinWinFormModel, function (res) {
                        vm.win.winShow.vehicleTransferWin = false;
                        vm.searchList()
                    })
                }

            },
            trailerButtonSubmit() {
                var trailer = this.$refs.addTrailerLicenseNumber.getObject();
                var trailerList = this.win.model.vehicleChangeWinFormModel.trailerList;
                if (trailer && trailerList.length === 0) {
                    trailerList.push(trailer)
                } else {
                    var pus = true;
                    for (var tra of trailerList) {
                        if (tra.code === trailer.code) {
                            pus = false
                        }
                    }
                    if (pus && trailer) {
                        trailerList.push(trailer)
                    }
                }
                this.win.model.addTrailerWinFormModel.licenseNumber = ''
            },
            //导出
            vehicleExport() {
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.vehicleExport.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '车辆信息.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            uploadSuccess() {
                let _this = this;
                _this.searchList();
            },
            deleteVehicleForList(index, rows) {
                rows.splice(index, 1)
            },
            claimVehicle() {
                let _this = this;
                let ids = [];
                _this.selections.forEach(row => {
                    ids.push(row.id)
                });
                Http.post(Api.vehicle.claimVehicle, ids, function (res) {
                    _this.$message({
                        message: '成功认领车辆!',
                        type: 'success'
                    });
                    _this.searchList()
                });
            },
            notClaimVehicle() {
                let _this = this;
                let ids = [];
                _this.selections.forEach(row => {
                    ids.push(row.id)
                });
                Http.post(Api.vehicle.notClaimVehicle, ids, function (res) {
                    _this.$message({
                        message: '成功取消认领!',
                        type: 'success'
                    });
                    _this.searchList()
                });
            },
            formatterVehicleLicense(row) {
                return row.vehicleLicense ? Common.date.dateFormat(row.vehicleLicense.effectiveDate, "YYYY-MM-DD") : ''
            },
            certificatesDonwloadVehicle() {
                let vm = this;
                if (!vm.certificate) {
                    return this.$message.warning("请输入车牌号");
                }
                let certificates = [];
                var regex = new RegExp('\n|\n|\n', 'g');
                let match = vm.certificate.replace(regex, ',');
                certificates = match.split(",");
                if (certificates.length > 50) {
                    return this.$message.warning("导出数量不能超过50个");
                }
                if (certificates.length == 0) {
                    return this.$message.warning("请输入车牌号");
                }
                vm.certificatesDonwloadVisible = false;
                vm.certificate = '';
                vm.certDownload = false;
                axios.get(Api.vehicle.certificatesDonwload, {
                    params: {
                        licenseNumbers: certificates,
                        vehicleLicenseFlag: vm.vehicleCertDonwloadDto.vehicleLicenseFlag,
                        operatingLicenseFlag: vm.vehicleCertDonwloadDto.operatingLicenseFlag,
                        commercialInsuranceFlag: vm.vehicleCertDonwloadDto.commercialInsuranceFlag,
                        strongInsuranceFlag: vm.vehicleCertDonwloadDto.strongInsuranceFlag,
                        vehicleBodyAttachmentFlag: vm.vehicleCertDonwloadDto.vehicleBodyAttachmentFlag,
                        vehicleRegisterAttachmentFlag: vm.vehicleCertDonwloadDto.vehicleRegisterAttachmentFlag,
                    }, responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-zip'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    vm.certDownload = true;
                    vm.resetVehicleCertDonwloadDto();
                    //配置下载的文件名
                    link.download = '车辆证件.zip';
                    link.click();
                })
            },
            resetVehicleCertDonwloadDto() {
                this.vehicleCertDonwloadDto.vehicleLicenseFlag = true;
                this.vehicleCertDonwloadDto.operatingLicenseFlag = true;
                this.vehicleCertDonwloadDto.commercialInsuranceFlag = true;
                this.vehicleCertDonwloadDto.strongInsuranceFlag = true;
                this.vehicleCertDonwloadDto.vehicleBodyAttachmentFlag = true;
                this.vehicleCertDonwloadDto.vehicleRegisterAttachmentFlag = true;
            }
        }
    };
</script>
<style>
    .changeRed {
        color: red;
    }

    .changePadding {
        margin-bottom: 10px;
        text-align: center;
        font-size: 19px;
    }

    .preImg {
        width: 100%;
    }

    #certificates .el-upload-list.el-upload-list--picture {
        margin-top: 30px;
    }

    .mainImg {
        width: 60%;
    }
</style>

