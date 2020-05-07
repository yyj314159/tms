<template>
    <el-container id="freeCar">
        <el-header>
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                    <el-breadcrumb-item><i class="el-icon-date"></i> 无车承运管理</el-breadcrumb-item>
                    <el-breadcrumb-item><i class="el-icon-date"></i> 无车承运司机管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-header>
        <el-main>
            <el-tabs type="border-card">
                <el-tab-pane label="无车承运司机查询">
                    <el-header class="content-header" height="">
                        <el-form :model="model.searchParam" label-width="100px" size="small">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="司机姓名:">
                                        <el-input v-model="model.searchParam.driverName" style="display: block;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="司机电话:">
                                        <el-input v-model="model.searchParam.driverPhone"
                                                style="display: block;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="司机身份证:">
                                        <el-input v-model="model.searchParam.driverCard"
                                                style="display: block;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item style="float:right" label-width="0">
                                        <el-button type="success" icon="el-icon-search" @click="searchGpsForMainList">查询
                                        </el-button>
                                        <el-button type="warning" icon="el-icon-refresh" @click="resetMainSearchParam">重置
                                        </el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-header>
                    <el-main class="content-main">
                        <!--<el-button size="mini" type="primary" icon="el-icon-plus">新增-->
                        <!--</el-button>-->
                        <el-button size="mini" type="primary" @click="G7CardUploadImage">上传图片</el-button>
                        <el-table class="content-table" element-loading-text="拼命加载中"
                                :data="model.searchResult.result"
                                border fit
                                @selection-change="handlerChange"
                                @on-dbclick="handleRowHandle"
                                highlight-current-row stripe
                                size="small">
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column label="司机姓名" prop="driverName" min-width="130" show-overflow-tooltip/>
                            <el-table-column label="司机电话" prop="driverPhone" min-width="130"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="司机身份证" prop="driverCard" min-width="150" show-overflow-tooltip
                                            v-show="false"></el-table-column>
                            <el-table-column label="司机驾驶证过期日期" prop="driverLicenseExpire" min-width="140"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="车牌号" prop="licenseNumber" min-width="130"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="状态" prop="status" min-width="130" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="scope.row.status"
                                                            option-name="NO_CAR_DRIVER_STATUS"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="图片是否上传" prop="imageFlag" min-width="130">
                                <template slot-scope="scope">
                                    {{scope.row.imageFlag === true ? '是':'否'}}
                                </template>
                            </el-table-column>
                            <el-table-column label="创建时间" prop="createTime" min-width="130"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="创建人" prop="createUser" min-width="130" show-overflow-tooltip
                                            v-show="false"/>
                            <el-table-column label="修改时间" prop="modifyTime" min-width="130"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="修改人" prop="modifyUuser" min-width="130"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column header-align="center" label="操作" fixed="right" min-width="90px"
                                            show-overflow-tooltip>
                                <template slot-scope="scope">
                                  <el-button type="text" icon="el-icon-edit" size="mini" @click="modifyDriver(scope.row)"></el-button>
                                    <el-button type="text" icon="el-icon-delete" size="mini"
                                            @click="deleteList(scope.row)" v-permission="permission.delete"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <div class="content-pagination">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :page-sizes="[10, 20, 50, 100]"
                                :page-size="model.searchParam.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="model.searchResult.totalCount">
                            </el-pagination>
                        </div>
                        <el-dialog title="上传司机图片" :visible.sync="uploadWin" width="22.5%">
                            <el-upload
                                :action="action"
                                :headers = "{'Authorization':'Bearer ' + common.token.getToken()}"
                                :on-change="handleChange"
                                :on-preview="handlePreview"
                                :file-list="fileList"
                                :on-error="uploadError"
                                :on-success="uploadSuccess"
                                :on-remove="handleRemove"
                                :multiple="false"
                                list-type="picture"
                                drag
                                :limit="1">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip">支持jpg/png/gif格式,仅上传一张即可</div>
                            </el-upload>
                        </el-dialog>
                        <el-dialog title="修改司机信息" :visible.sync="modifyDriverWin" width="800px" :before-close="handleClose">
                            <el-form inline size="small" :model="modifyDriverWinForm" label-width="120px" ref="modifyDriverWinForms" :rules="winFormRules">
                                  <el-row>
                                      <el-col :span="12">
                                          <el-form-item label="司机姓名" prop="driverName">
                                              <el-input v-model="modifyDriverWinForm.driverName" style="display: block"></el-input>
                                          </el-form-item>
                                      </el-col>
                                      <el-col :span="12">
                                          <el-form-item label="司机电话" prop="driverPhone">
                                              <el-input v-model="modifyDriverWinForm.driverPhone" style="display: block"></el-input>
                                          </el-form-item>
                                      </el-col>
                                  </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="司机身份证" prop="driverCard">
                                            <el-input v-model="modifyDriverWinForm.driverCard" style="display: block"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button size="small" @click="handleClose">取 消</el-button>
                                <el-button type="primary" size="small" @click="submitModify('modifyDriverWinForms')">确 定</el-button>
                            </div>
                        </el-dialog>
                    </el-main>
                </el-tab-pane>
                <el-tab-pane label="G7无车承运司机查询">
                    <el-header class="content-header" height="">
                        <el-form :model="G7Model.G7SearchParam" label-width="100px" size="small">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="司机姓名:">
                                        <el-input v-model="G7Model.G7SearchParam.driverName"
                                                style="display: block;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="司机身份证:">
                                        <el-input v-model="G7Model.G7SearchParam.driverCard"
                                                style="display: block;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="检测状态:">
                                        <data-dictionary-select option-name="G7_CAR_CHECK_STATUS"
                                                                v-model="G7Model.G7SearchParam.checkStatus"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item style="float:right" label-width="0">
                                        <el-button type="success" icon="el-icon-search" @click="searchG7FreeCarCarrier">查询
                                        </el-button>
                                        <el-button type="warning" icon="el-icon-refresh" @click="resetG7SearchParam">重置
                                        </el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-header>
                    <el-main class="content-main">
                        <el-table class="content-table" :data="G7Model.G7FreeCarCarrierDriverResult.result"
                                element-loading-text="拼命加载中"
                                border fit>
                            <el-table-column label="司机身份证号" prop="driverCard" min-width="135" show-overflow-tooltip/>
                            <el-table-column label="司机姓名" prop="driverName" min-width="135"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="司机电话" prop="driverPhone" min-width="135"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="检验状态" prop="checkStatus" min-width="135"
                                            show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="scope.row.checkStatus"
                                                            option-name="G7_CAR_CHECK_STATUS"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="身份证过期时间" prop="driverCardExpire" min-width="135" show-overflow-tooltip
                                            v-show="false">
                                <template slot-scope="scope">
                                    {{new Date(scope.row.driverCardExpire) | moment("YYYY-MM-DD hh:mm:ss")}}
                                </template>
                            </el-table-column>
                            <el-table-column label="驾驶证过期时间" prop="driverLicenseExpire" min-width="135"
                                            show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{new Date(scope.row.driverLicenseExpire) | moment("YYYY-MM-DD hh:mm:ss")}}
                                </template>
                            </el-table-column>
                            <el-table-column label="车牌号" prop="licenseNumber" min-width="135"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="司机身份证照片" prop="driverCardImage" min-width="135"
                                            show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <show-image :url="scope.row.driverCardImage"></show-image>
                                </template>
                            </el-table-column>
                            <el-table-column label="司机身份证反照" prop="driverCardImage2" min-width="135"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="驾驶证照片" prop="driverLicenseImage" min-width="135"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="创建时间" prop="gmtCreate" min-width="135" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{new Date(scope.row.gmtModified) | moment("YYYY-MM-DD hh:mm:ss")}}
                                </template>
                            </el-table-column>
                            <el-table-column label="更新时间" prop="gmtModified" min-width="135" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{new Date(scope.row.gmtModified) | moment("YYYY-MM-DD hh:mm:ss")}}
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="content-pagination">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :page-sizes="[10, 20, 50, 100]"
                                :page-size="G7Model.G7SearchParam.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="G7Model.G7FreeCarCarrierDriverResult.totalCount">
                            </el-pagination>
                        </div>
                    </el-main>
                </el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>
