<template>
    <el-dialog title="线路回货" :visible.sync="visible" width="90%" :top="marginTop" @close="close">
        <el-header class="content-header" height="">
            <el-form size="small" :model="lineStoreSearchForm" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="客户:">
                            <customer-select v-model="lineStoreSearchForm.customerCode"
                                             style="display:block"></customer-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路名称:">
                            <line-select v-model="lineStoreSearchForm.id" style="display: block"></line-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发城市:" prop="startCity">
                            <district-select v-model="lineStoreSearchForm.startCityArr"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的城市:" prop="endCity">
                            <district-select v-model="lineStoreSearchForm.endCityArr"
                                             style="display:block"></district-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item style="float:right;">
                            <el-button type="success" icon="el-icon-search" @click="lineStoreSearchList">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetLineStoreSearchForm">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-table size="small" class="content-table" :data="lineStoreSearchResult.result"
                      element-loading-text="拼命加载中"
                      border fit
                      highlight-current-row stripe>
                <el-table-column header-align="center" label="客户" prop="line.customer.name"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="线路编码" prop="line.code" min-width="300"></el-table-column>
                <el-table-column header-align="center" label="线路名称" prop="line.name" min-width="250"></el-table-column>
                <el-table-column header-align="center" label="出发城市" prop="line.departStation.city.name"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="经停城市" prop="stopOverCityName"
                                 min-width="240"></el-table-column>
                <el-table-column header-align="center" label="目的城市" prop="line.destStation.city.name"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="出发站点" prop="line.departStation.name"
                                 min-width="150"></el-table-column>
                <el-table-column header-align="center" label="经停站点" prop="stopOverStationName"
                                 min-width="240"></el-table-column>
                <el-table-column header-align="center" label="目的站点" prop="line.destStation.name"
                                 min-width="150"></el-table-column>
                <el-table-column header-align="center" label="审核状态" min-width="80">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="AUDIT_STATUS"
                                                :value="scope.row.line.auditStatus"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="线路类型" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_TYPE"
                                                :value="scope.row.line.lineType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="营运类型" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_OPERATION_TYPE"
                                                :value="scope.row.line.operationType"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="考核方式" min-width="120">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="LINE_EVALUATION_MODE"
                                                :value="scope.row.line.evaluationMode"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="发车时间" prop="line.departTime"
                                 min-width="120"></el-table-column>
                <el-table-column header-align="center" label="时效" min-width="150">
                    <template slot-scope="scope">
                        {{(scope.row.line.timeHour ? scope.row.line.timeHour : 0) + "小时" + (scope.row.timeMin ?
                        scope.row.timeMin : 0) + "分钟"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="则一时效" prop="line.timeZeyiHour" min-width="100">
                    <template slot-scope="scope">
                        {{(scope.row.line.timeZeyiHour ? scope.row.line.timeZeyiHour : 0) + "小时" +
                        (scope.row.timeZeyiMin ? scope.row.timeZeyiMin : 0) + "分钟"}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="里程" prop="line.distance" min-width="80"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="returnGoods(scope.row)">安排回货</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChangeLineStore"
                    @current-change="handleCurrentChangeLineStore"
                    :page-sizes="[10,20,50]"
                    :page-size="lineStoreSearchForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="lineStoreSearchResult.totalCount">
                </el-pagination>
            </div>
        </el-main>
        <!-- 派车弹出框 -->
        <add-send v-if="showAddSend"  :dialogVisible="showAddSend" @close="hideAddSend" :currentRow="rowData.dispatch" :dispatchVehicle="rowData.dispatchVehicle"></add-send>
    </el-dialog>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import addSend from '../myDispatch/AddSendDialog'

    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            currentRow:{
                type: Object,
                default: null
            }
        },
        data() {
            return {
                visible: true,
                showAddSend: false,//派车
                lineStoreSearchForm: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    customerCode: '',
                    //startCity: this.currentRow.dispatch.dispatchLine.endStation.cityCode,
                    startCityArr: [],
                    startCity: '',
                    endCityArr: [],
                    endCity: '',
                    id: ''
                },
                lineStoreSearchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                rowData:{
                    dispatchVehicle: {},
                    dispatch: {}
                }
            }
        },
        components:{
            addSend
        },
        computed: {
            marginTop: function () { //根据不同屏幕高度设置弹框的位置
                if (document.documentElement.clientHeight > 900) {
                    return "15vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "8vh";
                }
            }
        },
        watch:{
            //监听传入的visible参数
            dialogVisible(val){
                if(val){
                    this.visible = val;
                }
            }
        },
        created() {
            this.lineStoreSearchList();
        },
        methods: {
            close() {
                this.visible = false;
                this.$emit('close');
            },
            lineStoreSearchList() {    //查询
                let vm = this;
                this.lineStoreSearchForm.startCity = this.lineStoreSearchForm.startCityArr[1];
                this.lineStoreSearchForm.endCity = this.lineStoreSearchForm.endCityArr[1];
                vm.lineStoreSearchForm.lineId = vm.lineStoreSearchForm.id;
                Http.get(Api.lineCollect.page, {params: vm.lineStoreSearchForm}, result => {
                    this.lineStoreSearchResult.result = result.result;
                    this.lineStoreSearchResult.totalCount = result.totalCount;
                    this.lineStoreSearchResult.currentPage = result.currentPage;
                    this.lineStoreSearchResult.pageSize = result.pageSize;
                })
            },
            resetLineStoreSearchForm() {     //重置
                this.lineStoreSearchForm.customerCode = "";
                this.lineStoreSearchForm.startCityArr = [];
                this.lineStoreSearchForm.startCity = "";
                this.lineStoreSearchForm.endCityArr = [];
                this.lineStoreSearchForm.endCity = "";
                this.lineStoreSearchForm.id = "";
            },
            handleSizeChangeLineStore(val) {
                this.lineStoreSearchForm.pageSize = val;
                this.lineStoreSearchList();
            },
            handleCurrentChangeLineStore(val) {
                this.lineStoreSearchForm.currentPage = val;
                this.lineStoreSearchList();
            },
            returnGoods(row){ //安排回货---------------------------------------
                let vm = this;
                Http.post(Api.dispatch.addDispatchByLineId, {'lineId':row.lineId,'waybillCode':vm.currentRow.code}, result => {
                    vm.rowData.dispatch = result.result;
                    vm.rowData.dispatchVehicle = vm.currentRow.dispatch.dispatchVehicle;
                    vm.showAddSend = true;
                })
            },
            hideAddSend(){ // 关闭回货------------------------------------
                this.showAddSend = false;
                this.close();
            }
        }
    }
</script>
