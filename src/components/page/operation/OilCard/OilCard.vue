<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 设备管理</el-breadcrumb-item>
                <el-breadcrumb-item>油卡管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="80px;">
            <el-form label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="油卡卡号:">
                            <el-input type="text" v-model="searchParam.cardNo" :clearable="true"
                                      placeholder="请输入卡号" style="min-width:200px">
                                <template slot="append">
                                    <el-popover
                                        placement="bottom"
                                        width="98%"
                                        trigger="click">
                                        <div style="width: 200px;">
                                            <el-input type="textarea"
                                                      :autosize="{ minRows: 6, maxRows: 8}" resize="none"
                                                      v-model.trim="searchParam.batchSelect"
                                                      placeholder="最多输入1000个号,进行查询。按ENTER键进行换行,按重置按钮进行清空"></el-input>
                                        </div>
                                        <el-button slot="reference" style="width:2%;">批量查询</el-button>
                                    </el-popover>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属组织:">
                            <org-select v-model="searchParam.orgCode" style="display: block;"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="油卡供应商:">
                            <dictionary-select v-model="searchParam.supplier"
                                               option-name="OIL_CARD_SUPPLIER"
                                               style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="类型:">
                            <dictionary-select v-model="searchParam.type"
                                               option-name="OIL_CARD_TYPE" style="display: block;"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="油卡创建时间:">
                            <el-date-picker
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width:100%;"
                                v-model="searchParam.createTime"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :clearable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="合作公司:">
                            <dictionary-select v-model="searchParam.cardCompany"
                                               option-name="OIL_CARD_COMPANY_ONLY_MA_AN_SHAN"
                                               style="display: block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="持卡人类型:">
                            <dictionary-select v-model="searchParam.cardholderType" style="display: block"
                                               option-name="OIL_CARD_CARD_HOLDER"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机:">
                            <driver-select v-model="searchParam.driverName" placeholder="请输入司机"
                                           style="display: block"></driver-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierName" placeholder="请输入供应商"
                                             style="display: block"></supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="用户:">
                            <user-select v-model="searchParam.userId" placeholder="请输入用户"
                                         style="display: block"></user-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆:">
                            <vehicle-select v-model="searchParam.vehicle" placeholder="请输入车辆"
                                            style="display: block"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否卡班:">
                            <dictionary-select v-model="searchParam.kabanFlag"  style="display: block;"
                                                     option-name="BOOLEAN_FLAG"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="启用/禁用:">
                            <dictionary-select v-model="searchParam.prohibit"  style="display: block;"
                                               option-name="PROHIBIT_STATUS"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="油卡状态:">
                            <dictionary-select v-model="searchParam.oilCardType"  style="display: block;"
                                               option-name="OIL_CANCELLATION"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="认领:">
                            <dictionary-select v-model="searchParam.cardClaimStatus"
                                               option-name="OIL_CLAIM" style="display: block;"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float:right" label-width="0">
                            <el-button type="text" v-show="!isMoreItemShow" @click="showMore" size="small">展开更多搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="showLess" size="small">收起搜索项<<
                            </el-button>
                            <el-button type="success" icon="el-icon-search" @click="searchOilCardList">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetWinform">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addBlackList"
                       v-permission="permission.addPermission">新增
            </el-button>
            <el-button size="mini" type="primary" @click="applyMoney" :disabled="disabled.applyMoneyDisabled"
                       v-permission="permission.applyMoneyPermission">充值
            </el-button>
            <el-button size="mini" type="primary" @click="bindVehicle" :disabled="disabled.bindOilCardDisabled"
                       v-permission="permission.bindVehiclePermission">绑定车辆
            </el-button>
            <el-button size="mini" type="primary" @click="grantOilCard" :disabled="disabled.sendOutCardDisabled"
                       v-permission="permission.grantPermission">下发
            </el-button>
            <el-button size="mini" type="primary" @click="oilUnworkedSubmit" :disabled="disabled.unworkedCardDisabled"
                       v-permission="permission.oilUnworkedPermission">回收
            </el-button>
            <el-button v-if="exportLoading" v-permission="permission.oilCardExportPermission" icon="el-icon-download"
                       type="primary" size="mini" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>
            <el-button size="mini" type="primary" @click="batchClaim"
                       :disabled="multipleSelection.length<=0"
                       v-permission="permission.claimedPermission">认领
            </el-button>
            <el-button size="mini" type="primary" @click="batchCancelClaim"
                       :disabled="multipleSelection.length<=0"
                       v-permission="permission.batchCancleClaimedPermission">取消认领
            </el-button>
            <el-button size="mini" type="primary" @click="cancellation" :disabled="multipleSelection.length<=0"
                       v-permission="permission.cancellationPermission">挂失
            </el-button>
            <el-button size="mini" type="primary" @click="updateBalance" :disabled="multipleSelection.length<=0"
                       v-permission="permission.updateBalancePermission">修改余额
            </el-button>
            <el-button size="mini" type="primary" @click="oilCardModifyStatusWin = true"
                       :disabled="multipleSelection.length<=0"
                       v-permission="permission.prohibit">启用/禁用
            </el-button>
            <el-button size="mini" type="primary" @click="updateOrgTime" :disabled="multipleSelection.length!=1"
                       v-permission="permission.updateOrgTimePermission">修改合作公司
            </el-button>
            <el-button icon="el-icon-download" type="primary" size="mini" style="margin-right: 8px;"
                       v-permission="'/oilCard/download'"
                       @click="Common.templateDownload.getExcel(Api.oilCard.getExcel,'油卡信息导入模板')">模板下载
            </el-button>
            <upload-excel :importUrl="Api.oilCard.upload" @success="uploadSuccess" btn-name="导入"
                          style="margin-left:1140px; margin-top:-28px;"
                          v-permission="permission.uploads"></upload-excel>
            <el-table class="content-table"
                      v-loading="isLoading"
                      element-loading-text="拼命加载中"
                      :data="searchResult.result"
                      border fit
                      highlight-current-row stripe
                      @selection-change="handleSelectionChange"
                      size="small">
                <el-table-column type="selection" fixed="left"></el-table-column>
                <el-table-column label="卡号" align="center" prop="cardNo" min-width="180px;"></el-table-column>
                <el-table-column label="所属大区" align="center" prop="regionOrg.name" min-width="140px;" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showOrgCodeByOilCard(scope.row)">{{scope.row.regionOrg.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="所属分区" align="center" prop="belongOrg.name" min-width="140px;" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showOrgCodeByOilCard(scope.row)">{{scope.row.belongOrg.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center" prop="type" min-width="120px">
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.type"
                                                option-name="OIL_CARD_TYPE"/>
                    </template>
                </el-table-column>
                <el-table-column label="合作公司" align="center" prop="cardCompany" min-width="180px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.cardCompany"
                                                option-name="OIL_CARD_COMPANY_ONLY_MA_AN_SHAN"/>
                    </template>
                </el-table-column>
                <el-table-column label="油卡供应商" align="center" prop="supplier" min-width="180px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.supplier"
                                                option-name="OIL_CARD_SUPPLIER"/>
                    </template>
                </el-table-column>
                <el-table-column label="持卡人" align="center" prop="cardholder" min-width="140px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="持卡人类型" align="center" prop="cardholderType" min-width="180px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.cardholderType"
                                                option-name="OIL_CARD_CARD_HOLDER"/>
                    </template>
                </el-table-column>
                <el-table-column label="待领取人" align="center" prop="waitPullOut" min-width="140px"></el-table-column>
                <el-table-column label="余额" align="center" prop="balanceAmount" min-width="140px"
                                 show-overflow-tooltip></el-table-column>
                <!--启用禁用-->
                <el-table-column label="启用/禁用" align="center" prop="prohibit" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!--<dictionary-select-name :value="scope.row.prohibit"-->
                        <!--option-name="OIL_CARD_PROHIBIT"/>-->
                        <span v-if="scope.row.prohibit">
                            {{'禁用'}}
                        </span>
                        <span v-if="!scope.row.prohibit">
                            {{'启用'}}
                        </span>
                    </template>
                </el-table-column>
                <!--oilCard禁用备注-->
                <el-table-column label="启用/禁用备注" align="center" prop="prohibitRemark" min-width="160" show-overflow-tooltip/>
                <el-table-column label="油卡状态" align="center" prop="oilCardType" min-width="120px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.deleteFlag">
                            {{ '已删除' }}
                        </span>
                        <dictionary-select-name :value="scope.row.oilCardType" v-if="!scope.row.deleteFlag"
                                                option-name="OIL_CANCELLATION"/>
                    </template>
                </el-table-column>
                <el-table-column label="是否卡班" align="center" prop="kabanFlag" min-width="120px">
                    <template slot-scope="scope">
                        {{scope.row.kabanFlag === true ? '是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column label="认领状态" align="center" prop="cardClaimStatus" min-width="120px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.cardClaimStatus"
                                                option-name="OIL_CLAIM"/>
                    </template>
                </el-table-column>
                <el-table-column label="派车单编号" align="center" prop="dispatchCode" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="运单编号" align="center" prop="waybillCode" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="认领组织" align="center" prop="cardClaimOrgCode" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="认领人" align="center" prop="cardClaimUser" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="认领时间" align="center" prop="cardClaimTime" min-width="160px"></el-table-column>
                <el-table-column label="创建人" align="center" prop="createUser" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" min-width="180px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="修改人" align="center" prop="modifyUser" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="修改时间" align="center" prop="modifyTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" align="center" prop="remark" min-width="100" show-overflow-tooltip/>
                <el-table-column label="柴油主卡号" align="center" prop="cardMasterNo" min-width="120" show-overflow-tooltip/>
                <el-table-column align="center" label="操作" fixed="right" min-width="280px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="watchGrantList(scope.row)"
                                   v-permission="permission.watchGrantPermission">查看详情
                        </el-button>
                        <el-button type="text" icon="el-icon-edit" size="mini"
                                   @click="modifyBlackList(scope.row)"
                                   v-permission="permission.modifyPermission"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini"
                                   @click="deleteList(scope.row)"
                                   v-permission="permission.deletePermission"></el-button>
                        <el-button type="text" size="mini" @click="resetPassword(scope.row)"
                                   v-permission="permission.resetPasswordPermission">重置密码
                        </el-button>
                        <el-button type="text" size="mini"
                                   @click="cancelClaim(scope.row)" v-permission="permission.cancelClaimPermission">取消认领
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 50, 100, 200]"
                    :page-size="searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>
        <el-dialog title="新增油卡信息" :visible.sync="addOilCardWin" width="800px" :before-close="handleClose">
            <el-form inline size="small" :model="addOilCardWinForm" label-width="120px" ref="addOilCardWinForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="卡号:" prop="cardNo">
                            <el-input v-model="addOilCardWinForm.cardNo" style="width: 215px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="油卡密码:" prop="password" :rules="Validate.bank">
                            <el-input v-model="addOilCardWinForm.password" style="width: 215px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型:" prop="type">
                            <dictionary-select v-model="addOilCardWinForm.type"
                                               option-name="OIL_CARD_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="油卡供应商:" prop="supplier">
                            <dictionary-select v-model="addOilCardWinForm.supplier"
                                               option-name="OIL_CARD_SUPPLIER" @change="addOilCardWinSupplier"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="showCardMasterNoWin">
                    <el-col :span="12">
                        <el-form-item label="柴油主卡:" prop="cardMasterNo">
                            <dictionary-select v-model="addOilCardWinForm.cardMasterNo" option-name="CARD_MASTER_NO"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合作公司:" prop="cardCompany">
                            <dictionary-select v-model="addOilCardWinForm.cardCompany"
                                               option-name="OIL_CARD_COMPANY_ONLY_MA_AN_SHAN"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属组织:" prop="orgCode">
                            <org-select v-model="addOilCardWinForm.orgCode"></org-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="余额:" prop="balanceAmount">
                            <el-input type="number" placeholder="请填写金额" style="width: 215px;"
                                      v-model="addOilCardWinForm.balanceAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否卡班:">
                            <el-checkbox size="medium" v-model="addOilCardWinForm.kabanFlag"></el-checkbox>
                            <span style="color: red;font-size: 6px;">(勾选为卡班)</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="submitBlackList('addOilCardWinForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改油卡信息" :visible.sync="modifyOilCardWin" width="800px" :before-close="handleClose">
            <el-form inline size="small" :model="modifyForm" label-width="120px" ref="modifyForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="卡号" prop="cardNo">
                            <label>{{modifyForm.cardNo}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类型:" prop="type">
                            <dictionary-select v-model="modifyForm.type"
                                               option-name="OIL_CARD_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="油卡供应商:" prop="supplier">
                            <dictionary-select v-model="modifyForm.supplier"
                                               option-name="OIL_CARD_SUPPLIER" @change="modifyOilCardWinSupplier"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合作公司:" prop="cardCompany">
                            <dictionary-select v-model="modifyForm.cardCompany"
                                               option-name="OIL_CARD_COMPANY_ONLY_MA_AN_SHAN"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" v-if="modifyCardMasterNoWin">
                        <el-form-item label="柴油主卡号:" prop="cardMasterNo">
                            <dictionary-select v-model="modifyForm.cardMasterNo" option-name="CARD_MASTER_NO"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="所属组织:" prop="orgCode">
                            <org-select v-model="modifyForm.orgCode"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="余额:" prop="balanceAmount">
                            <el-input type="number" placeholder="请填写金额" style="width: 215px;"
                                      v-model="modifyForm.balanceAmount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="是否卡班:">
                        <el-checkbox size="medium" v-model="modifyForm.kabanFlag"></el-checkbox>
                        <span style="color: red;font-size: 6px;">(勾选为卡班)</span>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="modifySubmitBlackList('modifyForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="油卡下发信息" :visible.sync="grantOilCardWin" width="700px" :before-close="handleClose">
            <el-form size="small" :model="grantOilCardForm" label-width="120px" ref="grantOilCardForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="下发类型:" prop="type">
                            <dictionary-select v-model="grantOilCardForm.type"
                                               option-name="OIL_CARD_GRANT_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="组织:" v-show="grantOilCardForm.type==='ORGCODE'" prop="organization">
                            <org-select v-model="grantOilCardForm.orgCode"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户:" v-show="grantOilCardForm.type==='USER'" prop="user">
                            <user-select v-model="grantOilCardForm.user"></user-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="sendOutWinSubmit('grantOilCardForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="绑定车辆" :visible.sync="bindOilCardWin" width="600px" :before-close="handleClose">
            <el-form size="small" :model="bindOilCardForm" label-width="120px" ref="bindOilCardForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="车牌号:" prop="vehicleCode">
                            <vehicle-select v-model="bindOilCardForm.vehicleCode" :type="TRAILER"
                                            :settlementMode="Constant.SETTLEMENT_MODE_TYPE.NO_LONG_TERM_OUT_INVITE" style="display: block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="bindWinSubmit('bindOilCardForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="充值申请" :visible.sync="rechargeApplyWin" width="800px" :before-close="handleClose">
            <el-form inline size="small" :model="rechargeApplyForm" label-width="150px" ref="rechargeApplyForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="油卡卡号" prop="cardNos">
                            <label style="width: 215px"><span style="color: #20a0ff">{{rechargeApplyForm.cardNo}}</span></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车牌号" v-show="rechargeApplyForm.vehicleCodeShow">
                            <label style="width: 215px"><span
                                style="color: #20a0ff">{{rechargeApplyForm.vehicleCode}}</span></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车辆油卡额度" prop="vehicleOilCardAmount"
                                      v-show="rechargeApplyForm.vehicleOilCardAmountShow">
                            <label style="width: 215px"><span style="color: #20a0ff">{{rechargeApplyForm.vehicleOilCardAmount}}</span></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="已充值油卡额度" prop="OilCardAmounted"
                                      v-show="rechargeApplyForm.oilCardAmountedShow">
                            <label style="width: 215px"><span style="color: #20a0ff">{{rechargeApplyForm.oilCardAmounted}}</span></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="剩余油卡额度" prop="restOilCardAmount"
                                      v-show="rechargeApplyForm.restOilCardAmountShow">
                            <label style="width: 215px"><span style="color: #20a0ff">{{rechargeApplyForm.restOilCardAmount}}</span></label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="充值方式" prop="rechargeMethod">
                            <dictionary-select style="display:block;" v-model="rechargeApplyForm.rechargeMethod"
                                               option-name="OIL_CARD_RECHARGE_METHOD"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="油卡余额" prop="initialBalance" style="margin-left: 5px;"
                                      v-show="rechargeApplyForm.cardCompany==='MA_AN_SHAN'">
                            <el-input type="number" placeholder="请填写金额" style="width: 215px;"
                                      v-model="rechargeApplyForm.initialBalance"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-show="rechargeApplyForm.cardCompany!=='MA_AN_SHAN'">
                        <el-form-item label="充值金额" prop="rechargeAmount" style="margin-left: 5px;">
                            <el-input type="number" placeholder="请填写金额" style="width: 215px;"
                                      v-model="rechargeApplyForm.rechargeAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-show="rechargeApplyForm.cardCompany==='MA_AN_SHAN'">
                        <el-form-item label="充值金额" prop="rechargeAmount" style="margin-left: 5px;">
                            <el-input type="number" placeholder="请填写金额" style="width: 215px;"
                                      v-model="rechargeApplyForm.rechargeAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="车辆属性" prop="operationMode" v-show="rechargeApplyForm.operationModeShow">
                            <dictionary-select style="display:block;" v-model="rechargeApplyForm.operationMode"
                                               option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="reason" label="充值理由:">
                            <el-input type="textarea" placeholder="请输入充值理由(限定100字以内)"
                                      v-model="rechargeApplyForm.rechargeRemark"
                                      resize="none"
                                      autofocus="true"
                                      maxlength="100"
                                      style="width:600px;" :rows="3">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="applyMoneyEtcList('rechargeApplyForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--油卡批量启用禁用-->
        <el-dialog title="批量启用禁用" :visible.sync="oilCardModifyStatusWin" width="800px" :before-close="handleClose">
            <el-form :model="oilCardStatusForm" ref="oilCardStatusForm" label-width="150px"
                     size="small"
                     align="center">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="使用状态:" label-width="100px">
                            <el-switch v-model="oilCardStatusForm.status"
                                       active-color="#13ce66"
                                       :active-value="0"
                                       active-text="启用"
                                       inactive-color="#ff4949"
                                       :inactive-value="1"
                                       inactive-text="禁用"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="启用或禁用油卡备注:">
                            <el-input v-model="oilCardStatusForm.oilCardProhibitRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="oilCardModifyStatusWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="prohibited('oilCardStatusForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!--重置密码win-->
        <el-dialog title="重置密码" :visible.sync="ResetPassWordWin" width="400px">
            <el-form :model="passWordForm" :rules="addBaseOilCard" ref="passWordForm" label-width="100px" size="small"
                     align="center">
                <el-row>
                    <el-form-item label="密码:" prop="password">
                        <el-input v-model="passWordForm.password"/>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="确认密码:" prop="password">
                        <el-input v-model="passWordForm.againPassword" type="password"/>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="ResetPassWordWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="resetPassWordSubmit('passWordForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改余额-->
        <el-dialog title="修改余额" :visible.sync="updateBalanceWin" width="600px">
            <el-form :model="updateBalanceForm" :rules="addBaseOilCard" ref="updateBalanceForm" label-width="120px"
                     size="small"
                     align="center">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="余额:" prop="balanceAmount">
                            <el-input type="number" placeholder="请填写金额"
                                      v-model="updateBalanceForm.balanceAmount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateBalanceWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="updateBalanceSubmit('updateBalanceForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改平台公司-->
        <el-dialog @selection-change="handleSelectionChange" title="修改平台公司" :visible.sync="updateOrgWin" width="600px">
            <el-form :model="updateOrgForm" ref="updateOrgForm" label-width="120px"
                     size="small"
                     align="center">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="合作公司:" prop="cardCompany">
                            <dictionary-select v-model="updateOrgForm.cardCompany"
                                               option-name="OIL_CARD_COMPANY_ONLY_MA_AN_SHAN"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="请输入修改时间:" label-width="120px">
                            <el-date-picker
                                v-model="updateOrgForm.modifyOilTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                default-time="00:00:00">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--<el-row>-->
                <!--<el-col :span="20">-->
                <!--<el-form-item label="修改备注:" >-->
                <!--<el-input type="text" placeholder="请填写修改内容" style="width: 215px;"-->
                <!--v-model="updateOrgForm.modifyOilMessageRemark"></el-input>-->
                <!--</el-form-item>-->
                <!--</el-col>-->
                <!--</el-row>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateOrgWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="updateOrgTimeSubmit('updateOrgForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改油卡状态-->
        <el-dialog title="修改油卡状态" :visible.sync="cancellationWin" width="600px">
            <el-form :model="cancellationForm" ref="cancellationForm" label-width="120px"
                     size="small"
                     align="center">
                <el-row>
                    <!--<el-col :span="12">-->
                    <!--<el-form-item label="卡号" prop="cardNo">-->
                    <!--{{ cancellationForm.cardNo }}-->
                    <!--</el-form-item>-->
                    <!--</el-col>-->
                    <el-col :span="12">
                        <el-form-item label="使用状态:" prop="balanceAmount">
                            <el-switch v-model="cancellationForm.oilCardType"
                                       active-color="#13ce66"
                                       :active-value="Constant.OIL_CANCELLATION.EMPLOY"
                                       active-text="使用"
                                       inactive-color="#ff4949"
                                       :inactive-value="Constant.OIL_CANCELLATION.INVALID"
                                       inactive-text="挂失"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancellationWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="cancellationSubmit('cancellationForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>

        <OilCardByOrgCode v-if="showOilCardByOrg" :visible="showOilCardByOrg" @close="hideOilCardByOrg"
                          :currentRowed="currentRows"/>
        <OilRecordDetail v-if="showOilRecordDetail" :visible="showOilRecordDetail" @close="hideDetailVehicle"
                         :currentRows="currentRows"/>
    </el-container>
</template>

<script>
    import {Http, Api, Common, Constant, Validate} from 'src/global/index'
    import OilCardRecordDetail from "./OilCardRecordDetail";
    import OilRecordDetail from "./OilRecordDetail";
    import OilCardByOrgCode from "./OilCardByOrgCode";
    import axios from 'axios'

    export default {
        components: {OilCardByOrgCode, OilRecordDetail, OilCardRecordDetail, Common},
        data() {
            return {
                type:'NO_LONG_TERM_OUT_INVITE',
                Api: Api,
                exportLoading: true,
                downloadUrl: Api.oilCard.getExcel,
                downloadLoading: true,
                isLoading: true,
                Validate: Validate,
                Common: Common,
                Constant: Constant,
                initializeModel: {},
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    cardNo: '',
                    supplier: '',
                    orgCode: '',
                    status: '',
                    cardClaimStatus: 'CLAIMED',//默认已认领
                    driverName: '',
                    supplierId: '',
                    userId: '',
                    vehicle: '',
                    cardholderType: '',
                    batchSelect: '',
                    batchSelects: [],
                    isExportByMore: false,
                    exportByMoreData: [],
                    startTime: '',
                    endTime: '',
                    createTime: [],
                    kabanFlag: '',
                    prohibit:false,//默认启用
                    oilCardType:'',//默认使用中
                    cardCompany: 'MA_AN_SHAN',
                },//返回结果
                searchResult: {
                    totalCount: 0,
                    result: [],
                },
                oilCardMoneyResult: {
                    totalCount: 0,
                    result: [],
                },
                oilCardDriverOutResult: {
                    totalCount: 0,
                    result: [],
                },
                updateBalanceForm: {
                    balanceAmount: ''
                },
                updateOrgForm: {
                    batchSelects: [],
                    cardCompany: '',
                    modifyOilTime: '',
                    modifyOilMessageRemark: ''
                },
                cancellationForm: {
                    cardNo: '',
                    batchSelects: [],
                    oilCardType: Constant.OIL_CANCELLATION.INVALID,
                },
                updateBalanceWin: false,
                updateOrgWin: false,
                cancellationWin: false,
                modifyOilCardWin: false,
                grantOilCardWin: false,
                multipleSelection: [],
                addOilCardWin: false,
                rechargeApplyWin: false,
                batchMoneyWin: false,
                showVehicle: false,
                showOilRecordDetail: false,
                showOilCardByOrg: false,
                oilCardMoneyInformation: false,
                oilCardDriverOutInformation: false,
                bindOilCardWin: false,
                ResetPassWordWin: false,
                oilCardModifyStatusWin: false,
                isMoreItemShow: false,
                showCardMasterNoWin:false,
                modifyCardMasterNoWin:false,
                passWordForm: {
                    password: '',
                    againPassword: '',
                    cardNo: ''
                },
                oilCardStatusForm: {
                    oilCardProhibitRemark: '',
                    status: '',
                    cardNos: []
                },
                oilCardClaimForm: {
                    status: '',
                    cardNos: []
                },
                bindOilCardForm: {
                    vehicleCode: '',
                    cardNos: []
                },
                disabled: {
                    sendOutCardDisabled: true,
                    unworkedCardDisabled: true,
                    invalidCardDisabled: true,
                    bindOilCardDisabled: true,
                    applyMoneyDisabled: true,
                    modifyOrgTime: true,
                },
                addOilCardWinForm: {
                    cardNo: '',
                    type: '',
                    cardCompany: '',
                    supplier: '',
                    orgCode: '',
                    balanceAmount: 0,
                    password: '',
                    kabanFlag: false,
                    cardMasterNo:''
                },
                modifyForm: {
                    cardNo: '',
                    type: '',
                    cardCompany: '',
                    supplier: '',
                    orgCode: '',
                    balanceAmount: 0,
                    remark: '',
                    id: '',
                    kabanFlag: Boolean,
                    cardMasterNo:''
                },
                rechargeApplyForm: {
                    cardNo: '',
                    initialBalance: 0,
                    rechargeAmount: '',
                    operationMode: Constant.VEHICLE_OPERATION_MODE.OUT_INVITE,
                    operationModeShow: false,
                    vehicleCodeShow: false,
                    vehicleOilCardAmountShow: false,
                    oilCardAmountedShow: false,
                    restOilCardAmountShow: false,
                    vehicleOilCardAmount: '',
                    oilCardAmounted: '',
                    restOilCardAmount: '',
                    oilCardResult: [],
                    cardCompany: '',
                    vehicleCode: '',
                    rechargeRemark: '',
                    rechargeMethod: 'CASH_RECHARGE'
                },
                batchMoneyForm: {
                    rechargeAmount: '',
                    rechargeTime: '',
                    vehicleCode: '',
                    oilCardResult: []
                },
                grantOilCardForm: {
                    type: '',
                    orgCode: '',
                    user: '',
                    cardNos: []
                },
                oilCardRecharge: {
                    initialBalance: undefined,
                    rechargeAmount: undefined,
                    status: '',
                    vehicleCode: '',
                    applyTime: '',
                    applyUser: '',
                    type: '',
                    rechargeUser: ''
                },

                success: true,
                TRAILER: ['VAN', 'TRACTOR'],
                currentRows: null,//操作行的数据
                addBaseOilCard: {
                    cardNo: [
                        {required: true, message: '请输入卡号', trigger: 'blur'},
                        {pattern: /^(\d{16}|\d{19})$/, message: '请输入16位或者19位的油卡卡号'}
                    ],
                    cardMasterNo:[
                        {required: true, message: '请输入柴油主卡号', trigger: 'blur'},
                    ],
                    cardCompany: [
                        {required: true, message: '请选择合作公司', trigger: 'blur'},
                        {min: 1, max: 12, message: '请输入合作公司', trigger: 'blur'}

                    ],
                    type: [
                        {required: true, message: '请选择类型', trigger: 'blur'},
                        {min: 1, max: 12, message: '请输入类型', trigger: 'blur'}
                    ],
                    supplier: [
                        {required: true, message: '请选择供应商', trigger: 'blur'},
                    ],
                    balanceAmount: [
                        {required: true, message: '请填写金额', trigger: 'blur'},
                        {pattern: /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/, message: '请输入正确的金额!'},
                    ],
                    vehicleCode: [
                        {required: true, message: '请选择车辆', trigger: 'blur'},
                        {min: 1, max: 200, message: '请输入车辆', trigger: 'blur'}
                    ],
                    rechargeAmount: [
                        {required: true, message: '请填写金额', trigger: 'blur'},
                        {pattern: /^([1-9]\d{0,8})([.]?|(\.\d{1,2})?)$/, message: '请输入正确的金额!'},
                    ],
                    orgCode: [
                        {required: true, message: '请填写所属组织', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                    operationMode: [
                        {required: true, message: '预充值车辆属性不能为空', trigger: 'blur'},
                    ],
                    rechargeMethod: [
                        {required: true, message: '油卡充值方式不能为空', trigger: 'blur'},
                    ]
                },
                permission: {
                    addPermission: '/oilCard/add',
                    applyMoneyPermission: '/oilCard/applyMoney',
                    bindVehiclePermission: '/oilCard/bindVehicle',
                    grantPermission: '/oilCard/grant',
                    oilUnworkedPermission: '/oilCard/oilUnworked',
                    oilCardExportPermission: '/oilCard/oilCardExport',
                    claimedPermission: '/oilCard/claimed',
                    batchCancleClaimedPermission: '/oilCard/cancleClaimed',//取消认领权限
                    cancellationPermission: '/oilCard/cancellation',
                    prohibit: '/oilCard/prohibit',//启用、禁用
                    updateBalancePermission: '/oilCard/updateBalance',
                    updateOrgTimePermission: '/oilCard/updateOrg',
                    watchGrantPermission: '/oilCard/watchGrant',
                    modifyPermission: '/oilCard/modify',
                    deletePermission: '/oilCard/delete',
                    resetPasswordPermission: '/oilCard/resetPassword',
                    cancelClaimPermission: '/oilCard/cancelClaim',
                    uploads: '/oilCard/uploads'
                }
            }
        },
        mounted() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            this.searchOilCardList();
        },
        watch: { //数据监听
            multipleSelection(val) {
                this.disabled.sendOutCardDisabled = val.length <= 0
                this.disabled.applyMoneyDisabled = val.length != 1
                this.disabled.unworkedCardDisabled = val.length <= 0
                this.disabled.bindOilCardDisabled = val.length <= 0
            },
            rechargeApplyWin(val) {
                if (!val) {
                    this.rechargeApplyForm = this.cloneMode().rechargeApplyForm
                }
            }
        },
        methods: {
            //通用
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            handleCurrentChange(val) {
                let _this = this;
                _this.searchParam.currentPage = val;
                this.searchOilCardList()
            },
            showMore() {
                let vm = this;
                vm.isMoreItemShow = true;
            },
            showLess() {
                let vm = this;
                vm.isMoreItemShow = false;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            handleSizeChange(val) {
                let _this = this;
                _this.searchParam.pageSize = val;
                this.searchOilCardList()
            },
            hideVehicle() {
                this.showVehicle = false;
            },
            hideDetailVehicle() {
                this.showOilRecordDetail = false;
            },
            hideOilCardByOrg() {
                this.showOilCardByOrg = false;
            },
            //新增
            addBlackList() {
                this.showCardMasterNoWin=false;
                this.addOilCardWin = true;
            },
            addOilCardWinSupplier(val){
               if(_.eq(val,"ZHONG_AN_ROAD")){
                   this.showCardMasterNoWin=true;
               }else{
                   this.showCardMasterNoWin=false;
               }
            },
            modifyOilCardWinSupplier(val){
                if(_.eq(val,"ZHONG_AN_ROAD")){
                    this.modifyCardMasterNoWin=true;
                }else{
                    this.modifyCardMasterNoWin=false;
                }
            },
            //新增
            submitBlackList(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.oilCard.add, _this.addOilCardWinForm, function (res) {
                            _this.searchOilCardList();
                            _this.addOilCardWin = false;
                        })
                    }
                })
            },
            //查询
            searchOilCardList() {
                let _this = this;
                let batchSelect = _this.searchParam.batchSelect;
                let batchResults = [];
                if (batchSelect) {
                    var regex = new RegExp('\n|\n|\n', 'g');
                    let match = batchSelect.replace(regex, ',');
                    batchResults = match.split(",");
                    if (batchResults.length > 1000) {
                        return this.$message.warning("批量查询的单号个数不超过1000个");
                    }

                    _this.searchParam.batchSelects = batchResults;
                    _this.searchParam.exportByMoreData = batchResults;
                } else {
                    _this.searchParam.exportByMoreData = [];
                }
                _this.searchParam.startTime = _this.searchParam.createTime[0];
                _this.searchParam.endTime = _this.searchParam.createTime[1];
                if (_this.searchParam.cardCompany==''||_this.searchParam.cardCompany==null) {
                    _this.searchParam.cardCompany='MA_AN_SHAN'
                }
                _this.isLoading = true;
                Http.post(Api.oilCard.page, _this.searchParam, result => {
                    _this.searchResult.result = result.result;
                    _this.searchResult.result.forEach((item) => {
                        if (!item.oilCardRecharge) {
                            item.oilCardRecharge = {}
                        }
                        if (!item.belongOrg) {
                            item.belongOrg = {}
                        }
                    });
                    _this.searchResult.totalCount = result.totalCount;
                    _this.searchParam.currentPage = result.currentPage;
                    _this.searchParam.pageSize = result.pageSize;
                    if (_this.searchParam.batchSelect) {
                        _this.searchParam.batchSelect = '';
                        _this.searchParam.batchSelects = [];
                    }
                    _this.isLoading = false;
                },()=>{
                    _this.isLoading = false;
                })
            },
            resetWinform() {
                let _this = this;
                _this.searchParam = _this.cloneMode().searchParam
            },
            cancel() {
                let _this = this;
                _this.addOilCardWin = _this.cloneMode().addOilCardWin;
                _this.modifyOilCardWin = _this.cloneMode().modifyOilCardWin;
                _this.rechargeApplyWin = _this.cloneMode().rechargeApplyWin;
                _this.batchMoneyWin = _this.cloneMode().batchMoneyWin;
                _this.grantOilCardWin = _this.cloneMode().grantOilCardWin;
                _this.updateBalanceWin = _this.cloneMode().updateBalanceWin;
                _this.oilCardDriverOutInformation = _this.cloneMode().oilCardDriverOutInformation;
                _this.bindOilCardWin = _this.cloneMode().bindOilCardWin;
                _this.updateBalanceForm = _this.cloneMode().updateBalanceForm;
                _this.bindOilCardForm = _this.cloneMode().bindOilCardForm;
                _this.addOilCardWinForm = _this.cloneMode().addOilCardWinForm;
                _this.modifyForm = _this.cloneMode().modifyForm;
                _this.rechargeApplyForm = _this.cloneMode().rechargeApplyForm;
                _this.batchMoneyForm = _this.cloneMode().batchMoneyForm;
                _this.grantOilCardForm = _this.cloneMode().grantOilCardForm
            },
            handleClose() {
                let _this = this;
                _this.addOilCardWin = false;
                _this.modifyOilCardWin = false;
                _this.batchApplyWin = false;
                _this.batchMoneyWin = false;
                _this.oilCardDriverOutInformation = false;
                _this.bindOilCardWin = false;
                _this.oilCardModifyStatusWin = false;
                _this.cancel();
            },
            deleteList(row) {
                let _this = this;
                let ids = [];
                ids.push(row.id);
                _this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.oilCard.delete, ids, result => {
                        _this.searchOilCardList()
                    })
                })
            },
            // 通过ID数据回显
            modifyBlackList(row) {
                let _this = this;
                Http.get(Api.oilCard.getDeTailById, {params: {'id': row.id}}, result => {
                    if(_.eq(result.result.supplier,'ZHONG_AN_ROAD')){
                        this.modifyCardMasterNoWin=true;
                    }else{
                        this.modifyCardMasterNoWin=false;
                    }
                    _this.modifyOilCardWin = true;
                    _this.modifyForm = result.result
                })
            },
            modifySubmitBlackList(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.oilCard.modify, _this.modifyForm, function (res) {
                            _this.searchOilCardList();
                            _this.modifyOilCardWin = false;
                        })
                    }
                })
            },
            //查看发放信息
            watchGrantList(row) {
                this.currentRows = row;
                this.showOilRecordDetail = true;
            },
            //下发
            grantOilCard() {
                let _this = this;
                let cardNos = [];
                _this.multipleSelection.forEach(res => {
                    cardNos.push(res.cardNo);
                });
                _this.grantOilCardForm.cardNos = cardNos;
                _this.grantOilCardWin = true;

            },
            sendOutWinSubmit(formName) {
                let _this = this;
                if (_this.grantOilCardForm.type === 'USER') {
                    if (!_this.grantOilCardForm.user) {
                        _this.$message.warning("用户不能为空");
                        return;
                    }
                }
                if (_this.grantOilCardForm.type === 'ORGCODE') {
                    if (!_this.grantOilCardForm.orgCode) {
                        _this.$message.warning("组织不能为空");
                        return;
                    }
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.get(Api.oilCard.sendOut, {
                            params: {
                                'type': _this.grantOilCardForm.type,
                                'user': _this.grantOilCardForm.user,
                                'orgCode': _this.grantOilCardForm.orgCode,
                                'cardNos': _this.grantOilCardForm.cardNos
                            }
                        }, function (res) {
                            _this.resetSendOutCardWin();
                            _this.grantOilCardWin = false;
                            _this.searchOilCardList();
                        })
                    }
                })
            },
            resetSendOutCardWin() {//重置下发
                this.grantOilCardForm = this.cloneMode().grantOilCardForm
            },
            oilUnworkedSubmit() {
                let _this = this;
                var cardNo = [];
                _this.multipleSelection.forEach((item) => {
                    cardNo.push(item.cardNo);
                });
                this.$confirm('是否回收油卡?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.oilCard.setUnworked, cardNo, result => {
                        this.$message.success("回收成功");
                        _this.searchOilCardList()
                    })
                })
            },
            showOrgCodeByOilCard(row) {
                this.currentRows = row;
                this.showOilCardByOrg = true;
            },
            bindVehicle() {
                let _this = this;
                let cardSupplier = '';
                let cardClaimed = '';
                _this.multipleSelection.forEach((item) => {
                    cardSupplier = item.supplier;
                    cardClaimed = item.cardClaimStatus;
                });
                if (cardSupplier !== 'ZHONG_AN_ROAD' && cardClaimed === 'UN_CLAIM') {
                    _this.$message.warning("请先认领油卡");
                    return;
                }
                _this.bindOilCardWin = true
            },
            //绑定车辆
            bindWinSubmit(formName) {
                let _this = this;
                let cardNos = [];
                _this.multipleSelection.forEach(res => {
                    cardNos.push(res.cardNo);
                });
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.get(Api.oilCard.bindVehicle, {
                            params: {
                                'cardNos': cardNos,
                                'vehicleCode': _this.bindOilCardForm.vehicleCode,
                                'type':_this.type,
                            }
                        }, function (res) {
                            _this.searchOilCardList();
                            _this.bindOilCardWin = false;
                        })
                    }
                })
            },
            applyMoney() {
                let _this = this;
                _this.multipleSelection.forEach((item) => {
                    _this.rechargeApplyForm.cardNo = item.cardNo;
                    _this.rechargeApplyForm.cardCompany = item.cardCompany;
                    if (item.cardholderType) {
                        if (item.cardholderType === 'VEHICLE') {
                            _this.rechargeApplyForm.vehicleCode = item.cardholder;
                        }
                    }
                });
                Http.get(Api.oilCard.getDeTailById, {params: {'id': _this.multipleSelection[0].id}}, result => {
                    let model = result.result;
                    if (model.cardClaimStatus != 'CLAIMED') {
                        _this.$message.warning("请先认领该油卡才能充值！");
                        return;
                    }

                    if (model.cardholderType == "VEHICLE") {
                        _this.rechargeApplyForm.vehicleCode = model.vehicle.licenseNumber;
                        _this.rechargeApplyForm.vehicleCodeShow = true
                        _this.rechargeApplyForm.vehicleOilCardAmount = model.vehicleOilCardAmount;
                        _this.rechargeApplyForm.vehicleOilCardAmountShow = true
                        _this.rechargeApplyForm.oilCardAmounted = model.oilCardAmounted;
                        _this.rechargeApplyForm.oilCardAmountedShow = true
                        _this.rechargeApplyForm.restOilCardAmount = model.restOilCardAmount;
                        _this.rechargeApplyForm.restOilCardAmountShow = true
                        if (model.vehicle && model.orgCode !== '总部') {
                            _this.rechargeApplyForm.operationMode = model.vehicle.operationMode;
                            _this.rechargeApplyForm.operationModeShow = true
                        }
                    } else if (model.orgCode !== '总部') {
                        _this.rechargeApplyForm.operationMode = "OUT_INVITE";
                        _this.rechargeApplyForm.operationModeShow = true
                    } else {
                        _this.rechargeApplyForm.operationMode = "OUT_INVITE";
                        _this.rechargeApplyForm.operationModeShow = true
                    }
                    _this.rechargeApplyWin = true;
                });
            },
            applyMoneyEtcList(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.oilCardRecharge.addBatchApply, _this.rechargeApplyForm, function (res) {
                            _this.rechargeApplyWin = false;
                            _this.cancel();
                            _this.$message.success('充值成功！');
                            _this.searchOilCardList();
                        })
                    }
                })
            },
            resetPassword(row) {
                let _this = this;
                _this.passWordForm.cardNo = row.cardNo;
                _this.ResetPassWordWin = true;
            },
            resetPassWordSubmit(formName) {
                const _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (Object.is(_this.passWordForm.password, _this.passWordForm.againPassword)) {
                        if (valid) {
                            Http.post(Api.oilCard.resetPassWord, _this.passWordForm, result => {
                                _this.$message.success("成功重置密码");
                                _this.ResetPassWordWin = false;//关闭窗口
                                _this.resetPasswordWin();
                            })
                        }
                    } else {
                        _this.$message.warning("两次输入密码不一致,请重新输入");
                    }
                })
            },
            resetPasswordWin() {
                this.passWordForm = {
                    password: '',
                    againPassword: '',
                    id: ''
                }
            },
            cancelClaim(row) {
                let _this = this;
                let cardNo = row.cardNo;
                if (row.cardClaimStatus === 'UN_CLAIM') {
                    this.$message.warning("该油卡未认领,不能点击取消认领");
                    return;
                }
                this.$confirm('是否取消认领油卡?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.get(Api.oilCard.cancelClaim, {params: {'cardNo': cardNo}}, result => {
                        _this.$message.success("取消认领成功");
                        _this.searchOilCardList()
                    })
                })
            },
            uploadSuccess() {
                let vm = this;
                vm.searchOilCardList();
            },
            updateBalance() {
                this.updateBalanceWin = true;
            },
            updateOrgTime() {
                this.updateOrgWin = true;
            },
            updateBalanceSubmit(formName) {
                const _this = this;
                let cardNos = [];
                _this.multipleSelection.forEach(res => {
                    cardNos.push(res.cardNo);
                });
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.get(Api.oilCard.updateBalance, {
                            params: {
                                'cardNos': cardNos,
                                'updateBalance': _this.updateBalanceForm.balanceAmount
                            }
                        }, result => {
                            _this.$message.success("成功修改余额");
                            _this.updateBalanceWin = false;//关闭窗口
                            _this.cancel();
                            _this.searchOilCardList();
                        })
                    }
                })
            },
            updateOrgTimeSubmit(formName) {
                const _this = this;
                let cardNos = [];
                _this.multipleSelection.forEach(res => {
                    cardNos.push(res.cardNo);
                });
                _this.updateOrgForm.batchSelects = cardNos
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.oilCard.updateOrg, _this.updateOrgForm, result => {
                            _this.$message.success("成功修改平台公司");
                            _this.updateOrgWin = false;//关闭窗口
                            _this.cancel();
                        })
                    }
                })
            },
            cancellation() {//作废
                let _this = this;
                let cardNos = [];
                _this.multipleSelection.forEach((item) => {
                    // _this.cancellationForm.batchSelects.push(item.cardNo);
                    cardNos.push(item.cardNo);
                    _this.cancellationWin = true
                });
                _this.cancellationForm.batchSelects = cardNos
                // if (_this.multipleSelection) {
                //
                //     _this.cancellationForm.cardNo = _this.multipleSelection[0].cardNo;
                //     _this.cancellationWin = true
                // }
            },
            cancellationSubmit(formName) {
                let _this = this;
                // alert(_this.cancellationForm.oilCardType)
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.oilCard.cancellation, _this.cancellationForm, result => {
                            _this.cancellationWin = false;
                            // _this.cancellationForm = _this.cloneMode().cancellationForm;
                            if (_this.cancellationForm.oilCardType === Constant.OIL_CANCELLATION.EMPLOY) {
                                _this.$message.success("油卡已成功找回");
                            } else if (_this.cancellationForm.oilCardType === Constant.OIL_CANCELLATION.INVALID) {
                                _this.$message.success("油卡已挂失");
                            }
                            _this.searchOilCardList();
                        })
                    }
                })
            },
            prohibited() {//启用禁用方法
                const _this = this;
                const cardNos = [];
                // let gpsProhibit = [];//该数组是用来判断oilCard是启用还是禁用
                _this.oilCardModifyStatusWin = true;
                _this.multipleSelection.forEach(res => {
                    cardNos.push(res.cardNo);
                    // gpsProhibit.push(res.prohibit)
                });

                if (this.oilCardStatusForm.status == '0') {//启用
                    Http.get(Api.oilCard.prohibit, {
                        params: {
                            'oilCardCodes': cardNos,
                            'oilCardProhibitRemark': this.oilCardStatusForm.oilCardProhibitRemark,
                            "isStart": true
                        }
                    }, result => {
                        _this.oilCardStatusForm.oilCardProhibitRemark = '';
                        _this.oilCardModifyStatusWin = false;
                        _this.$message.success("操作成功");
                        _this.searchOilCardList()
                    })
                    // this.$prompt('若启用该oilCard请填备注', '启用oilCard提示', {
                    //     confirmButtonText: '确定',
                    //     cancelButtonText: '取消'
                    // }).then(({value}) => {
                    // })
                }
                if (this.oilCardStatusForm.status == '1') {//禁用
                    Http.get(Api.oilCard.prohibit, {
                        params: {
                            'oilCardCodes': cardNos,
                            'oilCardProhibitRemark': this.oilCardStatusForm.oilCardProhibitRemark,
                            'isStart': false
                        }
                    }, result => {
                        _this.oilCardStatusForm.oilCardProhibitRemark = '';
                        _this.oilCardModifyStatusWin = false;
                        _this.$message.success("操作成功");
                        _this.searchOilCardList()
                    })
                    /* this.$prompt('若禁用Gps请填备注', '禁用Gps提示', {
                         confirmButtonText: '确定',
                         cancelButtonText: '取消'
                     }).then(({ value }) => {*/
                    // })
                }
            },
            batchClaim() {//批量认领
                let _this = this;
                let cardNo = [];
                _this.multipleSelection.forEach(res => {
                    cardNo.push(res.cardNo);
                });
                this.$confirm('是否认领油卡?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.get(Api.oilCard.claimed, {
                        params: {
                            'oilCardCodes': cardNo,
                            'isStart': true
                        }
                    }, result => {
                        _this.$message.success("认领成功");
                        _this.searchOilCardList();
                    });
                })
            },
            batchCancelClaim() {//批量取消认领
                let _this = this;
                let cardNo = [];
                _this.multipleSelection.forEach(res => {
                    cardNo.push(res.cardNo);
                });
                this.$confirm('是否取消认领油卡?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.get(Api.oilCard.claimed, {
                        params: {
                            'oilCardCodes': cardNo,
                            'isStart': false
                        }
                    }, result => {
                        _this.$message.success("取消认领成功");
                        _this.searchOilCardList();
                    });
                })
            },
            exportList() {
                debugger
                let vm = this;
                vm.exportLoading = false;
                this.searchParam.startTime = this.searchParam.createTime[0];
                this.searchParam.endTime = this.searchParam.createTime[1];
                axios.get(Api.oilCard.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '油卡导出.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
        },

    }
</script>
