<template>
    <el-container>
        <el-dialog title="油卡详情" :visible.sync="Visible" width="95%" :top="marginTop" @close="close">
            <el-main class="content-main">
                <el-tabs type="border-card">
                    <el-tab-pane label="油卡使用详情">
                        <el-table class="content-table" :data="oilCardVehicleResult.result"
                                  element-loading-text="拼命加载中"
                                  border fit>
                            <el-table-column label="油卡卡号" prop="cardNo" show-overflow-tooltip width="160px"/>
                            <el-table-column label="余额" prop="balanceAmount" width="80px"></el-table-column>
                            <el-table-column label="车辆编号" prop="vehicleCode" width="100px">
                                <template slot-scope="scope">
                                    <a href="javascript:void(0)" style="color: #409EFF;"
                                       @click="showVehicleDetails(scope.row)">{{scope.row.vehicleCode}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column label="司机名称" prop="belongUser" width="100px"></el-table-column>
                            <!--<el-table-column label="所属机构" prop="belongOrgCode"></el-table-column>-->
                            <el-table-column label="操作类型" prop="operationType" width="140px">
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="scope.row.operationType"
                                                            option-name="OIL_RECORD_TYPE"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作人" prop="operationUser" show-overflow-tooltip></el-table-column>
                            <el-table-column label="操作组织" prop="operationOrgCode" show-overflow-tooltip></el-table-column>
                            <el-table-column label="运单号" prop="waybillCode" show-overflow-tooltip/>
                            <el-table-column label="操作时间" prop="operationTime" show-overflow-tooltip/>
                            <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip/>
                            <el-table-column label="创建人" prop="createUser" show-overflow-tooltip></el-table-column>
                            <el-table-column label="备注" prop="remark" show-overflow-tooltip/>
                            <!--<el-table-column label="修改时间" prop="modifyTime" show-overflow-tooltip/>-->
                            <!--<el-table-column label="修改人" prop="modifyUser"></el-table-column>-->
                        </el-table>
                        <div class="content-pagination">
                            <el-pagination
                                @size-change="handleSizeChangeLineStore"
                                @current-change="handleCurrentChangeLineStore"
                                :page-sizes="[10, 20, 50, 100]"
                                :page-size="oilCardVehicleForm.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="oilCardVehicleResult.totalCount">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="油卡消费使用详情">
                        <el-table class="content-table" :data="oilCardConsumerResult.result"
                                  element-loading-text="拼命加载中"
                                  border fit>
                            <el-table-column label="油卡号" prop="vice_no" min-width="160" show-overflow-tooltip/>
                            <el-table-column label="油卡类型" prop="oil_com" min-width="160" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <dictionary-select-name option-name="G7_OIL_COM"
                                                            :value="scope.row.oil_com"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="卡余额" prop="card_remain" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="现金备付金" prop="reserve_remain" min-width="160" show-overflow-tooltip
                                             v-show="false"></el-table-column>
                        </el-table>
                        <el-table class="content-table" :data="oilCardQueryResult.result"
                                  element-loading-text="拼命加载中"
                                  border fit>
                            <el-table-column label="油卡号" prop="vice_no" min-width="160" show-overflow-tooltip/>
                            <el-table-column label="商品名称" prop="oil_name" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="交易单价（元）" prop="trade_price" min-width="160" show-overflow-tooltip
                                             v-show="false"/>
                            <el-table-column label="交易类型" prop="trade_type_name" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="交易金额（元）" prop="trade_money" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="交易后卡余额（元）" prop="balance" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="加油量（元）" prop="trade_num" min-width="160" show-overflow-tooltip
                                             v-show="false"/>
                            <el-table-column label="油品类型" prop="oil_type_name" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="所属机构" prop="org_id_name" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="现金消费" prop="consume_type_name" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="创建时间" prop="createtime" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="消费地区" prop="trade_place_provice_name" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="消费地点" prop="trade_place" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="消费时间" prop="trade_time" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="积分可用地区" prop="regions_name" min-width="160" show-overflow-tooltip/>
                            <el-table-column label="数据获取时间" prop="fetch_time" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="车牌号" prop="truck_no" min-width="160"
                                             show-overflow-tooltip></el-table-column>
                        </el-table>
                        <div class="content-pagination">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :page-sizes="[10, 20, 50, 100]"
                                :page-size="searchParams.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="oilCardQueryResult.totalCount">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-main>
        </el-dialog>
        <OilCardRecordDetail v-if="showVehicle" :visible="showVehicle" @close="hideVehicle"
                             :currentRow="currentRows"></OilCardRecordDetail>
    </el-container>
</template>
<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    import OilCardRecordDetail from "./OilCardRecordDetail";

    export default {
        components: {OilCardRecordDetail},
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            currentRows: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                Visible: true,
                dialogVisible: false,//内层弹框
                showVehicle: false,
                // currentRows: null,//操作行的数据
                oilCardVehicleForm: {//查询参数
                    currentPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    cardNo: '',
                    vehicleCode: '',
                    cardCompany: '',
                    viceNo: ''
                },
                oilCardVehicleResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                oilCardConsumerResult: {
                    totalCount: 0,
                    result: []
                },
                oilCardQueryResult: {
                    totalCount: 0,
                    result: []
                },
                searchParams: {
                    pageNo: 0,
                    pageSize: 10,
                },
                multipleSelection: [],
                ids: [],
            }
        },
        created() {
            this.oilCardVehicleForm.cardNo = this.currentRows.cardNo;
            this.oilCardVehicleForm.viceNo = this.currentRows.cardNo;
            this.oilCardVehicleForm.cardCompany = this.currentRows.cardCompany;
            this.watchGrantList();
            this.watchOilConsumerList();
            this.watchQueryList();
        },
        computed: {
            marginTop: function () {
                if (document.documentElement.clientHeight > 900) {
                    return "10vh";
                } else if (document.documentElement.clientHeight < 700) {
                    return "2vh";
                } else {
                    return "6vh";
                }
            }
        },
        watch: {
            //监听传入的visible参数
            visible(val) {
                if (val) {
                    this.Visible = val;
                }
            }
        },
        methods: {
            handleCurrentChange(val) {
                let vm = this
                vm.oilCardVehicleForm.pageNo = val
                this.watchQueryList()
            },
            handleSizeChange(val) {
                let vm = this
                vm.oilCardVehicleForm.pageSize = val
                this.watchQueryList()
            },
            close() {
                this.Visible = false;
                this.$emit('close');
            },
            watchGrantList() {
                let vm = this;
                Http.get(Api.oilCardRecord.watchGrantList, {params: vm.oilCardVehicleForm}, result => {
                    this.oilCardVehicleResult.result = result.result;
                    this.oilCardVehicleResult.totalCount = result.totalCount;
                    this.oilCardVehicleResult.currentPage = result.currentPage;
                    this.oilCardVehicleResult.pageSize = result.pageSize;
                })
            },
            watchOilConsumerList() {
                let vm = this;
                Http.get(Api.g7OilType.cardQuerypPage, {params: vm.oilCardVehicleForm}, result => {
                    this.oilCardConsumerResult.result = result.result.data.result;
                    this.oilCardConsumerResult.totalCount = result.result.data.totalCount;
                    this.oilCardConsumerResult.currentPage = result.result.data.pageNo;
                    this.oilCardConsumerResult.pageSize = result.result.data.pageSize;
                })
            },
            watchQueryList() {
                let vm = this;
                Http.get(Api.g7OilType.page, {params: vm.oilCardVehicleForm}, result => {
                    vm.oilCardQueryResult.result = result.result.data.result
                    vm.oilCardQueryResult.totalCount = result.result.data.totalCount
                    vm.oilCardQueryResult.currentPage = result.result.data.pageNo
                    vm.oilCardQueryResult.pageSize = result.result.data.pageSize
                })
            },
            handleSizeChangeLineStore(val) {
                this.oilCardVehicleForm.pageSize = val;
                this.watchGrantList();
            },
            handleCurrentChangeLineStore(val) {
                this.oilCardVehicleForm.currentPage = val;
                this.watchGrantList();
            },
            handleSelectionChangeLineStore(val) {
                this.multipleSelection = val;
            },
            hideVehicle() {
                this.showVehicle = false;
            },
            //根据车辆查询相对应的油卡信息
            showVehicleDetails(row) {
                this.currentRows = row
                this.showVehicle = true;
            }
        }
    }
</script>

