<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 定点加油</el-breadcrumb-item>
                <el-breadcrumb-item>加油供应商结算</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="账单编号:">
                            <el-input v-model="searchParam.code" style="display:block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="账单生成人:">
                            <el-input v-model="searchParam.createUser" style="display:block;"></el-input>
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
            <el-button v-if="btnDownLoading" icon="el-icon-download" type="primary" size="mini" v-permission="'/refuelingSupplierSettlement/download'"
                       @click="templateDownload">模板下载
            </el-button>
            <upload-excel :importUrl="url" style="display: inline-block;margin-left: 10px;"
                          v-permission="'/refuelingSupplierSettlement/import'" @success="uploadSuccess"></upload-excel>
            <el-button :disabled="multipleSelection.length==0" v-permission="'/refuelingSupplierSettlement/check'"
                       size="mini" type="primary" icon="el-icon-check"
                       style="display: inline-block; margin-left: 10px;"
                       @click="checkSubmit()">核对
            </el-button>
            <el-button :disabled="multipleSelection.length==0" v-permission="'/refuelingSupplierSettlement/settlement'"
                       size="mini" type="primary" icon="el-icon-check"
                       style="display: inline-block; margin-left: 10px;"
                       @click="settlementSubmit()">结算
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      @selection-change="handleSelectionChange" element-loading-text="拼命加载中" border fit highlight-current-row stripe>
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column align="center" label="账单编号" prop="code" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="refuelingDetail(scope.row)">{{scope.row.code}}</a>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="结算金额" prop="settlementAmount" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="加油供应商" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="GAS_STATION"
                                                v-model="scope.row.refuelingSupplier"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所属区域" prop="belongOrg.name" min-width="180"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="是否核对" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.checkFlag ? "已核对" : "未核对"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否结算" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.settlementFlag ? "已结算" : "未结算"}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="加油凭证" min-width="140">
                    <template slot-scope="scope">
                        <a target="_blank" :href="scope.row.settlementImage" style="colord: #409EFF">
                            查看照片
                        </a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="账单生成人" prop="createUser" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="账单生成时间" prop="createTime"  min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="210">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini"  v-permission="'/refuelingSupplierSettlement/upload'"
                                   @click="modifyRow(scope.row)">上传凭证</el-button>
                        <el-button type="text" v-if="!scope.row.checkFlag"
                                   icon="el-icon-delete" size="mini" v-permission="'/refuelingSupplierSettlement/delete'"
                                   @click="deleteRow(scope.row)">删除</el-button>
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

            <el-dialog title="凭证信息" :visible.sync="showModify" width="550px">
                <el-form  size="small" :model="modifyForm" :rules="modifyForm" ref="modifyForm" label-width="140px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="账单编号:">
                                {{modifyForm.code}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="加油供应商:">
                                <dictionary-select v-model="modifyForm.refuelingSupplier"
                                                   option-name="GAS_STATION" style="display: block;"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="所属区域:">
                                <current-org-select v-model="modifyForm.belongOrgCode"
                                                    style="display: block"></current-org-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="加油凭证:">
                                <upload-image ref="settlementImage" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="showModify = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="modifyFormSubmit">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 详情的table-->
            <el-dialog title="加油记录" :visible.sync="refuelingDetailDialog" width="70%">
                <el-button v-if="exportDetailLoading" size="mini" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
                <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
                <el-table size="small" class="content-table" :data="searchDetailResult.result" element-loading-text="拼命加载中"
                          border fit
                          highlight-current-row stripe>
                    <el-table-column align="center" label="加油单号" prop="refuelingCode" min-width="180"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="车牌号"  prop="vehicleLicenseNum"
                                     min-width="140"></el-table-column>
                    <el-table-column align="center" label="加油时间" prop="refuelingTime" min-width="140"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" label="是否核对" min-width="130" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.checkFlag ? "已核对" : "未核对"}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="是否结算" min-width="130" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.settlementFlag ? "已结算" : "未结算"}}
                        </template>
                    </el-table-column>
                </el-table>
                <div style="height:45px" v-if="refuelingDetailDialog">
                    <div class="content-pagination">
                        <el-pagination @size-change="handleSizeChangeDetail"
                                       @current-change="handleCurrentChangeDetail"
                                       :page-sizes="[10, 20, 50, 100]"
                                       :page-size="searchDetailParam.pageSize"
                                       layout="total, sizes, prev, pager, next, jumper"
                                       :total="searchDetailResult.totalCount">
                        </el-pagination>
                    </div>
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
                url: Api.refuelingSupplierSettlementRel.upload,
                btnDownLoading: true,
                exportDetailLoading: true,
                isLoading: true,
                showModify: false,
                refuelingDetailDialog : false,
                Api: Api,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    code: '',//账单编号
                    createUser:'' //账单生成人
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                //查询参数
                searchDetailParam: {
                    currentPage: 1,
                    pageSize: 10,
                    billCode: ''
                },
                //返回结果
                searchDetailResult: {
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                modifyForm: {
                    id: '',
                    code: '',//加油单号
                    refuelingSupplier: '',//加油供应商
                    belongOrgCode: '',//所属区域
                    settlementImage: ''//加油凭证图片
                }
            }
        },
        created() {
            this.searchList();
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam.code = '';
                this.searchParam.createUser = '';
            },
            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.refuelingSupplierSettlement.page,{ params : vm.searchParam }, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                },()=>{
                    vm.isLoading = false;
                })
            },
            searchDetailList(){
                let vm = this;
                Http.get(Api.refuelingRecord.pageDetail, {params: vm.searchDetailParam}, response => {
                    vm.searchDetailResult.result = response.result;
                    vm.searchDetailResult.totalCount = response.totalCount;
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChangeDetail(val) {
                let vm = this;
                vm.searchDetailParam.pageSize = val;
                this.searchDetailList();
            },
            handleCurrentChangeDetail(val) {
                let vm = this;
                vm.searchDetailParam.currentPage = val;
                this.searchDetailList();
            },
            refuelingDetail(row) {
                let vm = this;
                vm.searchDetailParam.billCode=row.code;
                vm.searchDetailParam.currentPage = 1;
                Http.get(Api.refuelingRecord.pageDetail, {params: vm.searchDetailParam}, response => {
                    vm.searchDetailResult.result = response.result;
                    vm.searchDetailResult.totalCount = response.totalCount;
                    vm.refuelingDetailDialog = true;
                })
            },
            modifyRow(row){
                let vm = this;
                Http.get(Api.refuelingSupplierSettlement.queryById, {params: {'id': row.id}}, response => {
                    setTimeout(() => {
                        vm.$refs.settlementImage.clearFileList();
                        vm.$refs.settlementImage.setFileList(response.result.settlementImage ? response.result.settlementImage.split(",") : null);
                        vm.modifyForm = response.result;
                    }, 0)
                    vm.showModify = true;
                })
            },
            modifyFormSubmit(){
                let vm = this;
                vm.$refs.modifyForm.validate((valid) => {
                    if(valid){
                        vm.modifyForm.settlementImage = this.$refs.settlementImage.getFileList().join(",");
                        Http.post(Api.refuelingSupplierSettlement.modify, vm.modifyForm, result => {
                            this.$message.success('上传凭证成功！');
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
                    Http.post(Api.refuelingSupplierSettlement.delete, this.multipleSelection, result => {
                        this.$message.success('删除成功！');
                        this.multipleSelection = [];
                        this.searchList();
                    },result=>{
                        this.multipleSelection = [];
                    })
                })
            },
            templateDownload() {
                this.btnDownLoading = false;
                Common.excel.downloadExl([], ["加油单号"], null, '加油供应商结算导入模板');
                this.btnDownLoading = true;
            },
            uploadSuccess() {
                let vm = this;
                vm.searchList();
            },
            checkSubmit() {
                let vm = this;
                var ids = [];
                for (let i = 0; i < vm.multipleSelection.length; i++) {
                    if (vm.multipleSelection[i].checkFlag) {
                        this.$message('请选择未核对的数据');
                        return;
                    }
                    ids.push(vm.multipleSelection[i].id);
                }
                this.$confirm('是否已经核对?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.refuelingSupplierSettlement.check, ids, result => {
                        vm.$message.success("核对成功")
                        vm.searchList();
                    })
                })
            },
            settlementSubmit() {
                let vm = this;
                var ids = [];
                for (let i = 0; i < vm.multipleSelection.length; i++) {
                    if (!vm.multipleSelection[i].checkFlag) {
                        this.$message('只能选择已经核对的数据来结算');
                        return;
                    }
                    if (vm.multipleSelection[i].settlementFlag) {
                        this.$message('请选择未结算的数据');
                        return;
                    }
                    ids.push(vm.multipleSelection[i].id);
                }
                this.$confirm('是否结算?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.refuelingSupplierSettlement.settlement, ids, result => {
                        vm.$message.success("结算成功")
                        vm.searchList();
                    })
                })
            },
            exportData() {
                let vm = this;
                vm.exportDetailLoading = false;
                let searchExportParam = _.cloneDeep(vm.searchDetailParam);
                searchExportParam.pageSize = 50000;
                searchExportParam.currentPage = 1;
                Http.get(Api.refuelingRecord.pageDetail, {params: searchExportParam}, response => {
                    let header = ['加油单号', '车牌号', '加油时间', '是否核对', '是否结算'];
                    let filterVal = ['refuelingCode','vehicleLicenseNum', 'refuelingTime',  {
                        type: 'dictionary',
                        code: 'CHECK_STATUS',
                        name: 'checkFlag'
                    },
                    {
                        type: 'dictionary',
                        code: 'SETTLEMENT_STATUS',
                        name: 'settlementFlag'
                    }];
                    Common.excel.downloadExl(response.result, header, filterVal, "加油供应商结算信息");
                    vm.exportDetailLoading = true;
                }, () => {
                    vm.exportDetailLoading = true;
                })
            },
        }
    }
</script>

