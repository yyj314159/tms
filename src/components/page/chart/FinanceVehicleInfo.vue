<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表中心</el-breadcrumb-item>
                <el-breadcrumb-item>车辆报表</el-breadcrumb-item>
                <el-breadcrumb-item>财务车辆信息</el-breadcrumb-item>
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
                    <el-col :span="6"  v-show="isMoreItemShow">
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
            <el-button v-if="exportLoading" v-permission="'/financeVehicle/export'" icon="el-icon-download" type="primary" size="mini" style="margin-left: 10px;" @click="exportList">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table class="content-table" size="small" :data="searchResult.result" element-loading-text="拼命加载中"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"/>
                <el-table-column label="车辆号牌" header-align="center" prop="licenseNumber" width="150">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;"
                           @click="showVehicleDetail(scope.row)">{{scope.row.licenseNumber }}</a>
                    </template>
                </el-table-column>
                <el-table-column label="所属大区" header-align="center" prop="org.name" width="150">
                    <template slot-scope="scope">
                        <div v-if="scope.row.org.nature == 'PARTITION'">
                            {{scope.row.org.parent.name}}
                        </div>
                        <div v-else>
                            {{scope.row.org.name}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="所属分区" header-align="center" prop="org.name" width="150">
                    <template slot-scope="scope">
                        <div v-if="scope.row.org.nature == 'PARTITION'">
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
                <el-table-column label="承载方数" header-align="center" prop="loadSquare" width="100"
                                 show-overflow-tooltip/>
                <el-table-column label="自营模式" header-align="center" prop="selfOperationMode" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SELF_OPERATION_MODE" :value="scope.row.selfOperationMode"/>
                    </template>
                </el-table-column>
                <el-table-column label="车辆归属" header-align="center" prop="vehicleBelong" width="150"/>
                <el-table-column label="结算模式" header-align="center" prop="settlementMode" width="150">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SETTLEMENT_MODE"
                                                :value="scope.row.settlementMode"/>
                    </template>
                </el-table-column>
                <el-table-column label="合作车绑定平台供应商" header-align="center" prop="supplier.name" width="200"/>
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
                <el-table-column label="车主电话" header-align="center" prop="vehicleOwner.mobile" width="200"
                                 show-overflow-tooltip/>
                <el-table-column label="油卡额度" header-align="center" prop="oilCardLimit" width="100"/>
                <el-table-column label="运营状态" header-align="center" prop="operationStatus" width="90">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_STATUS"
                                                :value="scope.row.operationStatus"/>
                    </template>
                </el-table-column>
                <el-table-column label="进口/国产" header-align="center" prop="imported" width="90">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_PROCUREMEN_TYPE" :value="scope.row.imported"/>
                    </template>
                </el-table-column>
                <el-table-column label="行驶证有效日期" header-align="center" prop="vehicleLicense.effectiveDate" width="120">
                    <template slot-scope="scope">
                        <div  v-if="scope.row.vehicleLicense">{{scope.row.vehicleLicense.effectiveDate | moment("YYYY-MM-DD")}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="营运证有效日期" header-align="center" prop="vehicleOperatingLicense.effectiveDate"
                                 width="120">
                    <template slot-scope="scope">
                        <div  v-if="scope.row.vehicleOperatingLicense">{{scope.row.vehicleOperatingLicense.effectiveDate | moment("YYYY-MM-DD")}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="交强险有效日期" header-align="center" prop="vehicleInsurance.strongInsuranceDate"
                                 width="120">
                    <template slot-scope="scope">
                        <div>{{scope.row.vehicleInsurance.strongInsuranceDate | moment("YYYY-MM-DD")}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="商业险有效日期" header-align="center" prop="vehicleInsurance.commercialInsuranceDate"
                                 width="120">
                    <template slot-scope="scope">
                        <div>{{scope.row.vehicleInsurance.commercialInsuranceDate | moment("YYYY-MM-DD")}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="过户时间" header-align="center" prop="changeTheTime" width="180"/>
                <el-table-column label="创建时间" header-align="center" prop="createTime" width="180"/>
                <el-table-column label="创建人" header-align="center" prop="createUser" width="150"/>
                <el-table-column label="修改时间" header-align="center" prop="modifyTime" width="180"/>
                <el-table-column label="修改人" header-align="center" prop="modifyUser" width="150"/>
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
    </el-container>
</template>

<script>
    import {Http,Api,Common} from 'src/global'
    import axios from 'axios'

    export default {
        data() {
            return {
                searchParam: {
                    claim: '',
                    status: '',
                    operationStatus:'',
                    certCompleteFlag:'',
                    certExpireFlag:'',
                    currentPage: 1,
                    pageSize: 10,
                    operationModeArray: 'SELF_SUPPORT,OUTSOURCE',
                    ownerCode:'',
                    loadSquare:''
                },
                isLoading: true,
                isMoreItemShow: false,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //导出
                exportLoading: true
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    claim: '',
                    status: '',
                    operationStatus:'',
                    certCompleteFlag:'',
                    certExpireFlag:'',
                    currentPage: 1,
                    pageSize: 10,
                    operationModeArray: 'SELF_SUPPORT,OUTSOURCE',
                    ownerCode:'',
                    loadSquare:''
                };
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
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            showMore() {
                let vm = this;
                vm.isMoreItemShow = true;
            },
            showLess() {
                let vm = this;
                vm.isMoreItemShow = false;
            },
            showVehicleDetail(row) {
                this.$router.push({name: 'vehicleDetail', params: {code: row.code}});
            },
            exportList(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.financeVehicle.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '财务车辆报表.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>

<style scoped>

</style>
