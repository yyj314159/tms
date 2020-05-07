<template>
    <el-container id="freeCar">
        <el-header>
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                    <el-breadcrumb-item><i class="el-icon-date"></i> 无车承运管理</el-breadcrumb-item>
                    <el-breadcrumb-item><i class="el-icon-date"></i> 无车承运运单管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-header>
        <el-main>
            <el-tabs type="border-card">
                <el-tab-pane label="无车承运运单查询">
                    <el-header class="content-header" height="">
                        <el-form :model="model.searchParam" label-width="100px" size="small">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="运单号:">
                                        <el-input v-model="model.searchParam.waybillNo" style="width: 215px;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="推送状态:">
                                        <data-dictionary-select v-model="model.searchParam.pushType"  option-name="NO_CAR_DRIVER_STATUS" style="width: 215px;"></data-dictionary-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
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
                        <el-button size="mini"type="primary" @click="waybillCodePush">运单推送</el-button>
                        <el-button size="mini" type="primary" @click="addRecordFlag">补录</el-button>
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="updateDriverCard" :disabled="this.selections.length<1">更新司机身份证信息</el-button>
                        <export-button style="margin: -28px 10px 0px 330px" :href="Api.freeCarrierWaybill.exportExcel" downloadName="无车承运运单" :params="this.model.searchParam">导出</export-button>
                        <el-table class="content-table" element-loading-text="拼命加载中"
                                :data="model.searchResult.result"
                                border fit
                                @selection-change="handlerChange"
                                @on-dbclick="handleRowHandle"
                                highlight-current-row stripe
                                size="small">
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column label="运单号" prop="waybillNo" min-width="160" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showWayBill(scope.row)">{{scope.row.waybillNo}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="三方运单ID" prop="id" min-width="100" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;" @click="showOrgCodeByOilCard(scope.row)">{{scope.row.id}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="商品名称" prop="goodsName" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="商品重量" prop="goodsWeight" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="发货地点" prop="startPlace" min-width="90" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="bottom"
                                        width="200"
                                        trigger="click">
                                        <div style="width: 200px;">
                                            <el-input v-model="remarkContent" placeholder="请输入修改内容"></el-input>
                                            <el-button type="success" icon="el-icon-check" circle
                                                       style="padding: 8px;margin-left: 60px;margin-top: 6px;"
                                                       @click="modifyStartPlace(scope.row.id)"></el-button>
                                            <el-button type="danger" icon="el-icon-close" circle style="padding: 8px;"
                                                       @click="clearPopover"></el-button>
                                        </div>
                                        <a href="javascript:void(0)" slot="reference"
                                           style="color: #606266;width: 50px;height:23px;display: block;">{{scope.row.startPlace}}</a>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column label="卸货地点" prop="toPlace" min-width="90" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-popover
                                        placement="bottom"
                                        width="200"
                                        trigger="click">
                                        <div style="width: 200px;">
                                            <el-input v-model="toPlaceContent" placeholder="请输入修改内容"></el-input>
                                            <el-button type="success" icon="el-icon-check" circle
                                                       style="padding: 8px;margin-left: 60px;margin-top: 6px;"
                                                       @click="modifyToPlace(scope.row.id)"></el-button>
                                            <el-button type="danger" icon="el-icon-close" circle style="padding: 8px;"
                                                       @click="clearPopover"></el-button>
                                        </div>
                                        <a href="javascript:void(0)" slot="reference"
                                           style="color: #606266;width: 50px;height:23px;display: block;">{{scope.row.toPlace}}</a>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column label="发货时间" prop="actualShippingTime" min-width="80" show-overflow-tooltip/>
                            <el-table-column label="卸货时间" prop="receiptTime" min-width="80" show-overflow-tooltip/>
                            <el-table-column label="运费" prop="shippingPrice" min-width="70" show-overflow-tooltip/>
                            <el-table-column label="发货人" prop="send" min-width="100" show-overflow-tooltip/>
                            <el-table-column label="收货人" prop="consignee" min-width="100" show-overflow-tooltip/>
                            <el-table-column label="收货人手机" prop="consigneeTel" min-width="100" show-overflow-tooltip/>
                            <el-table-column label="车牌号" prop="licenseNumber" min-width="100" show-overflow-tooltip/>
                            <el-table-column label="司机身份证" prop="driverCard" min-width="100" show-overflow-tooltip/>
                            <el-table-column label="司机名称" prop="driverName" min-width="100" show-overflow-tooltip/>
                            <el-table-column label="推送状态" prop="pushType" min-width="100" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="scope.row.pushType"
                                                            option-name="NO_CAR_DRIVER_STATUS"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="创建时间" prop="createTime" min-width="100"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="创建人" prop="createUser" min-width="100" show-overflow-tooltip
                                            v-show="false"/>
                            <el-table-column label="修改时间" prop="modifyTime" min-width="100"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="修改人" prop="modifyUser" min-width="100"
                                            show-overflow-tooltip></el-table-column>
                            <el-table-column label="是否补录" prop="addRecordFlag" min-width="100"show-overflow-tooltip>
                                      <template slot-scope="scope">
                                          {{scope.row.addRecordFlag===true?'是':'否'}}
                                      </template>
                            </el-table-column>
                            <el-table-column header-align="center" label="操作" fixed="right" min-width="120"
                                            show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini"
                                            @click="showLogDetail(scope.row)">查看日志详情</el-button>
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
                <el-tab-pane label="G7无车承运运单查询">
                    <el-header class="content-header" height="">
                        <el-form :model="G7Model.G7SearchParam" label-width="100px" size="small">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item label="车牌号:">
                                        <el-input v-model="G7Model.G7SearchParam.licenseNumber"
                                                style="width: 215px;"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="检验状态:">
                                        <data-dictionary-select option-name="G7_CAR_CHECK_STATUS"
                                                                v-model="G7Model.G7SearchParam.checkStatus"/>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="支付进度状态:">
                                        <data-dictionary-select option-name="G7_CAR_CHECK_STATUS"
                                                                v-model="G7Model.G7SearchParam.payComplete"/>
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
                            <el-table-column label="运单号" prop="waybillNo" min-width="140" show-overflow-tooltip/>
                            <el-table-column label="三方运单ID" prop="thirdId" min-width="100" show-overflow-tooltip/>
                            <el-table-column label="商品名称" prop="goodsName" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="商品重量" prop="goodsWeight" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="检验状态" prop="checkStatus" min-width="90" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="String(scope.row.checkStatus)"
                                                            option-name="G7_CAR_CHECK_STATUS"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="错误信息" prop="error" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="货物类型" prop="goodsType" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="业务类型" prop="businessType" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="装货地点" prop="startPlace" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="卸货地点" prop="toPlace" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="装货时间" prop="actualShippingTime" min-width="90" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{new Date(scope.row.actualShippingTime) | moment("YYYY-MM-DD HH:mm:ss")}}
                                </template>
                            </el-table-column>
                            <el-table-column label="卸货时间" prop="receiptTime" min-width="90" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{new Date(scope.row.receiptTime) | moment("YYYY-MM-DD HH:mm:ss")}}
                                </template>
                            </el-table-column>
                            <el-table-column label="车牌号" prop="licenseNumber" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="现金运费" prop="shippingPrice" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="发货人" prop="sender" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="收货人" prop="consignee" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="收货人手机" prop="consigneeTel" min-width="100" show-overflow-tooltip/>
                            <el-table-column label="司机身份证" prop="driverCard" min-width="110" show-overflow-tooltip/>
                            <el-table-column label="支付进度状态" min-width="110">
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="String(scope.row.payComplete)" option-name="G7_CAR_CHECK_STATUS"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="运单组ID" prop="groupId" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="运单描述" prop="description" min-width="90" show-overflow-tooltip/>
                            <el-table-column label="开票状态" prop="billStatus" min-width="90" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="String(scope.row.billStatus)" option-name="G7_CAR_BILL_STATUS"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="创建时间" prop="gmtCreate" min-width="90" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{new Date(scope.row.gmtModified) | moment("YYYY-MM-DD hh:mm:ss")}}
                                </template>
                            </el-table-column>
                            <el-table-column label="更新时间" prop="gmtModified" min-width="90" show-overflow-tooltip>
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
        <FreeCarCarrierPayment v-if="showOilCardByOrg" :visible="showOilCardByOrg" @close="hideOilCardByOrg"
                               :currentRowed="currentRows"/>
        <FreeCarCarrierLog v-if="showLogDetailWin" :visible="showLogDetailWin" @close="hideLogDetail" :currentRowed="currentRows"/>
    </el-container>
