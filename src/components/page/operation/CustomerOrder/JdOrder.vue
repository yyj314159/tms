<template>
    <el-container>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 营运管理</el-breadcrumb-item>
                <el-breadcrumb-item>客户订单</el-breadcrumb-item>
                <el-breadcrumb-item>京东订单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-header class="content-header" height="">
            <el-form size="small" :model="searchParam" label-width="120px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="是否派车:">
                            <dictionary-select option-name="CERT_COMPLETE_FLAG"
                                               v-model="searchParam.dispatchFlag" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单编号:">
                            <el-input v-model="searchParam.transJobCode" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="京东派车单号:">
                            <el-input v-model="searchParam.transWorkCode" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单状态:">
                            <dictionary-select option-name="JD_CUSTOMER_STATUS"
                                               v-model="searchParam.status" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="始发城市:">
                            <el-input v-model="searchParam.beginCityName" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="到达城市:">
                            <el-input v-model="searchParam.endCityName" style="display:block;"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属区域:">
                            <org-select v-model="searchParam.belongOrgCode" style="display: block;"></org-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车型:">
                            <jd-vehicle-type-select v-model="searchParam.vehicleType" style="display: block"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建开始时间:">
                            <el-date-picker
                                v-model="searchParam.createStartTime"
                                style="width: 100%" :clearable="false" :editable="false"
                                type="date"
                                placeholder="选择日期" :picker-options="pickerStartOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建结束时间:">
                            <el-date-picker
                                v-model="searchParam.createEndTime"
                                style="width: 100%" :clearable="false" :editable="false"
                                type="date"
                                placeholder="选择日期" :picker-options="pickerEndOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item style="float: right" label-width="0">
                            <el-button type="success" icon="el-icon-search" @click="searchParam.currentPage=1;searchList()">查询</el-button>
                            <el-button type="warning" class="fa fa-repeat" @click="resetSearchParam">&nbsp;&nbsp;重置
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="content-main">
            <el-button v-if="exportLoading" icon="el-icon-download" v-permission="'/jdOrder/export'" type="primary"
                       size="mini" style="margin-left: 10px;" @click="exportList">导出
            </el-button>
            <el-table v-loading="isLoading" size="small" class="content-table" :data="searchResult.result"
                      element-loading-text="拼命加载中" border fit highlight-current-row stripe :height="tableHeight"
                      :style="{height:'auto'}">
                <el-table-column header-align="center" label="订单编号" prop="transJobCode" min-width="140">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" style="color:#409EFF;" @click="showJdOrderDetailDialog(scope.row)">{{scope.row.transJobCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="是否派车" prop="dispatchFlag" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="CERT_COMPLETE_FLAG" :value="scope.row.dispatchFlag"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="始发地市名称" prop="beginCityName"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="目的地市名称" prop="endCityName"
                                 min-width="160"></el-table-column>
                <el-table-column header-align="center" label="线路公里数" prop="referenceDistance"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="所属大区" prop="region.name" min-width="140"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column header-align="center" label="所属分区" prop="org.name" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="预计提货时间" prop="requirePickupTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="预计到货时间" prop="requireDeliveryTime" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="箱数" prop="boxCount" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="货物重量/kg" prop="weight"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="货物体积/m³" prop="volume"
                                 min-width="100"></el-table-column>
                <el-table-column header-align="center" label="车型" prop="vehicleTypeName" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="实际车型" prop="actualVehicleTypeName" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="备注" prop="remark" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column header-align="center" label="订单状态" prop="status" min-width="100">
                    <template slot-scope="scope">
                        <dictionary-select-name option-name="JD_CUSTOMER_STATUS" :value="scope.row.status"/>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="则一派车单号" prop="dispatchCode" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="京东派车单号" prop="transWorkCode" min-width="140"></el-table-column>
                <el-table-column header-align="center" label="操作时间" prop="operateTime" min-width="160"></el-table-column>
                <el-table-column header-align="center" label="创建时间" prop="createTime" min-width="160"></el-table-column>
                <el-table-column align="center" label="操作" fixed="right" min-width="300">
                    <template slot-scope="scope">
                        <el-button v-permission="'/jdOrder/cancelOrder'" type="text" size="mini" :disabled="scope.row.status != Constant.CUSTOMER_ORDER_STATUS.NEW_CREATE"
                                   @click="cancelOrder(scope.row)"><i class="fa fa-file-text-o "></i>&nbsp;&nbsp;取消
                        </el-button>
                        <el-button v-permission="'/jdOrder/appoint'" type="text" size="mini"  @click="appoint(scope.row)" :disabled="!(scope.row.status === Constant.CUSTOMER_ORDER_STATUS.NEW_CREATE)||(scope.row.dispatchFlag || scope.row.supplierFlag)"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;指派</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="content-pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="searchParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchResult.totalCount">
                </el-pagination>
            </div>
            <!--取消订单-->
            <el-dialog title="取消订单" :visible.sync="dialogCancelOrderVisible" width="400px">
                <el-form size="small" inline :model="cancelOrderForm" ref="cancelOrderForm"
                         label-width="120px">
                    <el-form-item label="备注:" prop="comments">
                        <el-input v-model="cancelOrderForm.comments"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small" @click="dialogCancelOrderVisible = false;cancelOrderForm.comments = ''">
                        取消
                    </el-button>
                    <el-button size="small" type="primary" @click="cancelSubmit(cancelOrderForm)">确定</el-button>
                </div>
            </el-dialog>
            <!--详情-->
            <el-dialog title="订单详情" :visible.sync="dialogJdOrderDetailVisible" width="90%">
                <el-form inline size="small" :model="jdOrderDetailForm" ref="jdOrderDetailForm" label-width="100px">
                    <el-col :span="6">
                        <el-form-item label="订单编号:">
                            {{jdOrderDetailForm.transJobCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单状态:">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="JD_CUSTOMER_STATUS"
                                                        :value="jdOrderDetailForm.status"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预计提货时间:">
                            {{jdOrderDetailForm.requirePickupTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="预计到货时间:">
                            {{jdOrderDetailForm.requireDeliveryTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="派车:">
                            <template slot-scope="scope">
                                <dictionary-select-name option-name="CERT_COMPLETE_FLAG"
                                                        :value="jdOrderDetailForm.dispatchFlag"></dictionary-select-name>
                            </template>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="则一派车单号:">
                            {{jdOrderDetailForm.dispatchCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="京东派车单号:">
                            {{jdOrderDetailForm.transWorkCode}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属大区:">
                            {{jdOrderDetailForm.region?jdOrderDetailForm.region.name:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属分区:">
                            {{jdOrderDetailForm.org?jdOrderDetailForm.org.name:''}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="箱数:">
                            {{jdOrderDetailForm.boxCount}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货物重量:">
                            {{jdOrderDetailForm.weight}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="货物体积/m³:">
                            {{jdOrderDetailForm.volume}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="车型:">
                            {{jdOrderDetailForm.vehicleTypeName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="实际车型:">
                            {{jdOrderDetailForm.actualVehicleTypeName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发地省名称:">
                            {{jdOrderDetailForm.beginProvinceName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发地市名称:">
                            {{jdOrderDetailForm.beginCityName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="始发地区名称:">
                            {{jdOrderDetailForm.beginCountyName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的地省名称:">
                            {{jdOrderDetailForm.endProvinceName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的地市名称:">
                            {{jdOrderDetailForm.endCityName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="目的地区名称:">
                            {{jdOrderDetailForm.endCountyName}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item header-align="center" label="操作时间"
                                      min-width="100">{{jdOrderDetailForm.operateTime}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线路公里数:">
                            {{jdOrderDetailForm.referenceDistance}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注:">
                            {{jdOrderDetailForm.remark}}
                        </el-form-item>
                    </el-col>
                </el-form>
                <el-table size="small" class="content-table" :data="jdOrderDetailForm.transJobItems" border
                          fit
                          highlight-current-row stripe :height="200" :style="{height:'auto'}">
                    <el-table-column header-align="center" label="京东订单明细编号" prop="transJobItemCode"
                                     min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="京东派车明细编号" prop="transWorkItemCode"
                                     min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="始发市" prop="beginCityName"
                                     min-width="40" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="目的市" prop="endCityName"
                                     min-width="40" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="始发地址" prop="beginAddress"
                                     min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="目的地址" prop="endAddress"
                                     min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="箱数" prop="boxCount"
                                     min-width="40" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="重量" prop="weight"
                                     min-width="40" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="体积" prop="volume"
                                     min-width="40" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="始发联系人" prop="beginPerson"
                                     min-width="40" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="手机" prop="beginMobile"
                                     min-width="60" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="电话" prop="beginPhone"
                                     min-width="60" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="目的联系人" prop="endPerson"
                                     min-width="40" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="手机" prop="endPhone"
                                     min-width="60" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="电话" prop="endMobile"
                                     min-width="60" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="预约提货时间" prop="requirePickupTime"
                                     min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column header-align="center" label="预约到货时间" prop="requireDeliveryTime"
                                     min-width="100" show-overflow-tooltip></el-table-column>
                </el-table>
            </el-dialog>
        </el-main>
        <!--指派-->
        <new-line-select v-if="showAppoint"  :dialogVisible="showAppoint" @close="hideAppoint" :currentRow="currentRow"></new-line-select>
        <!--新供应商系统配套--派车-->
        <send-vehicle v-if="showSendVehicle"  :dialogVisible="showSendVehicle" @close="hideSendVehicle" :currentRow="currentRow" :from="'JD'" :currentLine="currentLine"></send-vehicle>
        <!--新供应商系统配套--指派供应商-->
        <send-supplier v-if="showSendSupplier"  :dialogVisible="showSendSupplier" @close="hideSendSupplier" :currentRow="currentRow" :from="'JD'" :currentLine="currentLine"></send-supplier>
    </el-container>
</template>

<script>
    import {Http, Api, Common, Constant} from 'src/global'
    import {Validate} from 'src/global/validate'
    import sendVehicle from '../myDispatch/ConfirmVehicle'
    import newLineSelect from '../myDispatch/newLineSelect'
    import sendSupplier from './SendSupplier.vue'
    import axios from 'axios'

    export default {
        data() {
            return {
                Common: Common,
                Api: Api,
                Validate: Validate,//校验
                Constant: Constant,
                currentRow: {},
                //新供应商系统配套--派车按钮
                showSendVehicle: false,
                //新供应商系统配套--指派供应商
                showSendSupplier: false,
                //指派
                showAppoint: false,
                currentLine: null,//选中的线路
                //查询
                searchParam: {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    status: '',
                    transJobCode: '',
                    transWorkCode: '',
                    createStartTime: '',
                    createEndTime: '',
                    dispatchFlag: '',
                    beginCityName: '',
                    endCityName: '',
                    belongOrgCode: '',
                    vehicleType: ''
                },
                isLoading: true,
                exportLoading: true,
                searchResult: {//返回结果
                    totalCount: 0,
                    result: []
                },
                cancelOrderForm: {
                    comments: ''
                },
                tableHeight: window.innerHeight > 800 ? 430 : null,
                dialogJdOrderDetailVisible: false,
                dialogCancelOrderVisible: false,
                jdOrderDetailForm: {
                    transJobItems: []
                },
                pickerStartOptions: {
                    disabledDate: (time) => {
                        if (this.searchParam.createEndTime != "") {
                            return time.getTime() > Date.now() || time.getTime() > new Date(this.searchParam.createEndTime).getTime();
                        } else {
                            return time.getTime() > Date.now();
                        }

                    }
                },
                pickerEndOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < new Date(this.searchParam.createStartTime).getTime() || time.getTime() > Date.now();
                    }
                },
            }
        },
        created() {
            this.searchList();
        },
        components: {
            newLineSelect,
            sendVehicle,
            sendSupplier
        },
        methods: {
            resetSearchParam() {//重置参数
                this.searchParam = {//查询参数
                    currentPage: 1,
                    pageSize: 10,
                    status: '',
                    transJobCode: '',
                    transWorkCode: '',
                    createStartTime: '',
                    createEndTime: '',
                    dispatchFlag: '',
                    beginCityName: '',
                    endCityName: '',
                    belongOrgCode: '',
                    vehicleType: ''
                };
            },

            searchList() {//查询
                let vm = this;
                vm.isLoading = true;
                Http.get(Api.jdOrder.page, {params: vm.searchParam}, result => {
                    this.searchResult.result = result.result;
                    this.searchResult.totalCount = result.totalCount;
                    this.searchParam.currentPage = result.currentPage;
                    this.searchParam.pageSize = result.pageSize;
                    vm.isLoading = false;
                }, () => {
                    vm.isLoading = false;
                })
            },

            //取消订单
            cancelOrder(row) {
                this.dialogCancelOrderVisible = true;
                this.cancelOrderForm = row;
            },
            //确定取消订单
            cancelSubmit(row) {
                this.$confirm('确定取消订单吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let cancelOrder = {};
                    cancelOrder.comments = row.comments;
                    cancelOrder.transJobCode = row.transJobCode;
                    Http.post(Api.jdOrder.cancel, cancelOrder, response => {
                        this.$message({
                            message: '取消订单成功!',
                            type: 'success'
                        });
                        this.isLoading = true;
                        this.dialogCancelOrderVisible = false;
                        setTimeout(() => {
                            this.searchList();
                        }, 500)
                    })

                })
            },

            //导出
            exportList() {
                let vm = this;
                vm.exportLoading = false;
                axios.get(Api.jdOrder.export, {
                    params: vm.searchParam,
                    responseType: 'arraybuffer'
                }).then((response) => {
                    let blob = new Blob([response.data], {type: 'application/x-xls'});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    //配置下载的文件名
                    link.download = '京东订单.xls';
                    link.click();
                    vm.exportLoading = true;
                }).catch(reason => {
                    vm.exportLoading = true;
                })
            },

            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.searchList();
            },

            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.searchList();
            },

            //查看详情
            showJdOrderDetailDialog(row) {
                let vm = this;
                Http.get(Api.jdOrder.queryByOrderCode, {params: {'jdOrderCode': row.transJobCode}}, result => {
                    if (result.result) {
                        vm.jdOrderDetailForm = result.result;
                    }
                    vm.dialogJdOrderDetailVisible = true;
                })
            },

            //指派
            appoint(row){
                this.showAppoint = true;
                this.currentRow = _.cloneDeep(row)
            },
            hideAppoint(line,type,row){
                this.showAppoint = false;
                this.currentLine = _.cloneDeep(line)
                if(type==='vehicle'){
                    this.showSendVehicle = true;
                    this.currentRow.customerOrderCode = row.transJobCode;
                }else if(type==='supplier'){
                    this.showSendSupplier = true;
                    this.currentRow.customerOrderCode = row.transJobCode;
                }
            },
            //新派车确认
            hideSendVehicle(){
                this.showSendVehicle = false;
                this.searchList();
            },
            //新指派供应商
            hideSendSupplier(){
                this.showSendSupplier = false;
                this.searchList();
            },
        }
    }
</script>
