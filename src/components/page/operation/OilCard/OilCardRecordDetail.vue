<template>
    <el-dialog title="车辆油卡详情" :visible.sync="Visible" width="90%" :top="marginTop" @close="close">
        <el-header class="content-header" height="">
            <el-form size="small" :model="oilCardVehicleForm" label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="开始时间:">
                            <el-date-picker
                                style="width: 215px;"
                                v-model="oilCardVehicleForm.startTime"
                                type="date"
                                placeholder="选择日期时间"
                                value-format="yyyy-MM-dd 00:00:00">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="结束时间:" prop="startCity">
                            <el-date-picker
                                style="width: 215px;"
                                v-model="oilCardVehicleForm.endTime"
                                type="date"
                                value-format="yyyy-MM-dd 23:59:59"
                                placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float:right;">
                            <el-button type="success" icon="el-icon-search" @click="lineStoreSearchList">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetLineStoreSearchForm">&nbsp;&nbsp;重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-table size="small" class="content-table" :data="oilCardVehicleResult.result"
                      element-loading-text="拼命加载中"
                      @selection-change="handleSelectionChangeLineStore"
                      border fit
                      ref="multipleTable"
                      highlight-current-row stripe>
                <el-table-column label="卡号" prop="cardNo" width="150px;"></el-table-column>
                <el-table-column label="油卡供应商" prop="supplier">
                    <template slot-scope="scope">
                        <dictionary-select-name :value="scope.row.supplier"
                                                option-name="OIL_CARD_SUPPLIER"/>
                    </template>
                </el-table-column>
                <el-table-column label="组织分区" prop="orgCode"></el-table-column>
                <el-table-column label="卡号余额" prop="balanceAmount"></el-table-column>
                <el-table-column label="创建人" prop="createUser"></el-table-column>

                <el-table-column label="创建时间" prop="createTime" width="150px;"></el-table-column>
                <!--<el-table-column label="状态" prop="status">-->
                <!--<template slot-scope="scope">-->
                <!--<dictionary-select-name option-name="EQUIPMENT_STATUS"-->
                <!--:value="scope.row.status"></dictionary-select-name>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="修改人" prop="modifyUser"></el-table-column>
                <el-table-column label="修改时间" prop="modifyTime" width="150px;"></el-table-column>
                <el-table-column label="备注" prop="remark" show-overflow-tooltip/>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChangeLineStore"
                    @current-change="handleCurrentChangeLineStore"
                    :page-sizes="[10]"
                    :page-size="oilCardVehicleForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="oilCardVehicleResult.totalCount">
                </el-pagination>
            </div>
        </el-main>
    </el-dialog>
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
            currentRow: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                Visible: true,
                dialogVisible: false,//内层弹框
                oilCardVehicleForm: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    startTime: '',
                    endTime: '',
                    vehicleCode: ''
                },
                oilCardVehicleResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                ids: [],
            }
        },
        created() {
            this.oilCardVehicleForm.vehicleCode = this.currentRow.vehicleCode;
            this.lineStoreSearchList();
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
            lineStoreSearchList() {    //查询
                let vm = this;
                if (vm.oilCardVehicleForm.startTime && vm.oilCardVehicleForm.endTime) {
                    if (vm.oilCardVehicleForm.startTime > vm.oilCardVehicleForm.endTime) {
                        this.$message("开始时间不能大于结束时间");
                    } else {
                        Http.get(Api.oilCard.showOilCardByVehicle, {params: vm.oilCardVehicleForm}, result => {
                            this.oilCardVehicleResult.result = result.result;
                            this.oilCardVehicleResult.totalCount = result.totalCount;
                            this.oilCardVehicleResult.currentPage = result.currentPage;
                            this.oilCardVehicleResult.pageSize = result.pageSize;
                        })
                    }
                } else {
                    Http.get(Api.oilCard.showOilCardByVehicle, {params: vm.oilCardVehicleForm}, result => {
                        this.oilCardVehicleResult.result = result.result;
                        this.oilCardVehicleResult.totalCount = result.totalCount;
                        this.oilCardVehicleResult.currentPage = result.currentPage;
                        this.oilCardVehicleResult.pageSize = result.pageSize;
                    })
                }
            },
            resetLineStoreSearchForm() {     //重置
                this.oilCardVehicleForm.startTime = "";
                this.oilCardVehicleForm.endTime = "";
            },
            handleSizeChangeLineStore(val) {
                this.oilCardVehicleForm.pageSize = val;
                this.lineStoreSearchList();
            },
            handleCurrentChangeLineStore(val) {
                this.oilCardVehicleForm.currentPage = val;
                this.lineStoreSearchList();
            },
            handleSelectionChangeLineStore(val) {
                this.multipleSelection = val;
            }
        }
    }
</script>
