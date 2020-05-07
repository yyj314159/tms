<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础数据</el-breadcrumb-item>
                <el-breadcrumb-item>包天车辆</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <org-select v-model="searchParam.orgCode" style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierCode"
                                             style="display: block"></supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleCode" style="display: block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机姓名:">
                            <el-input v-model="searchParam.driverName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="协议开始时间:">
                            <el-date-picker value-format="yyyy-MM-dd 00:00:00" type="date"
                                            v-model="searchParam.agreementStartTimeStart" style="width:100%"
                                            :picker-options="searchPickerOptions00" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="至:">
                            <el-date-picker value-format="yyyy-MM-dd 23:59:59" type="date"
                                            v-model="searchParam.agreementStartTimeEnd" style="width:100%"
                                            :picker-options="searchPickerOptions01" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="协议结束时间:">
                            <el-date-picker value-format="yyyy-MM-dd 00:00:00" type="date"
                                            v-model="searchParam.agreementEndTimeStart" style="width:100%"
                                            :picker-options="searchPickerOptions10" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="至:">
                            <el-date-picker value-format="yyyy-MM-dd 23:59:59" type="date"
                                            v-model="searchParam.agreementEndTimeEnd" style="width:100%"
                                            :picker-options="searchPickerOptions11" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isMoreItemShow">
                    <el-col :span="6">
                        <el-form-item label="车辆到场时间:">
                            <el-date-picker value-format="yyyy-MM-dd 00:00:00" type="date"
                                            v-model="searchParam.vehicleStartTimeStart" style="width:100%"
                                            :picker-options="searchPickerOptions20" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="至:">
                            <el-date-picker value-format="yyyy-MM-dd 23:59:59" type="date"
                                            v-model="searchParam.vehicleStartTimeEnd" style="width:100%"
                                            :picker-options="searchPickerOptions21" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆离场时间:">
                            <el-date-picker value-format="yyyy-MM-dd 00:00:00" type="date"
                                            v-model="searchParam.vehicleEndTimeStart" style="width:100%"
                                            :picker-options="searchPickerOptions30" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="至:">
                            <el-date-picker value-format="yyyy-MM-dd 23:59:59" type="date"
                                            v-model="searchParam.vehicleEndTimeEnd" style="width:100%"
                                            :picker-options="searchPickerOptions31" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="司机电话:">
                            <el-input v-model="searchParam.driverPhone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="油卡卡号:">
                            <oil-card-select v-model="searchParam.oilCardNumber"
                                             style="display: block;"></oil-card-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="text" v-show="!isMoreItemShow" @click="isMoreItemShow = true" size="mini">展开搜索项></el-button>
                            <el-button type="text" v-show="isMoreItemShow" @click="isMoreItemShow = false" size="mini">收起搜索项<</el-button>
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">

            <el-button type="primary" v-permission="'/allDayVehicle/add'" icon="el-icon-plus" size="mini"
                       @click="addVisible=true">新增
            </el-button>
            <el-button v-if="exportLoading" v-permission="'/allDayVehicle/export'" icon="el-icon-download"
                       type="primary" size="mini" @click="exportList">导出
            </el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...
            </el-button>

            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column header-align="center" align="center" label="所属大区" prop="org.name" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="所属分区" prop="belongOrg.name" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="供应商" prop="supplier.name" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="车牌号" prop="vehicle.licenseNumber" min-width="100" show-overflow-tooltip>
                    <!--<template slot-scope="scope"><el-tooltip content="" placement="top" effect="light"></el-tooltip></template>-->
                </el-table-column>
                <el-table-column header-align="center" align="center" label="车挂号" prop="trailer.licenseNumber" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="厢型" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name v-if="scope.row.vehicle" option-name="VEHICLE_COMPARTMENT_TYPE"
                                                :value="scope.row.vanType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="车型" prop="specification" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="司机姓名" prop="driverName" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="联系方式" prop="driverPhone" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="油卡卡号" prop="oilCardNumber" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="油卡金额" prop="oilCardAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="包天单价" prop="allDayAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="油(元/Km)" prop="oilAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="路桥(元/Km)" prop="roadAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="协议开始时间" prop="agreementStartTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="协议结束时间" prop="agreementEndTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="车辆到场时间" prop="vehicleStartTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="车辆离场时间" prop="vehicleEndTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="包天时长" prop="allDayTime" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="包天费用" prop="allDayTotalAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="实付包天费用" prop="allDayActualAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="油费总额" prop="oilTotalAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="路桥费总额" prop="roadTotalAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="合计" prop="vehicleTotalAmount" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="创建时间" prop="createTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="创建人" prop="createUser" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="修改时间" prop="modifyTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="修改人" prop="modifyUser" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="操作" fixed="right" min-width="240">
                    <template slot-scope="scope">
                        <el-button v-permission="'/allDayVehicle/totalAmount'" type="text" icon="el-icon-edit" size="mini" @click="showAmountEdit(scope.row.id)">费用录入</el-button>
                        <el-button v-permission="'/allDayVehicle/modify'" type="text" icon="el-icon-edit" size="mini" @click="showModify(scope.row.id)">修改</el-button>
                        <el-button v-permission="'/allDayVehicle/delete'" type="text" icon="el-icon-delete" size="mini" @click="deleteRow(scope.row.id)">删除</el-button>
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
        <el-dialog title="新增包天车辆" :visible.sync="addVisible" width="80%" @close="resetAddForm">
            <el-form size="small" :model="addForm" ref="addForm" label-width="130px">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="所属区域:" prop="orgCode" :rules="Validate.required('所属区域',true)">
                            <org-select ref="addFormOrg" v-model="addForm.orgCode" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车牌号码:" prop="vehicleCode" :rules="Validate.required('车牌号码',true)">
                            <vehicle-select @change-option="changeAddVehicle" v-model="addForm.vehicleCode"
                                            vehicleOperationType="OUT_INVITE"
                                            :type="[Constant.VEHICLE_TYPE.VAN,Constant.VEHICLE_TYPE.TRACTOR]"
                                            style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="挂厢号码:" prop="trailerCode"
                                      :rules="Validate.required('挂厢号码',trailerRequired)">
                            <vehicle-select :disabled="!trailerRequired" v-model="addForm.trailerCode"
                                            :type="[Constant.VEHICLE_TYPE.TRAILER]"
                                            style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="供应商:">
                            <supplier-select ref="addFormSupplier" v-model="addForm.supplierCode" style="display: block;"></supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="司机姓名:" prop="driverId" :rules="Validate.required('司机姓名',true)">
                            <driver-select @driver="getAddDriver" :is-allow="true" v-model="addForm.driverId"
                                           :driverMobile.sync="addForm.driverPhone"
                                           style="display: block"></driver-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="司机电话:" prop="driverPhone"
                                      :rules="[Validate.required('司机电话',true),Validate.phone]">
                            <el-input :disabled="addForm.isDriverPhoneDisabled"
                                      v-model="addForm.driverPhone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="油(元/公里):" prop="oilAmount" :rules="[Validate.money]">
                            <el-input v-model="addForm.oilAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="路桥(元/公里):" prop="roadAmount" :rules="[Validate.money]">
                            <el-input v-model="addForm.roadAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="包天(元/天):" prop="allDayAmount"
                                      :rules="[Validate.required('包天价格',true),Validate.money]">
                            <el-input v-model="addForm.allDayAmount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="协议开始时间:" prop="agreementStartTime"
                                      :rules="[Validate.required('协议开始时间',true)]">
                            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                            v-model="addForm.agreementStartTime" style="width:100%"
                                            :picker-options="pickerOptions0" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="协议结束时间:" prop="agreementEndTime"
                                      :rules="[Validate.required('协议结束时间',true)]">
                            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                            v-model="addForm.agreementEndTime" style="width:100%"
                                            :picker-options="pickerOptions1" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="addVisible = false">取 消</el-button>
                <el-button :disabled="submitBtnDisabled" size="small" type="primary" @click="addSubmit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="修改包天车辆" :visible.sync="modifyVisible" width="80%">
            <el-form size="small" :model="modifyForm" ref="modifyForm" label-width="130px">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="所属区域:" prop="orgCode" :rules="Validate.required('所属区域',true)">
                            <org-select ref="modifyFormOrg" v-model="modifyForm.orgCode" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车牌号码:" prop="vehicleCode" :rules="Validate.required('车牌号码',true)">
                            <vehicle-select @change-option="changeModifyVehicle" ref="modifyFormVehicle"
                                            v-model="modifyForm.vehicleCode" disabled
                                            :type="[Constant.VEHICLE_TYPE.VAN,Constant.VEHICLE_TYPE.TRACTOR]"
                                            style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="挂厢号码:" prop="trailerCode"
                                      :rules="Validate.required('挂厢号码',trailerRequired)">
                            <vehicle-select :disabled="!trailerRequired" ref="modifyFormTrailer"
                                            v-model="modifyForm.trailerCode" :type="[Constant.VEHICLE_TYPE.TRAILER]"
                                            style="display:block;"></vehicle-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="供应商:">
                            <supplier-select ref="modifyFormSupplier" v-model="modifyForm.supplierCode"
                                             style="display: block;"></supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="司机姓名:" prop="driverId" :rules="Validate.required('司机姓名',true)">
                            <driver-select @driver="getModifyDriver" ref="modifyFormDriver" :is-allow="true"
                                           v-model="modifyForm.driverId" :driverMobile.sync="modifyForm.driverPhone"
                                           style="display: block"></driver-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="司机电话:" prop="driverPhone"
                                      :rules="[Validate.required('司机电话',true),Validate.phone]">
                            <el-input :disabled="modifyForm.isDriverPhoneDisabled"
                                      v-model="modifyForm.driverPhone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="油(元/公里):" prop="oilAmount" :rules="[Validate.money]">
                            <el-input v-model="modifyForm.oilAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="路桥(元/公里):" prop="roadAmount" :rules="[Validate.money]">
                            <el-input v-model="modifyForm.roadAmount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="包天(元/天):" prop="allDayAmount"
                                      :rules="[Validate.required('包天价格',true),Validate.money]">
                            <el-input v-model="modifyForm.allDayAmount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="协议开始时间:" prop="agreementStartTime"
                                      :rules="[Validate.required('协议开始时间',true)]">
                            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                            v-model="modifyForm.agreementStartTime" style="width:100%"
                                            :picker-options="pickerOptions2" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="协议结束时间:" prop="agreementEndTime"
                                      :rules="[Validate.required('协议结束时间',true)]">
                            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                            v-model="modifyForm.agreementEndTime" style="width:100%"
                                            :picker-options="pickerOptions3" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="车辆到场时间:">
                            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                            v-model="modifyForm.vehicleStartTime" style="width:100%"
                                            :picker-options="pickerOptions4" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车辆离场时间:">
                            <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                            v-model="modifyForm.vehicleEndTime" style="width:100%"
                                            :picker-options="pickerOptions5" placeholder="请选择时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="modifyVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifySubmit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 费用录入 -->
        <el-dialog title="费用录入" :visible.sync="amountEditVisible" width="35%" @close="resetAmountEditForm">
            <el-form size="small" :model="amountEditForm" ref="amountEditForm" label-width="130px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="实付包天费用:" prop="allDayActualAmount" :rules="[Validate.required('实付包天费用',true),Validate.money]">
                            <el-input v-model="amountEditForm.allDayActualAmount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="油费总额:" prop="oilTotalAmount" :rules="[Validate.required('油费总额',true),Validate.money]">
                            <el-input v-model="amountEditForm.oilTotalAmount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="路桥费总额:" prop="roadTotalAmount" :rules="[Validate.required('路桥费总额',true),Validate.money]">
                            <el-input v-model="amountEditForm.roadTotalAmount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="amountEditVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="amountEditFormSubmit">确 定</el-button>
            </div>
        </el-dialog>

    </el-container>
