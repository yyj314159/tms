<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 定点加油</el-breadcrumb-item>
                <el-breadcrumb-item>加油车辆</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input v-model="searchParam.vehicleLicenseNum" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车辆性质:">
                            <dictionary-select v-model="searchParam.operationMode" style="display:block" option-name="VEHICLE_OPERATION_MODE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button v-permission="'/refuelingVehicle/add'" type="primary" size="mini" icon="el-icon-plus"  @click="showAdd = true">新增</el-button>
            <el-button v-if="btnLoading" v-permission="'/refuelingVehicle/export'" size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column align="center" label="车牌号" prop="vehicleLicenseNum" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="所属区域" prop="orgName" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车辆性质" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.operationMode">
                            <dictionary-select-name  option-name="VEHICLE_OPERATION_MODE" v-model="scope.row.operationMode"></dictionary-select-name>
                        </span>
                    </template>
                </el-table-column>
                <!--<el-table-column align="center" label="外请车队供应商" prop="supplier.name" min-width="200" show-overflow-tooltip></el-table-column>-->
                <el-table-column align="center" label="是否禁用" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if='scope.row.disableFlag' style="color: red">
                            {{"已禁用"}}
                        </span>
                        <span v-else>
                            {{"已启用"}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="210">
                    <template slot-scope="scope">
                        <!--<el-button v-permission="'/refuelingVehicle/modify'" type="text" size="mini" icon="el-icon-edit"  @click="modifyRow(scope.row)">修改</el-button>-->
                        <el-button v-permission="'/refuelingVehicle/delete'" type="text" size="mini" icon="el-icon-delete"  @click="deleteRow(scope.row)">删除</el-button>
                        <el-button v-if="!scope.row.disableFlag" v-permission="'/refuelingVehicle/disable'" type="text" size="mini"  @click="changeDisabledFlag(scope.row,!scope.row.disableFlag)"><i class="fa fa-ban"></i>禁用</el-button>
                        <el-button v-else v-permission="'/refuelingVehicle/disable'" type="text" size="mini"  @click="changeDisabledFlag(scope.row,!scope.row.disableFlag)"><i class="fa fa-check"></i>启用</el-button>
                        <el-button v-permission="'/refuelingVehicle/operationRecord'" type="text" size="mini"  @click="operationRecord(scope.row)">操作记录</el-button>
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

            <!-- 新增弹出框 -->
            <el-dialog title="新增" :visible.sync="showAdd" width="550px" @close="resetAddForm">
                <el-form  size="small" :model="addForm" :rules="addForm" ref="addForm" label-width="140px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="车牌号:" prop="vehicleLicenseNum" :rules="[{required: true,message:'请输入车牌号！'},Validate.licenseNumber]">
                                <el-input  v-model="addForm.vehicleLicenseNum" style="display:block;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="showAdd = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="addFormSubmit">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 修改弹出框 -->
            <el-dialog title="修改" :visible.sync="showModify" width="550px">
                <el-form  size="small" :model="modifyForm" :rules="modifyForm" ref="modifyForm" label-width="140px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="车牌号:">
                                {{modifyForm.vehicleLicenseNum}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="showModify = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="modifyFormSubmit">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 操作记录弹出框 -->
            <el-dialog title="操作记录" :visible.sync="operationRecordDialog" width="60%">
                <el-table size="small" class="content-table" :data="operationRecordList" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                    <el-table-column align="center" label="操作人" prop="operationUser" min-width="150px" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="操作时间" prop="operationTime" min-width="150px" show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="操作类型" prop="operationType" min-width="150px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="OPERATION_TYPE" v-model="scope.row.operationType"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作备注" prop="operationRemark" min-width="200px" show-overflow-tooltip></el-table-column>
                </el-table>
            </el-dialog>

        </el-main>
    </el-container>
</template>

<script>
    import {Http,Api,Validate,Common,Constant} from 'src/global'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                btnLoading: true,
                isLoading: true,
                showAdd: false,
                showModify: false,
                operationRecordDialog : false,
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    vehicleLicenseNum: '',//车牌号
                    operationMode:'' //车辆性质
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                operationRecordList: [],//操作记录
                multipleSelection: [],
                addForm: {
                    vehicleLicenseNum: ''//车牌号
                },
                modifyForm: {
                    id: '',
                    vehicleLicenseNum: '',//车牌号
                    vehicle:{}
                },
                operationRecordForm: {
                    id: '',
                    operationType: '',//操作类型
                    operationUser: '',//操作人
                    operationTime: '',//操作时间
                    operationRemark: ''//操作备注
                },
                tableHeight: window.innerHeight>800?480:null
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    vehicleLicenseNum: '',//车牌号
                    operationMode:'' //车辆性质
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.refuelingVehicle.page,{ params : vm.searchParam }, result => {
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
            addFormSubmit(){
                let vm = this;
                vm.$refs.addForm.validate((valid) => {
                    if(valid){
                        Http.post(Api.refuelingVehicle.add, vm.addForm, result => {
                            this.$message.success('车辆添加成功！');
                            this.searchList();
                            vm.showAdd = false;
                        })
                    }
                })
            },
            resetAddForm(){
                this.addForm = {
                    vehicleLicenseNum: ''//车牌号
                }
            },
            modifyRow(row){
                let vm = this;
                Http.get(Api.refuelingVehicle.queryById, {params: {'id': row.id}}, result => {
                    vm.showModify = true;
                    vm.modifyForm = result.result;
                })
            },
            operationRecord(row){
                let vm = this;
                Http.get(Api.refuelingVehicleRemark.query, {params: {'vehicleId': row.id}}, result => {
                    vm.operationRecordList = result.result;
                    vm.operationRecordDialog = true;
                })
            },
            modifyFormSubmit(){
                let vm = this;
                vm.$refs.modifyForm.validate((valid) => {
                    if(valid){
                        Http.post(Api.refuelingVehicle.modify, vm.modifyForm, result => {
                            this.$message.success('修改成功！');
                            this.searchList();
                            vm.showModify = false;
                        })
                    }
                })
            },
            deleteRow(row){ // 清除---------------------------------
                this.multipleSelection.push(row.id);
                this.$confirm('删除本条数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.refuelingVehicle.delete, this.multipleSelection, result => {
                        this.$message.success('删除成功！');
                        this.multipleSelection = [];
                        this.searchList();
                    },result=>{
                        this.multipleSelection = [];
                    })
                })
            },
            changeDisabledFlag(row,flag){
                let newRow = _.cloneDeep(row);
                newRow.disableFlag = flag;
                let str = flag?`确定要禁用  ${row.vehicleLicenseNum}  的加油功能？`:`确定要启用  ${row.vehicleLicenseNum}  的加油功能？`;
                let msg = flag?`车辆禁用成功！`:`车辆启用成功！`;
                this.$confirm(str, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.refuelingVehicle.disable, newRow, result => {
                        this.$message.success(msg);
                        this.searchList();
                    })
                })
            },
            exportData() {
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.refuelingVehicle.page, {params: searchExportParam}, response => {
                    let header = ['车牌号', '所属区域', '车辆性质', '是否禁用'];
                    let filterVal = ['vehicleLicenseNum','orgName', 'operationMode',{
                        type: 'dictionary',
                        code: 'VEHICLE_DISABLE_STATUS',
                        name: 'disableFlag'
                    }];
                    if (response.result && response.result.length > 0) {
                        for (let i = 0; i < response.result.length; i++) {
                            response.result[i].operationMode = response.result[i].operationMode=='SELF_SUPPORT'? "自营" :
                                response.result[i].operationMode=='OUTSOURCE' ?"合作":"外请";
                        }
                    }
                    Common.excel.downloadExl(response.result, header, filterVal, "加油车辆导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            },
        }
    }
</script>

