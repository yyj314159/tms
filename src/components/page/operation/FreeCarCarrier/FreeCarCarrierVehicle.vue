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
                <el-tab-pane label="无车承运车辆查询">
                    <el-header class="content-header" height="">
                        <el-form :model="model.searchParam" label-width="100px" size="small">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="车牌号:">
                                        <el-input v-model="model.searchParam.licenseNumber" style="display: block;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="18">
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
                            <el-table-column label="车牌号" prop="licenseNumber" min-width="130" show-overflow-tooltip/>
                            <el-table-column label="车牌颜色" prop="licensePlateColor" min-width="130"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="车辆型号" prop="carModel" min-width="130" show-overflow-tooltip
                                            v-show="false"/>
                            <el-table-column label="车辆载重" prop="carLoad" min-width="130"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="车长" prop="vehicleLength" min-width="130"
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
                            <el-table-column header-align="center" label="操作" fixed="right" min-width="130px"
                                            show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <!--<el-button type="text" icon="el-icon-edit" size="mini"-->
                                            <!--@click="modifyBlackList(scope.row)"></el-button>-->
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
                        <el-dialog title="上传车辆图片" :visible.sync="uploadWin" width="22.5%">
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
                    </el-main>
                </el-tab-pane>
                <el-tab-pane label="G7无车承运车辆查询">
                    <el-header class="content-header" height="">
                        <el-form :model="G7Model.G7SearchParam" label-width="100px" size="small">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="车牌号:">
                                        <el-input v-model="G7Model.G7SearchParam.licenseNumber"
                                                style="display: block;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="检测状态:">
                                        <data-dictionary-select option-name="G7_CAR_CHECK_STATUS"
                                                                v-model="G7Model.G7SearchParam.checkStatus"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
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
                            <el-table-column label="车牌号" prop="licenseNumber" min-width="135" show-overflow-tooltip/>
                            <el-table-column label="车辆颜色" prop="licensePlateColor" min-width="135"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="车辆型号" prop="carModel" min-width="135"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="车辆载重" prop="carLoad" min-width="135"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="车长" prop="vehicleLength" min-width="135"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="检验状态" prop="checkStatus" min-width="135"
                                            show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="scope.row.checkStatus"
                                                            option-name="G7_CAR_CHECK_STATUS"></dictionary-select-name>
                                </template>
                            </el-table-column>
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
                            <el-table-column label="所属单位" prop="owner" min-width="135"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="道路运输证号" prop="roadTransportCertificate" min-width="135"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="行驶证照片" prop="drivingLicenseImage" min-width="135"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="道路运输证照片" prop="roadTransportCertificateImage" min-width="135"
                                            show-overflow-tooltip></el-table-column>
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
    import {Api, Common, Http} from 'src/global';
    import DatadictionaryName from '../../../common/select/DatadictionaryName';
    import DataDictionarySelect from "../../../common/select/DataDictionarySelect";

    export default {
        components: {DataDictionarySelect, DatadictionaryName},
        data() {
            return {
                common: Common,
                initializeModel: {},
                currentRows: null,//操作行的数据
                model: {
                    searchParam: {//查询参数
                        currentPage: 1,
                        pageSize: 10,
                        licenseNumber: '',
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
                        licenseNumber: '',
                        checkStatus: ''
                    },
                    G7FreeCarCarrierDriverResult: {
                        totalCount: 0,
                        result: []
                    },
                },
                showWjyDriverRecordDetail: false,
                selections: [],
                uploadWin:false,
                action: Api.freeCarrierUpload.vehicleImage,
                dialogImageUrl: '',
                dialogVisible: false,
                fileList: [],
                permission:{
                    delete:'/freeCarrierVehicle/delete'
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
                Http.get(Api.freeCarrierVehicle.page, {params: vm.model.searchParam}, result => {
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
                Http.post(Api.freeCarrierVehicle.G7CarFreeCarrierPage, vm.G7Model.G7SearchParam, result => {
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
                debugger
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
                this.searchG7FreeCarCarrier()
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
                    Http.post(Api.freeCarrierVehicle.delete, ids, result => {
                        _this.$message.success("删除成功")
                        _this.searchGpsForMainList()
                    })
                })
            },
            G7CardUploadImage(){
                this.uploadWin=true;
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
