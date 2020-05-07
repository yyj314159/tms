<template>
    <el-container style="height: 100%;">
        <el-header height="" style="padding-left: 0">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                    <el-breadcrumb-item><i class="el-icon-date"></i> 车辆管理</el-breadcrumb-item>
                    <el-breadcrumb-item>车辆信息编辑</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-header>
        <el-container>
            <el-main style="border:1px solid #aaa; width: 100%; padding:0px 10px 20px 2px;">
                <el-form id="vehicleForm" size="small" :model="addVehicleForm" :rules="addVehicleRules"
                         ref="addVehicleForm"
                         label-width="120px">
                    <el-card class="box-card" body-style="padding:0px;" style="width: 100%; ">
                        <div slot="header" class="clearfix">
                            <span>行驶证</span>
                        </div>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="附件:" prop="vehicleLicense.attachment">
                                    <uploadImage-Recognition ref="vehicleLicenseAttachment"
                                                @upload = uploadRecognition
                                                  fileModule="vehicle"
                                                  v-model="addVehicleForm.vehicleLicense.attachment"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="所有人:" prop="vehicleLicense.ownerCode">
                                    <el-input v-model="addVehicleForm.vehicleLicense.ownerCode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车辆类型:" prop="vehicleLicense.vehicleType"
                                              v-show="!addVehicleForm.vehicleLicense.vehicleTypeShow && addVehicleForm.vehicleLicense.vehicleTypeData">
                                    <dictionary-select style="display:block;" option-name="HEAD_VEHICLE_TYPE"
                                                       :excludeOptions="['HEAD_HEAVY_MOTOR_TRACTOR']"
                                                       v-model="addVehicleForm.vehicleLicense.vehicleType"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车辆类型:" prop="vehicleLicense.vehicleType"
                                              v-show="!addVehicleForm.vehicleLicense.vehicleTypeShow && !addVehicleForm.vehicleLicense.vehicleTypeData">
                                    <dictionary-select style="display:block;" option-name="HEAD_VEHICLE_TYPE"
                                                       :excludeOptions="['HEAD_HEAVY_VAN','HEAD_HEAVY_BOX_TRUCK']"
                                                       v-model="addVehicleForm.vehicleLicense.vehicleType"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车辆类型:" prop="vehicleLicense.vehicleType"
                                              v-show="addVehicleForm.vehicleLicense.vehicleTypeShow">
                                    <dictionary-select style="display:block;" option-name="SEMITRAILER_VEHICLE_TYPE"
                                                       v-model="addVehicleForm.vehicleLicense.vehicleType"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="品牌型号:" prop="vehicleLicense.brandType"
                                              v-show="!addVehicleForm.vehicleLicense.vehicleTypeShow">
                                    <dictionary-select style="display:block;" option-name="HEAD_VEHICLE_BRAND"
                                                       v-model="addVehicleForm.vehicleLicense.brandType"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="品牌型号:" prop="vehicleLicense.brandType"
                                              v-show="addVehicleForm.vehicleLicense.vehicleTypeShow">
                                    <dictionary-select style="display:block;" option-name="SEMITRAILER_VEHICLE_BRAND"
                                                       v-model="addVehicleForm.vehicleLicense.brandType"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="车辆识别代号:" prop="vehicleLicense.vehicleNumber">
                                    <el-input v-model="addVehicleForm.vehicleLicense.vehicleNumber"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="发动机号码:" prop="vehicleLicense.engineCode">
                                    <el-input v-model="addVehicleForm.vehicleLicense.engineCode"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="挂车尺寸:" prop="vehicleLicense.trailerLength">
                                    <dictionary-select style="display: block" size="small"
                                                       option-name="TRAILER_SIZE"
                                                       v-model="addVehicleForm.vehicleLicense.trailerLength"
                                                       :disabled="addVehicleForm.vehicleLicense.trailerLengthDisable"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="外廓尺寸:" prop="vehicleLicense.outLineSize">
                                    <el-input v-model="addVehicleForm.vehicleLicense.outLineSize"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="核定载质量(吨):" prop="vehicleLicense.loadMass">
                                    <el-input v-model.number="addVehicleForm.vehicleLicense.loadMass"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="注册日期:" prop="vehicleLicense.registerDate">
                                    <el-date-picker
                                        v-model="addVehicleForm.vehicleLicense.registerDate"
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
                                        v-model="addVehicleForm.vehicleLicense.effectiveDate"
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
                             style="margin-right: 3%; width: 100%;float: left;">
                        <div slot="header" class="clearfix">
                            <span>车辆信息</span>
                        </div>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="台账编号:" prop="vehicleNo">
                                    <el-input v-model="addVehicleForm.vehicleNo"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车辆号牌:" prop="licenseNumber">
                                    <el-input v-model.trim="addVehicleForm.licenseNumber" :disabled="isModify"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车辆性质:" prop="operationMode">
                                    <dictionary-select option-name="VEHICLE_OPERATION_MODE" style="display: block"
                                                       size="small"
                                                       :disabled="true"
                                                       v-model="addVehicleForm.operationMode"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="自营模式:" prop="selfOperationMode">
                                    <dictionary-select option-name="SELF_OPERATION_MODE" style="display: block"
                                                       size="small"
                                                       v-model="addVehicleForm.selfOperationMode"
                                                       :disabled="addVehicleForm.selfOperationModeShow"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="所属区域:" prop="belongOrgCode">
                                    <org-select style="display:block;" ref="vehicleBelongOrgCode"
                                                v-model="addVehicleForm.belongOrgCode"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车辆类型:" prop="type">
                                    <dictionary-select v-model="addVehicleForm.type" style="display: block" size="small"
                                                       option-name="VEHICLE_TYPE" @input="vehicleTypeRestrict"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车厢类型:" prop="vanType">
                                    <dictionary-select v-model="addVehicleForm.vanType" style="display: block"
                                                       size="small"
                                                       option-name="VEHICLE_COMPARTMENT_TYPE"
                                                       :disabled="vehicleTypeRequiredDisabled.vanDisabled"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车型:" prop="specification">
                                    <dictionary-select style="display: block" size="small"
                                                       option-name="VEHICLE_SPECIFICATION"
                                                       v-model="addVehicleForm.specification"
                                                       :disabled="vehicleTypeRequiredDisabled.vanDisabled"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="承载方数:" prop="loadSquare">
                                    <el-input v-model="addVehicleForm.loadSquare"
                                              :disabled="vehicleTypeRequiredDisabled.vanDisabled"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="驱动类型:" prop="oneWheel" v-show="addVehicleForm.oneWheelDisabled">
                                    <dictionary-select style="display:block;" option-name="SINGLE_AND_DOUBLE_DRIVE"
                                                       :excludeOptions="['6*4']"
                                                       v-model="addVehicleForm.oneWheel"
                                                       :disabled="vehicleTypeRequiredDisabled.tractorDisabled"/>
                                </el-form-item>

                                <el-form-item label="驱动类型:" prop="oneWheel" v-show="!addVehicleForm.oneWheelDisabled">
                                    <dictionary-select style="display:block;" option-name="SINGLE_AND_DOUBLE_DRIVE"
                                                       v-model="addVehicleForm.oneWheel"
                                                       :disabled="vehicleTypeRequiredDisabled.tractorDisabled"/>
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :span="6">
                                <el-form-item label="挂车尺寸:" prop="trailerSize" v-show="false">
                                    <dictionary-select style="display: block" size="small"
                                                       option-name="TRAILER_SIZE"
                                                       v-model="addVehicleForm.trailerSize"
                                                       :disabled="vehicleTypeRequiredDisabled.trailerDisabled"/>
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="6">
                                <el-form-item label="挂车轴数:" prop="trailerAxle">
                                    <dictionary-select style="display: block" size="small"
                                                       option-name="TRAILER_AXLE"
                                                       v-model="addVehicleForm.trailerAxle"
                                                       :disabled="vehicleTypeRequiredDisabled.trailerDisabled"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="单双胎:" prop="numberOfTires">
                                    <dictionary-select style="display: block" size="small"
                                                       option-name="NUMBER_OF_TIRES"
                                                       v-model="addVehicleForm.numberOfTires"
                                                       :disabled="vehicleTypeRequiredDisabled.trailerDisabled"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="挂车车厢材质:" prop="trailerTexture">
                                    <dictionary-select style="display: block" size="small"
                                                       option-name="TRAILER_TEXTURE"
                                                       v-model="addVehicleForm.trailerTexture"
                                                       :disabled="vehicleTypeRequiredDisabled.trailerDisabled"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车辆属性:" prop="operationAttribute">
                                    <dictionary-select style="display:block;" option-name="VEHICLE_OPERATION_ATTRIBUTE"
                                                       v-model="addVehicleForm.operationAttribute"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车主:" prop="owner">
                                    <vehicle-owner-select ref="vehicleOwner" style="display:block;" disabled
                                                          v-model="addVehicleForm.owner"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车头/车挂:" prop="vehicleMatching">
                                    <vehicle-select ref="addVehicleFormVehicleMatching" style="display:block;"
                                                    :type="addVehicleFormVehicleMatchingVehicleType" size="small"
                                                    :disabled="addVehicleFormVehicleMatchingDisable"
                                                    v-model="addVehicleForm.vehicleMatching"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="常用司机:" prop="vehicleDriver">
                                    <driver-select ref="addVehicleFormVehicleDriver" style="display:block;" size="small"
                                                   v-model="addVehicleForm.vehicleDriver"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6"
                                    v-permission="permission.oilCardLimit">
                                <el-form-item label="油卡额度:" prop="oilCardLimit">
                                    <el-input v-model="addVehicleForm.oilCardLimit" size="small"
                                              style="width: 100%" :controls="false"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" >
                                <el-form-item label="备注:" prop="remark">
                                    <el-input v-model="addVehicleForm.remark" size="small"
                                              style="width: 100%"/>
                                </el-form-item>
                            </el-col>
                            <!--<el-col :span="6"-->
                            <!--v-permission="permission.petrolStationLimit">-->
                            <!--<el-form-item label="油站额度:" prop="petrolStationLimit" v-if="false">-->
                            <!--<el-input v-model="addVehicleForm.petrolStationLimit" size="small"-->
                            <!--style="width: 100%" :controls="false"/>-->
                            <!--</el-form-item>-->
                            <!--</el-col>-->
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="租赁:" prop="petrolStationLimit">
                                    <el-switch
                                        v-model="addVehicleForm.lease"
                                        active-value="1"
                                        inactive-value="0"
                                        active-color="#13ce66" inactive-color="#ff4949"
                                        active-text="是"
                                        inactive-text="否">
                                    </el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="出租:" prop="petrolStationLimit">
                                    <el-switch
                                        v-model="addVehicleForm.rentOut"
                                        active-value="1"
                                        inactive-value="0"
                                        active-color="#13ce66" inactive-color="#ff4949"
                                        active-text="是"
                                        inactive-text="否">
                                    </el-switch>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-card class="box-card" body-style="padding:0px;"
                             style="margin-right: 3.6%; width: 100%; float: left;">
                        <div slot="header" class="clearfix">
                            <span>采购信息</span>
                        </div>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="购置日期:" prop="purchaseDate">
                                    <el-date-picker style="display: block; width:100%;"
                                                    v-model="addVehicleForm.purchaseDate"
                                                    type="date"
                                                    value-format="yyyy-MM-dd 00:00:00"
                                                    placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="进口/国产" prop="imported">
                                    <dictionary-select style="display:block;" option-name="VEHICLE_PROCUREMEN_TYPE"
                                                       v-model="addVehicleForm.imported"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="裸车价:" prop="nakedCarsAndTaxes">
                                    <el-input v-model="addVehicleForm.nakedCarsAndTaxes"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="购置税:" prop="purchaseTax">
                                    <el-input v-model="addVehicleForm.purchaseTax"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="车船税:" prop="vehicleAndVesselTax">
                                    <el-input v-model="addVehicleForm.vehicleAndVesselTax"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="上牌费:" prop="licensePlateNumberCost">
                                    <el-input v-model="addVehicleForm.licensePlateNumberCost"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车体广告费" prop="advertisingCosts">
                                    <el-input v-model="addVehicleForm.advertisingCosts"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="GPS费用:" prop="gpsCost">
                                    <el-input v-model="addVehicleForm.gpsCost"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="营运证费用:" prop="operationCertificateCost">
                                    <el-input v-model="addVehicleForm.operationCertificateCost"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="座位险:" prop="seatInsurance">
                                    <el-input v-model="addVehicleForm.seatInsurance"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="交强险" prop="compulsoryInsurance">
                                    <el-input v-model="addVehicleForm.compulsoryInsurance"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="商业险:" prop="businessInsurance">
                                    <el-input v-model="addVehicleForm.businessInsurance"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="采购总价(元):" prop="purchasePrice">
                                    <el-input v-model="addVehicleForm.purchasePrice" disabled/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
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
                                        v-model="addVehicleForm.vehicleOperatingLicense.registerDate"
                                        type="date"
                                        style="width:100%;"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="有效日期:" prop="vehicleOperatingLicense.effectiveDate">
                                    <el-date-picker
                                        v-model="addVehicleForm.vehicleOperatingLicense.effectiveDate"
                                        type="date"
                                        style="width:100%;"
                                        value-format="yyyy-MM-dd 23:59:59"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="附件:" prop="vehicleOperatingLicense.attachment">
                                    <upload-image ref="vehicleOperatingLicenseAttachment"
                                                  fileModule="vehicle"
                                                  v-model="addVehicleForm.vehicleOperatingLicense.attachment"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6"></el-col>
                        </el-row>
                    </el-card>
                    <el-card class="box-card" body-style="padding:0px;" style=" width: 100%">
                        <div slot="header" class="clearfix">
                            <span>保险</span>
                        </div>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="交强险有效日期:" prop="vehicleInsurance.strongInsuranceDateAll">
                                    <el-date-picker
                                        v-model="addVehicleForm.vehicleInsurance.strongInsuranceDateAll"
                                        type="daterange"
                                        style="width:100%;"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        :default-time="['00:00:00', '23:59:59']"
                                        unlink-panels
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="交强险附件:" prop="vehicleInsurance.strongInsuranceAttachment">
                                    <upload-image ref="strongInsuranceAttachmentInfo"
                                                  fileModule="vehicle"
                                                  v-model="addVehicleForm.vehicleInsurance.strongInsuranceAttachment"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="商业险有效日期:" prop="vehicleInsurance.commercialInsuranceDateAll">
                                    <el-date-picker
                                        v-model="addVehicleForm.vehicleInsurance.commercialInsuranceDateAll"
                                        type="daterange"
                                        style="width:100%;"
                                        unlink-panels
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        :default-time="['00:00:00', '23:59:59']"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="商业险附件:" prop="vehicleInsurance.commercialInsuranceAttachment">
                                    <upload-image ref="commercialInsuranceAttachmentInfo"
                                                  fileModule="vehicle"
                                                  v-model="addVehicleForm.vehicleInsurance.commercialInsuranceAttachment"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-card class="box-card" body-style="padding:0px;" style=" width: 100%">
                        <div slot="header" class="clearfix">
                            <span>车辆登记证书</span>
                        </div>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="车辆型号:" prop="vehicleModelNo">
                                    <el-input v-model="addVehicleForm.vehicleModelNo"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" >
                                <el-form-item label="发动机型号:" prop="engineModelNo">
                                    <el-input v-model="addVehicleForm.engineModelNo"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="附件:" prop="registerAttachment">
                                    <upload-image ref="registerAttachment"
                                                  fileModule="vehicle"
                                                  v-model="addVehicleForm.registerAttachment"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-card class="box-card" body-style="padding:0px;" style=" width: 100%">
                        <div slot="header" class="clearfix">
                            <span>车身照片</span>
                        </div>
                        <el-row v-if="addVehicleForm.type != constant.VEHICLE_TYPE.TRAILER">
                            <el-col :span="6">
                                <el-form-item label="附件:" prop="vehicleBodyAttachment">
                                    <upload-image ref="vehicleBodyAttachment0"
                                                fileModule="vehicle"
                                                :limit=1
                                                v-model="addVehicleForm.vehicleBodyAttachment" key="1" />
                                    <span style="color: red">车身正面照</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="附件:" prop="vehicleBodyAttachment">
                                    <upload-image ref="vehicleBodyAttachment90"
                                                fileModule="vehicle"
                                                :limit=1
                                                v-model="addVehicleForm.vehicleBodyAttachment" key="2"/>
                                    <span style="color: red">车身侧面照</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="附件:" prop="vehicleBodyAttachment">
                                    <upload-image ref="vehicleBodyAttachment45"
                                                fileModule="vehicle"
                                                :limit=1
                                                v-model="addVehicleForm.vehicleBodyAttachment" key="3"/>
                                    <span style="color: red">车身45度照</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" v-if="addVehicleForm.type != constant.VEHICLE_TYPE.TRACTOR">
                                <el-form-item label="附件:" prop="vehicleBodyAttachment">
                                    <upload-image ref="vehicleBodyAttachmentOpen"
                                                fileModule="vehicle"
                                                :limit=1
                                                v-model="addVehicleForm.vehicleBodyAttachment" key="5"/>
                                    <span style="color: red">车尾开门照</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-else>
                            <el-col :span="6">
                                <el-form-item label="附件:" prop="vehicleBodyAttachment">
                                    <upload-image ref="vehicleBodyAttachment180"
                                                fileModule="vehicle"
                                                :limit=1
                                                v-model="addVehicleForm.vehicleBodyAttachment" key="4"/>
                                    <span style="color: red">车尾照</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="附件:" prop="vehicleBodyAttachment">
                                    <upload-image ref="vehicleBodyAttachmentOpen"
                                                fileModule="vehicle"
                                                :limit=1
                                                v-model="addVehicleForm.vehicleBodyAttachment" key="6"/>
                                    <span style="color: red">车尾开门照</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                    <div class="bottom clearfix" style="margin-top: 20px; margin-left: 45%;">
                        <el-button type="primary" @click="commitVehicle()" size="small">确定</el-button>
                        <el-button size="small" @click="cancelVehicle()">取消</el-button>
                    </div>
                    <!--</el-card>-->
                </el-form>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import {Http, Api, Common, Constant} from 'src/global'
    import  dataDec  from 'src/components/common/data/data.js'
    import Validate from 'src/global/validate'

    export default {
        data() {
            /*权限*/
            let permission = {
                oilCardLimit: "/vehicle/oilCardLimit",
                petrolStationLimit: "/vehicle/petrolStationLimit"
            };
            return {
                index: 0,
                constant: Constant,
                vehicleLicenseEffectiveDateOption: {
                    disabledDate(time) {
                        let currentDate = new Date();
                        currentDate.setFullYear(currentDate.getFullYear() + 1);
                        return time.getTime() > currentDate;
                    },
                },
                vehicleOperatingLicenseEffectiveDateOption: {
                    disabledDate(time) {
                        let currentDate = new Date();
                        currentDate.setFullYear(currentDate.getFullYear() + 1);
                        return time.getTime() > currentDate;
                    },
                },
                isModify: false,
                addVehicleFormVehicleMatchingDisable: true,
                addVehicleFormVehicleMatchingVehicleType: [Constant.VEHICLE_TYPE.TRACTOR, Constant.VEHICLE_TYPE.TRAILER],
                addVehicleForm: {
                    lease: '0',
                    rentOut: '0',
                    oilCardLimit: '',
                    remark: '',
                    petrolStationLimit: '',
                    vehicleNo: '',
                    licenseNumber: '',
                    belongOrgCode: '',
                    operationMode: 'SELF_SUPPORT',
                    selfOperationMode: 'SELF_SELF_SUPPORT',
                    selfOperationModeShow: false,
                    type: 'VAN',
                    specification: '',
                    trailerAxle: '',
                    numberOfTires: '',
                    trailerTexture: '',
                    vanType: 'MOTOR_VAN',
                    loadSquare: '',
                    operationAttribute: 'COMMON_BUSINESS',
                    owner: '',
                    ownerDisable: true,
                    vehicleMatching: '',
                    vehicleDriver: '',
                    purchaseDate: '',
                    imported: '',
                    nakedCarsAndTaxes: '',
                    purchaseTax: '',
                    licensePlateNumberCost: '',
                    vehicleAndVesselTax: '',
                    advertisingCosts: '',
                    gpsCost: '',
                    operationCertificateCost: '',
                    seatInsurance: '',
                    compulsoryInsurance: '',
                    businessInsurance: '',
                    purchasePrice: '',
                    oneWheel: '',
                    oneWheelDisabled: true,
                    engineModelNo: '',
                    vehicleModelNo: '',
                    vehicleBodyAttachment: '',
                    registerAttachment:'',
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
                addVehicleRules: {
                    vehicleNo: [
                        {required: true, message: '请输入台账编号', trigger: 'blur'}
                    ],
                    licenseNumber: [
                        {required: true, message: '请输入车牌号', trigger: 'blur'},
                        Validate.licenseNumber
                    ],
                    belongOrgCode: [
                        {required: true, message: '请输入所属区域', trigger: 'blur'}
                    ],
                    operationMode: [
                        {required: true, message: '请输入车辆性质', trigger: 'blur'}
                    ],
                    selfOperationMode: [
                        {required: false, message: '请输入自营模式', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请输入车辆类型', trigger: 'blur'}
                    ],
                    vanType: [
                        {required: true, message: '请输入车厢类型', trigger: 'blur'}
                    ],
                    loadSquare: [
                        {required: true, message: '请输入承载方数', trigger: 'blur'}
                    ],
                    specification: [
                        {required: true, message: '请输入规格(米)', trigger: 'blur'}
                    ],
                    oneWheel: [
                        {required: true, message: '请输入驱动类型', trigger: 'blur'}
                    ],
                    /*trailerSize: [
                        {required: false, message: '请输入挂车尺寸', trigger: 'blur'}
                    ],*/
                    trailerAxle: [
                        {required: false, message: '请输入挂车轴数', trigger: 'blur'}
                    ],
                    numberOfTires: [
                        {required: false, message: '请输入单双胎', trigger: 'blur'}
                    ],
                    trailerTexture: [
                        {required: false, message: '请输入挂车车厢材质', trigger: 'blur'}
                    ],

                    operationAttribute: [
                        {required: true, message: '请输入车辆属性', trigger: 'blur'}
                    ],
                    owner: [
                        {required: false, message: '请选择车主', trigger: 'blur'}
                    ],
                    imported: [
                        {required: true, message: '请选择购置类型', trigger: 'blur'}
                    ],
                    purchaseDate: [
                        {required: true, message: '请选择购置日期', trigger: 'blur'}
                    ],
                    'vehicleOperatingLicense.registerDate':[
                        {required: true, message: '请选择注册日期', trigger: 'blur'}
                    ],
                    'vehicleOperatingLicense.effectiveDate':[
                        {required: true, message: '请选择有效日期', trigger: 'blur'}
                    ],
                    'vehicleLicense.effectiveDate':[
                        {required: true, message: '请选择有效日期', trigger: 'blur'}
                    ],
                    'vehicleInsurance.strongInsuranceDateAll':[
                        {validator: this.validatePass, trigger: 'blur'}
                    ],
                    'vehicleInsurance.commercialInsuranceDateAll':[
                        {required: true, message: '请选择日期', trigger: 'blur'}
                    ],
                    // 'vehicleModelNo':[
                    //     {required: true, message: '请输入车辆型号', trigger: 'blur'}
                    // ],
                    // 'engineModelNo':[
                    //     {required: true, message: '请输入发动机型号', trigger: 'blur'}
                    // ],
                    'vehicleLicense.registerDate':[
                       {required: true, message: '请选择注册日期', trigger: 'blur'}
                    ],
                    'vehicleLicense.vehicleNumber':[
                        {validator: this.validatePassLength, trigger: 'blur'}
                    ],
                    'vehicleLicense.engineCode':[
                        {validator: this.validateEngineCode, trigger: 'blur'}
                    ],
                    'vehicleLicense.outLineSize':[
                        {validator: this.validateOutLineSize, trigger: 'blur'}
                    ],
                    'vehicleLicense.loadMass':[
                        {validator: this.validateLoadMass, trigger: 'blur'}
                    ],
                    'vehicleLicense.brandType':[
                        {required: true, message: '请输入维护品牌型号', trigger: 'blur'}
                    ],
                    'vehicleLicense.vehicleType':[
                        {required: true, message: '请输入维护车辆类型', trigger: 'blur'}
                    ],
                    // 'vehicleLicense.trailerLength':[
                    //     {required: true, message: '请输入维护挂车尺寸', trigger: 'blur'}
                    // ]

                },
                isSpecificationDisabled: false,
                //根据车辆类型 选择必填项
                vehicleTypeRequiredDisabled: {
                    vanDisabled: false,//单车
                    tractorDisabled: false,//牵引车
                    trailerDisabled: true,//半挂车
                    disable: false //复合
                },
                permission: permission
            };
        },
        watch: {
            'addVehicleForm.operationMode'() {
                this.operationModeRestrictOwner(this.addVehicleForm);
            },
            'addVehicleForm.type'(val) {//修改车辆类型
                let _this = this;
                if (Constant.VEHICLE_TYPE.VAN === val) {
                    _this.addVehicleForm.vehicleLicense.vehicleTypeShow = false;
                    _this.addVehicleForm.vehicleLicense.vehicleTypeData = true;
                    _this.addVehicleForm.vehicleLicense.trailerLengthDisable = true;
                    _this.addVehicleForm.oneWheelDisabled = true;
                    _this.addVehicleFormVehicleMatchingDisable = true;
                    _this.vehicleTypeRequiredDisabled.vanDisabled = false;
                    _this.vehicleTypeRequiredDisabled.tractorDisabled = false;
                    _this.vehicleTypeRequiredDisabled.trailerDisabled = true;
                    _this.addVehicleRules.vanType[0].required = true;
                    _this.addVehicleRules.loadSquare[0].required = true;
                    _this.addVehicleRules.specification[0].required = true;
                    _this.addVehicleRules.oneWheel[0].required = true;
                    //_this.addVehicleRules.trailerSize[0].required = false;
                    _this.addVehicleRules.trailerAxle[0].required = false;
                    _this.addVehicleRules.numberOfTires[0].required = false;
                    //_this.addVehicleRules.trailerTexture[0].required = false;
                } else if (Constant.VEHICLE_TYPE.TRACTOR === val) {
                    _this.addVehicleForm.vehicleLicense.vehicleTypeShow = false;
                    _this.addVehicleForm.vehicleLicense.vehicleTypeData = false;
                    _this.addVehicleForm.vehicleLicense.trailerLengthDisable = true;
                    _this.addVehicleForm.oneWheelDisabled = false;
                    _this.addVehicleFormVehicleMatchingDisable = false;
                    _this.addVehicleFormVehicleMatchingVehicleType = [_this.constant.VEHICLE_TYPE.TRAILER];
                    _this.vehicleTypeRequiredDisabled.vanDisabled = true;
                    _this.vehicleTypeRequiredDisabled.tractorDisabled = false;
                    _this.vehicleTypeRequiredDisabled.trailerDisabled = true;
                    _this.addVehicleRules.vanType[0].required = false;
                    _this.addVehicleRules.loadSquare[0].required = false;
                    _this.addVehicleRules.specification[0].required = false;
                    _this.addVehicleRules.oneWheel[0].required = true;
                    //_this.addVehicleRules.trailerSize[0].required = false;
                    _this.addVehicleRules.trailerAxle[0].required = false;
                    _this.addVehicleRules.numberOfTires[0].required = false;
                    //_this.addVehicleRules.trailerTexture[0].required = false;
                } else if (Constant.VEHICLE_TYPE.TRAILER === val) {
                    _this.addVehicleForm.vehicleLicense.vehicleTypeShow = true;
                    _this.addVehicleForm.vehicleLicense.trailerLengthDisable = false;
                    _this.addVehicleFormVehicleMatchingDisable = false;
                    _this.addVehicleFormVehicleMatchingVehicleType = [_this.constant.VEHICLE_TYPE.TRACTOR];
                    _this.vehicleTypeRequiredDisabled.vanDisabled = false;
                    _this.vehicleTypeRequiredDisabled.tractorDisabled = true;
                    _this.vehicleTypeRequiredDisabled.trailerDisabled = false;
                    _this.addVehicleRules.vanType[0].required = true;
                    _this.addVehicleRules.loadSquare[0].required = true;
                    _this.addVehicleRules.specification[0].required = true;
                    _this.addVehicleRules.oneWheel[0].required = false;
                    //_this.addVehicleRules.trailerSize[0].required = true;
                    _this.addVehicleRules.trailerAxle[0].required = true;
                    _this.addVehicleRules.numberOfTires[0].required = true;
                    //_this.addVehicleRules.trailerTexture[0].required = true;
                }
            },
            'addVehicleForm.nakedCarsAndTaxes'() {
                this.calculateTheTotalCost();
            },
            'addVehicleForm.purchaseTax'() {
                this.calculateTheTotalCost();
            },
            'addVehicleForm.vehicleAndVesselTax'() {
                this.calculateTheTotalCost();
            },
            'addVehicleForm.licensePlateNumberCost'() {
                this.calculateTheTotalCost();
            },
            'addVehicleForm.advertisingCosts'() {
                this.calculateTheTotalCost();
            },
            'addVehicleForm.gpsCost'() {
                this.calculateTheTotalCost();
            },
            'addVehicleForm.operationCertificateCost'() {
                this.calculateTheTotalCost();
            },
            'addVehicleForm.seatInsurance'() {
                this.calculateTheTotalCost();
            },
            'addVehicleForm.compulsoryInsurance'() {
                this.calculateTheTotalCost();
            },
            'addVehicleForm.businessInsurance'() {
                this.calculateTheTotalCost();
            }
        },
        mounted() {
            this.init();
            this.operationModeRestrictOwner();
        },
        methods: {
            validatePassLength(rule,value,callback){
                if(this.addVehicleForm.vehicleLicense.vehicleNumber&&this.addVehicleForm.vehicleLicense.vehicleNumber.toString().length>20){
                    callback(new Error('长度过长'))
                }else {
                    callback()
                }
            },
            validateEngineCode(rule,value,callback){
                if(this.addVehicleForm.vehicleLicense.engineCode&&this.addVehicleForm.vehicleLicense.engineCode.toString().length>40){
                    callback(new Error('长度过长'))
                }else {
                    callback()
                }
            },
            validateOutLineSize(rule,value,callback){
                if(this.addVehicleForm.vehicleLicense.outLineSize&&this.addVehicleForm.vehicleLicense.outLineSize.toString().length>20){
                    callback(new Error('长度过长'))
                }else {
                    callback()
                }
            },
            validateLoadMass(rule,value,callback){
                if(this.addVehicleForm.vehicleLicense.loadMass&&this.addVehicleForm.vehicleLicense.loadMass.toString().length>20){
                    callback(new Error('长度过长'))
                }else if(this._isempty(value)){
                    callback()
                }else if(typeof value != "number"){
                    callback(new Error('请输入数字'));
                }else {
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
            validatePass(rule, value, callback){
                if (this.addVehicleForm.type != Constant.VEHICLE_TYPE.TRAILER&&(!value||value.length == 0)) {
                    callback('请选择时间')
                }else{
                    callback()
                }
            },
            uploadRecognition(res){
                if (res.success){
                    if(!this.isModify){
                        this.addVehicleForm.licenseNumber = res.result.vehicleNumber
                    }else {
                        if(res.result.vehicleNumber&&res.result.vehicleNumber != this.addVehicleForm.licenseNumber){
                            this.$message.error('上传图片车牌与该车车牌不符')
                            this.$nextTick(() => {
                                this.$refs.vehicleLicenseAttachment.clearLast()
                            })
                            return
                        }
                    }
                    this._resetUpImgForm()
                    // 识别匹配到车辆类型code
                    let list = this._getTypeList()
                    for(let i = 0;i<list.length;i++){
                        if(list[i].name === res.result.vehicleType){
                            this.addVehicleForm.vehicleLicense.vehicleType = list[i].code
                        }
                    }

                    // 识别匹配到的车辆品牌
                    let brandList = this._getBrandList()
                    let brandType = this._getChinese(res.result.brandType) // 暂时未启用
                    for(let i = 0;i<brandList.length;i++){
                        if(brandList[i].name === res.result.brandType){
                            this.addVehicleForm.vehicleLicense.brandType = brandList[i].code
                        }
                    }

                    // let ownerList = this._getOwnerList()
                    // for(let i = 0;i<ownerList.length;i++){
                    //     if(ownerList[i].name === res.result.ownerCode){
                    //         this.addVehicleForm.vehicleLicense.ownerCode = ownerList[i].code
                    //     }
                    // }



                    this.addVehicleForm.vehicleLicense.engineCode =res.result.engineCode?res.result.engineCode:'';
                    this.addVehicleForm.vehicleLicense.vehicleNumber = res.result.vehicleRecoCode?res.result.vehicleRecoCode:'';
                    this.addVehicleForm.vehicleLicense.ownerCode = res.result.ownerCode?res.result.ownerCode:'';
                    this.addVehicleForm.vehicleLicense.registerDate= res.result.registerDate?res.result.registerDate:'';
                }
            },
            _resetUpImgForm(){
                this.addVehicleForm.vehicleLicense.engineCode = ""
                this.addVehicleForm.vehicleLicense.vehicleNumber = ""
                this.addVehicleForm.vehicleLicense.ownerCode = ""
                this.addVehicleForm.vehicleLicense.brandType = ""
                this.addVehicleForm.vehicleLicense.vehicleType = ""
            },
            _getTypeList(){
                let list = []
                if(this.addVehicleForm.vehicleLicense.vehicleTypeShow){
                    list = dataDec['SEMITRAILER_VEHICLE_TYPE']
                }else {
                    if(this.addVehicleForm.vehicleLicense.vehicleTypeData){
                        list = dataDec['HEAD_VEHICLE_TYPE']
                        list = _.filter(list,(el) => {
                            return el.code != 'HEAD_HEAVY_MOTOR_TRACTOR'
                        })
                    }else if(!this.addVehicleForm.vehicleLicense.vehicleTypeData) {
                        list = dataDec['HEAD_VEHICLE_TYPE']
                        list = _.filter(list,(el) => {
                            return el.code != 'HEAD_HEAVY_VAN'&&el.code != 'HEAD_HEAVY_BOX_TRUCK'
                        })
                    }
                }
                return list
            },
            _getBrandList(){
                let list = []
                if(this.addVehicleForm.vehicleLicense.vehicleTypeShow){
                    list = dataDec['SEMITRAILER_VEHICLE_BRAND']
                }else if(!this.addVehicleForm.vehicleLicense.vehicleTypeShow){
                    list = dataDec['HEAD_VEHICLE_BRAND']
                }
                return list
            },
            _getChinese(val){
                const reg = /[\u4e00-\u9fa5]/g;
                return val.match(reg).join("");
            },
            init() {
                let code = this.$route.query.code;
                if (code) {
                    let vm = this;
                    vm.isModify = true;
                    Http.get(Api.vehicle.queryByCode, {params: {'code': code}}, result => {
                        /*设置时间*/
                        vm.addVehicleForm = this.modelDefault(_.merge(vm.addVehicleForm, result.result));
                        console.log(vm.addVehicleForm,result.result)
                        /*设置附件*/
                        vm.$refs.vehicleLicenseAttachment.setFileList(vm.addVehicleForm.vehicleLicense.attachment.split(","));
                        vm.$refs.vehicleOperatingLicenseAttachment.setFileList(vm.addVehicleForm.vehicleOperatingLicense.attachment.split(","));
                        vm.$refs.commercialInsuranceAttachmentInfo.setFileList(vm.addVehicleForm.vehicleInsurance.commercialInsuranceAttachment.split(","));
                        vm.$refs.strongInsuranceAttachmentInfo.setFileList(vm.addVehicleForm.vehicleInsurance.strongInsuranceAttachment.split(","));
                        vm.$refs.vehicleBelongOrgCode.setCurrentOrg(vm.addVehicleForm.org);
                        vm.$refs.registerAttachment.setFileList(vm.addVehicleForm.registerAttachment.split(","));
                         // 拆分车辆照片
                        this.$nextTick(() => {
                            if(vm.addVehicleForm.type != Constant.VEHICLE_TYPE.TRAILER){
                                let urls = vm.addVehicleForm.vehicleBodyAttachment.split(",")
                                vm.$refs.vehicleBodyAttachment0.setFileList([urls[0]]);
                                vm.$refs.vehicleBodyAttachment90.setFileList([urls[1]]);
                                vm.$refs.vehicleBodyAttachment45.setFileList([urls[2]]);
                                if(vm.addVehicleForm.type != Constant.VEHICLE_TYPE.TRACTOR){
                                    vm.$refs.vehicleBodyAttachmentOpen.setFileList([urls[3]]);
                                }
                            }else{
                                let urls = vm.addVehicleForm.vehicleBodyAttachment.split(",")
                                vm.$refs.vehicleBodyAttachment180.setFileList([urls[0]]);
                                if(vm.addVehicleForm.type != Constant.VEHICLE_TYPE.TRACTOR){
                                    vm.$refs.vehicleBodyAttachmentOpen.setFileList([urls[1]]);
                                }
                            }
                        })

                        // 转化挂车类型值
                        vm.addVehicleForm.vehicleLicense.trailerLength = vm.addVehicleForm.vehicleLicense.trailerLength? vm.addVehicleForm.vehicleLicense.trailerLength.toString():''

                        if (vm.addVehicleForm.vehicleOwner) {
                            vm.$refs.vehicleOwner.setCurrentVehicleOwner(vm.addVehicleForm.vehicleOwner);
                        }
                        if (result.result.vehicleMatchingEntity) {
                            vm.$refs.addVehicleFormVehicleMatching.setCurrentVehicle(result.result.vehicleMatchingEntity);
                            vm.addVehicleForm.vehicleMatching = result.result.vehicleMatchingEntity.code;
                        }
                        if (result.result.vehicleDriverEntity) {
                            vm.$refs.addVehicleFormVehicleDriver.setCurrentDriver(result.result.vehicleDriverEntity);
                            vm.addVehicleForm.vehicleDriver = result.result.vehicleDriverEntity.id;
                        }
                    })
                }
            },
            modelDefault(model) {
                let _this = this;
                if (model.vehicleInsurance) {
                    if (_.compact(_.concat(model.vehicleInsurance.strongInsuranceStartDate, model.vehicleInsurance.strongInsuranceDate)).length > 0) {
                        model.vehicleInsurance.strongInsuranceDateAll = _.concat(model.vehicleInsurance.strongInsuranceStartDate, model.vehicleInsurance.strongInsuranceDate)
                    }
                    if (_.compact(_.concat(model.vehicleInsurance.commercialInsuranceStartDate, model.vehicleInsurance.commercialInsuranceDate)).length > 0) {
                        model.vehicleInsurance.commercialInsuranceDateAll = _.concat(model.vehicleInsurance.commercialInsuranceStartDate, model.vehicleInsurance.commercialInsuranceDate)
                    }
                }
                _this.operationModeRestrictOwner(model);
                return model;
            },
            commitVehicle() {
                let vm = this;
                vm.addVehicleForm.vehicleLicense.attachment = this.$refs.vehicleLicenseAttachment.getFileList().join(",");
                vm.addVehicleForm.vehicleOperatingLicense.attachment = this.$refs.vehicleOperatingLicenseAttachment.getFileList().join(",");
                vm.addVehicleForm.vehicleInsurance.commercialInsuranceAttachment = this.$refs.commercialInsuranceAttachmentInfo.getFileList().join(",");
                vm.addVehicleForm.vehicleInsurance.strongInsuranceAttachment = this.$refs.strongInsuranceAttachmentInfo.getFileList().join(",");
                vm.addVehicleForm.registerAttachment = this.$refs.registerAttachment.getFileList().join(",");
                if(vm.addVehicleForm.type != Constant.VEHICLE_TYPE.TRAILER){
                    vm.addVehicleForm.vehicleBodyAttachment = this.$refs.vehicleBodyAttachment0.getFileList().join(",")+","+this.$refs.vehicleBodyAttachment90.getFileList().join(",")+","+this.$refs.vehicleBodyAttachment45.getFileList().join(",");
                    if(vm.addVehicleForm.type != Constant.VEHICLE_TYPE.TRACTOR){
                                vm.addVehicleForm.vehicleBodyAttachment = vm.addVehicleForm.vehicleBodyAttachment+","+this.$refs.vehicleBodyAttachmentOpen.getFileList().join(",")
                    }
                }else {
                    vm.addVehicleForm.vehicleBodyAttachment = this.$refs.vehicleBodyAttachment180.getFileList().join(",")+","+this.$refs.vehicleBodyAttachmentOpen.getFileList().join(",")
                }

                if (vm.addVehicleForm.vehicleInsurance.strongInsuranceDateAll) {
                    vm.addVehicleForm.vehicleInsurance.strongInsuranceStartDate = vm.addVehicleForm.vehicleInsurance.strongInsuranceDateAll[0];
                    vm.addVehicleForm.vehicleInsurance.strongInsuranceDate = vm.addVehicleForm.vehicleInsurance.strongInsuranceDateAll[1]
                }
                if (vm.addVehicleForm.vehicleInsurance.commercialInsuranceDateAll) {
                    vm.addVehicleForm.vehicleInsurance.commercialInsuranceStartDate = vm.addVehicleForm.vehicleInsurance.commercialInsuranceDateAll[0];
                    vm.addVehicleForm.vehicleInsurance.commercialInsuranceDate = vm.addVehicleForm.vehicleInsurance.commercialInsuranceDateAll[1]
                }
                this.$refs.addVehicleForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.vehicle.add, vm.addVehicleForm, response => {
                            return vm.$router.push({path: '/operation/vehicle'});
                        })
                    } else {
                        vm.$message.error("请检查必填项");
                        return false;
                    }
                });
            },
            cancelVehicle() {
                return this.$router.push({path: '/operation/vehicle'});
            },
            calculateTheTotalCost() {//计算采购总价
                const _this = this;
                this.addVehicleForm.purchasePrice =
                    Common.util.numberFormat(_this.addVehicleForm.nakedCarsAndTaxes) +
                    Common.util.numberFormat(_this.addVehicleForm.purchaseTax) +
                    Common.util.numberFormat(_this.addVehicleForm.vehicleAndVesselTax) +
                    Common.util.numberFormat(_this.addVehicleForm.licensePlateNumberCost) +
                    Common.util.numberFormat(_this.addVehicleForm.advertisingCosts) +
                    Common.util.numberFormat(_this.addVehicleForm.gpsCost) +
                    Common.util.numberFormat(_this.addVehicleForm.operationCertificateCost) +
                    Common.util.numberFormat(_this.addVehicleForm.seatInsurance) +
                    Common.util.numberFormat(_this.addVehicleForm.compulsoryInsurance) +
                    Common.util.numberFormat(_this.addVehicleForm.businessInsurance)
            },
            vehicleTypeRestrict(val) {
                let _this = this;
                if (Constant.VEHICLE_TYPE.VAN === val) {
                    _this.addVehicleForm.vehicleLicense.trailerLength = '';
                    _this.addVehicleForm.vehicleLicense.vehicleType = '';
                    _this.addVehicleForm.vehicleLicense.brandType = '';
                    _this.addVehicleForm.vehicleMatching = '';
                    _this.addVehicleForm.oneWheel = "";
                    //_this.addVehicleForm.trailerSize = "";
                    _this.addVehicleForm.trailerAxle = "";
                    _this.addVehicleForm.numberOfTires = "";
                    _this.addVehicleForm.trailerTexture = "";
                    _this.addVehicleForm.engineModelNo = ''
                } else if (Constant.VEHICLE_TYPE.TRACTOR === val) {
                    _this.addVehicleForm.vehicleLicense.trailerLength = '';
                    _this.addVehicleForm.vehicleLicense.vehicleType = '';
                    _this.addVehicleForm.vehicleLicense.brandType = '';
                    _this.addVehicleForm.vanType = '';
                    _this.addVehicleForm.specification = "";
                    _this.addVehicleForm.loadSquare = "";
                    //_this.addVehicleForm.trailerSize = "";
                    _this.addVehicleForm.trailerAxle = "";
                    _this.addVehicleForm.numberOfTires = "";
                    _this.addVehicleForm.trailerTexture = "";
                    _this.addVehicleForm.engineModelNo = ''
                } else if (Constant.VEHICLE_TYPE.TRAILER === val) {
                    _this.addVehicleForm.vehicleLicense.vehicleType = '';
                    _this.addVehicleForm.vehicleLicense.brandType = '';
                    _this.addVehicleForm.oneWheel = "";
                    _this.addVehicleForm.engineModelNo = '无'

                }
            },
            operationModeRestrictOwner(model) {
                if (model) {
                    //自营车不允许 填车主信息
                    if (model.operationMode === Constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT) {
                        model.ownerDisable = true;
                        model.owner = '';
                        this.addVehicleRules.owner[0].required = false;
                        model.selfOperationMode = model.selfOperationMode || 'SELF_SELF_SUPPORT';
                        this.addVehicleRules.selfOperationMode[0].required = true;
                        model.selfOperationModeShow = false
                    } else {
                        model.ownerDisable = false;
                        this.addVehicleRules.owner[0].required = true;
                        model.selfOperationMode = '';
                        model.selfOperationModeShow = true;
                        this.addVehicleRules.selfOperationMode[0].required = false;
                    }
                }
            }
        }
    };
</script>
<style>
    #vehicleForm .el-card {
        border: none;
        box-shadow: none;
    }

    #vehicleForm .el-card__header {
        border: none;
        padding: 12px 15px;
        color: #20a0ff;
    }
</style>
