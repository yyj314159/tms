<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i>车辆管理</el-breadcrumb-item>
                <el-breadcrumb-item>小甩挂车辆</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input v-model="searchParam.licenseNumber" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="区域:">
                            <current-org-select v-model="searchParam.orgCode" style="display: block"></current-org-select>
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
            <el-button v-permission="'/smallSlingVehicle/add'" type="primary" size="mini" icon="el-icon-plus"  @click="showAdd = true">新增</el-button>
            <el-button v-if="btnLoading" v-permission="'/smallSlingVehicle/export'" size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column align="center" label="车辆编号" prop="vehicleCode" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="车牌号" prop="licenseNumber" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="区域" prop="orgCode" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="210">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/orderDingTalkNotice/modify'" icon="el-icon-edit" size="mini" @click="showModifySmallSlingVehicleDialog(scope.row)"></el-button>
                        <el-button type="text" v-permission="'/orderDingTalkNotice/delete'" icon="el-icon-delete" size="mini"  @click="deleteSmallSlingVehicle(scope.row)"></el-button>
                        <!--<el-button v-permission="'/smallSlingVehicle/operationRecord'" type="text" size="mini"  @click="operationRecord(scope.row)">操作记录</el-button>-->
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
                            <el-form-item label="车辆编号:" prop="vehicleCode" :rules="{required: true,message:'请输入车辆编号！'}">
                                <el-input v-model="addForm.vehicleCode" style="display:block;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="22">
                            <el-form-item label="车牌号:" prop="licenseNumber" :rules="[{required: true,message:'请输入车牌号！'},Validate.licenseNumber]">
                                <el-input  v-model="addForm.licenseNumber" style="display:block;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="22">
                            <el-form-item label="区域:" prop="orgCode">
                                <current-org-select v-model="addForm.orgCode" style="display: block"></current-org-select>
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
                        <el-form-item label="车辆编号:" prop="vehicleCode">
                            <el-input v-model="modifyForm.vehicleCode" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="车牌号:" prop="licenseNumber">
                            <el-input  v-model="modifyForm.licenseNumber" style="display:block;" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="区域:" prop="orgCode">
                            <current-org-select style="display: block"  v-model="modifyForm.orgCode" size="small"></current-org-select>
                        </el-form-item>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="showModify = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="modifyFormSubmit">确 定</el-button>
                </div>
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
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    id:'',
                    vehicleCode:'',//车辆编号
                    licenseNumber: '',//车牌号
                    orgCode:'' //区域
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                addForm: {
                    licenseNumber: ''//车牌号
                },
                modifyForm: {
                    id:'',
                    vehicleCode: '',
                    licenseNumber: '',
                    orgCode: ''
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
                    vehicleCode: '',//车辆编号
                    licenseNumber:'', //车牌号
                    orgCode:'' //区域
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.smallSlingVehicle.page,{ params : vm.searchParam }, result => {
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
                        Http.post(Api.smallSlingVehicle.add, vm.addForm, result => {
                            this.$message.success('车辆添加成功！');
                            this.searchList();
                            vm.showAdd = false;
                        })
                    }
                })
            },
            resetAddForm(){
                this.addForm = {
                    licenseNumber: ''//车牌号
                }
            },
            modifyRow(row){
                let vm = this;
                Http.get(Api.smallSlingVehicle.queryById, {params: {'id': row.id}}, result => {
                    vm.showModify = true;
                    vm.modifyForm = result.result;
                })
            },
            //通过ID回显数据
            showModifySmallSlingVehicleDialog(row){
                let vm = this;
                console.log(row)
                Http.get(Api.smallSlingVehicle.queryById,{params:{'id':row.id}},result =>{
                    vm.showModify = true;
                    vm.modifyForm = result.result;
                })
            },
            modifyFormSubmit(){
                let vm = this;
                vm.$refs.modifyForm.validate((valid) => {
                    if(valid){
                        Http.post(Api.smallSlingVehicle.modify, vm.modifyForm, result => {
                            this.$message.success('修改成功！');
                            this.searchList();
                            vm.showModify = false;
                        })
                    }
                })
            },
            deleteSmallSlingVehicle(row){ // 清除---------------------------------
                this.multipleSelection.push(row.id);
                this.$confirm('删除本条数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.smallSlingVehicle.delete, this.multipleSelection, result => {
                        this.$message.success('删除成功！');
                        this.multipleSelection = [];
                        this.searchList();
                    },result=>{
                        this.multipleSelection = [];
                    })
                })
            },
            exportData() {
                let vm = this;
                vm.btnLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.smallSlingVehicle.page, {params: searchExportParam}, response => {
                    let header = ['车辆编号', '车牌号', '区域'];
                    let filterVal = ['vehicleCode','licenseNumber', 'orgCode'];
                    // if (response.result && response.result.length > 0) {
                    //     for (let i = 0; i < response.result.length; i++) {
                    //         response.result[i].operationMode = response.result[i].operationMode=='SELF_SUPPORT'? "自营" :
                    //             response.result[i].operationMode=='OUTSOURCE' ?"合作":"外请";
                    //     }
                    // }
                    Common.excel.downloadExl(response.result, header, filterVal, "小甩挂车辆导出");
                    vm.btnLoading = true;
                }, () => {
                    vm.btnLoading = true;
                })
            },
        }
    }
</script>

