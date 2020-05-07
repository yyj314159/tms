<template>
    <el-container id="freeCar">
        <el-header>
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                    <el-breadcrumb-item><i class="el-icon-date"></i> 无车承运管理</el-breadcrumb-item>
                    <el-breadcrumb-item><i class="el-icon-date"></i> 无车承运收款人管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-header>
        <el-main>
            <el-tabs type="border-card">
                <el-tab-pane label="无车承运收款人查询">
                    <el-header class="content-header" height="">
                        <el-form :model="model.searchParam" label-width="100px" size="small">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="银行卡号:">
                                        <el-input v-model="model.searchParam.bankCardNumber" style="display: block;"></el-input>
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
                        <el-table class="content-table" element-loading-text="拼命加载中"
                                :data="model.searchResult.result"
                                border fit
                                @selection-change="handlerChange"
                                @on-dbclick="handleRowHandle"
                                highlight-current-row stripe
                                size="small">
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column label="开户银行" prop="bankName" min-width="192" show-overflow-tooltip/>
                            <el-table-column label="银行卡号" prop="bankCardNumber" min-width="192"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="收款人姓名" prop="payeeName" min-width="192" show-overflow-tooltip
                                            v-show="false"/>
                            <el-table-column label="推送状态" prop="status" min-width="192">
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="scope.row.status"
                                                            option-name="NO_CAR_DRIVER_STATUS"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="创建时间" prop="createTime" min-width="192"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="创建人" prop="createUser" min-width="192" show-overflow-tooltip
                                            v-show="false"/>
                            <el-table-column label="修改时间" prop="modifyTime" min-width="192"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="修改人" prop="modifyUser" min-width="192"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column header-align="center" label="操作" fixed="right" min-width="192"
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
                    </el-main>
                </el-tab-pane>
                <el-tab-pane label="G7无车承运收款人查询">
                    <el-header class="content-header" height="">
                        <el-form :model="G7Model.G7SearchParam" label-width="100px" size="small">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="银行卡号:">
                                        <el-input v-model="G7Model.G7SearchParam.bankCardNumber"
                                                style="display: block;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="18">
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
                            <el-table-column label="开户银行" prop="bankName" min-width="265" show-overflow-tooltip/>
                            <el-table-column label="银行卡号" prop="bankCardNumber" min-width="265"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="收款人姓名" prop="payeeName" min-width="265"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="收款人电话" prop="payeeMobile" min-width="265"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="创建时间" prop="gmtCreate" min-width="265" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{new Date(scope.row.gmtModified) | moment("YYYY-MM-DD hh:mm:ss")}}
                                </template>
                            </el-table-column>
                            <el-table-column label="更新时间" prop="gmtModified" min-width="265" show-overflow-tooltip>
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
                        bankCardNumber: '',
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
                        bankCardNumber: '',
                    },
                    G7FreeCarCarrierDriverResult: {
                        totalCount: 0,
                        result: []
                    },
                },
                showWjyDriverRecordDetail: false,
                selections: [],
                permission:{
                    delete:'/freeCarrierPayee/delete'
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
                Http.get(Api.freeCarrierPayee.page, {params: vm.model.searchParam}, result => {
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
                Http.post(Api.freeCarrierPayee.G7CarFreeCarrierPage, vm.G7Model.G7SearchParam, result => {
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
            deleteList(row){
                let _this = this;
                var ids = [];
                ids.push(row.id);
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    Http.post(Api.freeCarrierPayee.delete, ids, result => {
                        _this.$message.success("删除成功")
                        _this.searchGpsForMainList()
                    })
                })
            },
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
