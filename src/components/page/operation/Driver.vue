<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 运力管理</el-breadcrumb-item>
                <el-breadcrumb-item>司机管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form :model="searchParam" label-width="80px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属组织:">
                            <org-select style="display: block" v-model.trim="searchParam.orgCode"
                                        mounted="true"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="姓名:">
                            <el-input v-model.trim="searchParam.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="手机号:">
                            <el-input v-model.trim="searchParam.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态:">
                            <dictionary-select v-model="searchParam.deleteFlag" style="display: block"
                                               option-name="DRIVER_STATUS"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="身份证号:">
                            <el-input v-model.trim="searchParam.idCardNo"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机性质:">
                            <dictionary-select v-model="searchParam.nature" style="display: block"
                                               size="small"
                                               option-name="DRIVER_TYPE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float:right">
                            <el-button type="success" icon="el-icon-search"
                                       @click="searchParam.currentPage=1;searchDriverForMainList()">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetMainSearchParam">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="btnLoading" size="mini" type="primary" icon="el-icon-plus" @click="addDriverWinShow"
                       v-permission="permission.add">新增
            </el-button>
            <el-button v-if="btnLoading" size="mini" type="primary" icon="el-icon-download" @click="exportExcelSubmit"
                       v-permission="permission.excelDownload">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      @row-dblclick="handleRowHandle"
                      border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="所属组织" prop="orgName" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="姓名" min-width="120"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="detailsDriverWinShow(scope.row)">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号" prop="mobile" min-width="120"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" label="身份证号" prop="idCardNo" min-width="200"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" label="驾驶证" prop="drivingLicence" min-width="200"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="司机性质" min-width="120"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="DRIVER_TYPE"
                                                v-model="scope.row.nature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="司机状态" min-width="120"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="DRIVER_STATUS"
                                                v-model="scope.row.deleteFlag"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="驾驶证失效日期" prop="drivingLicenceValidDate" min-width="200"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.drivingLicenceValidDate | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="从业资格证失效日期" prop="certificateValidDate" min-width="200"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="创建人" prop="createUser" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="创建时间" prop="createTime" min-width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="360px">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="driverDetailShow(scope.row)"
                                   v-permission="permission.driverDetail">操作详情
                        </el-button>
                        <el-button type="text" icon="el-icon-edit" size="mini"
                                   @click="editDriverWinShow(scope.row)"
                                   v-permission="permission.modify"></el-button>
                        <el-button type="text" size="mini"
                                   @click="editCertificatesDetailShow(scope.row)"
                                   v-permission="permission.certificatesManage">证件维护
                        </el-button>
                        <el-button type="text" size="mini" @click="resetDriverPassWordWinShow(scope.row)"
                                   v-permission="permission.resetPassWord">重置密码
                        </el-button>
                        <el-button type="text" size="mini"
                                   @click="cancel(scope.row)" v-permission="permission.cancel">注销
                        </el-button>
                    </template>
                </el-table-column>
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
        </el-main>
        <!--新增司机win-->
        <el-dialog :title="win.winTitle.driverAddWinTitle" :visible.sync="win.winShow.driverAddWin" width="65%">
            <el-form :model="driverAddWinModel" :rules="verification" ref="driverAddWinForm" label-width="100px"
                     size="small">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名:" prop="name">
                            <el-input v-model="driverAddWinModel.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机号:" prop="mobile">
                            <el-input v-model="driverAddWinModel.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号:" prop="idCardNo">
                            <el-input v-model="driverAddWinModel.idCardNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="所属组织:" prop="orgName">
                            <org-select style="display: block" v-model="driverAddWinModel.orgCode"
                                        ref="modifyDriverOrgSelect"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="驾驶证号:" prop="drivingLicence">
                            <el-input v-model="driverAddWinModel.drivingLicence" disabled/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="司机性质:" prop="nature">
                            <dictionary-select v-model="driverAddWinModel.nature" style="display: block"
                                               size="small" option-name="DRIVER_TYPE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--<el-row>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="账户类型:">-->
                            <!--<dictionary-select v-model="driverAddWinModel.accountType" style="display: block"-->
                                               <!--size="small" option-name="ACCOUNT_TYPE"/>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="开户银行:">-->
                            <!--<el-input v-model="driverAddWinModel.openingBank" style="display: block"-->
                                      <!--size="small"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="开户支行:">-->
                            <!--<el-input v-model="driverAddWinModel.openingBankBranch"/>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                <!--</el-row>-->
                <!--<el-row>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="收款人:">-->
                            <!--<el-input style="display: block" v-model="driverAddWinModel.payee"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="银行卡号:" prop="dueBankCardNo" :rules="Validate.bank">-->
                            <!--<el-input v-model="driverAddWinModel.dueBankCardNo"/>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                <!--</el-row>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="win.winShow.driverAddWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addDriverWinSubmit('driverAddWinForm')" size="small">确 定
                </el-button>
            </div>
        </el-dialog>
        <!--修改司机win-->
        <el-dialog :title="win.winTitle.driverEditWinTitle" :visible.sync="win.winShow.driverEditWin" width="65%">
            <el-form :model="driverEditWinModel" :rules="verification" ref="driverEditWinForm" label-width="100px"
                     size="small">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名:" prop="name">
                            <el-input v-model="driverEditWinModel.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机号:" prop="mobile">
                            <el-input v-model="driverEditWinModel.mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号:" prop="idCardNo">
                            <el-input v-model="driverEditWinModel.idCardNo"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="所属组织:">
                            <org-select style="display: block" v-model="driverEditWinModel.orgCode"
                                        ref="modifyDriverOrgSelect"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="驾驶证号:" prop="drivingLicence">
                            <el-input v-model="driverEditWinModel.drivingLicence" disabled/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="司机性质:" prop="nature">
                            <dictionary-select v-model="driverEditWinModel.nature" style="display: block"
                                               size="small" option-name="DRIVER_TYPE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="win.winShow.driverEditWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="editDriverWinSubmit('driverEditWinForm')" size="small">确 定
                </el-button>
            </div>
        </el-dialog>

        <!--证件维护-->
        <el-dialog :title="win.winTitle.certificatesManageWinTitle" :visible.sync="win.winShow.certificatesManageWin"
                   width="65%">
            <el-form :model="certificatesManageEditWinModel" :rules="verification" ref="CertificatesEditWinForm"
                     label-width="100px"
                     size="small">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名:" prop="name">
                            <el-input v-model="certificatesManageEditWinModel.name"
                                      disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机号:" prop="mobile">
                            <el-input v-model="certificatesManageEditWinModel.mobile"
                                      disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号:" prop="idCardNo">
                            <el-input v-model="certificatesManageEditWinModel.idCardNo"
                                      disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="驾驶证号:" prop="drivingLicence" disabled="disabled">
                            <el-input v-model="certificatesManageEditWinModel.drivingLicence" disabled/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证照片:" prop="idCardImage">
                            <upload-image ref="idCardImage"
                                          v-model="certificatesManageEditWinModel.idCardImage"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="驾驶证照片:" prop="drivingLicenceImage">
                            <upload-image ref="certificateImage"
                                          v-model="certificatesManageEditWinModel.drivingLicenceImage"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="win.winShow.certificatesManageWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="editCertificatesWinSubmit('CertificatesEditWinForm')" size="small">确 定
                </el-button>
            </div>
        </el-dialog>
        <!--修改银行卡信息-->
        <!--<el-dialog :title="win.winTitle.driverBankCardEditWinTitle" :visible.sync="win.winShow.driverBankCardEditWin"-->
                   <!--width="65%">-->
            <!--<el-form :model="driverBankCardEditWinModel" :rules="verification" ref="driverBankCardEditWinForm"-->
                     <!--label-width="100px"-->
                     <!--size="small">-->
                <!--<el-row>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="账户类型:">-->
                            <!--<dictionary-select v-model="driverBankCardEditWinModel.accountType"-->
                                               <!--style="display: block"-->
                                               <!--size="small" option-name="ACCOUNT_TYPE"/>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="开户银行:">-->
                            <!--<el-input v-model="driverBankCardEditWinModel.openingBank" style="display: block"-->
                                      <!--size="small"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="开户支行:">-->
                            <!--<el-input v-model="driverBankCardEditWinModel.openingBankBranch"/>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                <!--</el-row>-->
                <!--<el-row>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="收款人:">-->
                            <!--<el-input style="display: block"-->
                                      <!--v-model="driverBankCardEditWinModel.payee"></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="银行卡号:" prop="dueBankCardNo" :rules="Validate.bank">-->
                            <!--<el-input v-model="driverBankCardEditWinModel.dueBankCardNo"/>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                <!--</el-row>-->
            <!--</el-form>-->
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button @click="win.winShow.driverBankCardEditWin = false" size="small">取 消</el-button>-->
                <!--<el-button type="primary" @click="editBankCardDriverWinSubmit('driverBankCardEditWinForm')"-->
                           <!--size="small">确 定-->
                <!--</el-button>-->
            <!--</div>-->
        <!--</el-dialog>-->
        <!--查看司机win-->
        <el-dialog :title="win.winTitle.driverDetailsWinTitle" :visible.sync="win.winShow.driverDetailsWin" width="65%">
            <el-form :model="driverDetailsWinModel" ref="driverDetailsWinForm" label-width="150px" size="small">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名:">
                            {{driverDetailsWinModel.name }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机号:">
                            {{driverDetailsWinModel.mobile }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号:">
                            {{driverDetailsWinModel.idCardNo }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="所属组织:">
                            {{driverDetailsWinModel.orgName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="驾驶证:">
                            {{driverDetailsWinModel.drivingLicence }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="司机性质:">
                            <datadictionary-name :value="driverDetailsWinModel.nature" option-name="DRIVER_TYPE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="驾驶证失效日期:">
                            {{ driverDetailsWinModel.drivingLicenceValidDate | moment("YYYY 年 MM 月 DD 日")}}
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="8">-->
                    <!--<el-form-item label="从业资格证失效日期:" prop="certificateValidDate">-->
                    <!--{{ driverDetailsWinModel.certificateValidDate | moment("YYYY 年 MM 月 DD 日")}}-->
                    <!--</el-form-item>-->
                    <!--</el-col>-->
                    <el-col :span="8">
                        <el-form-item label="驾驶证图片:">
                            <show-image :url="driverDetailsWinModel.drivingLicenceImage"></show-image>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证图片:">
                            <show-image :url="driverDetailsWinModel.idCardImage"></show-image>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                     <el-col :span="8">
                         <el-form-item label="行驶证图片:">
                             <show-image :url="driverDetailsWinModel.drivingPermitImage"></show-image>
                         </el-form-item>
                     </el-col>
                     <el-col :span="8">
                         <el-form-item label="营运证图片:">
                             <show-image :url="driverDetailsWinModel.operatingLicenseImage"></show-image>
                         </el-form-item>
                     </el-col>
                     <el-col :span="8">
                         <el-form-item label="保单图片:">
                             <show-image :url="driverDetailsWinModel.warrantyImage"></show-image>
                         </el-form-item>
                     </el-col>
                 </el-row>-->
                <!--<el-row>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="账户类型:">-->
                            <!--<dictionary-select-name v-model="driverDetailsWinModel.accountType"-->
                                                    <!--style="display: block" size="small" option-name="ACCOUNT_TYPE"/>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--&lt;!&ndash;<el-col :span="8" >&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-form-item label="从业资格证图片:">&ndash;&gt;-->
                    <!--&lt;!&ndash;<show-image :url="driverDetailsWinModel.certificateImage" ></show-image>&ndash;&gt;-->
                    <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                    <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="收款人:">-->
                            <!--{{driverDetailsWinModel.payee }}-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="开户银行:">-->
                            <!--{{driverDetailsWinModel.openingBank}}-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                <!--</el-row>-->
                <!--<el-row>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="开户支行:">-->
                            <!--{{driverDetailsWinModel.openingBankBranch}}-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="8">-->
                        <!--<el-form-item label="银行卡号:">-->
                            <!--{{driverDetailsWinModel.dueBankCardNo}}-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                <!--</el-row>-->
                <!--<el-row>-->
                <!---->
                <!--</el-row>-->
            </el-form>
        </el-dialog>
        <!--重置密码win-->
        <el-dialog :title="win.winTitle.driverResetPasswordWinTitle" :visible.sync="win.winShow.driverResetPassWordWin"
                   width="400px">
            <el-form :model="passWordWinModel" :rules="verification" ref="driverResetPassWordWinForm"
                     label-width="100px" size="small" align="center">
                <el-row>
                    <el-form-item label="密码:" prop="password">
                        <el-input v-model="passWordWinModel.password" type="password"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="确认密码:" prop="againPassword">
                        <el-input v-model="passWordWinModel.againPassword" type="password"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="win.winShow.driverResetPassWordWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="resetPassWordSubmit('driverResetPassWordWinForm')" size="small">确 定
                </el-button>
            </div>
        </el-dialog>
        <DriverDetail v-if="win.winShow.showOilRecordDetail" :visible="win.winShow.showOilRecordDetail"
                      @close="hideDetailVehicle"
                      :currentRows="currentRows"/>
    </el-container>
</template>


<script>
    import {Api, Common, Http, Validate} from 'src/global'
    import DatadictionaryName from "../../common/select/DatadictionaryName";
    import DriverDetail from "./DriverDetail";

    export default {
        components: {DriverDetail, DatadictionaryName},
        data() {
            let permission = { //权限
                add: '/driver/add',
                modify: '/driver/modify',
                delete: '/driver/delete',
                resetPassWord: '/driver/resetPassWord',
                excelDownload: '/driver/excelDownload',
                modifyBankCard: '/driver/modifyBankCard',
                driverDetail: '/driver/driverDetail',
                certificatesManage: '/driver/certificatesManage',
                cancel: '/driver/cancel'
            };
            return {
                Validate: Validate,
                btnLoading: true,
                isLoading: true,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    name: '',
                    type: '',
                    linkMan: '',
                    deleteFlag: '',
                    contact: '',
                    reviewType: ''
                },
                driverAddWinModel: {
                    name: '',
                    type: 'CAR_TEAM',
                    linkMan: '',
                    contact: '',
                    username: '',
                    createUser: '',
                    modifyUser: '',
                    nature: 'SELF_SUPPORT',
                    // accountType: '',
                    // payee: '',
                    // openingBank: '',
                    // openingBankBranch: '',
                    // dueBankCardNo: ''
                },
                driverEditWinModel: {},
                certificatesManageEditWinModel: {
                    idCardImage: '',
                    drivingLicenceImage: ''
                },
                currentRows: null,//操作行的数据
                driverBankCardEditWinModel: {},
                driverDetailsWinModel: {
                    createTime: '',
                    modifyTime: '',
                    deleteFlag: '',
                    orgCode: '',
                    name: '',
                    mobile: '',
                    idCardNo: '',
                    drivingLicence: '',
                    nature: '',
                    drivingLicenceValidDate: '',
                    certificateValidDate: '',
                    idCardImage: '',
                    certificateImage: '',
                    drivingLicenceImage: '',
                    orgName: '',
                    // accountType: '',
                    // payee: '',
                    // openingBank: '',
                    // openingBankBranch: '',
                    // dueBankCardNo: '',
                    drivingPermitImage: '',
                    operatingLicenseImage: '',
                    warrantyImage: ''
                },
                passWordWinModel: {
                    password: '',
                    againPassword: '',
                    id: ''
                },
                verification: {//表单验证
                    orgCode: [
                        {required: true, message: '请选择区域', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    againPassword: [
                        {required: true, message: '请再次输入密码', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'},
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {pattern: /^[1][0-9]{10}$/, message: '请输入正确的手机号'}
                    ],
                    idCardNo: [
                        //{required: true, message: '请输入身份证号', trigger: 'blur'},
                        {pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号'}
                    ],
                    /*drivingLicence: [
                        {required: true, message: '请输入身份证号', trigger: 'blur'}
                    ],*/
                    /*nature: [
                        {required: true, message: '请选择司机性质', trigger: 'blur'}
                    ]*/
                },
                win: {
                    winTitle: { //弹出框 表头
                        driverAddWinTitle: '新增司机',
                        driverEditWinTitle: '修改司机',
                        driverDetailsWinTitle: '查看司机信息',
                        driverResetPasswordWinTitle: '重置密码',
                        driverBankCardEditWinTitle: '修改银行卡信息',
                        certificatesManageWinTitle: '证件维护'
                    },
                    winShow: {//是否显示弹框
                        driverAddWin: false,
                        driverEditWin: false,
                        driverDetailsWin: false,
                        driverResetPassWordWin: false,
                        driverBankCardEditWin: false,
                        showOilRecordDetail: false,
                        certificatesManageWin: false
                    }
                },
                selections: [],
                permission: permission,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                tableHeight: window.innerHeight > 800 ? 480 : null
            }
        },
        watch: { //数据监听
            selections(val) {
                //this.buttonDisabled.auditButtonDisabled = val.length <= 0
            },
            'win.winShow.certificatesManageWin'(val) {
                let vm = this;
                if (!val) {
                    vm.$refs.certificateImage.clearFileList();
                    vm.$refs.idCardImage.clearFileList();
                }
            },
            // 'model.driverAddWinModel.idCardNo'(val) {
            //     this.model.driverAddWinModel.drivingLicence = val;
            // },
            // 'model.driverEditWinModel.idCardNo'(val) {
            //     this.model.driverEditWinModel.drivingLicence = val;
            // },
            // 'model.certificatesManageEditWinModel.idCardNo'(val) {
            //     this.model.certificatesManageEditWinModel.drivingLicence = val;
            // },
            deep: true
        },
        computed: {},
        mounted() { //立即执行
            this.searchDriverForMainList();
        },
        methods: {
            searchDriverForMainList() {//main 查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.driver.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                })
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchDriverForMainList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchDriverForMainList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            resetMainSearchParam() {
                this.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    name: '',
                    type: '',
                    linkMan: '',
                    deleteFlag: '',
                    contact: '',
                    reviewType: ''
                }
            },
            //table
            handlerChange(rows) {//选中时触发
                this.selections = rows
            },
            handleRowHandle(row) {
                this.detailsDriverWinShow(row);
            },
            hideDetailVehicle() {
                this.win.winShow.showOilRecordDetail = false;
            },
            // operationClick(id, row) {
            //     const _this = this;
            //     switch (id) {
            //         case "1"://编辑
            //             _this.editDriverWinShow(row)
            //             break;
            //         case "2"://删除
            //             _this.deleteDriverSubmit(row)
            //             break;
            //         case "3"://重置密码
            //             _this.resetDriverPassWordWinShow(row)
            //             break;
            //         case "4"://修改银行卡信息
            //             _this.editDriverBankCardWinShow(row)
            //             break;
            //         case "5"://查看操作详情
            //             _this.driverDetailShow(row)
            //             break;
            //         case "6"://证件维护
            //             _this.editCertificatesDetailShow(row)
            //             break;
            //         case "7"://注销
            //             _this.cancel(row)
            //             break;
            //         default:
            //     }
            // },
            //show
            addDriverWinShow() {
                this.win.winShow.driverAddWin = true
            },
            editDriverWinShow(row) {
                const _this = this
                Http.get(Api.driver.getDriverById, {params: {'id': row.id}}, result => {
                    this.resetDriverEditWin()
                    _this.win.winShow.driverEditWin = true

                    setTimeout(() => {
                        let org = {code: result.result.orgCode, name: result.result.orgName}
                        _this.$refs.modifyDriverOrgSelect.setCurrentOrg(org)
                        _this.driverEditWinModel = result.result
                    }, 0)
                })
            },
            //证件维护相关
            editCertificatesDetailShow(row) {
                const _this = this
                Http.get(Api.driver.getDriverById, {params: {'id': row.id}}, result => {
                    this.resetDriverEditWin()
                    _this.win.winShow.certificatesManageWin = true
                    setTimeout(() => {
                        _this.certificatesManageEditWinModel = result.result
                        _this.$refs.idCardImage.setFileList(_this.certificatesManageEditWinModel.idCardImage.split(","));
                        _this.$refs.certificateImage.setFileList(_this.certificatesManageEditWinModel.drivingLicenceImage.split(","));
                    }, 0)
                })
            }
            ,
            editDriverBankCardWinShow(row) {
                const _this = this
                Http.get(Api.driver.getDriverById, {params: {'id': row.id}}, result => {
                    this.resetDriverBankCardEditWin()
                    _this.win.winShow.driverBankCardEditWin = true
                    setTimeout(() => {
                        _this.driverBankCardEditWinModel = result.result
                    }, 0)
                })
            },
            detailsDriverWinShow(row) {
                const _this = this;
                Http.get(Api.driver.getDriverById, {params: {'id': row.id}}, result => {
                    this.resetDriverDetailsWin()
                    _this.driverDetailsWinModel = result.result
                    _this.win.winShow.driverDetailsWin = true
                })
            },
            resetDriverPassWordWinShow(row) {
                this.passWordWinModel.id = row.id
                this.win.winShow.driverResetPassWordWin = true
            },
            //submit
            addDriverWinSubmit(formName) {
                let _this = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.driver.add, _this.driverAddWinModel, function (res) {
                            _this.resetDriverAddWin();
                            _this.win.winShow.driverAddWin = false
                            _this.searchDriverForMainList();
                        })
                    }
                })
            },
            editDriverWinSubmit(formName) {
                let _this = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.driver.modify, _this.driverEditWinModel, function (res) {
                            _this.resetDriverEditWin()
                            _this.win.winShow.driverEditWin = false
                            _this.searchDriverForMainList();
                        })
                    }
                })
            },
            editCertificatesWinSubmit(formName) {
                let _this = this
                _this.certificatesManageEditWinModel.idCardImage = _this.$refs.idCardImage.getFileList().join(",");
                _this.certificatesManageEditWinModel.drivingLicenceImage = _this.$refs.certificateImage.getFileList().join(",");
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.driver.modify, _this.certificatesManageEditWinModel, function (res) {
                            _this.resetDriverEditWin()
                            _this.win.winShow.certificatesManageWin = false
                            _this.searchDriverForMainList();
                        })
                    }
                })
            },
            // editBankCardDriverWinSubmit(formName) {
            //     let _this = this
            //     this.$refs[formName].validate((valid) => {
            //         if (valid) {
            //             Http.post(Api.driver.modifyBankCard, _this.driverBankCardEditWinModel, function (res) {
            //                 _this.resetDriverBankCardEditWin()
            //                 _this.win.winShow.driverBankCardEditWin = false
            //                 _this.searchDriverForMainList();
            //             })
            //         }
            //     })
            // },
            deleteDriverSubmit(row) {
                const _this = this
                var ids = []
                ids.push(row.id)
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.driver.delete, ids, result => {
                        _this.searchDriverForMainList()
                    })
                })
            },
            resetPassWordSubmit(formName) {
                const _this = this;
                this.$refs[formName].validate((valid) => {
                    if (Object.is(this.passWordWinModel.password, this.passWordWinModel.againPassword)) {
                        if (valid) {
                            Http.post(Api.driver.resetPassWord, _this.passWordWinModel, result => {
                                _this.$message({
                                    message: "成功重置密码",
                                    type: 'success'
                                });
                                _this.win.winShow.driverResetPassWordWin = false;//关闭窗口
                                _this.resetPasswordWin();
                            })
                        }
                    } else {
                        _this.$message({
                            message: "两次输入密码不一致,请重新输入",
                            type: 'error'
                        });
                    }
                })
            },
            //reset
            resetPasswordWin() {
                this.passWordWinModel = {
                    password: '',
                    againPassword: '',
                    id: ''
                }
            },
            resetDriverAddWin() {//重置司机新增form
                this.driverAddWinModel = {
                    name: '',
                    type: 'CAR_TEAM',
                    linkMan: '',
                    contact: '',
                    username: '',
                    createUser: '',
                    modifyUser: '',
                    // accountType: '',
                    // payee: '',
                    // openingBank: '',
                    // openingBankBranch: '',
                    // dueBankCardNo: ''
                }
            },
            resetDriverEditWin() {//重置司机新增form
                this.driverEditWinModel = {
                    name: '',
                    type: 'CAR_TEAM',
                    linkMan: '',
                    contact: '',
                    username: '',
                    createUser: '',
                    modifyUser: '',
                }
            },
            // resetDriverBankCardEditWin() {
            //     this.driverBankCardEditWinModel = {
            //         accountType: '',
            //         payee: '',
            //         openingBank: '',
            //         openingBankBranch: '',
            //         dueBankCardNo: ''
            //     }
            // },
            resetDriverDetailsWin() {//重置司机新增form
                this.driverDetailsWinModel = {
                    name: '',
                    type: 'CAR_TEAM',
                    linkMan: '',
                    contact: '',
                    username: '',
                    createUser: '',
                    modifyUser: '',
                    // accountType: '',
                    // payee: '',
                    // openingBank: '',
                    // openingBankBranch: '',
                    // dueBankCardNo: ''
                }
            },
            exportExcelSubmit() {
                let _this = this;
                _this.btnLoading = false;
                let model = _.cloneDeep(_this.searchParam);
                model.pageSize = 3000;
                model.currentPage = 1;
                Http.get(Api.driver.getExcelData, {params: model}, result => {
                    //导出油卡
                    let header = ['所属组织', '姓名', '手机号', '身份证', '驾驶证', '司机性质', '司机状态', '驾驶证失效日期', '从业资格证失效日期', '创建人', '创建时间'];
                    let filterVal = ['orgCode', 'name', 'mobile', 'idCardNo', 'drivingLicence', {
                        type: 'dictionary',
                        'code': 'DRIVER_TYPE',
                        'name': 'nature'
                    }, {
                        type: 'dictionary',
                        'code': 'DRIVER_STATUS',
                        'name': 'deleteFlag'
                    }, 'drivingLicenceValidDate', 'certificateValidDate', 'createUser', 'createTime'];
                    Common.excel.downloadExl(result.result, header, filterVal, "司机基础信息导出");
                    _this.btnLoading = true;
                }, () => {
                    _this.btnLoading = true;
                })
            },
            driverDetailShow(row) {
                this.currentRows = row;
                this.win.winShow.showOilRecordDetail = true;
            },
            cancel(row) {
                let vm = this;
                console.log(row.id)
                vm.$confirm("您确认要注销该司机吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.driver.cancel, {id: row.id}, result => {
                        vm.searchDriverForMainList();
                    })
                })
            }
        }
    }
</script>