</template>


<script>
    import {Api, Common, Http,Validate} from 'src/global';
    import DatadictionaryName from '../../../common/select/DatadictionaryName';
    import DataDictionarySelect from "../../../common/select/DataDictionarySelect";

    export default {
        components: {DataDictionarySelect, DatadictionaryName},
        data() {
            return {
                common: Common,
                Validate:Validate,
                initializeModel: {},
                currentRows: null,//操作行的数据
                modifyDriverWin:false,
                modifyDriverWinForm:{
                    id:'',
                    driverName:'',
                    driverPhone:'',
                    driverCard:''
                },
                model: {
                    searchParam: {//查询参数
                        currentPage:1,
                        pageSize: 10,
                        driverName: '',
                        driverPhone: '',
                        driverCard: ''
                    },
                    searchResult: {
                        totalCount: 0,
                        result: [],
                    },

                },
                G7Model: {
                    G7SearchParam: {
                        currentPage: 1,
                        pageSize: 10,
                        driverName: '',
                        checkStatus: '',
                        driverCard: ''
                    },
                    G7FreeCarCarrierDriverResult: {
                        totalCount: 0,
                        result: []
                    },
                },
                showWjyDriverRecordDetail: false,
                selections: [],
                uploadWin:false,
                action: Api.freeCarrierUpload.driverImage,
                dialogImageUrl: '',
                dialogVisible: false,
                fileList: [],
                permission:{
                    delete:'/freeCarrierDriver/delete'
                },
                winFormRules:{
                    driverCard:[
                      {required: true, message: '请选择身份证号', trigger: 'blur'},
                      {pattern:/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, message: '请输入正确的身份证号!'}
                    ],
                    driverName: [
                        {required: true, message: '请选择姓名', trigger: 'blur'},
                        {min: 1, max: 12, message: '请输入姓名', trigger: 'blur'}
                    ],
                    //手机号
                    driverPhone: [
                        {required: true, message: '请选择手机号', trigger: 'blur'},
                        {pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号!'}
                    ]
                }
            }
        },
        mounted() { //立即执行
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            this.searchGpsForMainList();
            this.searchG7FreeCarCarrier();
        },
        methods: {
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            hideDetailVehicle() {
                this.showWjyDriverRecordDetail = false;
            },
            //方法
            //main
            searchGpsForMainList() {//main 查询
                let vm = this;
                Http.get(Api.freeCarrierDriver.page, {params: vm.model.searchParam}, result => {
                    vm.model.searchResult.result = result.result
                    vm.model.searchResult.totalCount = result.totalCount
                    vm.model.searchParam.currentPage = result.currentPage
                    vm.model.searchParam.pageSize = result.pageSize
                })
            },
            resetMainSearchParam() {
                this.model.searchParam = this.cloneMode().model.searchParam
            },
            searchG7FreeCarCarrier() {
                let vm = this;
                Http.post(Api.freeCarrierDriver.G7CarFreeCarrierPage, vm.G7Model.G7SearchParam, result => {
                    vm.G7Model.G7FreeCarCarrierDriverResult.result = result.result.records
                    vm.G7Model.G7FreeCarCarrierDriverResult.totalCount = result.result.total
                    vm.G7Model.G7SearchParam.currentPage = result.result.current
                    vm.G7Model.G7SearchParam.pageSize = result.result.size
                })
            },
            resetG7SearchParam() {
                this.G7Model.G7SearchParam = this.cloneMode().G7Model.G7SearchParam
            },
            //table
            handlerChange(rows) { //选中时触发
                this.selections = rows
            },
            handleCurrentChange(val) {
                let vm = this
                vm.model.searchParam.currentPage = val
                vm.G7Model.G7SearchParam.currentPage=val
                this.searchGpsForMainList()
                this.searchG7FreeCarCarrier()
            },
            handleSizeChange(val) {
                let vm = this
                vm.model.searchParam.pageSize = val
                this.searchGpsForMainList()
            },
            handleRowHandle(row) {
                this.detailsGpsWinShow(row);
            },
            handlePreview(file) {
                if(file.url.substring(file.url.lastIndexOf('.')).toLowerCase() === '.jpg' || file.url.substring(file.url.lastIndexOf('.')).toLowerCase() === '.png'||file.url.substring(file.url.lastIndexOf('.')).toLowerCase() === '.gif'){
                    this.dialogImageUrl = file.url;
                    this.dialogVisible = true;
                }else{
                    window.open(file.url)
                }
            },
            handleChange(file, fileList) {
                if (fileList) {
                    for (let i = 0; i < fileList.length; i++) {
                        fileList[i].name = '查看';
                    }
                }
                this.fileList = fileList;
            },
            handleRemove(file, fileList) {
                this.fileList = fileList;
            },
            uploadError(err, file, fileList) {
                console.log(err);
                this.$message.error("上传失败!,系统异常");
                this.uploadWin=false;
            },
            uploadSuccess(response, file, fileList) {
                debugger
                if (!response.success) {
                    if (response.businessException) {
                        this.$message.error("上传失败!" + response.message);
                    } else {
                        this.$message.error("上传失败!");
                    }
                    fileList.splice(fileList.indexOf(file), 1);
                }
                this.$message.success("上传成功");
                this.uploadWin=false;
            },
            deleteList(row){
                let _this = this;
                var ids = [];
                ids.push(row.id);
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.freeCarrierDriver.delete, ids, result => {
                        _this.$message.success("删除成功")
                        _this.searchGpsForMainList()
                    })
                })
            },
            modifyDriver(row){
                let _this=this;
                Http.get(Api.freeCarrierDriver.getDeTailById, {params: {'id': row.id}}, result => {
                    _this.modifyDriverWin=true
                    _this.modifyDriverWinForm = result.result
                })
            },
            G7CardUploadImage(){
                this.uploadWin=true;
            },
            handleClose() {
                let _this = this;
                _this.modifyDriverWin=false
                _this.modifyDriverWinForm=_this.cloneMode().modifyDriverWinForm;
            },
            submitModify(formName){
               let _this=this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.freeCarrierDriver.modify, _this.modifyDriverWinForm,function (res) {
                            _this.$message.success("修改司机信息成功");
                            _this.handleClose();
                        })
                    }
                })
            }
        }
    }
</script>
<style>
#freeCar>.el-tabs{
    width: 100%;
}
#freeCar>.el-header{
    height: auto!important;
}
#freeCar>.el-header>.crumbs{
    margin-bottom: 0!important;
}
</style>
