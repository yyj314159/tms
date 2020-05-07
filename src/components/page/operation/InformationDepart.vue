<template>
    <el-container>
        <div class="crumbs">
           <el-breadcrumb>
               <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
               <el-breadcrumb-item>信息部</el-breadcrumb-item>
           </el-breadcrumb>
        </div>

    <el-header class="content-header" height="">
        <el-form :model="searchParam" :rules="addBaseInfoLineFormRules" label-width="80px" size="small" >
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="名称:" >
                        <el-input v-model="searchParam.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="手机号:" >
                        <el-input v-model="searchParam.mobile"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="类型:" >
                        <dictionary-select v-model="searchParam.type" style="display: block" size="small" option-name="INFORMATION_DEPART_TYPE"></dictionary-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label-width="0" style="float: right" >
                        <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询</el-button>
                        <el-button type="warning" icon="el-icon-refresh" @click="resetSearchParam" size="small">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-header>
    <el-main class="content-main">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="addInformationWinFun" v-permission="'/informationDepart/add'">新增</el-button>
        <el-button size="mini" type="primary" icon="el-icon-download" @click="console.log('导出')">导出</el-button>
        <!--列表-->
        <el-table class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                  border fit
                  @row-dblclick="doubleClickRow"
                  highlight-current-row stripe
                  size="small"
        >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="类型" prop="type" :formatter="fomate"></el-table-column>
            <el-table-column label="所属组织" prop="orgCode"></el-table-column>
            <el-table-column label="联系人" prop="linkman"></el-table-column>
            <el-table-column label="手机号" prop="mobile"></el-table-column>
            <el-table-column label="座机" prop="telephone"></el-table-column>
            <el-table-column label="省份" prop="provinceCode"></el-table-column>
            <el-table-column label="城市" prop="cityCode"></el-table-column>
            <el-table-column label="地址" prop="address"></el-table-column>
            <el-table-column label="创建人" prop="createUser"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" ></el-table-column>
            <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" v-permission="'/informationDepart/modify'" size="mini"
                               @click="showModifyLineDialog(scope.row)"></el-button>
                    <el-button type="text" icon="el-icon-delete" v-permission="'/informationDepart/delete'" size="mini"
                               @click="deleteLine(scope.row)"></el-button>
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
        <el-dialog title="新增信息部信息" :visible.sync="addInformationOwnerWin" width="700px" :before-close="handleClose">
            <el-form  :model="addBaseInfoLineForm" :rules="addBaseInfoLineFormRules" ref="addBaseInfoLineForm" size="small" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="名称:" prop="name"  >
                            <el-input v-model="addBaseInfoLineForm.name" :disabled="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号:" prop="mobile">
                            <el-input v-model="addBaseInfoLineForm.mobile" :disabled="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型:">
                            <dictionary-select v-model="addBaseInfoLineForm.type" style="display: block" size="small" option-name="INFORMATION_DEPART_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属组织:" prop="orgCode">
                            <org-select v-model="addBaseInfoLineForm.orgCode" :disabled="isReadOnly" style="width: 200px"></org-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="联系人:" prop="linkman">
                            <el-input v-model="addBaseInfoLineForm.linkman" :disabled="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="座机:" prop="telephone">
                            <el-input v-model="addBaseInfoLineForm.telephone" :disabled="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="省份/城市:" prop="parentCode">
                           <district-select v-model="addBaseInfoLineForm.parentCode"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地址:" prop="">
                            <el-input v-model="addBaseInfoLineForm.address" :disabled="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="营业执照的照片:" prop="licenseImage">
                            <upload-image ref="vehicleLicenseAttachment" v-model="addBaseInfoLineForm.licenseImage"></upload-image>
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
        <el-dialog title="修改信息部信息" :visible.sync="updateInformationOwnerWin" width="700px" :before-close="handleClose">
            <el-form  :model="addBaseInfoLineForm" :rules="addBaseInfoLineFormRules" ref="addBaseInfoLineForm" size="small" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="名称:" prop="name"  >
                            <el-input v-model="addBaseInfoLineForm.name" :disabled="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号:" prop="mobile">
                            <el-input v-model="addBaseInfoLineForm.mobile" :disabled="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型:" prop="type">
                            <dictionary-select v-model="addBaseInfoLineForm.type" style="display: block" size="small" option-name="INFORMATION_DEPART_TYPE"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属组织:" prop="orgCode">
                            <org-select v-model="addBaseInfoLineForm.orgCode" :disabled="isReadOnly"></org-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="联系人:" prop="linkman">
                            <el-input v-model="addBaseInfoLineForm.linkman" :disabled="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="座机:" prop="telephone">
                            <el-input v-model="addBaseInfoLineForm.telephone" :disabled="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="省份/城市:" prop="parentCodes">
                            <district-select v-model="addBaseInfoLineForm.parentCodes"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地址:" prop="">
                            <el-input v-model="addBaseInfoLineForm.address" :disabled="isReadOnly"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="营业执照的照片:" prop="licenseImage">
                            <upload-image ref="vehicleLicenseAttachment" v-model="addBaseInfoLineForm.licenseImage"></upload-image>
                            <show-image :url="addBaseInfoLineForm.licenseImage"></show-image>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose" :disabled="isReadOnly" size="small">取 消</el-button>
                <el-button type="primary" @click="submitAddForm('addBaseInfoLineForm')" :disabled="isReadOnly" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 查看信息部信息弹出框 -->
        <el-dialog title="查看信息部信息" :visible.sync="watchInformationOwnerWin" width="700px" :before-close="handleClose">
            <el-form  :model="addBaseInfoLineForm" :rules="addBaseInfoLineFormRules" ref="addBaseInfoLineForm" size="small" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="名称:" prop="name"  >
                            <label v-model="addBaseInfoLineForm.name">{{addBaseInfoLineForm.name}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号:" prop="mobile">
                            <label v-model="addBaseInfoLineForm.mobile">{{addBaseInfoLineForm.mobile}}</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="类型:" prop="type">
                            <label v-model="addBaseInfoLineForm.type">{{addBaseInfoLineForm.type==1?'公司':'个人'}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属组织:" prop="orgCode">
                            <label v-model="addBaseInfoLineForm.type">{{addBaseInfoLineForm.orgCode}}</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="联系人:" prop="linkman">
                            <label v-model="addBaseInfoLineForm.linkman">{{addBaseInfoLineForm.linkman}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="座机:" prop="telephone">
                            <label v-model="addBaseInfoLineForm.telephone">{{addBaseInfoLineForm.telephone}}</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="省份/城市:" prop="parentCode">
                            <label v-for="parentCode in addBaseInfoLineForm.parentCode">{{
                                parentCode
                                }}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地址:">
                            <label v-model="addBaseInfoLineForm.address">{{addBaseInfoLineForm.address}}</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="营业执照的照片:" prop="licenseImage">
                            <show-image :url="addBaseInfoLineForm.licenseImage"></show-image>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    export default {
        data(){
          return{
              cityList: [],
              customerList: [],
              multipleSelection: [],
              searchParam:{
                  currentPage: 1,
                  pageSize: 10,
                  name:'',
                  mobile:'',
                  type:'',
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
              isReadOnly:false,
              isUpdate:false,
              addInformationOwnerWin:false,
              updateInformationOwnerWin:false,
              watchInformationOwnerWin:false,
              addBaseInfoLineFormRules: {
                  name: [
                      {required: true, message: '请输入客户', trigger: 'blur'},
                      {min: 1, max: 12, message: '编号最长12个字符', trigger: 'blur'}
                  ],
                  mobile: [
                      {required: true, message: '请输入手机号', trigger: 'blur'},
                      {pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号'}
                  ],
                  orgCode:[
                      {required: true, message: '请选择所属组织', trigger: 'blur'},
                      {min: 1, max: 12, message: '请输入所属组织', trigger: 'blur'}

                  ]
              }
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
                Http.get(Api.InformationDepart.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result
                    vm.searchResult.totalCount = result.totalCount
                    vm.searchParam.currentPage = result.currentPage
                    vm.searchParam.pageSize = result.pageSize
                })
            },
            //重置表单参数
            resetWinForm() {
                let vm = this
                this.$refs.vehicleLicenseAttachment.clearFileList();
                vm.addBaseInfoLineForm = {
                    name: '',
                    mobile: '',
                    type:'',
                    orgCode:'',
                    linkman:'',
                    telephone:'',
                    cityCode:'',
                    address:'',
                    licenseImage:'',
                    addImage:[],
                    index:'',
                }
            },
            //重置
            resetSearchParam() {
                let vm = this
                vm.searchParam.name = ''
                vm.searchParam.mobile = ''
                vm.searchParam.type = ''
            },
            //新增
            addInformationWinFun(){
                let vm =this
                vm.isReadOnly = false
                vm.isUpdate=false
                vm.addInformationOwnerWin = true
            },
            //修改信息部

            //新增信息部信息
            submitAddForm(formName) {
                let vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(!vm.isUpdate){
                            console.debug('test',this.$refs.vehicleLicenseAttachment.getFileList().length);
                            vm.addBaseInfoLineForm.licenseImage = this.$refs.vehicleLicenseAttachment.getFileList().join(",")//图片路径
                            console.debug('addBaseInfoLineForm',vm.addBaseInfoLineForm);
                            if(vm.addBaseInfoLineForm.licenseImage==''){
                                this.$message('请上传你的证件照片');
                            }else {
                                Http.post(Api.InformationDepart.add, vm.addBaseInfoLineForm, function (res) {
                                    vm.searchList()
                                    vm.addInformationOwnerWin = false
                                })
                            }
                        }else{
                            console.debug('hello')
                            vm.addBaseInfoLineForm.licenseImage = this.$refs.vehicleLicenseAttachment.getFileList().join(",")//图片路径
                            Http.post(Api.InformationDepart.modify, vm.addBaseInfoLineForm, function (res) {
                                vm.searchList()
                                vm.updateInformationOwnerWin = false
                                vm.resetWinForm()
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
                    Http.post(Api.InformationDepart.delete, ids, result => {
                        vm.searchList()
                    })
                })
            },
            //通过ID回显数据(修改)
            showModifyLineDialog(row) {
                let vm =this
                vm.isReadOnly = false
                vm.isUpdate=true
                Http.get(Api.InformationDepart.getInformationDepartById, {params: {'id': row.id}}, result => {
                    console.debug("result",result.result)
                    vm.updateInformationOwnerWin = true
                    vm.addBaseInfoLineForm = result.result
                })
            },
            doubleClickRow(row){//查看详情
                let vm =this
                vm.isReadOnly = true
                Http.get(Api.InformationDepart.getInformationOwnerWatchById, {params: {'id': row.id}}, result => {
                    vm.watchInformationOwnerWin = true
                    vm.addBaseInfoLineForm = result.result
                })
            },
            //format
            fomate(val){
              return val==='1'?'公司':'个人'
            },
        }
    }
</script>
