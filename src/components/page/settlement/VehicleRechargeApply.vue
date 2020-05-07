<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础信息</el-breadcrumb-item>
                <el-breadcrumb-item>充值申请</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6" style="display:block;">
                        <el-form-item label="审批编号:">
                            <el-input v-model="searchParam.approveNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆性质:" prop="vehicleNature">
                            <dictionary-select style="display: block" v-model="searchParam.vehicleNature"
                                               option-name="VEHICLE_OPERATION_MODE" :excludeOptions="['OUT_INVITE']"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="申请类型:" prop="applicationType">
                            <dictionary-select style="display: block" v-model="searchParam.applicationType"
                                               @change="clearSearchSupplier"
                                               option-name="APPLY_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:" prop="supplier">
                            <!--<el-input v-show="searchParam.applicationType==''" style="display:block;" disabled="true" placeholder="请选择申请类型"></el-input>-->
                            <dictionary-select v-show="searchParam.applicationType==''" option-name="" value="" style="display:block;" placeholder="请选择申请类型"></dictionary-select>
                            <dictionary-select v-show="searchParam.applicationType==Constant.APPLY_TYPE.ELECTRONIC_OIL_CARD" v-model="searchParam.supplier"
                                               option-name="GAS_STATION" style="display:block;"></dictionary-select>
                            <dictionary-select v-show="searchParam.applicationType==Constant.APPLY_TYPE.MATERIAL_OBJECT_OIL_CARD" v-model="searchParam.supplier"
                                               option-name="PHYSICAL_OIL_CARD" style="display:block;"></dictionary-select>
                            <dictionary-select v-show="searchParam.applicationType==Constant.APPLY_TYPE.ETC" v-model="searchParam.supplier"
                                               option-name="ETC_SUPPILER" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="充值类型:" prop="rechargeType">
                            <dictionary-select v-model="searchParam.rechargeType"
                                               option-name="RECHARGE_TYPE" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="充值开始日期:">
                            <date-picker-single v-model="searchParam.startTime" date-type="start"
                                                :end-date="searchParam.endTime"
                                                :default-time="['00:00:00', '23:59:59']"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="充值结束日期:">
                            <date-picker-single v-model="searchParam.endTime" date-type="end"
                                                :start-date="searchParam.startTime"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchList()">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="btnLoading" v-permission="'/vehicleRechargeApply/add'" size="mini" type="primary"
                       icon="el-icon-plus" @click="dialogAddVehicleRechargeApplyVisible=true">新增
            </el-button>
            <el-button v-if="btnLoading" v-permission="'/vehicleRechargeApply/modify'" size="mini" type="primary"
                       icon="el-icon-edit" @click="modifyVehicleRechargeApplyClick">修改
            </el-button>
            <el-button v-if="btnLoading" v-permission="'/vehicleRechargeApply/export'" size="mini" type="primary"
                       icon="el-icon-download" @click="exportData">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="审批编号" prop="approveNo" min-width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车辆性质" prop="vehicleNature" min-width="150"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                v-model="scope.row.vehicleNature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="申请类型" min-width="150"
                                 show-overflow-tooltip prop="applicationType">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="APPLY_TYPE"
                                                v-model="scope.row.applicationType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="供应商" prop="supplier" min-width="150"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!--<dictionary-select-name v-show="scope.row.applicationType==''" option-name="" value="" v-model="scope.row.supplier" style="display:block;" placeholder="请选择"></dictionary-select-name>-->
                        <dictionary-select-name v-show="scope.row.applicationType==Constant.APPLY_TYPE.ELECTRONIC_OIL_CARD" v-model="scope.row.supplier"
                                           option-name="GAS_STATION" style="display:block;"></dictionary-select-name>
                        <dictionary-select-name v-show="scope.row.applicationType==Constant.APPLY_TYPE.MATERIAL_OBJECT_OIL_CARD" v-model="scope.row.supplier"
                                           option-name="PHYSICAL_OIL_CARD" style="display:block;"></dictionary-select-name>
                        <dictionary-select-name v-show="scope.row.applicationType==Constant.APPLY_TYPE.ETC" v-model="scope.row.supplier"
                                           option-name="ETC_SUPPILER" style="display:block;"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="充值日期" prop="rechargeDate" min-width="130"
                                 show-overflow-tooltip></el-table-column>
                <!--<el-table-column align="center" label="充值供应商" prop="supplierName" min-width="180"-->
                                 <!--show-overflow-tooltip></el-table-column>-->
                <el-table-column align="center" label="分配金额" prop="distributionAmount"
                                 min-width="130"></el-table-column>
                <el-table-column align="center" label="充值类型" prop="rechargeType" min-width="150"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="RECHARGE_TYPE"
                                                v-model="scope.row.rechargeType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="备注" prop="remarks" min-width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="创建人" prop="createUser" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="创建时间" prop="createTime" min-width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="修改人" prop="modifyUser" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="修改时间" prop="modifyTime" min-width="150"
                                 show-overflow-tooltip></el-table-column>
            </el-table>
            <el-row>
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 20, 50, 300]"
                        :page-size="searchParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchResult.totalCount">
                    </el-pagination>
                </div>
            </el-row>
            <!--<el-row style="font-size:13px; font-weight: bold;">-->
            <!--<span style=" margin-right:20px;">勾选条数：{{multipleSelection.length}}条</span>-->
            <!--<span style="color:red; margin-right:20px;">交易金额：{{distributionAmountValue}}元</span>-->
            <!--</el-row>-->
        </el-main>

        <!-----------------------------------------S 【新增】充值申请信息弹出框 --------------------------------------->
        <el-dialog title="自营合作车充值申请" :visible.sync="dialogAddVehicleRechargeApplyVisible" width="70%" size="small"
                   @close="closeAddVehicleRechargeApplyForm">
            <el-form size="small" :model="addVehicleRechargeApplyForm" :rules="addVehicleRechargeApplyFormRules"
                     ref="addVehicleRechargeApplyForm" label-width="120px"
                     id="addVehicleRechargeApplyForm">
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="审批编号:" prop="approveNo">
                            <el-input v-model="addVehicleRechargeApplyForm.approveNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="车辆性质:" prop="vehicleNature">
                            <dictionary-select style="display: block"
                                               v-model="addVehicleRechargeApplyForm.vehicleNature"
                                               option-name="VEHICLE_OPERATION_MODE" :excludeOptions="['OUT_INVITE']"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="申请类型:" prop="applicationType">
                            <dictionary-select style="display: block"
                                               v-model="addVehicleRechargeApplyForm.applicationType"
                                               @change="clearSupplier"
                                               option-name="APPLY_TYPE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="供应商:" prop="supplier">
                            <dictionary-select v-show="addVehicleRechargeApplyForm.applicationType==''" option-name="" value="" v-model="addVehicleRechargeApplyForm.supplier" style="display:block;" placeholder="请选择申请类型"></dictionary-select>
                            <dictionary-select v-show="addVehicleRechargeApplyForm.applicationType==Constant.APPLY_TYPE.ELECTRONIC_OIL_CARD" v-model="addVehicleRechargeApplyForm.supplier"
                                               option-name="GAS_STATION" style="display:block;"></dictionary-select>
                            <dictionary-select v-show="addVehicleRechargeApplyForm.applicationType==Constant.APPLY_TYPE.MATERIAL_OBJECT_OIL_CARD" v-model="addVehicleRechargeApplyForm.supplier"
                                               option-name="PHYSICAL_OIL_CARD" style="display:block;"></dictionary-select>
                            <dictionary-select v-show="addVehicleRechargeApplyForm.applicationType==Constant.APPLY_TYPE.ETC" v-model="addVehicleRechargeApplyForm.supplier"
                                               option-name="ETC_SUPPILER" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="申请充值总金额:" prop="rechargeAmount">
                            <el-input style="display: block;" v-model="addVehicleRechargeApplyForm.rechargeAmount"
                                      @change="setDistributionAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="充值日期:" prop="rechargeDate">
                            <el-date-picker style="display: block; width: 100%;"
                                            v-model="addVehicleRechargeApplyForm.rechargeDate"
                                            type="date"
                                            placeholder="选择日期"
                                            value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--------------S 添加充值明细-------------->
                <div style="color: #20a0ff">充值明细</div>
                <el-form size="small" :model="addVehicleRechargeApplyDetailForm"
                         :rules="addVehicleRechargeApplyDetailFormRules"
                         ref="addVehicleRechargeApplyDetailForm"
                         id="addVehicleRechargeApplyDetailForm" label-width="120px">
                    <el-row>
                        <!--<el-col :span="7">-->
                            <!--<el-form-item label="充值供应商:" prop="supplierCode">-->
                                <!--<supplier-select v-model="addVehicleRechargeApplyDetailForm.supplierCode"-->
                                                 <!--ref="addSupplierObject" style="display: block;"-->
                                                 <!--:types="Constant.SUPPLIER_TYPE.PLANTFORM_COMPANY"></supplier-select>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                        <el-col :span="7">
                            <el-form-item label="分配金额:" prop="distributionAmount">
                                <el-input v-model="addVehicleRechargeApplyDetailForm.distributionAmount"
                                          placeholder="元"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="充值类型:" prop="rechargeType">
                                <dictionary-select v-model="addVehicleRechargeApplyDetailForm.rechargeType"
                                                   option-name="RECHARGE_TYPE"
                                                   style="display: block;"></dictionary-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-button size="small" icon="el-icon-plus" type="primary"
                                       @click="addVehicleRechargeApplyDetail('addVehicleRechargeApplyDetailForm')"
                                       style="margin-left: 20px;"> 添 加
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <!--------------E 添加充值明细-------------->
                <!--------------S 充值明细列表-------------->
                <el-row>
                    <el-col :span="21">
                        <el-form-item label=" ">
                            <el-table size="small" class="content-table"
                                      :data="addVehicleRechargeApplyForm.vehicleRechargeApplyDetailList" border>
                                <el-table-column align="center" label="充值供应商id" prop="supplierCode"
                                                 v-if="false" min-width="140"></el-table-column>
                                <!--<el-table-column align="center" label="充值供应商" prop="supplierName"-->
                                                 <!--show-overflow-tooltip></el-table-column>-->
                                <el-table-column align="center" label="分配金额"
                                                 prop="distributionAmount"></el-table-column>
                                <el-table-column align="center" label="充值类型" prop="rechargeType">
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="RECHARGE_TYPE"
                                                                :value="scope.row.rechargeType"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作" fixed="right" width="140px">
                                    <template slot-scope="scope">
                                        <el-button type="text" icon="el-icon-delete" size="mini"
                                                   @click="deleteVehicleRechargeApply(scope.$index,addVehicleRechargeApplyForm.vehicleRechargeApplyDetailList)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>

                    </el-col>
                </el-row>
                <!--------------E 充值明细列表-------------->
                &nbsp;
                <el-row>
                    <el-col :span="21">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="3" :cols="133" :maxlength="200" placeholder="最多200个字符！"
                                      v-model="addVehicleRechargeApplyForm.remarks"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddVehicleRechargeApplyVisible = false">取 消</el-button>
                <el-button size="small" type="primary"
                           @click="addVehicleRechargeApply('addVehicleRechargeApplyForm')">确 定
                </el-button>
            </div>
        </el-dialog>
        <!-----------------------------------------E 【新增】充值申请信息弹出框 --------------------------------------->

        <!-----------------------------------------S 【修改】充值申请信息弹出框 --------------------------------------->
        <el-dialog title="自营合作车充值申请" :visible.sync="dialogModifyVehicleRechargeApplyVisible" width="70%" size="small"
                   @close="closeModifyVehicleRechargeApplyForm">
            <el-form size="small" :model="modifyVehicleRechargeApplyForm"
                     :rules="addVehicleRechargeApplyFormRules"
                     ref="modifyVehicleRechargeApplyForm" label-width="120px" id="modifyVehicleRechargeApplyForm">
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="审批编号:" prop="approveNo">
                            <el-input v-model="modifyVehicleRechargeApplyForm.approveNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="车辆性质:" prop="vehicleNature">
                            <dictionary-select style="display: block"
                                               v-model="modifyVehicleRechargeApplyForm.vehicleNature"
                                               option-name="VEHICLE_OPERATION_MODE" :excludeOptions="['OUT_INVITE']"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="申请类型:" prop="applicationType">
                            <dictionary-select style="display: block"
                                               v-model="modifyVehicleRechargeApplyForm.applicationType"
                                               @change="clearModifySupplier"
                                               option-name="APPLY_TYPE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="7">
                        <el-form-item label="供应商:" prop="supplier">
                            <dictionary-select v-show="modifyVehicleRechargeApplyForm.applicationType==''" v-model="modifyVehicleRechargeApplyForm.supplier" option-name="" value="" style="display:block;" placeholder="请选择申请类型"></dictionary-select>
                            <dictionary-select v-show="modifyVehicleRechargeApplyForm.applicationType==Constant.APPLY_TYPE.ELECTRONIC_OIL_CARD" v-model="modifyVehicleRechargeApplyForm.supplier"
                                               option-name="GAS_STATION" style="display:block;"></dictionary-select>
                            <dictionary-select v-show="modifyVehicleRechargeApplyForm.applicationType==Constant.APPLY_TYPE.MATERIAL_OBJECT_OIL_CARD" v-model="modifyVehicleRechargeApplyForm.supplier"
                                               option-name="PHYSICAL_OIL_CARD" style="display:block;"></dictionary-select>
                            <dictionary-select v-show="modifyVehicleRechargeApplyForm.applicationType==Constant.APPLY_TYPE.ETC" v-model="modifyVehicleRechargeApplyForm.supplier"
                                               option-name="ETC_SUPPILER" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="充值总金额:" prop="rechargeAmount">
                            <el-input v-model="modifyVehicleRechargeApplyForm.rechargeAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="充值日期:" prop="rechargeDate">
                            <el-date-picker v-model="modifyVehicleRechargeApplyForm.rechargeDate"
                                            type="date" style="display: block; width: 100%;"
                                            placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--------------S 修改充值明细-------------->
                <div style="color: #20a0ff">充值明细</div>
                <el-form size="small" :model="modifyVehicleRechargeApplyDetailForm"
                         :rules="addVehicleRechargeApplyDetailFormRules"
                         ref="modifyVehicleRechargeApplyDetailForm" label-width="120px"
                         id="modifyVehicleRechargeApplyDetailForm">
                    <el-row>
                        <!--<el-col :span="7">-->
                            <!--<el-form-item label="充值供应商:" prop="supplierCode">-->
                                <!--<supplier-select v-model="modifyVehicleRechargeApplyDetailForm.supplierCode"-->
                                                 <!--ref="modifySupplierObject" style="display: block;"-->
                                                 <!--:types="Constant.SUPPLIER_TYPE.PLANTFORM_COMPANY"></supplier-select>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                        <el-col :span="7">
                            <el-form-item label="分配金额:" prop="distributionAmount">
                                <el-input v-model="modifyVehicleRechargeApplyDetailForm.distributionAmount"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="充值类型:" prop="rechargeType">
                                <dictionary-select v-model="modifyVehicleRechargeApplyDetailForm.rechargeType"
                                                   option-name="RECHARGE_TYPE"
                                                   style="display: block;"></dictionary-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-button size="small" icon="el-icon-plus" type="primary"
                                       @click="modifyVehicleRechargeApplyDetail('modifyVehicleRechargeApplyDetailForm')"
                                       style="margin-left: 20px;"> 添 加
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <!--------------E 修改充值明细-------------->
                <!--------------S 充值明细列表-------------->
                <el-row>
                    <el-col :span="21">
                        <el-form-item label=" ">
                            <el-table size="small" class="content-table"
                                      :data="modifyVehicleRechargeApplyForm.vehicleRechargeApplyDetailList" border>
                                <el-table-column align="center" label="充值供应商id" prop="supplierCode"
                                                 v-if="false" min-width="140"></el-table-column>
                                <!--<el-table-column align="center" label="充值供应商" prop="supplierName"-->
                                                 <!--show-overflow-tooltip></el-table-column>-->
                                <el-table-column align="center" label="分配金额"
                                                 prop="distributionAmount"></el-table-column>
                                <el-table-column align="center" label="充值类型" prop="rechargeType">
                                    <template slot-scope="scope">
                                        <dictionary-select-name option-name="RECHARGE_TYPE"
                                                                :value="scope.row.rechargeType"></dictionary-select-name>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作" fixed="right" width="140">
                                    <template slot-scope="scope">
                                        <el-button type="text" icon="el-icon-delete" size="mini"
                                                   @click="deleteVehicleRechargeApply(scope.$index,modifyVehicleRechargeApplyForm.vehicleRechargeApplyDetailList)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--------------E 充值明细列表-------------->
                &nbsp;
                <el-row>
                    <el-col :span="21">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="3" :cols="133" :maxlength="200" placeholder="最多200个字符！"
                                      v-model="modifyVehicleRechargeApplyForm.remarks"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyVehicleRechargeApplyVisible = false">取 消</el-button>
                <el-button size="small" type="primary"
                           @click="modifyVehicleRechargeApply('modifyVehicleRechargeApplyForm')">确 定
                </el-button>
            </div>
        </el-dialog>
        <!-----------------------------------------E 【修改】充值申请信息弹出框 --------------------------------------->
    </el-container>
