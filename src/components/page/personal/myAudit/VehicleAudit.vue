<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 我的审批</el-breadcrumb-item>
                <el-breadcrumb-item>车辆证件审批</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="申请人:">
                            <user-select v-model="searchParam.applyUser" style="display:block;"></user-select>
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
                                v-model="searchParam.applyTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width:100%"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select  v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆性质:">
                            <dictionary-select style="display: block" v-model="searchParam.operationMode"
                                               option-name="VEHICLE_OPERATION_MODE" :excludeOptions="['OUT_INVITE']"/>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" level="lowest" auditStatus="PASS"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出发站点:">
                            <station-select v-model="searchParam.departStationCode" auditStatus="PASS" style="display:block;"></station-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的站点:">
                            <station-select v-model="searchParam.destStationCode" auditStatus="PASS"  style="display:block;"></station-select>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                <el-row>
                    <el-col :span="24" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-download" @click="exportForTable"
                       v-permission="'/vehicleAudit/export'">导出
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="车辆编号" prop="vehicleCode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车牌号" prop="licenseNumber" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="营运证注册日期" prop="operatingRegisterDate" min-width="260" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="营运证有效日期" prop="operatingEffectiveDate" min-width="260" show-overflow-tooltip></el-table-column>
                <el-table-column label="车辆性质" header-align="center" prop="operationMode" width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE" :value="scope.row.operationMode"/>
                    </template>
                </el-table-column>
                <!-- 因为数据字典中存在的值不全，所以直接显示code -->
                <el-table-column header-align="center" label="行驶证拥有者" prop="ownerCode" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="车辆类型" prop="vehicleType" min-width="240" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="HEAD_VEHICLE_TYPE,SEMITRAILER_VEHICLE_TYPE" :value="scope.row.vehicleType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="品牌型号" prop="brandType" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SEMITRAILER_VEHICLE_BRAND,HEAD_VEHICLE_BRAND" :value="scope.row.brandType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="车辆识别代号" prop="vehicleNumber" min-width="180" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column header-align="center" label="车辆识别代号" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_TYPE" :value="scope.row.lineType"></dictionary-select-name>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column header-align="center" label="营运类型" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_OPERATION_TYPE" :value="scope.row.operationType"></dictionary-select-name>
                    </template>
                </el-table-column> -->
                <el-table-column header-align="center" label=" 发动机编号" prop="engineCode" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="外廓尺寸" prop="outLineSize" min-width="120" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column header-align="center" label="客户时效" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.timeHour || 0}时${scope.row.timeMin || 0}分`}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="则一时效" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{`${scope.row.timeZeyiHour || 0}时${scope.row.timeZeyiMin || 0}分`}}
                    </template>
                </el-table-column> -->
                <!-- <el-table-column header-align="center" label="考核方式" prop="evaluationMode" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_EVALUATION_MODE" :value="scope.row.evaluationMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="是否共建线路" prop="togetherFlag" min-width="120">
                    <template slot-scope="scope">
                        {{scope.row.togetherFlag ? "是" : "否"}}
                    </template>
                </el-table-column> -->
                <el-table-column header-align="center" label="行驶证注册日期" prop="licenseRegisterDate" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="行驶证有效日期" prop="licenseEffectiveDate" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="核定装载质量" prop="loadMass" min-width="140" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column header-align="center" label="申请类型" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_TYPE" v-model="scope.row.auditType"></dictionary-select-name>线路
                    </template>
                </el-table-column> -->
                <el-table-column header-align="center" label=" 挂车尺寸" prop="trailerLength" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="TRAILER_SIZE"
                                                :value="scope.row.trailerLength"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="申请人" prop="applyUser" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="申请人组织" prop="applyOrg.name" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="申请时间" prop="applyTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核状态" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS" v-model="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="审核人" prop="auditUser" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核人组织" prop="auditOrg.name" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核意见" prop="auditRemark" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="审核时间" prop="auditTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" fixed="left" align="center" label="操作" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/vehicleCertAudit/audit'"  :disabled="scope.row.auditStatus !== Constant.AUDIT_STATUS.UNAUDITED" icon="el-icon-tickets" size="mini" @click="showAuditWindow(scope.row)">审批</el-button>
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

        <!-- 审核申请内容 -->
        <el-dialog :title="title"  :visible.sync="showAuditDetail" width="75%" @close="resetAuditForm" :top="marginTop" id="AuditDetail">
            <el-form :model="vehicleDetailForm"
                     ref="certificatesManageWinForm"
                     label-width="120px" size="small">
                <el-card class="box-card" body-style="padding:0px;" style="width: 100%; ">
                    <div slot="header" class="clearfix">
                        <span>行驶证</span>
                    </div>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="附件:" prop="licenseAttachment">
                                <show-image-t :url="vehicleDetailForm.licenseAttachment" class1="preImg"></show-image-t>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所有人:" prop="ownerCode">
                                {{vehicleDetailForm.ownerCode}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="车辆类型:" prop="vehicleType">
                                <dictionary-select-name option-name="SEMITRAILER_VEHICLE_TYPE,HEAD_VEHICLE_TYPE"
                                                            :value="vehicleDetailForm.vehicleType"/>
                                </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="品牌型号:" prop="brandType">
                                <dictionary-select-name option-name="SEMITRAILER_VEHICLE_BRAND,HEAD_VEHICLE_BRAND"
                                                            :value="vehicleDetailForm.brandType"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="车辆识别代码:" prop="vehicleNumber">
                                {{vehicleDetailForm.vehicleNumber}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="发动机号码:" prop="engineCode">
                                {{vehicleDetailForm.engineCode}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="挂车尺寸:" prop="trailerLength">
                                <dictionary-select-name option-name="TRAILER_SIZE"
                                                    :value="vehicleDetailForm.trailerLength"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="外廓尺寸:" prop="outLineSize">
                                {{vehicleDetailForm.outLineSize}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="核定载质量:" prop="loadMass">
                                {{vehicleDetailForm.loadMass}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="注册日期:" prop="licenseRegisterDate">
                                {{vehicleDetailForm.licenseRegisterDate === undefined ? "" :
                                vehicleDetailForm.licenseRegisterDate | moment("YYYY-MM-DD")}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="有效期至:" prop="licenseEffectiveDate">
                                {{vehicleDetailForm.licenseEffectiveDate === undefined ? "" :
                                vehicleDetailForm.licenseEffectiveDate | moment("YYYY-MM-DD")}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
                <el-card class="box-card" body-style="padding:0px;"
                         style="width: 100%;margin-top:10px">
                    <div slot="header" class="clearfix">
                        <span>营运证</span>
                    </div>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="注册日期:" prop="operatingRegisterDate">
                                    {{vehicleDetailForm.operatingRegisterDate === undefined ? "" :
                                    vehicleDetailForm.operatingRegisterDate | moment("YYYY-MM-DD")}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="有效期至:" prop="operatingEffectiveDate">
                                    {{vehicleDetailForm.operatingEffectiveDate === undefined ? "" :
                                    vehicleDetailForm.operatingEffectiveDate | moment("YYYY-MM-DD")}}
                                </el-form-item>
                            </el-col>
                        <el-col :span="6">
                            <el-form-item label="附件:" prop="operatingAttachment">
                                <show-image-t :url="vehicleDetailForm.operatingAttachment" class1="preImg"></show-image-t>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6"></el-col>
                    </el-row>
                </el-card>
                <el-card class="box-card" body-style="padding:0px;" style="width: 100%;margin-top:10px">
                    <div slot="header" class="clearfix">
                        <span>车身照片</span>
                    </div>
                    <el-row v-if="vehicleDetailForm.type != Constant.VEHICLE_TYPE.TRAILER">
                            <el-col :span="6">
                                <el-form-item label="车身正面照附件:" prop="vehicleBodyAttachment">
                                    <show-image-t v-if="vehicleDetailForm.vehicleBodyAttachment"
                                        :url="vehicleDetailForm.vehicleBodyAttachment.split(',')[0]" class1="preImg"></show-image-t>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车身侧面照附件:" prop="vehicleBodyAttachment">
                                    <show-image-t v-if="vehicleDetailForm.vehicleBodyAttachment"
                                        :url="vehicleDetailForm.vehicleBodyAttachment.split(',')[1]" class1="preImg"></show-image-t>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="车身45度照附件:" prop="vehicleBodyAttachment">
                                    <show-image-t v-if="vehicleDetailForm.vehicleBodyAttachment"
                                        :url="vehicleDetailForm.vehicleBodyAttachment.split(',')[2]" class1="preImg"></show-image-t>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" v-if="vehicleDetailForm.type != Constant.VEHICLE_TYPE.TRACTOR">
                                <el-form-item label="车尾开门照:" prop="vehicleBodyAttachment">
                                    <show-image-t v-if="vehicleDetailForm.vehicleBodyAttachment"
                                        :url="vehicleDetailForm.vehicleBodyAttachment.split(',')[3]" class1="preImg"></show-image-t>
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
                             <el-col :span="6"  v-if="vehicleDetailForm.type != Constant.VEHICLE_TYPE.TRACTOR">
                                <el-form-item label="车尾开门照:" prop="vehicleBodyAttachment">
                                    <show-image v-if="vehicleDetailForm.vehicleBodyAttachment"
                                        :url="vehicleDetailForm.vehicleBodyAttachment.split(',')[1]"></show-image>
                                </el-form-item>
                            </el-col>
                        </el-row>
                </el-card>
            </el-form>
            <el-form size="small" :model="auditOpinionForm" label-position="left" style="margin-top:10px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="审核：">
                            <el-switch v-model="auditOpinionForm.auditStatus" active-color="#13ce66" inactive-color="#ff4949"
                                       :active-value="Constant.AUDIT_STATUS.PASS" :inactive-value="Constant.AUDIT_STATUS.NO_PASS"
                                       active-text="同意" inactive-text="拒绝"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注：">
                            <el-input type="textarea" :rows="2" :maxlength="200" placeholder="最多200个字符！" v-model="auditOpinionForm.auditRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showAuditDetail = false">取 消</el-button>
                <el-button size="small" type="primary" @click="auditSubmit">确 定</el-button>
            </span>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Http,Api,Validate,Common,Constant} from 'src/global'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                showAuditDetail: false,//申请内容
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    applyUser: '',//申请人
                    auditStatus: Constant.AUDIT_STATUS.UNAUDITED,//审核状态
                    applyTime: [],//创建时间
                    startApplyTime: '',
                    endApplyTime: '',
                    lineId: '',
                    customerCode: '',
                    departStationCode: '',
                    destStationCode: '',
                    vehicleCode:'',
                    operationMode:''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                currentRow: null,//操作行的数据
                title: "",
                auditContentForm: {
                    lineContract:{}
                },
                auditOpinionForm: {
                    auditStatus: Constant.AUDIT_STATUS.PASS,
                    auditRemark: ""
                },
                vehicleDetailForm: {
                    id:'',
                    licenseNumber: '',
                    engineModelNo: '',
                    vehicleModelNo: '',
                    vehicleBodyAttachment: '',
                    registerAttachment:'',
                    type:'',
                    ownerCode: '',
                    vehicleType: '',
                    brandType: '',
                    vehicleNumber: '',
                    engineCode: '',
                    trailerSize: '',
                    loadMass: '',
                    licenseAttachment: '',
                    operatingRegisterDate: '',
                    operatingEffectiveDate: '',
                    outLineSize: '',
                    operatingAttachment: '',
                    registerDate: '',
                    effectiveDate: '',
                },
            }
        },
        created() {
            this.searchList();
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
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.applyUser = '';
                this.searchParam.auditStatus = '';
                this.searchParam.applyTime = [];
                this.searchParam.startApplyTime = '';
                this.searchParam.endApplyTime = '';
                this.searchParam.lineId = '';
                this.searchParam.customerCode = '';
                this.searchParam.departStationCode = '';
                this.searchParam.destStationCode = '';
                this.searchParam.vehicleCode = '';
                this.searchParam.operationMode= ''
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                if(this.searchParam.applyTime){
                    this.searchParam.startApplyTime = this.searchParam.applyTime[0];
                    this.searchParam.endApplyTime = this.searchParam.applyTime[1];
                }else{
                    this.searchParam.startApplyTime = "";
                    this.searchParam.endApplyTime = "";
                }
                Http.get(Api.vehicleAudit.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
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
            showAuditWindow(row){
                let vm = this;
                vm.title = `车辆证件审批`;
                vm.vehicleDetailForm = row;
                vm.showAuditDetail = true;
            },
            auditSubmit(){
                let vm = this;
                vm.auditOpinionForm.id = vm.vehicleDetailForm.id;
                Http.post(Api.vehicleAudit.audit,vm.auditOpinionForm, result => {
                    vm.showAuditDetail = false;
                    vm.$message.success('审批完成！');
                    vm.searchList();
                })
            },
            resetAuditForm(){
                let vm = this;
                vm.auditOpinionForm.auditStatus = Constant.AUDIT_STATUS.PASS;
                vm.auditOpinionForm.auditRemark = '';
            },
            //导出
            exportForTable() {
                let vm = this;
                if(this.searchParam.applyTime){
                    this.searchParam.startApplyTime = this.searchParam.applyTime[0];
                    this.searchParam.endApplyTime = this.searchParam.applyTime[1];
                }else{
                    this.searchParam.startApplyTime = "";
                    this.searchParam.endApplyTime = "";
                }
                Http.get(Api.vehicleAudit.exportVehicleCertAudit, {params: vm.searchParam}, result => {
                    //导出
                    let header = ['车牌号', '营运证注册信息','营运证有效日期', '车辆性质', '行驶证拥有者', '车辆类型', '品牌型号', '车辆识别代号', '发动机编号', '外廓尺寸', '行驶证注册日期', '行驶证有效日期', '核定装载质量'
                        ,  '挂车尺寸',  '申请人',  '申请人组织',  '申请时间',  '审核状态', '审核人', '审核人组织', '审核意见', '审核时间'];
                    let filterVal = ['licenseNumber', 'operatingRegisterDate', 'operatingEffectiveDate', {
                        type: 'dictionary',
                        'code': 'VEHICLE_OPERATION_MODE',
                        'name': 'operationMode'
                    },'ownerCode', {
                        type: 'dictionary',
                        'code': 'SEMITRAILER_VEHICLE_TYPE,HEAD_VEHICLE_TYPE',
                        'name': 'vehicleType'
                    }, {
                        type: 'dictionary',
                        'code': 'SEMITRAILER_VEHICLE_BRAND,HEAD_VEHICLE_BRAND',
                        'name': 'brandType'
                    },'vehicleNumber', 'engineCode', 'outLineSize', 'licenseRegisterDate', 'licenseEffectiveDate', 'loadMass', {
                        type: 'dictionary',
                        'code': 'TRAILER_SIZE',
                        'name': 'trailerLength'
                    }, 'applyUser', 'applyOrg.name', 'applyTime', {
                        type: 'dictionary',
                        'code': 'AUDIT_STATUS',
                        'name': 'auditStatus'
                    }, 'auditUser', 'auditOrg.name', 'auditRemark', 'auditTime'];
                    Common.excel.downloadExl(result.result, header, filterVal, "车辆证件审批导出");
                })
            },
        }
    }
</script>
<style scoped>
    .blue {
        color: #20a0ff;
        display: inline-block;
        width: 150px;
        margin-bottom: 12px;
    }
    .el-form-item {
        margin-bottom: 8px;
    }
</style>
<style>
#AuditDetail .preImg{
        width: 50%;
    }
</style>

