<template>
    <el-container>
        <el-dialog title="查看日志详情" :visible.sync="Visible" width="90%" :top="marginTop" @close="close">
            <el-main class="content-main">
                        <el-table class="content-table" :data="oilCardVehicleResult.result"
                                  element-loading-text="拼命加载中"
                                  border fit>
                            <el-table-column label="日志详请" prop="message" show-overflow-tooltip/>
                            <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip/>
                            <el-table-column label="创建人" prop="createUser"></el-table-column>
                            <el-table-column label="修改时间" prop="modifyTime" show-overflow-tooltip/>
                            <el-table-column label="修改人" prop="modifyUser"></el-table-column>
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
                // currentRows: null,//操作行的数据
                oilCardVehicleForm: {//查询参数
                    currentPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    logId:'',
                },
                oilCardVehicleResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                oilCardConsumerResult:{
                    totalCount: 0,
                    result: []
                },
                oilCardQueryResult:{
                    totalCount: 0,
                    result: []
                },
                searchParams:{
                    pageNo: 0,
                    pageSize: 10,
                },
                multipleSelection: [],
                ids: [],
            }
        },
        created() {
            debugger
            this.oilCardVehicleForm.logId=this.currentRowed.id;
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
            handleCurrentChange(val) {
                let vm = this
                vm.oilCardVehicleForm.pageNo = val
                this.watchQueryList()
            },
            handleSizeChange(val) {
                debugger
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
                Http.get(Api.freeCarrierLog.page, {params: vm.oilCardVehicleForm}, result => {
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
            }
        }
    }
</script>

