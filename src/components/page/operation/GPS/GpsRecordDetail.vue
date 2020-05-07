<template>
    <el-container>
        <el-dialog title="Gps详情" :visible.sync="Visible" width="90%" :top="marginTop" @close="close">
            <el-main class="content-main">
                <el-table class="content-table" :data="gpsVehicleResult.result"
                          element-loading-text="拼命加载中"
                          border fit>
                    <el-table-column label="Gps设备号" prop="gpsCode" show-overflow-tooltip/>
                    <el-table-column label="车辆编号" prop="vehicleCode">
                        <!--<template slot-scope="scope">

                            <a href="javascript:void(0)" style="color: #409EFF;" @click="showVehicleDetails(scope.row)">{{scope.row.vehicleCode}}</a>
                        </template>-->
                    </el-table-column>
                    <el-table-column label="司机名称" prop="driver.name"></el-table-column>
                    <!--<el-table-column label="所属机构" prop="belongOrgCode"></el-table-column>-->
                    <el-table-column label="操作类型" prop="operationType">
                        <template slot-scope="scope">
                            <dictionary-select-name :value="scope.row.operationType"
                                                    option-name="GPS_RECORD_TYPE"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人" prop="operationUser"></el-table-column>
                    <el-table-column label="操作组织" prop="operationOrgCode"></el-table-column>
                    <el-table-column label="运单号" prop="waybillCode" width="150px;"/>
                    <el-table-column label="操作时间" prop="operationDate" show-overflow-tooltip/>
                    <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip/>
                    <el-table-column label="创建人" prop="createUser"></el-table-column>
                    <el-table-column label="备注" prop="remark"show-overflow-tooltip/>
                    <!--<el-table-column label="修改时间" prop="modifyTime" show-overflow-tooltip/>-->
                    <!--<el-table-column label="修改人" prop="modifyUser"></el-table-column>-->
                </el-table>
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChangeLineStore"
                        @current-change="handleCurrentChangeLineStore"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="gpsVehicleForm.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="gpsVehicleResult.totalCount">
                    </el-pagination>
                </div>
            </el-main>
        </el-dialog>
        <!--<OilCardRecordDetail v-if="showVehicle" :visible="showVehicle" @close="hideVehicle"
                             :currentRow="currentRows"></OilCardRecordDetail>-->
    </el-container>
</template>

<script>
    import {Http} from 'src/global/http'
    import {Api} from 'src/global/api'
    /*import OilCardRecordDetail from "./OilCardRecordDetail";*/

    export default {
        components: {/*OilCardRecordDetail*/},
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
                gpsVehicleForm: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    gpsCode: '',
                    vehicleCode: ''
                },
                gpsVehicleResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                ids: [],
            }
        },
        created() {
            this.gpsVehicleForm.gpsCode = this.currentRows.code;
            this.watchGrantList();
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
                Http.get(Api.gpsSendOut.page, {params: vm.gpsVehicleForm}, result => {
                    this.gpsVehicleResult.result = result.result;
                    this.gpsVehicleResult.totalCount = result.totalCount;
                    this.gpsVehicleResult.currentPage = result.currentPage;
                    this.gpsVehicleResult.pageSize = result.pageSize;
                })
            },
            handleSizeChangeLineStore(val) {
                this.gpsVehicleForm.pageSize = val;
                this.watchGrantList();
            },
            handleCurrentChangeLineStore(val) {
                this.gpsVehicleForm.currentPage = val;
                this.watchGrantList();
            },
            handleSelectionChangeLineStore(val) {
                this.multipleSelection = val;
            },
            hideVehicle() {
                this.showVehicle = false;
            },
            //根据车辆查询相对应的gps信息
            showVehicleDetails(row) {
                this.currentRows = row
                this.showVehicle = true;
            }
        }
    }
</script>

