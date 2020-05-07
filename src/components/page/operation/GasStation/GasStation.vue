<template xmlns:el-col="http://www.w3.org/1999/html">
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 定点加油</el-breadcrumb-item>
                <el-breadcrumb-item>合作加油站点</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header">
            <el-form label-width="120px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="油站名称:">
                            <gas-station-select v-model="searchParam.id" style="display:block;"></gas-station-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="供应商:">
                            <dictionary-select v-model="searchParam.supplier"
                                               option-name="GAS_STATION" style="display:block;"></dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="城市:" prop="cityCode">
                            <district-select v-model="searchParam.cityCodes" style="display:block;"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float:right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchGasStationList">查询</el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetWinform">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addBlackList"
                       v-permission="'/gasStation/add'">新增
            </el-button>
            <el-button size="mini" type="primary" @click="exportExcelSubmit" style="margin-left: 9px;" icon="el-icon-download"
                       v-permission="'/gasStation/exportData'">导出
            </el-button>
            <el-button v-if="downloadLoading" icon="el-icon-download" v-permission="'/gasStationPrice/templateDownload'" type="primary" size="mini"  @click="exportList">模板下载</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>下载中...</el-button>
            <upload-excel :importUrl="Api.gasStationPrice.upload" @success="uploadSuccess" btn-name="导入"
                          style="display: inline-block; margin-left: 10px;"
                          v-permission="'/gasStationPrice/upload'"></upload-excel>

            <el-table class="content-table" element-loading-text="拼命加载中"
                      :data="searchResult.result"
                      border fit
                      highlight-current-row stripe
                      @selection-change="handleSelectionChange"
                      size="small" :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="加油站名称" prop="name" min-width="280" show-overflow-tooltip></el-table-column>
                <el-table-column label="供应商" prop="supplier" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="GAS_STATION"
                                                :value="scope.row.supplier"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="城市" prop="cityCode" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="详细地址" prop="address" min-width="280" show-overflow-tooltip></el-table-column>
                <el-table-column label="登陆用户名" prop="username" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="电话号码" prop="telePhone" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="供应商网点名称" prop="pushStationInfo.oilsStationName" min-width="280"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="合作油价调整" prop="operationPriceAdjustment" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="外请油价调整" prop="outPriceAdjustment" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建人" prop="createUser" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="createTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="修改人" prop="modifyUser" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column label="修改时间" prop="modifyTime" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" align="center" label="操作" fixed="right" min-width="250"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" size="mini"
                                   @click="maintenancePrice(scope.row)" v-permission="'/gasStation/maintenancePrice'">
                            维护油价
                        </el-button>
                        <el-button type="text" icon="el-icon-edit" size="mini"
                                   @click="modifyBlackList(scope.row)" v-permission="'/gasStation/modify'"></el-button>
                        <el-button type="text" icon="el-icon-delete" size="mini"
                                   @click="deleteList(scope.row)" v-permission="'/gasStation/delete'"></el-button>
                        <el-button type="text" @click="getPrint(scope.row)" v-permission="'/gasStation/print'"><i
                            class="fa fa-qrcode" aria-hidden="true" style="color:#409EFF; cursor: pointer;"></i>
                        </el-button>
                        <el-button type="text" size="mini" @click="resetPwd(scope.row)"
                                   v-permission="'/gasStation/password'">重置密码
                        </el-button>
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
        <el-dialog title="新增加油站信息" :visible.sync="addGasStationWin" width="800px" :before-close="handleClose">
            <el-form inline size="small" :model="addGasStationWinForm" label-width="120px" ref="addGasStationWinForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="加油站名称:" prop="name">
                            <el-input v-model="addGasStationWinForm.name" style="width: 215px"
                                      placeholder="请填写加油站名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供应商:" prop="supplier">
                            <dictionary-select v-model="addGasStationWinForm.supplier"
                                               option-name="GAS_STATION"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="城市:" prop="cityCode">
                            <district-select v-model="addGasStationWinForm.cityCodes"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="详细地址:" prop="address">
                            <el-input type="text" placeholder="请填写地址" style="width: 215px;"
                                      v-model="addGasStationWinForm.address"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户名:" prop="username">
                            <el-input type="text" v-model="addGasStationWinForm.username" style="width: 215px;"
                                      placeholder="请输入用户名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密码:" prop="password">
                            <el-input v-model="addGasStationWinForm.password" style="width: 215px;"
                                      placeholder="请输入密码"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="电话号码:">
                            <el-input v-model="addGasStationWinForm.telePhone" style="width: 215px;"
                                      placeholder="请输入加油站电话"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供应商网点:" prop="supplierWebsiteName">
                            <refueling-supplier-select
                                v-model="addGasStationWinForm.supplierWebsiteName" style="width: 215px;"
                                placeholder="请输入供应商网点"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合作油价调整:" prop="operationPriceAdjustment" :rules="[Validate.required('合作油价调整',true),Validate.allMoney]">
                            <el-input v-model="addGasStationWinForm.operationPriceAdjustment" style="width: 215px;"
                                      placeholder="请输入调整的油价(元)"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="外请油价调整:" prop="outPriceAdjustment" :rules="[Validate.required('外请油价调整',true),Validate.allMoney]">
                            <el-input v-model="addGasStationWinForm.outPriceAdjustment" style="width: 215px;"
                                      placeholder="请输入调整的油价(元)"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="submitBlackList('addGasStationWinForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改加油站信息" :visible.sync="modifyGasStationWin" width="800px" :before-close="handleClose">
            <el-form inline size="small" :model="modifyForm" label-width="120px" ref="modifyForm"
                     :rules="addBaseOilCard">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="加油站名称:" prop="name">
                            <label style="color: dodgerblue;">{{modifyForm.name}}</label>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供应商:" prop="supplier">
                            <dictionary-select v-model="modifyForm.supplier"
                                               option-name="GAS_STATION"></dictionary-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="城市:" prop="cityCode">
                            <district-select v-model="modifyForm.district"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="详细地址:" prop="address">
                            <el-input type="text" placeholder="请填写地址" style="width: 215px;"
                                      v-model="modifyForm.address"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户名:" prop="username">
                            <el-input type="text" v-model="modifyForm.username" style="width: 215px;"
                                      placeholder="请输入用户名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电话号码:">
                            <el-input v-model="modifyForm.telePhone" style="width: 215px;"
                                      placeholder="请输入加油站电话"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商网点:" prop="supplierWebsiteName">
                            <refueling-supplier-select v-model="modifyForm.supplierWebsiteName" style="width: 215px;"
                                                       ref="modifySupplierWebsiteName" placeholder="请输入供应商网点"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合作油价调整:" prop="operationPriceAdjustment" :rules="[Validate.required('油价调整',true),Validate.allMoney]">
                            <el-input v-model="modifyForm.operationPriceAdjustment" style="width: 215px;"
                                      placeholder="请输入调整的油价(元)"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="外请油价调整:" prop="outPriceAdjustment" :rules="[Validate.required('外请油价调整',true),Validate.allMoney]">
                            <el-input v-model="modifyForm.outPriceAdjustment" style="width: 215px;"
                                      placeholder="请输入调整的油价(元)"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancel">取 消</el-button>
                <el-button type="primary" size="small" @click="modifySubmitBlackList('modifyForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!--重置密码win-->
        <el-dialog title="重置密码" :visible.sync="ResetPassWordWin" width="400px">
            <el-form :model="passWordForm" :rules="addBaseOilCard" ref="passWordForm" label-width="100px" size="small"
                     align="center">
                <el-row>
                    <el-form-item label="密码:" prop="password">
                        <el-input v-model="passWordForm.password"/>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="确认密码:" prop="password">
                        <el-input v-model="passWordForm.againPassword" type="password"/>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="ResetPassWordWin = false" size="small">取 消</el-button>
                <el-button type="primary" @click="resetPassWordSubmit('passWordForm')" size="small">确 定</el-button>
            </div>
        </el-dialog>

        <!--打印弹窗-->
        <el-dialog :visible.sync="showPrint" fullscreen :show-close="showClose">
            <slot name="body">
                <h2 style="text-align:center;font-weight:600; margin:50px auto;"><img src="../../../../assets/logo1.png"
                                                                                      alt="logo"
                                                                                      style="display: inline-block; width:100px;">供应链合作加油站点
                </h2>
                <img :src="url" width="500" style="margin: 100px auto 45px; display: block;">
                <el-row style="text-align: right; width:70%;">
                    <el-button v-show="showPrintBtn" @click="printPage" type="primary" size="mini"
                               style="margin-bottom:15px"><i class="fa fa-print"></i>打印
                    </el-button>
                </el-row>
            </slot>
        </el-dialog>
        <GasStationPrice v-if="showOilCardByOrg" :visible="showOilCardByOrg" @close="hideOilCardByOrg"
                         :currentRowed="currentRows">
        </GasStationPrice>
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import {Validate} from 'src/global/validate'
    import QRCode from 'qrcode'
    import GasStationPrice from "./GasStationPrice";
    import {Common} from 'src/global/common'
    import axios from 'axios';

    export default {
        components: {GasStationPrice},
        data() {
            return {
                Api: Api,
                Validate: Validate,
                tableHeight: window.innerHeight>800?480:null,
                downloadLoading: true,
                showPrint: false,
                showClose: true,
                showPrintBtn: true,
                timer: null,
                searchParam: {
                    currentPage: 1,
                    pageSize: 10,
                    id: '',
                    cityCodes: [],
                    supplier: '',
                    cityCode: ''
                },//返回结果
                searchResult: {
                    totalCount: 0,
                    result: []
                },
                showOilCardByOrg: false,
                currentRows: null,//操作行的数据
                modifyGasStationWin: false,
                multipleSelection: [],
                addGasStationWin: false,
                ResetPassWordWin: false,
                addGasStationWinForm: {
                    name: '',
                    supplier: '',
                    address: '',
                    cityCode: '',
                    balancePrice: 0,
                    operationPrice: 0,
                    outPrice: 0,
                    cityCodes: [],
                    username: '',
                    password: '',
                    telePhone: '',
                    supplierWebsiteName: '',
                    operationPriceAdjustment: 0,
                    outPriceAdjustment: 0
                },
                modifyForm: {
                    name: '',
                    supplier: '',
                    address: '',
                    cityCode: '',
                    oilPrice: '',
                    district: [],
                    username: '',
                    telePhone: '',
                    supplierWebsiteName: '',
                    operationPriceAdjustment: '',
                    outPriceAdjustment: ''

                },
                passWordForm: {
                    password: '',
                    againPassword: '',
                    id: ''
                },
                addBaseOilCard: {
                    supplier: [
                        {required: true, message: '请输入关联供应商', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请填写加油站名称', trigger: 'blur'},
                        {min: 1, max: 250, message: '请填写加油站名称', trigger: 'blur'}
                    ],
                    cityCode: [
                        {required: true, message: '请选择城市', trigger: 'blur'},
                        {min: 1, max: 12, message: '请选择城市', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请填写详细地址', trigger: 'blur'},
                        {min: 1, max: 200, message: '请填写详细地址', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请填写密码', trigger: 'blur'},
                        {pattern: /^(\d{6})$/, message: '请输入数字为6位密码!'},
                    ],
                    username: [
                        {required: true, message: '请填写用户名', trigger: 'blur'},
                    ]
                    // supplierWebsiteName: [
                    //     {required: true, message: '请填写供应商网点名称', trigger: 'blur'},
                    // ]
                },
                url: ''
            }
        },
        mounted() {
            this.searchGasStationList();
        },
        methods: {
            //通用
            handleCurrentChange(val) {
                let vm = this
                vm.searchParam.currentPage = val
                this.searchGasStationList()
            },
            hideOilCardByOrg() {
                this.showOilCardByOrg = false;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            handleSizeChange(val) {
                let vm = this
                vm.searchParam.pageSize = val
                this.searchGasStationList()
            },
            searchGasStationList() {
                let vm = this;
                vm.searchParam.cityCode = vm.searchParam.cityCodes[vm.searchParam.cityCodes.length - 1]
                Http.get(Api.gasStation.page, {params: vm.searchParam}, result => {
                    vm.searchResult.result = result.result
                    vm.searchResult.totalCount = result.totalCount
                    vm.searchParam.currentPage = result.currentPage
                    vm.searchParam.pageSize = result.pageSize
                })
            },
            //新增
            addBlackList() {
                this.addGasStationWin = true;
            },
            //新增
            submitBlackList(formName) {
                let vm = this;
                vm.addGasStationWinForm.cityCode = vm.addGasStationWinForm.cityCodes[vm.addGasStationWinForm.cityCodes.length - 1]
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.gasStation.add, vm.addGasStationWinForm, function (res) {
                            vm.searchGasStationList();
                            vm.addGasStationWin = false;
                        })
                    }
                })
            },
            resetWinform() {
                let vm = this;
                vm.searchParam = {
                    currentPage: 1,
                    pageSize: 10,
                    id: '',
                    cardNo: '',
                    supplier: '',
                    orgCode: '',
                    oilPrice: '',
                    cityCodes: [],
                    cityCode: ''
                }
            },
            cancel() {
                this.addGasStationWin = false;
                this.modifyGasStationWin = false
                this.addGasStationWinForm = {
                    name: '',
                    supplier: '',
                    address: '',
                    cityCode: '',
                    cityCodes: [],
                },
                    this.modifyForm = {
                        name: '',
                        supplier: '',
                        address: '',
                        cityCode: '',
                        district: [],
                    }
            },
            handleClose() {
                this.addGasStationWin = false;
                this.modifyGasStationWin = false
                this.cancel();
            },
            deleteList(row) {
                let vm = this
                var ids = []
                ids.push(row.id)
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.gasStation.delete, ids, result => {
                        vm.searchGasStationList()
                    })
                })
            },
            // 通过ID数据回显
            modifyBlackList(row) {
                let vm = this;
                Http.get(Api.gasStation.getDeTailById, {params: {'id': row.id}}, result => {
                    vm.modifyForm = result.result;
                    setTimeout(function () {
                        vm.$refs.modifySupplierWebsiteName.setCurrentRefuelingSupplier(result.result.pushStationInfo);
                    }, 0);
                    vm.modifyGasStationWin = true;
                })
            },
            modifySubmitBlackList(formName) {
                let vm = this;
                vm.modifyForm.cityCode = vm.modifyForm.district[vm.modifyForm.district.length - 1]
                vm.$refs[formName].validate((valid) => {
                    if (valid) {
                        Http.post(Api.gasStation.modify, vm.modifyForm, function (res) {
                            vm.searchGasStationList();
                            vm.modifyGasStationWin = false;
                        })
                    }
                })
            },
            getQrcode(row) {
                let vm = this;
                QRCode.toDataURL(row.id)
                    .then(url => {
                        vm.url = url;
                    })
            },
            resetPwd(row) {
                let vm = this;
                vm.passWordForm.id = row.id;
                vm.ResetPassWordWin = true;
            },
            resetPassWordSubmit(formName) {
                const _this = this;
                this.$refs[formName].validate((valid) => {
                    if (Object.is(this.passWordForm.password, this.passWordForm.againPassword)) {
                        if (valid) {
                            Http.post(Api.gasStation.resetPassWord, _this.passWordForm, result => {
                                _this.$message.success("成功重置密码");
                                _this.ResetPassWordWin = false;//关闭窗口
                                _this.resetPasswordWin();
                            })
                        }
                    } else {
                        _this.$message.warning("两次输入密码不一致,请重新输入");
                    }
                })
            },
            resetPasswordWin() {
                this.passWordForm = {
                    password: '',
                    againPassword: '',
                    id: ''
                }
            },
            getPrint(row) {
                this.showPrint = true;
                this.getQrcode(row);
            },
            printPage() {
                document.getElementsByTagName("html")[0].scrollTop = 0;
                document.getElementsByTagName("html")[0].style.overflowY = "hidden";
                this.showClose = false;
                this.timer = setTimeout(() => {
                    this.showClose = true;
                    clearTimeout(this.timer);
                }, 100);
                this.showPrintBtn = false;
                window.setTimeout(function () {
                    print();
                }, 1);
                window.setTimeout(() => {
                    this.showPrintBtn = true;
                }, 1000);
            },
            maintenancePrice(row) {
                this.currentRows = row
                this.showOilCardByOrg = true;
            },
            uploadSuccess() {
                let vm = this;
                vm.searchGasStationList();
            },
            templateDownload() {
                Common.excel.downloadExl([], ["加油站名称", "结算车价", "合作车油价", "外请车油价",
                    "开始时间", "结束时间"], null, '加油站导入模板');
            },
            exportList(){
                let vm = this;
                vm.downloadLoading = false;
                axios.get(Api.gasStation.templateDownload, {responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '加油导入模板.xls';
                    link.click();
                    vm.downloadLoading = true;
                }).catch(reason => {
                    vm.downloadLoading = true;
                })
            },
            exportExcelSubmit() {
                let _this = this;
                let model = _.cloneDeep(_this.searchParam);
                model.pageSize = 3000;
                model.currentPage = 1;
                Http.get(Api.gasStation.getExcelData, {params: model}, result => {
                    //导出加油站点信息
                    let header = ['加油站点名称', '供应商', '城市', '详细地址', '登陆用户名', '电话号码', '供应商网点名称', '创建人', '创建时间','油品种类','结算车价', '合作车油价', '外请车油价', '开始时间', '结束时间'];
                    let filterVal = ['name', {type:'dictionary','code':'GAS_STATION','name':'supplier'}, 'cityCode', 'address', 'username', 'telePhone', 'supplierWebsiteName', 'createUser', 'createTime',{type:'dictionary','code':'OILS_TYPE','name':'gasStationPrice.oilsType'},'gasStationPrice.balancePrice', 'gasStationPrice.operationPrice', 'gasStationPrice.outPrice', 'gasStationPrice.startTime', 'gasStationPrice.endTime'];
                    Common.excel.downloadExl(result.result, header, filterVal, "合作加油站点导出");
                })
            },
        }
    }
</script>