</template>

<script>
    import {Api, Common, Constant, Http, Validate} from 'src/global'

    export default {
        data() {
            return {
                Validate: Validate,
                tableHeight: window.innerHeight>800?430:null,
                isMoreItemShow: false,
                Constant: Constant,
                exportLoading: true,//导出
                isLoading: true,//查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    orgCode: '',//所属区域
                    supplierCode: '',//供应商
                    vehicleCode: '',//车牌号
                    driverName: '',
                    driverPhone: '',
                    oilCardNumber: '',
                    agreementStartTimeStart: '',
                    agreementStartTimeEnd: '',
                    agreementEndTimeStart: '',
                    agreementEndTimeEnd: '',
                    vehicleStartTimeStart: '',
                    vehicleStartTimeEnd: '',
                    vehicleEndTimeStart: '',
                    vehicleEndTimeEnd: ''
                },
                searchPickerOptions00: {
                    disabledDate: (time) => {
                        if (this.searchParam.agreementStartTimeEnd != "") {
                            return time.getTime() > new Date(this.searchParam.agreementStartTimeEnd).getTime();
                        }
                    }
                },
                searchPickerOptions01: {
                    disabledDate: (time) => {
                        return time.getTime() < new Date(this.searchParam.agreementStartTimeStart).getTime()
                    }
                },
                searchPickerOptions10: {
                    disabledDate: (time) => {
                        if (this.searchParam.agreementEndTimeEnd != "") {
                            return time.getTime() > new Date(this.searchParam.agreementEndTimeEnd).getTime();
                        }
                    }
                },
                searchPickerOptions11: {
                    disabledDate: (time) => {
                        return time.getTime() < new Date(this.searchParam.agreementEndTimeStart).getTime()
                    }
                },
                searchPickerOptions20: {
                    disabledDate: (time) => {
                        if (this.searchParam.vehicleStartTimeEnd != "") {
                            return time.getTime() > new Date(this.searchParam.vehicleStartTimeEnd).getTime();
                        }
                    }
                },
                searchPickerOptions21: {
                    disabledDate: (time) => {
                        return time.getTime() < new Date(this.searchParam.vehicleStartTimeStart).getTime()
                    }
                },
                searchPickerOptions30: {
                    disabledDate: (time) => {
                        if (this.searchParam.vehicleEndTimeEnd != "") {
                            return time.getTime() > new Date(this.searchParam.vehicleEndTimeEnd).getTime();
                        }
                    }
                },
                searchPickerOptions31: {
                    disabledDate: (time) => {
                        return time.getTime() < new Date(this.searchParam.vehicleEndTimeStart).getTime()
                    }
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //新增包天车辆
                addVisible: false,
                addForm: {
                    orgCode: '',//所属区域
                    supplierCode: '',//供应商
                    vehicleCode: '',//车牌号
                    trailerCode: '',
                    driverId: '',
                    driverName: '',
                    driverPhone: '',
                    isDriverPhoneDisabled: false,
                    oilAmount: '',
                    roadAmount: '',
                    allDayAmount: '',
                    agreementStartTime: '',
                    agreementEndTime: ''
                },
                pickerOptions0: {
                    disabledDate: (time) => {
                        if (this.addForm.agreementEndTime != "") {
                            return time.getTime() > new Date(this.addForm.agreementEndTime).getTime();
                        }
                    }
                },
                pickerOptions1: {
                    disabledDate: (time) => {
                        return time.getTime() < new Date(this.addForm.agreementStartTime).getTime();
                    }
                },
                submitBtnDisabled: false,
                //修改包天车辆
                modifyVisible: false,
                modifyForm: {
                    orgCode: '',//所属区域
                    supplierCode: '',//供应商
                    vehicleCode: '',//车牌号
                    trailerCode: '',
                    driverId: '',
                    driverName: '',
                    driverPhone: '',
                    isDriverPhoneDisabled: false,
                    oilAmount: '',
                    roadAmount: '',
                    allDayAmount: '',
                    agreementStartTime: '',
                    agreementEndTime: '',
                    vehicleStartTime: '',
                    vehicleEndTime: ''
                },
                pickerOptions2: {
                    disabledDate: (time) => {
                        if (this.modifyForm.agreementEndTime != "") {
                            return time.getTime() > new Date(this.modifyForm.agreementEndTime).getTime();
                        }
                    }
                },
                pickerOptions3: {
                    disabledDate: (time) => {
                        return time.getTime() < new Date(this.modifyForm.agreementStartTime).getTime();
                    }
                },
                pickerOptions4: {
                    disabledDate: (time) => {
                        if (this.modifyForm.vehicleEndTime != "") {
                            return time.getTime() > new Date(this.addForm.vehicleEndTime).getTime();
                        }
                    }
                },
                pickerOptions5: {
                    disabledDate: (time) => {
                        return time.getTime() < new Date(this.modifyForm.vehicleStartTime).getTime();
                    }
                },
                vehicleType: '',
                //费用录入
                amountEditVisible: false,
                amountEditForm:{
                    oilTotalAmount: '',
                    roadTotalAmount: '',
                    allDayActualAmount: ''
                }
            }
        },
        created() {
            this.searchList();
        },
        computed: {
            trailerRequired() {
                return this.vehicleType === Constant.VEHICLE_TYPE.TRACTOR
            }
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    orgCode: '',//所属区域
                    supplierCode: '',//供应商
                    vehicleCode: '',//车牌号
                    driverName: '',
                    driverPhone: '',
                    oilCardNumber: '',
                    agreementStartTimeStart: '',
                    agreementStartTimeEnd: '',
                    agreementEndTimeStart: '',
                    agreementEndTimeEnd: '',
                    vehicleStartTimeStart: '',
                    vehicleStartTimeEnd: '',
                    vehicleEndTimeStart: '',
                    vehicleEndTimeEnd: ''
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.allDayVehicle.page, {params: vm.searchParam}, result => {
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
            //新增包天车辆
            changeAddVehicle(obj) {
                if (!this.trailerRequired) {
                    this.addForm.trailerCode = '';
                }
                if(!_.isNil(obj)){
                    if (obj.blacklist === true) {
                        this.addForm.vehicleCode = '';
                        return this.$message('此车辆已被列入系统黑名单,不能选择!');
                    }
                    if (obj.status === 'FORBIDDEN') {
                        this.addForm.vehicleCode = '';
                        return this.$message('此车辆已被禁用,不能选择!');
                    }
                    this.vehicleType = obj.type;
                }
            },
            getAddDriver(obj) {
                let vm = this;
                vm.addForm.driverName = '';
                vm.addForm.driverPhone = "";
                vm.addForm.isDriverPhoneDisabled = false;
                if(!_.isNil(obj)){
                    vm.addForm.driverId = '';
                    if(obj.blacklist === true){
                        return vm.$message('此司机已被列入系统黑名单,不能选择!');
                    }
                    if(_.isNil(obj.name) || obj.name === ''){
                        return vm.$message.warning('该司机信息不完整，请完善司机信息！');
                    }
                    if(obj.name === obj.id){
                        vm.addForm.driverId = obj.id;
                        return;
                    }
                    vm.addForm.driverId = obj.id;
                    vm.addForm.driverName = obj.name;
                    vm.addForm.driverPhone = obj.mobile;
                    vm.addForm.isDriverPhoneDisabled = true;
                }
            },
            addSubmit() {
                let vm = this;
                vm.$refs.addForm.validate((valid) => {
                    if (valid) {
                        if (new Date(vm.addForm.agreementStartTime).getTime() > new Date(vm.addForm.agreementEndTime).getTime()) {
                            return vm.$message.warning('协议结束时间不能大于开始时间！')
                        }
                        vm.submitBtnDisabled = true;
                        Http.post(Api.allDayVehicle.add, vm.addForm, response => {
                            vm.resetAddForm();
                            vm.addVisible = false;
                            vm.$message.success('新增包天车辆成功!');
                            vm.searchList();
                            vm.submitBtnDisabled = false;
                        }, () => {
                            vm.submitBtnDisabled = false;
                        })
                    }
                })
            },
            resetAddForm() {
                this.addForm = {
                    orgCode: '',//所属区域
                    supplierCode: '',//供应商
                    vehicleCode: '',//车牌号
                    trailerCode: '',
                    driverId: '',
                    driverName: '',
                    driverPhone: '',
                    isDriverPhoneDisabled: false,
                    oilAmount: '',
                    roadAmount: '',
                    allDayAmount: '',
                    agreementStartTime: '',
                    agreementEndTime: ''
                };
                this.vehicleType = '';
            },
            //修改包天车辆
            showModify(id) {
                let vm = this;
                Http.get(Api.allDayVehicle.queryById, {params: {'id': id}}, result => {
                    vm.modifyForm = result.result;
                    Http.get(Api.vehicle.queryByCode, {params: {'code': result.result.vehicleCode}}, res => {
                        vm.vehicleType = res.result.type;
                    })
                    vm.$nextTick(() => {
                        if (!_.isNil(result.result.supplier)) {
                            vm.$refs.modifyFormSupplier.setCurrentSupplier(result.result.supplier)
                        }
                        if (!_.isNil(result.result.vehicle)) {
                            vm.$refs.modifyFormVehicle.setCurrentVehicle(result.result.vehicle)
                        }
                        if (!_.isNil(result.result.trailer)) {
                            vm.$refs.modifyFormTrailer.setCurrentVehicle(result.result.trailer)
                        }
                        if (!_.isNil(result.result.driver)) {
                            vm.$refs.modifyFormDriver.setCurrentDriver(result.result.driver)
                        }
                    })
                    vm.modifyVisible = true;
                })
            },
            changeModifyVehicle(obj) {
                if (!this.trailerRequired) {
                    this.modifyForm.trailerCode = '';
                }
                if(!_.isNil(obj)){
                    if (obj.blacklist === true) {
                        this.modifyForm.vehicleCode = '';
                        return this.$message('此车辆已被列入系统黑名单,不能选择!');
                    }
                    if (obj.status === 'FORBIDDEN') {
                        this.modifyForm.vehicleCode = '';
                        return this.$message('此车辆已被禁用,不能选择!');
                    }
                    this.vehicleType = obj.type;
                }
            },
            getModifyDriver(obj) {
                let vm = this;
                vm.modifyForm.driverName = '';
                vm.modifyForm.driverPhone = "";
                vm.modifyForm.isDriverPhoneDisabled = false;
                if(!_.isNil(obj)){
                    vm.modifyForm.driverId = '';
                    if(obj.blacklist === true){
                        return vm.$message('此司机已被列入系统黑名单,不能选择!');
                    }
                    if(_.isNil(obj.name) || obj.name === ''){
                        return vm.$message.warning('该司机信息不完整，请完善司机信息！');
                    }
                    if(obj.name === obj.id){
                        vm.modifyForm.driverId = obj.id;
                        return;
                    }
                    vm.modifyForm.driverId = obj.id;
                    vm.modifyForm.driverName = obj.name;
                    vm.modifyForm.driverPhone = obj.mobile;
                    vm.modifyForm.isDriverPhoneDisabled = true;
                }
            },
            modifySubmit() {
                let vm = this;
                vm.$refs.modifyForm.validate((valid) => {
                    if (valid) {
                        if (new Date(vm.modifyForm.agreementStartTime).getTime() > new Date(vm.modifyForm.agreementEndTime).getTime()) {
                            return vm.$message.warning('协议结束时间不能小于开始时间！')
                        }
                        if (vm.modifyForm.vehicleStartTime && vm.modifyForm.vehicleEndTime && new Date(vm.modifyForm.vehicleStartTime).getTime() > new Date(vm.modifyForm.vehicleEndTime).getTime()) {
                            return vm.$message.warning('车辆离场时间不能小于到场时间！')
                        }
                        Http.post(Api.allDayVehicle.modify, vm.modifyForm, response => {
                            vm.modifyVisible = false;
                            vm.$message.success('修改包天车辆成功!');
                            vm.searchList();
                        })
                    }
                })
            },
            resetModifyForm() {
                this.modifyForm = {
                    orgCode: '',//所属区域
                    supplierCode: '',//供应商
                    vehicleCode: '',//车牌号
                    trailerCode: '',
                    driverId: '',
                    driverName: '',
                    driverPhone: '',
                    isDriverPhoneDisabled: false,
                    oilAmount: '',
                    roadAmount: '',
                    allDayAmount: '',
                    agreementStartTime: '',
                    agreementEndTime: '',
                    vehicleStartTime: '',
                    vehicleEndTime: ''
                };
                this.vehicleType = '';
            },
            //费用录入
            showAmountEdit(id){
                let vm = this;
                Http.get(Api.allDayVehicle.queryById, {params: {'id': id}}, result => {
                    vm.amountEditForm = result.result;
                    vm.amountEditVisible = true;
                })
            },
            amountEditFormSubmit(){
                let vm = this;
                vm.$refs.amountEditForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.allDayVehicle.totalAmount, vm.amountEditForm, response => {
                            vm.amountEditVisible = false;
                            vm.$message.success('费用编辑成功!');
                            vm.searchList();
                        })
                    }
                })
            },
            resetAmountEditForm(){
                let vm = this;
                vm.amountEditForm = {
                    oilTotalAmount: '',
                    roadTotalAmount: '',
                    allDayActualAmount: ''
                }
            },
            //删除
            deleteRow(id) {
                this.$confirm('删除数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.allDayVehicle.delete, [id], result => {
                        this.$message.success('包天车辆删除成功！');
                        this.searchList();
                    })
                })
            },
            //导出
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.allDayVehicle.page, {params: searchExportParam}, response => {
                    let header = ['所属大区','所属分区', '供应商', '车牌号', '车挂号', '厢型', '车型', '司机姓名', '联系方式',
                        '油卡卡号', '油卡金额','包天单价', '油（元/公里）', '路桥（元/公里）', '协议开始时间', '协议结束时间', '车辆到场时间', '车辆离场时间',
                        '包天时长','包天费用','实付包天费用','油费总额', '路桥费总额','合计',
                        '创建时间','创建人','修改时间','修改人'];
                    let filterVal = ['org.name','belongOrg.name', 'supplier.name', 'vehicle.licenseNumber', 'trailer.licenseNumber', {type: 'dictionary', code: 'VEHICLE_COMPARTMENT_TYPE', name: 'vanType'}, 'specification', 'driverName', 'driverPhone',
                        'oilCardNumber', 'oilCardAmount', 'allDayAmount', 'oilAmount', 'roadAmount', 'agreementStartTime', 'agreementEndTime', 'vehicleStartTime', 'vehicleEndTime',
                        'allDayTime','allDayTotalAmount','allDayActualAmount','oilTotalAmount','roadTotalAmount','vehicleTotalAmount',
                        'createTime','createUser','modifyTime','modifyUser'];
                    Common.excel.downloadExl(response.result, header, filterVal, "包天车辆");
                    vm.exportLoading = true;
                }, () => {
                    vm.exportLoading = true;
                })
            }
        }
    }
</script>
