<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"/> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"/> 运力管理</el-breadcrumb-item>
                <el-breadcrumb-item>外请车辆管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header height="" class="content-header">
            <el-form size="small" :model="searchParam" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车辆编码:">
                            <el-input v-model="searchParam.code" size="small"/>
                        </el-form-item>
                    </el-col>
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
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="12">
                        <el-form-item label="商业险有效日期:" label-width="120px">
                            <el-date-picker
                                v-model="searchParam.commercialInsuranceDate"
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="daterange"
                                style="width: 100%"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="行驶证有效日期:" label-width="120px">
                            <el-date-picker
                                v-model="searchParam.vehicleLicenseDate"
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width: 100%"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="12">
                        <el-form-item label="营运证有效日期:" label-width="120px">
                            <el-date-picker
                                v-model="searchParam.vehicleOperatingLicenseDate"
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width: 100%"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="交强险有效日期:" label-width="120px">
                            <el-date-picker
                                v-model="searchParam.strongInsuranceDate"
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                type="daterange"
                                style="width: 100%"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="规格:">
                            <dictionary-select style="display: block" option-name="VEHICLE_SPECIFICATION"
                                               v-model="searchParam.specification"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:" prop="outInviteSupplierId">
                            <supplier-select v-model="searchParam.outInviteSupplierId"
                                             types="CAR_TEAM,DEPARTMENT_OF_INFORMATION"
                                             style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="float: right">
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
            <el-button size="mini" type="primary" icon="el-icon-plus" v-permission="permission.add"
                       @click="addOutInviteVehicle">
                新增
            </el-button>
            <el-button size="mini" type="primary" v-permission="permission.change" @click="changeVehicleShow"
                       :disabled="buttonDisabled.changeButtonDisabled">营运性质变更
            </el-button>
            <el-table class="content-table" size="small" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40"/>
                <el-table-column label="车辆编码" header-align="center" prop="code" width="150"/>
                <el-table-column label="车辆号牌" header-align="center" prop="licenseNumber" width="150">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;"
                           @click="showOutInviteVehicleDetail(scope.row)">{{scope.row.licenseNumber }}</a>
                    </template>
                </el-table-column>
                <el-table-column label="所属区域" header-align="center" prop="org.name" width="150"/>
                <el-table-column label="供应商" header-align="center" prop="outInviteSupplier.name" width="150"/>
                <el-table-column label="使用状态" header-align="center" prop="status" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_STATUS" :value="scope.row.status"/>
                    </template>
                </el-table-column>
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
                <el-table-column label="承载方数" header-align="center" prop="loadSquare" width="100"></el-table-column>
                <el-table-column label="车厢类型" header-align="center" prop="vanType" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE" :value="scope.row.vanType"/>
                    </template>
                </el-table-column>
                <el-table-column label="营运模式" header-align="center" prop="operationMode" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="scope.row.operationMode"/>
                    </template>
                </el-table-column>
                <el-table-column label="行驶证有效日期" header-align="center"
                                 prop="vehicleOperatingLicense.effectiveDate"
                                 width="120">
                    <template slot-scope="scope">
                        {{scope.row.vehicleLicense === undefined ? "" :
                        scope.row.vehicleLicense.effectiveDate | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column label="营运证有效日期" header-align="center"
                                 prop="vehicleOperatingLicense.effectiveDate"
                                 width="120">
                    <template slot-scope="scope">
                        {{scope.row.vehicleOperatingLicense === undefined ? "" :
                        scope.row.vehicleOperatingLicense.effectiveDate | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column label="交强险有效日期" header-align="center"
                                 prop="vehicleInsurance.strongInsuranceDate"
                                 width="120">
                    <template slot-scope="scope">
                        {{scope.row.vehicleInsurance === undefined ? "":scope.row.vehicleInsurance.strongInsuranceDate
                        || "" | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column label="商业险有效日期" header-align="center"
                                 prop="vehicleInsurance.commercialInsuranceDate"
                                 width="120">
                    <template slot-scope="scope">
                        {{scope.row.vehicleInsurance == undefined ?
                        "":scope.row.vehicleInsurance.commercialInsuranceDate | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" header-align="center" prop="createTime" width="180"/>
                <el-table-column label="创建人" header-align="center" prop="createUser" width="150"/>
                <el-table-column label="修改时间" header-align="center" prop="modifyTime" width="180"/>
                <el-table-column label="修改人" header-align="center" prop="modifyUser" width="150"/>
                <el-table-column label="操作" header-align="center" align="center" fixed="right" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini" v-permission="permission.modify"
                                   @click="showModifyOutInviteVehicleDialog(scope.row)"/>
                        <el-button type="text" size="mini" v-permission="permission.credentials"
                                   @click="showCredentialsVehicleDetail(scope.row)">证件信息
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" v-permission="permission.delete" size="mini"
                                   @click="deleteOutInviteVehicle(scope.row)"/>
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
        <el-dialog :title="win.winTitle.outInviteVehicleEditWinTitle"
                   :visible.sync="win.winShow.outInviteVehicleEditWin" width="80%" :top="marginTop">
            <el-form :model="win.model.outInviteVehicleEditWinFormModel" :rules="win.verification"
                     ref="outInviteVehicleEditWinForm" label-width="120px" size="small">
                <el-row>
                    <el-col :span="24">
                        <label class="blue">营运信息</label>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车辆性质:" prop="operationMode">
                            <label>{{"外请"}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆号牌:" prop="licenseNumber" :rules="[Validate.licenseNumber1]" v-if="win.isAdd && win.isSemitrailer">
                            <el-input  v-model="win.model.outInviteVehicleEditWinFormModel.licenseNumber" />
                        </el-form-item>
                        <el-form-item label="车辆号牌:" prop="licenseNumber" :rules="[Validate.trailerLicenseNumber]" v-if="win.isAdd && !win.isSemitrailer">
                            <el-input  v-model="win.model.outInviteVehicleEditWinFormModel.licenseNumber"/>
                        </el-form-item>
                        <el-form-item label="车辆号牌:" prop="licenseNumber" v-if="!win.isAdd">
                            <label >{{ win.model.outInviteVehicleEditWinFormModel.licenseNumber}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:" prop="belongOrgCode">
                            <org-select style="display:block;" ref="vehicleBelongOrgCode"
                                        v-model="win.model.outInviteVehicleEditWinFormModel.belongOrgCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆类型:" prop="type">
                            <dictionary-select v-model="win.model.outInviteVehicleEditWinFormModel.type"
                                               style="display: block" size="small" option-name="VEHICLE_TYPE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="规格(米):" prop="specification"
                                      :rules="[Validate.required('规格',win.model.outInviteVehicleEditWinFormModel.type === 'VAN' || win.model.outInviteVehicleEditWinFormModel.type === 'TRAILER')]">
                            <dictionary-select style="display: block" size="small" option-name="VEHICLE_SPECIFICATION"
                                               :disabled="win.vehicleTypeRequiredDisabled.vanDisabled"
                                               v-model="win.model.outInviteVehicleEditWinFormModel.specification"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车厢类型:" prop="vanType"
                                      :rules="[Validate.required('车厢类型',win.model.outInviteVehicleEditWinFormModel.type === 'VAN' || win.model.outInviteVehicleEditWinFormModel.type === 'TRAILER')]">
                            <dictionary-select v-model="win.model.outInviteVehicleEditWinFormModel.vanType"
                                               :disabled="win.vehicleTypeRequiredDisabled.vanDisabled"
                                               style="display: block" size="small"
                                               option-name="VEHICLE_COMPARTMENT_TYPE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="承载方数:" prop="loadSquare">
                            <el-input v-model="win.model.outInviteVehicleEditWinFormModel.loadSquare"
                                      :disabled="win.vehicleTypeRequiredDisabled.vanDisabled"/>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="供应商:" prop="outInviteSupplierId">
                            <supplier-select v-model="win.model.outInviteVehicleEditWinFormModel.outInviteSupplierId"
                                             types="CAR_TEAM,DEPARTMENT_OF_INFORMATION" ref="outInviteSupplier"
                                             style="display: block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <label class="blue">行驶证</label>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所有人:" prop="vehicleLicense.ownerCode">
                            <el-input
                                v-model="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.ownerCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆类型:" prop="vehicleLicense.vehicleType"
                                      v-show="!win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleTypeShow && win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleTypeData">
                            <dictionary-select style="display:block;" option-name="HEAD_VEHICLE_TYPE"
                                               :excludeOptions="['HEAD_HEAVY_MOTOR_TRACTOR']"
                                               v-model="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleType"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆类型:" prop="vehicleLicense.vehicleType"
                                      v-show="!win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleTypeShow && !win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleTypeData">
                            <dictionary-select style="display:block;" option-name="HEAD_VEHICLE_TYPE"
                                               :excludeOptions="['HEAD_HEAVY_VAN','HEAD_HEAVY_BOX_TRUCK']"
                                               v-model="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleType"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆类型:" prop="vehicleLicense.vehicleType"
                                      v-show="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleTypeShow">
                            <dictionary-select style="display:block;" option-name="SEMITRAILER_VEHICLE_TYPE"
                                               v-model="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleType"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="品牌型号:" prop="vehicleLicense.brandType"
                                      v-show="!win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleTypeShow">
                            <dictionary-select style="display:block;" option-name="HEAD_VEHICLE_BRAND"
                                               v-model="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.brandType"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="品牌型号:" prop="vehicleLicense.brandType"
                                      v-show="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleTypeShow">
                            <dictionary-select style="display:block;" option-name="SEMITRAILER_VEHICLE_BRAND"
                                               v-model="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.brandType"/>
                        </el-form-item>
                    </el-col>


                    <el-col :span="6">
                        <el-form-item label="车辆代码:" prop="vehicleLicense.vehicleNumber">
                            <el-input
                                v-model="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleNumber"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="注册日期:" prop="vehicleLicense.dateAll">
                            <el-date-picker
                                v-model="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.dateAll"
                                type="daterange"
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width:100%;"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发动机号:" prop="vehicleLicense.engineCode">
                            <el-input
                                v-model="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.engineCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="挂车长度(米):" prop="vehicleLicense.trailerLength">
                            <el-input
                                v-model="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.trailerLength"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="核定载重(吨):" prop="vehicleLicense.loadMass">
                            <el-input v-model="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.loadMass"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="附件:" prop="vehicleLicense.attachment">
                            <upload-image ref="vehicleLicenseAttachmentEdit"
                                          v-model="win.model.outInviteVehicleEditWinFormModel.vehicleLicense.attachment"></upload-image>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <label class="blue">营运证</label>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="注册日期:" prop="vehicleOperatingLicense.dateAll">
                            <el-date-picker
                                v-model="win.model.outInviteVehicleEditWinFormModel.vehicleOperatingLicense.dateAll"
                                type="daterange"
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width:100%;"
                                range-separator="至"
                                unlink-panels
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="附件:" prop="vehicleOperatingLicense.attachment">
                            <upload-image ref="vehicleOperatingLicenseAttachmentEdit"
                                          v-model="win.model.outInviteVehicleEditWinFormModel.vehicleOperatingLicense.attachment"></upload-image>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6"></el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <label class="blue">保险</label>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="交强险开始时间:" prop="vehicleInsurance.strongInsuranceDateAll">
                            <el-date-picker
                                v-model="win.model.outInviteVehicleEditWinFormModel.vehicleInsurance.strongInsuranceDateAll"
                                type="daterange"
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width:100%;"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="交强险附件:" prop="vehicleInsurance.strongInsuranceAttachment">
                            <upload-image ref="strongInsuranceAttachmentInfoEdit"
                                          v-model="win.model.outInviteVehicleEditWinFormModel.vehicleInsurance.strongInsuranceAttachment"></upload-image>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商业险开始日期:" prop="vehicleInsurance.commercialInsuranceDateAll">
                            <el-date-picker
                                v-model="win.model.outInviteVehicleEditWinFormModel.vehicleInsurance.commercialInsuranceDateAll"
                                type="daterange"
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width:100%;"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商业险附件:" prop="vehicleInsurance.commercialInsuranceAttachment">
                            <upload-image ref="commercialInsuranceAttachmentInfoEdit"
                                          v-model="win.model.outInviteVehicleEditWinFormModel.vehicleInsurance.commercialInsuranceAttachment"></upload-image>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click="modifyOutInviteVehicleDialogSubmit('outInviteVehicleEditWinForm')"
                           size="small">确 定
                </el-button>
                <el-button @click="win.winShow.outInviteVehicleEditWin = false" size="small">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="win.winTitle.outInviteVehicleDetailsWinTitle"
                   :visible.sync="win.winShow.outInviteVehicleDetailsWin"
                   width="80%" :top="marginTop">
            <el-form :model="win.model.outInviteVehicleDetailsWinModel" :rules="win.verification"
                     ref="outInviteVehicleDetailsWinForm"
                     label-width="120px" size="small">
                <el-row>
                    <el-col :span="24">
                        <span class="blue">营运信息</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车辆编号:" prop="code">
                            {{win.model.outInviteVehicleDetailsWinModel.code}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆号牌:" prop="licenseNumber">
                            {{win.model.outInviteVehicleDetailsWinModel.licenseNumber}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:" prop="belongOrgCode">
                            {{win.model.outInviteVehicleDetailsWinModel.org.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆性质:" prop="operationMode">
                            <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                    :value="win.model.outInviteVehicleDetailsWinModel.operationMode"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车辆类型:" prop="type">
                            <dictionary-select-name option-name="VEHICLE_TYPE"
                                                    :value="win.model.outInviteVehicleDetailsWinModel.type"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="规格(米):" prop="specification">
                            <dictionary-select-name option-name="VEHICLE_SPECIFICATION"
                                                    :value="win.model.outInviteVehicleDetailsWinModel.specification"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车厢类型:" prop="vanType">
                            <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE"
                                                    :value="win.model.outInviteVehicleDetailsWinModel.vanType"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="承载方数:" prop="loadSquare">
                            {{win.model.outInviteVehicleDetailsWinModel.loadSquare}}
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            {{win.model.outInviteVehicleDetailsWinModel.outInviteSupplier.name}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <span class="blue">行驶证</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所有人:" prop="vehicleLicense.ownerCode">
                            {{win.model.outInviteVehicleDetailsWinModel.vehicleLicense.ownerCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆类型:" prop="vehicleLicense.vehicleType">
                            <dictionary-select-name option-name="SEMITRAILER_VEHICLE_TYPE,HEAD_VEHICLE_TYPE"
                                                    :value="win.model.outInviteVehicleDetailsWinModel.vehicleLicense.vehicleType"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="品牌型号:" prop="vehicleLicense.brandType">
                            <dictionary-select-name option-name="SEMITRAILER_VEHICLE_BRAND,HEAD_VEHICLE_BRAND"
                                                    :value="win.model.outInviteVehicleDetailsWinModel.vehicleLicense.brandType"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆代码:" prop="vehicleLicense.vehicleNumber">
                            {{win.model.outInviteVehicleDetailsWinModel.vehicleLicense.vehicleNumber}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发动机号:" prop="vehicleLicense.engineCode">
                            {{win.model.outInviteVehicleDetailsWinModel.vehicleLicense.engineCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="挂车长度(米):" prop="vehicleLicense.trailerLength">
                            {{win.model.outInviteVehicleDetailsWinModel.vehicleLicense.trailerLength}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="核定载重(吨):" prop="vehicleLicense.loadMass">
                            {{win.model.outInviteVehicleDetailsWinModel.vehicleLicense.loadMass}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="注册日期:" prop="vehicleLicense.registerDate">
                            {{win.model.outInviteVehicleDetailsWinModel.vehicleLicense.registerDate}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="有效期至:" prop="vehicleLicense.effectiveDate">
                            {{win.model.outInviteVehicleDetailsWinModel.vehicleLicense.effectiveDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="附件:" prop="vehicleLicense.attachment">
                            <show-image :url="win.model.outInviteVehicleDetailsWinModel.vehicleLicense.attachment"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <span class="blue">营运证</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="注册日期:" prop="vehicleOperatingLicense.registerDate">
                            {{win.model.outInviteVehicleDetailsWinModel.vehicleOperatingLicense.registerDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="有效期至:" prop="vehicleOperatingLicense.effectiveDate">
                            {{win.model.outInviteVehicleDetailsWinModel.vehicleOperatingLicense.effectiveDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="附件:" prop="vehicleOperatingLicense.attachment">
                            <show-image
                                :url="win.model.outInviteVehicleDetailsWinModel.vehicleOperatingLicense.attachment"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <span class="blue">保险</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="交强险开始时间:" prop="vehicleInsurance.strongInsuranceStartDate">
                            {{win.model.outInviteVehicleDetailsWinModel.vehicleInsurance.strongInsuranceStartDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="有效期至:" prop="vehicleInsurance.strongInsuranceDate">
                            {{win.model.outInviteVehicleDetailsWinModel.vehicleInsurance.strongInsuranceDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="交强险附件:" prop="vehicleInsurance.strongInsuranceAttachment">
                            <show-image
                                :url="win.model.outInviteVehicleDetailsWinModel.vehicleInsurance.strongInsuranceAttachment"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="商业险开始日期:" prop="vehicleInsurance.commercialInsuranceStartDate">
                            {{win.model.outInviteVehicleDetailsWinModel.vehicleInsurance.commercialInsuranceStartDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="有效期至:" prop="vehicleInsurance.strongInsuranceDate">
                            {{win.model.outInviteVehicleDetailsWinModel.vehicleInsurance.commercialInsuranceDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商业险附件:" prop="vehicleInsurance.commercialInsuranceAttachment">
                            <show-image
                                :url="win.model.outInviteVehicleDetailsWinModel.vehicleInsurance.commercialInsuranceAttachment"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>


        <el-dialog :title="win.winTitle.credentialsWinTitle"
                   :visible.sync="win.winShow.credentialsWinShow"
                   width="80%" :top="marginTop">
            <el-form :model="win.model.credentialsVehicleEditWinFormModel" :rules="win.verification"
                     ref="outInviteVehicleDetailsWinForm"
                     label-width="120px" size="small">
                <el-row>
                    <el-col :span="24">
                        <span class="blue">营运信息</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车辆编号:" prop="code">
                            {{win.model.credentialsVehicleEditWinFormModel.code}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆号牌:" prop="licenseNumber">
                            {{win.model.credentialsVehicleEditWinFormModel.licenseNumber}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:" prop="belongOrgCode">
                            {{win.model.credentialsVehicleEditWinFormModel.org.name}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆性质:" prop="operationMode">
                            <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                    :value="win.model.credentialsVehicleEditWinFormModel.operationMode"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车辆类型:" prop="type">
                            <dictionary-select-name option-name="VEHICLE_TYPE"
                                                    :value="win.model.credentialsVehicleEditWinFormModel.type"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="规格(米):" prop="specification">
                            <dictionary-select-name option-name="VEHICLE_SPECIFICATION"
                                                    :value="win.model.credentialsVehicleEditWinFormModel.specification"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车厢类型:" prop="vanType">
                            <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE"
                                                    :value="win.model.credentialsVehicleEditWinFormModel.vanType"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="承载方数:" prop="loadSquare">
                            {{win.model.credentialsVehicleEditWinFormModel.loadSquare}}
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            {{win.model.credentialsVehicleEditWinFormModel.outInviteSupplier.name}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <span class="blue">行驶证</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所有人:" prop="vehicleLicense.ownerCode">
                            {{win.model.credentialsVehicleEditWinFormModel.vehicleLicense.ownerCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆类型:" prop="vehicleLicense.vehicleType">
                            <dictionary-select-name option-name="SEMITRAILER_VEHICLE_TYPE,HEAD_VEHICLE_TYPE"
                                                    :value="win.model.credentialsVehicleEditWinFormModel.vehicleLicense.vehicleType"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="品牌型号:" prop="vehicleLicense.brandType">
                            <dictionary-select-name option-name="SEMITRAILER_VEHICLE_BRAND,HEAD_VEHICLE_BRAND"
                                                    :value="win.model.credentialsVehicleEditWinFormModel.vehicleLicense.brandType"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆代码:" prop="vehicleLicense.vehicleNumber">
                            {{win.model.credentialsVehicleEditWinFormModel.vehicleLicense.vehicleNumber}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发动机号:" prop="vehicleLicense.engineCode">
                            {{win.model.credentialsVehicleEditWinFormModel.vehicleLicense.engineCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="挂车长度(米):" prop="vehicleLicense.trailerLength">
                            {{win.model.credentialsVehicleEditWinFormModel.vehicleLicense.trailerLength}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="核定载重(吨):" prop="vehicleLicense.loadMass">
                            {{win.model.credentialsVehicleEditWinFormModel.vehicleLicense.loadMass}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="注册日期:" prop="vehicleLicense.registerDate">
                            {{win.model.credentialsVehicleEditWinFormModel.vehicleLicense.registerDate}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="有效期至:" prop="vehicleLicense.effectiveDate">
                            {{win.model.credentialsVehicleEditWinFormModel.vehicleLicense.effectiveDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="附件:" prop="vehicleLicense.attachment">
                            <upload-image ref="vehicleLicenseAttachmentEditCredentials"
                                          v-model="win.model.credentialsVehicleEditWinFormModel.vehicleLicense.attachment"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <span class="blue">营运证</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="注册日期:" prop="vehicleOperatingLicense.registerDate">
                            {{win.model.credentialsVehicleEditWinFormModel.vehicleOperatingLicense.registerDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="有效期至:" prop="vehicleOperatingLicense.effectiveDate">
                            {{win.model.credentialsVehicleEditWinFormModel.vehicleOperatingLicense.effectiveDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="附件:" prop="vehicleOperatingLicense.attachment">
                            <upload-image ref="vehicleOperatingLicenseAttachmentEditCredentials"
                                          v-model="win.model.credentialsVehicleEditWinFormModel.vehicleOperatingLicense.attachment"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <span class="blue">保险</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="交强险开始时间:" prop="vehicleInsurance.strongInsuranceStartDate">
                            {{win.model.credentialsVehicleEditWinFormModel.vehicleInsurance.strongInsuranceStartDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="有效期至:" prop="vehicleInsurance.strongInsuranceDate">
                            {{win.model.credentialsVehicleEditWinFormModel.vehicleInsurance.strongInsuranceDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="交强险附件:" prop="vehicleInsurance.strongInsuranceAttachment">
                            <upload-image ref="strongInsuranceAttachmentInfoEditCredentials"
                                          v-model="win.model.credentialsVehicleEditWinFormModel.vehicleInsurance.strongInsuranceAttachment"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="商业险开始日期:" prop="vehicleInsurance.commercialInsuranceStartDate">
                            {{win.model.credentialsVehicleEditWinFormModel.vehicleInsurance.commercialInsuranceStartDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="有效期至:" prop="vehicleInsurance.strongInsuranceDate">
                            {{win.model.credentialsVehicleEditWinFormModel.vehicleInsurance.commercialInsuranceDate}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商业险附件:" prop="vehicleInsurance.commercialInsuranceAttachment">
                            <upload-image ref="commercialInsuranceAttachmentInfoEditCredentials"
                                          v-model="win.model.credentialsVehicleEditWinFormModel.vehicleInsurance.commercialInsuranceAttachment"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click="credentialsVehicleDialogSubmit()"
                           size="small">确 定
                </el-button>
                <el-button @click="win.winShow.credentialsWinShow = false" size="small">取 消</el-button>
            </div>
        </el-dialog>

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
                        <el-form-item label="营运模式:" prop="operationMode">
                            <dictionary-select style="display: block" size="small" :clearable="false"
                                               v-model="win.model.vehicleChangeWinFormModel.operationMode"
                                               @change="handleChange(win.model.vehicleChangeWinFormModel.operationMode)"
                                               option-name="VEHICLE_OUT_INVITE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="自营模式:" prop="operationSelfMode" v-show="win.winShow.operationSelfMode">
                            <dictionary-select style="display: block" size="small" :clearable="false"
                                               v-model="win.model.vehicleChangeWinFormModel.selfOperationMode"
                                               option-name="VEHICLE_OUT_INVITE_OPERATION_SELF_MODE"
                                               />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click="changeVehicleWinSubmit('vehicleChangeWinForm')" size="small">确 定
                </el-button>
                <el-button @click="win.winShow.vehicleChangeWin = false" size="small">取 消</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
    import {Http, Api, Constant, Common, Validate} from 'src/global'
    import DatadictionaryName from '../../../common/select/DatadictionaryName'

    export default {
        components: {
            DatadictionaryName
        },
        data() {
            return {
                tableHeight: window.innerHeight>800?430:null,
                initializeModel: {},
                constant: Constant,
                Validate: Validate,
                dialogDetailOrgVisible: false,
                isMoreItemShow: false,
                searchParam: {
                    code: '',
                    licenseNumber: '',
                    belongOrgCode: '',
                    type: '',
                    specification: '',
                    outInviteSupplierId: '',
                    operationAttribute: '',
                    vehicleLicenseDate: [],
                    vehicleOperatingLicenseDate: [],
                    currentPage: 1,
                    pageSize: 10,
                    operationModeArray: 'OUT_INVITE',
                    outInviteVehicleLicenseDate: [],
                    outInviteVehicleOperatingLicenseDate: [],
                    strongInsuranceDate: [],
                    commercialInsuranceDate: [],
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                permission: {
                    /*权限*/
                    add: '/outInviteVehicle/add',
                    modify: '/outInviteVehicle/modify',
                    delete: '/outInviteVehicle/delete',
                    change: '/outInviteVehicle/change',
                    credentials:'/outInviteVehicle/credentials'
                },
                win: {
                    isAdd: true,
                    isSemitrailer:true,
                    winTitle: {
                        outInviteVehicleEditWinTitle: '修改外请车信息',
                        outInviteVehicleDetailsWinTitle: '查看外请车信息',
                        credentialsWinTitle: '维护证件',
                        vehicleChangeWinTitle: '营运性质变更'
                    },
                    winShow: {
                        outInviteVehicleEditWin: false,
                        outInviteVehicleDetailsWin: false,
                        credentialsWinShow: false,
                        vehicleChangeWin: false,
                        operationSelfMode: true
                    },
                    model: {
                        vehicleChangeWinFormModel: {
                            licenseNumber: '',
                            operationMode: 'SELF_SUPPORT',
                            selfOperationMode: 'SELF_SELF_SUPPORT'
                        },
                        outInviteVehicleEditWinFormModel: {
                            belongOrgCode: '',
                            type: '',
                            specification: '',
                            vanType: '',
                            loadSquare: '',
                            outInviteSupplierId: '',
                            operationMode: 'OUT_INVITE',
                            vehicleLicense: {
                                vehicleTypeShow: false,
                                vehicleTypeData: true,
                                vehicleNumber: '',
                                brandType: '',
                                vehicleType: '',
                                ownerCode: '',
                                dateAll: [],
                                engineCode: '',
                                trailerLength: '',
                                loadMass: '',
                                attachment: '',
                                registerDate: '',
                                effectiveDate: ''
                            },
                            vehicleOperatingLicense: {
                                dateAll: [],
                                attachment: '',
                                registerDate: '',
                                effectiveDate: ''
                            },
                            vehicleInsurance: {
                                strongInsuranceStartDate: '',
                                strongInsuranceDate: '',
                                commercialInsuranceStartDate: '',
                                commercialInsuranceDate: '',
                                strongInsuranceDateAll: [],
                                commercialInsuranceDateAll: [],
                                strongInsuranceAttachment: '',
                                commercialInsuranceAttachment: ''
                            },
                            org: {
                                name: '',
                                code: ''
                            },
                            outInviteSupplier: {
                                id: '',
                                name: ''
                            },
                        },
                        outInviteVehicleDetailsWinModel: {
                            vehicleLicense: {
                                ownerCode: '',
                                vehicleType: '',
                                brandType: '',
                                vehicleNumber: '',
                                engineCode: '',
                                trailerLength: '',
                                loadMass: '',
                                registerDate: '',
                                effectiveDate: '',
                                attachment: ''
                            },
                            vehicleOperatingLicense: {
                                registerDate: '',
                                effectiveDate: '',
                                attachment: ''
                            },
                            vehicleInsurance: {
                                strongInsuranceStartDate: '',
                                strongInsuranceDate: '',
                                strongInsuranceAttachment: '',
                                commercialInsuranceStartDate: '',
                                commercialInsuranceDate: '',
                                commercialInsuranceAttachment: ''
                            },
                            org: {
                                name: '',
                                code: ''
                            },
                            outInviteSupplier: {
                                id: '',
                                name: ''
                            },
                        },
                        credentialsVehicleEditWinFormModel:{
                            belongOrgCode: '',
                            type: '',
                            specification: '',
                            vanType: '',
                            loadSquare: '',
                            outInviteSupplierId: '',
                            operationMode: 'OUT_INVITE',
                            vehicleLicense: {
                                vehicleTypeShow: false,
                                vehicleTypeData: true,
                                vehicleNumber: '',
                                brandType: '',
                                vehicleType: '',
                                ownerCode: '',
                                dateAll: [],
                                engineCode: '',
                                trailerLength: '',
                                loadMass: '',
                                attachment: '',
                                registerDate: '',
                                effectiveDate: ''
                            },
                            vehicleOperatingLicense: {
                                dateAll: [],
                                attachment: '',
                                registerDate: '',
                                effectiveDate: ''
                            },
                            vehicleInsurance: {
                                strongInsuranceStartDate: '',
                                strongInsuranceDate: '',
                                commercialInsuranceStartDate: '',
                                commercialInsuranceDate: '',
                                strongInsuranceDateAll: [],
                                commercialInsuranceDateAll: [],
                                strongInsuranceAttachment: '',
                                commercialInsuranceAttachment: ''
                            },
                            org: {
                                name: '',
                                code: ''
                            },
                            outInviteSupplier: {
                                id: '',
                                name: ''
                            },
                        }
                    },
                    verification: {
                        type: [
                            {required: true, message: '请输入车辆类型', trigger: 'blur'}
                        ],
                        specification: [
                            {required: true, message: '请输入规格(米)', trigger: 'blur'}
                        ],
                        vanType: [
                            {required: true, message: '请选择车厢类型', trigger: 'blur'}
                        ],
                        'vehicleLicense.trailerLength': [
                            Validate.floatingNumber
                        ],
                        'vehicleLicense.loadMass': [
                            Validate.floatingNumber
                        ]
                    },
                    //根据车辆类型 选择必填项
                    vehicleTypeRequiredDisabled: {
                        vanDisabled: false,//单车
                        tractorDisabled: false,//牵引车
                        trailerDisabled: true,//半挂车
                        disable: false //复合
                    },
                },
                selections: [],
                buttonDisabled: {
                    changeButtonDisabled: true
                }
            };
        },
        watch: {
            selections(val) {
                if (val) {
                    const vm = this;
                    //控制列表上方 按钮是否可用
                    vm.buttonDisabled.changeButtonDisabled = val.length !== 1;
                }
            },
            'win.winShow.outInviteVehicleEditWin'(val) {
                let vm = this;
                if (val) {
                    if (vm.win.isAdd) {
                        vm.win.winTitle.outInviteVehicleEditWinTitle = "新增外请车信息"
                    } else {
                        vm.win.winTitle.outInviteVehicleEditWinTitle = "修改外请车信息"
                    }
                } else {
                    if (!vm.win.isAdd) {
                        vm.resetEditWin()
                    }
                    vm.$refs.vehicleLicenseAttachmentEdit.clearFileList();
                    vm.$refs.vehicleOperatingLicenseAttachmentEdit.clearFileList();
                    vm.$refs.commercialInsuranceAttachmentInfoEdit.clearFileList();
                    vm.$refs.strongInsuranceAttachmentInfoEdit.clearFileList();
                }
            },
            'win.winShow.credentialsWinShow'(val) {
                let vm = this;
                if (!val) {
                    vm.$refs.vehicleLicenseAttachmentEditCredentials.clearFileList();
                    vm.$refs.vehicleOperatingLicenseAttachmentEditCredentials.clearFileList();
                    vm.$refs.commercialInsuranceAttachmentInfoEditCredentials.clearFileList();
                    vm.$refs.strongInsuranceAttachmentInfoEditCredentials.clearFileList();
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
            'win.model.outInviteVehicleEditWinFormModel.type'(val) {//修改车辆类型
                let _this = this;
                if (Constant.VEHICLE_TYPE.VAN === val) {
                    _this.win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleTypeShow = false;
                    _this.win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleTypeData = true;
                    _this.win.vehicleTypeRequiredDisabled.vanDisabled = false;
                    _this.win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleType = '';
                    _this.win.isSemitrailer = true;
                } else if (Constant.VEHICLE_TYPE.TRACTOR === val) {
                    _this.win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleTypeShow = false;
                    _this.win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleTypeData = false;
                    _this.win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleType = '';
                    _this.win.vehicleTypeRequiredDisabled.vanDisabled = true;
                    _this.win.model.outInviteVehicleEditWinFormModel.loadSquare = '';
                    _this.win.model.outInviteVehicleEditWinFormModel.vanType = '';
                    _this.win.model.outInviteVehicleEditWinFormModel.specification = '';
                    _this.win.isSemitrailer = true;
                } else if (Constant.VEHICLE_TYPE.TRAILER === val) {
                    _this.win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleTypeShow = true;
                    _this.win.model.outInviteVehicleEditWinFormModel.vehicleLicense.vehicleType = '';
                    _this.win.model.outInviteVehicleEditWinFormModel.vehicleLicense.trailerLengthDisable = false;
                    _this.win.vehicleTypeRequiredDisabled.vanDisabled = false;
                    _this.win.isSemitrailer = false;
                }
            }
        },
        computed: {
            marginTop: function () { //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "15vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "8vh";
                }
            }
        },
        mounted() {
            //拷贝一个 model 用于重置
            this.initializeModel = _.cloneDeep(this._data);
            this.searchList();
        },
        methods: {
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            showMore() {
                this.isMoreItemShow = true;
            },
            showLess() {
                this.isMoreItemShow = false;
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.selections = val;
            },
            changeVehicleShow(){ /*车辆性质变更*/
                let row = this.selections[0];
                const _this = this;
                Http.get(Api.vehicle.queryByCode, {params: {"code": row.code}}, function (res) {
                    if (res.result) {
                        res = _.merge(_this.cloneMode().win.model.vehicleChangeWinFormModel, res.result);

                        let vehicleChangeWinFormModel = _this.win.model.vehicleChangeWinFormModel
                        //1 当前为外包修改未自营  否则 反之
                        vehicleChangeWinFormModel.licenseNumber = res.licenseNumber;
                        vehicleChangeWinFormModel.org = res.org;
                        let orgCode = res.org==null?'':res.org.code;
                        vehicleChangeWinFormModel.orgCode = orgCode;

                        vehicleChangeWinFormModel.vehicleOperationType = res.operationMode;
                        //2 如果选择为挂车 性质变更 默认显示在 挂车列表中
                        if (res.type === Constant.VEHICLE_TYPE.TRAILER) {
                            vehicleChangeWinFormModel.trailerList = [res]
                        }
                        if (res.operationMode === Constant.VEHICLE_OPERATION_MODE.OUT_INVITE) {
                            //vehicleChangeWinFormModel.operationMode = Constant.VEHICLE_OPERATION_MODE.OUTSOURCE;//外包

                            console.log(res)
                            //3 显示win
                            _this.win.winShow.vehicleChangeWin = true;
                        } else if (res.operationMode === Constant.VEHICLE_OPERATION_MODE.OUTSOURCE) {
                            _this.$confirm('是否修改车辆营运属性为自营?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                //vehicleChangeWinFormModel.operationMode = Constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT; //自营
                                let licenseNumberArray = [];
                                licenseNumberArray.push(res.licenseNumber);
                                Http.post(Api.vehicle.operationAttributeChange, {
                                    'licenseNumberArray': licenseNumberArray,
                                    'operationMode': Constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT
                                }, result => {
                                    _this.searchList();
                                })

                            })
                        }
                    } else {
                        _this.$message.error("请求车辆不存在,请刷新重试");
                        _this.searchList();
                    }
                })

            },
            searchList() {
                let vm = this;
                if (vm.searchParam.commercialInsuranceDate) {
                    vm.searchParam.commercialInsuranceEffectiveStartDate = vm.searchParam.commercialInsuranceDate[0];
                    vm.searchParam.commercialInsuranceEffectiveEndDate = vm.searchParam.commercialInsuranceDate[1];
                }
                if (vm.searchParam.vehicleLicenseDate) {
                    vm.searchParam.vehicleLicenseEffectiveStartDate = vm.searchParam.vehicleLicenseDate[0];
                    vm.searchParam.vehicleLicenseEffectiveEndDate = vm.searchParam.vehicleLicenseDate[1];
                }
                if (vm.searchParam.vehicleOperatingLicenseDate) {
                    vm.searchParam.vehicleOperatingLicenseEffectiveStartDate = vm.searchParam.vehicleOperatingLicenseDate[0];
                    vm.searchParam.vehicleOperatingLicenseEffectiveEndDate = vm.searchParam.vehicleOperatingLicenseDate[1];
                }
                if (vm.searchParam.strongInsuranceDate) {
                    vm.searchParam.strongInsuranceEffectiveStartDate = vm.searchParam.strongInsuranceDate[0];
                    vm.searchParam.strongInsuranceEffectiveEndDate = vm.searchParam.strongInsuranceDate[1];
                }
                Http.get(Api.vehicle.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.result.forEach(res => {
                        if (!res.outInviteVehicleOperatingLicense) {
                            res.outInviteVehicleOperatingLicense = {}
                        }
                        if (!res.outInviteVehicleInsurance) {
                            res.outInviteVehicleInsurance = {}
                        }
                    });
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                })
            },
            addOutInviteVehicle() {
                this.win.isAdd = true;
                this.win.winShow.outInviteVehicleEditWin = true;
            },
            showModifyOutInviteVehicleDialog(row) {
                let vm = this;
                vm.win.isAdd = false
                Http.get(Api.vehicle.queryByCode, {params: {'code': row.code}}, result => {
                    let model;
                    model = _.merge(vm.cloneMode().win.model.outInviteVehicleEditWinFormModel, result.result);
                    if (model.vehicleLicense.registerDate && model.vehicleLicense.effectiveDate) {
                        model.vehicleLicense.dateAll = _.concat(model.vehicleLicense.registerDate, model.vehicleLicense.effectiveDate);
                    } else if (!model.vehicleLicense.registerDate && model.vehicleLicense.effectiveDate || model.vehicleLicense.registerDate && !model.vehicleLicense.effectiveDate) {
                        model.vehicleLicense.dateAll = _.concat(model.vehicleLicense.registerDate || " ", model.vehicleLicense.effectiveDate || " ");
                    }
                    if (model.vehicleOperatingLicense.registerDate && model.vehicleOperatingLicense.effectiveDate) {
                        model.vehicleOperatingLicense.dateAll = _.concat(model.vehicleOperatingLicense.registerDate, model.vehicleOperatingLicense.effectiveDate);
                    } else if (!model.vehicleOperatingLicense.registerDate && model.vehicleOperatingLicense.effectiveDate || model.vehicleOperatingLicense.registerDate && !model.vehicleOperatingLicense.effectiveDate) {
                        model.vehicleOperatingLicense.dateAll = _.concat(model.vehicleOperatingLicense.registerDate || " ", model.vehicleOperatingLicense.effectiveDate || " ");
                    }

                    if (model.vehicleInsurance.strongInsuranceStartDate && model.vehicleInsurance.strongInsuranceDate) {
                        model.vehicleInsurance.strongInsuranceDateAll = _.concat(model.vehicleInsurance.strongInsuranceStartDate, model.vehicleInsurance.strongInsuranceDate);
                    } else if (model.vehicleInsurance.strongInsuranceStartDate && !model.vehicleInsurance.strongInsuranceDate || model.vehicleInsurance.strongInsuranceDate && model.vehicleInsurance.strongInsuranceStartDate) {
                        model.vehicleInsurance.strongInsuranceDateAll = _.concat(model.vehicleInsurance.strongInsuranceStartDate || " ", model.vehicleInsurance.strongInsuranceDate || " ");
                    }
                    if (model.vehicleInsurance.commercialInsuranceStartDate && model.vehicleInsurance.commercialInsuranceDate) {
                        model.vehicleInsurance.commercialInsuranceDateAll = _.concat(model.vehicleInsurance.commercialInsuranceStartDate, model.vehicleInsurance.commercialInsuranceDate);
                    } else if (!model.vehicleInsurance.commercialInsuranceStartDate && model.vehicleInsurance.commercialInsuranceDate || model.vehicleInsurance.commercialInsuranceStartDate && !model.vehicleInsurance.commercialInsuranceDate) {
                        model.vehicleInsurance.commercialInsuranceDateAll = _.concat(model.vehicleInsurance.commercialInsuranceStartDate || " ", model.vehicleInsurance.commercialInsuranceDate || " ");
                    }
                    setTimeout(function () {
                        vm.$refs.vehicleLicenseAttachmentEdit.setFileList(model.vehicleLicense.attachment.split(","));
                        vm.$refs.vehicleOperatingLicenseAttachmentEdit.setFileList(model.vehicleOperatingLicense.attachment.split(","));
                        vm.$refs.commercialInsuranceAttachmentInfoEdit.setFileList(model.vehicleInsurance.commercialInsuranceAttachment.split(","));
                        vm.$refs.strongInsuranceAttachmentInfoEdit.setFileList(model.vehicleInsurance.strongInsuranceAttachment.split(","));
                        vm.$refs.vehicleBelongOrgCode.setCurrentOrg(model.org);
                        vm.$refs.outInviteSupplier.setCurrentSupplier(model.outInviteSupplier);
                    }, 0);
                    vm.win.model.outInviteVehicleEditWinFormModel = model;
                    vm.win.winShow.outInviteVehicleEditWin = true
                })
            },
            showOutInviteVehicleDetail(row) {
                let vm = this;
                Http.get(Api.vehicle.queryByCode, {params: {'code': row.code}}, result => {
                    let model = _.merge(vm.cloneMode().win.model.outInviteVehicleDetailsWinModel, result.result);
                    vm.win.model.outInviteVehicleDetailsWinModel = model;
                    vm.win.winShow.outInviteVehicleDetailsWin = true;
                })
            },
            showCredentialsVehicleDetail(row) {
                let vm = this;
                Http.get(Api.vehicle.queryByCode, {params: {'code': row.code}}, result => {
                    let model = _.merge(vm.cloneMode().win.model.credentialsVehicleEditWinFormModel, result.result);
                    setTimeout(function () {
                        vm.$refs.vehicleLicenseAttachmentEditCredentials.setFileList(model.vehicleLicense.attachment.split(","));
                        vm.$refs.vehicleOperatingLicenseAttachmentEditCredentials.setFileList(model.vehicleOperatingLicense.attachment.split(","));
                        vm.$refs.commercialInsuranceAttachmentInfoEditCredentials.setFileList(model.vehicleInsurance.commercialInsuranceAttachment.split(","));
                        vm.$refs.strongInsuranceAttachmentInfoEditCredentials.setFileList(model.vehicleInsurance.strongInsuranceAttachment.split(","));
                    }, 0);
                    vm.win.model.credentialsVehicleEditWinFormModel = model;
                    vm.win.winShow.credentialsWinShow = true;
                })
            },
            deleteOutInviteVehicle(row) {
                let vm = this;
                let ids = [];
                ids.push(row.id);
                vm.$confirm('删除后不可恢复, 是否继续?', '提示', {
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
                vm.searchParam = this.cloneMode().searchParam;
            },
            modifyOutInviteVehicleDialogSubmit() {
                let vm = this;
                let model = vm.theWriteTime(vm.win.model.outInviteVehicleEditWinFormModel);
                //反写上传文件
                model.vehicleLicense.attachment = vm.$refs.vehicleLicenseAttachmentEdit.getFileList().join(",");
                model.vehicleOperatingLicense.attachment = vm.$refs.vehicleOperatingLicenseAttachmentEdit.getFileList().join(",");
                model.vehicleInsurance.commercialInsuranceAttachment = vm.$refs.commercialInsuranceAttachmentInfoEdit.getFileList().join(",");
                model.vehicleInsurance.strongInsuranceAttachment = vm.$refs.strongInsuranceAttachmentInfoEdit.getFileList().join(",");

                vm.$refs.outInviteVehicleEditWinForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.vehicle.addOutInvite, model, response => {
                            vm.win.winShow.outInviteVehicleEditWin = false;
                            vm.resetEditWin();
                        })
                    }
                });
            },
            credentialsVehicleDialogSubmit() {
                let vm = this;
                let model = vm.theWriteTime(vm.win.model.credentialsVehicleEditWinFormModel);
                //反写上传文件
                model.vehicleLicense.attachment = vm.$refs.vehicleLicenseAttachmentEditCredentials.getFileList().join(",");
                model.vehicleOperatingLicense.attachment = vm.$refs.vehicleOperatingLicenseAttachmentEditCredentials.getFileList().join(",");
                model.vehicleInsurance.commercialInsuranceAttachment = vm.$refs.commercialInsuranceAttachmentInfoEditCredentials.getFileList().join(",");
                model.vehicleInsurance.strongInsuranceAttachment = vm.$refs.strongInsuranceAttachmentInfoEditCredentials.getFileList().join(",");
                Http.post(Api.vehicle.credentials, model, response => {
                    vm.win.winShow.credentialsWinShow = false;
                    vm.resetEditWin();
                });
            },
            theWriteTime(model) {
                //反写时间
                if (model.vehicleLicense.dateAll) {
                    model.vehicleLicense.registerDate = model.vehicleLicense.dateAll[0];
                    model.vehicleLicense.effectiveDate = model.vehicleLicense.dateAll[1];
                }
                if (model.vehicleOperatingLicense.dateAll) {
                    model.vehicleOperatingLicense.registerDate = model.vehicleOperatingLicense.dateAll[0];
                    model.vehicleOperatingLicense.effectiveDate = model.vehicleOperatingLicense.dateAll[1];
                }
                if (model.vehicleInsurance.strongInsuranceDateAll) {
                    model.vehicleInsurance.strongInsuranceStartDate = model.vehicleInsurance.strongInsuranceDateAll[0];
                    model.vehicleInsurance.strongInsuranceDate = model.vehicleInsurance.strongInsuranceDateAll[1];
                }
                if (model.vehicleInsurance.commercialInsuranceDateAll) {
                    model.vehicleInsurance.commercialInsuranceStartDate = model.vehicleInsurance.commercialInsuranceDateAll[0];
                    model.vehicleInsurance.commercialInsuranceDate = model.vehicleInsurance.commercialInsuranceDateAll[1];
                }
                return model;
            },
            resetEditWin() {
                this.win.model.outInviteVehicleEditWinFormModel = this.cloneMode().win.model.outInviteVehicleEditWinFormModel;
            },
            handleChange(operationMode) {
                let _this = this;
                if(operationMode === 'OUTSOURCE'){
                    _this.win.winShow.operationSelfMode = false;
                }else if (operationMode === 'SELF_SUPPORT'){
                    _this.win.model.vehicleChangeWinFormModel.operationSelfMode = 'OUT_INVITE_SELF_SUPPORT';
                    _this.win.winShow.operationSelfMode = true;
                }
                console.log(_this.win.model.vehicleChangeWinFormModel)
            },
            changeVehicleWinSubmit(formName) {//性质变更提交
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        /*提交性质变更*/
                        Http.post(Api.vehicle.modifyVehicleOperationMode, vm.win.model.vehicleChangeWinFormModel, function (res) {
                            vm.win.winShow.vehicleChangeWin = false;
                            vm.searchList()
                        })
                    }
                })
            }
        }
    };
</script>
<style scoped>
    .blue {
        color: #20a0ff;
        display: inline-block;
        width: 150px;
        margin-bottom: 12px;
    }
</style>
