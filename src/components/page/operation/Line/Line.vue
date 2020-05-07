<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础数据</el-breadcrumb-item>
                <el-breadcrumb-item>合同线路</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="searchParam.customerCode" level="lowest" auditStatus="PASS"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <current-org-select v-model="searchParam.regionCode" style="display:block" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出发城市:">
                            <district-select v-model="searchParam.departCityCodeList"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的城市:">
                            <district-select v-model="searchParam.destCityCodeList"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="线路类型:">
                            <dictionary-select v-model="searchParam.lineType" style="display: block"
                                               option-name="LINE_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="应收信息:">
                            <dictionary-select v-model="searchParam.isContract" style="display: block"
                                               option-name="LINE_IS_EXIST"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="合作应付:">
                            <dictionary-select v-model="searchParam.isOutSource" style="display: block"
                                               option-name="LINE_IS_EXIST"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="外请应付:">
                            <dictionary-select v-model="searchParam.isOutInvite" style="display: block"
                                               option-name="LINE_IS_EXIST"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="审核状态:">
                            <dictionary-select v-model="searchParam.auditStatus" style="display: block"
                                               option-name="AUDIT_STATUS"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <el-input v-model="searchParam.lineName" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleCode" style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务类型:">
                            <dictionary-select v-model="searchParam.businessType"
                                               option-name="LINE_BUSINESS_TYPE"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="回单类型:">
                            <dictionary-select v-model="searchParam.receiptType"
                                               option-name="RECEIPT_TYPE"
                                               style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务员:">
                            <all-user-select v-model="searchParam.salesman" style="display: block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="text" v-show="!isMoreItemShow" @click="isMoreItemShow=true" size="small">
                                展开更多搜索项>>
                            </el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="isMoreItemShow=false" size="small">
                                收起搜索项<<
                            </el-button>
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" v-permission="'/line/add'" type="primary" icon="el-icon-plus"
                       @click="dialogAddBaseLineVisible=true">新增
            </el-button>
            <el-button size="mini" v-permission="'/line/collect'" type="primary" icon="el-icon-star-off"
                       @click="lineCollectSubmit()">收藏
            </el-button>
            <el-button v-if="btnLoading" v-permission="'/line/export'" size="mini" type="primary"
                       icon="el-icon-download" @click="lineExportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>

            <el-button v-if="btnLineLoading" v-permission="'/line/allExport'" size="mini" type="primary"
                       icon="el-icon-download" @click="linePayableAndReceivableExport">应收应付导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>

            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center" label="客户" prop="customer.name" show-overflow-tooltip
                                 min-width="120px"></el-table-column>
                <el-table-column header-align="center" label="线路编码" prop="code" show-overflow-tooltip
                                 min-width="210"></el-table-column>
                <el-table-column header-align="center" label="线路名称" show-overflow-tooltip min-width="240">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="doubleClickRow(scope.row)">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="所属大区" prop="regionOrg.name" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="belongOrg.name" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="出发城市" prop="departStation.city.name" show-overflow-tooltip
                                 min-width="80"></el-table-column>
                <el-table-column header-align="center" label="经停城市" prop="lineTransitCityStr" show-overflow-tooltip
                                 min-width="130"></el-table-column>
                <el-table-column header-align="center" label="目的城市" prop="destStation.city.name" show-overflow-tooltip
                                 min-width="80"></el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="departStation.name" show-overflow-tooltip
                                 min-width="150"></el-table-column>
                <el-table-column header-align="center" label="经停站点" prop="lineTransitStationStr" show-overflow-tooltip
                                 min-width="150"></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="destStation.name" show-overflow-tooltip
                                 min-width="150"></el-table-column>
                <el-table-column header-align="center" label="审核状态" prop="auditStatus" min-width="90">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS"
                                                :value="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作状态" prop="operationStatus" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OPERATION_STATUS"
                                                :value="scope.row.operationStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路类型" prop="lineType" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_TYPE"
                                                :value="scope.row.lineType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="营运类型" prop="operationType" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_OPERATION_TYPE"
                                                :value="scope.row.operationType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="考核方式" prop="evaluationMode" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_EVALUATION_MODE"
                                                :value="scope.row.evaluationMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="发车时间" prop="departTime" min-width="80"></el-table-column>
                <el-table-column header-align="center" label="客户时效" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.timeHour ? scope.row.timeHour : "0"}}小时</span>
                        <span>{{scope.row.timeMin ? scope.row.timeMin : "0"}}分钟</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="则一时效" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.timeZeyiHour ? scope.row.timeZeyiHour : "0"}}小时</span>
                        <span>{{scope.row.timeZeyiMin ? scope.row.timeZeyiMin : "0"}}分钟</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="里程" prop="distance" min-width="80"></el-table-column>
                <el-table-column header-align="center" label="是否共建线路" prop="togetherFlag" min-width="120">
                    <template slot-scope="scope">
                        {{scope.row.togetherFlag ? "是" : "否"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="业务类型" prop="businessType" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_BUSINESS_TYPE"
                                                :value="scope.row.businessType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="回单类型" prop="receiptType" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="RECEIPT_TYPE"
                                                :value="scope.row.receiptType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="业务员" prop="salesmanList"
                                 show-overflow-tooltip
                                 min-width="280px"></el-table-column>

                <el-table-column align="center" label="操作" fixed="right" width="260">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/line/modify'" size="mini" icon="el-icon-edit"
                                   @click="modifyBaseLine(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/line/delete'" size="mini" icon="el-icon-delete"
                                   @click="deleteBaseLine(scope.row)"></el-button>
                        <span v-if='scope.row.isExistLineContract == "0" '>
                            <el-button type="text" v-permission="'/lineContract/add'" size="mini"
                                       style="padding: 0px 10px 0px 10px" @click="dialogContractInfoVisible(scope.row)">应收信息</el-button>
                        </span>
                        <span v-else>
                            <el-button type="text" v-permission="'/lineContract/add'" size="mini"
                                       style="padding: 0px 10px 0px 10px; color: red"
                                       @click="dialogContractInfoVisible(scope.row)">应收信息</el-button>
                        </span>
                        <el-button type="text" v-permission="'/lineOutsource/page'" size="mini"
                                   @click="dialogOutSourcedVisible(scope.row)">合作应付
                        </el-button>
                        <el-button type="text" v-permission="'/lineOutInvite/page'" size="mini"
                                   @click="dialogOutInviteVisible(scope.row)">外请应付
                        </el-button>
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

        <!-- 新增线路基本信息弹出框 -->
        <el-dialog class="appendClassStyle" title="新增线路基本信息" :visible.sync="dialogAddBaseLineVisible" width="1000px">
            <el-form size="small" inline :model="addBaseInfoLineForm" :rules="addBaseInfoLineFormRules"
                     ref="addBaseInfoLineForm" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户:" prop="customerCode">
                            <customer-select v-model="addBaseInfoLineForm.customerCode" level="lowest"
                                             auditStatus="PASS"
                                             :change="changeAddCustomerCodeInfo" style="width:200px"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出发站点:" prop="departStationCode">
                            <station-select v-model="addBaseInfoLineForm.departStationCode" @change="changeStation"
                                            :customerCode="customerCodeTmp" auditStatus="PASS"
                                            ref="clearDepartStationCode" style="width:200px">
                            </station-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="目的站点:" prop="destStationCode">
                            <station-select v-model="addBaseInfoLineForm.destStationCode" @change="obj=>addBaseInfoLineForm.destStation=obj"
                                            :customerCode="customerCodeTmp" auditStatus="PASS"
                                            ref="clearDestStationCode" style="width:200px">
                            </station-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="发车时间:" prop="departTime">
                            <el-time-picker type="fixed-time" placeholder="请选择时间" format="HH:mm"
                                            value-format="HH:mm" v-model="addBaseInfoLineForm.departTime"
                                            style="width:200px"></el-time-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="线路类型:" prop="lineType">
                            <dictionary-select v-model="addBaseInfoLineForm.lineType" option-name="LINE_TYPE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="营运类型:" prop="operationType">
                            <dictionary-select v-model="addBaseInfoLineForm.operationType"
                                               option-name="LINE_OPERATION_TYPE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="总里程:" prop="distance">
                            <el-input v-model="addBaseInfoLineForm.distance" style="width:200px">
                                <template slot="append">公里</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户时效:" prop="timeHour">
                            <el-input v-model="addBaseInfoLineForm.timeHour" @input="changeTime1" style="width:93px">
                                <template slot="append">小时</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="timeMin">
                            <el-input v-model="addBaseInfoLineForm.timeMin" @input="changeTime2" style="width:93px">
                                <template slot="append">分钟</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="则一时效:" prop="timeZeyiHour">
                            <el-input v-model="addBaseInfoLineForm.timeZeyiHour" style="width:93px" disabled>
                                <template slot="append">小时</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="timeZeyiMin">
                            <el-input v-model="addBaseInfoLineForm.timeZeyiMin" style="width:93px" disabled>
                                <template slot="append">分钟</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="考核方式:" prop="evaluationMode">
                            <dictionary-select v-model="addBaseInfoLineForm.evaluationMode"
                                               option-name="LINE_EVALUATION_MODE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否共建线路:" prop="togetherFlag">
                            <dictionary-select v-model="addBaseInfoLineForm.togetherFlag"
                                               option-name="BOOLEAN_FLAG"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="业务类型:" prop="businessType">
                            <dictionary-select v-model="addBaseInfoLineForm.businessType"
                                               option-name="LINE_BUSINESS_TYPE"
                                               :disabled="addBaseInfoLineForm.addBaseInfoLineFormDisabled"
                                               :excludeOptions="addBaseInfoLineForm.exclude"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="回单类型:" prop="receiptType">
                            <dictionary-select v-model="addBaseInfoLineForm.receiptType"
                                               option-name="RECEIPT_TYPE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="业务员:" prop="salesmanList">
                            <MultipleUserSelect style="width:200px" v-model="addBaseInfoLineForm.salesmanUserNameList"></MultipleUserSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属区域:" prop="belongOrgCode">
                            <current-org-select v-model="addBaseInfoLineForm.belongOrgCode" nature="PARTITION" style="display:block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="addStationInfoAddData()">新增经停站点</el-button>
                <span style="color: red; margin-left: 40px;">总里程为系统根据站点位置自动计算走高速的里程，仅供参考!!!</span>
                <el-table size="small" class="content-table" :data="addBaseInfoLineForm.stationInfoList" border>
                    <el-table-column align="center" label="经停站点" prop="transitStationName"
                                     min-width="140"></el-table-column>
                    <el-table-column align="center" label="里程" prop="distance" min-width="100"></el-table-column>
                    <el-table-column align="center" label="客户时效" prop="travelTimeHour" min-width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.travelTimeHour ? scope.row.travelTimeHour:"0"}}小时</span>
                            <span>{{scope.row.travelTimeMin ? scope.row.travelTimeMin : "0"}}分钟</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column align="center" label="停留时间" prop="stayTime" width="130">
                        <template slot-scope="scope">
                            <span>{{scope.row.stayTimeHour ? scope.row.stayTimeZeyiHour : "0"}}小时</span>
                            <span>{{scope.row.stayTimeMin ? scope.row.stayTimeMin : "0"}}分钟</span>
                        </template>
                    </el-table-column>-->
                    <el-table-column align="center" label="则一时效" prop="travelTimeZeyi" min-width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.travelTimeZeyiHour ? scope.row.travelTimeZeyiHour : "0"}}小时</span>
                            <span>{{scope.row.travelTimeZeyiMin ?scope.row.travelTimeZeyiMin : "0"}}分钟</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column align="center" label="则一停留时间" prop="stayTimeZeyi" width="130">
                        <template slot-scope="scope">
                            <span>{{scope.row.stayTimeZeyiHour ? scope.row.stayTimeZeyiHour : "0"}}小时</span>
                            <span>{{scope.row.stayTimeZeyiMin ? scope.row.stayTimeZeyiMin : "0"}}分钟</span>
                        </template>
                    </el-table-column>-->
                    <el-table-column align="center" label="操作" fixed="right" min-width="100">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" size="mini"
                                       @click="addStationInfoModifyData(scope.$index,scope.row)"></el-button>
                            <el-button type="text" icon="el-icon-delete" size="mini"
                                       @click="deleteStationInfo(scope.$index,addBaseInfoLineForm.stationInfoList)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddBaseLineVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addSaveBaseInfoLine('addBaseInfoLineForm')">确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 修改线路基本信息弹出框 -->
        <el-dialog class="appendClassStyle" title="修改线路基本信息" :visible.sync="dialogModifyBaseLineVisible" width="1000px" @close="resetModifyBaseInfoLineForm">
            <el-form size="small" inline :model="modifyBaseInfoLineForm" :rules="addBaseInfoLineFormRules"
                     ref="modifyBaseInfoLineForm" label-width="100px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="客户:" prop="customerCode">
                            <customer-select ref="modifyCustomerCode" v-model="modifyBaseInfoLineForm.customerCode"
                                             level="lowest" auditStatus="PASS"
                                             :change="changeModifyCustomerCodeInfo"
                                             style="width:200px"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="出发站点:" prop="departStationCode">
                            <station-select v-model="modifyBaseInfoLineForm.departStationCode" @change="changeDepartStation"
                                            :customerCode="customerCodeTmp" auditStatus="PASS"
                                            ref="modifyDepartStationCode" style="width:200px">
                            </station-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="目的站点:" prop="destStationCode">
                            <station-select v-model="modifyBaseInfoLineForm.destStationCode" @change="changeDestStation"
                                            :customerCode="customerCodeTmp" auditStatus="PASS"
                                            ref="modifyDestStationCode" style="width:200px">
                            </station-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="发车时间:" prop="departTime">
                            <el-time-picker type="fixed-time" placeholder="请选择时间" format="HH:mm"
                                            value-format="HH:mm" v-model="modifyBaseInfoLineForm.departTime"
                                            style="width:200px"></el-time-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="线路类型:" prop="lineType">
                            <dictionary-select v-model="modifyBaseInfoLineForm.lineType" option-name="LINE_TYPE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="营运类型:" prop="operationType">
                            <dictionary-select v-model="modifyBaseInfoLineForm.operationType"
                                               option-name="LINE_OPERATION_TYPE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="总里程:" prop="distance">
                            <el-input v-model="modifyBaseInfoLineForm.distance" style="width:200px">
                                <template slot="append">公里</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="客户时效:" prop="timeHour">
                            <el-input v-model="modifyBaseInfoLineForm.timeHour"
                                      :disabled="!$_permission('/line/lineTime')"
                                      @input="changeTime3" style="width:93px">
                                <template slot="append">小时</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="timeMin">
                            <el-input v-model="modifyBaseInfoLineForm.timeMin"
                                      :disabled="!$_permission('/line/lineTime')"
                                      @input="changeTime4" style="width:93px">
                                <template slot="append">分钟</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="则一时效:" prop="timeZeyiHour">
                            <el-input v-model="modifyBaseInfoLineForm.timeZeyiHour" style="width:93px"
                                      :disabled="!$_permission('/line/lineTime')">
                                <template slot="append">小时</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="timeZeyiMin">
                            <el-input v-model="modifyBaseInfoLineForm.timeZeyiMin" style="width:93px"
                                      :disabled="!$_permission('/line/lineTime')">
                                <template slot="append">分钟</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="考核方式:" prop="evaluationMode">
                            <dictionary-select v-model="modifyBaseInfoLineForm.evaluationMode"
                                               option-name="LINE_EVALUATION_MODE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否共建线路:" prop="togetherFlag">
                            <dictionary-select v-model="modifyBaseInfoLineForm.togetherFlag"
                                               option-name="BOOLEAN_FLAG"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="业务类型:" prop="businessType">
                            <dictionary-select v-model="modifyBaseInfoLineForm.businessType"
                                               option-name="LINE_BUSINESS_TYPE"
                                               :disabled="modifyBaseInfoLineForm.modifyBaseInfoLineFormDisabled"
                                               :excludeOptions="modifyBaseInfoLineForm.exclude"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="回单类型:" prop="receiptType">
                            <dictionary-select v-model="modifyBaseInfoLineForm.receiptType"
                                               option-name="RECEIPT_TYPE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                            <el-form-item label="业务员:" prop="salesmanList">
                                <MultipleUserSelect ref="salesmanUserNameList" v-model="modifyBaseInfoLineForm.salesmanUserNameList"></MultipleUserSelect>
                            </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所属区域:" prop="belongOrgCode">
                            <current-org-select v-model="modifyBaseInfoLineForm.belongOrgCode" nature="PARTITION" style="display:block"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-button size="mini" type="primary" icon="el-icon-plus" @click="modifyStationInfoAddData()">新增经停站点</el-button>
                <span style="color: red; margin-left: 40px;">总里程为系统根据站点位置自动计算走高速的里程，仅供参考!!!</span>
                <el-table size="small" class="content-table" :data="modifyBaseInfoLineForm.stationInfoList" border>
                    <el-table-column align="center" label="经停站点" prop="transitStationName"
                                     min-width="140"></el-table-column>
                    <el-table-column align="center" label="里程" prop="distance" min-width="100"></el-table-column>
                    <el-table-column align="center" label="客户时效" prop="travelTime" min-width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.travelTimeHour ? scope.row.travelTimeHour:"0"}}小时</span>
                            <span>{{scope.row.travelTimeMin ? scope.row.travelTimeMin : "0"}}分钟</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column align="center" label="停留时间" prop="stayTime" width="130">-->
                    <!--<template slot-scope="scope">-->
                    <!--<span>{{scope.row.stayTimeHour ? scope.row.stayTimeZeyiHour : "0"}}小时</span>-->
                    <!--<span>{{scope.row.stayTimeMin ? scope.row.stayTimeMin : "0"}}分钟</span>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column align="center" label="则一时效" prop="travelTimeZeyi" min-width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.travelTimeZeyiHour ? scope.row.travelTimeZeyiHour : "0"}}小时</span>
                            <span>{{scope.row.travelTimeZeyiMin ?scope.row.travelTimeZeyiMin : "0"}}分钟</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column align="center" label="则一停留时间" prop="stayTimeZeyi" width="130">-->
                    <!--<template slot-scope="scope">-->
                    <!--<span>{{scope.row.stayTimeZeyiHour ? scope.row.stayTimeZeyiHour : "0"}}小时</span>-->
                    <!--<span>{{scope.row.stayTimeZeyiMin ? scope.row.stayTimeZeyiMin : "0"}}分钟</span>-->
                    <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column align="center" label="操作" fixed="right" min-width="100">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" size="mini"
                                       @click="modifyStationInfoModifyData(scope.$index,scope.row)"></el-button>
                            <el-button type="text" icon="el-icon-delete" size="mini"
                                       @click="deleteStationInfo(scope.$index,modifyBaseInfoLineForm.stationInfoList)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyBaseLineVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifySaveBaseInfoLine('modifyBaseInfoLineForm')">确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 新增站点信息form -->
        <el-dialog class="appendClassStyle" title="新增线路站点信息" :visible.sync="dialogAddStationInfoVisible" width="450px">
            <el-form size="small" inline :model="dialogAddStationInfoForm" :rules="dialogAddStationInfoFormRules"
                     ref="dialogAddStationInfoForm" label-width="130px">
                <el-form-item label="经停站点:" prop="transitStationCode">
                    <station-select v-model="dialogAddStationInfoForm.transitStationCode" @change="obj=>dialogAddStationInfoForm.transitStation=obj"
                                    :customerCode="customerCodeTmp"
                                    ref="addStationInfoCode" auditStatus="PASS"
                                    :stationName.sync="dialogAddStationInfoForm.transitStationName">
                    </station-select>
                </el-form-item>
                <el-form-item label="里程:" prop="distance">
                    <el-input v-model="dialogAddStationInfoForm.distance" style="width:215px">
                        <template slot="append">公里</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="客户时效:" prop="travelTimeHour">
                    <el-input v-model="dialogAddStationInfoForm.travelTimeHour"
                              style="width:100px" @input="syncTime1">
                        <template slot="append">小时</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="travelTimeMin">
                    <el-input v-model="dialogAddStationInfoForm.travelTimeMin"
                              style="width:100px" @input="syncTime2">
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="停留时间:" prop="stayTimeHour" v-if="false">
                    <el-input v-model="dialogAddStationInfoForm.stayTimeHour"
                              style="width:100px" @input="syncTime3">
                        <template slot="append">小时</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="stayTimeMin" v-if="false">
                    <el-input v-model="dialogAddStationInfoForm.stayTimeMin"
                              style="width:100px" @input="syncTime4">
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="则一时效:" prop="travelTimeZeyiHour">
                    <el-input v-model="dialogAddStationInfoForm.travelTimeZeyiHour" style="width:100px" disabled>
                        <template slot="append">小时</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="travelTimeZeyiMin">
                    <el-input v-model="dialogAddStationInfoForm.travelTimeZeyiMin" style="width:100px" disabled>
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="则一停留时间:" prop="stayTimeZeyiHour" v-if="false">
                    <el-input v-model="dialogAddStationInfoForm.stayTimeZeyiHour" style="width:100px">
                        <template slot="append">小时</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="stayTimeZeyiMin" v-if="false">
                    <el-input v-model="dialogAddStationInfoForm.stayTimeZeyiMin" style="width:100px">
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddStationInfoVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="saveAddStationInfo(isModify)">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改站点信息form -->
        <el-dialog class="appendClassStyle" title="修改线路站点信息" :visible.sync="dialogModifyStationInfoVisible"
                   width="450px">
            <el-form size="small" inline :model="dialogModifyStationInfoForm" :rules="dialogAddStationInfoFormRules"
                     ref="dialogModifyStationInfoForm" label-width="130px">
                <el-form-item label="经停站点:" prop="transitStationCode">
                    <station-select v-model="dialogModifyStationInfoForm.transitStationCode" @change="obj=>dialogModifyStationInfoForm.transitStation=obj"
                                    :customerCode="customerCodeTmp" auditStatus="PASS"
                                    :stationName.sync="dialogModifyStationInfoForm.transitStationName"
                                    ref="modifyLineDestStation">
                    </station-select>
                </el-form-item>

                <el-form-item label="里程:" prop="distance">
                    <el-input v-model="dialogModifyStationInfoForm.distance" style="width:215px">
                        <template slot="append">公里</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="客户时效:" prop="travelTimeHour">
                    <el-input v-model="dialogModifyStationInfoForm.travelTimeHour"
                              style="width:100px" @input="syncTime5">
                        <template slot="append">小时</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="travelTimeMin">
                    <el-input v-model="dialogModifyStationInfoForm.travelTimeMin"
                              style="width:100px" @input="syncTime6">
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="停留时间:" prop="stayTimeHour" v-if="false">
                    <el-input v-model="dialogModifyStationInfoForm.stayTimeHour"
                              style="width:100px" @input="syncTime7">
                        <template slot="append">小时</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="stayTimeMin" v-if="false">
                    <el-input v-model="dialogModifyStationInfoForm.stayTimeMin"
                              style="width:100px" @input="syncTime8">
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="则一时效:" prop="travelTimeZeyiHour">
                    <el-input v-model="dialogModifyStationInfoForm.travelTimeZeyiHour" style="width:100px">
                        <template slot="append">小时</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="travelTimeZeyiMin">
                    <el-input v-model="dialogModifyStationInfoForm.travelTimeZeyiMin" style="width:100px">
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="则一停留时间:" prop="stayTimeZeyiHour" v-if="false">
                    <el-input v-model="dialogModifyStationInfoForm.stayTimeZeyiHour" style="width:130px">
                        <template slot="append">小时</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="stayTimeZeyiMin" v-if="false">
                    <el-input v-model="dialogModifyStationInfoForm.stayTimeZeyiMin" style="width:130px">
                        <template slot="append">分钟</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyStationInfoVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="saveModifyStationInfo(isModify)">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增线路应收信息弹出框 -->
        <el-dialog title="线路应收信息" :visible.sync="dialogAddContractInfoVisible" width="760px"
                   @close="closeInfoLineFormInfoLineForm">
            <el-form size="small" inline :model="addContractInfoLineForm" :rules="addContractInfoLineFormRules"
                     ref="addContractInfoLineForm" label-width="130px" id="addContractInfoLineForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="审核状态:" prop="auditStatus">
                            <dictionary-select-name option-name="AUDIT_STATUS" style="width:200px"
                                                    :value="addContractInfoLineForm.auditStatus"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作状态:" prop="auditStatus">
                            <dictionary-select-name option-name="OPERATION_STATUS" style="width:200px"
                                                    :value="addContractInfoLineForm.operationStatus"></dictionary-select-name>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="收入主体:" prop="incomeSubject">
                            <dictionary-select v-model="addContractInfoLineForm.incomeSubject"
                                               option-name="LINE_INCOME_SUBJECT"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户全称:" prop="customerName">
                            <settlement-customer-select v-model="addContractInfoLineForm.customerName"
                                                        ref="modifySettlementCustomerName"
                                                        style="width:200px"></settlement-customer-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户合同编号:" prop="customerContractNo">
                            <el-input v-model="addContractInfoLineForm.customerContractNo"
                                      style="width:200px"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户合同图片:" prop="customerContractImage">
                            <upload-image ref="customerContractAttachment" :limit="1"></upload-image>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合同开始时间:" prop="startDate">
                            <el-date-picker
                                type="date"
                                v-model="addContractInfoLineForm.startDate"
                                :picker-options="pickerBeginDateBefore"
                                format="yyyy-MM-dd"
                                placeholder="请选择日期"
                                style="width:200px">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合同结束时间:" prop="endDate">
                            <el-date-picker
                                type="date"
                                v-model="addContractInfoLineForm.endDate"
                                :picker-options="pickerBeginDateAfter"
                                format="yyyy-MM-dd"
                                placeholder="请选择日期"
                                style="width:200px">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="计价方式:" prop="priceType">
                            <dictionary-select v-model="addContractInfoLineForm.priceType" :excludeOptions="['ALL_DAY']"
                                               :change="changeReceivePriceTypeValue" option-name="LINE_PRICE_TYPE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if='addContractInfoLineForm.priceType === Constant.LINE_PRICE_TYPE.WEIGHT'>
                        <el-form-item label="计价模式:" prop="valuationPriceModel">
                            <dictionary-select v-model="addContractInfoLineForm.valuationPriceModel"
                                               option-name="VALUATION_PRICE_MPDEL"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单价:" prop="unitPrice"
                                      v-if='addContractInfoLineForm.priceType!= Constant.LINE_PRICE_TYPE.NORMAL '>
                            <el-input :controls="false" v-model="addContractInfoLineForm.unitPrice"
                                      style="width:200px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-button v-if='addContractInfoLineForm.priceType== Constant.LINE_PRICE_TYPE.NORMAL'
                                   size="mini" type="primary"
                                   icon="el-icon-plus" @click="addVehicleSizeDialog=true">新增车型
                        </el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table v-if='addContractInfoLineForm.priceType==Constant.LINE_PRICE_TYPE.NORMAL '
                                  size="small" class="content-table"
                                  :data="addContractInfoLineForm.vehicleSizeList" border>
                            <el-table-column align="center" label="车型规格" prop="vehicleSize">
                                <template slot-scope="scope">
                                    <dictionary-select-name option-name="VEHICLE_SPECIFICATION"
                                                            :value="scope.row.vehicleSize"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="单价" prop="unitPrice"></el-table-column>
                            <el-table-column align="center" label="操作" fixed="right" width="140">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-delete" size="mini"
                                               @click="deleteStationInfo(scope.$index,addContractInfoLineForm.vehicleSizeList)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddContractInfoVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addContractInfoLine('addContractInfoLineForm')">确 定
                </el-button>
            </div>
        </el-dialog>
        <!-- 新增车型规格弹出框 -->
        <el-dialog title="新增车型规格信息" :visible.sync="addVehicleSizeDialog" width="380px">
            <el-form size="small" inline :model="addVehicleSizeForm" :rules="addVehicleSizeFormRules"
                     ref="addVehicleSizeForm" label-width="100px">
                <el-form-item label="车型规格:" prop="vehicleSize">
                    <dictionary-select v-model="addVehicleSizeForm.vehicleSize" option-name="VEHICLE_SPECIFICATION"
                                       style="width:200px"></dictionary-select>
                </el-form-item>
                <el-form-item label="单价:" prop="unitPrice">
                    <el-input v-model="addVehicleSizeForm.unitPrice" style="width:200px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="addVehicleSizeDialog=false">取 消</el-button>
                <el-button size="small" type="primary" @click="addVehicleSize('addVehicleSizeForm')">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增线路合作应付信息列表 -->
        <el-dialog title="线路合作应付信息" :visible.sync="dialogDetailOutsourceVisible" width="70%">
            <el-button size="mini" v-permission="'/lineOutsource/add'" type="primary" icon="el-icon-plus"
                       @click="dialogAddOutsourceVisibleData()">新增
            </el-button>
            <el-button size="mini" v-permission="'/lineOutsource/batchModify'" type="primary" icon="el-icon-edit"
                       @click="batchModifyOutsourceData()">批量修改
            </el-button>
            <el-table class="content-table" :data="searchOutsourceResult.result" element-loading-text="拼命加载中"
                      size="small"
                      @selection-change="handleSelectionChangeOutsource"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="关联车辆" prop="vehicleInfo.licenseNumber"></el-table-column>
                <template v-if="$_permission('/lineOutsource/priceLinkageAdd')">
                    <el-table-column align="center" label="车型" prop="vehicleSize"></el-table-column>
                </template>
                <el-table-column align="center" label="合作价格" prop="outsourcePrice"></el-table-column>
                <template v-if="$_permission('/lineOutsource/priceLinkageAdd')">
                    <el-table-column align="center" label="百公里油耗" prop="oilConsumption"></el-table-column>
                </template>
                <template v-if="$_permission('/lineOutsource/priceLinkageAdd')">
                    <el-table-column align="center" label="基准油价" prop="baseOilPrice"></el-table-column>
                </template>
                <template v-if="$_permission('/lineOutsource/priceLinkageAdd')">
                    <el-table-column align="center" label="结算里程" prop="baseDistance"></el-table-column>
                </template>
                <template v-if="$_permission('/lineOutsource/priceLinkageAdd')">
                    <el-table-column align="center" label="是否享受油价联动" prop="priceLinkage">
                        <template slot-scope="scope">
                            {{scope.row.priceLinkage ? "是" : "否"}}
                        </template>
                    </el-table-column>
                </template>
                <el-table-column align="center" label="审核状态" prop="auditStatus">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS"
                                                :value="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作状态" prop="operationStatus">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OPERATION_STATUS"
                                                :value="scope.row.operationStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="140">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/lineOutsource/modify'" icon="el-icon-edit" size="mini"
                                   @click="modifyOutsourceById(scope.$index,scope.row)"></el-button>
                        <el-button type="text" v-permission="'/lineOutsource/delete'" icon="el-icon-delete" size="mini"
                                   @click="deleteOutsource(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="height:45px">
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChangeOutsource"
                        @current-change="handleCurrentChangeOutsource"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="searchOutsourceParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchOutsourceResult.totalCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>

        <!-- 新增线路合作应付信息弹出框 -->
        <el-dialog title="新增合作应付信息" :visible.sync="dialogAddOutsourceVisible" width="470px">
            <el-form size="small" inline :model="dialogAddOutsourceForm" :rules="dialogAddOutsourceFormRules"
                     ref="dialogAddOutsourceForm" label-width="150px">
                <el-form-item label="关联车辆:" prop="vehicle">
                    <vehicle-select v-model="dialogAddOutsourceForm.vehicle" vehicleOperationType="OUTSOURCE"
                                    :type="[Constant.VEHICLE_TYPE.VAN,Constant.VEHICLE_TYPE.TRACTOR]"
                                    style="width:200px"
                                    @change-option="getAddVehicleSize"></vehicle-select>
                </el-form-item>
                <el-form-item label="合作价格:" prop="outsourcePrice">
                    <el-input v-model="dialogAddOutsourceForm.outsourcePrice" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <span v-if="$_permission('/lineOutsource/priceLinkageAdd')">
                  <el-form-item label="是否享受油价联动:" prop="priceLinkage">
                    <el-switch style="width:200px" v-model="dialogAddOutsourceForm.priceLinkage" active-color="#13ce66"
                               @change="addOutsourcePriceLinkage" inactive-color="#ff4949" active-text="是"
                               inactive-text="否"/>
                </el-form-item>
                </span>
                <el-form-item label="车型:" prop="vehicleSize" v-if='dialogAddOutsourceForm.priceLinkage'>
                    <dictionary-select v-model="dialogAddOutsourceForm.vehicleSize" option-name="VEHICLE_SPECIFICATION"
                                       :filterable="true" style="width:200px"></dictionary-select>
                </el-form-item>
                <el-form-item label="百公里油耗:" prop="oilConsumption" v-if='dialogAddOutsourceForm.priceLinkage'>
                    <el-input v-model="dialogAddOutsourceForm.oilConsumption" style="width:200px">
                        <template slot="append">升</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="基准油价:" prop="baseOilPrice" v-if='dialogAddOutsourceForm.priceLinkage'>
                    <el-input v-model="dialogAddOutsourceForm.baseOilPrice" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="结算里程:" prop="baseDistance" v-if='dialogAddOutsourceForm.priceLinkage'>
                    <el-input v-model="dialogAddOutsourceForm.baseDistance" style="width:200px">
                        <template slot="append">公里</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddOutsourceVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addOutsource('dialogAddOutsourceForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改线路合作应付信息弹出框 -->
        <el-dialog title="修改合作应付信息" :visible.sync="dialogModifyOutsourceVisible" width="470px">
            <el-form size="small" inline :model="dialogModifyOutsourceForm" :rules="dialogAddOutsourceFormRules"
                     ref="dialogModifyOutsourceForm" label-width="150px">
                <el-form-item label="关联车辆:" prop="vehicle">
                    <vehicle-select v-model="dialogModifyOutsourceForm.vehicle" vehicleOperationType="OUTSOURCE"
                                    ref="modifyOutsourceVehicle"
                                    :type="[Constant.VEHICLE_TYPE.VAN,Constant.VEHICLE_TYPE.TRACTOR]"
                                    style="width:200px"
                                    @change-option="getModifyVehicleSize"></vehicle-select>
                </el-form-item>
                <el-form-item label="合作价格:" prop="outsourcePrice">
                    <el-input v-model="dialogModifyOutsourceForm.outsourcePrice" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <span v-if="$_permission('/lineOutsource/priceLinkageAdd')">
                <el-form-item label="是否享受油价联动:" prop="priceLinkage">
                    <el-switch style="width:200px" v-model="dialogModifyOutsourceForm.priceLinkage"
                               @change="modifyOutsourcePriceLinkage"
                               active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否"/>
                </el-form-item>
                </span>
                <el-form-item label="车型:" prop="vehicleSize" v-if="dialogModifyOutsourceForm.priceLinkage">
                    <dictionary-select v-model="dialogModifyOutsourceForm.vehicleSize"
                                       option-name="VEHICLE_SPECIFICATION" :filterable="true"
                                       style="width:200px"></dictionary-select>
                </el-form-item>
                <el-form-item label="百公里油耗:" prop="oilConsumption" v-if="dialogModifyOutsourceForm.priceLinkage">
                    <el-input v-model="dialogModifyOutsourceForm.oilConsumption" style="width:200px">
                        <template slot="append">升</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="基准油价:" prop="baseOilPrice" v-if="dialogModifyOutsourceForm.priceLinkage">
                    <el-input v-model="dialogModifyOutsourceForm.baseOilPrice" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="结算里程:" prop="baseDistance" v-if="dialogModifyOutsourceForm.priceLinkage">
                    <el-input v-model="dialogModifyOutsourceForm.baseDistance" style="width:200px">
                        <template slot="append">公里</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyOutsourceVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyOutsource('dialogModifyOutsourceForm')">确 定
                </el-button>
            </div>
        </el-dialog>
        <!-- 批量修改线路合作应付信息弹出框 -->
        <el-dialog title="修改合作应付信息" :visible.sync="batchModifyOutsourceVisible" width="470px">
            <el-form size="small" inline :model="batchModifyOutsourceForm" :rules="dialogAddOutsourceFormRules"
                     ref="batchModifyOutsourceForm" label-width="150px">
                <el-form-item label="合作价格:" prop="outsourcePrice">
                    <el-input v-model="batchModifyOutsourceForm.outsourcePrice" style="width:200px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="batchModifyOutsourceVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="batchModifyOutsource('batchModifyOutsourceForm')">确 定
                </el-button>
            </div>
        </el-dialog>

        <!-- 新增外请应付信息列表 -->
        <el-dialog title="线路外请应付信息" :visible.sync="dialogDetailOutInviteVisible" width="70%">
            <el-button size="mini" v-permission="'/lineOutInvite/add'" type="primary" icon="el-icon-plus"
                       @click="dialogAddOutInviteVisible=true">新增
            </el-button>
            <el-table class="content-table" :data="searchOutInviteResult.result" element-loading-text="拼命加载中"
                      size="small"
                      @selection-change="handleSelectionChangeOutInvite"
                      border fit
                      highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="关联供应商" prop="supplierInfo.name"
                                 min-width="120"></el-table-column>
                <el-table-column align="center" label="计价方式" prop="priceType">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_PRICE_TYPE" :excludeOptions="['ALL_DAY']"
                                                :value="scope.row.priceType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="车型规格" prop="vehicleSize">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_SPECIFICATION"
                                                :value="scope.row.vehicleSize"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="计价单价" prop="priceUnit"></el-table-column>
                <el-table-column align="center" label="油卡金额" prop="oilCardAmount"></el-table-column>
                <!--<el-table-column align="center" label="是否开票" prop="isInvoice">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="IS_EXIST"
                                                :value="scope.row.isInvoice"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="开票类型" prop="invoiceType">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_INVOICE_TYPE"
                                                :value="scope.row.invoiceType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="开票比例" prop="invoiceRatio"></el-table-column>
                <el-table-column align="center" label="开票金额" prop="invoiceAmount"></el-table-column>-->
                <el-table-column align="center" label="审核状态" prop="auditStatus">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS"
                                                :value="scope.row.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作状态" prop="operationStatus">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="OPERATION_STATUS"
                                                :value="scope.row.operationStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/lineOutInvite/modify'" icon="el-icon-edit" size="mini"
                                   @click="modifyOutInviteById(scope.$index,scope.row)"></el-button>
                        <el-button type="text" v-permission="'/lineOutInvite/delete'" icon="el-icon-delete" size="mini"
                                   @click="deleteOutInvite(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="height: 45px">
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChangeOutInvite"
                        @current-change="handleCurrentChangeOutInvite"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="searchOutInviteParam.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchOutInviteResult.totalCount">
                    </el-pagination>
                </div>
            </div>
        </el-dialog>
        <!-- 新增线路外请应付信息弹出框 -->
        <el-dialog title="新增外请应付信息" :visible.sync="dialogAddOutInviteVisible" width="720px">
            <el-form size="small" inline :model="dialogAddOutInviteForm" :rules="dialogAddOutInviteFormRules"
                     ref="dialogAddOutInviteForm" label-width="115px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="关联供应商:" prop="supplier">
                            <supplier-select v-model="dialogAddOutInviteForm.supplier"
                                             :types="Constant.SUPPLIER_TYPE.CAR_TEAM+','+Constant.SUPPLIER_TYPE.DEPARTMENT_OF_INFORMATION"
                                             style="width:200px"></supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计价方式:" prop="priceType">
                            <dictionary-select v-model="dialogAddOutInviteForm.priceType" :change="changePriceTypeValue"
                                               :excludeOptions="['ALL_DAY']"
                                               option-name="LINE_PRICE_TYPE" style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车型规格:" prop="vehicleSize">
                            <dictionary-select v-model="dialogAddOutInviteForm.vehicleSize"
                                               :disabled="dialogAddOutInviteForm.vehicleSizeDisabled"
                                               option-name="VEHICLE_SPECIFICATION"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计价单价:" prop="priceUnit">
                            <el-input v-model="dialogAddOutInviteForm.priceUnit" style="width:200px">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="油卡金额:" prop="oilCardAmount">
                            <el-input v-model="dialogAddOutInviteForm.oilCardAmount" style="width:200px">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogAddOutInviteVisible = false">取 消</el-button>
                <el-button size="small" :disabled=addOutInviteDisable type="primary"
                           @click="addOutInvite('dialogAddOutInviteForm')">确 定
                </el-button>
            </div>
        </el-dialog>
        <!-- 修改线路外请应付信息弹出框 -->
        <el-dialog title="修改外请应付信息" :visible.sync="dialogModifyOutInviteVisible" width="720px">
            <el-form size="small" inline :model="dialogModifyOutInviteForm" :rules="dialogAddOutInviteFormRules"
                     ref="dialogModifyOutInviteForm" label-width="115px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="关联供应商:" prop="supplier">
                            <supplier-select v-model="dialogModifyOutInviteForm.supplier"
                                             :types="Constant.SUPPLIER_TYPE.CAR_TEAM+','+Constant.SUPPLIER_TYPE.DEPARTMENT_OF_INFORMATION"
                                             style="width:200px"></supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计价方式:" prop="priceType">
                            <dictionary-select v-model="dialogModifyOutInviteForm.priceType"
                                               :excludeOptions="['ALL_DAY']"
                                               :change="changePriceTypeValue" option-name="LINE_PRICE_TYPE"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="车型规格:" prop="vehicleSize">
                            <dictionary-select v-model="dialogModifyOutInviteForm.vehicleSize"
                                               :disabled="dialogModifyOutInviteForm.vehicleSizeDisabled"
                                               option-name="VEHICLE_SPECIFICATION"
                                               style="width:200px"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计价单价:" prop="priceUnit">
                            <el-input v-model="dialogModifyOutInviteForm.priceUnit" style="width:200px">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="油卡金额:" prop="oilCardAmount">
                            <el-input v-model="dialogModifyOutInviteForm.oilCardAmount" style="width:200px">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogModifyOutInviteVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifyOutInvite('dialogModifyOutInviteForm')">确 定
                </el-button>
            </div>
        </el-dialog>
        <div id="map" style="height: 0;width: 0;"></div>
    </el-container>
</template>

<script>
    import {Http, Constant, Api, Validate, Common} from 'src/global'
    import axios from 'axios';
    import {Message} from 'element-ui';
    import MultipleUserSelect from "../../../common/select/MultipleUserSelect";
    import AMap from 'AMap'

    export default {
        components: {MultipleUserSelect},
        data() {
            return {
                isProjectCustomer:false,
                cityCode:'',
                areaCode:'',
                orgNature:'',
                topProjectCustomer:false,
                topBelongOrg:'',
                map: null,
                tableHeight: window.innerHeight > 800 ? 430 : null,
                btnLoading: true,
                btnLineLoading: true,
                isMoreItemShow: false,
                Constant: Constant,//常量
                addOutInviteDisable: false,
                isSubmitBtnDisabled: false,
                customerCodeTmp: '',
                outsourcePriceTmp: '',
                isModify: true,
                currentLineId: '',
                stationInfoId: 0,
                outsourceId: 0,
                outInviteId: 0,
                multipleSelection: [],
                multipleSelectionOut: [],
                //返回结果
                searchStationInfoResult: [],

                //查询参数
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    departCityCodeList: [],
                    destCityCodeList: [],
                    customerCode: '',
                    departCityCode: '',
                    destCityCode: '',
                    lineType: '',
                    auditStatus: '',
                    isContract: '',
                    isOutSource: '',
                    isOutInvite: '',
                    regionCode: '',//大区
                    lineName: '',
                    vehicleCode: '',
                    businessType: '',
                    receiptType: '',
                    salesman: ''
                },
                initializeModel: {},
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: [],
                },
                //查询参数
                searchOutsourceParam: {
                    currentPage: 1,
                    pageSize: 10
                },
                //返回结果
                searchOutsourceResult: {
                    totalCount: 0,
                    result: []
                },
                //查询参数
                searchOutInviteParam: {
                    currentPage: 1,
                    pageSize: 10
                },
                //返回结果
                searchOutInviteResult: {
                    totalCount: 0,
                    result: []
                },
                dialogAddBaseLineVisible: false,
                addBaseInfoLineForm: {
                    salesman:'',
                    salesmanUserNameList: [],
                    customerCode: '',
                    departStationCode: '',
                    departStation: {},
                    destStationCode: '',
                    destStation: {},
                    departTime: '',
                    operationType: 'ON_WORK',
                    lineType: 'DOUBLE',
                    evaluationMode: 'OPER_TIME',
                    togetherFlag: false,
                    auditStatus: '',
                    timeHour: '',
                    timeMin: '',
                    timeZeyiHour: '',
                    timeZeyiMin: '',
                    distance: '',
                    stationInfoList: [],
                    businessType: 'FIXATION_BUSINESS_TYPE',
                    receiptType: '',
                    belongOrgCode:'',
                    addBaseInfoLineFormDisabled: false,
                    exclude: ['NEW_BUSINESS_TYPE'],
                },
                dialogModifyBaseLineVisible: false,
                modifyBaseInfoLineForm: {
                    salesmanList:'',
                    salesmanUserNameList:[],
                    customerCode: '',
                    departStationCode: '',
                    departStation: {},
                    destStationCode: '',
                    destStation: {},
                    departTime: '',
                    operationType: '',
                    lineType: '',
                    evaluationMode: '',
                    togetherFlag: '',
                    auditStatus: '',
                    timeHour: '',
                    timeMin: '',
                    timeZeyiHour: '',
                    timeZeyiMin: '',
                    distance: '',
                    stationInfoList: [],
                    businessType: '',
                    receiptType: '',
                    belongOrgCode:'',
                    modifyBaseInfoLineFormDisabled: false,
                    exclude: ['NEW_BUSINESS_TYPE'],
                },
                dialogAddStationInfoVisible: false,
                dialogAddStationInfoForm: {
                    transitStationCode: '',
                    transitStationName: '',
                    transitStation: {},
                    lng: '',
                    lat: '',
                    distance: '',
                    travelTimeHour: '',
                    travelTimeMin: '',
                    stayTimeHour: '',
                    stayTimeMin: '',
                    travelTimeZeyiHour: '',
                    travelTimeZeyiMin: '',
                    stayTimeZeyiHour: '',
                    stayTimeZeyiMin: ''
                },
                dialogModifyStationInfoVisible: false,
                dialogModifyStationInfoForm: {
                    transitStationCode: '',
                    transitStationName: '',
                    transitStation: {},
                    lng: '',
                    lat: '',
                    distance: '',
                    travelTimeHour: '',
                    travelTimeMin: '',
                    stayTimeHour: '',
                    stayTimeMin: '',
                    travelTimeZeyiHour: '',
                    travelTimeZeyiMin: '',
                    stayTimeZeyiHour: '',
                    stayTimeZeyiMin: ''
                },
                dialogAddContractInfoVisible: false,
                addContractInfoLineForm: {
                    vehicleSizeList: [],
                    lineId: '',
                    incomeSubject: '',
                    priceType: Constant.LINE_PRICE_TYPE.NORMAL,
                    valuationPriceModel:'',
                    unitPrice: '',
                    customerName: '',
                    customerContractNo: '',
                    customerContractImage: '',
                    startDate: '',
                    endDate: '',
                    auditStatus: '',
                    operationStatus: ''
                },
                addVehicleSizeDialog: false,
                addVehicleSizeForm: {
                    vehicleSize: '',
                    unitPrice: ''
                },

                dialogDetailOutsourceVisible: false,
                dialogAddOutsourceVisible: false,
                dialogAddOutsourceForm: {
                    outsourcePrice: '',
                    vehicle: '',
                    oilConsumption: '',
                    vehicleSize: '',
                    baseOilPrice: '',
                    baseDistance: '',
                    priceLinkage: false,
                },
                dialogModifyOutsourceVisible: false,
                dialogModifyOutsourceForm: {
                    outsourcePrice: '',
                    vehicle: '',
                    vehicleInfo: '',
                    oilConsumption: '',
                    vehicleSize: '',
                    baseOilPrice: '',
                    baseDistance: '',
                    priceLinkage: false,
                },
                batchModifyOutsourceVisible: false,
                batchModifyOutsourceForm: {
                    outsourcePrice: ''
                },
                dialogDetailOutInviteVisible: false,
                dialogAddOutInviteVisible: false,
                dialogAddOutInviteForm: {
                    isInvoice: '0',
                    invoiceType: '',
                    invoiceRatio: '',
                    invoiceAmount: '',
                    invoiceRatioDisabled: true,
                    invoiceTypeDisabled: true,
                    invoiceAmountDisabled: true,
                    vehicleSizeDisabled: true,
                    priceType: '',
                    vehicleSize: '',
                    priceUnit: '',
                    supplier: '',
                    oilCardAmount: ''
                },
                dialogModifyOutInviteVisible: false,
                dialogModifyOutInviteForm: {
                    isInvoice: '0',
                    invoiceType: '',
                    invoiceRatio: '',
                    invoiceAmount: '',
                    invoiceRatioDisabled: true,
                    invoiceTypeDisabled: true,
                    invoiceAmountDisabled: true,
                    vehicleSizeDisabled: true,
                    priceType: '',
                    vehicleSize: '',
                    priceUnit: '',
                    supplier: '',
                    oilCardAmount: '',
                    supplierInfo: ''
                },
                addLineForm: {
                    lineId: ""
                },
                addBaseInfoLineFormRules: {
                    customerCode: [
                        {required: true, message: '请输入客户', trigger: 'blur'}
                    ],
                    businessType: [
                        {required: true, message: '请选择业务类型', trigger: 'blur'}
                    ],
                    departStationCode: [
                        {required: true, message: '请输入出发站点', trigger: 'blur'}
                    ],
                    destStationCode: [
                        {required: true, message: '请输入目的站点', trigger: 'blur'}
                    ],
                    departTime: [
                        {required: true, message: '请输入发车时间', trigger: 'blur'}
                    ],
                    distance: [
                        {required: true, message: '请输入总里程', trigger: 'blur'},
                        Validate.allNumber
                    ],
                    businessType: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    receiptType: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    timeHour: [
                        {pattern: /^([1-9]\d{0,7}|[0])$/, message: '格式不正确'}
                    ],
                    timeMin: [
                        {pattern: /^[1-5]?[0-9]$/, message: '格式不正确'}
                    ],
                    timeZeyiHour: [
                        {pattern: /^([1-9]\d{0,7}|[0])$/, message: '格式不正确'}
                    ],
                    timeZeyiMin: [
                        {pattern: /^[1-5]?[0-9]$/, message: '格式不正确'}
                    ],
                    lineType: [
                        {required: true, message: '请输入线路类型', trigger: 'blur'}
                    ],
                    evaluationMode: [
                        {required: true, message: '请输入考核方式', trigger: 'blur'}
                    ]
                },
                addContractInfoLineFormRules: {
                    priceType: [
                        {required: true, message: '请输入计价方式', trigger: 'blur'}
                    ],
                    customerContractNo: [
                        {min: 1, max: 50, message: '不能超过50个字符', trigger: 'blur'}
                    ],
                    unitPrice: [
                        {required: true, message: '请输入单价', trigger: 'blur'},
                        Validate.threeMoney
                    ],
                    valuationPriceModel: [
                        {required: true, message: '请选择模式', trigger: 'blur'}
                    ],
                    customerContractImage: [
                        {required: true, message: '请上传附件', trigger: 'blur'}
                    ]
                },
                dialogAddOutsourceFormRules: {
                    outsourcePrice: [
                        {required: true, message: '请输入合作价格', trigger: 'blur'},
                        Validate.threeMoney
                    ],
                    vehicle: [
                        {required: true, message: '请输入关联车辆', trigger: 'blur'}
                    ],
                    oilConsumption: [
                        {required: true, message: '请输入百公里油耗', trigger: 'blur'},
                        Validate.allNumber
                    ],
                    vehicleSize: [
                        {required: false, message: '请选择车型', trigger: 'blur'},
                        Validate.allNumber
                    ],
                    baseOilPrice: [
                        {required: true, message: '请输入基准油价', trigger: 'blur'},
                        Validate.threeMoney
                    ],
                    baseDistance: [
                        {required: true, message: '请输入结算里程', trigger: 'blur'},
                        Validate.allNumber
                    ],
                },
                dialogAddOutInviteFormRules: {
                    priceType: [
                        {required: true, message: '请输入计价方式', trigger: 'blur'}
                    ],
                    priceUnit: [
                        {required: true, message: '请输入计价单价', trigger: 'blur'},
                        Validate.threeMoney
                    ],
                    supplier: [
                        {required: true, message: '请输入关联供应商', trigger: 'blur'}
                    ],
                    invoiceAmount: [
                        Validate.threeMoney
                    ],
                    oilCardAmount: [
                        Validate.threeMoney
                    ],
                    invoiceRatio: [
                        {pattern: /^100$|^(\d|[1-9]\d)$/, message: '请输入正确的开票比例'}
                    ]
                },
                dialogAddStationInfoFormRules: {
                    transitStationCode: [
                        {required: true, message: '请输入经停站点', trigger: 'blur'}
                    ],
                    distance: [
                        {required: true, message: '请输入里程', trigger: 'blur'},
                        Validate.allNumber
                    ],
                    travelTimeHour: [
                        {pattern: /^([1-9]\d{0,7}|[0])$/, message: '格式不正确'}
                    ],
                    travelTimeMin: [
                        {pattern: /^[1-5]?[0-9]$/, message: '格式不正确'}
                    ],
                    stayTimeHour: [
                        {pattern: /^([1-9]\d{0,7}|[0])$/, message: '格式不正确'}
                    ],
                    stayTimeMin: [
                        {pattern: /^[1-5]?[0-9]$/, message: '格式不正确'}
                    ],
                    travelTimeZeyiHour: [
                        {pattern: /^([1-9]\d{0,7}|[0])$/, message: '格式不正确'}
                    ],
                    travelTimeZeyiMin: [
                        {pattern: /^[1-5]?[0-9]$/, message: '格式不正确'}
                    ],
                    stayTimeZeyiHour: [
                        {pattern: /^([1-9]\d{0,7}|[0])$/, message: '格式不正确'}
                    ],
                    stayTimeZeyiMin: [
                        {pattern: /^[1-5]?[0-9]$/, message: '格式不正确'}
                    ]
                },
                addVehicleSizeFormRules: {
                    vehicleSize: [
                        {required: false, message: '请输入车型规格', trigger: 'blur'}
                    ],
                    unitPrice: [
                        {required: false, message: '请输入单价', trigger: 'blur'},
                        Validate.threeMoney
                    ]
                },
                pickerBeginDateBefore: {
                    disabledDate: (time) => {
                        let beginDateVal = this.addContractInfoLineForm.endDate;
                        if (beginDateVal) {
                            return time.getTime() > beginDateVal;
                        }
                    }
                },
                pickerBeginDateAfter: {
                    disabledDate: (time) => {
                        let beginDateVal = this.addContractInfoLineForm.startDate;
                        if (beginDateVal) {
                            return time.getTime() < beginDateVal;
                        }
                    }
                }
            }
        },
        watch: {
            'addBaseInfoLineForm.departStationCode'(val){
                if(!!val && !!this.addBaseInfoLineForm.destStationCode){
                    this.getDistance([this.addBaseInfoLineForm.departStation,...(this.addBaseInfoLineForm.stationInfoList),this.addBaseInfoLineForm.destStation],'addBaseInfoLineForm');
                }
            },
            'addBaseInfoLineForm.stationInfoList':{
                handler(arr) {
                    if(arr && !!this.addBaseInfoLineForm.departStationCode && !!this.addBaseInfoLineForm.destStationCode){
                        this.getDistance([this.addBaseInfoLineForm.departStation,...(this.addBaseInfoLineForm.stationInfoList),this.addBaseInfoLineForm.destStation],'addBaseInfoLineForm');
                    }
                },
                deep: true    //深度监听
            },
            'addBaseInfoLineForm.destStationCode'(val){
                if(!!val && !!this.addBaseInfoLineForm.departStationCode){
                    this.getDistance([this.addBaseInfoLineForm.departStation,...(this.addBaseInfoLineForm.stationInfoList),this.addBaseInfoLineForm.destStation],'addBaseInfoLineForm');
                }
            }
        },
        mounted() {
            //查询表格
            this.searchList();
            this.map = new AMap.Map("map", {});
        },
        methods: {
            changeStation(obj){
                this.dialogAddStationInfoForm.transitStation=obj;
                this.cityCode=obj.areaCode;
                Http.get(Api.org.queryByCityCode, {params: {'cityCode':this.cityCode }}, result => {
                    this.orgNature = result.result.nature;
                    if (this.orgNature && this.orgNature === 'PARTITION') {
                        this.areaCode = result.result.code;
                        if (this.isProjectCustomer == false) {
                            this.addBaseInfoLineForm.belongOrgCode = this.areaCode
                        }
                    }
                })
            },

            changeDepartStation(obj){
                this.modifyBaseInfoLineForm.departStation = obj;
                if(!!this.modifyBaseInfoLineForm.departStationCode && !!this.modifyBaseInfoLineForm.destStationCode){
                    this.getDistance([this.modifyBaseInfoLineForm.departStation,...(this.modifyBaseInfoLineForm.stationInfoList),this.modifyBaseInfoLineForm.destStation],'modifyBaseInfoLineForm');
                }
                this.cityCode=obj.areaCode;
                Http.get(Api.org.queryByCityCode, {params: {'cityCode':this.cityCode }}, result => {
                    this.orgNature = result.result.nature;
                    if (this.orgNature && this.orgNature === 'PARTITION') {
                        this.areaCode = result.result.code;
                        if (this.isProjectCustomer == false) {
                            this.modifyBaseInfoLineForm.belongOrgCode = this.areaCode
                        }
                    }
                })
            },
            changeDestStation(obj){
                this.modifyBaseInfoLineForm.destStation = obj
                if(!!this.modifyBaseInfoLineForm.departStationCode && !!this.modifyBaseInfoLineForm.destStationCode){
                    this.getDistance([this.modifyBaseInfoLineForm.departStation,...(this.modifyBaseInfoLineForm.stationInfoList),this.modifyBaseInfoLineForm.destStation],'modifyBaseInfoLineForm');
                }
            },
            //获取路线距离
            getDistance(path,form){
                let vm = this;
                let driving = new AMap.TruckDriving({
                    map: this.map,
                    policy:9,
                    size:4,
                    city:'beijing'
                });
                let newPath = path.map((item)=>{
                    if(!item.lng && !item.lat){
                        return {
                            lnglat: [item.transitStation.lng, item.transitStation.lat]
                        }
                    }
                    return {
                        lnglat: [item.lng,item.lat]
                    }
                })
                driving.search(newPath, function(status, result) {
                    if (status === 'complete') {
                        vm[form].distance = (result.routes[0].distance/1000).toFixed(2);
                    }
                });
            },
            closeInfoLineFormInfoLineForm(){
                this.$refs.addContractInfoLineForm.resetFields()
            },
            addSaveBaseInfoLine(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.isSubmitBtnDisabled = true;
                        Http.post(Api.line.add, vm.addBaseInfoLineForm, response => {
                            vm.resetAddBaseInfoLineForm();
                            vm.dialogAddBaseLineVisible = false;
                            vm.searchList();
                            vm.customerCodeTmp = "";
                            vm.isSubmitBtnDisabled = false;
                        }, result => {
                            vm.isSubmitBtnDisabled = false;
                        })
                    }
                });
            },
            modifySaveBaseInfoLine(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        vm.isSubmitBtnDisabled = true;
                        let formData = _.cloneDeep(vm.modifyBaseInfoLineForm);
                        if(formData.salesmanUserNameList.length>0){
                            formData.salesmanList = _.join(formData.salesmanUserNameList,',');
                        }else{
                            formData.salesmanList = '';
                        }
                        Http.post(Api.line.modify, formData, response => {
                            vm.dialogModifyBaseLineVisible = false;
                            this.$message({message: '修改线路基本信息成功！', type: 'success'});
                            vm.searchList();
                            vm.customerCodeTmp = "";
                            vm.isSubmitBtnDisabled = false;
                        }, result => {
                            vm.isSubmitBtnDisabled = false;
                        })
                    }
                });
            },
            resetModifyBaseInfoLineForm() {
                this.modifyBaseInfoLineForm = {
                    salesmanList:'',
                    salesmanUserNameList:[],
                    customerCode: '',
                    departStationCode: '',
                    departStation: {},
                    destStationCode: '',
                    destStation: {},
                    departTime: '',
                    operationType: '',
                    lineType: '',
                    evaluationMode: '',
                    togetherFlag: '',
                    auditStatus: '',
                    timeHour: '',
                    timeMin: '',
                    timeZeyiHour: '',
                    timeZeyiMin: '',
                    distance: '',
                    stationInfoList: [],
                    businessType: '',
                    receiptType: '',
                    belongOrgCode: '',
                    modifyBaseInfoLineFormDisabled: false,
                    exclude: ['NEW_BUSINESS_TYPE'],
                };
            },
            deleteStationInfo(index, stationInfoList) {
                stationInfoList.splice(index, 1);
                if(!!this.modifyBaseInfoLineForm.departStationCode && !!this.modifyBaseInfoLineForm.destStationCode){
                    this.getDistance([this.modifyBaseInfoLineForm.departStation,...(this.modifyBaseInfoLineForm.stationInfoList),this.modifyBaseInfoLineForm.destStation],'modifyBaseInfoLineForm');
                }
            },
            addStationInfoAddData() {
                let vm = this;
                vm.isModify = false;
                vm.dialogAddStationInfoVisible = true;
                vm.resetAddStationList();
            },
            modifyStationInfoAddData() {
                let vm = this;
                vm.isModify = true;
                vm.dialogAddStationInfoVisible = true;
                setTimeout(function () {
                    vm.$refs.addStationInfoCode.clearStationList();
                }, 0);
                vm.resetAddStationList();
            },
            saveAddStationInfo(flag) {
                let vm = this;
                this.$refs.dialogAddStationInfoForm.validate((valid) => {
                    if (valid) {
                        vm.dialogAddStationInfoForm.lng = vm.dialogAddStationInfoForm.transitStation.lng;
                        vm.dialogAddStationInfoForm.lat = vm.dialogAddStationInfoForm.transitStation.lat;
                        let stationData = vm.dialogAddStationInfoForm;
                        if (!flag) {
                            vm.addBaseInfoLineForm.stationInfoList.push(stationData);
                        } else {
                            vm.modifyBaseInfoLineForm.stationInfoList.push(stationData);
                            if(!!this.modifyBaseInfoLineForm.departStationCode && !!this.modifyBaseInfoLineForm.destStationCode){
                                this.getDistance([this.modifyBaseInfoLineForm.departStation,...(this.modifyBaseInfoLineForm.stationInfoList),this.modifyBaseInfoLineForm.destStation],'modifyBaseInfoLineForm');
                            }
                        }
                        vm.dialogAddStationInfoVisible = false;
                    }
                });
            },
            addStationInfoModifyData(index, row) {
                let vm = this;
                vm.isModify = false;
                vm.stationInfoId = index;
                let data = JSON.parse(JSON.stringify(row));
                vm.dialogModifyStationInfoForm = data;
                setTimeout(() => {
                    let stationInfo = {};
                    stationInfo.code = data.transitStationCode;
                    stationInfo.name = data.transitStationName;
                    vm.$refs.modifyLineDestStation.setCurrentStation(stationInfo);
                }, 0)
                vm.dialogModifyStationInfoVisible = true;
            },
            modifyStationInfoModifyData(index, row) {
                let vm = this;
                vm.isModify = true;
                vm.stationInfoId = index;
                vm.dialogModifyStationInfoVisible = true;
                let data = JSON.parse(JSON.stringify(row));
                vm.dialogModifyStationInfoForm = data;
                setTimeout(() => {
                    let stationInfo = {};
                    stationInfo.code = data.transitStationCode;
                    stationInfo.name = data.transitStationName;
                    vm.$refs.modifyLineDestStation.setCurrentStation(stationInfo);
                }, 0)
            },
            saveModifyStationInfo(flag) {
                let vm = this;
                let currId = vm.stationInfoId;
                this.$refs.dialogModifyStationInfoForm.validate((valid) => {
                    if (valid) {
                        let stationInfoIndexData = {};
                        if (!flag) {
                            vm.stationInfoIndexData = vm.addBaseInfoLineForm.stationInfoList[currId];
                        } else {
                            vm.stationInfoIndexData = vm.modifyBaseInfoLineForm.stationInfoList[currId];
                        }
                        vm.stationInfoIndexData.transitStationCode = vm.dialogModifyStationInfoForm.transitStationCode;
                        vm.stationInfoIndexData.transitStationName = vm.dialogModifyStationInfoForm.transitStationName;
                        vm.stationInfoIndexData.transitStation = vm.dialogModifyStationInfoForm.transitStation;
                        vm.stationInfoIndexData.lng = vm.dialogModifyStationInfoForm.transitStation.lng;
                        vm.stationInfoIndexData.lat = vm.dialogModifyStationInfoForm.transitStation.lat;
                        vm.stationInfoIndexData.distance = vm.dialogModifyStationInfoForm.distance;
                        vm.stationInfoIndexData.travelTimeHour = vm.dialogModifyStationInfoForm.travelTimeHour;
                        vm.stationInfoIndexData.travelTimeMin = vm.dialogModifyStationInfoForm.travelTimeMin;
                        vm.stationInfoIndexData.stayTimeHour = vm.dialogModifyStationInfoForm.stayTimeHour;
                        vm.stationInfoIndexData.stayTimeMin = vm.dialogModifyStationInfoForm.stayTimeMin;
                        vm.stationInfoIndexData.travelTimeZeyiHour = vm.dialogModifyStationInfoForm.travelTimeZeyiHour;
                        vm.stationInfoIndexData.travelTimeZeyiMin = vm.dialogModifyStationInfoForm.travelTimeZeyiMin;
                        vm.stationInfoIndexData.stayTimeZeyiHour = vm.dialogModifyStationInfoForm.stayTimeZeyiHour;
                        vm.stationInfoIndexData.stayTimeZeyiMin = vm.dialogModifyStationInfoForm.stayTimeZeyiMin;
                        if(!!this.modifyBaseInfoLineForm.departStationCode && !!this.modifyBaseInfoLineForm.destStationCode){
                            this.getDistance([this.modifyBaseInfoLineForm.departStation,...(this.modifyBaseInfoLineForm.stationInfoList),this.modifyBaseInfoLineForm.destStation],'modifyBaseInfoLineForm');
                        }
                        vm.dialogModifyStationInfoVisible = false;
                        vm.resetModifyStationList();
                    }
                });
            },
            //删除
            deleteBaseLine(row) {
                let vm = this;
                if (row.operationStatus) {
                    vm.$message('审核中的数据不能删除');
                    return;
                }
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.line.delete, ids, result => {
                        vm.searchList();
                    })
                })
            },
            //回显
            modifyBaseLine(row) {
                let vm = this;
                if (row.operationStatus) {
                    vm.$message('审核中的数据不能进行修改');
                    return;
                }
                Http.get(Api.line.queryById, {params: {'id': row.id}}, result => {
                    vm.$set(vm.modifyBaseInfoLineForm,"stationInfoList", result.result.stationInfoList)
                    vm.modifyBaseInfoLineForm = _.merge(vm.modifyBaseInfoLineForm, result.result);
                    vm.showCustomerCodeInfo(result.result.customerCode)
                    if (vm.modifyBaseInfoLineForm.salesmanList) {
                        vm.modifyBaseInfoLineForm.salesmanUserNameList = _.split(vm.modifyBaseInfoLineForm.salesmanList, ',')
                    }
                    vm.dialogModifyBaseLineVisible = true;
                    vm.$nextTick(() => {
                        vm.$refs.modifyCustomerCode.setCurrentCustomer(result.result.customer);
                        vm.$refs.modifyDepartStationCode.setCurrentStation(result.result.departStation);
                        vm.$refs.modifyDestStationCode.setCurrentStation(result.result.destStation);
                    })
                })
            },
            resetAddBaseInfoLineForm() {
                let vm = this;
                vm.addBaseInfoLineForm = {
                    salesmanUserNameList:[],
                    projectCustomer:'',
                    customerCode: '',
                    departStationCode: '',
                    departStation: {},
                    destStationCode: '',
                    destStation: {},
                    departTime: '',
                    operationType: '',
                    lineType: '',
                    evaluationMode: '',
                    auditStatus: '',
                    timeHour: '',
                    timeMin: '',
                    timeZeyiHour: '',
                    timeZeyiMin: '',
                    distance: '',
                    stationInfoList: [],
                    addBaseInfoLineFormDisabled: false,
                    exclude: ['NEW_BUSINESS_TYPE'],
                }
            },
            resetAddStationList() {
                let vm = this;
                vm.dialogAddStationInfoForm = {
                    transitStationCode: '',
                    transitStationName: '',
                    transitStation: {},
                    lng: '',
                    lat: '',
                    distance: '',
                    travelTimeHour: '',
                    travelTimeMin: '',
                    stayTimeHour: '',
                    stayTimeMin: '',
                    travelTimeZeyiHour: '',
                    travelTimeZeyiMin: '',
                    stayTimeZeyiHour: '',
                    stayTimeZeyiMin: ''
                }
            },
            resetModifyStationList() {
                let vm = this;
                vm.dialogModifyStationInfoForm = {
                    transitStationCode: '',
                    transitStationName: '',
                    transitStation: {},
                    lng: '',
                    lat: '',
                    distance: '',
                    travelTimeHour: '',
                    travelTimeMin: '',
                    stayTimeHour: '',
                    stayTimeMin: '',
                    travelTimeZeyiHour: '',
                    travelTimeZeyiMin: '',
                    stayTimeZeyiHour: '',
                    stayTimeZeyiMin: ''
                }
            },
            addContractInfoLine(formName) {
                let vm = this;
                vm.addContractInfoLineForm.customerContractImage = this.$refs.customerContractAttachment.getFileList().join(",");
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        /*if (vm.addContractInfoLineForm && vm.addContractInfoLineForm.priceType === Constant.LINE_PRICE_TYPE.NORMAL &&
                            vm.addContractInfoLineForm.vehicleSizeList && vm.addContractInfoLineForm.vehicleSizeList.length == 0) {
                            this.$message('请添加车型和单价');
                            return;
                        }*/
                        if (vm.addContractInfoLineForm && vm.addContractInfoLineForm.startDate) {
                            var startDate = new Date(vm.addContractInfoLineForm.startDate);
                            vm.addContractInfoLineForm.startDate = startDate.getFullYear() + '-' +
                                (((startDate.getMonth() + 1) < 10 ? '0' + (startDate.getMonth() + 1) : (startDate.getMonth() + 1)))
                                + '-' + (startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate());
                        }
                        if (vm.addContractInfoLineForm && vm.addContractInfoLineForm.endDate) {
                            var endDate = new Date(vm.addContractInfoLineForm.endDate);
                            vm.addContractInfoLineForm.endDate = endDate.getFullYear() + '-' +
                                (((endDate.getMonth() + 1) < 10 ? '0' + (endDate.getMonth() + 1) : (endDate.getMonth() + 1)))
                                + '-' + (endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate());
                        }
                        vm.addContractInfoLineForm.lineId = vm.currentLineId;

                        Http.post(Api.lineContract.add, vm.addContractInfoLineForm, response => {
                            vm.resetAddContractInfoLineForm();
                            vm.dialogAddContractInfoVisible = false;
                            vm.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetAddContractInfoLineForm() {
                let vm = this;
                vm.addContractInfoLineForm = {
                    vehicleSizeList: [],
                    lineId: '',
                    incomeSubject: '',
                    priceType: Constant.LINE_PRICE_TYPE.NORMAL,
                    valuationPriceModel:'',
                    unitPrice: '',
                    customerName: '',
                    customerContractNo: '',
                    customerContractImage: '',
                    startDate: '',
                    endDate: '',
                    auditStatus: '',
                    operationStatus: ''
                }
            },
            dialogContractInfoVisible(row) {
                let vm = this;
                vm.currentLineId = row.id;
                Http.get(Api.lineContract.queryByLineId, {params: {'lineId': row.id}}, result => {
                    vm.resetAddContractInfoLineForm();
                    /* if (result.result && result.result.operationStatus) {
                         vm.$message('线路应收信息正在审核中');
                         return;
                     }*/
                    vm.dialogAddContractInfoVisible = true;
                    setTimeout(() => {
                        vm.$refs.customerContractAttachment.clearFileList();
                        if (result.result) {
                            vm.$refs.modifySettlementCustomerName.setCurrentSettlementCustomer(result.result.customerName);
                            vm.$refs.customerContractAttachment.setFileList(result.result.customerContractImage ? result.result.customerContractImage.split(",") : null);
                            vm.addContractInfoLineForm = result.result;
                        }
                    }, 0)
                })
            },
            addVehicleSize(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (vm.addContractInfoLineForm.vehicleSizeList.length > 0) {
                            let list = vm.addContractInfoLineForm.vehicleSizeList;
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].vehicleSize == vm.addVehicleSizeForm.vehicleSize) {
                                    this.$message('车辆规格不能重复');
                                    return;
                                }
                            }
                        }
                        vm.addContractInfoLineForm.vehicleSizeList.push(vm.addVehicleSizeForm);
                        vm.addVehicleSizeForm = {
                            vehicleSize: '',
                            unitPrice: ''
                        }
                        vm.addVehicleSizeDialog = false;
                    } else {
                        return false;
                    }
                });
            },
            addOutsource(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let list = vm.searchOutsourceResult.result;
                        if (list.length > 0) {
                            for (let i = 0; i < list.length; i++) {
                                if (list[i].vehicle == vm.dialogAddOutsourceForm.vehicle) {
                                    this.$message('该关联车辆已存在');
                                    return;
                                }
                            }
                        }
                        vm.dialogAddOutsourceForm.lineId = vm.currentLineId;
                        if (!vm.dialogAddOutsourceForm.priceLinkage) {
                            vm.dialogAddOutsourceForm.vehicleSize = "";
                            vm.dialogAddOutsourceForm.baseDistance = "";
                            vm.dialogAddOutsourceForm.baseOilPrice = "";
                            vm.dialogAddOutsourceForm.oilConsumption = "";
                        }
                        Http.post(Api.lineOutsource.add, vm.dialogAddOutsourceForm, response => {
                            vm.outsourcePriceTmp = vm.dialogAddOutsourceForm.outsourcePrice;
                            // vm.resetDialogAddOutsourcePriceForm();
                            vm.searchOutsourceList();
                            this.$message({message: '添加成功！', type: 'success'});
                            vm.dialogAddOutsourceVisible = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            modifyOutsource(formName) {
                let vm = this;
                let currId = vm.outsourceId;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let list = vm.searchOutsourceResult.result;
                        for (let i = 0; i < list.length; i++) {
                            if (list[currId].vehicle != vm.dialogModifyOutsourceForm.vehicle) {
                                if (list[i].vehicle == vm.dialogModifyOutsourceForm.vehicle) {
                                    this.$message('该关联车辆已存在');
                                    return;
                                }
                            }
                        }
                        if (!vm.dialogModifyOutsourceForm.priceLinkage) {
                            vm.dialogModifyOutsourceForm.vehicleSize = "";
                            vm.dialogModifyOutsourceForm.vehicleSize = "";
                            vm.dialogModifyOutsourceForm.baseDistance = "";
                            vm.dialogModifyOutsourceForm.baseOilPrice = "";
                            vm.dialogModifyOutsourceForm.oilConsumption = "";
                        }
                        Http.post(Api.lineOutsource.modify, vm.dialogModifyOutsourceForm, response => {
                            vm.dialogModifyOutsourceVisible = false;
                            vm.searchOutsourceList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            dialogAddOutsourceVisibleData() {
                let vm = this;
                vm.dialogAddOutsourceVisible = true;
                vm.resetDialogAddOutsourceForm();
            },
            batchModifyOutsourceData() {
                let vm = this;
                if (vm.multipleSelectionOut == "") {
                    vm.$message('请选择需要批量修改的数据');
                    return;
                }
                vm.batchModifyOutsourceVisible = true;
            },
            batchModifyOutsource(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let list = vm.multipleSelectionOut;
                        list.forEach(item => {
                            item.outsourcePrice = vm.batchModifyOutsourceForm.outsourcePrice;
                        });
                        Http.post(Api.lineOutsource.batchModify, list, response => {
                            vm.batchModifyOutsourceVisible = false;
                            vm.searchOutsourceList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //回显
            modifyOutsourceById(index, row) {
                let vm = this;
                if (row.operationStatus) {
                    vm.$message('审核中的数据不能修改');
                    return;
                }
                vm.outsourceId = index;
                Http.get(Api.lineOutsource.queryById, {params: {'id': row.id}}, result => {
                    vm.dialogModifyOutsourceForm = result.result;
                    setTimeout(function () {
                        vm.$refs.modifyOutsourceVehicle.setCurrentVehicle(result.result.vehicleInfo);
                    }, 0);
                    vm.dialogModifyOutsourceVisible = true;
                })
            },
            deleteOutsource(row) {
                let vm = this;
                if (row.operationStatus) {
                    vm.$message('审核中的数据不能删除');
                    return;
                }
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.lineOutsource.delete, ids, result => {
                        vm.searchOutsourceList();
                    })
                })
            },
            resetDialogAddOutsourcePriceForm() {
                let vm = this;
                vm.dialogAddOutsourceForm = {
                    outsourcePrice: vm.outsourcePriceTmp,
                    vehicle: ''
                }
            },
            resetDialogAddOutsourceForm() {
                let vm = this;
                vm.dialogAddOutsourceForm = {
                    outsourcePrice: '',
                    vehicle: '',
                    priceLinkage: false
                }
            },
            dialogOutSourcedVisible(row) {
                let vm = this;
                vm.currentLineId = row.id;
                vm.searchOutsourceParam.lineId = row.id;
                Http.get(Api.lineOutsource.page, {params: vm.searchOutsourceParam}, result => {
                    vm.dialogDetailOutsourceVisible = true;
                    vm.searchOutsourceResult.result = result.result;
                    vm.searchOutsourceResult.totalCount = result.totalCount;
                    vm.searchOutsourceParam.currentPage = result.currentPage;
                    vm.searchOutsourceParam.pageSize = result.pageSize;
                })
            },
            searchOutsourceList() {
                let vm = this;
                Http.get(Api.lineOutsource.page, {params: vm.searchOutsourceParam}, result => {
                    vm.searchOutsourceResult.result = result.result;
                    vm.searchOutsourceResult.totalCount = result.totalCount;
                    vm.searchOutsourceParam.currentPage = result.currentPage;
                    vm.searchOutsourceParam.pageSize = result.pageSize;
                })
            },
            addOutInvite(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let list = vm.searchOutInviteResult.result;
                        if (list.length > 0) {
                            for (let i = 0; i < list.length; i++) {
                                //同一个 供应商,不是 按趟 只能有一个
                                if (list[i].supplier == vm.dialogAddOutInviteForm.supplier && list[i].priceType != Constant.LINE_PRICE_TYPE.NORMAL) {
                                    this.$message('该供应商已存在');
                                    return;
                                }
                                //同一个 供应商,按趟 同一个 车型 只能有一个
                                if (list[i].supplier == vm.dialogAddOutInviteForm.supplier && vm.dialogAddOutInviteForm.priceType == Constant.LINE_PRICE_TYPE.NORMAL && list[i].vehicleSize == vm.dialogAddOutInviteForm.vehicleSize) {
                                    this.$message('该供应商和车型已存在');
                                    return;
                                }
                            }
                        }
                        vm.addOutInviteDisable = true;
                        vm.dialogAddOutInviteForm.lineId = vm.currentLineId;
                        Http.post(Api.lineOutInvite.add, vm.dialogAddOutInviteForm, response => {
                            vm.resetDialogAddOutInviteForm();
                            vm.dialogAddOutInviteVisible = false;
                            vm.searchOutInviteList();
                            vm.addOutInviteDisable = false;
                        }, result => {
                            //不管成功失败都要显示按钮
                            vm.addOutInviteDisable = false;
                        })

                    } else {
                        return false;
                    }
                });
            },
            modifyOutInvite(formName) {
                let vm = this;
                let currId = vm.outInviteId;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let list = vm.searchOutInviteResult.result;
                        for (let i = 0; i < list.length; i++) {
                            if (list[currId].supplier != vm.dialogModifyOutInviteForm.supplier) {
                                if (list[i].supplier == vm.dialogModifyOutInviteForm.supplier && vm.dialogModifyOutInviteForm.priceType != Constant.LINE_PRICE_TYPE.NORMAL) {
                                    this.$message('该供应商已存在');
                                    return;
                                }
                                if (list[i].supplier == vm.dialogModifyOutInviteForm.supplier && vm.dialogModifyOutInviteForm.priceType == Constant.LINE_PRICE_TYPE.NORMAL && list[i].vehicleSize == vm.dialogModifyOutInviteForm.vehicleSize) {
                                    this.$message('该供应商和车型已存在');
                                    return;
                                }
                            }
                        }
                        Http.post(Api.lineOutInvite.modify, vm.dialogModifyOutInviteForm, response => {
                            vm.dialogModifyOutInviteVisible = false;
                            vm.searchOutInviteList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            //回显
            modifyOutInviteById(index, row) {
                let vm = this;
                if (row.operationStatus) {
                    vm.$message('审核中的数据不能修改');
                    return;
                }
                vm.outInviteId = index;
                Http.get(Api.lineOutInvite.queryById, {params: {'id': row.id}}, result => {
                    vm.dialogModifyOutInviteVisible = true;
                    vm.dialogModifyOutInviteForm = result.result;
                    if (result.result.isInvoice) {
                        if (result.result.isInvoice == "0") {
                            vm.dialogModifyOutInviteForm.invoiceTypeDisabled = true;
                            vm.dialogModifyOutInviteForm.invoiceRatioDisabled = true;
                            vm.dialogModifyOutInviteForm.invoiceAmountDisabled = true;
                        } else {
                            vm.changeInvoiceTypeValue(result.result.invoiceType);
                        }
                        if (result.result.priceType != Constant.LINE_PRICE_TYPE.NORMAL) {
                            vm.dialogModifyOutInviteForm.vehicleSizeDisabled = true;
                        }
                    }
                    setTimeout(function () {
                        vm.$refs.modifyOutInviteSupplier.setCurrentSupplier(result.result.supplierInfo);
                    }, 0);
                })
            },
            deleteOutInvite(row) {
                let vm = this;
                if (row.operationStatus) {
                    vm.$message('审核中的数据不能修改');
                    return;
                }
                var ids = [];
                ids.push(row.id)
                this.$confirm('删除后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.lineOutInvite.delete, ids, result => {
                        vm.searchOutInviteList();
                    })
                })
            },
            resetDialogAddOutInviteForm() {
                let vm = this;
                vm.dialogAddOutInviteForm = {
                    isInvoice: '0',
                    invoiceType: '',
                    invoiceRatio: '',
                    invoiceAmount: '',
                    invoiceRatioDisabled: true,
                    invoiceTypeDisabled: true,
                    invoiceAmountDisabled: true,
                    vehicleSizeDisabled: true,
                    priceType: '',
                    vehicleSize: '',
                    priceUnit: '',
                    supplier: '',
                    oilCardAmount: ''
                }
            },
            dialogOutInviteVisible(row) {
                let vm = this;
                vm.currentLineId = row.id;
                vm.searchOutInviteParam.lineId = row.id;
                Http.get(Api.lineOutInvite.page, {params: vm.searchOutInviteParam}, result => {
                    vm.searchOutInviteResult.result = result.result;
                    vm.searchOutInviteResult.totalCount = result.totalCount;
                    vm.searchOutInviteParam.currentPage = result.currentPage;
                    vm.searchOutInviteParam.pageSize = result.pageSize;
                    vm.dialogDetailOutInviteVisible = true;
                })
            },
            searchOutInviteList() {
                let vm = this;
                Http.get(Api.lineOutInvite.page, {params: vm.searchOutInviteParam}, result => {
                    vm.searchOutInviteResult.result = result.result;
                    vm.searchOutInviteResult.totalCount = result.totalCount;
                    vm.searchOutInviteParam.currentPage = result.currentPage;
                    vm.searchOutInviteParam.pageSize = result.pageSize;
                })
            },
            resetSearchParam() {
                let vm = this;
                vm.searchParam.customerCode = '';
                vm.searchParam.departCityCode = '';
                vm.searchParam.destCityCode = '';
                vm.searchParam.departCityCodeList = [];
                vm.searchParam.destCityCodeList = [];
                vm.searchParam.auditStatus = '';
                vm.searchParam.isContract = '';
                vm.searchParam.isOutSource = '';
                vm.searchParam.isOutInvite = '';
                vm.searchParam.lineType = '';
                vm.searchParam.regionCode = '';
                vm.searchParam.lineId = '';
                vm.searchParam.vehicleCode = '';
                vm.searchParam.businessType = '';
                vm.searchParam.receiptType = '';
                vm.searchParam.salesman = '';
            },
            searchList() {
                let vm = this;
                if (vm.searchParam.departCityCodeList) {
                    vm.searchParam.departCityCode = vm.searchParam.departCityCodeList[1];
                }
                if (vm.searchParam.destCityCodeList) {
                    vm.searchParam.destCityCode = vm.searchParam.destCityCodeList[1];
                }
                Http.get(Api.line.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result;
                    vm.searchResult.totalCount = result.totalCount;
                    vm.searchParam.currentPage = result.currentPage;
                    vm.searchParam.pageSize = result.pageSize;
                })
            },
            handleSizeChange(val) {
                let vm = this;
                vm.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                let vm = this;
                vm.searchParam.currentPage = val;
                this.searchList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChangeOutsource(val) {
                let vm = this;
                vm.searchOutsourceParam.pageSize = val;
                this.searchOutsourceList();
            },
            handleCurrentChangeOutsource(val) {
                let vm = this;
                vm.searchOutsourceParam.currentPage = val;
                this.searchOutsourceList();
            },
            handleSelectionChangeOutsource(val) {
                this.multipleSelectionOut = val;
            },
            handleSizeChangeOutInvite(val) {
                let vm = this;
                vm.searchOutInviteParam.pageSize = val;
                this.searchOutInviteList();
            },
            handleCurrentChangeOutInvite(val) {
                let vm = this;
                vm.searchOutInviteParam.currentPage = val;
                this.searchOutInviteList();
            },
            handleSelectionChangeOutInvite(val) {
                this.multipleSelection = val;
            },
            changeTime1(value) {
                let vm = this;
                vm.addBaseInfoLineForm.timeZeyiHour = value;
            },
            changeTime2(value) {
                let vm = this;
                vm.addBaseInfoLineForm.timeZeyiMin = value;
            },
            changeTime3(value) {
                let vm = this;
                vm.modifyBaseInfoLineForm.timeZeyiHour = value;
            },
            changeTime4(value) {
                let vm = this;
                vm.modifyBaseInfoLineForm.timeZeyiMin = value;
            },
            syncTime1(value) {
                let vm = this;
                vm.dialogAddStationInfoForm.travelTimeZeyiHour = value;
            },
            syncTime2(value) {
                let vm = this;
                vm.dialogAddStationInfoForm.travelTimeZeyiMin = value;
            },
            syncTime3(value) {
                let vm = this;
                vm.dialogAddStationInfoForm.stayTimeZeyiHour = value;
            },
            syncTime4(value) {
                let vm = this;
                vm.dialogAddStationInfoForm.stayTimeZeyiMin = value;
            },
            syncTime5(value) {
                let vm = this;
                vm.dialogModifyStationInfoForm.travelTimeZeyiHour = value;
            },
            syncTime6(value) {
                let vm = this;
                vm.dialogModifyStationInfoForm.travelTimeZeyiMin = value;
            },
            syncTime7(value) {
                let vm = this;
                vm.dialogModifyStationInfoForm.stayTimeZeyiHour = value;
            },
            syncTime8(value) {
                let vm = this;
                vm.dialogModifyStationInfoForm.stayTimeZeyiMin = value;
            },
            changeAddCustomerCodeInfo(value) {
                let vm = this;
                if (value) {
                    Http.get(Api.customer.topLevelCustomer, {params: {'code': value}}, result => {
                        vm.customerCodeTmp = result.result.code;
                        vm.topProjectCustomer=result.result.projectCustomer;
                        vm.topBelongOrg=result.result.belongArea;

                        setTimeout(function () {
                            vm.$refs.clearDepartStationCode.clearStationList();
                            vm.$refs.clearDestStationCode.clearStationList();
                        }, 0);
                        vm.addBaseInfoLineForm.departStationCode = "";
                        vm.addBaseInfoLineForm.destStationCode = "";
                        vm.addBaseInfoLineForm.stationInfoList = [];
                        if (!!result.result.newBusinessCustomer && result.result.newBusinessCustomer === '1') {
                            vm.addBaseInfoLineForm.exclude = []
                            vm.addBaseInfoLineForm.businessType = 'NEW_BUSINESS_TYPE';
                            vm.addBaseInfoLineForm.addBaseInfoLineFormDisabled = true;
                        } else {
                            vm.addBaseInfoLineForm.businessType = '';
                            vm.addBaseInfoLineForm.addBaseInfoLineFormDisabled = false;
                            vm.addBaseInfoLineForm.exclude = ['NEW_BUSINESS_TYPE']
                        }
                        Http.get(Api.customer.commonSelect, {params: {'code': value}}, result => {
                            if (result.result && result.result[0] && result.result[0].projectCustomer==true){
                                vm.addBaseInfoLineForm.belongOrgCode=result.result[0].belongArea;
                                vm.isProjectCustomer=true;
                            } else if (vm.topProjectCustomer && vm.topProjectCustomer==true){
                                vm.addBaseInfoLineForm.belongOrgCode=vm.topBelongOrg;
                                vm.isProjectCustomer=true;
                            }else{
                                vm.isProjectCustomer=false;
                            }

                        });
                    });
                }
            },
            changeModifyCustomerCodeInfo(value) {
                let vm = this;
                if (value) {
                    Http.get(Api.customer.topLevelCustomer, {params: {'code': value}}, result => {
                        if (result.result) {
                            vm.customerCodeTmp = result.result.code;
                            vm.topProjectCustomer=result.result.projectCustomer;
                            vm.topBelongOrg=result.result.belongArea;
                            setTimeout(function () {
                                vm.$refs.modifyDepartStationCode.clearStationList();
                                vm.$refs.modifyDestStationCode.clearStationList();
                            }, 0);
                            vm.modifyBaseInfoLineForm.departStationCode = "";
                            vm.modifyBaseInfoLineForm.departStation = {};
                            vm.modifyBaseInfoLineForm.destStationCode = "";
                            vm.modifyBaseInfoLineForm.destStation = {};
                            vm.modifyBaseInfoLineForm.stationInfoList = [];
                            if (!!result.result.newBusinessCustomer && result.result.newBusinessCustomer === '1') {
                                vm.modifyBaseInfoLineForm.exclude = [];
                                vm.modifyBaseInfoLineForm.businessType = 'NEW_BUSINESS_TYPE';
                                vm.modifyBaseInfoLineForm.modifyBaseInfoLineFormDisabled = true;
                            } else {
                                vm.modifyBaseInfoLineForm.exclude = ['NEW_BUSINESS_TYPE'];
                                vm.modifyBaseInfoLineForm.businessType = '';
                                vm.modifyBaseInfoLineForm.modifyBaseInfoLineFormDisabled = false;
                            }
                            Http.get(Api.customer.commonSelect, {params: {'code': value}}, result => {
                                if (result.result && result.result[0] && result.result[0].projectCustomer==true){
                                    vm.modifyBaseInfoLineForm.belongOrgCode=result.result[0].belongArea;
                                    vm.isProjectCustomer=true;
                                } else if (vm.topProjectCustomer && vm.topProjectCustomer==true){
                                    vm.modifyBaseInfoLineForm.belongOrgCode=vm.topBelongOrg;
                                    vm.isProjectCustomer=true;
                                }else{
                                    vm.isProjectCustomer=false;
                                }

                            });

                        }
                    }
                )}
            },
            showCustomerCodeInfo(value) {
                let vm = this;
                if (value) {
                    Http.get(Api.customer.topLevelCustomer, {params: {'code': value}}, result => {
                        if (result.result) {
                            vm.customerCodeTmp = result.result.code;
                            if (!!result.result.newBusinessCustomer && result.result.newBusinessCustomer === '1') {
                                vm.modifyBaseInfoLineForm.exclude = [];
                                vm.modifyBaseInfoLineForm.businessType = 'NEW_BUSINESS_TYPE';
                                vm.modifyBaseInfoLineForm.modifyBaseInfoLineFormDisabled = true;
                            } else {
                                vm.modifyBaseInfoLineForm.exclude = ['NEW_BUSINESS_TYPE'];
                                vm.modifyBaseInfoLineForm.modifyBaseInfoLineFormDisabled = false;
                            }
                        }
                    });
                }
            },
            addOutsourcePriceLinkage(value) {
                let vm = this;
                if (value) {
                    vm.dialogAddOutsourceForm.oilConsumption = "";
                    vm.dialogAddOutsourceForm.baseOilPrice = "";
                    vm.dialogAddOutsourceForm.baseDistance = "";
                }
            },
            modifyOutsourcePriceLinkage(value) {
                let vm = this;
                if (!value) {
                    vm.dialogModifyOutsourceForm.oilConsumption = "";
                    vm.dialogModifyOutsourceForm.baseOilPrice = "";
                    vm.dialogModifyOutsourceForm.baseDistance = "";
                }
            },
            addInvoiceShowInvoiceRatio(value) {
                let vm = this;
                if (value == "1") {
                    vm.dialogAddOutInviteForm.invoiceTypeDisabled = false;
                    vm.dialogAddOutInviteForm.invoiceRatioDisabled = false;
                    vm.dialogAddOutInviteForm.invoiceType = "THE_RATIO";

                    vm.dialogModifyOutInviteForm.invoiceTypeDisabled = false;
                    vm.dialogModifyOutInviteForm.invoiceRatioDisabled = false;
                    vm.dialogModifyOutInviteForm.invoiceType = "THE_RATIO";
                } else {
                    vm.dialogAddOutInviteForm.invoiceTypeDisabled = true;
                    vm.dialogAddOutInviteForm.invoiceRatioDisabled = true;
                    vm.dialogAddOutInviteForm.invoiceAmountDisabled = true;
                    vm.dialogAddOutInviteForm.invoiceType = "";
                    vm.dialogAddOutInviteForm.invoiceRatio = "";
                    vm.dialogAddOutInviteForm.invoiceAmount = "";

                    vm.dialogModifyOutInviteForm.invoiceTypeDisabled = true;
                    vm.dialogModifyOutInviteForm.invoiceRatioDisabled = true;
                    vm.dialogModifyOutInviteForm.invoiceAmountDisabled = true;
                    vm.dialogModifyOutInviteForm.invoiceType = "";
                    vm.dialogModifyOutInviteForm.invoiceRatio = "";
                    vm.dialogModifyOutInviteForm.invoiceAmount = "";
                }
            },
            changeInvoiceTypeValue(value) {
                let vm = this;
                if (value == "THE_RATIO") {
                    vm.dialogAddOutInviteForm.invoiceRatioDisabled = false;
                    vm.dialogAddOutInviteForm.invoiceAmountDisabled = true;
                    vm.dialogAddOutInviteForm.invoiceAmount = "";

                    vm.dialogModifyOutInviteForm.invoiceRatioDisabled = false;
                    vm.dialogModifyOutInviteForm.invoiceAmountDisabled = true;
                    vm.dialogModifyOutInviteForm.invoiceAmount = "";
                } else if (value == "THE_AMOUNT") {
                    vm.dialogAddOutInviteForm.invoiceRatioDisabled = true;
                    vm.dialogAddOutInviteForm.invoiceAmountDisabled = false;
                    vm.dialogAddOutInviteForm.invoiceRatio = "";

                    vm.dialogModifyOutInviteForm.invoiceRatioDisabled = true;
                    vm.dialogModifyOutInviteForm.invoiceAmountDisabled = false;
                    vm.dialogModifyOutInviteForm.invoiceRatio = "";
                } else {
                    vm.dialogAddOutInviteForm.invoiceRatioDisabled = true;
                    vm.dialogAddOutInviteForm.invoiceAmountDisabled = true;
                    vm.dialogAddOutInviteForm.invoiceRatio = "";
                    vm.dialogAddOutInviteForm.invoiceAmount = "";

                    vm.dialogModifyOutInviteForm.invoiceRatioDisabled = true;
                    vm.dialogModifyOutInviteForm.invoiceAmountDisabled = true;
                    vm.dialogModifyOutInviteForm.invoiceRatio = "";
                    vm.dialogModifyOutInviteForm.invoiceAmount = "";
                }
            },
            changePriceTypeValue(value) {
                let vm = this;
                if (value === Constant.LINE_PRICE_TYPE.NORMAL) {
                    vm.dialogAddOutInviteForm.vehicleSizeDisabled = false;
                    vm.dialogModifyOutInviteForm.vehicleSizeDisabled = false;
                } else {
                    vm.dialogAddOutInviteForm.vehicleSizeDisabled = true;
                    vm.dialogAddOutInviteForm.vehicleSize = "";
                    vm.dialogModifyOutInviteForm.vehicleSizeDisabled = true;
                    vm.dialogModifyOutInviteForm.vehicleSize = "";
                }
            },
            changeReceivePriceTypeValue(value) {
                let vm = this;
                vm.$set(vm.addContractInfoLineForm, 'valuationPriceModel', '')
                // vm.addContractInfoLineForm.valuationPriceModel = ''
                if (value === Constant.LINE_PRICE_TYPE.NORMAL) {
                    vm.addContractInfoLineForm.unitPrice = "";
                } else {
                    vm.addContractInfoLineForm.vehicleSizeList = [];
                }
            },
            doubleClickRow(row) {
                return this.$router.push({path: '/operation/lineDetail', query: {lineId: row.id}});
            },
            lineCollectSubmit() {
                let vm = this;
                if (vm.multipleSelection && vm.multipleSelection.length != 1) {
                    this.$message('选择收藏的线路只能为一条');
                    return;
                }
                if (vm.multipleSelection[0].auditStatus !== Constant.AUDIT_STATUS.PASS) {
                    this.$message('只能收藏审核通过的线路');
                    return;
                }
                vm.addLineForm.lineId = vm.multipleSelection[0].id;
                axios.post(Api.lineCollect.add, vm.addLineForm).then(response => {
                    var result = response.data;
                    if (result.success) {
                        vm.$message.success('线路收藏成功！');
                        vm.searchList();
                    } else {
                        if (result.businessException) {
                            if (result.message.indexOf('已经收藏这一条线路') !== -1) {
                                this.$confirm(result.message + " 是否继续收藏", '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    Http.post(Api.lineCollect.addLine, vm.addLineForm, result => {
                                        vm.$message.success('线路收藏成功！');
                                        vm.searchList();
                                    })
                                })
                            } else {
                                Message({
                                    showClose: true,
                                    message: result.message,
                                    type: 'error'
                                });
                            }
                        } else {
                            Message({
                                showClose: true,
                                message: '系统异常',
                                type: 'error'
                            });
                        }
                    }
                }).catch(reason => {
                    Message({
                        message: reason,
                        type: 'error'
                    });
                })
            },
            // 线路信息导出
            lineExportList() {
                let vm = this;
                vm.btnLoading = false;
                if (vm.searchParam.departCityCodeList) {
                    vm.searchParam.departCityCode = vm.searchParam.departCityCodeList[1];
                }
                if (vm.searchParam.destCityCodeList) {
                    vm.searchParam.destCityCode = vm.searchParam.destCityCodeList[1];
                }
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 20000;
                searchExportParam.currentPage = 1;
                axios.get(Api.line.lineExport, {
                    params: searchExportParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '线路信息导出.xls';
                    link.click();
                    vm.btnLoading = true;
                }).catch(reason => {
                    vm.btnLoading = true;
                })
            },
            //线路应收应付导出
            linePayableAndReceivableExport() {
                let vm = this;
                vm.btnLineLoading = false;
                let searchLineExportParam = _.cloneDeep(vm.searchParam);
                searchLineExportParam.pageSize = 20000;
                searchLineExportParam.currentPage = 1;
                axios.get(Api.line.linePayableAndReceivableExport, {
                    params: searchLineExportParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '线路应收应付信息导出.xls';
                    link.click();
                    vm.btnLineLoading = true;
                }).catch(reason => {
                    vm.btnLineLoading = true;
                })
            },
            getAddVehicleSize(val) {
                if (val) {
                    this.dialogAddOutsourceForm.vehicleSize = val.specification
                }
            },
            getModifyVehicleSize(val) {
                if (val) {
                    this.dialogModifyOutsourceForm.vehicleSize = val.specification
                }
            },
        }
    }

</script>
<style>
    .appendClassStyle .el-input-group__append, .el-input-group__prepend {
        padding: 0 6px;
    }

    #addContractInfoLineForm .el-form-item__error {
        min-width: 100px;
    }
</style>
