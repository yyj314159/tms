<template>
    <el-container>
        <el-dialog title="围栏异常处理详情" :visible.sync="Visible" width="80%" :top="marginTop" @close="close">
            <el-main class="content-main">
                <el-table class="content-table" :data="exceptionRecordResult.result"
                          element-loading-text="拼命加载中" style="width: 100%"
                          border fit>
                    <el-table-column label="运单号" prop="driverFenceException.waybillCode" header-align="center" width="153" show-overflow-tooltip/>
                    <el-table-column label="操作类型" prop="driverFenceException.operationType" header-align="center" width="200">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="FENCE_OPERATION_TYPE"
                                                    :value="scope.row.driverFenceException.operationType"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column label="异常类型" prop="driverFenceException.exceptionType" header-align="center" width="200">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="FENCE_EXCEPTION_TYPE"
                                                    :value="scope.row.driverFenceException.exceptionType"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column label="处理描述" prop="handleDescription" header-align="center" width="250"></el-table-column>

                    <el-table-column label="处理人" prop="handleUser" header-align="center" width="200"></el-table-column>
                    <el-table-column label="处理异常原因类型" prop="driverFenceException.handleExceptionReason" header-align="center" width="200">
                        <template slot-scope="scope">
                            <dictionary-select-name option-name="FENCE_HANDLE_EXCEPTION_REASON_TYPE"
                                                    :value="scope.row.driverFenceException.handleExceptionReason"></dictionary-select-name>
                        </template>
                    </el-table-column>
                    <el-table-column label="处理意见" prop="handleRemark" header-align="center" width="250"></el-table-column>
                    <el-table-column label="处理时间" prop="driverFenceException.handleTime" header-align="center" width="200"/>

                </el-table>
                <div class="content-pagination">
                    <el-pagination
                        @size-change="handleSizeChangeLineStore"
                        @current-change="handleCurrentChangeLineStore"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="exceptionRecordForm.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="exceptionRecordResult.totalCount">
                    </el-pagination>
                </div>
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
                exceptionRecordForm: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    driverFenceExceptionId: ''
                },
                exceptionRecordResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                multipleSelection: [],
                ids: [],
            }
        },
        created() {
            this.exceptionRecordForm.driverFenceExceptionId = this.currentRows.id;
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
                Http.get(Api.driverFenceExceptionRecord.page, {params: vm.exceptionRecordForm}, result => {
                    this.exceptionRecordResult.result = result.result;
                    this.exceptionRecordResult.result.forEach((item,index) => {
                        if(!(item.driverFenceException)){
                            item.driverFenceException.exceptionType = ''
                            item.driverFenceException.operationType = ''
                        }
                    })
                    this.exceptionRecordResult.totalCount = result.totalCount;
                    this.exceptionRecordResult.currentPage = result.currentPage;
                    this.exceptionRecordResult.pageSize = result.pageSize;
                })
            },
            handleSizeChangeLineStore(val) {
                this.exceptionRecordForm.pageSize = val;
                this.watchGrantList();
            },
            handleCurrentChangeLineStore(val) {
                this.exceptionRecordForm.currentPage = val;
                this.watchGrantList();
            }
        }
    }
</script>

