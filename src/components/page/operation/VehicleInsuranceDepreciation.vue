<template>
    <el-container id="freeCar">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i>车辆管理</el-breadcrumb-item>
                <el-breadcrumb-item>保险折旧</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-tabs type="border-card" v-model="defaultShow">
            <el-tab-pane label="牵引车保险折旧" name="auto">
                <el-header class="content-header" height="">
                    <el-form size="small" :model="searchParam" label-width="80px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="车牌号:">
                                    <vehicle-select style="display: block"
                                                    v-model="searchParam.vehicleCode"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="年份:">
                                    <el-date-picker v-model="searchParam.vehicleYear" style="width:100%;"
                                                    type="month" value-format="yyyy-MM" placeholder="选择年月"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="类型:">
                                    <dictionary-select option-name="VEHICLE_INSURANCE_DEPRECIATION_TYPE"
                                                       v-model="searchParam.type"
                                                       style="display: block"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item style="float: right">
                                    <el-button type="success" icon="el-icon-search"
                                               @click="searchParam.currentPage=1;searchList()" size="small">查询
                                    </el-button>
                                    <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam"
                                               size="small">&nbsp;&nbsp;重置
                                    </el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-header>
                <el-main class="content-main">
                    <el-button size="mini" v-permission="'/vehicleInsuranceDepreciation/add'" type="primary"
                               icon="el-icon-plus" @click="dialogAddVehicleInsuranceDepreciationVisible=true">新增
                    </el-button>
                    <el-button v-if="downloadLoading" v-permission="'/vehicleInsuranceDepreciation/download'"
                               icon="el-icon-download" type="primary" size="mini" style="margin-right:2px;"
                               @click="exportList">模板下载
                    </el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>下载中...
                    </el-button>
                    <el-button v-if="batchLoading" v-permission="'/vehicleInsuranceDepreciation/batchDelete'" size="mini"
                               type="primary" @click="batchVehicleInsuranceDepreciationDelete">批量删除
                    </el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>删除中...
                    </el-button>
                    <upload-excel :importUrl="uploadUrl" size="mini" btn-name="导入"
                                  style="margin-left:300px;margin-top:-28px;"
                                  v-permission="'/vehicleInsuranceDepreciation/uploads'"
                                  @success="uploadSuccess"/>
                    <el-table class="content-table" size="small" :data="searchResult.result"
                              element-loading-text="拼命加载中" @selection-change="handleSelectionChange"
                              border fit
                              highlight-current-row stripe>
                        <el-table-column type="selection" fixed="left"/>
                        <el-table-column label="车牌号" align="center" prop="vehicleNumber"
                                         min-width="150"></el-table-column>
                        <el-table-column label="年份" align="center" prop="vehicleYear" min-width="150"></el-table-column>
                        <el-table-column label="月份" align="center" prop="vehicleMonth"
                                         min-width="150"></el-table-column>
                        <el-table-column label="类型" align="center" prop="type" min-width="150">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="VEHICLE_INSURANCE_DEPRECIATION_TYPE"
                                                        :value="scope.row.type"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额" align="center" prop="amount" min-width="150"></el-table-column>
                        <el-table-column label="创建人" align="center" prop="createUser" min-width="150"></el-table-column>
                        <el-table-column label="修改人" align="center" prop="modifyUser" min-width="150"></el-table-column>
                        <el-table-column label="创建时间" align="center" prop="createTime"
                                         min-width="150"></el-table-column>
                        <el-table-column label="修改时间" align="center" prop="modifyTime"
                                         min-width="180"></el-table-column>
                        <el-table-column label="操作" align="center" fixed="right" min-width="150">
                            <template slot-scope="scope">
                                <el-button type="text" v-permission="'/vehicleInsuranceDepreciation/modify'"
                                           icon="el-icon-edit" size="mini"
                                           @click="showModifyVehicleInsuranceDepreciationDialog(scope.row)"></el-button>
                                <el-button type="text" v-permission="'/vehicleInsuranceDepreciation/delete'"
                                           icon="el-icon-delete" size="mini"
                                           @click="deleteVehicleInsuranceDepreciation(scope.row)"></el-button>
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
                <!-- 新增车辆(保险/折旧)弹出框 -->
                <el-dialog title="新增车辆(保险/折旧)" :visible.sync="dialogAddVehicleInsuranceDepreciationVisible"
                           width="800px">
                    <el-form size="small" :model="addVehicleInsuranceDepreciationForm"
                             ref="addVehicleInsuranceDepreciationForm" label-width="100px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="车牌号:" prop="vehicleCode"
                                              :rules="[{required: true, message: '请选择车牌号', trigger: 'blur'}]">
                                    <vehicle-select style="display: block"
                                                    v-model="addVehicleInsuranceDepreciationForm.vehicleCode"></vehicle-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="金额:" prop="amount"
                                              :rules="[validate.required('金额',true),validate.allMoney]">
                                    <el-input v-model="addVehicleInsuranceDepreciationForm.amount"
                                              style="display: block"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="类型:" prop="type"
                                              :rules="[{required: true, message: '请选择类型', trigger: 'blur'}]">
                                    <dictionary-select option-name="VEHICLE_INSURANCE_DEPRECIATION_TYPE"
                                                       v-model="addVehicleInsuranceDepreciationForm.type"
                                                       style="display: block"></dictionary-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="时间:" prop="vehicleYear"
                                              :rules="[{required: true, message: '请选择年份', trigger: 'blur'}]">
                                    <el-date-picker v-model="addVehicleInsuranceDepreciationForm.vehicleYear"
                                                    style="width:100%;"
                                                    type="month" value-format="yyyy-MM" placeholder="选择时间"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button size="small" @click="dialogAddVehicleInsuranceDepreciationVisible = false">取 消
                        </el-button>
                        <el-button size="small" type="primary"
                                   @click="addVehicleInsuranceDepreciation('addVehicleInsuranceDepreciationForm')">确 定
                        </el-button>
                    </div>
                </el-dialog>
                <!-- 修改车辆(保险/折旧)弹出框-->
                <el-dialog title="修改车辆(保险/折旧)" :visible.sync="dialogModifyVehicleInsuranceDepreciationVisible"
                           width="800px">
                    <el-form size="small" :model="modifyVehicleInsuranceDepreciationForm"
                             ref="modifyVehicleInsuranceDepreciationForm" label-width="100px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="车牌号:" prop="vehicleCode"
                                              :rules="[{required: true, message: '请选择车牌号', trigger: 'blur'}]">
                                    <vehicle-select style="display: block"
                                                    v-model="modifyVehicleInsuranceDepreciationForm.vehicleCode"
                                                    ref="vehicleCodeNum"></vehicle-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="金额:" prop="amount"
                                              :rules="[validate.required('金额',true),validate.allMoney]">
                                    <el-input v-model="modifyVehicleInsuranceDepreciationForm.amount"
                                              style="display: block"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="类型:" prop="type"
                                              :rules="[{required: true, message: '请选择类型', trigger: 'blur'}]">
                                    <dictionary-select option-name="VEHICLE_INSURANCE_DEPRECIATION_TYPE"
                                                       v-model="modifyVehicleInsuranceDepreciationForm.type"
                                                       style="display: block"></dictionary-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="年份:" prop="vehicleYear"
                                              :rules="[{required: true, message: '请选择年份', trigger: 'blur'}]">
                                    <el-date-picker v-model="modifyVehicleInsuranceDepreciationForm.vehicleYear"
                                                    style="width:100%;"
                                                    type="month" value-format="yyyy-MM" placeholder="选择时间"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogModifyVehicleInsuranceDepreciationVisible = false" size="small">取 消
                        </el-button>
                        <el-button type="primary" size="small"
                                   @click="modifyVehicleInsuranceDepreciation('modifyVehicleInsuranceDepreciationForm')">
                            确 定
                        </el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="挂车箱体折旧" name="manual">
                <el-header class="content-header" height="">
                    <el-form size="small" :model="trailerHouseCarDepreciationSearchParam" label-width="100px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="折旧对象:">
                                    <dictionary-select option-name="DEPRECIATION_SUBJECT" style="display: block"
                                                       v-model="trailerHouseCarDepreciationSearchParam.depreciation"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车辆性质:">
                                    <dictionary-select v-model="trailerHouseCarDepreciationSearchParam.operationMode"
                                                       option-name="VEHICLE_OPERATION_MODE" style="display: block"
                                                       :excludeOptions="['OUT_INVITE']"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="自营模式:">
                                    <dictionary-select
                                        v-model="trailerHouseCarDepreciationSearchParam.selfOperationMode"
                                        style="display: block"
                                        option-name="VEHICLE_OUT_INVITE_OPERATION_SELF_MODE"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="月份:">
                                    <el-date-picker v-model="trailerHouseCarDepreciationSearchParam.trailerMonth"
                                                    type="month" style="width:100%;"
                                                    value-format="yyyy-MM" placeholder="选择月">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="财务主体:">
                                    <dictionary-select v-model="trailerHouseCarDepreciationSearchParam.incomeSubject"
                                                       style="display: block" option-name="OWNERCODE"
                                                       :filterable='true'/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="供应商名称:">
                                    <supplier-select type="PLANTFORM_COMPANY" style="display: block"
                                                     v-model="trailerHouseCarDepreciationSearchParam.supplierId"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item style="float: right">
                                    <el-button type="success" icon="el-icon-search"
                                               @click="trailerHouseCarDepreciationSearchParam.currentPage=1;trailerHouseCarDepreciationSearchList()"
                                               size="small">查询
                                    </el-button>
                                    <el-button type="warning" class="fa fa-repeat"
                                               @click="trailerHouseCarDepreciationResetSearchParam"
                                               size="small">&nbsp;&nbsp;重置
                                    </el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-header>
                <el-main class="content-main">
                    <el-button size="mini" v-permission="'/trailerHouseCarDepreciation/add'" type="primary"
                               @click="addTrailerHouseCarDepreciation"
                               icon="el-icon-plus">新增
                    </el-button>
                    <el-button v-if="trailerHouseCarDownloadLoading"
                               v-permission="'/trailerHouseCarDepreciation/download'"
                               icon="el-icon-download" type="primary" size="mini" style="margin-right:2px;"
                               @click="trailerHouseCarDepreciationExportList">模板下载
                    </el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>下载中...
                    </el-button>
                    <el-button v-if="trailerHouseCarDepreciationBatchLoading" v-permission="'/trailerHouseCarDepreciation/batchDelete'" size="mini"
                               type="primary" @click="batchTrailerHouseCarDepreciationDelete">批量删除
                    </el-button>
                    <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>删除中...
                    </el-button>
                    <upload-excel :importUrl="trailerHouseCarDepreciationUploadUrl" size="mini" btn-name="导入"
                                  style="margin-left:300px;margin-top:-28px;"
                                  v-permission="'/trailerHouseCarDepreciation/uploads'" @selection-change="trailerHouseCarDepreciationSearchHandleSelectionChange"
                                  @success="trailerHouseCarDepreciationUploadSuccess"/>
                    <el-table class="content-table" size="small" :data="trailerHouseCarDepreciationSearchResult.result" @selection-change="trailerHouseCarDepreciationSearchHandleSelectionChange"
                              element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                        <el-table-column type="selection" fixed="left"/>
                        <el-table-column label="折旧对象" align="center" prop="depreciation" min-width="100">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="DEPRECIATION_SUBJECT"
                                                        :value="scope.row.depreciation"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="车辆性质" align="center" prop="operationMode" min-width="100">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                        :value="scope.row.operationMode"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="自营模式" align="center" prop="selfOperationMode" min-width="100">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="SELF_OPERATION_MODE"
                                                        :value="scope.row.selfOperationMode"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="供应商名称" align="center" prop="supplierName" min-width="160"/>
                        <el-table-column label="财务主体" align="center" prop="incomeSubject" min-width="160"/>
                        <el-table-column label="折旧月份" align="center" prop="trailerMonth" min-width="100"/>
                        <el-table-column label="折旧类型" align="center" prop="depreciationType" min-width="100"/>
                        <el-table-column label="金额" align="center" prop="moneyAmount" min-width="120"/>
                        <el-table-column label="创建人" align="center" prop="createUser" min-width="100"/>
                        <el-table-column label="创建时间" align="center" prop="createTime" min-width="120"/>
                        <el-table-column label="修改人" align="center" prop="modifyUser" min-width="100"/>
                        <el-table-column label="修改时间" align="center" prop="modifyTime" min-width="120"/>
                        <el-table-column label="操作" align="center" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" v-permission="'/trailerHouseCarDepreciation/modify'"
                                           icon="el-icon-edit" size="mini"
                                           @click="showModifyTrailerHouseCarDepreciationDialog(scope.row)"></el-button>
                                <el-button type="text" v-permission="'/trailerHouseCarDepreciation/delete'"
                                           icon="el-icon-delete" size="mini"
                                           @click="deleteTrailerHouseCarDepreciation(scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="content-pagination">
                        <el-pagination
                            @size-change="trailerHouseCarDepreciationHandleSizeChange"
                            @current-change="trailerHouseCarDepreciationHandleCurrentChange"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size="trailerHouseCarDepreciationSearchParam.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="trailerHouseCarDepreciationSearchResult.totalCount">
                        </el-pagination>
                    </div>
                </el-main>
                <!-- 新增车辆(保险/折旧)弹出框 -->
                <el-dialog title="新增挂车箱体折旧" :visible.sync="dialogAddTrailerHouseCarDepreciationVisible"
                           width="800px">
                    <el-form size="small" :model="addTrailerHouseCarDepreciationForm"
                             :rules="trailerHouseCarDepreciationRules"
                             ref="addTrailerHouseCarDepreciationForm" label-width="100px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="折旧对象:" prop="depreciation">
                                    <dictionary-select option-name="DEPRECIATION_SUBJECT" style="display: block"
                                                       clearable
                                                       v-model="addTrailerHouseCarDepreciationForm.depreciation"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="折旧类型:" prop="depreciationType">
                                    <el-input v-model="addTrailerHouseCarDepreciationForm.depreciationType"
                                              disabled
                                              style="display: block"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="车辆性质:" prop="operationMode">
                                    <dictionary-select style="display: block"
                                                       v-model="addTrailerHouseCarDepreciationForm.operationMode"
                                                       clearable @change="changeAddOperation"
                                                       option-name="VEHICLE_OPERATION_MODE"
                                                       :excludeOptions="['OUT_INVITE']"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="addSelfOperationModeProp">
                                <el-form-item label="自营模式:" prop="selfOperationMode">
                                    <dictionary-select v-model="addTrailerHouseCarDepreciationForm.selfOperationMode"
                                                       clearable @change="changeAddSelfOperationModeProp"
                                                       style="display: block"
                                                       option-name="VEHICLE_OUT_INVITE_OPERATION_SELF_MODE"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-else>
                                <el-form-item label="自营模式:">
                                    <dictionary-select v-model="addTrailerHouseCarDepreciationForm.selfOperationMode"
                                                       clearable :disabled="!addSelfOperationModeProp"
                                                       style="display: block"
                                                       option-name="VEHICLE_OUT_INVITE_OPERATION_SELF_MODE"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if="addSelfSupportModeProp">
                                <el-form-item label="供应商名称:" prop="supplierId">
                                    <supplier-select style="display: block" type="PLANTFORM_COMPANY" clearable
                                                     v-model="addTrailerHouseCarDepreciationForm.supplierId"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-else>
                                <el-form-item label="供应商名称:">
                                    <supplier-select style="display: block" type="PLANTFORM_COMPANY" clearable
                                                     :disabled="!addSelfSupportModeProp"
                                                     v-model="addTrailerHouseCarDepreciationForm.supplierId"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="财务主体:" prop="incomeSubject">
                                    <dictionary-select v-model="addTrailerHouseCarDepreciationForm.incomeSubject"
                                                       option-name="OWNERCODE" style="display: block;"
                                                       :filterable='true'/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="金额:" prop="moneyAmount">
                                    <el-input v-model="addTrailerHouseCarDepreciationForm.moneyAmount" clearable
                                              style="display: block"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="折旧月份:" prop="trailerMonth">
                                    <el-date-picker v-model="addTrailerHouseCarDepreciationForm.trailerMonth" clearable
                                                    style="width:100%;"
                                                    type="month" value-format="yyyy-MM" placeholder="选择时间"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button size="small" @click="dialogAddTrailerHouseCarDepreciationVisible = false">取 消
                        </el-button>
                        <el-button size="small" type="primary"
                                   @click="addTrailerHouseCarDepreciationHandle('addTrailerHouseCarDepreciationForm')">确
                            定
                        </el-button>
                    </div>
                </el-dialog>
                <!-- 修改车辆(保险/折旧)弹出框-->
                <el-dialog title="修改挂车箱体折旧" :visible.sync="dialogModifyTrailerHouseCarDepreciationVisible"
                           width="800px">
                    <el-form size="small" :model="modifyTrailerHouseCarDepreciationForm"
                             :rules="trailerHouseCarDepreciationRules"
                             ref="modifyTrailerHouseCarDepreciationForm" label-width="100px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="折旧对象:" prop="depreciation">
                                    <dictionary-select v-model="modifyTrailerHouseCarDepreciationForm.depreciation"
                                                       clearable style="display: block"
                                                       option-name="DEPRECIATION_SUBJECT"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="折旧类型:" prop="depreciationType">
                                    <el-input v-model="modifyTrailerHouseCarDepreciationForm.depreciationType" disabled
                                              style="display: block"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="车辆性质:" prop="operationMode">
                                    <dictionary-select v-model="modifyTrailerHouseCarDepreciationForm.operationMode"
                                                       clearable @change="changeModifyOperation" style="display: block"
                                                       option-name="VEHICLE_OPERATION_MODE"
                                                       :excludeOptions="['OUT_INVITE']"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="modifySelfOperationModeProp">
                                <el-form-item label="自营模式:" prop="selfOperationMode">
                                    <dictionary-select v-model="modifyTrailerHouseCarDepreciationForm.selfOperationMode"
                                                       clearable @change="changeModifySelfOperationModeProp"
                                                       style="display: block"
                                                       option-name="VEHICLE_OUT_INVITE_OPERATION_SELF_MODE"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-else>
                                <el-form-item label="自营模式:">
                                    <dictionary-select v-model="modifyTrailerHouseCarDepreciationForm.selfOperationMode"
                                                       clearable style="display: block"
                                                       :disabled="!modifySelfOperationModeProp"
                                                       option-name="VEHICLE_OUT_INVITE_OPERATION_SELF_MODE"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12" v-if="modifySupplierIdModeProp">
                                <el-form-item label="供应商名称:" prop="supplierId">
                                    <supplier-select v-model="modifyTrailerHouseCarDepreciationForm.supplierId"
                                                     clearable
                                                     style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-else>
                                <el-form-item label="供应商名称:">
                                    <supplier-select v-model="modifyTrailerHouseCarDepreciationForm.supplierId"
                                                     clearable :disabled="!modifySupplierIdModeProp"
                                                     style="width:100%"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="财务主体:" prop="incomeSubject">
                                    <dictionary-select v-model="modifyTrailerHouseCarDepreciationForm.incomeSubject"
                                                       option-name="OWNERCODE" style="display: block;"
                                                       :filterable='true'/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="金额:" prop="moneyAmount">
                                    <el-input v-model="modifyTrailerHouseCarDepreciationForm.moneyAmount" clearable
                                              style="display: block"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="折旧月份:" prop="trailerMonth">
                                    <el-date-picker v-model="modifyTrailerHouseCarDepreciationForm.trailerMonth"
                                                    clearable
                                                    style="width:100%;"
                                                    type="month" value-format="yyyy-MM" placeholder="选择时间"/>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogModifyTrailerHouseCarDepreciationVisible = false" size="small">取 消
                        </el-button>
                        <el-button type="primary" size="small"
                                   @click="modifyTrailerHouseCarDepreciation('modifyVehicleInsuranceDepreciationForm')">
                            确 定
                        </el-button>
                    </div>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>

    </el-container>


