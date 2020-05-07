<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>待办事宜</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="大项:">
                            <data-dictionary-select v-model="searchParam.maxType" style="display: block;" size="small" option-name="BACKLOG_MAX_TYPE"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="小项:">
                            <data-dictionary-select v-model="searchParam.miniType" style="display: block;" size="small" option-name="WAYBILL_INVALID"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车牌号:">
                            <vehicle-select v-model="searchParam.vehicleCode" style="display: block;" size="small"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运单编号:">
                            <el-input v-model="searchParam.waybillCode" style="display: block;" size="small"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="处理状态:">
                            <data-dictionary-select v-model="searchParam.status" style="display: block;" option-name="BACK_LOG_STATUS" size="small"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="处理人:">
                            <el-input v-model="searchParam.operationUser" style="display: block;" size="small"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()" >查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading"  size="mini" type="primary" v-permission="'/backlog/export'" @click="backlogExport">导出</el-button>
            <el-button v-else size="mini" type="primary"><i class="fa fa-spinner fa-spin fa-x fa-fw"></i>导出中...</el-button>
            <el-table size="small" class="content-table" :data="searchResult.result" element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChange"
                      border fit highlight-current-row stripe :height="tableHeight" :style="{height:'auto'}">
                <el-table-column type="selection" width="40" fixed="left"/>
                <el-table-column  label="大项" prop="maxType" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.maxType" option-name="BACKLOG_MAX_TYPE"/>
                    </template>
                </el-table-column>
                <el-table-column  label="小项" prop="miniType" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.miniType" option-name="WAYBILL_INVALID"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="运单号" min-width="130">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="车辆编号" prop="vehicleCode" min-width="150"/>
                <el-table-column label="车牌号" prop="vehicleLicenseNumber" min-width="150"/>
                <el-table-column label="金额" prop="sumMoney" min-width="150"/>
                <el-table-column  label="处理状态" prop="status" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.status" option-name="BACK_LOG_STATUS"/>
                    </template>
                </el-table-column>
                <el-table-column label="指派人" prop="designatedPerson" min-width="150"/>
                <el-table-column label="指派时间" prop="designatedTime" min-width="150"/>
                <el-table-column label="处理人" prop="operationUser" min-width="150"/>
                <el-table-column label="确认时间" prop="acknowledgingTime" min-width="150"/>
                <el-table-column label="完成时间" prop="acknowledgingEndTime" min-width="150"/>
                <el-table-column label="处理备注" prop="remark" min-width="150"/>
                <el-table-column label="相关运单号" prop="connectionWaybillCode" min-width="150"/>
                <el-table-column label="相关车牌号" prop="connectionLicenseNumber" min-width="150"/>
                <el-table-column label="创建人" prop="createUser" min-width="150"/>
                <el-table-column label="创建时间" prop="createTime" min-width="150"/>
                <el-table-column label="修改人" prop="modifyUser" min-width="150"/>
                <el-table-column label="修改时间" prop="modifyTime" min-width="150"/>
                <el-table-column header-align="center" label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" v-permission="'/backlog/beingProcessed'" size="mini" @click="beingProcessedShow(scope.row)">确认</el-button>
                        <el-button type="text" v-permission="'/backlog/processed'" size="mini" @click="processedShow(scope.row)">已处理</el-button>
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
        <!--指派确认-->
        <el-dialog size="small" :visible.sync="showBeingProcessedDialog" title="处理确认" width="60%" >
            <el-form :model="beingProcessedModel" ref="transferForm" label-width="150px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="运单编号:">
                            {{ beingProcessedModel.waybillCode }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车牌号:">
                            {{ beingProcessedModel.vehicleLicenseNumber }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="金额:">
                            {{ beingProcessedModel.sumMoney }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="指派处理人:">
                            <user-select v-model="beingProcessedModel.operationUser" style="display: block;" size="small"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="samll" @click="showBeingProcessedDialog = false">取 消</el-button>
                <el-button size="samll" type="primary" @click="beingProcessed">确 定</el-button>
            </span>
        </el-dialog>
        <!--确认-->
        <el-dialog size="small" :visible.sync="showDialog" title="处理确认" width="60%" >
            <el-form :model="processedModel" ref="transferForm" label-width="150px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="运单编号:">
                            {{ processedModel.waybillCode }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="车牌号:">
                            {{ processedModel.vehicleLicenseNumber }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="金额:">
                            {{ processedModel.sumMoney }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="相关运单号:">
                            <el-input v-model="processedModel.connectionWaybillCode" style="display: block;" size="small"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="相关车牌号:">
                            <vehicle-select v-model="processedModel.connectionLicenseNumber" style="display: block;" size="small"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注:">
                            <el-input v-model="processedModel.remark" style="display: block;" size="small"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="samll" @click="showDialog = false">取 消</el-button>
                <el-button size="samll" type="primary" @click="processedSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Http,Api,Constant} from 'src/global'
    import DataDictionarySelect from "../../common/select/DataDictionarySelect";
    import axios from 'axios';

    export default {
        components: {DataDictionarySelect},
        data() {
            return {
                exportLoading: true,
                initializeModel: {},
                Api: Api,
                showBeingProcessedDialog:false,
                showDialog: false,
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    code: "",
                    maxType:"",         /***大项*/
                    miniType:"",        /***小项*/
                    vehicleCode:"",     /***车辆编号*/
                    waybillCode:"",     /***运单编号*/
                    status:"UNDISPOSED",/***处理状态(未处理,处理中,已处理)*/
                    operationUser:""    /***处理人*/
                },
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                beingProcessedModel:{

                },
                processedModel:{
                    waybillCode:'',
                    vehicleCode:'',
                    vehicleLicenseNumber:'',
                    sumMoney:'',
                    connectionWaybillCode:'',
                    connectionLicenseNumber:'',
                    remark:''
                },
                multipleSelection: [],//要操作的行
                tableHeight: window.innerHeight>800?430:null
            }
        },
        created() {
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            this.searchList();
        },
        methods: {
            backlogExport(){
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.backlog.export, {params: vm.searchParam, responseType: 'arraybuffer'}).then((response) => {
                    let blob = new Blob([response.data], { type: 'application/x-xls' });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '待办事项.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },
            cloneModel(){
                return _.cloneDeep(this.initializeModel)
            },
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },
            showWayBill(row){ //运单详情------------------------------------
                // const {href} = this.$router.resolve({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
                // window.open(href, '_blank');
                this.$router.push({path: '/operation/waybillDetail', query: {code: row.waybillCode}});
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            searchList() {//查询
                let _this = this;
                Http.get(Api.backlog.page, {params: _this.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                })
            },
            resetSearchParam() {//重置参数
                let _this = this;
                _this.searchParam = _this.cloneModel().searchParam;
            },
            beingProcessedShow(row){
                let _this = this;
                if(row.status != Constant.BACK_LOG_STATUS.UNDISPOSED){
                    _this.$message.error('已确认,无需重复确认');
                    throw '已确认,无需重复确认';
                }
                Http.get(Api.backlog.queryById, {params: {'id': row.id}}, result => {
                    _this.beingProcessedModel = result.result;
                    _this.showBeingProcessedDialog = true;
                })
            },
            beingProcessed(){//确认
                let _this = this;
                Http.post(Api.backlog.beingProcessed, _this.beingProcessedModel, result => {
                    _this.$message.success('已确认事项！');
                    _this.showBeingProcessedDialog = false;
                    _this.searchList();
                });
            },

            processedShow(row){//已处理
                let _this = this;
                if(row.status == Constant.BACK_LOG_STATUS.UNDISPOSED){
                    _this.$message.error('请先指派处理人');
                    throw '请先指派处理人';
                }
                if(row.status == Constant.BACK_LOG_STATUS.PROCESSED){
                    _this.$message.error('已处理');
                    throw '已处理';
                }
                Http.get(Api.backlog.queryById, {params: {'id': row.id}}, result => {
                    _this.processedModel = result.result;
                    _this.showDialog = true;
                })
            },
            processedSubmit(){
                let _this = this;
                Http.post(Api.backlog.processed, _this.processedModel, result => {
                    _this.$message.success('已完成！');
                    _this.showDialog = false;
                    _this.searchList();
                })
            }
        }
    }
</script>

