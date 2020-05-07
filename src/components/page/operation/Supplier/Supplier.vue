<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 外请运力</el-breadcrumb-item>
                <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form :model="searchParam" label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="供应商名称:">
                            <el-input v-model.trim="searchParam.name"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <org-select v-model="searchParam.belongOrgCode" style="display: block;"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商性质:" prop="nature">
                            <dictionary-select v-model="searchParam.nature" style="display: block"
                                               size="small" option-name="SUPPLIER_NATURE" select-one="true"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商类型:">
                            <dictionary-select v-model="searchParam.type" style="display: block" size="small"
                                               option-name="SUPPLIER_TYPE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="押金状态:">
                            <dictionary-select v-model="searchParam.depositStatus"
                                               size="small" option-name="SUPPLIER_DEPOSIT_STATUS"
                                               style="display: block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select v-model="searchParam.reviewType" style="display: block"
                                               size="small" option-name="AUDIT_STATUS"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="操作状态:">
                            <dictionary-select v-model="searchParam.operationStatus"
                                               style="display: block"
                                               size="small" option-name="SUPPLIER_OPERATION_STATUS"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系人:">
                            <el-input v-model="searchParam.linkMan"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-col :span="6">
                    <el-form-item label="联系方式:">
                        <el-input v-model="searchParam.contact"/>
                    </el-form-item>
                </el-col>
                <el-col :span="6" style="float: right">
                    <el-form-item style="float: right">
                        <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">
                            查询
                        </el-button>
                        <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addSupplierWinShow"
                       v-permission="'/supplier/add'">新增
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addSupplierPlatFormWinShow"
                       v-permission="'/supplier/platform'">新增平台公司
            </el-button>
            <el-button size="mini" type="primary" :disabled="multipleSelection.length != 1" @click="invalidSupplier"
                       v-permission="'/supplier/invalidResult'">作废
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-download" @click="exportData"
                       v-permission="'/supplier/excelDownload'">导出
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      @row-dblclick="detailSupplierShow"
                      border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40"/>
                <el-table-column align="center" label="大区" prop="regionCode" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="分区" prop="belongOrgCode" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="供应商名称" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="detailSupplierShow(scope.row)">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="供应商性质" prop="nature" min-width="120"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SUPPLIER_NATURE"
                                                v-model="scope.row.nature"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="供应商类型" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SUPPLIER_TYPE"
                                                v-model="scope.row.type"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="联系人" prop="linkMan" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="联系方式" prop="contact" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="邮箱" prop="email" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结款周期" prop="payingCycle" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="押金状态" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SUPPLIER_DEPOSIT_STATUS"
                                                v-model="scope.row.depositStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="押金金额" prop="depositAmount" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="审核状态" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS"
                                                v-model="scope.row.reviewType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="审核意见" prop="auditView" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作状态" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SUPPLIER_OPERATION_STATUS"
                                                v-model="scope.row.operationStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="作废原因" prop="invalidResult" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="创建人" prop="createUser" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="创建时间" prop="createTime" min-width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="修改人" prop="modifyUser" min-width="120"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="修改时间" prop="modifyTime" min-width="150"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="150">
                    <template slot-scope="scope">
                        <el-button v-permission="'/supplier/modify'" :disabled="scope.row.status === 'BEEN_ABANDONED'"
                                   size="mini" type="text" icon="el-icon-edit"
                                   @click="updateSupplierWinShow(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/supplier/delete'" icon="el-icon-delete" size="mini"
                                   @click="deleteSupplierSubmit(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/supplier/detail'" size="mini"
                                   @click="watchGrantList(scope.row)">操作详情
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
        <!-------------------------------------------------------S  新增供应商win------------------------------------>
        <el-dialog :title="win.winTitle.supplierAddWinTitle" :visible.sync="win.winShow.supplierAddWin" width="800px"
                   custom-class="myDialog">
            <el-form :model="supplierAddWinModel" :rules="verification" ref="supplierAddWinForm"
                     label-width="120px" size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商名称:" prop="name">
                            <el-input v-model.trim="supplierAddWinModel.name"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="color: red">
                        <el-form-item label="名称示例:" class="demo">
                            XXXXXXXXXX有限公司
                        </el-form-item>

                        <!--<el-form-item label="所属区域:" prop="belongOrgCode">-->
                        <!--<org-select v-model="supplierAddWinModel.belongOrgCode" style="display: block;"-->
                        <!--ref="modifySupplierOrgCode"></org-select>-->
                        <!--</el-form-item>-->
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商性质:" prop="nature">
                            <dictionary-select v-model="supplierAddWinModel.nature" style="display: block;" disabled
                                               size="small" option-name="SUPPLIER_NATURE" select-one="true"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供应商类型:" prop="type">
                            <dictionary-select v-model="supplierAddWinModel.type" style="display: block"
                                               size="small" option-name="SUPPLIER_TYPE" select-one="true"
                                               :exclude-options="exclude_option_supplier"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="联系人:" prop="linkMan">
                            <el-input v-model="supplierAddWinModel.linkMan"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式:" prop="contact">
                            <el-input v-model="supplierAddWinModel.contact"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="邮箱:" prop="email">
                            <el-input v-model="supplierAddWinModel.email"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结款周期:" prop="payingCycle">
                            <el-input v-model.number="supplierAddWinModel.payingCycle"
                                      @change="payingCycle"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="押金状态:" prop="depositStatus">
                            <dictionary-select style="display: block" size="small"
                                               v-model="supplierAddWinModel.depositStatus"
                                               option-name="SUPPLIER_DEPOSIT_STATUS"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="押金金额" prop="depositAmount" :rules="Validate.money">
                            <el-input type="number" placeholder="请填写金额" style="display: block"
                                      v-model="supplierAddWinModel.depositAmount"
                                      :disabled="supplierAddWinModel.depositStatus==='UN_DEPOSIT'"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="账户名称" prop="payee">
                            <el-input v-model="supplierAddWinModel.payee" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收款账号" prop="dueBankCardNo">
                            <el-input v-model="supplierAddWinModel.dueBankCardNo" style="display: block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收款银行" prop="dueBank" :rules="Validate.required('收款银行',true)">
                            <el-input v-model="supplierAddWinModel.dueBank" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="开户支行" prop="openingBank" :rules="Validate.required('请输入开户支行',true)">
                            <el-input v-model="supplierAddWinModel.openingBank" style="display: block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="right">
                <el-button @click="resetSupplierAddWin" size="small">取 消</el-button>
                <el-button type="primary" @click="addSupplierWinSubmit('supplierAddWinForm')" size="small">确 定
                </el-button>
            </div>
        </el-dialog>
        <!-------------------------------------------------------E  新增供应商win------------------------------------>


        <!-------------------------------------------------------S  修改供应商win------------------------------------>
        <el-dialog :title="win.winTitle.supplierEditWinTitle" :visible.sync="win.winShow.supplierEditWin" width="800px"
                   custom-class="myDialog">
            <el-form :model="supplierEditWinModel" :rules="verification" ref="supplierEditWinForm"
                     label-width="120px" size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商名称:" prop="name">
                            <el-input v-model.trim="supplierEditWinModel.name"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="color: red">
                        <el-form-item label="名称示例:" class="demo">
                            XXXXXXXXXX有限公司
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="12">-->
                    <!--<el-form-item label="所属区域:" prop="belongOrgCode">-->
                    <!--<org-select v-model="supplierEditWinModel.belongOrgCode" style="display: block;"-->
                    <!--ref="modifySupplierOrgCode"></org-select>-->
                    <!--</el-form-item>-->
                    <!--</el-col>-->
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商性质:" prop="nature">
                            <dictionary-select v-model="supplierEditWinModel.nature" disabled style="display: block"
                                               size="small" option-name="SUPPLIER_NATURE" select-one="true"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供应商类型:" prop="type">
                            <dictionary-select v-model="supplierEditWinModel.type" style="display: block"
                                               size="small" option-name="SUPPLIER_TYPE" select-one="true"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="联系人:" prop="linkMan">
                            <el-input v-model="supplierEditWinModel.linkMan"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式:" prop="contact">
                            <el-input v-model="supplierEditWinModel.contact"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="邮箱:" prop="email">
                            <el-input v-model="supplierEditWinModel.email"/>
                        </el-form-item>
                    </el-col>
                    <!--<el-col :span="12">
                        <el-form-item label="收取火灾险服务费:" prop="insuranceFlag">
                            <dictionary-select style="display: block" size="small"
                                               v-model="supplierEditWinModel.insuranceFlag"
                                               option-name="BOOLEAN_FLAG"/>
                        </el-form-item>
                    </el-col>-->
                    <el-col :span="12">
                        <el-form-item label="结款周期:" prop="payingCycle">
                            <el-input v-model.number="supplierEditWinModel.payingCycle"
                                      @change="payingCycle"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="押金状态:" prop="depositStatus">
                            <dictionary-select style="display: block" size="small"
                                               v-model="supplierEditWinModel.depositStatus"
                                               option-name="SUPPLIER_DEPOSIT_STATUS"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="押金金额" prop="depositAmount" :rules="Validate.money">
                            <el-input type="number" placeholder="请填写金额" style="display: block"
                                      v-model="supplierEditWinModel.depositAmount"
                                      :disabled="supplierEditWinModel.depositStatus==='UN_DEPOSIT'"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="账户名称" prop="payee">
                            <el-input v-model="supplierEditWinModel.payee" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收款账号" prop="dueBankCardNo">
                            <el-input v-model="supplierEditWinModel.dueBankCardNo" style="display: block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收款银行" prop="dueBank" :rules="Validate.required('收款银行',true)">
                            <el-input v-model="supplierEditWinModel.dueBank" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="开户支行" prop="openingBank" :rules="Validate.required('请输入开户支行',true)">
                            <el-input v-model="supplierEditWinModel.openingBank" style="display: block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="right">
                <el-button @click="win.winShow.supplierEditWin = false && resetSupplierEditWin" size="small">取 消
                </el-button>
                <el-button type="primary" @click="editSupplierWinSubmit('supplierEditWinForm')" size="small">确 定
                </el-button>
            </div>
        </el-dialog>
        <!-------------------------------------------------------E  修改供应商win------------------------------------>

        <!-------------------------------------------------------操作详情------------------------------------>
        <SupplierDetail v-if="showOilRecordDetail" :visible="showOilRecordDetail" @close="hideDetailVehicle"
                        :currentRows="currentRows"/>
        <!-------------------------------------------------------操作详情END------------------------------------>

        <!--作废供应商-->
        <el-dialog :title="win.winTitle.invalidSupplier" :visible.sync="win.winShow.invalidSupplierWin" width="600px">
            <el-form :model="invalidSupplierForm" label-width="80px" size="small" :rules="verification"
                     ref="invalidSuppliers">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="作废原因:" prop="invalidResult">
                            <el-input type="textarea" placeholder="请输入作废(限定100字以内)"
                                      resize="none"
                                      autofocus="true"
                                      maxlength="100" style="width:400px" :rows="2"
                                      v-model="invalidSupplierForm.invalidResult"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="win.winShow.invalidSupplierWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="invalidSupplierSubmit('invalidSuppliers')"
                           size="small">确 定
                </el-button>
            </div>
        </el-dialog>

        <!--新增平台公司供应商win-->
        <el-dialog :title="win.winTitle.supplierAddPlatFormWinTitle" :visible.sync="win.winShow.supplierAddPlatFormWin"
                   width="700px">
            <el-form :model="supplierAddPlatFormWinModel" :rules="verification"
                     ref="supplierAddPlatFormWinModel" label-width="120px" size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商名称:" prop="name">
                            <el-input v-model.trim="supplierAddPlatFormWinModel.name"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类型:" prop="type">
                            <dictionary-select v-model="supplierAddPlatFormWinModel.type" disabled
                                               style="display: block"
                                               size="small" option-name="SUPPLIER_TYPE" select-one="true"
                                               :exclude-options="exclude_option_supplierType"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="联系人:" prop="linkMan">
                            <el-input v-model="supplierAddPlatFormWinModel.linkMan"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式:" prop="contact">
                            <el-input v-model="supplierAddPlatFormWinModel.contact"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收款银行:" prop="dueBank">
                            <el-input v-model="supplierAddPlatFormWinModel.dueBank"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收款人:" prop="payee">
                            <el-input v-model="supplierAddPlatFormWinModel.payee"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="开户行:" prop="dueBank">
                            <el-input v-model="supplierAddPlatFormWinModel.openingBank"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收款银行卡号:" prop="dueBankCardNo" :rules="Validate.bank">
                            <el-input v-model="supplierAddPlatFormWinModel.dueBankCardNo"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="right">
                <el-button @click="win.winShow.supplierAddPlatFormWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addSupplierPlatFormWinSubmit('supplierAddPlatFormWinModel')"
                           size="small">确 定
                </el-button>
            </div>
        </el-dialog>

        <!--修改平台公司供应商win-->
        <el-dialog :title="win.winTitle.supplierUpdatePlatFormWinTitle"
                   :visible.sync="win.winShow.supplierUpdatePlatFormWin"
                   width="700px">
            <el-form :model="supplierUpdatePlatFormWinModel" :rules="verification"
                     ref="supplierUpdatePlatFormWinModel" label-width="120px" size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商名称:" prop="name">
                            <el-input readonly v-model.trim="supplierUpdatePlatFormWinModel.name"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类型:" prop="type">
                            <dictionary-select v-model="supplierUpdatePlatFormWinModel.type" style="display: block"
                                               size="small" option-name="SUPPLIER_TYPE" select-one="true" readonly
                                               :exclude-options="exclude_option_supplierType"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="联系人:" prop="linkMan">
                            <el-input v-model="supplierUpdatePlatFormWinModel.linkMan"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系方式:" prop="contact">
                            <el-input v-model="supplierUpdatePlatFormWinModel.contact"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收款银行:" prop="dueBank">
                            <el-input v-model="supplierUpdatePlatFormWinModel.dueBank"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收款人:" prop="payee">
                            <el-input v-model="supplierUpdatePlatFormWinModel.payee"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="开户行:" prop="dueBank">
                            <el-input v-model="supplierUpdatePlatFormWinModel.openingBank"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收款银行卡号:" prop="dueBankCardNo" :rules="Validate.bank">
                            <el-input v-model="supplierUpdatePlatFormWinModel.dueBankCardNo"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="right">
                <el-button @click="win.winShow.supplierUpdatePlatFormWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="updateSupplierPlatFormWinSubmit('supplierUpdatePlatFormWinModel')"
                           size="small">确 定
                </el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Api, Common, Constant, Http, Validate} from 'src/global';
    import DatadictionaryName from "../../../common/select/DatadictionaryName";
    import SupplierDetail from "./SupplierDetail";

    export default {
        components: {SupplierDetail, DatadictionaryName},
        data() {
            const _isempty = obj => {
                if (typeof obj == "undefined" || obj == null || obj === "") {
                    return true;
                } else {
                    return false;
                }
            }
            var validatePass = (rule, value, callback) => {
                if (_isempty(value)) {
                    callback()
                } else if (typeof value === "string") {
                    callback(new Error('请输入正整数'));
                } else if ((value < 7) || (value % 1 !== 0) || (value.toString().length > 3)) {
                    callback(new Error('请输入不小于7的正整数，且位数小于4位'));
                } else {
                    callback();
                }
            };
            let validatePassTel = (rule, value, callback) => {
                const phone = /^[1][0-9]{10}$/
                const tel = /^0\d{2,3}-\d{7,8}$/
                if (!phone.test(value) && !tel.test(value)) {
                    callback(new Error('请输入正确的号码'));
                } else {
                    callback();
                }
            }
            return {
                initializeModel: {},
                Validate: Validate,
                Constant: Constant,
                isLoading: true,
                btnLoading: true,
                Api: Api,
                showOilRecordDetail: false,
                invalidSupplierForm: {
                    invalidResult: '',
                    ids: []
                },
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    name: '',
                    type: '',
                    linkMan: '',
                    contact: '',
                    reviewType: 'PASS',
                    depositStatus: '',
                    operationStatus: '',
                    belongOrgCode: '',
                    nature: '',
                },
                win: {
                    winTitle: { //弹出框 表头
                        supplierAddWinTitle: '新增供应商',
                        supplierEditWinTitle: '修改供应商',
                        supplierDetailsWinTitle: '查看供应商信息',
                        supplierAddPlatFormWinTitle: '新增平台公司',
                        supplierUpdatePlatFormWinTitle: '修改平台公司',
                        invalidSupplier: '作废供应商',
                    },
                    winShow: {//是否显示弹框
                        supplierAddWin: false,
                        supplierEditWin: false,
                        supplierDetailsWin: false,
                        supplierAddPlatFormWin: false,
                        supplierUpdatePlatFormWin: false,
                        invalidSupplierWin: false
                    }
                },
                supplierAddWinModel: {//新增供应商字段
                    name: '',
                    type: 'CAR_TEAM',
                    linkMan: '',
                    contact: '',
                    nature: 'ENTERPRISE',
                    email: '',
                    username: '',
                    createUser: '',
                    modifyUser: '',
                    oilCard: '',
                    includeList: [],
                    depositStatus: '',
                    isExist: '',
                    depositAmount: '',
                    contractStartTime: '',
                    contractEndTime: '',
                    payingCycle: '',
                    // belongOrgCode: '',
                    // insuranceFlag:''
                    payee: '',
                    dueBankCardNo: '',
                    dueBank: '',
                    openingBank: '',
                },
                supplierEditWinModel: {},//修改供应商字段
                supplierDetailsWinModel: {//查看供应商基本信息
                    includeList: [],
                    lineList: []
                },
                supplierAddPlatFormWinModel: { // 新增平台公司字段
                    name: '',
                    type: 'PLANTFORM_COMPANY',
                    linkMan: '',
                    contact: '',
                    payee: '',
                    dueBank: '',
                    dueBankCardNo: '',
                    openingBank: '',
                    username: '',
                    createUser: '',
                    modifyUser: '',
                    oilCompany: '',
                    privatePayee: '',
                    privateDueBank: '',
                    privateOpeningBank: '',
                    privateDueBankCardNo: '',
                    oilCompanyShow: false,
                    depositAmount: '',
                    depositStatus: ''
                },
                supplierUpdatePlatFormWinModel: {},//修改平台公司字段
                exclude_option_supplier: [, , 'PLANTFORM_COMPANY'],
                exclude_option_supplierType: ['CAR_TEAM', 'DEPARTMENT_OF_INFORMATION',],
                verification: {//表单验证
                    name: [
                        {required: true, message: '请输入供应商名称', trigger: 'blur'}
                    ],
                    linkMan: [
                        {required: true, message: '请输入联系人', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择供应商类型', trigger: 'blur'}
                    ],
                    contact: [
                        {required: true, message: '请输入联系方式', trigger: 'blur'},
                        {validator: validatePassTel}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        Validate.email
                    ],
                    invalidResult: [
                        {required: true, message: '请输入作废原因', trigger: 'blur'}
                    ],
                    // belongOrgCode: [
                    //     {required: true, message: '请输入所属区域', trigger: 'blur'}
                    // ],
                    nature: [
                        {required: true, message: '请输入供应商性质', trigger: 'blur'}
                    ],
                    payingCycle: [
                        {validator: validatePass}
                    ],
                    payee: [
                        {required: true, message: '请输入账户名称', trigger: 'blur'},
                        {pattern: /^.*(公司)$/, message: '账户名称格式:XXXX公司'}],
                    name: [
                        {required: true, message: '请输入供应商名称', trigger: 'blur'},
                        {pattern: /^.*(公司)$/, message: '供应商名称格式:XXXX公司'}
                    ],
                    dueBankCardNo: [
                        {required: true, message: '请输入收款账号', trigger: 'blur'},
                        {pattern: /^\d{0,30}$/, message: '银行卡格式不正确!'},
                    ],
                    payingCycle: [
                        {required: true, message: '请输入结款周期', trigger: 'blur'}
                    ]

                },
                selections: [],
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
                watch: { //数据监听
                    selections(val) {
                        // this.buttonDisabled.auditButtonDisabled = val.length != 1
                        // this.buttonDisabled.supplierOilCardDisable = val.length != 1
                        // this.buttonDisabled.inValidMoneys = val.length != 1
                    },
                    'win.winShow.supplierAddWin'(val) {
                        const _this = this;
                        if (!val) {

                        }
                    },
                    deep: true
                },
                tableHeight: window.innerHeight > 800 ? 480 : null
            }
        },
        created() {
            this.searchList();
        },
        mounted() { //立即执行
            this.searchList();
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
        },
        methods: {
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    name: '',
                    type: '',
                    linkMan: '',
                    contact: '',
                    reviewType: 'PASS',
                    depositStatus: '',
                    operationStatus: '',
                    // belongOrgCode: ''
                }
            },
            searchList() {//查询
                this.isLoading = true;
                Http.get(Api.supplier.page, {params: this.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    this.isLoading = false;
                }, () => {
                    this.isLoading = false;
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
            handleSelectionChange(rows) {
                this.multipleSelection = rows;
            },
            addSupplierWinShow() {//显示新增供应商界面
                this.win.winShow.supplierAddWin = true
            },
            addSupplierPlatFormWinShow() { //显示新增平台公司界面
                this.win.winShow.supplierAddPlatFormWin = true
            },
            invalidSupplier() { // 显示作废界面
                this.win.winShow.invalidSupplierWin = true
            },
            updateSupplierWinShow(row) {//显示修改界面
                Http.get(Api.supplier.queryById, {params: {'id': row.id}}, result => {
                    if (result) {
                        if ("PLANTFORM_COMPANY" == row.type) {
                            this.supplierUpdatePlatFormWinModel = result.result;
                            this.win.winShow.supplierUpdatePlatFormWin = true;
                        } else {
                            this.win.winShow.supplierEditWin = true;
                            this.supplierEditWinModel = result.result;
                        }
                    }
                })
            },
            resetSupplierAddWin() {//重置供应商新增form
                this.supplierAddWinModel = {
                    name: '',
                    nature: 'ENTERPRISE',
                    type: 'CAR_TEAM',
                    linkMan: '',
                    email: '',
                    username: '',
                    createUser: '',
                    modifyUser: '',
                    oilCard: '',
                    includeList: [],
                    depositStatus: '',
                    isExist: '',
                    depositAmount: '',
                    contractStartTime: '',
                    contractEndTime: '',
                    payingCycle: '',
                    // belongOrgCode: ''
                }
                this.win.winShow.supplierAddWin = false;
            },
            resetSupplierPlatAddWin() {//重置平台公司新增form
                this.supplierAddPlatFormWinModel = {
                    name: '',
                    type: 'PLANTFORM_COMPANY',
                    linkMan: '',
                    contact: '',
                    payee: '',
                    dueBank: '',
                    dueBankCardNo: '',
                    openingBank: '',
                    username: '',
                    createUser: '',
                    modifyUser: '',
                    oilCompany: '',
                    privatePayee: '',
                    privateDueBank: '',
                    privateOpeningBank: '',
                    privateDueBankCardNo: '',
                    oilCompanyShow: false,
                    depositAmount: '',
                    depositStatus: ''
                }
            },
            resetSupplierEditWin() {
                this.supplierEditWinModel = this.cloneMode().supplierEditWinModel;
            },
            payingCycle(value) {
                if (value) {
                    this.verification.depositStatus[0].required = true
                    this.verification.depositAmount[0].required = false
                    this.supplierAddWinModel.depositStatus = 'UN_DEPOSIT'
                    this.supplierAddWinModel.depositAmount = ''
                    this.supplierEditWinModel.depositStatus = 'UN_DEPOSIT'
                    this.supplierEditWinModel.depositAmount = ''
                } else {
                    this.verification.depositStatus[0].required = true
                    this.verification.depositAmount[0].required = true
                    this.supplierAddWinModel.depositStatus = 'DEPOSITED'
                    this.supplierAddWinModel.depositAmount = 20000
                    this.supplierEditWinModel.depositStatus = 'DEPOSITED'
                    this.supplierEditWinModel.depositAmount = 20000
                }
            },
            //submit
            addSupplierWinSubmit(formName) {
                let contractStartTime = this.supplierAddWinModel.contractStartTime;
                let contractEndTime = this.supplierAddWinModel.contractEndTime;
                if (contractStartTime || contractEndTime) {
                    if (contractStartTime >= contractEndTime) {
                        return this.$message.warning("开始时间不能大于或者等于结束时间");
                    }
                }
                if (this.supplierAddWinModel.payingCycle && this.supplierAddWinModel.payingCycle < 7) {
                    return this.$message.warning("最小结算周期不能小于七天");
                }
                if (!this.supplierAddWinModel.depositStatus && this.supplierAddWinModel.depositAmount) {
                    return this.$message.warning("请选择押金状态");
                }
                if (this.supplierAddWinModel.depositStatus === 'DEPOSITED' && this.supplierAddWinModel.depositAmount < 20000) {
                    return this.$message.warning("已提交押金的金额不能小于20000元");
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.supplier.add, this.supplierAddWinModel, response => {
                            this.win.winShow.supplierAddWin = false;
                            this.searchList();
                            this.resetSupplierAddWin();
                        })
                    }
                })
            },
            editSupplierWinSubmit(formName) {
                let _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let contractStartTime = this.supplierEditWinModel.contractStartTime;
                        let contractEndTime = this.supplierEditWinModel.contractEndTime;
                        if (contractStartTime || contractEndTime) {
                            if (contractStartTime >= contractEndTime) {
                                return _this.$message.warning("开始时间不能大于或者等于结束时间");
                            }
                        }
                        if (this.supplierEditWinModel.payingCycle && this.supplierEditWinModel.payingCycle < 7) {
                            return this.$message.warning("最小结算周期不能小于七天");
                        }
                        if (this.supplierEditWinModel.depositStatus === 'DEPOSITED' && this.supplierEditWinModel.depositAmount < 20000) {
                            return this.$message.warning("已提交押金的金额不能小于20000元");
                        }
                        Http.post(Api.supplier.modifySupplier, this.supplierEditWinModel, function (res) {
                            _this.win.winShow.supplierEditWin = false;
                            _this.searchList();
                            _this.$message.success("修改成功");
                            _this.hideDetailVehicle();
                        })
                    }
                })
            },
            deleteSupplierSubmit(row) {
                const _this = this;
                var ids = [];
                ids.push(row.id);
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.supplier.delete, ids, result => {
                        _this.searchList()
                    })
                })
            },
            watchGrantList(row) {
                this.currentRows = row;
                this.showOilRecordDetail = true;
            },
            hideDetailVehicle() {
                this.showOilRecordDetail = false;
            },
            invalidSupplierSubmit(forName) {
                let _this = this;
                _this.multipleSelection.forEach((item) => {
                    _this.invalidSupplierForm.ids.push(item.id)
                })
                _this.$refs[forName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.supplierAudit.invalidResult, _this.invalidSupplierForm, function (result) {
                            _this.$message.success("作废成功");
                            _this.invalidSupplierForm.invalidResult = _this.cloneMode().invalidSupplierForm.invalidResult;
                            _this.invalidSupplierForm.ids = [];
                        }, function (error) {
                            _this.invalidSupplierForm.invalidResult = _this.cloneMode().invalidSupplierForm.invalidResult;
                            _this.invalidSupplierForm.ids = [];
                        });
                        _this.win.winShow.invalidSupplierWin = false
                    }
                })
            },
            addSupplierPlatFormWinSubmit(formName) {
                let _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.supplier.add, _this.supplierAddPlatFormWinModel, function (res) {
                            _this.resetSupplierPlatAddWin();
                            _this.win.winShow.supplierAddPlatFormWin = false;
                            _this.searchList();
                        })
                    }
                })
            },
            updateSupplierPlatFormWinSubmit(formName) {
                let _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.supplier.modify, _this.supplierUpdatePlatFormWinModel, function (res) {
                            _this.win.winShow.supplierUpdatePlatFormWin = false;
                            _this.$message.success("修改成功");
                            _this.searchList();
                        });
                    }
                })
            },
            detailSupplierShow(row) { //供应商详情------------------------------------
                if (this.$_permission('/operation/supplierDetail')) {
                    return this.$router.push({path: '/operation/supplierDetail', query: {id: row.id}})
                }
            },
            exportData() {
                this.btnLoading = false;
                let searchExportParam = _.cloneDeep(this.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.supplier.getExcelData, {params: searchExportParam}, response => {
                    let header = ['大区', '分区', '供应商名称', '供应商性质', '供应商类型', '联系人', '联系方式', '邮箱', '结款周期', '押金状态', '押金金额', '创建人', '创建时间', '审核状态',
                        '审核意见', '操作状态', '作废原因', '修改人', '修改时间'];
                    let filterVal = ['regionCode', 'belongOrgCode', 'name', {
                        type: 'dictionary',
                        'code': 'SUPPLIER_NATURE',
                        'name': 'nature'
                    }, {
                        type: 'dictionary',
                        'code': 'SUPPLIER_TYPE',
                        'name': 'type'
                    }, 'linkMan', 'contact', 'email', 'payingCycle', {
                        type: 'dictionary',
                        'code': 'SUPPLIER_DEPOSIT_STATUS',
                        'name': 'depositStatus'
                    }, 'depositAmount', 'createUser', 'createTime', {
                        type: 'dictionary',
                        'code': 'AUDIT_STATUS',
                        'name': 'reviewType'
                    }, 'auditView', {
                        type: 'dictionary',
                        'code': 'SUPPLIER_OPERATION_STATUS',
                        'name': 'operationStatus'
                    }, 'invalidResult', 'modifyUser', 'modifyTime'];
                    Common.excel.downloadExl(response.result, header, filterVal, "供应商基础信息导出");
                    this.btnLoading = true;
                }, () => {
                    this.btnLoading = true;
                })
            },
            uploadSuccess() {
                this.searchList();
            }
        }
    }
</script>
<style>
    .demo .el-form-item__label {
        color: red;
    }
</style>

