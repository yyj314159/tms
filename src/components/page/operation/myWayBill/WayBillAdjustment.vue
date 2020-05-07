<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 运单管理</el-breadcrumb-item>
                <el-breadcrumb-item>运单调整</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="运单号:">
                            <el-input  v-model="searchParam.waybillCode" style="display:block;" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select option-name="AUDIT_STATUS"  v-model="searchParam.auditStatus" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="申请开始时间:">
                            <date-picker-single v-model="searchParam.createTimeStart" date-type="start" :end-date="searchParam.createTimeStart" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="申请结束时间:">
                            <date-picker-single v-model="searchParam.createTimeEnd" date-type="end" :start-date="searchParam.createTimeEnd" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleCode" style="display: block"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="申请人:">
                            <user-select v-model="searchParam.createUser" style="display:block"></user-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核人:">
                            <user-select v-model="searchParam.auditStatusUser" style="display:block"></user-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" v-permission="'/waybillPayableDeduct/add'" @click="addAdjustment">新增</el-button>
            <el-button v-if="btnLoading" v-permission="'/waybillPayableDeduct/export'" size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-button v-if="downloading" v-permission="'/waybillPayableDeduct/templateDownload'" icon="el-icon-download" type="primary" size="mini" @click="templateDownload">模板下载</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>下载中...</el-button>
            <upload-excel v-permission="'/waybillPayableDeduct/upload'" :importUrl="Api.waybillPayableDeduct.upload"
                          @success="uploadSuccess" btn-name="导入" style="display: inline-block;margin-left: 10px"></upload-excel>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="运单号" min-width="130">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="所属大区" prop="regionName" min-width="140"/>
                <el-table-column header-align="center" label="所属分区" prop="belongOrgName" min-width="140"/>
                <el-table-column header-align="center" label="申请人" prop="createUser" min-width="140"/>
                <el-table-column header-align="center" label="申请时间" prop="createTime" min-width="160" show-overflow-tooltip/>
                <el-table-column header-align="center" label="调整金额" prop="adjustAmount" min-width="140"/>
                <el-table-column header-align="center" label="应收调整" prop="" min-width="140"/>
                <el-table-column header-align="center" label="油价补差(调增)" prop="oilPriceSupplement" min-width="140"/>
                <el-table-column header-align="center" label="其他扣款(调减)" prop="otherDeductionsAmount" min-width="140"/>
                <el-table-column header-align="center" label="质量奖励(调增)" prop="qualityAward" min-width="140"/>
                <el-table-column header-align="center" label="压车费(调增)" prop="detentionCharge" min-width="140"/>
                <el-table-column header-align="center" label="审核状态" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.auditStatus"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核意见" prop="remark" min-width="200" show-overflow-tooltip/>
                <el-table-column header-align="center" label="审核人" prop="auditStatusUser" min-width="140"/>
                <el-table-column header-align="center" label="审核时间" prop="auditStatusTime" min-width="160"/>
                <el-table-column header-align="center" label="客户" prop="customerName" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="lineName" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="线路类型" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_TYPE" :value="scope.row.lineType"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单属性" min-width="100">
                    <template slot-scope="scope">
                        {{scope.row.tempVehicle? "临时":"正班"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车牌号码" prop="vehicleLicenseNum" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.vehicleLicenseNum}  （${scope.row.specification} 米）`}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="挂厢号码" prop="trailerLicenseNum" min-width="100"/>
                <el-table-column header-align="center" label="车型" prop="specification" min-width="100"/>
                <el-table-column header-align="center" label="车辆属性" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" v-model="scope.row.vehicleNature"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="司机姓名" prop="driverName" min-width="120"/>
                <el-table-column header-align="center" label="司机电话" prop="driverMobile" min-width="120"/>
                <el-table-column header-align="center" label="运单状态" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="WAY_BILL_STATUS" :value="scope.row.status"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="需求时间" prop="demandTime" min-width="160"/>
                <el-table-column header-align="center" label="发车时间" prop="departureTime" min-width="160"/>
                <el-table-column header-align="center" label="实际发车时间" prop="actualDepartureTime" min-width="160"/>
                <el-table-column header-align="center" label="预计到达时间" prop="arrivalTime" min-width="160"/>
                <el-table-column header-align="center" label="实际到达时间" prop="confirmArrivalTime" min-width="160"/>
                <el-table-column header-align="center" label="则一时效" prop="timeConsumeZeyi" min-width="140"/>
                <el-table-column header-align="center" label="是否准点（则一）" prop="onTimeFlag" min-width="140">
                    <template slot-scope="scope">
                        <span v-if="scope.row.onTimeFlag === true">准点</span>
                        <span v-else-if="scope.row.onTimeFlag === false" style="color: red; font-weight: bold;">晚点</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="晚点时长(则一)(分钟)" prop="overTimeMin" min-width="140"></el-table-column>
                 <el-table-column header-align="center" label="客户时效" prop="timeConsume" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="是否准点（客户）" prop="customerOnTimeFlag" min-width="140">
                    <template slot-scope="scope">
                        <span v-if="scope.row.customerOnTimeFlag === true">准点</span>
                        <span v-else-if="scope.row.customerOnTimeFlag === false" style="color: red; font-weight: bold;">晚点</span>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="晚点时长(客户)(分钟)" prop="customerOverTimeMin" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="回单号" prop="receiptCodes" min-width="240" show-overflow-tooltip/>
                <el-table-column header-align="center" label="回单签收状态" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="EQUIPMENT_SIGN_STATUS" v-model="scope.row.receiptStatus"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="油卡签收状态" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="EQUIPMENT_SIGN_STATUS" v-model="scope.row.oilCardStatus"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="GPS签收状态" prop="gpsStatus" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="EQUIPMENT_SIGN_STATUS" v-model="scope.row.gpsStatus"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="left" min-width="240">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED" v-permission="'/waybillPayableDeduct/modify'" type="text" size="mini" icon="el-icon-edit" @click="modifyAdjustment(scope.row)">修改</el-button>
                        <el-button :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED" v-permission="'/waybillPayableDeduct/delete'" type="text" size="mini" icon="el-icon-delete"  @click="deleteAdjustment(scope.row)">撤销</el-button>
                        <el-button v-permission="'/waybillPayableDeduct/selectById'" type="text" size="mini" icon="el-icon-tickets"  @click="AdjustmentDetail(scope.row)">详情</el-button>
                        <el-button :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED" v-permission="'/waybillPayableDeduct/audit'" type="text" size="mini" icon="el-icon-tickets" @click="auditAdjustment(scope.row)">审核</el-button>
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

        <!-- 新增 -->
        <el-dialog title="新增调整申请" :visible.sync="showAddAdjustment" width="50%" @close="resetAddAdjustmentForm">
            <el-form size="small" :model="addAdjustmentForm" ref="addAdjustmentForm" label-width="35%">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="运单编号：" prop="waybillCode" :rules="[Validate.required('运单编号',true),Validate.waybill]">
                            <el-input v-model="addAdjustmentForm.waybillCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-button type="text" size="mini" icon="el-icon-plus" @click="addAdjustmentForm.showAddDialog=true" style="font-weight: bold;">添加</el-button>
                <el-table size="mini" class="content-table" :data="addAdjustmentForm.waybillPayableDeductDetails" border fit highlight-current-row stripe>
                    <el-table-column header-align="center" label="调整项" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="WAYBILL_ADJUSTMENT_TYPE" v-model="scope.row.type"/>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" label="金额" prop="chargeSum" show-overflow-tooltip/>
                    <el-table-column header-align="center" label="原因" prop="remark" show-overflow-tooltip/>
                    <el-table-column header-align="center" align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" icon="el-icon-edit" type="text" style="font-weight: bold;" @click="addModifyDialog(scope.row,scope.$index)">修改</el-button>
                            <el-button size="mini" icon="el-icon-delete" type="text" style="font-weight: bold;" @click="addDeleteRow(scope.row,scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="添加调整项"  :visible.sync="addAdjustmentForm.showAddDialog" width="36%" append-to-body @close="resetAddAddForm">
                    <el-form size="small" :model="addAdjustmentForm.addForm" ref="addAddForm" label-width="120px">
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="调整项：" prop="type" :rules="[{required: true, message:'请选择运单调整项！'}]">
                                    <dictionary-select @change="addAdjustmentForm.addForm.chargeSum = ''" :excludeOptions="['SECURITY_DEDUCTIONS_AMOUNT','QUALITY_AWARD','QUALITY_DEDUCTIONS_AMOUNT']" option-name="WAYBILL_ADJUSTMENT_TYPE" v-model="addAdjustmentForm.addForm.type" style="display: block;"></dictionary-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="金额：" prop="chargeSum" :rules="[{required: true, message:'请输入调整金额！'},money1]">
                                    <el-input v-model="addAdjustmentForm.addForm.chargeSum"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="原因：" prop="remark" :rules="[{required: true, message:'请填写调整原因！'}]">
                                    <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="addAdjustmentForm.addForm.remark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="small" @click="addAdjustmentForm.showAddDialog=false">取 消</el-button>
                        <el-button size="small" type="primary" @click="addAddFormSubmit">确 定</el-button>
                    </span>
                </el-dialog>
                <el-dialog title="修改调整项"  :visible.sync="addAdjustmentForm.showModifyDialog" width="36%" append-to-body>
                    <el-form size="small" :model="addAdjustmentForm.modifyForm" ref="addModifyForm" label-width="120px">
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="调整项：" prop="type" :rules="[{required: true, message:'请选择运单调整项！'}]">
                                    <dictionary-select @change="addAdjustmentForm.modifyForm.chargeSum = ''" :excludeOptions="['SECURITY_DEDUCTIONS_AMOUNT','QUALITY_AWARD','QUALITY_DEDUCTIONS_AMOUNT']" option-name="WAYBILL_ADJUSTMENT_TYPE" v-model="addAdjustmentForm.modifyForm.type" style="display: block;"></dictionary-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="金额：" prop="chargeSum" :rules="[{required: true, message:'请输入调整金额！'},money2]">
                                    <el-input v-model="addAdjustmentForm.modifyForm.chargeSum"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="原因：" prop="remark" :rules="[{required: true, message:'请填写调整原因！'}]">
                                    <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="addAdjustmentForm.modifyForm.remark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="small" @click="addAdjustmentForm.showModifyDialog=false">取 消</el-button>
                        <el-button size="small" type="primary" @click="addModifyFormSubmit">确 定</el-button>
                    </span>
                </el-dialog>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAddAdjustment = false">取 消</el-button>
                <el-button :disabled="addBtnDisabled" size="small" type="primary" @click="addAdjustmentSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="修改调整申请" :visible.sync="showModifyAdjustment" width="50%">
            <el-form size="small" :model="modifyAdjustmentForm" ref="modifyAdjustmentForm" label-width="35%">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="运单编号：">
                            {{modifyAdjustmentForm.waybillCode}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-button type="text" size="mini" icon="el-icon-plus" @click="modifyAdjustmentForm.showAddDialog=true" style="font-weight: bold;">添加</el-button>
                <el-table size="mini" class="content-table" :data="modifyAdjustmentForm.waybillPayableDeductDetails" border fit highlight-current-row stripe>
                    <el-table-column header-align="center" label="调整项" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="WAYBILL_ADJUSTMENT_TYPE" v-model="scope.row.type"/>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" label="金额" prop="chargeSum" show-overflow-tooltip/>
                    <el-table-column header-align="center" label="原因" prop="remark" show-overflow-tooltip/>
                    <el-table-column header-align="center" align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" icon="el-icon-edit" type="text" style="font-weight: bold;" @click="modifyModifyDialog(scope.row,scope.$index)">修改</el-button>
                            <el-button size="mini" icon="el-icon-delete" type="text" style="font-weight: bold;" @click="modifyDeleteRow(scope.row,scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="添加调整项"  :visible.sync="modifyAdjustmentForm.showAddDialog" width="36%" append-to-body @close="resetModifyAddForm">
                    <el-form size="small" :model="modifyAdjustmentForm.addForm" ref="modifyAddForm" label-width="120px">
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="调整项：" prop="type" :rules="[{required: true, message:'请选择运单调整项！'}]">
                                    <dictionary-select @change="modifyAdjustmentForm.addForm.chargeSum = ''" :excludeOptions="['SECURITY_DEDUCTIONS_AMOUNT','QUALITY_AWARD','QUALITY_DEDUCTIONS_AMOUNT']" option-name="WAYBILL_ADJUSTMENT_TYPE" v-model="modifyAdjustmentForm.addForm.type" style="display: block;"></dictionary-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="金额：" prop="chargeSum" :rules="[{required: true, message:'请输入调整金额！'},money3]">
                                    <el-input v-model="modifyAdjustmentForm.addForm.chargeSum"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="原因：" prop="remark" :rules="[{required: true, message:'请填写调整原因！'}]">
                                    <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="modifyAdjustmentForm.addForm.remark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="small" @click="modifyAdjustmentForm.showAddDialog=false">取 消</el-button>
                        <el-button size="small" type="primary" @click="modifyAddFormSubmit">确 定</el-button>
                    </span>
                </el-dialog>
                <el-dialog title="修改调整项"  :visible.sync="modifyAdjustmentForm.showModifyDialog" width="36%" append-to-body>
                    <el-form size="small" :model="modifyAdjustmentForm.modifyForm" ref="modifyModifyForm" label-width="120px">
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="调整项：" prop="type" :rules="[{required: true, message:'请选择运单调整项！'}]">
                                    <dictionary-select @change="modifyAdjustmentForm.modifyForm.chargeSum = ''" :excludeOptions="['SECURITY_DEDUCTIONS_AMOUNT','QUALITY_AWARD','QUALITY_DEDUCTIONS_AMOUNT']" option-name="WAYBILL_ADJUSTMENT_TYPE" v-model="modifyAdjustmentForm.modifyForm.type" style="display: block;"></dictionary-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="金额：" prop="chargeSum" :rules="[{required: true, message:'请输入调整金额！'},money4]">
                                    <el-input v-model="modifyAdjustmentForm.modifyForm.chargeSum"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                <el-form-item label="原因：" prop="remark" :rules="[{required: true, message:'请填写调整原因！'}]">
                                    <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="modifyAdjustmentForm.modifyForm.remark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="small" @click="modifyAdjustmentForm.showModifyDialog=false">取 消</el-button>
                        <el-button size="small" type="primary" @click="modifyModifyFormSubmit">确 定</el-button>
                    </span>
                </el-dialog>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showModifyAdjustment = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyAdjustmentSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog title="查看调整申请" :visible.sync="showAdjustmentDetail" width="50%">
            <el-form size="small" :model="detailAdjustmentForm" label-width="35%">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="运单编号：">
                            {{detailAdjustmentForm.waybillCode}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-table size="mini" class="content-table" :data="detailAdjustmentForm.waybillPayableDeductDetails" border fit highlight-current-row stripe>
                    <el-table-column header-align="center" label="调整项" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="WAYBILL_ADJUSTMENT_TYPE" v-model="scope.row.type"/>
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" label="金额" prop="chargeSum" show-overflow-tooltip/>
                    <el-table-column header-align="center" label="原因" prop="remark" show-overflow-tooltip/>
                </el-table>
            </el-form>
        </el-dialog>

        <!-- 审核 -->
        <el-dialog title="审核" :visible.sync="showAuditAdjustment" width="35%" @close="resetAuditAdjustmentForm">
            <el-form size="small" :model="auditAdjustmentForm" ref="auditAdjustmentForm" label-width="25%">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="审核状态：">
                            <el-switch v-model="auditAdjustmentForm.auditStatus" active-color="#13ce66" inactive-color="#ff4949"
                                       :active-value="Constant.AUDIT_STATUS.PASS" :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                       active-text="同意" inactive-text="拒绝"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="22">
                        <el-form-item label="审核意见：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="auditAdjustmentForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAuditAdjustment = false">取 消</el-button>
                <el-button size="small" type="primary" @click="auditAdjustmentSubmit">确 定</el-button>
            </span>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http,Api,Validate,Common,Constant} from 'src/global'
    import axios from 'axios'

    export default {
        data() {
            return {
                initializeModel:{},
                Validate: Validate,
                Constant: Constant,
                Api: Api,
                isLoading: true,
                showAddAdjustment: false,//新增申请
                showModifyAdjustment: false,//修改申请
                showAdjustmentDetail: false,//申请详情
                showAuditAdjustment: false,//审核弹框
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',//运单号
                    auditStatus: 'UNAUDITED',//状态
                    createTimeStart: Common.date.dateFormat(new Date(new Date().getTime() - 30*24*3600*1000),"YYYY-MM-DD 00:00:00"),
                    createTimeEnd: Common.date.dateFormat(new Date(),"YYYY-MM-DD 23:59:59"),
                    receiptCode: '',
                    orgCode: '',//所属区域
                    vehicleNature: '',//车辆性质
                    lineId: '',
                    createUser: '',
                    auditStatusUser: '',
                    vehicleCode:''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                ids: [],//要审核行的id
                addAdjustmentForm: {
                    waybillCode: '',
                    waybillPayableDeductDetails:[],
                    showAddDialog: false,//添加调整项
                    addForm:{
                        type:'',
                        chargeSum:'',
                        remark:''
                    },
                    showModifyDialog: false,//修改调整项
                    modifyForm:{
                        type:'',
                        chargeSum:'',
                        remark:''
                    }
                },
                addBtnDisabled: false,
                modifyAdjustmentForm: {
                    id: '',
                    waybillCode: '',
                    waybillPayableDeductDetails:[],
                    showAddDialog: false,//添加调整项
                    addForm:{
                        type:'',
                        chargeSum:'',
                        remark:''
                    },
                    showModifyDialog: false,//修改调整项
                    modifyForm:{
                        index: '',
                        type:'',
                        chargeSum:'',
                        remark:''
                    }
                },
                detailAdjustmentForm: {
                    waybillCode: '',
                    waybillPayableDeductDetails:[]
                },
                auditAdjustmentForm: {
                    auditStatus: Constant.AUDIT_STATUS.PASS,
                    remark: ''
                },
                //导出功能
                btnLoading: true,
                downloading: true,
            }
        },
        computed:{
            money1:function(){
                if(this.addAdjustmentForm.addForm.type === 'QUALITY_DEDUCTIONS_AMOUNT' || this.addAdjustmentForm.addForm.type === 'QUALITY_AWARD'){
                    return {pattern: /^(([1-9]\d{0,7})|0)(\.\d{1,2})?$/, message: '请输入正确的金额!不能小于0'}
                }else{
                    return Validate.allMoney
                }
            },
            money2:function(){
                if(this.addAdjustmentForm.modifyForm.type === 'QUALITY_DEDUCTIONS_AMOUNT' || this.addAdjustmentForm.modifyForm.type === 'QUALITY_AWARD'){
                    return {pattern: /^(([1-9]\d{0,7})|0)(\.\d{1,2})?$/, message: '请输入正确的金额!不能小于0'}
                }else{
                    return Validate.allMoney
                }
            },
            money3:function(){
                if(this.modifyAdjustmentForm.addForm.type === 'QUALITY_DEDUCTIONS_AMOUNT' || this.modifyAdjustmentForm.addForm.type === 'QUALITY_AWARD'){
                    return {pattern: /^(([1-9]\d{0,7})|0)(\.\d{1,2})?$/, message: '请输入正确的金额!不能小于0'}
                }else{
                    return Validate.allMoney
                }
            },
            money4:function(){
                if(this.modifyAdjustmentForm.modifyForm.type === 'QUALITY_DEDUCTIONS_AMOUNT' || this.modifyAdjustmentForm.modifyForm.type === 'QUALITY_AWARD'){
                    return {pattern: /^(([1-9]\d{0,7})|0)(\.\d{1,2})?$/, message: '请输入正确的金额!不能小于0'}
                }else{
                    return Validate.allMoney
                }
            }
        },
        created() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data)
            this.searchList();
        },
        methods: {
            cloneModel(){
                return _.cloneDeep(this.initializeModel)
            },
            resetSearchParam() {//重置参数
                this.searchParam = this.cloneModel().searchParam
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.waybillPayableDeduct.page,{ params : vm.searchParam }, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
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
            addAdjustment(){//新增窗口--显示添加form
                let vm = this;
                vm.showAddAdjustment = true;
            },
            addAddFormSubmit(){//新增窗口--新增行提交
                let vm = this;
                vm.$refs.addAddForm.validate((valid)=>{
                    if(valid){
                        vm.addAdjustmentForm.waybillPayableDeductDetails.push(_.cloneDeep(vm.addAdjustmentForm.addForm));
                        vm.addAdjustmentForm.showAddDialog = false;
                    }
                });
            },
            addModifyDialog(row,index){//新增窗口--显示修改form
                this.addAdjustmentForm.showModifyDialog = true;
                this.addAdjustmentForm.modifyForm = _.cloneDeep(row);
                this.addAdjustmentForm.modifyForm.index = index;
            },
            addModifyFormSubmit(){//新增窗口--修改行提交
                let vm = this;
                vm.$refs.addModifyForm.validate((valid)=>{
                    if(valid){
                        vm.addAdjustmentForm.waybillPayableDeductDetails.splice(vm.addAdjustmentForm.modifyForm.index, 1, vm.addAdjustmentForm.modifyForm)
                        vm.addAdjustmentForm.showModifyDialog = false;
                    }
                });
            },
            addDeleteRow(row,index){//新增窗口--删除行
                this.addAdjustmentForm.waybillPayableDeductDetails.splice(index,1);
            },
            resetAddAddForm(){
                this.addAdjustmentForm.addForm.type = '';
                this.addAdjustmentForm.addForm.chargeSum = '';
                this.addAdjustmentForm.addForm.remark = '';
            },
            addAdjustmentSubmit(){//提交新增--关闭新增窗口
                let vm = this;
                vm.$refs.addAdjustmentForm.validate((valid)=>{
                    if(valid){
                        if(vm.addAdjustmentForm.waybillPayableDeductDetails.length==0){
                            vm.$message.info('请添加运单调整信息！');
                            return
                        }
                        vm.addBtnDisabled = true;
                        Http.post(Api.waybillPayableDeduct.add,vm.addAdjustmentForm, result => {
                            vm.showAddAdjustment = false;
                            vm.$message.success('调整申请已提交！');
                            vm.searchList();
                            vm.addBtnDisabled = false;
                        }, error =>{
                            vm.addBtnDisabled = false;
                        })
                    }
                });
            },
            resetAddAdjustmentForm(){
                let vm = this;
                vm.addAdjustmentForm.waybillCode = '';
                vm.addAdjustmentForm.waybillPayableDeductDetails = [];
            },
            modifyAdjustment(row){
                let vm = this;
                Http.get(Api.waybillPayableDeduct.selectById,{params: {'id': row.id}}, result => {
                    _.merge(vm.modifyAdjustmentForm,result.result);
                    vm.modifyAdjustmentForm.waybillCode = result.result.waybillCode;
                    vm.modifyAdjustmentForm.waybillPayableDeductDetails = result.result.waybillPayableDeductDetails;
                    vm.showModifyAdjustment = true;
                })
            },
            modifyAddFormSubmit(){//修该窗口--新增行提交
                let vm = this;
                vm.$refs.modifyAddForm.validate((valid)=>{
                    if(valid){
                        vm.modifyAdjustmentForm.waybillPayableDeductDetails.push(_.cloneDeep(vm.modifyAdjustmentForm.addForm));
                        vm.modifyAdjustmentForm.showAddDialog = false;
                    }
                });
            },
            modifyModifyDialog(row,index){//修改窗口--显示修改form
                this.modifyAdjustmentForm.showModifyDialog = true;
                this.modifyAdjustmentForm.modifyForm = _.cloneDeep(row);
                this.modifyAdjustmentForm.modifyForm.index = index;
            },
            modifyModifyFormSubmit(){//修改窗口--修改行提交
                let vm = this;
                vm.$refs.modifyModifyForm.validate((valid)=>{
                    if(valid){
                        vm.modifyAdjustmentForm.waybillPayableDeductDetails.splice(vm.modifyAdjustmentForm.modifyForm.index, 1, vm.modifyAdjustmentForm.modifyForm)
                        vm.modifyAdjustmentForm.showModifyDialog = false;
                    }
                });
            },
            modifyDeleteRow(row,index){//修改窗口--删除行
                this.modifyAdjustmentForm.waybillPayableDeductDetails.splice(index,1);
            },
            resetModifyAddForm(){
                this.modifyAdjustmentForm.addForm.type = '';
                this.modifyAdjustmentForm.addForm.chargeSum = '';
                this.modifyAdjustmentForm.addForm.remark = '';
            },
            //---
            modifyAdjustmentSubmit(){//提交修改--关闭修改窗口
                let vm = this;
                vm.$refs.modifyAdjustmentForm.validate((valid)=>{
                    if(valid){
                        if(vm.modifyAdjustmentForm.waybillPayableDeductDetails.length==0){
                            vm.$message.info('运单调整信息不能为空！');
                            return
                        }
                        Http.post(Api.waybillPayableDeduct.add,vm.modifyAdjustmentForm, result => {
                            vm.showModifyAdjustment = false;
                            vm.$message.success('修改成功！');
                            vm.searchList();
                        })
                    }
                });
            },
            auditAdjustment(row){
                let vm = this;
                vm.ids = [row.id];
                vm.showAuditAdjustment = true;//普通审批
            },
            auditAdjustmentSubmit(){//普通审批
                let vm = this;
                Http.post(Api.waybillPayableDeduct.audit,{'ids':vm.ids,'auditStatus':vm.auditAdjustmentForm.auditStatus,'remark':vm.auditAdjustmentForm.remark}, result => {
                    vm.showAuditAdjustment = false;
                    vm.$message.success('审批成功！');
                    vm.searchList();
                })
            },
            resetAuditAdjustmentForm(){
                let vm = this;
                vm.auditAdjustmentForm.auditStatus = Constant.AUDIT_STATUS.PASS;
                vm.auditAdjustmentForm.remark = '';
                vm.ids = [];
            },
            deleteAdjustment(row){ // 清除---------------------------------
                let vm = this;
                let ids = [];
                ids.push(row.id)
                vm.$confirm('撤销本条数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.waybillPayableDeduct.delete, ids, result => {
                        vm.$message.success('申请撤销成功！');
                        vm.searchList();
                    })
                })
            },
            AdjustmentDetail(row){
                let vm = this;
                Http.get(Api.waybillPayableDeduct.selectById,{params: {'id': row.id}}, result => {
                    _.merge(vm.detailAdjustmentForm,result.result);
                    vm.detailAdjustmentForm.waybillCode = result.result.waybillCode;
                    vm.detailAdjustmentForm.waybillPayableDeductDetails = result.result.waybillPayableDeductDetails;
                    vm.showAdjustmentDetail = true;
                })
            },
            //导出功能
            exportData(){
                let vm = this;
                vm.btnLoading = false;
                axios.get(Api.waybillPayableDeduct.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '运单调整记录.xls';
                    link.click();
                    vm.btnLoading = true;
                }).catch(reason => {
                    vm.btnLoading = true;
                })
            },
            //模板下载
            templateDownload() {
                this.downloading = false;
                Common.excel.downloadExl([], ["运单号","其它扣款(调减)","扣款备注"], null, '运单调整模板');
                this.downloading = true;
            },
            uploadSuccess() {
                this.searchList();
            },
        }
    }
</script>

