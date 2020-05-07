<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>时效罚款配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="车型:">
                            <dictionary-select style="display: block" option-name="VEHICLE_SPECIFICATION" v-model="searchParam.vehicleType"/>
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
            <el-button type="primary" v-permission="'/timeFine/add'" icon="el-icon-plus" size="mini" @click="addVisible=true">新增</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column header-align="center" label="车型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_SPECIFICATION" v-model="scope.row.vehicleType"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="时效罚款金额(元/分钟)" prop="timeFineAccount" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="创建人" prop="createUser" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="修改人" prop="modifyUser" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" fixed="left" align="center" label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button v-permission="'/timeFine/modify'" type="text" icon="el-icon-edit" size="mini" @click="modifyWin(scope.row)">修改</el-button>
                        <el-button v-permission="'/timeFine/delete'" type="text" icon="el-icon-delete" size="mini" @click="deleteRow(scope.row)">删除</el-button>
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
        <el-dialog title="新增" :visible.sync="addVisible" width="35%">
            <el-form size="small" :model="addForm" :rules="addForm" ref="addForm" label-width="30%">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="车型:" prop="vehicleType" :rules="{required: true, message:'请输入车型！'}">
                            <dictionary-select style="display: block" option-name="VEHICLE_SPECIFICATION" v-model="addForm.vehicleType"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="时效罚款金额:" prop="timeFineAccount" :rules="[{required: true, message:'请输入罚款金额！'},Validate.money]">
                            <el-input v-model="addForm.timeFineAccount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="addVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addSubmit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="modifyVisible" width="35%">
            <el-form size="small" :model="modifyForm" :rules="modifyForm" ref="modifyForm" label-width="30%">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="车型:">
                            <dictionary-select-name option-name="VEHICLE_SPECIFICATION" v-model="modifyForm.vehicleType"/> 米
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="时效罚款金额:" prop="timeFineAccount" :rules="[{required: true, message:'请输入罚款金额！'},Validate.money]">
                            <el-input v-model="modifyForm.timeFineAccount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="modifyVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="modifySubmit">确 定</el-button>
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
                    vehicleType: ''
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                addForm:{
                    vehicleType: '',
                    timeFineAccount: ''
                },
                modifyForm:{
                    id: '',
                    vehicleType: '',
                    timeFineAccount: ''
                },
                multipleSelection: []
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.vehicleType = '';
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.timeFine.page,{ params : vm.searchParam }, result => {
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
            addSubmit(){
                this.$refs.addForm.validate((valid)=>{
                    if(valid){
                        Http.post(Api.timeFine.add, this.addForm, response => {
                            this.resetAddForm();
                            this.addVisible = false;
                            this.$message.success('新增时效扣款成功!');
                            this.searchList();
                        })
                    }
                })
            },
            resetAddForm(){
                this.addForm = {
                    vehicleType: '',
                    timeFineAccount: ''
                }
            },
            modifyWin(row){
                this.modifyVisible = true;
                this.modifyForm.id = row.id;
                this.modifyForm.vehicleType = row.vehicleType;
                this.modifyForm.timeFineAccount = row.timeFineAccount;
            },
            modifySubmit(){
                this.$refs.modifyForm.validate((valid)=>{
                    if(valid){
                        Http.post(Api.timeFine.modify, this.modifyForm, response => {
                            this.modifyVisible = false;
                            this.$message.success('修改时效扣款成功!');
                            this.searchList();
                        })
                    }
                })
            },
            deleteRow(row){
                this.multipleSelection.push(row.id);
                this.$confirm('删除本条数据后不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.timeFine.delete, this.multipleSelection, result => {
                        this.$message.success('删除成功！');
                        this.searchList();
                    })
                })
            }
        }
    }
</script>
