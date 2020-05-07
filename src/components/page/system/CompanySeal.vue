<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 配置管理</el-breadcrumb-item>
                <el-breadcrumb-item>公司印章</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="企业名称:">
                            <supplier-select placeholder="请输入企业名称" :types="Constant.SUPPLIER_TYPE.PLANTFORM_COMPANY"
                                             v-model="searchParam.companyId" style="display: block"></supplier-select>
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
                <el-table-column align="center" label="企业名称" prop="companyName" min-width="150px"></el-table-column>
                <el-table-column align="center" label="公章类型" prop="serviceType" min-width="150px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SEAL_TYPE" :value="scope.row.serviceType"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="公章颜色" prop="color" min-width="150px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SEAL_COLOR" :value="scope.row.color"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="公章字体" prop="font" min-width="150px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="SEAL_FONT" :value="scope.row.font"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="公章下弦⽂" prop="serNo" min-width="150px"></el-table-column>
                <el-table-column align="center" label="统一信用号" prop="creditCode" min-width="150px"></el-table-column>
                <el-table-column align="center" label="手机号" prop="phone" min-width="150px"></el-table-column>
                <el-table-column align="center" label="邮箱" prop="email" min-width="150px"></el-table-column>
                <el-table-column align="center" label="公章副标题" prop="title" min-width="150px"></el-table-column>
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
                            <el-form-item label="企业名称:" prop="companyId" :rules="[{required: true,message:'请输入企业名称！'}]">
                                <supplier-select placeholder="请输入企业名称或手机号"
                                                 :types="Constant.SUPPLIER_TYPE.PLANTFORM_COMPANY"
                                                 v-model="addForm.companyId" style="display: block"></supplier-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="公章类型:" prop="serviceType"
                                          :rules="[{required: true,message:'请选择公章类型！'}]">
                                <dictionary-select v-model="addForm.serviceType" style="display:block"
                                                   option-name="SEAL_TYPE"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="公章颜⾊:" prop="color"
                                          :rules="[{required: true,message:'请选择公章颜⾊！'}]">
                                <dictionary-select v-model="addForm.color" style="display:block"
                                                   option-name="SEAL_COLOR"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="公章字体:" prop="font"
                                          :rules="[{required: true,message:'请选择公章字体！'}]">
                                <dictionary-select v-model="addForm.font" style="display:block"
                                                   option-name="SEAL_FONT"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="公章下弦⽂:" prop="serNo">
                                <el-input v-model="addForm.serNo" style="display:block;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="统一信用号:" prop="creditCode"
                                          :rules="[{required: true,message:'请输入统一信用号！'}]">
                                <el-input v-model="addForm.creditCode" style="display:block;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="手机号:" prop="phone"
                                          :rules="[{required: true,message:'请输入手机号码！'},Validate.phone]">
                                <el-input v-model="addForm.phone" style="display:block;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="邮箱:" prop="email" :rules="[{required: true,message:'请输入邮箱！'}]">
                                <el-input v-model="addForm.email" style="display:block;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="公章副标题:" prop="title">
                                <el-input v-model="addForm.title" style="display:block;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="showAdd = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="addFormSubmit">确 定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
    import {Api, Constant, Http, Validate} from 'src/global'

    export default {
        data() {
            return {
                Validate: Validate,
                Constant: Constant,
                btnLoading: true,
                isLoading: true,
                showAdd: false,
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    companyId: '' //企业名称
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                addForm: {
                    companyId: '',//企业名称
                    serviceType: '',//公章类型 默认圆形 0:圆形,1:椭圆形
                    color: '',//公章颜⾊,默认红⾊,0:红⾊,1:蓝⾊,2:⿊⾊
                    font: '',//公章字体,默认宋体,0:宋体,1:楷体,2:正⽅⿊体
                    serNo: '',//公章下弦⽂
                    creditCode: '',//统一信用号
                    title: '',//公章副标题
                    phone: '',//手机号
                    email: ''//邮箱
                }
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.companyId = '';
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.companySeal.page, {params: vm.searchParam}, result => {
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
                        Http.post(Api.companySeal.add, vm.addForm, result => {
                            this.$message.success('合同公司添加成功！');
                            this.searchList();
                            vm.resetAddForm();
                            vm.showAdd = false;
                        })
                    }
                })
            },
            resetAddForm() {
                this.addForm = {
                    companyId: '',//企业名称
                    serviceType: '',//公章类型 默认圆形 0:圆形,1:椭圆形
                    color: '',//公章颜⾊,默认红⾊,0:红⾊,1:蓝⾊,2:⿊⾊
                    font: '',//公章字体,默认宋体,0:宋体,1:楷体,2:正⽅⿊体
                    serNo: '',//公章下弦⽂
                    creditCode: '',//统一信用号
                    title: '',//公章副标题
                    phone: '',//手机号
                    email: '',//邮箱
                }
            },
        }
    }
</script>

