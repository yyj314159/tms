<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb>
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础信息</el-breadcrumb-item>
                <el-breadcrumb-item>结算客户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form :model="searchParam" label-width="100px" size="small" >
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="名称:" >
                            <el-input v-model="searchParam.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="客户:" >
                            <customer-select v-model="searchParam.customerCode" style="display: block;" level="top"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label-width="0" style="float: right" >
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询</el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetSearchParam" size="small">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addInformationWinFun" v-permission="'/settlementCustomer/add'">新增</el-button>
            <el-button v-if="btnLoading" size="mini" type="primary" icon="el-icon-download" @click="exportCustomer" v-permission="'/settlementCustomer/export'">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <!--列表-->
            <el-table class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      border fit
                      highlight-current-row stripe
                      size="small"
            >
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="客户" prop="customerCode"></el-table-column>
                <el-table-column label="创建人" prop="createUser"></el-table-column>
                <el-table-column label="创建时间" prop="createTime" ></el-table-column>
                <el-table-column label="修改人" prop="modifyUser" ></el-table-column>
                <el-table-column label="修改时间" prop="modifyTime"></el-table-column>
                <el-table-column label="操作" header-align="center" align="center" width="120" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" size="mini"
                                   @click="showModifyLineDialog(scope.row)" v-permission="'/settlementCustomer/modify'"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini"
                                   @click="deleteLine(scope.row)" v-permission="'/settlementCustomer/delete'"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
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
        <!-- 新增信息部信息弹出框 -->
        <el-dialog title="新增结算客户信息" :visible.sync="addInformationOwnerWin" width="600px" :before-close="handleClose">
            <el-form :model="addBaseInfoLineForm" ref="addBaseInfoLineForm" size="small" :rules="addSettleCustomerRules" label-width="150px">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="客户:" prop="customerCode">
                            <customer-select v-model="addBaseInfoLineForm.customerCode" :disabled="isReadOnly"  style="display: block; width:100%;" level="top"></customer-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="名称:" prop="name">
                            <el-input v-model="addBaseInfoLineForm.name" :disabled="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose" :disabled="isReadOnly" size="small">取 消</el-button>
                <el-button type="primary" @click="submitAddForm('addBaseInfoLineForm')" :disabled="isReadOnly" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改信息部信息弹出框 -->
        <el-dialog title="修改结算客户信息" :visible.sync="updateInformationOwnerWin" width="600px" :before-close="handleClose">
            <el-form  :model="addBaseInfoLineForm" ref="addBaseInfoLineForm" size="small"  :rules="addSettleCustomerRules" label-width="150px">
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="客户:" prop="customerCode">
                            <customer-select v-model="addBaseInfoLineForm.customerCode" style="display:block;" ref="modifyCustomerSelect" level="top"></customer-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="名称:" prop="name">
                            <el-input v-model="addBaseInfoLineForm.name" :disabled="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose" :disabled="isReadOnly" size="small">取 消</el-button>
                <el-button type="primary" @click="submitAddForm('addBaseInfoLineForm')" :disabled="isReadOnly" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Common} from 'src/global';
    export default {
        data(){
            return{
                btnLoading: true,
                cityList: [],
                customerList: [],
                multipleSelection: [],
                searchParam:{
                    currentPage: 1,
                    pageSize: 10,
                    name:'',
                    customerCode:'',
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                updateCityOptios:[],
                addBaseInfoLineForm: {
                    name: '',
                    mobile: '',
                    type: '',
                    orgCode: '',
                    linkman: '',
                    mobile: '',
                    telephone: '',
                    provinceCode:'',
                    parentCode: [],
                    parentCodes: [],
                    licenseImage: '',
                    addImage:[],
                    address: '',
                },
                addSettleCustomerRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {min: 1, max: 25, message: '编号最长25个字符', trigger: 'blur'}
                    ],customerCode:[
                        {required: true, message: '请输入客户', trigger: 'blur'},
                    ]
                },
                isReadOnly:false,
                isUpdate:false,
                addInformationOwnerWin:false,
                updateInformationOwnerWin:false,
                watchInformationOwnerWin:false,
            }
        },
        mounted() {
            //查询表格
            this.searchList()
        },
        methods:{
            //通用
            handleCurrentChange(val) {
                let vm = this
                vm.searchParam.currentPage = val
                this.searchList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            handleSizeChange(val) {
                let vm = this
                vm.searchParam.pageSize = val
                this.searchList()
            },
            handleClose() {
                this.addInformationOwnerWin=false
                this.updateInformationOwnerWin=false
                this.watchInformationOwnerWin=false
                this.resetWinForm()
            },
            /**
             * 主界面
             */
            //查询
            searchList() {
                let vm = this
                Http.get(Api.SettlementCustomer.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result
                    vm.searchResult.totalCount = result.totalCount
                    vm.searchParam.currentPage = result.currentPage
                    vm.searchParam.pageSize = result.pageSize
                })
            },
            //重置表单参数
            resetWinForm() {
                let vm = this
                vm.addBaseInfoLineForm = {
                    name: '',
                    customerCode:'',
                    createUser:'',
                    modifyUser:''
                }
            },
            //重置
            resetSearchParam() {
                let vm = this
                vm.searchParam.name = ''
                vm.searchParam.customerCode = ''
            },
            //新增
            addInformationWinFun(){
                let vm =this
                vm.isReadOnly = false
                vm.isUpdate=false
                vm.addInformationOwnerWin = true
            },
            //新增信息部信息
            submitAddForm(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(!vm.isUpdate){
                            Http.post(Api.SettlementCustomer.add, vm.addBaseInfoLineForm, function (res) {
                                vm.searchList()
                                vm.addInformationOwnerWin = false
                            })
                        }else{
                            Http.post(Api.SettlementCustomer.modify, vm.addBaseInfoLineForm, result => {
                                vm.searchList()
                                vm.resetWinForm()
                                vm.updateInformationOwnerWin = false
                                // vm.addBaseInfoLineForm = result.result
                            })
                        }
                    }
                })
            },
            //删除
            deleteLine(row) {
                let vm = this
                var ids = []
                ids.push(row.id)
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.SettlementCustomer.delete, ids, result => {
                        vm.searchList()
                    })
                })
            },
            //通过ID回显数据(修改)
            showModifyLineDialog(row) {
                let vm =this
                vm.isReadOnly = false
                vm.isUpdate=true
                Http.get(Api.SettlementCustomer.getSettlementCustomerById, {params: {'id': row.id}}, result => {
                    vm.updateInformationOwnerWin = true;
                    setTimeout(() => {
                        let customer = {code:result.result.customer.code,name:result.result.customer.name}
                        vm.$refs.modifyCustomerSelect.setCurrentCustomer(customer);
                        vm.addBaseInfoLineForm = result.result
                    }, 0)
                })
            },
           //导出结算客户
            exportCustomer(){
                let _this = this;
                _this.btnLoading = false;
                let model = _.cloneDeep(_this.searchParam);
                model.pageSize = 3000;
                model.currentPage = 1;
                Http.get(Api.SettlementCustomer.getExcelData, {params: model}, result => {
                    //导出GPS
                    let header = ['名称', '客户', '创建人', '创建时间', '修改人', '修改时间'];
                    let filterVal = ['name', 'customerCode','createUser', 'createTime','modifyUser', 'modifyTime'];
                    Common.excel.downloadExl(result.result, header, filterVal, "结算客户导出");
                    _this.btnLoading = true;
                },()=>{
                    _this.btnLoading = true;
                })
            }
        }
    }
</script>

