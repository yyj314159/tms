<template>
    <el-container>
        <el-dialog title="费用详情" :visible.sync="Visible" width="90%" :top="marginTop" @close="close">
            <el-main class="content-main">
                <el-tabs type="border-card" id="freeCar">
                    <el-tab-pane label="运单费用详情">
                        <el-table class="content-table" :data="oilCardVehicleResult.result"
                                  element-loading-text="拼命加载中"
                                  border fit>
                            <el-table-column label="开户行" prop="bankName" show-overflow-tooltip/>
                            <el-table-column label="银行卡号" prop="bankCardNumber" show-overflow-tooltip></el-table-column>
                            <el-table-column label="收款人名字" prop="payeeName"></el-table-column>
                            <el-table-column label="收款人电话" prop="payeeMobile"></el-table-column>
                            <el-table-column label="支付金额" prop="payCost"></el-table-column>
                            <el-table-column label="支付类型" prop="payType">
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="String(scope.row.payType)"
                                                            option-name="G7_CAR_PAY_TYPE"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="推送状态" prop="pushType">
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="String(scope.row.pushType)"
                                                            option-name="NO_CAR_DRIVER_STATUS"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="支付ID" prop="payId" show-overflow-tooltip/>
                            <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip/>
                            <el-table-column label="创建人" prop="createUser"show-overflow-tooltip/>
                            <el-table-column label="修改时间" prop="modifyTime" show-overflow-tooltip/>
                            <el-table-column label="修改人" prop="modifyUser"show-overflow-tooltip/>
                            <el-table-column header-align="center" label="操作" fixed="right" min-width="100"
                                             show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-button type="text" size="mini"
                                               @click="pushFee(scope.row)">推送费用</el-button>
                                </template>
                            </el-table-column>
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
                    <el-tab-pane label="G7运单费用详情">
                        <el-table class="content-table" :data="oilCardQueryResult.result"
                                  element-loading-text="拼命加载中"
                                  border fit>
                            <el-table-column label="收款人姓名" min-width="160" show-overflow-tooltip prop="payeeName">
                            </el-table-column>
                            <el-table-column label="交易类型" min-width="160" show-overflow-tooltip prop="payType">
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="String(scope.row.payType)"
                                                            option-name="G7_CAR_PAY_TYPE"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="银行卡号" min-width="160" show-overflow-tooltip prop="bankCardNumber">
                            </el-table-column>
                            <el-table-column label="现金支付类型" prop="additionalPayType" min-width="160"
                                             show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="String(scope.row.additionalPayType)"
                                                            option-name="G7_CAR_PAY_TYPE"></dictionary-select-name>
                                </template>
                            </el-table-column>
                            <el-table-column label="支付开始时间" prop="payStartTime" min-width="160" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{new Date(scope.row.payStartTime) | moment("YYYY-MM-DD hh:mm:ss")}}
                                </template>
                            </el-table-column>
                            <el-table-column label="支付结束时间" prop="payEndTime" min-width="160" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{new Date(scope.row.payEndTime) | moment("YYYY-MM-DD hh:mm:ss")}}
                                </template>
                            </el-table-column>
                            <el-table-column label="开户银行" prop="bankName" min-width="160" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="收款人电话" prop="payeeMobile" min-width="160" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="支付金额（分）" prop="payCost" min-width="160" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="支付失败原因" prop="error" min-width="160" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column label="支付状态" prop="payList.payStatus" min-width="160"
                                             show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <dictionary-select-name :value="String(scope.row.payStatus)"
                                                            option-name="G7_CAR_PAY_TYPE"></dictionary-select-name>
                                </template>
                            </el-table-column>
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
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'

    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            currentRowed: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                Visible: true,
                dialogVisible: false,//内层弹框
                showVehicle: false,
                // currentRowed: null,//操作行的数据
                oilCardVehicleForm: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    id: '',
                    payType:'',
                    payId:''
                },
                oilCardVehicleResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                ids: [],
                oilCardQueryResult: {
                    totalCount: 0,
                    result: [],
                    payeeName: '',

                },
                searchParams: {
                    pageNo: 0,
                    pageSize: 10,
                    currentPage: 1
                },
            }
        },
        created() {
            this.oilCardVehicleForm.id = this.currentRowed.id;
            this.watchGrantList();
            this.watchOilConsumerList();
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
            close() {
                this.Visible = false;
                this.$emit('close');
            },
            watchGrantList() {
                let vm = this;
                Http.get(Api.freeCarrierPayment.page, {params: vm.oilCardVehicleForm}, result => {
                    this.oilCardVehicleResult.result = result.result;
                    this.oilCardVehicleResult.totalCount = result.totalCount;
                    this.oilCardVehicleResult.currentPage = result.currentPage;
                    this.oilCardVehicleResult.pageSize = result.pageSize;
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
                this.currentRowed = row
                this.showVehicle = true;
            },
            watchOilConsumerList() {
                let vm = this;
                debugger
                Http.post(Api.freeCarrierPayment.G7CarFreeCarrierPage, vm.oilCardVehicleForm, result => {
                    debugger
                    if (result.result[0].payList) {
                        this.oilCardQueryResult.result = result.result[0].payList;
                        this.oilCardQueryResult.totalCount = result.result[0].payList.length;
                        this.oilCardQueryResult.currentPage = 1;
                        this.oilCardQueryResult.pageSize = 10;
                    }
                })
            },
            handleCurrentChange(val) {
                let vm = this
                vm.searchParams.currentPage = val
                this.watchOilConsumerList()
            },
            handleSizeChange(val) {
                let vm = this
                vm.searchParams.pageSize = val
                this.watchOilConsumerList()
            },
            pushFee(row){
                debugger
                let vm=this;
                if(row.pushType.includes('PUSH_SUCCESS')){
                    return this.$message.warning('成功的不允许推送');
                }
                vm.oilCardVehicleForm.payType=row.payType;
                vm.oilCardVehicleForm.payId=row.payId;
                Http.post(Api.freeCarrierPayment.pushFee, vm.oilCardVehicleForm,result=>{
                    vm.oilCardVehicleForm.pushType=''
                    this.watchGrantList();
                })
            }
        }
    }
</script>
<style>
    #freeCar.el-tabs {
        width: 100%;
    }
</style>

