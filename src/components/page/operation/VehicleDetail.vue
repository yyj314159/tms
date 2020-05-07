<template>
    <el-container style="height: 100%;">
        <el-header height="" style="padding-left: 0">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                    <el-breadcrumb-item><i class="el-icon-date"></i> 车辆管理</el-breadcrumb-item>
                    <el-breadcrumb-item>车辆信息明细</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-header>
        <el-container>
            <el-main style="border:1px solid #aaa; width: 100%; padding:0 2px;">
                <el-form size="small" :model="vehicleDetailForm" label-width="120px">
                    <el-card class="box-card" body-style="padding:0px;" style="width: 100%; ">
                        <div slot="header" class="clearfix">
                            <span>行驶证</span>
                        </div>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="所有人:" prop="vehicleLicense.ownerCode">
                                    {{vehicleDetailForm.vehicleLicense.ownerCode}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车辆类型:" prop="vehicleLicense.vehicleType">
                                    <dictionary-select-name option-name="SEMITRAILER_VEHICLE_TYPE,HEAD_VEHICLE_TYPE"
                                                            :value="vehicleDetailForm.vehicleLicense.vehicleType"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="品牌型号:" prop="vehicleLicense.brandType">
                                    <dictionary-select-name option-name="SEMITRAILER_VEHICLE_BRAND,HEAD_VEHICLE_BRAND"
                                                            :value="vehicleDetailForm.vehicleLicense.brandType"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车辆识别代号:" prop="vehicleLicense.vehicleNumber">
                                    {{vehicleDetailForm.vehicleLicense.vehicleNumber}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="发动机号码:" prop="vehicleLicense.engineCode">
                                    {{vehicleDetailForm.vehicleLicense.engineCode}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="挂车尺寸:" prop="vehicleLicense.trailerLength">
                                    <datadictionary-name option-name="TRAILER_SIZE"
                                                         :value="vehicleDetailForm.vehicleLicense.trailerLength"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="外廓尺寸:" prop="vehicleLicense.outLineSize">
                                    {{vehicleDetailForm.vehicleLicense.outLineSize}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="核定载质量:" prop="vehicleLicense.loadMass">
                                    {{vehicleDetailForm.vehicleLicense.loadMass}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="注册日期:" prop="vehicleLicense.registerDate">
                                    {{vehicleDetailForm.vehicleLicense.registerDate === undefined ? "" :
                                    vehicleDetailForm.vehicleLicense.registerDate | moment("YYYY-MM-DD")}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="有效期至:" prop="vehicleLicense.effectiveDate">
                                    {{vehicleDetailForm.vehicleLicense.effectiveDate === undefined ? "" :
                                    vehicleDetailForm.vehicleLicense.effectiveDate | moment("YYYY-MM-DD")}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="附件:" prop="vehicleLicense.attachment">
                                    <show-image :url="vehicleDetailForm.vehicleLicense.attachment"></show-image>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6"></el-col>
                            <el-col :span="6"></el-col>
                        </el-row>
                    </el-card>
                    <el-card class="box-card" body-style="padding:0px;"
                             style="margin-right: 3%; width: 100%;float: left;">
                        <div slot="header" class="clearfix">
                            <span>车辆信息</span>
                        </div>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="车辆编号:" prop="code">
                                    {{vehicleDetailForm.code}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="台账编号:" prop="vehicleNo">
                                    {{vehicleDetailForm.vehicleNo}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车辆号牌:" prop="licenseNumber">
                                    {{vehicleDetailForm.licenseNumber}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="所属区域:" prop="belongOrgCode">
                                    {{vehicleDetailForm.org.name}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="车辆属性:" prop="operationMode">
                                    <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                            :value="vehicleDetailForm.operationMode"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="自营模式:" prop="selfOperationMode">
                                    <dictionary-select-name option-name="SELF_OPERATION_MODE"
                                                            :value="vehicleDetailForm.selfOperationMode || (vehicleDetailForm.operationMode === 'SELF_SUPPORT')"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车辆类型:" prop="type">
                                    <dictionary-select-name option-name="VEHICLE_TYPE"
                                                            :value="vehicleDetailForm.type"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车厢类型:" prop="vanType">
                                    <dictionary-select-name option-name="VEHICLE_COMPARTMENT_TYPE"
                                                            :value="vehicleDetailForm.vanType"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="车型:" prop="specification">
                                    <dictionary-select-name option-name="VEHICLE_SPECIFICATION"
                                                            :value="vehicleDetailForm.specification"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="承载方数:" prop="loadSquare">
                                    {{vehicleDetailForm.loadSquare}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="挂车尺寸:" prop="vehicleLicense.trailerLength">
                                    <dictionary-select-name option-name="TRAILER_SIZE"
                                                            :value="vehicleDetailForm.vehicleLicense.trailerLength"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="挂车轴数:" prop="trailerAxle">
                                    <dictionary-select-name option-name="TRAILER_AXLE"
                                                            :value="vehicleDetailForm.trailerAxle"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="单双胎:" prop="numberOfTires">
                                    <dictionary-select-name option-name="NUMBER_OF_TIRES"
                                                            :value="vehicleDetailForm.numberOfTires"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="挂车车厢材质:" prop="trailerTexture">
                                    <dictionary-select-name option-name="TRAILER_TEXTURE"
                                                            :value="vehicleDetailForm.trailerTexture"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="驱动类型:" prop="oneWheel">
                                    <dictionary-select-name option-name="SINGLE_AND_DOUBLE_DRIVE" style="display:block;"
                                                            :value="vehicleDetailForm.oneWheel"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车辆属性:">
                                    <dictionary-select-name option-name="VEHICLE_OPERATION_ATTRIBUTE"
                                                            :value="vehicleDetailForm.operationAttribute"></dictionary-select-name>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车主:" prop="owner">
                                    {{vehicleDetailForm.owner}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车主身份证:" prop="ownerIdCardNo">
                                    {{vehicleDetailForm.ownerIdCardNo}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="5">
                            <el-col :span="12">
                                <el-card class="box-card" body-style="padding:0px;">
                                    <div slot="header" class="clearfix">
                                        <span>常用牵引车/半挂车</span>
                                    </div>
                                    <el-table size="small" class="content-table"
                                              :data="vehicleDetailForm.vehicleMatchingList" element-loading-text="拼命加载中"
                                              border fit
                                              highlight-current-row stripe>
                                        <el-table-column label="车牌" align="center" prop="licenseNumber"
                                                         min-width="150"/>
                                        <el-table-column label="匹配时间" align="center" prop="matchDate"
                                                         :formatter="matchDateFormatter"
                                                         min-width="150"/>
                                        <el-table-column label="默认" align="center" prop="defaultOption"
                                                         :formatter="defaultOptionFormatter"
                                                         min-width="150"/>
                                    </el-table>
                                </el-card>
                            </el-col>
                            <el-col :span="12">
                                <el-card class="box-card" body-style="padding:0px;">
                                    <div slot="header" class="clearfix">
                                        <span>常用司机</span>
                                    </div>
                                    <el-table size="small" class="content-table"
                                              :data="vehicleDetailForm.vehicleDriverList" element-loading-text="拼命加载中"
                                              border fit
                                              highlight-current-row stripe>
                                        <el-table-column label="姓名" align="center" prop="driverName"
                                                         min-width="100"/>
                                        <el-table-column label="手机号" align="center" prop="driverPhone"
                                                         min-width="150"/>
                                        <el-table-column label="匹配时间" align="center" prop="matchDate"
                                                         :formatter="matchDateFormatter"
                                                         min-width="150"/>
                                        <el-table-column label="默认" align="center" prop="defaultOption"
                                                         :formatter="defaultOptionFormatter"
                                                         min-width="60"/>
                                    </el-table>
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-card class="box-card" body-style="padding:0px;"
                             v-permission="permission.look"
                             style="margin-right: 3.6%; width: 100%; float: left;">
                        <div slot="header" class="clearfix">
                            <span>采购信息</span>
                        </div>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="采购日期:" prop="purchaseDate">
                                    {{vehicleDetailForm.purchaseDate === undefined ? "" : vehicleDetailForm.purchaseDate
                                    | moment("YYYY-MM-DD")}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="采购总价(元):" prop="purchasePrice">
                                    {{vehicleDetailForm.purchasePrice}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="进口/国产" prop="imported">
                                    <dictionary-select-name option-name="VEHICLE_PROCUREMEN_TYPE"
                                                            :value="vehicleDetailForm.imported"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="裸车含税价:" prop="nakedCarsAndTaxes">
                                    {{ vehicleDetailForm.nakedCarsAndTaxes }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="购置税:" prop="purchaseTax">
                                    {{ vehicleDetailForm.purchaseTax}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车船税:" prop="vehicleAndVesselTax">
                                    {{vehicleDetailForm.vehicleAndVesselTax}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="上牌费:" prop="licensePlateNumberCost">
                                    {{vehicleDetailForm.licensePlateNumberCost}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车体广告费" prop="advertisingCosts">
                                    {{ vehicleDetailForm.advertisingCosts }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="GPS费用:" prop="gpsCost">
                                    {{ vehicleDetailForm.gpsCost }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="营运证费用:" prop="operationCertificateCost">
                                    {{ vehicleDetailForm.operationCertificateCost }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="座位险:" prop="seatInsurance">
                                    {{ vehicleDetailForm.seatInsurance }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="交强险" prop="compulsoryInsurance">
                                    {{ vehicleDetailForm.compulsoryInsurance }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="商业险:" prop="businessInsurance">
                                    {{ vehicleDetailForm.businessInsurance }}
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-card class="box-card" body-style="padding:0px;"
                             style="margin-right: 3.6%; width: 100%; float: left;">
                        <div slot="header" class="clearfix">
                            <span>过户信息</span>
                        </div>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="营运状态:" prop="operationStatus">
                                    <dictionary-select-name option-name="VEHICLE_OPERATION_STATUS"
                                                            :value="vehicleDetailForm.operationStatus"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="过户执行人:" prop="transferExecutor">
                                    {{ vehicleDetailForm.transferExecutor }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="附件:" prop="attachment">
                                    <show-image :url="vehicleDetailForm.transferOfNamesAttachment"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="过户时间:" prop="changeTheTime">
                                    {{vehicleDetailForm.changeTheTime === undefined ? "" :
                                    vehicleDetailForm.changeTheTime | moment("YYYY-MM-DD")}}
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
                                    {{vehicleDetailForm.vehicleOperatingLicense.registerDate === undefined ? "" :
                                    vehicleDetailForm.vehicleOperatingLicense.registerDate | moment("YYYY-MM-DD")}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="有效期至:" prop="vehicleOperatingLicense.effectiveDate">
                                    {{vehicleDetailForm.vehicleOperatingLicense.effectiveDate === undefined ? "" :
                                    vehicleDetailForm.vehicleOperatingLicense.effectiveDate | moment("YYYY-MM-DD")}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="附件:" prop="vehicleOperatingLicense.attachment">
                                    <show-image
                                        :url="vehicleDetailForm.vehicleOperatingLicense.attachment"></show-image>
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
                            <el-col :span="6">
                                <el-form-item label="交强险有效日期:" prop="vehicleInsurance.strongInsuranceDate">
                                    {{vehicleDetailForm.vehicleInsurance.strongInsuranceDate === undefined ? "" :
                                    vehicleDetailForm.vehicleInsurance.strongInsuranceDate | moment("YYYY-MM-DD")}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="商业险有效日期:" prop="vehicleInsurance.strongInsuranceDate">
                                    {{vehicleDetailForm.vehicleInsurance.commercialInsuranceDate === undefined ? "" :
                                    vehicleDetailForm.vehicleInsurance.commercialInsuranceDate | moment("YYYY-MM-DD")}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="交强险附件:" prop="vehicleInsurance.strongInsuranceAttachment">
                                    <show-image
                                        :url="vehicleDetailForm.vehicleInsurance.strongInsuranceAttachment"></show-image>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="商业险附件:" prop="vehicleInsurance.commercialInsuranceAttachment">
                                    <show-image
                                        :url="vehicleDetailForm.vehicleInsurance.commercialInsuranceAttachment"></show-image>
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
                                    {{ vehicleDetailForm.vehicleModelNo }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" >
                                <el-form-item label="发动机型号:"  prop="engineModelNo">
                                    {{ vehicleDetailForm.engineModelNo }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="附件:" prop="operationStatus">
                                    <show-image :url="vehicleDetailForm.registerAttachment"></show-image>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-card class="box-card" body-style="padding:0px;" style=" width: 100%">
                        <div slot="header" class="clearfix">
                            <span>车身照片</span>
                        </div>
                        <el-row v-if="vehicleDetailForm.type != constant.VEHICLE_TYPE.TRAILER">
                            <el-col :span="6">
                                <el-form-item label="车身正面照附件:" prop="vehicleBodyAttachment">
                                    <show-image v-if="vehicleDetailForm.vehicleBodyAttachment"
                                        :url="vehicleDetailForm.vehicleBodyAttachment.split(',')[0]"></show-image>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车身侧面照附件:" prop="vehicleBodyAttachment">
                                    <show-image v-if="vehicleDetailForm.vehicleBodyAttachment"
                                        :url="vehicleDetailForm.vehicleBodyAttachment.split(',')[1]"></show-image>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车身45度照附件:" prop="vehicleBodyAttachment">
                                    <show-image v-if="vehicleDetailForm.vehicleBodyAttachment"
                                        :url="vehicleDetailForm.vehicleBodyAttachment.split(',')[2]"></show-image>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" v-if="vehicleDetailForm.type != constant.VEHICLE_TYPE.TRACTOR">
                                <el-form-item label="车尾开门照:" prop="vehicleBodyAttachment">
                                    <show-image v-if="vehicleDetailForm.vehicleBodyAttachment"
                                        :url="vehicleDetailForm.vehicleBodyAttachment.split(',')[3]"></show-image>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-else>
                            <el-col :span="6">
                                <el-form-item label="车尾照附件:" prop="vehicleBodyAttachment">
                                    <show-image v-if="vehicleDetailForm.vehicleBodyAttachment"
                                        :url="vehicleDetailForm.vehicleBodyAttachment.split(',')[0]"></show-image>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6"  v-if="vehicleDetailForm.type != constant.VEHICLE_TYPE.TRACTOR">
                                <el-form-item label="车尾开门照:" prop="vehicleBodyAttachment">
                                    <show-image v-if="vehicleDetailForm.vehicleBodyAttachment"
                                        :url="vehicleDetailForm.vehicleBodyAttachment.split(',')[1]"></show-image>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-card>
                    <div class="bottom clearfix" style="margin-top: 20px; margin-left: 45%;">
                        <el-button size="small" @click="cancelVehicle()">返回</el-button>
                    </div>
                </el-form>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import {Http, Api,Constant} from 'src/global'
    import DatadictionaryName from "../../common/select/DatadictionaryName";

    export default {
        components: {DatadictionaryName},
        data() {
            /*权限*/
           let permission = {
                look: "/vehicle/lookMoney"
            };
            return {
                constant: Constant,
                permission:permission,
                searchResult: {
                    result: []
                },
                vehicleDetailForm: {
                    vehicleLicense: {},
                    vehicleOperatingLicense: {},
                    transferVehicleOwner: {},
                    transferExecutor: '',
                    operationStatus: '',
                    registerAttachment:'',
                    vehicleInsurance: {},
                    org: {},
                    vehicleDriverList: [],
                    vehicleMatchingList: []
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                let code = this.$route.query.code;
                if (code) {
                    let vm = this;
                    vm.isModify = true;
                    Http.get(Api.vehicle.queryByCode, {params: {'code': code}}, result => {
                        vm.vehicleDetailForm = _.assign(vm.vehicleDetailForm, result.result);
                        if (result.result.vehicleOwner) {
                            vm.vehicleDetailForm.owner = result.result.vehicleOwner.name;
                            vm.vehicleDetailForm.ownerIdCardNo = result.result.vehicleOwner.idCardNo;
                        }
                    })
                }
            },
            matchDateFormatter(row, column, cellValue) {
                if (row.matchDate) {
                    return row.matchDate.substring(0, 10);
                }
                return null;
            },
            defaultOptionFormatter(row, column, cellValue) {
                if (row.defaultOption) {
                    return "是";
                }
                return "否";
            },
            cancelVehicle() {
                return this.$router.push({path: '/operation/vehicle'});
            }
        }
    };
</script>
<style>
    .el-form .el-card {
        border: none;
        box-shadow: none;
    }

    .el-form .el-card__header {
        border: none;
        padding: 12px 15px;
        color: #20a0ff;
    }
</style>
