<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础数据</el-breadcrumb-item>
                <el-breadcrumb-item>烟草车辆</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input  v-model="searchParam.vehicleLicenseNumber"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button type="primary" v-permission="'/tobaccoVehicle/add'" icon="el-icon-plus" size="mini" @click="addVisible=true">新增</el-button>
            <el-button v-permission="'/tobaccoVehicle/delete'" type="danger" icon="el-icon-delete" size="mini" @click="deleteRow">删除</el-button>

            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe
                      @selection-change="handleSelectionChangeLineStore" ref="multipleTable" :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column header-align="center" align="center" label="车牌号" prop="vehicleLicenseNumber" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="添加人" prop="createUser" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="添加时间" prop="createTime" show-overflow-tooltip></el-table-column>
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
        <el-dialog title="新增" :visible.sync="addVisible" width="35%">
            <el-form size="small" :model="addForm" :rules="addForm" ref="addForm" label-width="30%">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="车牌号:" prop="vehicleLicenseNumber" :rules="[{required: true, message:'请输入车牌号！'},Validate.licenseNumber]">
                            <el-input  v-model="addForm.vehicleLicenseNumber"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="addVisible = false">取 消</el-button>
                <el-button :disabled="submitBtnDisabled" size="small" type="primary" @click="addSubmit">确 定</el-button>
            </div>
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
                addVisible: false,
                modifyVisible: false,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    vehicleLicenseNumber: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                addForm:{
                    vehicleLicenseNumber: ''
                },
                multipleSelection: [],
                submitBtnDisabled: false,
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
                    vehicleLicenseNumber: ''
                }
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.tobaccoVehicle.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            handleSelectionChangeLineStore(val) {
                this.multipleSelection = val;
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            addSubmit(){
                let vm = this;
                vm.$refs.addForm.validate((valid)=>{
                    if(valid){
                        vm.submitBtnDisabled = true;
                        Http.post(Api.tobaccoVehicle.add, vm.addForm, response => {
                            vm.resetAddForm();
                            vm.addVisible = false;
                            vm.$message.success('新增烟草车辆成功!');
                            vm.searchList();
                            vm.submitBtnDisabled = false;
                        },()=>{
                            vm.submitBtnDisabled = false;
                        })
                    }
                })
            },
            resetAddForm(){
                this.addForm = {
                    vehicleLicenseNumber: ''
                }
            },
            deleteRow(){
                let ids = [];
                this.multipleSelection.forEach((item)=>{
                    ids.push(item.id);
                });
                this.$confirm('删除数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.tobaccoVehicle.delete, ids, result => {
                        this.$message.success('烟草车辆删除成功！');
                        this.searchList();
                    })
                })
            }
        }
    }
</script>