</template>
<script>
    import {Api, Common, Http} from 'src/global';
    import DatadictionaryName from '../../../common/select/DatadictionaryName';
    import DataDictionarySelect from "../../../common/select/DataDictionarySelect";
    import FreeCarCarrierPayment from "./FreeCarCarrierPayment";
    import FreeCarCarrierLog from "./FreeCarCarrierLog";

    export default {
        components: {FreeCarCarrierLog, FreeCarCarrierPayment, DataDictionarySelect, DatadictionaryName},
        data() {
            return {
                common: Common,
                initializeModel: {},
                Api:Api,
                currentRows: null,//操作行的数据
                model: {
                    searchParam: {//查询参数
                        currentPage: 1,
                        pageSize: 10,
                        waybillNo: '',
                        pushType:''
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
                        checkStatus:'',
                        payComplete:''
                    },
                    G7FreeCarCarrierDriverResult: {
                        totalCount: 0,
                        result: []
                    },
                },
                showWjyDriverRecordDetail: false,
                selections: [],
                showOilCardByOrg: false,
                showLogDetailWin:false,
                currentRows: null,//操作行的数据,
                permission:{
                    delete:'/freeCarrierWayBill/delete'
                },
                remarkContent:'',
                toPlaceContent:''
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
                Http.get(Api.freeCarrierWaybill.page, {params: vm.model.searchParam}, result => {
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
                Http.post(Api.freeCarrierWaybill.G7CarFreeCarrierPage, vm.G7Model.G7SearchParam, result => {
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
                    Http.post(Api.freeCarrierWaybill.delete, ids, result => {
                        _this.$message.success("删除成功")
                        _this.searchGpsForMainList()
                    })
                })
            },
            showOrgCodeByOilCard(row) {
                this.currentRows = row;
                this.showOilCardByOrg = true;
            },
            hideOilCardByOrg() {
                this.showOilCardByOrg = false;
            },
            showLogDetail(row){
                debugger
                this.currentRows = row;
                this.showLogDetailWin = true;
            },
            hideLogDetail(){
                this.showLogDetailWin = false;
            },
            //更新司机信息
            updateDriverCard(){
                let _this = this;
                var ids = [];
                var pushType=[]
                debugger
                _this.selections.forEach((item) => {
                   ids.push(item.id);
                    pushType.push(item.pushType)
                });
                if(pushType.includes('PUSH_SUCCESS')){
                    return _this.$message.warning("成功状态的不能进行身份证的更改");
                }
                Http.post(Api.freeCarrierWaybill.updateDriverCard,ids,result=>{
                    _this.$message.success("更新成功")
                    _this.searchGpsForMainList()
                })
            },
            modifyStartPlace(){
                let _this = this;
                let ids = [];
                let pushType=[];
                debugger
                _this.selections.forEach(res => {
                    ids.push(res.id);
                    pushType.push(res.pushType);
                });
                if(ids.length<=0){
                    return _this.$message.warning('请勾选选择框');
                }
                if(pushType.includes('PUSH_SUCCESS')){
                    return _this.$message.warning('已推送成功的状态不能修改');
                }
                Http.post(Api.freeCarrierWaybill.modifyStartPlace,{ids:ids,startPlace:this.remarkContent}, result => {
                    document.querySelector("#app").click();
                    this.remarkContent = ''
                    _this.$message.success('修改成功');
                    _this.searchGpsForMainList();
                })
            },
            clearPopover() {
                this.remarkContent = '',
                this.toPlaceContent=''
            },
            modifyToPlace(){
                let _this = this;
                let ids = [];
                let pushType=[];
                debugger
                _this.selections.forEach(res => {
                    ids.push(res.id);
                    pushType.push(res.pushType);
                });
                if(ids.length<=0){
                    return _this.$message.warning('请勾选选择框');
                }
                if(pushType.includes('PUSH_SUCCESS')){
                    return _this.$message.warning('已推送成功的状态不能修改');
                }
                Http.post(Api.freeCarrierWaybill.modifyToPlace,{ids:ids,toPlace:this.toPlaceContent}, result => {
                    document.querySelector("#app").click();
                    this.toPlaceContent = ''
                    _this.$message.success('修改成功');
                    _this.searchGpsForMainList();
                })
            },
            showWayBill(row){
                this.$router.push({ path: '/operation/waybillDetail',query: {code: row.waybillNo}});
            },
            addRecordFlag(){
                let ids=[];
                this.selections.forEach(item=>{
                    ids.push(item.id)
                })
                Http.post(Api.freeCarrierWaybill.addRecordFlag,ids,result=>{
                    this.$message.success('补录成功');
                    this.searchGpsForMainList();
                })
            },
            waybillCodePush(){
                let ids=[];
                this.selections.forEach(item=>{
                    ids.push(item.id)
                })
                Http.post(Api.freeCarrierWaybill.waybillCodePush,ids, result => {
                    this.$message.success('推送成功');
                    this.searchGpsForMainList();
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