</template>

<script>
    import {Api, Common, Constant, Http, Validate} from 'src/global'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                btnLoading: true,
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    approveNo: '',//审批编号
                    vehicleNature: '',//车辆性质
                    applicationType: '',//申请类型
                    supplier: '',//供应商
                    // supplierCode: '',//充值供应商
                    rechargeType: '',//充值类型
                    startTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//充值开始时间
                    endTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")// 充值结束时间
                },
                dialogAddVehicleRechargeApplyDetailVisible: true,
                dialogAddVehicleRechargeApplyVisible: false,
                dialogModifyVehicleRechargeApplyDetailVisible: true,
                dialogModifyVehicleRechargeApplyVisible: false,
                addVehicleRechargeApplyForm: {
                    vehicleRechargeApplyDetailList: [],
                    approveNo: '',
                    vehicleNature: '',
                    applicationType: '',
                    supplier: '',
                    rechargeAmount: '',
                    rechargeDate: '',
                    remarks: ''
                },
                modifyVehicleRechargeApplyForm: {
                    id: '',
                    vehicleRechargeApplyDetailList: [],
                    approveNo: '',
                    vehicleNature: '',
                    applicationType: '',
                    supplier: '',
                    rechargeAmount: '',
                    rechargeDate: '',
                    remarks: ''
                },
                addVehicleRechargeApplyDetailForm: {
                    // supplierCode: '',
                    // supplierName: '',
                    distributionAmount: '',
                    rechargeType: ''
                },
                modifyVehicleRechargeApplyDetailForm: {
                    supplierCode: '',
                    supplierName: '',
                    distributionAmount: '',
                    rechargeType: ''
                },
                addVehicleRechargeApplyFormRules: {
                    approveNo: [
                        {required: true, message: '请输审批编号', trigger: 'blur'}
                    ],
                    vehicleNature: [
                        {required: true, message: '请选择车辆性质', trigger: 'blur'}
                    ],
                    applicationType: [
                        {required: true, message: '请选择申请类型', trigger: 'blur'}
                    ],
                    supplier: [
                        {required: true, message: '请选择供应商', trigger: 'blur'}
                    ],
                    rechargeAmount: [
                        {required: true, message: '请输入申请充值总金额', trigger: 'blur'},
                        Validate.threeMoney
                    ],
                    rechargeDate: [
                        {required: true, message: '请选择充值日期', trigger: 'blur'}
                    ]
                },
                addVehicleRechargeApplyDetailFormRules: {
                    supplierCode: [
                        {required: true, message: '请选择充值供应商', trigger: 'blur'}
                    ],
                    distributionAmount: [
                        {required: true, message: '请输入分配金额', trigger: 'blur'},
                        Validate.threeMoney
                    ],
                    rechargeType: [
                        {required: true, message: '请选择充值类型', trigger: 'blur'}
                    ]
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                tableHeight: window.innerHeight > 800 ? 480 : null
            }
        },
        created() {
            this.searchList();
        },
        computed: {
            //统计交易总金额
            // distributionAmountValue() {
            //     let sum = 0;
            //     if (this.multipleSelection && this.multipleSelection.length != 0) {
            //         for (let i = 0; i < this.multipleSelection.length; i++) {
            //             sum += Common.util.numberFormat(this.multipleSelection[i].distributionAmount)
            //         }
            //     }
            //     return sum.toFixed(2);
            // }
        },
        methods: {
            //分配金额默认充值总金额
            setDistributionAmount() {
                this.addVehicleRechargeApplyDetailForm.distributionAmount = this.addVehicleRechargeApplyForm.rechargeAmount;
            },
            clearSupplier() {
                this.addVehicleRechargeApplyForm.supplier ='';
            },
            clearSearchSupplier(){
                this.searchParam.supplier ='';
            },
            clearModifySupplier() {
                this.modifyVehicleRechargeApplyForm.supplier = '';
            },
            closeAddVehicleRechargeApplyForm() {
                this.$refs.addVehicleRechargeApplyForm.resetFields();
                let vm = this;
                vm.addVehicleRechargeApplyForm = {
                    vehicleRechargeApplyDetailList: [],
                    approveNo: '',
                    vehicleNature: '',
                    applicationType: '',
                    supplier: '',
                    rechargeAmount: '',
                    rechargeDate: '',
                    remarks: ''
                }
            },
            closeModifyVehicleRechargeApplyForm() {
                this.$refs.modifyVehicleRechargeApplyForm.resetFields()
            },
            modifyVehicleRechargeApplyClick() {
                let vm = this;
                if (vm.multipleSelection == null || vm.multipleSelection.length != 1) {
                    this.$message.warning('请选择一条数据修改');
                    return;
                }
                Http.get(Api.vehicleRechargeApply.queryById, {params: {'id': vm.multipleSelection[0].id}}, result => {
                    setTimeout(function () {
                        vm.modifyVehicleRechargeApplyForm = result.result;
                    }, 0);
                    vm.dialogModifyVehicleRechargeApplyVisible = true;
                })
            },

            modifyVehicleRechargeApplyDetail(formName) {
                let vm = this;
                // let supplier = this.$refs.modifySupplierObject.getObject();
                // vm.modifyVehicleRechargeApplyDetailForm.supplierName = supplier.name;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // if (vm.modifyVehicleRechargeApplyForm.vehicleRechargeApplyDetailList.length > 0) {
                        //     let list = vm.modifyVehicleRechargeApplyForm.vehicleRechargeApplyDetailList;
                        //     for (let i = 0; i < list.length; i++) {
                        //         if (list[i].supplierCode == vm.modifyVehicleRechargeApplyDetailForm.supplierCode && list[i].rechargeType == vm.modifyVehicleRechargeApplyDetailForm.rechargeType) {
                        //             this.$message.warning('同一充值类型，充值供应商不能重复');
                        //             return;
                        //         }
                        //     }
                        // }
                        vm.modifyVehicleRechargeApplyForm.vehicleRechargeApplyDetailList.push(vm.modifyVehicleRechargeApplyDetailForm);
                        vm.modifyVehicleRechargeApplyDetailForm = {
                            // supplierCode: '',
                            // supplierName: '',
                            distributionAmount: '',
                            rechargeType: ''
                        }
                    }
                });
            },
            addVehicleRechargeApplyDetail(formName) {
                let vm = this;
                // let supplier = this.$refs.addSupplierObject.getObject();
                // vm.addVehicleRechargeApplyDetailForm.supplierName = supplier.name;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // if (vm.addVehicleRechargeApplyForm.vehicleRechargeApplyDetailList.length > 0) {
                        //     let list = vm.addVehicleRechargeApplyForm.vehicleRechargeApplyDetailList;
                        //     for (let i = 0; i < list.length; i++) {
                        //         if (list[i].supplierCode == vm.addVehicleRechargeApplyDetailForm.supplierCode && list[i].rechargeType == vm.addVehicleRechargeApplyDetailForm.rechargeType) {
                        //             this.$message.warning('同一充值类型，充值供应商不能重复');
                        //             return;
                        //         }
                        //     }
                        // }
                        vm.addVehicleRechargeApplyForm.vehicleRechargeApplyDetailList.push(vm.addVehicleRechargeApplyDetailForm);
                        vm.addVehicleRechargeApplyDetailForm = {
                            // supplierCode: '',
                            // supplierName: '',
                            distributionAmount: '',
                            rechargeType: ''
                        }
                    }
                });
            },
            addVehicleRechargeApply(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // if (vm.addVehicleRechargeApplyForm.vehicleRechargeApplyDetailList == null) {
                        //     this.$message.warning('请选择充值供应商');
                        //     return;
                        // }
                        let list = vm.addVehicleRechargeApplyForm.vehicleRechargeApplyDetailList;
                        let distributionAmountTotal = 0;
                        for (let i = 0; i < list.length; i++) {
                            distributionAmountTotal += Common.util.numberFormat(list[i].distributionAmount);
                        }
                        if (distributionAmountTotal != vm.addVehicleRechargeApplyForm.rechargeAmount) {
                            this.$message.warning('分配金额总和必须等于充值总金额');
                            return;
                        }
                        Http.post(Api.vehicleRechargeApply.add, vm.addVehicleRechargeApplyForm, response => {
                            vm.resetAddVehicleRechargeApplyForm();
                            vm.dialogAddVehicleRechargeApplyVisible = false;
                            vm.searchList();
                        }, result => {
                        })
                    }
                });
            },
            modifyVehicleRechargeApply(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // if (vm.modifyVehicleRechargeApplyForm.vehicleRechargeApplyDetailList == null) {
                        //     this.$message.warning('请选择充值供应商');
                        //     return;
                        // }
                        let list = vm.modifyVehicleRechargeApplyForm.vehicleRechargeApplyDetailList;
                        let distributionAmountTotal = 0;
                        for (let i = 0; i < list.length; i++) {
                            distributionAmountTotal += Common.util.numberFormat(list[i].distributionAmount);
                        }
                        if (distributionAmountTotal != vm.modifyVehicleRechargeApplyForm.rechargeAmount) {
                            this.$message.warning('分配金额总和必须等于充值总金额');
                            return;
                        }
                        Http.post(Api.vehicleRechargeApply.modify, vm.modifyVehicleRechargeApplyForm, response => {
                            vm.resetModifyVehicleRechargeApplyForm();
                            vm.dialogModifyVehicleRechargeApplyVisible = false;
                            vm.searchList();
                        }, result => {
                        })
                    }
                });
            },
            deleteVehicleRechargeApply(index, vehicleRechargeApplyDetailList) {
                vehicleRechargeApplyDetailList.splice(index, 1);
            },
            resetAddVehicleRechargeApplyForm() {
                let vm = this;
                vm.addVehicleRechargeApplyForm = {
                    vehicleRechargeApplyDetailList: [],
                    approveNo: '',
                    vehicleNature: '',
                    applicationType: '',
                    supplier: '',
                    rechargeAmount: '',
                    rechargeDate: '',
                    remarks: ''
                }
            },
            resetModifyVehicleRechargeApplyForm() {
                let vm = this;
                vm.addVehicleRechargeApplyForm = {
                    id: '',
                    vehicleRechargeApplyDetailList: [],
                    approveNo: '',
                    vehicleNature: '',
                    applicationType: '',
                    supplier: '',
                    rechargeAmount: '',
                    rechargeDate: '',
                    remarks: ''
                }
            },
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    approveNo: '',//审批编号
                    vehicleNature: '',//车辆性质
                    applicationType: '',//申请类型
                    supplier: '',//供应商
                    // supplierCode: '',//充值供应商
                    rechargeType: '',//充值类型
                    startTime: Common.date.dateFormat(new Date(), "YYYY-MM-01 00:00:00"),//充值开始时间
                    endTime: Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")// 充值结束时间
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.vehicleRechargeApply.page, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            exportData() {
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.vehicleRechargeApply.page, searchExportParam, response => {
                    let header = ['审批编号', '车辆性质', '申请类型', '供应商', '充值日期', '分配金额', '充值类型', '备注', '创建人', '创建时间', '修改人', '修改时间'];
                    let filterVal = ['approveNo', {
                        type: 'dictionary',
                        'code': 'VEHICLE_OPERATION_MODE',
                        'name': 'vehicleNature'
                    }, {
                        type: 'dictionary',
                        'code': 'APPLY_TYPE',
                        'name': 'applicationType'
                    }, {
                        type: 'dictionary',
                        'code': 'GAS_STATION,PHYSICAL_OIL_CARD,ETC_SUPPILER',
                        'name': 'supplier'
                    }, 'rechargeDate', 'distributionAmount',
                        {
                            type: 'dictionary',
                            'code': 'RECHARGE_TYPE',
                            'name': 'rechargeType'
                        }, 'remarks', 'createUser', 'createTime', 'modifyUser', 'modifyTime'
                    ];
                    Common.excel.downloadExl(response.result, header, filterVal, "充值申请导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            },
        }
    }
</script>
