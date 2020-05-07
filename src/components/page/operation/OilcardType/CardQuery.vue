<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-date"></i> 油品管理</el-breadcrumb-item>
                <el-breadcrumb-item>卡片查询管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-header class="content-header" height="">
            <el-form :model="model.searchParam" label-width="100px" size="small">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="平台公司:">
                            <data-dictionary-select v-model="model.searchParam.cardCompany" style="display: block;" option-name="OIL_CARD_COMPANY" :clearable="false"></data-dictionary-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="油卡卡号:">
                            <el-input v-model="model.searchParam.viceNo" style="display: block;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="更新时间:">
                            <el-date-picker
                                :default-time="['00:00:00', '23:59:59']"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                style="width:100%;"
                                v-model="model.searchParam.consumerTime"
                                type="daterange"
                                range-separator="-"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :clearable="false">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item style="float:right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="model.searchParam.currentPage=1;searchList()">查询
                            </el-button>
                            <el-button type="warning" icon="el-icon-refresh" @click="resetMainSearchParam">重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-table class="content-table" element-loading-text="拼命加载中"
                      :data="model.searchResult.result"
                      border fit
                      @selection-change="handlerChange"
                      @on-dbclick="handleRowHandle"
                      highlight-current-row stripe
                      size="small">
                <el-table-column label="油卡号" prop="vice_no" min-width="160" show-overflow-tooltip/>
                <el-table-column label="油卡类型" prop="oil_com" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="G7_OIL_COM"
                                                :value="scope.row.oil_com"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="卡余额" prop="card_remain" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="现金备付金" prop="reserve_remain" min-width="160" show-overflow-tooltip v-show="false"></el-table-column>
                <el-table-column label="油量余额" prop="oil_balance" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="积分备付金" prop="point_reserve_total" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="积分余额" prop="point_remain" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="开卡时间" prop="active_time" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="绑定状态" prop="bind_status" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.bind_status === 0 ? '未绑':'已绑'}}
                    </template>
                </el-table-column>
                <el-table-column label="卡状态" prop="status" min-width="160" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="G7_TRADE_TYPE"
                                                :value="scope.row.status"></dictionary-select-name>
                    </template>
                </el-table-column>
                <el-table-column label="日限额" prop="day_top" min-width="160" show-overflow-tooltip/>
                <el-table-column label="次限额" prop="oil_top" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="最新分配时间" prop="assign_time" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="最新消费时间" prop="trade_time" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="更新时间" prop="updatetime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="返利地区" prop="fanli_region_name" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属机构名称" prop="org_id_name" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="油卡类型名称" prop="_oil_com" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="绑定状态名称" prop="bind_status_name" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="卡状态名称" prop="status_name" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column label="撬装账户" prop="gas_money_name" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" prop="remark_work" min-width="100" show-overflow-tooltip ></el-table-column>
                <el-table-column label="车牌号" prop="truck_no" min-width="100" show-overflow-tooltip v-show="false"/>
                <el-table-column label="司机手机号" prop="driver_tel" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="司机姓名" prop="driver_name" min-width="100" show-overflow-tooltip></el-table-column>
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
                initializeModel: {},
                currentRows: null,//操作行的数据
                model: {
                    searchParam: {//查询参数
                        pageNo: 0,
                        pageSize: 10,
                        viceNo:'',
                        truckNo:'',
                        qzDrivername:'',
                        oilType:'',
                        tradeType:'',
                        consumerTime: [Common.date.dateFormat(new Date(),"YYYY-MM-01 00:00:00"),Common.date.dateFormat(new Date(), "YYYY-MM-DD 23:59:59")],
                        updatetimeGe:undefined,
                        updatetimeLe:undefined,
                        cardCompany:'MA_AN_SHAN'
                    },
                    searchResult: {
                        totalCount: 0,
                        result: [],
                    },

                },
                showWjyDriverRecordDetail: false,
                selections: [],
            }
        },
        mounted() { //立即执行
            //拷贝一个 model 用于重置(无数据)
            this.initializeModel = _.cloneDeep(this._data);
            this.searchList();
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
            searchList() {//main 查询
                let vm = this;
                if (vm.model.searchParam.consumerTime.length>0) {
                    vm.model.searchParam.updatetimeGe = this.model.searchParam.consumerTime[0];
                    vm.model.searchParam.updatetimeLe = this.model.searchParam.consumerTime[1];
                }
                Http.get(Api.g7OilType.cardQuerypPage, {params: vm.model.searchParam}, result => {
                    vm.model.searchResult.result =result.result.data.result
                    vm.model.searchResult.totalCount = result.result.data.totalCount
                    vm.model.searchParam.currentPage = result.result.data.pageNo
                    vm.model.searchParam.pageSize = result.result.data.pageSize
                })
            },
            resetMainSearchParam() {
                this.model.searchParam = this.cloneMode().model.searchParam
                this.model.searchParam.consumerTime=[];
            },
            //table
            handlerChange(rows) { //选中时触发
                this.selections = rows
            },
            handleCurrentChange(val) {
                let vm = this
                vm.model.searchParam.pageNo = val
                this.searchList()
            },
            handleSizeChange(val) {
                let vm = this
                vm.model.searchParam.pageSize = val
                this.searchList()
            },
            handleRowHandle(row) {
                this.detailsGpsWinShow(row);
            },
        }
    }
</script>
