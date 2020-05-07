<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 配置管理</el-breadcrumb-item>
                <el-breadcrumb-item>合同公司</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="企业名称:">
                            <supplier-select placeholder="请输入企业名称或手机号" :types="Constant.SUPPLIER_TYPE.PLANTFORM_COMPANY"
                                             v-model="searchParam.userId" style="display: block"></supplier-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" style="float: right">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchList">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>

        <el-main class="content-main">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAdd = true">新增</el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column align="center" label="企业用户ID" prop="signerId" min-width="150px"></el-table-column>
                <el-table-column align="center" label="企业名称" prop="userName" min-width="150px"></el-table-column>
                <el-table-column align="center" label="企业证件类型" prop="certifyType" min-width="150px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="CERTIFY_TYPE" :value="scope.row.certifyType"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="认证号码" prop="certifyNum" min-width="150px"></el-table-column>
                <el-table-column align="center" label="手机号" prop="phoneNo" min-width="150px"></el-table-column>
                <el-table-column align="center" label="证书类型" prop="caType" min-width="150px"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="210">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.signerId" type="text" size="mini" @click="companyMoulage(scope.row)">
                            印模信息
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

            <!-- 新增弹出框 -->
            <el-dialog title="新增" :visible.sync="showAdd" width="550px" @close="resetAddForm">
                <el-form size="small" :model="addForm" ref="addForm" label-width="140px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="企业名称:" prop="userId" :rules="[{required: true,message:'请输入企业名称！'}]">
                                <supplier-select placeholder="请输入企业名称或手机号"  :types="Constant.SUPPLIER_TYPE.PLANTFORM_COMPANY"
                                                 v-model="addForm.userId" style="display: block"></supplier-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="企业证件类型:" prop="certifyType"
                                          :rules="[{required: true,message:'请输入企业证件类型！'}]">
                                <dictionary-select v-model="addForm.certifyType" style="display:block"
                                                   option-name="CERTIFY_TYPE"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="认证号码:" prop="certifyNum"
                                          :rules="[{required: true,message:'请输入认证号码！'}]">
                                <el-input v-model="addForm.certifyNum" style="display:block;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="手机号:" prop="phoneNo" :rules="[{required: true,message:'请输入手机号码！'},Validate.phone]">
                                <el-input v-model="addForm.phoneNo" style="display:block;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="证书类型:" prop="caType">
                                <el-input v-model="addForm.caType" style="display:block;" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="showAdd = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="addFormSubmit">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 公司印模 -->
            <el-dialog title="公司印模" :visible.sync="companyMoulageDialog" width="60%">
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddMoulage = true">新增</el-button>
                <el-table size="small" class="content-table" :data="companyMoulageList" element-loading-text="拼命加载中"
                          border fit highlight-current-row stripe>
                    <el-table-column align="center" label="企业印模id" prop="moulageId" min-width="150px"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="章的形状" prop="styleType" min-width="150px" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="MOULAGE_STYLE_TYPE" :value="scope.row.styleType"/>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="横向文案" prop="textContent" min-width="150px"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="防伪码" prop="keyContent" min-width="180px"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="字体颜色" prop="color" min-width="150px"
                                     show-overflow-tooltip>
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="MOULAGE_COLOR" :value="scope.row.color"/>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="印模模式" prop="mode" min-width="150px"
                                     show-overflow-tooltip>
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="MOULAGE_MODE" :value="scope.row.mode"/>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>

            <!-- 公司印模新增弹出框 -->
            <el-dialog title="新增" :visible.sync="showAddMoulage" width="550px">
                <el-form size="small" :model="addMoulageForm" ref="addMoulageForm" label-width="140px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="章的形状:" prop="styleType">
                                <dictionary-select v-model="addMoulageForm.styleType" style="display:block"
                                                   option-name="MOULAGE_STYLE_TYPE"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="横向文案:" prop="textContent">
                                <el-input v-model="addMoulageForm.certifyNum" style="display:block;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="字体颜色:" prop="color">
                                <dictionary-select v-model="addMoulageForm.color" style="display:block"
                                                   option-name="MOULAGE_COLOR"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="印模模式:" prop="mode">
                                <dictionary-select v-model="addMoulageForm.mode" style="display:block"
                                                   option-name="MOULAGE_MODE"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="防伪码:" prop="keyContent">
                                <el-input v-model="addMoulageForm.keyContent" style="display:block;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="showAddMoulage = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="addMoulageFormSubmit">确 定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
    import {Http, Api, Validate, Constant} from 'src/global'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                currentSignerId: '',
                btnLoading: true,
                isLoading: true,
                showAdd: false,
                showAddMoulage: false,
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    userId: '' //企业名称
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                companyMoulageDialog: false,
                companyMoulageList: [],
                multipleSelection: [],
                addForm: {
                    userId: '',//企业id
                    certifyType: '',//企业证件类型
                    certifyNum: '',//认证号码
                    phoneNo: '',//手机号
                    caType: 'B2'//证书类型
                },
                addMoulageForm: {
                    moulageId: '',//企业印模id
                    styleType: '',//章的形状
                    textContent: '',//横向文案
                    keyContent: '',//防伪码信息
                    color: '',//字体颜色
                    mode: ''//印模模式
                },
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.userId = '';
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.contractCompany.page, {params: vm.searchParam}, result => {
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
            addFormSubmit() {
                let vm = this;
                vm.$refs.addForm.validate((valid) => {
                    if (valid) {
                        Http.post(Api.contractCompany.add, vm.addForm, result => {
                            this.$message.success('合同公司添加成功！');
                            this.searchList();
                            vm.resetAddForm();
                            vm.showAdd = false;
                        })
                    }
                })
            },
            resetAddMoulageForm() {
                this.addMoulageForm= {
                    moulageId: '',//企业印模id
                    styleType: '',//章的形状
                    textContent: '',//横向文案
                    keyContent: '',//防伪码信息
                    color: '',//字体颜色
                    mode: ''//印模模式
                }
            },
            resetAddForm() {
                this.addForm = {
                    userId: '',//企业名称
                    certifyType: '',//企业证件类型
                    certifyNum: '',//认证号码
                    phoneNo: '',//手机号
                    caType: 'B2'//证书类型
                }
            },
            companyMoulage(row) {
                let vm = this;
                vm.currentSignerId = row.signerId;
                Http.get(Api.companyMoulage.getBySignerId, {params: {'signerId': row.signerId}}, result => {
                    vm.companyMoulageList = result.result;
                    vm.companyMoulageDialog = true;
                })
            },
            addMoulageFormSubmit() {
                let vm = this;
                vm.$refs.addMoulageForm.validate((valid) => {
                    if (valid) {
                        vm.addMoulageForm.signerId = vm.currentSignerId;
                        Http.post(Api.companyMoulage.add, vm.addMoulageForm, result => {
                            this.$message.success('印模添加成功！');
                            Http.get(Api.companyMoulage.getBySignerId, {params: {'signerId': vm.currentSignerId}}, result => {
                                vm.companyMoulageList = result.result;
                            })
                            vm.resetAddMoulageForm();
                            vm.showAddMoulage = false;
                        })
                    }
                })
            },
        }
    }
</script>

