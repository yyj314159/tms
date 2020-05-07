<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 设备管理</el-breadcrumb-item>
                <el-breadcrumb-item>GPS管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form :model="model.searchParam" label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="GPS号码:">
                            <el-input v-model="model.searchParam.code">
                                <template slot="append">
                                    <el-popover
                                        placement="bottom"
                                        width="98%"
                                        trigger="click"
                                        @show="showPopper"
                                        @hide="hideProper">
                                        <div style="width: 200px;">
                                            <el-input type="textarea"
                                                      :autosize="{ minRows: 6, maxRows: 8}" resize="none"
                                                      v-model.trim="model.searchParam.batchSelect"
                                                      placeholder="最多输入1000个号,进行查询。按ENTER键进行换行,按重置按钮进行清空"></el-input>
                                        </div>
                                        <el-button slot="reference" style="width:2%;">批量查询</el-button>
                                    </el-popover>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="类型:">
                            <dictionary-select option-name="GPS_TYPE" style="display: block"
                                               v-model="model.searchParam.type"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select style="display: block" v-model="model.searchParam.vehicleCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属组织:">
                            <org-select style="display: block" v-model="model.searchParam.belongOrgCode"
                                        mounted="true"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="品牌:" prop="brand">
                            <data-dictionary-select style="display: block" option-name="GPS_BRAND"
                                                    v-model="model.searchParam.brand"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态:">
                            <data-dictionary-select option-name="GPS_STATUS" style="display: block"
                                                    v-model="model.searchParam.status"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="认领:">
                            <dictionary-select v-model="model.searchParam.cardClaimStatus"
                                               option-name="OIL_CLAIM" style="display: block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float:right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchGpsForMainList">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetMainSearchParam">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addGpsWinShow"
                       v-permission="permission.add">新增
            </el-button>
            <el-button size="mini" type="primary" @click="bindVehicle" :disabled="disabled.bindOilCardDisabled"
                       v-permission="permission.bindVehicles">绑定车辆
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="sendOutGpsWinShow"
                       v-permission="permission.setGpsInUse" :disabled="disabled.sendOutGpsDisabled">下发
            </el-button>
            <el-button size="mini" type="primary" icon="el-icon-refresh" @click="gpsUnworkedSubmit"
                       v-permission="permission.setUnworked" :disabled="disabled.unworkedGpsDisabled">回收
            </el-button>
            <el-button size="mini" type="primary" v-permission="permission.getExcelData" @click="exportExcelSubmit">导出
            </el-button>
            <el-button size="mini" type="primary" @click="batchClaim"
                       :disabled="selections.length<=0 "
                       v-permission="permission.claimed">认领
            </el-button>
            <el-button size="mini" type="primary" @click="batchCancleClaim"
                       :disabled="selections.length<=0 "
                       v-permission="permission.cancelClaimed">取消认领
            </el-button>
            <el-button size="mini" type="primary" @click="win.winShow.gpsModifyStatusWin = true"
                       :disabled="selections.length<=0"
                       v-permission="permission.prohibit">启用/禁用
            </el-button>
                <el-button icon="el-icon-download" type="primary" size="mini" style="margin-right: 8px;"
                           v-permission="'/gps/download'" @click="Common.templateDownload.getExcel(Api.gps.getExcel,'gps信息导入模板')">模板下载
                </el-button>
            <upload-excel :importUrl="Api.gps.upload" @success="uploadSuccess" btn-name="导入"
                          style="margin-left:800px; margin-top:-28px;" v-permission="permission.uploads"></upload-excel>
            <el-table class="content-table" element-loading-text="拼命加载中"
                      :data="model.searchResult.result"
                      border fit
                      @selection-change="handlerChange"
                      @on-dbclick="handleRowHandle"
                      @feature-click="operationClick"
                      highlight-current-row stripe
                      size="small">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="GPS设备号" prop="code" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="handleRowHandle(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="类型" prop="type" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.type"
                                                option-name="GPS_TYPE"/>
                    </template>
                </el-table-column>
                <el-table-column label="所属大区" prop="regionOrg.name" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="所属分区" prop="belongOrg.name" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" prop="status" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.status"
                                                option-name="GPS_STATUS"/>
                    </template>
                </el-table-column>
                <!--启用禁用-->
                <el-table-column label="启用/禁用" prop="prohibit" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.prohibit"
                                                option-name="GPS_PROHIBIT"/>
                    </template>
                </el-table-column>
                <!--gps禁用备注-->
                <el-table-column label="启用/禁用备注" prop="prohibitRemark" min-width="160" show-overflow-tooltip/>
                <el-table-column label="派车单编号" prop="dispatchCode" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="运单编号" prop="waybillCode" min-width="160"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="品牌" prop="brand" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.brand"
                                                option-name="GPS_BRAND"/>
                    </template>
                </el-table-column>
                <el-table-column label="型号" prop="model" min-width="160" show-overflow-tooltip></el-table-column>
                <!--<el-table-column label="SIM卡号" prop="simNumber" :show-overflow-tooltip="true"></el-table-column>-->
                <el-table-column label="待领取人" prop="waitReceiveUser" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="持有人" prop="gpsHolder" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="采购日期" prop="payTime" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.payTime | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column label="认领状态" prop="cardClaimStatus" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.cardClaimStatus"
                                                option-name="OIL_CLAIM"/>
                    </template>
                </el-table-column>
                <el-table-column label="认领组织" prop="cardClaimOrgCode" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="认领人" prop="cardClaimUser" min-width="120px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="认领时间" prop="cardClaimTime" min-width="150px"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="创建人" prop="createUser" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="createTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="修改人" prop="modifyUser" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="修改时间" prop="modifyTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" prop="remark" min-width="100" show-overflow-tooltip
                                 v-if="this.$_permission('/gps/remark')">
                    <template slot-scope="scope">
                        <el-popover
                            placement="bottom"

                            width="200"
                            trigger="click">
                            <div style="width: 200px;">
                                <el-input v-model="remarkContent" placeholder="请输入修改备注内容..."></el-input>
                                <el-button type="success" icon="el-icon-check" circle
                                           style="padding: 8px;margin-left: 60px;margin-top: 6px;"
                                           @click="modifyRemark(scope.row.code)"></el-button>
                                <el-button type="danger" icon="el-icon-close" circle style="padding: 8px;"
                                           @click="clearPopover"></el-button>
                            </div>
                            <a href="javascript:void(0)" slot="reference"
                               style="color: #606266;width: 50px;height:23px;display: block;">{{scope.row.remark}}</a>
                        </el-popover>

                    </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="操作" fixed="right" min-width="200"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!--<el-button type="text" size="mini" @click="useDetailsWinShow(scope.row)">查看发放信息</el-button>-->
                        <el-button type="text" size="mini" @click="watchGrantList(scope.row)"
                                   v-permission="permission.watchGrantPermission">查看详情
                        </el-button>
                        <el-button type="text" icon="el-icon-edit" size="mini"
                                   @click="editGpsWinShow(scope.row)" v-permission="'/gps/modify'"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini"
                                   @click="deleteGpsSubmit(scope.row)" v-permission="'/gps/delete'"></el-button>
                        <el-button type="text" size="mini"
                                   @click="cancelClaim(scope.row)" v-permission="'/gps/cancelClaim'">取消认领
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
                    :page-size="model.searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="model.searchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>
        <!--新增GPS win-->
        <el-dialog :title="win.winTitle.gpsAddWinTitle" :visible.sync="win.winShow.gpsAddWin" width="800px">
            <el-form :model="model.gpsAddWinModel" :rules="verification" ref="gpsAddWinForm" label-width="100px"
                     size="small">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="设备号:" prop="code">
                            <el-input v-model="model.gpsAddWinModel.code"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="类型:" prop="type">
                            <dictionary-select option-name="GPS_TYPE" v-model="model.gpsAddWinModel.type"
                                               style="display: block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="品牌:" prop="brand">
                            <data-dictionary-select option-name="GPS_BRAND" style="display: block"
                                                    v-model="model.gpsAddWinModel.brand"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="所属机构:" prop="belongOrgCode">
                            <org-select style="display: block" v-model="model.gpsAddWinModel.belongOrgCode"
                                        ref="modifyGpsOrgSelect"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="型号:">
                            <el-input v-model="model.gpsAddWinModel.model"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="购买日期:">
                            <el-date-picker
                                v-model="model.gpsAddWinModel.payTime"
                                type="date" style="display: block;width: 100%;"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="win.winShow.gpsAddWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addGpsWinSubmit('gpsAddWinForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改GPS win-->
        <el-dialog :title="win.winTitle.gpsEditWinTitle" :visible.sync="win.winShow.gpsEditWin" width="800px">
            <el-form :model="model.gpsEditWinModel" :rules="verification" ref="gpsEditWinForm" label-width="100px"
                     size="small">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="设备号:" prop="code">
                            {{model.gpsEditWinModel.code}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="品牌:" prop="brand">
                            <data-dictionary-select option-name="GPS_BRAND" style="display: block"
                                                    v-model="model.gpsEditWinModel.brand"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="类型:" prop="type">
                            <dictionary-select option-name="GPS_TYPE" v-model="model.gpsEditWinModel.type"
                                               style="display: block"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="所属机构:" prop="belongOrgCode">
                            <org-select style="display: block" v-model="model.gpsEditWinModel.belongOrgCode"
                                        ref="modifyGpsOrgSelect"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="型号:">
                            <el-input v-model="model.gpsEditWinModel.model"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="购买日期:">
                            <el-date-picker
                                v-model="model.gpsEditWinModel.payTime"
                                type="date" style="width: 100%; display: block;"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="win.winShow.gpsEditWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="editGpsWinSubmit('gpsEditWinForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!--查看GPS win-->
        <el-dialog :title="win.winTitle.gpsDetailsWinTitle" :visible.sync="win.winShow.gpsDetailsWin"
                   width="800px">
            <el-form :model="model.gpsDetailsWinModel" label-width="100px"
                     size="small">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="GPS号码:" prop="code">
                            <label>{{ model.gpsDetailsWinModel.code }}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属机构:" prop="org.name">
                            <label>{{model.gpsDetailsWinModel.org.name}}</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="品牌:" prop="brand">
                            <!--<label v-model="model.gpsDetailsWinModel.brand">{{model.gpsDetailsWinModel.brand=='G7'-->
                            <!--?'G7':'星软' }}</label>-->
                            <datadictionary-name :value="model.gpsDetailsWinModel.brand"
                                                 option-name="GPS_BRAND"></datadictionary-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="型号:" prop="model">
                            <label>{{model.gpsDetailsWinModel.model}}</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备号:" prop="code">
                            {{model.gpsDetailsWinModel.code}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态:" prop="status">
                            <datadictionary-name :value="model.gpsDetailsWinModel.status"
                                                 option-name="GPS_STATUS"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <el-dialog title="绑定车辆" :visible.sync="win.winShow.bindOilCardWin" width="600px">
            <el-form size="small" :model="model.bindOilCardForm" label-width="150px" ref="bindOilCardForm"
                     :rules="verification">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="车牌号:" prop="vehicleCode">
                            <vehicle-select v-model="model.bindOilCardForm.vehicleCode" style="display: block;"
                                            :type="TRAILER"></vehicle-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="win.winShow.bindOilCardWin = false">取 消</el-button>
                <el-button type="primary" size="small" @click="bindWinSubmit('bindOilCardForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 下发GPS win -->
        <el-dialog :title="win.winTitle.gpsSendOutWinTitle" :visible.sync="win.winShow.gpsSendOutWin"
                   width="600px">
            <el-form :model="model.gpsSendOutWinModel" :rules="verification" ref="gpsSendOutWinForm" label-width="150px"
                     size="small">
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="下发类型:" prop="type">
                            <dictionary-select v-model="model.gpsSendOutWinModel.type" style="display: block;"
                                               option-name="OIL_CARD_GRANT_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="组织:" v-show="model.gpsSendOutWinModel.type==='ORGCODE'"
                                      prop="organization">
                            <org-select v-model="model.gpsSendOutWinModel.orgCode" style="display: block;"></org-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-form-item label="用户:" v-show="model.gpsSendOutWinModel.type==='USER'" prop="user">
                            <user-select v-model="model.gpsSendOutWinModel.user" style="display: block;"></user-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="win.winShow.gpsSendOutWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="sendOutWinSubmit('gpsSendOutWinForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="win.winTitle.gpsSendOutDetailsWinTitle" :visible.sync="win.winShow.gpsSendOutDetailsWin"
                   width="850px">
            <el-table class="content-table" size="small" :data="model.gpsSendOutDetailsTableModel"
                      element-loading-text="拼命加载中"
                      border fitheader-align="center" width="220"
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"/>
                <!-- <el-table-column header-align="center" width="120px" prop="licenseNumber" label="车牌号">
                     <template slot-scope="scope">
                         <a href="javascript:void(0)" style="color: blue;" @click="editDetailsForTableList(scope.row)">{{scope.row.licenseNumber}}</a>
                     </template>
                 </el-table-column>-->
                <el-table-column header-align="center" prop="gpsCode" label="gps编号"/>
                <el-table-column header-align="center" prop="vehicle.licenseNumber" label="关联车辆"/>
                <el-table-column header-align="center" prop="driver.name" label="关联司机"/>
                <el-table-column header-align="center" prop="operationUser" label="下发人"/>
                <el-table-column header-align="center" prop="operationDate" label="下发时间">
                    <template slot-scope="scope">
                        {{scope.row.operationDate | moment("YYYY-MM-DD")}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" width="120px" prop="valid" label="是否有效">
                    <template slot-scope="scope">
                        {{scope.row.valid == false ? "使用中":"已失效" }}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!--GPS启用禁用对话框-->
        <el-dialog :title="win.winTitle.gpsModifyStatusWinTitle" :visible.sync="win.winShow.gpsModifyStatusWin"
                   width="800px">
            <el-form :model="model.gpsStatusForm" label-width="150px"
                     size="small"
                     align="center">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="使用状态:" label-width="100px">
                            <el-switch v-model="model.gpsStatusForm.status"
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
                        <el-form-item label="启用或禁用GPS备注:">
                            <el-input v-model="model.gpsStatusForm.gpsProhibitRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="win.winShow.gpsModifyStatusWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="prohibited('model.gpsStatusForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!--查看gps操作明细-->
        <GpsRecordDetail v-if="showGpsRecordDetail" :visible="showGpsRecordDetail" @close="hideDetailGps"
                         :currentRows="currentRows"></GpsRecordDetail>
    </el-container>
</template>


<script>
    import {Api, Common, Http} from 'src/global';
    import DatadictionaryName from '../../../common/select/DatadictionaryName';
    import DataDictionarySelect from "../../../common/select/DataDictionarySelect";
    import GpsRecordDetail from "./GpsRecordDetail";

    export default {
        components: {DataDictionarySelect, DatadictionaryName, GpsRecordDetail,Common},
        data() {
            let permission = { //权限
                add: '/gps/add',
                modify: '/gps/modify',
                delete: '/gps/delete',
                setUnworked: '/gps/setUnworked',
                setGpsInvalid: '/gps/setGpsInvalid',
                setGpsInUse: '/gps/setGpsInUse',
                getExcelData: '/gps/getExcelData',
                bindVehicles: '/gps/bindVehicle',
                claimed: '/gps/claimed',
                cancelClaimed: '/gps/cancelClaimed',//取消认领权限
                prohibit: '/gps/prohibit',
                uploads: '/gps/uploads',
                watchGrantPermission: '/gps/watchGrantPermission'
            };
            return {
                showGpsRecordDetail: false,
                currentRows: null,//操作行的数据
                remarkContent: '',
                Api: Api,
                Common:Common,
                downloadUrl: Api.gps.getExcel,
                downloadLoading: true,
                initializeModel: {},
                model: {
                    searchParam: {//查询参数
                        currentPage: 1,
                        pageSize: 10,
                        code: '',
                        type: '',
                        belongOrgCode: '',
                        brand: '',
                        model: '',
                        simNumber: '',
                        remark: '',
                        status: '',
                        createUser: '',
                        modifyUse: '',
                        driverId: '',
                        vehicleCode: '',
                        cardClaimStatus: '',
                        isShowPopper: false,
                        batchSelect: '',
                        batchSelects: [],
                        isExportByMore: false,
                        exportByMoreData: []
                    },
                    gpsAddWinModel: {
                        code: '',
                        belongOrgCode: '',
                        type: 'MOBILE',
                        brand: 'G7',
                        model: '',
                        simNumber: '',
                        remark: '',
                        status: 'UN_USE',
                        payTime: '',
                        org: {
                            code: '',
                            name: ''
                        }
                    },
                    searchResult: {
                        totalCount: 0,
                        result: [],
                    },
                    gpsEditWinModel: {
                        code: '',
                        belongOrgCode: '',
                        brand: '',
                        model: '',
                        simNumber: '',
                        remark: '',
                        status: '',
                        org: {
                            code: '',
                            name: ''
                        }
                    },
                    bindOilCardForm: {
                        vehicleCode: ''
                    },
                    gpsDetailsWinModel: {
                        code: '',
                        belongOrgCode: '',
                        brand: '',
                        model: '',
                        simNumber: '',
                        remark: '',
                        status: '',
                        org: {
                            code: '',
                            name: ''
                        }
                    },
                    gpsSendOutWinModel: {
                        type: '',
                        orgCode: '',
                        user: '',
                        cardNos: []
                    },
                    gpsSendOutDetailsTableModel: [],
                    gpsStatusForm: {//GPS启用禁用参数
                        gpsProhibitRemark: '',//启用禁用gps备注
                        status: '',
                    },
                    gpsClaimForm: {
                        status: '',
                        cardNo: [],
                    }
                },
                TRAILER: ['VAN', 'TRACTOR'],
                verification: {//表单验证
                    code: [
                        {required: true, message: '请输入gps设备号', trigger: 'blur'},
                        {pattern: /^\d{7,15}$/, message: '请输入7-15位的设备号'}
                    ],
                    type: [
                        {required: true, message: '请输入gps类型', trigger: 'blur'},
                    ],
                    brand: [
                        {required: true, message: '请输入gps品牌', trigger: 'blur'},
                    ],
                    belongOrgCode: [
                        {required: true, message: '请选择所属机构', trigger: 'blur'}
                    ],
                    model: [
                        {required: true, message: '请输入型号', trigger: 'blur'},
                    ],
                    status: [
                        {required: true, message: '请输入状态', trigger: 'blur'}
                    ],
                    remark: [
                        {required: false, message: '请输入备注信息', trigger: 'blur'}
                    ],
                    gpsCode: [
                        {required: true, message: '设备号不能为空', trigger: 'blur'}
                    ],
                    vehicleCode: [
                        {required: true, message: '请选择绑定车辆', trigger: 'blur'}
                    ],
                    driverId: [
                        {required: false, message: '请输入司机信息', trigger: 'blur'}
                    ],
                    operationUser: [
                        {required: true, message: '请填写下发人', trigger: 'blur'}
                    ],
                    payTime: [
                        {required: true, message: '请填写采购日期', trigger: 'blur'}
                    ]
                },
                win: {
                    winTitle: { //弹出框 表头
                        gpsAddWinTitle: '新增GPS设备',
                        gpsEditWinTitle: '修改GPS设备',
                        gpsDetailsWinTitle: '查看GPS设备信息',
                        gpsSendOutWinTitle: '下派设备',
                        gpsSendOutDetailsWinTitle: '查看明细',
                        gpsModifyStatusWinTitle: '修改GPS状态',
                    },
                    winShow: {//是否显示弹框
                        gpsAddWin: false,
                        gpsEditWin: false,
                        gpsDetailsWin: false,
                        gpsSendOutWin: false,
                        gpsSendOutDetailsWin: false,
                        bindOilCardWin: false,
                        gpsModifyStatusWin: false,//启用禁用对话框
                        gpsClaimStatusWin: false,//批量认领、取消认领对话框
                    }
                },
                disabled: {
                    sendOutGpsDisabled: true,
                    unworkedGpsDisabled: true,
                    invalidGpsDisabled: true,
                    bindOilCardDisabled: true,
                },
                selections: [],
                permission: permission,
            }
        },
        watch: { //数据监听
            selections(val) {
                this.disabled.sendOutGpsDisabled = val.length <= 0
                this.disabled.invalidGpsDisabled = val.length <= 0
                this.disabled.unworkedGpsDisabled = val.length <= 0
                this.disabled.bindOilCardDisabled = val.length <= 0
            }
        },
        mounted() { //立即执行
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            this.searchGpsForMainList();
        },
        methods: {
            hideDetailGps() {
                this.showGpsRecordDetail = false;
            },
            //记录gps操作明细
            watchGrantList(row) {
                this.currentRows = row;
                this.showGpsRecordDetail = true;
            },
            clearPopover() {
                this.remarkContent = ''
            },
            modifyRemark(code) {
                let _this = this;
                let cardNo = [];
                debugger
                _this.selections.forEach(res => {
                    cardNo.push(res.code);
                });
                Http.post(Api.gps.modifyRemark, {'batchSelects': cardNo, 'remarkContent': _this.remarkContent}, result => {
                    document.querySelector("#app").click();
                    this.remarkContent = ''
                    _this.searchGpsForMainList();
                })
            },
            showPopper() {
                this.model.searchParam.isShowPopper = true;
            },
            hideProper() {
                this.model.searchParam.isShowPopper = false;
            },
            uploadSuccess() {
                let vm = this;
                vm.searchGpsForMainList();
            },
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            //方法
            //main
            searchGpsForMainList() {//main 查询
                let vm = this;
                let batchSelect = vm.model.searchParam.batchSelect;
                let isShowPopper = vm.model.searchParam.isShowPopper;
                let batchResults = [];
                if (vm.model.searchParam.batchSelect) {
                    //vm.resetMainSearchParam();
                    vm.model.searchParam.isShowPopper = isShowPopper;
                    vm.model.searchParam.batchSelect = batchSelect;
                    let regex = new RegExp('\n|\n|\n', 'g');
                    let match = vm.model.searchParam.batchSelect.replace(regex, ',');
                    batchResults = match.split(",");
                    if (batchResults.length > 1000) {
                        return this.$message.warning("批量查询的单号个数不超过1000个");
                    }
                    vm.model.searchParam.batchSelects = batchResults;
                    vm.model.searchParam.isExportByMore = true;
                    vm.model.searchParam.exportByMoreData = batchResults;
                } else {
                    vm.model.searchParam.isExportByMore = false;
                    vm.model.searchParam.exportByMoreData = [];
                }
                if ((vm.model.searchParam.batchSelects || vm.model.searchParam.batchSelect) && vm.model.searchParam.code) {
                    vm.model.searchParam.batchSelect = ''
                    vm.model.searchParam.batchSelects = []
                    vm.model.searchParam.isShowPopper = false
                    vm.model.searchParam.pageSize = 10
                    vm.model.searchParam.currentPage = 1
                }
                // _this.$refs.mainTable.gridDataInit(Api.gps.page, _this.model.searchParam);
                Http.post(Api.gps.page, vm.model.searchParam, result => {
                    vm.model.searchResult.result = result.result
                    vm.model.searchResult.result.forEach((item) => {
                        if (!item.org) {
                            item.org = {}
                        }
                    })
                    vm.model.searchResult.totalCount = result.totalCount
                    vm.model.searchParam.currentPage = result.currentPage
                    vm.model.searchParam.pageSize = result.pageSize
                })
            },
            resetMainSearchParam() {
                this.model.searchParam = this.cloneMode().model.searchParam
            },
            //table
            handlerChange(rows) { //选中时触发
                this.selections = rows;
            },
            handleCurrentChange(val) {
                let vm = this
                vm.model.searchParam.currentPage = val
                this.searchGpsForMainList()
            },
            handleSizeChange(val) {
                let vm = this
                vm.model.searchParam.pageSize = val
                this.searchGpsForMainList()
            },
            handleRowHandle(row) {
                this.detailsGpsWinShow(row);
            },
            operationClick(id, row) {
                let _this = this;
                switch (id) {
                    case "0":
                        //查看明细
                        _this.useDetailsWinShow(row);
                        break
                    case "1"://编辑
                        _this.editGpsWinShow(row);
                        break;
                    case "2"://删除
                        _this.deleteGpsSubmit(row);
                        break;
                    default:
                }
            },
            //show
            addGpsWinShow() {
                this.win.winShow.gpsAddWin = true
            },
            sendOutGpsWinShow() {
                let vm = this;
                let cardNos = [];
                vm.selections.forEach(res => {
                    cardNos.push(res.code);
                });
                vm.model.gpsSendOutWinModel.cardNos = cardNos
                vm.win.winShow.gpsSendOutWin = true;
            },
            editGpsWinShow(row) {
                let _this = this;
                Http.get(Api.gps.getGpsById, {params: {'id': row.id}}, result => {
                    this.resetGpsEditWin();
                    _this.win.winShow.gpsEditWin = true;
                    setTimeout(() => {
                        _this.$refs.modifyGpsOrgSelect.setCurrentOrg(result.result.org);
                        _this.model.gpsEditWinModel = result.result
                    }, 0)
                })
            },
            useDetailsWinShow(row) {//发放明细
                let _this = this;
                Http.get(Api.gps.getGpsById, {params: {'id': row.id}}, result => {
                    _this.win.winShow.gpsSendOutDetailsWin = true;
                    let details = [];
                    if (result.result.gpsSendOut) {
                        details.push(result.result.gpsSendOut)
                    }
                    if (result.result.gpsSendOuts) {
                        result.result.gpsSendOuts.forEach(gpsSendOut => {
                            details.push(gpsSendOut)
                        })
                    }
                    _this.model.gpsSendOutDetailsTableModel = details
                })
            },
            detailsGpsWinShow(row) {
                let _this = this;
                Http.get(Api.gps.getGpsById, {params: {'id': row.id}}, result => {
                    _this.resetGpsDetailsWin();
                    _this.model.gpsDetailsWinModel = result.result;
                    _this.win.winShow.gpsDetailsWin = true
                })
            },
            //submit
            addGpsWinSubmit(formName) {
                let _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.gps.add, _this.model.gpsAddWinModel, function (res) {
                            _this.resetGpsAddWin();
                            _this.win.winShow.gpsAddWin = false;
                            _this.searchGpsForMainList();
                        })
                    }
                })
            },
            editGpsWinSubmit(formName) {
                let _this = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.gps.modify, _this.model.gpsEditWinModel, function (res) {
                            _this.resetGpsEditWin();
                            _this.win.winShow.gpsEditWin = false;
                            _this.searchGpsForMainList();
                        })
                    }
                })
            },
            sendOutWinSubmit(formName) {
                let _this = this;
                if (_this.model.gpsSendOutWinModel.type === 'USER') {
                    if (!_this.model.gpsSendOutWinModel.user) {
                        this.$message.warning("用户不能为空");
                    }
                }
                if (_this.model.gpsSendOutWinModel.type === 'ORGCODE') {
                    if (!_this.model.gpsSendOutWinModel.orgCode) {
                        this.$message.warning("组织不能为空");
                    }
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.get(Api.gps.setGpsInUse, {
                            params: {
                                'type': _this.model.gpsSendOutWinModel.type,
                                'user': _this.model.gpsSendOutWinModel.user,
                                'orgCode': _this.model.gpsSendOutWinModel.orgCode,
                                'cardNos': _this.model.gpsSendOutWinModel.cardNos
                            }
                        }, function (res) {
                            _this.resetSendOutGpsWin();
                            _this.win.winShow.gpsSendOutWin = false;
                            _this.$message.success('gps发放成功！');
                            _this.searchGpsForMainList();
                        })
                    }
                })
            },
            gpsInvalidSubmit() {
                let _this = this;
                var codes = [];
                _this.selections.forEach(res => {
                    codes.push(res.code);
                })
                this.$confirm('是否作废设备?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.gps.setGpsInvalid, codes, result => {
                        _this.searchGpsForMainList()
                    })
                })
            },
            gpsUnworkedSubmit() {
                let _this = this;
                var codes = [];
                _this.selections.forEach(res => {
                    codes.push(res.code);
                })
                this.$confirm('是否回收设备?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.gps.setUnworked, codes, result => {
                        _this.searchGpsForMainList()
                    })
                })
            },
            exportExcelSubmit() {
                let _this = this;
                let model = _.cloneDeep(_this.model.searchParam);
                model.pageSize = 3000;
                model.currentPage = 1;
                Http.post(Api.gps.getExcelData, model, result => {
                    //导出GPS
                    let header = ['GPS设备号', '类型', '所属大区', '所属分区', '状态', '启用/禁用', '启用/禁用备注', '派车单编号', '运单编号', '品牌', '型号', '待领取人', '持有人', '采购日期', '认领状态', '认领人', '认领组织', '认领时间', '创建人', '创建时间', '修改人', '修改时间', '备注'];
                    let filterVal = ['code', 'type', 'regionOrg.name', 'belongOrg.name', 'status', 'prohibit', 'prohibitRemark', 'dispatchCode', 'waybillCode', 'brand', 'model', 'waitReceiveUser', 'gpsHolder', 'payTime', 'cardClaimStatus', 'cardClaimUser', 'cardClaimOrgCode', 'cardClaimTime', 'createUser', 'createTime', 'modifyUser', 'modifyTime', 'remark'];
                    Common.excel.downloadExl(result.result, header, filterVal, "GPS");
                })
            },
            deleteGpsSubmit(row) {
                let _this = this;
                var ids = [];
                ids.push(row.id);
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.gps.delete, ids, result => {
                        _this.searchGpsForMainList()
                    })
                })
            },
            bindVehicle() {
                let vm = this;
                vm.win.winShow.bindOilCardWin = true
            },
            //绑定车辆
            bindWinSubmit(formName) {
                let vm = this;
                let cardNos = []
                vm.selections.forEach(res => {
                    cardNos.push(res.code);
                })
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.get(Api.gps.bindVehicle, {
                            params: {
                                'cardNos': cardNos,
                                'vehicleCode': vm.model.bindOilCardForm.vehicleCode
                            }
                        }, function (res) {
                            vm.resetbindOilCardWin();
                            vm.searchGpsForMainList();
                            vm.win.winShow.bindOilCardWin = false;
                        })
                    }
                })
            },
            handleClose() {
                this.win.winShow.gpsAddWin = false,
                    this.win.winShowgpsEditWin = false,
                    this.win.winShow.gpsDetailsWin = false,
                    this.win.winShow.gpsSendOutWin = false,
                    this.win.winShow.gpsSendOutDetailsWin = false,
                    this.win.winShow.bindOilCardWin = false,
                    this.win.winShow.gpsClaimStatusWin=false
            },
            cancel() {

            },
            //reset
            resetGpsAddWin() {//重置GPS新增form
                this.model.gpsAddWinModel = this.cloneMode().model.gpsAddWinModel
            },
            resetGpsEditWin() {//重置GPS修改form
                this.model.gpsEditWinModel = this.cloneMode().model.gpsEditWinModel
            },
            resetGpsDetailsWin() {//重置GPS明细form
                this.model.gpsDetailsWinModel = this.cloneMode().model.gpsDetailsWinModel
            },
            resetSendOutGpsWin() {//重置下派GPS form
                this.model.gpsSendOutWinModel = this.cloneMode().model.gpsSendOutWinModel
            },
            resetbindOilCardWin() {//重置绑定车辆
                this.model.bindOilCardForm = this.cloneMode().model.bindOilCardForm
            },
            cancelClaim(row) {
                let _this = this;
                let code = row.code;
                if (row.cardClaimStatus === 'UN_CLAIM') {
                    this.$message.warning("该Gps未认领,不能点击取消认领");
                    return;
                }
                this.$confirm('是否取消认领Gps?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.get(Api.gps.cancelClaim, {params: {'code': code}}, result => {
                        _this.$message.success("取消认领成功");
                        _this.searchGpsForMainList()
                    })
                })
            },
            prohibited() {//启用禁用方法
                let _this = this;
                var cardNo = [];
                // let gpsProhibit = [];//该数组是用来判断gps是启用还是禁用
                _this.win.winShow.gpsModifyStatusWin = true;
                _this.selections.forEach(res => {
                    cardNo.push(res.code);
                    // gpsProhibit.push(res.prohibit)
                });

                if (this.model.gpsStatusForm.status == '0') {//启用
                    Http.get(Api.gps.prohibit, {
                        params: {
                            'gpsCodes': cardNo,
                            'gpsProhibitRemark': this.model.gpsStatusForm.gpsProhibitRemark,
                            "isStart": true
                        }
                    }, result => {
                        _this.model.gpsStatusForm.gpsProhibitRemark = '';
                        _this.win.winShow.gpsModifyStatusWin = false;
                        _this.$message.success("操作成功");
                        _this.searchGpsForMainList()
                    })
                    // this.$prompt('若启用该Gps请填备注', '启用Gps提示', {
                    //     confirmButtonText: '确定',
                    //     cancelButtonText: '取消'
                    // }).then(({value}) => {
                    // })
                }
                if (this.model.gpsStatusForm.status == '1') {//禁用
                    Http.get(Api.gps.prohibit, {
                        params: {
                            'gpsCodes': cardNo,
                            'gpsProhibitRemark': this.model.gpsStatusForm.gpsProhibitRemark,
                            'isStart': false
                        }
                    }, result => {
                        _this.model.gpsStatusForm.gpsProhibitRemark = '';
                        _this.win.winShow.gpsModifyStatusWin = false;
                        _this.$message.success("操作成功");
                        _this.searchGpsForMainList()
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
                _this.selections.forEach(res => {
                    cardNo.push(res.code);
                });
                this.$confirm('是否认领GPS?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.get(Api.gps.claimed, {
                        params: {
                            'gpsCodes': cardNo,
                            'isStart': true
                        }
                    }, result => {
                        _this.$message.success("认领成功");
                        _this.searchGpsForMainList();
                    });
                })
            },
            batchCancleClaim() {//批量取消认领
                let _this = this;
                let cardNo = [];
                _this.selections.forEach(res => {
                    cardNo.push(res.code);
                });
                this.$confirm('是否取消认领GPS?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.get(Api.gps.claimed, {
                        params: {
                            'gpsCodes': cardNo,
                            'isStart': false
                        }
                    }, result => {
                        _this.$message.success("取消认领成功");
                        _this.searchGpsForMainList();
                    });
                })
            },
        }
    }
</script>