</template>

<script>
    import {Http, Api, Constant, Common} from 'src/global/index'
    import {Validate} from 'src/global/validate'
    import axios from 'axios'

    export default {
        data() {
            return {
                initializeModel: {},
                modifySelfOperationModeProp: true,//自营模式验证
                addSelfOperationModeProp: true,//自营模式验证
                modifySupplierIdModeProp: true,//供应商验证
                addSelfSupportModeProp: true,//供应商验证
                Constant: Constant,
                defaultShow: 'auto',
                downloadLoading: true,
                trailerHouseCarDownloadLoading: true,
                uploadUrl: Api.vehicleInsuranceDepreciation.upload,//车辆保险折旧导入接口
                trailerHouseCarDepreciationUploadUrl: Api.trailerHouseCarDepreciation.upload,//车辆保险折旧导入接口
                validate: Validate,//校验
                batchLoading:true,//批量删除
                multipleSelection: [],//要操作的行
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    vehicleNumber: '',
                    vehicleCode: '',
                    vehicleYear: '',
                    type: '',
                },
                trailerHouseCarDepreciationBatchLoading:true,//批量删除
                trailerHouseCarDepreciationMultipleSelection: [],//要操作的行
                //查询参数
                trailerHouseCarDepreciationSearchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    depreciation: '',//折旧对象
                    depreciationType: '',//折旧类型
                    operationMode: '',//车辆性质
                    selfOperationMode: '',//自营模式
                    trailerMonth: '',//挂车箱体折旧月份
                    incomeSubject: '',//财务主体
                    supplierId: '',//供应商名称
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                //返回结果
                trailerHouseCarDepreciationSearchResult: {
                    totalCount: 0,
                    result: []
                },
                dialogAddVehicleInsuranceDepreciationVisible: false,//新增车辆(保险/折旧)对话框
                dialogAddTrailerHouseCarDepreciationVisible: false,//新增挂车/箱体折旧对话框
                dialogModifyVehicleInsuranceDepreciationVisible: false,//修改车辆(保险/折旧)对话框
                dialogModifyTrailerHouseCarDepreciationVisible: false,//修改挂车/箱体折旧对话框
                addVehicleInsuranceDepreciationForm: {
                    vehicleCode: '',//code
                    vehicleNumber: '',//车牌号
                    amount: '',//金额
                    type: '',//类型
                    vehicleYear: Common.date.dateFormat(new Date(), "YYYY-MM"),//时间
                },
                addTrailerHouseCarDepreciationForm: {
                    depreciation: '',//折旧对象
                    depreciationType: '折旧',//折旧类型
                    operationMode: '',//车辆性质
                    selfOperationMode: '',//自营模式
                    supplierId: '',//供应商名称
                    incomeSubject: '',//财务主体
                    moneyAmount: '',//金额
                    trailerMonth: Common.date.dateFormat(new Date(), "YYYY-MM"),//折旧月份
                },
                modifyVehicleInsuranceDepreciationForm: {
                    vehicleCode: '',
                    id: '',
                    vehicleNumber: '',
                    amount: '',
                    type: '',
                    vehicleYear: ''
                },
                modifyTrailerHouseCarDepreciationForm: {
                    depreciation: '',//折旧对象
                    depreciationType: '',//折旧类型
                    operationMode: '',//车辆性质
                    selfOperationMode: '',//自营模式
                    supplierId: '',//供应商名称
                    incomeSubject: '',//财务主体
                    moneyAmount: '',//金额
                    trailerMonth: Common.date.dateFormat(new Date(), "YYYY-MM"),//折旧月份
                },
                trailerHouseCarDepreciationRules: {
                    depreciation: [
                        {required: true, message: '请选择折旧对象', trigger: 'blur'},
                    ],
                    depreciationType: [
                        {required: true, message: '请选择折旧类型', trigger: 'blur'},
                    ],
                    operationMode: [
                        {required: true, message: '请选择车辆性质', trigger: 'blur'},
                    ],
                    selfOperationMode: [
                        {required: true, message: '请选择自营模式', trigger: 'blur'},
                    ],
                    supplierId: [
                        {required: true, message: '请选择供应商', trigger: 'blur'},
                    ],
                    incomeSubject: [
                        {required: true, message: '请选择财务主体', trigger: 'blur'},
                    ],
                    moneyAmount: [
                        {required: true, message: '请输入金额', trigger: 'blur'},
                        {pattern: /^([\-]?(([1-9]\d{0,7})|0))([.]\d{1,2})?$/, message: '请输入正确的金额!'},
                    ],
                    trailerMonth: [
                        {required: true, message: '请选择月份', trigger: 'blur'},
                    ],
                },
            }
        },
        mounted() {
            //查询表格
            this.initializeModel = _.cloneDeep(this._data);
            this.searchList();
            this.trailerHouseCarDepreciationSearchList();

        },
        methods: {
            //重置参数
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            //新增车辆保险折旧信息
            addVehicleInsuranceDepreciation(formName) {
                const vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.vehicleInsuranceDepreciation.add, vm.addVehicleInsuranceDepreciationForm, response => {
                            vm.dialogAddVehicleInsuranceDepreciationVisible = false;
                            vm.resetVehicleInsuranceDepreciationForm();
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //重置增加参数
            resetVehicleInsuranceDepreciationForm() {
                let vm = this;
                vm.addVehicleInsuranceDepreciationForm.vehicleCode = '';
                vm.addVehicleInsuranceDepreciationForm.vehicleNumber = '';
                vm.addVehicleInsuranceDepreciationForm.amount = '';
                vm.addVehicleInsuranceDepreciationForm.type = '';
                vm.addVehicleInsuranceDepreciationForm.vehicleYear = Common.date.dateFormat(new Date(), "YYYY-MM");
                vm.trailerHouseCarDepreciationSearchParam.depreciation = '';//折旧对象
                vm.trailerHouseCarDepreciationSearchParam.depreciationType = '';//折旧类型
                vm.trailerHouseCarDepreciationSearchParam.operationMode = '';//车辆性质
                vm.trailerHouseCarDepreciationSearchParam.selfOperationMode = '';//自营模式
                vm.trailerHouseCarDepreciationSearchParam.trailerMonth = '';//挂车箱体折旧月份
                vm.trailerHouseCarDepreciationSearchParam.supplierId = '';//供应商名称
                vm.trailerHouseCarDepreciationSearchParam.incomeSubject = '';//财务主体
            },
            //新增挂车、箱体折旧信息窗口信息
            addTrailerHouseCarDepreciation() {
                let _this = this;
                _this.dialogAddTrailerHouseCarDepreciationVisible = true;
                _this.addTrailerHouseCarDepreciationForm = _this.cloneMode().addTrailerHouseCarDepreciationForm;
            },
            //新增挂车保险折旧信息
            addTrailerHouseCarDepreciationHandle(formName) {
                let vm = this;
                this.$refs.addTrailerHouseCarDepreciationForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.trailerHouseCarDepreciation.add, vm.addTrailerHouseCarDepreciationForm, response => {
                            vm.dialogAddTrailerHouseCarDepreciationVisible = false;
                            vm.trailerHouseCarDepreciationSearchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },

            trailerHouseCarDepreciationSearchHandleSelectionChange(val) {
                this.trailerHouseCarDepreciationMultipleSelection = val
            },
            //重置查询参数
            resetSearchParam() {
                let vm = this;
                vm.searchParam.currentPage = 1;
                vm.searchParam.pageSize = 10;
                vm.searchParam.vehicleNumber = '';
                vm.searchParam.vehicleYear = '';
                vm.searchParam.type = '';
                vm.searchParam.vehicleCode = '';
            },
            //挂车保险折旧重置查询参数
            trailerHouseCarDepreciationResetSearchParam() {
                let vm = this;
                vm.searchParam.currentPage = 1;
                vm.searchParam.pageSize = 10;
                vm.trailerHouseCarDepreciationSearchParam.depreciation = '';//折旧对象
                vm.trailerHouseCarDepreciationSearchParam.depreciationType = '';//折旧类型
                vm.trailerHouseCarDepreciationSearchParam.operationMode = '';//车辆性质
                vm.trailerHouseCarDepreciationSearchParam.selfOperationMode = '';//自营模式
                vm.trailerHouseCarDepreciationSearchParam.trailerMonth = Common.date.dateFormat(new Date(), "YYYY-MM");//挂车箱体折旧月份
                vm.trailerHouseCarDepreciationSearchParam.supplierId = '';//供应商名称
                vm.trailerHouseCarDepreciationSearchParam.incomeSubject = '';//财务主体名称

            },
            //查询
            searchList() {
                let vm = this;
                Http.get(Api.vehicleInsuranceDepreciation.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                })
            },
            //挂车保险折旧查询
            trailerHouseCarDepreciationSearchList() {
                let vm = this;
                Http.get(Api.trailerHouseCarDepreciation.page, {params: vm.trailerHouseCarDepreciationSearchParam}, result => {
                    vm.trailerHouseCarDepreciationSearchResult.result = result.result;
                    vm.trailerHouseCarDepreciationSearchResult.totalCount = result.totalCount;
                    vm.trailerHouseCarDepreciationSearchParam.currentPage = result.currentPage;
                    vm.trailerHouseCarDepreciationSearchParam.pageSize = result.pageSize;
                })
            },
            //修改一页的记录数
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            //修改当前页
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            },
            //挂车保险折旧查询修改一页的记录数
            trailerHouseCarDepreciationHandleSizeChange(val) {
                let vm = this;
                vm.trailerHouseCarDepreciationSearchParam.pageSize = val;
                this.trailerHouseCarDepreciationSearchList();
            },
            //挂车保险折旧查询修改当前页
            trailerHouseCarDepreciationHandleCurrentChange(val) {
                let vm = this;
                vm.trailerHouseCarDepreciationSearchParam.currentPage = val;
                this.trailerHouseCarDepreciationSearchList();
            },
            //根据id查询出要修改的数据
            showModifyVehicleInsuranceDepreciationDialog(row) {
                let vm = this;
                Http.get(Api.vehicleInsuranceDepreciation.queryById, {params: {'id': row.id}}, result => {
                    vm.modifyVehicleInsuranceDepreciationForm = result.result;//将数据库中通过id查询到的数据赋值给修改框
                    vm.modifyVehicleInsuranceDepreciationForm.vehicleYear = result.result.vehicleYear + "-" + result.result.vehicleMonth;
                    vm.dialogModifyVehicleInsuranceDepreciationVisible = true;
                    let code = {code: result.result.vehicleCode, licenseNumber: result.result.vehicleNumber}
                    vm.$nextTick(() => {
                        vm.$refs.vehicleCodeNum.setCurrentVehicle(code)
                    })
                })
            },
            //根据id查询出要修改挂车/箱体折旧
            showModifyTrailerHouseCarDepreciationDialog(row) {
                let vm = this;
                Http.get(Api.trailerHouseCarDepreciation.queryById, {params: {'id': row.id}}, result => {
                    vm.modifyTrailerHouseCarDepreciationForm = result.result;//将数据库中通过id查询到的数据赋值给修改框
                    if (_.eq(vm.modifyTrailerHouseCarDepreciationForm.operationMode, Constant.VEHICLE_OPERATION_MODE.OUTSOURCE)) {
                        vm.modifySelfOperationModeProp = false;
                    }
                    vm.dialogModifyTrailerHouseCarDepreciationVisible = true;
                })
            },
            //修改车辆保险折旧信息
            modifyVehicleInsuranceDepreciation(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.vehicleInsuranceDepreciation.modify, vm.modifyVehicleInsuranceDepreciationForm, response => {
                            vm.dialogModifyVehicleInsuranceDepreciationVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //修改挂车/箱体折旧信息
            modifyTrailerHouseCarDepreciation(formName) {
                const vm = this;
                vm.$refs.modifyTrailerHouseCarDepreciationForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.trailerHouseCarDepreciation.modify, vm.modifyTrailerHouseCarDepreciationForm, response => {
                            vm.dialogModifyTrailerHouseCarDepreciationVisible = false;
                            vm.trailerHouseCarDepreciationSearchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除车辆保险折旧信息(根据Id删除/逻辑删除)
            deleteVehicleInsuranceDepreciation(row) {
                let vm = this;
                let ids = [];
                ids.push(row.id);
                this.$confirm('删除车辆(保险/折旧)后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.vehicleInsuranceDepreciation.delete, ids, result => {
                        vm.searchList();
                    })
                })
            },
            //批量删除导入成功数据
            batchVehicleInsuranceDepreciationDelete(){
                let vm = this;
                var ids = [];
                vm.multipleSelection.forEach(obj=>{
                    ids.push(obj.id);
                });
                vm.$confirm('批量删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    vm.batchLoading = false;
                    Http.post(Api.vehicleInsuranceDepreciation.batchDelete, ids, result => {
                        this.$message({
                            message: '批量删除成功!',
                            type: 'success'
                        });
                        vm.batchLoading = true;
                        vm.searchList();
                    },()=>{
                        vm.batchLoading = true;
                    })
                }).catch(() => {
                    vm.batchLoading = true;
                });
            },
            //删除修改挂车/箱体折旧
            deleteTrailerHouseCarDepreciation(row) {
                let vm = this;
                let ids = [];
                ids.push(row.id);
                this.$confirm('删除修改挂车/箱体折旧, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.trailerHouseCarDepreciation.delete, ids, result => {
                        vm.trailerHouseCarDepreciationSearchList();
                    })
                })
            },
            //批量删除导入成功数据
            batchTrailerHouseCarDepreciationDelete(){
                let vm = this;
                var ids = [];
                vm.trailerHouseCarDepreciationMultipleSelection.forEach(obj=>{
                    ids.push(obj.id);
                });
                vm.$confirm('批量删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    vm.trailerHouseCarDepreciationBatchLoading = false;
                    Http.post(Api.trailerHouseCarDepreciation.batchDelete, ids, result => {
                        this.$message({
                            message: '批量删除成功!',
                            type: 'success'
                        });
                        vm.trailerHouseCarDepreciationBatchLoading = true;
                        vm.trailerHouseCarDepreciationSearchList();
                    },()=>{
                        vm.trailerHouseCarDepreciationBatchLoading = true;
                    })
                }).catch(() => {
                    vm.trailerHouseCarDepreciationBatchLoading = true;
                });
            },
            //模板下载
            exportList() {
                let vm = this;
                vm.downloadLoading = false;
                axios.get(Api.vehicleInsuranceDepreciation.getExcel, {responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '车辆保险折旧导入模板.xls';
                    link.click();
                    vm.downloadLoading = true;
                }).catch(reason => {
                    vm.downloadLoading = true;
                })
            },
            //挂车箱体模板下载
            trailerHouseCarDepreciationExportList() {
                let vm = this;
                vm.trailerHouseCarDownloadLoading = false;
                axios.get(Api.trailerHouseCarDepreciation.getExcel, {responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '挂车/箱体折旧导入模板.xls';
                    link.click();
                    vm.trailerHouseCarDownloadLoading = true;
                }).catch(reason => {
                    vm.trailerHouseCarDownloadLoading = true;
                })
            },
            //导入数据成功
            uploadSuccess() {
                let vm = this;
                vm.searchList();
            },
            //导入数据成功
            trailerHouseCarDepreciationUploadSuccess() {
                let vm = this;
                vm.trailerHouseCarDepreciationSearchList();
            },
            //改变车辆性质，变更自营模式
            changeAddOperation(val) {
                let _this = this;
                if (val) {
                    if (_.eq(val, Constant.VEHICLE_OPERATION_MODE.OUTSOURCE)) {
                        _this.addTrailerHouseCarDepreciationForm.selfOperationMode = '';
                        _this.addTrailerHouseCarDepreciationForm.supplierId = '';
                        _this.addSelfOperationModeProp = false;
                        _this.addSelfSupportModeProp = true;
                    }
                    if (_.eq(val, Constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT)) {
                        _this.addTrailerHouseCarDepreciationForm.selfOperationMode = Constant.SELF_OPERATION_MODE.SELF_OUTSOURCE;
                        _this.addTrailerHouseCarDepreciationForm.supplierId = 'ebd4a292d5034a98b7b15e334db75059';
                        _this.addSelfOperationModeProp = true;
                    }
                }
            },
            //改变车辆性质，变更自营模式
            changeModifyOperation(val) {
                let _this = this;
                if (val) {
                    if (_.eq(val, Constant.VEHICLE_OPERATION_MODE.OUTSOURCE)) {
                        _this.modifyTrailerHouseCarDepreciationForm.selfOperationMode = '';
                        _this.modifyTrailerHouseCarDepreciationForm.supplierId = '';
                        _this.modifySelfOperationModeProp = false;
                        _this.modifySupplierIdModeProp = true;
                    }
                    if (_.eq(val, Constant.VEHICLE_OPERATION_MODE.SELF_SUPPORT)) {
                        _this.modifyTrailerHouseCarDepreciationForm.selfOperationMode = Constant.SELF_OPERATION_MODE.SELF_OUTSOURCE;
                        _this.modifyTrailerHouseCarDepreciationForm.supplierId = 'ebd4a292d5034a98b7b15e334db75059';
                        _this.modifySelfOperationModeProp = true;
                    }
                }
            },
            //改变自营模式，变更供应商
            changeAddSelfOperationModeProp(val) {
                let _this = this;
                if (val) {
                    if (_.eq(val, Constant.SELF_OPERATION_MODE.SELF_SELF_SUPPORT)) {
                        _this.addTrailerHouseCarDepreciationForm.supplierId = '';
                        _this.addSelfSupportModeProp = false;
                    }
                    if (_.eq(val, Constant.SELF_OPERATION_MODE.SELF_OUTSOURCE)) {
                        _this.addTrailerHouseCarDepreciationForm.supplierId = 'ebd4a292d5034a98b7b15e334db75059';
                        _this.addSelfSupportModeProp = true;
                    }
                }
            },
            //改变自营模式，变更供应商
            changeModifySelfOperationModeProp(val) {
                let _this = this;
                if (val) {
                    if (_.eq(val, Constant.SELF_OPERATION_MODE.SELF_SELF_SUPPORT)) {
                        _this.modifyTrailerHouseCarDepreciationForm.supplierId = '';
                        _this.modifySupplierIdModeProp = false;
                    }
                    if (_.eq(val, Constant.SELF_OPERATION_MODE.SELF_OUTSOURCE)) {
                        _this.modifyTrailerHouseCarDepreciationForm.supplierId = 'ebd4a292d5034a98b7b15e334db75059';
                        _this.modifySupplierIdModeProp = true;
                    }
                }
            }
        }
    }
</script>
<style>
    #freeCar > .el-tabs {
        width: 100%;
    }

    #freeCar > .el-header {
        height: auto !important;
    }

    #freeCar > .el-header > .crumbs {
        margin-bottom: 0 !important;
    }
</style>
