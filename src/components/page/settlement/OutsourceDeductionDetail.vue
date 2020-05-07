<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 财务管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 合作应付</el-breadcrumb-item>
                <el-breadcrumb-item>合作扣款</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <supplier-select v-model="searchParam.supplierId" style="display:block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="false">
                        <el-form-item label="大区:">
                            <org-select style="display: block" v-model="searchParam.regionCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="小区:">
                            <org-select style="display: block" v-model="searchParam.belongOrgCode"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="扣款编号:">
                            <el-input v-model="searchParam.code" size="small"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <el-input v-model="searchParam.licenseNum" size="small"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="费用产生时间:">
                            <el-date-picker
                                v-model="searchParam.occurTime"
                                :default-time="['00:00:00', '23:59:59']"
                                style="width: 100%"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                end-placeholder="结束日期" size="small">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="扣款状态:">
                            <dictionary-select v-model="searchParam.confirmStatus" style="display:block"
                                               option-name="DEDUCTION_STATE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="扣款大类:">
                            <dictionary-select v-model="searchParam.deductionCategories" style="display:block"
                                               option-name="DEDUCTION_CATEGORIES"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" size="small">查询
                            </el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam" size="small">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <div style="display: inline-flex;">
                <el-button size="mini" type="primary" icon="el-icon-download" @click="exportData"
                           v-permission="permission.exportDataPermission">模板下载</el-button>
                <el-button size="mini" type="primary" icon="el-icon-download" @click="outsourceDeductionExport" >导出</el-button>
                <upload-excel :importUrl="api.upload" @success="uploadSuccess" style="margin: 0 10px 0 10px;"
                              v-permission="permission.uploadSuccessPermission"/>
                <el-button size="mini" type="primary" icon="el-icon-check" @click="confirmCharge"
                           v-permission="permission.createReceiveBillPermission"
                           :disabled="buttonClick.confirmChargeButton">暂缓扣款
                </el-button>
                <el-button size="mini" type="primary" icon="el-icon-check" @click="toBeDeducted"
                           v-permission="permission.toBeDeductedPermission"
                           :disabled="buttonClick.confirmChargeButton">转入待扣款
                </el-button>
                <el-button size="mini" type="primary" icon="el-icon-check" @click="noDeductions"
                           v-permission="permission.noDeductionsPermission"
                           :disabled="buttonClick.confirmChargeButton">自营车不扣款
                </el-button>

                <upload-file size="mini" type="primary" icon="el-icon-check" style="margin: 0 10px 0 10px;"
                             v-permission="permission.loadDetail"
                             @upload="uploadSuccess" title="上传明细" :disabled="buttonClick.uploadDetail"/>
            </div>
            <el-table size="small" class="content-table" :data="searchResult.result" v-loading="isLoading" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit
                      :row-class-name="tableRowClassName"
                      highlight-current-row >
                <el-table-column type="selection" width="40"/>
                <el-table-column align="center" label="扣款编号" prop="code" min-width="120px"/>
                <el-table-column align="center" label="车牌号" prop="licenseNum" min-width="120px"/>
                <el-table-column align="center" label="大区" prop="regionOrg.name" min-width="120px"/>
                <el-table-column align="center" label="小区" prop="belongOrgName" min-width="120px"/>
                <el-table-column align="center" label="费用产生时间" prop="feeCreateTime" min-width="160px"/>
                <el-table-column align="center" label="车辆属性" prop="vehicleNature" min-width="150px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="VEHICLE_OPERATION_MODE"
                                                :value="scope.row.vehicleNature"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="扣款大类" prop="deductionCategories" min-width="150px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="DEDUCTION_CATEGORIES"
                                                :value="scope.row.deductionCategories"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="扣款类别" prop="deductionType" min-width="150px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="DEDUCTION_TYPE"
                                                :value="scope.row.deductionType"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="供应商" prop="supplierName" min-width="200px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="金额" prop="deductionSum" min-width="120px"/>
                <el-table-column align="center" label="备注" prop="remark" min-width="180px"
                                 show-overflow-tooltip/>
                <el-table-column align="center" label="扣款清单附件" prop="value" min-width="120px" >
                    <template slot-scope="scope">
                        <a v-if="$_permission(permission.loadDetail)" :href="scope.row.attachmentUpload" >点击下载附件</a>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="导入时间" prop="uploadTime" min-width="160px"/>
                <el-table-column align="center" label="导入人员" prop="uploadUser" min-width="160px"/>
                <el-table-column align="center" label="扣款状态" prop="confirmStatus" min-width="80px">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="DEDUCTION_STATE"
                                                :value="scope.row.confirmStatus"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="扣款时间" prop="confirmTime" min-width="160px"/>
                <el-table-column align="center" label="扣款人员" prop="confirmUser" min-width="160px"/>
                <el-table-column align="center" label="修改人" prop="modifyUser" min-width="160px"/>
                <el-table-column align="center" label="修改时间" prop="modifyTime" min-width="160px"/>
                <el-table-column align="center" label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" v-permission="permission.modify" size="mini" @click="updateOneWinShow(scope.row)"/>
                        <el-button type="text" icon="el-icon-delete" v-permission="permission.deleteDetailOne" size="mini" @click="deleteOne(scope.row)"/>
                        <el-button type="text" icon="el-icon-delete" v-permission="permission.deleteDetail" size="mini" @click="deleteAll(scope.row)">删除全部</el-button>
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
                    :total="searchResult.totalCount"/>
            </div>
        </el-main>
        <el-dialog :title="win.updateWinTitle" :visible.sync="win.updateWinShow"
                   width="600px">
            <el-form :model="win.updateWinForm" ref="updateWin"
                     :rules="win.updateWinRules" label-width="100px" size="small" align="center">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="扣款编号:" prop="code" style="word-break:break-all;">
                            {{win.updateWinForm.code}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" >
                        <el-form-item label="车牌号:" prop="licenseNum">
                            <el-input v-model="win.updateWinForm.licenseNum"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" >
                        <el-form-item label="扣款金额:" prop="deductionSum">
                            <el-input v-model="win.updateWinForm.deductionSum"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" >
                        <el-form-item label="费用产生时间" prop="feeCreateTime">
                            <date-picker-single v-model="win.updateWinForm.feeCreateTime"  :end-date="newDate"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="win.updateWinShow = false" size="small">取 消</el-button>
                <el-button type="primary" @click="updateOneSubmit('updateWin')"
                           size="small">确 定
                </el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
    import {Http, Api, Common,Constant} from 'src/global'
    import {Validate} from 'src/global/validate'
    export default {
        data() {
            let permission = {
                modify:'/outsourceDeductionDetail/modify',
                deleteDetailOne: '/outsourceDeductionDetail/delete',
                exportDataPermission: '/outsourceDeductionDetail/exportData',
                export: '/outsourceDeductionExport/export',
                templateDownloadPermission: '/outsourceDeductionDetail/templateDownload',
                uploadSuccessPermission: '/outsourceDeductionDetail/uploadSuccess',
                loadDetail:'/outsourceDeductionDetail/updateFilePath',
                deleteDetail:'/outsourceDeductionDetail/deleteByCode',
                createReceiveBillPermission: '/outsourceDeductionDetail/confirm',
                toBeDeductedPermission:'/outsourceDeductionDetail/toBeDeducted',
                noDeductionsPermission:'/outsourceDeductionDetail/noDeductions',
            };
            return {
                initializeModel: {},
                exportLoading:true,
                isLoading: true,
                api: Api.outsourceDeductionDetail,
                permission: permission,
                newDate:new Date(),
                multipleSelection: [],
                Validate:Validate,
                //查询参数
                searchParam: {
                    regionCode:'',
                    belongOrgCode:'',
                    currentPage: 1,
                    pageSize: 10,
                    code: '',
                    confirmStatus: '',
                    licenseNum: '',
                    deductionType: '',
                    deductionCategories:'',//扣款大类
                    supplierId: '',
                    occurTime: [],
                    occurStartDate: '',
                    occurEndDate: '',
                },
                //返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                buttonClick: {
                    confirmChargeButton: true,
                    uploadDetail: true,
                },
                win:{
                    updateWinTitle:'',
                    updateWinShow:false,
                    updateWinForm:{
                        id:'',
                        code:'',
                        licenseNum:'',
                        feeCreateTime:'',
                        deductionSum:'',
                    },
                    updateWinRules:{
                        licenseNum: [
                            {required: true, message: '车牌号不能为空', trigger: 'blur'},
                            Validate.licenseNumber
                        ],
                        feeCreateTime: [
                            {required: true, message: '费用产生时间不能为空', trigger: 'blur'}
                        ],
                        deductionSum: [
                            {required: false, message: '金额不能为空', trigger: 'blur'},
                            Validate.allMoney
                        ]
                    }
                }
            }
        },
        mounted() {
            //查询表格
            this.searchList();
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
        },
        watch: {
            multipleSelection(val) {
                let _this = this;
                if (val) {
                    _this.buttonClick.confirmChargeButton = val.length < 1;
                    _this.buttonClick.uploadDetail = val.length != 1
                }
            }
        },
        methods: {
            cloneMode() {
                return _.cloneDeep(this.initializeModel)
            },
            resetSearchParam() {
                let _this = this;
                _this.searchParam = _this.cloneMode().searchParam
            },
            searchList() {
                let _this = this;
                _this.isLoading = true;
                if (_this.searchParam.occurTime) {
                    _this.searchParam.occurStartDate = _this.searchParam.occurTime[0];
                    _this.searchParam.occurEndDate = _this.searchParam.occurTime[1];
                }
                Http.get(Api.outsourceDeductionDetail.page, {params: _this.searchParam}, result => {
                    _this.searchResult.result = result.result;
                    _this.searchResult.totalCount = result.totalCount;
                    _this.searchParam.currentPage = result.currentPage;
                    _this.searchParam.pageSize = result.pageSize;
                    _this.isLoading = false;
                },()=>{
                    _this.isLoading = false;
                })
            },
            handleSizeChange(val) {
                let _this = this;
                _this.searchParam.pageSize = val;
                _this.searchList();
            },
            handleCurrentChange(val) {
                let _this = this;
                _this.searchParam.currentPage = val;
                _this.searchList();
                _this.searchParam.currentPage = 1;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            outsourceDeductionExport(){
                let _this = this;
                _this.exportLoading = false;
                Common.excel.reportExcel(Api.outsourceDeductionExport.export,_this.searchParam,"合作扣款导出.xls")
            },
            exportData() {
                Common.excel.downloadExl([], ["车牌号", "费用产生时间","扣款大类", "扣款类别", "金额","备注"], null, '合作车扣款明细表');
            },
            confirmCharge() {
                let _this = this;
                if (_this.multipleSelection) {
                    let ids = [];
                    _this.multipleSelection.forEach(s => {
                        ids.push(s.id)
                    });
                    Http.post(Api.outsourceDeductionDetail.confirm, ids, response => {
                        _this.$message.success("暂缓扣款");
                        _this.searchList()
                    })
                }
            },
            toBeDeducted() {
                let _this = this;
                if (_this.multipleSelection) {
                    let ids = [];
                    _this.multipleSelection.forEach(s => {
                        ids.push(s.id)
                    });
                    Http.post(Api.outsourceDeductionDetail.toBeDeducted, ids, response => {
                        _this.$message.success("转入待扣款");
                        _this.searchList()
                    })
                }
            },
            noDeductions() {
                let _this = this;
                if (_this.multipleSelection) {
                    let ids = [];
                    _this.multipleSelection.forEach(s => {
                        ids.push(s.id)
                    });
                    Http.post(Api.outsourceDeductionDetail.noDeductions, ids, response => {
                        _this.$message.success("自营车不扣款");
                        _this.searchList()
                    })
                }
            },
            uploadSuccess(row) {
                let _this = this;
                let sel = _this.multipleSelection
               if(sel){
                   Http.post(Api.outsourceDeductionDetail.updateFilePath, {"code": sel[0].code,"attachmentUpload":row.result[0]}, response => {
                       _this.searchList()
                   })
               }
            },
            deleteAll(row){
                if(row){
                    let _this = this;
                    let mess = '将删除扣款编号为 : '+row.code+' 的所有扣款记录,是否继续(不包含已扣款)';
                    _this.$confirm(mess, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        Http.post(Api.outsourceDeductionDetail.deleteByCode, {"code": row.code}, result => {
                            _this.searchList();
                        })
                    })
                }
            },
            updateOneWinShow(row){
                this.win.updateWinForm = row;
                this.win.updateWinShow = true;
            },
            updateOneSubmit(formName){
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.outsourceDeductionDetail.modify, _this.win.updateWinForm, response => {
                            _this.win.updateWinShow = false;
                            _this.searchList();
                        })
                    } else {
                        return false;
                    }
                });
            },
            deleteOne(row){
                if(row){
                    let _this = this;
                    let ids = [];
                    ids.push(row.id);
                    _this.$confirm("是否删除扣款", '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        Http.post(Api.outsourceDeductionDetail.deleteOne, ids, result => {
                            _this.searchList();
                        })
                    })
                }
            },
            tableRowClassName({row, rowIndex}) {
                if (row.confirmStatus === Constant.DEDUCTION_STATE.DEDUCTED) {
                    return 'warning-row';
                }
                return '';
            }
        }
    }
</script>

<style>
    .el-table .warning-row {
        background: rgba(211, 220, 228, 0.98);
    }

    .el-table .success-row {
        background: #f97413;
    }
</style>
