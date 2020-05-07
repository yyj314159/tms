<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 运单管理</el-breadcrumb-item>
                <el-breadcrumb-item>时效扣款</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="130px">
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
                    <el-col :span="12">
                        <el-form-item label="申请时间:">
                            <el-date-picker
                                v-model="searchParam.createTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="回单号:">
                            <el-input v-model="searchParam.receiptCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="false">
                        <el-form-item label="登录人区域:">
                            <current-org-select v-model="searchParam.currentOrgCode" style="display: block"></current-org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆属性:">
                            <dictionary-select v-model="searchParam.vehicleNature" style="display:block" option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="searchParam.lineId" style="display:block"></line-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="发车开始时间:">
                            <date-picker-single v-model="searchParam.startActualDepartureTime" date-type="start" :end-date="searchParam.endActualDepartureTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="发车结束时间:">
                            <date-picker-single v-model="searchParam.endActualDepartureTime" date-type="end" :start-date="searchParam.startActualDepartureTime" max-range-days="90"></date-picker-single>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode"style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleLicenseNum" style="display:block"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" v-permission="'/waybillTimeFine/add'" @click="addAdjustment">新增</el-button>
            <el-button v-if="btnLoading" v-permission="'/waybillTimeFine/export'" size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit ref="multipleTable" highlight-current-row stripe>
                <el-table-column header-align="center" label="运单号" min-width="130">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="所属大区" prop="regionName" min-width="140"/>
                <el-table-column header-align="center" label="所属分区" prop="belongOrgName" min-width="140"/>
                <el-table-column header-align="center" label="申请人" prop="createUser" min-width="140"/>
                <el-table-column header-align="center" label="申请时间" prop="createTime" min-width="160" show-overflow-tooltip/>
                <el-table-column header-align="center" label="时效扣款(调减)" prop="qualityDeductionsAmount" min-width="140"/>
                <el-table-column header-align="center" label="备注原因" prop="remarkReasons" min-width="140"/>
                <el-table-column header-align="center" label="审核状态" min-width="140">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.auditStatus"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核意见" prop="remark" min-width="200" show-overflow-tooltip/>
                <el-table-column header-align="center" label="审核人" prop="auditStatusUser" min-width="140"/>
                <el-table-column header-align="center" label="审核时间" prop="auditStatusTime" min-width="160"/>
                <el-table-column header-align="center" label="客户" min-width="140">
                    <template slot-scope="scope">
                        {{scope.row.customerName}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="lineName" min-width="200" show-overflow-tooltip/>
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
                <el-table-column align="center" label="操作" fixed="left" min-width="280">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED || scope.row.systemGeneration" v-permission="'/waybillTimeFine/modify'" type="text" size="mini" icon="el-icon-edit" @click="modifyAdjustment(scope.row)">修改</el-button>
                        <el-button :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED || scope.row.systemGeneration" v-permission="'/waybillTimeFine/delete'" type="text" size="mini" icon="el-icon-delete"  @click="deleteAdjustment(scope.row)">撤销</el-button>
                        <el-button v-permission="'/waybillTimeFine/selectById'" type="text" size="mini" icon="el-icon-tickets"  @click="AdjustmentDetail(scope.row)">详情</el-button>
                        <el-button :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED" v-permission="'/waybillTimeFine/audit'" type="text" size="mini" icon="el-icon-tickets" @click="auditAdjustment(scope.row)">审核</el-button>
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
        <el-dialog title="新增时效扣款申请" :visible.sync="showAdd" width="55%" @close="resetAddForm">
            <el-form size="small" :model="addForm" ref="addForm" label-width="140px">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="运单编号：" prop="waybillCode" :rules="[Validate.required('运单编号',true),Validate.waybill]">
                            <el-input v-model="addForm.waybillCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="时效扣款金额：" prop="chargeSum" :rules="[{required: true, message:'请输入调整金额！'},{pattern: /^(([1-9]\d{0,7})|0)(\.\d{1,2})?$/, message: '请输入正确的金额!不能小于0'}]">
                            <el-input v-model="addForm.chargeSum"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注原因：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="addForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAdd = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addFormSubmit" :disabled="addBtnDisabled">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="修改时效扣款申请" :visible.sync="showModify" width="55%">
            <el-form size="small" :model="modifyForm" ref="modifyForm" label-width="140px">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="运单编号：">
                            {{modifyForm.waybillCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="时效扣款金额：" prop="chargeSum" :rules="[{required: true, message:'请输入扣款金额！'},{pattern: /^(([1-9]\d{0,7})|0)(\.\d{1,2})?$/, message: '请输入正确的扣款金额!不能小于0'}]">
                            <el-input v-model="modifyForm.chargeSum"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注原因：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="modifyForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showModify = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog title="查看时效扣款申请" :visible.sync="showDetail" width="55%">
            <el-form size="small" :model="detailForm" label-width="140px">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="运单编号：">
                            {{detailForm.waybillCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="时效扣款金额：">
                            {{detailForm.chargeSum}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="备注原因：">
                            {{detailForm.remark}}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>

        <!-- 审核 -->
        <el-dialog title="时效扣款审核" :visible.sync="showAudit" width="35%" @close="resetAuditForm">
            <el-form size="small" :model="auditForm" ref="auditForm" label-width="25%">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="审核状态：">
                            <el-switch v-model="auditForm.auditStatus"
                                       active-color="#13ce66"
                                       inactive-color="#ff4949"
                                       :active-value="Constant.AUDIT_STATUS.PASS"
                                       :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                       active-text="同意"
                                       inactive-text="拒绝"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="22">
                        <el-form-item label="审核意见：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="auditForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAudit = false">取 消</el-button>
                <el-button size="small" type="primary" @click="auditFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 系统生成时效扣款审核 -->
        <el-dialog title="时效扣款审核" :visible.sync="showTimefineAudit" width="75%" @close="resetTimefineAuditForm">
            <el-form size="small" :model="timefineAuditForm" ref="timefineAuditForm" label-width="150px">
                <el-tabs v-model="activeTabName">
                    <el-tab-pane label="跟踪记录" name="first">
                        <el-table size="mini" class="content-table" :data="waybillTrackList" element-loading-text="拼命加载中" border
                                  fit highlight-current-row stripe>
                            <el-table-column header-align="center" prop="trackUser" label="跟踪人" min-width="120"/>
                            <el-table-column header-align="center" prop="trackTime" label="跟踪时间" min-width="140"/>
                            <el-table-column header-align="center" label="跟踪方式" min-width="120">
                                <template slot-scope="scope">
                                    <dictionary-select-name option-name="TRACK_TYPE" v-model="scope.row.trackType"/>
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" label="是否正常" min-width="80">
                                <template slot-scope="scope">
                                    {{scope.row.normalFlag?'是':'否'}}
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" label="异常类型" min-width="80" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <dictionary-select-name option-name="EXCEPTION_TYPE" v-model="scope.row.exceptionType"/>
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" label="异常图片" min-width="100">
                                <template slot-scope="scope">
                                    <show-image :url="scope.row.exceptionAttachment"></show-image>
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" prop="remark" label="备注" min-width="200" show-overflow-tooltip/>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="司机上报" name="second">
                        <el-table size="small" class="content-table" :data="waybillExceptionList" element-loading-text="拼命加载中" border
                                  fit highlight-current-row stripe>
                            <el-table-column header-align="center" label="异常类型" min-width="120">
                                <template slot-scope="scope">
                                    <dictionary-select-name option-name="EXCEPTION_TYPE" v-model="scope.row.type"/>
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" prop="address" label="异常地点" min-width="180" show-overflow-tooltip/>
                            <el-table-column header-align="center" prop="" label="异常时间" min-width="280">
                                <template slot-scope="scope">
                                    {{scope.row. exceptionStartTime}} &nbsp;&nbsp;&nbsp;&nbsp;至 &nbsp;&nbsp;&nbsp;&nbsp;{{scope.row.exceptionEndTime}} &nbsp;&nbsp;&nbsp;&nbsp;
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" label="现场照片" min-width="100">
                                <template slot-scope="scope">
                                    <show-image :url="scope.row.attachment"/>
                                </template>
                            </el-table-column>
                            <el-table-column header-align="center" prop="remark" label="备注" min-width="180" show-overflow-tooltip/>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
                <el-row style="margin-top: 15px;">
                    <el-col :span="8">
                        <el-form-item label="时效扣款（调减）：" prop="qualityDeductionsAmount" :rules="[{required:true,message:'请输入扣款金额！'},Validate.money]">
                            <el-input v-model="timefineAuditForm.qualityDeductionsAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="审核意见：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="timefineAuditForm.remark"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showTimefineAudit = false">取 消</el-button>
                <el-button size="small" type="primary" @click="timefineAuditFormSubmit">确 定</el-button>
            </span>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http,Api,Validate,Common,Constant} from 'src/global'
    import axios from 'axios';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                initializeModel:{},
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                searchParam: {//查询参数
                    customerCode:'',
                    vehicleLicenseNum:'',
                    currentPage: 1,
                    pageSize: 10,
                    waybillCode: '',//运单号
                    auditStatus: 'UNAUDITED',//状态
                    createTime: [],//创建时间
                    createTimeStart: '',
                    createTimeEnd: '',
                    receiptCode: '',
                    orgCode: '',//所属区域
                    currentOrgCode: this.$store.getters.user.orgCode,//当前登录人所属区域
                    vehicleNature: '',//车辆性质
                    lineId: '',
                    startActualDepartureTime: '',
                    endActualDepartureTime: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //新增申请
                showAdd: false,
                addForm: {
                    waybillCode: '',
                    type:'QUALITY_DEDUCTIONS_AMOUNT',
                    chargeSum:'',
                    remark:''
                },
                addBtnDisabled: false,
                //导出
                btnLoading: true,
                //修改申请
                showModify: false,
                modifyForm: {
                    id: '',
                    waybillCode: '',
                    type:'QUALITY_DEDUCTIONS_AMOUNT',
                    chargeSum:'',
                    remark:''
                },
                //查看详情
                showDetail: false,
                detailForm: {
                    waybillCode: '',
                    type:'',
                    chargeSum:'',
                    remark:''
                },
                //审核-普通审核
                showAudit: false,
                auditForm: {
                    id:'',
                    auditStatus: Constant.AUDIT_STATUS.PASS,
                    remark: ''
                },
                //系统生成时效扣款审核
                showTimefineAudit: false,
                timefineAuditForm: {
                    id: '',
                    qualityDeductionsAmount:'',
                    remark: ''
                },
                waybillTrackList: [],
                waybillExceptionList: [],
                activeTabName: 'first'
            }
        },
        created() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            this.searchList();
        },
        computed: {
            ...mapGetters([
                'user'
            ]),
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
                if(vm.searchParam.createTime){
                    vm.searchParam.createTimeStart = vm.searchParam.createTime[0];
                    vm.searchParam.createTimeEnd = vm.searchParam.createTime[1];
                }else{
                    vm.searchParam.createTimeStart = "";
                    vm.searchParam.createTimeEnd = "";
                }
                Http.get(Api.waybillTimeFine.timeFinePage,{ params : vm.searchParam }, result => {
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
            //新增
            addAdjustment(){
                let vm = this;
                vm.showAdd = true;
            },
            addFormSubmit(){
                let vm = this;
                let form = {
                    waybillCode : vm.addForm.waybillCode,
                    waybillPayableDeductDetails:[]
                };
                form.waybillPayableDeductDetails[0] = vm.addForm
                vm.$refs.addForm.validate((valid)=>{
                    if(valid){
                        vm.addBtnDisabled = true;
                        Http.post(Api.waybillTimeFine.add,form, result => {
                            vm.showAdd = false;
                            vm.$message.success('调整申请已提交！');
                            vm.searchList();
                            vm.addBtnDisabled = false;
                        }, reson => {
                            vm.addBtnDisabled = false;
                        })
                    }
                });
            },
            resetAddForm(){
                this.addForm = this.cloneModel().addForm
            },
            //导出
            exportData() {
                let vm = this;
                vm.btnLoading = false;
                axios.get(Api.waybillTimeFine.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = "时效扣款记录表" + '.xls';
                    link.click();
                    vm.btnLoading = true;
                }).catch(reason => {
                    vm.btnLoading = true;
                })

            },
            //修改
            modifyAdjustment(row){
                let vm = this;
                Http.get(Api.waybillTimeFine.selectById,{params: {'id': row.id}}, result => {
                    if(result.result){
                        vm.modifyForm = {
                            id: result.result.id,
                            waybillCode: result.result.waybillCode,
                            type:'QUALITY_DEDUCTIONS_AMOUNT',
                            chargeSum:result.result.waybillPayableDeductDetails[0].chargeSum,
                            remark:result.result.waybillPayableDeductDetails[0].remark
                        };
                        vm.showModify = true;
                    }

                })
            },
            modifyFormSubmit(){
                let vm = this;
                vm.$refs.modifyForm.validate((valid)=>{
                    if(valid){
                        let form = {
                            id:vm.modifyForm.id,
                            waybillCode : vm.modifyForm.waybillCode,
                            waybillPayableDeductDetails:[]
                        };
                        form.waybillPayableDeductDetails[0] = vm.modifyForm;
                        Http.post(Api.waybillTimeFine.add,form, result => {
                            vm.showModify = false;
                            vm.$message.success('修改成功！');
                            vm.searchList();
                        })
                    }
                });
            },
            //撤销申请
            deleteAdjustment(row){
                let vm = this;
                let ids = [];
                ids.push(row.id);
                vm.$confirm('撤销本条数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.waybillTimeFine.delete, ids, result => {
                        vm.$message.success('申请撤销成功！');
                        vm.searchList();
                    })
                })
            },
            //申请详情
            AdjustmentDetail(row){
                let vm = this;
                Http.get(Api.waybillTimeFine.selectById,{params: {'id': row.id}}, result => {
                   vm.detailForm = {
                        id: result.result.id,
                        waybillCode: result.result.waybillCode,
                        type:'QUALITY_DEDUCTIONS_AMOUNT',
                        chargeSum:result.result.waybillPayableDeductDetails[0].chargeSum,
                        remark:result.result.waybillPayableDeductDetails[0].remark
                    };
                    vm.showDetail = true;
                })
            },
            //审核
            auditAdjustment(row){
                let vm = this;
                if(row.systemGeneration){//进入系统生成时效扣款审核
                    vm.timefineAuditForm.qualityDeductionsAmount = row.qualityDeductionsAmount;
                    Http.get(Api.waybillTrack.getByWaybillCode,{params: {'waybillCode': row.waybillCode}}, result => {//查询--客服跟踪列表
                        vm.waybillTrackList = result.result;
                    });
                    Http.get(Api.waybillException.getByWaybillCode,{params: {'waybillCode': row.waybillCode}}, result => {
                        vm.waybillExceptionList = result.result;
                    });
                    vm.timefineAuditForm.id = row.id;
                    vm.showTimefineAudit = true;
                }else{//进入普通审核
                    vm.auditForm.id = row.id;
                    vm.showAudit = true;
                }
            },
            auditFormSubmit(){//普通审核
                let vm = this;
                let ids = [];
                ids.push(vm.auditForm.id);
                Http.post(Api.waybillTimeFine.audit,{'ids':ids,'auditStatus':vm.auditForm.auditStatus,'remark':vm.auditForm.remark}, result => {
                    vm.showAudit = false;
                    vm.$message.success('审批成功！');
                    vm.searchList();
                })
            },
            resetAuditForm(){
                let vm = this;
                vm.auditForm = this.cloneModel().auditForm;
            },
            timefineAuditFormSubmit(){//系统生成的时效审批
                let vm = this;
                vm.$refs.timefineAuditForm.validate((valid)=>{
                    if(valid){
                        Http.post(Api.waybillTimeFine.auditSystemGeneration,vm.timefineAuditForm, result => {
                            vm.showTimefineAudit = false;
                            vm.$message.success('审批成功！');
                            vm.searchList();
                        })
                    }
                })
            },
            resetTimefineAuditForm(){
                this.timefineAuditForm = this.cloneModel().timefineAuditForm;
                this.waybillTrackList = [];
                this.waybillExceptionList = [];
            }
        }
    }
</script>

