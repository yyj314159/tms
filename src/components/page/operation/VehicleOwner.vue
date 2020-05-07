<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 车辆管理</el-breadcrumb-item>
                <el-breadcrumb-item>车主管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车主姓名:">
                            <el-input v-model="searchParam.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="手机号:">
                            <el-input v-model="searchParam.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="身份证号:">
                            <el-input v-model="searchParam.idCardNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否拉黑:">
                            <el-select  v-model="searchParam.blacklistFlag"
                                        clearable
                                        placeholder="请选择"
                                        style="display: block">
                                <el-option v-for="item in options"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label-width="0" style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetSearchParam" size="small">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addVehicleOwnerWinFun"
                       v-permission="permission.mainAdd">新增
            </el-button>
            <el-button v-if="exportLoading" size="mini" type="primary" icon="el-icon-download" @click="exportForTable"
                       v-permission="permission.maiDownload">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-close" @click="goBlock" :disabled="multipleSelection.length !== 1"
                       v-permission="permission.pullIntoBlack">拉黑
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-check" @click="goCancelBlock" :disabled="multipleSelection.length !== 1"
                       v-permission="permission.pullOutBlack">取消拉黑
            </el-button>
            <!--列表-->
            <el-table v-loading="isLoading" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      @row-dblclick="doubleClickRow"
                      highlight-current-row stripe
                      size="small">
                <el-table-column align="center" type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="车主姓名" prop="name" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button v-if="$_permission('/vehicleOwner/getVehicleOwnerById')" size="small" type="text"
                                   style="color: #409EFF;" @click="doubleClickRow(scope.row)">
                            {{scope.row.name}}
                        </el-button>
                        <span v-else>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号" prop="mobile" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="身份证号" prop="idCardNo" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="是否拉黑" prop="blacklistFlag" show-overflow-tooltip>
                    <template slot-scope="scope">
                       {{scope.row.blacklistFlag == true ? '是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="备注" prop="blacklistRemark" show-overflow-tooltip min-width="140"></el-table-column>
                <el-table-column align="center" label="创建机构" prop="createOrgName" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="创建人" prop="createUser" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="创建时间" prop="createTime" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="修改人" prop="modifyUser" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="修改时间" prop="modifyTime" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center" fixed="right" min-width="120"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini"
                                   @click="showModifyVehicleOwnerDialog(scope.row)"
                                   v-permission="permission.tableEdit"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini" @click="deleteVehicleOwner(scope.row)"
                                   v-permission="permission.tableDelete"></el-button>
                        <el-button v-permission="'/vehicleOwner/getVehicleDetailById'" type="text"
                                   icon="el-icon-document" size="mini"
                                   @click="showVehiDetail(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
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
        <!-- 新增车主信息信息弹出框 -->
        <el-dialog :title="vehicleOwnerWin" :visible.sync="addVehicleOwnerWin" width="800px" @close="resetImg" id="vehicleOwner" top="10vh">
            <el-form :model="addBaseInfoVehicleOwnerForm" :rules="addBaseInfoVehicleOwnerFormRules"
                     ref="addBaseInfoVehicleOwnerForm" size="small" label-width="120px">
                <el-card class="box-card" body-style="padding:0px;" style="width: 100%; ">
                    <div slot="header" class="clearfix">
                        <span>车主信息</span>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="上传身份证照片:" prop="idCardImage">
                                <uploadImage-Recognition ref="vehicleOwnerIdCardImage"
                                            v-model="addBaseInfoVehicleOwnerForm.idCardImage"
                                            :disabled="isReadOnly" :limit="1"
                                            @upload="uploadRecognition"
                                            :action = "idCardUrl"
                                            ></uploadImage-Recognition>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证号:" prop="idCardNo">
                                <el-input v-model="addBaseInfoVehicleOwnerForm.idCardNo" :disabled="isReadOnly"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="车主姓名:" prop="name">
                                <el-input v-model="addBaseInfoVehicleOwnerForm.name" :disabled="isReadOnly"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号:" prop="mobile">
                                <el-input v-model="addBaseInfoVehicleOwnerForm.mobile" :disabled="isReadOnly"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-row>
                        <el-col :span="12">
                            <el-form-item label="城市" prop="cityCode">
                                <district-select v-model="addBaseInfoVehicleOwnerForm.cityCodes"
                                                style="display: block;"></district-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="详细地址" prop="address">
                                <el-input v-model="addBaseInfoVehicleOwnerForm.address" :disabled="isReadOnly"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row> -->
                </el-card>
                <el-card class="box-card" body-style="padding:0px;" style="width: 100%; ">
                    <div slot="header" class="clearfix">
                        <span>银行卡信息</span>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="上传银行卡照片:" prop="vehicleOwnerBankCard.ownerBankImgs">
                                <uploadImage-Recognition ref="vehicleOwnerBankImage"
                                            v-model="addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.ownerBankImgs"
                                            :disabled="isReadOnly" :limit="1"
                                            @upload="uploadBank"
                                            :action = "bankCardUrl"
                                            ></uploadImage-Recognition>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="开户人:" prop="vehicleOwnerBankCard.accountHolder">
                                <el-input v-model="addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.accountHolder" :disabled="isReadOnly"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="银行卡号:" prop="vehicleOwnerBankCard.cardNo">
                                <el-input v-model="addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.cardNo" :disabled="isReadOnly"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" >
                            <el-form-item label="开户银行:">
                                <el-input v-model="addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.bankName" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="开户支行:">
                                <el-input v-model="addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.bankBranch"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
            </el-form>
            <!--銀行账号列表-->
            <!-- <el-table size="small" class="content-table" :data="addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      @row-dblclick="showModifyBankCardForList"
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center" width="80" label="开户人" prop="accountHolder"></el-table-column>
                <el-table-column header-align="center" width="220" label="银行卡号" prop="cardNo">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" style="color: #409EFF;"
                                   @click="showModifyBankCardForList(scope.row,scope.$index,)">{{scope.row.cardNo}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="开户行" prop="bankName"></el-table-column>
                <el-table-column header-align="center" width="80" label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="small"
                                   @click="showModifyBankCardForList(scope.row,scope.$index)"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="small"
                                   @click="deleteBankCardForList(scope.$index, addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard)"></el-button>
                    </template>
                </el-table-column>
            </el-table> -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="addVehicleOwnerWin = false" :disabled="isReadOnly" size="small">取 消</el-button>
                <el-button type="primary" @click="submitAddForm('addBaseInfoVehicleOwnerForm')" :disabled="isReadOnly"
                           size="small">确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- <el-dialog :title="bankCardDialogTitle" :visible.sync="addBankCard" width="400px" ref="bankCardDialog">
            <el-form :model="tm" :rules="addBaseInfoVehicleOwnerFormRules" ref="tm" label-width="100px" size="small"
                     align="center">
                <el-row>
                    <el-form-item label="开户人:" width="80" prop="accountHolder">
                        <el-input v-model="tm.accountHolder" :disabled="isReadOnly"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="银行卡号:" width="200" prop="cardNo">
                        <el-input v-model="tm.cardNo" :disabled="isReadOnly"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="开户行:" prop="bankName">
                        <el-input v-model="tm.bankName" :disabled="isReadOnly"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="上传照片:">
                        <upload-image ref="vehicleOwnerUploadImage"
                                      v-model="addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.ownerBankImgs"
                                      :disabled="isReadOnly"></upload-image>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBankCard = false" :disabled="isReadOnly" size="small">取 消</el-button>
                <el-button type="primary" @click="addBankCardToList('tm')" :disabled="isReadOnly" size="small">确 定
                </el-button>
            </div>
        </el-dialog> -->


        <!--车主详情 弹出框-->
        <el-dialog title="查看车主信息" :visible.sync="addVehicleOwnerWinDetails" width="700px">
            <el-form :model="addBaseInfoVehicleOwnerFormDetails" ref="addBaseInfoVehicleOwnerFormDetails" size="small"
                     label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车主姓名:" prop="name">
                            <label v-model="addBaseInfoVehicleOwnerFormDetails.name">{{addBaseInfoVehicleOwnerFormDetails.name}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号:" prop="mobile">
                            <label v-model="addBaseInfoVehicleOwnerFormDetails.mobile">{{addBaseInfoVehicleOwnerFormDetails.mobile}}</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="身份证号:" prop="idCardNo">
                            <label v-model="addBaseInfoVehicleOwnerFormDetails.idCardNo">{{addBaseInfoVehicleOwnerFormDetails.idCardNo}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="证件照片:" prop="idCardImage">
                            <show-image :url="addBaseInfoVehicleOwnerFormDetails.idCardImage"></show-image>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="开户人:" prop="accountHolder">
                            {{addBaseInfoVehicleOwnerFormDetails.vehicleOwnerBankCard?addBaseInfoVehicleOwnerFormDetails.vehicleOwnerBankCard.accountHolder:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="开户行:" prop="bankName">
                            {{addBaseInfoVehicleOwnerFormDetails.vehicleOwnerBankCard?addBaseInfoVehicleOwnerFormDetails.vehicleOwnerBankCard.bankName:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="银行账号:" prop="cardNo">
                            {{addBaseInfoVehicleOwnerFormDetails.vehicleOwnerBankCard?addBaseInfoVehicleOwnerFormDetails.vehicleOwnerBankCard.cardNo:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="银行卡照片:" prop="ownerBankImgs">
                            <show-image :url="addBaseInfoVehicleOwnerFormDetails.vehicleOwnerBankCard?addBaseInfoVehicleOwnerFormDetails.vehicleOwnerBankCard.ownerBankImgs:''"></show-image>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!--銀行账号列表-->
            <!-- <el-table class="content-table" :data="addBaseInfoVehicleOwnerFormDetails.vehicleOwnerBankCard"
                      element-loading-text="拼命加载中"
                      border fit
                      @row-dblclick="detailsBankCardForList"
                      highlight-current-row stripe>
                <el-table-column header-align="center" width="150" label="开户人" prop="accountHolder"></el-table-column>
                <el-table-column header-align="center" width="220" label="银行卡号" prop="cardNo">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="detailsBankCardForList(scope.row)">{{scope.row.cardNo}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="开户行" prop="bankName"></el-table-column>
            </el-table> -->
        </el-dialog>
        <!-- <el-dialog title="查看银行卡信息" :visible.sync="detailsBankCard" width="400px" ref="bankCardDialog">
            <el-form :model="detailsBankCardModel" ref="detailsBankCardModel" label-width="100px" size="small">
                <el-row>
                    <el-form-item label="开户人:" width="80" prop="accountHolder">
                        <label
                            v-model="detailsBankCardModel.accountHolder">{{detailsBankCardModel.accountHolder}}</label>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="银行卡号:" prop="cardNo">
                        <label v-model="detailsBankCardModel.cardNo">{{detailsBankCardModel.cardNo}}</label>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="开户行:" prop="bankName">
                        <label v-model="detailsBankCardModel.bankName">{{detailsBankCardModel.bankName}}</label>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="上传照片:">
                        <show-image :url="detailsBankCardModel.ownerBankImgs"></show-image>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-dialog> -->
        <el-dialog title="车辆相关信息" :visible.sync="addVehicleDetailWin" width="95%" :top="marginTop">
            <el-table size="mini" class="content-table" :data="detailResult.result" element-loading-text="拼命加载中" border
                      fit highlight-current-row stripe>
                <el-table-column label="车辆编码" header-align="center" prop="code" min-width="140"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="车牌号" header-align="center" prop="licenseNumber" min-width="120">
                </el-table-column>
                <el-table-column label="所属区域" header-align="center" prop="org.name" min-width="120"></el-table-column>
                <el-table-column label="车辆类型" header-align="center" prop="type" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_TYPE"
                                                :value="scope.row.type"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="规格" header-align="center" prop="specification" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_SPECIFICATION"
                                                :value="scope.row.specification"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="营运模式" header-align="center" prop="operationMode" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                :value="scope.row.operationMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="营运性质" header-align="center" prop="operationAttribute" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_ATTRIBUTE"
                                                :value="scope.row.operationAttribute"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="车主" header-align="center" prop="vehicleOwner.name"
                                 min-width="90"></el-table-column>
                <el-table-column label="行驶证有效日期" header-align="center" prop="vehicleLicense.effectiveDate" width="120"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.vehicleLicense.effectiveDate | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column label="营运证有效日期" header-align="center" prop="vehicleOperatingLicense.effectiveDate"
                                 min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.vehicleOperatingLicense.effectiveDate | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column label="交强险有效日期" header-align="center" prop="vehicleInsurance.strongInsuranceDate"
                                 min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.vehicleInsurance.strongInsuranceDate | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column label="商业险有效日期" header-align="center" prop="vehicleInsurance.commercialInsuranceDate"
                                 min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.vehicleInsurance.commercialInsuranceDate | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" header-align="center" prop="createTime" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="创建人" header-align="center" prop="createUser" min-width="150"></el-table-column>
                <el-table-column label="修改时间" header-align="center" prop="modifyTime" min-width="180"></el-table-column>
                <el-table-column label="修改人" header-align="center" prop="modifyUser" min-width="150"></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog :title="blockTitle" :visible.sync="blockFlag" width="30%" @close="blockClose">
            <el-form size="small" :model="blockForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注：" label-width="100px">
                           <el-input v-model="blockForm.blacklistRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="blockClose">取 消</el-button>
                <el-button type="primary" @click="blockSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>


<script>
    import {Http, Common, Api} from 'src/global'

    export default {
        data() {
            return {
                idCardUrl: Api.uploadAndRecognition.idCard,
                bankCardUrl: Api.uploadAndRecognition.bankCard,
                dbClickSubbmitVisible: false,
                cityList: [],
                customerList: [],
                multipleSelection: [],
                exportLoading: true,//导出
                isLoading: true,
                options: [{
                    value: 1,
                    label: '是'
                }, {
                    value: 0,
                    label: '否'
                }],
                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    mobile: '',
                    idCardNo: '',
                    name: '',
                    blacklistFlag:'',
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                detailResult: {
                    result: []
                },
                addVehicleOwnerWin: false,
                addVehicleDetailWin: false,
                addBankCard: false,
                addBaseInfoVehicleOwnerForm: {
                    vehicleOwnerBankCard: {
                        accountHolder: '',
                        cardNo: '',
                        bankName: '',
                        ownerBankImgs:'',
                        bankBranch:''
                    },
                    name: '',
                    mobile: '',
                    idCardNo: '',
                    idCardImage: '',
                },
                addBaseInfoVehicleOwnerFormDetails: {
                    vehicleOwnerBankCard: {
                        accountHolder: '',
                        cardNo: '',
                        bankName: '',
                        ownerBankImgs:''
                    },
                    name: '',
                    mobile: '',
                    idCardNo: '',
                    idCardImage: '',
                },
                addBaseInfoVehicleOwnerFormRules: {
                    name: [
                        {required: true, message: '请输入车主姓名', trigger: 'blur'},
                        {min: 1, max: 12, message: '编号最长12个字符', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号'}
                    ],
                    idCardNo: [
                        {required: true, message: '请输入身份证号', trigger: 'blur'},
                        {pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号'}
                    ],
                    'vehicleOwnerBankCard.accountHolder': [
                        {required: true, message: '请输入开户人', trigger: 'blur'}
                    ],
                    'vehicleOwnerBankCard.cardNo': [
                        {required: true, message: '请输入银行卡号', trigger: 'blur'},
                        {min: 1, max: 20, message: '编号最长19个字符', trigger: 'blur'},
                        {pattern: /^\d{16,19}$/, message: '请输入正确的银行卡号'}
                    ],
                    idCardImage: [
                        {required: true, message: '请上传身份证照片', trigger: 'blur'},
                    ],
                },
                isUpdate: false,//银行卡是否为修改
                isVehicleOwnerWinIsUpdate: false,//车主是否为修改
                upRow: null,
                bankCardDialogTitle: '新增银行卡信息',
                vehicleOwnerWin: '新增车主信息',
                tm: {
                    accountHolder: '',
                    cardNo: '',
                    bankName: '',
                    id: '',
                    ownerBankImgs: [],
                    index: ''
                },
                detailsBankCardModel: {
                    accountHolder: '',
                    cardNo: '',
                    bankName: '',
                    id: '',
                    ownerBankImgs: []
                },
                isReadOnly: false,
                addVehicleOwnerWinDetails: false,
                detailsBankCard: false,
                permission: {
                    mainAdd: '/vehicleOwnerBankCard/add',
                    maiDownload: '/vehicleOwnerBankCard/maiDownload',
                    tableEdit: '/vehicleOwnerBankCard/modify',
                    tableDelete: '/vehicleOwnerBankCard/delete',
                    pullIntoBlack:'/vehicleOwnerBankCard/pullIntoBlack',
                    pullOutBlack:'/vehicleOwnerBankCard/pullOutBlack',
                },
                blockFlag:false, // 拉黑显隐
                blockForm:{ // 拉黑弹出框
                    blacklistRemark:''
                },
                blockTitle:'',
                blockType:'' // block拉黑和cancel取消拉黑
            }
        },
        watch: {
            addVehicleOwnerWin(val) {
                if (!val) { //当车主界面关闭的时候   修改页面属性为 false
                    this.isVehicleOwnerWinIsUpdate = false;
                }
            },
            addBankCard(val) {
                if (!val) { //当车主银行卡界面关闭的时候   修改页面属性为 false
                    this.isUpdate = false;
                }
            },
            deep: true
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
            //查询表格
            this.searchList()
        },
        methods: {
            goCancelBlock(){
                if(!this.multipleSelection[0].blacklistFlag){
                    this.$message.error("该司机尚未被拉黑")
                    return
                }
                this.blockFlag = true
                this.blockType = 'cancel'
                this.blockTitle = "取消拉黑"
            },
            goBlock(){
                if(this.multipleSelection[0].blacklistFlag){
                    this.$message.error("该司机已被拉黑")
                    return
                }
                this.blockFlag = true
                this.blockType = 'block'
                this.blockTitle = "拉黑司机"
            },
            blockClose(){
                this.blockForm = {
                    blacklistRemark:''
                }
                this.blockFlag = false
            },
            blockSubmit(){
                let vm = this
                let postData = vm.blockForm
                postData.id = vm.multipleSelection[0].id
                if(this.blockType == 'block'){
                    Http.post(Api.vehicleOwner.pullIntoBlack, postData, result => {
                        vm.$message.success('拉黑成功')
                        vm.blockClose()
                        vm.searchList()
                    },error=> vm.$message.error(error.message))
                }else if(this.blockType == 'cancel'){
                    Http.post(Api.vehicleOwner.pullOutBlack, postData, result => {
                        vm.$message.success('取消拉黑成功')
                        vm.blockClose()
                        vm.searchList()
                    },error=> vm.$message.error(error.message))
                }
            },
            resetImg(){
                this.$refs.vehicleOwnerIdCardImage.clearFileList()
                this.$refs.vehicleOwnerBankImage.clearFileList()
                this.$refs.addBaseInfoVehicleOwnerForm.resetFields()

            },
            uploadRecognition(res){
                console.log(res)
                if (res.success){
                    this.addBaseInfoVehicleOwnerForm.idCardImage = this.$refs.vehicleOwnerIdCardImage.getFileList()
                    this.addBaseInfoVehicleOwnerForm.name = res.result.name
                    this.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.accountHolder = res.result.name
                    this.addBaseInfoVehicleOwnerForm.idCardNo = res.result.idCard
                }
            },
            uploadBank(res){
                console.log(res)
                if (res.success){
                    this.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.cardNo = res.result.cardNo;
                    this.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.bankName = res.result.bankName;
                }
            },
            //通用
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList()
            },
            /**
             * 主界面
             */
            //查询
            searchList() {
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.vehicleOwner.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            //显示详情车主的车辆详情信息
            showVehiDetail(row) {
                let vm = this;
                Http.get(Api.vehicleOwner.getVehicleDetailById, {params: {'owner': row.id}}, result => {
                    vm.detailResult.result = result.result;
                    vm.addVehicleDetailWin = true
                })
            },
            //重置
            resetSearchParam() {
                let vm = this;
                vm.searchParam.name = '';
                vm.searchParam.mobile = '';
                vm.searchParam.idCardNo = '',
                vm.searchParam.blacklistFlag=''
            },
            //通过ID回显数据(修改)
            showModifyVehicleOwnerDialog(row) {
                this.vehicleOwnerWin = '修改车主信息';
                const vm = this;
                vm.resetaddBankCard();
                vm.dbClickSubbmitVisible = true;
                vm.isReadOnly = false;
                Http.get(Api.vehicleOwner.getVehicleOwnerById, {params: {'id': row.id}}, result => {
                    vm.addBaseInfoVehicleOwnerForm = result.result;

                    // 可能存在没有银行卡信息情况
                    if(!vm.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard){
                        vm.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard = {
                            accountHolder: '',
                            cardNo: '',
                            bankName: '',
                            ownerBankImgs:'',
                            bankBranch:''
                        }
                    }
                    setTimeout(function () {
                        vm.$refs.vehicleOwnerIdCardImage.clearFileList();
                        vm.$refs.vehicleOwnerIdCardImage.setFileList(result.result.idCardImage.split(","));
                        vm.$refs.vehicleOwnerBankImage.clearFileList();
                        result.result.vehicleOwnerBankCard && result.result.vehicleOwnerBankCard.ownerBankImgs && vm.$refs.vehicleOwnerBankImage.setFileList(result.result.vehicleOwnerBankCard.ownerBankImgs.split(","));
                    }, 0);
                    // if (!_.isNil(result.result.city)) {
                    //     this.addBaseInfoVehicleOwnerForm.cityCodes = [result.result.city.parentCode, result.result.city.code]
                    // }
                    // vm.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard = result.result.vehicleOwnerBankCard;
                    vm.isVehicleOwnerWinIsUpdate = true;
                    vm.addVehicleOwnerWin = true
                })
            },
            doubleClickRow(row) {//查看详情
                const vm = this;
                vm.resetaddBankCardDetails();
                Http.get(Api.vehicleOwner.getVehicleOwnerById, {params: {'id': row.id}}, result => {
                    vm.addBaseInfoVehicleOwnerFormDetails = result.result;
                    // if (!_.isNil(result.result.city)) {
                    //     vm.addBaseInfoVehicleOwnerFormDetails.cityCode = result.result.city.name
                    // }
                    vm.addVehicleOwnerWinDetails = true
                })
            },
            //删除
            deleteVehicleOwner(row) {
                let vm = this;
                var ids = [];
                ids.push(row.id);
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.vehicleOwner.delete, ids, result => {
                        vm.searchList()
                    })
                })
            },
            //导出
            exportForTable() {
                let _this = this;
                _this.exportLoading = false;
                let model = _.cloneDeep(_this.searchParam);
                model.pageSize = 3000;
                model.currentPage = 1;
                Http.get(Api.vehicleOwner.getExcelForVehicleOwner, {params: _this.searchParam}, result => {
                    //导出
                    let header = ['车主姓名', '手机号', '身份证号','是否拉黑', '备注','创建机构', '创建人', '创建时间','修改人','修改时间'];
                    let filterVal = [
                        'name',
                        'mobile',
                        'idCardNo',
                        'blacklist',
                        'blacklistRemark',
                        'createOrgCode',
                        'createUser',
                        'createTime',
                        'modifyUser',
                        'modifyTime'
                    ];
                    Common.excel.downloadExl(result.result, header, filterVal, "车主信息导出");
                    _this.exportLoading = true;
                },()=>{
                    _this.exportLoading = true;
                })
            },
            addVehicleOwnerWinFun() {
                this.vehicleOwnerWin = '新增车主信息';
                this.resetaddBankCard();
                this.isReadOnly = false;
                this.addVehicleOwnerWin = true
            },
            /**
             * 车主win
             * @param formName
             */
            addBankCardWin() {
                let vm = this;
                vm.resetBankCardWin();
                vm.bankCardDialogTitle = '新增银行卡信息';
                vm.addBankCard = true
            },
            showModifyBankCardForList(row, index) {
                const vm = this;
                vm.bankCardDialogTitle = '修改银行卡信息';
                vm.isUpdate = true;
                vm.tm = _.cloneDeep(row);
                vm.tm.index = index;
                setTimeout(function () {
                    vm.$refs.vehicleOwnerUploadImage.clearFileList();
                    vm.$refs.vehicleOwnerUploadImage.setFileList(row.ownerBankImgs.split(","));
                }, 0);
                vm.addBankCard = true
            },
            detailsBankCardForList(row) {
                this.detailsBankCardModel = row;
                this.detailsBankCard = true
            },
            deleteBankCardForList(index, rows) {
                rows.splice(index, 1)
            },
            //新增车主信息
            submitAddForm(formName) {
                let vm = this;
                // if (vm.addBaseInfoVehicleOwnerForm.cityCodes) {
                //     let cityCodeArr = vm.addBaseInfoVehicleOwnerForm.cityCodes;
                //     vm.addBaseInfoVehicleOwnerForm.cityCode = cityCodeArr[cityCodeArr.length - 1];
                // }
                vm.$nextTick(() => {
                    vm.addBaseInfoVehicleOwnerForm.idCardImage = vm.$refs.vehicleOwnerIdCardImage.getFileList()
                    if (vm.$refs.vehicleOwnerIdCardImage.getFileList().length > 0) {
                                vm.addBaseInfoVehicleOwnerForm.idCardImage = vm.$refs.vehicleOwnerIdCardImage.getFileList().join(",")
                    }
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            // if (vm.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.length == 0) {
                            //     this.$message('请上传银行卡信息');
                            // }
                            // if (vm.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.length > 5) {
                            //     this.$message('一个车主只允许上传5张银行卡信息');
                            // }
                            if(vm.addBaseInfoVehicleOwnerForm.name!==vm.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.accountHolder){
                                this.$message.error('银行卡与车主姓名不符')
                                return
                            }
                            vm.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.ownerBankImgs = vm.$refs.vehicleOwnerBankImage.getFileList()
                            if (vm.$refs.vehicleOwnerBankImage.getFileList().length > 0) {
                                vm.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.ownerBankImgs = vm.$refs.vehicleOwnerBankImage.getFileList().join(",")
                            }else{
                                vm.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.ownerBankImgs = ""
                            }
                            if (!vm.isVehicleOwnerWinIsUpdate) {
                                Http.post(Api.vehicleOwner.add, vm.addBaseInfoVehicleOwnerForm, function (res) {
                                    vm.resetWinForm();
                                    vm.addVehicleOwnerWin = false;
                                    vm.searchList();
                                })
                            } else {
                                Http.post(Api.vehicleOwner.modify, vm.addBaseInfoVehicleOwnerForm, function (res) {
                                    vm.resetWinForm();
                                    vm.addVehicleOwnerWin = false;
                                    vm.searchList();
                                })
                            }
                        }
                    })
                })
            },
            resetaddBankCard() {//车主界面重置
                let vm = this;
                vm.addBaseInfoVehicleOwnerForm = {
                    vehicleOwnerBankCard: {
                        accountHolder: '',
                        cardNo: '',
                        bankName: '',
                        ownerBankImgs:''
                    },
                    name: '',
                    mobile: '',
                    idCardNo: '',
                    idCardImage: '',
                }
            },
            resetaddBankCardDetails() {//车主详情界面重置
                let vm = this;
                vm.addBaseInfoVehicleOwnerFormDetails = {
                    vehicleOwnerBankCard: {
                        accountHolder: '',
                        cardNo: '',
                        bankName: ''
                    },
                    name: '',
                    mobile: '',
                    idCardNo: '',
                    idCardImage: '',
                }
            },
            //新增银行卡
            addBankCardToList(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let imgNum = vm.$refs.vehicleOwnerUploadImage.getFileList().length;
                        if (imgNum > 1) {
                            this.$message("只能上传一张银行卡图片");
                        } else {
                            vm.tm.ownerBankImgs = this.$refs.vehicleOwnerUploadImage.getFileList().join(",");//图片路径
                            if (vm.isUpdate) {
                                vm.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.splice(vm.tm.index, 1, vm.tm);
                            } else {
                                vm.addBaseInfoVehicleOwnerForm.vehicleOwnerBankCard.push(vm.tm)
                            }
                            vm.addBankCard = false;
                            vm.isUpdate = false;
                        }
                    }
                })
            },
            resetWinForm() {
                let vm = this;
                vm.addBaseInfoVehicleOwnerForm = {
                    vehicleOwnerBankCard: {
                        accountHolder: '',
                        cardNo: '',
                        bankName: ''
                    },
                    name: '',
                    mobile: '',
                    idCardNo: '',
                    idCardImage: '',
                }
            },
            resetBankCardWin() {
                const _this = this;
                _this.tm = {
                    accountHolder: '',
                    cardNo: '',
                    bankName: '',
                    id: '',
                    ownerBankImgs: []
                }
                setTimeout(function () {
                    _this.$refs.vehicleOwnerUploadImage.clearFileList();
                }, 0)
            },
        }
    }
</script>
<style>
#vehicleOwner .el-dialog__header{
    padding: 10px 20px 0;
}
#vehicleOwner .el-card__header{
    padding: 0;
}
</style>




